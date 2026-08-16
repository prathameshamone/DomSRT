export default function GithubAvatar({ onClick, avatarUrl }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open profile card"
      style={{
        width: 34,
        height: 34,
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        background: 'var(--text)',
        overflow: 'hidden',
        padding: 0,
      }}
    >
      {avatarUrl && (
        <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
    </button>
  );
}