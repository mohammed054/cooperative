import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { brand, caseStudies } from '@/data/site';

type NavItem =
  | { label: string; type: 'hash'; hash: `#${string}` }
  | { label: string; type: 'route'; path: string };

const navItems: NavItem[] = [
  { label: 'Studio', type: 'hash', hash: '#about' },
  { label: 'Work', type: 'hash', hash: '#work' },
  { label: 'Clients', type: 'hash', hash: '#testimonials' },
  { label: 'Projects', type: 'route', path: '/projects' },
];

const logoUrl = `${import.meta.env.BASE_URL}logo.webp`;

function navTarget(item: NavItem) {
  return item.type === 'route' ? item.path : { pathname: '/', hash: item.hash };
}

function DesktopNavLink({ item }: { item: NavItem }) {
  return (
    <Link to={navTarget(item)} className="nav-link">
      {item.label}
    </Link>
  );
}

function WorkPreview() {
  return (
    <motion.div
      className="nav-preview"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="nav-preview__intro">
        <span className="eyebrow">Selected Work</span>
        <p>Private, corporate, and sovereign-scale engagements delivered with one command standard.</p>
      </div>
      <div className="nav-preview__grid">
        {caseStudies.slice(0, 3).map((study) => (
          <Link to={{ pathname: '/', hash: '#work' }} className="nav-preview-card" key={study.id}>
            <img src={study.image} alt="" loading="lazy" />
            <span>{study.category}</span>
            <strong>{study.title}</strong>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mobile-menu__top">
            <Link to="/" className="brand-mark brand-mark--light" onClick={onClose}>
              <img src={logoUrl} alt={brand.name} />
              <span>{brand.name}</span>
            </Link>
            <button type="button" className="icon-button icon-button--light" onClick={onClose} aria-label="Close menu">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M15 3L3 15M3 3l12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="mobile-menu__nav" aria-label="Mobile navigation">
            {navItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.08 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to={navTarget(item)} onClick={onClose}>
                  <span>0{index + 1}</span>
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="mobile-menu__bottom">
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
            <Link to={{ pathname: '/', hash: '#contact' }} onClick={onClose} className="text-cta">
              Request Proposal
              <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden>
                <path d="M1 5h16M12 1l5 4-5 4" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const elevated = location.pathname !== '/' || scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 32);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <motion.header
        className={`site-nav ${elevated ? 'site-nav--elevated' : ''}`}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="site-nav__inner">
          <Link to="/" className={`brand-mark ${elevated ? '' : 'brand-mark--light'}`}>
            <img src={logoUrl} alt={brand.name} />
            <span>{brand.name}</span>
          </Link>

          <nav className="site-nav__links" aria-label="Primary navigation">
            {navItems.map((item) => (
              <span
                key={item.label}
                onMouseEnter={() => setPreviewOpen(item.label === 'Work')}
                onMouseLeave={() => setPreviewOpen(false)}
                onFocus={() => setPreviewOpen(item.label === 'Work')}
              >
                <DesktopNavLink item={item} />
              </span>
            ))}
          </nav>

          <div className="site-nav__actions">
            <Link to={{ pathname: '/', hash: '#contact' }} className="proposal-link">
              Request Proposal
            </Link>
            <button type="button" className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <span />
              <span />
            </button>
          </div>
        </div>

        <AnimatePresence>{previewOpen && <WorkPreview />}</AnimatePresence>
      </motion.header>
    </>
  );
}
