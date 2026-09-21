import React from "react";
import { Network, FolderOpen } from "lucide-react";
import { PresetTemplate } from "../../types";
import { PRESET_TEMPLATES } from "../../data/presets";
import { soundFx } from "../../utils/soundEffects";

interface EmptyCanvasStateProps {
  onStartWithMainTopicOnly: () => void;
  onGenerateAll?: () => void;
  namesCount: number;
  topicTitle?: string;
  onSelectPreset: (preset: PresetTemplate) => void;
}

export const EmptyCanvasState: React.FC<EmptyCanvasStateProps> = ({
  onStartWithMainTopicOnly,
  onGenerateAll,
  namesCount,
  topicTitle = "Topik Utama",
  onSelectPreset,
}) => {
  return (
    <div
      id="empty-canvas-container"
      className="w-full min-h-[500px] sm:min-h-[580px] rounded-2xl border-2 border-dashed border-cyan-500/25 bg-black p-6 sm:p-10 flex flex-col items-center justify-center text-center backdrop-blur-sm relative overflow-hidden"
    >
      {/* Subtle background */}
      <div className="absolute inset-0 bg-black pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black border border-cyan-500/40 flex items-center justify-center shadow-xl shadow-cyan-500/10 mb-6">
          <Network className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>

        {/* Action Buttons: Primary Start with Main Topic Only, Secondary Create with Branches */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 w-full ${namesCount > 0 && onGenerateAll ? "max-w-xl" : "max-w-sm sm:max-w-md"} mx-auto select-none`}>
          <button
            id="btn-empty-generate"
            type="button"
            onClick={() => {
              soundFx.play("spawn");
              onStartWithMainTopicOnly();
            }}
            title="Mulai Topik Utama Saja"
            aria-label="Mulai Topik Utama Saja"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider bg-black text-white border border-cyan-500/50 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-md shadow-cyan-950/50"
          >
            <span>TOPIK UTAMA SAJA</span>
          </button>

          {namesCount > 0 && onGenerateAll && (
            <button
              id="btn-empty-generate-all"
              type="button"
              onClick={() => {
                soundFx.play("spawn");
                onGenerateAll();
              }}
              title={`Buat mind map lengkap bersama seluruh ${namesCount} cabang item`}
              aria-label={`Buat mind map lengkap bersama seluruh ${namesCount} cabang item`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider bg-black text-white border border-cyan-500/50 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-md shadow-cyan-950/50"
            >
              <Network className="w-4 h-4 text-white" />
              <span>BUAT LENGKAP ({namesCount})</span>
            </button>
          )}
        </div>

        {/* Quick preset suggestion */}
        <div className="mt-8 pt-6 border-t border-neutral-800/80 w-full">
          <p className="text-xs font-semibold text-white mb-3 flex items-center justify-center gap-1.5">
            <FolderOpen className="w-3.5 h-3.5 text-white" />
            <span>Atau muat contoh template siap pakai:</span>
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {PRESET_TEMPLATES.slice(0, 3).map((p) => (
              <button
                key={p.id}
                id={`btn-preset-quick-${p.id}`}
                type="button"
                onClick={() => {
                  soundFx.play("pop");
                  onSelectPreset(p);
                }}
                className="px-3 py-1.5 text-xs font-medium text-white hover:text-white bg-black hover:bg-neutral-900 border border-neutral-700/80 hover:border-cyan-500/50 rounded-lg shadow-sm transition-all duration-150 cursor-pointer text-center"
              >
                <span>{p.title}</span>
                <span className="ml-1 text-white font-mono text-[11px]">({p.names.length})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
