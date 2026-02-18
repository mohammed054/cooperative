import { motion, useReducedMotion } from 'framer-motion'
import PageIntro from '../components/PageIntro'
import { engagementModels } from '../data/siteData'
import ScribbleButton from '../components/ScribbleButton'

const Pricing = () => {
  const shouldReduceMotion = useReducedMotion()

  const variants = shouldReduceMotion ? {} : {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    },
  }

  return (
    <div className="bg-[#fafaf8]">
      <PageIntro
        eyebrow="Engagement models"
        title="Clear scopes, flexible engagement."
        description="We tailor every proposal to the event, but our engagement models keep expectations clear and approvals fast."
      >
        <ScribbleButton to="/contact" className="btn-primary text-sm">
          Request a proposal
        </ScribbleButton>
      </PageIntro>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-3">
            {engagementModels.map((model, i) => (
              <motion.div
                key={model.title}
                variants={variants}
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView="show"
                viewport={{ once: true, margin: '-8%' }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-6"
              >
                <h2
                  className="font-serif"
                  style={{
                    fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                    fontWeight: 600,
                    color: '#1c1c1c',
                    lineHeight: 1.2,
                    marginBottom: '12px',
                  }}
                >
                  {model.title}
                </h2>
                <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.6, marginBottom: '20px' }}>
                  {model.description}
                </p>
                <ul className="space-y-2">
                  {model.details.map(detail => (
                    <li key={detail} className="flex gap-3 text-sm text-ink">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink opacity-40" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={variants}
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-8%' }}
            className="mt-8 rounded-xl border border-black/[0.06] bg-[#fafaf8] p-6"
          >
            <p className="font-medium text-ink mb-2">Need a custom scope?</p>
            <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.6 }}>
              We build proposals around your event size, venue constraints, and
              show complexity. Share your dates and we will respond within 24
              hours.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Pricing