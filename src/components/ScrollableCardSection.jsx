import React, { useRef, useEffect, useState } from 'react'
import { assetUrl } from '../lib/assetUrl'
import ScribbleButton from './ScribbleButton'

const cards = [
  {
    title: 'Event Production',
    subtitle: 'Single accountable producer',
    description:
      'Scope, vendor alignment, and show control for high‑stakes rooms.',
    img: assetUrl('images/event-planning.png'),
    href: '/services/event-production',
  },
  {
    title: 'Technical Production',
    subtitle: 'AV, lighting, video systems',
    description: 'Systems design, cueing, and redundancy for complex shows.',
    img: assetUrl('images/av-setup.png'),
    href: '/services/technical-production',
  },
  {
    title: 'Staging & Scenic',
    subtitle: 'Built to the render',
    description: 'Stage architecture and scenic builds that stay on timeline.',
    img: assetUrl('images/seating.png'),
    href: '/services/staging-scenic',
  },
  {
    title: 'Furniture & Rentals',
    subtitle: 'Curated inventory',
    description: 'Premium seating, tables, and accessories delivered clean.',
    img: assetUrl('images/lighting-effects.png'),
    href: '/services/furniture-rentals',
  },
  {
    title: 'Show Control',
    subtitle: 'On‑site command',
    description: 'Dedicated producer and crew to keep the room composed.',
    img: assetUrl('images/full-production.png'),
    href: '/process',
  },
  {
    title: 'Timing & Logistics',
    subtitle: 'No‑surprise scheduling',
    description: 'Load‑ins, resets, and strike planned around your timeline.',
    img: assetUrl('images/always-on-time.png'),
    href: '/process',
  },
]

const ScrollableCardSection = () => {
  const trackRef = useRef(null)
  const sectionRef = useRef(null)
  const [translateX, setTranslateX] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile vs desktop
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Optimized scroll-driven horizontal translate
  useEffect(() => {
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
          let progress = 0
          
          if (scrollableHeight > 0) {
            progress = Math.max(0, Math.min(1, (-rect.top / scrollableHeight - offsetStart) / (1 - offsetStart)))
          }

          const maxTranslate = Math.max(0, track.scrollWidth - container.clientWidth)
          setTranslateX(-progress * maxTranslate)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobile])

  /* ─── MOBILE VIEW: scroll-driven horizontal, same mechanism as desktop ─── */
  if (isMobile) {
    return (
      <section
        id="services"
        ref={sectionRef}
        className="relative w-full bg-bg-muted"
        style={{ height: '280vh' }}
      >
        <div className="sticky top-0 h-screen flex flex-col">
          {/* Header */}
          <div className="text-center pt-10 pb-6 px-4">
            <h1 className="text-3xl font-semibold text-ink mb-2 font-serif">
              Services built for high‑stakes rooms
            </h1>
            <p className="text-base text-ink-muted">
              Production, rentals, and on‑site control designed to keep teams
              aligned.
            </p>
          </div>

          {/* Horizontal track — simple overflow-x scroll */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide">
            <div
              ref={trackRef}
              className="flex gap-4 h-full items-start py-8"
              style={{
                paddingLeft: '1rem',
                paddingRight: '1rem',
                transform: `translateX(${translateX}px)`,
              }}
            >
              {cards.map((card, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 snap-center"
                  style={{ width: '72vw', maxWidth: '320px' }}
                >
                  <div className="bg-white rounded-xl border border-border/50 overflow-hidden">
                    <img
                      src={card.img}
                      alt={card.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-ink mb-1">
                        {card.title}
                      </h3>
                      <p className="text-sm text-ink-muted mb-3">
                        {card.subtitle}
                      </p>
                      <p className="text-sm text-ink-muted mb-4 line-clamp-3">
                        {card.description}
                      </p>
                      <ScribbleButton
                        className="btn-primary w-full text-sm"
                        to={card.href}
                      >
                        Learn more
                      </ScribbleButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  /* ─── DESKTOP VIEW: sticky horizontal scroll ─── */
  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full bg-bg-muted"
      style={{ height: '420vh' }}
    >
      <div className="sticky top-0 h-screen flex flex-col">
        {/* Hero — extra top padding so cards sit lower, giving breathing room before scroll kicks in */}
        <div className="pt-24 pb-10 text-center">
          <h1 className="text-5xl lg:text-6xl font-semibold text-ink mb-4 font-serif">
            Services built for high‑stakes rooms
          </h1>
          <p className="text-xl text-ink-muted">
            Production, rentals, and on‑site control designed to keep teams
            aligned.
          </p>
        </div>

        {/* Horizontal track */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide">
          <div
            ref={trackRef}
            className="flex gap-16 px-24 pr-32 h-full items-start py-8"
            style={{ transform: `translateX(${translateX}px)` }}
          >
            {cards.map((card, i) => (
              <div
                key={i}
                className="flex-shrink-0"
                style={{ width: '32vw', maxWidth: '500px' }}
              >
                <div className="bg-white rounded-xl border border-border/50 overflow-hidden">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-ink mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-ink-muted mb-3">
                      {card.subtitle}
                    </p>
                    <p className="text-sm text-ink-muted mb-6 line-clamp-4">
                      {card.description}
                    </p>
                    <ScribbleButton
                      className="btn-primary w-full"
                      to={card.href}
                    >
                      Learn more
                    </ScribbleButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ScrollableCardSection
