import React, { useState } from "react";
import { MindMapNode, NodeNote } from "../types";
import {
  X,
  Plus,
  ArrowLeft,
  CheckCircle2,
  StickyNote,
} from "lucide-react";
import { useNodeNotesManager } from "./notes/useNodeNotesManager";
import { NoteEditorForm } from "./notes/NoteEditorForm";
import { NotesList } from "./notes/NotesList";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal";
import { soundFx } from "../utils/soundEffects";

interface NodeNotesModalProps {
  node: MindMapNode | null;
  onClose: () => void;
  onSaveNotes: (nodeId: string, notes: NodeNote[]) => void;
}

export const NodeNotesModal: React.FC<NodeNotesModalProps> = ({
  node,
  onClose,
  onSaveNotes,
}) => {
  const [noteToDelete, setNoteToDelete] = useState<{ id: string; title: string } | null>(null);

  // Phase 1: State, auto-save and synchronization management
  const {
    notes,
    activeNoteId,
    activeTitle,
    activeContent,
    justSaved,
    handleClose,
    handleAddNewNote,
    handleSelectNote,
    handleBackToList,
    handleTitleChange,
    handleContentChange,
    handleDeleteNote,
    formatDate,
  } = useNodeNotesManager({
    node,
    onClose,
    onSaveNotes,
  });

  if (!node) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div id="node-notes-modal" className="bg-black border border-cyan-500/40 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="px-5 py-4 bg-black border-b border-cyan-500/30 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <span className="p-1.5 rounded-lg bg-black text-white border border-cyan-500/30">
                <StickyNote className="w-4 h-4 text-white" />
              </span>
              <div className="flex flex-col">
                <span className="flex items-center gap-1.5">
                  <span>Catatan:</span>
                  <span className="text-white font-semibold">
                    {node.emoji} {node.label}
                  </span>
                </span>
                <span className="text-[11px] text-white font-normal">
                  {notes.length} Catatan tersimpan
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {justSaved && (
                <span className="text-[11px] text-white flex items-center gap-1 bg-black px-2 py-0.5 rounded-full border border-cyan-500/30">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  Tersimpan
                </span>
              )}
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg bg-black border border-cyan-400 hover:border-cyan-300 text-cyan-400 hover:text-cyan-300 hover:bg-neutral-900 transition-colors cursor-pointer shadow-xs flex items-center justify-center"
                title="Tutup & Simpan Otomatis"
                id="btn-close-notes-modal"
              >
                <X className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>

          {/* Modal Body: Active Note Editor or Notes List */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4 bg-black">
            {/* Main Action Bar */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-cyan-500/30 select-none">
              {activeNoteId ? (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.play("click");
                    handleBackToList();
                  }}
                  id="btn-back-to-notes-list"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider bg-black text-neutral-300 border border-neutral-700/80 hover:bg-neutral-900 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-sm"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-white" />
                  <span>SEMUA CATATAN</span>
                </button>
              ) : (
                <span className="text-xs text-white font-medium">
                  Daftar Catatan Node
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  soundFx.play("spawn");
                  handleAddNewNote();
                }}
                id="btn-add-new-note"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold tracking-wider bg-black text-white border border-cyan-500/50 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                <span>TAMBAH CATATAN</span>
              </button>
            </div>

            {/* Phase 2: Active Note Editor */}
            {activeNoteId ? (
              <NoteEditorForm
                activeTitle={activeTitle}
                activeContent={activeContent}
                activeNoteId={activeNoteId}
                onTitleChange={handleTitleChange}
                onContentChange={handleContentChange}
                onRequestDelete={() =>
                  setNoteToDelete({ id: activeNoteId, title: activeTitle })
                }
                onBackToList={handleBackToList}
                onSaveAndClose={handleClose}
              />
            ) : null}

            {/* Phase 2: Notes List & Empty State */}
            <NotesList
              notes={notes}
              nodeLabel={node.label}
              activeNoteId={activeNoteId}
              onSelectNote={handleSelectNote}
              onAddNewNote={handleAddNewNote}
              onRequestDelete={(noteItem) =>
                setNoteToDelete({ id: noteItem.id, title: noteItem.title })
              }
              formatDate={formatDate}
            />
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-black border-t border-cyan-500/30 flex items-center justify-between text-xs text-white flex-shrink-0 select-none">
            <span className="text-[11px] text-white">
              Perubahan otomatis tersimpan ke data mind map.
            </span>
            <button
              type="button"
              onClick={() => {
                soundFx.play("click");
                handleClose();
              }}
              id="btn-close-bottom-notes"
              className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wider bg-black text-neutral-300 border border-neutral-700/80 hover:bg-neutral-900 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-sm"
            >
              SELESAI
            </button>
          </div>
        </div>
      </div>

      {/* Popup Konfirmasi Hapus Catatan */}
      <ConfirmDeleteModal
        isOpen={Boolean(noteToDelete)}
        onClose={() => setNoteToDelete(null)}
        onConfirm={() => {
          if (noteToDelete) {
            handleDeleteNote(noteToDelete.id);
            setNoteToDelete(null);
          }
        }}
        title="Hapus Catatan"
        description="Apakah Anda yakin ingin menghapus catatan ini? Catatan yang dihapus tidak dapat dipulihkan."
        itemName={noteToDelete?.title.trim() || "Catatan"}
        confirmLabel="HAPUS CATATAN"
      />
    </>
  );
};
