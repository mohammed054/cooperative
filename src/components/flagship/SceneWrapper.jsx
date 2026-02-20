import React from 'react'

const joinClasses = (...classes) => classes.filter(Boolean).join(' ')

const SceneWrapper = ({
  id,
  children,
  className = '',
  minHeight = '100vh',
  tone = 'light',
  theme = 'light',
  transitionReady = false,
  style,
}) => (
  <section
    id={id}
    data-scene-id={id}
    data-theme={theme}
    data-transition-ready={String(Boolean(transitionReady))}
    className={joinClasses(
      'flagship-scene',
      `flagship-scene-${tone}`,
      className
    )}
    style={{ '--scene-min-height': minHeight, ...style }}
  >
    <div className="flagship-scene-content">{children}</div>
  </section>
)

export default SceneWrapper
