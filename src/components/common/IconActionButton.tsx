import React from "react";
import { useThemeMode } from "../../context/ThemeModeContext";

export interface IconActionButtonProps {
  /** ID unik tombol (juga dipakai selector CSS & skenario panduan otomatis). */
  id: string;
  /** Tooltip tombol; sekaligus dipakai sebagai `aria-label` bila `ariaLabel` tidak diberikan. */
  title: string;
  /** Label aksesibilitas eksplisit (opsional, default mengikuti `title`). */
  ariaLabel?: string;
  /** Status aktif tombol (mis. sedang berada dalam mode layar penuh). */
  isActive: boolean;
  /** Ikon Lucide yang dirender; ukuran dan warna diatur otomatis agar seragam. */
  icon: React.ComponentType<{ className?: string }>;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Kelas tambahan bila tombol perlu penyesuaian tata letak di induknya. */
  className?: string;
}

/**
 * Tombol aksi ikon-only dengan gaya kontrol kanvas (rounded-xl, border aksen cyan,
 * backdrop blur, efek tekan `active:scale-95`). Dipakai bersama oleh dua mode layar penuh:
 * 1. `#btn-canvas-fullscreen-toggle` — Mode Kanvas Fokus di pojok kanan atas kanvas.
 * 2. `#btn-fullscreen-page` — Layar Penuh Seluruh Halaman di header.
 *
 * Sesuai `Document/Umum/PANDUAN_PENGGUNAAN_IKON.md`, tombol ikon-only WAJIB memiliki
 * atribut `title` dan `aria-label` agar tetap dapat diakses tanpa label teks.
 */
export const IconActionButton: React.FC<IconActionButtonProps> = ({
  id,
  title,
  ariaLabel,
  isActive,
  icon: Icon,
  onClick,
  className = "",
}) => {
  const { isLight } = useThemeMode();

  const surfaceClass = isActive
    ? isLight
      ? "bg-white text-amber-700 border-amber-400 hover:bg-amber-50"
      : "bg-black text-white border-amber-500/40 hover:bg-neutral-900 hover:border-amber-400"
    : isLight
    ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-cyan-500 hover:text-cyan-700 shadow-slate-200/50"
    : "bg-black text-white border border-cyan-500/40 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white";

  const iconColorClass = isActive
    ? isLight
      ? "text-amber-600"
      : "text-cyan-400"
    : isLight
    ? "text-slate-700"
    : "text-white";

  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      title={title}
      aria-label={ariaLabel || title}
      className={`inline-flex items-center justify-center p-2 rounded-xl transition-all duration-150 active:scale-95 shadow-lg border backdrop-blur-md cursor-pointer select-none ${surfaceClass} ${className}`}
    >
      <Icon className={`w-4 h-4 shrink-0 ${iconColorClass}`} />
    </button>
  );
};
