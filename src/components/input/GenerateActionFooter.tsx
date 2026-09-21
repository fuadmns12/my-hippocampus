import React from "react";
import { Network, RefreshCw, PlusCircle, Loader2 } from "lucide-react";
import { soundFx } from "../../utils/soundEffects";

interface GenerateActionFooterProps {
  title?: string;
  namesCount: number;
  isAiLoading: boolean;
  onGenerate: () => void;
  onAddToCanvas?: () => void;
  isEditingMode?: boolean;
  onResetNew?: () => void;
}

export const GenerateActionFooter: React.FC<GenerateActionFooterProps> = ({
  title,
  namesCount,
  isAiLoading,
  onGenerate,
  onAddToCanvas,
  isEditingMode = false,
  onResetNew,
}) => {
  const hasValidTitle = Boolean(title && title.trim().length > 0);
  const isGenerateDisabled = isAiLoading || (!hasValidTitle && namesCount === 0);
  const isAddDisabled = isAiLoading || (!hasValidTitle && namesCount === 0);

  return (
    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 select-none">
      {/* Edit mode hint or status */}
      <div className="text-xs text-white flex items-center gap-1.5" />

      <div className="flex flex-wrap items-center gap-2.5 justify-end">
        {isEditingMode && onResetNew && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFx.play("click");
              onResetNew();
            }}
            title="Kosongkan form untuk mulai mengetik mind map baru"
            aria-label="Mulai Baru"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider bg-black text-neutral-300 border border-neutral-700/80 hover:bg-neutral-900 hover:border-neutral-500 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5 text-white" />
            <span>Mulai Baru</span>
          </button>
        )}

        {/* Tambah sebagai Mind Map Baru ke Kanvas */}
        {isEditingMode && onAddToCanvas && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFx.play("click");
              onAddToCanvas();
            }}
            disabled={isAddDisabled}
            title="Tambahkan sebagai mind map mandiri baru di kanvas tanpa menghapus mind map yang sudah ada"
            aria-label="Peta Baru"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-150 active:scale-95 border cursor-pointer shadow-sm ${
              isAddDisabled
                ? "bg-neutral-900/50 text-neutral-600 border-neutral-800 cursor-not-allowed"
                : "bg-black text-white border-cyan-500/40 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-white" />
            <span>Peta Baru</span>
          </button>
        )}

        <button
          id="btn-generate-mindmap"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            soundFx.play("click");
            onGenerate();
          }}
          disabled={isGenerateDisabled}
          title={
            isAiLoading
              ? "Sedang Mengolah Mind Map..."
              : isEditingMode
              ? namesCount === 0
                ? "Terapkan Perubahan Topik"
                : `Perbarui Mind Map Ini (${namesCount} Nama)`
              : namesCount === 0
              ? "Buat Mind Map (Topik Saja)"
              : `Buat Mind Map Baru (${namesCount} Nama)`
          }
          aria-label={
            isAiLoading
              ? "Sedang Mengolah Mind Map"
              : isEditingMode
              ? "Perbarui Mind Map"
              : "Buat Mind Map"
          }
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-150 active:scale-95 border shadow-md cursor-pointer ${
            isGenerateDisabled
              ? "bg-neutral-900/50 text-neutral-600 border-neutral-800 cursor-not-allowed"
              : isEditingMode
              ? "bg-black text-white border-cyan-500/50 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white shadow-cyan-950/50"
              : "bg-black text-white border-cyan-500/50 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white shadow-cyan-950/50"
          }`}
        >
          {isAiLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : isEditingMode ? (
            <RefreshCw className="w-4 h-4 text-white" />
          ) : (
            <Network className="w-4 h-4 text-white" />
          )}
          <span>
            {isAiLoading
              ? "MENGOLAH..."
              : isEditingMode
              ? namesCount === 0
                ? "TERAPKAN TOPIK"
                : `PERBARUI (${namesCount})`
              : namesCount === 0
              ? "BUAT TOPIK SAJA"
              : `BUAT PETA (${namesCount})`}
          </span>
        </button>
      </div>
    </div>
  );
};
