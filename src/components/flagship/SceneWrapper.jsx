import React from 'react'

const joinClasses = (...classes) => classes.filter(Boolean).join(' ')

const SceneWrapper = ({
  id,
  children,
  className = '',
  minHeight = '100vh',
  sticky = false,
  tone = 'light',
  theme = 'light',
  transitionReady = false,
  sceneIndex = 0,
  sceneCount = 1,
  style,
}) => {
  const isFirstScene = sceneIndex === 0
  const isLastScene = sceneIndex === Math.max(0, sceneCount - 1)

  return (
    <section
      id={id}
      data-scene-id={id}
      data-sticky={sticky ? 'true' : 'false'}
      data-scene-first={isFirstScene ? 'true' : 'false'}
      data-scene-last={isLastScene ? 'true' : 'false'}
      data-theme={theme}
      data-transition-ready={String(Boolean(transitionReady))}
      className={joinClasses(
        'flagship-scene',
        `flagship-scene-${tone}`,
        className
      )}
      style={{ '--scene-min-height': minHeight, ...style }}
    >
      <div className="scene-fade-overlay" data-scene-fade-overlay aria-hidden="true" />
      <div
        className={joinClasses(
          'flagship-scene-content scene-transition-shell',
          sticky ? 'scene-sticky-stage' : ''
        )}
      >
        {children}
      </div>
    </section>
  )
}

export default SceneWrapper

