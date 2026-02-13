import React from 'react'
import { useLocation } from 'react-router-dom'
import { useRouterAnalytics } from '../hooks/useAnalytics'
import { AnalyticsContext } from '../context/AnalyticsContextCore'

export const AnalyticsProvider = ({ children }) => {
  const location = useLocation()
  const analytics = useRouterAnalytics()

  // Track page changes when route changes
  React.useEffect(() => {
    if (!analytics) return

    const pathWithQuery = `${location.pathname}${location.search || ''}`
    analytics.trackPageView(pathWithQuery, document.title)
  }, [location.pathname, location.search, analytics])

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  )
}
