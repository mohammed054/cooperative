import React, { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useLeadSubmission } from '../hooks/useLeadSubmission'

const FinalCta = () => {
  const shouldReduceMotion = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })

  const { submit, isSubmitting, isSuccess, isError, feedbackMessage } =
    useLeadSubmission({ formName: 'homepage-final-cta' })

  const handleSubmit = async e => {
    e.preventDefault()
    await submit(e.currentTarget)
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
  }

  const itemVariants = shouldReduceMotion ? {} : {
    hidden: { opacity: 0, y: 18 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  }

  // Shared input class
  const inputClass = `
    w-full px-4 py-3 rounded-lg text-sm text-ink bg-white
    border border-black/[0.08]
    focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink/30
    transition-all duration-200 placeholder:text-ink-muted/50
  `

  const labelClass = `
    block text-xs font-medium uppercase tracking-[0.1em] text-white/40 mb-2
  `

  return (
    <section
      id="get-started"
      ref={ref}
      style={{ background: '#111', overflow: 'hidden' }}
    >
      <motion.div
        variants={containerVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate={inView ? 'show' : 'hidden'}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 items-start">

          {/* ── Left: headline + trust ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            <motion.div variants={itemVariants}>
              <p style={{
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                fontWeight: 500,
                marginBottom: '14px',
              }}>
                Get started
              </p>
              <h2
                className="font-serif"
                style={{
                  fontSize: 'clamp(1.8rem, 4.5vw, 3rem)',
                  fontWeight: 600,
                  color: '#fff',
                  lineHeight: 1.08,
                  letterSpacing: '-0.02em',
                  marginBottom: '16px',
                }}
              >
                Let's build your next event.
              </h2>

              <p style={{
                fontSize: 'clamp(14px, 1.5vw, 16px)',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.6,
                maxWidth: '380px',
              }}>
                Share your timeline, venue, and priorities. We'll respond with a clear plan within 24 hours.
              </p>
            </motion.div>

            {/* Trust signals */}
            <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Response within 24 hours',
                'Senior-led crews, not juniors',
                'UAE-wide coverage',
              ].map(item => (
                <p key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                  <span style={{ display: 'block', width: '12px', height: '1px', background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                  {item}
                </p>
              ))}
            </motion.div>

            {/* Contact links */}
            <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', fontWeight: 500 }}>
                Or reach out directly
              </p>

              {[
                {
                  href: 'tel:+97142345678',
                  label: '+971 4 234 5678',
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
                {
                  href: 'mailto:hello@ghaimuae.com',
                  label: 'hello@ghaimuae.com',
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
              ].map(({ href, label, icon }) => (
                <a
                  key={href}
                  href={href}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.5)',
                    textDecoration: 'none',
                    transition: 'color 0.22s ease',
                    width: 'fit-content',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
                >
                  {icon}
                  {label}
                </a>
              ))}
            </motion.div>

            {/* Available signal */}
            <motion.div variants={itemVariants}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
                  <span style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: '#34d399', opacity: 0.6,
                    animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
                  }} />
                  <span style={{ position: 'relative', width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }} />
                </span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.03em' }}>
                  Available for urgent requirements
                </span>
              </div>
            </motion.div>

          </div>

          {/* ── Right: form ── */}
          <motion.div variants={itemVariants}>
            <div style={{
              background: '#fafaf8',
              borderRadius: '6px',
              padding: '28px',
            }}>
              <p style={{
                fontSize: '10px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#aaa',
                fontWeight: 500,
                marginBottom: '20px',
              }}>
                Request a proposal
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="grid-cols-1 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelClass} style={{ color: '#888' }}>Full name *</label>
                    <input type="text" id="name" name="name" required placeholder="Full name" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="company" className={labelClass} style={{ color: '#888' }}>Company *</label>
                    <input type="text" id="company" name="company" required placeholder="Company name" className={inputClass} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="grid-cols-1 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className={labelClass} style={{ color: '#888' }}>Email *</label>
                    <input type="email" id="email" name="email" required placeholder="name@company.com" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelClass} style={{ color: '#888' }}>Phone</label>
                    <input type="tel" id="phone" name="phone" placeholder="+971 XX XXX XXXX" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className={labelClass} style={{ color: '#888' }}>Service *</label>
                  <select id="service" name="service" required className={inputClass}>
                    <option value="">Select a service</option>
                    <option value="event-production">Event production</option>
                    <option value="technical-production">Technical production</option>
                    <option value="staging-scenic">Staging & scenic</option>
                    <option value="furniture-rentals">Furniture & rentals</option>
                    <option value="unsure">Not sure yet</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className={labelClass} style={{ color: '#888' }}>How can we help? *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Tell us about your event scope, venue, and goals."
                    className={inputClass}
                    style={{ resize: 'none' }}
                  />
                </div>

                {/* Honeypot */}
                <input type="text" name="website" autoComplete="off" tabIndex={-1} className="hidden" />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    height: '48px',
                    background: isSubmitting ? '#555' : '#1c1c1c',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'background 0.25s ease',
                    marginTop: '4px',
                  }}
                  onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.background = '#2d2d2d' }}
                  onMouseLeave={e => { if (!isSubmitting) e.currentTarget.style.background = '#1c1c1c' }}
                >
                  {isSubmitting ? 'Submitting…' : 'Submit request'}
                </button>

                {/* Feedback */}
                {feedbackMessage && (
                  <p
                    style={{
                      fontSize: '13px',
                      textAlign: 'center',
                      color: isError ? '#dc2626' : isSuccess ? '#059669' : '#888',
                    }}
                    aria-live="polite"
                  >
                    {feedbackMessage}
                  </p>
                )}

                <p style={{ fontSize: '11px', color: '#aaa', textAlign: 'center', letterSpacing: '0.02em' }}>
                  We respond within 24 hours. Your information is secure.
                </p>

              </form>
            </div>
          </motion.div>

        </div>

        {/* Back to top */}
        <motion.div
          variants={itemVariants}
          style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}
        >
          <button
            onClick={scrollToTop}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.2)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.22s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.2)' }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M7 12V2M3 6l4-4 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to top
          </button>
        </motion.div>

      </motion.div>

      <style>{`@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }`}</style>
    </section>
  )
}

export default FinalCta