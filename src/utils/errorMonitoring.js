export const trackError = (error, context = {}) => {
  if (typeof window !== 'undefined' && window.__sentryHub) {
    window.__sentryHub.captureException(error, { extra: context })
    return
  }
  console.error('[errorMonitoring]', error, context)
}

export const initErrorMonitoring = () => {
  // Stub for error monitoring initialization
  // Replace with actual Sentry or other error monitoring setup
  if (typeof window !== 'undefined') {
    window.__sentryHub = null
  }
}

export default initErrorMonitoring
