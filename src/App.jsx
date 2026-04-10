import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import GithubIcon from './components/GithubIcon';
import { SunIcon, MoonIcon } from './components/Icons';
import './index.css';

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    
    // Optional: Sync with system if user hasn't set a preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="main-container">
      <nav className="top-nav">
        <button onClick={toggleTheme} className="theme-toggle-pill" aria-label="Toggle theme">
          {theme === 'light' ? (
            <><MoonIcon size={16} /> <span>Dark</span></>
          ) : (
            <><SunIcon size={16} /> <span>Light</span></>
          )}
        </button>
      </nav>

      <Home />

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-left">
            <GithubIcon size={18} />
            <span>GitHub Explorer v1.0</span>
          </div>
          <div className="footer-right">
            Built with <span>React</span> & <span>Vite</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
