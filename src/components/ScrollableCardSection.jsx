import React, { useRef, useEffect, useState } from "react";

const cards = [
  {
    title: "Event Planning",
    subtitle: "Organize with precision",
    description: "Plan your events with precision.",
    img: "https://picsum.photos/id/1011/800/600"
  },
  {
    title: "AV Setup",
    subtitle: "High-quality tech",
    description: "High-quality audio-visual equipment.",
    img: "https://picsum.photos/id/1015/800/600"
  },
  {
    title: "Seating & Staging",
    subtitle: "Custom arrangements",
    description: "Custom seating arrangements.",
    img: "https://picsum.photos/id/1016/800/600"
  },
  {
    title: "Lighting & Effects",
    subtitle: "Set the mood",
    description: "Mood and theme lighting.",
    img: "https://picsum.photos/id/1025/800/600"
  },
  {
    title: "Full Production",
    subtitle: "End-to-end solutions",
    description: "End-to-end event solutions.",
    img: "https://picsum.photos/id/1035/800/600"
  }
];

const ScrollableCardSection = () => {
  const trackRef = useRef(null);
  const sectionRef = useRef(null);
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current || !trackRef.current) return;

      const section = sectionRef.current;
      const track = trackRef.current;

      const rect = section.getBoundingClientRect();
      const scrollableHeight = section.offsetHeight - window.innerHeight;

      const progress = Math.min(
        Math.max(-rect.top / scrollableHeight, 0),
        1
      );

      const maxTranslate = track.scrollWidth - window.innerWidth;

      setTranslateX(progress * maxTranslate);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-screen h-[300vh] bg-bg-muted"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex flex-col">
        
        {/* Hero */}
        <div className="pt-24 pb-16 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-ghaimuae-primary mb-4">
            Our Services
          </h1>
          <p className="text-xl text-text-muted">
            Discover how we can make your events unforgettable
          </p>
        </div>

        {/* Horizontal track */}
        <div className="flex-1 overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-16 px-24 pr-40 h-full" // added pr-40 for extra right padding
            style={{
              transform: `translateX(-${translateX}px)`
            }}
          >
            {cards.map((card, i) => (
              <div
                key={i}
                className="relative flex-shrink-0 w-[32vw] h-[70vh] perspective group"
              >
                {/* Card inner */}
                <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
                  
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                    <img
                      src={card.img}
                      alt={card.title}
                      className="h-3/4 w-full object-cover"
                    />
                    <div className="flex-1 flex items-center justify-center">
                      <h3 className="text-3xl font-bold text-ghaimuae-primary">
                        {card.title}
                      </h3>
                    </div>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8">
                    <img
                      src={card.img}
                      alt=""
                      className="w-4/5 h-48 object-cover rounded-lg mb-6"
                    />
                    <h4 className="text-2xl font-semibold mb-2">
                      {card.subtitle}
                    </h4>
                    <p className="text-center text-text-muted mb-6">
                      {card.description}
                    </p>
                    <button className="btn-primary px-8 py-3">
                      Learn More
                    </button>
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
