import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaStar, FaRegStar } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { useState, useRef, useEffect, useCallback } from 'react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const TestimonialsSection = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  const carouselRef = useRef(null);

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
      if (carouselRef.current && isCarouselHovered) {
        const rect = carouselRef.current.getBoundingClientRect();
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
    if (swiperInstance && !swiperInstance.destroyed) swiperInstance.slidePrev();
  }, [swiperInstance]);

  const handleNext = useCallback(() => {
    if (swiperInstance && !swiperInstance.destroyed) swiperInstance.slideNext();
  }, [swiperInstance]);

  const handleSlideToIndex = useCallback((index) => {
    if (swiperInstance && !swiperInstance.destroyed) swiperInstance.slideToLoop(index);
  }, [swiperInstance]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
    };

    if (swiperInstance) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [swiperInstance, handlePrev, handleNext]);

  return (
    <section className="relative bg-white py-20 md:py-32 overflow-hidden">
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
              left: cursorPosition.x + carouselRef.current?.getBoundingClientRect().left,
              top: cursorPosition.y + carouselRef.current?.getBoundingClientRect().top,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div
              className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center`}
            >
              <div
                className={`w-3 h-3 bg-white rotate-0 transition-transform duration-150 ${
                  cursorPosition.x < (carouselRef.current?.offsetWidth / 2)
                    ? 'rotate-45' // Left arrow style
                    : '-rotate-45' // Right arrow style
                }`}
              />
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
        ref={carouselRef}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative container mx-auto px-6 md:px-12 lg:px-20"
        style={{ cursor: 'none' }}
        onMouseEnter={() => setIsCarouselHovered(true)}
        onMouseLeave={() => setIsCarouselHovered(false)}
      >
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
          spaceBetween={30}
          slidesPerView={1}
          speed={800}
          effect="coverflow"
          coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 1, slideShadows: false }}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          loop={true}
          onSwiper={(swiper) => {
            setSwiperInstance(swiper);
            setActiveIndex(swiper.realIndex);
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="testimonials-swiper pb-4"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      {/* Decorative Backgrounds */}
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
        transition={{ duration: 0.3, delay: 0.4 + i * 0.05, type: "spring", stiffness: 200 }}
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
      <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="flex-1 w-full">
        <div className="relative bg-gradient-to-br from-white via-gray-50/30 to-white rounded-3xl p-8 md:p-10 lg:p-12 shadow-2xl border border-gray-100 hover:border-gray-200 transition-all duration-500 group overflow-hidden">
          {/* Quote */}
          <motion.blockquote initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="text-xl md:text-2xl lg:text-3xl text-[#2D2E40] leading-relaxed mb-8 md:mb-10 relative z-10 font-light">
            "{testimonial.quote}"
          </motion.blockquote>
          {/* Stars */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.3 }} className="flex items-center gap-2 mb-6">
            <div className="flex gap-1">{renderStars()}</div>
            <span className="ml-2 text-sm text-[#4E4F68]/60 font-medium">{testimonial.rating}.0</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Event Image Side */}
      <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="flex-1 w-full">
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
        </div>
      </motion.div>
    </div>
  );
};

export default TestimonialsSection;
