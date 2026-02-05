import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa';
import { assetUrl } from '../lib/assetUrl';
import ScribbleButton from './ScribbleButton';

const getInitials = (name) => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
  return (first + last).toUpperCase();
};

const TESTIMONIALS = [
  {
    id: 'skyline',
    name: 'Sarah Al‑Mansouri',
    role: 'CEO',
    company: 'Skyline Ventures',
    headline: 'Calm, precise execution — even on a tight timeline.',
    quote:
      'We gave them a complex room layout and a tight timeline. They delivered with zero drama — every cue landed, everything looked premium, and the room opened on time.',
    event: 'Investor summit',
    location: 'Dubai',
    image: assetUrl('images/event1.jpg'),
    tags: ['Full production', 'AV + lighting', 'On‑site crew'],
  },
  {
    id: 'prestige',
    name: 'James Mitchell',
    role: 'Marketing Director',
    company: 'Prestige Group',
    headline: 'Everything arrived tested, labeled, and ready to go.',
    quote:
      'The logistics were flawless. Equipment arrived tested and organized, the crew communicated clearly, and the setup looked exactly like the render — no last‑minute surprises.',
    event: 'Brand launch',
    location: 'Abu Dhabi',
    image: assetUrl('images/event2.jpg'),
    tags: ['Staging + seating', 'Show‑day support', 'White‑glove delivery'],
  },
  {
    id: 'elite',
    name: 'Layla Hassan',
    role: 'Events Manager',
    company: 'Elite Hospitality',
    headline: 'Proactive, detail‑obsessed, and reliable under pressure.',
    quote:
      'They anticipate problems before they happen. The team is proactive, detail‑obsessed, and calm under pressure — exactly the partner you want on event day.',
    event: 'VIP gala',
    location: 'Sharjah',
    image: assetUrl('images/event3.jpg'),
    tags: ['Lighting design', 'Backstage ops', 'Client‑ready finish'],
  },
];

const TestimonialsSection = ({
  title = 'Trusted by teams who can’t miss.',
  intro = 'Premium rentals and on‑site production, delivered with calm precision — so you can focus on the room.',
  showLink = true,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const proposalHref = '#get-started';
  const processHref = isHome ? '#process' : '/process';
  const isProcessAnchor = String(processHref).startsWith('#');
  const [activeId, setActiveId] = useState(TESTIMONIALS[0]?.id);

  const activeIndex = useMemo(
    () => Math.max(0, TESTIMONIALS.findIndex((t) => t.id === activeId)),
    [activeId],
  );
  const active = TESTIMONIALS[activeIndex] ?? TESTIMONIALS[0];

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.22, 1, 0.36, 1] };

  const goPrev = () => {
    const nextIndex = (activeIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
    setActiveId(TESTIMONIALS[nextIndex]?.id);
  };

  const goNext = () => {
    const nextIndex = (activeIndex + 1) % TESTIMONIALS.length;
    setActiveId(TESTIMONIALS[nextIndex]?.id);
  };

  return (
    <section id="testimonials" className="relative overflow-hidden bg-surface-2 py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(900px 500px at 50% -10%, rgba(155, 107, 61, 0.16), transparent 60%), radial-gradient(700px 500px at 0% 65%, rgba(0, 0, 0, 0.08), transparent 55%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={transition}
          className="max-w-3xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-ink-subtle">
            Testimonials
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl font-serif">
            {title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-muted sm:text-lg">
            {intro}
          </p>
        </motion.header>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={active?.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                transition={transition}
                className="overflow-hidden rounded-3xl border border-border bg-surface-2 shadow-[0_18px_60px_rgba(22,22,22,0.10)]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="p-8 sm:p-10 lg:col-span-7 lg:p-12">
                    <div className="flex items-center justify-between gap-4">
                      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-semibold text-ink-muted">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Client feedback
                      </div>
                      <p className="text-xs font-medium text-ink-subtle">
                        {active?.event} • {active?.location}
                      </p>
                    </div>

                    <FaQuoteLeft className="mt-10 text-4xl text-ink-subtle opacity-40" aria-hidden="true" />
                    <blockquote className="mt-6 text-[clamp(1.25rem,2.4vw,2.125rem)] font-medium leading-[1.15] tracking-tight text-ink">
                      {active?.quote}
                    </blockquote>

                    <figcaption className="mt-10 flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
                        {getInitials(active?.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">
                          {active?.name}
                        </p>
                        <p className="truncate text-sm text-ink-muted">
                          {active?.role} • {active?.company}
                        </p>
                      </div>
                    </figcaption>
                  </div>

                  <div className="relative lg:col-span-5">
                    <motion.img
                      src={active?.image}
                      alt={`${active?.event} in ${active?.location}`}
                      loading="lazy"
                      decoding="async"
                      initial={shouldReduceMotion ? false : { scale: 1.03 }}
                      animate={{ scale: 1 }}
                      transition={transition}
                      className="h-64 w-full object-cover lg:h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-black/10 to-transparent" />

                    <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
                      {(active?.tags ?? []).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-white/[0.85] px-3 py-1 text-xs font-semibold text-ink-muted backdrop-blur"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.figure>
            </AnimatePresence>

            <div className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {TESTIMONIALS.map((t) => {
                const isActive = t.id === active?.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveId(t.id)}
                    aria-pressed={isActive}
                    className={[
                      'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition',
                      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black',
                      isActive
                        ? 'border-ink bg-ink text-white'
                        : 'border-border bg-surface-2 text-ink-muted hover:border-ink hover:text-ink',
                    ].join(' ')}
                  >
                    {t.company}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-ink">More feedback</p>
              <div className="mt-4 flex flex-col gap-3" role="tablist" aria-label="Testimonials">
                {TESTIMONIALS.map((t) => {
                  const isActive = t.id === active?.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveId(t.id)}
                      role="tab"
                      aria-selected={isActive}
                      className="group relative w-full overflow-hidden rounded-2xl border border-border bg-surface-2 p-5 text-left transition hover:border-ink hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="testimonialActive"
                          transition={transition}
                          className="absolute inset-0 bg-ink"
                        />
                      )}

                      <div className="relative flex items-start gap-4">
                        <div
                          className={[
                            'flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold',
                            isActive ? 'bg-white/[0.12] text-white' : 'bg-ink text-white',
                          ].join(' ')}
                        >
                          {getInitials(t.name)}
                        </div>
                        <div className="min-w-0">
                          <p
                            className={[
                              'truncate text-sm font-semibold',
                              isActive ? 'text-white' : 'text-ink',
                            ].join(' ')}
                          >
                            {t.name}
                          </p>
                          <p
                            className={[
                              'truncate text-sm',
                              isActive ? 'text-white/70' : 'text-ink-muted',
                            ].join(' ')}
                          >
                            {t.role} • {t.company}
                          </p>
                          <p
                            className={[
                              'mt-3 text-sm leading-relaxed',
                              isActive ? 'text-white/[0.85]' : 'text-ink-muted',
                            ].join(' ')}
                          >
                            {t.headline}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-border bg-surface-2 p-6 sm:p-8 lg:mt-0">
              <p className="text-sm font-semibold text-ink">Why teams come back</p>
              <ul className="mt-4 space-y-3 text-sm text-ink-muted">
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink opacity-40" />
                  One accountable producer from setup to show‑close
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink opacity-40" />
                  Equipment arrives tested, organized, and event‑ready
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink opacity-40" />
                  Calm crews, clean finishes, zero‑surprise execution
                </li>
              </ul>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ScribbleButton
                  href={proposalHref}
                  showArrow={false}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(22,22,22,0.18)] transition hover:shadow-[0_16px_46px_rgba(22,22,22,0.22)]"
                >
                  Request a proposal
                </ScribbleButton>

                {isProcessAnchor ? (
                  <ScribbleButton
                    href={processHref}
                    className="inline-flex items-center justify-center rounded-full border border-border bg-surface-2 px-6 py-3 text-sm font-semibold text-ink-muted transition hover:border-ink hover:text-ink"
                  >
                    See how it works
                  </ScribbleButton>
                ) : (
                  <ScribbleButton
                    to={processHref}
                    className="inline-flex items-center justify-center rounded-full border border-border bg-surface-2 px-6 py-3 text-sm font-semibold text-ink-muted transition hover:border-ink hover:text-ink"
                  >
                    See how it works
                  </ScribbleButton>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous testimonial"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-2 text-ink-muted transition hover:border-ink hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <FaChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next testimonial"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-2 text-ink-muted transition hover:border-ink hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <FaChevronRight size={14} />
            </button>
            <p className="text-sm font-semibold tabular-nums text-ink-muted">
              {String(activeIndex + 1).padStart(2, '0')} / {String(TESTIMONIALS.length).padStart(2, '0')}
            </p>
          </div>

          {showLink && (
            <p className="text-sm text-ink-muted">
              Need a plan by end of week?{' '}
              <a href={proposalHref} className="font-semibold text-ink underline underline-offset-4">
                We can move fast.
              </a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
