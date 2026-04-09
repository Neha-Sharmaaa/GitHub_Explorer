import React from 'react';

// Reusable Loader component to show loading state
const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="text-center">
      <div className="spinner"></div>
      <p className="text-secondary">{message}</p>
    </div>
  );
};

export default Loader;
