import React from "react";
import { StickyNote } from "lucide-react";
import { soundFx } from "../../utils/soundEffects";

interface TopicFieldsProps {
  title: string;
  setTitle: (t: string) => void;
  subtitle: string;
  setSubtitle: (s: string) => void;
  isEditingMode?: boolean;
  onOpenNotesForRoot?: () => void;
  rootNotesCount?: number;
}

export const TopicFields: React.FC<TopicFieldsProps> = ({
  title,
  setTitle,
  subtitle,
  setSubtitle,
  isEditingMode = false,
  onOpenNotesForRoot,
  rootNotesCount = 0,
}) => {
  return (
    <div className="flex flex-col gap-3 sm:gap-3.5">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-white">
            {isEditingMode ? "Topik Utama (Pusat Mind Map)" : "Topik Utama Mind Map"}
          </label>
          {onOpenNotesForRoot && title.trim().length > 0 && (
            <button
              id="btn-root-open-notes"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundFx.play("click");
                onOpenNotesForRoot();
              }}
              title={
                rootNotesCount > 0
                  ? `Edit catatan untuk "${title}" (${rootNotesCount} catatan tersimpan)`
                  : `Tulis / Edit catatan untuk Topik Utama "${title}"`
              }
              aria-label={
                rootNotesCount > 0
                  ? `Edit catatan untuk "${title}" (${rootNotesCount} catatan tersimpan)`
                  : `Tulis / Edit catatan untuk Topik Utama "${title}"`
              }
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wider transition-all duration-150 active:scale-95 border cursor-pointer select-none ${
                rootNotesCount > 0
                  ? "bg-black text-white border-cyan-500/40 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white shadow-sm"
                  : "bg-black text-neutral-300 border-neutral-700/80 hover:bg-neutral-900 hover:border-neutral-500 hover:text-white"
              }`}
            >
              <StickyNote
                className={`w-3.5 h-3.5 shrink-0 ${
                  rootNotesCount > 0 ? "text-cyan-400" : "text-white"
                }`}
              />
              <span>{rootNotesCount > 0 ? `CATATAN (${rootNotesCount})` : "CATATAN"}</span>
            </button>
          )}
        </div>
        <input
          id="mindmap-topic-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="misal: Tim Developer Project Alpha"
          className="w-full px-3.5 py-2.5 bg-neutral-950 border border-cyan-500/30 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-white mb-1.5">
          {isEditingMode ? "Deskripsi / Sub-Topik Pusat (Opsional)" : "Deskripsi / Sub-Topik (Opsional)"}
        </label>
        <input
          id="mindmap-subtopic-input"
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="misal: Struktur Organisasi & Pembagian Divisi"
          className="w-full px-3.5 py-2.5 bg-neutral-950 border border-cyan-500/30 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
        />
      </div>
    </div>
  );
};
