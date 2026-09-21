import React from "react";
import { FileText, CheckCircle2 } from "lucide-react";
import { ParsedTextInfo } from "./useUploadParser";

interface UploadPreviewTextProps {
  fileName?: string;
  info: ParsedTextInfo;
}

export const UploadPreviewText: React.FC<UploadPreviewTextProps> = ({
  fileName,
  info,
}) => {
  return (
    <div className="p-3.5 rounded-xl bg-black border border-teal-500/40 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-white" />
          <span className="text-xs font-bold text-white truncate max-w-[200px]">
            {fileName}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-black px-2 py-0.5 rounded border border-amber-500/30">
          <CheckCircle2 className="w-3 h-3 text-white" /> Daftar Teks Terdeteksi
        </span>
      </div>

      <div className="text-xs text-white bg-black p-2.5 rounded-lg border border-neutral-800 space-y-1">
        <div>
          <strong className="text-white">Judul Ekstraksi:</strong>{" "}
          <span className="text-white font-medium">{info.title}</span>
        </div>
        <div className="text-[11px] text-white">
          Terbaca <strong>{info.names.length}</strong> item nama yang akan
          diorganisir ke dalam struktur mind map.
        </div>
      </div>
    </div>
  );
};
