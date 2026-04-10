import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import { Moon, Sun, Compass } from 'lucide-react';
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
    <>
      <header className="app-header">
        <div className="brand-wrapper">
          <Compass size={24} />
          <span>GitHub Explorer</span>
        </div>
        
        <button 
          onClick={toggleTheme} 
          className="btn-icon"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </header>

      <Home />
    </>
  );
}

export default App;
