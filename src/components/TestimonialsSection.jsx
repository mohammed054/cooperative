import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaQuoteLeft } from 'react-icons/fa';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      customerName: "Sarah Al-Mansouri",
      customerRole: "CEO, Skyline Ventures",
      customerImage: "/cooperative/images/testimonials/customer-1.jpg",
      eventImage: "/cooperative/images/testimonials/event-1.jpg",
      quote: "GhaimUAE handled every detail flawlessly — from planning to execution. The event felt effortless on our side.",
      rating: 5
    },
    {
      id: 2,
      customerName: "James Mitchell",
      customerRole: "Marketing Director, Prestige Group",
      customerImage: "/cooperative/images/testimonials/customer-2.jpg",
      eventImage: "/cooperative/images/testimonials/event-2.jpg",
      quote: "The attention to detail was remarkable. Every element perfectly reflected our brand vision and exceeded expectations.",
      rating: 5
    },
    {
      id: 3,
      customerName: "Layla Hassan",
      customerRole: "Events Manager, Elite Hospitality",
      customerImage: "/cooperative/images/testimonials/customer-3.jpg",
      eventImage: "/cooperative/images/testimonials/event-3.jpg",
      quote: "Professional, creative, and utterly reliable. GhaimUAE transformed our vision into an unforgettable experience.",
      rating: 5
    }
  ];

  return (
    <section className="relative bg-white py-20 md:py-32 overflow-hidden">
      {/* Section Header */}
      <div className="container mx-auto px-6 md:px-12 lg:px-20 mb-16 md:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D2E40] mb-4 md:mb-6">
            Trusted by Leaders
          </h2>
          <p className="text-lg md:text-xl text-[#4E4F68] leading-relaxed">
            Discover why industry leaders choose GhaimUAE to bring their most important events to life.
          </p>
        </motion.div>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-6 md:px-12 lg:px-20 space-y-20 md:space-y-32">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            reverse={index % 2 !== 0}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial, reverse, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-12 lg:gap-16 items-center`}
    >
      {/* Content Side */}
      <div className="flex-1 w-full">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-8 md:p-10 lg:p-12 shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
        >
          {/* Quote Icon */}
          <div className="absolute top-6 right-6 md:top-8 md:right-8 opacity-5">
            <FaQuoteLeft className="text-7xl md:text-8xl text-[#2D2E40]" />
          </div>

          {/* Star Rating */}
          <div className="flex gap-1 mb-6">
            {[...Array(testimonial.rating)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 text-[#2D2E40]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-xl md:text-2xl text-[#4E4F68] leading-relaxed mb-8 relative z-10">
            "{testimonial.quote}"
          </blockquote>

          {/* Customer Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-4 ring-gray-100">
                <img
                  src={testimonial.customerImage}
                  alt={testimonial.customerName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%234E4F68" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E' + testimonial.customerName.charAt(0) + '%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
            <div>
              <h4 className="text-lg md:text-xl font-semibold text-[#2D2E40] mb-1">
                {testimonial.customerName}
              </h4>
              <p className="text-sm md:text-base text-[#4E4F68]">
                {testimonial.customerRole}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Event Image Side */}
      <div className="flex-1 w-full">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] md:aspect-[3/2]"
        >
          <img
            src={testimonial.eventImage}
            alt={`Event by ${testimonial.customerName}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%234E4F68" width="800" height="600"/%3E%3Ctext x="400" y="300" font-size="60" text-anchor="middle" dominant-baseline="middle" fill="white"%3EEvent Image%3C/text%3E%3C/svg%3E';
            }}
          />
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D2E40]/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TestimonialsSection;
