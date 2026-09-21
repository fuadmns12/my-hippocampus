import React, { useState } from "react";
import { Upload, RefreshCw, Copy, FastForward, Sparkles } from "lucide-react";
import { ImportConflictResolution } from "../../types";
import { soundFx } from "../../utils/soundEffects";
import { UploadAiPromptGuideModal } from "./UploadAiPromptGuideModal";

interface UploadModalFooterProps {
  canApply: boolean;
  backupCount?: number;
  hasConflict?: boolean;
  resolution?: ImportConflictResolution;
  onClose: () => void;
  onApply: () => void;
}

export const UploadModalFooter: React.FC<UploadModalFooterProps> = ({
  canApply,
  backupCount,
  hasConflict = false,
  resolution = "overwrite",
  onClose,
  onApply,
}) => {
  const [isAiGuideOpen, setIsAiGuideOpen] = useState(false);

  const getButtonContent = () => {
    if (hasConflict) {
      if (resolution === "overwrite") {
        return {
          icon: <RefreshCw className="w-3.5 h-3.5" />,
          label:
            backupCount && backupCount > 1
              ? `Timpa Data Sama & Impor (${backupCount})`
              : "Timpa Data Lokal & Muat",
          bgClass:
            "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-cyan-500/20",
        };
      }
      if (resolution === "copy") {
        return {
          icon: <Copy className="w-3.5 h-3.5" />,
          label:
            backupCount && backupCount > 1
              ? `Simpan Salinan & Impor (${backupCount})`
              : "Simpan Salinan Baru & Muat",
          bgClass:
            "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20",
        };
      }
      if (resolution === "skip") {
        return {
          icon: <FastForward className="w-3.5 h-3.5" />,
          label: "Lewati Duplikat & Impor Baru",
          bgClass:
            "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/20",
        };
      }
    }

    return {
      icon: <Upload className="w-3.5 h-3.5" />,
      label:
        backupCount && backupCount > 1
          ? `Impor Semua (${backupCount}) & Muat`
          : "Terapkan ke Kanvas",
      bgClass:
        "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-cyan-500/20",
    };
  };

  const { icon, label } = getButtonContent();

  return (
    <>
      <div className="px-4 sm:px-5 py-3 border-t border-cyan-500/30 bg-black flex items-center justify-between gap-3 select-none">
        {/* Ikon Petunjuk di paling kiri */}
        <button
          id="btn-upload-ai-guide"
          type="button"
          onClick={() => {
            soundFx.play("click");
            setIsAiGuideOpen(true);
          }}
          title="Petunjuk & Prompt Gemini AI untuk Ubah Dokumen Word ke Format JSON"
          aria-label="Petunjuk Format AI Gemini"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider bg-black text-white border border-cyan-500/40 hover:bg-neutral-900 hover:text-white hover:border-cyan-400 transition-all duration-150 active:scale-95 cursor-pointer shadow-sm group"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Petunjuk Format AI</span>
          <span className="sm:hidden">Petunjuk</span>
        </button>

        {/* Tombol Aksi Kanan: Batal & Terapkan */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundFx.play("click");
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider bg-black text-neutral-300 border border-neutral-700/80 hover:bg-neutral-900 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-sm"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={!canApply}
            onClick={() => {
              soundFx.play("click");
              onApply();
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-150 active:scale-95 border cursor-pointer shadow-sm ${
              !canApply
                ? "bg-neutral-900/50 text-neutral-600 border-neutral-800 cursor-not-allowed"
                : "bg-black text-white border-cyan-500/50 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white"
            }`}
          >
            {icon}
            <span>{label.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* Modal Petunjuk & Prompt Gemini AI */}
      <UploadAiPromptGuideModal
        isOpen={isAiGuideOpen}
        onClose={() => setIsAiGuideOpen(false)}
      />
    </>
  );
};

