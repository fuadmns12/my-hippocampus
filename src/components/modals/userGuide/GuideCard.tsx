import React from "react";
import { Info, Type } from "lucide-react";
import { GuideItem } from "./types";

interface GuideCardProps {
  item: GuideItem;
}

export const GuideCard: React.FC<GuideCardProps> = ({ item }) => {
  return (
    <div
      id={`guide-card-${item.id}`}
      className="bg-black rounded-2xl border border-neutral-800 hover:border-cyan-500/50 p-4 transition-all flex flex-col justify-between group shadow-sm hover:shadow-cyan-950/40 h-[460px] sm:h-[480px] w-full relative overflow-hidden select-text"
    >
      {/* Bagian Atas & Konten Utama */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Item Header */}
        <div className="flex flex-col items-start gap-2 mb-2 shrink-0">
          <div className="self-center p-2 rounded-xl bg-black border border-neutral-800 group-hover:border-cyan-500/40 transition-colors shrink-0 text-white">
            {item.icon}
          </div>
          <h3
            className="font-bold text-white tracking-tight text-sm sm:text-base leading-tight w-full"
            title={item.title}
          >
            {item.title}
          </h3>
        </div>

        {/* Ringkasan Topik */}
        <p className="text-xs leading-relaxed text-neutral-300 mb-2.5 shrink-0">
          {item.summary}
        </p>

        {/* Kotak Rincian Langkah-Langkah Penggunaan */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-neutral-800/80 bg-black p-2.5 sm:p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-neutral-800">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-neutral-400 pb-0.5 border-b border-neutral-900">
            <span className="flex items-center gap-1 text-white">
              <Type className="w-3 h-3 text-white" />
              Langkah Penggunaan:
            </span>
            <span className="text-[9px] font-mono text-neutral-300">
              {item.steps.length} Langkah
            </span>
          </div>

          {item.steps.map((step, idx) => {
            const startsWithNumber = /^\s*(\d+[\.\):]|\(\d+\)|\d+\s)/.test(step);
            const hasCustomBullet = /^\s*•/.test(step);
            const showBullet = !startsWithNumber && !hasCustomBullet;
            const cleanStep = step.replace(/^\s*•\s*/, "");

            return (
              <div
                key={idx}
                className="text-xs leading-relaxed text-white flex items-start gap-1.5"
              >
                {showBullet && (
                  <span className="text-white font-bold select-none shrink-0">•</span>
                )}
                <span className="text-neutral-200">{cleanStep}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bagian Bawah: Tips Singkat */}
      <div className="mt-2.5 pt-2 border-t border-neutral-900 shrink-0">
        {item.tips ? (
          <div className="text-[11px] leading-snug text-neutral-300 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
            <span>
              <strong className="text-white">Tips:</strong> {item.tips}
            </span>
          </div>
        ) : (
          <div className="text-[10px] text-neutral-400 flex items-center gap-1 italic">
            <span>Panduan interaktif siap pakai</span>
          </div>
        )}
      </div>
    </div>
  );
};
