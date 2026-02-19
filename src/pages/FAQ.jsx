import { motion, useReducedMotion } from 'framer-motion'
import PageIntro from '../components/PageIntro'
import { faqItems } from '../data/siteData'
import { Link } from 'react-router-dom'
import SceneSignalBand from '../components/SceneSignalBand'
import SceneMobileStack from '../components/SceneMobileStack'
import { CinematicPage, CinematicScene } from '../components/CinematicPage'

const FAQ = () => {
  const shouldReduceMotion = useReducedMotion()

  const preBriefCards = [
    {
      label: 'Inputs',
      title: 'Define non-negotiables',
      description:
        'Guest profile, room goals, and timing constraints help us frame the right production path quickly.',
    },
    {
      label: 'Scope',
      title: 'Clarify ownership',
      description:
        'Knowing who approves technical and creative decisions removes friction during planning.',
    },
    {
      label: 'Timeline',
      title: 'Lock key milestones',
      description:
        'Venue access, rehearsal windows, and event day sequence shape reliable delivery.',
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
        eyebrow="FAQ"
        title="Answers to the questions we hear most."
        description="If you are planning a production and need a clear next step, start here."
        bridge="warm"
      />

      <SceneSignalBand
        eyebrow="Planning signal"
        title="Most production risk is removed by early clarity."
        description="These answers cover the questions that influence timeline stability and room quality."
      />

      <CinematicScene rhythm="medium" bridge="neutral">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <motion.details
                key={item.question}
                variants={variants}
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView="show"
                viewport={{ once: true, margin: '-8%' }}
                transition={{ delay: i * 0.04 }}
                className="group rounded-xl border border-black/[0.06] bg-[#fafaf8] overflow-hidden"
              >
                <summary className="cursor-pointer p-5 text-sm font-medium text-ink list-none flex items-center justify-between hover:bg-black/[0.02] transition-colors">
                  {item.question}
                  <svg 
                    className="w-4 h-4 text-ink-muted transition-transform group-open:rotate-45" 
                    viewBox="0 0 14 14" 
                    fill="none"
                  >
                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </summary>
                <div className="px-5 pb-5 pt-0">
                  <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.65 }}>{item.answer}</p>
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </CinematicScene>

      <SceneMobileStack
        eyebrow="Before you brief us"
        title="Three details that speed up planning."
        description="Quick to scan on mobile, useful for internal alignment before kickoff."
        cards={preBriefCards}
      />

      <CinematicScene rhythm="quiet" bridge="warm">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.p
            variants={variants}
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-8%' }}
            style={{ fontSize: '14px', color: '#888' }}
          >
            Still need clarity?{' '}
            <Link to="/contact" className="font-medium text-ink underline underline-offset-4 hover:text-ink-muted transition-colors">
              Ask our team
            </Link>
            .
          </motion.p>
        </div>
      </CinematicScene>
    </CinematicPage>
  )
}

export default FAQ
