import React from 'react'

const joinClasses = (...classes) => classes.filter(Boolean).join(' ')

const toMediaRefString = mediaRef =>
  Array.isArray(mediaRef) ? mediaRef.join(',') : String(mediaRef)

const SceneShell = ({
  scene,
  scrollMode,
  pinBehavior,
  className = '',
  layout = 'stacked',
  children,
}) => (
  <div
    className={joinClasses('scene-shell', className)}
    data-scene-shell={scene.id}
    data-scroll-mode={scrollMode}
    data-pin-behavior={pinBehavior}
    data-scene-tone={scene.tone}
    data-scene-length-vh={scene.length}
    data-scene-layout={layout}
    data-media-placeholder-type={scene.mediaPlaceholder.type}
    data-media-placeholder-key={scene.mediaPlaceholder.key}
    data-media-refs={toMediaRefString(scene.mediaPlaceholder.ref)}
  >
    <header className="scene-shell-meta" aria-label={`${scene.id} skeleton metadata`}>
      <p className="scene-shell-id">{scene.id}</p>
      <dl className="scene-shell-meta-grid">
        <div>
          <dt>scrollMode</dt>
          <dd>{scrollMode}</dd>
        </div>
        <div>
          <dt>pinBehavior</dt>
          <dd>{pinBehavior}</dd>
        </div>
        <div>
          <dt>toneLayer</dt>
          <dd>{scene.tone}</dd>
        </div>
        <div>
          <dt>placeholderMedia</dt>
          <dd>{scene.mediaPlaceholder.key}</dd>
        </div>
      </dl>
    </header>
    <div className="scene-shell-body">{children}</div>
  </div>
)

export default SceneShell
