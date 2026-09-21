import React from "react";
import { MindMapData, MindMapNode } from "../../types";
import { THEME_PALETTES } from "../../utils/colorThemes";
import {
  Trash2,
  Calendar,
  ArrowRight,
  Layout,
  Palette,
  Spline,
  Shapes,
  Network,
} from "lucide-react";
import { soundFx } from "../../utils/soundEffects";

export const LAYOUT_LABELS: Record<string, string> = {
  radial: "Radial Centered",
  "horizontal-tree": "Pohon Horisontal",
  "vertical-tree": "Pohon Vertikal",
  fishbone: "Tulang Ikan (Fishbone)",
  "bubble-cluster": "Kluster Gelembung",
  "bilateral-bracket": "Kurung Bilateral",
  "grid-network": "Jaringan Kisi",
};

export const CONNECTOR_LABELS: Record<string, string> = {
  bezier: "Lengkung",
  angled: "Siku",
  straight: "Lurus",
  dotted: "Putus-putus",
  "animated-dashed": "Putus Bergerak",
};

export const SHAPE_LABELS: Record<string, string> = {
  rounded: "Persegi Lengkung",
  pill: "Kapsul / Pill",
  sharp: "Persegi Siku",
  oval: "Oval / Elips",
  circle: "Lingkaran",
  hexagon: "Heksagon",
};

const countTotalNodes = (node?: MindMapNode): number => {
  if (!node) return 0;
  let count = 1;
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      count += countTotalNodes(child);
    }
  }
  return count;
};

interface HistoryItemCardProps {
  map: MindMapData;
  onSelectMap: (map: MindMapData) => void;
  onRequestDelete: (map: MindMapData) => void;
}

export const HistoryItemCard: React.FC<HistoryItemCardProps> = ({
  map,
  onSelectMap,
  onRequestDelete,
}) => {
  const nodeCount =
    (map.root ? countTotalNodes(map.root) : 0) +
    (map.additionalRoots?.reduce((acc, r) => acc + countTotalNodes(r), 0) || 0);

  return (
    <div
      onClick={() => onSelectMap(map)}
      className="p-4 rounded-2xl bg-black border border-cyan-500/30 hover:border-cyan-400 hover:bg-neutral-950 transition-all space-y-2.5 group cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            {/* Mind Map Cabang Count Badge */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border bg-black border-cyan-500/40 text-white">
              <Network className="w-2.5 h-2.5 text-white" />
              <span className="text-white">{nodeCount} Cabang</span>
            </span>
          </div>

          <h3 className="font-semibold text-xs text-white truncate transition-colors">
            {map.title}
          </h3>
          {map.subtitle && (
            <p className="text-[11px] text-white truncate mt-0.5">
              {map.subtitle}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            soundFx.play("click");
            onRequestDelete(map);
          }}
          className="text-red-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-950/40 border border-transparent hover:border-red-500/40 transition-colors cursor-pointer flex items-center justify-center active:scale-95 shadow-xs"
          title="Hapus Dari Memory Card"
          aria-label="Hapus Dari Memory Card"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-500" />
        </button>
      </div>

      {/* Visual Settings Badges */}
      <div className="w-full flex flex-wrap items-center gap-1 sm:gap-1.5 pt-1">
        {map.layout && (
          <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md bg-black border border-cyan-500/30 text-[8px] sm:text-[9px] text-white font-medium whitespace-nowrap shrink-0">
            <Layout className="w-2.5 h-2.5 text-white shrink-0" />
            <span className="text-white">{LAYOUT_LABELS[map.layout] || map.layout}</span>
          </span>
        )}
        {map.theme && (
          <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md bg-black border border-cyan-500/30 text-[8px] sm:text-[9px] text-white font-medium whitespace-nowrap shrink-0">
            <Palette className="w-2.5 h-2.5 text-white shrink-0" />
            <span className="text-white">{THEME_PALETTES[map.theme]?.name || map.theme}</span>
          </span>
        )}
        {map.connectorStyle && (
          <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md bg-black border border-cyan-500/30 text-[8px] sm:text-[9px] text-white font-medium whitespace-nowrap shrink-0">
            <Spline className="w-2.5 h-2.5 text-white shrink-0" />
            <span className="text-white">{CONNECTOR_LABELS[map.connectorStyle] || map.connectorStyle}</span>
          </span>
        )}
        {map.nodeShape && (
          <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md bg-black border border-cyan-500/30 text-[8px] sm:text-[9px] text-white font-medium whitespace-nowrap shrink-0">
            <Shapes className="w-2.5 h-2.5 text-white shrink-0" />
            <span className="text-white">{SHAPE_LABELS[map.nodeShape] || map.nodeShape}</span>
          </span>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-white pt-1.5 border-t border-cyan-500/30">
        <span className="flex items-center gap-1 text-white">
          <Calendar className="w-3 h-3 text-white" />
          <span className="text-white">
            {new Date(map.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </span>

        <div className="flex items-center gap-2 select-none">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFx.play("click");
              onSelectMap(map);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10.5px] font-bold tracking-wider bg-black text-white border border-cyan-500/50 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-sm"
          >
            <span>BUKA</span>
            <ArrowRight className="w-3 h-3 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
