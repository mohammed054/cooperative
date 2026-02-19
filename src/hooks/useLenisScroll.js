import { useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MOTION_TOKEN_CONTRACT } from '../motion/motionTokenContract.js'

const useLenisScroll = () => {
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) {
      return undefined
    }

    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      syncTouch: false,
      lerp: MOTION_TOKEN_CONTRACT.scroll.damping,
      duration: MOTION_TOKEN_CONTRACT.scroll.inertia,
      wheelMultiplier: MOTION_TOKEN_CONTRACT.scroll.wheelMultiplier,
      touchMultiplier: MOTION_TOKEN_CONTRACT.scroll.touchMultiplier,
    })
    const syncScrollTrigger = () => ScrollTrigger.update()
    lenis.on('scroll', syncScrollTrigger)

    let rafId = 0

    const raf = time => {
      lenis.raf(time)
      rafId = window.requestAnimationFrame(raf)
    }

    rafId = window.requestAnimationFrame(raf)

    return () => {
      window.cancelAnimationFrame(rafId)
      lenis.off('scroll', syncScrollTrigger)
      lenis.destroy()
    }
  }, [shouldReduceMotion])
}

export default useLenisScroll
