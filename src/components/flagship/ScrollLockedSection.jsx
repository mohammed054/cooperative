import React, { useLayoutEffect, useRef } from 'react'
import { motion, useReducedMotion, useMotionValue } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MOBILE_BREAKPOINT } from '../../lib/constants'
import {
  MOTION_TOKEN_CONTRACT,
  parseBezier,
} from '../../motion/motionTokenContract.js'
import { ProgressProvider } from './ProgressContext.jsx'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const joinClasses = (...classes) => classes.filter(Boolean).join(' ')
const AUTHORITY_EASE = parseBezier(MOTION_TOKEN_CONTRACT.easing.authority)

const ScrollLockedSection = ({
  id,
  children,
  className = '',
  tone = 'dark',
  height = '240vh',
  theme = 'light',
  transitionReady = false,
}) => {
  const sectionRef = useRef(null)
  const lockRef = useRef(null)
  const progress = useMotionValue(0)
  const shouldReduceMotion = useReducedMotion()

  useLayoutEffect(() => {
    if (shouldReduceMotion || !sectionRef.current || !lockRef.current) {
      return undefined
    }

    const sectionEl = sectionRef.current
    const lockEl = lockRef.current

    const context = gsap.context(() => {
      ScrollTrigger.matchMedia({
        [`(max-width: ${MOBILE_BREAKPOINT - 1}px)`]: function mobileSetup() {
          progress.set(1)
          gsap.set(lockEl, { opacity: 1 })
        },

        [`(min-width: ${MOBILE_BREAKPOINT}px)`]: function desktopSetup() {
          ScrollTrigger.create({
            trigger: sectionEl,
            start: 'top top',
            end: 'bottom bottom',
            pin: lockEl,
            pinSpacing: false,
            scrub: MOTION_TOKEN_CONTRACT.scroll.inertia + 0.12,
            anticipatePin: 1,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
            onRefresh: self => {
              const nextProgress = Math.min(1, Math.max(0, self.progress))
              progress.set(nextProgress)
            },
            onUpdate: self => {
              const nextProgress = Math.min(1, Math.max(0, self.progress))
              const velocity = Math.abs(self.getVelocity())
              const momentumGain = Math.min(0.26, velocity / 4600)
              const previous = progress.get()
              const blend = 0.2 + momentumGain
              progress.set(previous + (nextProgress - previous) * blend)
            },
          })
        },
      })
    }, sectionEl)

    return () => {
      context.revert()
    }
  }, [shouldReduceMotion, progress])

  const content =
    typeof children === 'function'
      ? children(progress, shouldReduceMotion)
      : children

  return (
    <section
      id={id}
      data-scene-id={id}
      data-theme={theme}
      data-transition-ready={String(Boolean(transitionReady))}
      ref={sectionRef}
      className={joinClasses(
        'flagship-scene',
        'flagship-scene-locked',
        `flagship-scene-${tone}`,
        className
      )}
      style={{ '--scene-min-height': height }}
    >
      <motion.div
        ref={lockRef}
        className="flagship-lock-inner scene-transition-shell"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{
          duration: MOTION_TOKEN_CONTRACT.durations.scene + 0.06,
          ease: AUTHORITY_EASE,
        }}
      >
        <ProgressProvider progress={progress} reduced={shouldReduceMotion}>
          {content}
        </ProgressProvider>
      </motion.div>
    </section>
  )
}

export default ScrollLockedSection
