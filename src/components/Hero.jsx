import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { FaArrowDown, FaArrowRight } from 'react-icons/fa'
import ScribbleButton from './ScribbleButton'
import { assetUrl } from '../lib/assetUrl'

const Hero = () => {
  const shouldReduceMotion = useReducedMotion()
  const [videoReady, setVideoReady] = useState(false)

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.75, ease: [0.22, 1, 0.36, 1] }

  const scrollToSection = sectionId => {
    const element = document.getElementById(sectionId)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="relative h-[100svh] overflow-hidden bg-black">
      {/* Background video / image */}
      <div className="absolute inset-0 h-full w-full" style={{ aspectRatio: '16/9' }}>
        <img
          src={assetUrl('images/event1.jpg')}
          alt="Event production in the UAE"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            videoReady ? 'opacity-0' : 'opacity-100'
          }`}
          loading="eager"
          decoding="async"
          width="1920"
          height="1080"
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
          width="1920"
          height="1080"
        >
          <source src={assetUrl('videos/background.mp4')} type="video/mp4" />
        </video>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/90" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80 hidden md:block"
        style={{
          backgroundImage:
            'radial-gradient(900px 520px at 50% 5%, var(--color-video-overlay-accent), transparent 60%), radial-gradient(700px 520px at 0% 70%, rgba(255,255,255,0.08), transparent 58%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 pt-8 pb-6 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="w-full max-w-3xl"
        >
          {/* Top badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.2] bg-white/[0.1] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/90 backdrop-blur hidden md:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            UAE event production
          </div>

          {/* Main headline */}
          <h1 className="mt-4 md:mt-6 text-[clamp(28px,6vw,36px)] md:text-[clamp(2.6rem,5vw,4.5rem)] font-semibold leading-[1.1] md:leading-[1.02] tracking-tight text-white font-serif">
            Production that keeps the room composed.
          </h1>

          {/* Subheadline */}
          <p className="mt-4 md:mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-white/70 md:text-white/75 sm:text-lg">
            Senior-led crews for AV, staging, lighting, and show-day control.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            {/* Primary button */}
            <ScribbleButton
              onClick={() => scrollToSection('get-started')}
              ariaLabel="Request a proposal"
              analyticsLabel="hero-request-proposal"
              className="w-auto rounded-full inline-flex items-center justify-center gap-2 bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_16px_44px_rgba(0,0,0,0.28)] transition hover:bg-white/90 hover:shadow-[0_18px_54px_rgba(0,0,0,0.34)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Request a proposal
              <FaArrowRight className="transition-transform group-hover:translate-x-0.5" size={14} />
            </ScribbleButton>

            {/* Secondary CTA */}
            <button
              onClick={() => scrollToSection('services')}
              aria-label="Explore services"
              className="text-sm text-white/70 hover:text-white/90 transition sm:hidden"
            >
              Explore services
            </button>

            <ScribbleButton
              onClick={() => scrollToSection('services')}
              ariaLabel="Explore services"
              analyticsLabel="hero-explore-services"
              className="hidden sm:inline-flex rounded-full items-center justify-center border border-white/[0.18] bg-white/[0.08] px-7 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/[0.14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explore services
            </ScribbleButton>
          </div>

          {/* Extra info (desktop only) */}
          <div className="mt-6 hidden md:flex flex-wrap gap-x-10 gap-y-3 text-sm text-white/70">
            <p className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
              UAE-wide coverage
            </p>
            <p className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
              Show-day command
            </p>
            <p className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
              White-glove rentals
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        type="button"
        aria-label="Scroll to services"
        animate={shouldReduceMotion ? undefined : { y: [0, 10, 0] }}
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
        }
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/[0.16] bg-white/[0.06] p-3 text-white/40 backdrop-blur transition hover:bg-white/[0.10] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white hidden md:block"
        onClick={() => scrollToSection('services')}
      >
        <FaArrowDown size={18} />
      </motion.button>
    </section>
  )
}

export default Hero
