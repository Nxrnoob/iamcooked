import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { FaBookmark, FaSpinner, FaDownload } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import html2canvas from 'html2canvas';

import styles from './App.module.css';
import Home from './pages/Home';
import Search from './pages/Search';
import About from './pages/About';
import FloatingTray from './components/FloatingTray';
import ShareCard from './pages/ShareCard';
import NavBar from './components/NavBar';
import Menu from './components/Menu';
import type { WatchlistItem, PageWrapperProps } from './types';

const PageWrapper: React.FC<PageWrapperProps & { className?: string }> = ({ children, className }) => (
  <div className={`${styles.viewContainer} ${className || ''}`}>
    {children}
  </div>
);

function App() {
  const [selectedItems, setSelectedItems] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('iamcooked-watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('iamcooked-watchlist', JSON.stringify(selectedItems));
  }, [selectedItems]);

  useEffect(() => {
    if (location.pathname !== '/') {
      setIsTrayOpen(false);
    }
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSelectItem = async (item: WatchlistItem) => {
    if (selectedItems.find(i => i.imdbID === item.imdbID)) {
      return; // Avoid duplicates
    }

    let newItem: WatchlistItem = { ...item, id: item.imdbID, watched_episodes: 1 };

    if (item.Type === 'series') {
      try {
        const seriesDetailsRes = await fetch(`/.netlify/functions/omdb?i=${item.imdbID}`);
        const seriesDetails = await seriesDetailsRes.json();
        if (seriesDetails.Response === "True") {
          newItem.Runtime = seriesDetails.Runtime;
        }

        const tvmazeRes = await fetch(`/.netlify/functions/tvmaze/lookup/shows?imdb=${item.imdbID}`);
        if (tvmazeRes.ok) {
          const tvmazeData = await tvmazeRes.json();
          const episodesRes = await fetch(`/.netlify/functions/tvmaze/shows/${tvmazeData.id}/episodes`);
          if (episodesRes.ok) {
            const episodesData = await episodesRes.json();
            newItem.episodes = episodesData.length;
            newItem.watched_episodes = episodesData.length;
            if (episodesData[0]?.runtime) {
              newItem.episodeRuntimes = episodesData.map((ep: any) => ep.runtime);
            }
          }
        } else {
          throw new Error('TVMaze lookup failed');
        }
      } catch (error) {
        console.error("TVMaze fetch failed, falling back to OMDB estimation:", error);
        // Fallback logic remains the same
      }
    } else if (item.Type === 'anime') {
      try {
        const animeDetailsRes = await fetch(`/.netlify/functions/jikan/anime/${item.imdbID}`);
        const animeDetailsData = await animeDetailsRes.json();
        const animeData = animeDetailsData.data;

        if (animeData) {
          newItem.Runtime = animeData.duration || '24 min per ep';
          const episodesRes = await fetch(`/.netlify/functions/jikan/anime/${item.imdbID}/episodes`);
          const episodesData = await episodesRes.json();
          const totalEpisodes = episodesData.pagination?.items?.total;

          if (totalEpisodes) {
            newItem.episodes = totalEpisodes;
            newItem.watched_episodes = totalEpisodes;
          } else {
            newItem.episodes = animeData.episodes || item.episodes || 1;
            newItem.watched_episodes = animeData.episodes || item.episodes || 1;
          }
        } else {
          newItem.episodes = item.episodes || 1;
          newItem.watched_episodes = item.episodes || 1;
        }
      } catch (error) {
        console.error("Jikan anime details fetch failed:", error);
        newItem.episodes = item.episodes || 1;
        newItem.watched_episodes = item.episodes || 1;
      }
    } else if (item.Type === 'movie') {
      try {
        const movieDetailsRes = await fetch(`/.netlify/functions/omdb?i=${item.imdbID}`);
        const movieDetails = await movieDetailsRes.json();
        if (movieDetails.Response === "True") {
          newItem.Runtime = movieDetails.Runtime;
        }
      } catch (e) {
        console.error("Failed to fetch movie details:", e);
      }
    }

    setSelectedItems(prev => [...prev, newItem]);
  };

  const parseDuration = (duration: string): number => {
    if (!duration || typeof duration !== 'string' || duration === 'N/A') return 24;
    let match = duration.match(/(\d+)\s*min/);
    if (match) return parseInt(match[1], 10);
    match = duration.match(/(\d+)\s*hr/);
    let hours = match ? parseInt(match[1], 10) : 0;
    match = duration.match(/(\d+)\s*min/);
    let minutes = match ? parseInt(match[1], 10) : 0;
    if (hours === 0 && minutes === 0) {
      match = duration.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 24;
    }
    return hours * 60 + minutes;
  };

  const totalTime = selectedItems.reduce((sum, item) => {
    if (item.episodeRuntimes && item.watched_episodes) {
      const watchedRuntimes = item.episodeRuntimes.slice(0, item.watched_episodes);
      const time = watchedRuntimes.reduce((a, b) => a + b, 0);
      return sum + time;
    }
    const duration = parseDuration(item.Runtime);
    const episodes = item.Type === 'movie' ? 1 : (item.watched_episodes || 1);
    return sum + episodes * duration;
  }, 0);

  const handleGenerate = async () => {
    const cardElement = cardRef.current;
    if (!cardElement) return;
    setIsGenerating(true);
    const clonedCard = cardElement.cloneNode(true) as HTMLElement;
    clonedCard.style.position = 'absolute';
    clonedCard.style.left = '-9999px';
    clonedCard.style.top = '0px';
    document.body.appendChild(clonedCard);
    try {
      if (bgImage) {
        const response = await fetch(bgImage);
        const blob = await response.blob();
        const dataUrl = await new Promise<string>(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        const backgroundElement = clonedCard.querySelector('.iamcooked-share-card-background') as HTMLElement;
        if (backgroundElement) {
          backgroundElement.style.backgroundImage = `url(${dataUrl})`;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      const canvas = await html2canvas(clonedCard, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        allowTaint: true,
      });
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'iamcooked-card.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      document.body.removeChild(clonedCard);
      setIsGenerating(false);
    }
  };

  const handleSharePage = () => {
    if (selectedItems.length === 0) {
      navigate('/share');
      return;
    }
    const mostWatchedItem = [...selectedItems]
      .map(item => ({
        ...item,
        watchTime: (item.watched_episodes || 1) * parseDuration(item.Runtime),
      }))
      .sort((a, b) => b.watchTime - a.watchTime)[0];
    const posterUrl = mostWatchedItem?.Poster || mostWatchedItem?.images?.jpg?.image_url || null;
    setBgImage(posterUrl);
    navigate('/share');
  };

  return (
    <div className={`${styles.app} ${isTrayOpen ? styles.trayVisible : ''}`}>
      <NavBar onMenuClick={() => setIsMenuOpen(!isMenuOpen)} />
      
      <AnimatePresence>
        {isMenuOpen && <Menu key="menu" onClose={() => setIsMenuOpen(false)} />}
        
        {isTrayOpen && (
          <FloatingTray
            key="tray"
            items={selectedItems}
            onRemove={(id) => setSelectedItems(selectedItems.filter(i => i.id !== id))}
            onUpdateEpisodes={(id, newCount) => {
              setSelectedItems(items => items.map(item =>
                item.id === id ? { ...item, watched_episodes: newCount } : item
              ));
            }}
            onUpdateTotalEpisodes={(id, newTotal) => {
              setSelectedItems(items => items.map(item =>
                item.id === id ? { ...item, episodes: newTotal } : item
              ));
            }}
            onGenerateClick={handleSharePage}
            onClose={() => setIsTrayOpen(false)}
            onClearAll={() => setSelectedItems([])}
            totalTime={totalTime}
          />
        )}

        {selectedItems.length > 0 && !isTrayOpen && (
          <motion.button
            key="fab"
            className={styles.fab}
            onClick={() => setIsTrayOpen(true)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <FaBookmark />
          </motion.button>
        )}
      </AnimatePresence>

      <Routes>
        <Route path="/" element={<PageWrapper className={styles.pageWithNav}><Home /></PageWrapper>} />
        <Route
          path="/search/:type"
          element={
            <PageWrapper className={styles.pageWithNav}>
              <Search selectedItems={selectedItems} onSelectItem={handleSelectItem} />
            </PageWrapper>
          }
        />
        <Route
          path="/share"
          element={
            <PageWrapper className={styles.pageWithNav}>
              <div className={styles.sharePageContainer}>
                <div className={styles.shareControls}>
                  <input
                    type="text"
                    placeholder="Your Name (optional)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.usernameInput}
                  />
                  <button onClick={handleGenerate} disabled={isGenerating} className={styles.downloadButton}>
                    {isGenerating ? <FaSpinner className={styles.spinner} /> : <FaDownload />}
                    <span>Download</span>
                  </button>
                </div>
                <div className={styles.cardPreview}>
                  <ShareCard
                    items={selectedItems}
                    totalTime={totalTime}
                    cardRef={cardRef}
                    bgImage={bgImage}
                    username={username}
                  />
                </div>
              </div>
            </PageWrapper>
          }
        />
        <Route path="/about" element={<PageWrapper className={styles.pageWithNav}><About /></PageWrapper>} />
      </Routes>
    </div>
  );
}

export default App;
