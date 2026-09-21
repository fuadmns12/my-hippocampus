import React from "react";
import { Bookmark, Check } from "lucide-react";
import { MechanicalButton } from "../common/MechanicalButton";

interface HeaderSaveButtonProps {
  isSaved: boolean;
  onSaveMap: () => void;
}

export const HeaderSaveButton: React.FC<HeaderSaveButtonProps> = ({
  isSaved,
  onSaveMap,
}) => {
  return (
    <MechanicalButton
      id="btn-save-mindmap"
      type="button"
      size="xs"
      variant={isSaved ? "emerald" : "cyan"}
      onClick={onSaveMap}
      title="Simpan Mind Map ke Memory Card"
      icon={
        isSaved ? (
          <Check className="w-3.5 h-3.5 text-cyan-400" />
        ) : (
          <Bookmark className="w-3.5 h-3.5 text-white" />
        )
      }
    >
      {isSaved ? "TERSIMPAN" : "SIMPAN"}
    </MechanicalButton>
  );
};
