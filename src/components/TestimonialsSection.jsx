import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa'
import { assetUrl } from '../lib/assetUrl'

const getInitials = name => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : ''
  return (first + last).toUpperCase()
}

const TESTIMONIALS = [
  {
    id: 'skyline',
    name: 'Sarah Al-Mansouri',
    role: 'CEO',
    company: 'Skyline Ventures',
    headline: 'Calm, precise execution even on a tight timeline.',
    quote:
      'We gave them a complex room layout and a tight timeline. They delivered with zero drama. Every cue landed, everything looked premium, and the room opened on time.',
    event: 'Investor summit',
    location: 'Dubai',
    image: assetUrl('images/event1.jpg'),
    tags: ['Full production', 'AV + lighting', 'On-site crew'],
  },
  {
    id: 'prestige',
    name: 'James Mitchell',
    role: 'Marketing Director',
    company: 'Prestige Group',
    headline: 'Everything arrived tested, labeled, and ready to go.',
    quote:
      'The logistics were flawless. Equipment arrived tested and organized, the crew communicated clearly, and the setup looked exactly like the render with no last-minute surprises.',
    event: 'Brand launch',
    location: 'Abu Dhabi',
    image: assetUrl('images/event2.jpg'),
    tags: ['Staging + seating', 'Show-day support', 'White-glove delivery'],
  },
  {
    id: 'elite',
    name: 'Layla Hassan',
    role: 'Events Manager',
    company: 'Elite Hospitality',
    headline: 'Proactive, detail-obsessed, and reliable under pressure.',
    quote:
      'They anticipate problems before they happen. The team is proactive, detail-obsessed, and calm under pressure, exactly the partner you want on event day.',
    event: 'VIP gala',
    location: 'Sharjah',
    image: assetUrl('images/event3.jpg'),
    tags: ['Lighting design', 'Backstage ops', 'Client-ready finish'],
  },
]

const TestimonialsSection = ({
  title = "Trusted by teams who can't miss.",
  intro = 'Premium rentals and on-site production, delivered with calm precision.',
  showLink = true,
}) => {
  const shouldReduceMotion = useReducedMotion()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const proposalHref = isHome ? '#get-started' : '/contact'
  const sectionRef = useRef(null)
  const [activeId, setActiveId] = useState(TESTIMONIALS[0]?.id)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const headerY = useTransform(scrollYProgress, [0, 1], [10, -8])
  const imageDriftY = useTransform(scrollYProgress, [0, 1], [12, -14])
  const sideRailY = useTransform(scrollYProgress, [0, 1], [8, -6])

  const activeIndex = useMemo(
    () => Math.max(0, TESTIMONIALS.findIndex(item => item.id === activeId)),
    [activeId]
  )
  const active = TESTIMONIALS[activeIndex] ?? TESTIMONIALS[0]
  const quoteWords = useMemo(
    () => String(active?.quote ?? '').split(/\s+/).filter(Boolean),
    [active?.quote]
  )
  const quoteMeasureClass = isHome ? 'max-w-[34ch]' : 'max-w-[37ch]'

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.82, ease: [0.23, 1, 0.32, 1] }

  const imageTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 1.1, ease: [0.18, 0.9, 0.25, 1] }

  const selectorTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.7, ease: [0.23, 1, 0.32, 1] }

  const goPrev = () => {
    const nextIndex = (activeIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
    setActiveId(TESTIMONIALS[nextIndex]?.id)
  }

  const goNext = () => {
    const nextIndex = (activeIndex + 1) % TESTIMONIALS.length
    setActiveId(TESTIMONIALS[nextIndex]?.id)
  }

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative overflow-hidden bg-transparent"
    >
      {isHome && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-0 h-24 bg-gradient-to-b from-white/65 to-transparent"
        />
      )}

      {isHome && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-24 bg-gradient-to-t from-[#101114]/45 via-[#101114]/16 to-transparent"
        />
      )}

      <div
        className={[
          'relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
          isHome ? 'py-14 sm:py-20 lg:py-24' : 'py-12 sm:py-18 lg:py-22',
        ].join(' ')}
      >
        <motion.header
          style={shouldReduceMotion ? undefined : { y: headerY }}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={transition}
          className="mb-10 max-w-2xl lg:mb-14"
        >
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-[#a7a7a7]">
            Testimonials
          </p>
          <h2 className="mb-4 max-w-[16ch] font-serif text-[clamp(1.6rem,4vw,2.6rem)] font-semibold leading-[1.07] tracking-[-0.02em] text-ink">
            {title}
          </h2>
          <p className="max-w-[52ch] text-[clamp(14px,1.5vw,16px)] leading-[1.68] text-ink-muted">
            {intro}
          </p>
        </motion.header>

        <div className="grid gap-5 lg:grid-cols-12 lg:items-stretch">
          <div className="flex flex-col lg:col-span-7">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={active?.id}
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 10,
                        clipPath: 'inset(0 0 12% 0 round 12px)',
                      }
                }
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : {
                        opacity: 1,
                        y: 0,
                        clipPath: 'inset(0% 0% 0% 0 round 12px)',
                      }
                }
                exit={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : {
                        opacity: 0,
                        y: -8,
                        clipPath: 'inset(8% 0% 0% 0 round 12px)',
                      }
                }
                transition={transition}
                className={[
                  'flex-1 overflow-hidden rounded-xl border border-black/[0.06] shadow-[0_16px_44px_rgba(17,17,17,0.06)]',
                  isHome ? 'bg-white/[0.8] backdrop-blur-[2px]' : 'bg-white',
                ].join(' ')}
              >
                <div className="grid flex-1 grid-cols-1 lg:grid-cols-12">
                  <div className="flex flex-col justify-between p-5 sm:p-7 lg:col-span-7 lg:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-surface-2 px-3 py-1 text-xs font-medium text-ink-muted">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Client feedback
                      </div>
                      <p className="text-xs text-ink-subtle">
                        {active?.event} - {active?.location}
                      </p>
                    </div>

                    <div className="mt-1">
                      <FaQuoteLeft
                        className="mt-4 text-2xl text-ink-subtle opacity-26"
                        aria-hidden="true"
                      />
                      <blockquote
                        className={[
                          'mt-4 text-[clamp(1rem,1.25vw,1.16rem)] font-medium leading-[1.68] tracking-[-0.003em] text-ink',
                          quoteMeasureClass,
                        ].join(' ')}
                        style={{ textWrap: 'balance' }}
                      >
                        {shouldReduceMotion
                          ? active?.quote
                          : quoteWords.map((word, index) => (
                              <motion.span
                                key={`${active?.id}-${word}-${index}`}
                                initial={{ opacity: 0.08, y: 3 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.34,
                                  ease: [0.23, 1, 0.32, 1],
                                  delay: Math.min(0.38, index * 0.012),
                                }}
                                className="mr-[0.28em] inline-block"
                              >
                                {word}
                              </motion.span>
                            ))}
                      </blockquote>
                    </div>

                    <figcaption className="mt-5 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
                        {getInitials(active?.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">
                          {active?.name}
                        </p>
                        <p className="truncate text-xs text-ink-muted">
                          {active?.role} - {active?.company}
                        </p>
                      </div>
                    </figcaption>
                  </div>

                  <motion.div
                    style={shouldReduceMotion ? undefined : { y: imageDriftY }}
                    className="relative lg:col-span-5"
                  >
                    <motion.img
                      src={active?.image}
                      alt={`${active?.event} in ${active?.location}`}
                      loading="lazy"
                      decoding="async"
                      initial={shouldReduceMotion ? false : { scale: 1.05 }}
                      animate={{ scale: 1 }}
                      transition={imageTransition}
                      className="h-48 w-full object-cover lg:h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
                      {(active?.tags ?? []).map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-white/[0.88] px-2.5 py-0.5 text-xs font-medium text-ink-muted backdrop-blur"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.figure>
            </AnimatePresence>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {TESTIMONIALS.map(item => {
                const isActive = item.id === active?.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    aria-pressed={isActive}
                    className={[
                      'shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition duration-300',
                      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black',
                      isActive
                        ? 'border-ink bg-ink text-white'
                        : isHome
                          ? 'border-black/[0.08] bg-white/[0.72] text-ink-muted hover:border-ink hover:text-ink'
                          : 'border-black/[0.08] bg-white text-ink-muted hover:border-ink hover:text-ink',
                    ].join(' ')}
                  >
                    {item.company}
                  </button>
                )
              })}
            </div>
          </div>

          <motion.div
            style={shouldReduceMotion ? undefined : { y: sideRailY }}
            className="mt-1 flex flex-col gap-4 lg:col-span-5 lg:mt-0"
          >
            <div className="hidden lg:block">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-ink-subtle">
                More feedback
              </p>
              <div className="flex flex-col gap-2" role="tablist" aria-label="Testimonials">
                {TESTIMONIALS.map(item => {
                  const isActive = item.id === active?.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      role="tab"
                      aria-selected={isActive}
                      className="group relative w-full overflow-hidden rounded-xl border border-black/[0.06] bg-white p-4 text-left transition-colors duration-500 hover:border-ink/[0.3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="testimonialActive"
                          transition={selectorTransition}
                          className="absolute inset-0 bg-ink"
                        />
                      )}

                      <div className="relative flex items-start gap-3">
                        <div
                          className={[
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                            isActive ? 'bg-white/[0.12] text-white' : 'bg-ink text-white',
                          ].join(' ')}
                        >
                          {getInitials(item.name)}
                        </div>
                        <div className="min-w-0">
                          <p
                            className={[
                              'truncate text-sm font-semibold',
                              isActive ? 'text-white' : 'text-ink',
                            ].join(' ')}
                          >
                            {item.name}
                          </p>
                          <p
                            className={[
                              'truncate text-xs',
                              isActive ? 'text-white/70' : 'text-ink-muted',
                            ].join(' ')}
                          >
                            {item.role} - {item.company}
                          </p>
                          <p
                            className={[
                              'mt-2 text-xs leading-relaxed',
                              isActive ? 'text-white/[0.85]' : 'text-ink-muted',
                            ].join(' ')}
                          >
                            {item.headline}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div
              className={[
                'flex flex-1 flex-col rounded-xl border border-black/[0.06] p-5',
                isHome ? 'bg-white/[0.78] backdrop-blur-[2px]' : 'bg-white',
              ].join(' ')}
            >
              <p className="text-sm font-semibold text-ink">Why teams come back</p>
              <ul
                className={[
                  'mt-3 text-sm text-ink-muted',
                  isHome ? 'grid grid-cols-2 gap-2.5 text-[13px]' : 'space-y-2',
                ].join(' ')}
              >
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink opacity-40" />
                  One accountable producer from setup to close
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink opacity-40" />
                  Equipment arrives tested, organized, and room-ready
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink opacity-40" />
                  Calm crews, clean finishes, no surprise execution
                </li>
              </ul>

              {showLink && (
                <div className="mt-auto pt-5">
                  <a
                    href={proposalHref}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-ink underline underline-offset-4 transition hover:text-ink-muted"
                  >
                    Request a proposal
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M2 7h10M8 3l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous testimonial"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] bg-white text-ink-muted transition duration-300 hover:border-ink hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <FaChevronLeft size={12} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next testimonial"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] bg-white text-ink-muted transition duration-300 hover:border-ink hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <FaChevronRight size={12} />
            </button>
            <p className="text-xs font-medium tabular-nums text-ink-muted">
              {String(activeIndex + 1).padStart(2, '0')} /{' '}
              {String(TESTIMONIALS.length).padStart(2, '0')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
