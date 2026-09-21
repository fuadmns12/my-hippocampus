import React from "react";
import { AlertTriangle, RefreshCw, Copy, FastForward } from "lucide-react";
import { MindMapData, ImportConflictResolution } from "../../types";
import { UploadConflictComparison } from "./UploadConflictComparison";

interface UploadConflictResolutionProps {
  existingMap?: MindMapData | null;
  incomingMap?: MindMapData | null;
  conflictingBackupCount?: number;
  totalBackupCount?: number;
  resolution: ImportConflictResolution;
  onResolutionChange: (res: ImportConflictResolution) => void;
  copyCustomTitle: string;
  onCopyCustomTitleChange: (val: string) => void;
}

export const UploadConflictResolution: React.FC<UploadConflictResolutionProps> = ({
  existingMap,
  incomingMap,
  conflictingBackupCount = 0,
  totalBackupCount = 0,
  resolution,
  onResolutionChange,
  copyCustomTitle,
  onCopyCustomTitleChange,
}) => {
  const isMultiBackup = conflictingBackupCount > 0 && totalBackupCount > 1;

  return (
    <div className="p-3.5 sm:p-4 rounded-xl bg-black border border-amber-500/50 space-y-3.5 animate-fadeIn">
      {/* Warning Header */}
      <div className="flex items-start gap-2.5">
        <div className="p-1.5 rounded-lg bg-black text-white border border-amber-500/30 shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-white">
              Data dengan Judul/ID Sama Terdeteksi
            </h4>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-black text-white border border-amber-500/30">
              Perlu Konfirmasi
            </span>
          </div>
          <p className="text-[11px] text-white leading-relaxed">
            {isMultiBackup
              ? `Terdapat ${conflictingBackupCount} dari ${totalBackupCount} mind map yang sudah tersimpan di Memory Card perangkat ini.`
              : `Mind map "${incomingMap?.title || existingMap?.title}" sudah pernah ada di Memory Card perangkat ini. Silakan pilih tindakan:`}
          </p>
        </div>
      </div>

      {/* Comparison Grid (for single map conflict) */}
      {!isMultiBackup && existingMap && incomingMap && (
        <UploadConflictComparison
          existingMap={existingMap}
          incomingMap={incomingMap}
        />
      )}

      {/* Action Options */}
      <div className="space-y-2">
        <div className="text-[11px] font-semibold text-white">
          Pilih Opsi Penggabungan:
        </div>

        {/* Option 1: Timpa Data Lokal (Overwrite) */}
        <button
          type="button"
          onClick={() => onResolutionChange("overwrite")}
          className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
            resolution === "overwrite"
              ? "bg-black border-cyan-500 text-white shadow-md shadow-cyan-500/10"
              : "bg-black border-neutral-800 hover:border-neutral-700 text-white"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
              resolution === "overwrite"
                ? "border-cyan-400 bg-black text-white"
                : "border-neutral-600 bg-neutral-900"
            }`}
          >
            {resolution === "overwrite" && (
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
            )}
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-1.5 font-semibold text-xs text-white">
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  resolution === "overwrite" ? "text-white" : "text-white"
                }`}
              />
              <span>
                {isMultiBackup
                  ? "Timpa Mind Map yang Sama (Perbarui Versi Lama)"
                  : "Timpa Data Lokal (Perbarui Versi di Laptop)"}
              </span>
            </div>
            <p className="text-[11px] text-white">
              {isMultiBackup
                ? "Peta yang judul/ID-nya sama akan diperbarui dengan data dari berkas, sedangkan peta baru tetap ditambahkan."
                : "Versi lama di Memory Card akan diganti dengan berkas unggahan terbaru. Cocok jika Anda baru saja mengeditnya di HP."}
            </p>
          </div>
        </button>

        {/* Option 2: Simpan Sebagai Salinan Baru (Keep Both) */}
        <button
          type="button"
          onClick={() => onResolutionChange("copy")}
          className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
            resolution === "copy"
              ? "bg-black border-emerald-500 text-white shadow-md shadow-emerald-500/10"
              : "bg-black border-neutral-800 hover:border-neutral-700 text-white"
          }`}
        >
          <div className="flex items-start gap-2.5 w-full">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                resolution === "copy"
                  ? "border-emerald-400 bg-black text-white"
                  : "border-neutral-600 bg-neutral-900"
              }`}
            >
              {resolution === "copy" && (
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </div>
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-white">
                <Copy
                  className={`w-3.5 h-3.5 ${
                    resolution === "copy" ? "text-white" : "text-white"
                  }`}
                />
                <span>
                  {isMultiBackup
                    ? "Simpan Semua Sebagai Salinan Baru (Simpan Keduanya)"
                    : "Simpan Sebagai Salinan Baru (Simpan Keduanya)"}
                </span>
              </div>
              <p className="text-[11px] text-white">
                Data lama di laptop tetap utuh, dan data baru dari berkas akan disimpan sebagai dokumen terpisah dengan ID baru.
              </p>
            </div>
          </div>

          {/* Editable Title input for single copy */}
          {resolution === "copy" && !isMultiBackup && (
            <div
              className="mt-1 pl-6 w-full space-y-1"
              onClick={(e) => e.stopPropagation()}
            >
              <label className="text-[10px] font-semibold text-white flex items-center gap-1">
                <span>Nama Dokumen Salinan:</span>
              </label>
              <input
                type="text"
                value={copyCustomTitle}
                onChange={(e) => onCopyCustomTitleChange(e.target.value)}
                placeholder="Masukkan judul salinan..."
                className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-emerald-500/50 text-xs text-white focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>
          )}
        </button>

        {/* Option 3 (for backup only): Lewati yang Sama (Skip) */}
        {isMultiBackup && (
          <button
            type="button"
            onClick={() => onResolutionChange("skip")}
            className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
              resolution === "skip"
                ? "bg-black border-purple-500 text-white shadow-md shadow-purple-500/10"
                : "bg-black border-neutral-800 hover:border-neutral-700 text-white"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                resolution === "skip"
                  ? "border-purple-400 bg-black text-white"
                  : "border-neutral-600 bg-neutral-900"
              }`}
            >
              {resolution === "skip" && (
                <div className="w-2 h-2 rounded-full bg-purple-400" />
              )}
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-white">
                <FastForward
                  className={`w-3.5 h-3.5 ${
                    resolution === "skip" ? "text-white" : "text-white"
                  }`}
                />
                <span>Lewati yang Sudah Ada</span>
              </div>
              <p className="text-[11px] text-white">
                Hanya mengimpor dokumen-dokumen baru yang belum pernah ada di Memory Card.
              </p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
