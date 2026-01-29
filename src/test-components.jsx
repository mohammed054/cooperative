import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowDown, FaPlay } from 'react-icons/fa';
import LazyLoadImage from 'react-lazy-load-image-component';

console.log('motion:', typeof motion);
console.log('motion.h1:', typeof motion.h1);
console.log('FaArrowDown:', typeof FaArrowDown);
console.log('FaPlay:', typeof FaPlay);
console.log('LazyLoadImage:', typeof LazyLoadImage);

function TestHero() {
  return (
    <div>
      <motion.h1>Test</motion.h1>
      <FaArrowDown />
      <FaPlay />
      <LazyLoadImage src="/test.jpg" alt="test" />
    </div>
  );
}

export default TestHero;