import React, { useEffect } from 'react'
import Hero from '../components/Hero'
import TestimonialsSection from '../components/TestimonialsSection'
import FinalCta from '../components/FinalCta'
import SceneNarrativeBreak from '../components/SceneNarrativeBreak'
import SceneNarrativeRelease from '../components/SceneNarrativeRelease'
import SceneExitBridge from '../components/SceneExitBridge'
import SceneCapabilityEstablishment from '../components/SceneCapabilityEstablishment'
import SceneProcessDepth from '../components/SceneProcessDepth'
import SceneBridgeDusk from '../components/SceneBridgeDusk'
import { CinematicPage, CinematicScene } from '../components/CinematicPage'
import { useAnalyticsContext } from '../hooks/useAnalyticsContext'

const TRACKED_SCENES = [
  'scene-01-hero-authority',
  'scene-02-capability-establishment',
  'scene-03-depth-and-process',
  'scene-04-transition-dusk',
  'scene-05-narrative-break',
  'scene-06-narrative-release',
  'scene-07-social-proof-elevation',
  'scene-08-conversion-gravity',
  'scene-09-cinematic-exit',
]

const Home = () => {
  const analytics = useAnalyticsContext()

  useEffect(() => {
    if (typeof window === 'undefined' || !analytics?.trackEvent) return

    const seen = new Set()
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const id = entry.target.id
          if (!id || seen.has(id)) return

          seen.add(id)
          analytics.trackEvent('scene_view', 'Homepage Scene', id, TRACKED_SCENES.indexOf(id) + 1)
        })
      },
      { threshold: 0.45 }
    )

    TRACKED_SCENES.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [analytics])

  return (
    <CinematicPage tone="linen" className="App home-cinematic">
      <CinematicScene
        id="scene-01-hero-authority"
        as="section"
        rhythm="hero"
        bridge="none"
        className="home-scene home-scene-hero !pt-0 !pb-0"
      >
        <Hero />
      </CinematicScene>

      <CinematicScene
        id="scene-02-capability-establishment"
        as="section"
        rhythm="anchor"
        bridge="none"
        className="home-scene home-scene-discovery !pt-0 !pb-0"
      >
        <SceneCapabilityEstablishment />
      </CinematicScene>

      <CinematicScene
        id="scene-03-depth-and-process"
        as="section"
        rhythm="airy"
        bridge="none"
        className="home-scene home-scene-proof !pt-0 !pb-0"
      >
        <SceneProcessDepth />
      </CinematicScene>

      <CinematicScene
        id="scene-04-transition-dusk"
        as="section"
        rhythm="dense"
        bridge="dusk"
        className="home-scene home-scene-transition-dusk !pt-0 !pb-0"
      >
        <SceneBridgeDusk />
      </CinematicScene>

      <CinematicScene
        id="scene-05-narrative-break"
        as="section"
        rhythm="anchor"
        bridge="deep"
        className="home-scene home-scene-narrative !pt-0 !pb-0"
      >
        <SceneNarrativeBreak />
      </CinematicScene>

      <CinematicScene
        id="scene-06-narrative-release"
        as="section"
        rhythm="dense"
        bridge="release"
        className="home-scene home-scene-release !pt-0 !pb-0"
      >
        <SceneNarrativeRelease />
      </CinematicScene>

      <CinematicScene
        id="scene-07-social-proof-elevation"
        as="section"
        rhythm="medium"
        bridge="soft"
        className="home-scene home-scene-testimonials !pt-0 !pb-0"
      >
        <TestimonialsSection />
      </CinematicScene>

      <CinematicScene
        id="scene-08-conversion-gravity"
        as="section"
        rhythm="anchor"
        bridge="deep"
        className="home-scene home-scene-close !pt-0 !pb-0"
      >
        <FinalCta />
      </CinematicScene>

      <CinematicScene
        id="scene-09-cinematic-exit"
        as="section"
        rhythm="quiet"
        bridge="deep"
        className="home-scene home-scene-close !pt-0 !pb-0"
      >
        <SceneExitBridge />
      </CinematicScene>
    </CinematicPage>
  )
}

export default Home
