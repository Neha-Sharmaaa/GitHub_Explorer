import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';
import RepoCard from '../components/RepoCard';
import Loader from '../components/Loader';
import { useDebounce } from '../hooks/useDebounce';
import { searchUsers, getUserRepos } from '../services/githubApi';
import { BookOpen, Search, AlertCircle, Code2 } from 'lucide-react';

// Custom GitHub icon
const GithubIcon = ({ size = 24, className, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Home = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  // State: Users
  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  // State: Selected User & Repos
  const [selectedUser, setSelectedUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [isReposLoading, setIsReposLoading] = useState(false);
  const [reposError, setReposError] = useState(null);

  // Sorting and Filtering states for repos
  const [sortBy, setSortBy] = useState('updated');
  const [filterLang, setFilterLang] = useState('All');

  // Track if user has ever searched
  const [hasSearched, setHasSearched] = useState(false);

  // Effect: Fetch Users when debouncedQuery changes
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

  // Handler: When a user card is clicked
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

  // Derive unique languages for the filter dropdown
  const languages = useMemo(() => {
    const langs = new Set(repos.map(r => r.language).filter(Boolean));
    return ['All', ...Array.from(langs)];
  }, [repos]);

  // Derived state: Filtered and Sorted Repos
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

  // Show hero landing when user hasn't searched yet
  const showHero = !hasSearched && query === '';

  if (showHero) {
    return (
      <div className="hero-landing">
        <div className="hero-content fade-in">
          <div className="hero-icon">
            <GithubIcon size={48} />
          </div>
          <h1 className="hero-title">GitExplorer</h1>
          <p className="hero-subtitle">
            Discover GitHub users and explore their repositories
          </p>
          <div className="hero-search">
            <SearchBar query={query} setQuery={setQuery} />
          </div>
          <div className="hero-hints">
            <span className="hero-hint">
              <Code2 size={14} />
              Try searching for a username to get started
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Search */}
      <SearchBar query={query} setQuery={setQuery} />

      {/* Error State: Users */}
      {usersError && (
        <div className="error-banner">
          <AlertCircle size={16} />
          {usersError}
        </div>
      )}

      <div className={`layout-sidebar ${!selectedUser ? 'single-column' : ''}`}>
        {/* LEFT COLUMN: Users List */}
        <div className="section-panel">
          <div className="section-header">
            <span className="section-title">Users</span>
            {users.length > 0 && (
              <span className="section-count">{users.length}</span>
            )}
          </div>
          <div className="section-body">
            {isUsersLoading && <Loader message="Searching users..." />}

            {!isUsersLoading && !usersError && users.length === 0 && debouncedQuery && (
              <div className="empty-state fade-in">
                <Search size={32} className="empty-state__icon" />
                <p className="empty-state__title">No users found</p>
                <p className="empty-state__desc">
                  No results for "{debouncedQuery}". Try a different search term.
                </p>
              </div>
            )}

            {!isUsersLoading && query === '' && users.length === 0 && (
              <p className="prompt-text">Type a username to search</p>
            )}

            <div className="grid-repos">
              {users.map((user, i) => (
                <div key={user.id} className="fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                  <UserCard 
                    user={user} 
                    onClick={handleUserClick} 
                    isActive={selectedUser === user.login}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Repositories */}
        {selectedUser && (
          <div className="section-panel">
              <div className="repos-header">
                <span className="repos-header__title">
                  <BookOpen size={16} />
                  Repositories for <strong style={{ marginLeft: '0.25rem' }}>{selectedUser}</strong>
                </span>
                {repos.length > 0 && (
                  <span className="repos-header__count">{processedRepos.length}</span>
                )}
              </div>
              
              {repos.length > 0 && (
                <div className="controls-bar">
                  <label className="control-label" htmlFor="sort-select">Sort:</label>
                  <select 
                    id="sort-select"
                    className="control-select"
                    value={sortBy} 
                    onChange={e => setSortBy(e.target.value)}
                  >
                    <option value="updated">Recently Updated</option>
                    <option value="stars">Most Stars</option>
                    <option value="forks">Most Forks</option>
                  </select>

                  <label className="control-label" htmlFor="lang-select" style={{ marginLeft: '0.25rem' }}>Language:</label>
                  <select 
                    id="lang-select"
                    className="control-select"
                    value={filterLang} 
                    onChange={e => setFilterLang(e.target.value)}
                  >
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              )}

              {isReposLoading && <Loader message={`Loading ${selectedUser}'s repos...`} />}

              {reposError && (
                <div className="error-banner" style={{ margin: '1rem' }}>
                  <AlertCircle size={16} />
                  {reposError}
                </div>
              )}

              {!isReposLoading && !reposError && repos.length === 0 && (
                <div className="empty-state fade-in">
                  <BookOpen size={32} className="empty-state__icon" />
                  <p className="empty-state__title">No repositories</p>
                  <p className="empty-state__desc">This user has no public repositories.</p>
                </div>
              )}

              <div className="grid-repos">
                {processedRepos.map((repo, i) => (
                  <div key={repo.id} className="fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                    <RepoCard repo={repo} />
                  </div>
                ))}
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
