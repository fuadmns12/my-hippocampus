import React, { useState, useMemo } from "react";
import { MindMapNode } from "../../types";
import { Plus, Layers } from "lucide-react";
import { NodeBatchAddForm } from "./NodeBatchAddForm";
import { NodeConnectedChildrenList } from "./NodeConnectedChildrenList";

interface NodeChildrenSectionProps {
  childrenNodes?: MindMapNode[];
  newChildLabel: string;
  setNewChildLabel: (val: string) => void;
  onAddChild: (e?: React.FormEvent | React.MouseEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onDeleteChildNode: (nodeId: string) => void;
  onAddMultipleChildren?: (labels: string[]) => void;
}

export const NodeChildrenSection: React.FC<NodeChildrenSectionProps> = ({
  childrenNodes,
  newChildLabel,
  setNewChildLabel,
  onAddChild,
  onKeyDown,
  onDeleteChildNode,
  onAddMultipleChildren,
}) => {
  const [addMode, setAddMode] = useState<"single" | "batch">("single");
  const [batchText, setBatchText] = useState("");
  const [quickBatchName, setQuickBatchName] = useState("");

  const hasChildren = Boolean(childrenNodes && childrenNodes.length > 0);

  const batchNamesList = useMemo(() => {
    return batchText
      .split(/[\n,]/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
  }, [batchText]);

  const handleAddQuickBatchName = (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!quickBatchName.trim()) return;
    if (batchText.trim().length === 0) {
      setBatchText(quickBatchName.trim());
    } else {
      setBatchText(batchText + "\n" + quickBatchName.trim());
    }
    setQuickBatchName("");
  };

  const handleRemoveBatchName = (indexToRemove: number) => {
    const updated = batchNamesList.filter((_, idx) => idx !== indexToRemove);
    setBatchText(updated.join("\n"));
  };

  const handleClearAllBatch = () => {
    setBatchText("");
  };

  const handleCommitBatch = () => {
    if (batchNamesList.length === 0) return;
    if (onAddMultipleChildren) {
      onAddMultipleChildren(batchNamesList);
    }
    setBatchText("");
  };

  return (
    <div className="pt-2 border-t border-cyan-500/30 space-y-3">
      {/* Header with Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="text-white font-medium text-xs flex items-center gap-1.5">
          <span>Tambah Cabang / Anak Baru</span>
        </label>

        <div className="flex items-center gap-1 bg-black p-0.5 rounded-xl border border-cyan-500/30 text-[11px]">
          <button
            type="button"
            onClick={() => setAddMode("single")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              addMode === "single"
                ? "bg-black text-white border border-cyan-500/40 shadow-sm"
                : "text-white hover:text-white"
            }`}
          >
            Satu per Satu
          </button>
          <button
            type="button"
            onClick={() => setAddMode("batch")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              addMode === "batch"
                ? "bg-black text-white border border-cyan-500/40 shadow-sm"
                : "text-white hover:text-white"
            }`}
          >
            <Layers
              className={`w-3 h-3 ${
                addMode === "batch" ? "text-cyan-400" : "text-white"
              }`}
            />
            <span>Tambah Banyak</span>
            {batchNamesList.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-black border border-cyan-500/30 text-white font-mono">
                {batchNamesList.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mode 1: Single Quick Add */}
      {addMode === "single" && (
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <input
              type="text"
              value={newChildLabel}
              onChange={(e) => setNewChildLabel(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ketik nama cabang & tekan Enter..."
              className="flex-1 px-3 py-1.5 bg-black border border-cyan-500/30 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 text-xs"
            />
            <button
              type="button"
              onClick={onAddChild}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider bg-black text-white border border-cyan-500/40 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-sm select-none"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>TAMBAH</span>
            </button>
          </div>

        </div>
      )}

      {/* Mode 2: Batch Add (Names List Textarea & Form) */}
      {addMode === "batch" && (
        <NodeBatchAddForm
          batchText={batchText}
          setBatchText={setBatchText}
          quickBatchName={quickBatchName}
          setQuickBatchName={setQuickBatchName}
          batchNamesList={batchNamesList}
          handleAddQuickBatchName={handleAddQuickBatchName}
          handleRemoveBatchName={handleRemoveBatchName}
          handleClearAllBatch={handleClearAllBatch}
          handleCommitBatch={handleCommitBatch}
        />
      )}

      {/* List of current connected children */}
      {hasChildren && (
        <NodeConnectedChildrenList
          childrenNodes={childrenNodes!}
          onDeleteChildNode={onDeleteChildNode}
        />
      )}
    </div>
  );
};
