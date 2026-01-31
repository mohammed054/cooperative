import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight, FaStar, FaChair, FaMicrophone, FaTv, FaTools } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/navigation';

const StandardsCarousel = () => {
const standards = [
    {
      icon: <FaChair className="text-4xl" />,
      title: 'High-quality chairs',
      description: 'Premium seating solutions for professional settings',
      // Path changed to relative for GitHub Pages compatibility
      image: 'images/standard-1.jpg',
    },
    {
      icon: <FaMicrophone className="text-4xl" />,
      title: 'Reliable AV equipment',
      description: 'State-of-the-art audio and visual technology',
      // Path changed to relative for GitHub Pages compatibility
      image: 'images/standard-1.jpg',
    },
    {
      icon: <FaTv className="text-4xl" />,
      title: 'Custom stands',
      description: 'Bespoke display solutions tailored to your needs',
      // Path changed to relative for GitHub Pages compatibility
      image: 'images/standard-1.jpg',
    },
    {
      icon: <FaTools className="text-4xl" />,
      title: 'Full setup support',
      description: 'Professional installation and technical support',
      // Path changed to relative for GitHub Pages compatibility
      image: 'images/standard-1.jpg',
    },
  ];

  return (
    <section id="standards" className="py-20 section-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-xl">
            It All Starts With Our Standards
          </h2>
          <p className="text-body max-w-3xl mx-auto">
            We maintain the highest industry standards in every aspect of our service, from equipment quality to customer support
          </p>
        </motion.div>

        <div className="relative">
          {/* Custom Navigation Buttons */}
          <div className="custom-nav-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 -translate-x-4 lg:translate-x-0">
            <button className="bg-gold hover:bg-white text-dark-gray p-3 rounded-full shadow-lg transition-all duration-300">
              <FaChevronLeft className="text-xl" />
            </button>
          </div>
          <div className="custom-nav-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 translate-x-4 lg:translate-x-0">
            <button className="bg-gold hover:bg-white text-dark-gray p-3 rounded-full shadow-lg transition-all duration-300">
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
              delay: 4000,
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
            }}
            className="standards-swiper !px-12 lg:!px-16"
          >
            {standards.map((standard, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg overflow-hidden group cursor-pointer shadow-md"
                >
                  <div className="relative h-48 overflow-hidden">
<img
                        src={standard.image}
                        alt={standard.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-text/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <div className="text-primary-accent mb-4 flex justify-center">
                      {standard.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-primary-text mb-3 text-center">
                      {standard.title}
                    </h3>
                    <p className="text-text-muted text-sm text-center mb-4">
                      {standard.description}
                    </p>
                    <div className="flex justify-center items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="accent-text text-sm" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-charcoal rounded-lg p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-accent">100%</div>
                <div className="text-text-muted text-sm">Quality Checked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-accent">24/7</div>
                <div className="text-text-muted text-sm">Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-accent">5★</div>
                <div className="text-text-muted text-sm">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-accent">ISO</div>
                <div className="text-text-muted text-sm">Certified</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StandardsCarousel;