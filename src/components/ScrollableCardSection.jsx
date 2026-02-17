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

// ── Mobile card — full width, stacks vertically, reveals on scroll ──
const MobileCard = ({ card }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-12% 0px' })
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.a
      ref={ref}
      href={card.href}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
      }}
    >
      {/* Image — full width, 16/9 on mobile for cinematic feel */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: '#f0eeec' }}>
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
        {/* Index — ghost top-left */}
        <span style={{
          position: 'absolute',
          top: '12px',
          left: '14px',
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.16em',
          color: 'rgba(255,255,255,0.55)',
        }}>
          {card.index}
        </span>
      </div>

      {/* Text — compact, scannable */}
      <div style={{ padding: '18px 20px 22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          {/* Eyebrow */}
          <p style={{
            fontSize: '10px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#aaa',
            fontWeight: 500,
            marginBottom: '5px',
          }}>
            {card.subtitle}
          </p>

          {/* Title */}
          <h3 className="font-serif" style={{
            fontSize: '19px',
            fontWeight: 600,
            color: '#1c1c1c',
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
            marginBottom: '6px',
          }}>
            {card.title}
          </h3>

          {/* Description */}
          <p style={{
            fontSize: '13px',
            color: '#888',
            lineHeight: 1.55,
          }}>
            {card.description}
          </p>
        </div>

        {/* Arrow — right side, vertically centered */}
        <div style={{
          flexShrink: 0,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '1px solid rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '18px',
        }}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="#1c1c1c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </motion.a>
  )
}

// ── Desktop card — horizontal sticky scroll ──
const DesktopCard = ({ card }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={card.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: '30vw',
        maxWidth: '460px',
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: '4/3',
        borderRadius: '4px 4px 0 0',
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
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)',
            filter: hovered ? 'brightness(0.75)' : 'brightness(0.88)',
          }}
        />
        <span style={{
          position: 'absolute',
          top: '14px',
          left: '16px',
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.16em',
          color: 'rgba(255,255,255,0.5)',
        }}>
          {card.index}
        </span>
        <div style={{
          position: 'absolute',
          bottom: '14px',
          right: '16px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div style={{
        padding: '20px 0 20px',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}>
        <p style={{
          fontSize: '10px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: '#aaa',
          fontWeight: 500,
          marginBottom: '6px',
        }}>
          {card.subtitle}
        </p>
        <h3 className="font-serif" style={{
          fontSize: '22px',
          fontWeight: 600,
          color: '#1c1c1c',
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
          marginBottom: '8px',
        }}>
          {card.title}
        </h3>
        <p style={{
          fontSize: '13px',
          color: '#888',
          lineHeight: 1.6,
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
  const [isMobile, setIsMobile] = useState(true) // default true — mobile first
  const [progress, setProgress] = useState(0)

  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-5% 0px' })

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Desktop only — scroll-driven horizontal translate
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
    hidden: { opacity: 0, y: 14 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  }

  // ── MOBILE: clean vertical list ──────────────────────────
  if (isMobile) {
    return (
      <section id="services" style={{ background: '#fafaf8' }}>

        {/* Section header */}
        <motion.div
          ref={headerRef}
          variants={headingVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate={headerInView ? 'show' : 'hidden'}
          style={{ padding: '48px 20px 28px' }}
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
            fontSize: 'clamp(1.7rem, 7vw, 2.2rem)',
            fontWeight: 600,
            color: '#1c1c1c',
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
          }}>
            Services built for<br />high‑stakes rooms
          </h2>
        </motion.div>

        {/* Cards — full width, stacked, each reveals on scroll */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
          {cards.map((card, i) => (
            <MobileCard key={i} card={card} />
          ))}
        </div>

      </section>
    )
  }

  // ── DESKTOP: sticky horizontal scroll ────────────────────
  return (
    <section
      id="services"
      ref={sectionRef}
      style={{ position: 'relative', width: '100%', height: '420vh', background: '#fafaf8' }}
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
            padding: '56px 80px 28px',
            flexShrink: 0,
            borderBottom: '1px solid rgba(0,0,0,0.07)',
          }}
        >
          <div>
            <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#aaa', fontWeight: 500, marginBottom: '12px' }}>
              What we do
            </p>
            <h2 className="font-serif" style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 600,
              color: '#1c1c1c',
              lineHeight: 1.04,
              letterSpacing: '-0.02em',
            }}>
              Services built for high‑stakes rooms
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: '#ccc', letterSpacing: '0.04em', paddingBottom: '6px' }}>
            0{cards.length} disciplines
          </p>
        </motion.div>

        {/* Track */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              gap: '48px',
              height: '100%',
              alignItems: 'flex-start',
              paddingLeft: '80px',
              paddingRight: '120px',
              paddingTop: '32px',
              paddingBottom: '40px',
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
        <div style={{ height: '1px', background: 'rgba(0,0,0,0.07)', margin: '0 80px', flexShrink: 0 }}>
          <div style={{
            height: '100%',
            background: '#1c1c1c',
            width: `${progress * 100}%`,
            transition: 'width 0.08s linear',
          }} />
        </div>
        <div style={{ height: '24px', flexShrink: 0 }} />
      </div>
    </section>
  )
}

export default ScrollableCardSection