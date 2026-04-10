import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';
import RepoCard from '../components/RepoCard';
import { useDebounce } from '../hooks/useDebounce';
import { searchUsers, getUserRepos } from '../services/githubApi';
import { AlertCircle } from 'lucide-react';

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

  return (
    <>
      <div className="search-box">
        <label className="search-label">Search GitHub users</label>
        <SearchBar query={query} setQuery={setQuery} autoFocus={true} />
      </div>

      {usersError && (
        <div style={{ color: '#ff4d4f', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} /> {usersError}
        </div>
      )}

      {isUsersLoading ? (
        <div className="spinner-wrap"><div className="loading-spinner"></div></div>
      ) : (
        <div className="users-container">
          {users.length > 0 && <h2>Users</h2>}
          <div className="users-grid">
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
      )}

      {selectedUser && (
        <div className="repos-section">
          <div className="repos-header">
            <h2>Repositories for {selectedUser}</h2>
            {repos.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select 
                  className="theme-btn" 
                  value={sortBy} 
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="updated">Recently Updated</option>
                  <option value="stars">Most Stars</option>
                  <option value="forks">Most Forks</option>
                </select>
                <select 
                  className="theme-btn" 
                  value={filterLang} 
                  onChange={e => setFilterLang(e.target.value)}
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {isReposLoading ? (
            <div className="spinner-wrap"><div className="loading-spinner"></div></div>
          ) : reposError ? (
            <div style={{ color: '#ff4d4f', padding: '1rem' }}>{reposError}</div>
          ) : (
            <div className="repos-grid">
              {processedRepos.map(repo => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
