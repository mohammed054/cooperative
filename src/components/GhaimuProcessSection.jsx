import React from "react";

const GhaimuProcessSection = () => {
  return (
    <section className="relative w-screen bg-white py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          
        {/* Left Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-5xl lg:text-6xl font-bold text-ghaimuae-primary mb-6">
            Using a process built around you
          </h2>
          <p className="text-lg lg:text-xl text-ghaimuae-secondary mb-8 leading-relaxed">
            We deliver events differently — think of us as your sherpa guiding path to flawless execution. Our people-first process coordinates every detail, from initial planning to final execution, ensuring your event is seamless, memorable, and simply the best experience for you and your guests.
          </p>
          <button className="btn-primary px-8 py-3 text-lg">
            How It Works
          </button>
        </div>

        {/* Right Illustration */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <img
            src="images/logo.webp" /* Path changed to relative for GitHub Pages compatibility */
            alt="Event planning in action"
            className="w-96 h-96 object-cover rounded-2xl shadow-2xl"
          />
        </div>

      </div>
    </section>
  );
};

export default GhaimuProcessSection;