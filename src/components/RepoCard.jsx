import { Star, GitFork, LinkIcon, Copy, Check } from './Icons';
import { useState } from 'react';

const RepoCard = ({ repo, style }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(repo.html_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="repo-card-minimal stagger-card" style={style}>
      <div className="repo-header-top">
        {repo.language && (
          <span className="repo-badge">{repo.language}</span>
        )}
        <button 
          className={`copy-btn ${copied ? 'copied' : ''}`} 
          onClick={handleCopy}
          title="Copy repository URL"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      
      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-link">
        <LinkIcon size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
        {repo.name}
      </a>
      
      {repo.description && <p className="repo-description">{repo.description}</p>}
      
      <div className="repo-footer">
        <div className="footer-item">
          <Star size={14} color="#e3b341" fill="#e3b341" />
          {repo.stargazers_count.toLocaleString()}
        </div>
        <div className="footer-item">
          <GitFork size={14} color="var(--text-secondary)" />
          {repo.forks_count.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default RepoCard;
