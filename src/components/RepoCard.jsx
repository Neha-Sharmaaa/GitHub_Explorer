import React from 'react';
import { Star, GitFork, Book } from 'lucide-react';

const RepoCard = ({ repo }) => {
  return (
    <div className="repo-card">
      {repo.language && (
        <span className="repo-badge">{repo.language}</span>
      )}
      
      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-link">
        {repo.name}
      </a>
      
      {repo.description && <p className="repo-description">{repo.description}</p>}
      
      <div className="repo-footer">
        <div className="footer-item">
          <Star size={14} />
          {repo.stargazers_count.toLocaleString()}
        </div>
        <div className="footer-item">
          <GitFork size={14} />
          {repo.forks_count.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default RepoCard;
