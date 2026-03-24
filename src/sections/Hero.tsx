import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/Button';
import { staggerContainer, fadeInUp, fadeIn } from '@/animations/fadeInUp';

gsap.registerPlugin(ScrollTrigger);

/* ── Thin gold horizontal rule ─────────────────────────── */
function GoldRule({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`h-px ${className}`}
      style={{
        background:
          'linear-gradient(to right, transparent, rgba(197,160,89,0.7), transparent)',
      }}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 1.4, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

/* ── SVG Corner Ornament ────────────────────────────────── */
function CornerOrnament({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const posClass = {
    tl: 'top-7 left-7',
    tr: 'top-7 right-7',
    bl: 'bottom-7 left-7',
    br: 'bottom-7 right-7',
  }[position];

  const rotate = {
    tl: 'rotate-0',
    tr: 'rotate-90',
    bl: '-rotate-90',
    br: 'rotate-180',
  }[position];

  return (
    <motion.div
      className={`absolute ${posClass} ${rotate} w-7 h-7 pointer-events-none hidden lg:block`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      transition={{ duration: 1.1, delay: 2.1, ease: 'easeOut' }}
    >
      <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
        <path d="M2 26 L2 2 L26 2" stroke="#C5A059" strokeWidth="0.9" />
        <circle cx="2" cy="2" r="1.4" fill="#C5A059" opacity="0.8" />
      </svg>
    </motion.div>
  );
}

/* ── Stat ────────────────────────────────────────────────── */
function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <motion.div variants={fadeInUp} className="flex flex-col items-center md:items-start gap-1">
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.55rem, 2.8vw, 2.25rem)',
          fontWeight: 300,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          color: '#FFFFFF',
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: '0.62rem',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-body)',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.52)',
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════ */
export function Hero() {
  const heroRef    = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /* Framer Motion scroll-driven transforms */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  /* Gentle parallax — content drifts up as user scrolls */
  const contentY    = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  /* Video scales in very slightly as page scrolls — adds life */
  const videoScale  = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  /* Progressive dark overlay as user scrolls into next section */
  const darkenAlpha = useTransform(scrollYProgress, [0, 0.65], [0, 0.22]);

  /* GSAP scrub: hero content fades & lifts away as user scrolls */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -22,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '36% top',
          scrub: 0.65,
        },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: '660px' }}
    >
      {/* ════════════════════════════════════════════════
          BACKGROUND — Video + Bright-Preserve Overlay
      ════════════════════════════════════════════════ */}
      <motion.div className="absolute inset-0 z-0" style={{ scale: videoScale }}>
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-poster.jpg"
        >
          <source src="/background.mp4"  type="video/mp4" />
          <source src="/videos/hero.webm" type="video/webm" />
        </video>

        {/*
          Bright-preserve gradient:
          - Top: minimal tint so navbar text reads over bright sky
          - Mid: nearly transparent — let the video breathe
          - Bottom: stronger tint so white stats text stays legible
          Net effect: gallery-bright video, text still crisp.
        */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                to bottom,
                rgba(10, 8, 6, 0.40)  0%,
                rgba(10, 8, 6, 0.16) 35%,
                rgba(10, 8, 6, 0.22) 60%,
                rgba(10, 8, 6, 0.55) 88%,
                rgba(10, 8, 6, 0.72) 100%
              )
            `,
          }}
        />

        {/* Progressive scroll-darkening — subtle, user-driven */}
        <motion.div
          className="absolute inset-0 bg-[#0a0806]"
          style={{ opacity: darkenAlpha }}
        />

        {/* Left atmospheric vignette — grounds the text */}
        <div
          className="absolute inset-y-0 left-0 w-2/5 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(10,8,6,0.38), transparent)',
          }}
        />
      </motion.div>

      {/* ════════════════════════════════════════════════
          CORNER ORNAMENTS
      ════════════════════════════════════════════════ */}
      <CornerOrnament position="tl" />
      <CornerOrnament position="tr" />
      <CornerOrnament position="bl" />
      <CornerOrnament position="br" />

      {/* ════════════════════════════════════════════════
          VERTICAL SIDE LABELS
      ════════════════════════════════════════════════ */}
      <motion.div
        className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 z-10"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 2.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <span
          style={{
            fontSize: '0.58rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            writingMode: 'vertical-rl',
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.32)',
          }}
        >
          Est. 2018
        </span>
        <span
          style={{
            width: '1px',
            height: '56px',
            background:
              'linear-gradient(to bottom, rgba(197,160,89,0.6), transparent)',
          }}
        />
      </motion.div>

      <motion.div
        className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 z-10"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 2.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <span
          style={{
            width: '1px',
            height: '56px',
            background:
              'linear-gradient(to bottom, transparent, rgba(197,160,89,0.5))',
          }}
        />
        <span
          style={{
            fontSize: '0.58rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            writingMode: 'vertical-rl',
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.30)',
          }}
        >
          Scroll
        </span>
      </motion.div>

      {/* ════════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════════ */}
      <motion.div
        ref={contentRef}
        style={{ y: contentY }}
        className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-7 max-w-[700px]"
        >
          {/* ── Eyebrow ────────────────────────────────── */}
          <motion.div variants={fadeIn} className="flex items-center gap-4">
            <span
              style={{
                display: 'block',
                height: '1px',
                width: '36px',
                background: 'var(--color-accent-1)',
                opacity: 0.75,
              }}
            />
            <span
              style={{
                fontSize: '0.66rem',
                letterSpacing: '0.34em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                color: 'var(--color-accent-1)',
              }}
            >
              Luxury Event Management
            </span>
          </motion.div>

          {/* ── Headline ───────────────────────────────── */}
          <motion.h1
            variants={fadeInUp}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 7.2vw, 7.2rem)',
              fontWeight: 300,
              lineHeight: 1.02,
              letterSpacing: '-0.024em',
              color: '#F8F4EE',
            }}
          >
            We Craft
            <br />
            <em
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--color-accent-1)',
              }}
            >
              Extraordinary
            </em>
            <br />
            Experiences.
          </motion.h1>

          {/* ── Supporting text ────────────────────────── */}
          <motion.p
            variants={fadeInUp}
            style={{
              fontSize: 'clamp(0.875rem, 1.2vw, 0.95rem)',
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              lineHeight: 1.78,
              letterSpacing: '0.01em',
              color: 'rgba(255,255,255,0.60)',
              maxWidth: '390px',
            }}
          >
            From intimate corporate retreats to landmark galas —
            every detail is an act of deliberate precision.
          </motion.p>

          {/* ── CTA Row ────────────────────────────────── */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center gap-5 pt-1"
          >
            <Button variant="ghost-light" size="lg">
              Explore Our Work
            </Button>

            <motion.a
              href="#about"
              className="flex items-center gap-3 transition-opacity duration-300"
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-body)',
                color: 'rgba(255,255,255,0.48)',
              }}
              whileHover={{ x: 4, color: 'rgba(255,255,255,0.85)' }}
              transition={{ duration: 0.22 }}
            >
              <span>Our Story</span>
              <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                <path
                  d="M1 5h16M12 1l5 4-5 4"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* ════════════════════════════════════════════════
            STATS BAR — anchored to bottom
        ════════════════════════════════════════════════ */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="absolute bottom-10 left-8 md:left-16 lg:left-24 right-8 md:right-16 lg:right-24"
        >
          <GoldRule className="mb-7 w-full" />
          <div className="flex flex-row items-start justify-between md:justify-start md:gap-16">
            <StatItem value="200+"  label="Events Delivered" />
            <StatItem value="18"    label="Countries" />
            <StatItem value="12+"   label="Years of Excellence" />
          </div>
        </motion.div>
      </motion.div>

      {/* ════════════════════════════════════════════════
          SCROLL PULSE — centre bottom
      ════════════════════════════════════════════════ */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 2.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span
          style={{
            display: 'block',
            width: '1px',
            height: '40px',
            background:
              'linear-gradient(to bottom, rgba(197,160,89,0.7), transparent)',
          }}
          animate={{ scaleY: [1, 0.45, 1], opacity: [0.7, 0.25, 0.7] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
