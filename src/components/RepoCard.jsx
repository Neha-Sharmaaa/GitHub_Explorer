import React from 'react';
import { Star, GitFork, Book } from 'lucide-react';

const RepoCard = ({ repo }) => {
  return (
    <div className="repo-card">
      <div className="repo-title">
        <Book size={16} style={{ color: 'var(--text-secondary)' }} />
        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
          {repo.name}
        </a>
      </div>
      
      {repo.description && <p className="repo-desc">{repo.description}</p>}
      
      <div className="repo-stats">
        {repo.language && (
          <div className="stat-item">
            <span className="badge">{repo.language}</span>
          </div>
        )}
        <div className="stat-item">
          <Star size={14} />
          {repo.stargazers_count.toLocaleString()}
        </div>
        <div className="stat-item">
          <GitFork size={14} />
          {repo.forks_count.toLocaleString()}
        </div>
        <div className="stat-item" style={{ marginLeft: 'auto', fontSize: '0.65rem' }}>
          Updated {new Date(repo.updated_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default RepoCard;
