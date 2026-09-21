import { MindMapData, MindMapNode } from "../types";
import { prepareSvgForCleanExport } from "./exportSvgHelper";
export { exportToPdfDocument } from "./exportPdfHelper";

// Convert MindMap structure into structured Markdown text outline
export function exportToMarkdown(data: MindMapData): string {
  if (!data || !data.root) return "";
  let markdown = `# ${data.title || "Mind Map"}\n`;
  if (data.subtitle) {
    markdown += `_${data.subtitle}_\n\n`;
  }

  function traverseNode(node: MindMapNode, depth: number) {
    const indent = "  ".repeat(depth);
    const emojiStr = node.emoji ? `${node.emoji} ` : "";
    const noteStr = node.subtitle ? ` - *${node.subtitle}*` : "";
    markdown += `${indent}- ${emojiStr}**${node.label}**${noteStr}\n`;

    if (node.notes && node.notes.length > 0) {
      node.notes.forEach((n) => {
        const titlePart = n.title ? `**${n.title}**: ` : "";
        markdown += `${indent}  > 📝 ${titlePart}${n.content.replace(/\n/g, `\n${indent}  > `)}\n`;
      });
    }

    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => traverseNode(child, depth + 1));
    }
  }

  if (data.root.children) {
    data.root.children.forEach((child) => traverseNode(child, 0));
  }

  return markdown;
}

// Export SVG Element as clean, standalone SVG file
export function exportToSvgFile(svgElement: SVGSVGElement, filename: string): void {
  if (!svgElement) {
    throw new Error("Elemen SVG kanvas tidak ditemukan untuk diekspor.");
  }

  const { svgElement: cleanSvg } = prepareSvgForCleanExport(svgElement);

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(cleanSvg);

  if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = `${filename}.svg`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// Export SVG Element as high-resolution PNG Image
export function exportToPngImage(
  svgElement: SVGSVGElement,
  filename: string,
  isDarkTheme: boolean = false
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!svgElement) {
      reject(new Error("Elemen SVG kanvas tidak ditemukan untuk diekspor."));
      return;
    }

    try {
      const { svgElement: cleanSvg, width, height } = prepareSvgForCleanExport(
        svgElement,
        isDarkTheme
      );

      const serializer = new XMLSerializer();
      const source = serializer.serializeToString(cleanSvg);
      const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      let isCleanedUp = false;
      const cleanup = () => {
        if (!isCleanedUp) {
          isCleanedUp = true;
          URL.revokeObjectURL(url);
        }
      };

      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          // High-resolution supersampling scale factor
          const scaleFactor = 2;
          canvas.width = width * scaleFactor;
          canvas.height = height * scaleFactor;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            cleanup();
            reject(new Error("Gagal menginisialisasi 2D Canvas Context."));
            return;
          }

          ctx.scale(scaleFactor, scaleFactor);

          // Draw solid background consistent with theme
          ctx.fillStyle = isDarkTheme ? "#020617" : "#f8fafc";
          ctx.fillRect(0, 0, width, height);

          ctx.drawImage(img, 0, 0, width, height);

          cleanup();

          const pngUrl = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.href = pngUrl;
          downloadLink.download = `${filename}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          resolve();
        } catch (canvasErr) {
          cleanup();
          reject(canvasErr);
        }
      };

      img.onerror = () => {
        cleanup();
        reject(new Error("Gagal mengonversi grafis SVG kanvas menjadi berkas gambar PNG."));
      };

      img.src = url;
    } catch (err) {
      reject(err);
    }
  });
}

// Export JSON
export function exportToJsonFile(data: MindMapData, filename: string): void {
  if (!data) {
    throw new Error("Data mind map tidak valid untuk diekspor.");
  }

  const cleanTitle = (data.title || filename || "mindmap").trim();
  const safeFilename = (filename || cleanTitle)
    .replace(/[\\/:*?"<>|]/g, "_")
    .trim()
    .slice(0, 80) || "mindmap";

  const exportPayload: MindMapData = {
    ...data,
    title: cleanTitle,
    root: data.root,
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = `${safeFilename}.json`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// Export All History / Memory Card Data as backup JSON
export function exportAllHistoryToJsonFile(savedMaps: MindMapData[]): void {
  if (!Array.isArray(savedMaps)) {
    throw new Error("Daftar peta tersimpan tidak valid.");
  }

  const payload = {
    version: "1.0",
    appName: "MindMap Studio",
    backupDate: new Date().toISOString(),
    totalMaps: savedMaps.length,
    maps: savedMaps,
  };
  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = `memory-card-mindmap-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

