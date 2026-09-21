import React from "react";
import { Trash2, CheckCircle2, AlertCircle, FileCode, ListTree } from "lucide-react";
import { soundFx } from "../../utils/soundEffects";

interface UploadDirectPasteProps {
  pastedText: string;
  onPastedTextChange: (text: string) => void;
  isParsedSuccess: boolean;
  errorMsg: string | null;
}

export const UploadDirectPaste: React.FC<UploadDirectPasteProps> = ({
  pastedText,
  onPastedTextChange,
  isParsedSuccess,
  errorMsg,
}) => {
  const handleClear = () => {
    soundFx.play("click");
    onPastedTextChange("");
  };

  const lineCount = pastedText ? pastedText.split(/\r?\n/).length : 0;
  const charCount = pastedText.length;

  return (
    <div className="space-y-3 select-none">
      {/* Action bar above textarea */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-neutral-400">
          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-neutral-200">Tempel JSON atau Outline Teks</span>
          {lineCount > 0 && (
            <span className="text-[10px] text-cyan-400/80 font-mono bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/20">
              {lineCount} baris ({charCount} karakter)
            </span>
          )}
        </div>

        {pastedText.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-neutral-400 hover:text-red-400 hover:bg-red-950/20 border border-neutral-800 transition-colors cursor-pointer"
              title="Bersihkan Teks"
            >
              <Trash2 className="w-3 h-3" />
              <span>Bersihkan</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          value={pastedText}
          onChange={(e) => onPastedTextChange(e.target.value)}
          placeholder={`Salin hasil dari Gemini lalu tekan Ctrl + V di sini...\n\nFormat didukung:\n1. Kode JSON (misal: { "title": "Topik", "root": { ... } } atau blok \`\`\`json)\n2. Outline Teks / Markdown:\n   # Judul Mind Map\n   - Cabang Pertama\n     - Sub-cabang 1\n   - Cabang Kedua`}
          rows={7}
          className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-neutral-950 text-neutral-100 border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 focus:outline-none placeholder:text-neutral-500/80 transition-all resize-y select-text leading-relaxed"
        />

        {/* Status indicator badge inside textarea footer */}
        {pastedText.trim().length > 0 && (
          <div className="mt-1 flex items-center justify-between text-[11px]">
            {isParsedSuccess ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                Data berhasil dikenali & siap diterapkan ke kanvas
              </span>
            ) : errorMsg ? (
              <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                <AlertCircle className="w-3 h-3" />
                Menunggu struktur JSON atau outline valid
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-neutral-400">
                <ListTree className="w-3 h-3 text-cyan-400" />
                Menganalisis format konten...
              </span>
            )}
          </div>
        )}
      </div>

      {/* Format Tips Helper */}
      <div className="p-2 rounded-xl bg-black border border-neutral-800/80 text-[11px] text-neutral-400 flex items-center justify-between gap-2">
        <span className="text-neutral-400">
          💡 <strong className="text-neutral-200">Tips Gemini:</strong> Cukup salin seluruh respons dari Gemini, pembungkus <code className="text-cyan-400 font-mono">```json</code> otomatis dibersihkan.
        </span>
      </div>
    </div>
  );
};
