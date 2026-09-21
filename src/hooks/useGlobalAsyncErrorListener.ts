import { useEffect } from "react";

interface GlobalAsyncErrorListenerOptions {
  onNotifyError?: (message: string) => void;
}

/**
 * Hook to catch unhandled promise rejections and uncaught window errors.
 * Supplements React's ErrorBoundary which only catches errors during rendering.
 */
export function useGlobalAsyncErrorListener({
  onNotifyError,
}: GlobalAsyncErrorListenerOptions = {}) {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Prevent browser from treating this as an uncaught fatal exception
      if (typeof event?.preventDefault === "function") {
        event.preventDefault();
      }

      const reason = event.reason;

      // Ignore null, undefined, or empty rejections
      if (!reason) {
        return;
      }

      const reasonName = reason?.name || "";
      const reasonMsg =
        reason instanceof Error
          ? reason.message
          : typeof reason === "string"
          ? reason
          : "";

      // Filter out benign or expected non-critical rejections
      if (
        reasonName === "AbortError" ||
        reasonName === "NotAllowedError" ||
        reasonName === "SecurityError" ||
        reasonMsg.includes("aborted") ||
        reasonMsg.includes("ResizeObserver") ||
        reasonMsg.includes("play() failed") ||
        reasonMsg.includes("user didn't interact") ||
        reasonMsg.includes("ServiceWorker") ||
        reasonMsg.includes("cross-origin") ||
        reasonMsg.includes("Failed to fetch") ||
        reasonMsg.includes("Load failed")
      ) {
        return;
      }

      console.warn("[MATE MIND MAP] Intercepted Unhandled Rejection:", reason);

      if (onNotifyError && reasonMsg) {
        onNotifyError(`Peringatan: ${reasonMsg.slice(0, 100)}`);
      }
    };

    const handleGlobalError = (event: ErrorEvent) => {
      const message = event.message || "";

      // Ignore benign development notices and websocket disconnects
      if (
        !message ||
        message.includes("ResizeObserver loop") ||
        message.includes("failed to connect to websocket") ||
        message.includes("Script error.") ||
        message.includes("Non-Error promise rejection captured")
      ) {
        return;
      }

      console.warn("[MATE MIND MAP] Intercepted Window Error:", event.error || message);

      if (onNotifyError && message) {
        onNotifyError(`Kendala Sistem: ${message.slice(0, 100)}`);
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleGlobalError);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleGlobalError);
    };
  }, [onNotifyError]);
}
