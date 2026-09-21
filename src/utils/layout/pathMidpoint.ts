/**
 * Menghitung koordinat (x, y) tepat di titik tengah (50% lintasan) dari jalur kurva atau garis SVG.
 * Mendukung kurva Cubic Bezier, garis lurus, dan jalur bersiku/stepped.
 */
export function getPathMidpoint(pathD: string): { x: number; y: number } {
  if (!pathD) return { x: 0, y: 0 };

  // 1. Cubic Bezier: M sx sy C cp1x cp1y, cp2x cp2y, tx ty
  const cMatch = pathD.match(
    /M\s+([-\d.]+)\s+([-\d.]+)\s+C\s+([-\d.]+)\s+([-\d.]+)[,\s]+([-\d.]+)\s+([-\d.]+)[,\s]+([-\d.]+)\s+([-\d.]+)/i
  );
  if (cMatch) {
    const sx = parseFloat(cMatch[1]);
    const sy = parseFloat(cMatch[2]);
    const cp1x = parseFloat(cMatch[3]);
    const cp1y = parseFloat(cMatch[4]);
    const cp2x = parseFloat(cMatch[5]);
    const cp2y = parseFloat(cMatch[6]);
    const tx = parseFloat(cMatch[7]);
    const ty = parseFloat(cMatch[8]);

    // Titik pada kurva Bezier kubik pada parameter t = 0.5 (tepat di tengah jalan kurva)
    const midX = 0.125 * sx + 0.375 * cp1x + 0.375 * cp2x + 0.125 * tx;
    const midY = 0.125 * sy + 0.375 * cp1y + 0.375 * cp2y + 0.125 * ty;
    return { x: midX, y: midY };
  }

  // 2. Straight line: M sx sy L tx ty
  const lMatch = pathD.match(/M\s+([-\d.]+)\s+([-\d.]+)\s+L\s+([-\d.]+)\s+([-\d.]+)/i);
  if (lMatch) {
    const sx = parseFloat(lMatch[1]);
    const sy = parseFloat(lMatch[2]);
    const tx = parseFloat(lMatch[3]);
    const ty = parseFloat(lMatch[4]);
    return { x: (sx + tx) / 2, y: (sy + ty) / 2 };
  }

  // 3. Angled path: M sx sy H midX V ty H tx
  const hvhMatch = pathD.match(
    /M\s+([-\d.]+)\s+([-\d.]+)\s+H\s+([-\d.]+)\s+V\s+([-\d.]+)\s+H\s+([-\d.]+)/i
  );
  if (hvhMatch) {
    const sx = parseFloat(hvhMatch[1]);
    const sy = parseFloat(hvhMatch[2]);
    const midX = parseFloat(hvhMatch[3]);
    const ty = parseFloat(hvhMatch[4]);
    const tx = parseFloat(hvhMatch[5]);

    const l1 = Math.abs(midX - sx);
    const l2 = Math.abs(ty - sy);
    const l3 = Math.abs(tx - midX);
    const total = l1 + l2 + l3;
    const half = total / 2;

    if (half <= l1) {
      return { x: sx + (midX >= sx ? half : -half), y: sy };
    } else if (half <= l1 + l2) {
      const rem = half - l1;
      return { x: midX, y: sy + (ty >= sy ? rem : -rem) };
    } else {
      const rem = half - (l1 + l2);
      return { x: midX + (tx >= midX ? rem : -rem), y: ty };
    }
  }

  // 4. Angled path: M sx sy V midY H tx V ty
  const vhvMatch = pathD.match(
    /M\s+([-\d.]+)\s+([-\d.]+)\s+V\s+([-\d.]+)\s+H\s+([-\d.]+)\s+V\s+([-\d.]+)/i
  );
  if (vhvMatch) {
    const sx = parseFloat(vhvMatch[1]);
    const sy = parseFloat(vhvMatch[2]);
    const midY = parseFloat(vhvMatch[3]);
    const tx = parseFloat(vhvMatch[4]);
    const ty = parseFloat(vhvMatch[5]);

    const l1 = Math.abs(midY - sy);
    const l2 = Math.abs(tx - sx);
    const l3 = Math.abs(ty - midY);
    const total = l1 + l2 + l3;
    const half = total / 2;

    if (half <= l1) {
      return { x: sx, y: sy + (midY >= sy ? half : -half) };
    } else if (half <= l1 + l2) {
      const rem = half - l1;
      return { x: sx + (tx >= sx ? rem : -rem), y: midY };
    } else {
      const rem = half - (l1 + l2);
      return { x: tx, y: midY + (ty >= midY ? rem : -rem) };
    }
  }

  // 5. Angled path: M sx sy H tx V ty
  const hvMatch = pathD.match(/M\s+([-\d.]+)\s+([-\d.]+)\s+H\s+([-\d.]+)\s+V\s+([-\d.]+)/i);
  if (hvMatch) {
    const sx = parseFloat(hvMatch[1]);
    const sy = parseFloat(hvMatch[2]);
    const tx = parseFloat(hvMatch[3]);
    const ty = parseFloat(hvMatch[4]);
    const l1 = Math.abs(tx - sx);
    const l2 = Math.abs(ty - sy);
    const half = (l1 + l2) / 2;
    if (half <= l1) {
      return { x: sx + (tx >= sx ? half : -half), y: sy };
    } else {
      const rem = half - l1;
      return { x: tx, y: sy + (ty >= sy ? rem : -rem) };
    }
  }

  // 6. Angled path: M sx sy V ty H tx
  const vhMatch = pathD.match(/M\s+([-\d.]+)\s+([-\d.]+)\s+V\s+([-\d.]+)\s+H\s+([-\d.]+)/i);
  if (vhMatch) {
    const sx = parseFloat(vhMatch[1]);
    const sy = parseFloat(vhMatch[2]);
    const ty = parseFloat(vhMatch[3]);
    const tx = parseFloat(vhMatch[4]);
    const l1 = Math.abs(ty - sy);
    const l2 = Math.abs(tx - sx);
    const half = (l1 + l2) / 2;
    if (half <= l1) {
      return { x: sx, y: sy + (ty >= sy ? half : -half) };
    } else {
      const rem = half - l1;
      return { x: sx + (tx >= sx ? rem : -rem), y: ty };
    }
  }

  // Generic fallback
  const nums = pathD.match(/-?[\d.]+/g)?.map(Number);
  if (nums && nums.length >= 4) {
    const sx = nums[0];
    const sy = nums[1];
    const tx = nums[nums.length - 2];
    const ty = nums[nums.length - 1];
    return { x: (sx + tx) / 2, y: (sy + ty) / 2 };
  }

  return { x: 0, y: 0 };
}
