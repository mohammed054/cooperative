import React from 'react'

const joinClasses = (...classes) => classes.filter(Boolean).join(' ')

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
}) => (
  <Tag
    className={joinClasses(
      'cinematic-scene',
      `scene-rhythm-${rhythm}`,
      bridge !== 'none' && 'scene-bridge',
      bridge !== 'none' && `scene-bridge-${bridge}`,
      className
    )}
    {...props}
  >
    {children}
  </Tag>
)

export const CinematicContainer = ({ children, className = '' }) => (
  <div className={joinClasses('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
    {children}
  </div>
)
