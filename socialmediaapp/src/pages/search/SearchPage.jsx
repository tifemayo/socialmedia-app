import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import './searchPage.scss';
import Post from '../../components/post/Post';

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  const [currentQuery, setCurrentQuery] = useState(searchQuery);

  // Update search input when URL query changes
  useEffect(() => {
    setCurrentQuery(searchQuery);
  }, [searchQuery]);

  // Get search results
  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => makeRequest.get(`/posts/search?q=${searchQuery}`).then(res => res.data),
    enabled: !!searchQuery
  });

  if (isLoading) {
    return (
      <div className="search-page">
        <div className="search-header">
          <h2>Searching for posts containing: "{searchQuery}"</h2>
        </div>
        <div className="loading">Loading search results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-page">
        <div className="search-header">
          <h2>Error searching for: "{searchQuery}"</h2>
        </div>
        <div className="error">An error occurred while searching. Please try again.</div>
      </div>
    );
  }

  if (!searchResults || searchResults.length === 0) {
    return (
      <div className="search-page">
        <div className="search-header">
          <h2>Search results for: "{searchQuery}"</h2>
        </div>
        <div className="no-results">
          <p>No posts found matching your search criteria.</p>
          <p>Try using different keywords or check your spelling.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="search-header">
        <h2>Search results for: "{searchQuery}"</h2>
        <p>{searchResults.length} posts found</p>
      </div>
      
      <div className="search-results-container">
        <div className="search-results-list">
          {searchResults.map(post => (
            <div className="search-result-row" key={post.id}>
              <Post post={post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;