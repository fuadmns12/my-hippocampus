import React from "react";
import { Trash2, Save } from "lucide-react";
import { soundFx } from "../../utils/soundEffects";

interface NoteEditorActionFooterProps {
  onRequestDelete: () => void;
  onBackToList: () => void;
  onSaveAndClose: () => void;
}

export const NoteEditorActionFooter: React.FC<NoteEditorActionFooterProps> = ({
  onRequestDelete,
  onBackToList,
  onSaveAndClose,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 select-none">
      <button
        id="btn-delete-active-note"
        type="button"
        onClick={() => {
          soundFx.play("click");
          onRequestDelete();
        }}
        className="p-2 rounded-xl bg-black text-red-500 hover:text-red-400 border border-red-500/50 hover:border-red-400 hover:bg-red-950/40 transition-all duration-150 active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
        title="Hapus Catatan"
        aria-label="Hapus Catatan"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </button>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            soundFx.play("click");
            onBackToList();
          }}
          className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider bg-black text-neutral-300 border border-neutral-700/80 hover:bg-neutral-900 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-sm"
        >
          DAFTAR CATATAN
        </button>
        <button
          type="button"
          onClick={() => {
            soundFx.play("click");
            onSaveAndClose();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold tracking-wider bg-black text-white border border-cyan-500/50 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-md shadow-cyan-950/50"
        >
          <Save className="w-3.5 h-3.5 text-white" />
          <span>SIMPAN</span>
        </button>
      </div>
    </div>
  );
};
