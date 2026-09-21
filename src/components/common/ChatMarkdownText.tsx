import React from "react";
import { renderInlineContent } from "./chatMarkdown/renderInlineContent";
import {
  ChatMarkdownListRenderer,
  MarkdownListItem,
} from "./chatMarkdown/ChatMarkdownListRenderer";

interface ChatMarkdownTextProps {
  content: string;
  isUser?: boolean;
}

export const ChatMarkdownText: React.FC<ChatMarkdownTextProps> = ({
  content,
  isUser = false,
}) => {
  const rawText = content.replace(/\r\n/g, "\n");
  const lines = rawText.split("\n");

  const blocks: React.ReactNode[] = [];
  let currentList: {
    type: "ul" | "ol";
    items: MarkdownListItem[];
  } | null = null;

  const flushList = (keyPrefix: string) => {
    if (!currentList) return;
    blocks.push(
      <ChatMarkdownListRenderer
        key={`${keyPrefix}-${currentList.type}`}
        type={currentList.type}
        items={currentList.items}
        isUser={isUser}
      />
    );
    currentList = null;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      flushList(`line-${index}`);
      return;
    }

    // Heading lines: ### or ## or #
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      flushList(`line-${index}`);
      const headingText = headingMatch[2];
      blocks.push(
        <div
          key={`heading-${index}`}
          className={`font-bold text-[13px] tracking-wide pt-1.5 pb-1 border-b ${
            isUser
              ? "text-white border-white/20"
              : "text-white border-neutral-800/80"
          }`}
        >
          {renderInlineContent(headingText, isUser)}
        </div>
      );
      return;
    }

    const indentLevel = line.search(/\S/);
    const isIndented = indentLevel >= 2;

    // Bullet line: - Item or * Item or • Item
    const bulletMatch = trimmed.match(/^[-*•]\s+(.+)$/);
    if (bulletMatch) {
      const itemText = bulletMatch[1];
      // If indented under a numbered list item or bullet list item, nest it as a subItem
      if (isIndented && currentList && currentList.items.length > 0) {
        const lastItem = currentList.items[currentList.items.length - 1];
        if (!lastItem.subItems) {
          lastItem.subItems = [];
        }
        lastItem.subItems.push(itemText);
        return;
      }

      if (currentList && currentList.type === "ul") {
        currentList.items.push({ text: itemText });
      } else {
        flushList(`line-${index}`);
        currentList = { type: "ul", items: [{ text: itemText }] };
      }
      return;
    }

    // Numbered list: 1. Item or 1) Item
    const numberedMatch = trimmed.match(/^(\d+)[.)]\s+(.+)$/);
    if (numberedMatch) {
      const itemText = numberedMatch[2];
      if (currentList && currentList.type === "ol") {
        currentList.items.push({ text: itemText });
      } else {
        flushList(`line-${index}`);
        currentList = { type: "ol", items: [{ text: itemText }] };
      }
      return;
    }

    // Regular paragraph line
    flushList(`line-${index}`);
    blocks.push(
      <p key={`p-${index}`} className="text-xs leading-relaxed">
        {renderInlineContent(trimmed, isUser)}
      </p>
    );
  });

  flushList("end");

  return <div className="space-y-2">{blocks}</div>;
};
