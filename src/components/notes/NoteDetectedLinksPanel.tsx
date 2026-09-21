import React, { useState } from "react";
import { Link as LinkIcon, Globe, ExternalLink, Copy, Check } from "lucide-react";
import { normalizeUrl } from "../../utils/urlHelper";
import { soundFx } from "../../utils/soundEffects";
import { copyToClipboard } from "../../utils/clipboardHelper";

interface NoteDetectedLinksPanelProps {
  urls: string[];
}

export const NoteDetectedLinksPanel: React.FC<NoteDetectedLinksPanelProps> = ({ urls }) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  if (urls.length === 0) return null;

  const handleCopyUrl = async (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.play("click");
    const success = await copyToClipboard(url);
    if (success) {
      setCopiedUrl(url);
      setTimeout(() => {
        setCopiedUrl(null);
      }, 2000);
    }
  };

  return (
    <div
      className="mt-2.5 p-3 rounded-xl bg-black border border-cyan-500/30 space-y-2 animate-fade-in"
      id="panel-detected-note-links"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white flex items-center gap-1.5">
          <LinkIcon className="w-3.5 h-3.5 text-white" />
          <span>Tautan Terdeteksi ({urls.length})</span>
        </span>
        <span className="text-[10px] text-neutral-400">
          Klik tombol untuk langsung membuka di tab baru
        </span>
      </div>

      <div className="flex flex-wrap gap-2 pt-0.5">
        {urls.map((url, idx) => {
          const normalized = normalizeUrl(url);
          const isCopied = copiedUrl === url;

          return (
            <div
              key={idx}
              className="inline-flex items-center rounded-lg bg-black border border-cyan-500/40 hover:border-cyan-400 text-xs text-white transition-all shadow-sm max-w-full overflow-hidden"
            >
              <a
                href={normalized}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer min-w-0"
                title={`Buka situs: ${normalized}`}
                id={`btn-open-link-${idx}`}
              >
                <Globe className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="truncate max-w-[260px] font-medium underline underline-offset-2">
                  {url}
                </span>
                <ExternalLink className="w-3 h-3 text-white shrink-0 ml-0.5" />
              </a>
              <button
                type="button"
                onClick={(e) => handleCopyUrl(url, e)}
                className="p-1.5 px-2 hover:bg-neutral-800 text-neutral-400 hover:text-white border-l border-cyan-500/20 transition-colors cursor-pointer"
                title="Salin tautan"
                id={`btn-copy-link-${idx}`}
              >
                {isCopied ? (
                  <Check className="w-3 h-3 text-cyan-400" />
                ) : (
                  <Copy className="w-3 h-3 text-white" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
