import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import { Moon, Sun } from 'lucide-react';
import './index.css';

function App() {
  // Theme state
  const [theme, setTheme] = useState('light');

  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.setAttribute('data-theme', savedTheme);
    }
  }, []);

  // Toggle theme and save
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  return (
    <>
      <div 
        style={{ 
          position: 'absolute', 
          top: '2rem', 
          right: '2rem',
          zIndex: 100 
        }}
      >
        <button 
          onClick={toggleTheme} 
          className="btn-icon"
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
      <Home />
    </>
  );
}

export default App;
