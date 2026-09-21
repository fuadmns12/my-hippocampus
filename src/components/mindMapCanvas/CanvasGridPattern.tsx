import React from "react";

interface CanvasGridPatternProps {
  gridDotColor: string;
}

export const CanvasGridPattern: React.FC<CanvasGridPatternProps> = ({ gridDotColor }) => {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50 dark:opacity-25"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="dotGrid"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="12" cy="12" r="1.5" fill={gridDotColor} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotGrid)" id="canvas-bg" />
    </svg>
  );
};
