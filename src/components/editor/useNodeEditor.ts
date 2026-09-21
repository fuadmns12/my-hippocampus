import React, { useState, useEffect, useMemo } from "react";
import { MindMapNode } from "../../types";
import { ALL_EMOJIS } from "../grouping/emojiPresets";

export const EMOJI_PRESETS = ALL_EMOJIS;

export interface EligibleParentItem {
  id: string;
  label: string;
  emoji?: string;
  depth: number;
}

export interface UseNodeEditorProps {
  node: MindMapNode | null;
  rootNode?: MindMapNode;
  isRoot: boolean;
  onSaveNode: (updatedNode: MindMapNode) => void;
  onAddChildNode: (parentId: string, childLabel: string) => void;
  onAddMultipleChildren?: (parentId: string, childLabels: string[]) => void;
  onReparentNode?: (nodeId: string, newParentId: string) => void;
  onClose: () => void;
}

export function useNodeEditor({
  node,
  rootNode,
  isRoot,
  onSaveNode,
  onAddChildNode,
  onAddMultipleChildren,
  onReparentNode,
  onClose,
}: UseNodeEditorProps) {
  const [label, setLabel] = useState(node?.label || "");
  const [subtitle, setSubtitle] = useState(node?.subtitle || "");
  const [emoji, setEmoji] = useState(node?.emoji || "");
  const [bgColor, setBgColor] = useState(node?.bgColor || "");
  const [borderColor, setBorderColor] = useState(node?.borderColor || node?.color || "");
  const [newChildLabel, setNewChildLabel] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string>("");

  // Collect descendant IDs to prevent cyclical parenting
  const descendantIds = useMemo(() => {
    if (!node) return new Set<string>();
    const set = new Set<string>();
    function collect(curr: MindMapNode) {
      set.add(curr.id);
      if (curr.children) {
        curr.children.forEach(collect);
      }
    }
    collect(node);
    return set;
  }, [node]);

  // Find current parent ID
  const currentParentId = useMemo(() => {
    if (!node || !rootNode || isRoot) return null;
    let parent: string | null = null;
    function findParent(curr: MindMapNode) {
      if (curr.children) {
        if (curr.children.some((c) => c.id === node.id)) {
          parent = curr.id;
          return;
        }
        curr.children.forEach(findParent);
      }
    }
    findParent(rootNode);
    return parent;
  }, [node, rootNode, isRoot]);

  // Collect all eligible parents with depth
  const eligibleParents = useMemo<EligibleParentItem[]>(() => {
    if (!rootNode || !node || isRoot) return [];
    const list: EligibleParentItem[] = [];

    function traverse(curr: MindMapNode, depth: number) {
      if (!descendantIds.has(curr.id)) {
        list.push({
          id: curr.id,
          label: curr.label,
          emoji: curr.emoji,
          depth,
        });
        if (curr.children) {
          curr.children.forEach((c) => traverse(c, depth + 1));
        }
      }
    }

    traverse(rootNode, 0);
    return list;
  }, [rootNode, node, isRoot, descendantIds]);

  useEffect(() => {
    if (node) {
      setLabel(node.label);
      setSubtitle(node.subtitle || "");
      setEmoji(node.emoji || "");
      setBgColor(node.bgColor || "");
      setBorderColor(node.borderColor || node.color || "");
      setConfirmDelete(false);
      if (currentParentId) {
        setSelectedParentId(currentParentId);
      }
    }
  }, [node, currentParentId]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!node) return;

    const isReparenting = Boolean(
      selectedParentId &&
      selectedParentId !== currentParentId &&
      onReparentNode
    );

    onSaveNode({
      ...node,
      label,
      subtitle: subtitle.trim() || undefined,
      emoji: emoji.trim() || undefined,
      bgColor: bgColor.trim() || undefined,
      // Saat pindah ke parent baru, bersihkan border/color manual agar otomatis mewarisi warna rute dan lineage dot induk baru
      borderColor: isReparenting ? undefined : (borderColor.trim() || undefined),
      color: isReparenting ? undefined : (borderColor.trim() || undefined),
    });

    if (isReparenting && onReparentNode) {
      onReparentNode(node.id, selectedParentId);
    }

    onClose();
  };

  const handleAddChild = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!node || !newChildLabel.trim()) return;

    // Check if input has multiple lines or commas
    const items = newChildLabel
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (items.length > 1) {
      if (onAddMultipleChildren) {
        onAddMultipleChildren(node.id, items);
      } else {
        items.forEach((item) => onAddChildNode(node.id, item));
      }
    } else if (items.length === 1) {
      onAddChildNode(node.id, items[0]);
    }
    setNewChildLabel("");
  };

  const handleAddMultiple = (childLabels: string[]) => {
    if (!node) return;
    const valid = childLabels.map((l) => l.trim()).filter((l) => l.length > 0);
    if (valid.length === 0) return;

    if (onAddMultipleChildren) {
      onAddMultipleChildren(node.id, valid);
    } else {
      valid.forEach((lbl) => onAddChildNode(node.id, lbl));
    }
  };

  const handleNewChildKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      handleAddChild();
    }
  };

  const handleReparent = () => {
    if (!node || !onReparentNode) return;
    if (selectedParentId && selectedParentId !== currentParentId) {
      onSaveNode({
        ...node,
        label,
        subtitle: subtitle.trim() || undefined,
        emoji: emoji.trim() || undefined,
        bgColor: bgColor.trim() || undefined,
        borderColor: undefined,
        color: undefined,
      });
      onReparentNode(node.id, selectedParentId);
      onClose();
    }
  };

  return {
    label,
    setLabel,
    subtitle,
    setSubtitle,
    emoji,
    setEmoji,
    bgColor,
    setBgColor,
    borderColor,
    setBorderColor,
    newChildLabel,
    setNewChildLabel,
    confirmDelete,
    setConfirmDelete,
    selectedParentId,
    setSelectedParentId,
    currentParentId,
    eligibleParents,
    handleSave,
    handleAddChild,
    handleAddMultiple,
    handleNewChildKeyDown,
    handleReparent,
  };
}
