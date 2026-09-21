import React from "react";

interface NodeLineageDotsProps {
  depth: number;
  width: number;
  height: number;
  color: string;
  scaleFactor?: number;
  nodeShape?: string;
}

export const NodeLineageDots: React.FC<NodeLineageDotsProps> = ({
  depth,
  width,
  height,
  color,
  scaleFactor = 1,
  nodeShape = "rect",
}) => {
  // Hanya tampilkan untuk subkategori (depth >= 1)
  if (depth < 1) return null;

  // Batasi jumlah titik maksimum 4 agar tetap estetik & rapi
  const dotCount = Math.min(depth, 4);
  const dotRadius = Math.max(2.2, Math.min(3.2, 2.7 * scaleFactor));
  const dotGap = Math.max(6, 7 * scaleFactor);

  // Penempatan di border atas: offset ke kiri agar tidak menabrak titik anchor tengah atas (cx: 0)
  // Hexagon atau pill memiliki margin samping, jadi -width * 0.28 adalah posisi aman & seimbang
  const baseX = -Math.min(width * 0.28, 38 * scaleFactor);
  const totalSpan = (dotCount - 1) * dotGap;
  const startX = baseX - totalSpan / 2;
  const topY = -height / 2;

  const dots = [];
  for (let i = 0; i < dotCount; i++) {
    dots.push({
      id: `lineage-dot-${i}`,
      cx: startX + i * dotGap,
      cy: topY,
    });
  }

  return (
    <g
      className="node-lineage-dots pointer-events-auto cursor-default"
      data-export-ignore="false"
    >
      <title>{`Subkategori Tingkat ${depth} (Jejak Jalur Induk)`}</title>
      {dots.map((dot, idx) => (
        <g key={dot.id}>
          {/* Efek pendar halus di sekitar titik */}
          <circle
            cx={dot.cx}
            cy={dot.cy}
            r={dotRadius + 1.2}
            fill={color}
            opacity={0.3}
            className="pointer-events-none"
          />
          {/* Titik inti dengan border gelap kontras di atas garis border kartu */}
          <circle
            cx={dot.cx}
            cy={dot.cy}
            r={dotRadius}
            fill={color}
            stroke="#09090b"
            strokeWidth={1.2}
            className="transition-colors duration-150"
            style={{
              filter: `drop-shadow(0 0 2px ${color})`,
            }}
          />
        </g>
      ))}
    </g>
  );
};
