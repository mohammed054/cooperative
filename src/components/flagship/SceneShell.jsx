import React from 'react'

const joinClasses = (...classes) => classes.filter(Boolean).join(' ')

const SceneShell = ({
  scene,
  scrollMode,
  pinBehavior,
  className = '',
  layout = 'stacked',
  children,
}) => (
  <div className={joinClasses('scene-shell', className)}>
    <div className="scene-shell-body">{children}</div>
  </div>
)

export default SceneShell
