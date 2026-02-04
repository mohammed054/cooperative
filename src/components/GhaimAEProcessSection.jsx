import React from "react";
import { motion } from "framer-motion";
import ScribbleButton from "./ScribbleButton";
import { useNavigate } from "react-router-dom";

const GhaimAEProcessSection = () => {
  const navigate = useNavigate();
  return (
    <section id="process" className="w-full bg-surface py-16 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
          
        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink font-serif mb-4 lg:mb-6">
            A process built around timing, approvals, and calm.
          </h2>
          <p className="text-base lg:text-lg text-ink-muted mb-6 lg:mb-8 leading-relaxed">
            We stay close to the run‑of‑show, approvals, and vendor alignment so your team can stay focused on the room. The goal is a composed event with no last‑minute surprises.
          </p>
          <div className="flex justify-center lg:justify-start">
            <ScribbleButton onClick={() => navigate("/process")} className="btn-primary px-8 py-3 text-lg">
              How we work
            </ScribbleButton>
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
            src="/cooperative/images/event-planning-in-action.png"
            alt="Event planning in action"
            className="w-full max-w-sm lg:max-w-lg object-contain rounded-2xl shadow-xl"
            loading="lazy"
            decoding="async"
          />
        </motion.div>

      </div>
    </section>
  );
};

export default GhaimAEProcessSection;
