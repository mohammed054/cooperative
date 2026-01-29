import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VenueCarousel from './components/VenueCarousel';
import CountrySection from './components/CountrySection';
import ProcessSection from './components/ProcessSection';
import StandardsCarousel from './components/StandardsCarousel';
import ProductsSection from './components/ProductsSection';
import TestimonialsCarousel from './components/TestimonialsCarousel';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <VenueCarousel />
      <CountrySection />
      <ProcessSection />
      <StandardsCarousel />
      <ProductsSection />
      <TestimonialsCarousel />
      <CtaSection />
      <Footer />
    </div>
  );
}

export default App;
