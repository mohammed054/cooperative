import React from 'react';
import GhaimuHeader from './components/GhaimuHeader';
import HeroSection from './components/HeroSection';
import ComparisonIntro from './components/ComparisonIntro';
import ComparisonScroll from './components/ComparisonScroll';
import SolutionsStack from './components/SolutionsStack';
import WhyGhaimu from './components/WhyGhaimu';
import GhaimuProcessSection from './components/GhaimuProcessSection';
import ClientTrust from './components/ClientTrust';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';

function App() {

  return (
    <div className="App">
      <GhaimuHeader />
      <HeroSection />
      <ComparisonIntro />
      <ComparisonScroll />
      <SolutionsStack />
      <WhyGhaimu />
      <GhaimuProcessSection />
      <ClientTrust />
      <FinalCta />
      <Footer />
    </div>
  );
}

export default App;