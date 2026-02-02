      import React from 'react';
      import GhaimAEHeader from './components/GhaimAEHeader';
      import Hero from './components/Hero';
      import ScrollableCardSection from './components/ScrollableCardSection';
      import ProjectDeck from './components/ProjectDeck';
      import GhaimAEProcessSection from './components/GhaimAEProcessSection';
      import FinalCta from './components/FinalCta';
      import Footer from './components/Footer';
      import AnimatedArrow from "./components/AnimatedArrow"; 
      import CurvedArrow from "./components/CurvedArrow";
      import TestimonialsSection from "./components/TestimonialsSection";

      function App() {
        return (
          <div className="App">
            <GhaimAEHeader />
            <Hero />
            <ScrollableCardSection />
            <AnimatedArrow />
            <ProjectDeck />
            <CurvedArrow />
            <GhaimAEProcessSection />
            <TestimonialsSection/>
            <FinalCta />
            <Footer />
          </div>
        );
      }

      export default App;
