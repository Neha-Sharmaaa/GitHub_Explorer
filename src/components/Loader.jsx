import React from 'react';

const Loader = ({ message = "Searching for developers..." }) => {
  return (
    <div className="spinner-wrap" style={{ flexDirection: 'column' }}>
      <div className="loading-spinner"></div>
      <p style={{ 
        marginTop: '1.5rem', 
        color: 'var(--text-secondary)', 
        fontSize: '0.9rem',
        fontWeight: '500',
        letterSpacing: '0.02em'
      }}>
        {message}
      </p>
    </div>
  );
};

export default Loader;
