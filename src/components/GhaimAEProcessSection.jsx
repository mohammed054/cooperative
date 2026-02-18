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
    <section id="process" ref={ref} className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
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
            <motion.div variants={containerVariants} style={{ marginBottom: '36px' }}>
              {steps.map((step, i) => (
                <motion.div
                  key={step.index}
                  variants={itemVariants}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '14px 0',
                    borderBottom: i < steps.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  }}
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
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#1c1c1c',
                    letterSpacing: '0.01em',
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
              className="w-full max-w-xs lg:max-w-sm rounded-lg"
            />
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default GhaimAEProcessSection