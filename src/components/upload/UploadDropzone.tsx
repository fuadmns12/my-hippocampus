import React from "react";
import { Upload } from "lucide-react";

interface UploadDropzoneProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTriggerClick: () => void;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  fileInputRef,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
  onTriggerClick,
}) => {
  return (
    <>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.txt,.md,.text"
        onChange={onFileChange}
        className="hidden"
      />

      {/* Drag and Drop Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={onTriggerClick}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
          isDragging
            ? "border-cyan-400 bg-black scale-[1.01]"
            : "border-cyan-500/30 hover:border-cyan-500/60 bg-black hover:bg-neutral-900/40"
        }`}
      >
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-black border border-cyan-500/30 flex items-center justify-center text-white">
          <Upload className="w-6 h-6" />
        </div>
        <p className="text-xs font-semibold text-white mb-1">
          Tarik & Letakkan Berkas di Sini, atau{" "}
          <span className="text-white underline">Pilih Berkas</span>
        </p>
        <p className="text-[11px] text-white">
          Mendukung berkas <strong className="text-white">.JSON</strong> (Mind
          Map), <strong className="text-white">.TXT</strong>, atau{" "}
          <strong className="text-white">.MD</strong> (Outline)
        </p>
      </div>
    </>
  );
};
