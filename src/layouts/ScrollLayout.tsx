import type { ReactNode } from 'react';

interface ScrollLayoutProps {
  children: ReactNode;
}

/**
 * Root scroll container.
 * Houses the full-page smooth-scroll scaffold.
 * GSAP ScrollTrigger attaches to window by default,
 * so no custom scroller is needed here unless Lenis is added later.
 */
export function ScrollLayout({ children }: ScrollLayoutProps) {
  return (
    <div
      id="scroll-root"
      className="relative w-full overflow-x-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      {children}
    </div>
  );
}
