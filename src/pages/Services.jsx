import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import { services } from '../data/siteData'
import ScribbleButton from '../components/ScribbleButton'
import SceneSignalBand from '../components/SceneSignalBand'
import SceneMobileStack from '../components/SceneMobileStack'
import { CinematicPage, CinematicScene } from '../components/CinematicPage'

const Services = () => {
  const shouldReduceMotion = useReducedMotion()

  const highlights = [
    'Single accountable producer for every project',
    'Lean crews scaled to your show requirements',
    'Clear scopes, transparent timelines, and calm execution',
  ]

  const mobileServiceFlow = [
    {
      label: '01',
      title: 'Scope clarity first',
      description:
        'We confirm room objectives, decision owners, and timeline constraints before execution starts.',
    },
    {
      label: '02',
      title: 'One accountable lead',
      description:
        'A senior producer owns approvals and vendor alignment so information stays consistent.',
    },
    {
      label: '03',
      title: 'Controlled delivery',
      description:
        'Crew, systems, and setup run to one production plan with calm show-day control.',
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
        eyebrow="Services"
        title="Production partners for events that cannot miss."
        description="From full event production to highly technical shows, we build the right team for the scope and stay accountable through show-close."
        bridge="warm"
      >
        <div className="flex flex-wrap gap-3">
          <ScribbleButton to="/contact" className="btn-primary text-sm">
            Request a proposal
          </ScribbleButton>
          <ScribbleButton to="/work" className="btn-secondary text-sm">
            View recent work
          </ScribbleButton>
        </div>
      </PageIntro>

      <SceneSignalBand
        eyebrow="Service architecture"
        title="Every service is engineered to protect decision confidence."
        description="From scope lock through show close, we stage your production so leadership always sees control."
        tone="light"
      />

      <CinematicScene rhythm="medium" bridge="neutral">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service, i) => (
              <motion.div
                key={service.slug}
                variants={variants}
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView="show"
                viewport={{ once: true, margin: '-8%' }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={`/services/${service.slug}`}
                  className="group block rounded-xl border border-black/[0.06] bg-[#fafaf8] p-6 transition-colors hover:border-black/[0.12]"
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
                    {service.title}
                  </p>
                  <h2
                    className="font-serif"
                    style={{
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                      fontWeight: 600,
                      color: '#1c1c1c',
                      lineHeight: 1.2,
                      marginBottom: '10px',
                    }}
                  >
                    {service.summary}
                  </h2>
                  <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.6 }}>
                    {service.description}
                  </p>
                  <span
                    className="mt-5 inline-flex text-sm font-medium text-ink-muted transition-colors group-hover:text-ink"
                  >
                    Learn more
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </CinematicScene>

      <SceneMobileStack
        eyebrow="Mobile overview"
        title="How a Ghaim engagement unfolds."
        description="Designed for quick scanning on mobile, then deeper detail as teams align."
        cards={mobileServiceFlow}
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
                What clients get
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
                An experienced team with clear ownership.
              </h2>
              <p style={{ fontSize: 'clamp(14px, 1.5vw, 16px)', color: '#888', lineHeight: 1.65 }}>
                We stay close to the details so your stakeholders do not have to.
                That means fewer surprises, faster approvals, and a show that
                feels composed.
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
                {highlights.map((item, i) => (
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

export default Services
