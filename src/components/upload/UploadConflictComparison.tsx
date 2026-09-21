import React from "react";
import { Network, Calendar, Folder } from "lucide-react";
import { MindMapData } from "../../types";
import { countNodes } from "./useUploadParser";

interface UploadConflictComparisonProps {
  existingMap: MindMapData;
  incomingMap: MindMapData;
}

const formatDate = (isoString?: string) => {
  if (!isoString) return "-";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
};

export const UploadConflictComparison: React.FC<UploadConflictComparisonProps> = ({
  existingMap,
  incomingMap,
}) => {
  const localNodes = existingMap.root ? countNodes(existingMap.root) : 0;
  const incomingNodes = incomingMap.root ? countNodes(incomingMap.root) : 0;
  const nodeDiff = incomingNodes - localNodes;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-black p-2.5 rounded-xl border border-neutral-800 text-xs">
      {/* Local Version Card */}
      <div className="p-2 rounded-lg bg-black border border-neutral-800 space-y-1.5">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">
            Lokal (Di Perangkat Ini)
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black text-white border border-neutral-700">
            Memory Card
          </span>
        </div>
        <div className="font-semibold text-white truncate">
          {existingMap.title}
        </div>
        <div className="space-y-1 text-[11px] text-white pt-0.5">
          <div className="flex items-center gap-1.5">
            <Network className="w-3 h-3 text-white shrink-0" />
            <span>{localNodes} Cabang</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-white shrink-0" />
            <span className="truncate">{formatDate(existingMap.createdAt)}</span>
          </div>
          {existingMap.folder && (
            <div className="flex items-center gap-1.5">
              <Folder className="w-3 h-3 text-white shrink-0" />
              <span>Kategori: {existingMap.folder}</span>
            </div>
          )}
        </div>
      </div>

      {/* Incoming Upload Version Card */}
      <div className="p-2 rounded-lg bg-black border border-cyan-500/30 space-y-1.5">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">
            Berkas Unggahan (Baru)
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black text-white border border-cyan-500/30">
            {incomingMap.theme}
          </span>
        </div>
        <div className="font-semibold text-white truncate">
          {incomingMap.title}
        </div>
        <div className="space-y-1 text-[11px] text-white pt-0.5">
          <div className="flex items-center gap-1.5">
            <Network className="w-3 h-3 text-white shrink-0" />
            <span className="font-medium">{incomingNodes} Cabang</span>
            {nodeDiff !== 0 && (
              <span
                className={`text-[10px] font-semibold px-1 rounded ${
                  nodeDiff > 0
                    ? "bg-black text-white border border-emerald-500/30"
                    : "bg-black text-white border border-rose-500/30"
                }`}
              >
                {nodeDiff > 0 ? `+${nodeDiff} cabang baru` : `${nodeDiff} cabang`}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-white shrink-0" />
            <span className="truncate">{formatDate(incomingMap.createdAt)}</span>
          </div>
          {incomingMap.folder && (
            <div className="flex items-center gap-1.5">
              <Folder className="w-3 h-3 text-white shrink-0" />
              <span>Kategori: {incomingMap.folder}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
