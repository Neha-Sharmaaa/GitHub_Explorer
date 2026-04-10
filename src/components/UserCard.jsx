import React from 'react';
import { ChevronRight } from 'lucide-react';

const UserCard = ({ user, onClick, isActive }) => {
  return (
    <div 
      className={`user-pill ${isActive ? 'active' : ''}`}
      onClick={() => onClick(user.login)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(user.login)}
    >
      <img src={user.avatar_url} alt={`${user.login}`} className="user-pill-avatar" />
      <div className="user-pill-info">
        <h3 className="user-pill-name">{user.login}</h3>
        <span className="user-pill-link">
          Access Data
        </span>
      </div>
      <ChevronRight size={18} style={{ color: 'var(--text-tertiary)' }} />
    </div>
  );
};

export default UserCard;
