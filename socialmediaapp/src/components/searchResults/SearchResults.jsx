import React from 'react';
import './searchResults.scss';
import { Link } from 'react-router-dom';
import moment from 'moment';

const SearchResults = ({ results, loading, query, onResultClick }) => {
  if (loading) {
    return (
      <div className="search-results">
        <div className="loading">Searching...</div>
      </div>
    );
  }

  if (query.length < 3) {
    return (
      <div className="search-results">
        <div className="message">Type at least 3 characters to search</div>
      </div>
    );
  }

  if (results.length === 0 && query.length >= 3) {
    return (
      <div className="search-results">
        <div className="no-results">No results found for "{query}"</div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="results-count">{results.length} result found</div>
      <div className="results-list">
        {results.map((post) => (
          <Link 
            to={`/post/${post.id}`} 
            key={post.id} 
            className="result-item"
            onClick={onResultClick}
          >
            <div className="post-info">
              <div className="user-info">
                <img 
                  src={post.profilePic ? `/upload/${post.profilePic}` : "/images/default-profile.jpg"} 
                  alt={post.name} 
                  className="profile-pic" 
                />
                <span className="username">{post.name}</span>
              </div>
              <p className="post-desc">
                {post.desc.length > 60 ? post.desc.substring(0, 60) + '...' : post.desc}
              </p>
              <div className="post-meta">
                <span className="platform">{post.platform}</span>
                <span className="date">{moment(post.createdAt).fromNow()}</span>
              </div>
            </div>
            {post.media && (
              <div className="post-media">
                {post.mediaType === 'image' ? (
                  <img src={`/upload/${post.media}`} alt="" />
                ) : post.mediaType === 'video' ? (
                  <video>
                    <source src={`/upload/${post.media}`} />
                  </video>
                ) : null}
              </div>
            )}
          </Link>
        ))}
      </div>
      <Link 
        to={`/search?q=${encodeURIComponent(query)}`} 
        className="view-all"
        onClick={onResultClick}
      >
        View all results
      </Link>
    </div>
  );
};

export default SearchResults; 