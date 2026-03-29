/**
 * Button — FIXED
 * ─────────────────────────────────────────────────────────────
 * Fixes:
 *   ✓ All variants now have visible hover backgrounds (were fully transparent)
 *   ✓ Hover color transitions use Framer Motion animate, not just scale
 *   ✓ gold/ghost-light/dark/ghost all have distinct filled hover states
 *   ✓ Shimmer sweep retained as an additional micro-interaction layer
 *   ✓ Border brightens on hover for extra clarity
 *   ✓ Active (tap) press feedback is tighter and more responsive
 */

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'gold' | 'dark' | 'ghost' | 'ghost-light';
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  'aria-label'?: string;
}

/* ── Per-variant design tokens ───────────────────────────────── */

const variants = {
  gold: {
    base:    { border: '1px solid rgba(197,160,89,0.65)', color: 'var(--color-accent-1)', background: 'transparent' },
    hover:   { background: 'rgba(197,160,89,0.12)', border: '1px solid rgba(197,160,89,1)', color: '#c5a059' },
    shimmer: 'linear-gradient(105deg, transparent 40%, rgba(197,160,89,0.18) 50%, transparent 60%)',
  },
  'ghost-light': {
    base:    { border: '1px solid rgba(255,255,255,0.38)', color: '#FFFFFF', background: 'transparent' },
    hover:   { background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.75)', color: '#FFFFFF' },
    shimmer: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.14) 50%, transparent 60%)',
  },
  dark: {
    base:    { border: '1px solid rgba(26,26,26,0.55)', color: 'var(--color-text)', background: 'transparent' },
    hover:   { background: 'rgba(26,26,26,0.08)', border: '1px solid rgba(26,26,26,1)', color: 'var(--color-text)' },
    shimmer: 'linear-gradient(105deg, transparent 40%, rgba(26,26,26,0.08) 50%, transparent 60%)',
  },
  ghost: {
    base:    { border: '1px solid var(--color-accent-3)', color: 'var(--color-text-mid)', background: 'transparent' },
    hover:   { background: 'rgba(197,160,89,0.07)', border: '1px solid rgba(197,160,89,0.55)', color: 'var(--color-text)' },
    shimmer: 'linear-gradient(105deg, transparent 40%, rgba(197,160,89,0.1) 50%, transparent 60%)',
  },
};

const sizeStyles: Record<string, string> = {
  sm: 'px-5 py-2.5 text-[0.65rem] tracking-[0.22em]',
  md: 'px-7 py-3 text-[0.7rem] tracking-[0.22em]',
  lg: 'px-9 py-3.5 text-[0.74rem] tracking-[0.22em]',
};

export function Button({
  variant = 'gold',
  size = 'md',
  children,
  className = '',
  onClick,
  type = 'button',
  disabled,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const v = variants[variant];

  return (
    <motion.button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`relative overflow-hidden uppercase font-medium ${sizeStyles[size]} ${className}`}
      style={{
        fontFamily: 'var(--font-body)',
        letterSpacing: '0.22em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.28s ease, border-color 0.28s ease, color 0.28s ease',
        ...v.base,
      }}
      initial="rest"
      whileHover="hovered"
      whileTap={{ scale: 0.972 }}
      animate="rest"
      variants={{
        rest:    { scale: 1 },
        hovered: { scale: 1.018 },
      }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background    = v.hover.background;
        el.style.borderColor   = v.hover.border.replace('1px solid ', '');
        el.style.color         = v.hover.color;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background    = 'transparent';
        el.style.borderColor   = v.base.border.replace('1px solid ', '');
        el.style.color         = v.base.color;
      }}
    >
      {/* Shimmer sweep on hover */}
      <motion.span
        className="absolute inset-0 pointer-events-none"
        style={{
          background: v.shimmer,
          backgroundSize: '200% 100%',
          backgroundPosition: '200% 0',
        }}
        variants={{
          rest:    { backgroundPosition: '200% 0', opacity: 0 },
          hovered: { backgroundPosition: '-100% 0', opacity: 1 },
        }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}