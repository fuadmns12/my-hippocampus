import { useCallback, RefObject } from "react";
import { MindMapData, ColorTheme } from "../types";
import { THEME_PALETTES } from "../utils/colorThemes";
import { soundFx } from "../utils/soundEffects";
import { device } from "../utils/deviceDetection";
import {
  exportToPngImage,
  exportToSvgFile,
  exportToJsonFile,
  exportToMarkdown,
  exportToPdfDocument,
} from "../utils/exportUtils";

export function useMindMapExporters(
  svgRef: RefObject<SVGSVGElement | null>,
  mindMapData: MindMapData | null,
  theme: ColorTheme,
  showToast?: (message: string) => void
) {
  const handleExportPdf = useCallback(async () => {
    if (svgRef.current && mindMapData) {
      try {
        soundFx.play("success");
        if (showToast) {
          showToast("Menyiapkan dokumen PDF presentasi & dokumentasi...");
        }
        const isDark = THEME_PALETTES[theme]?.isDark || false;
        await exportToPdfDocument(svgRef.current, mindMapData, isDark);
        if (showToast) {
          showToast("Dokumen PDF berhasil diunduh!");
        }
      } catch (err: any) {
        console.error("Gagal mengekspor PDF:", err);
        if (showToast) {
          showToast("Gagal membuat dokumen PDF. Coba kembali.");
        }
      }
    }
  }, [svgRef, mindMapData, theme, showToast]);

  const handleExportPng = useCallback(async () => {
    if (!svgRef.current || !mindMapData) {
      if (showToast) showToast("Kanvas belum siap untuk diekspor ke PNG.");
      return;
    }

    try {
      soundFx.play("success");
      const isDark = THEME_PALETTES[theme]?.isDark || false;
      if (device.isIOS && showToast) {
        showToast("Ekspor PNG dimulai. Di iOS Safari, jika terbuka di tab baru, tekan & tahan gambar lalu pilih 'Simpan Gambar'.");
      } else if (showToast) {
        showToast("Mengunduh gambar PNG kualitas HD...");
      }

      await exportToPngImage(svgRef.current, mindMapData.title, isDark);
    } catch (err) {
      console.error("Gagal mengekspor PNG:", err);
      if (showToast) {
        showToast("Gagal membuat gambar PNG. Periksa ukuran kanvas atau coba kembali.");
      }
    }
  }, [svgRef, mindMapData, theme, showToast]);

  const handleExportSvg = useCallback(() => {
    if (!svgRef.current || !mindMapData) {
      if (showToast) showToast("Kanvas belum siap untuk diekspor ke SVG.");
      return;
    }

    try {
      soundFx.play("success");
      exportToSvgFile(svgRef.current, mindMapData.title);
      if (showToast) {
        showToast("Berkas vektor SVG berhasil diunduh!");
      }
    } catch (err) {
      console.error("Gagal mengekspor SVG:", err);
      if (showToast) {
        showToast("Gagal membuat berkas SVG. Coba kembali.");
      }
    }
  }, [svgRef, mindMapData, showToast]);

  const handleExportJson = useCallback(() => {
    if (!mindMapData) {
      if (showToast) showToast("Data mind map kosong.");
      return;
    }

    try {
      soundFx.play("success");
      exportToJsonFile(mindMapData, mindMapData.title);
      if (showToast) {
        showToast("Berkas data JSON berhasil diunduh!");
      }
    } catch (err) {
      console.error("Gagal mengekspor JSON:", err);
      if (showToast) {
        showToast("Gagal mengekspor berkas JSON.");
      }
    }
  }, [mindMapData, showToast]);

  const handleExportMarkdown = useCallback(() => {
    if (!mindMapData) {
      if (showToast) showToast("Data mind map kosong.");
      return;
    }

    try {
      soundFx.play("success");
      const text = exportToMarkdown(mindMapData);
      const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${mindMapData.title || "mindmap"}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      if (showToast) {
        showToast("Berkas outline Markdown (.md) berhasil diunduh!");
      }
    } catch (err) {
      console.error("Gagal mengekspor Markdown:", err);
      if (showToast) {
        showToast("Gagal membuat dokumen Markdown.");
      }
    }
  }, [mindMapData, showToast]);

  return {
    handleExportPdf,
    handleExportPng,
    handleExportSvg,
    handleExportJson,
    handleExportMarkdown,
  };
}
