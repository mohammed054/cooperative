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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8 w-full max-w-7xl">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="relative w-full h-96 perspective"
          >
            {/* Card Inner */}
            <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d hover:rotate-y-180">
              
              {/* Front */}
              <div className="absolute w-full h-full backface-hidden bg-white rounded-xl overflow-hidden shadow-xl flex flex-col">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-2/3 object-cover"
                />
                <div className="p-4 flex flex-col items-center justify-center">
                  <h3 className="text-2xl font-bold text-ghaimuae-primary mb-2 text-center">
                    {card.title}
                  </h3>
                </div>
              </div>

              {/* Back */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-xl shadow-xl flex flex-col items-center justify-center p-4">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-3/4 h-40 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold text-ghaimuae-primary mb-2 text-center">
                  {card.subtitle}
                </h3>
                <p className="text-text-muted mb-4 text-center">{card.description}</p>
                <button className="btn-primary text-sm px-6 py-2">
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
