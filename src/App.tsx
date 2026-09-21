import React from "react";
import { Header } from "./components/Header";
import { AppModals } from "./components/app/AppModals";
import { AppToast } from "./components/app/AppToast";
import { AppMainContent } from "./components/app/AppMainContent";
import { WelcomeGateScreen } from "./components/WelcomeGateScreen";
import { OfflineIndicator } from "./components/common/OfflineIndicator";
import { PWAUpdateBanner } from "./components/common/PWAUpdateBanner";
import { PWAOfflineProvider } from "./context/PWAOfflineContext";
import { ThemeModeProvider } from "./context/ThemeModeContext";
import { YouTubeMusicProvider } from "./context/YouTubeMusicContext";
import { YouTubeAudioEngine } from "./components/common/YouTubeAudioEngine";
import { FloatingMusicPlayer } from "./components/common/FloatingMusicPlayer";
import { AIAssistantProvider } from "./context/AIAssistantContext";
import { AIAssistantFAB } from "./components/common/AIAssistantFAB";
import { AIAssistantChatWindow } from "./components/common/AIAssistantChatWindow";
import { useMobileOrientation } from "./components/mobile/useMobileOrientation";
import { MobileLandscapeNotice } from "./components/mobile/MobileLandscapeNotice";
import { MobileLandscapeScaler } from "./components/mobile/MobileLandscapeScaler";
import { NotFoundScreen } from "./components/common/NotFoundScreen";
import { useAppOrchestrator } from "./hooks/useAppOrchestrator";
import { useGuideActionListener } from "./hooks/useGuideActionListener";
import { useRoute404Check } from "./hooks/useRoute404Check";
import { usePageFullscreen } from "./hooks/usePageFullscreen";
import { MindMapNode } from "./types";

export default function App() {
  const { is404, currentPath, returnToHome } = useRoute404Check();

  // Hook untuk fullscreen HALAMAN (tombol FULLSCREEN di header, bukan mode kanvas fokus)
  const { isPageFullscreen, togglePageFullscreen } = usePageFullscreen();

  const {
    svgRef,
    hasEntered,
    setHasEntered,
    showClearConfirmModal,
    setShowClearConfirmModal,
    pendingPreset,
    toastMessage,
    inputs,
    isFullscreen,
    handleToggleFullscreen,
    tree,
    persistence,
    exporters,
    actions,
    handleConfirmClearCanvas,
    handleRequestPreset,
    handleConfirmLoadPreset,
    handleCloseLoadPresetModal,
    activeRootNode,
    handleToggleCombinedPanels,
    handleOpenNotesForName,
    getNodeNotesCount,
  } = useAppOrchestrator();

  // Deteksi dan rotasi otomatis ke mode landscape untuk perangkat ponsel
  const mobileOrientation = useMobileOrientation();

  // Listener untuk perintah aksi interaktif dari Bot Panduan (scroll view & popup modal)
  useGuideActionListener({
    inputs,
    exporters,
    persistence,
    actions,
    handleToggleFullscreen,
  });

  if (is404) {
    return (
      <NotFoundScreen
        currentPath={currentPath}
        onReturnToHome={returnToHome}
      />
    );
  }

  return (
    <ThemeModeProvider>
      <PWAOfflineProvider>
        <YouTubeMusicProvider>
          <AIAssistantProvider>
            <MobileLandscapeScaler orientation={mobileOrientation}>
              <div id="app-root" className="app-root min-h-screen bg-black text-white font-sans flex flex-col antialiased transition-colors duration-300">
                <Header
              onSelectPreset={handleRequestPreset}
            onOpenHistory={() => inputs.setShowHistory(true)}
            isHistoryOpen={inputs.showHistory}
            hasSavedHistory={persistence.savedHistory.length > 0}
            savedCount={persistence.savedHistory.length}
            currentFolder={inputs.currentFolder}
            onSaveMap={persistence.handleSaveCurrentMap}
            isSaved={persistence.isSavedRecently}
            onExportPdf={exporters.handleExportPdf}
            onExportPng={exporters.handleExportPng}
            onExportSvg={exporters.handleExportSvg}
            onExportJson={exporters.handleExportJson}
            onExportMarkdown={exporters.handleExportMarkdown}
            onOpenUpload={() => inputs.setShowUploadModal(true)}
            isUploadOpen={inputs.showUploadModal}
            onReset={actions.handleReset}
            onToggleFullscreen={togglePageFullscreen}
            isFullscreen={isFullscreen}
            isPageFullscreen={isPageFullscreen}
            mindMapData={tree.mindMapData}
            activeTab={inputs.activeTab}
            setActiveTab={inputs.setActiveTab}
            isInputCollapsed={inputs.isInputCollapsed}
            onToggleInputCollapse={() =>
              inputs.setIsInputCollapsed(!inputs.isInputCollapsed)
            }
            isLayoutThemeOpen={inputs.isLayoutThemeOpen}
            onToggleLayoutTheme={() =>
              inputs.setIsLayoutThemeOpen(!inputs.isLayoutThemeOpen)
            }
            onToggleCombinedPanels={handleToggleCombinedPanels}
            onOpenNewMindMap={actions.handleOpenNewMindMap}
            onOpenEditMindMap={actions.handleOpenEditMindMap}
            onSelectRoot={actions.handleSelectRoot}
          />

          <AppMainContent
            inputs={inputs}
            tree={tree}
            actions={actions}
            isFullscreen={isFullscreen}
            handleToggleFullscreen={handleToggleFullscreen}
            svgRef={svgRef}
            onOpenNotesForName={handleOpenNotesForName}
            getNodeNotesCount={getNodeNotesCount}
            onClearCanvas={() => setShowClearConfirmModal(true)}
            isClearConfirmOpen={showClearConfirmModal}
            onRequestPreset={handleRequestPreset}
          />

          <AppModals
            selectedNode={tree.selectedNode}
            rootNode={activeRootNode}
            onCloseNodeEditor={() => tree.setSelectedNode(null)}
            onSaveNode={tree.handleSaveNode}
            onAddChildNode={tree.handleAddChildNode}
            onAddMultipleChildren={tree.handleAddMultipleChildren}
            onDeleteNode={tree.handleDeleteNode}
            onReparentNode={tree.handleReparentNode}
            onOpenNotesFromEditor={(n: MindMapNode) =>
              tree.setSelectedNodeForNotes(n)
            }
            selectedNodeForNotes={tree.selectedNodeForNotes}
            onCloseNotes={() => tree.setSelectedNodeForNotes(null)}
            onSaveNotes={tree.handleSaveNotes}
            showHistory={inputs.showHistory}
            onCloseHistory={() => inputs.setShowHistory(false)}
            savedHistory={persistence.savedHistory}
            hasCurrentMap={Boolean(tree.mindMapData)}
            onSaveCurrentMap={persistence.handleSaveCurrentMap}
            onLoadMap={actions.handleLoadMapFromHistory}
            onDeleteMap={persistence.handleDeleteHistoryMap}
            onClearAllHistory={persistence.handleClearAllHistory}
            showUploadModal={inputs.showUploadModal}
            onOpenUploadModal={() => inputs.setShowUploadModal(true)}
            onCloseUploadModal={() => inputs.setShowUploadModal(false)}
            onImportMindMap={actions.handleImportMindMap}
            onImportMultipleMindMaps={actions.handleImportMultipleMindMaps}
            onImportRawText={actions.handleImportRawText}
            currentFolder={inputs.currentFolder}
            showSettingsModal={inputs.showSettingsModal}
            onCloseSettingsModal={() => inputs.setShowSettingsModal(false)}
            settingsStrategy={inputs.settingsStrategy}
            setSettingsStrategy={inputs.setSettingsStrategy}
            customConfig={inputs.customConfig}
            setCustomConfig={inputs.setCustomConfig}
            onApplySettings={actions.handleApplySettings}
            showClearConfirmModal={showClearConfirmModal}
            onCloseClearConfirmModal={() => setShowClearConfirmModal(false)}
            onConfirmClearCanvas={handleConfirmClearCanvas}
            mapTitle={tree.mindMapData?.title}
            totalMapsCount={tree.getAllRoots().length}
            pendingPreset={pendingPreset}
            onCloseLoadPresetModal={handleCloseLoadPresetModal}
            onConfirmLoadPreset={handleConfirmLoadPreset}
            hasExistingCanvasData={Boolean(
              tree.mindMapData ||
                inputs.namesText.trim() ||
                inputs.title.trim()
            )}
          />

          <AppToast message={toastMessage} />
          <OfflineIndicator />
          <PWAUpdateBanner />

          {!hasEntered && (
            <WelcomeGateScreen onEnter={() => setHasEntered(true)} />
          )}

          {/* Persistent YouTube background audio engine */}
          <YouTubeAudioEngine />

          {/* Floating music widget on canvas */}
          <FloatingMusicPlayer />

          {/* Floating Website Guide Action Button (FAB) at bottom-right */}
          <AIAssistantFAB />

          {/* Floating Website Guide Chat Window */}
          <AIAssistantChatWindow />

          {/* Notifikasi & Tombol Pindah ke Mode Landscape untuk HP */}
          <MobileLandscapeNotice orientation={mobileOrientation} />
        </div>
      </MobileLandscapeScaler>
    </AIAssistantProvider>
  </YouTubeMusicProvider>
</PWAOfflineProvider>
</ThemeModeProvider>
  );
}
