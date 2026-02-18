import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ScribbleButton from './ScribbleButton'
import { assetUrl } from '../lib/assetUrl'

const projects = [
  assetUrl('images/event1.jpg'),
  assetUrl('images/event2.jpg'),
  assetUrl('images/event3.jpg'),
]

const ProjectDeck = () => {
  const [stack, setStack] = useState(projects)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile width
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleDragEnd = index => {
    const updatedStack = [...stack]
    const [dragged] = updatedStack.splice(index, 1)
    updatedStack.push(dragged)
    setStack(updatedStack)
  }

  // Variants for staggered entrance — weighted, not bouncy
  const stackVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.18,
      },
    },
  }

  const cardVariants = (rotation, offsetY) => ({
    initial: { y: offsetY + 30, rotate: rotation, opacity: 0 },
    animate: {
      y: offsetY,
      rotate: rotation,
      opacity: 1,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
  })

  return (
    <section
      id="rentals"
      className="relative w-full bg-[#fafaf8] overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-20">

          {/* Left Stacked Images */}
          <motion.div
            className={`
              relative flex-shrink-0
              w-[85vw] h-[60vw]
              sm:w-[420px] sm:h-[420px]
              md:w-[500px] md:h-[500px]
              lg:w-[500px] lg:h-[500px]
            `}
            variants={stackVariants}
            initial="initial"
            animate="animate"
          >
            {stack.map((img, index) => {
              const rotation = isMobile
                ? index === 0
                  ? 0
                  : index === 1
                    ? -4
                    : 4
                : index === 0
                  ? 0
                  : index === 1
                    ? -12
                    : 12
              const offsetY = isMobile
                ? index === 0
                  ? 0
                  : index === 1
                    ? 8
                    : -8
                : index === 0
                  ? 0
                  : index === 1
                    ? 28
                    : -28
              const zIndex = stack.length - index

              return (
                <motion.div
                  key={img}
                  drag
                  dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                  onDragEnd={() => handleDragEnd(index)}
                  style={{ zIndex, cursor: 'grab' }}
                  className="absolute top-0 left-0 w-full h-full rounded-2xl border border-black/[0.06]"
                  whileTap={{ cursor: 'grabbing' }}
                  variants={cardVariants(rotation, offsetY)}
                >
                  <img
                    src={img}
                    alt={`Project ${index + 1}`}
                    className="w-full h-full object-cover rounded-2xl select-none pointer-events-none"
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                  />
                </motion.div>
              )
            })}
          </motion.div>

          {/* Right Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="flex-1 text-center lg:text-left max-w-xl"
          >
            <p
              style={{
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#aaa',
                fontWeight: 500,
                marginBottom: '12px',
              }}
            >
              Recent work
            </p>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
                fontWeight: 600,
                color: '#1c1c1c',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: '16px',
              }}
            >
              Rooms built with calm precision.
            </h2>
            <p
              style={{
                fontSize: 'clamp(14px, 1.5vw, 16px)',
                color: '#888',
                lineHeight: 1.65,
                marginBottom: '28px',
              }}
            >
              From investor summits to gala nights, we deliver composed production across every emirate. Our team manages the details so your stakeholders only see the final, polished room.
            </p>
            <div className="flex justify-center lg:justify-start">
              <ScribbleButton
                to="/work"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition hover:bg-ink-muted"
              >
                View case studies
              </ScribbleButton>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default ProjectDeck