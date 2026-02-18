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
      className="relative bg-transparent pt-10 pb-12 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20"
    >
      <motion.div
        variants={containerVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate={inView ? 'show' : 'hidden'}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:gap-4 sm:px-6 lg:grid-cols-4 lg:gap-5 lg:px-8"
      >
        {items.map(item => (
          <motion.div
            key={item.title}
            variants={itemVariants}
            className="rounded-2xl border border-black/[0.06] bg-white/[0.72] p-4 backdrop-blur-[2px] sm:p-5 lg:p-6"
            style={{ minHeight: '132px' }}
          >
            <p className="mb-1.5 text-[15px] font-semibold text-ink sm:text-base lg:mb-2 lg:text-lg">
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
