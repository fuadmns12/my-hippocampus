import React, { useState } from "react";
import { MindMapNode } from "../types";
import { X, Edit3, StickyNote } from "lucide-react";
import {
  useNodeEditor,
  NodeBasicFields,
  NodeColorPickerSection,
  NodeChildrenSection,
  NodeReparentSection,
  NodeEditorFooter,
} from "./editor";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal";
import { soundFx } from "../utils/soundEffects";

export interface NodeEditorModalProps {
  node: MindMapNode | null;
  rootNode?: MindMapNode;
  onClose: () => void;
  onSaveNode: (updatedNode: MindMapNode) => void;
  onAddChildNode: (parentId: string, childLabel: string) => void;
  onAddMultipleChildren?: (parentId: string, childLabels: string[]) => void;
  onDeleteNode: (nodeId: string) => void;
  onReparentNode?: (nodeId: string, newParentId: string) => void;
  onOpenNotes?: (node: MindMapNode) => void;
  isRoot: boolean;
}

export const NodeEditorModal: React.FC<NodeEditorModalProps> = ({
  node,
  rootNode,
  onClose,
  onSaveNode,
  onAddChildNode,
  onAddMultipleChildren,
  onDeleteNode,
  onReparentNode,
  onOpenNotes,
  isRoot,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [childToDeleteId, setChildToDeleteId] = useState<string | null>(null);

  const {
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
    selectedParentId,
    setSelectedParentId,
    currentParentId,
    eligibleParents,
    handleSave,
    handleAddChild,
    handleAddMultiple,
    handleNewChildKeyDown,
    handleReparent,
  } = useNodeEditor({
    node,
    rootNode,
    isRoot,
    onSaveNode,
    onAddChildNode,
    onAddMultipleChildren,
    onReparentNode,
    onClose,
  });

  if (!node) return null;

  const childToDelete = node.children?.find((c) => c.id === childToDeleteId);

  return (
    <>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div id="node-editor-modal" className="bg-black border border-cyan-500/40 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
          {/* Modal Header */}
          <div className="px-5 py-4 bg-black border-b border-cyan-500/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Edit3 className="w-4 h-4 text-white" />
              <span>{node.label}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-black border border-cyan-400 hover:border-cyan-300 text-cyan-400 hover:text-cyan-300 hover:bg-neutral-900 transition-colors cursor-pointer shadow-xs flex items-center justify-center"
              title="Tutup Modal"
              aria-label="Tutup"
            >
              <X className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          {/* Modal Form Body */}
          <form onSubmit={handleSave} className="p-5 space-y-4 text-xs bg-black overflow-y-auto flex-1">
            {/* Label, Subtitle, & Emoji Presets */}
            <NodeBasicFields
              label={label}
              setLabel={setLabel}
              subtitle={subtitle}
              setSubtitle={setSubtitle}
              emoji={emoji}
              setEmoji={setEmoji}
            />

            {/* Color Customization (Background & Border) */}
            <NodeColorPickerSection
              bgColor={bgColor}
              setBgColor={setBgColor}
              borderColor={borderColor}
              setBorderColor={setBorderColor}
              labelPreview={label}
              emojiPreview={emoji}
            />

            {/* Add Sub-Child & Children List */}
            <NodeChildrenSection
              childrenNodes={node.children}
              newChildLabel={newChildLabel}
              setNewChildLabel={setNewChildLabel}
              onAddChild={handleAddChild}
              onAddMultipleChildren={handleAddMultiple}
              onKeyDown={handleNewChildKeyDown}
              onDeleteChildNode={(childId) => setChildToDeleteId(childId)}
            />

            {/* Reparent / Move Node to Different Parent */}
            {!isRoot && rootNode && onReparentNode && eligibleParents.length > 0 && (
              <NodeReparentSection
                eligibleParents={eligibleParents}
                selectedParentId={selectedParentId}
                setSelectedParentId={setSelectedParentId}
                currentParentId={currentParentId}
                onReparent={handleReparent}
              />
            )}

            {/* Quick Notes Access */}
            {onOpenNotes && (
              <div className="pt-2 border-t border-cyan-500/30 select-none">
                <button
                  id="btn-open-notes-from-editor"
                  type="button"
                  onClick={() => {
                    soundFx.play("click");
                    onClose();
                    onOpenNotes(node);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold tracking-wider bg-black text-white border border-cyan-500/40 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-sm"
                >
                  <StickyNote className="w-3.5 h-3.5 text-white" />
                  <span>
                    {node.notes && node.notes.length > 0
                      ? `CATATAN UNTUK KARTU INI (${node.notes.length})`
                      : "CATATAN UNTUK KARTU INI (+ TULIS)"}
                  </span>
                </button>
              </div>
            )}

            {/* Action Footer */}
            <NodeEditorFooter
              isRoot={isRoot}
              onRequestDelete={() => setShowDeleteModal(true)}
              onClose={onClose}
            />
          </form>
        </div>
      </div>

      {/* Popup Konfirmasi Hapus Kartu Ini */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDeleteNode(node.id);
          setShowDeleteModal(false);
          onClose();
        }}
        title="Hapus Kartu Dari Kanvas"
        description="Apakah Anda yakin ingin menghapus kartu ini beserta semua sub-cabangnya dari kanvas?"
        itemName={node.label}
        confirmLabel="HAPUS KARTU"
      />

      {/* Popup Konfirmasi Hapus Sub-Cabang */}
      <ConfirmDeleteModal
        isOpen={Boolean(childToDeleteId)}
        onClose={() => setChildToDeleteId(null)}
        onConfirm={() => {
          if (childToDeleteId) {
            onDeleteNode(childToDeleteId);
            setChildToDeleteId(null);
          }
        }}
        title="Hapus Sub-Cabang"
        description="Apakah Anda yakin ingin menghapus sub-cabang ini beserta percabangan di bawahnya?"
        itemName={childToDelete?.label || "Sub-cabang"}
        confirmLabel="HAPUS SUB-CABANG"
      />
    </>
  );
};
