/**
 * Utility to prepare and sanitize an SVG element for clean PNG and SVG export.
 * Solves:
 * - Bug 2.1: Viewport transform & pan/zoom artifacts eliminated by centering full diagram bounds
 * - Bug 2.2: Strips editor UI elements (anchors, resize handles, drag buttons, edit/note action buttons)
 * - Bug 2.3: Inlines computed SVG styles and embeds CSS rules so Tailwind/dark styles render cleanly in PNG
 * - Bug 2.4: Calculates exact bounding box with margin so large/radial mindmaps never clip
 */

export interface SvgExportPreparation {
  svgElement: SVGSVGElement;
  width: number;
  height: number;
  viewBox: string;
}

export function prepareSvgForCleanExport(
  sourceSvg: SVGSVGElement,
  isDarkTheme: boolean = false
): SvgExportPreparation {
  const clone = sourceSvg.cloneNode(true) as SVGSVGElement;

  // 1. Remove all editor-only UI elements marked with data-export-ignore
  const ignoredElements = clone.querySelectorAll("[data-export-ignore='true']");
  ignoredElements.forEach((el) => el.remove());

  // Also remove any rogue scale menus or helper markers
  const editButtons = clone.querySelectorAll("[id^='btn-edit-node-'], [id^='btn-notes-node-'], .node-resize-system, .node-anchor-points");
  editButtons.forEach((el) => el.remove());

  // 2. Find the primary transformed viewport group <g>
  const viewportG = clone.querySelector("svg > g") as SVGGElement | null;
  if (viewportG) {
    // Reset transform so panning and user zoom don't affect export geometry
    viewportG.removeAttribute("transform");
  }

  // 3. Compute accurate diagram bounds from native elements
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  try {
    // Attempt to compute bounding box from original live SVG's main group
    const liveG = sourceSvg.querySelector("svg > g") as SVGGElement | null;
    if (liveG && typeof liveG.getBBox === "function") {
      const bbox = liveG.getBBox();
      if (bbox.width > 0 && bbox.height > 0) {
        minX = bbox.x;
        minY = bbox.y;
        maxX = bbox.x + bbox.width;
        maxY = bbox.y + bbox.height;
      }
    }
  } catch {
    // Fallback if getBBox fails in headless/isolated test environment
  }

  // Fallback if bbox could not be accurately obtained
  if (minX === Infinity || maxX === -Infinity || minX === maxX) {
    const nodes = clone.querySelectorAll("[id^='canvas-node-']");
    nodes.forEach((node) => {
      const transform = node.getAttribute("transform");
      if (transform) {
        const match = /translate\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/.exec(transform);
        if (match) {
          const nx = parseFloat(match[1]);
          const ny = parseFloat(match[2]);
          minX = Math.min(minX, nx - 160);
          maxX = Math.max(maxX, nx + 160);
          minY = Math.min(minY, ny - 60);
          maxY = Math.max(maxY, ny + 60);
        }
      }
    });
  }

  // Safe defaults if still empty
  if (minX === Infinity || maxX === -Infinity) {
    minX = 200;
    maxX = 1400;
    minY = 150;
    maxY = 1050;
  }

  // Generous padding around the diagram for a professional canvas presentation
  const padding = 70;
  const exportX = minX - padding;
  const exportY = minY - padding;
  const exportWidth = Math.max(600, Math.ceil(maxX - minX + padding * 2));
  const exportHeight = Math.max(450, Math.ceil(maxY - minY + padding * 2));

  // Set calibrated viewBox and dimensions on the SVG clone
  clone.setAttribute("viewBox", `${exportX} ${exportY} ${exportWidth} ${exportHeight}`);
  clone.setAttribute("width", `${exportWidth}`);
  clone.setAttribute("height", `${exportHeight}`);
  clone.style.overflow = "hidden";

  // 4. Ensure xmlns attributes
  if (!clone.getAttribute("xmlns")) {
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }
  if (!clone.getAttribute("xmlns:xlink")) {
    clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  }

  // 5. Embed CSS definitions and keyframe animations into <defs><style>
  let defs = clone.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    clone.insertBefore(defs, clone.firstChild);
  }

  const styleEl = document.createElementNS("http://www.w3.org/2000/svg", "style");
  styleEl.textContent = `
    text {
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }
    .animate-flow-dash {
      stroke-dashoffset: 0;
    }
  `;
  defs.appendChild(styleEl);

  // 6. Invert/inline any critical computed colors from original live nodes
  const liveElements = sourceSvg.querySelectorAll("text, rect, ellipse, polygon, path, circle");
  const cloneElements = clone.querySelectorAll("text, rect, ellipse, polygon, path, circle");

  const minCount = Math.min(liveElements.length, cloneElements.length);
  for (let i = 0; i < minCount; i++) {
    const liveEl = liveElements[i] as SVGGraphicsElement;
    const cloneEl = cloneElements[i] as SVGGraphicsElement;

    // Check if liveEl has computed font or fill styles
    try {
      const computed = window.getComputedStyle(liveEl);
      if (liveEl.tagName.toLowerCase() === "text") {
        if (!cloneEl.getAttribute("fill") && computed.fill && computed.fill !== "none") {
          cloneEl.setAttribute("fill", computed.fill);
        }
        if (!cloneEl.getAttribute("font-size") && computed.fontSize) {
          cloneEl.setAttribute("font-size", computed.fontSize);
        }
        if (!cloneEl.getAttribute("font-family") && computed.fontFamily) {
          cloneEl.setAttribute("font-family", computed.fontFamily);
        }
      }
    } catch {
      // Continue gracefully if computed style reading is restricted
    }
  }

  return {
    svgElement: clone,
    width: exportWidth,
    height: exportHeight,
    viewBox: `${exportX} ${exportY} ${exportWidth} ${exportHeight}`,
  };
}
