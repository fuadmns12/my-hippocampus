import React, { useEffect } from "react";
import { ArrowLeft, Terminal, AlertTriangle, Compass, ShieldAlert } from "lucide-react";
import { MechanicalButton } from "./MechanicalButton";
import { soundFx } from "../../utils/soundEffects";

interface NotFoundScreenProps {
  currentPath: string;
  onReturnToHome: () => void;
}

export const NotFoundScreen: React.FC<NotFoundScreenProps> = ({
  currentPath,
  onReturnToHome,
}) => {
  // Shortcut keyboard Enter atau Escape untuk langsung kembali ke kanvas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape") {
        soundFx.play("click");
        onReturnToHome();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onReturnToHome]);

  const handleReturn = () => {
    soundFx.play("click");
    onReturnToHome();
  };

  return (
    <div
      id="screen-404-not-found"
      className="fixed inset-0 z-[10000] bg-black flex items-center justify-center p-4 sm:p-6 select-none overflow-y-auto"
    >
      {/* Background Subtle Cyber Grid & Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Mechanical Panel Card */}
      <div className="relative w-full max-w-lg bg-neutral-950/90 border border-neutral-800 hover:border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-md transition-colors duration-300">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse inline-block shadow-xs shadow-rose-500/50" />
            <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
              ERR_ROUTE_DISCONNECTED
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-500/30 px-2 py-0.5 rounded">
            <Terminal className="w-3 h-3" />
            <span>HIPPOCAMPUS_CORE_v1.0</span>
          </div>
        </div>

        {/* 404 Hero Visual */}
        <div className="text-center space-y-3 py-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-rose-400 mb-1">
            <ShieldAlert className="w-8 h-8 text-rose-500" />
          </div>

          <div className="space-y-1">
            <div className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-white flex items-center justify-center gap-1">
              <span className="text-neutral-500">4</span>
              <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                0
              </span>
              <span className="text-neutral-500">4</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-wide text-white">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
              Jalur URL yang Anda tuju tidak terdaftar dalam rute kanvas My Hippocampus.
            </p>
          </div>
        </div>

        {/* Route Details Box */}
        <div className="mt-6 p-3.5 rounded-xl bg-black border border-neutral-800/90 text-left font-mono space-y-2">
          <div className="flex items-start justify-between gap-2 text-xs">
            <span className="text-neutral-500 shrink-0">REQUEST_PATH:</span>
            <span className="text-rose-400 truncate max-w-[260px] text-right font-medium">
              {currentPath || "/"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-900">
            <span className="text-neutral-500">STATUS:</span>
            <span className="text-cyan-400">404 NOT_FOUND</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-900">
            <span className="text-neutral-500">MODE:</span>
            <span className="text-neutral-300">Single Page Canvas (SPA)</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <MechanicalButton
            id="btn-return-from-404"
            type="button"
            size="md"
            variant="cyan"
            fullWidth
            onClick={handleReturn}
            icon={<ArrowLeft className="w-4 h-4 text-cyan-400" />}
            title="Kembali ke Kanvas Utama Mind Map"
          >
            KEMBALI KE MIND MAP
          </MechanicalButton>
        </div>

        {/* Hint Key */}
        <p className="mt-4 text-center text-[10px] font-mono text-neutral-500">
          Tekan <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-300">Enter</kbd> atau klik tombol untuk kembali
        </p>
      </div>
    </div>
  );
};
