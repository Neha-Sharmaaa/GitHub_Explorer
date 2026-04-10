import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';
import RepoCard from '../components/RepoCard';
import Loader from '../components/Loader';
import { useDebounce } from '../hooks/useDebounce';
import { searchUsers, getUserRepos } from '../services/githubApi';
import { BookOpen, Search, AlertCircle } from 'lucide-react';

const Home = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500); // 500ms delay

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
  const [sortBy, setSortBy] = useState('updated'); // updated, stars, forks
  const [filterLang, setFilterLang] = useState('All');

  // Effect: Fetch Users when debouncedQuery changes
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

  // Handler: When a user card is clicked
  const handleUserClick = async (username) => {
    setSelectedUser(username);
    setIsReposLoading(true);
    setReposError(null);

    // Reset filters when a new user is selected
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
    
    // 1. Filter
    if (filterLang !== 'All') {
      filtered = filtered.filter(r => r.language === filterLang);
    }

    // 2. Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
      if (sortBy === 'forks') return b.forks_count - a.forks_count;
      // Default: sort by updated_at (which API already kind of does, but enforce it)
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
  }, [repos, filterLang, sortBy]);

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

      <div className="layout-sidebar">
        {/* LEFT COLUMN: Users List */}
        <div className="section-panel">
          <div className="section-header">
            <span className="section-title">Users</span>
            {users.length > 0 && (
              <span className="section-count">{users.length}</span>
            )}
          </div>
          <div className="section-body">
            {/* LOADING STATE */}
            {isUsersLoading && <Loader message="Searching users..." />}

            {/* EMPTY STATE: No results found */}
            {!isUsersLoading && !usersError && users.length === 0 && debouncedQuery && (
              <div className="empty-state fade-in">
                <Search size={32} className="empty-state__icon" />
                <p className="empty-state__title">No users found</p>
                <p className="empty-state__desc">
                  No results for "{debouncedQuery}". Try a different search term.
                </p>
              </div>
            )}

            {/* PROMPT STATE: No query yet */}
            {!isUsersLoading && query === '' && users.length === 0 && (
              <p className="prompt-text">Type a username to start searching</p>
            )}

            {/* USERS LIST */}
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
        <div className="section-panel">
          {selectedUser ? (
            <>
              {/* Repos Header */}
              <div className="repos-header">
                <span className="repos-header__title">
                  <BookOpen size={16} />
                  Repositories for <strong style={{ marginLeft: '0.25rem' }}>{selectedUser}</strong>
                </span>
                {repos.length > 0 && (
                  <span className="repos-header__count">{processedRepos.length}</span>
                )}
              </div>
              
              {/* Filter & Sort Controls */}
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

              {/* LOADING STATE */}
              {isReposLoading && <Loader message={`Loading ${selectedUser}'s repos...`} />}

              {/* ERROR STATE */}
              {reposError && (
                <div className="error-banner" style={{ margin: '1rem' }}>
                  <AlertCircle size={16} />
                  {reposError}
                </div>
              )}

              {/* EMPTY STATE */}
              {!isReposLoading && !reposError && repos.length === 0 && (
                <div className="empty-state fade-in">
                  <BookOpen size={32} className="empty-state__icon" />
                  <p className="empty-state__title">No repositories</p>
                  <p className="empty-state__desc">This user has no public repositories.</p>
                </div>
              )}

              {/* REPOS LIST */}
              <div className="grid-repos">
                {processedRepos.map((repo, i) => (
                  <div key={repo.id} className="fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                    <RepoCard repo={repo} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ minHeight: '360px' }}>
              <Search size={36} className="empty-state__icon" />
              <p className="empty-state__title">Select a user</p>
              <p className="empty-state__desc">
                Search for a GitHub user, then select their profile to browse repositories.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
