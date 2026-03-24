import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
}

export function Card({ children, className = '', elevated = false }: CardProps) {
  return (
    <motion.div
      className={`
        relative overflow-hidden bg-[var(--color-surface)]
        border border-[var(--color-accent-3)]
        ${elevated ? 'shadow-deep' : 'shadow-light'}
        ${className}
      `}
      whileHover={{
        y: -4,
        boxShadow: '0 12px 32px rgba(0,0,0,0.10)',
      }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
