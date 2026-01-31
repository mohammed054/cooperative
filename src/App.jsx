      import React from 'react';
      import GhaimAEHeader from './components/GhaimAEHeader';
      import Hero from './components/Hero';
      import ScrollableCardSection from './components/ScrollableCardSection';
      import ProjectDeck from './components/ProjectDeck';
      import GhaimAEProcessSection from './components/GhaimAEProcessSection';
      import FinalCta from './components/FinalCta';
      import Footer from './components/Footer';

      function App() {
        return (
          <div className="App">
            <GhaimAEHeader />
            <Hero />
            <ScrollableCardSection />
            <ProjectDeck />
            <GhaimAEProcessSection />
            <FinalCta />
            <Footer />
          </div>
        );
      }

      export default App;
