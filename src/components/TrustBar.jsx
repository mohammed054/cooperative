import React, { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

const items = [
  { title: 'UAE coverage',         desc: 'On‑site teams across all major emirates' },
  { title: 'End‑to‑end delivery',  desc: 'Planning, rentals, setup, and show control' },
  { title: 'Curated inventory',    desc: 'AV, staging, lighting, seating' },
  { title: 'Accountable producers',desc: 'Single point of contact throughout' },
]

const TrustBar = () => {
  const shouldReduceMotion = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
  }

  const itemVariants = shouldReduceMotion ? {} : {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section
      ref={ref}
      className="relative bg-white pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24"
    >
      <motion.div
        variants={containerVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate={inView ? 'show' : 'hidden'}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0',
        }}
      >
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            variants={itemVariants}
            style={{
              padding: '28px 0',
              borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.05)' : 'none',
              borderRight: i % 2 === 0 ? '1px solid rgba(0,0,0,0.05)' : 'none',
              paddingLeft:  i % 2 === 0 ? '0'    : '28px',
              paddingRight: i % 2 === 0 ? '28px' : '0',
            }}
            className="lg:border-b-0 lg:border-r lg:last:border-r-0 lg:py-8 lg:px-12 lg:first:pl-0 lg:last:pr-0"
          >
            <p className="text-base lg:text-lg font-semibold text-ink mb-1.5 lg:mb-2">
              {item.title}
            </p>
            <p className="text-sm text-ink-muted leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default TrustBar
