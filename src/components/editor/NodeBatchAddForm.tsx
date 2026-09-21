import React from "react";
import { Plus, X, Tag, Trash2 } from "lucide-react";
import { soundFx } from "../../utils/soundEffects";

interface NodeBatchAddFormProps {
  batchText: string;
  setBatchText: (val: string) => void;
  quickBatchName: string;
  setQuickBatchName: (val: string) => void;
  batchNamesList: string[];
  handleAddQuickBatchName: (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => void;
  handleRemoveBatchName: (indexToRemove: number) => void;
  handleClearAllBatch: () => void;
  handleCommitBatch: () => void;
}

export const NodeBatchAddForm: React.FC<NodeBatchAddFormProps> = ({
  batchText,
  setBatchText,
  quickBatchName,
  setQuickBatchName,
  batchNamesList,
  handleAddQuickBatchName,
  handleRemoveBatchName,
  handleClearAllBatch,
  handleCommitBatch,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-white flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-white" />
          Daftar Nama / Item (Satu Nama Per Baris / Dipisah Koma)
        </label>
        {batchNamesList.length > 0 && (
          <button
            id="btn-batch-clear-all-names"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFx.play("delete");
              handleClearAllBatch();
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

      <textarea
        rows={4}
        value={batchText}
        onChange={(e) => setBatchText(e.target.value)}
        placeholder={`Masukkan banyak nama di sini...\nContoh:\nBudi Santoso\nSiti Rahma\nAndi Wijaya\nDewi Lestari`}
        className="w-full px-3.5 py-2.5 min-h-[110px] sm:min-h-[130px] bg-black border border-cyan-500/30 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-colors"
      />

      {/* Quick add single name bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={quickBatchName}
          onChange={(e) => setQuickBatchName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              handleAddQuickBatchName(e);
            }
          }}
          placeholder="+ Tambah satu nama dengan cepat..."
          className="flex-1 px-3 py-1.5 bg-black border border-cyan-500/30 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
        />
        <button
          type="button"
          onClick={handleAddQuickBatchName}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider bg-black text-neutral-300 border border-neutral-700/80 hover:bg-neutral-900 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-sm select-none"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          <span>TAMBAH</span>
        </button>
      </div>

      {/* Name Chips preview & Batch Commit Button */}
      {batchNamesList.length > 0 && (
        <div className="pt-2 space-y-2">
          <div className="flex items-center justify-between gap-2 select-none">
            <span className="px-2 py-0.5 rounded-full bg-black text-white border border-cyan-500/30 text-xs font-normal">
              {batchNamesList.length} Nama
            </span>
            <button
              type="button"
              onClick={handleCommitBatch}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold tracking-wider bg-black text-white border border-cyan-500/50 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>TAMBAHKAN {batchNamesList.length} CABANG</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
            {batchNamesList.map((name, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black border border-cyan-500/30 text-xs text-white"
              >
                {name}
                <button
                  type="button"
                  onClick={() => handleRemoveBatchName(idx)}
                  className="text-white hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3 text-rose-400" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
