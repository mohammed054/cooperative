import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const SceneMobileStack = ({
  id,
  eyebrow = 'Scene',
  title,
  description,
  cards = [],
  tone = 'light',
}) => {
  const shouldReduceMotion = useReducedMotion()

  const sectionTone =
    tone === 'dark'
      ? 'bg-[#121418] text-white'
      : 'bg-gradient-to-b from-[#f7f3ec] via-[#f4efe7] to-[#f1ece5] text-ink'
  const cardTone =
    tone === 'dark'
      ? 'border-white/[0.12] bg-white/[0.04] text-white'
      : 'border-black/[0.07] bg-white/[0.78] text-ink'
  const eyebrowTone = tone === 'dark' ? 'text-white/42' : 'text-[#8d8d8d]'
  const bodyTone = tone === 'dark' ? 'text-white/62' : 'text-ink-muted'
  const cardBodyTone = tone === 'dark' ? 'text-white/66' : 'text-ink-muted'

  const itemVariants = shouldReduceMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 14 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.64, ease: [0.22, 1, 0.36, 1] },
        },
      }

  return (
    <section id={id} className={`relative overflow-hidden ${sectionTone}`}>
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
        <motion.div
          variants={itemVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="max-w-3xl"
        >
          <p className={`text-[10px] font-medium uppercase tracking-[0.22em] ${eyebrowTone}`}>
            {eyebrow}
          </p>
          <h2 className="mt-4 max-w-[20ch] font-serif text-[clamp(1.55rem,5.2vw,2.8rem)] leading-[1.07] tracking-[-0.02em]">
            {title}
          </h2>
          {description && (
            <p className={`mt-4 max-w-[45ch] text-[15px] leading-relaxed ${bodyTone}`}>
              {description}
            </p>
          )}
        </motion.div>

        <div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:mt-10 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {cards.map((card, index) => (
            <motion.article
              key={`${card.title}-${index}`}
              variants={itemVariants}
              initial={shouldReduceMotion ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              transition={shouldReduceMotion ? undefined : { delay: Math.min(0.28, index * 0.06) }}
              className={`min-w-[82%] snap-start rounded-xl border p-5 backdrop-blur-[1.5px] sm:min-w-0 sm:p-6 ${cardTone}`}
            >
              {card.label && (
                <p className={`text-[10px] font-medium uppercase tracking-[0.18em] ${eyebrowTone}`}>
                  {card.label}
                </p>
              )}
              <h3 className="mt-2 font-serif text-[clamp(1.05rem,3.8vw,1.3rem)] leading-[1.12] tracking-[-0.015em]">
                {card.title}
              </h3>
              <p className={`mt-3 text-sm leading-relaxed ${cardBodyTone}`}>
                {card.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SceneMobileStack
