import React, { useState, useRef, useEffect, useMemo } from "react";
import { MindMapData, DocumentFolder, ImportConflictResolution } from "../../types";
import {
  ParsedTextInfo,
  UseUploadParserProps,
  countNodes,
  countTotalMapNodes,
  normalizeMindMap,
  extractMapsFromJson,
  parseRawTextFile,
  findConflictingMap,
  findConflictingBackupMaps,
  parseUploadedOrPastedContent,
} from "./parser";

// Re-export helpers and types for seamless backward compatibility
export {
  countNodes,
  countTotalMapNodes,
  normalizeMindMap,
  extractMapsFromJson,
};
export type { ParsedTextInfo, UseUploadParserProps };

export function useUploadParser({
  isOpen,
  currentFolder,
  savedHistory = [],
  onImportMindMap,
  onImportMultipleMindMaps,
  onImportRawText,
  onClose,
}: UseUploadParserProps) {
  const [activeTab, setActiveTab] = useState<"file" | "paste">("file");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [pastedText, setPastedText] = useState<string>("");
  const [parsedData, setParsedData] = useState<MindMapData | null>(null);
  const [parsedBackupMaps, setParsedBackupMaps] = useState<MindMapData[] | null>(null);
  const [parsedTextInfo, setParsedTextInfo] = useState<ParsedTextInfo | null>(null);
  const [targetFolder, setTargetFolder] = useState<DocumentFolder>(currentFolder);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Conflict Resolution State
  const [conflictResolution, setConflictResolution] = useState<ImportConflictResolution>("overwrite");
  const [copyCustomTitle, setCopyCustomTitle] = useState<string>("");

  // Conflict Detection for single map or text
  const conflictExistingMap = useMemo(() => {
    return findConflictingMap(savedHistory, parsedData, parsedTextInfo);
  }, [savedHistory, parsedData, parsedTextInfo]);

  // Conflict Detection for backup maps
  const conflictingBackupMaps = useMemo(() => {
    return findConflictingBackupMaps(savedHistory, parsedBackupMaps);
  }, [savedHistory, parsedBackupMaps]);

  const hasConflict = Boolean(
    conflictExistingMap || (conflictingBackupMaps && conflictingBackupMaps.length > 0)
  );

  // Initialize/Update default copy title whenever a map is loaded
  useEffect(() => {
    if (parsedData) {
      setCopyCustomTitle(`${parsedData.title} (Salinan Baru)`);
      setConflictResolution("overwrite");
    } else if (parsedTextInfo) {
      setCopyCustomTitle(`${parsedTextInfo.title} (Salinan Baru)`);
      setConflictResolution("overwrite");
    }
  }, [parsedData, parsedTextInfo]);

  // Sync targetFolder with currentFolder when modal opens & reset errors
  useEffect(() => {
    if (isOpen) {
      setTargetFolder(currentFolder);
      setConflictResolution("overwrite");
    } else {
      setErrorMsg(null);
    }
  }, [isOpen, currentFolder]);

  // Parse raw text or JSON content directly
  const processDirectText = (text: string, sourceName = "Tempelan Gemini") => {
    setPastedText(text);
    setFileContent(text);

    if (!text.trim()) {
      setErrorMsg(null);
      setParsedData(null);
      setParsedBackupMaps(null);
      setParsedTextInfo(null);
      return;
    }

    const result = parseUploadedOrPastedContent(text, sourceName);
    setErrorMsg(result.errorMsg);
    setParsedData(result.parsedData);
    setParsedBackupMaps(result.parsedBackupMaps);
    setParsedTextInfo(result.parsedTextInfo);
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = (e.target?.result as string) || "";
      const sourceName = file.name.replace(/\.[^/.]+$/, "");
      processDirectText(content, sourceName);
    };

    reader.onerror = () => {
      setErrorMsg("Gagal membaca berkas dari sistem.");
    };

    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleSelectMapFromBackup = (map: MindMapData) => {
    setParsedData(map);
  };

  const handleApply = () => {
    if (parsedBackupMaps && parsedBackupMaps.length > 1) {
      if (onImportMultipleMindMaps) {
        const selected = parsedData || parsedBackupMaps[0];
        const reordered = [
          selected,
          ...parsedBackupMaps.filter((m) => m.id !== selected.id),
        ];
        onImportMultipleMindMaps(reordered, { mode: conflictResolution });
      } else if (parsedData) {
        onImportMindMap(parsedData, {
          mode: conflictResolution === "copy" ? "copy" : "overwrite",
          customTitle: copyCustomTitle,
          targetExistingId: conflictExistingMap?.id,
        });
      }
      onClose();
    } else if (parsedData) {
      onImportMindMap(parsedData, {
        mode: conflictResolution === "copy" ? "copy" : "overwrite",
        customTitle: copyCustomTitle,
        targetExistingId: conflictExistingMap?.id,
      });
      onClose();
    } else if (parsedTextInfo) {
      onImportRawText(
        parsedTextInfo.title,
        parsedTextInfo.subtitle,
        parsedTextInfo.names,
        targetFolder,
        {
          mode: conflictResolution === "copy" ? "copy" : "overwrite",
          customTitle: copyCustomTitle,
        }
      );
      onClose();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return {
    activeTab,
    setActiveTab,
    isDragging,
    selectedFile,
    fileContent,
    pastedText,
    parsedData,
    parsedBackupMaps,
    parsedTextInfo,
    targetFolder,
    setTargetFolder,
    errorMsg,
    fileInputRef,
    // Conflict resolution
    hasConflict,
    conflictExistingMap,
    conflictingBackupMaps,
    conflictResolution,
    setConflictResolution,
    copyCustomTitle,
    setCopyCustomTitle,
    // Handlers
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    handlePastedTextChange: processDirectText,
    handleSelectMapFromBackup,
    handleApply,
    triggerFileInput,
  };
}
