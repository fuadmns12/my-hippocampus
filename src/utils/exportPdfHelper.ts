import { jsPDF } from "jspdf";
import { MindMapData } from "../types";
import { prepareSvgForCleanExport } from "./exportSvgHelper";
import { appendDocumentationPages } from "./exportPdfDocSection";

/**
 * Merender elemen SVG ke dalam data URL gambar PNG beresolusi tinggi.
 */
function renderSvgToPngDataUrl(
  svgElement: SVGSVGElement,
  isDarkTheme: boolean
): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const { svgElement: cleanSvg, width, height } = prepareSvgForCleanExport(
      svgElement,
      isDarkTheme
    );

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(cleanSvg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scaleFactor = 2; // Supersampling 2x untuk ketajaman dokumen PDF
      canvas.width = width * scaleFactor;
      canvas.height = height * scaleFactor;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error("Gagal menginisialisasi 2D Canvas Context."));
      }

      ctx.scale(scaleFactor, scaleFactor);

      // Solid background warna kanvas
      ctx.fillStyle = isDarkTheme ? "#0f172a" : "#ffffff";
      ctx.fillRect(0, 0, width, height);

      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);

      const dataUrl = canvas.toDataURL("image/png");
      resolve({ dataUrl, width, height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gagal merender gambar SVG ke Canvas untuk PDF."));
    };

    img.src = url;
  });
}

/**
 * Mengekspor Peta Pikiran ke dalam format dokumen PDF Presentasi & Dokumentasi.
 */
export async function exportToPdfDocument(
  svgElement: SVGSVGElement,
  data: MindMapData,
  isDarkTheme: boolean = false
): Promise<void> {
  const { dataUrl, width: imgW, height: imgH } = await renderSvgToPngDataUrl(
    svgElement,
    isDarkTheme
  );

  // Dokumen A4 Landscape (297 mm x 210 mm)
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Latar belakang Halaman 1
  if (isDarkTheme) {
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    doc.setTextColor(241, 245, 249);
  } else {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    doc.setTextColor(15, 23, 42);
  }

  // --- Header Presentasi ---
  let headerY = margin + 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  if (isDarkTheme) {
    doc.setTextColor(56, 189, 248); // sky-400
  } else {
    doc.setTextColor(2, 132, 199); // sky-600
  }
  const displayTitle = (data.title || "Peta Pikiran").replace(/[\uD800-\uDFFF]/g, "");
  doc.text(displayTitle, margin, headerY);

  // Tanggal & Info di pojok kanan atas
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(isDarkTheme ? 148 : 100, isDarkTheme ? 163 : 116, isDarkTheme ? 184 : 139);
  const dateStr = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(`Mate Mind Map • ${dateStr}`, pageWidth - margin, headerY, {
    align: "right",
  });

  headerY += 5;

  if (data.subtitle) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9.5);
    const sub = data.subtitle.replace(/[\uD800-\uDFFF]/g, "");
    doc.text(sub, margin, headerY);
    headerY += 4;
  }

  // Garis aksen header
  doc.setDrawColor(isDarkTheme ? 51 : 226, isDarkTheme ? 65 : 232, isDarkTheme ? 85 : 240);
  doc.setLineWidth(0.4);
  doc.line(margin, headerY, pageWidth - margin, headerY);
  headerY += 5;

  // --- Gambar Visual Mind Map (Halaman 1) ---
  const maxMapWidth = pageWidth - margin * 2;
  const maxMapHeight = pageHeight - headerY - margin - 8;

  const aspectRatio = imgW / imgH;
  let renderW = maxMapWidth;
  let renderH = renderW / aspectRatio;

  if (renderH > maxMapHeight) {
    renderH = maxMapHeight;
    renderW = renderH * aspectRatio;
  }

  const renderX = margin + (maxMapWidth - renderW) / 2;
  const renderY = headerY + (maxMapHeight - renderH) / 2;

  // Masukkan gambar diagram mind map beresolusi tinggi
  doc.addImage(dataUrl, "PNG", renderX, renderY, renderW, renderH, undefined, "FAST");

  // Bingkai halus di sekeliling diagram
  doc.setDrawColor(isDarkTheme ? 30 : 226, isDarkTheme ? 41 : 232, isDarkTheme ? 59 : 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(renderX, renderY, renderW, renderH, 1.5, 1.5, "D");

  // Footer Halaman 1
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(isDarkTheme ? 100 : 148, isDarkTheme ? 116 : 163, isDarkTheme ? 139 : 184);
  doc.text("Halaman 1: Tampilan Visual Presentasi", margin, pageHeight - margin + 3);

  // --- Halaman 2+: Dokumentasi & Rincian Catatan ---
  if (data.root && data.root.children && data.root.children.length > 0) {
    appendDocumentationPages(doc, data, isDarkTheme);
  }

  // Simpan berkas PDF
  const safeFilename = (data.title || "mindmap")
    .replace(/[\\/:*?"<>|]/g, "_")
    .trim()
    .slice(0, 80) || "mindmap";

  doc.save(`${safeFilename}.pdf`);
}
