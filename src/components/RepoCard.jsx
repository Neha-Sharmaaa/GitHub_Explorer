import React from 'react';
import { Star, GitBranch, TerminalSquare, Sparkles } from 'lucide-react';

const RepoCard = ({ repo }) => {
  return (
    <div className="repo-card-glass">
      <div className="repo-card-top">
        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-name-link">
          {repo.name}
        </a>
        {repo.language && (
          <span className="repo-lang-tag">
            {repo.language}
          </span>
        )}
      </div>
      
      <p className="repo-desc">
        {repo.description || 'No public documentation provided for this architecture module.'}
      </p>
      
      <div className="repo-meta">
        <span className="meta-item" title="Stargazers">
          <Sparkles size={14} />
          {repo.stargazers_count.toLocaleString()}
        </span>
        <span className="meta-item" title="Forks">
          <GitBranch size={14} />
          {repo.forks_count.toLocaleString()}
        </span>
        <span className="meta-item" title="Size">
          <TerminalSquare size={14} />
          {repo.size.toLocaleString()} KB
        </span>
      </div>
    </div>
  );
};

export default RepoCard;
