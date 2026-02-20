import React from 'react'

const joinClasses = (...classes) => classes.filter(Boolean).join(' ')

const buildMediaRefValue = media => {
  if (!media) return ''
  if (Array.isArray(media.ref)) return media.ref.join('|')
  return typeof media.ref === 'string' ? media.ref : ''
}

const SceneShell = ({
  scene,
  scrollMode,
  pinBehavior,
  className = '',
  layout = 'stacked',
  children,
}) => {
  const media = scene?.media
  const mediaRefs = buildMediaRefValue(media)

  return (
    <div
      className={joinClasses('scene-shell', className)}
      data-scene-shell={scene?.id || 'unknown-scene'}
      data-scroll-mode={scrollMode}
      data-pin-behavior={pinBehavior}
      data-layout={layout}
      data-media-type={media?.type || ''}
      data-media-key={media?.key || ''}
      data-media-refs={mediaRefs}
    >
      <div className="scene-shell-body">{children}</div>
    </div>
  )
}

export default SceneShell
