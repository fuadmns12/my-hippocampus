/**
 * Helper Fullscreen Native (Lintas Browser & Vendor Prefix)
 *
 * Dipakai oleh dua mode layar penuh aplikasi yang BERBEDA:
 * 1. **Page Fullscreen** (`usePageFullscreen`) — tombol `#btn-fullscreen-page` di header.
 *    Target: `document.documentElement`, sehingga SELURUH HALAMAN (header, panel input,
 *    kanvas, drawer) ikut layar penuh tanpa ada yang disembunyikan.
 * 2. **Mode Kanvas Fokus** (`useFullscreen`) — tombol `#btn-canvas-fullscreen-toggle` di kanvas.
 *    Target native juga `document.documentElement` (bukan elemen kanvas) agar modal, drawer,
 *    toast, dan FAB yang dirender di luar `#canvas-container` tetap bisa muncul di atas
 *    top-layer. Fokus visual ke kanvas diatur oleh overlay 100vw x 100vh di `MindMapCanvas`.
 *
 * Selain itu, deteksi status fullscreen harus presisi: hanya fullscreen `documentElement`
 * yang dihitung sebagai "fullscreen halaman", supaya fullscreen elemen lain (mis. video)
 * tidak salah dianggap sebagai fullscreen halaman.
 */

/** ID elemen kanvas fokus (lihat MindMapCanvas.tsx: `id="canvas-container"`) */
export const CANVAS_FULLSCREEN_ELEMENT_ID = "canvas-container";

/** ID elemen root aplikasi (lihat App.tsx: `id="app-root"`) */
export const APP_ROOT_ELEMENT_ID = "app-root";

/** Nama event perubahan status fullscreen untuk seluruh browser (termasuk vendor prefix). */
export const FULLSCREEN_CHANGE_EVENTS = [
  "fullscreenchange",
  "webkitfullscreenchange",
  "mozfullscreenchange",
  "MSFullscreenChange",
] as const;

type VendorFullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
  mozRequestFullScreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
};

type VendorFullscreenDocument = Document & {
  webkitExitFullscreen?: () => Promise<void> | void;
  mozCancelFullScreen?: () => Promise<void> | void;
  msExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
};

type VendorScreenOrientation = ScreenOrientation & {
  lock?: (orientation: string) => Promise<void>;
};

/** Elemen yang saat ini berada dalam mode fullscreen native (lintas browser), `null` bila tidak ada. */
export function getFullscreenElement(): Element | null {
  if (typeof document === "undefined") return null;
  const doc = document as VendorFullscreenDocument;
  return (
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement ||
    null
  );
}

/** `true` bila ada elemen apa pun (halaman, video, kanvas) yang sedang fullscreen native. */
export function isAnyFullscreenActive(): boolean {
  return Boolean(getFullscreenElement());
}

/** `true` HANYA bila SELURUH HALAMAN (`documentElement`) sedang fullscreen native. */
export function isPageFullscreenActive(): boolean {
  if (typeof document === "undefined") return false;
  return getFullscreenElement() === document.documentElement;
}

/** Minta mode fullscreen native untuk sebuah elemen (mendukung vendor prefix WebKit/Gecko/MS). */
export async function requestElementFullscreen(
  element: HTMLElement | null
): Promise<void> {
  if (!element) {
    throw new Error("Elemen target fullscreen tidak ditemukan");
  }

  const el = element as VendorFullscreenElement;

  if (typeof el.requestFullscreen === "function") {
    await el.requestFullscreen();
    return;
  }
  if (typeof el.webkitRequestFullscreen === "function") {
    await el.webkitRequestFullscreen();
    return;
  }
  if (typeof el.mozRequestFullScreen === "function") {
    await el.mozRequestFullScreen();
    return;
  }
  if (typeof el.msRequestFullscreen === "function") {
    await el.msRequestFullscreen();
    return;
  }

  throw new Error("Fullscreen API tidak tersedia pada perangkat ini");
}

/** Keluar dari mode fullscreen native (lintas vendor prefix). Aman dipanggil saat tidak fullscreen. */
export async function exitNativeFullscreen(): Promise<void> {
  if (typeof document === "undefined" || !getFullscreenElement()) return;

  const doc = document as VendorFullscreenDocument;

  if (typeof doc.exitFullscreen === "function") {
    await doc.exitFullscreen();
    return;
  }
  if (typeof doc.webkitExitFullscreen === "function") {
    await doc.webkitExitFullscreen();
    return;
  }
  if (typeof doc.mozCancelFullScreen === "function") {
    await doc.mozCancelFullScreen();
    return;
  }
  if (typeof doc.msExitFullscreen === "function") {
    await doc.msExitFullscreen();
    return;
  }
}

/** Kunci orientasi perangkat ke landscape (efektif di HP/tablet yang mendukung, gagal secara senyap). */
export async function lockLandscapeOrientation(): Promise<void> {
  try {
    if (typeof screen === "undefined" || !screen.orientation) return;

    const orientation = screen.orientation as VendorScreenOrientation;
    if (typeof orientation.lock !== "function") return;

    await orientation.lock("landscape");
  } catch {
    // Diabaikan: browser tidak mengizinkan penguncian orientasi (mis. iOS Safari).
  }
}

/** Jadwalkan penguncian ulang orientasi landscape setelah keluar fullscreen (delay default 300ms). */
export function scheduleLandscapeRelock(delayMs: number = 300): void {
  setTimeout(() => {
    void lockLandscapeOrientation();
  }, delayMs);
}
