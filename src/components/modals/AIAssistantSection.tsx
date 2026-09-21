import React from "react";
import {
  HelpCircle,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useAIAssistant } from "../../context/AIAssistantContext";
import { soundFx } from "../../utils/soundEffects";
import { NeoToggle } from "../common/NeoToggle";

export const AIAssistantSection: React.FC = () => {
  const { settings, updateSettings, setIsChatOpen } = useAIAssistant();

  const handleToggleEnabled = (enabled: boolean) => {
    soundFx.play("click");
    updateSettings({ isEnabled: enabled });
  };

  return (
    <div className="pt-4 border-t border-neutral-800/80 space-y-3.5">
      {/* Header & Toggle Section */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-black border border-cyan-500/40 flex items-center justify-center text-white shrink-0 overflow-hidden">
            <img
              src="/bot_geuwat_avatar.webp"
              alt="Bot Geuwat"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-white tracking-wide">
                Bot Panduan Website
              </h4>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-black border border-cyan-500/30 text-white">
                PANDUAN LOKAL
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-tight mt-0.5">
              Khusus menjawab pertanyaan seputar cara menggunakan fitur website ini
            </p>
          </div>
        </div>

        {/* Master Switch Toggle */}
        <NeoToggle
          id="toggle-ai-assistant-master"
          checked={settings.isEnabled}
          onChange={(checked) => handleToggleEnabled(checked)}
          title={settings.isEnabled ? "Bot Panduan Website Aktif" : "Bot Panduan Website Nonaktif"}
          aria-label="Toggle Bot Panduan Website"
        />
      </div>

      {/* When Activated */}
      {settings.isEnabled ? (
        <div className="space-y-3 bg-black p-3.5 rounded-2xl border border-cyan-500/30">
          <div className="p-2.5 rounded-xl bg-black border border-cyan-500/20 text-[11px] text-white leading-relaxed flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-white shrink-0 mt-0.5" />
            <div>
              <strong>100% Basis Pengetahuan Lokal:</strong> Bot Panduan ini beroperasi sepenuhnya secara bawaan menggunakan basis pengetahuan internal website. Tidak memerlukan API Key, kuota token, ataupun akun eksternal.
            </div>
          </div>

          <div className="space-y-1.5 text-[11px] text-neutral-300 pl-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Panduan membuat mind map, format hierarki indentasi & pintasan keyboard</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Panduan tata letak, tema warna, konektor, dan catatan cabang</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Panduan navigasi langsung (Scroll tampilan dan Buka Popup modal)</span>
            </div>
          </div>

          {/* Action button: Open Chat */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                soundFx.play("click");
                setIsChatOpen(true);
              }}
              className="w-full py-2 px-4 rounded-xl bg-black hover:bg-neutral-900 border border-cyan-500/50 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-md shadow-cyan-950/50"
            >
              <HelpCircle className="w-3.5 h-3.5 text-white" />
              <span>Buka Bot Panduan</span>
            </button>
          </div>

          {/* Privacy & Offline Reassurance */}
          <div className="p-2.5 rounded-xl bg-black border border-neutral-800 flex items-start gap-2 text-[11px] text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-white shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Bebas & Privat:</strong> Semua percakapan panduan berjalan di dalam perangkat browser Anda secara instan dan tanpa pengiriman data ke server kecerdasan buatan luar.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-black border border-neutral-800 text-[11px] text-neutral-400 leading-relaxed">
          Aktifkan sakelar di atas untuk memunculkan tombol Bot Panduan Website di pojok kanan bawah kanvas.
        </div>
      )}
    </div>
  );
};
