import React from 'react';
import { Star, GitFork, BookOpen, Clock } from 'lucide-react';

const RepoCard = ({ repo }) => {
  // Format the updated date
  const updatedAt = new Date(repo.updated_at);
  const now = new Date();
  const diffMs = now - updatedAt;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  let timeAgo;
  if (diffDays === 0) timeAgo = 'today';
  else if (diffDays === 1) timeAgo = 'yesterday';
  else if (diffDays < 30) timeAgo = `${diffDays}d ago`;
  else if (diffDays < 365) timeAgo = `${Math.floor(diffDays / 30)}mo ago`;
  else timeAgo = `${Math.floor(diffDays / 365)}y ago`;

  return (
    <div className="repo-card">
      <div className="repo-card__header">
        <h3 className="repo-title">
          <BookOpen size={16} className="icon-blue" />
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            {repo.name}
          </a>
        </h3>
        {repo.language && (
          <span className="badge">
            <span className="lang-dot" />
            {repo.language}
          </span>
        )}
      </div>
      
      <p className="repo-desc">
        {repo.description || 'No description provided.'}
      </p>
      
      <div className="repo-stats">
        <span className="stat">
          <Star size={14} />
          {repo.stargazers_count.toLocaleString()}
        </span>
        <span className="stat">
          <GitFork size={14} />
          {repo.forks_count.toLocaleString()}
        </span>
        <span className="stat">
          <Clock size={14} />
          Updated {timeAgo}
        </span>
      </div>
    </div>
  );
};

export default RepoCard;
