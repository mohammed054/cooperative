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
    <div className="App">
      <Hero />
      <TrustBar />
      <ScrollableCardSection />
      <AnimatedArrow />
      <ProjectDeck />
      <CurvedArrow />
      <GhaimAEProcessSection />
      <TestimonialsSection />
      <FinalCta />
    </div>
  )
}

export default Home
