import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { FaSearch } from 'react-icons/fa';
import styles from '../Search.module.css';
import ResultsGrid from '../components/ResultsGrid';
import SkeletonGrid from '../components/SkeletonGrid';
import type { SearchResult, SearchProps, WatchlistItem } from '../types';
import { OMDB_API_BASE_URL, JIKAN_API_BASE_URL } from '../constants/api';



const Search: React.FC<SearchProps> = ({ selectedItems, onSelectItem }) => {
  const { type } = useParams();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchType = type === 'anime' || type === 'series' ? 'series' : 'movie';

  useEffect(() => {
    if (query.length > 2) {
      const handler = setTimeout(() => {
        fetchResults();
      }, 500); // Debounce search
      return () => clearTimeout(handler);
    }
  }, [query]);

  const fetchResults = useCallback(async () => {
    if (!query) return;
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      let url: string;
      let data;

      if (type === 'anime') {
        url = `${JIKAN_API_BASE_URL}/anime?q=${encodeURIComponent(query)}&sfw`;
        const res = await fetch(url);
        data = await res.json();
        if (data.data && data.data.length > 0) {
          setResults(data.data.map((item: any) => ({
            imdbID: item.mal_id.toString(),
            Title: item.title,
            Year: item.year ? item.year.toString() : 'N/A',
            Poster: item.images?.jpg?.image_url || '',
            Type: 'anime',
            Runtime: item.duration || '24 min',
            episodes: item.episodes || 1,
          })));
        } else {
          setResults([]);
          setError('No anime found.');
        }
      } else {
        url = `${OMDB_API_BASE_URL}?s=${encodeURIComponent(query)}&type=${searchType}`;
        const res = await fetch(url);
        data = await res.json();
        if (data.Response === "True") {
          setResults(data.Search);
        } else {
          setResults([]);
          setError(data.Error);
        }
      }
    } catch (err) {
      setError('Failed to fetch results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [query, searchType, type]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults();
  };

  return (
    <>
      <div className={styles.searchContainer}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search for ${type}...`}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <FaSearch />
          </button>
        </form>
      </div>

      <div className={styles.resultsContainer}>
        {isLoading && <SkeletonGrid />}
        {error && <p className={styles.error}>{error}</p>}
        {!isLoading && !error && hasSearched && results.length === 0 && (
          <div className={styles.noResults}>
            <p>Couldn't find that one. Time for a re-watch of something old?</p>
          </div>
        )}
        {!isLoading && !error && (
          <ResultsGrid
            items={results}
            onSelect={onSelectItem}
            selectedItems={selectedItems}
          />
        )}
      </div>
    </>
  );
};

export default Search;
