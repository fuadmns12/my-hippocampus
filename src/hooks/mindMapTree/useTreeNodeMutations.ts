import React, { useCallback } from "react";
import { MindMapData, MindMapNode, NodeNote } from "../../types";
import { soundFx } from "../../utils/soundEffects";
import { findNodeInAnyTree } from "../../utils/nodeTreeOperations";
import {
  getAllRootsFromData,
  saveNodeToData,
  saveNotesToData,
  addChildNodeToData,
  addMultipleChildrenToData,
  addRichChildrenToData,
  deleteNodeFromData,
  toggleCollapseNodeInData,
} from "./index";

export interface UseTreeNodeMutationsParams {
  selectedNode: MindMapNode | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<MindMapNode | null>>;
  setMindMapData: React.Dispatch<React.SetStateAction<MindMapData | null>>;
  onTitleSubtitleChange?: (title: string, subtitle: string) => void;
  showToast?: (msg: string) => void;
}

export function useTreeNodeMutations({
  selectedNode,
  setSelectedNode,
  setMindMapData,
  onTitleSubtitleChange,
  showToast,
}: UseTreeNodeMutationsParams) {
  // Edit Node pada seluruh pohon
  const handleSaveNode = useCallback(
    (updatedNode: MindMapNode) => {
      soundFx.play("click");
      let wasMainRoot = false;
      setMindMapData((prev) => {
        if (!prev) return prev;
        const { nextData, isMainRoot } = saveNodeToData(prev, updatedNode);
        wasMainRoot = isMainRoot;
        return nextData;
      });

      if (wasMainRoot && onTitleSubtitleChange) {
        onTitleSubtitleChange(updatedNode.label, updatedNode.subtitle || "");
      }
    },
    [onTitleSubtitleChange, setMindMapData]
  );

  // Simpan Catatan (Notes) untuk Node
  const handleSaveNotes = useCallback(
    (nodeId: string, notes: NodeNote[]) => {
      soundFx.play("click");
      setMindMapData((prev) => (prev ? saveNotesToData(prev, nodeId, notes) : prev));
    },
    [setMindMapData]
  );

  // Tambah single child node
  const handleAddChildNode = useCallback(
    (parentId: string, childLabel: string) => {
      soundFx.play("spawn");
      let nodeToSelect: MindMapNode | null = null;
      setMindMapData((prev) => {
        if (!prev) return prev;
        const { nextData } = addChildNodeToData(prev, parentId, childLabel);

        if (selectedNode && selectedNode.id === parentId) {
          const all = getAllRootsFromData(nextData);
          nodeToSelect = findNodeInAnyTree(all, parentId) || null;
        }

        return nextData;
      });

      if (nodeToSelect) {
        setSelectedNode(nodeToSelect);
      }
    },
    [selectedNode, setMindMapData, setSelectedNode]
  );

  // Tambah multiple child nodes sekaligus
  const handleAddMultipleChildren = useCallback(
    (parentId: string, childLabels: string[]) => {
      soundFx.play("spawn");
      let nodeToSelect: MindMapNode | null = null;
      setMindMapData((prev) => {
        if (!prev) return prev;
        const nextData = addMultipleChildrenToData(prev, parentId, childLabels);

        if (selectedNode && selectedNode.id === parentId) {
          const all = getAllRootsFromData(nextData);
          nodeToSelect = findNodeInAnyTree(all, parentId) || null;
        }

        return nextData;
      });

      if (nodeToSelect) {
        setSelectedNode(nodeToSelect);
      }
    },
    [selectedNode, setMindMapData, setSelectedNode]
  );

  // Tambah multiple rich children (dengan emoji, subtitle, notes)
  const handleAddRichChildren = useCallback(
    (
      parentId: string,
      children: Array<{
        label: string;
        subtitle?: string;
        emoji?: string;
        notes?: Array<{ title: string; content: string }>;
      }>
    ) => {
      soundFx.play("spawn");
      let nodeToSelect: MindMapNode | null = null;
      setMindMapData((prev) => {
        if (!prev) return prev;
        const nextData = addRichChildrenToData(prev, parentId, children);

        if (selectedNode && selectedNode.id === parentId) {
          const all = getAllRootsFromData(nextData);
          nodeToSelect = findNodeInAnyTree(all, parentId) || null;
        }

        return nextData;
      });

      if (nodeToSelect) {
        setSelectedNode(nodeToSelect);
      }
    },
    [selectedNode, setMindMapData, setSelectedNode]
  );

  // Hapus node
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      soundFx.play("delete");
      let toastMsgToDisplay: string | undefined;
      let shouldClearSelected = false;
      let newSelected: MindMapNode | null = null;

      setMindMapData((prev) => {
        if (!prev) return prev;
        const { nextData, toastMsg, isDeletedNodeRoot } = deleteNodeFromData(prev, nodeId);
        toastMsgToDisplay = toastMsg;

        if (selectedNode) {
          if (selectedNode.id === nodeId || isDeletedNodeRoot) {
            shouldClearSelected = true;
          } else if (nextData) {
            const all = getAllRootsFromData(nextData);
            newSelected = findNodeInAnyTree(all, selectedNode.id) || null;
            if (!newSelected) {
              shouldClearSelected = true;
            }
          } else {
            shouldClearSelected = true;
          }
        }

        return nextData;
      });

      if (toastMsgToDisplay && showToast) {
        showToast(toastMsgToDisplay);
      }
      if (shouldClearSelected) {
        setSelectedNode(null);
      } else if (newSelected) {
        setSelectedNode(newSelected);
      }
    },
    [selectedNode, setMindMapData, setSelectedNode, showToast]
  );

  // Toggle Collapse
  const handleToggleCollapseNode = useCallback(
    (nodeId: string) => {
      soundFx.play("toggle");
      setMindMapData((prev) => (prev ? toggleCollapseNodeInData(prev, nodeId) : prev));
    },
    [setMindMapData]
  );

  return {
    handleSaveNode,
    handleSaveNotes,
    handleAddChildNode,
    handleAddMultipleChildren,
    handleAddRichChildren,
    handleDeleteNode,
    handleToggleCollapseNode,
  };
}
