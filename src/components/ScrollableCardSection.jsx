import React, { useRef, useLayoutEffect, useState, useCallback } from 'react'
import { useReducedMotion } from 'framer-motion'
import { assetUrl } from '../lib/assetUrl'

const cards = [
  {
    index: '01',
    title: 'Event Production',
    subtitle: 'Single accountable producer',
    description:
      'Scope, vendor alignment, and show control for high-stakes rooms.',
    img: assetUrl('images/event-planning.png'),
    href: '/services/event-production',
  },
  {
    index: '02',
    title: 'Technical Production',
    subtitle: 'AV, lighting, video systems',
    description: 'Systems design, cueing, and redundancy for complex shows.',
    img: assetUrl('images/av-setup.png'),
    href: '/services/technical-production',
  },
  {
    index: '03',
    title: 'Staging & Scenic',
    subtitle: 'Built to the render',
    description: 'Stage architecture and scenic builds that stay on timeline.',
    img: assetUrl('images/seating.png'),
    href: '/services/staging-scenic',
  },
  {
    index: '04',
    title: 'Furniture & Rentals',
    subtitle: 'Curated inventory',
    description: 'Premium seating, tables, and accessories delivered clean.',
    img: assetUrl('images/lighting-effects.png'),
    href: '/services/furniture-rentals',
  },
  {
    index: '05',
    title: 'Show Control',
    subtitle: 'On-site command',
    description: 'Dedicated producer and crew to keep the room composed.',
    img: assetUrl('images/full-production.png'),
    href: '/process',
  },
  {
    index: '06',
    title: 'Timing & Logistics',
    subtitle: 'No-surprise scheduling',
    description: 'Load-ins, resets, and strike planned around your timeline.',
    img: assetUrl('images/always-on-time.png'),
    href: '/process',
  },
]

const Card = ({ card }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={card.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: '420px',
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: '4/3',
          overflow: 'hidden',
          borderRadius: '12px',
          background: '#f6f4f2',
        }}
      >
        <img
          src={card.img}
          alt={card.title}
          loading="eager"
          decoding="async"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: hovered ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 0.8s cubic-bezier(0.22,1,0.36,1)',
          }}
        />
      </div>

      <div style={{ paddingTop: '18px' }}>
        <p
          style={{
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#aaa',
            marginBottom: '6px',
          }}
        >
          {card.subtitle}
        </p>

        <h3
          className="font-serif"
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#1c1c1c',
            marginBottom: '8px',
          }}
        >
          {card.title}
        </h3>

        <p
          style={{
            fontSize: '14px',
            color: '#777',
            lineHeight: 1.6,
          }}
        >
          {card.description}
        </p>
      </div>
    </a>
  )
}

const ScrollableCardSection = () => {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const rafRef = useRef(null)

  const [translateX, setTranslateX] = useState(0)
  const [progress, setProgress] = useState(0)

  const calculateScroll = useCallback(() => {
    if (!sectionRef.current || !trackRef.current) return

    const section = sectionRef.current
    const track = trackRef.current

    const rect = section.getBoundingClientRect()
    const sectionTop = rect.top
    const sectionHeight = section.offsetHeight
    const windowHeight = window.innerHeight

    // Calculate scroll progress through the section
    const scrollableDistance = sectionHeight - windowHeight
    const scrolled = -sectionTop

    let p = 0
    if (scrollableDistance > 0) {
      p = Math.max(0, Math.min(1, scrolled / scrollableDistance))
    }

    const trackWidth = track.scrollWidth
    const viewportWidth = window.innerWidth
    const maxTranslate = Math.max(
      0,
      trackWidth - viewportWidth + viewportWidth * 0.16
    ) // account for 8% padding on each side

    const newTranslateX = -p * maxTranslate

    setTranslateX(newTranslateX)
    setProgress(p)
  }, [])

  useLayoutEffect(() => {
    let ticking = false

    const onScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          calculateScroll()
          ticking = false
        })
        ticking = true
      }
    }

    // Debounced resize handler
    let resizeTimeout
    const onResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        calculateScroll()
      }, 100)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    // Initial calculation - delay to ensure DOM is ready
    const initTimeout = setTimeout(() => {
      calculateScroll()
    }, 100)

    // Recalculate when images load
    const images = trackRef.current?.querySelectorAll('img') || []
    const handleImageLoad = () => {
      calculateScroll()
    }
    images.forEach(img => {
      if (img.complete) {
        handleImageLoad()
      } else {
        img.addEventListener('load', handleImageLoad)
      }
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      clearTimeout(resizeTimeout)
      clearTimeout(initTimeout)
      images.forEach(img => {
        img.removeEventListener('load', handleImageLoad)
      })
    }
  }, [calculateScroll])

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '380vh',
        background: '#f8f6f4',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '80px 8% 40px',
              flexShrink: 0,
            }}
          >
            <p
              style={{
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#aaa',
                marginBottom: '12px',
              }}
            >
              What we do
            </p>

            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.6rem)',
                fontWeight: 600,
                color: '#1c1c1c',
                lineHeight: 1.1,
              }}
            >
              Services built for high-stakes rooms
            </h2>
          </div>

          <div
            style={{
              flex: 1,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              ref={trackRef}
              style={{
                display: 'flex',
                gap: '60px',
                padding: '0 8%',
                height: '100%',
                alignItems: 'flex-start',
                transform: `translateX(${translateX}px)`,
                transition: shouldReduceMotion
                  ? 'none'
                  : 'transform 0.05s linear',
                willChange: 'transform',
                minWidth: 'fit-content', // Ensure track expands to fit all cards
              }}
            >
              {cards.map((card, i) => (
                <Card key={i} card={card} />
              ))}
            </div>
          </div>

          <div
            style={{
              height: '2px',
              background: 'rgba(0,0,0,0.08)',
              margin: '40px 8%',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress * 100}%`,
                background: '#1c1c1c',
                transition: 'width 0.05s linear',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ScrollableCardSection
