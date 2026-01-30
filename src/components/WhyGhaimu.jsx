import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useInView as useInViewHooks } from 'react-intersection-observer';

const WhyGhaimu = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [point1Ref, point1InView] = useInViewHooks({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: "-100px 0px"
  });

  const [point2Ref, point2InView] = useInViewHooks({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: "-100px 0px"
  });

  const [point3Ref, point3InView] = useInViewHooks({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: "-100px 0px"
  });

  const [point4Ref, point4InView] = useInViewHooks({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: "-100px 0px"
  });

  const [point5Ref, point5InView] = useInViewHooks({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: "-100px 0px"
  });

  const strengths = [
    {
      ref: point1Ref,
      inView: point1InView,
      number: "15+",
      title: "Years of Excellence",
      description: "Proven track record in delivering cutting-edge business solutions across multiple industries.",
      icon: "🏆",
      delay: 0.1
    },
    {
      ref: point2Ref,
      inView: point2InView,
      number: "500+",
      title: "Successful Projects",
      description: "Transformed businesses through strategic implementation and innovative problem-solving.",
      icon: "📊",
      delay: 0.2
    },
    {
      ref: point3Ref,
      inView: point3InView,
      number: "24/7",
      title: "Dedicated Support",
      description: "Round-the-clock expert assistance ensuring your operations run smoothly without interruption.",
      icon: "🎯",
      delay: 0.3
    },
    {
      ref: point4Ref,
      inView: point4InView,
      number: "99.9%",
      title: "Uptime Guarantee",
      description: "Industry-leading reliability with proactive monitoring and preventive maintenance.",
      icon: "⚡",
      delay: 0.4
    },
    {
      ref: point5Ref,
      inView: point5InView,
      number: "∞",
      title: "Scalability",
      description: "Infinite growth potential with elastic infrastructure that grows with your business.",
      icon: "🚀",
      delay: 0.5
    }
  ];

  const CounterAnimation = ({ children, inView, delay = 0 }) => {
    const [count, setCount] = React.useState(0);
    const targetValue = React.useRef(0);

    React.useEffect(() => {
      if (typeof children === 'string') {
        if (children === '15+') {
          targetValue.current = 15;
        } else if (children === '500+') {
          targetValue.current = 500;
        } else if (children === '24/7') {
          targetValue.current = 24;
        } else if (children === '99.9%') {
          targetValue.current = 99.9;
        } else if (children === '∞') {
          targetValue.current = 8;
        }
      }
    }, [children]);

    React.useEffect(() => {
      if (inView && targetValue.current > 0) {
        let start = 0;
        const duration = 2000;
        const increment = targetValue.current / 50;
        const timer = setInterval(() => {
          start += increment;
          if (start >= targetValue.current) {
            setCount(targetValue.current);
            clearInterval(timer);
          } else {
            setCount(start);
          }
        }, duration / 50);
        return () => clearInterval(timer);
      }
    }, [inView]);

    if (children === '15+') return <>{Math.floor(count)}+</>;
    if (children === '500+') return <>{Math.floor(count)}+</>;
    if (children === '24/7') return <>{Math.floor(count)}/7</>;
    if (children === '99.9%') return <>{count.toFixed(1)}%</>;
    if (children === '∞') return <span className="text-6xl lg:text-7xl">∞</span>;
    return children;
  };

  return (
    <section 
      id="why-ghaimuae" 
      ref={ref}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-ghaimuaeae-light-gray to-ghaimuaeae-white py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ghaimuaeae-primary mb-6">
            Why GHAIM UAE
          </h2>
          <p className="text-xl text-ghaimuaeae-dark-gray max-w-3xl mx-auto leading-relaxed">
            Confident, professional, and results-driven. These are the pillars that make us the preferred choice for businesses seeking excellence.
          </p>
        </motion.div>

        {/* Strength Points */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {strengths.map((strength, index) => (
            <motion.div
              key={index}
              ref={strength.ref}
              initial={{ opacity: 0, y: 50 }}
              animate={{ 
                opacity: strength.inView ? 1 : 0, 
                y: strength.inView ? 0 : 50 
              }}
              transition={{ 
                duration: 0.6, 
                delay: strength.delay 
              }}
              className="group relative"
            >
              {/* Card */}
              <div className="bg-ghaimuaeae-white rounded-2xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-ghaimuaeae-light-gray">
                {/* Icon and Number */}
                <div className="flex items-center mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl mr-4"
                  >
                    {strength.icon}
                  </motion.div>
                  <div className="text-3xl lg:text-4xl font-bold text-ghaimuaeae-primary">
                    <CounterAnimation inView={strength.inView} delay={strength.delay}>
                      {strength.number}
                    </CounterAnimation>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl lg:text-2xl font-bold text-ghaimuaeae-dark-gray mb-4 group-hover:text-ghaimuaeae-primary transition-colors duration-300">
                  {strength.title}
                </h3>

                {/* Description */}
                <p className="text-ghaimuaeae-dark-gray/80 leading-relaxed">
                  {strength.description}
                </p>

                {/* Decorative Element */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: strength.inView ? '100%' : 0 }}
                  transition={{ duration: 0.8, delay: strength.delay + 0.3 }}
                  className="h-1 bg-ghaimuaeae-primary rounded-full mt-6"
                />
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-ghaimuaeae-primary/5 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Bottom Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-ghaimuaeae-primary rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-ghaimuaeae-white mb-4">
              No Marketing Fluff, Just Results
            </h3>
            <p className="text-lg lg:text-xl text-ghaimuaeae-light-gray leading-relaxed max-w-4xl mx-auto">
              We believe in delivering measurable outcomes rather than making empty promises. 
              Our success is measured by your growth, and every solution we provide is designed 
              to create tangible value for your business.
            </p>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.p 
          className="text-center text-ghaimuaeae-dark-gray/70 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          Discover our proven process
        </motion.p>
      </div>
    </section>
  );
};

export default WhyGhaimu;