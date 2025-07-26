import type { Category } from '../types';

// src/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTv, FaFilm, FaDragon } from 'react-icons/fa';
import styles from '../Home.module.css';
import animeImage from '../assets/anime.jpg';

const categories: Category[] = [
  {
    type: 'anime',
    label: 'Anime',
    icon: <FaDragon />,
    bgImage: animeImage,
  },
  {
    type: 'series',
    label: 'Series',
    icon: <FaTv />,
    bgImage: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2070&auto=format&fit=crop',
  },
  {
    type: 'movies',
    label: 'Movies',
    icon: <FaFilm />,
    bgImage: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2070&auto=format&fit=crop',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
  hover: {
    scale: 1.03,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px var(--primary-accent)',
    transition: { duration: 0.3 },
  },
};

const titleVariants = {
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const subtitleVariants = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', delay: 0.2 } },
};

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <motion.div className={styles.header} initial="initial" animate="animate" variants={containerVariants}>
        <motion.h1 className={styles.title} variants={titleVariants}>
          iamcooked
        </motion.h1>
        <motion.p className={styles.subtitle} variants={subtitleVariants}>
          Track your complete watch time for anime, series, and movies.
        </motion.p>
        <motion.p className={styles.instruction} variants={subtitleVariants}>
          Select a category to find out.
        </motion.p>
      </motion.div>
      <motion.div
        className={styles.cardsContainer}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map((cat) => (
          <Link to={`/search/${cat.type}`} key={cat.type} className={styles.cardLink}>
            <motion.div
              className={styles.card}
              style={{ backgroundImage: `url(${cat.bgImage})` }}
              variants={cardVariants}
              whileHover="hover"
            >
              <div className={styles.overlay}>
                <div className={styles.icon}>{cat.icon}</div>
                <h2 className={styles.cardTitle}>{cat.label}</h2>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
