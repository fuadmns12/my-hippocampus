import { useState, useRef, useCallback, useEffect, SetStateAction } from "react";
import { MindMapData } from "../../types";

const MAX_HISTORY_STEPS = 15;

export function useTreeHistory(showToast?: (msg: string) => void) {
  const [mindMapData, setMindMapDataRaw] = useState<MindMapData | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const pastRef = useRef<MindMapData[]>([]);
  const futureRef = useRef<MindMapData[]>([]);
  const isUndoRedoRef = useRef(false);
  const lastStateRef = useRef<MindMapData | null>(null);
  const lastTimeRef = useRef<number>(0);

  const updateFlags = useCallback(() => {
    setCanUndo(pastRef.current.length > 0);
    setCanRedo(futureRef.current.length > 0);
  }, []);

  const setMindMapData = useCallback(
    (action: SetStateAction<MindMapData | null>) => {
      setMindMapDataRaw((prev) => {
        const next =
          typeof action === "function"
            ? (action as (p: MindMapData | null) => MindMapData | null)(prev)
            : action;

        if (isUndoRedoRef.current) {
          isUndoRedoRef.current = false;
          lastStateRef.current = next;
          return next;
        }

        // If data actually changed from previous
        if (prev && next && prev !== next) {
          const now = Date.now();
          // Debounce continuous drag/offset micro-events within 300ms
          if (now - lastTimeRef.current > 300) {
            try {
              pastRef.current.push(JSON.parse(JSON.stringify(prev)));
              if (pastRef.current.length > MAX_HISTORY_STEPS) {
                pastRef.current.shift();
              }
              futureRef.current = [];
              updateFlags();
            } catch {
              // Ignore cloning error if any
            }
          }
          lastTimeRef.current = now;
        } else if (!prev && next) {
          // Initializing or resetting map
          futureRef.current = [];
          updateFlags();
        }

        lastStateRef.current = next;
        return next;
      });
    },
    [updateFlags]
  );

  const handleUndo = useCallback(() => {
    if (pastRef.current.length === 0 || !lastStateRef.current) return;
    const previous = pastRef.current.pop()!;
    try {
      futureRef.current.unshift(JSON.parse(JSON.stringify(lastStateRef.current)));
    } catch {
      futureRef.current.unshift(lastStateRef.current);
    }
    if (futureRef.current.length > MAX_HISTORY_STEPS) {
      futureRef.current.pop();
    }
    isUndoRedoRef.current = true;
    setMindMapDataRaw(previous);
    lastStateRef.current = previous;
    updateFlags();
    showToast?.("Perubahan kanvas diurungkan (Undo)");
  }, [showToast, updateFlags]);

  const handleRedo = useCallback(() => {
    if (futureRef.current.length === 0 || !lastStateRef.current) return;
    const next = futureRef.current.shift()!;
    try {
      pastRef.current.push(JSON.parse(JSON.stringify(lastStateRef.current)));
    } catch {
      pastRef.current.push(lastStateRef.current);
    }
    if (pastRef.current.length > MAX_HISTORY_STEPS) {
      pastRef.current.shift();
    }
    isUndoRedoRef.current = true;
    setMindMapDataRaw(next);
    lastStateRef.current = next;
    updateFlags();
    showToast?.("Perubahan kanvas dipulihkan (Redo)");
  }, [showToast, updateFlags]);

  // Global keyboard shortcuts for canvas undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || target?.isContentEditable) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          // Ctrl+Shift+Z -> Redo
          e.preventDefault();
          handleRedo();
        } else {
          // Ctrl+Z -> Undo
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        // Ctrl+Y -> Redo
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  return {
    mindMapData,
    setMindMapData,
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
  };
}
