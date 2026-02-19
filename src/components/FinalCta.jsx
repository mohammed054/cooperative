import React, { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useLeadSubmission } from '../hooks/useLeadSubmission'

const CONTACT_CHANNELS = [
  {
    href: 'tel:+97142345678',
    label: '+971 4 234 5678',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: 'mailto:hello@ghaimuae.com',
    label: 'hello@ghaimuae.com',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

const FinalCta = () => {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const { submit, isSubmitting, isSuccess, isError, feedbackMessage } =
    useLeadSubmission({ formName: 'homepage-final-cta' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const introOpacity = useTransform(scrollYProgress, [0.05, 0.28], [0, 1])
  const introY = useTransform(scrollYProgress, [0.05, 0.28], [26, 0])
  const formOpacity = useTransform(scrollYProgress, [0.18, 0.46], [0, 1])
  const formY = useTransform(scrollYProgress, [0.18, 0.46], [32, 0])
  const formScale = useTransform(scrollYProgress, [0.18, 0.46], [0.985, 1])
  const backToTopY = useTransform(formY, value => value * 0.5)

  const handleSubmit = async event => {
    event.preventDefault()
    await submit(event.currentTarget)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const inputClass =
    'w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-muted/50 transition-colors duration-300 focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/15'
  const labelClass =
    'mb-2 block text-[10px] font-medium uppercase tracking-[0.14em] text-ink-muted'

  return (
    <section
      id="get-started"
      ref={sectionRef}
      className="relative overflow-hidden bg-[linear-gradient(180deg,#17191d_0%,#111318_28%,#0f1012_100%)]"
    >
      <div className="cinematic-grain-overlay pointer-events-none absolute inset-0 opacity-[0.06]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            style={
              shouldReduceMotion
                ? undefined
                : { opacity: introOpacity, y: introY }
            }
            className="flex flex-col gap-8"
          >
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/35">
                Conversion gravity
              </p>
              <h2 className="mt-4 max-w-[14ch] font-serif text-[clamp(1.9rem,4.6vw,3.2rem)] leading-[1.06] tracking-[-0.02em] text-white">
                Let us engineer your next room.
              </h2>
              <p className="mt-4 max-w-[38ch] text-[15px] leading-relaxed text-white/56">
                Share your timeline and scope. You receive a clear production
                path within 24 hours.
              </p>
            </div>

            <ul className="space-y-2.5 text-sm text-white/52">
              <li className="flex gap-2.5">
                <span className="mt-2 block h-[1px] w-3 shrink-0 bg-white/36" />
                Response within 24 hours
              </li>
              <li className="flex gap-2.5">
                <span className="mt-2 block h-[1px] w-3 shrink-0 bg-white/36" />
                Senior-led crews from setup to show close
              </li>
              <li className="flex gap-2.5">
                <span className="mt-2 block h-[1px] w-3 shrink-0 bg-white/36" />
                UAE-wide logistical and technical coverage
              </li>
            </ul>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/28">
                Direct channels
              </p>
              <div className="mt-3 flex flex-col gap-2.5">
                {CONTACT_CHANNELS.map(channel => (
                  <a
                    key={channel.href}
                    href={channel.href}
                    className="inline-flex w-fit items-center gap-2.5 text-sm text-white/58 transition-colors duration-300 hover:text-white/90"
                  >
                    {channel.icon}
                    {channel.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="inline-flex items-center gap-2 text-xs tracking-[0.03em] text-white/38">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400/90" />
              Available for urgent requirements
            </div>
          </motion.div>

          <motion.div
            style={
              shouldReduceMotion
                ? undefined
                : { opacity: formOpacity, y: formY, scale: formScale }
            }
          >
            <div className="rounded-xl border border-black/10 bg-[#f8f6f2] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.16)] sm:p-8">
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.16em] text-ink-subtle">
                Request a proposal
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelClass}>
                      Full name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="Full name"
                      autoComplete="name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className={labelClass}>
                      Company *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      placeholder="Company name"
                      autoComplete="organization"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="name@company.com"
                      autoComplete="email"
                      inputMode="email"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelClass}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="+971 XX XXX XXXX"
                      autoComplete="tel"
                      inputMode="tel"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className={labelClass}>
                    Service *
                  </label>
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
                  <label htmlFor="message" className={labelClass}>
                    How can we help? *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Tell us about your event scope, venue, and goals."
                    autoComplete="off"
                    className={inputClass}
                  />
                </div>

                <input
                  type="text"
                  name="website"
                  autoComplete="off"
                  tabIndex={-1}
                  className="hidden"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-1 h-12 rounded-lg bg-ink text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-black disabled:cursor-not-allowed disabled:bg-ink-muted"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit request'}
                </button>

                {feedbackMessage && (
                  <p
                    className="text-center text-sm"
                    style={{
                      color: isError ? '#dc2626' : isSuccess ? '#059669' : '#6b7280',
                    }}
                    aria-live="polite"
                  >
                    {feedbackMessage}
                  </p>
                )}

                <p className="text-center text-[11px] tracking-[0.02em] text-ink-subtle">
                  Your information is handled confidentially.
                </p>
              </form>
            </div>
          </motion.div>
        </div>

        <motion.div
          style={
            shouldReduceMotion
              ? undefined
              : { opacity: formOpacity, y: backToTopY }
          }
          className="mt-12 flex justify-center"
        >
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 bg-transparent text-[11px] uppercase tracking-[0.12em] text-white/25 transition-colors duration-300 hover:text-white/52"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M7 12V2M3 6l4-4 4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to top
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default FinalCta
