import React, { useEffect, useMemo, useRef } from 'react'
import { motion, useReducedMotion, useTransform } from 'framer-motion'
import ScribbleButton from './ScribbleButton'
import { assetUrl } from '../lib/assetUrl'
import { useSceneProgress } from '../motion/hooks/useSceneProgress'

const Hero = () => {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const videoRef = useRef(null)

  const { scrollYProgress } = useSceneProgress(sectionRef, {
    offset: ['start start', 'end start'],
  })

  const mediaScale = useTransform(scrollYProgress, [0, 0.35], [1.05, 1])
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -24])
  const veilOpacity = useTransform(scrollYProgress, [0.14, 0.72], [0.28, 0.42])
  const bloomOpacity = useTransform(scrollYProgress, [0, 0.45], [0.58, 0.4])

  const scrollToSection = sectionId => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

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
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
        },
      }

  const bloomStyle = useMemo(
    () => ({
      backgroundImage:
        'radial-gradient(900px 520px at 50% 5%, var(--color-video-overlay-accent), transparent 60%), radial-gradient(700px 520px at 0% 70%, rgba(255,255,255,0.08), transparent 58%)',
      ...(shouldReduceMotion ? {} : { opacity: bloomOpacity }),
    }),
    [bloomOpacity, shouldReduceMotion]
  )

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const tryPlay = async () => {
      try {
        await video.play()
      } catch {
        // Keep poster image if autoplay is blocked.
      }
    }

    tryPlay()
  }, [])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden bg-black"
    >
      <motion.div
        style={shouldReduceMotion ? undefined : { scale: mediaScale }}
        className="absolute inset-0 h-full w-full"
      >
        <img
          src={assetUrl('images/event1.jpg')}
          alt="Luxury event production"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
        />
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={assetUrl('images/event1.jpg')}
          onCanPlay={() => videoRef.current?.play().catch(() => {})}
          aria-hidden="true"
          width={1920}
          height={1080}
        >
          <source src={assetUrl('videos/background.mp4')} type="video/mp4" />
        </video>
      </motion.div>

      <motion.div
        style={shouldReduceMotion ? undefined : { opacity: veilOpacity }}
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/12 to-black/34"
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={bloomStyle}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--home-light-100)] via-[var(--home-light-200)] to-transparent"
      />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8">
        <motion.div
          style={shouldReduceMotion ? undefined : { y: contentY }}
          variants={containerVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="show"
          className="w-full max-w-3xl"
        >
          <motion.div variants={itemVariants} className="hidden md:block">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.18] bg-white/[0.08] px-4 py-1.5 backdrop-blur-sm">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span
                className="font-medium text-white/85"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                Ultra-premium event production
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mt-5 font-serif leading-[1.05] tracking-tight text-white md:mt-6"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)' }}
          >
            Production that
            <br className="hidden sm:block" /> defines perfection.
          </motion.h1>

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

          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-xl leading-relaxed text-white/70"
            style={{ fontSize: 'clamp(14px, 1.8vw, 18px)' }}
          >
            Senior-led crews for AV, staging, lighting, and show-day control -
            designed for the most discerning clients.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-7 flex flex-col items-start gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4"
          >
            <ScribbleButton
              onClick={() => scrollToSection('get-started')}
              ariaLabel="Request a proposal"
              analyticsLabel="hero-request-proposal"
              showArrow={true}
              className="inline-flex w-auto items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_16px_44px_rgba(0,0,0,0.28)] transition hover:bg-white/90 hover:shadow-[0_18px_54px_rgba(0,0,0,0.34)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:px-7 md:py-3.5"
            >
              Request a proposal
            </ScribbleButton>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-8 hidden flex-wrap gap-x-8 gap-y-3 md:flex"
          >
            {[
              'UAE-wide coverage',
              'Show-day command',
              'White-glove rentals',
            ].map(label => (
              <p
                key={label}
                className="flex items-center gap-2 text-white/72"
                style={{ fontSize: '13px', letterSpacing: '0.03em' }}
              >
                <span
                  aria-hidden
                  style={{
                    display: 'block',
                    width: '12px',
                    height: '1px',
                    background: 'rgba(255,255,255,0.52)',
                    flexShrink: 0,
                  }}
                />
                {label}
              </p>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {!shouldReduceMotion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
          aria-hidden="true"
        >
          <motion.div
            animate={{ opacity: [0.35, 0.75, 0.35] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '1px',
              height: '48px',
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)',
            }}
          />
        </motion.div>
      )}
    </section>
  )
}

export default Hero
