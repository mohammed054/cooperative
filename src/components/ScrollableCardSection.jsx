import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ScrollableCardSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const [hasCompletedHorizontalScroll, setHasCompletedHorizontalScroll] = useState(false);
  const [flippedCards, setFlippedCards] = useState(new Set());

  const cardData = [
    {
      title: "Infinite scalability",
      image: "https://picsum.photos/seed/scalability/800/600.jpg",
      subtext: "Handle unlimited growth with our cloud-native infrastructure"
    },
    {
      title: "Seamless integration",
      image: "https://picsum.photos/seed/integration/800/600.jpg", 
      subtext: "Connect effortlessly with your existing tools and workflows"
    },
    {
      title: "Optimized cost efficiency",
      image: "https://picsum.photos/seed/efficiency/800/600.jpg",
      subtext: "Reduce operational costs while maximizing performance"
    },
    {
      title: "Rapid deployment",
      image: "https://picsum.photos/seed/deployment/800/600.jpg",
      subtext: "Go from concept to production in record time"
    }
  ];

  // Toggle card flip for desktop
  const toggleCardFlip = (index) => {
    if (window.innerWidth <= 768) return; // Disable on mobile
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Reset scroll to top when component mounts or page reloads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle vertical to horizontal scroll conversion
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const section = sectionRef.current;
    
    if (!scrollContainer || !section) return;

    let isVerticalScrolling = true;

    const handleWheel = (e) => {
      if (!isVerticalScrolling || hasCompletedHorizontalScroll) return;
      
      e.preventDefault();
      
      // Convert vertical scroll to horizontal (left direction)
      const scrollAmount = e.deltaY * 2; // Multiply for better responsiveness
      scrollContainer.scrollLeft += scrollAmount;

      // Check if we've reached the end
      const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      
      if (scrollContainer.scrollLeft >= maxScrollLeft && e.deltaY > 0) {
        // Completed horizontal scrolling, allow vertical scroll
        isVerticalScrolling = false;
        setHasCompletedHorizontalScroll(true);
        
        // Scroll to next section after a brief delay
        setTimeout(() => {
          const nextSection = section.nextElementSibling;
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    };

    // Reset when section comes back into view
    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVerticalScrolling = true;
          setHasCompletedHorizontalScroll(false);
          scrollContainer.scrollLeft = 0; // Reset scroll position
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3
    });

    observer.observe(section);

    // Add event listener
    section.addEventListener('wheel', handleWheel, { passive: false });
    
    // Also handle touch events for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    const handleTouchStart = (e) => {
      if (hasCompletedHorizontalScroll) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e) => {
      if (hasCompletedHorizontalScroll) return;
      
      const touchEndX = e.touches[0].clientX;
      const touchEndY = e.touches[0].clientY;
      const deltaX = touchStartX - touchEndX;
      const deltaY = touchStartY - touchEndY;
      
      // If scrolling more vertically than horizontally, prevent default to use our custom logic
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        e.preventDefault();
        scrollContainer.scrollLeft += deltaY * 2;
      }
    };

    scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    scrollContainer.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      observer.disconnect();
      section.removeEventListener('wheel', handleWheel);
      scrollContainer.removeEventListener('touchstart', handleTouchStart);
      scrollContainer.removeEventListener('touchmove', handleTouchMove);
    };
  }, [hasCompletedHorizontalScroll]);

  return (
    <section 
      id="scrollable-cards" 
      ref={(el) => {
        ref(el);
        sectionRef.current = el;
      }}
      className="relative w-screen h-screen overflow-hidden bg-ghaimuae-white"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : -30 }}
        transition={{ duration: 0.8 }}
        className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 text-center"
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ghaimuae-primary">
          Discover Our Advantages
        </h2>
        <p className="text-ghaimuae-dark-gray mt-2">Scroll down to explore</p>
      </motion.div>

      {/* Horizontal Scroll Container */}
      <motion.div 
        ref={scrollContainerRef}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -50 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute inset-0 flex items-center overflow-x-auto overflow-y-hidden scroll-smooth touch-pan-x"
        style={{
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none' /* IE and Edge */
        }}
      >
        <div className="flex gap-6 md:gap-8 lg:gap-12 px-6 md:px-8 lg:px-16">
          {cardData.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="flex-shrink-0 w-[85vw] md:w-[70vw] lg:w-[45vw] xl:w-[40vw] h-[70vh] md:h-[75vh] cursor-pointer"
              style={{
                scrollSnapAlign: 'start'
              }}
              onMouseEnter={() => toggleCardFlip(index)}
              onMouseLeave={() => toggleCardFlip(index)}
            >
              {/* Card Container with 3D Flip */}
              <div 
                className="relative w-full h-full"
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s ease-in-out',
                  transform: flippedCards.has(index) ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Front of Card */}
                <div 
                  className="absolute inset-0 w-full h-full bg-ghaimuae-white rounded-2xl shadow-2xl overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden'
                  }}
                >
                  {/* Background Image */}
                  <div className="relative w-full h-full">
                    <img 
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    {/* Dark Overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    
                    {/* Card Title */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-ghaimuae-white leading-tight">
                        {card.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Back of Card */}
                <div 
                  className="absolute inset-0 w-full h-full bg-gradient-to-br from-ghaimuae-primary to-ghaimuae-dark-gray rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8 flex flex-col justify-between"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  {/* Smaller Image */}
                  <div className="flex-shrink-0 h-[40%] mb-6">
                    <img 
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover rounded-lg opacity-80"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Card Content */}
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-ghaimuae-white mb-4">
                      {card.title}
                    </h3>
                    <p className="text-ghaimuae-light-gray text-base md:text-lg leading-relaxed">
                      {card.subtext}
                    </p>
                  </div>

                  {/* Call to Action */}
                  <div className="mt-6">
                    <button className="w-full bg-ghaimuae-white text-ghaimuae-primary py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20"
      >
        <div className="flex flex-col space-y-2">
          {cardData.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 bg-ghaimuae-dark-gray rounded-full opacity-50 hover:opacity-100 transition-opacity"
            />
          ))}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      {!hasCompletedHorizontalScroll && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="flex items-center space-x-2 text-ghaimuae-dark-gray">
            <svg 
              className="w-5 h-5 animate-bounce" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
            <span className="text-sm font-medium">Scroll down to browse</span>
          </div>
        </motion.div>
      )}

      {/* Hide scrollbar styles */}
      <style>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ScrollableCardSection;