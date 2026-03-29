import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { staggerContainer, fadeInUp, fadeIn } from '@/animations/fadeInUp';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────
   TYPES
────────────────────────────────────────────────────────── */

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  company: string;
  abbr: string;
  event: string;
}

/* ──────────────────────────────────────────────────────────
   DATA
────────────────────────────────────────────────────────── */

const TESTIMONIALS: Testimonial[] = [
  {
    id: '01',
    quote:
      'GHAIM elevated what we thought was possible for a regional forum. Every detail — from venue flow to protocol — was handled with a precision we had never experienced from a local partner.',
    author: 'Khalid Al Mansouri',
    title: 'Chief Executive Officer',
    company: 'Dubai Holding',
    abbr: 'DH',
    event: 'Global Investor Forum 2023',
  },
  {
    id: '02',
    quote:
      'Three hundred guests from thirty countries, zero compromises. The GHAIM team understood that our brand is our reputation — and treated every moment of that evening accordingly.',
    author: 'Layla Al Nuaimi',
    title: 'Senior VP, Corporate Affairs',
    company: 'Emaar Properties',
    abbr: 'EP',
    event: 'Brand Centenary Celebration',
  },
  {
    id: '03',
    quote:
      'We have worked with event houses in London, Geneva, and Singapore. None have matched the quiet authority GHAIM brings. They do not just execute — they architect experiences.',
    author: 'James Whitfield',
    title: 'Group Managing Director',
    company: 'MAG Group',
    abbr: 'MAG',
    event: 'Leadership Retreat — Desert Edition',
  },
  {
    id: '04',
    quote:
      'Our annual summit is the single most visible moment of our calendar year. Placing it with GHAIM was not a decision we made lightly — it was the best we have made.',
    author: 'Fatima Al Rashid',
    title: 'Director of Strategy',
    company: 'DIFC Authority',
    abbr: 'DIFC',
    event: 'Annual Leadership Summit',
  },
  {
    id: '05',
    quote:
      'The calibre of thought GHAIM brings to a brief is unlike anything in this market. They returned with solutions we had not imagined, grounded in operational realities we respected.',
    author: 'Rashid Al Ketbi',
    title: 'Head of Investments',
    company: 'Aldar Properties',
    abbr: 'AP',
    event: 'Investor Showcase 2024',
  },
  {
    id: '06',
    quote:
      'Royalty, diplomats, industry leaders — all in one room, all evening. GHAIM made it seamless. The complexity was invisible; the experience was unforgettable.',
    author: 'Sara Al Hashimi',
    title: 'VP, Brand & Experience',
    company: 'Meraas',
    abbr: 'MR',
    event: 'Exclusive Brand Activation',
  },
];

/* ──────────────────────────────────────────────────────────
   SUB-COMPONENTS
────────────────────────────────────────────────────────── */

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

function QuoteMark() {
  return (
    <svg
      width="28"
      height="22"
      viewBox="0 0 32 24"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      <path
        d="M0 24V14.4C0 6.1 4.8 1.3 14.4 0l1.7 2.6C10.5 3.9 7.9 6.5 7.4 10.5H12V24H0ZM18.5 24V14.4C18.5 6.1 23.3 1.3 32.9 0l1.7 2.6c-5.6 1.3-8.2 3.9-8.7 7.9H30.5V24H18.5Z"
        fill="var(--color-accent-1)"
        opacity="0.22"
      />
    </svg>
  );
}

function CompanyBadge({ abbr }: { abbr: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        border: '1px solid var(--color-accent-3)',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.48rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
        }}
      >
        {abbr}
      </span>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <motion.article
      variants={fadeInUp}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        padding: '36px 32px 32px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-accent-3)',
        boxShadow: 'var(--shadow-light)',
        overflow: 'hidden',
        cursor: 'default',
      }}
      whileHover={{
        y: -6,
        boxShadow: '0 16px 40px rgba(0,0,0,0.09), 0 0 0 1px rgba(197,160,89,0.14)',
      }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Gold top-line scales in on hover */}
      <motion.div
        aria-hidden
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

      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <QuoteMark />
        <CompanyBadge abbr={testimonial.abbr} />
      </div>

      {/* Quote */}
      <blockquote
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(0.92rem, 1.3vw, 1.08rem)',
          fontWeight: 300,
          lineHeight: 1.75,
          letterSpacing: '0.006em',
          color: 'var(--color-text)',
          fontStyle: 'italic',
          flex: 1,
          margin: 0,
        }}
      >
        {testimonial.quote}
      </blockquote>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          background:
            'linear-gradient(to right, rgba(197,160,89,0.28), transparent)',
        }}
      />

      {/* Author */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--fs-sm)',
            fontWeight: 500,
            letterSpacing: '0.01em',
            color: 'var(--color-text)',
          }}
        >
          {testimonial.author}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--fs-xs)',
            fontWeight: 300,
            color: 'var(--color-text-muted)',
          }}
        >
          {testimonial.title},{' '}
          <span style={{ color: 'var(--color-text-mid)' }}>
            {testimonial.company}
          </span>
        </span>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--fs-xs)',
            fontWeight: 400,
            letterSpacing: 'var(--ls-wider)',
            textTransform: 'uppercase',
            color: 'var(--color-accent-1)',
            opacity: 0.7,
            marginTop: '4px',
          }}
        >
          {testimonial.event}
        </span>
      </div>
    </motion.article>
  );
}

function TrustStat({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      variants={fadeInUp}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        padding: '0 clamp(20px, 3vw, 40px)',
        borderLeft: '1px solid var(--color-accent-3)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.7rem, 2.8vw, 2.5rem)',
          fontWeight: 300,
          letterSpacing: 'var(--ls-tight)',
          color: 'var(--color-text)',
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--fs-xs)',
          fontWeight: 400,
          letterSpacing: 'var(--ls-wider)',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   TESTIMONIALS SECTION
══════════════════════════════════════════════════════════ */

export function Testimonials() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const rowOneRef   = useRef<HTMLDivElement>(null);
  const rowTwoRef   = useRef<HTMLDivElement>(null);

  /* Scroll-driven parallax */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const bgY      = useTransform(scrollYProgress, [0, 1], ['0%', '5%']);
  const bloomO   = useTransform(scrollYProgress, [0, 0.4, 1], [0, 1, 0.2]);

  /* GSAP staggered reveals */
  useEffect(() => {
    const ctx = gsap.context(() => {

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

      if (statsRef.current) {
        gsap.from(statsRef.current.children, {
          opacity: 0,
          y: 16,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      if (rowOneRef.current) {
        gsap.from(rowOneRef.current.children, {
          opacity: 0,
          y: 40,
          duration: 1.0,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: rowOneRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      if (rowTwoRef.current) {
        gsap.from(rowTwoRef.current.children, {
          opacity: 0,
          y: 36,
          duration: 0.95,
          stagger: 0.16,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: rowTwoRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100svh',
        background: 'var(--color-bg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderTop: '1px solid rgba(197,160,89,0.08)',
      }}
    >

      {/* Background grid texture */}
      <motion.div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          y: bgY,
          backgroundImage: `
            linear-gradient(rgba(197,160,89,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(197,160,89,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Upper-left gold bloom */}
      <motion.div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-100px',
          left: '-140px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(197,160,89,0.06) 0%, transparent 68%)',
          opacity: bloomO,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Decorative compass-rose ornament — bottom right */}
      <svg
        aria-hidden
        width="260"
        height="260"
        viewBox="0 0 260 260"
        fill="none"
        style={{
          position: 'absolute',
          bottom: '-20px',
          right: '-20px',
          opacity: 0.038,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <circle cx="130" cy="130" r="129" stroke="var(--color-accent-1)" strokeWidth="0.75" />
        <circle cx="130" cy="130" r="95"  stroke="var(--color-accent-1)" strokeWidth="0.5"  />
        <circle cx="130" cy="130" r="60"  stroke="var(--color-accent-1)" strokeWidth="0.5"  />
        <line x1="130" y1="1"   x2="130" y2="259" stroke="var(--color-accent-1)" strokeWidth="0.5" />
        <line x1="1"   y1="130" x2="259" y2="130" stroke="var(--color-accent-1)" strokeWidth="0.5" />
        <line x1="39"  y1="39"  x2="221" y2="221" stroke="var(--color-accent-1)" strokeWidth="0.4" strokeDasharray="3 6" />
        <line x1="221" y1="39"  x2="39"  y2="221" stroke="var(--color-accent-1)" strokeWidth="0.4" strokeDasharray="3 6" />
      </svg>

      {/* ══════════════════════════════════════════════════════
          CONTENT WRAPPER
      ══════════════════════════════════════════════════════ */}
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

        {/* ══ HEADER ═══════════════════════════════════════════ */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(40px, 6vw, 96px)',
            alignItems: 'end',
          }}
        >
          {/* Left: eyebrow + headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <SectionEyebrow label="Client Voices" />
            <h2
              ref={headlineRef}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.4rem, 4.8vw, 4.8rem)',
                fontWeight: 300,
                lineHeight: 1.06,
                letterSpacing: 'var(--ls-tight)',
                color: 'var(--color-text)',
              }}
            >
              Trusted by
              <br />
              Those Who{' '}
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'var(--color-accent-1)',
                }}
              >
                Demand
              </em>
              <br />
              Excellence.
            </h2>
          </div>

          {/* Right: sub-copy */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
              paddingBottom: 'clamp(4px, 1vw, 12px)',
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
                maxWidth: '420px',
              }}
            >
              Our clients are C-suite leaders, sovereign entities, and the
              stewards of some of the Gulf's most recognised names. Their
              words carry a standard we hold ourselves to, every event.
            </motion.p>

            <motion.div
              variants={fadeIn}
              style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
            >
              <div
                style={{
                  width: '48px',
                  height: '1px',
                  background: 'var(--color-accent-1)',
                  opacity: 0.6,
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--fs-xs)',
                  letterSpacing: 'var(--ls-widest)',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                }}
              >
                Verified Engagements
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* ══ TRUST STATS ══════════════════════════════════════ */}
        <div
          ref={statsRef}
          style={{
            display: 'flex',
            alignItems: 'stretch',
            padding: 'clamp(20px, 3vw, 32px) 0',
            borderTop: '1px solid var(--color-accent-3)',
            borderBottom: '1px solid var(--color-accent-3)',
          }}
        >
          <TrustStat value="10+"  label="Years of Excellence"       />
          <TrustStat value="200+" label="Premium Events Delivered"   />
          <TrustStat value="40+"  label="Global Nationalities Hosted" />
          <TrustStat value="100%" label="Client Retention"           />
        </div>

        {/* ══ CARD ROW 1 ═══════════════════════════════════════ */}
        <div
          ref={rowOneRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'clamp(12px, 2vw, 24px)',
          }}
        >
          {TESTIMONIALS.slice(0, 3).map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>

        {/* ══ CARD ROW 2 — editorially offset ═════════════════ */}
        <div
          ref={rowTwoRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'clamp(12px, 2vw, 24px)',
            paddingLeft:  'clamp(0px, 4vw, 52px)',
            paddingRight: 'clamp(0px, 4vw, 52px)',
          }}
        >
          {TESTIMONIALS.slice(3).map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>

        {/* ══ BOTTOM RULE ══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            paddingTop: 'var(--space-md)',
          }}
        >
          <div
            style={{
              flex: 1,
              height: '1px',
              background:
                'linear-gradient(to right, transparent, rgba(197,160,89,0.28), transparent)',
            }}
          />
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
            All testimonials from verified live engagements
          </span>
          <div
            style={{
              flex: 1,
              height: '1px',
              background:
                'linear-gradient(to left, transparent, rgba(197,160,89,0.28), transparent)',
            }}
          />
        </motion.div>

      </div>
    </section>
  );
}