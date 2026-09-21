import React, { useState, useMemo } from "react";
import { soundFx } from "../../utils/soundEffects";

export function useInputNames(
  namesText: string,
  setNamesText: (val: string) => void
) {
  const [quickName, setQuickName] = useState("");

  const namesList = useMemo(() => {
    return namesText
      .split(/[\n,]/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
  }, [namesText]);

  const handleAddQuickName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) return;
    soundFx.play("spawn");
    if (namesText.trim().length === 0) {
      setNamesText(quickName.trim());
    } else {
      setNamesText(namesText + "\n" + quickName.trim());
    }
    setQuickName("");
  };

  const handleRemoveName = (indexToRemove: number) => {
    soundFx.play("delete");
    const updated = namesList.filter((_, idx) => idx !== indexToRemove);
    setNamesText(updated.join("\n"));
  };

  const handleClearAll = () => {
    soundFx.play("delete");
    setNamesText("");
  };

  return {
    namesList,
    quickName,
    setQuickName,
    handleAddQuickName,
    handleRemoveName,
    handleClearAll,
  };
}
