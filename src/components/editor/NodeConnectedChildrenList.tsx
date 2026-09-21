import React from "react";
import { X } from "lucide-react";
import { MindMapNode } from "../../types";

interface NodeConnectedChildrenListProps {
  childrenNodes: MindMapNode[];
  onDeleteChildNode: (nodeId: string) => void;
}

export const NodeConnectedChildrenList: React.FC<NodeConnectedChildrenListProps> = ({
  childrenNodes,
  onDeleteChildNode,
}) => {
  if (!childrenNodes || childrenNodes.length === 0) return null;

  return (
    <div className="pt-2 border-t border-neutral-800/80 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-white">
          Cabang yang Sudah Terhubung:
        </span>
        <span className="text-[10px] text-white font-semibold px-2 py-0.5 rounded-full bg-black border border-cyan-500/30">
          {childrenNodes.length} Cabang
        </span>
      </div>

      <div className="pt-1 flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
        {childrenNodes.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black border border-cyan-500/30 text-[11px] text-white"
          >
            <span>{c.emoji || "🔹"}</span>
            <span className="truncate max-w-[140px]">{c.label}</span>
            <button
              type="button"
              onClick={() => onDeleteChildNode(c.id)}
              className="text-red-500 hover:text-red-400 p-0.5 transition-colors cursor-pointer inline-flex items-center justify-center"
              title="Hapus cabang ini"
              aria-label="Hapus cabang ini"
            >
              <X className="w-3 h-3 text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
