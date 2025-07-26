import React, { useState, useEffect, useMemo } from 'react';
import styles from '../ShareCard.module.css';
import type { WatchlistItem, Achievement, ShareCardProps } from '../types';

const formatTime = (totalMinutes: number) => {
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  let result = [];
  if (days) result.push(`${days} Day${days > 1 ? 's' : ''}`);
  if (hours) result.push(`${hours} Hr${hours > 1 ? 's' : ''}`);
  if (minutes && !days) result.push(`${minutes} Min`);
  return result.join(' ');
};

const getTitle = (totalMinutes: number) => {
  const hrs = totalMinutes / 60;
  if (hrs >= 200) return "Absolutely Overcooked 🔥";
  if (hrs >= 100) return "Stream Soldier 🎖️";
  if (hrs >= 50) return "Officially Cooked";
  if (hrs >= 10) return "Kinda Cooked";
  return "Just Getting Started";
};

const achievements: Achievement[] = [
    { text: "🌙 No Sleep Gang" },
    { text: "❤️ One More Episode" },
    { text: "😴 Sleep? Never heard of her" },
    { text: "⏱️ 24hr Binge Club" },
    { text: "😵‍💫 Unhinged Watcher" },
    { text: "🏃 Marathon Runner" },
    { text: "🔥 POV: You're cooked" },
    { text: "🌱 No Grass Touched" },
    { text: "🧟 Stream Zombie" },
    { text: "👹 Binge Demon" },
    { text: "🍿 Snack Overlord" },
    { text: "📺 Screen Burn-in" },
    { text: "🛋️ Couch Potato Pro" },
    { text: "🤓 Certified Weeb" },
    { text: "🎬 Director's Cut" }
];

const getRandomAchievements = (count = 2) =>
  [...achievements]
    .sort(() => 0.5 - Math.random())
    .slice(0, count);

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

const ShareCard: React.FC<ShareCardProps> = ({ items, totalTime, cardRef, bgImage, username }) => {
  const [randomAchievements, setRandomAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    setRandomAchievements(getRandomAchievements(2));
  }, [items]);

  const topShows = useMemo(() => {
    return [...items]
      .map(item => ({
        ...item,
        watchTime: (item.watched_episodes || 1) * parseDuration(item.Runtime),
      }))
      .sort((a, b) => b.watchTime - a.watchTime)
      .slice(0, 3);
  }, [items]);

  const timeText = formatTime(totalTime);
  const title = getTitle(totalTime);

  const typeCounts = items.reduce((acc, item) => {
    const type = item.Type;
    if (type) acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div ref={cardRef} className={styles.card}>
      <div className={`${styles.background} iamcooked-share-card-background`} style={{ backgroundImage: `url(${bgImage || ''})` }} />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.brand}>iamcooked</div>
          {username && <p className={styles.username}>@{username}</p>}
        </div>

        <div className={styles.mainStats}>
          <h1 className={styles.timeValue}>{timeText}</h1>
          <h2 className={styles.title}>{title}</h2>
        </div>

        <div className={styles.footer}>
          <div className={styles.breakdown}>
            {Object.entries(typeCounts).map(([type, count]) => (
              <div key={type} className={styles.breakdownItem}>
                {count} {type === 'anime' ? 'Anime' : type === 'movie' ? 'Movies' : 'Series'}
              </div>
            ))}
          </div>
          <div className={styles.achievementWrapper}>
            {randomAchievements.map((achievement, i) => (
              <div key={i} className={styles.achievement}>
                <span>{achievement.text}</span>
              </div>
            ))}
          </div>
          
          {topShows.length > 0 && (
            <>
              <div className={styles.divider} />
              <div className={styles.topShows}>
                <h3 className={styles.topShowsTitle} style={{fontWeight: 'bold', textShadow: '0 0 5px rgba(255,255,255,0.3)', color: '#FF2ECC'}}>Top Watched</h3>
                <div className={styles.showList}>
                  {topShows.map((show) => (
                    <div key={show.imdbID} className={styles.showItem}>
                      {show.Title}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className={styles.divider} />
          <div className={styles.footerText}>
            Track your watch time at iamcooked.com
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareCard;
