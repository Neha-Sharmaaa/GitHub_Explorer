import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';
import RepoCard from '../components/RepoCard';
import Loader from '../components/Loader';
import SkeletonCard from '../components/SkeletonCard';
import GithubIcon from '../components/GithubIcon';
import { useDebounce } from '../hooks/useDebounce';
import { searchUsers, getUserRepos } from '../services/githubApi';
import { AlertCircle } from '../components/Icons';



const Home = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [isReposLoading, setIsReposLoading] = useState(false);
  const [reposError, setReposError] = useState(null);

  const [sortBy, setSortBy] = useState('updated');
  const [filterLang, setFilterLang] = useState('All');

  useEffect(() => {
    const fetchUsers = async () => {
      if (!debouncedQuery) {
        setUsers([]);
        setUsersError(null);
        setSelectedUser(null);
        setRepos([]);
        return;
      }
      setIsUsersLoading(true);
      setUsersError(null);

      try {
        const results = await searchUsers(debouncedQuery);
        setUsers(results);
      } catch (err) {
        setUsersError(err.message);
      } finally {
        setIsUsersLoading(false);
      }
    };
    fetchUsers();
  }, [debouncedQuery]);

  const handleUserClick = async (username) => {
    setSelectedUser(username);
    setIsReposLoading(true);
    setReposError(null);
    setSortBy('updated');
    setFilterLang('All');

    try {
      const results = await getUserRepos(username);
      setRepos(results);
    } catch (err) {
      setReposError(err.message);
    } finally {
      setIsReposLoading(false);
    }
  };

  const languages = useMemo(() => {
    const langs = new Set(repos.map(r => r.language).filter(Boolean));
    return ['All', ...Array.from(langs)];
  }, [repos]);

  const processedRepos = useMemo(() => {
    let filtered = repos;
    if (filterLang !== 'All') {
      filtered = filtered.filter(r => r.language === filterLang);
    }
    return [...filtered].sort((a, b) => {
      if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
      if (sortBy === 'forks') return b.forks_count - a.forks_count;
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
  }, [repos, filterLang, sortBy]);

  // If no search has happened yet, show the full hero
  const isHeroMode = query === '' && users.length === 0 && !isUsersLoading;

  if (isHeroMode) {
    return (
      <div className="hero-section">
        <h1 className="hero-title">
          Search <span>GitHub</span> Users
        </h1>
        <p className="hero-subtitle">
          Explore repositories, discover projects, and bookmark your favourites.
        </p>
        <div className="hero-search-wrapper">
          <SearchBar query={query} setQuery={setQuery} autoFocus={true} />
        </div>
        <GithubIcon size={80} className="github-logo-large" />
      </div>
    );
  }

  return (
    <>
      {!selectedUser && (
        <div className="results-header-bar">
          <SearchBar query={query} setQuery={setQuery} autoFocus={true} />
        </div>
      )}


      {usersError && (
        <div style={{ color: '#ff4d4f', marginBottom: '2rem', textAlign: 'center' }}>
          <AlertCircle size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> {usersError}
        </div>
      )}

      {!selectedUser && (
        isUsersLoading ? (
          <div className="user-results-grid">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="user-results-grid">
            {users.map((user, index) => (
              <UserCard 
                key={user.id} 
                user={user} 
                isActive={selectedUser === user.login} 
                onClick={handleUserClick} 
                style={{ animationDelay: `${index * 0.05}s` }}
              />
            ))}
          </div>
        )
      )}

      {selectedUser && (
        <div className="repos-container fade-in">
          {/* Enhanced User Profile Header */}
          {(() => {
            const userObj = users.find(u => u.login === selectedUser);
            if (!userObj) return null;
            return (
              <div className="selected-user-profile">
                <button 
                  onClick={() => setSelectedUser(null)} 
                  className="theme-toggle-pill back-btn-floating"
                >
                  ← Back to Search
                </button>
                <div className="profile-hero">
                  <img src={userObj.avatar_url} alt={selectedUser} className="profile-avatar-large" />
                  <div className="profile-info">
                    <h1 className="profile-name">{selectedUser}</h1>
                    <a href={userObj.html_url} target="_blank" rel="noopener noreferrer" className="github-link-pill">
                       Visit GitHub Profile
                    </a>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="repos-header">
            <h2 style={{ margin: 0 }}>
              Repositories
            </h2>

            {repos.length > 0 && (
              <div className="filter-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="filter-label">Sort:</span>
                  <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="updated">Latest</option>
                    <option value="stars">Stars</option>
                    <option value="forks">Forks</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="filter-label">Lang:</span>
                  <select className="filter-select" value={filterLang} onChange={e => setFilterLang(e.target.value)}>
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

          </div>

          {isReposLoading ? (
            <Loader message={`Fetching repositories for ${selectedUser}...`} />
          ) : repos.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No public repositories found.</p>
          ) : (
            <div className="repos-grid">
              {processedRepos.map((repo, index) => (
                <RepoCard 
                  key={repo.id} 
                  repo={repo} 
                  style={{ animationDelay: `${index * 0.05}s` }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
