import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ query, setQuery, autoFocus }) => {
  return (
    <div className="search-center-wrapper">
      <Search className="search-icon-glass" size={20} strokeWidth={2.5} />
      <input
        type="text"
        className="search-input-glass"
        placeholder="Enter codename to scan..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
        spellCheck="false"
        autoFocus={autoFocus}
      />
      {query && (
        <button 
          className="search-clear-glass" 
          onClick={() => setQuery('')} 
          aria-label="Clear search"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
