import { AnchorSide } from "../../../utils/mindmapLayout";
import { ReparentDragState } from "./types";

export interface DispatchConnectionActionParams {
  current: ReparentDragState;
  onReparentNode?: (
    nodeId: string,
    newParentId: string,
    sourceAnchorSide?: AnchorSide,
    targetAnchorSide?: AnchorSide
  ) => void;
  onAddConnection?: (
    sourceNodeId: string,
    sourceAnchorSide: AnchorSide,
    targetNodeId: string,
    targetAnchorSide: AnchorSide
  ) => void;
  onRemoveConnection?: (connectionId: string) => void;
}

/**
 * Menjalankan mutasi tree atau penambahan relasi saat pointer dilepas di atas target valid
 */
export function dispatchConnectionAction({
  current,
  onReparentNode,
  onAddConnection,
  onRemoveConnection,
}: DispatchConnectionActionParams): void {
  if (!current.hoveredTargetNode || !current.targetAnchor || !current.isValidTarget) {
    return;
  }

  const originId = current.sourceNode?.node?.id || current.childNode?.node?.id;
  const targetId = current.hoveredTargetNode.node.id;

  if (current.isMergeAction && onReparentNode) {
    // Hapus koneksi kustom lama jika sedang menggabungkan hierarki yang sudah ada relasinya
    if (current.existingCustomConnectionId && onRemoveConnection) {
      onRemoveConnection(current.existingCustomConnectionId);
    }
    onReparentNode(
      originId,
      targetId,
      current.sourceAnchorSide || current.childAnchor?.side,
      current.targetAnchor.side
    );
  } else if (current.mode === "connect") {
    // Hapus koneksi kustom lama jika sedang re-routing garis yang ada
    if (current.existingCustomConnectionId && onRemoveConnection) {
      onRemoveConnection(current.existingCustomConnectionId);
    }
    if (onAddConnection) {
      onAddConnection(
        current.sourceNode.node.id,
        current.sourceAnchorSide,
        current.hoveredTargetNode.node.id,
        current.targetAnchor.side
      );
    }
  } else if (current.mode === "reparent" && onReparentNode) {
    onReparentNode(
      current.childNode.node.id,
      current.hoveredTargetNode.node.id,
      current.targetAnchor.side,
      current.childAnchor.side
    );
  }
}
