import React from "react";
import {
  ArrowDownRight,
  ExternalLink,
  Download,
  Save,
  Maximize,
} from "lucide-react";
import { GuideActionMeta, executeGuideAction } from "../../utils/guideActions";
import { soundFx } from "../../utils/soundEffects";

interface GuideActionButtonProps {
  action: GuideActionMeta;
  displayText: string;
  isUser?: boolean;
}

export const GuideActionButton: React.FC<GuideActionButtonProps> = ({
  action,
  displayText,
  isUser = false,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    soundFx.play("click");
    executeGuideAction(action.type);
  };

  // Pilih ikon sesuai jenis aksi
  const renderIcon = () => {
    if (action.type.startsWith("EXPORT_")) {
      return <Download className="w-3 h-3 text-white shrink-0" />;
    }
    if (action.type === "SAVE_MINDMAP") {
      return <Save className="w-3 h-3 text-white shrink-0" />;
    }
    if (action.type === "TOGGLE_FULLSCREEN") {
      return <Maximize className="w-3 h-3 text-white shrink-0" />;
    }
    if (action.kind === "popup") {
      return <ExternalLink className="w-3 h-3 text-white group-hover:scale-110 transition-transform shrink-0" />;
    }
    if (action.kind === "scroll") {
      return <ArrowDownRight className="w-3 h-3 text-white group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform shrink-0" />;
    }
    return null;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`${action.description} (${action.kind === "popup" ? "Buka Popup" : "Scroll ke Tampilan"})`}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 mx-0.5 my-0.5 rounded-lg text-xs font-semibold border transition-all duration-150 active:scale-95 cursor-pointer select-none align-baseline group shadow-xs ${
        isUser
          ? "bg-black hover:bg-neutral-900 text-white border-white/40 shadow-black/20"
          : "bg-black hover:bg-neutral-900 text-white hover:text-white border-cyan-500/50 hover:border-cyan-400 shadow-cyan-950/40"
      }`}
    >
      {renderIcon()}
      <span className="font-bold underline decoration-cyan-400/50 underline-offset-2">
        {displayText}
      </span>
      <span
        className="text-[9px] px-1 py-0.2 rounded font-mono font-medium bg-black text-white border border-cyan-500/30"
      >
        {action.badgeText}
      </span>
    </button>
  );
};
