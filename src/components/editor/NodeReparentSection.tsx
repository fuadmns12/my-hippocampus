import React from "react";
import { GitFork, ArrowRightLeft } from "lucide-react";
import { EligibleParentItem } from "./useNodeEditor";
import { CustomSelect, CustomSelectOption } from "../common/CustomSelect";

interface NodeReparentSectionProps {
  eligibleParents: EligibleParentItem[];
  selectedParentId: string;
  setSelectedParentId: (id: string) => void;
  currentParentId: string | null;
  onReparent: () => void;
}

export const NodeReparentSection: React.FC<NodeReparentSectionProps> = ({
  eligibleParents,
  selectedParentId,
  setSelectedParentId,
  currentParentId,
  onReparent,
}) => {
  const parentOptions: CustomSelectOption[] = eligibleParents.map((p) => ({
    value: p.id,
    label: `${p.depth === 0 ? "🎯 " : "• ".repeat(p.depth)}${p.emoji ? p.emoji + " " : ""}${p.label}`,
    badge: p.id === currentParentId ? "Induk Saat Ini" : p.depth === 0 ? "Pusat" : undefined,
    subLabel: p.depth === 0 ? "Topik Utama (Pusat)" : undefined,
  }));

  return (
    <div className="pt-2 border-t border-cyan-500/30 space-y-2">
      <label className="block text-white font-medium flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <GitFork className="w-3.5 h-3.5 text-white" />
          <span>Pindahkan ke Induk Lain (Ganti Induk Cabang)</span>
        </span>
      </label>
      <div className="flex gap-2 items-center">
        <CustomSelect
          id="reparent-parent-select"
          value={selectedParentId}
          onChange={(val) => setSelectedParentId(val)}
          options={parentOptions}
          placeholder="Pilih induk baru..."
          className="flex-1"
          ariaLabel="Pilih Induk Cabang Baru"
        />
        <button
          type="button"
          disabled={!selectedParentId || selectedParentId === currentParentId}
          onClick={onReparent}
          className="h-[40px] px-3.5 bg-black hover:bg-neutral-900 border border-cyan-500/50 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer shrink-0"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-white" />
          Pindah
        </button>
      </div>
      <p className="text-[10.5px] text-white leading-relaxed">
        Pilih node di atas atau seret langsung node di kanvas ke atas node tujuan. Warna garis, titik jalur (dote), dan seluruh sub-cabang akan otomatis diselaraskan mengikuti induk barunya.
      </p>
    </div>
  );
};
