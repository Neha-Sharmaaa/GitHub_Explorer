import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';
import RepoCard from '../components/RepoCard';
import Loader from '../components/Loader';
import { useDebounce } from '../hooks/useDebounce';
import { searchUsers, getUserRepos } from '../services/githubApi';
// Custom GitHub icon (removed from lucide-react in recent versions)
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
      <header>
        <h1><GithubIcon /> GitHub Explorer</h1>
        {/* Dark mode toggle normally happens in App.js wrapper, but we keep header simple */}
      </header>

      <SearchBar query={query} setQuery={setQuery} />

      {/* ERROR STATE: Users */}
      {usersError && <div className="empty-state" style={{ color: 'red' }}>{usersError}</div>}

      <div className="layout-sidebar">
        {/* LEFT COLUMN: Users List */}
        <div className="users-section">
          <h2 className="mb-4" style={{ fontSize: '1.2rem' }}>Users</h2>
          
          {/* LOADING STATE */}
          {isUsersLoading && <Loader message="Searching users..." />}

          {/* EMPTY STATE */}
          {!isUsersLoading && !usersError && users.length === 0 && debouncedQuery && (
            <div className="empty-state">No users found for "{debouncedQuery}".</div>
          )}
          {!isUsersLoading && query === '' && users.length === 0 && (
            <div className="text-secondary text-center mt-4">Type a username to start searching.</div>
          )}

          <div className="flex-col gap-2">
            {users.map(user => (
              <UserCard 
                key={user.id} 
                user={user} 
                onClick={handleUserClick} 
                isActive={selectedUser === user.login}
              />
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Repositories */}
        <div className="repos-section">
          {selectedUser ? (
            <>
              <h2 className="mb-4" style={{ fontSize: '1.2rem' }}>Repositories for {selectedUser}</h2>
              
              {/* Filter & Sort Controls */}
              {repos.length > 0 && (
                <div className="flex gap-4 mb-4" style={{ flexWrap: 'wrap' }}>
                  <select 
                    style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)' }}
                    value={sortBy} 
                    onChange={e => setSortBy(e.target.value)}
                  >
                    <option value="updated">Recently Updated</option>
                    <option value="stars">Most Stars ⭐️</option>
                    <option value="forks">Most Forks 🍴</option>
                  </select>

                  <select 
                    style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)' }}
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
              {reposError && <div className="empty-state" style={{ color: 'red' }}>{reposError}</div>}

              {/* EMPTY STATE */}
              {!isReposLoading && !reposError && repos.length === 0 && (
                <div className="empty-state">User has no public repositories.</div>
              )}

              {/* REPOS LIST */}
              <div className="grid-repos">
                {processedRepos.map(repo => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px' }}>
              <GithubIcon size={48} className="text-secondary mb-4" style={{ opacity: 0.5 }} />
              <p>Select a user from the list to view their repositories.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
