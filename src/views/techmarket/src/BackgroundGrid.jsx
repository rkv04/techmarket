import React from 'react';
import { motion } from 'framer-motion';
import './BackgroundGrid.css';

const BackgroundGrid = () => {
  return (
    <div className="background-grid-container">
      <motion.div
        className="background-grid"
        initial={{ x: 0 }}
        animate={{ x: -1810 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="tile" />
        ))}
      </motion.div>
      
      <motion.div
        className="background-grid"
        initial={{ x: 1810 }}
        animate={{ x: 0 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="tile" />
        ))}
      </motion.div>
    </div>
  );
};

export default BackgroundGrid;
