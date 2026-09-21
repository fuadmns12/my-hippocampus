import { useState, useEffect, useCallback } from "react";

/**
 * Validates if the current browser pathname is a valid application root route.
 */
function isRootPath(pathname: string): boolean {
  const normalized = pathname.trim();
  const base = import.meta.env.BASE_URL || "/";
  const baseTrimmed = base.endsWith("/") && base.length > 1 ? base.slice(0, -1) : base;

  const validPaths = new Set([
    "",
    "/",
    "/index.html",
    base,
    baseTrimmed,
    `${baseTrimmed}/`,
    `${baseTrimmed}/index.html`,
  ]);

  return validPaths.has(normalized);
}

export function useRoute404Check() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);
  const [is404, setIs404] = useState<boolean>(() => !isRootPath(window.location.pathname));

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      setIs404(!isRootPath(path));
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const returnToHome = useCallback(() => {
    const targetUrl = import.meta.env.BASE_URL || "/";
    try {
      window.history.pushState({}, "", targetUrl);
    } catch {
      window.location.href = targetUrl;
    }
    setCurrentPath(targetUrl);
    setIs404(false);
  }, []);

  return {
    is404,
    currentPath,
    returnToHome,
  };
}
