/**
 * Safe localStorage wrapper that guarantees operations won't throw exceptions
 * in restricted environments (e.g. Private Browsing, sandboxed iframes, quota limits, or disabled storage).
 */
export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window === "undefined" || !window.localStorage) return null;
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem(key: string, value: string): boolean {
    try {
      if (typeof window === "undefined" || !window.localStorage) return false;
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },

  removeItem(key: string): boolean {
    try {
      if (typeof window === "undefined" || !window.localStorage) return false;
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};
