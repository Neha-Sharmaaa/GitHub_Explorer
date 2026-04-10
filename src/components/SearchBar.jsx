import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ query, setQuery, autoFocus }) => {
  return (
    <div className="search-container">
      <div className="search-wrapper">
        <Search className="search-icon-fixed" size={16} />
        <input
          type="text"
          className="search-input"
          placeholder="Search GitHub users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          spellCheck="false"
          autoFocus={autoFocus}
        />
        {query && (
          <button className="clear-btn" onClick={() => setQuery('')}>
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
