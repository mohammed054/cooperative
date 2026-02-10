import * as Sentry from '@sentry/react'

// Initialize Sentry for error monitoring
const initErrorMonitoring = () => {
  // Only initialize in production or if DSN is provided
  if (!import.meta.env.VITE_SENTRY_DSN || import.meta.env.DEV) {
    return
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0, // 10% sampling in production

    // Performance monitoring
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Error classification
    beforeSend(event) {
      // Filter out certain errors
      if (event.exception) {
        const error = event.exception.values?.[0]

        // Ignore certain types of errors
        if (error?.value?.includes('Non-Error promise rejection')) {
          return null
        }

        // Ignore network errors that are expected
        if (error?.value?.includes('NetworkError')) {
          return null
        }
      }

      return event
    },

    // Release tracking
    release: import.meta.env.VITE_APP_VERSION || '1.0.0',

    // User context (will be set when user identifies)
    initialScope: {
      tags: {
        component: 'frontend',
        framework: 'react',
        buildTool: 'vite',
      },
    },
  })
}

// Error tracking utilities
export const trackError = (error, context = {}) => {
  Sentry.withScope(scope => {
    scope.setTag('context', context.context || 'unknown')
    scope.setExtra('additionalInfo', context.additionalInfo || {})

    if (error instanceof Error) {
      Sentry.captureException(error)
    } else {
      Sentry.captureMessage(typeof error === 'string' ? error : String(error))
    }
  })
}

export const trackUserFeedback = feedback => {
  Sentry.captureMessage('User Feedback', {
    level: 'info',
    tags: {
      feedbackType: feedback.type || 'general',
    },
    extra: {
      feedback: feedback.content,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    },
  })
}

export const setUserContext = user => {
  if (!import.meta.env.VITE_SENTRY_DSN) return

  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
    segment: user.segment,
  })
}

export const clearUserContext = () => {
  Sentry.setUser(null)
}

// Performance tracking
export const trackPerformance = (transactionName, data = {}) => {
  if (!import.meta.env.VITE_SENTRY_DSN) return

  // Start a performance span
  const span = Sentry.startSpan({
    name: transactionName,
    op: 'navigation',
  })

  // Add data to span
  Object.keys(data).forEach(key => {
    span.setAttribute(key, data[key])
  })

  return span
}

export default initErrorMonitoring
