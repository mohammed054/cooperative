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
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  }

  const itemVariants = shouldReduceMotion ? {} : {
    hidden: { opacity: 0, y: 12 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section
      ref={ref}
      className="border-y border-border bg-white pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32"
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
              padding: '36px 0', // much bigger vertical padding
              borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.07)' : 'none',
              borderRight: i % 2 === 0 ? '1px solid rgba(0,0,0,0.07)' : 'none',
              paddingLeft:  i % 2 === 0 ? '0'    : '36px',
              paddingRight: i % 2 === 0 ? '36px' : '0',
            }}
            className="lg:border-b-0 lg:border-r lg:last:border-r-0 lg:py-6 lg:px-10 lg:first:pl-0 lg:last:pr-0"
          >
            <p className="text-lg font-semibold text-ink mb-2">
              {item.title}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default TrustBar
