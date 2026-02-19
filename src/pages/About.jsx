import { motion, useReducedMotion } from 'framer-motion'
import PageIntro from '../components/PageIntro'
import SceneSignalBand from '../components/SceneSignalBand'
import SceneMobileStack from '../components/SceneMobileStack'
import { CinematicPage, CinematicScene } from '../components/CinematicPage'

const About = () => {
  const shouldReduceMotion = useReducedMotion()

  const values = [
    {
      title: 'Accountability',
      desc: 'One producer owns the timeline from planning through strike.',
    },
    {
      title: 'Precision',
      desc: 'Every cue, cable, and crew role is documented before load-in.',
    },
    {
      title: 'Calm execution',
      desc: 'We keep the room composed so your team can stay client-focused.',
    },
  ]

  const mobilePrinciples = [
    {
      label: 'Leadership',
      title: 'Senior oversight in every phase',
      description:
        'Decision quality improves when the same experienced lead stays close to scope and delivery.',
    },
    {
      label: 'Systems',
      title: 'Operational discipline by default',
      description:
        'Runbooks, approval logs, and rehearsal gates are built into every project.',
    },
    {
      label: 'Behavior',
      title: 'Calm under show pressure',
      description:
        'Our crews communicate quietly and clearly so the room feels in control.',
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
        eyebrow="About"
        title="A production partner built around composure and detail."
        description="Ghaim is a UAE-based event production studio trusted by corporate, government, and hospitality teams. We keep timelines tight, communication clear, and the final experience refined."
        bridge="warm"
      />

      <SceneSignalBand
        eyebrow="Company signal"
        title="We are structured for trust, not volume."
        description="Lean, senior teams keep communication clear and preserve executive confidence."
      />

      <CinematicScene rhythm="medium" bridge="neutral">
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
                How we work
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
                Small, senior-led teams.
              </h2>
              <p
                style={{
                  fontSize: 'clamp(14px, 1.5vw, 16px)',
                  color: '#888',
                  lineHeight: 1.65,
                }}
              >
                We run lean teams with senior oversight at every stage. That means
                faster decisions, cleaner execution, and fewer surprises for your
                stakeholders.
              </p>
            </motion.div>

            <motion.div
              className="lg:col-span-5"
              variants={variants}
              initial={shouldReduceMotion ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, margin: '-8%' }}
            >
              <div className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-6">
                <p style={{ fontSize: '15px', color: '#1c1c1c', lineHeight: 1.6 }}>
                  Our leadership team has managed large-scale conferences,
                  government summits, and VIP hospitality programs across the UAE.
                </p>
                <p style={{ fontSize: '15px', color: '#888', lineHeight: 1.6, marginTop: '16px' }}>
                  We value precise planning, consistent crew communication, and an
                  onsite presence that keeps the room calm.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </CinematicScene>

      <SceneMobileStack
        eyebrow="Core principles"
        title="The operating model behind every room."
        description="A mobile-first summary of the standards clients experience day to day."
        cards={mobilePrinciples}
      />

      <CinematicScene rhythm="airy" bridge="warm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.p
            variants={variants}
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-8%' }}
            style={{
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#aaa',
              fontWeight: 500,
              marginBottom: '16px',
            }}
          >
            Principles
          </motion.p>
          <div className="grid gap-4 md:grid-cols-3">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                variants={variants}
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView="show"
                viewport={{ once: true, margin: '-8%' }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-black/[0.06] bg-white p-6"
              >
                <h3
                  style={{
                    fontSize: '17px',
                    fontWeight: 600,
                    color: '#1c1c1c',
                    marginBottom: '10px',
                  }}
                >
                  {value.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.6 }}>
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </CinematicScene>
    </CinematicPage>
  )
}

export default About
