import React, { useState, useEffect } from "react";
import { PresetTemplate, MindMapData, DocumentFolder } from "../types";
import {
  HeaderCollapseTabs,
  HeaderRootControls,
  HeaderRightControls,
} from "./header/index";
import { UserGuideModal } from "./modals/UserGuideModal";
import { SettingsModal } from "./modals/SettingsModal";

export interface HeaderProps {
  onSelectPreset: (preset: PresetTemplate) => void;
  onOpenHistory: () => void;
  hasSavedHistory?: boolean;
  savedCount?: number;
  currentFolder?: DocumentFolder;
  onSaveMap: () => void;
  isSaved: boolean;
  onExportPdf: () => void;
  onExportPng: () => void;
  onExportSvg: () => void;
  onExportJson: () => void;
  onExportMarkdown: () => void;
  onOpenUpload: () => void;
  isHistoryOpen?: boolean;
  isUploadOpen?: boolean;
  onReset?: () => void;
  /** Toggle fullscreen SELURUH HALAMAN (tombol `#btn-fullscreen-page`), bukan fullscreen kanvas. */
  onToggleFullscreen?: () => void;
  /**
   * Mode KANVAS FOKUS aktif (tombol `#btn-canvas-fullscreen-toggle`) → header disembunyikan
   * supaya kanvas mengisi seluruh layar. Berbeda dengan `isPageFullscreen`.
   */
  isFullscreen: boolean;
  /**
   * Fullscreen SELURUH HALAMAN aktif → header tetap tampil (hanya status tombolnya berubah),
   * karena seluruh halaman termasuk header memang ikut layar penuh.
   */
  isPageFullscreen?: boolean;
  mindMapData: MindMapData | null;
  activeTab?: "canvas" | "outline";
  setActiveTab?: (tab: "canvas" | "outline") => void;
  isInputCollapsed?: boolean;
  onToggleInputCollapse?: () => void;
  isLayoutThemeOpen?: boolean;
  onToggleLayoutTheme?: () => void;
  onToggleCombinedPanels?: () => void;
  onOpenNewMindMap?: () => void;
  onOpenEditMindMap?: () => void;
  onSelectRoot?: (rootId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPreset,
  onOpenHistory,
  savedCount = 0,
  onSaveMap,
  isSaved,
  onExportPdf,
  onExportPng,
  onExportSvg,
  onExportJson,
  onExportMarkdown,
  onOpenUpload,
  isHistoryOpen = false,
  isUploadOpen = false,
  onToggleFullscreen,
  isFullscreen,
  isPageFullscreen = false,
  mindMapData,
  isInputCollapsed = false,
  onToggleInputCollapse,
  isLayoutThemeOpen = false,
  onToggleLayoutTheme,
  onToggleCombinedPanels,
  onOpenNewMindMap,
  onOpenEditMindMap,
  onSelectRoot,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    const handleOpenSettings = () => setShowSettingsModal(true);
    window.addEventListener("open-settings-modal", handleOpenSettings);
    return () => window.removeEventListener("open-settings-modal", handleOpenSettings);
  }, []);

  const isPanelOpen = !isInputCollapsed || isLayoutThemeOpen;

  // Mode KANVAS FOKUS: kanvas mengisi seluruh layar (overlay 100vw x 100vh),
  // sehingga header disembunyikan. Mode FULLSCREEN SELURUH HALAMAN tidak menyembunyikan header.
  if (isFullscreen) return null;

  return (
    <>
      {/* Floating Restore Button when Header is Collapsed */}
      {isCollapsed && (
        <HeaderCollapseTabs
          isCollapsed={true}
          onExpand={() => setIsCollapsed(false)}
          onCollapse={() => setIsCollapsed(true)}
        />
      )}

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-30 relative w-full inset-x-0 bg-black border-b border-cyan-500/40 text-white shadow-md transition-all duration-300 ${
          isCollapsed ? "hidden" : "block"
        }`}
      >
        <div className="header-inner-bar relative w-full px-2 sm:px-3 md:px-4 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto scrollbar-none">
          {/* Cyber Arrow Indicator for Mobile Landscape */}
          <span className="bg-cyber-arrow bg-cyber-left-arrow" aria-hidden="true"></span>

          {/* Left Controls: Input Mind Map Baru, Tempat Edit & Tata Letak, Switcher Topik */}
          <HeaderRootControls
            mindMapData={mindMapData}
            isPanelOpen={isPanelOpen}
            isInputCollapsed={isInputCollapsed}
            isLayoutThemeOpen={isLayoutThemeOpen}
            onToggleCombinedPanels={onToggleCombinedPanels}
            onToggleInputCollapse={onToggleInputCollapse}
            onToggleLayoutTheme={onToggleLayoutTheme}
            onOpenNewMindMap={onOpenNewMindMap}
            onOpenEditMindMap={onOpenEditMindMap}
            onSelectRoot={onSelectRoot}
          />

          {/* Right Action Controls: Preset, Simpan, Memory Card, Upload, Unduh, Settings, Panduan, Fullscreen */}
          <HeaderRightControls
            mindMapData={mindMapData}
            isSaved={isSaved}
            onSaveMap={onSaveMap}
            savedCount={savedCount}
            onOpenHistory={onOpenHistory}
            onOpenUpload={onOpenUpload}
            onSelectPreset={onSelectPreset}
            onExportPdf={onExportPdf}
            onExportPng={onExportPng}
            onExportSvg={onExportSvg}
            onExportJson={onExportJson}
            onExportMarkdown={onExportMarkdown}
            onOpenGuide={() => setShowGuideModal(true)}
            onOpenSettings={() => setShowSettingsModal(true)}
            onToggleFullscreenPage={onToggleFullscreen}
            isPageFullscreen={isPageFullscreen}
            isHistoryOpen={isHistoryOpen}
            isUploadOpen={isUploadOpen}
            isGuideOpen={showGuideModal}
            isSettingsOpen={showSettingsModal}
          />
        </div>

        {/* Hanging Arrow Tab on Header Bottom Border */}
        <HeaderCollapseTabs
          isCollapsed={false}
          onExpand={() => setIsCollapsed(false)}
          onCollapse={() => setIsCollapsed(true)}
        />
      </header>

      {/* Modal Panduan Penggunaan Website */}
      <UserGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />

      {/* Modal Pengaturan (Sound, Haptic, PWA Offline) */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </>
  );
};
