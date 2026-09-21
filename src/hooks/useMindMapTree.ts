import { useState } from "react";
import { MindMapData, MindMapNode } from "../types";
import {
  useTreeRootOperations,
  useTreeNodeMutations,
  useTreeReparentAndConnections,
  useTreeHistory,
} from "./mindMapTree";

export function useMindMapTree(
  onTitleSubtitleChange?: (title: string, subtitle: string) => void,
  showToast?: (msg: string) => void
) {
  const {
    mindMapData,
    setMindMapData,
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
  } = useTreeHistory(showToast);
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [selectedNodeForNotes, setSelectedNodeForNotes] =
    useState<MindMapNode | null>(null);

  // 1. Operasi Root dan Multi-Root pada kanvas
  const {
    getAllRoots,
    getActiveRoot,
    handleAddMindMap,
    handleRemoveMindMap,
    handleSetActiveRoot,
  } = useTreeRootOperations({
    mindMapData,
    setMindMapData,
    showToast,
  });

  // 2. Mutasi CRUD Node (Simpan, Catatan, Tambah Anak, Hapus, Lipat/Collapse)
  const {
    handleSaveNode,
    handleSaveNotes,
    handleAddChildNode,
    handleAddMultipleChildren,
    handleAddRichChildren,
    handleDeleteNode,
    handleToggleCollapseNode,
  } = useTreeNodeMutations({
    selectedNode,
    setSelectedNode,
    setMindMapData,
    onTitleSubtitleChange,
    showToast,
  });

  // 3. Reparenting, Pemisahan Topik Mandiri, Koneksi Kustom & Transformasi Posisi
  const {
    handleReparentNode,
    handleDetachNodeAsRoot,
    handleAddConnection,
    handleRemoveConnection,
    handleUpdateNodeOffset,
    handleUpdateNodeScale,
    handleResetNodeOffsets,
  } = useTreeReparentAndConnections({
    selectedNode,
    setSelectedNode,
    setMindMapData,
    showToast,
  });

  return {
    mindMapData,
    setMindMapData,
    selectedNode,
    setSelectedNode,
    selectedNodeForNotes,
    setSelectedNodeForNotes,
    getAllRoots,
    getActiveRoot,
    handleAddMindMap,
    handleRemoveMindMap,
    handleSetActiveRoot,
    handleSaveNode,
    handleSaveNotes,
    handleAddChildNode,
    handleAddMultipleChildren,
    handleAddRichChildren,
    handleDeleteNode,
    handleReparentNode,
    handleDetachNodeAsRoot,
    handleAddConnection,
    handleRemoveConnection,
    handleToggleCollapseNode,
    handleUpdateNodeOffset,
    handleUpdateNodeScale,
    handleResetNodeOffsets,
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
  };
}
