export function isColorDark(colorHex?: string): boolean {
  if (!colorHex || colorHex === "transparent") return false;
  const cleanHex = colorHex.trim();
  if (cleanHex.startsWith("#")) {
    const raw = cleanHex.replace("#", "");
    if (raw.length === 3) {
      const r = parseInt(raw[0] + raw[0], 16) || 0;
      const g = parseInt(raw[1] + raw[1], 16) || 0;
      const b = parseInt(raw[2] + raw[2], 16) || 0;
      return (r * 299 + g * 587 + b * 114) / 1000 < 140;
    }
    const r = parseInt(raw.substring(0, 2), 16) || 0;
    const g = parseInt(raw.substring(2, 4), 16) || 0;
    const b = parseInt(raw.substring(4, 6), 16) || 0;
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq < 140;
  }
  return false;
}

export function computeFittedLabelText(
  labelText: string,
  emoji: string | undefined,
  initialFontSize: number,
  availableWidth: number,
  scaleFactor: number
) {
  const charFactor = 0.5;
  const emojiWidth = emoji ? initialFontSize * 1.3 : 0;
  let dynamicFontSize = initialFontSize;

  if (labelText.length > 0) {
    const requiredWidth = emojiWidth + labelText.length * initialFontSize * charFactor;
    if (requiredWidth > availableWidth) {
      const targetTextWidth = Math.max(10, availableWidth - emojiWidth);
      const calculatedFontSize = targetTextWidth / (labelText.length * charFactor);
      const minFontSize = Math.max(4.5, 4.8 * Math.min(1, scaleFactor));
      dynamicFontSize = Math.min(
        initialFontSize,
        Math.max(minFontSize, Math.round(calculatedFontSize * 10) / 10)
      );
    }
  }

  const maxCharsAtDynamicFont = Math.floor(
    (availableWidth - emojiWidth) / (dynamicFontSize * charFactor)
  );

  const isSeverelyOverflowing =
    labelText.length > maxCharsAtDynamicFont + 4 && dynamicFontSize <= 5.0;

  const displayLabelText = isSeverelyOverflowing
    ? (emoji ? `${emoji} ` : "") +
      labelText.slice(0, Math.max(1, maxCharsAtDynamicFont - 1)) +
      "…"
    : emoji
    ? `${emoji} ${labelText}`
    : labelText;

  return { dynamicFontSize, displayLabelText };
}

export function computeFittedSubText(
  subtitleText: string,
  initialFontSize: number,
  availableWidth: number,
  scaleFactor: number
) {
  let dynamicSubFontSize = initialFontSize;
  if (subtitleText.length > 0) {
    const requiredSubWidth = subtitleText.length * initialFontSize * 0.48;
    if (requiredSubWidth > availableWidth) {
      const calculatedSubFontSize = availableWidth / (subtitleText.length * 0.48);
      const minSubFontSize = Math.max(4.0, 4.5 * Math.min(1, scaleFactor));
      dynamicSubFontSize = Math.min(
        initialFontSize,
        Math.max(minSubFontSize, Math.round(calculatedSubFontSize * 10) / 10)
      );
    }
  }

  const maxFitSubChars = Math.max(
    3,
    Math.floor(availableWidth / (dynamicSubFontSize * 0.48))
  );

  const displaySubText =
    subtitleText.length > maxFitSubChars + 4 && dynamicSubFontSize <= 4.8
      ? subtitleText.slice(0, Math.max(1, maxFitSubChars - 1)) + "…"
      : subtitleText;

  return { dynamicSubFontSize, displaySubText, maxFitSubChars };
}
