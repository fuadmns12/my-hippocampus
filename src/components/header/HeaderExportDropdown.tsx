import React, { useEffect } from "react";
import {
  Download,
  Image as ImageIcon,
  FileCode,
  FileText,
  X,
} from "lucide-react";
import { MechanicalButton } from "../common/MechanicalButton";
import { soundFx } from "../../utils/soundEffects";

interface HeaderExportDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onExportPdf: () => void;
  onExportPng: () => void;
  onExportSvg: () => void;
  onExportMarkdown: () => void;
  onExportJson: () => void;
}

export const HeaderExportDropdown: React.FC<HeaderExportDropdownProps> = ({
  isOpen,
  onToggle,
  onClose,
  onExportPdf,
  onExportPng,
  onExportSvg,
  onExportMarkdown,
  onExportJson,
}) => {
  // Close on ESC key matching Memory Card & Preset drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleAction = (action: () => void) => {
    soundFx.play("click");
    action();
    onClose();
  };

  return (
    <>
      <MechanicalButton
        id="btn-export-dropdown"
        type="button"
        size="xs"
        variant="cyan"
        active={isOpen}
        onClick={onToggle}
        title="Unduh Mind Map dalam Berbagai Format"
        icon={
          <Download
            className={`w-3.5 h-3.5 ${
              isOpen ? "text-cyan-400" : "text-white"
            }`}
          />
        }
      >
        UNDUH
      </MechanicalButton>

      {/* Export Drawer Overlay - Matching Memory Card (HistoryDrawer) */}
      {isOpen && (
        <div
          id="export-drawer-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
          className="fixed inset-0 z-[10000] flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in select-none"
        >
          <div
            id="export-drawer-panel"
            onClick={(e) => e.stopPropagation()}
            className="bg-black border-l border-cyan-500/40 w-full sm:max-w-md h-full flex flex-col shadow-2xl animate-slide-in-right"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-black text-white border border-cyan-500/30 shadow-sm shadow-cyan-500/20">
                  <Download className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Unduh Mind Map</span>
                  </h2>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Pilih format berkas untuk mengekspor mind map Anda
                  </p>
                </div>
              </div>

              <button
                id="close-export-drawer-btn"
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg bg-black border border-cyan-400 hover:border-cyan-300 text-cyan-400 hover:text-cyan-300 hover:bg-neutral-900 transition-colors cursor-pointer shadow-xs flex items-center justify-center"
                title="Tutup Menu Unduh"
                aria-label="Tutup"
              >
                <X className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            {/* List of Export Options */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5 bg-black">
              {[
                {
                  id: "btn-export-pdf",
                  title: "Dokumen PDF",
                  icon: FileText,
                  action: onExportPdf,
                },
                {
                  id: "btn-export-png",
                  title: "Gambar PNG",
                  icon: ImageIcon,
                  action: onExportPng,
                },
                {
                  id: "btn-export-svg",
                  title: "Vektor SVG",
                  icon: FileCode,
                  action: onExportSvg,
                },
                {
                  id: "btn-export-markdown",
                  title: "Outline Markdown (.md)",
                  icon: FileText,
                  action: onExportMarkdown,
                },
                {
                  id: "btn-export-json",
                  title: "Data JSON (.json)",
                  icon: FileCode,
                  action: onExportJson,
                },
              ].map((opt) => {
                const IconComponent = opt.icon;
                return (
                  <button
                    key={opt.id}
                    id={opt.id}
                    type="button"
                    onClick={() => handleAction(opt.action)}
                    className="w-full text-left p-3 rounded-xl bg-black border border-cyan-500/30 hover:border-cyan-400 hover:bg-neutral-900/80 transition-all duration-150 cursor-pointer shadow-xs group flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-black border border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400 transition-colors">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-xs text-white">
                        {opt.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
