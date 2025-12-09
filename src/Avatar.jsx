const Avatar = ({ size = '100%', showBorder = false }) => {
  return (
    <div style={{
      width: size === '100%' ? '100%' : size,
      height: size === '100%' ? '100%' : size,
      borderRadius: '50%',
      overflow: 'hidden',
      border: showBorder ? '3px solid #667eea' : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent'
    }}>
      <img
        src="/ai-avatar.png"
        alt="AI Translator"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </div>
  );
};

export default Avatar;
