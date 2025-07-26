// src/components/SkeletonGrid.tsx
import type { SkeletonGridProps } from '../types';
import React from 'react';
import { motion } from 'framer-motion';
import styles from '../SkeletonGrid.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const skeletonVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const SkeletonCard = () => (
  <motion.div className={styles.card} variants={skeletonVariants}>
    <div className={styles.cardImage} />
    <div className={styles.cardContent}>
      <div className={styles.cardTitle} />
    </div>
  </motion.div>
);

function SkeletonGrid() {
  return (
    <motion.div className={styles.grid} variants={containerVariants} initial="hidden" animate="visible">
      {Array.from({ length: 20 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </motion.div>
  );
}

export default SkeletonGrid;
