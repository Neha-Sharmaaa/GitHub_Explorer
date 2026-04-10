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
      <img src={user.avatar_url} alt={user.login} className="avatar-sm" />
      <div className="user-info">
        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.login}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>View details</div>
      </div>
    </div>
  );
};

export default UserCard;
