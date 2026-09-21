import React, { useState, useMemo, useEffect, useCallback, type Dispatch, type SetStateAction } from "react";
import { PositionedNode } from "../../../utils/mindmapLayout";
import { MindMapNode } from "../../../types";
import { soundFx } from "../../../utils/soundEffects";
import { CanvasSpotlightState, BreadcrumbItem } from "./types";

export function useCanvasSpotlight(
  rootNode: MindMapNode,
  nodes: PositionedNode[],
  controlledDrillDown?: {
    drillDownNodeId: string | null;
    setDrillDownNodeId: Dispatch<SetStateAction<string | null>>;
  }
): CanvasSpotlightState {
  const [internalSpotlightNodeId, setSpotlightNodeId] = useState<string | null>(null);
  const [internalDrillDownNodeId, setInternalDrillDownNodeId] = useState<string | null>(null);

  const drillDownNodeId = controlledDrillDown
    ? controlledDrillDown.drillDownNodeId
    : internalDrillDownNodeId;
  const setDrillDownNodeId = controlledDrillDown
    ? controlledDrillDown.setDrillDownNodeId
    : setInternalDrillDownNodeId;

  const spotlightNodeId = internalSpotlightNodeId;

  const nodeMap = useMemo(() => {
    const map = new Map<string, PositionedNode>();
    nodes.forEach((n) => map.set(n.node.id, n));
    return map;
  }, [nodes]);

  // Compute set of spotlighted node IDs (ancestors + node + descendants)
  const spotlightNodeIds = useMemo(() => {
    if (!spotlightNodeId) return null;
    const target = nodeMap.get(spotlightNodeId);
    if (!target) return null;

    const ids = new Set<string>();

    // 1. Target node itself
    ids.add(target.node.id);

    // 2. Ancestors up to root (gives context pathway)
    let curr = target.parent;
    while (curr) {
      ids.add(curr.node.id);
      curr = curr.parent;
    }

    // 3. All descendants of the spotlighted subtree
    function addDescendants(pNode: PositionedNode) {
      if (pNode.children) {
        pNode.children.forEach((child) => {
          ids.add(child.node.id);
          addDescendants(child);
        });
      }
    }
    addDescendants(target);

    return ids;
  }, [spotlightNodeId, nodeMap]);

  const spotlightNodeLabel = useMemo(() => {
    if (!spotlightNodeId) return null;
    const target = nodeMap.get(spotlightNodeId);
    return target?.node.label || null;
  }, [spotlightNodeId, nodeMap]);

  const toggleSpotlightNode = useCallback((nodeId: string) => {
    soundFx.play("click");
    setSpotlightNodeId((prev) => (prev === nodeId ? null : nodeId));
  }, []);

  const clearSpotlight = useCallback(() => {
    soundFx.play("click");
    setSpotlightNodeId(null);
  }, []);

  // Subtree Drill-down mode ("Masuk ke Cabang Ini")
  const drillDown = useCallback((nodeId: string) => {
    soundFx.play("spawn");
    setDrillDownNodeId(nodeId);
    setSpotlightNodeId(null);
  }, []);

  const exitDrillDown = useCallback(() => {
    soundFx.play("click");
    setDrillDownNodeId(null);
  }, []);

  const jumpBreadcrumb = useCallback((nodeId: string) => {
    soundFx.play("click");
    if (nodeId === rootNode.id) {
      setDrillDownNodeId(null);
    } else {
      setDrillDownNodeId(nodeId);
    }
  }, [rootNode.id]);

  // Compute breadcrumbs path when drilled down
  const breadcrumbs = useMemo(() => {
    if (!drillDownNodeId) return [];
    const crumbs: BreadcrumbItem[] = [];
    crumbs.push({ id: rootNode.id, label: rootNode.label || "Peta Utama" });

    if (drillDownNodeId === rootNode.id) return crumbs;

    // Trace path from drillDownNodeId up to rootNode
    const path: BreadcrumbItem[] = [];
    let curr = nodeMap.get(drillDownNodeId);
    while (curr && curr.node.id !== rootNode.id) {
      path.unshift({ id: curr.node.id, label: curr.node.label || "Cabang" });
      curr = curr.parent;
    }

    return crumbs.concat(path);
  }, [drillDownNodeId, rootNode, nodeMap]);

  // Keyboard shortcut: Escape to clear spotlight or exit drilldown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (spotlightNodeId) {
          setSpotlightNodeId(null);
        } else if (drillDownNodeId) {
          setDrillDownNodeId(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [spotlightNodeId, drillDownNodeId]);

  return {
    spotlightNodeId,
    spotlightNodeIds,
    spotlightNodeLabel,
    drillDownNodeId,
    breadcrumbs,
    toggleSpotlightNode,
    clearSpotlight,
    drillDown,
    exitDrillDown,
    jumpBreadcrumb,
  };
}
