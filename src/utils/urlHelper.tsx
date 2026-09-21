import React from "react";
import { ExternalLink } from "lucide-react";

/**
 * Regex for matching web URLs starting with http://, https://, or www.
 */
export const URL_REGEX =
  /(https?:\/\/[^\s<]+[^<.,:;"')\]\s]|www\.[^\s<]+[^<.,:;"')\]\s])/gi;

/**
 * Normalizes a URL by prepending https:// if it starts with www.
 */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (/^www\./i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return `https://${trimmed}`;
}

/**
 * Extracts unique valid URLs from text.
 */
export function extractUrls(text: string): string[] {
  if (!text) return [];
  const matches = text.match(URL_REGEX);
  if (!matches) return [];
  const unique = Array.from(
    new Set(matches.map((url) => url.trim()))
  ).filter(Boolean);
  return unique;
}

/**
 * Renders text with clickable URLs opened in a new tab.
 */
export function renderTextWithLinks(
  text: string,
  linkClassName = "text-white hover:text-white underline underline-offset-2 break-all inline-flex items-center gap-1 font-medium transition-colors"
): React.ReactNode {
  if (!text) return null;

  // Split text by URL pattern while preserving matches
  const parts = text.split(
    /(https?:\/\/[^\s<]+[^<.,:;"')\]\s]|www\.[^\s<]+[^<.,:;"')\]\s])/gi
  );

  return parts.map((part, index) => {
    // Check if this part is a URL
    const isUrl = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s]|www\.[^\s<]+[^<.,:;"')\]\s])/i.test(
      part
    );

    if (isUrl) {
      const href = normalizeUrl(part);
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={linkClassName}
          title={`Buka tautan: ${href}`}
        >
          <span>{part}</span>
          <ExternalLink className="w-3 h-3 inline-block shrink-0 text-white opacity-80" />
        </a>
      );
    }

    // Regular text part
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}
