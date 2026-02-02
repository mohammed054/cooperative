import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaStar, FaRegStar } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { useState, useRef, useEffect, useCallback } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const TestimonialsSection = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const sectionRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      customerName: "Sarah Al-Mansouri",
      customerRole: "CEO, Skyline Ventures",
      customerImage: "/cooperative/images/testimonials/customer-1.jpg",
      eventImage: "/cooperative/images/testimonials/event-1.jpg",
      quote: "GhaimUAE handled every detail flawlessly — from planning to execution. The event felt effortless on our side.",
      rating: 5,
      company: "Skyline Ventures",
      date: "March 2024",
      event: "Annual Gala Dinner"
    },
    {
      id: 2,
      customerName: "James Mitchell",
      customerRole: "Marketing Director, Prestige Group",
      customerImage: "/cooperative/images/testimonials/customer-2.jpg",
      eventImage: "/cooperative/images/testimonials/event-2.jpg",
      quote: "The attention to detail was remarkable. Every element perfectly reflected our brand vision and exceeded expectations.",
      rating: 5,
      company: "Prestige Group",
      date: "February 2024",
      event: "Product Launch"
    },
    {
      id: 3,
      customerName: "Layla Hassan",
      customerRole: "Events Manager, Elite Hospitality",
      customerImage: "/cooperative/images/testimonials/customer-3.jpg",
      eventImage: "/cooperative/images/testimonials/event-3.jpg",
      quote: "Professional, creative, and utterly reliable. GhaimUAE transformed our vision into an unforgettable experience.",
      rating: 5,
      company: "Elite Hospitality",
      date: "January 2024",
      event: "Corporate Retreat"
    }
  ];

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  // Custom cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (sectionRef.current && isCarouselHovered) {
        const rect = sectionRef.current.getBoundingClientRect();
        setCursorPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    if (isCarouselHovered) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isCarouselHovered]);

  const handlePrev = useCallback(() => {
    if (swiperInstance && !swiperInstance.destroyed) {
      swiperInstance.slidePrev();
    }
  }, [swiperInstance]);

  const handleNext = useCallback(() => {
    if (swiperInstance && !swiperInstance.destroyed) {
      swiperInstance.slideNext();
    }
  }, [swiperInstance]);

  const handleSlideToIndex = useCallback((index) => {
    if (swiperInstance && !swiperInstance.destroyed) {
      swiperInstance.slideToLoop(index);
    }
  }, [swiperInstance]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (swiperInstance && !swiperInstance.destroyed && swiperInstance.autoplay) {
      swiperInstance.autoplay.stop();
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (swiperInstance && !swiperInstance.destroyed && swiperInstance.autoplay) {
      swiperInstance.autoplay.start();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    if (swiperInstance) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [swiperInstance, handlePrev, handleNext]);

  return (
    <section 
      ref={sectionRef}
      className="relative bg-white py-20 md:py-32 overflow-hidden"
      onMouseEnter={() => setIsCarouselHovered(true)}
      onMouseLeave={() => setIsCarouselHovered(false)}
    >
      {/* Custom Cursor */}
      <AnimatePresence>
        {isCarouselHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed pointer-events-none z-50 mix-blend-difference"
            style={{
              left: cursorPosition.x,
              top: cursorPosition.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Header */}
      <div className="container mx-auto px-6 md:px-12 lg:px-20 mb-12 md:mb-20">
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

      {/* Carousel Container */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative container mx-auto px-6 md:px-12 lg:px-20"
        style={{ cursor: 'none' }}
      >
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
          spaceBetween={30}
          slidesPerView={1}
          speed={800}
          effect="coverflow"
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          loop={true}
          onSwiper={(swiper) => {
            setSwiperInstance(swiper);
            setActiveIndex(swiper.realIndex);
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
          }}
          className="testimonials-swiper pb-4"
          breakpoints={{
            640: {
              spaceBetween: 40
            },
            1024: {
              spaceBetween: 60
            }
          }}
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons - Desktop */}
        <div className="hidden md:flex items-center justify-center gap-4 mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrev}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group relative w-14 h-14 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-[#2D2E40] overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#2D2E40] focus:ring-offset-2"
            aria-label="Previous testimonial"
            type="button"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#2D2E40] to-[#1a1b29] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <FaChevronLeft className="relative z-10 text-lg group-hover:text-white transition-colors duration-300" />
          </motion.button>

          {/* Pagination Dots */}
          <div className="flex gap-2 mx-4">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSlideToIndex(index)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="relative focus:outline-none focus:ring-2 focus:ring-[#2D2E40] focus:ring-offset-2 rounded-full"
                aria-label={`Go to testimonial ${index + 1}`}
                type="button"
              >
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: activeIndex === index ? 1.2 : 1,
                      backgroundColor: activeIndex === index ? '#2D2E40' : '#4E4F68'
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      opacity: activeIndex === index ? 1 : 0.3
                    }}
                  />
                  {activeIndex === index && (
                    <motion.div
                      layoutId="activeDot"
                      className="absolute inset-0 rounded-full"
                      style={{
                        boxShadow: '0 0 0 4px rgba(45, 46, 64, 0.1)'
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group relative w-14 h-14 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-[#2D2E40] overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#2D2E40] focus:ring-offset-2"
            aria-label="Next testimonial"
            type="button"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#2D2E40] to-[#1a1b29] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <FaChevronRight className="relative z-10 text-lg group-hover:text-white transition-colors duration-300" />
          </motion.button>
        </div>

        {/* Mobile Pagination Dots */}
        <div className="flex md:hidden justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSlideToIndex(index)}
              className="relative focus:outline-none focus:ring-2 focus:ring-[#2D2E40] focus:ring-offset-2 rounded-full"
              aria-label={`Go to testimonial ${index + 1}`}
              type="button"
            >
              <motion.div
                animate={{
                  scale: activeIndex === index ? 1.2 : 1,
                  backgroundColor: activeIndex === index ? '#2D2E40' : '#4E4F68'
                }}
                transition={{ duration: 0.3 }}
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  opacity: activeIndex === index ? 1 : 0.3
                }}
              />
            </motion.button>
          ))}
        </div>

        {/* Progress Bar */}
        <motion.div 
          className="mt-8 max-w-xs mx-auto h-1 bg-gray-200 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#2D2E40] to-[#4E4F68]"
            initial={{ width: '0%' }}
            animate={{ 
              width: `${((activeIndex + 1) / testimonials.length) * 100}%` 
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>
      </motion.div>

      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-[#4E4F68]/5 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-[#2D2E40]/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
    </section>
  );
};

const TestimonialCard = ({ testimonial }) => {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const renderStars = () => {
    return [...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: -10, rotate: -180 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.3, 
          delay: 0.4 + i * 0.05,
          type: "spring",
          stiffness: 200
        }}
        className="relative"
      >
        {i < testimonial.rating ? (
          <FaStar className="w-5 h-5 text-[#2D2E40] drop-shadow-sm" />
        ) : (
          <FaRegStar className="w-5 h-5 text-[#4E4F68]/30" />
        )}
      </motion.div>
    ));
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-center">
      {/* Content Side */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 w-full"
      >
        <div className="relative bg-gradient-to-br from-white via-gray-50/30 to-white rounded-3xl p-8 md:p-10 lg:p-12 shadow-2xl border border-gray-100 hover:border-gray-200 transition-all duration-500 group overflow-hidden">
          {/* Decorative Quote Background */}
          <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500">
            <FaQuoteLeft className="text-[12rem] text-[#2D2E40]" />
          </div>

          {/* Star Rating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="flex gap-1">
              {renderStars()}
            </div>
            <span className="ml-2 text-sm text-[#4E4F68]/60 font-medium">
              {testimonial.rating}.0
            </span>
          </motion.div>

          {/* Quote */}
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl lg:text-3xl text-[#2D2E40] leading-relaxed mb-8 md:mb-10 relative z-10 font-light"
          >
            "{testimonial.quote}"
          </motion.blockquote>

          {/* Customer Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-start gap-4"
          >
            <div className="relative flex-shrink-0">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-4 ring-white shadow-lg"
              >
                <img
                  src={testimonial.customerImage}
                  alt={testimonial.customerName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%234E4F68" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E${testimonial.customerName.charAt(0)}%3C/text%3E%3C/svg%3E`;
                  }}
                />
              </motion.div>
              {/* Verified Badge */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-[#2D2E40] to-[#4E4F68] rounded-full flex items-center justify-center shadow-md border-2 border-white">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="text-lg md:text-xl font-semibold text-[#2D2E40]">
                  {testimonial.customerName}
                </h4>
                <span className="px-2.5 py-0.5 bg-gradient-to-r from-[#2D2E40]/10 to-[#4E4F68]/10 rounded-full text-xs font-medium text-[#4E4F68]">
                  Verified
                </span>
              </div>
              <p className="text-sm md:text-base text-[#4E4F68] mb-2 font-medium">
                {testimonial.customerRole}
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-[#4E4F68]/60">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#2D2E40] rounded-full" />
                  {testimonial.company}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#4E4F68] rounded-full" />
                  {testimonial.event}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#4E4F68]/50 rounded-full" />
                  {testimonial.date}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Bottom Accent Line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#2D2E40]/20 to-transparent" />
        </div>
      </motion.div>

      {/* Event Image Side */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex-1 w-full"
      >
        <div 
          className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] group"
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        >
          {/* Image */}
          <motion.img
            animate={{ scale: isImageHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            src={testimonial.eventImage}
            alt={`Event: ${testimonial.event}`}
            className="w-full h-full object-cover"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%234E4F68" width="800" height="600"/%3E%3Ctext x="400" y="300" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E%E2%9C%A8 Event Gallery%3C/text%3E%3C/svg%3E';
            }}
          />
          
          {/* Gradient Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isImageHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-[#2D2E40]/60 via-[#2D2E40]/20 to-transparent"
          />
          
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: imageLoaded ? 1 : 0, y: imageLoaded ? 0 : -10 }}
            transition={{ delay: 0.3 }}
            className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-[#2D2E40] to-[#4E4F68] rounded-full animate-pulse" />
              <span className="text-xs md:text-sm font-semibold text-[#2D2E40] tracking-wide">
                PREMIUM EVENT
              </span>
            </div>
          </motion.div>

          {/* Hover Info */}
          <AnimatePresence>
            {isImageHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-4 left-4 right-4"
              >
                <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-xl">
                  <p className="text-sm font-semibold text-[#2D2E40] mb-1">
                    {testimonial.event}
                  </p>
                  <p className="text-xs text-[#4E4F68]">
                    {testimonial.company} • {testimonial.date}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TestimonialsSection;
