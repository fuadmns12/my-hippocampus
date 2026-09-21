import React, { useState } from "react";
import { MindMapData } from "../types";
import { exportToMarkdown } from "../utils/exportUtils";
import { FileText, Copy, Check } from "lucide-react";
import { soundFx } from "../utils/soundEffects";
import { copyToClipboard } from "../utils/clipboardHelper";

interface OutlineViewModalProps {
  data: MindMapData;
  onClose: () => void;
}

export const OutlineViewModal: React.FC<OutlineViewModalProps> = ({
  data,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const markdownText = exportToMarkdown(data);

  const handleCopy = async () => {
    soundFx.play("click");
    const success = await copyToClipboard(markdownText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="outline-modal" className="bg-black border border-cyan-500/40 rounded-2xl shadow-xl overflow-hidden p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-white" />
          <h2 className="text-sm font-bold text-white">
            Outline Teks & Markdown Mind Map
          </h2>
        </div>

        <button
          id="btn-copy-outline-markdown"
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-150 active:scale-95 border cursor-pointer shadow-sm select-none ${
            copied
              ? "bg-black text-white border-cyan-400 ring-1 ring-cyan-400"
              : "bg-black text-white border-cyan-500/40 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white"
          }`}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-cyan-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-white" />
          )}
          <span>{copied ? "TERSALIN!" : "SALIN TEKS"}</span>
        </button>
      </div>

      <pre className="p-4 bg-black border border-cyan-500/30 rounded-xl text-xs font-mono text-white overflow-x-auto whitespace-pre-wrap max-h-96 leading-relaxed">
        {markdownText}
      </pre>
    </div>
  );
};
