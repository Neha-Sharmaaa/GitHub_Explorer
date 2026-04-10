import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';
import RepoCard from '../components/RepoCard';
import { useDebounce } from '../hooks/useDebounce';
import { searchUsers, getUserRepos } from '../services/githubApi';
import { Layers, Rocket, Ghost, AlertCircle, Compass } from 'lucide-react';

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

  const showHero = !hasSearched && query === '';

  if (showHero) {
    return (
      <div className="hero-wrapper">
        <h1 className="hero-title-main">Find Anyone.</h1>
        <p className="hero-subtitle-main">
          Dive into the open-source universe. Discover developers, analyze their code architectures, and get inspired by glass-fueled neon experiences.
        </p>
        <SearchBar query={query} setQuery={setQuery} autoFocus={true} />
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="dashboard-search">
        <SearchBar query={query} setQuery={setQuery} autoFocus={true} />
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: selectedUser ? '380px 1fr' : '1fr' }}>
        
        {/* Left Panel: Users */}
        <div className="glass-panel" style={{ margin: selectedUser ? '0' : '0 auto', maxWidth: selectedUser ? 'none' : '600px', width: '100%' }}>
          <div className="panel-header">
            <span className="panel-title">Explorers</span>
            {users.length > 0 && <span className="panel-badge">{users.length}</span>}
          </div>

          {isUsersLoading && (
            <div className="state-container" style={{ padding: '2rem' }}>
              <div className="loader-spinner" />
            </div>
          )}

          {usersError && (
            <div className="state-container" style={{ padding: '2rem' }}>
              <AlertCircle size={40} className="state-icon" style={{ color: 'var(--accent-ter)' }} />
              <div style={{ color: 'var(--accent-ter)', fontWeight: 500 }}>{usersError}</div>
            </div>
          )}

          {!isUsersLoading && !usersError && users.length === 0 && debouncedQuery && (
            <div className="state-container" style={{ padding: '3rem 1rem' }}>
              <Ghost size={48} className="state-icon" />
              <h3 className="state-title">No one found</h3>
              <p className="state-desc">Looks like this sector is empty. Try a different codename.</p>
            </div>
          )}

          <div>
            {users.map((user, i) => (
              <div key={user.id} style={{ opacity: 0, animation: `fadeIn 0.4s ${i * 0.05}s forwards ease-out` }}>
                <UserCard 
                  user={user} 
                  isActive={selectedUser === user.login} 
                  onClick={handleUserClick} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Repos */}
        {selectedUser && (
          <div className="glass-panel">
            <div className="panel-header">
              <span className="panel-title">Architectures</span>
              {repos.length > 0 && <span className="panel-badge">{processedRepos.length}</span>}
            </div>

            {repos.length > 0 && (
              <div className="filter-bar">
                <select className="glass-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="updated">Latest Activity</option>
                  <option value="stars">Starlight</option>
                  <option value="forks">Branches</option>
                </select>
                <select className="glass-select" value={filterLang} onChange={e => setFilterLang(e.target.value)}>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            )}

            {isReposLoading ? (
              <div className="state-container">
                <div className="loader-spinner" />
                <p className="state-desc">Scanning repositories...</p>
              </div>
            ) : reposError ? (
              <div className="state-container">
                <AlertCircle size={48} className="state-icon" style={{ color: 'var(--accent-ter)' }} />
                <h3 className="state-title">Scan Failed</h3>
                <p className="state-desc">{reposError}</p>
              </div>
            ) : repos.length === 0 ? (
              <div className="state-container">
                <Layers size={56} className="state-icon" />
                <h3 className="state-title">No Architectures</h3>
                <p className="state-desc">This explorer hasn't published any public code yet.</p>
              </div>
            ) : (
              <div className="repos-grid">
                {processedRepos.map((repo, i) => (
                  <div key={repo.id} style={{ opacity: 0, animation: `fadeIn 0.5s ${i * 0.08}s forwards ease-out` }}>
                    <RepoCard repo={repo} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;
