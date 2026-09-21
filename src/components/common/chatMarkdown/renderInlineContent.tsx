import React from "react";
import { detectGuideAction } from "../../../utils/guideActions";
import { GuideActionButton } from "../GuideActionButton";

/**
 * Helper to render inline formatting:
 * - Bold: **text**
 * - Italic: *text* or _text_
 * - Inline code: `text`
 * - Action buttons: Any bold or quoted text matching a website action (e.g. "Buka Panel Input", "Pengaturan")
 * - Links: https://...
 * - Cleans up any orphaned ** or * so asterisks are NEVER rendered literally.
 */
export function renderInlineContent(
  text: string,
  isUser?: boolean
): React.ReactNode[] {
  // Regex to match:
  // 1. `code`
  // 2. **bold**
  // 3. *italic*
  // 4. "quoted text"
  // 5. URLs
  const tokenRegex =
    /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|"[^"\n]{2,40}"|https?:\/\/[^\s)]+)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      // Strip any orphaned double asterisks
      const plain = text.slice(lastIndex, matchIndex).replace(/\*\*/g, "");
      parts.push(plain);
    }

    const token = match[0];
    const key = `token-${matchIndex}`;

    if (token.startsWith("`") && token.endsWith("`")) {
      const codeContent = token.slice(1, -1);
      parts.push(
        <code
          key={key}
          className={`px-1.5 py-0.5 rounded font-mono text-[11px] ${
            isUser
              ? "bg-black text-white border border-white/30"
              : "bg-neutral-800 text-white border border-neutral-700/80"
          }`}
        >
          {codeContent}
        </code>
      );
    } else if (token.startsWith("**") && token.endsWith("**")) {
      const boldContent = token.slice(2, -2);
      const action = detectGuideAction(boldContent);

      if (action) {
        // Tampilkan sebagai tombol aksi interaktif (Scroll view atau Popup modal)
        const cleanDisplayText = boldContent
          .replace(/^["'«“]|["'»”]$/g, "")
          .trim();
        parts.push(
          <GuideActionButton
            key={key}
            action={action}
            displayText={cleanDisplayText || action.label}
            isUser={isUser}
          />
        );
      } else {
        parts.push(
          <strong
            key={key}
            className={`font-semibold ${
              isUser ? "text-white" : "text-white tracking-wide"
            }`}
          >
            {boldContent}
          </strong>
        );
      }
    } else if (token.startsWith('"') && token.endsWith('"')) {
      const quoteContent = token.slice(1, -1);
      const action = detectGuideAction(quoteContent);

      if (action) {
        // Jika teks dalam kutip adalah perintah tombol aplikasi, ubah menjadi tombol aksi interaktif
        parts.push(
          <GuideActionButton
            key={key}
            action={action}
            displayText={quoteContent.trim() || action.label}
            isUser={isUser}
          />
        );
      } else {
        parts.push(token);
      }
    } else if (token.startsWith("*") && token.endsWith("*")) {
      const italicContent = token.slice(1, -1);
      parts.push(
        <em
          key={key}
          className={`italic ${
            isUser ? "text-white" : "text-white font-medium"
          }`}
        >
          {italicContent}
        </em>
      );
    } else if (token.startsWith("http://") || token.startsWith("https://")) {
      parts.push(
        <a
          key={key}
          href={token}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline hover:opacity-80 transition-opacity break-all ${
            isUser ? "text-white font-medium" : "text-white font-medium"
          }`}
        >
          {token}
        </a>
      );
    }

    lastIndex = matchIndex + token.length;
  }

  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex).replace(/\*\*/g, "");
    parts.push(remaining);
  }

  return parts;
}
