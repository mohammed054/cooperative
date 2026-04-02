/**
 * Contact — Scene 6 · REBUILT
 * ─────────────────────────────────────────────────────────────
 * Three new things vs the previous version:
 *
 * 1. SCROLL-LOCK / PIN:
 *    GSAP pins the section for 400px of scroll as the user
 *    arrives. During this locked window, the content fades in
 *    with staggered whileInView animations. After 400px the pin
 *    releases and the user scrolls naturally to footer.
 *    Using `anticipatePin:1` avoids the "jump" artefact.
 *
 * 2. CREAM → DARK FADE BRIDGE:
 *    A gradient overlay is placed at the very top of the section,
 *    spanning 120px, going from var(--color-bg) (cream) → transparent.
 *    As the dark section scrolls up into view, it appears to
 *    emerge from the cream testimonials section — a seamless
 *    colour transition rather than a hard cut.
 *    z-index is above the section background but below the content.
 *
 * 3. Design & form preserved exactly.
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function fadeUp(delay = 0) {
  return {
    initial:     { opacity: 0, y: 36, filter: 'blur(6px)' },
    whileInView: { opacity: 1, y: 0,  filter: 'blur(0px)' },
    viewport:    { once: true, amount: 0.15 },
    transition:  { duration: 1.0, ease: EASE, delay },
  } as const;
}

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [focused, setFocused] = useState(false);

  /* ── GSAP scroll-lock pin ─────────────────────────────────── */
  useEffect(() => {
    if (!sectionRef.current) return;

    const st = ScrollTrigger.create({
      trigger:      sectionRef.current,
      pin:          sectionRef.current,
      start:        'top top',
      end:          '+=420',          // hold for 420px of scroll
      pinSpacing:   true,
      anticipatePin: 1,
    });

    return () => st.kill();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        position: 'relative',
        background: '#070605',
        borderTop: 'none',          /* gradient bridge covers the seam */
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* ── CREAM → DARK FADE BRIDGE ──────────────────────────
       *  This gradient sits at the VERY TOP of the dark section.
       *  It transitions from var(--color-bg) (cream) down to
       *  transparent — hiding the hard edge between sections.
       *  Height: 120px. Pointer-events: none. z-index: 2.
       * ─────────────────────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position:       'absolute',
          top:            0,
          left:           0,
          right:          0,
          height:         '120px',
          background:     'linear-gradient(to bottom, var(--color-bg) 0%, transparent 100%)',
          pointerEvents:  'none',
          zIndex:         2,
        }}
      />

      {/* Atmospheric radial glow */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          radial-gradient(ellipse 90% 60% at 50% 50%, rgba(197,160,89,0.05) 0%, transparent 65%),
          radial-gradient(ellipse 45% 35% at 20% 90%, rgba(197,160,89,0.03) 0%, transparent 55%)
        `,
      }} />

      {/* Fine gold grid lines */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(197,160,89,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(197,160,89,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
      }} />

      {/* Corner brackets */}
      {[
        { top: '36px',    left: '36px'  },
        { top: '36px',    right: '36px' },
        { bottom: '36px', left: '36px'  },
        { bottom: '36px', right: '36px' },
      ].map((pos, i) => (
        <svg key={i} aria-hidden width="22" height="22" viewBox="0 0 22 22" fill="none"
          style={{ position: 'absolute', opacity: 0.25, pointerEvents: 'none', zIndex: 1, ...pos }}>
          {i === 0 && <path d="M0 22V0h22"  stroke="rgba(197,160,89,0.9)" strokeWidth="0.8" />}
          {i === 1 && <path d="M22 22V0H0"  stroke="rgba(197,160,89,0.9)" strokeWidth="0.8" />}
          {i === 2 && <path d="M0 0v22h22"  stroke="rgba(197,160,89,0.9)" strokeWidth="0.8" />}
          {i === 3 && <path d="M22 0v22H0"  stroke="rgba(197,160,89,0.9)" strokeWidth="0.8" />}
        </svg>
      ))}

      {/* ── CONTENT ─────────────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 3,
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 96px)',
        maxWidth: '1340px', margin: '0 auto', width: '100%',
      }}>

        {/* Top rune line */}
        <motion.div
          {...fadeUp(0)}
          style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '72px' }}
        >
          <span style={{ display: 'block', width: '52px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.5))' }} />
          <span style={{ fontSize: '0.54rem', letterSpacing: '0.4em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', color: 'rgba(197,160,89,0.4)', whiteSpace: 'nowrap' }}>
            Begin the Conversation
          </span>
          <span style={{ display: 'block', flex: 1, maxWidth: '160px', height: '1px', background: 'linear-gradient(to right, rgba(197,160,89,0.4), transparent)' }} />
        </motion.div>

        {/* Two-column layout */}
        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(48px, 8vw, 120px)', alignItems: 'center' }}>

          {/* LEFT: Headline + copy */}
          <div>
            <motion.span
              {...fadeUp(0.06)}
              style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.34em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--color-accent-1)', marginBottom: '32px' }}
            >
              For those who expect the extraordinary
            </motion.span>

            <motion.h2
              {...fadeUp(0.13)}
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem, 5.5vw, 5.5rem)', fontWeight: 300, lineHeight: 1.03, letterSpacing: '-0.026em', color: 'rgba(248,244,238,0.92)', marginBottom: '0.18em' }}
            >
              Every Legacy<br />Begins With a
            </motion.h2>
            <motion.h2
              {...fadeUp(0.2)}
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem, 5.5vw, 5.5rem)', fontWeight: 300, lineHeight: 1.03, letterSpacing: '-0.026em', color: 'rgba(248,244,238,0.92)', marginBottom: '52px' }}
            >
              <em style={{ fontStyle: 'italic', color: 'var(--color-accent-1)' }}>Single Word.</em>
            </motion.h2>

            <motion.p
              {...fadeUp(0.28)}
              style={{ fontSize: 'clamp(0.8rem, 1.05vw, 0.88rem)', fontFamily: 'var(--font-body)', fontWeight: 300, lineHeight: 1.9, color: 'rgba(255,255,255,0.32)', maxWidth: '380px', marginBottom: '48px' }}
            >
              Share your email and we will reach out personally.
              A direct conversation with those who will craft your event —
              not a sales process, but a dialogue.
            </motion.p>

            <motion.div
              {...fadeUp(0.35)}
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              {['Dubai, UAE', 'Riyadh, KSA', 'London, UK'].map((loc) => (
                <div key={loc} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ display: 'block', width: '5px', height: '5px', background: 'rgba(197,160,89,0.5)', borderRadius: '50%', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>{loc}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Form */}
          <motion.div {...fadeUp(0.22)}>
            {!sent ? (
              <form
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%', maxWidth: '480px' }}
              >
                <div style={{ borderBottom: '1px solid rgba(197,160,89,0.22)', transition: 'border-color 0.35s ease' }}>
                  <input
                    type="text"
                    placeholder="Your name"
                    style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', padding: '14px 0', fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 300, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.72)', caretColor: 'var(--color-accent-1)' }}
                  />
                </div>

                <div style={{ position: 'relative', borderBottom: focused ? '1px solid rgba(197,160,89,0.85)' : '1px solid rgba(197,160,89,0.22)', transition: 'border-color 0.35s ease' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="Your email address"
                    required
                    style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', padding: '14px 0', fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 300, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.72)', caretColor: 'var(--color-accent-1)' }}
                  />
                  <div style={{ position: 'absolute', bottom: -1, left: 0, height: '1px', background: 'var(--color-accent-1)', width: focused ? '100%' : '0%', transition: 'width 0.45s cubic-bezier(0.22, 1, 0.36, 1)' }} />
                </div>

                <div style={{ borderBottom: '1px solid rgba(197,160,89,0.22)' }}>
                  <input
                    type="text"
                    placeholder="Company & event type"
                    style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', padding: '14px 0', fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 300, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.72)', caretColor: 'var(--color-accent-1)' }}
                  />
                </div>

                <motion.button
                  type="submit"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', marginTop: '12px', padding: '16px 44px', background: 'transparent', border: '1px solid rgba(197,160,89,0.45)', color: 'var(--color-accent-1)', fontFamily: 'var(--font-body)', fontSize: '0.66rem', letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 400, cursor: 'pointer', alignSelf: 'flex-start', transition: 'background 0.32s ease, border-color 0.32s ease' }}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.975 }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = 'rgba(197,160,89,0.09)';
                    el.style.borderColor = 'rgba(197,160,89,0.85)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = 'transparent';
                    el.style.borderColor = 'rgba(197,160,89,0.45)';
                  }}
                >
                  Request a Proposal
                  <svg width="18" height="8" viewBox="0 0 18 8" fill="none" aria-hidden>
                    <path d="M1 4h16M12 1l4 3-4 3" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.button>

                <p style={{ fontSize: '0.62rem', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-body)' }}>
                  We respond within 24 hours. No intermediaries.
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: EASE }}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <div style={{ width: '52px', height: '1px', background: 'var(--color-accent-1)', opacity: 0.5 }} />
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', fontWeight: 300, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.01em' }}>
                  We will be in touch.
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>
                  Expect a personal response within 24 hours.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          #contact * { opacity: 1 !important; transform: none !important; filter: none !important; }
        }
      `}</style>
    </section>
  );
}
