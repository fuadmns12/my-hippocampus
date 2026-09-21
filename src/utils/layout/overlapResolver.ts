import { MindMapLayout } from "../../types";
import {
  PositionedNode,
  BASE_NODE_WIDTH,
  BASE_NODE_HEIGHT,
  MIN_NODE_SEPARATION_PADDING_X,
  MIN_NODE_SEPARATION_PADDING_Y,
} from "./types";
import { isAncestorDescendant, shiftSubtree } from "./treeMetrics";

// Spacing force & bounding box collision resolution pass:
// Prevents unrelated nodes from overlapping while preserving tight parent-child tree hierarchy
export function resolveNodeOverlaps(nodes: PositionedNode[], layout?: MindMapLayout) {
  if (layout === "grid-network") return;

  const maxPasses = 4;
  const paddingX = MIN_NODE_SEPARATION_PADDING_X;
  const paddingY = MIN_NODE_SEPARATION_PADDING_Y;

  for (let pass = 0; pass < maxPasses; pass++) {
    let moved = false;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];

        const ax = a.x + (a.node.xOffset || 0);
        const ay = a.y + (a.node.yOffset || 0);
        const bx = b.x + (b.node.xOffset || 0);
        const by = b.y + (b.node.yOffset || 0);

        // Required distance based on node dimensions + padding
        const reqW = (a.width + b.width) / 2 + paddingX;
        const reqH = (a.height + b.height) / 2 + paddingY;

        const dx = bx - ax;
        const dy = by - ay;

        const overlapX = reqW - Math.abs(dx);
        // Fast AABB rejection: if horizontal gap exists, no collision possible
        if (overlapX <= 0) continue;

        const overlapY = reqH - Math.abs(dy);
        // Fast AABB rejection: if vertical gap exists, no collision possible
        if (overlapY <= 0) continue;

        // Direct ancestor-descendant node pairs are already positioned by the tree algorithm; do not push them
        if (isAncestorDescendant(a, b)) continue;

        // Bounding box collision confirmed
        moved = true;

          if (layout === "bubble-cluster" || layout === "radial") {
            // 2D radial push for circular/cluster layouts
            const dist = Math.hypot(dx, dy) || 1;
            const nx = dx / dist;
            const ny = dy / dist;
            const pushDist = Math.max(overlapX, overlapY) + 6;

            if (a.depth === 0) {
              shiftSubtree(b, nx * pushDist, ny * pushDist);
            } else if (b.depth === 0) {
              shiftSubtree(a, -nx * pushDist, -ny * pushDist);
            } else if (b.depth > a.depth) {
              shiftSubtree(b, nx * pushDist, ny * pushDist);
            } else if (a.depth > b.depth) {
              shiftSubtree(a, -nx * pushDist, -ny * pushDist);
            } else {
              shiftSubtree(b, (nx * pushDist) / 2, (ny * pushDist) / 2);
              shiftSubtree(a, (-nx * pushDist) / 2, (-ny * pushDist) / 2);
            }
          } else {
            // Apply repulsive spacing force along the direction of smallest overlap for orthogonal trees
            if (overlapX < overlapY) {
              const shiftX = dx >= 0 ? overlapX : -overlapX;
              if (b.depth > a.depth) {
                shiftSubtree(b, shiftX, 0);
              } else if (a.depth > b.depth) {
                shiftSubtree(a, -shiftX, 0);
              } else {
                shiftSubtree(b, shiftX / 2, 0);
                shiftSubtree(a, -shiftX / 2, 0);
              }
            } else {
              const shiftY = dy >= 0 ? overlapY : -overlapY;
              if (b.depth > a.depth) {
                shiftSubtree(b, 0, shiftY);
              } else if (a.depth > b.depth) {
                shiftSubtree(a, 0, -shiftY);
              } else {
                shiftSubtree(b, 0, shiftY / 2);
                shiftSubtree(a, 0, -shiftY / 2);
              }
            }
          }
      }
    }

    if (!moved) break;
  }
}

export function resolveVerticalSiblingStack(siblings: PositionedNode[]) {
  for (let i = 0; i < siblings.length - 1; i++) {
    const s1 = siblings[i];
    const s2 = siblings[i + 1];

    // Separation based on standard base heights so sibling nodes don't move when one is resized
    const minPaddingY = BASE_NODE_HEIGHT + MIN_NODE_SEPARATION_PADDING_Y;

    const dy = s2.y - s1.y;
    if (dy < minPaddingY) {
      const shiftY = minPaddingY - dy;
      for (let k = i + 1; k < siblings.length; k++) {
        shiftSubtree(siblings[k], 0, shiftY);
      }
    }
  }
}

// Dynamically calculates and applies padding/spacing between sibling nodes
export function resolveSiblingOverlaps(pNode: PositionedNode, layout: MindMapLayout) {
  if (layout === "grid-network" || layout === "radial" || layout === "bubble-cluster") return;
  if (!pNode.children || pNode.children.length === 0) return;

  // Recursively process children subtrees first
  pNode.children.forEach((child) => resolveSiblingOverlaps(child, layout));

  const siblings = pNode.children;
  if (siblings.length <= 1) return;

  if (layout === "bilateral-bracket" && pNode.depth === 0) {
    const rightSiblings = siblings.filter((c) => !c.isLeftBranch);
    const leftSiblings = siblings.filter((c) => c.isLeftBranch);

    resolveVerticalSiblingStack(rightSiblings);
    resolveVerticalSiblingStack(leftSiblings);
    return;
  }

  if (layout === "horizontal-tree" || layout === "bilateral-bracket") {
    resolveVerticalSiblingStack(siblings);
  } else if (layout === "vertical-tree") {
    for (let i = 0; i < siblings.length - 1; i++) {
      const s1 = siblings[i];
      const s2 = siblings[i + 1];

      // Minimum horizontal separation based on standard base widths so node resize doesn't push siblings
      const minPaddingX = BASE_NODE_WIDTH + MIN_NODE_SEPARATION_PADDING_X;

      const dx = s2.x - s1.x;
      if (dx < minPaddingX) {
        const shiftX = minPaddingX - dx;
        for (let k = i + 1; k < siblings.length; k++) {
          shiftSubtree(siblings[k], shiftX, 0);
        }
      }
    }
  } else {
    // Fishbone
    for (let i = 0; i < siblings.length - 1; i++) {
      const s1 = siblings[i];
      const s2 = siblings[i + 1];

      const reqW = BASE_NODE_WIDTH + MIN_NODE_SEPARATION_PADDING_X;
      const reqH = BASE_NODE_HEIGHT + MIN_NODE_SEPARATION_PADDING_Y;

      const dx = Math.abs(s2.x - s1.x);
      const dy = Math.abs(s2.y - s1.y);

      if (dx < reqW && dy < reqH) {
        const overlapY = reqH - dy;
        const overlapX = reqW - dx;

        if (overlapY <= overlapX) {
          const shiftY = s2.y >= s1.y ? overlapY : -overlapY;
          for (let k = i + 1; k < siblings.length; k++) {
            shiftSubtree(siblings[k], 0, shiftY);
          }
        } else {
          const shiftX = s2.x >= s1.x ? overlapX : -overlapX;
          for (let k = i + 1; k < siblings.length; k++) {
            shiftSubtree(siblings[k], shiftX, 0);
          }
        }
      }
    }
  }
}
