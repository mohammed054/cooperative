import React from 'react'
import Hero from '../components/Hero'
import TrustBar from '../components/TrustBar'
import ScrollableCardSection from '../components/ScrollableCardSection'
import AnimatedArrow from '../components/AnimatedArrow'
import ProjectDeck from '../components/ProjectDeck'
import CurvedArrow from '../components/CurvedArrow'
import GhaimAEProcessSection from '../components/GhaimAEProcessSection'
import TestimonialsSection from '../components/TestimonialsSection'
import FinalCta from '../components/FinalCta'

const Home = () => {
  return (
    <div className="App home-cinematic">
      <div className="home-scene home-scene-hero">
        <Hero />
      </div>

      <div className="home-scene home-scene-discovery">
        <TrustBar />
        <ScrollableCardSection />
        <AnimatedArrow />
      </div>

      <div className="home-scene home-scene-proof">
        <ProjectDeck />
        <CurvedArrow />
        <GhaimAEProcessSection />
        <TestimonialsSection />
      </div>

      <div className="home-scene home-scene-close">
        <FinalCta />
      </div>
    </div>
  )
}

export default Home
