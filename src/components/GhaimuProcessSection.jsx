import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const GhaimuProcessSection = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const sectionRef = useRef(null);

  const steps = [
    {
      number: "01",
      title: "Consultation",
      description: "We begin with a comprehensive discovery session to understand your business objectives, challenges, and requirements.",
      details: [
        "In-depth needs analysis",
        "Stakeholder interviews",
        "Current state assessment",
        "Goal definition"
      ],
      icon: "🤝",
      duration: "2-3 days"
    },
    {
      number: "02",
      title: "Analysis",
      description: "Our experts conduct thorough analysis of your existing systems and processes to identify opportunities for optimization.",
      details: [
        "Technical evaluation",
        "Process mapping",
        "Gap analysis",
        "Risk assessment"
      ],
      icon: "🔍",
      duration: "3-5 days"
    },
    {
      number: "03",
      title: "Proposal",
      description: "We present a detailed proposal with customized solutions, timelines, and expected outcomes tailored to your needs.",
      details: [
        "Solution architecture",
        "Implementation roadmap",
        "Resource allocation",
        "ROI projections"
      ],
      icon: "📋",
      duration: "2-3 days"
    },
    {
      number: "04",
      title: "Execution",
      description: "Our team implements the solution with precision, keeping you informed at every stage of the process.",
      details: [
        "Agile implementation",
        "Regular progress updates",
        "Quality assurance",
        "Change management"
      ],
      icon: "⚡",
      duration: "2-8 weeks"
    },
    {
      number: "05",
      title: "Support",
      description: "We provide ongoing support and optimization to ensure continued success and maximum value from your investment.",
      details: [
        "24/7 monitoring",
        "Regular maintenance",
        "Performance optimization",
        "Continuous improvement"
      ],
      icon: "🛡️",
      duration: "Ongoing"
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
        const progress = (scrollPosition - (sectionTop - windowHeight/2)) / (windowHeight * 1.5);
        const newStep = Math.min(Math.floor(progress * steps.length), steps.length - 1);
        setCurrentStep(Math.max(0, newStep));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [steps.length]);

  const currentStepData = steps[currentStep];

  return (
    <section 
      id="process" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-ghaimuae-primary py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ghaimuae-white mb-6">
            Our Process
          </h2>
          <p className="text-xl text-ghaimuae-light-gray max-w-3xl mx-auto leading-relaxed">
            Each scroll reveals a new step in our proven methodology. From consultation to ongoing support, we ensure excellence at every stage.
          </p>
        </motion.div>

        {/* Step Display */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-ghaimuae-white"
          >
            {/* Step Number and Title */}
            <div className="flex items-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-6xl lg:text-8xl font-bold text-ghaimuae-white/20 mr-6"
              >
                {currentStepData.number}
              </motion.div>
              <div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-3xl lg:text-4xl font-bold mb-2"
                >
                  {currentStepData.title}
                </motion.h3>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex items-center text-ghaimuae-light-gray"
                >
                  <span className="text-2xl mr-2">{currentStepData.icon}</span>
                  <span>Duration: {currentStepData.duration}</span>
                </motion.div>
              </div>
            </div>

            {/* Step Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg lg:text-xl text-ghaimuae-light-gray mb-8 leading-relaxed"
            >
              {currentStepData.description}
            </motion.p>

            {/* Step Details */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4"
            >
              {currentStepData.details.map((detail, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  className="flex items-center"
                >
                  <div className="w-3 h-3 bg-ghaimuae-light-gray rounded-full mr-4"></div>
                  <span className="text-ghaimuae-light-gray">{detail}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual Progress */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Circle Progress */}
            <div className="relative w-80 h-80 mx-auto">
              {/* Background Circle */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle
                  cx="160"
                  cy="160"
                  r="140"
                  stroke="rgba(246, 247, 250, 0.1)"
                  strokeWidth="12"
                  fill="none"
                />
                {/* Progress Circle */}
                <motion.circle
                  cx="160"
                  cy="160"
                  r="140"
                  stroke="rgb(246, 247, 250)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 140}`}
                  strokeDashoffset={`${2 * Math.PI * 140 * (1 - (currentStep + 1) / steps.length)}`}
                  transition={{ duration: 0.8 }}
                />
              </svg>
              
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  key={currentStep}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-6xl mb-4"
                >
                  {currentStepData.icon}
                </motion.div>
                <motion.div
                  key={`step-${currentStep}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-2xl font-bold text-ghaimuae-white text-center"
                >
                  {currentStepData.title}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="text-ghaimuae-light-gray text-center mt-2"
                >
                  Step {currentStep + 1} of {steps.length}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Step Navigation */}
        <div className="flex items-center justify-center mt-16 space-x-4">
          {steps.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setCurrentStep(index);
                const element = sectionRef.current;
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? 'w-12 bg-ghaimuae-white' 
                  : 'w-3 bg-ghaimuae-white/30 hover:bg-ghaimuae-white/50'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-center flex-wrap mt-8 gap-6">
          {steps.map((step, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setCurrentStep(index);
                const element = sectionRef.current;
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`text-sm font-medium transition-all duration-300 ${
                index === currentStep 
                  ? 'text-ghaimuae-white font-semibold' 
                  : 'text-ghaimuae-light-gray/60 hover:text-ghaimuae-light-gray'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {step.title}
            </motion.button>
          ))}
        </div>

        {/* Scroll Instruction */}
        <motion.p 
          className="text-center text-ghaimuae-light-gray/70 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {currentStep < steps.length - 1 ? 'Scroll for next step' : 'See our client success metrics'}
        </motion.p>
      </div>
    </section>
  );
};

export default GhaimuProcessSection;