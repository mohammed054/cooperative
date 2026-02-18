import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import { caseStudies } from '../data/siteData'
import ScribbleButton from '../components/ScribbleButton'
import { CinematicPage, CinematicScene } from '../components/CinematicPage'

const Work = () => {
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
    <CinematicPage>
      <PageIntro
        eyebrow="Work"
        title="Selected projects across the UAE."
        description="A snapshot of recent productions delivered with tight timelines, composed crews, and high-touch execution."
        bridge="warm"
      />

      <CinematicScene rhythm="medium" bridge="neutral">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-3">
            {caseStudies.map((study, i) => (
              <motion.div
                key={study.slug}
                variants={variants}
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView="show"
                viewport={{ once: true, margin: '-8%' }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/work/${study.slug}`}
                  className="group block overflow-hidden rounded-xl border border-black/[0.06] bg-[#fafaf8]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#f0eeec]">
                    <img
                      src={study.image}
                      alt={study.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:brightness-90"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-5">
                    <p
                      style={{
                        fontSize: '9px',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: '#aaa',
                        fontWeight: 500,
                        marginBottom: '8px',
                      }}
                    >
                      {study.location}
                    </p>
                    <h2
                      className="font-serif"
                      style={{
                        fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
                        fontWeight: 600,
                        color: '#1c1c1c',
                        lineHeight: 1.2,
                        marginBottom: '8px',
                      }}
                    >
                      {study.title}
                    </h2>
                    <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.55 }}>
                      {study.summary}
                    </p>
                    <span className="mt-4 inline-flex text-sm font-medium text-ink-muted transition-colors group-hover:text-ink">
                      View case study
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </CinematicScene>

      <CinematicScene rhythm="airy" bridge="warm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            variants={variants}
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-8%' }}
            className="font-serif"
            style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
              fontWeight: 600,
              color: '#1c1c1c',
              lineHeight: 1.15,
              marginBottom: '12px',
            }}
          >
            Planning an event with tight timing?
          </motion.h2>
          <motion.p
            variants={variants}
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-8%' }}
            style={{
              fontSize: 'clamp(14px, 1.5vw, 16px)',
              color: '#888',
              lineHeight: 1.6,
              marginBottom: '24px',
            }}
          >
            Share your scope and we will respond with a clear plan, timeline,
            and assigned producer.
          </motion.p>
          <motion.div
            variants={variants}
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-8%' }}
            className="flex flex-wrap justify-center gap-3"
          >
            <ScribbleButton to="/contact" className="btn-primary text-sm">
              Start a project
            </ScribbleButton>
            <ScribbleButton to="/projects" className="btn-secondary text-sm">
              View the gallery
            </ScribbleButton>
          </motion.div>
        </div>
      </CinematicScene>
    </CinematicPage>
  )
}

export default Work
