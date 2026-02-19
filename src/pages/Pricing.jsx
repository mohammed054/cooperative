import { motion, useReducedMotion } from 'framer-motion'
import PageIntro from '../components/PageIntro'
import { engagementModels } from '../data/siteData'
import ScribbleButton from '../components/ScribbleButton'
import SceneSignalBand from '../components/SceneSignalBand'
import SceneMobileStack from '../components/SceneMobileStack'
import { CinematicPage, CinematicScene } from '../components/CinematicPage'

const Pricing = () => {
  const shouldReduceMotion = useReducedMotion()

  const proposalCards = [
    {
      label: 'Step 01',
      title: 'Brief intake',
      description:
        'We review venue, timeline, and complexity so scope assumptions are explicit.',
    },
    {
      label: 'Step 02',
      title: 'Commercial framing',
      description:
        'Engagement model, responsibilities, and operational boundaries are defined clearly.',
    },
    {
      label: 'Step 03',
      title: 'Delivery baseline',
      description:
        'Your proposal maps resources and sequence against the event timeline.',
    },
  ]

  const variants = shouldReduceMotion ? {} : {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    },
  }

  return (
    <CinematicPage>
      <PageIntro
        eyebrow="Engagement models"
        title="Clear scopes, flexible engagement."
        description="We tailor every proposal to the event, but our engagement models keep expectations clear and approvals fast."
        bridge="warm"
      >
        <ScribbleButton to="/contact" className="btn-primary text-sm">
          Request a proposal
        </ScribbleButton>
      </PageIntro>

      <SceneSignalBand
        eyebrow="Commercial signal"
        title="Pricing clarity starts with scope discipline."
        description="We avoid vague estimates by mapping responsibilities, milestones, and operating assumptions early."
      />

      <CinematicScene rhythm="medium" bridge="neutral">
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
      </CinematicScene>

      <SceneMobileStack
        eyebrow="Proposal flow"
        title="How estimates become execution-ready plans."
        description="Optimized for mobile review by decision-makers and procurement teams."
        cards={proposalCards}
      />
    </CinematicPage>
  )
}

export default Pricing
