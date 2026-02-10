import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnalyticsProvider } from './context'
import GhaimAEHeader from './components/GhaimAEHeader'
import Footer from './components/Footer'
import OurProjects from './components/OurProjects'
import ScrollToTop from './components/ScrollToTop'
import Breadcrumbs from './components/Breadcrumbs'
import SkipToContent from './components/SkipToContent'
import Home from './pages/Home'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Work from './pages/Work'
import CaseStudyDetail from './pages/CaseStudyDetail'
import Process from './pages/Process'
import About from './pages/About'
import Testimonials from './pages/Testimonials'
import Pricing from './pages/Pricing'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'

function App() {
  const basename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')

  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop />
      <SkipToContent />
      <AnalyticsProvider>
        <GhaimAEHeader />
        <Breadcrumbs />
        <main id="main-content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<CaseStudyDetail />} />
            <Route path="/process" element={<Process />} />
            <Route path="/about" element={<About />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/projects" element={<OurProjects />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </AnalyticsProvider>
    </BrowserRouter>
  )
}

export default App
