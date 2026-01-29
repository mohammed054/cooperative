import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ComparisonIntro = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section 
      id="comparison-intro" 
      ref={ref}
      className="min-h-screen flex items-center justify-center bg-ghaimu-light-gray"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Main Title */}
          <motion.h2 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-ghaimu-primary mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Traditional Solutions
            <br />
            <span className="text-ghaimu-dark-gray">vs</span>
            <br />
            GHAIM UAE
          </motion.h2>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-ghaimu-dark-gray mb-16 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience the difference between conventional approaches and our innovative solutions. 
            Every aspect optimized for modern business challenges.
          </motion.p>

          {/* Comparison Preview */}
          <motion.div 
            className="grid md:grid-cols-2 gap-8 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Traditional Column */}
            <div className="bg-ghaimu-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-ghaimu-dark-gray mb-4">Traditional Approach</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-ghaimu-primary rounded-full mr-3"></div>
                  <span className="text-ghaimu-dark-gray">Limited scalability</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-ghaimu-primary rounded-full mr-3"></div>
                  <span className="text-ghaimu-dark-gray">Complex integration</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-ghaimu-primary rounded-full mr-3"></div>
                  <span className="text-ghaimu-dark-gray">Higher operational costs</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-ghaimu-primary rounded-full mr-3"></div>
                  <span className="text-ghaimu-dark-gray">Extended implementation time</span>
                </div>
              </div>
            </div>

            {/* GHAIM UAE Column */}
            <div className="bg-ghaimu-primary p-8 rounded-lg shadow-lg text-ghaimu-white">
              <h3 className="text-2xl font-bold mb-4">GHAIM UAE Advantage</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-ghaimu-white rounded-full mr-3"></div>
                  <span>Infinite scalability</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-ghaimu-white rounded-full mr-3"></div>
                  <span>Seamless integration</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-ghaimu-white rounded-full mr-3"></div>
                  <span>Optimized cost efficiency</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-ghaimu-white rounded-full mr-3"></div>
                  <span>Rapid deployment</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Animated Separator with Dot */}
          <motion.div 
            className="flex items-center justify-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="h-px bg-ghaimu-primary w-24"></div>
            <motion.div 
              className="w-4 h-4 bg-ghaimu-primary rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            ></motion.div>
            <div className="h-px bg-ghaimu-primary w-24"></div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.p 
            className="text-ghaimu-primary mt-8 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Scroll to explore detailed comparisons
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonIntro;