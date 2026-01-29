import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight, FaQuoteLeft, FaStar } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/navigation';

const TestimonialsCarousel = () => {
  const testimonials = [
    {
      name: 'John D.',
      company: 'Tech Corp Annual Conference',
      quote: 'The setup was flawless, highly recommend! The team arrived on time and everything was perfectly arranged. Our conference was a huge success thanks to their professional service.',
      rating: 5,
      avatar: '/api/placeholder/60/60',
    },
    {
      name: 'Sarah K.',
      company: 'Marketing Summit 2024',
      quote: 'Professional, timely, and reliable. The AV equipment was top-notch and the staff went above and beyond to ensure our event ran smoothly.',
      rating: 5,
      avatar: '/api/placeholder/60/60',
    },
    {
      name: 'Mark L.',
      company: 'Corporate Awards Gala',
      quote: 'Made our event seamless and stress-free. From planning to execution, they handled everything perfectly. Our guests were impressed with the elegant setup.',
      rating: 5,
      avatar: '/api/placeholder/60/60',
    },
    {
      name: 'Emily R.',
      company: 'Product Launch Event',
      quote: 'Exceptional service from start to finish. The team understood our vision and brought it to life. The equipment was modern and worked flawlessly.',
      rating: 5,
      avatar: '/api/placeholder/60/60',
    },
    {
      name: 'Michael B.',
      company: 'Sales Training Workshop',
      quote: 'Outstanding attention to detail. They provided everything we needed and more. The rental process was smooth and the delivery was punctual.',
      rating: 5,
      avatar: '/api/placeholder/60/60',
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-dark-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            But Don't Take It From Us
          </h2>
          <p className="text-light-gray text-lg max-w-3xl mx-auto">
            Hear what our satisfied clients have to say about their experience with our event rental services
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
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            className="testimonials-swiper !px-12 lg:!px-16"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-charcoal rounded-lg p-8 h-full flex flex-col"
                >
                  {/* Quote Icon */}
                  <div className="text-gold mb-4">
                    <FaQuoteLeft className="text-3xl opacity-50" />
                  </div>

                  {/* Quote */}
                  <p className="text-light-gray mb-6 flex-grow leading-relaxed">
                    "{testimonial.quote}"
                  </p>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-gold" />
                    ))}
                  </div>

                  {/* Client Info */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-dark-gray font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        {testimonial.name}
                      </div>
                      <div className="text-light-gray text-sm">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-charcoal rounded-lg p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-gold mb-2">500+</div>
                <div className="text-light-gray">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gold mb-2">4.9/5</div>
                <div className="text-light-gray">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gold mb-2">98%</div>
                <div className="text-light-gray">Would Recommend</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gold mb-2">10 Years</div>
                <div className="text-light-gray">In Business</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;