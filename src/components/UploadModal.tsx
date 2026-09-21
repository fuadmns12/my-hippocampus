import React from "react";
import { MindMapData, DocumentFolder } from "../types";
import {
  useUploadParser,
  countNodes,
  countTotalMapNodes,
  UploadModalHeader,
  UploadModalTabs,
  UploadDropzone,
  UploadDirectPaste,
  UploadErrorAlert,
  UploadPreviewJson,
  UploadPreviewText,
  UploadConflictResolution,
  UploadModalFooter,
} from "./upload";

export interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedHistory?: MindMapData[];
  onImportMindMap: (
    data: MindMapData,
    options?: {
      mode?: "overwrite" | "copy";
      customTitle?: string;
      targetExistingId?: string;
    }
  ) => void;
  onImportMultipleMindMaps?: (
    maps: MindMapData[],
    options?: { mode?: "overwrite" | "copy" | "skip" }
  ) => void;
  onImportRawText: (
    title: string,
    subtitle: string,
    names: string[],
    folder: DocumentFolder,
    options?: { mode?: "overwrite" | "copy"; customTitle?: string }
  ) => void;
  currentFolder: DocumentFolder;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  savedHistory,
  onImportMindMap,
  onImportMultipleMindMaps,
  onImportRawText,
  currentFolder,
}) => {
  const {
    activeTab,
    setActiveTab,
    isDragging,
    selectedFile,
    pastedText,
    parsedData,
    parsedBackupMaps,
    parsedTextInfo,
    errorMsg,
    fileInputRef,
    hasConflict,
    conflictExistingMap,
    conflictingBackupMaps,
    conflictResolution,
    setConflictResolution,
    copyCustomTitle,
    setCopyCustomTitle,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    handlePastedTextChange,
    handleSelectMapFromBackup,
    handleApply,
    triggerFileInput,
  } = useUploadParser({
    isOpen,
    currentFolder,
    savedHistory,
    onImportMindMap,
    onImportMultipleMindMaps,
    onImportRawText,
    onClose,
  });

  if (!isOpen) return null;

  const canApply = Boolean(parsedData || parsedTextInfo);
  const backupCount = parsedBackupMaps ? parsedBackupMaps.length : 0;
  const previewFileName =
    selectedFile?.name ||
    (activeTab === "paste" ? "Tempelan Teks / JSON Gemini" : undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div id="upload-modal" className="w-full max-w-lg bg-black border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <UploadModalHeader onClose={onClose} />

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Tabs: Unggah Berkas vs Tempel Teks / JSON */}
          <UploadModalTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab 1: Drag & Drop File Upload */}
          {activeTab === "file" && (
            <UploadDropzone
              fileInputRef={fileInputRef}
              isDragging={isDragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onFileChange={handleFileChange}
              onTriggerClick={triggerFileInput}
            />
          )}

          {/* Tab 2: Direct Paste Text / JSON */}
          {activeTab === "paste" && (
            <UploadDirectPaste
              pastedText={pastedText}
              onPastedTextChange={handlePastedTextChange}
              isParsedSuccess={canApply}
              errorMsg={errorMsg}
            />
          )}

          {/* Error Message */}
          {errorMsg && <UploadErrorAlert errorMsg={errorMsg} />}

          {/* Conflict Resolution Section */}
          {hasConflict && (
            <UploadConflictResolution
              existingMap={conflictExistingMap}
              incomingMap={parsedData}
              conflictingBackupCount={conflictingBackupMaps?.length || 0}
              totalBackupCount={parsedBackupMaps?.length || 0}
              resolution={conflictResolution}
              onResolutionChange={setConflictResolution}
              copyCustomTitle={copyCustomTitle}
              onCopyCustomTitleChange={setCopyCustomTitle}
            />
          )}

          {/* Success File/Text Preview: JSON */}
          {parsedData && (
            <UploadPreviewJson
              fileName={previewFileName}
              data={parsedData}
              totalNodes={countTotalMapNodes(parsedData)}
              backupMaps={parsedBackupMaps}
              onSelectMapFromBackup={handleSelectMapFromBackup}
            />
          )}

          {/* Success File/Text Preview: TXT / MD */}
          {parsedTextInfo && (
            <UploadPreviewText
              fileName={previewFileName}
              info={parsedTextInfo}
            />
          )}
        </div>

        {/* Modal Footer */}
        <UploadModalFooter
          canApply={canApply}
          backupCount={backupCount}
          hasConflict={hasConflict}
          resolution={conflictResolution}
          onClose={onClose}
          onApply={handleApply}
        />
      </div>
    </div>
  );
};
