import React from 'react'

const joinClasses = (...classes) => classes.filter(Boolean).join(' ')

const SceneWrapper = ({
  id,
  children,
  className = '',
  minHeight = '100vh',
  tone = 'light',
  style,
}) => (
  <section
    id={id}
    data-scene-id={id}
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
