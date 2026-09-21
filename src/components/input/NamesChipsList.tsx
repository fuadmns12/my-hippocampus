import React from "react";
import { X } from "lucide-react";

interface NamesChipsListProps {
  namesList: string[];
  onRemoveName: (idx: number) => void;
  onOpenNotesForName?: (name: string) => void;
  getNodeNotesCount?: (name: string) => number;
}

export const NamesChipsList: React.FC<NamesChipsListProps> = ({
  namesList,
  onRemoveName,
  onOpenNotesForName,
  getNodeNotesCount,
}) => {
  if (namesList.length === 0) return null;

  return (
    <div className="pt-2 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="px-2 py-0.5 rounded-full bg-black text-white border border-cyan-500/30 text-xs font-normal">
          {namesList.length} Nama
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
        {namesList.map((name, idx) => {
          const notesCount = getNodeNotesCount ? getNodeNotesCount(name) : 0;
          const hasNotes = notesCount > 0;

          return (
            <span
              key={idx}
              className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black border border-cyan-500/30 hover:border-cyan-400/60 text-xs text-white transition-all shadow-sm"
            >
              <span className="truncate max-w-[150px] text-white">{name}</span>

              {/* Tombol Note 📝 ketika hover atau saat sudah memiliki catatan */}
              {onOpenNotesForName && (
                <button
                  type="button"
                  onClick={() => onOpenNotesForName(name)}
                  className={`inline-flex items-center justify-center p-0.5 rounded text-[11px] transition-all cursor-pointer active:scale-95 ${
                    hasNotes
                      ? "opacity-100 bg-black text-white border border-cyan-500/40 px-1 hover:bg-neutral-900 hover:border-cyan-400"
                      : "opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:opacity-100 hover:scale-110 text-white hover:text-white"
                  }`}
                  title={
                    hasNotes
                      ? `Edit catatan untuk "${name}" (${notesCount} catatan tersimpan)`
                      : `Tulis / Edit catatan untuk "${name}"`
                  }
                  aria-label={`Catatan untuk ${name}`}
                >
                  <span className="leading-none text-xs select-none">📝</span>
                  {hasNotes && (
                    <span className="text-[10px] font-bold ml-0.5 text-white">
                      {notesCount}
                    </span>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => onRemoveName(idx)}
                className="text-white hover:text-white transition-colors cursor-pointer p-0.5 rounded hover:bg-rose-500/10"
                title={`Hapus "${name}"`}
                aria-label={`Hapus ${name}`}
              >
                <X className="w-3 h-3 text-rose-400" />
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
};
