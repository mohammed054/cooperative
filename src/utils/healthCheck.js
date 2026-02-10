// Health check endpoint for monitoring
export const config = {
  // Application status
  healthy: true,

  // Version information
  version: '1.0.0',
  environment: import.meta.env.MODE,

  // Dependencies status
  dependencies: {
    react: '19.2.0',
    'react-router-dom': '7.9.1',
    'framer-motion': '12.29.2',
  },

  // Monitoring endpoints
  uptime: {
    url: 'https://ghaim-uae.com',
    statusPage: 'https://status.ghaim-uae.com',
  },

  // Performance thresholds
  performance: {
    responseTime: 2000, // ms
    memoryUsage: 0.8, // 80%
    cpuUsage: 0.7, // 70%
  },
}

// Express.js handler (if using Node.js server)
export const healthCheckHandler = (req, res) => {
  const startTime = Date.now()

  // Basic health check
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: config.version,
    environment: config.environment,
    responseTime: Date.now() - startTime,
  }

  // Detailed health check for monitoring
  if (req.query.detailed === 'true') {
    health.dependencies = config.dependencies
    health.performance = config.performance
  }

  // Check if application is actually healthy
  if (!config.healthy) {
    health.status = 'unhealthy'
    return res.status(503).json(health)
  }

  res.status(200).json(health)
}

// Frontend health check utility
export const checkApplicationHealth = () => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: config.version,
    environment: config.environment,
  }

  // Check critical features
  try {
    // Check if React is loaded
    if (typeof window !== 'undefined' && window.React) {
      health.react = 'loaded'
    } else {
      health.react = 'error'
      health.status = 'degraded'
    }

    // Check if Router is working
    if (typeof window !== 'undefined' && window.location) {
      health.router = 'functional'
    } else {
      health.router = 'error'
      health.status = 'degraded'
    }

    // Check localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem('health-check', 'test')
        window.localStorage.removeItem('health-check')
        health.localStorage = 'functional'
      } catch {
        health.localStorage = 'error'
        health.status = 'degraded'
      }
    }

    // Check network connectivity
    if (typeof window !== 'undefined' && navigator.onLine !== undefined) {
      health.connectivity = navigator.onLine ? 'online' : 'offline'
    }

    // Check performance
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = window.performance.getEntriesByType('navigation')[0]
      if (navigation) {
        health.pageLoad = {
          duration: Math.round(navigation.loadEventEnd - navigation.fetchStart),
          threshold: config.performance.responseTime,
        }

        if (health.pageLoad.duration > config.performance.responseTime) {
          health.status = 'slow'
        }
      }
    }
  } catch (error) {
    health.status = 'error'
    health.error = error.message
  }

  return health
}
