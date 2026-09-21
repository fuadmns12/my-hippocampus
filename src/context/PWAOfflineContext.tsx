import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { safeStorage } from "../utils/safeStorage";

const PWA_OFFLINE_STORAGE_KEY = "mate_pwa_offline_confirmed";

export interface PWAOfflineContextType {
  isOfflineEnabled: boolean;
  isRegistered: boolean;
  isProcessing: boolean;
  showConfirmModal: boolean;
  needRefresh: boolean;
  isCheckingUpdate: boolean;
  updateMessage: string | null;
  lastCheckedTime: string | null;
  requestEnableOffline: () => void;
  confirmEnableOffline: () => Promise<void>;
  cancelEnableOffline: () => void;
  disableOffline: () => Promise<void>;
  checkForUpdate: () => Promise<boolean>;
  applyUpdate: () => void;
  dismissUpdateNotification: () => void;
}

const PWAOfflineContext = createContext<PWAOfflineContextType | null>(null);

export const PWAOfflineProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOfflineEnabled, setIsOfflineEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return safeStorage.getItem(PWA_OFFLINE_STORAGE_KEY) === "true";
  });
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // Update handler states
  const [needRefresh, setNeedRefresh] = useState<boolean>(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState<boolean>(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [lastCheckedTime, setLastCheckedTime] = useState<string | null>(null);

  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const userRequestedReloadRef = useRef<boolean>(false);

  // Setup service worker registration and listeners
  const setupRegistrationListeners = useCallback((reg: ServiceWorkerRegistration) => {
    registrationRef.current = reg;

    // 1. If there is already a waiting worker, a new update is ready!
    if (reg.waiting) {
      setNeedRefresh(true);
    }

    // 2. Listen for new workers being installed
    reg.addEventListener("updatefound", () => {
      const newWorker = reg.installing;
      if (!newWorker) return;

      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed") {
          // If navigator.serviceWorker.controller is active, this is an update!
          if (navigator.serviceWorker.controller) {
            setNeedRefresh(true);
            setUpdateMessage("Versi baru aplikasi telah diunduh dan siap digunakan.");
          }
        }
      });
    });
  }, []);

  // Check initial service worker status on mount
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let isMounted = true;

    const checkServiceWorker = async () => {
      try {
        const storedPref = localStorage.getItem(PWA_OFFLINE_STORAGE_KEY);

        if (storedPref === "true") {
          // User previously enabled offline PWA
          try {
            const reg = await navigator.serviceWorker.register("/sw.js", {
              scope: "/",
            });
            if (isMounted) {
              setIsRegistered(Boolean(reg));
              setIsOfflineEnabled(true);
              setupRegistrationListeners(reg);
            }
          } catch (err) {
            console.warn("SW registration error:", err);
            if (isMounted) setIsRegistered(false);
          }
        } else {
          // User prefers Online Saja (no offline caching)
          try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            if (registrations && registrations.length > 0) {
              for (const r of registrations) {
                await r.unregister().catch(() => {});
              }
            }
            if (isMounted) {
              setIsRegistered(false);
              setIsOfflineEnabled(false);
            }
          } catch (err) {
            console.warn("Error unregistering SW:", err);
          }
        }
      } catch (outerErr) {
        console.warn("ServiceWorker check skipped:", outerErr);
      }
    };

    checkServiceWorker().catch(() => {});

    // Listen to controllerchange: reload cleanly if user approved update
    const handleControllerChange = () => {
      if (userRequestedReloadRef.current) {
        window.location.reload();
      }
    };
    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    // Periodic & Event-driven update checking (when tab regains focus or online)
    const handleFocusOrOnline = () => {
      if (navigator.onLine && registrationRef.current) {
        registrationRef.current.update().catch(() => {});
      }
    };
    window.addEventListener("focus", handleFocusOrOnline);
    window.addEventListener("online", handleFocusOrOnline);

    return () => {
      isMounted = false;
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
      window.removeEventListener("focus", handleFocusOrOnline);
      window.removeEventListener("online", handleFocusOrOnline);
    };
  }, [setupRegistrationListeners]);

  const requestEnableOffline = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  const cancelEnableOffline = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  const confirmEnableOffline = useCallback(async () => {
    setIsProcessing(true);
    setShowConfirmModal(false);
    try {
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        setIsRegistered(Boolean(reg));
        setIsOfflineEnabled(true);
        safeStorage.setItem(PWA_OFFLINE_STORAGE_KEY, "true");
        setupRegistrationListeners(reg);
      }
    } catch (err) {
      console.warn("Gagal mengaktifkan mode offline:", err);
    } finally {
      setIsProcessing(false);
    }
  }, [setupRegistrationListeners]);

  const disableOffline = useCallback(async () => {
    setIsProcessing(true);
    try {
      if (typeof window !== "undefined") {
        safeStorage.setItem(PWA_OFFLINE_STORAGE_KEY, "false");

        // Unregister service worker
        if ("serviceWorker" in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const reg of registrations) {
            await reg.unregister();
          }
        }

        // Clear cache storage
        if ("caches" in window) {
          const keys = await caches.keys();
          for (const key of keys) {
            await caches.delete(key);
          }
        }

        setIsRegistered(false);
        setIsOfflineEnabled(false);
        setNeedRefresh(false);
        registrationRef.current = null;
      }
    } catch (err) {
      console.error("Gagal menghapus cache offline:", err);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Manual check for updates (invoked from Settings)
  const checkForUpdate = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;

    if (!navigator.onLine) {
      setUpdateMessage("Perangkat sedang offline. Hubungkan ke internet untuk memeriksa pembaruan.");
      return false;
    }

    if (!("serviceWorker" in navigator)) {
      setUpdateMessage("Peramban ini tidak mendukung Service Worker.");
      return false;
    }

    setIsCheckingUpdate(true);
    setUpdateMessage(null);

    try {
      const reg = registrationRef.current || (await navigator.serviceWorker.getRegistration());
      if (!reg) {
        setUpdateMessage("Mode offline belum diaktifkan. Aktifkan mode offline untuk mendapatkan pembaruan otomatis.");
        return false;
      }

      registrationRef.current = reg;
      await reg.update();

      const currentTime = new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setLastCheckedTime(currentTime);

      if (reg.waiting || reg.installing) {
        setNeedRefresh(true);
        setUpdateMessage("Pembaruan ditemukan! Silakan muat ulang aplikasi.");
        return true;
      } else {
        setUpdateMessage("Aplikasi sudah versi paling mutakhir.");
        return false;
      }
    } catch (err) {
      console.warn("Gagal memeriksa pembaruan:", err);
      setUpdateMessage("Pemeriksaan selesai. Sistem berjalan normal.");
      return false;
    } finally {
      setIsCheckingUpdate(false);
    }
  }, []);

  // Apply update and reload safely
  const applyUpdate = useCallback(() => {
    userRequestedReloadRef.current = true;
    const reg = registrationRef.current;

    if (reg?.waiting) {
      // Send skip waiting signal to the new waiting worker
      reg.waiting.postMessage({ type: "SKIP_WAITING" });
    }

    // Reload the application cleanly
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, []);

  const dismissUpdateNotification = useCallback(() => {
    setNeedRefresh(false);
  }, []);

  return (
    <PWAOfflineContext.Provider
      value={{
        isOfflineEnabled,
        isRegistered,
        isProcessing,
        showConfirmModal,
        needRefresh,
        isCheckingUpdate,
        updateMessage,
        lastCheckedTime,
        requestEnableOffline,
        confirmEnableOffline,
        cancelEnableOffline,
        disableOffline,
        checkForUpdate,
        applyUpdate,
        dismissUpdateNotification,
      }}
    >
      {children}
    </PWAOfflineContext.Provider>
  );
};

export function usePWAOffline(): PWAOfflineContextType {
  const context = useContext(PWAOfflineContext);
  if (!context) {
    throw new Error("usePWAOffline must be used within a PWAOfflineProvider");
  }
  return context;
}
