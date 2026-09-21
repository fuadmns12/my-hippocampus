import React from "react";
import { Upload, ClipboardPaste } from "lucide-react";
import { soundFx } from "../../utils/soundEffects";

export type UploadActiveTab = "file" | "paste";

interface UploadModalTabsProps {
  activeTab: UploadActiveTab;
  onTabChange: (tab: UploadActiveTab) => void;
}

export const UploadModalTabs: React.FC<UploadModalTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex items-center p-1 bg-black border border-cyan-500/30 rounded-xl select-none">
      <button
        id="tab-upload-file"
        type="button"
        onClick={() => {
          soundFx.play("click");
          onTabChange("file");
        }}
        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
          activeTab === "file"
            ? "bg-black text-white border border-cyan-400 shadow-xs"
            : "text-neutral-400 hover:text-white hover:bg-neutral-900/60 border border-transparent"
        }`}
      >
        <Upload className="w-3.5 h-3.5 text-cyan-400" />
        <span className={activeTab === "file" ? "text-white" : ""}>Unggah Berkas</span>
      </button>

      <button
        id="tab-upload-paste"
        type="button"
        onClick={() => {
          soundFx.play("click");
          onTabChange("paste");
        }}
        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
          activeTab === "paste"
            ? "bg-black text-white border border-cyan-400 shadow-xs"
            : "text-neutral-400 hover:text-white hover:bg-neutral-900/60 border border-transparent"
        }`}
      >
        <ClipboardPaste className="w-3.5 h-3.5 text-cyan-400" />
        <span className={activeTab === "paste" ? "text-white" : ""}>Tempel Teks / JSON</span>
      </button>
    </div>
  );
};
