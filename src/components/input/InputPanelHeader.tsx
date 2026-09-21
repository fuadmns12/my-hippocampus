import React from "react";
import { ChevronDown, ChevronUp, Edit3, PlusCircle } from "lucide-react";
import { soundFx } from "../../utils/soundEffects";

interface InputPanelHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isEditingMode?: boolean;
  activeTitle?: string;
  onResetNew?: () => void;
}

export const InputPanelHeader: React.FC<InputPanelHeaderProps> = ({
  isCollapsed,
  onToggleCollapse,
  isEditingMode = false,
  activeTitle,
  onResetNew,
}) => {
  const handleToggle = () => {
    soundFx.play("toggle");
    onToggleCollapse();
  };

  return (
    <div
      id="input-panel-header"
      className={`px-4 sm:px-5 py-3 sm:py-3.5 bg-black flex flex-wrap items-center justify-between gap-2 select-none ${
        isCollapsed ? "" : "border-b border-cyan-500/30"
      }`}
    >
      <div
        onClick={handleToggle}
        className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-[240px]"
        title={isCollapsed ? "Klik untuk membuka form input" : "Klik untuk melipat form input"}
      >
        <div
          className={`p-1.5 rounded-lg border shrink-0 ${
            isEditingMode
              ? "bg-black border-teal-500/50 text-white shadow-sm shadow-teal-500/20"
              : "bg-black border-cyan-500/40 text-white"
          }`}
        >
          {isEditingMode ? (
            <Edit3 className="w-4 h-4 text-cyan-400" />
          ) : (
            <PlusCircle className="w-4 h-4 text-white" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              {isEditingMode ? "Tempat Edit Mind Map" : "Input Daftar Nama & Buat Mind Map"}
            </h2>
          </div>
          <p className="text-[11px] text-white mt-0.5">
            {isCollapsed
              ? "Form dilipat. Klik untuk membuka panel formulir."
              : isEditingMode
              ? `Sedang mengedit "${activeTitle || "Mind Map"}". Ubah topik, daftar nama, atau strategi lalu perbarui kanvas.`
              : "Masukkan topik dan daftar nama untuk membentuk visual mind map otomatis."}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {isEditingMode && onResetNew && (
          <button
            id="btn-input-header-reset-new"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFx.play("click");
              onResetNew();
            }}
            title="Kosongkan form untuk membuat Mind Map baru dari awal"
            aria-label="Mulai Peta Baru"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold tracking-wider bg-black text-white border border-cyan-500/40 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">MULAI PETA BARU</span>
            <span className="sm:hidden">BARU</span>
          </button>
        )}

        <button
          id="btn-input-header-collapse-toggle"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
          className="p-1.5 rounded-lg bg-black border border-cyan-400 hover:border-cyan-300 text-cyan-400 hover:text-cyan-300 hover:bg-neutral-900 transition-colors cursor-pointer flex items-center justify-center shadow-xs"
          title={isCollapsed ? "Buka panel input" : "Tutup panel input"}
          aria-label={isCollapsed ? "Buka panel" : "Tutup panel"}
        >
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4 text-cyan-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-cyan-400" />
          )}
        </button>
      </div>
    </div>
  );
};
