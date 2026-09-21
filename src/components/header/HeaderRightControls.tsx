import React, { useState } from "react";
import { HardDrive, Upload, HelpCircle, Settings, Maximize2, Minimize2 } from "lucide-react";
import { PresetTemplate, MindMapData } from "../../types";
import { PresetSelectorDropdown } from "./PresetSelectorDropdown";
import { HeaderSaveButton } from "./HeaderSaveButton";
import { HeaderExportDropdown } from "./HeaderExportDropdown";
import { MechanicalButton } from "../common/MechanicalButton";
import { IconActionButton } from "../common/IconActionButton";
import { soundFx } from "../../utils/soundEffects";

export interface HeaderRightControlsProps {
  mindMapData: MindMapData | null;
  isSaved: boolean;
  onSaveMap: () => void;
  savedCount?: number;
  onOpenHistory: () => void;
  onOpenUpload: () => void;
  onSelectPreset: (preset: PresetTemplate) => void;
  onExportPdf: () => void;
  onExportPng: () => void;
  onExportSvg: () => void;
  onExportJson: () => void;
  onExportMarkdown: () => void;
  onOpenGuide: () => void;
  onOpenSettings: () => void;
  /** Toggle fullscreen SELURUH HALAMAN (tombol `#btn-fullscreen-page`). */
  onToggleFullscreenPage?: () => void;
  /** Status fullscreen SELURUH HALAMAN aktif (untuk ikon & label tombol). */
  isPageFullscreen?: boolean;
  isHistoryOpen?: boolean;
  isUploadOpen?: boolean;
  isGuideOpen?: boolean;
  isSettingsOpen?: boolean;
}

export const HeaderRightControls: React.FC<HeaderRightControlsProps> = ({
  mindMapData,
  isSaved,
  onSaveMap,
  savedCount = 0,
  onOpenHistory,
  onOpenUpload,
  onSelectPreset,
  onExportPdf,
  onExportPng,
  onExportSvg,
  onExportJson,
  onExportMarkdown,
  onOpenGuide,
  onOpenSettings,
  onToggleFullscreenPage,
  isPageFullscreen = false,
  isHistoryOpen = false,
  isUploadOpen = false,
  isGuideOpen = false,
  isSettingsOpen = false,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);

  return (
    <div className="ml-auto flex items-center gap-1.5 sm:gap-2 lg:gap-3 shrink-0">
      {/* Preset Templates Selector Dropdown */}
      <PresetSelectorDropdown
        isOpen={showPresetMenu}
        onToggle={() => {
          setShowPresetMenu((prev) => !prev);
          setShowExportMenu(false);
        }}
        onClose={() => setShowPresetMenu(false)}
        onSelectPreset={onSelectPreset}
      />

      {/* Save Mind Map Button */}
      {mindMapData && (
        <HeaderSaveButton isSaved={isSaved} onSaveMap={onSaveMap} />
      )}

      {/* Memory Card (Data Tersimpan) Button */}
      <MechanicalButton
        id="btn-memory-card"
        type="button"
        size="xs"
        variant="cyan"
        active={isHistoryOpen}
        onClick={() => {
          setShowPresetMenu(false);
          setShowExportMenu(false);
          onOpenHistory();
        }}
        title="Memory Card - Lihat & Kelola Data Tersimpan"
        icon={
          <HardDrive
            className={`w-3.5 h-3.5 ${
              isHistoryOpen ? "text-cyan-400" : "text-white"
            }`}
          />
        }
      >
        {savedCount > 0 ? `MEMORY (${savedCount})` : "MEMORY CARD"}
      </MechanicalButton>

      {/* Upload Button */}
      <MechanicalButton
        id="btn-upload-mindmap"
        type="button"
        size="xs"
        variant="cyan"
        active={isUploadOpen}
        onClick={() => {
          setShowPresetMenu(false);
          setShowExportMenu(false);
          onOpenUpload();
        }}
        title="Unggah / Impor File Mind Map (JSON / Teks / MD)"
        icon={
          <Upload
            className={`w-3.5 h-3.5 ${
              isUploadOpen ? "text-cyan-400" : "text-white"
            }`}
          />
        }
      >
        UPLOAD
      </MechanicalButton>

      {/* Unduh (Download) Dropdown */}
      {mindMapData && (
        <HeaderExportDropdown
          isOpen={showExportMenu}
          onToggle={() => {
            setShowExportMenu((prev) => !prev);
            setShowPresetMenu(false);
          }}
          onClose={() => setShowExportMenu(false)}
          onExportPdf={onExportPdf}
          onExportPng={onExportPng}
          onExportSvg={onExportSvg}
          onExportMarkdown={onExportMarkdown}
          onExportJson={onExportJson}
        />
      )}

      {/* Tombol Pengaturan (Settings, Sound, Haptic, PWA Offline) */}
      <MechanicalButton
        id="btn-open-settings"
        type="button"
        size="xs"
        variant="cyan"
        active={isSettingsOpen}
        onClick={() => {
          setShowPresetMenu(false);
          setShowExportMenu(false);
          onOpenSettings();
        }}
        title="Pengaturan - Audio, Haptik, dan PWA Offline"
        icon={
          <Settings
            className={`w-3.5 h-3.5 ${
              isSettingsOpen ? "text-cyan-400" : "text-white"
            }`}
          />
        }
      >
        SETTINGS
      </MechanicalButton>

      {/* Tombol Panduan Penggunaan Website (ikon-only dengan gaya kontrol kanvas) */}
      <IconActionButton
        id="btn-open-user-guide"
        isActive={isGuideOpen}
        icon={HelpCircle}
        title="Panduan & Cara Menggunakan Website Ini"
        className="shrink-0"
        onClick={() => {
          setShowPresetMenu(false);
          setShowExportMenu(false);
          soundFx.play("click");
          onOpenGuide();
        }}
      />

      {/* Tombol Fullscreen SELURUH HALAMAN (ikon-only dengan gaya kontrol kanvas) */}
      {onToggleFullscreenPage && (
        <IconActionButton
          id="btn-fullscreen-page"
          isActive={isPageFullscreen}
          icon={isPageFullscreen ? Minimize2 : Maximize2}
          title={
            isPageFullscreen
              ? "Keluar dari Layar Penuh Seluruh Halaman (ESC)"
              : "Layar Penuh Seluruh Halaman (semua panel tetap tampil)"
          }
          ariaLabel={
            isPageFullscreen
              ? "Keluar dari Layar Penuh Seluruh Halaman (ESC)"
              : "Layar Penuh Seluruh Halaman"
          }
          className="shrink-0"
          onClick={() => {
            setShowPresetMenu(false);
            setShowExportMenu(false);
            soundFx.play("click");
            onToggleFullscreenPage();
          }}
        />
      )}
    </div>
  );
};
