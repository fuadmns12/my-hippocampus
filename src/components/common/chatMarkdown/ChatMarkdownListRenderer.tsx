import React from "react";
import { renderInlineContent } from "./renderInlineContent";

export interface MarkdownListItem {
  text: string;
  subItems?: string[];
}

interface ChatMarkdownListRendererProps {
  type: "ul" | "ol";
  items: MarkdownListItem[];
  isUser?: boolean;
}

export const ChatMarkdownListRenderer: React.FC<
  ChatMarkdownListRendererProps
> = ({ type, items, isUser = false }) => {
  if (type === "ol") {
    return (
      <ol className="space-y-2 my-1.5 pl-0.5">
        {items.map((item, idx) => (
          <li key={idx} className="flex flex-col gap-1 text-xs leading-relaxed">
            <div className="flex items-start gap-2">
              <span
                className={`flex items-center justify-center shrink-0 w-4 h-4 rounded-full text-[10px] font-bold mt-0.5 ${
                  isUser
                    ? "bg-black text-white border border-white/40"
                    : "bg-black text-white border border-cyan-500/30"
                }`}
              >
                {idx + 1}
              </span>
              <div className="flex-1">
                {renderInlineContent(item.text, isUser)}
              </div>
            </div>

            {item.subItems && item.subItems.length > 0 && (
              <ul className="pl-6 space-y-1 text-[11px] text-neutral-300">
                {item.subItems.map((sub, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-1.5">
                    <span className="text-white shrink-0 font-bold">•</span>
                    <div className="flex-1">
                      {renderInlineContent(sub, isUser)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ul className="space-y-1.5 my-1.5 pl-0.5">
      {items.map((item, idx) => (
        <li key={idx} className="flex flex-col gap-1 text-xs leading-relaxed">
          <div className="flex items-start gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                isUser ? "bg-white" : "bg-cyan-400"
              }`}
            />
            <div className="flex-1">
              {renderInlineContent(item.text, isUser)}
            </div>
          </div>

          {item.subItems && item.subItems.length > 0 && (
            <ul className="pl-5 space-y-1 text-[11px] text-neutral-300">
              {item.subItems.map((sub, sIdx) => (
                <li key={sIdx} className="flex items-start gap-1.5">
                  <span className="text-neutral-500 shrink-0">•</span>
                  <div className="flex-1">
                    {renderInlineContent(sub, isUser)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};
