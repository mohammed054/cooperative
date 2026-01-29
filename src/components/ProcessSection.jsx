import React from 'react';
import LazyLoadImage from 'react-lazy-load-image-component';
import { FaClipboardList, FaCheckCircle, FaPhone } from 'react-icons/fa';

const ProcessSection = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const processSteps = [
    {
      icon: <FaClipboardList className="text-2xl" />,
      title: 'Initial Consultation',
      description: 'We discuss your event requirements and timeline',
    },
    {
      icon: <FaCheckCircle className="text-2xl" />,
      title: 'Equipment Selection',
      description: 'Choose from our premium rental inventory',
    },
    {
      icon: <FaPhone className="text-2xl" />,
      title: 'Final Confirmation',
      description: 'Confirm details and setup schedule',
    },
  ];

  return (
    <section id="process" className="py-20 bg-charcoal overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Using a Process Built Around You
            </h2>
            <p className="text-light-gray text-lg mb-8 leading-relaxed">
              We coordinate every step, from initial inquiry to setup, ensuring your event is flawless. Think of us as your event sherpa.
            </p>
            <p className="text-light-gray text-lg mb-8 leading-relaxed">
              Our streamlined process eliminates the stress of event planning, allowing you to focus on what matters most - your guests and your message.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.button
                onClick={() => scrollToSection('standards')}
                className="btn-primary text-lg px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Process
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('contact')}
                className="bg-transparent border-2 border-gold text-gold px-8 py-4 rounded-full font-semibold hover:bg-gold hover:text-dark-gray transition-all duration-300 text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.button>
            </div>

            {/* Process Steps */}
            <div className="space-y-6">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gold text-dark-gray rounded-full flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {step.title}
                    </h3>
                    <p className="text-light-gray text-sm">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              <LazyLoadImage
                src="/api/placeholder/600/500"
                alt="Event setup process"
                className="rounded-lg shadow-2xl w-full"
                effect="blur"
              />
              <div className="absolute top-6 -right-6 bg-electric-blue text-dark-gray p-4 rounded-lg">
                <FaClipboardList className="text-2xl mb-2" />
                <p className="font-bold">Step-by-Step</p>
                <p className="text-sm">Process</p>
              </div>
              <div className="absolute bottom-6 -left-6 bg-gold text-dark-gray p-4 rounded-lg">
                <FaCheckCircle className="text-2xl mb-2" />
                <p className="font-bold">Guaranteed</p>
                <p className="text-sm">Quality</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;