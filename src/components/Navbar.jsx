// src/components/Navbar.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      
      {/* Glass / dark base */}
      <div className="backdrop-blur-md bg-black/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="text-xl font-bold text-white tracking-wide">
            GHAIM<span className="text-[#2D2E40]">.</span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Home', 'Services', 'Process', 'Events', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="
                  text-white/80
                  hover:text-white
                  transition
                  duration-200
                  relative
                  after:absolute
                  after:-bottom-1
                  after:left-0
                  after:h-[2px]
                  after:w-0
                  after:bg-[#2D2E40]
                  hover:after:w-full
                  after:transition-all
                "
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
              hidden md:block
              px-6 py-2
              bg-[#2D2E40]
              hover:bg-[#1F2030]
              text-white
              rounded-lg
              transition
              duration-300
              shadow-md
            "
          >
            Get Started
          </motion.button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
