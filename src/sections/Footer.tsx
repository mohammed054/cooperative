import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { brand } from '@/data/site';

const logoUrl = `${import.meta.env.BASE_URL}logo.webp`;

const footerLinks = [
  { label: 'Studio', to: { pathname: '/', hash: '#about' } },
  { label: 'Operating System', to: { pathname: '/', hash: '#system' } },
  { label: 'Selected Work', to: { pathname: '/', hash: '#work' } },
  { label: 'Client Trust', to: { pathname: '/', hash: '#testimonials' } },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: { pathname: '/', hash: '#contact' } },
];

const footerSignals = [
  { value: '01', label: 'Senior owner' },
  { value: '1 day', label: 'Briefing response' },
  { value: 'DIFC', label: 'Dubai command' },
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
        <div className="page-gutter footer-cta">
          <div className="footer-cta__copy">
            <span>Private briefing desk</span>
            <h2>When the room matters, the operating layer matters more.</h2>
          </div>
          <div className="footer-cta__action">
            <div className="footer-cta__proof" aria-label="Briefing signals">
              {footerSignals.map((signal) => (
                <span key={signal.label}>
                  <strong>{signal.value}</strong>
                  <small>{signal.label}</small>
                </span>
              ))}
            </div>
            <Link to={{ pathname: '/', hash: '#contact' }} className="button button--gold">
              Start a Brief
            </Link>
          </div>
        </div>

        <div className="page-gutter site-footer__inner">
          <div className="site-footer__brand">
            <Link to="/" className="brand-mark">
              <img src={logoUrl} alt={brand.name} />
              <span>{brand.name}</span>
            </Link>
            <p>{brand.tagline}. Built for rooms where every guest, route, and minute matters.</p>
            <div className="site-footer__seal">
              <span>Private Event Command</span>
              <strong>GHAIM</strong>
              <small>Protocol / Production / Hospitality</small>
            </div>
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
            <a href={`tel:${brand.tel}`}>{brand.phone}</a>
            <small>{brand.address}</small>
          </div>
        </div>

        <div className="page-gutter site-footer__bottom">
          <span>Copyright {new Date().getFullYear()} GHAIM Events. All rights reserved.</span>
          <span>Registered in Dubai, UAE</span>
        </div>
      </footer>
      <BackToTop visible={backToTopVisible} />
    </>
  );
}
