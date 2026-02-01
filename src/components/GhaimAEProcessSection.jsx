import React from "react";
import { motion } from "framer-motion";

const GhaimAEProcessSection = () => {
  return (
    <section className="w-screen bg-bg-muted py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
          
        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ghaimuae-primary mb-4 lg:mb-6">
            A Process Designed Around Your Events
          </h2>
          <p className="text-base lg:text-lg text-text-muted mb-6 lg:mb-8 leading-relaxed">
            We handle events differently—think of us as your dedicated partner guiding you from concept to execution. Our people-first process ensures every detail is coordinated, every supplier is aligned, and your event runs flawlessly. It's a start-to-finish approach that's tested, professional, and ensures unforgettable experiences.
          </p>
          <div className="flex justify-center lg:justify-start">
            <button className="btn-primary px-8 py-3 text-lg">
              How It Works
            </button>
          </div>
        </motion.div>

        {/* Right: Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex justify-center items-center"
        >
          <img
            src="images/event-planning-in-action.png"
            alt="Event Planning Illustration"
            className="w-full max-w-sm lg:max-w-lg object-contain rounded-2xl shadow-xl"
          />
        </motion.div>

      </div>
    </section>
  );
};

export default GhaimAEProcessSection;
