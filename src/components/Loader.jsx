import { useEffect, useState } from 'react';

export default function Loader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div id="loader" className={loading ? '' : 'out'}>
      <svg viewBox="0 0 340 80" xmlns="http://www.w3.org/2000/svg">
        <polygon points="20,10 48,10 65,62 48,62" fill="#1B3A6B"/>
        <polygon points="110,10 82,10 65,62 82,62" fill="#1B3A6B"/>
        <rect x="55" y="18" width="20" height="20" transform="rotate(45 65 28)" fill="#1B3A6B"/>
        <text x="124" y="64" fontFamily="Arial Black,sans-serif" fontSize="58" fontWeight="900" fill="#1B3A6B">VIBE</text>
      </svg>
      <div className="loader-bar"><div className="loader-fill"></div></div>
    </div>
  );
}
