// src/components/FloatingTray.tsx
import type { WatchlistItem, TrayItemProps, FloatingTrayProps } from '../types';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrash, FaMagic } from 'react-icons/fa';
import styles from '../FloatingTray.module.css';

const formatTime = (totalMinutes: number) => {
  if (isNaN(totalMinutes) || totalMinutes === 0) return '0h 0m';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

const TrayItem: React.FC<TrayItemProps> = ({ item, onRemove, onUpdateEpisodes }) => {
  const maxEpisodes = item.episodes || 1;

  const handleEpisodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = parseInt(e.target.value, 10);
    onUpdateEpisodes(item.id, newCount);
  };

  const handleSetMax = () => {
    onUpdateEpisodes(item.id, maxEpisodes);
  };

  const imageSrc = item.Poster || item.images?.jpg?.image_url;

  return (
    <motion.li
      className={styles.item}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {imageSrc && <img src={imageSrc} alt={item.Title} className={styles.itemImage} />}
      <div className={styles.itemDetails}>
        <p className={styles.itemTitle}>{item.Title}</p>
        <div className={styles.episodeControls}>
          <input
            type="number"
            min="1"
            max={maxEpisodes}
            value={item.watched_episodes || 1}
            onChange={handleEpisodeChange}
            className={styles.episodeInput}
          />
          <span className={styles.episodeMax}>/ {maxEpisodes}</span>
          <button onClick={handleSetMax} className={styles.maxButton}>MAX</button>
        </div>
      </div>
      <button onClick={() => onRemove(item.id)} className={styles.removeButton}>
        <FaTrash />
      </button>
    </motion.li>
  );
};

const FloatingTray: React.FC<FloatingTrayProps> = ({ items, onRemove, onUpdateEpisodes, totalTime, onGenerateClick, onClose, onClearAll }) => {
  const trayVariants = {
    hidden: { x: '100%' },
    visible: { x: '0%', transition: { type: 'spring', stiffness: 300, damping: 30, when: "beforeChildren" } },
  };

  const mobileTrayVariants = {
    hidden: { y: '100%' },
    visible: { y: '0%', transition: { type: 'spring', stiffness: 300, damping: 30, when: "beforeChildren" } },
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <motion.div
      className={styles.tray}
      variants={isMobile ? mobileTrayVariants : trayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <div className={styles.header}>
        <h2 className={styles.title}>My Watchlist</h2>
        <div className={styles.headerActions}>
          <button onClick={onClose} className={`${styles.closeButton} ${styles.actionButton}`}>
            <FaTimes />
          </button>
        </div>
      </div>

      <ul className={styles.list}>
        <AnimatePresence>
          {items.length > 0 ? (
            items.map((item) => (
              <TrayItem
                key={item.id}
                item={item}
                onRemove={onRemove}
                onUpdateEpisodes={onUpdateEpisodes}
              />
            ))
          ) : (
            <motion.p
              className={styles.emptyMessage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Your list is empty. Add some shows!
            </motion.p>
          )}
        </AnimatePresence>
      </ul>

      <div className={styles.footer}>
        {items.length > 0 && (
          <button onClick={onClearAll} className={styles.clearButton}>
            Clear All
          </button>
        )}
        <div className={styles.totalTime}>
          <span className={styles.timeLabel}>Total Time Cooked:</span>
          <span className={styles.timeValue}>{formatTime(totalTime)}</span>
        </div>
        <button
          className={styles.generateButton}
          onClick={onGenerateClick}
          disabled={items.length === 0}
        >
          <FaMagic />
          <span>Generate Share Card</span>
        </button>
      </div>
    </motion.div>
  );
};

export default FloatingTray;
