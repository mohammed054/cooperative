import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fadeInUp, fadeIn, staggerContainer } from '@/animations/fadeInUp';
import { Button } from '@/components/Button';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────
   DATA
────────────────────────────────────────────────────────── */

const NAV_GROUPS = [
  {
    label: 'Company',
    links: [
      { label: 'About',        href: '#about'        },
      { label: 'Our Work',     href: '#work'         },
      { label: 'Case Studies', href: '#case-studies'  },
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
      { label: 'Contact',          href: '#contact'       },
      { label: 'Request Proposal', href: '#contact'       },
      { label: 'Testimonials',     href: '#testimonials'  },
    ],
  },
];

const CONTACT_LINES = [
  {
    id: 'email',
    value: 'enquiries@ghaim.ae',
    href: 'mailto:enquiries@ghaim.ae',
    icon: (
      <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden>
        <rect x="0.5" y="0.5" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="0.75" />
        <path d="M1 1l5.5 5L12 1" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'phone',
    value: '+971 4 000 0000',
    href: 'tel:+97140000000',
    icon: (
      <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden>
        <path
          d="M1 1.5C1 1.2 1.2 1 1.5 1h2.1c.25 0 .47.17.52.42l.6 2.7a.54.54 0 01-.25.58L3.3 5.5c.8 1.65 2.05 2.9 3.7 3.7l.79-1.17a.54.54 0 01.58-.25l2.7.6c.25.05.43.27.43.52v2.1c0 .28-.22.5-.5.5C4.25 11.5 1 5.75 1 1.5z"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'address',
    value: 'DIFC, Dubai, UAE',
    href: 'https://maps.google.com',
    icon: (
      <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden>
        <path
          d="M5.5 1C3.01 1 1 3.01 1 5.5 1 8.75 5.5 13 5.5 13S10 8.75 10 5.5C10 3.01 7.99 1 5.5 1z"
          stroke="currentColor"
          strokeWidth="0.75"
        />
        <circle cx="5.5" cy="5.5" r="1.4" stroke="currentColor" strokeWidth="0.75" />
      </svg>
    ),
  },
];

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'X / Twitter',
    href: 'https://x.com',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

/* ──────────────────────────────────────────────────────────
   SUB-COMPONENTS
────────────────────────────────────────────────────────── */

/** Matching eyebrow from all other sections */
function SectionEyebrow({ label }: { label: string }) {
  return (
    <motion.div variants={fadeIn} className="flex items-center gap-4">
      <span
        style={{
          display: 'block',
          height: '1px',
          width: '36px',
          background: 'var(--color-accent-1)',
          opacity: 0.75,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 'var(--fs-xs)',
          letterSpacing: 'var(--ls-widest)',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-body)',
          fontWeight: 400,
          color: 'var(--color-accent-1)',
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

/** Nav link with gold underline scale on hover */
function FooterNavLink({ label, href }: { label: string; href: string }) {
  return (
    <motion.a
      href={href}
      variants={fadeInUp}
      style={{
        position: 'relative',
        display: 'inline-block',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--fs-sm)',
        fontWeight: 300,
        letterSpacing: '0.01em',
        color: 'var(--color-text-mid)',
        width: 'fit-content',
      }}
      whileHover={{ color: 'var(--color-text)', x: 3 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      {label}
      <motion.span
        style={{
          position: 'absolute',
          bottom: '-1px',
          left: 0,
          right: 0,
          height: '1px',
          background: 'var(--color-accent-1)',
          transformOrigin: 'left',
          scaleX: 0,
          opacity: 0.7,
        }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.a>
  );
}

/** Contact line with icon */
function ContactLine({
  icon,
  value,
  href,
}: {
  icon: React.ReactNode;
  value: string;
  href: string;
}) {
  return (
    <motion.a
      href={href}
      variants={fadeInUp}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--fs-sm)',
        fontWeight: 300,
        color: 'var(--color-text-mid)',
        letterSpacing: '0.01em',
        width: 'fit-content',
      }}
      whileHover={{ color: 'var(--color-text)', x: 3 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <span style={{ color: 'var(--color-accent-1)', opacity: 0.7, flexShrink: 0 }}>
        {icon}
      </span>
      {value}
    </motion.a>
  );
}

/** Social icon with gold hover */
function SocialIcon({
  label,
  href,
  icon,
}: {
  label: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        border: '1px solid var(--color-accent-3)',
        color: 'var(--color-text-muted)',
        flexShrink: 0,
      }}
      whileHover={{
        color: 'var(--color-accent-1)',
        borderColor: 'rgba(197,160,89,0.55)',
        y: -3,
        boxShadow: '0 6px 18px rgba(197,160,89,0.1)',
      }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      {icon}
    </motion.a>
  );
}

/** Back-to-top button — fixed, appears after scroll */
function BackToTop({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          style={{
            position: 'fixed',
            bottom: '36px',
            right: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            border: '1px solid rgba(197,160,89,0.4)',
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(12px)',
            color: 'var(--color-accent-1)',
            cursor: 'pointer',
            zIndex: 40,
            boxShadow: 'var(--shadow-medium)',
          }}
          whileHover={{
            borderColor: 'rgba(197,160,89,0.75)',
            y: -3,
            boxShadow: '0 8px 24px rgba(197,160,89,0.15)',
          }}
          whileTap={{ scale: 0.92 }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
            <path
              d="M6.5 11V2M2 6l4.5-4.5L11 6"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════
   FOOTER SECTION
══════════════════════════════════════════════════════════ */

export function Footer() {
  const footerRef    = useRef<HTMLElement>(null);
  const dividerRef   = useRef<HTMLDivElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);
  const columnsRef   = useRef<HTMLDivElement>(null);
  const bottomRef    = useRef<HTMLDivElement>(null);
  const [backToTopVisible, setBackToTopVisible] = useState(false);

  /* Scroll-driven parallax on bg texture */
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '3%']);

  /* Back-to-top visibility */
  useEffect(() => {
    const onScroll = () => {
      setBackToTopVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* GSAP staggered reveals */
  useEffect(() => {
    const ctx = gsap.context(() => {

      /* Divider line draws across */
      if (dividerRef.current) {
        gsap.from(dividerRef.current, {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 1.4,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: dividerRef.current,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        });
      }

      /* CTA block lifts in */
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          opacity: 0,
          y: 32,
          duration: 1.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      /* Nav columns stagger */
      if (columnsRef.current) {
        gsap.from(columnsRef.current.children, {
          opacity: 0,
          y: 24,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: columnsRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      }

      /* Bottom bar fades in last */
      if (bottomRef.current) {
        gsap.from(bottomRef.current, {
          opacity: 0,
          duration: 0.85,
          ease: 'power2.out',
          delay: 0.2,
          scrollTrigger: {
            trigger: bottomRef.current,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        });
      }

    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <footer
        id="footer"
        ref={footerRef}
        style={{
          position: 'relative',
          background: 'var(--color-bg-light)',
          overflow: 'hidden',
          borderTop: '1px solid rgba(197,160,89,0.1)',
        }}
      >

        {/* ── Parallax grid texture ──────────────────────────── */}
        <motion.div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            y: bgY,
            backgroundImage: `
              linear-gradient(rgba(197,160,89,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(197,160,89,0.025) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* ── Very faint upper-right gold bloom ─────────────── */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-100px',
            width: '440px',
            height: '440px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(197,160,89,0.055) 0%, transparent 68%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* ══════════════════════════════════════════════════════
            CONTENT
        ══════════════════════════════════════════════════════ */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            padding:
              'clamp(64px, 8vw, 96px) clamp(32px, 8vw, 96px) 0',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(48px, 6vw, 72px)',
          }}
        >

          {/* ══ CTA BLOCK ═══════════════════════════════════════ */}
          <div
            ref={ctaRef}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '32px',
              textAlign: 'center',
              padding: 'clamp(48px, 6vw, 72px) clamp(20px, 8vw, 120px)',
              border: '1px solid var(--color-accent-3)',
              background: 'var(--color-surface)',
              boxShadow: 'var(--shadow-light)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* CTA gold corner accent — top-left */}
            <svg
              aria-hidden
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: 0.35,
              }}
            >
              <path d="M0 0h48M0 0v48" stroke="var(--color-accent-1)" strokeWidth="1" />
            </svg>
            {/* bottom-right */}
            <svg
              aria-hidden
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                opacity: 0.35,
              }}
            >
              <path d="M48 48H0M48 48V0" stroke="var(--color-accent-1)" strokeWidth="1" />
            </svg>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <SectionEyebrow label="Begin the Conversation" />

              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 3.8rem)',
                  fontWeight: 300,
                  lineHeight: 1.1,
                  letterSpacing: 'var(--ls-tight)',
                  color: 'var(--color-text)',
                  maxWidth: '640px',
                }}
              >
                Ready to Create
                <br />
                Something{' '}
                <em
                  style={{
                    fontStyle: 'italic',
                    color: 'var(--color-accent-1)',
                  }}
                >
                  Unforgettable?
                </em>
              </h2>

              <motion.p
                variants={fadeInUp}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.875rem, 1.1vw, 0.95rem)',
                  fontWeight: 300,
                  lineHeight: 1.78,
                  color: 'var(--color-text-muted)',
                  maxWidth: '420px',
                }}
              >
                Every exceptional event begins with a conversation.
                Share your vision — we will shape it into something
                your guests will speak about for years.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}
              >
                <Button variant="gold" size="lg">
                  Request a Proposal
                </Button>

                <motion.a
                  href="#contact"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.7rem',
                    letterSpacing: 'var(--ls-wider)',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-muted)',
                    fontWeight: 400,
                  }}
                  whileHover={{ x: 4, color: 'var(--color-text)' }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span>Or send a direct enquiry</span>
                  <svg width="18" height="8" viewBox="0 0 18 8" fill="none" aria-hidden>
                    <path
                      d="M1 4h16M12 1l4 3-4 3"
                      stroke="currentColor"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.a>
              </motion.div>
            </motion.div>
          </div>

          {/* ══ DIVIDER ══════════════════════════════════════════ */}
          <div
            ref={dividerRef}
            style={{
              height: '1px',
              background:
                'linear-gradient(to right, transparent, rgba(197,160,89,0.35) 30%, rgba(197,160,89,0.35) 70%, transparent)',
            }}
          />

          {/* ══ MAIN FOOTER COLUMNS ══════════════════════════════ */}
          <div
            ref={columnsRef}
            style={{
              display: 'grid',
              gridTemplateColumns: '1.6fr repeat(3, 1fr) 1fr',
              gap: 'clamp(24px, 4vw, 56px)',
              alignItems: 'start',
            }}
          >

            {/* Column 0 — Logo + tagline + social */}
            <motion.div
              style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
            >
              {/* Logo */}
              <a
                href="#"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 300,
                  fontSize: '1.3rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text)',
                  width: 'fit-content',
                }}
              >
                GHAIM
              </a>

              {/* Gold rule under logo */}
              <div
                style={{
                  width: '40px',
                  height: '1px',
                  background: 'var(--color-accent-1)',
                  opacity: 0.5,
                }}
              />

              {/* Tagline */}
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 'var(--fs-md)',
                  lineHeight: 1.5,
                  letterSpacing: '0.01em',
                  color: 'var(--color-text-mid)',
                  maxWidth: '200px',
                }}
              >
                Where vision meets flawless execution.
              </p>

              {/* Social icons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {SOCIAL_LINKS.map((s) => (
                  <SocialIcon key={s.label} {...s} />
                ))}
              </div>
            </motion.div>

            {/* Columns 1–3 — Nav groups */}
            {NAV_GROUPS.map((group) => (
              <motion.div
                key={group.label}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--fs-xs)',
                    letterSpacing: 'var(--ls-widest)',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    paddingBottom: '6px',
                    borderBottom: '1px solid var(--color-accent-3)',
                  }}
                >
                  {group.label}
                </span>

                <motion.nav
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
                  aria-label={`${group.label} navigation`}
                >
                  {group.links.map((link) => (
                    <FooterNavLink key={link.label} {...link} />
                  ))}
                </motion.nav>
              </motion.div>
            ))}

            {/* Column 4 — Contact info */}
            <motion.div
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--fs-xs)',
                  letterSpacing: 'var(--ls-widest)',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  color: 'var(--color-text)',
                  paddingBottom: '6px',
                  borderBottom: '1px solid var(--color-accent-3)',
                }}
              >
                Contact
              </span>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                {CONTACT_LINES.map((c) => (
                  <ContactLine key={c.id} {...c} />
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* ══ BOTTOM BAR ═══════════════════════════════════════ */}
          <div
            ref={bottomRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              padding: 'clamp(20px, 3vw, 28px) 0',
              borderTop: '1px solid var(--color-accent-3)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--fs-xs)',
                fontWeight: 300,
                letterSpacing: '0.02em',
                color: 'var(--color-text-muted)',
              }}
            >
              © {new Date().getFullYear()} GHAIM Events. All rights reserved.
            </span>

            {/* Legal links */}
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Privacy Policy', 'Terms of Service'].map((label) => (
                <motion.a
                  key={label}
                  href="#"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--fs-xs)',
                    fontWeight: 300,
                    letterSpacing: '0.01em',
                    color: 'var(--color-text-muted)',
                  }}
                  whileHover={{ color: 'var(--color-accent-1)' }}
                  transition={{ duration: 0.2 }}
                >
                  {label}
                </motion.a>
              ))}
            </div>

            {/* Registered in UAE */}
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--fs-xs)',
                fontWeight: 300,
                letterSpacing: 'var(--ls-wide)',
                color: 'var(--color-accent-1)',
                opacity: 0.65,
                textTransform: 'uppercase',
              }}
            >
              Registered · Dubai, UAE
            </span>
          </div>

        </div>
      </footer>

      {/* ── Fixed back-to-top ─────────────────────────────── */}
      <BackToTop visible={backToTopVisible} />
    </>
  );
}