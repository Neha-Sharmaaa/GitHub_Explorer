import React from 'react';
import { Search, X, Home as HomeIcon } from 'lucide-react';

const SearchBar = ({ query, setQuery, autoFocus }) => {
  return (
    <div className="search-pill-container" style={{ gap: '0.5rem' }}>
      <button 
        className="icon-btn-plain" 
        onClick={() => setQuery('')}
        title="Go to Home"
        aria-label="Home"
      >
        <HomeIcon size={20} />
      </button>
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
        <Search className="search-pill-icon" size={18} />
        <input
          type="text"
          className="search-pill-input"
          placeholder="Search GitHub users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          spellCheck="false"
          autoFocus={autoFocus}
        />
        {query && (
          <button 
            className="search-clear-btn" 
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
