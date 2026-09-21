import React, { useState, useEffect, useRef, useCallback } from "react";
import { MindMapNode, NodeNote } from "../../types";
import {
  formatNoteDate,
  createEmptyNote,
  filterValidNotes,
  updateNoteInList,
} from "./noteHelpers";

interface UseNodeNotesManagerParams {
  node: MindMapNode | null;
  onClose: () => void;
  onSaveNotes: (nodeId: string, notes: NodeNote[]) => void;
}

export function useNodeNotesManager({
  node,
  onClose,
  onSaveNotes,
}: UseNodeNotesManagerParams) {
  const [notes, setNotes] = useState<NodeNote[]>(() => node?.notes || []);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState("");
  const [activeContent, setActiveContent] = useState("");
  const [justSaved, setJustSaved] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // References to keep latest note values for automatic saving on unmount/close
  const latestNotesRef = useRef<NodeNote[]>(notes);
  const latestActiveIdRef = useRef<string | null>(activeNoteId);
  const latestTitleRef = useRef<string>(activeTitle);
  const latestContentRef = useRef<string>(activeContent);
  const nodeIdRef = useRef<string | null>(node?.id || null);
  const prevNodeIdRef = useRef<string | null>(null);

  // Keep refs up to date
  useEffect(() => {
    latestNotesRef.current = notes;
  }, [notes]);

  useEffect(() => {
    latestActiveIdRef.current = activeNoteId;
  }, [activeNoteId]);

  useEffect(() => {
    latestTitleRef.current = activeTitle;
  }, [activeTitle]);

  useEffect(() => {
    latestContentRef.current = activeContent;
  }, [activeContent]);

  // Only re-initialize notes when opening a different node or first mounting
  useEffect(() => {
    if (!node) {
      prevNodeIdRef.current = null;
      return;
    }

    if (prevNodeIdRef.current !== node.id) {
      prevNodeIdRef.current = node.id;
      nodeIdRef.current = node.id;
      const currentNotes = node.notes || [];
      setNotes(currentNotes);
      latestNotesRef.current = currentNotes;

      // If there's at least one note, automatically open the first note
      if (currentNotes.length === 1) {
        const first = currentNotes[0];
        setActiveNoteId(first.id);
        setActiveTitle(first.title);
        setActiveContent(first.content);
        latestActiveIdRef.current = first.id;
        latestTitleRef.current = first.title;
        latestContentRef.current = first.content;
      } else {
        setActiveNoteId(null);
        setActiveTitle("");
        setActiveContent("");
        latestActiveIdRef.current = null;
        latestTitleRef.current = "";
        latestContentRef.current = "";
      }
    }
  }, [node?.id, node]);

  // Flush and save current state to parent
  const flushSave = useCallback(() => {
    const targetId = nodeIdRef.current;
    if (!targetId) return;

    let currentList = [...latestNotesRef.current];
    const currentId = latestActiveIdRef.current;

    if (currentId) {
      currentList = updateNoteInList(currentList, currentId, {
        title: latestTitleRef.current.trim(),
        content: latestContentRef.current,
        updatedAt: new Date().toISOString(),
      });
    }

    const cleanList = filterValidNotes(currentList);

    onSaveNotes(targetId, cleanList);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  }, [onSaveNotes]);

  // Save when closing
  const handleClose = useCallback(() => {
    flushSave();
    onClose();
  }, [flushSave, onClose]);

  // Add new note
  const handleAddNewNote = useCallback(() => {
    flushSave();
    const newNote = createEmptyNote();
    const updated = [newNote, ...latestNotesRef.current];

    setNotes(updated);
    latestNotesRef.current = updated;
    setActiveNoteId(newNote.id);
    setActiveTitle("");
    setActiveContent("");
    latestActiveIdRef.current = newNote.id;
    latestTitleRef.current = "";
    latestContentRef.current = "";

    if (nodeIdRef.current) {
      onSaveNotes(nodeIdRef.current, updated);
    }
  }, [flushSave, onSaveNotes]);

  // Select note from list
  const handleSelectNote = useCallback(
    (noteItem: NodeNote) => {
      flushSave();
      setActiveNoteId(noteItem.id);
      setActiveTitle(noteItem.title);
      setActiveContent(noteItem.content);
      latestActiveIdRef.current = noteItem.id;
      latestTitleRef.current = noteItem.title;
      latestContentRef.current = noteItem.content;
    },
    [flushSave]
  );

  // Back to note list
  const handleBackToList = useCallback(() => {
    flushSave();
    setActiveNoteId(null);
  }, [flushSave]);

  // Live change on Title
  const handleTitleChange = useCallback(
    (val: string) => {
      setActiveTitle(val);
      latestTitleRef.current = val;
      if (!activeNoteId) return;

      const next = updateNoteInList(notes, activeNoteId, {
        title: val,
        updatedAt: new Date().toISOString(),
      });
      setNotes(next);
      latestNotesRef.current = next;

      if (nodeIdRef.current) {
        onSaveNotes(nodeIdRef.current, next);
      }
    },
    [activeNoteId, notes, onSaveNotes]
  );

  // Live change on Content
  const handleContentChange = useCallback(
    (val: string) => {
      setActiveContent(val);
      latestContentRef.current = val;
      if (!activeNoteId) return;

      const next = updateNoteInList(notes, activeNoteId, {
        content: val,
        updatedAt: new Date().toISOString(),
      });
      setNotes(next);
      latestNotesRef.current = next;

      if (nodeIdRef.current) {
        onSaveNotes(nodeIdRef.current, next);
      }
    },
    [activeNoteId, notes, onSaveNotes]
  );

  // Delete note
  const handleDeleteNote = useCallback(
    (noteIdToDelete: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      const filtered = notes.filter((n) => n.id !== noteIdToDelete);
      setNotes(filtered);
      latestNotesRef.current = filtered;

      if (activeNoteId === noteIdToDelete) {
        setActiveNoteId(null);
        setActiveTitle("");
        setActiveContent("");
        latestActiveIdRef.current = null;
        latestTitleRef.current = "";
        latestContentRef.current = "";
      }

      setDeleteConfirmId(null);
      if (nodeIdRef.current) {
        onSaveNotes(nodeIdRef.current, filtered);
      }
    },
    [activeNoteId, notes, onSaveNotes]
  );

  return {
    notes,
    activeNoteId,
    activeTitle,
    activeContent,
    justSaved,
    deleteConfirmId,
    setDeleteConfirmId,
    handleClose,
    handleAddNewNote,
    handleSelectNote,
    handleBackToList,
    handleTitleChange,
    handleContentChange,
    handleDeleteNote,
    formatDate: formatNoteDate,
  };
}
