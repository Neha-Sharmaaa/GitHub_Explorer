import React from 'react';

const UserCard = ({ user, onClick, isActive, style }) => {
  return (
    <div 
      className={`glass-card user-square-card stagger-card ${isActive ? 'active' : ''}`}
      onClick={() => onClick(user.login)}
      style={style}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(user.login)}
    >
      <img src={user.avatar_url} alt={user.login} className="avatar-square" />
      <div className="user-info-vertical">
        <h3 className="user-name-bold">{user.login}</h3>
        <span className="view-profile-hint">View Repos</span>
      </div>
    </div>

  );
};

export default UserCard;
