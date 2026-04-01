/**
 * Footer — BACK-TO-TOP DARK + VISIBILITY FIX
 * ─────────────────────────────────────────────────────────────
 * FIX 1 — BACK TO TOP BUTTON CONTRAST:
 *   Was: rgba(255,255,255,0.94) — WHITE background — invisible over light sections,
 *        looks jarring on dark sections (Statement).
 *   Fix: rgba(20,18,16,0.92) — DARK obsidian background with gold arrow.
 *        Reads clearly on BOTH light (cream) and dark sections.
 *        Matches the brand's dark/gold authority palette.
 *
 * FIX 2 — FOOTER VISIBILITY:
 *   Was: GSAP `gsap.from(...)` with `toggleActions: 'play none none none'`.
 *        If ScrollTrigger didn't fire (measured at wrong position), content
 *        stayed at opacity:0 permanently.
 *   Fix: Replaced GSAP footer animations with Framer Motion `whileInView`.
 *        `whileInView` is viewport-observer based — reliable regardless of
 *        ScrollTrigger refresh timing. `once: true` preserves performance.
 *
 * All existing design preserved: grid layout, nav groups, contact, social.
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/animations/fadeInUp';
import { BASE_PATH } from '@/utils/basePath';

const NAV_GROUPS = [
  {
    label: 'Company',
    links: [
      { label: 'About',    href: '#about' },
      { label: 'Our Work', href: '#work' },
      { label: 'Process',  href: '#process' },
    ],
  },
  {
    label: 'Services',
    links: [
      { label: 'Corporate Events',  href: '#services' },
      { label: 'Investor Forums',   href: '#services' },
      { label: 'Summit & Retreats', href: '#services' },
      { label: 'Gala & Ceremonies', href: '#services' },
    ],
  },
  {
    label: 'Connect',
    links: [
      { label: 'Contact',          href: '#contact' },
      { label: 'Request Proposal', href: '#contact' },
      { label: 'Testimonials',     href: '#testimonials' },
    ],
  },
];

const CONTACT_LINES = [
  {
    id: 'email', value: 'enquiries@ghaim.ae', href: 'mailto:enquiries@ghaim.ae',
    icon: (
      <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden>
        <rect x="0.5" y="0.5" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="0.75" />
        <path d="M1 1l5.5 5L12 1" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'phone', value: '+971 4 000 0000', href: 'tel:+97140000000',
    icon: (
      <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden>
        <path d="M1 1.5C1 1.2 1.2 1 1.5 1h2.1c.25 0 .47.17.52.42l.6 2.7a.54.54 0 01-.25.58L3.3 5.5c.8 1.65 2.05 2.9 3.7 3.7l.79-1.17a.54.54 0 01.58-.25l2.7.6c.25.05.43.27.43.52v2.1c0 .28-.22.5-.5.5C4.25 11.5 1 5.75 1 1.5z" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'address', value: 'DIFC, Dubai, UAE', href: 'https://maps.google.com',
    icon: (
      <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden>
        <path d="M5.5 1C3.01 1 1 3.01 1 5.5 1 8.75 5.5 13 5.5 13S10 8.75 10 5.5C10 3.01 7.99 1 5.5 1z" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="5.5" cy="5.5" r="1.4" stroke="currentColor" strokeWidth="0.75" />
      </svg>
    ),
  },
];

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn', href: 'https://linkedin.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: 'Instagram', href: 'https://instagram.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'X / Twitter', href: 'https://x.com',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231z" fill="currentColor" />
      </svg>
    ),
  },
];

function FooterNavLink({ label, href }: { label: string; href: string }) {
  return (
    <motion.a
      href={href}
      variants={fadeInUp}
      style={{ position: 'relative', display: 'inline-block', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-sm)', fontWeight: 300, letterSpacing: '0.01em', color: 'var(--color-text-mid)', width: 'fit-content' }}
      whileHover={{ color: 'var(--color-text)', x: 3 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      {label}
      <motion.span style={{ position: 'absolute', bottom: '-1px', left: 0, right: 0, height: '1px', background: 'var(--color-accent-1)', transformOrigin: 'left', scaleX: 0, opacity: 0.7 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} />
    </motion.a>
  );
}

function ContactLine({ icon, value, href }: { icon: React.ReactNode; value: string; href: string }) {
  return (
    <motion.a
      href={href}
      variants={fadeInUp}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-sm)', fontWeight: 300, color: 'var(--color-text-mid)', letterSpacing: '0.01em', width: 'fit-content' }}
      whileHover={{ color: 'var(--color-text)', x: 3 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <span style={{ color: 'var(--color-accent-1)', opacity: 0.7, flexShrink: 0 }}>{icon}</span>
      {value}
    </motion.a>
  );
}

function SocialIcon({ label, href, icon }: { label: string; href: string; icon: React.ReactNode }) {
  return (
    <motion.a
      href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', border: '1px solid var(--color-accent-3)', color: 'var(--color-text-muted)', flexShrink: 0 }}
      whileHover={{ color: 'var(--color-accent-1)', borderColor: 'rgba(197,160,89,0.55)', y: -3, boxShadow: '0 6px 18px rgba(197,160,89,0.1)' }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      {icon}
    </motion.a>
  );
}

/**
 * Back To Top — FIXED CONTRAST
 *
 * Dark obsidian background works on BOTH light cream sections and dark sections.
 * Gold arrow + gold border = on-brand authority.
 * White background was invisible against the cream body.
 */
function BackToTop({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          style={{
            position: 'fixed', bottom: '32px', right: '24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '44px', height: '44px',
            /* FIX: dark obsidian — visible on both cream AND dark sections */
            background: 'rgba(20,18,16,0.92)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(197,160,89,0.40)',
            color: 'var(--color-accent-1)',
            cursor: 'pointer', zIndex: 40,
            boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
          }}
          whileHover={{ borderColor: 'rgba(197,160,89,0.75)', y: -3, boxShadow: '0 8px 24px rgba(197,160,89,0.18)' }}
          whileTap={{ scale: 0.92 }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
            <path d="M6.5 11V2M2 6l4.5-4.5L11 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export function Footer() {
  const [backToTopVisible, setBackToTopVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setBackToTopVisible(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <footer
        id="footer"
        style={{ position: 'relative', background: 'var(--color-bg)', overflow: 'hidden', borderTop: '1px solid rgba(197,160,89,0.1)' }}
      >
        {/* Gold bloom bg ornament */}
        <div aria-hidden style={{ position: 'absolute', top: '-80px', right: '-100px', width: '440px', height: '440px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(197,160,89,0.04) 0%, transparent 68%)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(56px, 7vw, 88px) clamp(20px, 5vw, 80px) 0', display: 'flex', flexDirection: 'column', gap: 'clamp(40px, 5vw, 64px)' }}>

          {/* Divider — animated via Framer whileInView (reliable vs GSAP ScrollTrigger) */}
          <motion.div
            initial={{ scaleX: 0, transformOrigin: 'left' }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.35) 30%, rgba(197,160,89,0.35) 70%, transparent)' }}
          />

          {/* Main columns */}
          <motion.div
            className="footer-columns-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.09 } },
            }}
          >
            {/* Logo column */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }}
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', width: 'fit-content' }}>
                <img src={`${BASE_PATH}logo.webp`} alt="GHAIM" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '0.95rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--color-text)' }}>GHAIM</span>
              </a>
              <div style={{ width: '36px', height: '1px', background: 'var(--color-accent-1)', opacity: 0.5 }} />
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'var(--fs-md)', lineHeight: 1.55, letterSpacing: '0.01em', color: 'var(--color-text-mid)', maxWidth: '200px' }}>
                Where vision meets flawless execution.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {SOCIAL_LINKS.map((s) => <SocialIcon key={s.label} {...s} />)}
              </div>
            </motion.div>

            {/* Nav groups */}
            {NAV_GROUPS.map((group) => (
              <motion.div
                key={group.label}
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }}
                style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
              >
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-xs)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', fontWeight: 500, color: 'var(--color-text)', paddingBottom: '6px', borderBottom: '1px solid var(--color-accent-3)' }}>
                  {group.label}
                </span>
                <motion.nav
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                  aria-label={`${group.label} navigation`}
                >
                  {group.links.map((link) => <FooterNavLink key={link.label} {...link} />)}
                </motion.nav>
              </motion.div>
            ))}

            {/* Contact column */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }}
              style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
            >
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-xs)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', fontWeight: 500, color: 'var(--color-text)', paddingBottom: '6px', borderBottom: '1px solid var(--color-accent-3)' }}>
                Contact
              </span>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                {CONTACT_LINES.map((c) => <ContactLine key={c.id} {...c} />)}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Bottom bar */}
          <motion.div
            className="footer-bottom-bar"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-xs)', fontWeight: 300, letterSpacing: '0.02em', color: 'var(--color-text-muted)' }}>
              © {new Date().getFullYear()} GHAIM Events. All rights reserved.
            </span>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {['Privacy Policy', 'Terms of Service'].map((label) => (
                <motion.a key={label} href="#"
                  style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-xs)', fontWeight: 300, letterSpacing: '0.01em', color: 'var(--color-text-muted)' }}
                  whileHover={{ color: 'var(--color-accent-1)' }} transition={{ duration: 0.2 }}
                >
                  {label}
                </motion.a>
              ))}
            </div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-xs)', fontWeight: 300, letterSpacing: 'var(--ls-wide)', color: 'var(--color-accent-1)', opacity: 0.65, textTransform: 'uppercase' }}>
              Registered · Dubai, UAE
            </span>
          </motion.div>
        </div>

        <style>{`
          .footer-columns-grid {
            display: grid;
            gap: clamp(28px, 4vw, 48px);
            align-items: start;
            grid-template-columns: 1fr 1fr;
          }
          @media (min-width: 768px) {
            .footer-columns-grid { grid-template-columns: 1.5fr repeat(3, 1fr) 1.2fr; }
          }
          @media (max-width: 480px) {
            .footer-columns-grid { grid-template-columns: 1fr; }
          }
          .footer-bottom-bar {
            display: flex; align-items: center; justify-content: space-between;
            flex-wrap: wrap; gap: 14px;
            padding: clamp(18px, 2.5vw, 26px) 0;
            border-top: 1px solid var(--color-accent-3);
          }
          @media (max-width: 640px) {
            .footer-bottom-bar { flex-direction: column; align-items: flex-start; }
          }
        `}</style>
      </footer>

      <BackToTop visible={backToTopVisible} />
    </>
  );
}