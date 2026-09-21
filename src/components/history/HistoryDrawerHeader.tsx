import React from "react";
import { HardDrive, X, Upload } from "lucide-react";
import { MindMapData } from "../../types";
import { soundFx } from "../../utils/soundEffects";

interface HistoryDrawerHeaderProps {
  savedMaps?: MindMapData[];
  onClose: () => void;
  onOpenUpload?: () => void;
}

export const HistoryDrawerHeader: React.FC<HistoryDrawerHeaderProps> = ({
  onClose,
  onOpenUpload,
}) => {
  return (
    <>
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-cyan-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-black text-white border border-cyan-500/30 shadow-sm shadow-cyan-500/20">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-white">Memory Card</span>
            </h2>
            <p className="text-[11px] text-white mt-0.5">
              Penyimpanan lokal mind map: simpan, muat, atau upload
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-black border border-cyan-400 hover:border-cyan-300 text-cyan-400 hover:text-cyan-300 hover:bg-neutral-900 transition-colors cursor-pointer shadow-xs flex items-center justify-center"
          title="Tutup Riwayat"
          aria-label="Tutup Riwayat"
        >
          <X className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

      {/* Quick Toolbar: Upload */}
      {onOpenUpload && (
        <div className="px-4 py-2.5 bg-black border-b border-cyan-500/20 flex items-center justify-center select-none">
          <button
            type="button"
            onClick={() => {
              soundFx.play("click");
              onOpenUpload();
              onClose();
            }}
            title="Unggah / Impor File Mind Map (JSON / Teks)"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wider bg-black text-neutral-300 border border-neutral-700/80 hover:bg-neutral-900 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-white" />
            <span>UPLOAD</span>
          </button>
        </div>
      )}
    </>
  );
};
