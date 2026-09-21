import React from "react";
import { Brain, Bookmark } from "lucide-react";
import { MechanicalButton } from "../common/MechanicalButton";

interface HistoryEmptyStateProps {
  searchQuery: string;
  hasCurrentMap?: boolean;
  onSaveCurrentMap?: () => void;
}

export const HistoryEmptyState: React.FC<HistoryEmptyStateProps> = ({
  searchQuery,
  hasCurrentMap,
  onSaveCurrentMap,
}) => {
  return (
    <div className="text-center py-14 px-4 space-y-3 text-white">
      <Brain className="w-12 h-12 mx-auto opacity-30 text-white" />
      <div className="space-y-1">
        <p className="text-xs font-semibold text-white">
          {searchQuery
            ? "Tidak ada mind map yang cocok dengan pencarian."
            : "Memory Card Masih Kosong"}
        </p>
        <p className="text-[11px] text-white max-w-xs mx-auto">
          {searchQuery
            ? `Tidak ditemukan hasil untuk "${searchQuery}". Coba kata kunci lain.`
            : "Simpan mind map yang sedang aktif melalui tombol 'Simpan' di bilah atas untuk menyimpannya di Memory Card."}
        </p>
      </div>

      {hasCurrentMap && onSaveCurrentMap && !searchQuery && (
        <div className="pt-2 select-none flex justify-center">
          <MechanicalButton
            id="btn-save-current-to-memory-card"
            size="sm"
            variant="cyan"
            onClick={onSaveCurrentMap}
            icon={<Bookmark className="w-3.5 h-3.5 text-white" />}
          >
            SIMPAN MIND MAP SAAT INI KE MEMORY CARD
          </MechanicalButton>
        </div>
      )}
    </div>
  );
};
