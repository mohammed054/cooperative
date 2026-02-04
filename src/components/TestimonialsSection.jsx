import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { FaArrowRight, FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa';

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
    image: '/cooperative/images/event1.jpg',
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
    image: '/cooperative/images/event2.jpg',
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
    image: '/cooperative/images/event3.jpg',
    tags: ['Lighting design', 'Backstage ops', 'Client‑ready finish'],
  },
];

const TestimonialsSection = () => {
  const shouldReduceMotion = useReducedMotion();
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
    <section id="testimonials" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(900px 500px at 50% -10%, rgba(59, 130, 246, 0.14), transparent 60%), radial-gradient(700px 500px at 0% 65%, rgba(225, 145, 188, 0.10), transparent 55%)',
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
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-black/60">
            Testimonials
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-black sm:text-5xl lg:text-6xl">
            Trusted by teams who can’t miss.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-black/70 sm:text-lg">
            Premium rentals and on‑site production, delivered with calm precision — so you can focus on the room.
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
                className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.10)]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="p-8 sm:p-10 lg:col-span-7 lg:p-12">
                    <div className="flex items-center justify-between gap-4">
                      <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black/70">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Client feedback
                      </div>
                      <p className="text-xs font-medium text-black/50">
                        {active?.event} • {active?.location}
                      </p>
                    </div>

                    <FaQuoteLeft className="mt-10 text-4xl text-black/10" aria-hidden="true" />
                    <blockquote className="mt-6 text-[clamp(1.25rem,2.4vw,2.125rem)] font-medium leading-[1.15] tracking-tight text-black">
                      {active?.quote}
                    </blockquote>

                    <figcaption className="mt-10 flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                        {getInitials(active?.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-black">
                          {active?.name}
                        </p>
                        <p className="truncate text-sm text-black/60">
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
                          className="inline-flex items-center rounded-full bg-white/[0.85] px-3 py-1 text-xs font-semibold text-black/70 backdrop-blur"
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
                        ? 'border-black bg-black text-white'
                        : 'border-black/10 bg-white text-black/70 hover:border-black/20 hover:text-black',
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
              <p className="text-sm font-semibold text-black/80">More feedback</p>
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
                      className="group relative w-full overflow-hidden rounded-2xl border border-black/10 bg-white p-5 text-left transition hover:border-black/20 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="testimonialActive"
                          transition={transition}
                          className="absolute inset-0 bg-black"
                        />
                      )}

                      <div className="relative flex items-start gap-4">
                        <div
                          className={[
                            'flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold',
                            isActive ? 'bg-white/[0.12] text-white' : 'bg-black text-white',
                          ].join(' ')}
                        >
                          {getInitials(t.name)}
                        </div>
                        <div className="min-w-0">
                          <p
                            className={[
                              'truncate text-sm font-semibold',
                              isActive ? 'text-white' : 'text-black',
                            ].join(' ')}
                          >
                            {t.name}
                          </p>
                          <p
                            className={[
                              'truncate text-sm',
                              isActive ? 'text-white/70' : 'text-black/60',
                            ].join(' ')}
                          >
                            {t.role} • {t.company}
                          </p>
                          <p
                            className={[
                              'mt-3 text-sm leading-relaxed',
                              isActive ? 'text-white/[0.85]' : 'text-black/70',
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

            <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 sm:p-8 lg:mt-0">
              <p className="text-sm font-semibold text-black/80">Why teams come back</p>
              <ul className="mt-4 space-y-3 text-sm text-black/70">
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-black/40" />
                  One accountable producer from setup to show‑close
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-black/40" />
                  Equipment arrives tested, organized, and event‑ready
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-black/40" />
                  Calm crews, clean finishes, zero‑surprise execution
                </li>
              </ul>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#get-started"
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:shadow-[0_16px_46px_rgba(0,0,0,0.22)]"
                >
                  Request a proposal
                  <FaArrowRight className="transition-transform group-hover:translate-x-0.5" size={14} />
                </a>
                <a
                  href="#process"
                  className="inline-flex items-center justify-center rounded-full border border-black/[0.15] bg-white px-6 py-3 text-sm font-semibold text-black/80 transition hover:border-black/25 hover:text-black"
                >
                  See how it works
                </a>
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
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-black/70 transition hover:border-black/20 hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              <FaChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next testimonial"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-black/70 transition hover:border-black/20 hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              <FaChevronRight size={14} />
            </button>
            <p className="text-sm font-semibold tabular-nums text-black/60">
              {String(activeIndex + 1).padStart(2, '0')} / {String(TESTIMONIALS.length).padStart(2, '0')}
            </p>
          </div>

          <p className="text-sm text-black/60">
            Need a plan by end of week?{' '}
            <a href="#get-started" className="font-semibold text-black underline underline-offset-4">
              We can move fast.
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
