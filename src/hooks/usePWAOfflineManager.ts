import { usePWAOffline, PWAOfflineContextType } from "../context/PWAOfflineContext";

export type PWAOfflineManager = PWAOfflineContextType;

export function usePWAOfflineManager(): PWAOfflineManager {
  return usePWAOffline();
}
