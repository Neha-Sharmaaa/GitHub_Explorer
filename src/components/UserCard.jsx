import React from 'react';

const UserCard = ({ user, onClick, isActive }) => {
  return (
    <div 
      className={`user-card ${isActive ? 'active' : ''}`}
      onClick={() => onClick(user.login)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(user.login)}
    >
      <img src={user.avatar_url} alt={user.login} className="user-avatar" />
      <div className="user-name">{user.login}</div>
    </div>
  );
};

export default UserCard;
