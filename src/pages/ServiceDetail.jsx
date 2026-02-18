import { motion, useReducedMotion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import { caseStudies, services } from '../data/siteData'
import NotFound from './NotFound'
import ScribbleButton from '../components/ScribbleButton'

const ServiceDetail = () => {
  const shouldReduceMotion = useReducedMotion()
  const { slug } = useParams()
  const service = services.find(item => item.slug === slug)

  if (!service) {
    return <NotFound />
  }

  const relatedCase = caseStudies.find(
    study => study.slug === service.relatedCase
  )

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
        eyebrow="Service"
        title={service.title}
        description={service.description}
      >
        <div className="flex flex-wrap gap-3">
          <ScribbleButton to="/contact" className="btn-primary text-sm">
            Request a proposal
          </ScribbleButton>
          <ScribbleButton to="/services" className="btn-secondary text-sm">
            View all services
          </ScribbleButton>
        </div>
      </PageIntro>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-3">
            <motion.div
              variants={variants}
              initial={shouldReduceMotion ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, margin: '-8%' }}
              className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-6"
            >
              <p
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#aaa',
                  fontWeight: 500,
                  marginBottom: '16px',
                }}
              >
                What's included
              </p>
              <ul className="space-y-3">
                {service.includes.map(item => (
                  <li key={item} className="flex gap-3 text-sm text-ink">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink opacity-40" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={variants}
              initial={shouldReduceMotion ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, margin: '-8%' }}
              transition={{ delay: 0.06 }}
              className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-6"
            >
              <p
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#aaa',
                  fontWeight: 500,
                  marginBottom: '16px',
                }}
              >
                Ideal for
              </p>
              <ul className="space-y-3">
                {service.idealFor.map(item => (
                  <li key={item} className="flex gap-3 text-sm text-ink">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink opacity-40" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={variants}
              initial={shouldReduceMotion ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, margin: '-8%' }}
              transition={{ delay: 0.12 }}
              className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-6"
            >
              <p
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#aaa',
                  fontWeight: 500,
                  marginBottom: '16px',
                }}
              >
                Delivery standards
              </p>
              <ul className="space-y-3">
                {service.standards.map(item => (
                  <li key={item} className="flex gap-3 text-sm text-ink">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink opacity-40" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {relatedCase && (
        <section className="border-t border-black/[0.05] bg-[#fafaf8] py-20 sm:py-24">
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
              Related case study
            </motion.p>
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
                    src={relatedCase.image}
                    alt={relatedCase.title}
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
                className="lg:col-span-5"
              >
                <h2
                  className="font-serif"
                  style={{
                    fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
                    fontWeight: 600,
                    color: '#1c1c1c',
                    lineHeight: 1.2,
                    marginBottom: '12px',
                  }}
                >
                  {relatedCase.title}
                </h2>
                <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.6 }}>
                  {relatedCase.summary}
                </p>
                <ScribbleButton
                  to={`/work/${relatedCase.slug}`}
                  className="btn-secondary mt-6 inline-flex text-sm"
                >
                  Read the case study
                </ScribbleButton>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      <section className="border-t border-black/[0.05] bg-white py-20 sm:py-24">
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
            Other services
          </motion.h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services
              .filter(s => s.slug !== service.slug)
              .map((relatedService, i) => (
                <motion.div
                  key={relatedService.slug}
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
                      marginBottom: '8px',
                    }}
                  >
                    {relatedService.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.55 }}>
                    {relatedService.summary}
                  </p>
                  <ScribbleButton
                    to={`/services/${relatedService.slug}`}
                    className="btn-secondary mt-4 text-sm"
                  >
                    Learn more
                  </ScribbleButton>
                </motion.div>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ServiceDetail