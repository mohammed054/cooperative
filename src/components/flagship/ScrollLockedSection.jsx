import React, { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MOTION_TOKEN_CONTRACT, parseBezier } from '../../motion/motionTokenContract.js'

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
  const [progress, setProgress] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useLayoutEffect(() => {
    if (shouldReduceMotion || !sectionRef.current || !lockRef.current) {
      return undefined
    }

    const sectionEl = sectionRef.current
    const lockEl = lockRef.current

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top top',
        end: 'bottom bottom',
        pin: lockEl,
        pinSpacing: false,
        scrub: 1.12,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: self => {
          setProgress(self.progress)
        },
      })
    }, sectionEl)

    return () => {
      context.revert()
    }
  }, [shouldReduceMotion])

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
        {content}
      </motion.div>
    </section>
  )
}

export default ScrollLockedSection
