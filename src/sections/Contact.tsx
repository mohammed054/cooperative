/**
 * Contact — Scene 8 (Final CTA)
 * Dark locked section. Text lifts in line-by-line via GSAP.
 * Single email field. One purpose.
 */

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');
  const [sent, setSent]   = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Gold rule draws in
      gsap.from('.cta-rule', {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 1.2,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: '.cta-rule',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      // Lines stagger in
      gsap.from('.cta-line', {
        opacity: 0,
        y: 30,
        stagger: 0.18,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.cta-section-inner',
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });

      // Form fades in after text
      gsap.from('.cta-form', {
        opacity: 0,
        y: 24,
        duration: 0.95,
        delay: 0.55,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.cta-section-inner',
          start: 'top 65%',
          toggleActions: 'play none none none',
        },
      });
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
        minHeight: '100svh',
        background: '#070605',
        borderTop: '1px solid rgba(197,160,89,0.1)',
        overflow: 'hidden',
      }}
    >
      {/* Subtle noise texture overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(197,160,89,0.04) 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />

      {/* Very faint grid lines */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(197,160,89,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(197,160,89,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          zIndex: 0,
        }}
      />

      {/* Decorative corner marks */}
      {[
        { top: '40px', left: '40px' },
        { top: '40px', right: '40px' },
        { bottom: '40px', left: '40px' },
        { bottom: '40px', right: '40px' },
      ].map((pos, i) => (
        <svg
          key={i}
          aria-hidden
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          style={{ position: 'absolute', opacity: 0.3, pointerEvents: 'none', zIndex: 0, ...pos }}
        >
          {i === 0 && <><path d="M0 20V0h20" stroke="rgba(197,160,89,0.8)" strokeWidth="0.75" /></>}
          {i === 1 && <><path d="M20 20V0H0" stroke="rgba(197,160,89,0.8)" strokeWidth="0.75" /></>}
          {i === 2 && <><path d="M0 0v20h20" stroke="rgba(197,160,89,0.8)" strokeWidth="0.75" /></>}
          {i === 3 && <><path d="M20 0v20H0" stroke="rgba(197,160,89,0.8)" strokeWidth="0.75" /></>}
        </svg>
      ))}

      {/* Content */}
      <div
        className="cta-section-inner relative"
        style={{
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: 'clamp(80px, 9vw, 120px) clamp(24px, 5vw, 72px)',
          maxWidth: '720px',
          width: '100%',
        }}
      >
        {/* Eyebrow gold rule */}
        <div
          className="cta-rule"
          style={{
            width: '48px',
            height: '1px',
            background: 'var(--color-accent-1)',
            opacity: 0.65,
            marginBottom: '24px',
          }}
        />

        {/* Eyebrow label */}
        <span
          className="cta-line"
          style={{
            display: 'block',
            fontSize: '0.62rem',
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            color: 'var(--color-accent-1)',
            marginBottom: '32px',
          }}
        >
          Begin the Conversation
        </span>

        {/* Main heading */}
        <h2
          className="cta-line"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.6rem, 6vw, 5.5rem)',
            fontWeight: 300,
            lineHeight: 1.04,
            letterSpacing: '-0.025em',
            color: '#F8F4EE',
            marginBottom: '0.5rem',
          }}
        >
          Every Legacy Begins
        </h2>
        <h2
          className="cta-line"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.6rem, 6vw, 5.5rem)',
            fontWeight: 300,
            lineHeight: 1.04,
            letterSpacing: '-0.025em',
            color: '#F8F4EE',
            marginBottom: '2rem',
          }}
        >
          With a{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--color-accent-1)' }}>
            Single Word.
          </em>
        </h2>

        {/* Sub-copy */}
        <p
          className="cta-line"
          style={{
            fontSize: 'clamp(0.82rem, 1.1vw, 0.9rem)',
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            lineHeight: 1.85,
            color: 'rgba(255,255,255,0.38)',
            maxWidth: '380px',
            marginBottom: '52px',
          }}
        >
          Share your email and we will reach out personally.
          No forms. No waiting lists. A direct conversation
          with those who will craft your event.
        </p>

        {/* Email form */}
        {!sent ? (
          <form
            className="cta-form"
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              width: '100%',
              maxWidth: '440px',
            }}
          >
            <div
              style={{
                width: '100%',
                position: 'relative',
                borderBottom: '1px solid rgba(197,160,89,0.35)',
                transition: 'border-color 0.3s ease',
              }}
              onFocusCapture={(e) =>
                ((e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(197,160,89,0.85)')
              }
              onBlurCapture={(e) =>
                ((e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(197,160,89,0.35)')
              }
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: '14px 0',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                  fontWeight: 300,
                  letterSpacing: '0.04em',
                  color: 'rgba(255,255,255,0.75)',
                  caretColor: 'var(--color-accent-1)',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '8px',
                padding: '14px 36px',
                background: 'transparent',
                border: '1px solid rgba(197,160,89,0.55)',
                color: 'var(--color-accent-1)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.68rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                fontWeight: 400,
                cursor: 'pointer',
                transition: 'background 0.3s ease, border-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background    = 'rgba(197,160,89,0.08)';
                (e.currentTarget as HTMLButtonElement).style.borderColor   = 'rgba(197,160,89,0.85)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background    = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.borderColor   = 'rgba(197,160,89,0.55)';
              }}
            >
              Request a Proposal
              <svg width="18" height="8" viewBox="0 0 18 8" fill="none" aria-hidden>
                <path d="M1 4h16M12 1l4 3-4 3" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        ) : (
          <div
            className="cta-form"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '1px',
                background: 'var(--color-accent-1)',
                opacity: 0.5,
                marginBottom: '8px',
              }}
            />
            <p
              style={{
                fontFamily:    'var(--font-display)',
                fontStyle:     'italic',
                fontSize:      'clamp(1rem, 1.8vw, 1.25rem)',
                fontWeight:    300,
                color:         'rgba(255,255,255,0.65)',
                letterSpacing: '0.01em',
              }}
            >
              We will be in touch.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}