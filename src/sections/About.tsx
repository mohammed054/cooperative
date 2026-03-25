import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { staggerContainer, fadeInUp, fadeIn } from '@/animations/fadeInUp';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────
   TYPES
────────────────────────────────────────────────────────── */

interface ClientLogo {
  name: string;
  abbr: string;
}

interface CaseStudyCard {
  index: string;        // "01" | "02" | "03"
  category: string;
  title: string;
  client: string;
  year: string;
  detail: string;
}

/* ──────────────────────────────────────────────────────────
   DATA
────────────────────────────────────────────────────────── */

const CLIENTS: ClientLogo[] = [
  { name: 'MAG Group',       abbr: 'MAG'    },
  { name: 'Emaar Properties', abbr: 'Emaar'  },
  { name: 'DIFC Authority',  abbr: 'DIFC'   },
  { name: 'Dubai Holding',   abbr: 'DH'     },
  { name: 'Meraas',          abbr: 'Meraas' },
  { name: 'Aldar Properties', abbr: 'Aldar'  },
];

const CASE_STUDIES: CaseStudyCard[] = [
  {
    index:    '01',
    category: 'Annual Summit',
    title:    'Leadership Retreat — Desert Edition',
    client:   'MAG Group',
    year:     '2024',
    detail:   'A three-day immersive retreat for 200+ GCC C-suite executives across three exclusive venues.',
  },
  {
    index:    '02',
    category: 'Investor Forum',
    title:    'Global Investor Forum',
    client:   'Dubai Holding',
    year:     '2023',
    detail:   '500 global investors, one evening — connecting capital to the region\'s most ambitious projects.',
  },
  {
    index:    '03',
    category: 'Black-Tie Gala',
    title:    'Brand Centenary Celebration',
    client:   'Emaar Properties',
    year:     '2023',
    detail:   'A landmark centenary gala attended by royalty, diplomats, and international luminaries.',
  },
];

/* ──────────────────────────────────────────────────────────
   SUB-COMPONENTS
────────────────────────────────────────────────────────── */

/** Thin gold eyebrow row — matches hero's eyebrow exactly */
function SectionEyebrow({ label }: { label: string }) {
  return (
    <motion.div
      variants={fadeIn}
      className="flex items-center gap-4"
    >
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

/** Single client logo pill — muted by default, gold on hover */
function ClientLogo({ name }: { name: string }) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ opacity: 1 }}
      style={{
        padding: '10px 24px',
        border: '1px solid var(--color-accent-3)',
        opacity: 0.55,
        transition: 'opacity var(--anim-medium) var(--ease-authority)',
        cursor: 'default',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--fs-xs)',
          fontWeight: 500,
          letterSpacing: 'var(--ls-wider)',
          textTransform: 'uppercase',
          color: 'var(--color-text)',
        }}
      >
        {name}
      </span>
    </motion.div>
  );
}

/** Case study card — editorial index + lift on hover */
function CaseStudyCard({ card }: { card: CaseStudyCard }) {
  return (
    <motion.article
      variants={fadeInUp}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '36px 32px 32px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-accent-3)',
        boxShadow: 'var(--shadow-light)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gold accent top-line — scales in on hover via CSS */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1.5px',
          background: 'var(--color-accent-1)',
          transformOrigin: 'left',
          scaleX: 0,
        }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Index + category row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-sm)',
            fontWeight: 300,
            letterSpacing: 'var(--ls-wide)',
            color: 'var(--color-text-muted)',
          }}
        >
          {card.index}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--fs-xs)',
            fontWeight: 500,
            letterSpacing: 'var(--ls-wider)',
            textTransform: 'uppercase',
            color: 'var(--color-accent-1)',
          }}
        >
          {card.category}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.25rem, 2vw, 1.6rem)',
          fontWeight: 300,
          lineHeight: 1.2,
          letterSpacing: 'var(--ls-tight)',
          color: 'var(--color-text)',
          flex: 1,
        }}
      >
        {card.title}
      </h3>

      {/* Detail paragraph */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--fs-sm)',
          fontWeight: 300,
          lineHeight: 1.72,
          color: 'var(--color-text-muted)',
        }}
      >
        {card.detail}
      </p>

      {/* Footer: client + year */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '20px',
          borderTop: '1px solid var(--color-accent-3)',
          marginTop: 'auto',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--fs-xs)',
            fontWeight: 400,
            letterSpacing: 'var(--ls-wide)',
            color: 'var(--color-text-muted)',
          }}
        >
          {card.client}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-sm)',
            fontWeight: 300,
            color: 'var(--color-accent-2)',
            letterSpacing: 'var(--ls-wide)',
          }}
        >
          {card.year}
        </span>
      </div>
    </motion.article>
  );
}

/* ══════════════════════════════════════════════════════════
   ABOUT
══════════════════════════════════════════════════════════ */

export function About() {
  const sectionRef    = useRef<HTMLElement>(null);
  const headlineRef   = useRef<HTMLHeadingElement>(null);
  const logosRef      = useRef<HTMLDivElement>(null);
  const cardsRef      = useRef<HTMLDivElement>(null);

  /* ── Scroll-driven parallax: section bg shifts very gently ── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '4%']);

  /* ── GSAP: stagger headline lines in on scroll ─────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {

      /* Headline chars lift in — split by line via wrapping spans */
      gsap.from(headlineRef.current, {
        opacity: 0,
        y: 28,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headlineRef.current,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });

      /* Client logos stagger in left → right */
      if (logosRef.current) {
        gsap.from(logosRef.current.children, {
          opacity: 0,
          y: 14,
          duration: 0.8,
          stagger: 0.09,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: logosRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      /* Cards lift in with stagger */
      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          opacity: 0,
          y: 36,
          duration: 0.95,
          stagger: 0.13,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100svh',
        background: 'var(--color-bg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* ── Subtle background paralax texture layer ─────────── */}
      <motion.div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          y: bgY,
          backgroundImage: `
            linear-gradient(
              rgba(197,160,89,0.035) 1px,
              transparent            1px
            ),
            linear-gradient(
              90deg,
              rgba(197,160,89,0.035) 1px,
              transparent            1px
            )
          `,
          backgroundSize: '64px 64px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Very faint radial glow — upper right ─────────────── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-120px',
          right: '-160px',
          width: '640px',
          height: '640px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(197,160,89,0.07) 0%, transparent 68%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ═══════════════════════════════════════════════════════
          CONTENT WRAPPER
      ═══════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: 'var(--space-3xl) clamp(32px, 8vw, 96px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2xl)',
        }}
      >

        {/* ══ ROW 1 — Eyebrow + Split Headline / Body ════════ */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(40px, 6vw, 96px)',
            alignItems: 'start',
          }}
        >
          {/* Left column — eyebrow + headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <SectionEyebrow label="About Ghaim" />

            <h2
              ref={headlineRef}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.6rem, 5.2vw, 5.2rem)',
                fontWeight: 300,
                lineHeight: 1.04,
                letterSpacing: 'var(--ls-tight)',
                color: 'var(--color-text)',
              }}
            >
              Where Vision
              <br />
              Meets{' '}
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'var(--color-accent-1)',
                }}
              >
                Flawless
              </em>
              <br />
              Execution.
            </h2>
          </div>

          {/* Right column — narrative + CTA link */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '36px',
              paddingTop: 'clamp(48px, 5vw, 80px)',
            }}
          >
            <motion.p
              variants={fadeInUp}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.875rem, 1.15vw, 0.975rem)',
                fontWeight: 300,
                lineHeight: 1.82,
                letterSpacing: '0.008em',
                color: 'var(--color-text-mid)',
                maxWidth: '460px',
              }}
            >
              GHAIM has spent over a decade shaping the most
              prestigious corporate events across the Gulf. We work
              exclusively with organisations that demand the highest
              standards — in venue, in service, in lasting impression.
            </motion.p>

            <motion.p
              variants={fadeInUp}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.875rem, 1.15vw, 0.975rem)',
                fontWeight: 300,
                lineHeight: 1.82,
                color: 'var(--color-text-muted)',
                maxWidth: '420px',
              }}
            >
              Our approach is quiet, deliberate, and precise. We do not
              measure success in headcount — we measure it in the
              conversations that happen the day after.
            </motion.p>

            {/* Soft CTA — text link with animated arrow */}
            <motion.a
              href="#work"
              variants={fadeInUp}
              className="flex items-center gap-3"
              style={{
                fontSize: 'var(--fs-xs)',
                letterSpacing: 'var(--ls-wider)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                color: 'var(--color-accent-1)',
                width: 'fit-content',
              }}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <span>View Our Work</span>
              <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                <path
                  d="M1 5h18M14 1l5 4-5 4"
                  stroke="currentColor"
                  strokeWidth="0.85"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.a>
          </div>
        </motion.div>

        {/* ══ ROW 2 — Client Trust Bar ════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Rule + label */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--fs-xs)',
                letterSpacing: 'var(--ls-wider)',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              Trusted by
            </span>
            {/* Gold rule fills remaining width */}
            <div
              style={{
                flex: 1,
                height: '1px',
                background:
                  'linear-gradient(to right, rgba(197,160,89,0.4), transparent)',
              }}
            />
          </motion.div>

          {/* Logos row */}
          <motion.div
            ref={logosRef}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            {CLIENTS.map((c) => (
              <ClientLogo key={c.name} name={c.name} />
            ))}
          </motion.div>
        </div>

        {/* ══ ROW 3 — Case Study Cards ════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--fs-xs)',
                letterSpacing: 'var(--ls-wider)',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              Selected Work
            </span>
            <div
              style={{
                flex: 1,
                height: '1px',
                background:
                  'linear-gradient(to right, rgba(197,160,89,0.35), transparent)',
              }}
            />
          </motion.div>

          {/* Cards */}
          <div
            ref={cardsRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'clamp(12px, 2vw, 24px)',
            }}
          >
            {CASE_STUDIES.map((card) => (
              <CaseStudyCard key={card.index} card={card} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}