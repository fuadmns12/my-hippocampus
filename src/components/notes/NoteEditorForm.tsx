import React, { useState } from "react";
import { Edit3, Eye } from "lucide-react";
import {
  extractUrls,
  renderTextWithLinks,
} from "../../utils/urlHelper";
import { soundFx } from "../../utils/soundEffects";
import { NoteDetectedLinksPanel } from "./NoteDetectedLinksPanel";
import { NoteEditorActionFooter } from "./NoteEditorActionFooter";

interface NoteEditorFormProps {
  activeTitle: string;
  activeContent: string;
  activeNoteId: string;
  onTitleChange: (val: string) => void;
  onContentChange: (val: string) => void;
  onRequestDelete: () => void;
  onBackToList: () => void;
  onSaveAndClose: () => void;
}

export const NoteEditorForm: React.FC<NoteEditorFormProps> = ({
  activeTitle,
  activeContent,
  onTitleChange,
  onContentChange,
  onRequestDelete,
  onBackToList,
  onSaveAndClose,
}) => {
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

  // Extract all URLs from the active content
  const detectedUrls = extractUrls(activeContent);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Judul Input */}
      <div>
        <label className="block text-xs font-medium text-white mb-1.5">
          Judul Catatan
        </label>
        <div className="relative">
          <input
            type="text"
            value={activeTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Contoh: Rangkuman, Tugas, Referensi..."
            className="w-full bg-black border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition-all"
            id="input-note-title"
            autoFocus
          />
        </div>
      </div>

      {/* Isi Catatan Textarea & Link Preview Controls */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <label className="block text-xs font-medium text-white">
              Isi Catatan
            </label>
            <span className="text-[10px] text-white">
              (Link otomatis terdeteksi)
            </span>
          </div>

          <div className="flex items-center gap-1 bg-black p-0.5 rounded-lg border border-cyan-500/30">
            <button
              type="button"
              onClick={() => {
                soundFx.play("click");
                setViewMode("edit");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer bg-black text-white ${
                viewMode === "edit"
                  ? "border border-cyan-400 font-semibold shadow-xs"
                  : "border border-transparent hover:border-cyan-500/30 hover:bg-neutral-900"
              }`}
            >
              <Edit3 className="w-3 h-3 text-white" />
              <span>Tulis</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.play("click");
                setViewMode("preview");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer bg-black text-white ${
                viewMode === "preview"
                  ? "border border-cyan-400 font-semibold shadow-xs"
                  : "border border-transparent hover:border-cyan-500/30 hover:bg-neutral-900"
              }`}
            >
              <Eye className="w-3 h-3 text-white" />
              <span>Pratinjau ({detectedUrls.length})</span>
            </button>
          </div>
        </div>

        {viewMode === "edit" ? (
          <textarea
            value={activeContent}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Tuliskan catatan lengkap di sini... Anda juga bisa menyisipkan link seperti https://example.com"
            rows={7}
            className="w-full bg-black border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl p-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none resize-none leading-relaxed transition-all"
            id="textarea-note-content"
          />
        ) : (
          <div className="min-h-[140px] max-h-56 overflow-y-auto w-full bg-black border border-cyan-500/30 rounded-xl p-3.5 text-xs text-white leading-relaxed whitespace-pre-wrap select-text">
            {activeContent.trim() ? (
              renderTextWithLinks(activeContent)
            ) : (
              <span className="text-white italic">
                Belum ada isi catatan. Klik tab 'Tulis' untuk mulai mengetik.
              </span>
            )}
          </div>
        )}

        {/* Tautan Terdeteksi (Dapat Langsung Diklik) */}
        <NoteDetectedLinksPanel urls={detectedUrls} />
      </div>

      {/* Action and Note Footer */}
      <NoteEditorActionFooter
        onRequestDelete={onRequestDelete}
        onBackToList={onBackToList}
        onSaveAndClose={onSaveAndClose}
      />
    </div>
  );
};
