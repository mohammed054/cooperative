import React, { useState } from "react";
import { motion } from "framer-motion";

// Updated project images
const projects = [
  "images/event1.jpg",
  "images/event2.jpg",
  "images/event3.jpg"
];

const ProjectDeck = () => {
  const [stack, setStack] = useState(projects);

  const handleDragEnd = (index) => {
    const updatedStack = [...stack];
    const [dragged] = updatedStack.splice(index, 1);
    updatedStack.push(dragged);
    setStack(updatedStack);
  };

  return (
    <section className={`
      relative w-screen bg-white
      flex flex-col items-center
      px-4 py-16 gap-10
      sm:px-8 sm:gap-16 sm:py-24
      lg:flex-row lg:items-center lg:px-28 lg:pt-40 lg:pb-40 lg:gap-48
    `}>
      {/* Left Stacked Images
          Mobile:  w-[85vw] h-[85vw]  (fills most of the narrow screen)
          sm:      w-[420px] h-[420px]
          md:      w-[500px] h-[500px] (original)
          lg:      w-[650px] h-[650px] (original)
      */}
      <div className={`
        relative flex-shrink-0
        w-[85vw] h-[85vw]
        sm:w-[420px] sm:h-[420px]
        md:w-[500px] md:h-[500px]
        lg:w-[650px] lg:h-[650px]
      `}>
        {stack.map((img, index) => {
          const zIndex = stack.length - index;
          const rotation = index === 0 ? 0 : index === 1 ? -18 : 18;
          const offsetY = index === 0 ? 0 : index === 1 ? 40 : -40;

          return (
            <motion.div
              key={img}
              drag
              dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
              onDragEnd={() => handleDragEnd(index)}
              style={{ zIndex, cursor: "grab" }}
              className="absolute top-0 left-0 w-full h-full rounded-3xl shadow-2xl"
              whileTap={{ cursor: "grabbing" }}
              initial={{ scale: 0.9, y: offsetY, rotate: rotation, opacity: 0 }}
              animate={{
                scale: index === 0 ? 1 : 0.97,
                y: offsetY,
                rotate: rotation,
                opacity: 1
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
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

      {/* Right Text Content
          Mobile:  centered text, normal max-width
          lg:      left-aligned with ml-24, original max-w-3xl
      */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex-1 text-center lg:text-left max-w-3xl lg:ml-24 space-y-5"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ghaimuae-primary">
          Crafting Exceptional Projects Across UAE
        </h2>
        <p className="text-base md:text-lg text-text-muted leading-relaxed">
          We focus exclusively on delivering in rural and urban locations. From coast to desert, HUTS creates beautiful properties through guidance, intent, and care. Have a specific emirate in mind? We've either built there, or will soon.
        </p>
        <div className="flex justify-center lg:justify-start">
          <button className="btn-primary px-8 py-3 text-lg">
            See Our Projects
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default ProjectDeck;
