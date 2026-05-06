import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { brand } from '@/data/site';

const logoUrl = `${import.meta.env.BASE_URL}logo.webp`;

const footerLinks = [
  { label: 'Studio', to: { pathname: '/', hash: '#about' } },
  { label: 'Selected Work', to: { pathname: '/', hash: '#work' } },
  { label: 'Client Trust', to: { pathname: '/', hash: '#testimonials' } },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: { pathname: '/', hash: '#contact' } },
];

function BackToTop({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          className="back-to-top"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export function Footer() {
  const [backToTopVisible, setBackToTopVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setBackToTopVisible(window.scrollY > window.innerHeight);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <footer className="site-footer">
        <div className="page-gutter site-footer__inner">
          <div className="site-footer__brand">
            <Link to="/" className="brand-mark">
              <img src={logoUrl} alt={brand.name} />
              <span>{brand.name}</span>
            </Link>
            <p>{brand.tagline}. Built for rooms where every guest, route, and minute matters.</p>
          </div>

          <nav className="site-footer__nav" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link key={link.label} to={link.to}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="site-footer__contact">
            <span>Private briefing</span>
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
            <a href="tel:+97140000000">{brand.phone}</a>
            <small>{brand.address}</small>
          </div>
        </div>

        <div className="page-gutter site-footer__bottom">
          <span>© {new Date().getFullYear()} GHAIM Events. All rights reserved.</span>
          <span>Registered · Dubai, UAE</span>
        </div>
      </footer>
      <BackToTop visible={backToTopVisible} />
    </>
  );
}
