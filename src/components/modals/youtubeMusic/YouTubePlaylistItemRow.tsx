import React, { useState } from "react";
import { Music, Edit2, Check, X, Play, Pause, Trash2 } from "lucide-react";
import { PlaylistItem } from "../../../utils/youtubeHelper";
import { soundFx } from "../../../utils/soundEffects";

interface YouTubePlaylistItemRowProps {
  item: PlaylistItem;
  index: number;
  isItemActive: boolean;
  isItemPlaying: boolean;
  onUpdateTitle: (id: string, newTitle: string) => void;
  onRemove: (id: string) => void;
  onPlayTrack: (item: PlaylistItem) => void;
  onPause: () => void;
}

export const YouTubePlaylistItemRow: React.FC<YouTubePlaylistItemRowProps> = ({
  item,
  index,
  isItemActive,
  isItemPlaying,
  onUpdateTitle,
  onRemove,
  onPlayTrack,
  onPause,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitleText, setEditingTitleText] = useState(item.title);

  const handleStartRename = () => {
    soundFx.play("click");
    setIsEditing(true);
    setEditingTitleText(item.title);
  };

  const handleSaveRename = () => {
    soundFx.play("click");
    if (editingTitleText.trim()) {
      onUpdateTitle(item.id, editingTitleText.trim());
    }
    setIsEditing(false);
  };

  return (
    <div
      id={`playlist-item-${item.id}`}
      className={`flex items-center justify-between gap-2 p-2 rounded-xl border transition-all text-xs group ${
        isItemActive
          ? "bg-black border-cyan-500/60 text-white shadow-sm ring-1 ring-cyan-500/40"
          : "bg-black border-neutral-800/80 text-neutral-300 hover:bg-neutral-900 hover:border-neutral-700"
      }`}
    >
      {/* Left: Number + Title / Inline Edit */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <span className="text-[10px] font-mono text-white w-4 text-center shrink-0">
          {index + 1}
        </span>

        {/* Equalizer animation if active */}
        <div className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
          {isItemPlaying ? (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          ) : (
            <Music className="w-3.5 h-3.5 text-white" />
          )}
        </div>

        {isEditing ? (
          <div className="flex items-center gap-1 flex-1">
            <input
              type="text"
              value={editingTitleText}
              onChange={(e) => setEditingTitleText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveRename();
                if (e.key === "Escape") setIsEditing(false);
              }}
              autoFocus
              className="flex-1 bg-black border border-cyan-400 text-white text-xs rounded px-2 py-1 outline-none"
            />
            <button
              type="button"
              onClick={handleSaveRename}
              className="p-1 rounded bg-black border border-cyan-400 text-white hover:bg-neutral-900 cursor-pointer"
            >
              <Check className="w-3 h-3 text-white" />
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1 rounded bg-black border border-neutral-700 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-3 h-3 text-rose-400" />
            </button>
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-white truncate leading-tight">
                {item.title}
              </p>
              <button
                type="button"
                onClick={handleStartRename}
                title="Ubah judul lagu"
                className="opacity-0 group-hover:opacity-100 p-0.5 text-neutral-500 hover:text-white transition-opacity cursor-pointer shrink-0"
              >
                <Edit2 className="w-3 h-3 text-white" />
              </button>
            </div>
            <p className="text-[10px] text-neutral-500 font-mono truncate">
              ID: {item.videoId}
            </p>
          </div>
        )}
      </div>

      {/* Right Actions: Play / Pause / Delete */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => {
            soundFx.play("click");
            if (isItemPlaying) {
              onPause();
            } else {
              onPlayTrack(item);
            }
          }}
          title={isItemPlaying ? "Jeda lagu ini" : "Putar lagu ini"}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all active:scale-95 cursor-pointer ${
            isItemPlaying
              ? "bg-black text-white border border-cyan-400 hover:bg-neutral-900"
              : isItemActive
              ? "bg-black text-white border border-cyan-500/50 hover:bg-neutral-900"
              : "bg-black border border-neutral-700 hover:bg-neutral-900 text-neutral-200"
          }`}
        >
          {isItemPlaying ? (
            <>
              <Pause className="w-3 h-3 text-cyan-400 fill-current" />
              <span>JEDA</span>
            </>
          ) : (
            <>
              <Play
                className={`w-3 h-3 ${
                  isItemActive ? "text-cyan-400" : "text-white"
                } fill-current`}
              />
              <span>PUTAR</span>
            </>
          )}
        </button>

        {/* Delete Item */}
        <button
          type="button"
          onClick={() => {
            soundFx.play("delete");
            onRemove(item.id);
          }}
          title="Hapus lagu ini dari playlist"
          className="p-1 rounded-lg hover:bg-neutral-900 text-neutral-500 hover:text-white transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
        </button>
      </div>
    </div>
  );
};
