import React from "react";
import { ExternalLink } from "lucide-react";

export const PromptGuideStepsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
      <div className="p-3 rounded-xl bg-neutral-900/70 border border-cyan-500/20 flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-[11px] flex items-center justify-center font-bold">
            1
          </span>
          <span className="font-semibold text-white">Salin Prompt</span>
        </div>
        <p className="text-[11px] text-neutral-400 leading-relaxed">
          Salin template prompt Gemini AI yang sudah dirancang khusus di bawah ini.
        </p>
      </div>

      <div className="p-3 rounded-xl bg-neutral-900/70 border border-cyan-500/20 flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-[11px] flex items-center justify-center font-bold">
            2
          </span>
          <span className="font-semibold text-white">Buka Gemini AI</span>
        </div>
        <p className="text-[11px] text-neutral-400 leading-relaxed">
          Kirim prompt beserta materi / dokumen Word Anda ke{" "}
          <a
            href="https://gemini.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline inline-flex items-center gap-0.5"
          >
            gemini.google.com <ExternalLink className="w-2.5 h-2.5" />
          </a>.
        </p>
      </div>

      <div className="p-3 rounded-xl bg-neutral-900/70 border border-cyan-500/20 flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-[11px] flex items-center justify-center font-bold">
            3
          </span>
          <span className="font-semibold text-white">Impor ke Kanvas</span>
        </div>
        <p className="text-[11px] text-neutral-400 leading-relaxed">
          Simpan respon JSON sebagai file <code className="text-cyan-300">.json</code> lalu seret ke kotak upload!
        </p>
      </div>
    </div>
  );
};
