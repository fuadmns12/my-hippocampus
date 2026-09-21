/**
 * Path Builder Module for MindMap Layout Connectors & Anchors
 * 
 * Refactored into modular sub-files:
 * - anchorPoints.ts: Anchor types, 4-anchor calculation, and normal vectors
 * - anchorSelector.ts: Optimal anchor pair selection based on layout geometry
 * - pathGenerators.ts: SVG path generators (Bezier, Straight, Angled, Free pointer)
 * - pathMidpoint.ts: Calculation of 50% midpoint along SVG paths
 */

export * from "./anchorPoints";
export * from "./anchorSelector";
export * from "./pathGenerators";
export * from "./pathMidpoint";

