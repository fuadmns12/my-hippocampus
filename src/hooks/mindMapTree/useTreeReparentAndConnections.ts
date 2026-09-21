import React, { useCallback } from "react";
import { MindMapData, MindMapNode, AnchorSide } from "../../types";
import { soundFx } from "../../utils/soundEffects";
import { findNodeInAnyTree } from "../../utils/nodeTreeOperations";
import {
  getAllRootsFromData,
  reparentNodeAcrossTrees,
  detachNodeAsRootFromData,
  addConnectionToData,
  removeConnectionFromData,
  updateNodeOffsetInData,
  updateNodeScaleInData,
  resetNodeOffsetsInData,
} from "./index";

export interface UseTreeReparentAndConnectionsParams {
  selectedNode: MindMapNode | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<MindMapNode | null>>;
  setMindMapData: React.Dispatch<React.SetStateAction<MindMapData | null>>;
  showToast?: (msg: string) => void;
}

export function useTreeReparentAndConnections({
  selectedNode,
  setSelectedNode,
  setMindMapData,
  showToast,
}: UseTreeReparentAndConnectionsParams) {
  // Pindahkan node ke parent baru atau ubah anchor
  const handleReparentNode = useCallback(
    (
      nodeId: string,
      newParentId: string,
      sourceAnchorSide?: AnchorSide,
      targetAnchorSide?: AnchorSide
    ) => {
      soundFx.play("connect");
      let movedLabel: string | null = null;
      let nodeToSelect: MindMapNode | null = null;
      let isSameParent = false;

      setMindMapData((prev) => {
        if (!prev || nodeId === newParentId) return prev;
        const res = reparentNodeAcrossTrees(
          prev,
          nodeId,
          newParentId,
          sourceAnchorSide,
          targetAnchorSide
        );
        if (!res.movedNode) return prev;

        movedLabel = res.movedNode.label;
        isSameParent = res.isSameParentChange;

        if (selectedNode && selectedNode.id === nodeId) {
          const all = getAllRootsFromData(res.nextData);
          nodeToSelect = findNodeInAnyTree(all, nodeId) || null;
        }

        return res.nextData;
      });

      if (movedLabel && showToast) {
        if (isSameParent && sourceAnchorSide) {
          const SIDE_NAMES: Record<AnchorSide, string> = {
            top: "Atas",
            bottom: "Bawah",
            left: "Kiri",
            right: "Kanan",
          };
          showToast(`Garis rute "${movedLabel}" dipindahkan ke Anchor ${SIDE_NAMES[sourceAnchorSide]}!`);
        } else {
          showToast(`Node "${movedLabel}" berhasil dipindahkan ke induk baru (warna cabang & dote diselaraskan)!`);
        }
      }
      if (nodeToSelect) {
        setSelectedNode(nodeToSelect);
      }
    },
    [selectedNode, setMindMapData, setSelectedNode, showToast]
  );

  // Putuskan child branch dan jadikan Topik Mandiri (floating root)
  const handleDetachNodeAsRoot = useCallback(
    (nodeId: string, currentPos?: { x: number; y: number }) => {
      soundFx.play("detach");
      let detachedLabel: string | null = null;

      setMindMapData((prev) => {
        if (!prev) return prev;
        const { nextData, detachedNode } = detachNodeAsRootFromData(prev, nodeId, currentPos);
        if (detachedNode) {
          detachedLabel = detachedNode.label;
        }
        return nextData;
      });

      if (detachedLabel && showToast) {
        showToast(`Garis rute terputus! Cabang "${detachedLabel}" kini menjadi Topik Mandiri di kanvas.`);
      }
    },
    [setMindMapData, showToast]
  );

  // Tambah koneksi kustom antar 2 node
  const handleAddConnection = useCallback(
    (
      sourceNodeId: string,
      sourceAnchorSide: AnchorSide,
      targetNodeId: string,
      targetAnchorSide: AnchorSide,
      label?: string
    ) => {
      soundFx.play("connect");
      let toastMsgToDisplay: string | undefined;

      setMindMapData((prev) => {
        if (!prev) return prev;
        const { nextData, toastMsg } = addConnectionToData(
          prev,
          sourceNodeId,
          sourceAnchorSide,
          targetNodeId,
          targetAnchorSide,
          label
        );
        toastMsgToDisplay = toastMsg;
        return nextData;
      });

      if (toastMsgToDisplay && showToast) {
        showToast(toastMsgToDisplay);
      }
    },
    [setMindMapData, showToast]
  );

  // Hapus koneksi kustom
  const handleRemoveConnection = useCallback(
    (connectionId: string) => {
      soundFx.play("delete");
      setMindMapData((prev) => (prev ? removeConnectionFromData(prev, connectionId) : prev));

      if (showToast) {
        showToast("Koneksi antar node berhasil dihapus");
      }
    },
    [setMindMapData, showToast]
  );

  // Update Node Offset (Drag bebas di kanvas)
  const handleUpdateNodeOffset = useCallback(
    (nodeId: string, xOffset: number, yOffset: number) => {
      setMindMapData((prev) => (prev ? updateNodeOffsetInData(prev, nodeId, xOffset, yOffset) : prev));
    },
    [setMindMapData]
  );

  // Update Node Scale (Resize ukuran node)
  const handleUpdateNodeScale = useCallback(
    (nodeId: string, scale: number) => {
      setMindMapData((prev) => (prev ? updateNodeScaleInData(prev, nodeId, scale) : prev));
    },
    [setMindMapData]
  );

  // Reset Node Offsets
  const handleResetNodeOffsets = useCallback(() => {
    setMindMapData((prev) => (prev ? resetNodeOffsetsInData(prev) : prev));
  }, [setMindMapData]);

  return {
    handleReparentNode,
    handleDetachNodeAsRoot,
    handleAddConnection,
    handleRemoveConnection,
    handleUpdateNodeOffset,
    handleUpdateNodeScale,
    handleResetNodeOffsets,
  };
}
