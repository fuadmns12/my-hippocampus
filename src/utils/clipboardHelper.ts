/**
 * Cross-platform clipboard copy helper.
 * Supports Windows, Android, and iOS (Safari/WebKit)
 * with graceful fallback to document.execCommand('copy').
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  // 1. Try modern Async Clipboard API
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to fallback on permission or iframe denial
    }
  }

  // 2. Fallback for iOS Safari / iframe / older web engines
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Prevent scrolling and zooming on mobile
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    textArea.style.fontSize = "16px"; // Prevents iOS Safari auto-zoom

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    // iOS specific selection range
    if (textArea.setSelectionRange) {
      textArea.setSelectionRange(0, text.length);
    }

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}
