import React from 'react'

const joinClasses = (...classes) => classes.filter(Boolean).join(' ')

const GradientBridge = ({
  from = 'dark',
  to = 'light',
  className = '',
  height = '20vh',
}) => (
  <div
    aria-hidden="true"
    className={joinClasses(
      'flagship-gradient-bridge',
      `flagship-bridge-${from}-to-${to}`,
      className
    )}
    style={{ '--bridge-height': height }}
  />
)

export default GradientBridge
