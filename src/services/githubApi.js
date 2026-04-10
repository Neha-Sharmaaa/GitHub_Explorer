/**
 * Centralized API service for GitHub.
 * Separating API calls from UI code makes it easier to maintain and test.
 */

const BASE_URL = 'https://api.github.com';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const getHeaders = () => {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
  };
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }
  return headers;
};

export const searchUsers = async (query) => {
  if (!query) return [];
  
  const response = await fetch(`${BASE_URL}/search/users?q=${encodeURIComponent(query)}&per_page=10`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    // If API limit is reached or other error occurs
    throw new Error('Failed to fetch users. You might have hit the GitHub API rate limit.');
  }
  const data = await response.json();
  return data.items;
};

export const getUserRepos = async (username) => {
  const response = await fetch(`${BASE_URL}/users/${username}/repos?sort=updated&per_page=30`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch repositories for ${username}`);
  }
  const data = await response.json();
  return data;
};
