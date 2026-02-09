import { useEffect } from 'react'

// Analytics hook for components within Router context
export const useRouterAnalytics = () => {
  // Initialize analytics on mount
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
    if (!measurementId || typeof window.gtag !== 'function') {
      return
    }

    // Configure GA4 if not already configured
    if (window.gtag) {
      window.gtag('config', measurementId, {
        page_location: window.location.href,
        page_title: document.title,
        debug_mode: import.meta.env.DEV,
      })
    }
  }, [])

  // Event tracking functions
  const trackEvent = (
    action,
    category = 'User Interaction',
    label,
    value
  ) => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
    if (!measurementId) return

    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    })
  }

  const trackPageView = (path, title) => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
    if (!measurementId) return

    window.gtag('config', measurementId, {
      page_location: `${window.location.origin}${path}`,
      page_title: title || document.title,
    })
  }

  const trackCTAClick = (
    ctaText,
    ctaLocation,
    destination
  ) => {
    trackEvent('cta_click', 'Engagement', ctaLocation, 1)
    
    // Also track as a custom event for better funnel analysis
    trackEvent('funnel_step', 'Conversion', `${ctaLocation}: ${ctaText}`, 1)
    
    if (destination) {
      trackEvent('outbound_click', 'Navigation', destination, 1)
    }
  }

  const trackFormSubmission = (formName, success) => {
    trackEvent('form_submit', 'Engagement', formName, success ? 1 : 0)
    
    if (success) {
      trackEvent('lead_generated', 'Conversion', formName, 1)
    }
  }

  const trackDownload = (fileName, fileType) => {
    trackEvent('file_download', 'Engagement', `${fileName} (${fileType})`, 1)
  }

  const trackVideoPlay = (videoTitle, videoUrl) => {
    trackEvent('video_start', 'Media', videoTitle, 1)
  }

  const trackSearch = (searchTerm, resultsCount) => {
    trackEvent('search', 'Navigation', searchTerm, resultsCount)
  }

  const trackError = (errorName, errorMessage, errorContext) => {
    trackEvent('error', 'System', `${errorName}: ${errorMessage}`, 1)
  }

  return {
    trackEvent,
    trackPageView,
    trackCTAClick,
    trackFormSubmission,
    trackDownload,
    trackVideoPlay,
    trackSearch,
    trackError,
  }
}

// Simple analytics hook for non-router components
export const useAnalytics = () => {
  // Initialize analytics on mount
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
    if (!measurementId || typeof window.gtag !== 'function') {
      return
    }

    // Configure GA4 if not already configured
    if (window.gtag) {
      window.gtag('config', measurementId, {
        page_location: window.location.href,
        page_title: document.title,
        debug_mode: import.meta.env.DEV,
      })
    }
  }, [])

  // Event tracking functions
  const trackEvent = (
    action,
    category = 'User Interaction',
    label,
    value
  ) => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
    if (!measurementId) return

    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    })
  }

  const trackPageView = (path, title) => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
    if (!measurementId) return

    window.gtag('config', measurementId, {
      page_location: `${window.location.origin}${path}`,
      page_title: title || document.title,
    })
  }

  const trackCTAClick = (
    ctaText,
    ctaLocation,
    destination
  ) => {
    trackEvent('cta_click', 'Engagement', ctaLocation, 1)
    
    // Also track as a custom event for better funnel analysis
    trackEvent('funnel_step', 'Conversion', `${ctaLocation}: ${ctaText}`, 1)
    
    if (destination) {
      trackEvent('outbound_click', 'Navigation', destination, 1)
    }
  }

  const trackFormSubmission = (formName, success) => {
    trackEvent('form_submit', 'Engagement', formName, success ? 1 : 0)
    
    if (success) {
      trackEvent('lead_generated', 'Conversion', formName, 1)
    }
  }

  const trackDownload = (fileName, fileType) => {
    trackEvent('file_download', 'Engagement', `${fileName} (${fileType})`, 1)
  }

  const trackVideoPlay = (videoTitle, videoUrl) => {
    trackEvent('video_start', 'Media', videoTitle, 1)
  }

  const trackSearch = (searchTerm, resultsCount) => {
    trackEvent('search', 'Navigation', searchTerm, resultsCount)
  }

  const trackError = (errorName, errorMessage, errorContext) => {
    trackEvent('error', 'System', `${errorName}: ${errorMessage}`, 1)
  }

  return {
    trackEvent,
    trackPageView,
    trackCTAClick,
    trackFormSubmission,
    trackDownload,
    trackVideoPlay,
    trackSearch,
    trackError,
  }
}