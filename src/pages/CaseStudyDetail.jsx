import { motion, useReducedMotion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import { caseStudies, services } from '../data/siteData'
import NotFound from './NotFound'
import ScribbleButton from '../components/ScribbleButton'
import { CinematicPage, CinematicScene } from '../components/CinematicPage'

const CaseStudyDetail = () => {
  const shouldReduceMotion = useReducedMotion()
  const { slug } = useParams()
  const study = caseStudies.find(item => item.slug === slug)

  if (!study) {
    return <NotFound />
  }

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
        eyebrow="Case study"
        title={study.title}
        description={study.summary}
        bridge="warm"
      >
        <div className="flex flex-wrap gap-3">
          <ScribbleButton to="/contact" className="btn-primary text-sm">
            Discuss your event
          </ScribbleButton>
          <ScribbleButton to="/work" className="btn-secondary text-sm">
            Back to work
          </ScribbleButton>
        </div>
      </PageIntro>

      <CinematicScene rhythm="medium" bridge="neutral">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <motion.div
              variants={variants}
              initial={shouldReduceMotion ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, margin: '-8%' }}
              className="lg:col-span-7"
            >
              <div className="overflow-hidden rounded-xl border border-black/[0.06]">
                <img
                  src={study.image}
                  alt={study.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </motion.div>

            <motion.div
              variants={variants}
              initial={shouldReduceMotion ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, margin: '-8%' }}
              className="lg:col-span-5 space-y-5"
            >
              <div className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-5">
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
                  Location
                </p>
                <p className="text-sm text-ink">{study.location}</p>
              </div>

              <div className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-5">
                <p
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#aaa',
                    fontWeight: 500,
                    marginBottom: '10px',
                  }}
                >
                  Services
                </p>
                <div className="flex flex-wrap gap-2">
                  {study.services.map(serviceName => {
                    const service = services.find(s => s.title === serviceName)
                    return service ? (
                      <ScribbleButton
                        key={service.slug}
                        to={`/services/${service.slug}`}
                        className="rounded-full border border-black/[0.08] bg-white px-3 py-1 text-xs font-medium text-ink-muted transition-colors hover:border-ink hover:text-ink"
                      >
                        {serviceName}
                      </ScribbleButton>
                    ) : (
                      <span
                        key={serviceName}
                        className="rounded-full border border-black/[0.08] bg-white px-3 py-1 text-xs font-medium text-ink-muted"
                      >
                        {serviceName}
                      </span>
                    )
                  })}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {study.stats.map(stat => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-black/[0.06] bg-[#fafaf8] p-4"
                  >
                    <p
                      style={{
                        fontSize: '9px',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: '#aaa',
                        fontWeight: 500,
                        marginBottom: '6px',
                      }}
                    >
                      {stat.label}
                    </p>
                    <p className="text-base font-semibold text-ink">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </CinematicScene>

      <CinematicScene rhythm="airy" bridge="warm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-3">
            <motion.div
              variants={variants}
              initial={shouldReduceMotion ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, margin: '-8%' }}
              className="rounded-xl border border-black/[0.06] bg-white p-6"
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
                Challenge
              </p>
              <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.65 }}>{study.challenge}</p>
            </motion.div>

            <motion.div
              variants={variants}
              initial={shouldReduceMotion ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, margin: '-8%' }}
              transition={{ delay: 0.06 }}
              className="rounded-xl border border-black/[0.06] bg-white p-6"
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
                Approach
              </p>
              <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.65 }}>{study.approach}</p>
            </motion.div>

            <motion.div
              variants={variants}
              initial={shouldReduceMotion ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, margin: '-8%' }}
              transition={{ delay: 0.12 }}
              className="rounded-xl border border-black/[0.06] bg-white p-6"
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
                Results
              </p>
              <ul className="space-y-2">
                {study.results.map(item => (
                  <li key={item} className="flex gap-3 text-sm text-ink">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink opacity-40" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </CinematicScene>

      {/* Related Case Studies */}
      <CinematicScene rhythm="medium" bridge="neutral">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            variants={variants}
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-8%' }}
            className="font-serif"
            style={{
              fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
              fontWeight: 600,
              color: '#1c1c1c',
              lineHeight: 1.2,
              marginBottom: '24px',
            }}
          >
            Related projects
          </motion.h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies
              .filter(cs => cs.slug !== study.slug)
              .slice(0, 3)
              .map((relatedStudy, i) => (
                <motion.div
                  key={relatedStudy.slug}
                  variants={variants}
                  initial={shouldReduceMotion ? false : 'hidden'}
                  whileInView="show"
                  viewport={{ once: true, margin: '-8%' }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-6"
                >
                  <h3
                    style={{
                      fontSize: '17px',
                      fontWeight: 600,
                      color: '#1c1c1c',
                      marginBottom: '4px',
                    }}
                  >
                    {relatedStudy.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '8px' }}>
                    {relatedStudy.location}
                  </p>
                  <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.55 }}>
                    {relatedStudy.summary}
                  </p>
                  <ScribbleButton
                    to={`/work/${relatedStudy.slug}`}
                    className="btn-secondary mt-4 text-sm"
                  >
                    View case study
                  </ScribbleButton>
                </motion.div>
              ))}
          </div>
          <motion.div
            variants={variants}
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-8%' }}
            className="mt-10 text-center"
          >
            <ScribbleButton to="/work" className="btn-outline">
              View all projects
            </ScribbleButton>
          </motion.div>
        </div>
      </CinematicScene>
    </CinematicPage>
  )
}

export default CaseStudyDetail
