import React, { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import ScribbleButton from './ScribbleButton'
import { assetUrl } from '../lib/assetUrl'

const steps = [
  { index: '01', label: 'Brief & scope'        },
  { index: '02', label: 'Vendor alignment'     },
  { index: '03', label: 'Run‑of‑show approval' },
  { index: '04', label: 'Show‑day command'     },
]

const GhaimAEProcessSection = () => {
  const shouldReduceMotion = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  }

  const itemVariants = shouldReduceMotion ? {} : {
    hidden: { opacity: 0, y: 18 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  }

  const imageVariants = shouldReduceMotion ? {} : {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 } },
  }

  return (
    <section id="process" ref={ref} className="relative bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">

          {/* ── Left: text ── */}
          <motion.div
            variants={containerVariants}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate={inView ? 'show' : 'hidden'}
            className="lg:col-span-7"
          >
            <motion.p
              variants={itemVariants}
              style={{
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#aaa',
                fontWeight: 500,
                marginBottom: '14px',
              }}
            >
              How we work
            </motion.p>

            <motion.h2
              variants={itemVariants}
              className="font-serif"
              style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
                fontWeight: 600,
                color: '#1c1c1c',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: '18px',
              }}
            >
              A process built around timing, approvals, and calm.
            </motion.h2>

            <motion.p
              variants={itemVariants}
              style={{
                fontSize: 'clamp(14px, 1.5vw, 16px)',
                color: '#888',
                lineHeight: 1.65,
                marginBottom: '32px',
                maxWidth: '480px',
              }}
            >
              We stay close to the run‑of‑show, approvals, and vendor
              alignment so your team can stay focused on the room. The goal
              is a composed event with no last‑minute surprises.
            </motion.p>

            {/* Step list */}
            <motion.div
              variants={containerVariants}
              className="mb-8 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-1"
            >
              {steps.map(step => (
                <motion.div
                  key={step.index}
                  variants={itemVariants}
                  className="flex items-center gap-2.5 rounded-xl border border-black/[0.06] bg-white/[0.68] px-3 py-3 sm:gap-3 sm:px-4"
                >
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 500,
                    letterSpacing: '0.14em',
                    color: 'rgba(0,0,0,0.25)',
                    fontVariantNumeric: 'tabular-nums',
                    flexShrink: 0,
                    width: '24px',
                  }}>
                    {step.index}
                  </span>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#1c1c1c',
                    letterSpacing: '0.01em',
                    lineHeight: 1.35,
                  }}>
                    {step.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants}>
              <ScribbleButton
                to="/process"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface-2 px-5 py-2.5 text-sm font-semibold text-ink-muted transition hover:border-ink hover:text-ink"
              >
                See full process
              </ScribbleButton>
            </motion.div>
          </motion.div>

          {/* ── Right: image ── */}
          <motion.div
            variants={imageVariants}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate={inView ? 'show' : 'hidden'}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <img
              src={assetUrl('images/event-planning-in-action.png')}
              alt="Event planning in action"
              loading="lazy"
              decoding="async"
              className="w-full max-w-xs rounded-lg border border-black/[0.06] lg:max-w-sm"
            />
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default GhaimAEProcessSection
