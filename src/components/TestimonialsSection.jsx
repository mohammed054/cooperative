import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { useState, useRef } from 'react';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const TestimonialsSection = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorSide, setCursorSide] = useState('right');
  const [isHovering, setIsHovering] = useState(false);
  
  const containerRef = useRef(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const testimonials = [
    {
      id: 1,
      customerName: "Sarah Al-Mansouri",
      customerRole: "CEO, Skyline Ventures",
      customerImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      eventImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
      quote: "GhaimUAE handled every detail flawlessly — from planning to execution. The event felt effortless on our side.",
    },
    {
      id: 2,
      customerName: "James Mitchell",
      customerRole: "Marketing Director, Prestige Group",
      customerImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      eventImage: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800",
      quote: "The attention to detail was remarkable. Every element perfectly reflected our brand vision and exceeded expectations.",
    },
    {
      id: 3,
      customerName: "Layla Hassan",
      customerRole: "Events Manager, Elite Hospitality",
      customerImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      eventImage: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=800",
      quote: "Professional, creative, and utterly reliable. GhaimUAE transformed our vision into an unforgettable experience.",
    }
  ];

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCursorPos({ x: e.clientX, y: e.clientY });
    const relativeX = e.clientX - rect.left;
    setCursorSide(relativeX < rect.width / 2 ? 'left' : 'right');
  };

  // Improved Navigation: Only trigger if NOT dragging
  const handleContainerClick = (e) => {
    if (swiperInstance?.animating) return;
    if (cursorSide === 'left') {
      swiperInstance?.slidePrev();
    } else {
      swiperInstance?.slideNext();
    }
  };

  return (
    <section id="testimonials" className="bg-[#F8F9FA] py-24 md:py-32 overflow-hidden select-none">
      {/* CUSTOM CURSOR - Fixed to viewport */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: cursorPos.x - 32,
              y: cursorPos.y - 32 
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.6 }}
          >
            <div className="w-16 h-16 bg-[#2D2E40] rounded-full flex items-center justify-center shadow-2xl text-white">
              <motion.div
                animate={{ rotate: cursorSide === 'left' ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <FaChevronRight size={20} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <header className="mb-16 md:mb-24">
          <motion.span className="text-[#2D2E40] font-bold tracking-[0.2em] text-sm uppercase block mb-4">Testimonials</motion.span>
          <h2 className="text-4xl md:text-6xl font-bold text-[#2D2E40]">Trusted by Leaders</h2>
        </header>

        <motion.div
          ref={(node) => {
            ref(node);
            containerRef.current = node;
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handleContainerClick}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="relative lg:cursor-none"
        >
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            slidesPerView={1}
            loop={true}
            speed={1000}
            autoplay={{ delay: 5000, disableOnInteraction: true }}
            onSwiper={setSwiperInstance}
            onSlideChange={(s) => setActiveIndex(s.realIndex)}
            className="rounded-[2.5rem]"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id} className="bg-white rounded-[2.5rem] overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                  {/* Left Side: Text Content */}
                  <div className="p-8 md:p-16 lg:p-20 flex flex-col justify-center order-2 lg:order-1">
                    <FaQuoteLeft className="text-5xl text-gray-100 mb-8" />
                    <p className="text-2xl md:text-3xl lg:text-4xl font-light text-[#2D2E40] leading-snug mb-12">
                      "{t.quote}"
                    </p>
                    
                    <div className="flex items-center gap-5 mt-auto">
                      <div className="relative">
                        <img 
                          src={t.customerImage} 
                          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg" 
                          alt={t.customerName} 
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-[#2D2E40] text-white p-1 rounded-full">
                          <FaStar size={10} />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-[#2D2E40]">{t.customerName}</h4>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{t.customerRole}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Large Event Image */}
                  <div className="relative h-[300px] lg:h-full overflow-hidden order-1 lg:order-2">
                    <motion.img 
                      initial={{ scale: 1.2 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 1.5 }}
                      src={t.eventImage} 
                      className="w-full h-full object-cover" 
                      alt="Event" 
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* CONTROLS FOOTER */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Progress Bar */}
          <div className="flex items-center gap-6 w-full md:w-auto">
            <span className="text-sm font-bold text-[#2D2E40] tabular-nums">0{activeIndex + 1}</span>
            <div className="h-[2px] w-48 bg-gray-200 relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-[#2D2E40]"
                animate={{ width: `${((activeIndex + 1) / testimonials.length) * 100}%` }}
                transition={{ type: 'spring', stiffness: 50 }}
              />
            </div>
            <span className="text-sm font-bold text-gray-300 tabular-nums">0{testimonials.length}</span>
          </div>

          {/* Nav Buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); swiperInstance?.slidePrev(); }}
              className="group flex items-center gap-3 px-6 py-3 rounded-full border border-gray-200 hover:bg-[#2D2E40] transition-all duration-300"
            >
              <FaChevronLeft className="group-hover:text-white transition-colors" size={14} />
              <span className="text-xs font-bold uppercase tracking-widest group-hover:text-white">Prev</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); swiperInstance?.slideNext(); }}
              className="group flex items-center gap-3 px-6 py-3 rounded-full border border-gray-200 hover:bg-[#2D2E40] transition-all duration-300"
            >
              <span className="text-xs font-bold uppercase tracking-widest group-hover:text-white">Next</span>
              <FaChevronRight className="group-hover:text-white transition-colors" size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
