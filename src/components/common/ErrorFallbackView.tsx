import React, { useState } from "react";
import { AlertOctagon, RefreshCw, RotateCcw, Copy, Check, Terminal, Download } from "lucide-react";
import { MechanicalButton } from "./MechanicalButton";
import { soundFx } from "../../utils/soundEffects";
import { copyToClipboard } from "../../utils/clipboardHelper";

interface ErrorFallbackViewProps {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  onReset: () => void;
}

export const ErrorFallbackView: React.FC<ErrorFallbackViewProps> = ({
  error,
  errorInfo,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleReload = () => {
    soundFx.play("click");
    window.location.reload();
  };

  const handleReset = () => {
    soundFx.play("click");
    onReset();
  };

  const handleCopyReport = async () => {
    soundFx.play("click");
    const report = [
      `=== MY HIPPOCAMPUS CRASH REPORT ===`,
      `Time: ${new Date().toISOString()}`,
      `Error Name: ${error?.name || "Unknown"}`,
      `Error Message: ${error?.message || "No message available"}`,
      `Stack Trace:\n${error?.stack || "N/A"}`,
      `Component Stack:\n${errorInfo?.componentStack || "N/A"}`,
    ].join("\n\n");

    const success = await copyToClipboard(report);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleEmergencyBackup = () => {
    soundFx.play("click");
    try {
      const dump: Record<string, string | null> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes("mindmap") || key.includes("memory") || key.includes("my_hippocampus") || key.includes("hippocampus"))) {
          dump[key] = localStorage.getItem(key);
        }
      }
      const blob = new Blob([JSON.stringify(dump, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hippocampus-emergency-backup-${new Date().toISOString().slice(0, 19)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      id="screen-global-error-fallback"
      className="fixed inset-0 z-[100000] bg-black flex items-center justify-center p-4 sm:p-6 select-none overflow-y-auto"
    >
      {/* Background Cyber Mesh & Accent Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Panel Card */}
      <div className="relative w-full max-w-xl bg-neutral-950/95 border border-neutral-800 hover:border-rose-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/90 backdrop-blur-md transition-colors duration-300">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-neutral-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse inline-block shadow-xs shadow-rose-500/50" />
            <span className="text-[11px] font-mono tracking-widest text-rose-400 uppercase font-semibold">
              SYSTEM_FAULT_INTERCEPTED
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
            <Terminal className="w-3 h-3 text-cyan-400" />
            <span>ERROR_BOUNDARY</span>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="text-center space-y-3 py-1">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-400 mb-1">
            <AlertOctagon className="w-8 h-8 text-rose-500" />
          </div>

          <div className="space-y-1">
            <h1 className="text-lg sm:text-xl font-bold tracking-wide text-white">
              Terjadi Kesalahan Tak Terduga
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
              Komponen aplikasi mengalami kendala saat merender kanvas. Data Anda di
              penyimpanan lokal tetap aman.
            </p>
          </div>
        </div>

        {/* Brief Error Banner */}
        <div className="mt-5 p-3.5 rounded-xl bg-black border border-neutral-800 text-left font-mono space-y-1.5">
          <div className="text-[11px] text-neutral-500">PESAN KESALAHAN:</div>
          <div className="text-xs text-rose-400 font-semibold break-words">
            {error?.message || "Kesalahan internal React runtime."}
          </div>
        </div>

        {/* Collapsible Technical Details */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
          >
            {showDetails ? "Sembunyikan Detail Teknis ▲" : "Lihat Detail Stack Trace ▼"}
          </button>

          {showDetails && (
            <pre className="mt-2 p-3 bg-neutral-900/80 border border-neutral-800 rounded-xl text-[10px] font-mono text-neutral-300 max-h-40 overflow-y-auto whitespace-pre-wrap select-text">
              {error?.stack || "Tidak ada stack trace."}
              {errorInfo?.componentStack && `\n\nComponent Hierarchy:${errorInfo.componentStack}`}
            </pre>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <MechanicalButton
            id="btn-error-reset-state"
            type="button"
            size="sm"
            variant="cyan"
            onClick={handleReset}
            icon={<RotateCcw className="w-3.5 h-3.5 text-cyan-400" />}
            title="Coba pulihkan tampilan kanvas tanpa memuat ulang browser"
          >
            PULIHKAN TAMPILAN
          </MechanicalButton>

          <MechanicalButton
            id="btn-error-reload-page"
            type="button"
            size="sm"
            variant="neutral"
            onClick={handleReload}
            icon={<RefreshCw className="w-3.5 h-3.5 text-white" />}
            title="Muat ulang halaman website dari awal"
          >
            MUAT ULANG HALAMAN
          </MechanicalButton>
        </div>

        {/* Auxiliary Recovery Utilities */}
        <div className="mt-4 pt-4 border-t border-neutral-900 flex flex-wrap items-center justify-between gap-2 text-xs">
          <button
            type="button"
            onClick={handleEmergencyBackup}
            className="inline-flex items-center gap-1.5 text-[11px] text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
            title="Unduh backup darurat data mind map yang tersimpan di browser"
          >
            <Download className="w-3 h-3" />
            <span>Unduh Cadangan Darurat (.json)</span>
          </button>

          <button
            type="button"
            onClick={handleCopyReport}
            className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Salin laporan crash ke clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Salin Laporan Error</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
