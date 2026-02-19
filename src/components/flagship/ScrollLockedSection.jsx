import React, { useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const joinClasses = (...classes) => classes.filter(Boolean).join(' ')

const ScrollLockedSection = ({
  id,
  children,
  className = '',
  tone = 'dark',
  height = '240vh',
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
        scrub: 0.8,
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
      ref={sectionRef}
      className={joinClasses(
        'flagship-scene',
        'flagship-scene-locked',
        `flagship-scene-${tone}`,
        className
      )}
      style={{ '--scene-min-height': height }}
    >
      <div ref={lockRef} className="flagship-lock-inner">
        {content}
      </div>
    </section>
  )
}

export default ScrollLockedSection
