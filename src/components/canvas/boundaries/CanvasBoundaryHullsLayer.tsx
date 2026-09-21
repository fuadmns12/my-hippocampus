import React, { useMemo } from "react";
import { PositionedNode } from "../../../utils/mindmapLayout";
import {
  buildBoundaryHullForNodes,
  ComputedBoundaryHull,
} from "../../../utils/layout/boundaryHull";
import { CanvasBoundaryHullsLayerProps } from "./types";

function getNodeRootId(node: PositionedNode): string {
  if (node.rootId) return node.rootId;
  let curr = node;
  while (curr.parent) {
    curr = curr.parent;
  }
  return curr.node?.id || "root-0";
}

export const CanvasBoundaryHullsLayer = React.memo<CanvasBoundaryHullsLayerProps>(({
  nodes,
  nodeShape,
  palette,
  boundaries = [],
  showBranchBoundaries = true,
  getBranchStyle,
  spotlightNodeIds,
  onSelectBoundary,
}) => {
  const nodeMap = useMemo(() => {
    const map = new Map<string, PositionedNode>();
    nodes.forEach((n) => map.set(n.node.id, n));
    return map;
  }, [nodes]);

  // Compute automatic branch boundary hulls
  const computedHulls = useMemo(() => {
    const list: ComputedBoundaryHull[] = [];

    // 1. Automatic Branch Boundaries (Grouping by primary branch per mind map / root)
    if (showBranchBoundaries) {
      interface BranchGroup {
        rootId: string;
        branchIndex: number;
        nodes: PositionedNode[];
      }
      const branchBuckets = new Map<string, BranchGroup>();

      nodes.forEach((n) => {
        if (n.depth > 0) {
          const rootId = getNodeRootId(n);
          const key = `${rootId}__b_${n.branchIndex}`;
          let group = branchBuckets.get(key);
          if (!group) {
            group = {
              rootId,
              branchIndex: n.branchIndex,
              nodes: [],
            };
            branchBuckets.set(key, group);
          }
          group.nodes.push(n);
        }
      });

      branchBuckets.forEach((group) => {
        const { rootId, branchIndex, nodes: bNodes } = group;
        if (bNodes.length < 1) return;
        // Find the depth 1 main branch node to name this group
        const mainNode = bNodes.find((n) => n.depth === 1) || bNodes[0];
        const title = `Batas: ${mainNode.node.label || `Cabang ${branchIndex + 1}`}`;
        const bStyle = getBranchStyle(branchIndex);
        const color = bStyle.link || palette.defaultLink || "#38bdf8";

        const hull = buildBoundaryHullForNodes(
          `branch-hull-${rootId}-${branchIndex}`,
          title,
          bNodes,
          color,
          branchIndex,
          26,
          nodeShape
        );
        if (hull) {
          list.push(hull);
        }
      });
    }

    // 2. Custom Defined Boundaries
    if (boundaries && boundaries.length > 0) {
      boundaries.forEach((bGroup) => {
        const clusterNodes = bGroup.nodeIds
          .map((id) => nodeMap.get(id))
          .filter((n): n is PositionedNode => Boolean(n));

        if (clusterNodes.length > 0) {
          // Group cluster nodes by root to ensure a boundary never bridges different mind maps
          const byRoot = new Map<string, PositionedNode[]>();
          clusterNodes.forEach((cn) => {
            const rootId = getNodeRootId(cn);
            const arr = byRoot.get(rootId) || [];
            arr.push(cn);
            byRoot.set(rootId, arr);
          });

          byRoot.forEach((nodesForRoot, rootId) => {
            const color = bGroup.color || "#06b6d4";
            const hull = buildBoundaryHullForNodes(
              byRoot.size > 1 ? `${bGroup.id}-${rootId}` : bGroup.id,
              bGroup.title,
              nodesForRoot,
              color,
              undefined,
              28,
              nodeShape
            );
            if (hull) {
              list.push(hull);
            }
          });
        }
      });
    }

    return list;
  }, [nodes, nodeShape, showBranchBoundaries, boundaries, getBranchStyle, palette, nodeMap]);

  if (computedHulls.length === 0) return null;

  const isSpotlightActive = Boolean(spotlightNodeIds && spotlightNodeIds.size > 0);

  return (
    <g className="boundary-hulls" pointerEvents="none">
      {computedHulls.map((hull) => {
        // If spotlight is active, determine if this boundary's nodes are spotlighted
        const hasSpotlightedNodes = isSpotlightActive
          ? hull.nodeIds.some((id) => spotlightNodeIds!.has(id))
          : true;
        const opacity = isSpotlightActive
          ? hasSpotlightedNodes
            ? 1
            : 0.15
          : 0.85;

        return (
          <g
            key={hull.id}
            id={`boundary-${hull.id}`}
            opacity={opacity}
            className="transition-opacity duration-200"
          >
            {/* Soft Organic Cloud Hull Fill & Delicate Border */}
            <path
              d={hull.pathD}
              fill={hull.color}
              fillOpacity={palette.isDark ? 0.08 : 0.06}
              stroke={hull.color}
              strokeWidth={1.8}
              strokeDasharray="6 4"
              strokeOpacity={0.65}
              style={{
                filter: `drop-shadow(0 0 10px ${hull.color}15)`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectBoundary) {
                  onSelectBoundary(hull.id, hull.nodeIds);
                }
              }}
              className="cursor-pointer transition-[stroke-width,stroke-opacity,fill-opacity] duration-150 hover:stroke-width-2"
            />
          </g>
        );
      })}
    </g>
  );
});
