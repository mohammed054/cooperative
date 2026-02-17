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
    show: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
  }

  const itemVariants = shouldReduceMotion ? {} : {
    hidden: { opacity: 0, y: 14 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  }

  const imageVariants = shouldReduceMotion ? {} : {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.15 } },
  }

  return (
    <section id="process" ref={ref}>

      <style>{`
        .process-section { background: #fafaf8; overflow: hidden; }
        .process-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 64px 20px;
        }
        .process-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: center;
        }
        .process-image-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .process-image-wrap img {
          width: 65%;
          max-width: 260px;
          object-fit: contain;
          border-radius: 4px;
          display: block;
        }
        @media (min-width: 1024px) {
          .process-inner { padding: 80px 40px; }
          .process-grid {
            grid-template-columns: 1.25fr 0.75fr;
            gap: 80px;
          }
          .process-image-wrap img {
            width: 100%;
            max-width: 320px;
          }
        }
      `}</style>

      <div className="process-section">
        <div className="process-inner">
          <div className="process-grid">

            {/* ── Left: text ── */}
            <motion.div
              variants={containerVariants}
              initial={shouldReduceMotion ? false : 'hidden'}
              animate={inView ? 'show' : 'hidden'}
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
                  fontSize: 'clamp(1.7rem, 4vw, 3rem)',
                  fontWeight: 600,
                  color: '#1c1c1c',
                  lineHeight: 1.06,
                  letterSpacing: '-0.02em',
                  marginBottom: '20px',
                }}
              >
                A process built around timing, approvals, and calm.
              </motion.h2>

              <motion.div
                variants={itemVariants}
                style={{ width: '40px', height: '1px', background: 'rgba(0,0,0,0.15)', marginBottom: '20px' }}
              />

              <motion.p
                variants={itemVariants}
                style={{
                  fontSize: 'clamp(14px, 1.6vw, 16px)',
                  color: '#888',
                  lineHeight: 1.65,
                  marginBottom: '36px',
                  maxWidth: '480px',
                }}
              >
                We stay close to the run‑of‑show, approvals, and vendor
                alignment so your team can stay focused on the room. The goal
                is a composed event with no last‑minute surprises.
              </motion.p>

              {/* Step list */}
              <motion.div variants={containerVariants} style={{ marginBottom: '40px' }}>
                {steps.map((step, i) => (
                  <motion.div
                    key={step.index}
                    variants={itemVariants}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '13px 0',
                      borderBottom: i < steps.length - 1 ? '1px solid rgba(0,0,0,0.07)' : 'none',
                    }}
                  >
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 500,
                      letterSpacing: '0.14em',
                      color: 'rgba(0,0,0,0.22)',
                      fontVariantNumeric: 'tabular-nums',
                      flexShrink: 0,
                      width: '22px',
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
                  className="w-auto inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white px-6 py-3 text-sm font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition hover:bg-ink-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  How we work
                </ScribbleButton>
              </motion.div>
            </motion.div>

            {/* ── Right: image ── */}
            <motion.div
              className="process-image-wrap"
              variants={imageVariants}
              initial={shouldReduceMotion ? false : 'hidden'}
              animate={inView ? 'show' : 'hidden'}
            >
              <img
                src={assetUrl('images/event-planning-in-action.png')}
                alt="Event planning in action"
                loading="lazy"
                decoding="async"
              />
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default GhaimAEProcessSection