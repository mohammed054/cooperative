import { motion, useReducedMotion } from 'framer-motion'
import PageIntro from '../components/PageIntro'
import ScribbleButton from '../components/ScribbleButton'
import SceneSignalBand from '../components/SceneSignalBand'
import SceneMobileStack from '../components/SceneMobileStack'
import { CinematicPage, CinematicScene } from '../components/CinematicPage'

const Process = () => {
  const shouldReduceMotion = useReducedMotion()

  const steps = [
    {
      title: 'Scope & alignment',
      desc: 'We confirm goals, audiences, and technical requirements. You leave with a clear scope and a workable timeline.',
    },
    {
      title: 'Design & planning',
      desc: 'Systems, vendor coordination, and run-of-show are locked in with transparent approvals.',
    },
    {
      title: 'Build & rehearsal',
      desc: 'We load in, test every system, and rehearse critical cues before doors open.',
    },
    {
      title: 'Show control',
      desc: 'A dedicated producer runs the event so your team can focus on guests and stakeholders.',
    },
  ]

  const cadence = [
    'Weekly check-ins with stakeholders and venue teams',
    'Production schedule shared and updated in real time',
    'Single point of escalation for show-day decisions',
  ]

  const mobileCadenceCards = [
    {
      label: 'Cadence',
      title: 'Weekly stakeholder rhythm',
      description:
        'Critical decisions stay visible and unresolved points are closed before they affect delivery.',
    },
    {
      label: 'Control',
      title: 'Runbook-driven operations',
      description:
        'Venue, vendors, and crew execute against one documented production sequence.',
    },
    {
      label: 'Assurance',
      title: 'Escalation path is explicit',
      description:
        'On show day, decision authority is clear so adjustments stay fast and calm.',
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
        eyebrow="Process"
        title="A disciplined process that keeps the room calm."
        description="We run every project with tight approvals, clear handoffs, and a focused crew. The goal is simple: keep the timeline clean and the experience premium."
        bridge="warm"
      >
        <ScribbleButton to="/contact" className="btn-primary text-sm">
          Start a project
        </ScribbleButton>
      </PageIntro>

      <SceneSignalBand
        eyebrow="Process signal"
        title="Composure on event day is built weeks before the room opens."
        description="We front-load alignment so technical and production teams can execute without friction."
      />

      <CinematicScene rhythm="medium" bridge="neutral">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                variants={variants}
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView="show"
                viewport={{ once: true, margin: '-8%' }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-6"
              >
                <p
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#aaa',
                    fontWeight: 500,
                    marginBottom: '12px',
                  }}
                >
                  Step 0{i + 1}
                </p>
                <h2
                  className="font-serif"
                  style={{
                    fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                    fontWeight: 600,
                    color: '#1c1c1c',
                    lineHeight: 1.2,
                    marginBottom: '10px',
                  }}
                >
                  {step.title}
                </h2>
                <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </CinematicScene>

      <SceneMobileStack
        eyebrow="Operating cadence"
        title="How your team experiences our process."
        description="Structured for mobile-first scanning while stakeholders are moving between meetings."
        cards={mobileCadenceCards}
      />

      <CinematicScene rhythm="airy" bridge="warm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <motion.div
              className="lg:col-span-7"
              variants={variants}
              initial={shouldReduceMotion ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, margin: '-8%' }}
            >
              <p
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#aaa',
                  fontWeight: 500,
                  marginBottom: '12px',
                }}
              >
                Communication
              </p>
              <h2
                className="font-serif"
                style={{
                  fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                  fontWeight: 600,
                  color: '#1c1c1c',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  marginBottom: '16px',
                }}
              >
                No surprises, no loose ends.
              </h2>
              <p style={{ fontSize: 'clamp(14px, 1.5vw, 16px)', color: '#888', lineHeight: 1.65 }}>
                We keep your internal team, venue, and vendors aligned with a
                consistent cadence and clear documentation.
              </p>
            </motion.div>

            <motion.div
              className="lg:col-span-5"
              variants={variants}
              initial={shouldReduceMotion ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, margin: '-8%' }}
            >
              <ul className="rounded-xl border border-black/[0.06] bg-white p-6">
                {cadence.map((item, i) => (
                  <li
                    key={item}
                    className={`flex gap-3 text-sm ${i > 0 ? 'mt-3 pt-3 border-t border-black/[0.05]' : ''}`}
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink opacity-40" />
                    <span className="text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </CinematicScene>
    </CinematicPage>
  )
}

export default Process
