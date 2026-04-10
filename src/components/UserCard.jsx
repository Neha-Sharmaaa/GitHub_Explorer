import React from 'react';
import { ChevronRight } from 'lucide-react';

const UserCard = ({ user, onClick, isActive }) => {
  return (
    <div 
      className={`user-card ${isActive ? 'active' : ''}`}
      onClick={() => onClick(user.login)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(user.login)}
    >
      <img src={user.avatar_url} alt={`${user.login} avatar`} className="avatar" />
      <div className="user-info">
        <h3>{user.login}</h3>
        <p>View repositories</p>
      </div>
      <ChevronRight size={16} className="user-card-arrow" />
    </div>
  );
};

export default UserCard;
