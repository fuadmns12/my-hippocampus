import React, { useState } from "react";
import { Tag, Plus, Trash2 } from "lucide-react";
import { soundFx } from "../../utils/soundEffects";
import { ConfirmClearNamesModal } from "./ConfirmClearNamesModal";
import { NamesChipsList } from "./NamesChipsList";

interface NamesInputSectionProps {
  namesText: string;
  setNamesText: (val: string) => void;
  namesList: string[];
  quickName: string;
  setQuickName: (val: string) => void;
  onAddQuickName: (e: React.FormEvent) => void;
  onRemoveName: (idx: number) => void;
  onClearAll: () => void;
  isEditingMode?: boolean;
  onOpenNotesForName?: (name: string) => void;
  getNodeNotesCount?: (name: string) => number;
}

export const NamesInputSection: React.FC<NamesInputSectionProps> = ({
  namesText,
  setNamesText,
  namesList,
  quickName,
  setQuickName,
  onAddQuickName,
  onRemoveName,
  onClearAll,
  isEditingMode = false,
  onOpenNotesForName,
  getNodeNotesCount,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-white flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-white" />
          {isEditingMode
            ? "Edit Daftar Nama / Cabang Item (Satu Per Baris / Koma)"
            : "Daftar Nama / Item (Satu Nama Per Baris / Dipisah Koma)"}
        </label>
        {namesList.length > 0 && (
          <button
            id="btn-clear-all-names"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFx.play("click");
              setShowConfirmModal(true);
            }}
            title="Hapus semua nama dari daftar"
            aria-label="Hapus semua nama dari daftar"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wider bg-black text-white border border-rose-500/40 hover:bg-neutral-900 hover:border-rose-400 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-sm select-none"
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0 text-rose-400" />
            <span>HAPUS SEMUA NAMA</span>
          </button>
        )}
      </div>

      {/* Confirmation Modal when clearing all names */}
      <ConfirmClearNamesModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={onClearAll}
        totalCount={namesList.length}
      />

      <textarea
        id="names-textarea"
        rows={4}
        value={namesText}
        onChange={(e) => setNamesText(e.target.value)}
        placeholder="Masukkan banyak nama di sini...&#10;Contoh:&#10;Budi Santoso&#10;Siti Rahma&#10;Andi Wijaya&#10;Dewi Lestari"
        className="w-full px-3.5 py-2.5 min-h-[120px] sm:min-h-[140px] bg-black border border-cyan-500/30 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-colors"
      />

      {/* Quick add single name bar */}
      <form onSubmit={onAddQuickName} className="flex gap-2">
        <input
          id="quick-name-input"
          type="text"
          value={quickName}
          onChange={(e) => setQuickName(e.target.value)}
          placeholder={
            isEditingMode
              ? "Tambah nama / item baru ke mind map..."
              : "Tambah satu nama dengan cepat..."
          }
          className="flex-1 px-3 py-1.5 bg-black border border-cyan-500/30 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          title="Tambah satu nama"
          aria-label="Tambah satu nama"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider bg-black text-white border border-cyan-500/40 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-sm select-none"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          <span>TAMBAH</span>
        </button>
      </form>

      {/* Name Chips preview */}
      <NamesChipsList
        namesList={namesList}
        onRemoveName={onRemoveName}
        onOpenNotesForName={onOpenNotesForName}
        getNodeNotesCount={getNodeNotesCount}
      />
    </div>
  );
};
