import React from 'react';

const SearchBar = ({ query, setQuery, autoFocus }) => {
  return (
    <div className="search-input-wrapper">
      <input
        type="text"
        className="search-field"
        placeholder="Enter codename to scan..."
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
