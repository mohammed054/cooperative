import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ComparisonScroll = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const comparisons = [
    {
      title: "Cost Efficiency",
      traditional: {
        description: "High upfront costs with unpredictable operational expenses",
        features: ["Large initial investment", "Hidden maintenance fees", "Complex pricing structure", "Limited ROI tracking"],
        icon: "💰"
      },
      ghaimu: {
        description: "Predictable costs with transparent pricing model",
        features: ["Fixed subscription model", "No hidden fees", "Clear ROI metrics", "Scalable pricing"],
        icon: "📈"
      }
    },
    {
      title: "Speed",
      traditional: {
        description: "Slow implementation with lengthy deployment cycles",
        features: ["6-12 month setup", "Complex installation", "Extended training periods", "Slow issue resolution"],
        icon: "🐌"
      },
      ghaimu: {
        description: "Rapid deployment with immediate value realization",
        features: ["Weeks, not months", "Plug-and-play setup", "Instant onboarding", "24/7 support"],
        icon: "⚡"
      }
    },
    {
      title: "Reliability",
      traditional: {
        description: "Frequent downtime with reactive maintenance approach",
        features: ["Regular outages", "Emergency fixes only", "Limited monitoring", "No proactive support"],
        icon: "⚠️"
      },
      ghaimu: {
        description: "99.9% uptime with predictive maintenance",
        features: ["Guaranteed uptime", "Proactive monitoring", "Preventive maintenance", "Real-time alerts"],
        icon: "✅"
      }
    },
    {
      title: "Support",
      traditional: {
        description: "Limited support with slow response times",
        features: ["Business hours only", "Long wait times", "Generic solutions", "No dedicated support"],
        icon: "📞"
      },
      ghaimu: {
        description: "24/7 dedicated support with personalized service",
        features: ["24/7 availability", "Instant response", "Custom solutions", "Dedicated account manager"],
        icon: "🎯"
      }
    },
    {
      title: "Scalability",
      traditional: {
        description: "Limited growth potential with rigid infrastructure",
        features: ["Fixed capacity", "Expensive upgrades", "Complex scaling", "Performance degradation"],
        icon: "📦"
      },
      ghaimu: {
        description: "Infinite scalability with elastic infrastructure",
        features: ["Auto-scaling", "Instant upgrades", "Seamless expansion", "Consistent performance"],
        icon: "🚀"
      }
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const sectionTop = ref.current?.offsetTop || 0;
      const sectionHeight = ref.current?.offsetHeight || windowHeight;
      
      if (scrollPosition >= sectionTop - windowHeight/2 && scrollPosition < sectionTop + sectionHeight - windowHeight/2) {
        const progress = (scrollPosition - (sectionTop - windowHeight/2)) / (windowHeight * 0.8);
        const newIndex = Math.min(Math.floor(progress * comparisons.length), comparisons.length - 1);
        setCurrentIndex(Math.max(0, newIndex));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [comparisons.length]);

  const currentComparison = comparisons[currentIndex];

  return (
    <section 
      id="comparison" 
      ref={ref}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ghaimu-primary to-ghaimu-dark-gray py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ghaimu-white mb-4">
            Detailed Comparison
          </h2>
          <p className="text-xl text-ghaimu-light-gray max-w-3xl mx-auto">
            Each scroll reveals a new comparison. See how GHAIM UAE transforms every aspect of your business operations.
          </p>
        </motion.div>

        {/* Comparison Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-8 lg:gap-12"
          >
            {/* Traditional Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-ghaimu-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-ghaimu-white/20"
            >
              <div className="flex items-center mb-6">
                <span className="text-4xl mr-4">{currentComparison.traditional.icon}</span>
                <h3 className="text-2xl lg:text-3xl font-bold text-ghaimu-white">
                  Traditional
                </h3>
              </div>
              <h4 className="text-xl font-semibold text-ghaimu-light-gray mb-6">
                {currentComparison.title}
              </h4>
              <p className="text-ghaimu-light-gray mb-8 leading-relaxed">
                {currentComparison.traditional.description}
              </p>
              <ul className="space-y-4">
                {currentComparison.traditional.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    className="flex items-center"
                  >
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                    <span className="text-ghaimu-light-gray">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* GHAIM UAE Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-ghaimu-white rounded-2xl p-8 lg:p-12 shadow-2xl"
            >
              <div className="flex items-center mb-6">
                <span className="text-4xl mr-4">{currentComparison.ghaimu.icon}</span>
                <h3 className="text-2xl lg:text-3xl font-bold text-ghaimu-primary">
                  GHAIM UAE
                </h3>
              </div>
              <h4 className="text-xl font-semibold text-ghaimu-dark-gray mb-6">
                {currentComparison.title}
              </h4>
              <p className="text-ghaimu-dark-gray mb-8 leading-relaxed">
                {currentComparison.ghaimu.description}
              </p>
              <ul className="space-y-4">
                {currentComparison.ghaimu.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    className="flex items-center"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-ghaimu-dark-gray">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mt-16 space-x-2">
          {comparisons.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-8 bg-ghaimu-white' : 'w-2 bg-ghaimu-white/30'
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>

        {/* Scroll Instruction */}
        <motion.p 
          className="text-center text-ghaimu-light-gray mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {currentIndex < comparisons.length - 1 ? 'Scroll down for next comparison' : 'Continue exploring our solutions'}
        </motion.p>
      </div>
    </section>
  );
};

export default ComparisonScroll;