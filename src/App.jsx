import React from 'react';
import GhaimuHeader from './components/GhaimuHeader';
import Hero from './components/Hero';
import ScrollableCardSection from './components/ScrollableCardSection';
import ProjectDeck from './components/ProjectDeck';
import GhaimuAEProcessSection from './components/GhaimuAEProcessSection';
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
      <ProjectDeck /> {/* Use the correct component here */}
      <WhyGhaimu />
      <GhaimuProcessSection />
      <ClientTrust />
      <FinalCta />
      <Footer />
    </div>
  );
}

export default App;
