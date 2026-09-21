import React from "react";
import { CustomGroupingConfig, GroupingStrategy, DocumentFolder } from "../types";
import {
  useInputNames,
  InputPanelHeader,
  TopicFields,
  NamesInputSection,
  GroupingStrategyCards,
  GenerateActionFooter,
} from "./input";

export interface InputPanelProps {
  title: string;
  setTitle: (t: string) => void;
  subtitle: string;
  setSubtitle: (s: string) => void;
  folder?: DocumentFolder;
  setFolder?: (f: DocumentFolder) => void;
  namesText: string;
  setNamesText: (n: string) => void;
  groupingStrategy: GroupingStrategy;
  setGroupingStrategy: (s: GroupingStrategy) => void;
  customConfig: CustomGroupingConfig;
  onOpenSettings: (strategy: GroupingStrategy) => void;
  onGenerate: () => void;
  onAddToCanvas?: () => void;
  onResetNew?: () => void;
  isEditingMode?: boolean;
  isAiLoading: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
  onOpenNotesForName?: (name: string) => void;
  getNodeNotesCount?: (name: string) => number;
  isSettingsOpen?: boolean;
  settingsStrategy?: GroupingStrategy;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  title,
  setTitle,
  subtitle,
  setSubtitle,
  namesText,
  setNamesText,
  groupingStrategy,
  setGroupingStrategy,
  customConfig,
  onOpenSettings,
  onGenerate,
  onAddToCanvas,
  onResetNew,
  isEditingMode = false,
  isAiLoading,
  isCollapsed,
  setIsCollapsed,
  onOpenNotesForName,
  getNodeNotesCount,
  isSettingsOpen = false,
  settingsStrategy,
}) => {
  const {
    namesList,
    quickName,
    setQuickName,
    handleAddQuickName,
    handleRemoveName,
    handleClearAll,
  } = useInputNames(namesText, setNamesText);

  // Status buka/tutup form input (accordion)
  const [isBodyCollapsed, setIsBodyCollapsed] = React.useState(false);

  // Jika panel dibuka kembali atau mode berubah, pastikan formulir dalam kondisi terbuka
  React.useEffect(() => {
    if (!isCollapsed) {
      setIsBodyCollapsed(false);
    }
  }, [isCollapsed, title, isEditingMode]);

  // Jika tidak diaktifkan / tidak diklik dari navbar, jangan tampilkan panel sama sekali
  if (isCollapsed) {
    return null;
  }

  return (
    <div
      id="input-panel-section"
      className={`bg-black rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 scroll-mt-20 border ${
        isEditingMode
          ? "border-teal-500/50 shadow-teal-500/10 ring-1 ring-teal-500/30"
          : "border-cyan-500/40 shadow-cyan-500/10"
      }`}
    >
      {/* Header bar of Input Panel */}
      <InputPanelHeader
        isCollapsed={isBodyCollapsed}
        onToggleCollapse={() => setIsBodyCollapsed((prev) => !prev)}
        isEditingMode={isEditingMode}
        activeTitle={title}
        onResetNew={onResetNew}
      />

      {/* Expandable Body: 2 Kolom responsif (Buka - Tutup) */}
      {!isBodyCollapsed && (
        <div className="p-4 sm:p-5 bg-black border-t border-cyan-500/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-start">
            {/* Kolom 1: Topik Utama, Deskripsi & Daftar Nama */}
            <div className="space-y-4 sm:space-y-4.5">
              {/* Main Topic Title & Subtitle */}
              <TopicFields
                title={title}
                setTitle={setTitle}
                subtitle={subtitle}
                setSubtitle={setSubtitle}
                isEditingMode={isEditingMode}
                onOpenNotesForRoot={onOpenNotesForName ? () => onOpenNotesForName(title) : undefined}
                rootNotesCount={getNodeNotesCount ? getNodeNotesCount(title) : 0}
              />

              {/* Names Bulk Textarea & Quick Add Input */}
              <NamesInputSection
                namesText={namesText}
                setNamesText={setNamesText}
                namesList={namesList}
                quickName={quickName}
                setQuickName={setQuickName}
                onAddQuickName={handleAddQuickName}
                onRemoveName={handleRemoveName}
                onClearAll={handleClearAll}
                isEditingMode={isEditingMode}
                onOpenNotesForName={onOpenNotesForName}
                getNodeNotesCount={getNodeNotesCount}
              />
            </div>

            {/* Kolom 2: Strategi Pengelompokan & Tombol Buat / Perbarui Mind Map */}
            <div className="space-y-4 sm:space-y-5 flex flex-col justify-between h-full">
              <div className="space-y-4">
                {/* Grouping Strategy Picker */}
                <GroupingStrategyCards
                  groupingStrategy={groupingStrategy}
                  setGroupingStrategy={setGroupingStrategy}
                  customConfig={customConfig}
                  onOpenSettings={onOpenSettings}
                  isEditingMode={isEditingMode}
                  isSettingsOpen={isSettingsOpen}
                  settingsStrategy={settingsStrategy}
                />
              </div>

              {/* Action Generate / Update Button */}
              <GenerateActionFooter
                title={title}
                namesCount={namesList.length}
                isAiLoading={isAiLoading}
                onGenerate={onGenerate}
                onAddToCanvas={onAddToCanvas}
                isEditingMode={isEditingMode}
                onResetNew={onResetNew}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
