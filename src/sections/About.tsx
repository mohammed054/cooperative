/**
 * About — Scene 3 · COMPLETE REBUILD ($25k)
 * ─────────────────────────────────────────────────────────────
 * Architecture overhaul:
 *   REMOVED the 220vh CSS-sticky + GSAP-scrub editorial pattern.
 *   That pattern was fragile: any ancestor with overflow:hidden/auto
 *   silently broke position:sticky, and the GSAP scrub timeline
 *   started everything at opacity:0 — invisible if scroll positions
 *   were off by even a few pixels.
 *
 *   REPLACED with a clean, reliable layout:
 *   — Framer Motion whileInView for all reveals (viewport observer,
 *     not scroll-position math → never miscalculates)
 *   — No GSAP pins or CSS sticky in this section
 *   — Sequenced stagger across five distinct visual bands
 *
 * Design upgrade (budget: $25k):
 *   1. Editorial header — oversized italic headline, double-column body
 *   2. Stat band — three key metrics, hairline borders, gold numerals
 *   3. Full-width atmospheric image with text caption strip
 *   4. Philosophy pillars — three columns, numbered, with rule reveal
 *   5. Client marquee — masked edges, velocity-matched motion
 */

import { motion } from 'framer-motion';

// ── Shared easing ──────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function fadeUp(delay = 0, amount = 0.25) {
  return {
    initial:     { opacity: 0, y: 32, filter: 'blur(5px)' },
    whileInView: { opacity: 1, y: 0,  filter: 'blur(0px)' },
    viewport:    { once: true, amount },
    transition:  { duration: 1.0, ease: EASE, delay },
  } as const;
}

function fadeIn(delay = 0) {
  return {
    initial:     { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport:    { once: true, amount: 0.2 },
    transition:  { duration: 1.1, ease: EASE, delay },
  } as const;
}

// ── Data ───────────────────────────────────────────────────────
const STATS = [
  { value: '200+', label: 'Events Delivered', sub: 'Across 6 Continents' },
  { value: '18',   label: 'Countries',        sub: 'Active Global Presence' },
  { value: '10+',  label: 'Years',            sub: 'Of Quiet Mastery' },
];

const PILLARS = [
  {
    n: '01',
    title: 'Quiet Architecture',
    body: "We don't seek attention for ourselves. The event is the statement. Our role is invisible precision — the reason everything feels inevitable and effortless.",
  },
  {
    n: '02',
    title: 'Precision Over Performance',
    body: "Execution is not measured in headcount or decibels. It is measured in the quality of conversation the morning after. That is the only metric that matters.",
  },
  {
    n: '03',
    title: 'Legacy Over Landmark',
    body: "Any venue can impress once. We design experiences that compound — reference points in the memory of everyone who was in the room for years to come.",
  },
];

const CLIENTS = [
  'MAG Group', 'Emaar Properties', 'DIFC Authority', 'Dubai Holding',
  'Meraas', 'Aldar Properties', 'Mubadala Investment', 'ADNOC',
  'MAG Group', 'Emaar Properties', 'DIFC Authority', 'Dubai Holding',
  'Meraas', 'Aldar Properties', 'Mubadala Investment', 'ADNOC',
];

// ── Logo Marquee ───────────────────────────────────────────────
function LogoMarquee() {
  return (
    <div style={{
      overflow: 'hidden',
      maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
    }}>
      <motion.div
        animate={{ x: '-50%' }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'clamp(52px, 6vw, 88px)',
          whiteSpace: 'nowrap',
        }}
      >
        {CLIENTS.map((name, i) => (
          <span key={i} style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.58rem, 0.82vw, 0.7rem)',
            fontWeight: 500,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            flexShrink: 0,
          }}>
            {name}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ABOUT — Main Export
// ══════════════════════════════════════════════════════════════
export function About() {
  return (
    <section
      id="about"
      style={{ position: 'relative', background: 'var(--color-bg)' }}
    >
      {/* Subtle gold grid texture */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(197,160,89,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(197,160,89,0.022) 1px, transparent 1px)
        `,
        backgroundSize: '72px 72px',
      }} />

      {/* ── BAND 1: EDITORIAL HEADER ────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: 'clamp(100px,10vw,140px) clamp(24px,5vw,80px) clamp(72px,7vw,96px)',
      }}>
        {/* Scene number + eyebrow */}
        <motion.div
          {...fadeUp(0)}
          style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '56px' }}
        >
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 300, fontStyle: 'italic',
            fontSize: '0.78rem', letterSpacing: '0.08em', color: 'rgba(197,160,89,0.5)',
          }}>03</span>
          <span style={{ display: 'block', width: '36px', height: '1px', background: 'var(--color-accent-1)', opacity: 0.6 }} />
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '0.62rem',
            letterSpacing: '0.34em', textTransform: 'uppercase',
            fontWeight: 500, color: 'var(--color-accent-1)',
          }}>About GHAIM</span>
        </motion.div>

        {/* Two-column: headline + body */}
        <div className="about-editorial-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(40px, 6vw, 100px)',
          alignItems: 'start',
        }}>
          {/* Left: display headline */}
          <div>
            <motion.h2
              {...fadeUp(0.08)}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 5.8vw, 6rem)',
                fontWeight: 300, lineHeight: 1.0,
                letterSpacing: '-0.028em',
                color: 'var(--color-text)',
              }}
            >
              Where Vision<br />
              <em style={{ fontStyle: 'italic', color: 'var(--color-accent-1)' }}>
                Meets Flawless
              </em><br />
              Execution.
            </motion.h2>

            {/* Gold rule beneath headline */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.0, ease: EASE, delay: 0.4 }}
              style={{
                height: '1px', marginTop: '40px',
                width: 'clamp(48px,5vw,72px)',
                background: 'linear-gradient(to right, var(--color-accent-1), transparent)',
                transformOrigin: 'left center',
              }}
            />
          </div>

          {/* Right: body + CTA */}
          <div style={{ paddingTop: 'clamp(0px, 1.5vw, 24px)' }}>
            <motion.p
              {...fadeUp(0.18, 0.3)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.875rem, 1.12vw, 0.97rem)',
                fontWeight: 300, lineHeight: 1.95,
                color: 'var(--color-text-mid)',
                marginBottom: '28px',
              }}
            >
              GHAIM has spent over a decade shaping the most prestigious
              corporate events across the Gulf. We work exclusively with
              organisations that demand the highest standards — in venue,
              in service, in lasting impression.
            </motion.p>

            <motion.p
              {...fadeUp(0.28, 0.3)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.875rem, 1.12vw, 0.97rem)',
                fontWeight: 300, lineHeight: 1.95,
                color: 'var(--color-text-muted)',
                marginBottom: '52px',
              }}
            >
              Our approach is quiet, deliberate, and precise. We do not
              measure success in headcount — we measure it in the
              conversations that happen the day after.
            </motion.p>

            <motion.a
              {...fadeUp(0.38, 0.3)}
              href="#work"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '12px',
                fontSize: '0.66rem', letterSpacing: '0.22em',
                textTransform: 'uppercase', fontFamily: 'var(--font-body)',
                fontWeight: 500, color: 'var(--color-accent-1)',
                textDecoration: 'none', position: 'relative',
              }}
              whileHover={{ x: 6 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              <span>View Our Work</span>
              <svg width="22" height="10" viewBox="0 0 22 10" fill="none" aria-hidden>
                <path d="M1 5h20M15 1l6 4-6 4" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>
          </div>
        </div>
      </div>

      {/* ── BAND 2: STATS ───────────────────────────────────── */}
      <motion.div
        {...fadeIn(0)}
        style={{
          position: 'relative', zIndex: 1,
          borderTop: '1px solid var(--color-accent-3)',
          borderBottom: '1px solid var(--color-accent-3)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
        }}
      >
        {STATS.map(({ value, label, sub }, i) => (
          <motion.div
            key={label}
            {...fadeUp(i * 0.12, 0.3)}
            style={{
              padding: 'clamp(36px, 4vw, 56px) clamp(24px, 4vw, 56px)',
              borderRight: i < 2 ? '1px solid var(--color-accent-3)' : undefined,
              display: 'flex', flexDirection: 'column', gap: '8px',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.8rem, 5vw, 5rem)',
              fontWeight: 300, lineHeight: 1,
              letterSpacing: '-0.035em',
              color: 'var(--color-accent-1)',
            }}>
              {value}
            </span>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.78rem',
              fontWeight: 500, letterSpacing: '0.04em',
              color: 'var(--color-text)',
              textTransform: 'uppercase',
            }}>
              {label}
            </span>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.62rem',
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
            }}>
              {sub}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* ── BAND 3: FULL-WIDTH IMAGE ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 1.03 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.3, ease: EASE }}
        style={{
          position: 'relative', zIndex: 1,
          width: '100%',
          height: 'clamp(360px, 50vw, 680px)',
          overflow: 'hidden',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=2200&auto=format&fit=crop&q=85"
          alt="GHAIM luxury event — Atlantis The Palm grand ballroom"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 35%',
          }}
        />
        {/* Gradient overlays */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(10,8,6,0.08) 0%, transparent 35%, transparent 55%, rgba(10,8,6,0.42) 100%)',
        }} />
        {/* Image caption */}
        <div style={{
          position: 'absolute', bottom: '28px', left: 'clamp(24px,4vw,64px)',
          display: 'flex', alignItems: 'center', gap: '14px',
        }}>
          <span style={{
            display: 'block', width: '24px', height: '1px',
            background: 'rgba(197,160,89,0.65)',
          }} />
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '0.6rem',
            letterSpacing: '0.26em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
          }}>
            Atlantis The Palm · Dubai · 2024
          </span>
        </div>
        {/* Right caption watermark */}
        <div style={{
          position: 'absolute', bottom: '28px', right: 'clamp(24px,4vw,64px)',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300,
            fontSize: 'clamp(0.7rem, 1vw, 0.85rem)',
            color: 'rgba(197,160,89,0.55)', letterSpacing: '0.06em',
          }}>
            The Grand Cascade
          </span>
        </div>
      </motion.div>

      {/* ── BAND 4: PHILOSOPHY PILLARS ───────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: 'clamp(80px, 8vw, 120px) clamp(24px, 5vw, 80px)',
      }}>
        {/* Section label */}
        <motion.div
          {...fadeUp(0, 0.3)}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '56px' }}
        >
          <span style={{ display: 'block', width: '28px', height: '1px', background: 'var(--color-accent-1)', opacity: 0.6 }} />
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '0.6rem',
            letterSpacing: '0.34em', textTransform: 'uppercase',
            fontWeight: 500, color: 'var(--color-accent-1)',
          }}>Our Philosophy</span>
        </motion.div>

        {/* Three pillars */}
        <div className="about-pillars-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(32px, 4vw, 64px)',
        }}>
          {PILLARS.map(({ n, title, body }, i) => (
            <motion.div
              key={n}
              {...fadeUp(i * 0.14, 0.2)}
              style={{
                paddingTop: '28px',
                borderTop: '1px solid var(--color-accent-3)',
                display: 'flex', flexDirection: 'column', gap: '16px',
              }}
            >
              {/* Number + rule */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 300,
                  fontStyle: 'italic', fontSize: '0.78rem',
                  letterSpacing: '0.08em', color: 'rgba(197,160,89,0.55)',
                }}>
                  {n}
                </span>
                <span style={{
                  display: 'block', flex: 1, height: '1px',
                  background: 'linear-gradient(to right, rgba(197,160,89,0.28), transparent)',
                }} />
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)',
                fontWeight: 300, fontStyle: 'italic',
                lineHeight: 1.2, letterSpacing: '-0.01em',
                color: 'var(--color-text)',
              }}>
                {title}.
              </h3>

              {/* Body */}
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.82rem, 1vw, 0.88rem)',
                fontWeight: 300, lineHeight: 1.88,
                color: 'var(--color-text-muted)',
              }}>
                {body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── BAND 5: CLIENT MARQUEE ───────────────────────────── */}
      <motion.div
        {...fadeIn(0)}
        style={{
          position: 'relative', zIndex: 1,
          borderTop: '1px solid var(--color-accent-3)',
          borderBottom: '1px solid var(--color-accent-3)',
          padding: 'clamp(18px, 2.2vw, 26px) 0',
          overflow: 'hidden',
        }}
      >
        {/* "Trusted by" label pinned left */}
        <div style={{
          position: 'absolute',
          left: 'clamp(24px, 4vw, 64px)',
          top: '50%', transform: 'translateY(-50%)',
          display: 'flex', alignItems: 'center', gap: '14px',
          background: 'var(--color-bg)', paddingRight: '16px',
          zIndex: 2,
        }}>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '0.58rem',
            letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'var(--color-text-muted)', whiteSpace: 'nowrap',
          }}>
            Trusted by
          </span>
          <span style={{
            display: 'block', width: '28px', height: '1px',
            background: 'linear-gradient(to right, rgba(197,160,89,0.5), transparent)',
          }} />
        </div>

        <div style={{ paddingLeft: 'clamp(120px, 14vw, 200px)' }}>
          <LogoMarquee />
        </div>
      </motion.div>

      {/* Responsive grid overrides */}
      <style>{`
        @media (max-width: 900px) {
          .about-editorial-grid {
            grid-template-columns: 1fr !important;
          }
          .about-pillars-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 640px) {
          #about [data-stats] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #about * { opacity: 1 !important; transform: none !important; filter: none !important; }
        }
      `}</style>
    </section>
  );
}