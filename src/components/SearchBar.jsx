import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ query, setQuery, autoFocus }) => {
  return (
    <div className="search-pill-container">
      <Search className="search-pill-icon" size={20} />
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
    </div>
  );
};

export default SearchBar;
