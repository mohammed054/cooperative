import React from 'react';
import { motion } from 'framer-motion';
import LazyLoadImage from 'react-lazy-load-image-component';
import { FaArrowRight, FaExpand, FaUsers, FaWifi, FaCar } from 'react-icons/fa';

const ProductsSection = () => {

  const products = [
    {
      name: 'Premium Event Package',
      tags: ['500ft²', 'Indoor', 'AV Included'],
      description: 'Complete solution for medium-sized corporate events with full AV support and premium seating arrangements.',
      image: '/api/placeholder/800/400',
      smallImage: '/api/placeholder/100/100',
      features: [FaUsers, FaWifi, FaCar],
      color: 'gold',
    },
    {
      name: 'Executive Conference Setup',
      tags: ['1000ft²', 'Indoor', 'Premium'],
      description: 'High-end conference setup with luxury seating, advanced presentation systems, and dedicated technical support.',
      image: '/api/placeholder/800/400',
      smallImage: '/api/placeholder/100/100',
      features: [FaUsers, FaWifi, FaExpand],
      color: 'electric-blue',
    },
    {
      name: 'Outdoor Festival Package',
      tags: ['2000ft²', 'Outdoor', 'All-Weather'],
      description: 'Weather-resistant setup perfect for outdoor corporate events, festivals, and large gatherings.',
      image: '/api/placeholder/800/400',
      smallImage: '/api/placeholder/100/100',
      features: [FaExpand, FaWifi, FaCar],
      color: 'gold',
    },
  ];

  return (
    <section id="products" className="py-20 bg-charcoal overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            We Work With You to Make It Yours
          </h2>
          <p className="text-light-gray text-lg max-w-3xl mx-auto">
            Customizable rental packages tailored to your specific event requirements
          </p>
        </motion.div>

        <div className="space-y-24">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative ${
                index % 2 === 1 ? 'lg:pl-20' : 'lg:pr-20'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <LazyLoadImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover opacity-30"
                  effect="blur"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-dark-gray/90 via-dark-gray/70 to-dark-gray/90" />
              </div>

              {/* Content */}
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center p-8 lg:p-16">
                {index % 2 === 0 ? (
                  <>
                    {/* Left: Small Product Image */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      viewport={{ once: true }}
                      className="hidden lg:block"
                    >
                      <div className="relative">
                        <LazyLoadImage
                          src={product.smallImage}
                          alt={product.name}
                          className="rounded-lg shadow-2xl"
                          effect="blur"
                        />
                        <div className={`absolute -bottom-4 -right-4 bg-${product.color} text-dark-gray p-3 rounded-lg`}>
                          <FaExpand className="text-xl" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Right: Product Info */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      viewport={{ once: true }}
                    >
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                        {product.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="bg-gold/20 text-gold px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-light-gray mb-6 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="flex items-center space-x-4 mb-8">
                        {product.features.map((Feature, featureIndex) => (
                          <div key={featureIndex} className="text-gold">
                            <Feature className="text-xl" />
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button
                          className="btn-primary"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          See All Products
                        </motion.button>
                        <motion.button
                          className="bg-transparent border-2 border-gold text-gold px-6 py-3 rounded-full font-semibold hover:bg-gold hover:text-dark-gray transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Contact Us <FaArrowRight className="inline ml-2" />
                        </motion.button>
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <>
                    {/* Right: Small Product Image */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      viewport={{ once: true }}
                      className="hidden lg:block"
                    >
                      <div className="relative">
                        <LazyLoadImage
                          src={product.smallImage}
                          alt={product.name}
                          className="rounded-lg shadow-2xl"
                          effect="blur"
                        />
                        <div className={`absolute -bottom-4 -left-4 bg-${product.color} text-dark-gray p-3 rounded-lg`}>
                          <FaExpand className="text-xl" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Left: Product Info */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      viewport={{ once: true }}
                    >
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                        {product.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="bg-electric-blue/20 text-electric-blue px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-light-gray mb-6 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="flex items-center space-x-4 mb-8">
                        {product.features.map((Feature, featureIndex) => (
                          <div key={featureIndex} className="text-electric-blue">
                            <Feature className="text-xl" />
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button
                          className="btn-primary"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          See All Products
                        </motion.button>
                        <motion.button
                          className="bg-transparent border-2 border-electric-blue text-electric-blue px-6 py-3 rounded-full font-semibold hover:bg-electric-blue hover:text-dark-gray transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Contact Us <FaArrowRight className="inline ml-2" />
                        </motion.button>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;