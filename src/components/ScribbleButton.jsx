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
  ...rest
}) => {
  const analytics = useContext(AnalyticsContext)
  const isLink = Boolean(to)
  const isAnchor = Boolean(href)
  const Component = isLink ? Link : isAnchor ? 'a' : 'button'

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
          viewBox="0 0 800 600"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="m138.57143,162.85715c0,2.85713 -3.31494,10.55643 -14.28571,28.57143c-17.10593,28.08949 -34.41788,59.94026 -48.57143,91.42857c-11.53651,25.66605 -19.95927,39.92126 -17.14286,41.42856c10.1547,5.43463 15.39521,-24.46814 28.57143,-47.14285c16.74075,-28.80887 33.53367,-57.81847 52.85714,-78.57143c9.63718,-10.35011 12.85715,-11.42857 12.85715,-7.14285c0,5.71428 -13.76097,37.44887 -31.42857,67.14287c-18.04116,30.32184 -28.12907,56.21991 -32.85715,70c-1.03669,3.02145 -1.15674,4.45496 1.42857,0c11.22343,-19.33997 27.7938,-53.30386 48.57143,-88.57144c17.90973,-30.39966 28.13348,-57.91599 30,-57.14285c5.27931,2.18677 -2.81841,14.29686 -5.71428,24.28571c-7.04868,24.31323 -19.58963,56.85004 -28.57143,90c-8.06478,29.76541 -11.42858,50 -11.42858,54.28571c0,1.42859 7.89288,-8.08691 24.28571,-34.28571c25.47241,-40.70969 51.62663,-87.05276 67.14287,-121.42857c5.78836,-12.82396 6.75026,-16.02017 5.71428,-14.28571c-7.64807,12.80452 -21.26875,39.20662 -41.42857,72.85715c-25.95708,43.32726 -47.09035,90.60573 -50,105.71428c-0.27016,1.40277 1.71101,1.57788 11.42857,-17.14285c16.18852,-31.18695 40.33105,-69.76395 65.71428,-105.71429c13.02818,-18.45184 17.14287,-24.28571 17.14287,-22.85713c0,5.71428 -5.89166,34.21561 -14.28572,55.71428c-11.67609,29.90454 -20.69516,55.28448 -22.85715,71.42856c-0.37924,2.83188 -1.04556,-0.20615 1.42857,-10c7.08484,-28.04532 26.44496,-68.84741 41.42857,-105.71428c12.28912,-30.23712 18.56866,-42.76837 17.14285,-42.85713c-11.49525,-0.71567 -5.377,34.42819 -20,68.57143c-15.36145,35.86745 -31.47975,68.07121 -40,95.71428c-3.46988,11.25769 -3.16359,12.82388 -2.85713,11.42859c4.38786,-19.97784 32.90523,-68.54291 60,-114.28572c18.60446,-31.40903 25.99393,-53.78409 31.42856,-57.14287c1.21524,-0.75105 -0.33899,14.1752 -8.57141,40c-10.43135,32.72278 -25.09058,67.36887 -35.71429,95.71429c-8.09978,21.61124 -11.67644,27.12119 -11.42857,25.71429c2.90115,-16.46741 18.46353,-45.75598 32.85715,-82.85715c12.76158,-32.89438 22.85713,-51.42857 19.99998,-51.42857c-1..." />
        </svg>
      )}
    </Component>
  )
}

export default ScribbleButton
