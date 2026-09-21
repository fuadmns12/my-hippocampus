import React, { useState } from "react";
import { ChevronDown, ChevronUp, Smile, Trash2 } from "lucide-react";
import { EMOJI_PRESETS } from "./useNodeEditor";

interface NodeBasicFieldsProps {
  label: string;
  setLabel: (val: string) => void;
  subtitle: string;
  setSubtitle: (val: string) => void;
  emoji: string;
  setEmoji: (val: string) => void;
}

export const NodeBasicFields: React.FC<NodeBasicFieldsProps> = ({
  label,
  setLabel,
  subtitle,
  setSubtitle,
  emoji,
  setEmoji,
}) => {
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  return (
    <>
      {/* Label Input */}
      <div>
        <label className="block text-white font-medium mb-1">
          Nama / Judul Kartu
        </label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full px-3.5 py-2 bg-black border border-cyan-500/30 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
          required
        />
      </div>

      {/* Subtitle Input */}
      <div>
        <label className="block text-white font-medium mb-1">
          Catatan Singkat / Peran / Subtitle
        </label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="misal: Lead Designer atau Pembina"
          className="w-full px-3.5 py-2 bg-black border border-cyan-500/30 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* Emoji Preset Selection with Accordion */}
      <div className="rounded-xl border border-cyan-500/30 bg-black overflow-hidden">
        <button
          type="button"
          onClick={() => setIsEmojiOpen(!isEmojiOpen)}
          className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-neutral-900/50 transition-colors cursor-pointer"
          id="btn-toggle-emoji-accordion"
        >
          <div className="flex items-center gap-2">
            <Smile
              className={`w-4 h-4 ${
                isEmojiOpen ? "text-cyan-400" : "text-white"
              }`}
            />
            <span className="text-white font-medium text-xs">Ikon Emoji</span>
            {emoji ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black border border-cyan-500/40 text-[11px] text-white">
                <span className="text-sm leading-none">{emoji}</span>
                <span>Terpilih</span>
              </span>
            ) : (
              <span className="text-[11px] text-neutral-400">
                (Opsional)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {emoji && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  setEmoji("");
                }}
                className="p-1 rounded-md text-red-500 hover:text-red-400 hover:bg-red-950/40 border border-red-500/40 transition-colors cursor-pointer inline-flex items-center justify-center"
                title="Hapus emoji yang dipilih"
                aria-label="Hapus emoji yang dipilih"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
              </span>
            )}
            {isEmojiOpen ? (
              <ChevronUp className="w-4 h-4 text-cyan-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white" />
            )}
          </div>
        </button>

        {isEmojiOpen && (
          <div className="px-3.5 pb-3 pt-1 border-t border-cyan-500/20 animate-fade-in">
            <div className="flex flex-wrap gap-1.5 pt-1.5 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 p-1">
              {EMOJI_PRESETS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    emoji === e
                      ? "bg-black text-white shadow-md ring-1 ring-cyan-400 border border-cyan-400"
                      : "bg-black hover:bg-neutral-900 text-white border border-cyan-500/30"
                  }`}
                  id={`btn-select-emoji-${e}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
