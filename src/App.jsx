import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import './index.css';

function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
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
    <div className="main-wrapper">
      <header className="header-box">
        <div className="header-title-group">
          <h1>GitHub Explorer</h1>
          <p>Search users, explore repositories, sort and filter quickly.</p>
        </div>
        <button onClick={toggleTheme} className="theme-btn">
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
      </header>

      <Home />
    </div>
  );
}

export default App;
