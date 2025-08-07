import React from 'react';
import { JSX } from 'react/jsx-runtime';

interface WatchlistItem {
  id: string;
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: 'movie' | 'series' | 'anime';
  Runtime: string;
  watched_episodes?: number;
  episodes?: number;
  episodeRuntimes?: number[];
  images?: {
    jpg: {
      image_url: string;
    };
  };
}

interface BackButtonProps {
  onClick: () => void;
}

interface PageWrapperProps {
  children: React.ReactNode;
}

interface Category {
  type: string;
  label: string;
  icon: JSX.Element;
  bgImage: string;
}

interface SearchResult {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

interface ShareCardProps {
  items: WatchlistItem[];
  totalTime: number;
  cardRef: React.RefObject<HTMLDivElement>;
  bgImage: string | null;
  username: string;
}

interface Achievement {
  text: string;
  icon?: JSX.Element;
}

interface TrayItemProps {
  item: WatchlistItem;
  onRemove: (id: string) => void;
  onUpdateEpisodes: (id: string, newCount: number) => void;
  onUpdateTotalEpisodes: (id: string, newTotal: number) => void;
}


interface FloatingTrayProps {
  items: WatchlistItem[];
  onRemove: (id: string) => void;
  onUpdateEpisodes: (id: string, watched_episodes: number) => void;
  onUpdateTotalEpisodes: (id: string, newTotal: number) => void;
  totalTime: number;
  onGenerateClick: () => void;
  onClose: () => void;
  onClearAll: () => void;
}


interface ResultsGridProps {
  items: SearchResult[];
  onSelect: (item: WatchlistItem) => void;
  selectedItems: WatchlistItem[];
}
