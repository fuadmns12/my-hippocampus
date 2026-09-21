import { PositionedNode } from "./types";
import { NodeShape } from "../../types";

export interface Point {
  x: number;
  y: number;
}

export interface ComputedBoundaryHull {
  id: string;
  title: string;
  pathD: string;
  labelX: number;
  labelY: number;
  color: string;
  branchIndex?: number;
  nodeIds: string[];
}

/**
 * 2D Cross product of OA and OB vectors
 */
function crossProduct(o: Point, a: Point, b: Point): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

/**
 * Computes the 2D Convex Hull of a set of 2D points (Monotone Chain algorithm)
 */
export function computeConvexHull(points: Point[]): Point[] {
  if (points.length <= 2) return points;

  // Sort points lexicographically (by x, then y)
  const sorted = points.slice().sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x));

  // Lower hull
  const lower: Point[] = [];
  for (let i = 0; i < sorted.length; i++) {
    while (
      lower.length >= 2 &&
      crossProduct(lower[lower.length - 2], lower[lower.length - 1], sorted[i]) <= 0
    ) {
      lower.pop();
    }
    lower.push(sorted[i]);
  }

  // Upper hull
  const upper: Point[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    while (
      upper.length >= 2 &&
      crossProduct(upper[upper.length - 2], upper[upper.length - 1], sorted[i]) <= 0
    ) {
      upper.pop();
    }
    upper.push(sorted[i]);
  }

  // Concatenate lower and upper hull (omit duplicate end points)
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

/**
 * Generates an organic, smooth rounded hull path from convex hull vertices
 */
export function generateSmoothHullSvgPath(hullPoints: Point[], cornerRadius: number = 24): string {
  const n = hullPoints.length;
  if (n === 0) return "";
  if (n === 1) {
    const pt = hullPoints[0];
    const r = 36;
    return `M ${pt.x - r},${pt.y} a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 ${-r * 2},0 Z`;
  }
  if (n === 2) {
    const p1 = hullPoints[0];
    const p2 = hullPoints[1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = (-dy / len) * cornerRadius;
    const ny = (dx / len) * cornerRadius;
    return `M ${p1.x + nx},${p1.y + ny} L ${p2.x + nx},${p2.y + ny} A ${cornerRadius},${cornerRadius} 0 0 1 ${p2.x - nx},${p2.y - ny} L ${p1.x - nx},${p1.y - ny} A ${cornerRadius},${cornerRadius} 0 0 1 ${p1.x + nx},${p1.y + ny} Z`;
  }

  // For 3+ points, create smooth bezier curve around the polygon
  let path = "";
  for (let i = 0; i < n; i++) {
    const prev = hullPoints[(i - 1 + n) % n];
    const curr = hullPoints[i];
    const next = hullPoints[(i + 1) % n];

    // Midpoints between vertices for smooth rounded corners
    const mid1X = (prev.x + curr.x) / 2;
    const mid1Y = (prev.y + curr.y) / 2;
    const mid2X = (curr.x + next.x) / 2;
    const mid2Y = (curr.y + next.y) / 2;

    if (i === 0) {
      path += `M ${mid1X},${mid1Y}`;
    }
    // Quadratic bezier curve using current vertex as control point
    path += ` Q ${curr.x},${curr.y} ${mid2X},${mid2Y}`;
  }
  path += " Z";
  return path;
}

/**
 * Computes boundary hull for a set of positioned nodes
 */
export function buildBoundaryHullForNodes(
  clusterId: string,
  title: string,
  nodes: PositionedNode[],
  color: string,
  branchIndex?: number,
  padding: number = 32,
  fallbackShape?: NodeShape | string
): ComputedBoundaryHull | null {
  if (!nodes || nodes.length === 0) return null;

  // Collect boundary points of all nodes with padding
  const points: Point[] = [];
  let minY = Infinity;
  let labelX = 0;
  let labelY = 0;

  nodes.forEach((n) => {
    const shape = n.shape || fallbackShape || "rounded";
    const scale = n.node.scale || 1.0;
    const applyX = n.x + (n.node.xOffset || 0);
    const applyY = n.y + (n.node.yOffset || 0);
    const w = n.width * scale;
    const h = n.height * scale;
    const hw = w / 2;
    const hh = h / 2;

    if (shape === "circle") {
      // Pada bentuk circle, node dirender sebagai lingkaran penuh dengan radius Math.max(hw, hh)
      const radius = Math.max(hw, hh);
      const totalR = radius + padding;
      // Sampel titik di sekeliling keliling lingkaran agar batas wilayah meng-cover node secara utuh
      const sampleCount = 16;
      for (let i = 0; i < sampleCount; i++) {
        const angle = (i * 2 * Math.PI) / sampleCount;
        points.push({
          x: applyX + Math.cos(angle) * totalR,
          y: applyY + Math.sin(angle) * totalR,
        });
      }

      if (applyY - totalR < minY) {
        minY = applyY - totalR;
        labelX = applyX;
        labelY = applyY - totalR - 12;
      }
    } else if (shape === "oval") {
      // Pada bentuk oval, node dirender dengan rx = hw + 4, ry = hh
      const rx = hw + 4 + padding;
      const ry = hh + padding;
      const sampleCount = 12;
      for (let i = 0; i < sampleCount; i++) {
        const angle = (i * 2 * Math.PI) / sampleCount;
        points.push({
          x: applyX + Math.cos(angle) * rx,
          y: applyY + Math.sin(angle) * ry,
        });
      }

      if (applyY - ry < minY) {
        minY = applyY - ry;
        labelX = applyX;
        labelY = applyY - ry - 12;
      }
    } else {
      // Bentuk standar (rounded, pill, sharp, hexagon)
      const effHw = hw + padding;
      const effHh = hh + padding;

      points.push({ x: applyX - effHw, y: applyY - effHh });
      points.push({ x: applyX + effHw, y: applyY - effHh });
      points.push({ x: applyX + effHw, y: applyY + effHh });
      points.push({ x: applyX - effHw, y: applyY + effHh });

      if (applyY - effHh < minY) {
        minY = applyY - effHh;
        labelX = applyX;
        labelY = applyY - effHh - 12;
      }
    }
  });

  const hull = computeConvexHull(points);
  const pathD = generateSmoothHullSvgPath(hull, 28);

  return {
    id: clusterId,
    title,
    pathD,
    labelX,
    labelY,
    color,
    branchIndex,
    nodeIds: nodes.map((n) => n.node.id),
  };
}
