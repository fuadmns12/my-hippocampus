import React from "react";
import { Plus, FileText, Trash2, Clock, ExternalLink, Link2 } from "lucide-react";
import { NodeNote } from "../../types";
import { extractUrls, normalizeUrl } from "../../utils/urlHelper";
import { soundFx } from "../../utils/soundEffects";

interface NotesListProps {
  notes: NodeNote[];
  nodeLabel: string;
  activeNoteId: string | null;
  onSelectNote: (note: NodeNote) => void;
  onAddNewNote: () => void;
  onRequestDelete: (note: NodeNote) => void;
  formatDate: (isoString: string) => string;
}

export const NotesList: React.FC<NotesListProps> = ({
  notes,
  nodeLabel,
  activeNoteId,
  onSelectNote,
  onAddNewNote,
  onRequestDelete,
  formatDate,
}) => {
  if (notes.length === 0) {
    return (
      <div className="py-8 px-4 text-center rounded-2xl bg-black border border-dashed border-cyan-500/30 space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-black border border-cyan-500/20 flex items-center justify-center text-white text-xl">
          📝
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-white">
            Belum Ada Catatan
          </p>
          <p className="text-[11px] text-white max-w-xs mx-auto">
            Tambahkan catatan khusus untuk "{nodeLabel}" agar ide
            dan detail penting tidak terlewat.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            soundFx.play("spawn");
            onAddNewNote();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider bg-black text-white border border-cyan-500/40 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-sm select-none"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          <span>TAMBAHKAN CATATAN</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {activeNoteId && (
        <div className="pt-3 border-t border-cyan-500/30">
          <span className="text-[11px] font-semibold text-white uppercase tracking-wider block mb-2">
            Catatan Lainnya ({notes.length})
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2.5">
        {notes.map((noteItem, idx) => {
          const isCurrent = noteItem.id === activeNoteId;
          const noteUrls = extractUrls(noteItem.content);

          return (
            <div
              key={noteItem.id}
              onClick={() => onSelectNote(noteItem)}
              className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer ${
                isCurrent
                  ? "bg-black border-cyan-500/50 shadow-sm"
                  : "bg-black hover:bg-neutral-900 border-cyan-500/30 hover:border-cyan-400/60"
              }`}
              id={`note-card-item-${noteItem.id}`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Note Icon & Title */}
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <span className="p-1.5 rounded-lg bg-black text-white border border-cyan-500/30 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <FileText className="w-3.5 h-3.5 text-white" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">
                      {noteItem.title.trim()
                        ? noteItem.title
                        : `Catatan #${idx + 1} (Tanpa Judul)`}
                    </h4>
                    <p className="text-[11px] text-white line-clamp-2 mt-0.5 leading-relaxed font-sans">
                      {noteItem.content.trim()
                        ? noteItem.content
                        : "Tidak ada deskripsi tambahan..."}
                    </p>

                    {/* Quick Clickable Links if present */}
                    {noteUrls.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-1.5 border-t border-cyan-500/20">
                        <span className="text-[10px] text-white font-medium flex items-center gap-1">
                          <Link2 className="w-2.5 h-2.5 text-white" />
                          <span>Tautan:</span>
                        </span>
                        {noteUrls.map((url, uIdx) => (
                          <a
                            key={uIdx}
                            href={normalizeUrl(url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black hover:bg-neutral-900 border border-cyan-500/40 hover:border-cyan-400 text-[10px] text-white hover:text-white transition-colors"
                            title={`Buka: ${url}`}
                          >
                            <span className="truncate max-w-[170px]">{url}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0 text-white" />
                          </a>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-2 text-[10px] text-white">
                      <Clock className="w-3 h-3 text-white" />
                      <span>
                        {formatDate(
                          noteItem.updatedAt || noteItem.createdAt
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFx.play("click");
                      onRequestDelete(noteItem);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-500 hover:text-red-400 hover:bg-red-950/40 transition-all cursor-pointer"
                    title="Hapus Catatan"
                    aria-label="Hapus Catatan"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
