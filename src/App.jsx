import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import './index.css';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="main-container">
      <nav className="top-nav">
        <button onClick={toggleTheme} className="theme-toggle-pill">
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
      </nav>

      <Home />
    </div>
  );
}

export default App;
