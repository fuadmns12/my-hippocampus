import React from "react";
import { Trash2 } from "lucide-react";
import { soundFx } from "../../utils/soundEffects";

interface NodeEditorFooterProps {
  isRoot: boolean;
  onRequestDelete: () => void;
  onClose: () => void;
}

export const NodeEditorFooter: React.FC<NodeEditorFooterProps> = ({
  isRoot,
  onRequestDelete,
  onClose,
}) => {
  return (
    <div className="pt-3 border-t border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 select-none">
      {!isRoot ? (
        <button
          id="btn-modal-delete-node"
          type="button"
          onClick={() => {
            soundFx.play("click");
            onRequestDelete();
          }}
          className="p-2 rounded-xl bg-black text-red-500 hover:text-red-400 border border-red-500/50 hover:border-red-400 hover:bg-red-950/40 transition-all duration-150 active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
          title="Hapus Kartu Ini"
          aria-label="Hapus Kartu Ini"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      ) : (
        <span className="text-[11px] text-white">Topik Utama (Pusat)</span>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            soundFx.play("click");
            onClose();
          }}
          className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wider bg-black text-neutral-300 border border-neutral-700/80 hover:bg-neutral-900 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-sm"
        >
          Batal
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-bold tracking-wider bg-black text-white border border-cyan-500/50 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-md shadow-cyan-950/50"
        >
          SIMPAN
        </button>
      </div>
    </div>
  );
};
