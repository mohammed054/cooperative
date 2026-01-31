import React, { useState } from "react";
import { motion } from "framer-motion";

const projects = [
  "images/seating.png",
  "images/av-setup.png",
  "images/lighting-effects.png"
];

const ProjectDeck = () => {
  const [stack, setStack] = useState(projects);

  const handleDragEnd = () => {
    const [first, ...rest] = stack;
    setStack([...rest, first]);
  };

  return (
    <section className="relative w-screen py-32 bg-white flex flex-col lg:flex-row items-start lg:items-center px-8 lg:px-24 gap-40">
      {/* Larger gap for spacing */}

      {/* Left Stacked Images */}
      <div className="relative w-[400px] md:w-[550px] h-[400px] md:h-[550px] flex-shrink-0">
        {stack.map((img, index) => {
          const zIndex = stack.length - index;
          const rotation = index === 0 ? 0 : index === 1 ? -8 : 8;
          const offsetY = index === 0 ? 0 : index === 1 ? 25 : -25;

          return (
            <motion.div
              key={img}
              drag={index === 0 ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={index === 0 ? handleDragEnd : undefined}
              style={{ zIndex, cursor: "grab" }}
              className="absolute top-0 left-0 w-full h-full rounded-3xl shadow-2xl"
              whileTap={{ cursor: "grabbing" }}
              initial={{ scale: 0.9, y: offsetY, rotate: rotation, opacity: 0 }}
              animate={{ scale: 1, y: offsetY, rotate: rotation, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={img}
                alt={`Project ${index + 1}`}
                className="w-full h-full object-cover rounded-3xl select-none pointer-events-none"
                draggable={false}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Right Text Content */}
      <div className="flex-1 text-left max-w-3xl lg:ml-20">
        {/* Slightly more left margin */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ghaimuae-primary mb-4">
          Crafting Exceptional Projects Across UAE
        </h2>
        <p className="text-lg md:text-xl text-text-muted mb-6 leading-relaxed">
          We focus exclusively on delivering in rural and urban locations. From coast to desert, HUTS creates beautiful properties through guidance, intent, and care. Have a specific emirate in mind? We've either built there, or will soon.
        </p>
        <button className="btn-primary px-8 py-3 text-lg">
          See Our Projects
        </button>
      </div>

    </section>
  );
};

export default ProjectDeck;
