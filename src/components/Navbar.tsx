/**
 * Navbar — FIXED
 * ─────────────────────────────────────────────────────────────
 * FIX: Hamburger menu was visible on desktop.
 *   Root cause: Tailwind 'lg:hidden' might not compile if content path
 *   is misconfigured. Added explicit CSS class 'nav-hamburger' with
 *   a media query in this component to guarantee correct behavior.
 *
 * FIX: Desktop nav items ('nav-desktop') also have explicit media query.
 *   Prevents dual-display if Tailwind classes fail.
 *
 * No design changes — purely a visibility fix.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Dropdown data ──────────────────────────────────────────── */

const NAV_ITEMS = [
  {
    label: 'Services', href: '#services', hasDropdown: true,
    dropdown: {
      heading: 'What We Do',
      description: 'End-to-end production for events that demand the extraordinary.',
      links: [
        { label: 'Event Production',   sub: 'Full-spectrum management',      href: '#services' },
        { label: 'Corporate Retreats', sub: 'Executive-level experiences',   href: '#services' },
        { label: 'Gala & Ceremonies',  sub: 'Prestige celebrations',         href: '#services' },
        { label: 'Investor Forums',    sub: 'High-stakes convening',         href: '#services' },
        { label: 'Brand Activations',  sub: 'Immersive brand experiences',   href: '#services' },
        { label: 'Summit & Retreats',  sub: 'Thought leadership platforms',  href: '#services' },
      ],
    },
  },
  {
    label: 'Work', href: '#work', hasDropdown: true,
    dropdown: {
      heading: 'Selected Projects',
      description: 'A curated portfolio across six continents.',
      links: [
        { label: 'All Projects',       sub: 'View full portfolio',           href: '#work' },
        { label: 'Corporate',          sub: 'Retreats & investor forums',    href: '#work' },
        { label: 'Galas & Awards',     sub: 'Landmark ceremony events',      href: '#work' },
        { label: 'Weddings',           sub: 'Luxury private celebrations',   href: '#work' },
        { label: 'Brand & Activation', sub: 'Experiential campaigns',        href: '#work' },
      ],
    },
  },
  { label: 'Process', href: '#process', hasDropdown: false },
  {
    label: 'Company', href: '#about', hasDropdown: true,
    dropdown: {
      heading: 'About GHAIM',
      description: 'Twelve years. Six continents. One standard: extraordinary.',
      links: [
        { label: 'Our Story',    sub: 'Where it all began',           href: '#about' },
        { label: 'Our Team',     sub: 'The people behind the events', href: '#about' },
        { label: 'Testimonials', sub: 'Words from our clients',       href: '#testimonials' },
        { label: 'Press & Media',sub: 'Coverage and mentions',        href: '#about' },
      ],
    },
  },
  { label: 'Pricing', href: '#pricing', hasDropdown: false },
] as const;

/* ── Chevron ─────────────────────────────────────────────────── */

function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="8" height="5" viewBox="0 0 8 5" fill="none"
      style={{ transition: 'transform 0.28s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
      <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Mega Dropdown ──────────────────────────────────────────── */

function MegaDropdown({ item }: { item: (typeof NAV_ITEMS)[number] & { hasDropdown: true } }) {
  const { dropdown } = item;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'absolute', top: 'calc(100% + 16px)', left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(197,160,89,0.14)',
        boxShadow: '0 24px 56px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
        minWidth: '480px', padding: '32px 36px', zIndex: 100,
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.5), transparent)' }} />
      <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(197,160,89,0.1)' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--color-accent-1)', display: 'block', marginBottom: '6px' }}>
          {dropdown.heading}
        </span>
        <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
          {dropdown.description}
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
        {'links' in dropdown && dropdown.links.map((link) => (
          <a key={link.label} href={link.href}
            style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '10px 12px', textDecoration: 'none', transition: 'background 0.2s ease' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(197,160,89,0.05)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text)', letterSpacing: '0.01em' }}>{link.label}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 300, color: 'var(--color-text-muted)' }}>{link.sub}</span>
          </a>
        ))}
      </div>
      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(197,160,89,0.1)', display: 'flex', justifyContent: 'flex-end' }}>
        <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-body)', fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-accent-1)', fontWeight: 500 }}>
          Enquire Now
          <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
            <path d="M1 4h14M10 1l4 3-4 3" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </motion.div>
  );
}

/* ── Mobile Overlay ─────────────────────────────────────────── */

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'fixed', inset: 0, zIndex: 998, background: '#070605', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ padding: '22px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(197,160,89,0.1)' }}>
            <a href="#" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src="/logo.webp" alt="GHAIM" style={{ width: '32px', height: 'auto' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '1rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>GHAIM</span>
            </a>
            <button onClick={onClose} aria-label="Close menu"
              style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', background: 'none', border: '1px solid rgba(197,160,89,0.2)', cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M13 1L1 13M1 1l12 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 40px' }}>
            {NAV_ITEMS.map((item, i) => (
              <motion.a key={item.label} href={item.href} onClick={onClose}
                initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(2rem,5vw,3rem)', letterSpacing: '-0.015em', lineHeight: 1.2, color: 'rgba(248,244,238,0.85)', padding: '16px 0', borderBottom: '1px solid rgba(197,160,89,0.08)', textDecoration: 'none' }}>
                {item.label}
              </motion.a>
            ))}
          </nav>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ padding: '32px 40px', borderTop: '1px solid rgba(197,160,89,0.1)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a href="mailto:enquiries@ghaim.ae" style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em' }}>
              enquiries@ghaim.ae
            </a>
            <a href="#contact" onClick={onClose}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-body)', fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-accent-1)', fontWeight: 500, marginTop: '8px' }}>
              Begin the Conversation
              <svg width="18" height="8" viewBox="0 0 18 8" fill="none">
                <path d="M1 4h16M11 1l4 3-4 3" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════════════ */

export function Navbar() {
  const [scrolled,       setScrolled]       = useState(false);
  const [hidden,         setHidden]         = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const lastScrollY = useRef(0);
  const hideTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const y   = window.scrollY;
      const dir = y > lastScrollY.current ? 'down' : 'up';
      setScrolled(y > 60);
      if (dir === 'down' && y - lastScrollY.current > 6 && y > window.innerHeight * 0.7) {
        setHidden(true);
      } else if (dir === 'up') {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openDropdown  = useCallback((label: string) => { if (hideTimer.current) clearTimeout(hideTimer.current); setActiveDropdown(label); }, []);
  const closeDropdown = useCallback(() => { hideTimer.current = setTimeout(() => setActiveDropdown(null), 120); }, []);
  const stayOpen      = useCallback(() => { if (hideTimer.current) clearTimeout(hideTimer.current); }, []);
  useEffect(() => () => { if (hideTimer.current) clearTimeout(hideTimer.current); }, []);

  return (
    <>
      {/* Explicit responsive CSS — Tailwind backup */}
      <style>{`
        .nav-hamburger { display: flex !important; }
        .nav-desktop   { display: none !important; }

        @media (min-width: 1024px) {
          .nav-hamburger { display: none !important; }
          .nav-desktop   { display: flex !important; }
        }
      `}</style>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: hidden ? '-100%' : '0%' }}
        transition={{
          opacity: { duration: 0.9, delay: 2.8, ease: [0.22, 1, 0.36, 1] },
          y:       { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background:           scrolled ? 'rgba(7,6,5,0.82)' : 'transparent',
          backdropFilter:       scrolled ? 'blur(20px) saturate(1.6)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.6)' : 'none',
          borderBottom:         scrolled ? '1px solid rgba(197,160,89,0.10)' : '1px solid transparent',
          transition:           'background 0.55s ease, border-color 0.55s ease, backdrop-filter 0.55s ease',
        }}
      >
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 clamp(20px, 4vw, 56px)', height: '70px',
          maxWidth: '1600px', margin: '0 auto',
        }}>

          {/* ── Logo ───────────────────────────── */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, textDecoration: 'none' }}>
            <img src="/logo.webp" alt="GHAIM" style={{
              height: '36px', width: 'auto', objectFit: 'contain',
              filter: 'brightness(0) invert(1)', transition: 'filter 0.45s ease',
            }} />
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '0.9rem',
              letterSpacing: '0.36em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.92)', transition: 'color 0.45s ease',
            }}>GHAIM</span>
          </a>

          {/* ── Desktop Nav — FIXED: uses .nav-desktop class ── */}
          <ul
            className="nav-desktop items-center"
            style={{ gap: 'clamp(24px,3vw,40px)', listStyle: 'none', margin: 0, padding: 0 }}
          >
            {NAV_ITEMS.map((item) => (
              <li key={item.label} style={{ position: 'relative' }}
                onMouseEnter={() => item.hasDropdown && openDropdown(item.label)}
                onMouseLeave={() => item.hasDropdown && closeDropdown()}
              >
                <a href={item.href} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)', fontWeight: 500,
                  color: activeDropdown === item.label ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.62)',
                  transition: 'color 0.28s ease', position: 'relative', paddingBottom: '4px',
                }}>
                  {item.label}
                  {item.hasDropdown && <Chevron open={activeDropdown === item.label} />}
                  <motion.span
                    style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      height: '1px', background: 'var(--color-accent-1)', transformOrigin: 'left',
                      scaleX: activeDropdown === item.label ? 1 : 0,
                    }}
                    animate={{ scaleX: activeDropdown === item.label ? 1 : 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  />
                </a>
                <AnimatePresence>
                  {item.hasDropdown && activeDropdown === item.label && (
                    <div onMouseEnter={stayOpen} onMouseLeave={closeDropdown}>
                      <MegaDropdown item={item as any} />
                    </div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>

          {/* ── Desktop Right Controls — .nav-desktop ─── */}
          <div className="nav-desktop items-center gap-5" style={{ flexShrink: 0 }}>
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.18)', transition: 'background 0.45s ease' }} />
            <a href="#contact"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '9px 20px', border: '1px solid rgba(197,160,89,0.50)',
                fontFamily: 'var(--font-body)', fontSize: '0.62rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', fontWeight: 500, color: 'var(--color-accent-1)',
                transition: 'background 0.28s ease, border-color 0.28s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(197,160,89,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(197,160,89,0.8)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(197,160,89,0.50)'; }}
            >
              Contact
              <svg width="14" height="7" viewBox="0 0 14 7" fill="none">
                <path d="M1 3.5h12M9 1l3 2.5L9 6" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* ── Mobile Hamburger — FIXED: uses .nav-hamburger class ── */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px', flexDirection: 'column', gap: '5px',
            }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                display: 'block',
                width:   i === 1 ? '18px' : '24px',
                height:  '1px',
                background: 'rgba(255,255,255,0.78)',
                transition: 'background 0.35s ease',
              }} />
            ))}
          </button>

        </nav>
      </motion.header>
    </>
  );
}
