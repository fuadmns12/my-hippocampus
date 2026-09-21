import React from "react";

export const HeaderBrand: React.FC = () => {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-blue-500 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center shrink-0">
        <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center overflow-hidden p-0.5">
          <img
            src="/brain-logo.webp"
            alt="My Hippocampus Logo"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
      <div>
        <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
          My Hippocampus
        </h1>
        <p className="text-xs text-white hidden sm:block leading-tight">
          Mapping Note &amp; Visualisasi Interaktif
        </p>
      </div>
    </div>
  );
};
