import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ query, setQuery }) => {
  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          className="search-input"
          placeholder="Search GitHub users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="clear-btn" onClick={handleClear} aria-label="Clear search">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
