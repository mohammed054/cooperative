/**
 * Shared constants for responsive behavior across components.
 * These values should be used consistently between JS and CSS.
 */

/**
 * Mobile breakpoint in pixels.
 * - Viewports < 768px: Mobile layout (no pinning, free-flow scroll)
 * - Viewports >= 768px: Desktop layout (pinning enabled)
 * 
 * This aligns with Tailwind's `md` breakpoint and CSS media queries.
 */
export const MOBILE_BREAKPOINT = 768; // px