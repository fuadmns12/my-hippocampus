import { useState, useCallback, useRef, useEffect } from "react";

export function useToast() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const showToast = useCallback((msg: string, duration = 2500) => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    setToastMessage(msg);
    timeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
      timeoutRef.current = null;
    }, duration);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    toastMessage,
    showToast,
  };
}

