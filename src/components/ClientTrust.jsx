import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ClientTrust = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    {
      number: "500+",
      label: "Clients Served",
      description: "Trusted by leading companies across the UAE and beyond",
      icon: "🏢",
      delay: 0.1
    },
    {
      number: "99.9%",
      label: "Client Satisfaction",
      description: "Consistently exceeding expectations with every project",
      icon: "⭐",
      delay: 0.2
    },
    {
      number: "15+",
      label: "Years Experience",
      description: "Deep industry knowledge and proven expertise",
      icon: "📈",
      delay: 0.3
    },
    {
      number: "24/7",
      label: "Support Availability",
      description: "Always available when you need us most",
      icon: "🛡️",
      delay: 0.4
    }
  ];

  const achievements = [
    {
      title: "Industry Recognition",
      value: "50+",
      unit: "Awards",
      description: "Excellence in innovation and service delivery"
    },
    {
      title: "Global Reach",
      value: "20+",
      unit: "Countries",
      description: "Expanding our impact across borders"
    },
    {
      title: "Expert Team",
      value: "200+",
      unit: "Professionals",
      description: "Dedicated specialists in every domain"
    },
    {
      title: "Project Success",
      value: "98%",
      unit: "Completion Rate",
      description: "Delivering on time and within budget"
    }
  ];

  const CounterAnimation = ({ target, suffix = "", inView, delay = 0 }) => {
    const [count, setCount] = React.useState(0);
    
    React.useEffect(() => {
      if (inView) {
        let start = 0;
        const duration = 2000;
        const increment = target / 50;
        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(start);
          }
        }, duration / 50);
        return () => clearInterval(timer);
      }
    }, [inView, target]);

    return <>{count.toFixed(target % 1 !== 0 ? 1 : 0)}{suffix}</>;
  };

  return (
    <section 
      id="client-trust" 
      ref={ref}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-ghaimuae-white to-ghaimuae-light-gray py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ghaimuae-primary mb-6">
            Client Trust & Success
          </h2>
          <p className="text-xl text-ghaimuae-dark-gray max-w-3xl mx-auto leading-relaxed">
            Our metrics reflect our commitment to excellence. Every number represents a promise kept and a relationship built on trust.
          </p>
        </motion.div>

        {/* Primary Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
              transition={{ duration: 0.6, delay: stat.delay }}
              className="text-center group"
            >
              <div className="bg-ghaimuae-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-ghaimuae-light-gray group-hover:border-ghaimuae-primary/30">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: inView ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: stat.delay + 0.2 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="text-5xl mb-4 mx-auto"
                >
                  {stat.icon}
                </motion.div>

                {/* Number */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: inView ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: stat.delay + 0.3 }}
                  className="text-4xl lg:text-5xl font-bold text-ghaimuae-primary mb-2"
                >
                  {stat.number.includes('+') ? (
                    <>
                      <CounterAnimation 
                        target={parseInt(stat.number)} 
                        inView={inView} 
                        delay={stat.delay + 0.3}
                      />
                      +
                    </>
                  ) : stat.number.includes('%') ? (
                    <>
                      <CounterAnimation 
                        target={parseFloat(stat.number)} 
                        inView={inView} 
                        delay={stat.delay + 0.3}
                      />
                      %
                    </>
                  ) : (
                    <CounterAnimation 
                      target={parseInt(stat.number)} 
                      inView={inView} 
                      delay={stat.delay + 0.3}
                    />
                  )}
                </motion.div>

                {/* Label */}
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: inView ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: stat.delay + 0.4 }}
                  className="text-xl font-semibold text-ghaimuae-dark-gray mb-3"
                >
                  {stat.label}
                </motion.h3>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: inView ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: stat.delay + 0.5 }}
                  className="text-ghaimuae-dark-gray/80 text-sm leading-relaxed"
                >
                  {stat.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-ghaimuae-primary rounded-3xl p-8 lg:p-12"
        >
          <h3 className="text-2xl lg:text-3xl font-bold text-ghaimuae-white text-center mb-12">
            Our Impact & Achievements
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.9 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="text-center text-ghaimuae-white"
              >
                <div className="bg-ghaimuae-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-ghaimuae-white/20 transition-all duration-300">
                  <h4 className="text-lg font-semibold mb-2">{achievement.title}</h4>
                  <div className="text-3xl lg:text-4xl font-bold mb-1">
                    <CounterAnimation 
                      target={parseFloat(achievement.value)} 
                      inView={inView} 
                      delay={0.8 + index * 0.1}
                    />
                    <span className="text-xl ml-1">{achievement.unit}</span>
                  </div>
                  <p className="text-ghaimuae-light-gray text-sm mt-2">
                    {achievement.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-ghaimuae-dark-gray/60">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>ISO Certified</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>GDRP Compliant</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Audited Annually</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Enterprise Security</span>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.p 
          className="text-center text-ghaimuae-dark-gray/70 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          Ready to start your success story?
        </motion.p>
      </div>
    </section>
  );
};

export default ClientTrust;