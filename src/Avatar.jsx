import React from 'react';

const BotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#A5B4FC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '60%', height: '60%' }}>
    <path d="M12 8V4H8"></path>
    <rect width="16" height="12" x="4" y="8" rx="2"></rect>
    <path d="M2 14h2"></path>
    <path d="M20 14h2"></path>
    <path d="M15 13v2"></path>
    <path d="M9 13v2"></path>
  </svg>
);

const Avatar = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      overflow: 'hidden',
      background: 'radial-gradient(circle, rgba(102, 126, 234, 0.2), rgba(17, 24, 39, 0.8))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid rgba(102, 126, 234, 0.3)'
    }}>
      <BotIcon />
    </div>
  );
};

export default Avatar;
