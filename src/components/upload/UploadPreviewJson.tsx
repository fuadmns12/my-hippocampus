import React from "react";
import { FileCode, CheckCircle2, PackageCheck, Network, ChevronRight } from "lucide-react";
import { MindMapData } from "../../types";

interface UploadPreviewJsonProps {
  fileName?: string;
  data: MindMapData;
  totalNodes: number;
  backupMaps?: MindMapData[] | null;
  onSelectMapFromBackup?: (map: MindMapData) => void;
}

export const UploadPreviewJson: React.FC<UploadPreviewJsonProps> = ({
  fileName,
  data,
  totalNodes,
  backupMaps,
  onSelectMapFromBackup,
}) => {
  const isBackup = backupMaps && backupMaps.length > 1;

  return (
    <div className="p-3.5 rounded-xl bg-black border border-teal-500/40 space-y-3">
      {/* Header Badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <FileCode className="w-4 h-4 text-white shrink-0" />
          <span className="text-xs font-bold text-white truncate">
            {fileName}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-black px-2 py-0.5 rounded border border-teal-500/30 shrink-0">
          {isBackup ? (
            <>
              <PackageCheck className="w-3 h-3 text-white" />
              <span>Backup ({backupMaps.length} Mind Map)</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3 h-3 text-white" />
              <span>Berkas JSON Valid</span>
            </>
          )}
        </span>
      </div>

      {/* Multi-Map Backup Selector */}
      {isBackup && (
        <div className="space-y-1.5 bg-black p-2.5 rounded-xl border border-cyan-500/20">
          <div className="text-[11px] text-white font-semibold flex items-center justify-between">
            <span>Daftar Mind Map dalam Backup:</span>
            <span className="text-[10px] text-white font-normal">
              Klik untuk pilih map yang dimuat
            </span>
          </div>
          <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
            {backupMaps.map((m, idx) => {
              const isSelected = m.id === data.id;
              return (
                <button
                  key={m.id || idx}
                  type="button"
                  onClick={() => onSelectMapFromBackup && onSelectMapFromBackup(m)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between gap-2 transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-black border-cyan-500/60 text-white font-medium"
                      : "bg-black hover:bg-neutral-900 border-neutral-800 text-white"
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[10px] text-white font-mono">
                      #{idx + 1}
                    </span>
                    <span className="truncate">{m.title}</span>
                  </div>
                  <ChevronRight
                    className={`w-3 h-3 shrink-0 ${
                      isSelected ? "text-white" : "text-neutral-500"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-white pt-0.5">
            Semua {backupMaps.length} mind map akan disimpan ke Memory Card Anda saat Anda menekan tombol Terapkan.
          </p>
        </div>
      )}

      {/* Active Selected Mind Map Details */}
      <div className="text-xs text-white bg-black p-2.5 rounded-lg border border-neutral-800 space-y-1.5">
        <div>
          <strong className="text-white">
            {isBackup ? "Mind Map Dimuat ke Kanvas:" : "Judul:"}
          </strong>{" "}
          <span className="text-white font-semibold">{data.title}</span>
        </div>
        {data.subtitle && (
          <div>
            <strong className="text-white">Subjudul:</strong>{" "}
            <span className="text-white">{data.subtitle}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-white">
          <span className="inline-flex items-center gap-1 bg-black px-2 py-0.5 rounded border border-neutral-700/60 text-white font-mono">
            <Network className="w-3 h-3 text-white" />
            {totalNodes} Node
          </span>
          {data.additionalRoots && data.additionalRoots.length > 0 && (
            <span className="inline-flex items-center gap-1 bg-black px-2 py-0.5 rounded border border-teal-500/40 text-white font-medium">
              🌿 {data.additionalRoots.length + 1} Hierarki / Pohon
            </span>
          )}
          {data.connections && data.connections.length > 0 && (
            <span className="inline-flex items-center gap-1 bg-black px-2 py-0.5 rounded border border-cyan-500/40 text-white font-medium">
              🔗 {data.connections.length} Relasi Antar-Cabang
            </span>
          )}
          <span className="bg-black px-2 py-0.5 rounded border border-neutral-700/60 capitalize text-white">
            Layout: {data.layout}
          </span>
          <span className="bg-black px-2 py-0.5 rounded border border-neutral-700/60 capitalize text-white">
            Tema: {data.theme}
          </span>
        </div>
      </div>
    </div>
  );
};
