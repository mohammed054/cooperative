import React from 'react'

const joinClasses = (...classes) => classes.filter(Boolean).join(' ')
const SCENE_BRIDGES = new Set([
  'none',
  'warm',
  'neutral',
  'soft',
  'deep',
  'dusk',
  'release',
])

export const CinematicPage = ({
  children,
  tone = 'linen',
  className = '',
  ...props
}) => (
  <div
    className={joinClasses('cinematic-shell', `cinematic-shell-${tone}`, className)}
    {...props}
  >
    {children}
  </div>
)

export const CinematicScene = ({
  as: Tag = 'section',
  children,
  rhythm = 'medium',
  bridge = 'none',
  className = '',
  ...props
}) => {
  const safeBridge = SCENE_BRIDGES.has(bridge) ? bridge : 'none'

  return (
    <Tag
      className={joinClasses(
        'cinematic-scene',
        `scene-rhythm-${rhythm}`,
        safeBridge !== 'none' && 'scene-bridge',
        safeBridge !== 'none' && `scene-bridge-${safeBridge}`,
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export const CinematicContainer = ({ children, className = '' }) => (
  <div className={joinClasses('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
    {children}
  </div>
)
