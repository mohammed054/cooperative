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
}) => {
  return (
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
      {/* No wrapper animation — scenes animate their own content via variants.
          A wrapping opacity-0 fade compounds with scene-level stagger chains
          and creates triple-layer invisible states during scroll-in. */}
      <div className="flagship-scene-content scene-transition-shell">
        {children}
      </div>
    </section>
  )
}

export default SceneWrapper