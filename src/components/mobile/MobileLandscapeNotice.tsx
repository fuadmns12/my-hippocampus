import React, { useState } from "react";
import { RotateCw, Smartphone, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { MechanicalButton } from "../common/MechanicalButton";
import { MobileOrientationState } from "./useMobileOrientation";

interface MobileLandscapeNoticeProps {
  orientation: MobileOrientationState;
}

export const MobileLandscapeNotice: React.FC<MobileLandscapeNoticeProps> = ({
  orientation,
}) => {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const {
    showLandscapeNotice,
    isMobileDevice,
    requestLandscapeMode,
    isLocking,
  } = orientation;

  // Handle clicking the "Pindah ke Mode Landscape" button
  const handleSwitchToLandscape = async () => {
    setFeedbackMessage(null);
    const result = await requestLandscapeMode();
    if (!result.success && result.message) {
      setFeedbackMessage(result.message);
    }
  };

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

            {/* Interactive Feedback Message if OS needs manual rotation */}
            {feedbackMessage && (
              <div className="w-full p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs text-left flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>{feedbackMessage}</span>
              </div>
            )}

            {/* Action Button: Button to Switch to Landscape */}
            <div className="w-full pt-1">
              <MechanicalButton
                id="btn-switch-to-landscape"
                size="md"
                variant="cyan"
                showAmbient={true}
                disabled={isLocking}
                onClick={handleSwitchToLandscape}
                className="w-full flex items-center justify-center py-2.5"
              >
                <span className="font-semibold">
                  {isLocking ? "Mengatur Layar..." : "Pindah ke Mode Landscape"}
                </span>
              </MechanicalButton>
            </div>
          </div>
        </aside>
      )}
    </>
  );
};
