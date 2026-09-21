import { jsPDF } from "jspdf";
import { MindMapData, MindMapNode } from "../types";

/**
 * Sanitasi teks agar aman dicetak dengan font standar PDF (ASCII/Latin).
 */
function sanitizePdfText(text: string): string {
  if (!text) return "";
  // Ganti karakter non-printable, pertahankan teks latin & simbol baca standar
  return text.replace(/[\uD800-\uDFFF]/g, "").trim();
}

/**
 * Menambahkan halaman dokumentasi dan catatan cabang terstruktur ke dokumen PDF.
 */
export function appendDocumentationPages(
  doc: jsPDF,
  data: MindMapData,
  isDarkTheme: boolean = false
): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // Mulai halaman baru untuk dokumentasi
  doc.addPage("a4", "landscape");

  // Latar belakang halaman
  if (isDarkTheme) {
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    doc.setTextColor(241, 245, 249);
  } else {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    doc.setTextColor(15, 23, 42);
  }

  let y = margin + 5;

  // Header Dokumentasi
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  if (isDarkTheme) {
    doc.setTextColor(56, 189, 248); // sky-400
  } else {
    doc.setTextColor(2, 132, 199); // sky-600
  }
  doc.text("DOKUMENTASI STRUKTUR & CATATAN CABANG", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  if (isDarkTheme) {
    doc.setTextColor(148, 163, 184);
  } else {
    doc.setTextColor(100, 116, 139);
  }
  const cleanTitle = sanitizePdfText(data.title || "Peta Pikiran");
  doc.text(`Rincian hierarki cabang dan catatan kerja untuk: ${cleanTitle}`, margin, y);
  y += 4;

  // Garis pemisah header
  doc.setDrawColor(isDarkTheme ? 51 : 226, isDarkTheme ? 65 : 232, isDarkTheme ? 85 : 240);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Fungsi helper untuk cek batas bawah halaman
  const checkNewPage = (neededSpace: number) => {
    if (y + neededSpace > pageHeight - 15) {
      doc.addPage("a4", "landscape");
      if (isDarkTheme) {
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
      }
      y = margin + 5;
    }
  };

  // Rekursif penelusuran node
  const renderNodeDocumentation = (node: MindMapNode, depth: number) => {
    checkNewPage(12);

    const indent = margin + depth * 8;
    const label = sanitizePdfText(node.label);
    const subtitle = sanitizePdfText(node.subtitle || "");

    // Render node label
    doc.setFont("helvetica", depth === 0 ? "bold" : "bold");
    doc.setFontSize(depth === 0 ? 12 : 10);
    doc.setTextColor(
      isDarkTheme
        ? depth === 0
          ? 56
          : 226
        : depth === 0
        ? 2
        : 30,
      isDarkTheme
        ? depth === 0
          ? 189
          : 232
        : depth === 0
        ? 132
        : 41,
      isDarkTheme
        ? depth === 0
          ? 248
          : 240
        : depth === 0
        ? 199
        : 59
    );

    const bullet = depth === 0 ? "•" : depth === 1 ? "–" : "›";
    doc.text(`${bullet} ${label}`, indent, y);
    y += 5;

    // Render subtitle jika ada
    if (subtitle) {
      checkNewPage(8);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(isDarkTheme ? 148 : 100, isDarkTheme ? 163 : 116, isDarkTheme ? 184 : 139);
      const subLines = doc.splitTextToSize(subtitle, contentWidth - depth * 8);
      doc.text(subLines, indent + 4, y);
      y += subLines.length * 4 + 2;
    }

    // Render catatan (notes) jika ada
    if (node.notes && node.notes.length > 0) {
      node.notes.forEach((n) => {
        checkNewPage(14);
        const noteTitle = sanitizePdfText(n.title);
        const noteContent = sanitizePdfText(n.content);

        // Kotak catatan
        doc.setFillColor(isDarkTheme ? 30 : 241, isDarkTheme ? 41 : 245, isDarkTheme ? 59 : 249);
        doc.roundedRect(indent + 4, y - 3, contentWidth - (depth * 8 + 4), 6, 1, 1, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(isDarkTheme ? 56 : 3, isDarkTheme ? 189 : 105, isDarkTheme ? 248 : 161);
        doc.text(`Catatan: ${noteTitle || "Detail"}`, indent + 6, y + 1);
        y += 6;

        if (noteContent) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.setTextColor(isDarkTheme ? 203 : 71, isDarkTheme ? 213 : 85, isDarkTheme ? 225 : 105);
          const lines = doc.splitTextToSize(noteContent, contentWidth - (depth * 8 + 8));
          checkNewPage(lines.length * 3.8 + 4);
          doc.text(lines, indent + 6, y);
          y += lines.length * 3.8 + 4;
        }
      });
    }

    y += 2;

    // Anak cabang
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => renderNodeDocumentation(child, depth + 1));
    }
  };

  // Render mulai dari akar utama
  if (data.root) {
    renderNodeDocumentation(data.root, 0);
  }
}
