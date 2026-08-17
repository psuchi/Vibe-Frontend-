import { useEffect, useState } from 'react';

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => setLoading(false), 700);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div id="loader" className={fading ? 'out' : ''}>
      <svg viewBox="0 0 340 80" style={{ color: 'var(--accent)' }} xmlns="http://www.w3.org/2000/svg">
        <polygon points="20,10 48,10 65,62 48,62" fill="currentColor"/>
        <polygon points="110,10 82,10 65,62 82,62" fill="currentColor"/>
        <rect x="55" y="18" width="20" height="20" transform="rotate(45 65 28)" fill="currentColor"/>
        <text x="124" y="64" fontFamily="Arial Black,sans-serif" fontSize="58" fontWeight="900" fill="currentColor">VIBE</text>
      </svg>
      <div className="loader-bar"><div className="loader-fill"></div></div>
    </div>
  );
}
