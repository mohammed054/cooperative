import React from "react";
import Hero from "../components/Hero";
import TrustBar from "../components/TrustBar";
import ScrollableCardSection from "../components/ScrollableCardSection";
import ProjectDeck from "../components/ProjectDeck";
import GhaimAEProcessSection from "../components/GhaimAEProcessSection";
import FinalCta from "../components/FinalCta";
import AnimatedArrow from "../components/AnimatedArrow";
import CurvedArrow from "../components/CurvedArrow";
import TestimonialsSection from "../components/TestimonialsSection";

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
  );
};

export default Home;
