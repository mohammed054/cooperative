import React from "react";
import { motion } from "framer-motion";

const cards = [
  {
    title: "Event Planning",
    subtitle: "Organize with precision",
    description: "Plan your events with precision.",
    img: "https://picsum.photos/id/1011/600/400" // works
  },
  {
    title: "AV Setup",
    subtitle: "High-quality tech",
    description: "High-quality audio-visual equipment.",
    img: "https://picsum.photos/id/1015/600/400"
  },
  {
    title: "Seating & Staging",
    subtitle: "Custom arrangements",
    description: "Custom seating arrangements.",
    img: "https://picsum.photos/id/1016/600/400"
  },
  {
    title: "Lighting & Effects",
    subtitle: "Set the mood",
    description: "Mood and theme lighting.",
    img: "https://picsum.photos/id/1025/600/400"
  },
  {
    title: "Full Production",
    subtitle: "End-to-end solutions",
    description: "End-to-end event solutions.",
    img: "https://picsum.photos/id/1035/600/400"
  },
];


const ScrollableCardSection = () => {
  return (
    <section
      id="scrollable-cards"
      className="relative w-full min-h-screen flex flex-col items-center justify-center gap-12 bg-bg-muted py-16"
    >
      {/* Hero Text */}
      <section className="w-full text-center mb-12 px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ghaimuae-primary mb-4">
          Our Services
        </h1>
        <p className="text-lg md:text-xl text-text-muted">
          Discover how we can make your events unforgettable
        </p>
      </section>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-8 w-full max-w-7xl">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="relative w-full h-full max-h-[70vh] min-h-[360px] perspective"
          >
            {/* Card Inner */}
            <div className="relative w-full h-full transition-all duration-200 transform-style-preserve-3d cursor-pointer group [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-2xl [@media(hover:hover)]:hover:rotate-y-180 [@media(hover:hover)]:hover:duration-700">
              
              {/* Front */}
              <div className="absolute w-full h-full backface-hidden bg-white rounded-xl overflow-hidden shadow-xl">
                <div className="relative w-full h-full">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ghaimuae-primary/90 via-ghaimuae-primary/60 to-transparent pt-20 pb-8 px-6">
                    <h3 className="text-3xl font-bold text-white">
                      {card.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Back */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-xl shadow-xl flex flex-col items-center justify-between p-6">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-3/4 h-40 object-cover rounded-md"
                />
                <div className="flex flex-col items-center flex-grow justify-center">
                  <h3 className="text-2xl font-semibold text-ghaimuae-primary mb-3 text-center">
                    {card.subtitle}
                  </h3>
                  <p className="text-text-muted text-center line-clamp-2">{card.description}</p>
                </div>
                <button className="btn-primary text-sm px-6 py-2 mt-4">
                  Learn More
                </button>
              </div>

            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ScrollableCardSection;
