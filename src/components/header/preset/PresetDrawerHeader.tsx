import React from "react";
import { Folder, X } from "lucide-react";
import { soundFx } from "../../../utils/soundEffects";

interface PresetDrawerHeaderProps {
  totalCount?: number;
  onClose: () => void;
}

export const PresetDrawerHeader: React.FC<PresetDrawerHeaderProps> = ({
  onClose,
}) => {
  return (
    <div className="p-4 sm:p-5 border-b border-cyan-500/30 flex items-center justify-between select-none">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-black text-white border border-cyan-500/30 shadow-sm shadow-cyan-500/20">
          <Folder className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="text-white">Contoh Dataset</span>
          </h2>
          <p className="text-[11px] text-white mt-0.5">
            Template contoh mind map: pilih dan muat langsung ke kanvas
          </p>
        </div>
      </div>

      <button
        id="btn-close-preset-drawer"
        type="button"
        onClick={() => {
          soundFx.play("click");
          onClose();
        }}
        className="p-1.5 rounded-lg bg-black border border-cyan-400 hover:border-cyan-300 text-cyan-400 hover:text-cyan-300 hover:bg-neutral-900 transition-colors cursor-pointer shadow-xs flex items-center justify-center"
        title="Tutup Contoh Dataset"
        aria-label="Tutup Contoh Dataset"
      >
        <X className="w-4 h-4 text-cyan-400" />
      </button>
    </div>
  );
};
