import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import { Moon, Sun, Github } from 'lucide-react';
import './index.css';

function App() {
  const [theme, setTheme] = useState('dark'); // Default to dark for neon glass effect

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
    <>
      <header className="app-header">
        <div className="brand-logo">
          <div className="brand-icon">
            <Github size={20} strokeWidth={2.5} />
          </div>
          neonGit
        </div>
        
        <button 
          onClick={toggleTheme} 
          className="theme-toggle"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} strokeWidth={2.5} /> : <Sun size={18} strokeWidth={2.5} />}
        </button>
      </header>

      <Home />
    </>
  );
}

export default App;
