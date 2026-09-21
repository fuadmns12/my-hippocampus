import React from "react";

export function getSvgGroupCoordinates(
  svgRef: React.RefObject<SVGSVGElement | null>,
  gRef: React.RefObject<SVGGElement | null>,
  clientX: number,
  clientY: number
): { x: number; y: number } {
  if (!svgRef.current || !gRef.current) return { x: clientX, y: clientY };
  const svg = svgRef.current;
  const g = gRef.current;
  const ctm = g.getScreenCTM();
  if (!ctm) return { x: clientX, y: clientY };

  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const transformed = point.matrixTransform(ctm.inverse());
  return { x: transformed.x, y: transformed.y };
}
