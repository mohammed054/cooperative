import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import { useAnalyticsContext } from '../context/AnalyticsContext'

export const BaseButton = ({
  children,
  onClick,
  className = '',
  type = 'button',
  ariaLabel,
  variant = 'primary',
  size = 'md',
  ...rest
}) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-semibold transition-all focus-visible:ring-2 focus-visible:ring-offset-2 outline-none rounded-sm'

  const variants = {
    primary:
      'bg-white text-black shadow-[0_16px_44px_rgba(0,0,0,0.28)] hover:bg-white/90 hover:shadow-[0_18px_54px_rgba(0,0,0,0.34)] focus-visible:outline-white',
    secondary:
      'border border-white/[0.18] bg-white/[0.08] text-white/90 backdrop-blur hover:bg-white/[0.14] focus-visible:outline-white',
    tertiary:
      'px-3 py-1 text-sm rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none',
    ghost:
      'px-2 py-1 text-sm rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none',
    link: 'text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none rounded-sm px-2 py-1',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-7 py-3.5 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const buttonClasses = [
    baseClasses,
    variants[variant],
    variant !== 'link' ? sizes[size] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={buttonClasses}
      {...rest}
    >
      {children}
    </button>
  )
}

export const ButtonLink = ({
  children,
  to,
  href,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  showArrow = false,
  ariaLabel,
  analyticsLabel,
  ...rest
}) => {
  const { trackCTAClick } = useAnalyticsContext()
  const baseClasses =
    'inline-flex items-center gap-2 font-semibold transition-all focus-visible:ring-2 focus-visible:ring-offset-2 outline-none rounded-sm'

  const variants = {
    primary: 'btn-primary text-sm',
    secondary:
      'px-3 py-1.5 text-xs bg-primary text-white rounded-full hover:bg-primary/90',
    tertiary:
      'text-xs px-3 py-1.5 border border-border bg-surface-2 text-ink rounded-full hover:bg-surface-3',
    ghost:
      'px-2 py-1 text-sm rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none',
    link: 'text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none rounded-sm px-2 py-1',
  }

  const buttonClasses = [baseClasses, variants[variant], className]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {children}
      {showArrow && (
        <FaArrowRight
          className="transition-transform group-hover:translate-x-0.5"
          size={14}
        />
      )}
    </>
  )

  const handleClick = (e) => {
    // Track analytics
    if (analyticsLabel) {
      trackCTAClick(
        typeof children === 'string' ? children : 'CTA Button',
        analyticsLabel,
        to || href
      )
    }
    
    // Call original onClick
    if (onClick) onClick(e)
  }

  const sharedProps = {
    onClick: handleClick,
    'aria-label': ariaLabel,
    className: buttonClasses,
    ...rest,
  }

  if (to) {
    return (
      <Link to={to} {...sharedProps}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} {...sharedProps}>
        {content}
      </a>
    )
  }

  return <button {...sharedProps}>{content}</button>
}

export const IconButton = ({
  children,
  onClick,
  className = '',
  ariaLabel,
  size = 'md',
  ...rest
}) => {
  const sizes = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-3 text-base',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`transition-colors rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary outline-none ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
