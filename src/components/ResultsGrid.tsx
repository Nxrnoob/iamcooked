// src/components/ResultsGrid.tsx
import type { SearchResult, ResultsGridProps } from '../types';
import React from 'react';
import { motion } from 'framer-motion';
import { FaPlusCircle, FaExclamationCircle } from 'react-icons/fa';
import styles from '../ResultsGrid.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
};

function ResultsGrid({ items, onSelect, selectedItems }: ResultsGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className={styles.noResults}>
        <FaExclamationCircle className={styles.noResultsIcon} />
        <p>No results found. Try a different search!</p>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.grid}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item) => {
        const imageSrc = item.Poster || item.images?.jpg?.image_url;
        const isSelected = selectedItems.some(selected => selected.imdbID === item.imdbID);

        return (
          <motion.div
            key={item.imdbID}
            className={`${styles.card} ${isSelected ? styles.selected : ''}`}
            variants={cardVariants}
            whileHover="hover"
          >
            <div className={styles.cardImageContainer}>
              {imageSrc && <img src={imageSrc} alt={item.Title} className={styles.cardImage} />}
              <div className={styles.cardOverlay}>
                <button
                  className={styles.addButton}
                  onClick={() => onSelect(item)}
                  disabled={isSelected}
                >
                  <FaPlusCircle />
                  <span>{isSelected ? 'Added' : 'Add'}</span>
                </button>
              </div>
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{item.Title}</h3>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default ResultsGrid;
