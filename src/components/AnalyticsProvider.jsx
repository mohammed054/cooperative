import React, { createContext, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { useRouterAnalytics } from '../hooks/useAnalytics'

const AnalyticsContext = createContext()

export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalyticsContext must be used within AnalyticsProvider')
  }
  return context
}

export const AnalyticsProvider = ({ children }) => {
  const location = useLocation()
  const analytics = useRouterAnalytics()

  // Track page changes when route changes
  React.useEffect(() => {
    if (!analytics) return

    analytics.trackPageView(location.pathname, document.title)
  }, [location.pathname])

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  )
}
