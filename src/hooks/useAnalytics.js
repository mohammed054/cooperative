import { useEffect, useMemo } from 'react'

const GA_INIT_FLAG = '__ga4Initialized'

const getMeasurementId = () => {
  const value = import.meta.env.VITE_GA_MEASUREMENT_ID
  return typeof value === 'string' ? value.trim() : ''
}

const ensureAnalyticsLoaded = measurementId => {
  if (!measurementId || typeof window === 'undefined') return false

  window.dataLayer = window.dataLayer || []
  if (typeof window.gtag !== 'function') {
    window.gtag = (...args) => window.dataLayer.push(args)
  }

  const scriptId = `ga4-script-${measurementId}`
  const existingScript = document.getElementById(scriptId)
  if (!existingScript) {
    const script = document.createElement('script')
    script.id = scriptId
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)
  }

  if (!window[GA_INIT_FLAG]) {
    window.gtag('js', new Date())
    window.gtag('config', measurementId, {
      send_page_view: false,
      debug_mode: import.meta.env.DEV,
    })
    window[GA_INIT_FLAG] = true
  }

  return true
}

const trackWithGtag = (measurementId, command, ...args) => {
  if (!measurementId || typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  window.gtag(command, ...args)
}

const createAnalyticsApi = measurementId => ({
  trackEvent: (action, category = 'User Interaction', label, value) => {
    trackWithGtag(measurementId, 'event', action, {
      event_category: category,
      event_label: label,
      value,
    })
  },
  trackPageView: (path, title) => {
    const pagePath = path || window.location.pathname
    trackWithGtag(measurementId, 'event', 'page_view', {
      page_title: title || document.title,
      page_location: `${window.location.origin}${pagePath}`,
      page_path: pagePath,
    })
  },
  trackCTAClick: (ctaText, ctaLocation, destination) => {
    trackWithGtag(measurementId, 'event', 'cta_click', {
      event_category: 'Engagement',
      event_label: ctaLocation,
      cta_text: ctaText,
      destination,
      value: 1,
    })

    trackWithGtag(measurementId, 'event', 'funnel_step', {
      event_category: 'Conversion',
      event_label: `${ctaLocation}: ${ctaText}`,
      value: 1,
    })
  },
  trackFormSubmission: (formName, success) => {
    trackWithGtag(measurementId, 'event', 'form_submit', {
      event_category: 'Engagement',
      event_label: formName,
      value: success ? 1 : 0,
    })

    if (success) {
      trackWithGtag(measurementId, 'event', 'lead_generated', {
        event_category: 'Conversion',
        event_label: formName,
        value: 1,
      })
    }
  },
  trackDownload: (fileName, fileType) => {
    trackWithGtag(measurementId, 'event', 'file_download', {
      event_category: 'Engagement',
      event_label: `${fileName} (${fileType})`,
      value: 1,
    })
  },
  trackVideoPlay: videoTitle => {
    trackWithGtag(measurementId, 'event', 'video_start', {
      event_category: 'Media',
      event_label: videoTitle,
      value: 1,
    })
  },
  trackSearch: (searchTerm, resultsCount) => {
    trackWithGtag(measurementId, 'event', 'search', {
      event_category: 'Navigation',
      event_label: searchTerm,
      value: resultsCount,
    })
  },
  trackError: (errorName, errorMessage, errorContext) => {
    trackWithGtag(measurementId, 'event', 'error', {
      event_category: 'System',
      event_label: `${errorName}: ${errorMessage}`,
      error_context: errorContext,
      value: 1,
    })
  },
})

const useAnalyticsBase = () => {
  const measurementId = useMemo(() => getMeasurementId(), [])

  useEffect(() => {
    ensureAnalyticsLoaded(measurementId)
  }, [measurementId])

  return useMemo(() => createAnalyticsApi(measurementId), [measurementId])
}

export const useRouterAnalytics = () => useAnalyticsBase()

export const useAnalytics = () => useAnalyticsBase()
