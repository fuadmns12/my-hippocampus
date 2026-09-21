import React from "react";
import { Upload, X } from "lucide-react";

interface UploadModalHeaderProps {
  onClose: () => void;
}

export const UploadModalHeader: React.FC<UploadModalHeaderProps> = ({ onClose }) => {
  return (
    <div className="px-4 sm:px-5 py-3.5 border-b border-cyan-500/30 flex items-center justify-between bg-black">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-black border border-cyan-500/30 text-white">
          <Upload className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">
            Upload & Impor Mind Map
          </h3>
          <p className="text-[11px] text-white">
            Muat data JSON atau daftar teks/markdown dari perangkat
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-1.5 rounded-lg bg-black border border-cyan-400 hover:border-cyan-300 text-cyan-400 hover:text-cyan-300 hover:bg-neutral-900 transition-colors cursor-pointer shadow-xs flex items-center justify-center"
        title="Tutup Modal"
      >
        <X className="w-4 h-4 text-cyan-400" />
      </button>
    </div>
  );
};
