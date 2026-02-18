import React, { useRef, useEffect, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { assetUrl } from '../lib/assetUrl'

const cards = [
  {
    index: '01',
    title: 'Event Production',
    subtitle: 'Single accountable producer',
    description: 'Scope, vendor alignment, and show control for high‑stakes rooms.',
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
    subtitle: 'On‑site command',
    description: 'Dedicated producer and crew to keep the room composed.',
    img: assetUrl('images/full-production.png'),
    href: '/process',
  },
  {
    index: '06',
    title: 'Timing & Logistics',
    subtitle: 'No‑surprise scheduling',
    description: 'Load‑ins, resets, and strike planned around your timeline.',
    img: assetUrl('images/always-on-time.png'),
    href: '/process',
  },
]

// ── Mobile card ──
const MobileCard = ({ card }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-12% 0px' })
  const shouldReduceMotion = useReducedMotion()
  return (
    <motion.a
      ref={ref}
      href={card.href}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="block h-full"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRadius: '14px',
          border: '1px solid rgba(0,0,0,0.06)',
          background: 'rgba(255,255,255,0.76)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4 / 3',
            overflow: 'hidden',
            background: '#f0eeec',
          }}
        >
          <img
            src={card.img}
            alt={card.title}
            loading="lazy"
            decoding="async"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0, padding: '14px 12px 12px' }}>
          <p
            style={{
              fontSize: '9px',
              letterSpacing: '0.13em',
              textTransform: 'uppercase',
              color: '#aaa',
              fontWeight: 500,
              marginBottom: '5px',
            }}
          >
            {card.subtitle}
          </p>
          <h3
            className="font-serif"
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#1c1c1c',
              lineHeight: 1.18,
              letterSpacing: '-0.01em',
              marginBottom: '6px',
            }}
          >
            {card.title}
          </h3>
          <p
            style={{
              fontSize: '12px',
              color: '#888',
              lineHeight: 1.45,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {card.description}
          </p>
        </div>
        <div style={{ padding: '0 12px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '10px', color: 'rgba(0,0,0,0.28)', letterSpacing: '0.12em' }}>{card.index}</span>
          <span
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              border: '1px solid rgba(0,0,0,0.08)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="#1c1c1c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </motion.a>
  )
}
// Desktop card
const DesktopCard = ({ card }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={card.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: '28vw',
        maxWidth: '420px',
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: '4/3',
        borderRadius: '4px',
        background: '#f0eeec',
      }}>
        <img
          src={card.img}
          alt={card.title}
          loading="lazy"
          decoding="async"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: hovered ? 'scale(1.02)' : 'scale(1)',
            transition: 'transform 0.8s cubic-bezier(0.22,1,0.36,1)',
            filter: hovered ? 'brightness(0.82)' : 'brightness(0.9)',
          }}
        />
        <span style={{
          position: 'absolute',
          top: '12px',
          left: '14px',
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.16em',
          color: 'rgba(255,255,255,0.45)',
        }}>
          {card.index}
        </span>
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '14px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(4px)',
          transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div style={{
        padding: '16px 0',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <p style={{
          fontSize: '9px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#aaa',
          fontWeight: 500,
          marginBottom: '5px',
        }}>
          {card.subtitle}
        </p>
        <h3 className="font-serif" style={{
          fontSize: '20px',
          fontWeight: 600,
          color: '#1c1c1c',
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
          marginBottom: '6px',
        }}>
          {card.title}
        </h3>
        <p style={{
          fontSize: '13px',
          color: '#888',
          lineHeight: 1.55,
        }}>
          {card.description}
        </p>
      </div>
    </a>
  )
}

// ── Main component ───────────────────────────────────────
const ScrollableCardSection = () => {
  const shouldReduceMotion = useReducedMotion()
  const trackRef = useRef(null)
  const sectionRef = useRef(null)
  const [translateX, setTranslateX] = useState(0)
  const [isMobile, setIsMobile] = useState(true)
  const [progress, setProgress] = useState(0)

  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-5% 0px' })

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Desktop scroll
  useEffect(() => {
    if (isMobile) return
    let ticking = false

    const onScroll = () => {
      if (!sectionRef.current || !trackRef.current) return
      if (!ticking) {
        requestAnimationFrame(() => {
          const section = sectionRef.current
          const track = trackRef.current
          const container = track.parentElement
          if (!container) return

          const rect = section.getBoundingClientRect()
          const scrollableHeight = Math.max(0, section.offsetHeight - window.innerHeight)
          const offsetStart = 0.02
          let p = 0
          if (scrollableHeight > 0) {
            p = Math.max(0, Math.min(1, (-rect.top / scrollableHeight - offsetStart) / (1 - offsetStart)))
          }

          const maxTranslate = Math.max(0, track.scrollWidth - container.clientWidth)
          setTranslateX(-p * maxTranslate)
          setProgress(p)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobile])

  const headingVariants = shouldReduceMotion ? {} : {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  }

  // ── MOBILE ──
  if (isMobile) {
    return (
      <section id="services" className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div
            ref={headerRef}
            variants={headingVariants}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate={headerInView ? 'show' : 'hidden'}
          >
            <p style={{
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#aaa',
              fontWeight: 500,
              marginBottom: '10px',
            }}>
              What we do
            </p>
            <h2 className="font-serif" style={{
              fontSize: 'clamp(1.5rem, 6vw, 2rem)',
              fontWeight: 600,
              color: '#1c1c1c',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '8px',
            }}>
              Services built for high‑stakes rooms
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#888',
              lineHeight: 1.55,
              marginBottom: '20px',
            }}>
              End-to-end production with single-point accountability.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {cards.map((card, i) => (
              <MobileCard key={i} card={card} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // ── DESKTOP ──
  return (
    <section
      id="services"
      ref={sectionRef}
      style={{ position: 'relative', width: '100%', height: '380vh', background: 'transparent' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100svh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <motion.div
          ref={headerRef}
          variants={headingVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate={headerInView ? 'show' : 'hidden'}
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '48px max(5%, 32px) 24px',
            flexShrink: 0,
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            maxWidth: '1280px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <div>
            <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#aaa', fontWeight: 500, marginBottom: '10px' }}>
              What we do
            </p>
            <h2 className="font-serif" style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              fontWeight: 600,
              color: '#1c1c1c',
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
            }}>
              Services built for high‑stakes rooms
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: '#bbb', letterSpacing: '0.04em', paddingBottom: '4px' }}>
            0{cards.length} disciplines
          </p>
        </motion.div>

        {/* Track */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              gap: '40px',
              height: '100%',
              alignItems: 'flex-start',
              padding: '28px max(5%, 32px) 32px',
              transform: `translateX(${translateX}px)`,
              transition: shouldReduceMotion ? 'none' : 'transform 0.05s linear',
              willChange: 'transform',
            }}
          >
            {cards.map((card, i) => (
              <DesktopCard key={i} card={card} />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '0 max(5%, 32px)', flexShrink: 0 }}>
          <div style={{
            height: '100%',
            background: '#1c1c1c',
            width: `${progress * 100}%`,
            transition: 'width 0.08s linear',
          }} />
        </div>
        <div style={{ height: '20px', flexShrink: 0 }} />
      </div>
    </section>
  )
}

export default ScrollableCardSection
