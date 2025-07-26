import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaTv, FaFilm, FaDragon, FaInfoCircle } from 'react-icons/fa';
import styles from '../Menu.module.css';

interface MenuProps {
  onClose: () => void;
}

const menuVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

const Menu: React.FC<MenuProps> = ({ onClose }) => {
  return (
    <motion.div
      className={styles.menu}
      variants={menuVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <Link to="/search/anime" className={styles.menuItem} onClick={onClose}>
        <FaDragon />
        <span>Anime</span>
      </Link>
      <Link to="/search/series" className={styles.menuItem} onClick={onClose}>
        <FaTv />
        <span>Series</span>
      </Link>
      <Link to="/search/movies" className={styles.menuItem} onClick={onClose}>
        <FaFilm />
        <span>Movies</span>
      </Link>
      <div className={styles.divider} />
      <Link to="/about" className={styles.menuItem} onClick={onClose}>
        <FaInfoCircle />
        <span>About</span>
      </Link>
    </motion.div>
  );
};

export default Menu;
