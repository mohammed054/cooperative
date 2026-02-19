import { motion, useReducedMotion } from 'framer-motion'
import PageIntro from '../components/PageIntro'
import ScribbleButton from '../components/ScribbleButton'
import { useLeadSubmission } from '../hooks/useLeadSubmission'
import SceneSignalBand from '../components/SceneSignalBand'
import SceneMobileStack from '../components/SceneMobileStack'
import { CinematicPage, CinematicScene } from '../components/CinematicPage'

const Contact = () => {
  const shouldReduceMotion = useReducedMotion()

  const nextStepCards = [
    {
      label: 'Within 24 hours',
      title: 'Initial producer response',
      description:
        'You receive acknowledgement, baseline assumptions, and any missing input requests.',
    },
    {
      label: 'Planning window',
      title: 'Scope and timeline alignment',
      description:
        'We map technical and operational requirements against your delivery deadline.',
    },
    {
      label: 'Proposal issue',
      title: 'Execution-ready recommendation',
      description:
        'Commercial framing, staffing outline, and delivery sequence are shared clearly.',
    },
  ]

  const { submit, isSubmitting, isSuccess, isError, feedbackMessage } =
    useLeadSubmission({ formName: 'contact-page-form' })

  const handleSubmit = async event => {
    event.preventDefault()
    await submit(event.currentTarget)
  }

  const variants = shouldReduceMotion ? {} : {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    },
  }

  const inputClass = `
    mt-2 w-full rounded-lg border border-black/[0.08] bg-white px-4 py-3 text-sm text-ink
    focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/10
    transition-all duration-200 placeholder:text-ink-muted/50
  `

  const labelClass = "block text-sm text-ink"

  return (
    <CinematicPage>
      <PageIntro
        eyebrow="Contact"
        title="Tell us about the event."
        description="Share your timeline, venue, and priorities. We will respond with a clear plan and the right team within 24 hours."
        bridge="warm"
      />

      <SceneSignalBand
        eyebrow="Response signal"
        title="Fast responses are useful only when they are structured."
        description="Our first reply is designed to move your project toward execution, not just start a conversation."
      />

      <CinematicScene rhythm="anchor" bridge="neutral">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <motion.div
              className="lg:col-span-7"
              variants={variants}
              initial={shouldReduceMotion ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, margin: '-8%' }}
            >
              <form
                onSubmit={handleSubmit}
                className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-6 sm:p-8"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className={labelClass}>
                    Full name
                    <input
                      type="text"
                      name="name"
                      className={inputClass}
                      placeholder="Your name"
                      autoComplete="name"
                      required
                    />
                  </label>
                  <label className={labelClass}>
                    Company
                    <input
                      type="text"
                      name="company"
                      className={inputClass}
                      placeholder="Company name"
                      autoComplete="organization"
                    />
                  </label>
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <label className={labelClass}>
                    Email
                    <input
                      type="email"
                      name="email"
                      className={inputClass}
                      placeholder="you@company.com"
                      autoComplete="email"
                      inputMode="email"
                      required
                    />
                  </label>
                  <label className={labelClass}>
                    Phone
                    <input
                      type="tel"
                      name="phone"
                      className={inputClass}
                      placeholder="+971"
                      autoComplete="tel"
                      inputMode="tel"
                    />
                  </label>
                </div>

                <label className="mt-5 block text-sm text-ink">
                  Event date and location
                  <input
                    type="text"
                    name="date"
                    className={inputClass}
                    placeholder="Dates, venue, and city"
                    autoComplete="off"
                    required
                  />
                </label>

                <label className="mt-5 block text-sm text-ink">
                  Scope of work
                  <textarea
                    name="scope"
                    rows="4"
                    className={`${inputClass} resize-none`}
                    placeholder="Tell us about your event goals and production needs."
                    autoComplete="off"
                    required
                  />
                </label>

                <input
                  type="text"
                  name="website"
                  autoComplete="off"
                  tabIndex={-1}
                  className="hidden"
                />

                <ScribbleButton
                  type="submit"
                  showArrow={false}
                  disabled={isSubmitting}
                  className="btn-primary mt-6 text-sm"
                >
                  {isSubmitting ? 'Sending...' : 'Send request'}
                </ScribbleButton>

                <p
                  className={`mt-3 text-xs ${isError ? 'text-red-700' : isSuccess ? 'text-emerald-700' : 'text-ink-subtle'}`}
                  aria-live="polite"
                >
                  {feedbackMessage || ''}
                </p>
                <p className="mt-2 text-xs text-ink-muted">
                  We respond within 24 hours.
                </p>
              </form>
            </motion.div>

            <motion.div
              className="lg:col-span-5 space-y-4"
              variants={variants}
              initial={shouldReduceMotion ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, margin: '-8%' }}
            >
              <div className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-6">
                <p className="text-sm font-semibold text-ink mb-2">Contact</p>
                <p className="text-sm text-ink-muted">hello@ghaimuae.com</p>
                <p className="text-sm text-ink-muted">+971 4 234 5678</p>
              </div>
              <div className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-6">
                <p className="text-sm font-semibold text-ink mb-2">Office</p>
                <p className="text-sm text-ink-muted">Dubai Design District</p>
                <p className="text-sm text-ink-muted">United Arab Emirates</p>
              </div>
              <div className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-6">
                <p className="text-sm font-semibold text-ink mb-2">Availability</p>
                <p className="text-sm text-ink-muted">Monday-Saturday - 9am-7pm</p>
              </div>
            </motion.div>
          </div>
        </div>
      </CinematicScene>

      <SceneMobileStack
        eyebrow="After submission"
        title="What happens next."
        description="A clear post-submit sequence so your team knows exactly what to expect."
        cards={nextStepCards}
      />
    </CinematicPage>
  )
}

export default Contact
