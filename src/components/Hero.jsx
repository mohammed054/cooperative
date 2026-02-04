import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaArrowDown, FaArrowRight } from 'react-icons/fa';

const Hero = () => {
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.75, ease: [0.22, 1, 0.36, 1] };

  return (
    <section id="hero" className="relative min-h-[100svh] overflow-hidden bg-black">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/event1.jpg"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/80" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            'radial-gradient(900px 520px at 50% 10%, rgba(59, 130, 246, 0.18), transparent 62%), radial-gradient(700px 520px at 0% 70%, rgba(225, 145, 188, 0.12), transparent 58%)',
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="w-full max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.18] bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            UAE rentals + production
          </div>

          <h1 className="mt-6 text-[clamp(2.6rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-tight text-white">
            Event production that looks expensive — and runs on time.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            AV, staging, lighting, seating, and show‑day support. One accountable team, one timeline, zero surprises.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#get-started"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black shadow-[0_16px_44px_rgba(0,0,0,0.28)] transition hover:bg-white/90 hover:shadow-[0_18px_54px_rgba(0,0,0,0.34)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Request a proposal
              <FaArrowRight className="transition-transform group-hover:translate-x-0.5" size={14} />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.06] px-7 py-3.5 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/[0.10] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explore services
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3 text-sm text-white/70">
            <p className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
              UAE‑wide coverage
            </p>
            <p className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
              White‑glove setup
            </p>
            <p className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
              Show‑day support
            </p>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#services"
        aria-label="Scroll to services"
        animate={shouldReduceMotion ? undefined : { y: [0, 10, 0] }}
        transition={shouldReduceMotion ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/[0.16] bg-white/[0.06] p-3 text-white/90 backdrop-blur transition hover:bg-white/[0.10] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <FaArrowDown size={18} />
      </motion.a>
    </section>
  );
};

export default Hero;
