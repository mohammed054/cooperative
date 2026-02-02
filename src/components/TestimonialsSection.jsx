import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaQuoteLeft, FaStar, FaRegStar } from 'react-icons/fa';
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
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [cursorDirection, setCursorDirection] = useState('left');
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

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  // Track cursor position inside section
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


  // Swiper navigation
  const handlePrev = useCallback(() => {
    if (swiperInstance && !swiperInstance.destroyed) swiperInstance.slidePrev();
  }, [swiperInstance]);

  const handleNext = useCallback(() => {
    if (swiperInstance && !swiperInstance.destroyed) swiperInstance.slideNext();
  }, [swiperInstance]);

  const handleSlideToIndex = useCallback((index) => {
    if (swiperInstance && !swiperInstance.destroyed) swiperInstance.slideToLoop(index);
  }, [swiperInstance]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-20 md:py-32 overflow-hidden"
      onMouseEnter={() => setIsCarouselHovered(true)}
      onMouseLeave={() => setIsCarouselHovered(false)}
    >
      {/* ======================
          CUSTOM ARROW CURSOR
          ====================== */}
      <AnimatePresence>
        {isCarouselHovered && (
          <motion.div
            className="fixed pointer-events-none z-50"
            style={{
              left: cursorPosition.x,
              top: cursorPosition.y,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: cursorDirection === 'left' ? 180 : 0
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-[#2D2E40] to-[#4E4F68] rounded-full shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================
          SECTION HEADER
          ====================== */}
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

      {/* ======================
          CAROUSEL
          ====================== */}
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
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          loop
          onSwiper={(swiper) => setSwiperInstance(swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="testimonials-swiper pb-4"
          breakpoints={{
            640: { spaceBetween: 40 },
            1024: { spaceBetween: 60 }
          }}
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
};

const TestimonialCard = ({ testimonial }) => {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const renderStars = () =>
    [...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: -10, rotate: -180 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.4 + i * 0.05, type: "spring", stiffness: 200 }}
      >
        {i < testimonial.rating ? (
          <FaStar className="w-5 h-5 text-[#2D2E40] drop-shadow-sm" />
        ) : (
          <FaRegStar className="w-5 h-5 text-[#4E4F68]/30" />
        )}
      </motion.div>
    ));

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-center">
      <div className="flex-1 w-full">
        <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 hover:border-gray-200 transition-all duration-500 group overflow-hidden">
          <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-[0.06]">
            <FaQuoteLeft className="text-[12rem] text-[#2D2E40]" />
          </div>
          <div className="flex items-center gap-2 mb-6">{renderStars()}</div>
          <blockquote className="text-xl md:text-2xl lg:text-3xl text-[#2D2E40] leading-relaxed mb-8 md:mb-10 font-light">
            "{testimonial.quote}"
          </blockquote>
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
              <img
                src={testimonial.customerImage}
                alt={testimonial.customerName}
                className="w-full h-full object-cover"

              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg md:text-xl font-semibold text-[#2D2E40]">
                {testimonial.customerName}
              </h4>
              <p className="text-sm md:text-base text-[#4E4F68] mb-2 font-medium">{testimonial.customerRole}</p>
              <div className="flex flex-wrap gap-3 text-xs text-[#4E4F68]/60">
                <span>{testimonial.company}</span>
                <span>{testimonial.event}</span>
                <span>{testimonial.date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full">
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] group"
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        >
          <motion.img
            animate={{ scale: isImageHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            src={testimonial.eventImage}
            alt={`Event: ${testimonial.event}`}
            className="w-full h-full object-cover"
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
