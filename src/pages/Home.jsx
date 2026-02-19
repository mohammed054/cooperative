import React from 'react'
import Hero from '../components/Hero'
import TestimonialsSection from '../components/TestimonialsSection'
import FinalCta from '../components/FinalCta'
import SceneNarrativeBreak from '../components/SceneNarrativeBreak'
import SceneNarrativeRelease from '../components/SceneNarrativeRelease'
import SceneExitBridge from '../components/SceneExitBridge'
import SceneCapabilityEstablishment from '../components/SceneCapabilityEstablishment'
import SceneProcessDepth from '../components/SceneProcessDepth'
import { CinematicPage, CinematicScene } from '../components/CinematicPage'

const Home = () => {
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
        id="scene-04-narrative-break"
        as="section"
        rhythm="anchor"
        bridge="none"
        className="home-scene home-scene-narrative !pt-0 !pb-0"
      >
        <SceneNarrativeBreak />
      </CinematicScene>

      <CinematicScene
        id="scene-05-narrative-release"
        as="section"
        rhythm="dense"
        bridge="none"
        className="home-scene home-scene-release !pt-0 !pb-0"
      >
        <SceneNarrativeRelease />
      </CinematicScene>

      <CinematicScene
        id="scene-06-social-proof-elevation"
        as="section"
        rhythm="medium"
        bridge="none"
        className="home-scene home-scene-testimonials !pt-0 !pb-0"
      >
        <TestimonialsSection />
      </CinematicScene>

      <CinematicScene
        id="scene-07-conversion-gravity"
        as="section"
        rhythm="anchor"
        bridge="none"
        className="home-scene home-scene-close !pt-0 !pb-0"
      >
        <FinalCta />
      </CinematicScene>

      <CinematicScene
        id="scene-08-cinematic-exit"
        as="section"
        rhythm="quiet"
        bridge="none"
        className="home-scene home-scene-close !pt-0 !pb-0"
      >
        <SceneExitBridge />
      </CinematicScene>
    </CinematicPage>
  )
}

export default Home
