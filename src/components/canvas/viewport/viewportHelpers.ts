import { MindMapNode } from "../../../types";
import { LayoutBounds } from "../../../utils/mindmapLayout";

/**
 * Cek apakah targetId adalah keturunan dari parent
 */
export function isDescendantOf(parent: MindMapNode, targetId: string): boolean {
  if (!parent.children) return false;
  for (const child of parent.children) {
    if (child.id === targetId) return true;
    if (isDescendantOf(child, targetId)) return true;
  }
  return false;
}

/**
 * Menentukan apakah elemen yang diklik/disentuh adalah elemen interaktif (node, tombol, input, anchor)
 */
export function isTargetInteractive(
  target: (HTMLElement | SVGElement) | null,
  container: HTMLElement
): boolean {
  let curr: Element | null = target as Element | null;
  while (curr && curr !== container) {
    const id = curr.id || "";
    const tag = curr.tagName ? curr.tagName.toLowerCase() : "";
    if (
      id.startsWith("canvas-node-") ||
      id.startsWith("node-anchors-") ||
      id.startsWith("btn-") ||
      id.startsWith("node-resize-") ||
      curr.classList.contains("node-resize-system") ||
      curr.hasAttribute("data-canvas-control") ||
      curr.hasAttribute("data-no-pan") ||
      tag === "button" ||
      tag === "input" ||
      tag === "textarea" ||
      tag === "select" ||
      curr.getAttribute("role") === "button"
    ) {
      return true;
    }
    curr = curr.parentElement;
  }
  return false;
}

/**
 * Konversi koordinat layar (clientX, clientY) ke sistem koordinat transform SVG group
 */
export function getGroupCoordinates(
  svg: SVGSVGElement | null,
  g: SVGGElement | null,
  clientX: number,
  clientY: number
): { x: number; y: number } {
  if (!svg || !g) return { x: clientX, y: clientY };
  const ctm = g.getScreenCTM();
  if (!ctm) return { x: clientX, y: clientY };

  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const transformed = point.matrixTransform(ctm.inverse());
  return { x: transformed.x, y: transformed.y };
}

export interface ViewportTransform {
  zoom: number;
  pan: { x: number; y: number };
}

/**
 * Hitung transformasi fit to screen agar seluruh diagram pas di tengah kanvas
 */
export function calculateFitToScreen(
  bounds: LayoutBounds | undefined,
  nodesLength: number
): ViewportTransform {
  if (nodesLength === 0 || !bounds) {
    return { zoom: 0.85, pan: { x: 0, y: 0 } };
  }

  const viewBoxWidth = 1600;
  const viewBoxHeight = 1200;

  const contentWidth = Math.max(600, bounds.maxX - bounds.minX);
  const contentHeight = Math.max(500, bounds.maxY - bounds.minY);

  const contentCenterX = (bounds.minX + bounds.maxX) / 2;
  const contentCenterY = (bounds.minY + bounds.maxY) / 2;

  const targetWidth = viewBoxWidth - 200;
  const targetHeight = viewBoxHeight - 200;

  const scaleX = targetWidth / contentWidth;
  const scaleY = targetHeight / contentHeight;
  const fitZoom = Math.min(1.5, Math.max(0.1, Math.min(scaleX, scaleY)));

  // panX = viewBoxWidth / 2 - contentCenterX * fitZoom
  const panX = viewBoxWidth / 2 - contentCenterX * fitZoom;
  const panY = viewBoxHeight / 2 - contentCenterY * fitZoom;

  return { zoom: fitZoom, pan: { x: panX, y: panY } };
}

/**
 * Hitung zoom dan pan baru saat roda mouse diputar berpusat pada posisi kursor
 */
export function calculateWheelZoom(
  svg: SVGSVGElement | null,
  clientX: number,
  clientY: number,
  deltaY: number,
  currentZoom: number,
  currentPan: { x: number; y: number }
): ViewportTransform | null {
  const zoomFactor = deltaY < 0 ? 1.08 : 0.92;
  const nextZoom = Math.min(4.0, Math.max(0.1, currentZoom * zoomFactor));
  if (Math.abs(nextZoom - currentZoom) < 0.0001) return null;

  let svgX = 800;
  let svgY = 600;

  if (svg) {
    const ctm = svg.getScreenCTM();
    if (ctm) {
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const svgPt = pt.matrixTransform(ctm.inverse());
      svgX = svgPt.x;
      svgY = svgPt.y;
    } else {
      const rect = svg.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        svgX = ((clientX - rect.left) / rect.width) * 1600;
        svgY = ((clientY - rect.top) / rect.height) * 1200;
      }
    }
  }

  const scaleRatio = nextZoom / currentZoom;
  const newPanX = svgX - (svgX - currentPan.x) * scaleRatio;
  const newPanY = svgY - (svgY - currentPan.y) * scaleRatio;

  return { zoom: nextZoom, pan: { x: newPanX, y: newPanY } };
}

export interface PinchState {
  pinchStartDistance: number;
  pinchStartZoom: number;
  pinchStartPan: { x: number; y: number };
  pinchStartMidpoint: { x: number; y: number };
}

/**
 * Hitung zoom dan pan baru saat gestur pinch-to-zoom dengan dua jari dilakukan
 */
export function calculatePinchZoom(
  svg: SVGSVGElement | null,
  t1: { clientX: number; clientY: number },
  t2: { clientX: number; clientY: number },
  pinchState: PinchState
): ViewportTransform | null {
  if (pinchState.pinchStartDistance <= 10) return null;

  const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
  const scaleFactor = currentDist / pinchState.pinchStartDistance;
  const nextZoom = Math.min(
    4.0,
    Math.max(0.1, pinchState.pinchStartZoom * scaleFactor)
  );

  const currentMidX = (t1.clientX + t2.clientX) / 2;
  const currentMidY = (t1.clientY + t2.clientY) / 2;

  let svgX = 800;
  let svgY = 600;
  if (svg) {
    const ctm = svg.getScreenCTM();
    if (ctm) {
      const pt = svg.createSVGPoint();
      pt.x = pinchState.pinchStartMidpoint.x;
      pt.y = pinchState.pinchStartMidpoint.y;
      const svgPt = pt.matrixTransform(ctm.inverse());
      svgX = svgPt.x;
      svgY = svgPt.y;
    } else {
      const rect = svg.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        svgX =
          ((pinchState.pinchStartMidpoint.x - rect.left) / rect.width) * 1600;
        svgY =
          ((pinchState.pinchStartMidpoint.y - rect.top) / rect.height) * 1200;
      }
    }
  }

  const scaleRatio = nextZoom / pinchState.pinchStartZoom;
  const midDeltaX = currentMidX - pinchState.pinchStartMidpoint.x;
  const midDeltaY = currentMidY - pinchState.pinchStartMidpoint.y;

  const newPanX =
    svgX - (svgX - pinchState.pinchStartPan.x) * scaleRatio + midDeltaX;
  const newPanY =
    svgY - (svgY - pinchState.pinchStartPan.y) * scaleRatio + midDeltaY;

  return { zoom: nextZoom, pan: { x: newPanX, y: newPanY } };
}

/**
 * Ambang gerakan minimum (px) sebelum arah gestur 1 jari di area kanvas diputuskan.
 *
 * Nilainya sengaja sedikit lebih besar dari ambang sentuh (*touch slop*) browser (~8px)
 * supaya browser tidak sempat memulai scroll-nya sendiri ketika gestur ternyata
 * dimaksudkan untuk menggeser (pan) kanvas. Di bawah ambang ini sentuhan dibiarkan
 * "belum ditentukan" sehingga tap tetap responsif.
 */
export const TOUCH_GESTURE_DECISION_THRESHOLD_PX = 12;

/**
 * Rasio bias vertikal: gerakan vertikal harus lebih besar dari gerakan horizontal
 * agar gestur dianggap berniat SCROLL HALAMAN (bukan pan kanvas).
 */
export const TOUCH_VERTICAL_SCROLL_BIAS = 1.2;

export type SingleFingerGestureIntent =
  | "undecided"
  | "scroll-page"
  | "pan-canvas";

/**
 * Menentukan niat gestur SATU JARI yang dimulai dari area kosong kanvas.
 *
 * Masalah yang diselesaikan: handler `touchmove` milik kanvas memanggil `preventDefault()`,
 * sehingga scroll halaman dengan satu jari tidak pernah berjalan (terutama di HP).
 * Dengan fungsi ini gestur vertikal diserahkan kembali ke browser (scroll halaman),
 * sedangkan gestur horizontal tetap dipakai untuk menggeser (pan) kanvas.
 *
 * @param deltaX Selisih client X dari titik sentuh awal (px).
 * @param deltaY Selisih client Y dari titik sentuh awal (px).
 * @param preferPageScroll `false` saat Mode Kanvas Fokus (layar penuh) agar 1 jari bebas pan.
 */
export function resolveSingleFingerGestureIntent(
  deltaX: number,
  deltaY: number,
  preferPageScroll: boolean
): SingleFingerGestureIntent {
  // Mode kanvas fokus / layar penuh: halaman tidak perlu di-scroll, 1 jari bebas menggeser kanvas
  if (!preferPageScroll) return "pan-canvas";

  // Gerakan masih terlalu kecil: belum bisa dipastikan (bisa jadi hanya sebuah tap)
  if (Math.hypot(deltaX, deltaY) < TOUCH_GESTURE_DECISION_THRESHOLD_PX) {
    return "undecided";
  }

  const isVerticalDominant =
    Math.abs(deltaY) > Math.abs(deltaX) * TOUCH_VERTICAL_SCROLL_BIAS;

  return isVerticalDominant ? "scroll-page" : "pan-canvas";
}
