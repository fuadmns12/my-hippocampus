import React from "react";
import { RotateCw, Smartphone } from "lucide-react";
import { motion } from "motion/react";
import { MobileOrientationState } from "./useMobileOrientation";

interface MobileLandscapeNoticeProps {
  orientation: MobileOrientationState;
}

export const MobileLandscapeNotice: React.FC<MobileLandscapeNoticeProps> = ({
  orientation,
}) => {
  const {
    showLandscapeNotice,
    isMobileDevice,
  } = orientation;

  // If on desktop or already in landscape mode, do not render modal
  if (!isMobileDevice) return null;

  return (
    <>
      {/* Main Mandatory Modal for Mobile in Portrait Mode */}
      {showLandscapeNotice && (
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="landscape-notice-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-sm rounded-2xl bg-black border border-cyan-500/60 p-5 shadow-2xl shadow-cyan-950/80 flex flex-col items-center text-center space-y-4">
            {/* Rotating Phone Animation Icon */}
            <div className="relative w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
              <motion.div
                animate={{ rotate: [0, 90, 90, 0, 0] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.35, 0.65, 0.9, 1],
                }}
                className="flex items-center justify-center"
              >
                <Smartphone className="w-8 h-8 text-cyan-400" />
              </motion.div>
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-black border border-cyan-400 text-cyan-300 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: [0, 90, 90, 0, 0] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.35, 0.65, 0.9, 1],
                  }}
                  className="flex items-center justify-center"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </motion.div>
              </div>
            </div>

            {/* Notification Title & Guidance */}
            <div className="space-y-1.5">
              <h2
                id="landscape-notice-title"
                className="text-lg font-bold tracking-tight text-white flex items-center justify-center gap-2"
              >
                Wajib Mode Landscape
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed max-w-xs mx-auto">
                Aplikasi ini hanya dapat digunakan dalam mode landscape (layar tidur) untuk kenyamanan kanvas peta pikiran. Silakan putar ponsel Anda.
              </p>
            </div>

            {/* Interactive Feedback Message */}
            <div className="w-full p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/50 text-cyan-200 text-xs text-center leading-relaxed">
              <p className="font-medium">
                Silakan putar ponsel Anda ke posisi horizontal (landscape) secara manual.
              </p>
              <p className="text-cyan-300/80 mt-1.5">
                Website akan otomatis aktif setelah layar dalam mode landscape.
              </p>
            </div>
          </div>
        </aside>
      )}
    </>
  );
};
