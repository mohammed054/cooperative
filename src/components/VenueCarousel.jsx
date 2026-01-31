import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/navigation';

const VenueCarousel = () => {
const venues = [
    {
      name: 'Conference Hall',
      // Path changed to relative for GitHub Pages compatibility
      image: 'images/venue-1.jpg',
      description: 'Professional conference spaces with modern amenities',
    },
    {
      name: 'Outdoor Venue',
      // Path changed to relative for GitHub Pages compatibility
      image: 'images/venue-1.jpg',
      description: 'Beautiful outdoor settings for memorable events',
    },
    {
      name: 'Banquet Hall',
      // Path changed to relative for GitHub Pages compatibility
      image: 'images/venue-1.jpg',
      description: 'Elegant banquet halls for sophisticated gatherings',
    },
    {
      name: 'Meeting Room',
      // Path changed to relative for GitHub Pages compatibility
      image: 'images/venue-1.jpg',
      description: 'Intimate meeting rooms for focused discussions',
    },
    {
      name: 'Exhibition Space',
      // Path changed to relative for GitHub Pages compatibility
      image: 'images/venue-1.jpg',
      description: 'Spacious exhibition areas for large events',
    },
  ];

  return (
    <section id="rentals" className="py-20 section-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            What Type of Place
          </h2>
          <p className="text-light-gray text-lg max-w-2xl mx-auto">
            Choose from our wide variety of venue types, each equipped with premium rental solutions for your corporate events
          </p>
        </motion.div>

        <div className="relative">
          {/* Custom Navigation Buttons */}
            <div className="custom-nav-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 -translate-x-4 lg:translate-x-0">
              <button className="accent-text bg-corporate-gold hover:bg-white hover:text-primary p-3 rounded-full shadow-lg transition-all duration-300">
                <FaChevronLeft className="text-xl" />
              </button>
            </div>
            <div className="custom-nav-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 translate-x-4 lg:translate-x-0">
              <button className="accent-text bg-corporate-gold hover:bg-white hover:text-primary p-3 rounded-full shadow-lg transition-all duration-300">
                <FaChevronRight className="text-xl" />
              </button>
            </div>

          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              nextEl: '.custom-nav-next button',
              prevEl: '.custom-nav-prev button',
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
            }}
            className="venue-swiper !px-12 lg:!px-16"
          >
            {venues.map((venue, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg card">
<img
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-gray/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="heading-md hover-underline">
                      {venue.name}
                    </h3>
                    <p className="text-light-gray text-sm line-clamp-2">
                      {venue.description}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="accent-text hover-underline"
                    >
                      Learn More →
                    </motion.button>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default VenueCarousel;