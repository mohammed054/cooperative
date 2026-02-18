import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ScribbleButton from './ScribbleButton'
import { assetUrl } from '../lib/assetUrl'

const Hero = () => {
  const shouldReduceMotion = useReducedMotion()
  const [videoReady, setVideoReady] = useState(false)

  const scrollToSection = sectionId => {
    const element = document.getElementById(sectionId)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  // Staggered entrance — each child delays slightly after the previous
  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.13, delayChildren: 0.15 },
    },
  }

  const itemVariants = shouldReduceMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 18 },
        show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
      }

  return (
    <section id="hero" className="relative min-h-[100svh] overflow-hidden bg-black">

      {/* ── Background media ── */}
      <div className="absolute inset-0 h-full w-full">
        <img
          src={assetUrl('images/event1.jpg')}
          alt="Luxury event production"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            videoReady ? 'opacity-0' : 'opacity-100'
          }`}
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
        />
        <video
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay={!shouldReduceMotion}
          muted
          loop={!shouldReduceMotion}
          playsInline
          preload="none"
          poster={assetUrl('images/event1.jpg')}
          onLoadedData={() => setVideoReady(true)}
          aria-hidden="true"
          width={1920}
          height={1080}
        >
          <source src={assetUrl('videos/background.mp4')} type="video/mp4" />
        </video>
      </div>

      {/* ── Overlays ── */}
      {/* Primary gradient — deeper at bottom for content legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/88 pointer-events-none" />

      {/* Subtle radial bloom — desktop only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80 hidden md:block"
        style={{
          backgroundImage:
            'radial-gradient(900px 520px at 50% 5%, var(--color-video-overlay-accent), transparent 60%), radial-gradient(700px 520px at 0% 70%, rgba(255,255,255,0.08), transparent 58%)',
        }}
      />

      {/* Bottom gradient bridge — subtle transition to light section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--home-light-100)] to-transparent"
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 pt-10 pb-10 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="show"
          className="w-full max-w-3xl"
        >

          {/* Badge */}
          <motion.div variants={itemVariants} className="hidden md:block">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.18] bg-white/[0.08] px-4 py-1.5 backdrop-blur-sm">
              {/* Pulsing dot — signals live/active without being gaudy */}
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span
                className="text-white/85 font-medium"
                style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}
              >
                Ultra-premium event production
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="mt-5 md:mt-6 font-serif text-white leading-[1.05] tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)' }}
          >
            Production that<br className="hidden sm:block" /> defines perfection.
          </motion.h1>

          {/* Thin rule — adds editorial weight between headline and body */}
          <motion.div variants={itemVariants}>
            <div
              className="mt-5 md:mt-6"
              style={{
                width: '40px',
                height: '1px',
                background: 'rgba(255,255,255,0.35)',
              }}
            />
          </motion.div>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-xl text-white/70 leading-relaxed"
            style={{ fontSize: 'clamp(14px, 1.8vw, 18px)' }}
          >
            Senior-led crews for AV, staging, lighting, and show-day control —
            designed for the most discerning clients.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="mt-7 md:mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <ScribbleButton
              onClick={() => scrollToSection('get-started')}
              ariaLabel="Request a proposal"
              analyticsLabel="hero-request-proposal"
              showArrow={true}
              className="w-auto inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3 md:px-7 md:py-3.5 text-sm font-semibold text-black shadow-[0_16px_44px_rgba(0,0,0,0.28)] transition hover:bg-white/90 hover:shadow-[0_18px_54px_rgba(0,0,0,0.34)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Request a proposal
            </ScribbleButton>
          </motion.div>

          {/* Trust signals — desktop only */}
          <motion.div
            variants={itemVariants}
            className="mt-8 hidden md:flex flex-wrap gap-x-8 gap-y-3"
          >
            {['UAE-wide coverage', 'Show-day command', 'White-glove rentals'].map(label => (
              <p
                key={label}
                className="flex items-center gap-2 text-white/55"
                style={{ fontSize: '13px', letterSpacing: '0.03em' }}
              >
                {/* Thin dash instead of dot — more editorial */}
                <span
                  aria-hidden
                  style={{ display: 'block', width: '12px', height: '1px', background: 'rgba(255,255,255,0.35)', flexShrink: 0 }}
                />
                {label}
              </p>
            ))}
          </motion.div>

        </motion.div>
      </div>

      {/* ── Scroll indicator — desktop only ── */}
      {!shouldReduceMotion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          {/* Animated scroll line */}
          <div
            style={{
              width: '1px',
              height: '48px',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)',
              animation: 'scrollPulse 2s ease-in-out infinite',
            }}
          />
        </motion.div>
      )}

      <style>{`
        @keyframes scrollPulse {
          0%   { transform: scaleY(0); transform-origin: top; opacity: 0.7; }
          50%  { transform: scaleY(1); transform-origin: top; opacity: 1; }
          100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
        }
      `}</style>
    </section>
  )
}

export default Hero
