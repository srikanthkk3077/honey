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
 * Generate a dynamic localized gradient mask derived from the slide background color.
 * Focuses soft, readable contrast behind the left text area while feathering out gracefully
 * to transparent at the top (preserving leaves/sunlight), bottom (preserving table/flowers),
 * and right (revealing mountains, bee, and honey jar).
 */
export const getSlideGradientMask = (bgColor: string): string => {
  const isDark = isDarkColor(bgColor);
  const c96 = colorWithAlpha(bgColor, isDark ? 0.94 : 0.95);
  const c90 = colorWithAlpha(bgColor, isDark ? 0.88 : 0.90);
  const c78 = colorWithAlpha(bgColor, isDark ? 0.74 : 0.78);
  const c50 = colorWithAlpha(bgColor, isDark ? 0.44 : 0.50);
  const c20 = colorWithAlpha(bgColor, isDark ? 0.16 : 0.20);
  const c05 = colorWithAlpha(bgColor, isDark ? 0.04 : 0.05);

  return `
    radial-gradient(ellipse 78% 84% at 16% 50%,
      ${c96} 0%,
      ${c90} 25%,
      ${c78} 45%,
      ${c50} 65%,
      ${c20} 82%,
      ${c05} 92%,
      transparent 100%
    )
  `.trim();
};
