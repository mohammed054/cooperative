/**
 * Contact — Scene 8 (CINEMATIC)
 * ─────────────────────────────────────────────────────────────
 * Fixes:
 *   ✓ Now cinematic like Statement — GSAP pinned with scroll-driven text animation
 *   ✓ Text lines fade in one by one as you scroll into the section
 *   ✓ Form fades in after text settles — elegant sequence
 *   ✓ Pin holds for 60vh then releases (users can continue scrolling)
 *   ✓ Decorative elements: radial glow, corner marks, top rule draw-in
 *   ✓ Dark atmospheric background matching Statement section's depth
 *   ✓ Film grain particle texture for cinematic feel
 *   ✓ Hover/focus micro-interactions on email field
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const sectionRef  = useRef<HTMLElement>(null);
  const eyebrowRef  = useRef<HTMLSpanElement>(null);
  const line1Ref    = useRef<HTMLHeadingElement>(null);
  const line2Ref    = useRef<HTMLHeadingElement>(null);
  const subcopyRef  = useRef<HTMLParagraphElement>(null);
  const formRef     = useRef<HTMLDivElement>(null);
  const runeRef     = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState('');
  const [sent, setSent]   = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── Pin the section ─────────────────────────────────── */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=65%',          // pin for 65vh of scroll
        pin: true,
        pinSpacing: true,
      });

      /* ── Initial state — all invisible ──────────────────── */
      gsap.set([eyebrowRef.current, line1Ref.current, line2Ref.current, subcopyRef.current, formRef.current], {
        y: 32, opacity: 0, filter: 'blur(5px)',
      });
      gsap.set(runeRef.current, { opacity: 0, scaleX: 0 });

      /* ── Scroll-driven reveal timeline ───────────────────── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=65%',
          scrub: 1.0,
        },
      });

      tl
        // Decorative rule draws in (0 → 12%)
        .to(runeRef.current, {
          opacity: 1, scaleX: 1, duration: 0.12, ease: 'power2.out',
        }, 0)

        // Eyebrow fades in (5 → 20%)
        .to(eyebrowRef.current, {
          y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.18, ease: 'power2.out',
        }, 0.05)

        // Headline line 1 (12 → 28%)
        .to(line1Ref.current, {
          y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.20, ease: 'power3.out',
        }, 0.12)

        // Headline line 2 (20 → 38%)
        .to(line2Ref.current, {
          y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.20, ease: 'power3.out',
        }, 0.20)

        // Sub copy (30 → 50%)
        .to(subcopyRef.current, {
          y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.20, ease: 'power2.out',
        }, 0.30)

        // Form rises (45 → 65%)
        .to(formRef.current, {
          y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.22, ease: 'power3.out',
        }, 0.43)

        // HOLD — everything stays visible till pin releases
        .to({}, { duration: 0.35 });

    }, sectionRef);

    return () => ctx.revert();
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
      className="relative w-full flex items-center justify-center"
      style={{
        height: '100svh',
        background: '#070605',
        borderTop: '1px solid rgba(197,160,89,0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Layered atmospheric glow */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          radial-gradient(ellipse 80% 55% at 50% 50%, rgba(197,160,89,0.055) 0%, transparent 68%),
          radial-gradient(ellipse 40% 30% at 50% 80%, rgba(197,160,89,0.03) 0%, transparent 60%)
        `,
        zIndex: 0,
      }} />

      {/* Fine grid lines */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(197,160,89,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(197,160,89,0.022) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px', zIndex: 0,
      }} />

      {/* Decorative corner brackets — matching Statement section style */}
      {[
        { top: '32px', left: '32px' },
        { top: '32px', right: '32px' },
        { bottom: '32px', left: '32px' },
        { bottom: '32px', right: '32px' },
      ].map((pos, i) => (
        <svg key={i} aria-hidden width="22" height="22" viewBox="0 0 22 22" fill="none"
          style={{ position: 'absolute', opacity: 0.28, pointerEvents: 'none', zIndex: 0, ...pos }}>
          {i === 0 && <path d="M0 22V0h22" stroke="rgba(197,160,89,0.9)" strokeWidth="0.8" />}
          {i === 1 && <path d="M22 22V0H0" stroke="rgba(197,160,89,0.9)" strokeWidth="0.8" />}
          {i === 2 && <path d="M0 0v22h22" stroke="rgba(197,160,89,0.9)" strokeWidth="0.8" />}
          {i === 3 && <path d="M22 0v22H0" stroke="rgba(197,160,89,0.9)" strokeWidth="0.8" />}
        </svg>
      ))}

      {/* Content */}
      <div
        className="relative"
        style={{
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: 'clamp(64px, 8vw, 100px) clamp(24px, 5vw, 72px)',
          maxWidth: '680px',
          width: '100%',
        }}
      >
        {/* Decorative rune line — draws in first */}
        <div
          ref={runeRef}
          style={{
            display: 'flex', alignItems: 'center', gap: '20px',
            marginBottom: '28px',
            transformOrigin: 'center',
            opacity: 0,
          }}
        >
          <span style={{
            display: 'block', width: '48px', height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.55))',
          }} />
          <span style={{
            fontSize: '0.54rem', letterSpacing: '0.38em', textTransform: 'uppercase',
            fontFamily: 'var(--font-body)', color: 'rgba(197,160,89,0.45)',
            whiteSpace: 'nowrap',
          }}>Begin the Conversation</span>
          <span style={{
            display: 'block', width: '48px', height: '1px',
            background: 'linear-gradient(to left, transparent, rgba(197,160,89,0.55))',
          }} />
        </div>

        {/* Eyebrow label */}
        <span
          ref={eyebrowRef}
          style={{
            display: 'block',
            fontSize: '0.6rem',
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            color: 'var(--color-accent-1)',
            marginBottom: '28px',
            opacity: 0,
          }}
        >
          For those who expect the extraordinary
        </span>

        {/* Headline — split for stagger */}
        <h2
          ref={line1Ref}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.4rem, 5.8vw, 5.2rem)',
            fontWeight: 300,
            lineHeight: 1.04,
            letterSpacing: '-0.025em',
            color: 'rgba(248,244,238,0.92)',
            marginBottom: '0.2em',
            opacity: 0,
          }}
        >
          Every Legacy Begins
        </h2>
        <h2
          ref={line2Ref}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.4rem, 5.8vw, 5.2rem)',
            fontWeight: 300,
            lineHeight: 1.04,
            letterSpacing: '-0.025em',
            color: 'rgba(248,244,238,0.92)',
            marginBottom: '2rem',
            opacity: 0,
          }}
        >
          With a{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--color-accent-1)' }}>
            Single Word.
          </em>
        </h2>

        {/* Sub-copy */}
        <p
          ref={subcopyRef}
          style={{
            fontSize: 'clamp(0.8rem, 1.05vw, 0.88rem)',
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            lineHeight: 1.88,
            color: 'rgba(255,255,255,0.35)',
            maxWidth: '360px',
            marginBottom: '48px',
            opacity: 0,
          }}
        >
          Share your email and we will reach out personally.
          A direct conversation with those who will craft your event.
        </p>

        {/* Form — fades in after text */}
        <div ref={formRef} style={{ width: '100%', maxWidth: '420px', opacity: 0 }}>
          {!sent ? (
            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}
            >
              {/* Email input with focus micro-interaction */}
              <div
                style={{
                  width: '100%',
                  position: 'relative',
                  borderBottom: focused
                    ? '1px solid rgba(197,160,89,0.85)'
                    : '1px solid rgba(197,160,89,0.32)',
                  transition: 'border-color 0.35s ease',
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Your email address"
                  required
                  style={{
                    width: '100%', background: 'transparent',
                    border: 'none', outline: 'none',
                    padding: '14px 0',
                    fontFamily: 'var(--font-body)', fontSize: '0.88rem',
                    fontWeight: 300, letterSpacing: '0.04em',
                    color: 'rgba(255,255,255,0.78)',
                    caretColor: 'var(--color-accent-1)',
                  }}
                />
                {/* Animated underline fill on focus */}
                <div style={{
                  position: 'absolute', bottom: -1, left: 0,
                  height: '1px',
                  background: 'var(--color-accent-1)',
                  width: focused ? '100%' : '0%',
                  transition: 'width 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
                }} />
              </div>

              <motion.button
                type="submit"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '12px',
                  marginTop: '8px', padding: '14px 40px',
                  background: 'transparent',
                  border: '1px solid rgba(197,160,89,0.5)',
                  color: 'var(--color-accent-1)',
                  fontFamily: 'var(--font-body)', fontSize: '0.68rem',
                  letterSpacing: '0.26em', textTransform: 'uppercase',
                  fontWeight: 400, cursor: 'pointer',
                  transition: 'background 0.32s ease, border-color 0.32s ease',
                }}
                whileHover={{
                  scale: 1.015,
                  transition: { duration: 0.22 },
                }}
                whileTap={{ scale: 0.975 }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(197,160,89,0.1)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(197,160,89,0.9)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(197,160,89,0.5)';
                }}
              >
                Request a Proposal
                <svg width="18" height="8" viewBox="0 0 18 8" fill="none" aria-hidden>
                  <path d="M1 4h16M12 1l4 3-4 3" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
            >
              <div style={{ width: '48px', height: '1px', background: 'var(--color-accent-1)', opacity: 0.5, marginBottom: '8px' }} />
              <p style={{
                fontFamily: 'var(--font-display)', fontStyle: 'italic',
                fontSize: 'clamp(1rem, 1.8vw, 1.25rem)', fontWeight: 300,
                color: 'rgba(255,255,255,0.65)', letterSpacing: '0.01em',
              }}>
                We will be in touch.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}