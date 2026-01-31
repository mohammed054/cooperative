import React from "react";
import { motion } from "framer-motion";

const GhaimuAEProcessSection = () => {
  return (
    <section className="w-screen bg-bg-muted py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
          
        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <h2 className="text-5xl font-bold text-ghaimuae-primary mb-6">
            Using a Process Built Around You
          </h2>
          <p className="text-lg text-text-muted mb-8 leading-relaxed">
            We deliver properties differently—think of us as your sherpa guiding you to your perfect property. Our people-first process goes far beyond floor plans. We coordinate every player needed to take you from a spark of an idea to raw land to a finished home. It's a start-to-finish approach that's proven, vetted, and simply the best way to build.
          </p>
          <button className="btn-primary px-8 py-3 text-lg">
            How It Works
          </button>
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
            src="images/logo.webp" /* Path changed to relative for GitHub Pages compatibility */
            alt="Process Illustration"
            className="w-full max-w-lg object-contain rounded-2xl shadow-xl"
          />
        </motion.div>

      </div>
    </section>
  );
};

export default GhaimuAEProcessSection;