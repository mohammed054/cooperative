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

const variantStyles: Record<string, string> = {
  gold:        'border border-[var(--color-accent-1)] text-[var(--color-accent-1)] bg-transparent',
  dark:        'border border-[var(--color-text)] text-[var(--color-text)] bg-transparent',
  ghost:       'border border-[var(--color-accent-2)] text-[var(--color-text-mid)] bg-transparent',
  'ghost-light': 'border border-white/40 text-white bg-transparent',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-6 py-2.5 text-[0.68rem] tracking-[0.22em]',
  md: 'px-8 py-3.5 text-[0.72rem] tracking-[0.22em]',
  lg: 'px-10 py-4   text-[0.76rem] tracking-[0.22em]',
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
  return (
    <motion.button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`
        relative overflow-hidden uppercase font-medium
        transition-colors duration-300
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      whileHover={{ scale: 1.018 }}
      whileTap={{ scale: 0.982 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Shimmer sweep on hover */}
      <motion.span
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(105deg, transparent 40%, rgba(197,160,89,0.10) 50%, transparent 60%)',
          backgroundSize: '200% 100%',
          backgroundPosition: '200% 0',
        }}
        whileHover={{ backgroundPosition: '-100% 0' }}
        transition={{ duration: 0.5 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
