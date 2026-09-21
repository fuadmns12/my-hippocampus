import React, { useState } from "react";
import {
  ClipboardPaste,
  X,
  Plus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { soundFx } from "../../../utils/soundEffects";
import { extractYouTubeVideoId } from "../../../utils/youtubeHelper";
import { AddToPlaylistResult } from "../../../context/YouTubeMusicContext";

interface YouTubeUrlInputBarProps {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  addToPlaylist: (url: string, customTitle?: string) => AddToPlaylistResult;
  errorMessage: string | null;
}

export const YouTubeUrlInputBar: React.FC<YouTubeUrlInputBarProps> = ({
  videoUrl,
  setVideoUrl,
  addToPlaylist,
  errorMessage,
}) => {
  const [pasteSuccess, setPasteSuccess] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);
  const [customTitleInput, setCustomTitleInput] = useState<string>("");

  const handlePasteClipboard = async () => {
    soundFx.play("click");
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setVideoUrl(text.trim());
          setPasteSuccess(true);
          setTimeout(() => setPasteSuccess(false), 2000);
          return;
        }
      }
    } catch {
      // Clipboard API restricted
    }

    const inputEl = document.getElementById(
      "input-youtube-music-url"
    ) as HTMLInputElement | null;
    if (inputEl) {
      inputEl.focus();
      inputEl.select();
    }
  };

  const handleSaveToPlaylist = () => {
    soundFx.play("click");
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);

    if (!videoUrl.trim()) {
      setSaveErrorMsg(
        "Silakan masukkan atau tempel link YouTube terlebih dahulu."
      );
      return;
    }

    const res = addToPlaylist(videoUrl, customTitleInput.trim() || undefined);
    if (res.success) {
      soundFx.play("success");
      setSaveSuccessMsg(res.message);
      setCustomTitleInput("");
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } else {
      soundFx.play("delete");
      setSaveErrorMsg(res.message);
      setTimeout(() => setSaveErrorMsg(null), 3500);
    }
  };

  const isCurrentIdValid = Boolean(extractYouTubeVideoId(videoUrl));

  return (
    <div className="space-y-2 bg-black p-3 rounded-xl border border-neutral-800/80">
      <div className="flex items-center justify-between">
        <label
          htmlFor="input-youtube-music-url"
          className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5"
        >
          <span>Salin / Masukkan Link YouTube:</span>
        </label>
        {pasteSuccess && (
          <span className="text-[11px] text-white flex items-center gap-1 font-mono">
            <CheckCircle2 className="w-3 h-3 text-white" /> Link Berhasil Ditempel!
          </span>
        )}
      </div>

      {/* Input Link + Paste Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 min-w-0">
          <input
            id="input-youtube-music-url"
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Contoh: https://www.youtube.com/watch?v=... atau https://youtu.be/..."
            className="w-full h-9 bg-black border border-neutral-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white text-xs rounded-xl px-3 pr-8 placeholder:text-neutral-500 outline-none transition-all font-mono box-border"
          />
          {videoUrl && (
            <button
              type="button"
              onClick={() => setVideoUrl("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
              title="Kosongkan link"
            >
              <X className="w-3.5 h-3.5 text-rose-400" />
            </button>
          )}
        </div>

        <button
          id="btn-paste-youtube-url"
          type="button"
          onClick={handlePasteClipboard}
          title="Tempel link dari clipboard Anda"
          className="w-36 sm:w-44 h-9 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl text-xs font-semibold tracking-wider bg-black hover:bg-neutral-900 text-white hover:text-white border border-neutral-700 hover:border-cyan-500/50 transition-all active:scale-95 cursor-pointer shrink-0 shadow-sm box-border"
        >
          <ClipboardPaste className="w-3.5 h-3.5 text-white shrink-0" />
          <span className="truncate">TEMPEL LINK</span>
        </button>
      </div>

      {/* Custom Title Input & Actions */}
      <div className="flex items-center gap-2 pt-1">
        <div className="relative flex-1 min-w-0">
          <input
            id="input-youtube-music-title"
            type="text"
            value={customTitleInput}
            onChange={(e) => setCustomTitleInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSaveToPlaylist();
              }
            }}
            placeholder="Nama / Judul Lagu untuk Playlist (Opsional)"
            className="w-full h-9 bg-black border border-neutral-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white text-xs rounded-xl px-3 placeholder:text-neutral-500 outline-none transition-all box-border"
          />
          {customTitleInput && (
            <button
              type="button"
              onClick={() => setCustomTitleInput("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Kosongkan judul"
            >
              <X className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          )}
        </div>

        {/* Save to Playlist Button */}
        <button
          id="btn-save-to-playlist"
          type="button"
          onClick={handleSaveToPlaylist}
          title="Simpan link ini ke daftar putar Anda"
          className={`w-36 sm:w-44 h-9 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl text-xs font-semibold tracking-wider whitespace-nowrap transition-all active:scale-95 cursor-pointer shrink-0 shadow-sm box-border ${
            isCurrentIdValid
              ? "bg-black hover:bg-cyan-950/40 text-cyan-300 border border-cyan-400/80 shadow-cyan-950/40"
              : "bg-black hover:bg-neutral-900 text-neutral-300 border border-neutral-700/80 hover:border-cyan-500/50"
          }`}
        >
          <Plus className={`w-3.5 h-3.5 shrink-0 ${isCurrentIdValid ? "text-cyan-400" : "text-white"}`} />
          <span className="truncate">SIMPAN KE PLAYLIST</span>
        </button>
      </div>

      {/* Feedback messages */}
      {saveSuccessMsg && (
        <div className="flex items-center gap-1.5 text-white text-[11px] pt-0.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}
      {saveErrorMsg && (
        <div className="flex items-center gap-1.5 text-rose-400 text-[11px] pt-0.5">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>{saveErrorMsg}</span>
        </div>
      )}
      {errorMessage && !saveErrorMsg && (
        <div className="flex items-center gap-1.5 text-rose-400 text-[11px] pt-0.5">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
