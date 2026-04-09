import React from 'react';

const UserCard = ({ user, onClick, isActive }) => {
  return (
    <div 
      className={`card user-card ${isActive ? 'active' : ''}`}
      onClick={() => onClick(user.login)}
    >
      <img src={user.avatar_url} alt={`${user.login} avatar`} className="avatar" />
      <div className="user-info">
        <h3>{user.login}</h3>
        <p className="text-secondary">View Repositories →</p>
      </div>
    </div>
  );
};

export default UserCard;
