import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import { AnalyticsContext } from '../context/AnalyticsContextCore'
import './ScribbleButton.css'

const ScribbleButton = ({
  children,
  onClick,
  className = '',
  type = 'button',
  ariaLabel,
  to,
  href,
  target,
  rel,
  showArrow,
  arrowSize = 14,
  analyticsLabel,
  disableScribble = false,
  variant = 'primary',
  tone = 'dark',
  size = 'md',
  ...rest
}) => {
  const analytics = useContext(AnalyticsContext)
  const isLink = Boolean(to)
  const isAnchor = Boolean(href)
  const Component = isLink ? Link : isAnchor ? 'a' : 'button'
  const safeVariant = ['primary', 'secondary', 'outline', 'micro'].includes(
    variant
  )
    ? variant
    : 'primary'
  const safeTone = ['dark', 'light'].includes(tone) ? tone : 'dark'
  const safeSize = ['sm', 'md', 'lg'].includes(size) ? size : 'md'

  const computedShowArrow =
    showArrow ??
    ((isLink || isAnchor) && !(isAnchor && String(href).startsWith('#')))

  const handleClick = event => {
    const destination = to || href
    const textLabel =
      typeof children === 'string' ? children : analyticsLabel || 'CTA'

    if (analytics && (analyticsLabel || destination)) {
      analytics.trackCTAClick?.(
        textLabel,
        analyticsLabel || 'scribble-button',
        destination
      )
    }

    if (onClick) {
      onClick(event)
    }
  }

  const sharedProps = {
    onClick: handleClick,
    'aria-label': ariaLabel,
    className: [
      'scribble-button',
      `sb-variant-${safeVariant}`,
      `sb-tone-${safeTone}`,
      `sb-size-${safeSize}`,
      disableScribble ? 'no-scribble' : '',
      computedShowArrow ? 'group' : '',
      className,
    ]
      .filter(Boolean)
      .join(' '),
    ...rest,
  }

  if (isLink) {
    sharedProps.to = to
  } else if (isAnchor) {
    sharedProps.href = href
    if (target) sharedProps.target = target
    if (rel) sharedProps.rel = rel
    else if (target === '_blank') sharedProps.rel = 'noreferrer'
  } else {
    sharedProps.type = type
  }

  return (
    <Component {...sharedProps}>
      <span className="scribble-text">{children}</span>
      {computedShowArrow ? (
        <FaArrowRight
          className="scribble-icon transition-transform group-hover:translate-x-0.5"
          size={arrowSize}
          aria-hidden="true"
        />
      ) : null}
      {!disableScribble && (
        <svg
          className="scribble-svg"
          viewBox="0 0 760 440"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M34 118c68-72 211-106 360-96c146 10 277 62 340 122c42 82 44 190 5 274c-96 68-239 100-374 88c-142 11-274-20-348-85c-38-84-37-202 17-303z" />
        </svg>
      )}
    </Component>
  )
}

export default ScribbleButton
