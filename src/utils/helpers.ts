/**
 * cn — Lightweight className merger.
 * Joins truthy strings; strips falsy values.
 * Replace with `clsx` + `tailwind-merge` in production if needed.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * clamp — Numeric clamp utility.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * mapRange — Maps a value from one range to another.
 * Useful for scroll-driven calculations.
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

/**
 * lerp — Linear interpolation.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
