import React from 'react';
import GhaimuHeader from './components/GhaimuHeader';
import Hero from './components/Hero'; // NEW
import ScrollableCardSection from './components/ScrollableCardSection'; // NEW
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
      <Hero />
      <ScrollableCardSection />
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
