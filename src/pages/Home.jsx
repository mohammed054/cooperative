import React from 'react'
import Hero from '../components/Hero'
import TestimonialsSection from '../components/TestimonialsSection'
import FinalCta from '../components/FinalCta'
import SceneNarrativeBreak from '../components/SceneNarrativeBreak'
import SceneExitBridge from '../components/SceneExitBridge'
import SceneCapabilityEstablishment from '../components/SceneCapabilityEstablishment'
import SceneProcessDepth from '../components/SceneProcessDepth'
import { CinematicPage, CinematicScene } from '../components/CinematicPage'

const Home = () => {
  return (
    <CinematicPage tone="linen" className="App home-cinematic">
      <CinematicScene id="scene-01-hero-authority" as="section" rhythm="hero" bridge="none" className="home-scene home-scene-hero">
        <Hero />
      </CinematicScene>

      <CinematicScene id="scene-02-capability-establishment" as="section" rhythm="anchor" bridge="soft" className="home-scene home-scene-discovery">
        <SceneCapabilityEstablishment />
      </CinematicScene>

      <CinematicScene id="scene-03-depth-and-process" as="section" rhythm="airy" bridge="neutral" className="home-scene home-scene-proof">
        <SceneProcessDepth />
      </CinematicScene>

      <CinematicScene id="scene-04-narrative-break" as="section" rhythm="anchor" bridge="deep" className="home-scene">
        <SceneNarrativeBreak />
      </CinematicScene>

      <CinematicScene id="scene-05-social-proof-elevation" as="section" rhythm="medium" bridge="soft" className="home-scene home-scene-proof">
        <TestimonialsSection />
      </CinematicScene>

      <CinematicScene id="scene-06-conversion-gravity" as="section" rhythm="anchor" bridge="deep" className="home-scene home-scene-close">
        <FinalCta />
      </CinematicScene>

      <CinematicScene id="scene-07-cinematic-exit" as="section" rhythm="quiet" bridge="deep" className="home-scene home-scene-close">
        <SceneExitBridge />
      </CinematicScene>
    </CinematicPage>
  )
}

export default Home
