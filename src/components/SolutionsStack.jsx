import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const SolutionsStack = () => {
  const [currentService, setCurrentService] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const sectionRef = useRef(null);

  const services = [
    {
      title: "Corporate Services",
      subtitle: "Enterprise-Grade Solutions",
      description: "Comprehensive service packages designed for large-scale operations with complex requirements and demanding performance standards.",
      features: [
        "Custom enterprise architecture",
        "Advanced security protocols",
        "Dedicated support teams",
        "Performance optimization"
      ],
      icon: "🏢",
      color: "from-ghaimu-primary to-ghaimu-dark-gray"
    },
    {
      title: "Logistics Solutions",
      subtitle: "Supply Chain Optimization",
      description: "Streamlined logistics management that connects every aspect of your supply chain for maximum efficiency and cost reduction.",
      features: [
        "Real-time tracking systems",
        "Automated workflows",
        "Route optimization",
        "Inventory management"
      ],
      icon: "🚚",
      color: "from-ghaimu-primary/90 to-ghaimu-dark-gray/90"
    },
    {
      title: "Infrastructure Services",
      subtitle: "Robust Technology Foundation",
      description: "Solid infrastructure backbone that ensures reliability, scalability, and seamless integration with your existing systems.",
      features: [
        "Cloud-native architecture",
        "Microservices design",
        "Auto-scaling capabilities",
        "24/7 monitoring"
      ],
      icon: "⚙️",
      color: "from-ghaimu-primary/80 to-ghaimu-dark-gray/80"
    },
    {
      title: "Custom Solutions",
      subtitle: "Tailored to Your Needs",
      description: "Bespoke solutions crafted specifically for your unique business challenges and growth objectives.",
      features: [
        "Requirement analysis",
        "Custom development",
        "Phased implementation",
        "Continuous optimization"
      ],
      icon: "🎯",
      color: "from-ghaimu-primary/70 to-ghaimu-dark-gray/70"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      
      if (scrollPosition >= sectionTop - windowHeight/2 && scrollPosition < sectionTop + sectionHeight - windowHeight/2) {
        const progress = (scrollPosition - (sectionTop - windowHeight/2)) / (windowHeight * 1.2);
        const newService = Math.min(Math.floor(progress * services.length), services.length - 1);
        setCurrentService(Math.max(0, newService));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [services.length]);

  const currentServiceData = services[currentService];

  return (
    <section 
      id="services" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-ghaimu-light-gray py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ghaimu-primary mb-4">
            Our Solutions
          </h2>
          <p className="text-xl text-ghaimu-dark-gray max-w-3xl mx-auto">
            Each scroll reveals a new solution. Discover how our comprehensive services address every aspect of modern business challenges.
          </p>
        </motion.div>

        {/* Service Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentService}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br ${currentServiceData.color} rounded-3xl p-8 lg:p-16 text-ghaimu-white shadow-2xl"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center mb-6">
                  <span className="text-6xl mr-4">{currentServiceData.icon}</span>
                  <div>
                    <h3 className="text-3xl lg:text-4xl font-bold mb-2">
                      {currentServiceData.title}
                    </h3>
                    <p className="text-xl text-ghaimu-light-gray">
                      {currentServiceData.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-lg lg:text-xl text-ghaimu-light-gray mb-8 leading-relaxed">
                  {currentServiceData.description}
                </p>

                <ul className="space-y-4">
                  {currentServiceData.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="flex items-center"
                    >
                      <div className="w-3 h-3 bg-ghaimu-white rounded-full mr-4"></div>
                      <span className="text-lg">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Right Visual */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center justify-center"
              >
                <div className="relative">
                  {/* Abstract Graphic */}
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="w-64 h-64 lg:w-80 lg:h-80 bg-ghaimu-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-ghaimu-white/20"
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, -10, 10, 0]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="w-48 h-48 lg:w-56 lg:h-56 bg-ghaimu-white/20 rounded-2xl flex items-center justify-center"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                        className="text-6xl lg:text-8xl"
                      >
                        {currentServiceData.icon}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Service Navigation Dots */}
        <div className="flex items-center justify-center mt-16 space-x-3">
          {services.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setCurrentService(index);
                const element = sectionRef.current;
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentService 
                  ? 'w-12 bg-ghaimu-primary' 
                  : 'w-3 bg-ghaimu-primary/30 hover:bg-ghaimu-primary/50'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Service Labels */}
        <div className="flex justify-center mt-6 space-x-8">
          {services.map((service, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setCurrentService(index);
                const element = sectionRef.current;
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`text-sm font-medium transition-all duration-300 ${
                index === currentService 
                  ? 'text-ghaimu-primary font-semibold' 
                  : 'text-ghaimu-dark-gray/60 hover:text-ghaimu-dark-gray'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {service.title}
            </motion.button>
          ))}
        </div>

        {/* Scroll Instruction */}
        <motion.p 
          className="text-center text-ghaimu-dark-gray/70 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {currentService < services.length - 1 ? 'Scroll for next service' : 'Explore why GHAIM UAE leads the industry'}
        </motion.p>
      </div>
    </section>
  );
};

export default SolutionsStack;