import React, { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { AnalyticsProvider } from './context'
import GhaimAEHeader from './components/GhaimAEHeader'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Breadcrumbs from './components/Breadcrumbs'
import SkipToContent from './components/SkipToContent'
import SiteMetaManager from './components/SiteMetaManager'
import MobileCtaDock from './components/MobileCtaDock'
import AppErrorBoundary from './components/AppErrorBoundary'
import PageTransitionFallback from './components/PageTransitionFallback'
import InitialLoadingScreen from './components/InitialLoadingScreen'
import Home from './pages/Home'
import { trackError } from './utils/errorMonitoring'
import {
  loadAbout,
  loadCaseStudyDetail,
  loadContact,
  loadFaq,
  loadNotFound,
  loadPricing,
  loadPrivacy,
  loadProcess,
  loadProjects,
  loadServiceDetail,
  loadServices,
  loadTerms,
  loadTestimonials,
  loadWork,
  preloadHighIntentRoutes,
} from './utils/routePreload'

const Services = lazy(loadServices)
const ServiceDetail = lazy(loadServiceDetail)
const Work = lazy(loadWork)
const CaseStudyDetail = lazy(loadCaseStudyDetail)
const Process = lazy(loadProcess)
const About = lazy(loadAbout)
const Testimonials = lazy(loadTestimonials)
const Pricing = lazy(loadPricing)
const FAQ = lazy(loadFaq)
const Contact = lazy(loadContact)
const Privacy = lazy(loadPrivacy)
const Terms = lazy(loadTerms)
const NotFound = lazy(loadNotFound)
const OurProjects = lazy(loadProjects)

const AnimatedRoutes = () => {
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) return

    const runPreload = () => {
      preloadHighIntentRoutes()
    }

    let idleId = null
    let timeoutId = null

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(runPreload, { timeout: 2000 })
    } else {
      timeoutId = window.setTimeout(runPreload, 1200)
    }

    return () => {
      if (idleId && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId)
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [shouldReduceMotion])

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.34, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <Suspense fallback={<PageTransitionFallback />}>
          <Routes location={location}>
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
        </Suspense>
      </motion.div>
    </AnimatePresence>
  )
}

const FooterGate = () => {
  const location = useLocation()

  if (location.pathname === '/') {
    return null
  }

  return <Footer />
}

function App() {
  const shouldReduceMotion = useReducedMotion()
  const [showInitialLoader, setShowInitialLoader] = useState(() => {
    // On server-side, don't show the loader
    if (typeof window === 'undefined') {
      return false
    }
    // On client-side, show the loader initially
    return true
  })
  const basename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')

  useEffect(() => {
    // Skip if already not showing (e.g., server-side render)
    if (!showInitialLoader) {
      return
    }

    const minimumDurationMs = shouldReduceMotion ? 0 : 700
    const fallbackTimeoutMs = 3200
    const start = Date.now()
    let isSettled = false
    let minimumTimerId = null
    let fallbackTimerId = null

    const completeLoading = () => {
      if (isSettled) return
      isSettled = true

      const elapsed = Date.now() - start
      const remainingDelay = Math.max(0, minimumDurationMs - elapsed)

      minimumTimerId = window.setTimeout(() => {
        setShowInitialLoader(false)
      }, remainingDelay)
    }

    const handleWindowLoad = () => {
      completeLoading()
    }

    if (document.readyState === 'complete') {
      completeLoading()
    } else {
      window.addEventListener('load', handleWindowLoad, { once: true })
    }

    fallbackTimerId = window.setTimeout(completeLoading, fallbackTimeoutMs)

    return () => {
      window.removeEventListener('load', handleWindowLoad)
      if (minimumTimerId) window.clearTimeout(minimumTimerId)
      if (fallbackTimerId) window.clearTimeout(fallbackTimerId)
    }
  }, [shouldReduceMotion, showInitialLoader])

  if (showInitialLoader) {
    return (
      <AnimatePresence mode="wait">
        <InitialLoadingScreen shouldReduceMotion={shouldReduceMotion} />
      </AnimatePresence>
    )
  }

  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop />
      <SkipToContent />
      <AnalyticsProvider>
        <SiteMetaManager />
        <GhaimAEHeader />
        <Breadcrumbs />
        <AppErrorBoundary
          onError={(error, errorInfo) =>
            trackError(error, {
              context: 'AppRender',
              additionalInfo: {
                componentStack: errorInfo?.componentStack || '',
              },
            })
          }
        >
          <main id="main-content" tabIndex={-1} className="pb-24 md:pb-0">
            <AnimatedRoutes />
          </main>
        </AppErrorBoundary>
        <FooterGate />
        <MobileCtaDock />
      </AnalyticsProvider>
    </BrowserRouter>
  )
}

export default App
