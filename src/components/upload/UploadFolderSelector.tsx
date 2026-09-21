import React from "react";
import { Folder } from "lucide-react";
import { DocumentFolder } from "../../types";

interface UploadFolderSelectorProps {
  targetFolder: DocumentFolder;
  setTargetFolder: (f: DocumentFolder) => void;
}

export const UploadFolderSelector: React.FC<UploadFolderSelectorProps> = ({
  targetFolder,
  setTargetFolder,
}) => {
  return (
    <div className="space-y-1.5 pt-1">
      <label className="text-xs font-medium text-white flex items-center gap-1.5">
        <Folder className="w-3.5 h-3.5 text-white" />
        Simpan ke Kategori Folder:
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setTargetFolder("Umum")}
          className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left flex items-center gap-2 cursor-pointer ${
            targetFolder === "Umum"
              ? "bg-black border-cyan-500 text-white shadow-sm"
              : "bg-black border-neutral-800 text-white hover:bg-neutral-900"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <div>
            <div className="font-semibold text-white">Folder Umum</div>
            <div className="text-[10px] text-white">Kelas, Acara, Komunitas</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setTargetFolder("Spesifik")}
          className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left flex items-center gap-2 cursor-pointer ${
            targetFolder === "Spesifik"
              ? "bg-black border-purple-500 text-white shadow-sm"
              : "bg-black border-neutral-800 text-white hover:bg-neutral-900"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-purple-400"></span>
          <div>
            <div className="font-semibold text-white">Folder Spesifik</div>
            <div className="text-[10px] text-white">Tim, Proyek, Teknis</div>
          </div>
        </button>
      </div>
    </div>
  );
};
