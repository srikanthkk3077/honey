/**
 * Color utility helpers for dynamic hero banners and theme adaptation
 */

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Parse any CSS color (hex3, hex6, hex8, rgb, rgba) into { r, g, b }
 */
export const parseColor = (color: string): RgbColor => {
  if (!color || typeof color !== 'string') {
    return { r: 253, g: 220, b: 195 }; // Default peach cream
  }

  const clean = color.trim().toLowerCase();

  // Named color quick map for common defaults
  if (clean === 'white') return { r: 255, g: 255, b: 255 };
  if (clean === 'black') return { r: 0, g: 0, b: 0 };
  if (clean === 'transparent') return { r: 0, g: 0, b: 0 };

  // Hex: #fff or #ffffff or #ffffffff
  if (clean.startsWith('#')) {
    let hex = clean.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .split('')
        .slice(0, 3)
        .map((c) => c + c)
        .join('');
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        return { r, g, b };
      }
    }
  }

  // RGB/RGBA: rgb(253, 220, 195)
  const rgbMatch = clean.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
      return { r, g, b };
    }
  }

  return { r: 253, g: 220, b: 195 };
};

/**
 * Return an rgba(...) string with specified alpha (0 to 1)
 */
export const colorWithAlpha = (color: string, alpha: number): string => {
  const { r, g, b } = parseColor(color);
  const clampedAlpha = Math.max(0, Math.min(1, alpha));
  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
};

/**
 * Determine if a background color is dark based on ITU-R BT.601 perceived luminance
 */
export const isDarkColor = (color: string): boolean => {
  const { r, g, b } = parseColor(color);
  // Perceived brightness formula
  const luminance = (r * 299 + g * 587 + b * 114) / 1000;
  return luminance < 140; // < 140 out of 255 is dark
};

/**
 * Generate a dynamic left-to-right gradient blend mask derived entirely from the given background color.
 * The left edge perfectly matches the solid background, feathering gracefully into transparency over the cover image.
 */
export const getSlideGradientMask = (bgColor: string): string => {
  const c100 = colorWithAlpha(bgColor, 1.0);
  const c96 = colorWithAlpha(bgColor, 0.96);
  const c84 = colorWithAlpha(bgColor, 0.84);
  const c55 = colorWithAlpha(bgColor, 0.55);
  const c24 = colorWithAlpha(bgColor, 0.24);
  const c06 = colorWithAlpha(bgColor, 0.06);

  return `
    linear-gradient(to right,
      ${c100} 0%,
      ${c96} 14%,
      ${c84} 28%,
      ${c55} 46%,
      ${c24} 66%,
      ${c06} 82%,
      transparent 94%
    )
  `.trim();
};
