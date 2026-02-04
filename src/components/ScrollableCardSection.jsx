import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const cards = [
  {
    title: "Event Production",
    subtitle: "Single accountable producer",
    description: "Scope, vendor alignment, and show control for high‑stakes rooms.",
    img: "/cooperative/images/event-planning.png",
    href: "/services/event-production",
  },
  {
    title: "Technical Production",
    subtitle: "AV, lighting, video systems",
    description: "Systems design, cueing, and redundancy for complex shows.",
    img: "/cooperative/images/av-setup.png",
    href: "/services/technical-production",
  },
  {
    title: "Staging & Scenic",
    subtitle: "Built to the render",
    description: "Stage architecture and scenic builds that stay on timeline.",
    img: "/cooperative/images/seating.png",
    href: "/services/staging-scenic",
  },
  {
    title: "Furniture & Rentals",
    subtitle: "Curated inventory",
    description: "Premium seating, tables, and accessories delivered clean.",
    img: "/cooperative/images/lighting-effects.png",
    href: "/services/furniture-rentals",
  },
  {
    title: "Show Control",
    subtitle: "On‑site command",
    description: "Dedicated producer and crew to keep the room composed.",
    img: "/cooperative/images/full-production.png",
    href: "/process",
  },
  {
    title: "Timing & Logistics",
    subtitle: "No‑surprise scheduling",
    description: "Load‑ins, resets, and strike planned around your timeline.",
    img: "/cooperative/images/always-on-time.png",
    href: "/process",
  },
];

const ScrollableCardSection = () => {
  const trackRef = useRef(null);
  const sectionRef = useRef(null);
  const [translateX, setTranslateX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile vs desktop
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scroll-driven horizontal translate — runs on BOTH mobile and desktop
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current || !trackRef.current) return;

      const section = sectionRef.current;
      const track = trackRef.current;

      const rect = section.getBoundingClientRect();
      const scrollableHeight = section.offsetHeight - window.innerHeight;

      const offsetStart = 0.02;
      let progress = (-rect.top / scrollableHeight - offsetStart) / (1 - offsetStart);
      progress = Math.min(Math.max(progress, 0), 1);

      const maxTranslate = track.scrollWidth - track.parentElement.clientWidth;
      setTranslateX(progress * maxTranslate);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]); // re-attach if layout switches

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
              Production, rentals, and on‑site control designed to keep teams aligned.
            </p>
          </div>

          {/* Horizontal track — clipped, translated by scroll */}
          <div className="flex-1 overflow-hidden flex items-start">
            <div
              ref={trackRef}
              className="flex gap-4 h-full items-center"
              style={{
                paddingLeft: '1rem',
                paddingRight: '1rem',
                transform: `translateX(-${translateX}px)`,
              }}
            >
              {cards.map((card, i) => (
                <div
                  key={i}
                  className="relative flex-shrink-0 perspective group"
                  style={{ width: '72vw', maxWidth: '320px', height: '72vh' }}
                >
                  <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-surface-2 rounded-2xl shadow-lg overflow-hidden flex flex-col">
                      <img
                        src={card.img}
                        alt={card.title}
                        className="h-3/4 w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="flex-1 flex items-center justify-center">
                        <h3 className="text-xl font-semibold text-ink">
                          {card.title}
                        </h3>
                      </div>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-surface-2 rounded-2xl shadow-lg flex flex-col items-center justify-center p-5">
                      <img
                        src={card.img}
                        alt=""
                        className="w-4/5 h-28 object-cover rounded-lg mb-4"
                        loading="lazy"
                        decoding="async"
                      />
                      <h4 className="text-lg font-semibold mb-1">
                        {card.subtitle}
                      </h4>
                      <p className="text-center text-ink-muted text-sm mb-4">
                        {card.description}
                      </p>
                      <Link className="btn-primary px-5 py-2 text-sm" to={card.href}>
                        Learn more
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
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
            Production, rentals, and on‑site control designed to keep teams aligned.
          </p>
        </div>

        {/* Horizontal track */}
        <div className="flex-1 overflow-hidden flex items-start">
          <div
            ref={trackRef}
            className="flex gap-16 px-24 pr-32 h-full items-center"
            style={{ transform: `translateX(-${translateX}px)` }}
          >
            {cards.map((card, i) => (
              <div
                key={i}
                className="relative flex-shrink-0 w-[32vw] perspective group"
                style={{ height: 'calc(100vh - 280px)' }}
              >
                {/* Card inner */}
                <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">

                  {/* Front */}
                  <div className="absolute top-2 left-4 right-4 bottom-2 backface-hidden bg-surface-2 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                    <img
                      src={card.img}
                      alt={card.title}
                      className="h-3/4 w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="flex-1 flex items-center justify-center">
                      <h3 className="text-3xl font-semibold text-ink">
                        {card.title}
                      </h3>
                    </div>
                  </div>

                  {/* Back */}
                  <div className="absolute top-2 left-4 right-4 bottom-2 backface-hidden rotate-y-180 bg-surface-2 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8">
                    <img
                      src={card.img}
                      alt=""
                      className="w-4/5 h-48 object-cover rounded-lg mb-6"
                      loading="lazy"
                      decoding="async"
                    />
                    <h4 className="text-2xl font-semibold mb-2">
                      {card.subtitle}
                    </h4>
                    <p className="text-center text-ink-muted mb-6">
                      {card.description}
                    </p>
                    <Link className="btn-primary px-8 py-3" to={card.href}>
                      Learn more
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};


export default ScrollableCardSection;
