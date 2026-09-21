import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface HeaderCollapseTabsProps {
  isCollapsed: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}

export const HeaderCollapseTabs: React.FC<HeaderCollapseTabsProps> = ({
  isCollapsed,
  onExpand,
  onCollapse,
}) => {
  if (isCollapsed) {
    return (
      <div className="header-expand-tab-container fixed top-0 inset-x-0 w-full flex justify-center items-center z-50 pointer-events-none">
        <button
          id="btn-header-expand"
          type="button"
          onClick={onExpand}
          title="Tampilkan Header (Klik untuk membuka menu)"
          aria-label="Tampilkan Header (Klik untuk membuka menu)"
          className="pointer-events-auto group flex items-center justify-center px-4 py-1 bg-neutral-950/95 hover:bg-neutral-900 text-cyan-400 hover:text-cyan-200 border-x border-b border-cyan-400/80 hover:border-cyan-300 rounded-b-lg shadow-[0_4px_14px_rgba(6,182,212,0.4)] hover:shadow-[0_4px_18px_rgba(6,182,212,0.65)] transition-all duration-150 cursor-pointer backdrop-blur-md"
        >
          <ChevronDown
            className="w-4 h-4 text-cyan-400 group-hover:text-cyan-200 transition-transform duration-150 group-hover:translate-y-0.5"
            strokeWidth={2.5}
          />
        </button>
      </div>
    );
  }

  return (
    <div className="header-collapse-tab-container absolute top-full inset-x-0 w-full flex justify-center items-center z-40 pointer-events-none -mt-px">
      <button
        id="btn-header-collapse"
        type="button"
        onClick={onCollapse}
        title="Sembunyikan Header (Klik untuk memperluas area kanvas)"
        aria-label="Sembunyikan Header (Klik untuk memperluas area kanvas)"
        className="pointer-events-auto group flex items-center justify-center px-4 py-1 bg-neutral-950/95 hover:bg-neutral-900 text-cyan-400 hover:text-cyan-200 border-x border-b border-cyan-400/80 hover:border-cyan-300 rounded-b-lg shadow-[0_4px_14px_rgba(6,182,212,0.35)] hover:shadow-[0_4px_18px_rgba(6,182,212,0.6)] transition-all duration-150 cursor-pointer backdrop-blur-md"
      >
        <ChevronUp
          className="w-4 h-4 text-cyan-400 group-hover:text-cyan-200 transition-transform duration-150 group-hover:-translate-y-0.5"
          strokeWidth={2.5}
        />
      </button>
    </div>
  );
};


