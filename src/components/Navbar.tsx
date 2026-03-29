import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const NAV_LINKS = [
  { label: 'About',    href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work',     href: '#work' },
  { label: 'Contact',  href: '#contact' },
];

const HERO_HEIGHT_VH = 200;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden]     = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY             = useRef(0);

  useEffect(() => {
    const heroThreshold = (HERO_HEIGHT_VH / 100) * window.innerHeight;

    const onScroll = () => {
      const y   = window.scrollY;
      const dir = y > lastScrollY.current ? 'down' : 'up';

      setScrolled(y > 56);

      if (y > heroThreshold) {
        if (dir === 'down' && y - lastScrollY.current > 4) setHidden(true);
        else if (dir === 'up') setHidden(false);
      } else {
        setHidden(false);
      }

      lastScrollY.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const overHero = !scrolled;

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: hidden ? '-100%' : '0%' }}
      transition={{
        opacity: { duration: 0.9, delay: 1.8, ease: [0.22, 1, 0.36, 1] },
        y:       { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background:    scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        borderBottom:  scrolled ? '1px solid rgba(197,160,89,0.14)' : '1px solid transparent',
        transition:    'background 0.55s ease, border-color 0.55s ease, backdrop-filter 0.55s ease',
      }}
    >
      <nav className="flex items-center justify-between px-8 md:px-14 py-5">
        <a
          href="#"
          style={{
            fontFamily: 'var(--font-display)', fontWeight: 300,
            fontSize: '1.15rem', letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: overHero ? '#FFFFFF' : 'var(--color-text)',
            transition: 'color 0.45s ease',
          }}
        >GHAIM</a>

        <ul className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <motion.a
                href={link.href}
                style={{
                  fontSize: '0.7rem', letterSpacing: '0.22em',
                  textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 400,
                  color: overHero ? 'rgba(255,255,255,0.75)' : 'var(--color-text-mid)',
                  transition: 'color 0.35s ease', position: 'relative', display: 'inline-block',
                }}
                whileHover={overHero ? { color: '#FFFFFF' } : { color: 'var(--color-text)' }}
              >
                {link.label}
                <motion.span
                  style={{
                    position: 'absolute', bottom: '-2px', left: 0, right: 0,
                    height: '1px', background: 'var(--color-accent-1)',
                    transformOrigin: 'left', scaleX: 0,
                  }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-2 transition-all duration-300"
          style={{
            fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            fontFamily: 'var(--font-body)', fontWeight: 400,
            color: 'var(--color-accent-1)',
            border: `1px solid rgba(197,160,89,${overHero ? '0.55' : '0.45'})`,
            padding: '10px 20px',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background  = 'rgba(197,160,89,0.08)';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(197,160,89,0.85)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background  = 'transparent';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = `rgba(197,160,89,${overHero ? '0.55' : '0.45'})`;
          }}
        >Enquire</a>

        <button
          className="md:hidden flex flex-col gap-1.5 w-6"
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-px transition-all duration-300"
              style={{
                background: overHero ? 'rgba(255,255,255,0.85)' : 'var(--color-text-mid)',
                transform:
                  i === 0 && menuOpen ? 'rotate(45deg) translate(4px,4px)' :
                  i === 2 && menuOpen ? 'rotate(-45deg) translate(4px,-4px)' : 'none',
                opacity: i === 1 && menuOpen ? 0 : 1,
                width:   i === 1 && menuOpen ? '0%' : '100%',
              }}
            />
          ))}
        </button>
      </nav>

      <motion.div
        initial={false}
        animate={{ height: menuOpen ? 'auto' : 0, opacity: menuOpen ? 1 : 0 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="md:hidden overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(197,160,89,0.12)' }}
      >
        <ul className="flex flex-col px-8 py-6 gap-6">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', color: 'var(--color-text-mid)' }}
              >{link.label}</a>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.header>
  );
}