import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';
import RepoCard from '../components/RepoCard';
import Loader from '../components/Loader';
import { useDebounce } from '../hooks/useDebounce';
import { searchUsers, getUserRepos } from '../services/githubApi';
import { BookOpen, Search, AlertCircle, Compass } from 'lucide-react';

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
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!debouncedQuery) {
        setUsers([]);
        setUsersError(null);
        return;
      }
      setHasSearched(true);
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

  if (!hasSearched && query === '') {
    return (
      <div className="hero-landing fade-in">
        <Compass size={64} className="hero-icon" />
        <h1 className="hero-title">GitHub Explorer</h1>
        <p className="hero-subtitle">
          Discover GitHub users and explore their public repositories with a clean, structured interface.
        </p>
        <div className="hero-search-box">
          <SearchBar query={query} setQuery={setQuery} autoFocus={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <SearchBar query={query} setQuery={setQuery} autoFocus={true} />

      {usersError && (
        <div className="error-banner" style={{ color: '#cf222e', marginBottom: '1rem' }}>
          <AlertCircle size={16} /> {usersError}
        </div>
      )}

      <div className={`layout-sidebar ${!selectedUser ? 'single-column' : ''}`}>
        <div className="section-panel">
          <div className="section-header">
            <span>Users</span>
            {users.length > 0 && <span className="section-count">{users.length}</span>}
          </div>
          
          {isUsersLoading && <Loader message="Finding users..." />}
          
          {!isUsersLoading && !usersError && users.length === 0 && debouncedQuery && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No users found for "{debouncedQuery}"
            </div>
          )}

          <div className="user-list">
            {users.map(user => (
              <UserCard 
                key={user.id} 
                user={user} 
                isActive={selectedUser === user.login} 
                onClick={handleUserClick} 
              />
            ))}
          </div>
        </div>

        {selectedUser && (
          <div className="section-panel">
            <div className="section-header">
              <span>Repositories for {selectedUser}</span>
              {repos.length > 0 && <span className="section-count">{processedRepos.length}</span>}
            </div>

            {repos.length > 0 && (
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-default)', display: 'flex', gap: '0.5rem' }}>
                <select 
                  className="search-input" 
                  style={{ width: 'auto', padding: '0.25rem 0.5rem' }}
                  value={sortBy} 
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="updated">Recently Updated</option>
                  <option value="stars">Most Stars</option>
                  <option value="forks">Most Forks</option>
                </select>
                <select 
                  className="search-input" 
                  style={{ width: 'auto', padding: '0.25rem 0.5rem' }}
                  value={filterLang} 
                  onChange={e => setFilterLang(e.target.value)}
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            )}

            {isReposLoading && <Loader message="Fetching repositories..." />}
            
            {reposError && (
              <div style={{ padding: '1rem', color: '#cf222e' }}>
                 {reposError}
              </div>
            )}

            <div className="repo-list">
              {processedRepos.map(repo => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
              {!isReposLoading && !reposError && repos.length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  This user has no public repositories.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
