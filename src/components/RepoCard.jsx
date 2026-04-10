import React from 'react';
import { Star, GitFork, BookOpen } from 'lucide-react';

const RepoCard = ({ repo }) => {
  return (
    <div className="card repo-card">
      <div className="flex justify-between align-center mb-4">
        <h3 className="repo-title">
          <BookOpen size={18} className="icon-blue" />
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            {repo.name}
          </a>
        </h3>
        <span className="badge">{repo.language || 'Code'}</span>
      </div>
      
      <p className="text-secondary repo-desc">
        {repo.description || 'No description available for this repository.'}
      </p>
      
      <div className="repo-stats">
        <div className="stat">
          <Star size={16} />
          <span>{repo.stargazers_count}</span>
        </div>
        <div className="stat">
          <GitFork size={16} />
          <span>{repo.forks_count}</span>
        </div>
      </div>
    </div>
  );
};

export default RepoCard;
