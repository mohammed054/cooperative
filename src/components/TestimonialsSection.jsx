import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { useState } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const TestimonialsSection = () => {
  const [swiperRef, setSwiperRef] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const handlePrev = () => {
    if (swiperRef) swiperRef.slidePrev();
  };

  const handleNext = () => {
    if (swiperRef) swiperRef.slideNext();
  };

  return (
    <section className="relative bg-white py-20 md:py-32 overflow-hidden">
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
      >
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          speed={800}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          loop={true}
          onSwiper={setSwiperRef}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="testimonials-swiper"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="hidden md:flex items-center justify-center gap-4 mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrev}
            className="w-14 h-14 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-[#2D2E40] hover:bg-[#2D2E40] hover:text-white group"
            aria-label="Previous testimonial"
          >
            <FaChevronLeft className="text-lg group-hover:scale-110 transition-transform" />
          </motion.button>

          {/* Pagination Dots */}
          <div className="flex gap-2 mx-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => swiperRef?.slideTo(index)}
                className="group relative"
                aria-label={`Go to testimonial ${index + 1}`}
              >
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    activeIndex === index
                      ? 'w-12 bg-[#2D2E40]'
                      : 'w-2 bg-[#4E4F68]/30 group-hover:bg-[#4E4F68]/50'
                  }`}
                />
              </button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="w-14 h-14 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-[#2D2E40] hover:bg-[#2D2E40] hover:text-white group"
            aria-label="Next testimonial"
          >
            <FaChevronRight className="text-lg group-hover:scale-110 transition-transform" />
          </motion.button>
        </div>

        {/* Mobile Pagination Dots */}
        <div className="flex md:hidden justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => swiperRef?.slideTo(index)}
              className="group relative"
              aria-label={`Go to testimonial ${index + 1}`}
            >
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  activeIndex === index
                    ? 'w-8 bg-[#2D2E40]'
                    : 'w-2 bg-[#4E4F68]/30'
                }`}
              />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-[#4E4F68]/3 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-[#2D2E40]/3 rounded-full blur-3xl -z-10" />
    </section>
  );
};

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-center pb-4">
      {/* Content Side */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 w-full"
      >
        <div className="bg-white rounded-3xl p-8 md:p-10 lg:p-12 shadow-xl relative overflow-hidden">
          {/* Quote Icon Background */}
          <div className="absolute top-6 right-6 md:top-8 md:right-8 opacity-5">
            <FaQuoteLeft className="text-7xl md:text-9xl text-[#2D2E40]" />
          </div>

          {/* Star Rating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex gap-1 mb-6"
          >
            {[...Array(testimonial.rating)].map((_, i) => (
              <motion.svg
                key={i}
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                className="w-5 h-5 text-[#2D2E40]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </motion.svg>
            ))}
          </motion.div>

          {/* Quote */}
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl lg:text-3xl text-[#4E4F68] leading-relaxed mb-8 md:mb-10 relative z-10 font-light"
          >
            "{testimonial.quote}"
          </motion.blockquote>

          {/* Customer Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-4"
          >
            <div className="relative">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-4 ring-[#4E4F68]/10 shadow-lg">
                <img
                  src={testimonial.customerImage}
                  alt={testimonial.customerName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%234E4F68" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="white"%3E${testimonial.customerName.charAt(0)}%3C/text%3E%3C/svg%3E`;
                  }}
                />
              </div>
              {/* Verified Badge */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#2D2E40] rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
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
          </motion.div>
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
        <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] md:aspect-[3/2] group">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            src={testimonial.eventImage}
            alt={`Event by ${testimonial.customerName}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%234E4F68" width="800" height="600"/%3E%3Ctext x="400" y="300" font-size="60" text-anchor="middle" dominant-baseline="middle" fill="white"%3EEvent Image%3C/text%3E%3C/svg%3E';
            }}
          />
          {/* Subtle Overlay with Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D2E40]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Premium Badge */}
          <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <p className="text-xs md:text-sm font-semibold text-[#2D2E40]">Premium Event</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TestimonialsSection;
