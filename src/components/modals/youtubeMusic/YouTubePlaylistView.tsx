import React, { useState } from "react";
import { ListMusic, RotateCcw } from "lucide-react";
import { PlaylistItem } from "../../../utils/youtubeHelper";
import { soundFx } from "../../../utils/soundEffects";
import { YouTubePlaylistItemRow } from "./YouTubePlaylistItemRow";
import { ConfirmDeleteModal } from "../ConfirmDeleteModal";

interface YouTubePlaylistViewProps {
  playlist: PlaylistItem[];
  activeTrackId: string | null;
  videoId: string | null;
  isPlaying: boolean;
  autoAdvance: boolean;
  setAutoAdvance: (val: boolean) => void;
  resetDefaultPlaylist: () => void;
  updatePlaylistItemTitle: (id: string, newTitle: string) => void;
  removeFromPlaylist: (id: string) => void;
  playTrack: (item: PlaylistItem) => void;
  pause: () => void;
}

export const YouTubePlaylistView: React.FC<YouTubePlaylistViewProps> = ({
  playlist,
  activeTrackId,
  videoId,
  isPlaying,
  autoAdvance,
  setAutoAdvance,
  resetDefaultPlaylist,
  updatePlaylistItemTitle,
  removeFromPlaylist,
  playTrack,
  pause,
}) => {
  const [trackToDelete, setTrackToDelete] = useState<PlaylistItem | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <>
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListMusic className="w-4 h-4 text-white" />
            <h4 className="text-xs font-bold text-white tracking-wider">
              PLAYLIST TERSIMPAN ({playlist.length})
            </h4>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto Advance Toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-white">
              <input
                type="checkbox"
                checked={autoAdvance}
                onChange={(e) => {
                  soundFx.play("click");
                  setAutoAdvance(e.target.checked);
                }}
                className="w-3.5 h-3.5 rounded bg-black border-cyan-500/40 text-cyan-400 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span>Putar Otomatis</span>
            </label>

            {/* Reset to default */}
            <button
              type="button"
              onClick={() => {
                soundFx.play("click");
                setShowResetConfirm(true);
              }}
              title="Muat kembali rekomendasi playlist bawaan"
              className="text-[10px] font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3 text-white" />
              <span className="hidden sm:inline">Default</span>
            </button>
          </div>
        </div>

        {/* Playlist Container */}
        {playlist.length === 0 ? (
          <div className="p-4 rounded-xl bg-black border border-neutral-800 text-center space-y-2">
            <p className="text-xs text-neutral-400">
              Belum ada link yang tersimpan di playlist Anda.
            </p>
            <p className="text-[11px] text-neutral-500">
              Masukkan link YouTube di atas lalu klik{" "}
              <strong>SIMPAN KE PLAYLIST</strong>, atau muat pilihan musik
              rekomendasi di bawah.
            </p>
            <button
              type="button"
              onClick={resetDefaultPlaylist}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-black text-white border border-cyan-500/40 hover:bg-neutral-900 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-white" />
              Muat Playlist Rekomendasi
            </button>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
            {playlist.map((item, idx) => {
              const isItemActive =
                activeTrackId === item.id || videoId === item.videoId;
              const isItemPlaying = isItemActive && isPlaying;

              return (
                <YouTubePlaylistItemRow
                  key={item.id}
                  item={item}
                  index={idx}
                  isItemActive={isItemActive}
                  isItemPlaying={isItemPlaying}
                  onUpdateTitle={updatePlaylistItemTitle}
                  onRemove={() => setTrackToDelete(item)}
                  onPlayTrack={playTrack}
                  onPause={pause}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Popup Konfirmasi Hapus Lagu Dari Playlist */}
      <ConfirmDeleteModal
        isOpen={Boolean(trackToDelete)}
        onClose={() => setTrackToDelete(null)}
        onConfirm={() => {
          if (trackToDelete) {
            removeFromPlaylist(trackToDelete.id);
            setTrackToDelete(null);
          }
        }}
        title="Hapus Lagu Dari Playlist"
        description="Apakah Anda yakin ingin menghapus lagu ini dari playlist tersimpan?"
        itemName={trackToDelete?.title || "Lagu"}
        confirmLabel="HAPUS LAGU"
      />

      {/* Popup Konfirmasi Reset Playlist ke Default */}
      <ConfirmDeleteModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={() => {
          resetDefaultPlaylist();
          setShowResetConfirm(false);
        }}
        title="Kembalikan Playlist Bawaan"
        description="Apakah Anda yakin ingin mengganti playlist saat ini dengan rekomendasi playlist bawaan?"
        confirmLabel="MUAT DEFAULT"
      />
    </>
  );
};
