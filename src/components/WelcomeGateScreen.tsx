import React, { useEffect, useState } from "react";
import { soundFx } from "../utils/soundEffects";
import { MechanicalButton } from "./common/MechanicalButton";
import { useAutoFitScale } from "../hooks/useAutoFitScale";

interface WelcomeGateScreenProps {
  onEnter: () => void;
}

export const WelcomeGateScreen: React.FC<WelcomeGateScreenProps> = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);
  const { containerRef, contentRef, scale, naturalHeight } = useAutoFitScale({
    maxCardWidth: 576,
    screenPaddingY: 28,
    screenPaddingX: 20,
    minScale: 0.35,
  });

  const handleTriggerEnter = () => {
    soundFx.unlockAudio();
    soundFx.play("pop");
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 350);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleTriggerEnter();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      id="welcome-gate-screen"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-3 sm:p-6 bg-black text-white select-none transition-all duration-300 ${
        isExiting ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Background Ambient Glow & Dot Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-[90px] pointer-events-none" />
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="gateDotGrid"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="14" cy="14" r="1.5" fill="#06b6d4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gateDotGrid)" />
        </svg>
      </div>

      {/* Main Container Card - No vertical scroll, auto-scales content interactively if needed */}
      <div
        ref={containerRef}
        id="welcome-card-wrap"
        className="relative max-w-lg sm:max-w-xl w-full mx-auto bg-black border border-cyan-500/60 rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl shadow-cyan-950/80 flex flex-col items-center justify-center text-center z-10 backdrop-blur-md overflow-hidden"
        style={{
          maxHeight: "calc(100dvh - 1.5rem)",
        }}
      >
        {/* Dynamic sizer to keep card bounds tightly wrapping scaled content without scroll */}
        <div
          className="w-full flex items-center justify-center relative overflow-hidden"
          style={{
            height: scale < 1 && naturalHeight > 0 ? `${Math.ceil(naturalHeight * scale)}px` : "auto",
            width: "100%",
          }}
        >
          {/* Scalable Inner Content */}
          <div
            ref={contentRef}
            style={{
              transform: scale < 1 ? `translate(-50%, -50%) scale(${scale})` : "scale(1)",
              transformOrigin: "center center",
              width: "100%",
              maxWidth: "480px",
              transition: "transform 0.12s ease-out",
              position: scale < 1 ? "absolute" : "relative",
              top: scale < 1 ? "50%" : undefined,
              left: scale < 1 ? "50%" : undefined,
            }}
            className="flex flex-col items-center text-center space-y-5 sm:space-y-6 select-none shrink-0 pt-2 pb-1"
          >
            {/* Animated App Icon with 360-degree ambient glow */}
            <div className="relative group cursor-pointer mt-1" onClick={handleTriggerEnter}>
              <div className="absolute -inset-2 rounded-full bg-gradient-to-b from-cyan-400 via-teal-400 to-indigo-500 opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-500 animate-pulse pointer-events-none" />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black border border-cyan-500/60 flex items-center justify-center p-2 shadow-2xl overflow-hidden">
                <img
                  src="/brain-logo.webp"
                  alt="My Hippocampus Logo"
                  className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                <span className="block uppercase tracking-wider">MY HIPPOCAMPUS</span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 max-w-md mx-auto leading-relaxed">
                Petakan catatan, ide, dan struktur pemikiran Anda ke dalam mind map visual
              </p>
            </div>

            {/* Start Button - Mechanical Sci-Fi Button with ambient glow */}
            <div className="w-full pt-3 sm:pt-4 flex flex-col items-center justify-center text-center">
              <MechanicalButton
                id="welcome-start-button"
                size="lg"
                variant="cyan"
                showAmbient={true}
                showReflection={true}
                onClick={handleTriggerEnter}
              >
                Mulai
              </MechanicalButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
