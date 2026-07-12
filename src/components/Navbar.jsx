import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onShowLogin }) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const closeDrawer = () => setDrawerOpen(false);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <Link to="/">
          <svg className="nav-logo-svg" viewBox="0 0 340 80" xmlns="http://www.w3.org/2000/svg">
            <polygon points="20,10 48,10 65,62 48,62" fill="var(--accent,#1B3A6B)"/>
            <polygon points="110,10 82,10 65,62 82,62" fill="var(--accent,#1B3A6B)"/>
            <rect x="55" y="18" width="20" height="20" transform="rotate(45 65 28)" fill="var(--accent,#1B3A6B)"/>
            <text x="124" y="64" fontFamily="Arial Black,sans-serif" fontSize="58" fontWeight="900" fill="var(--accent,#1B3A6B)">VIBE</text>
          </svg>
        </Link>
        <div className="nav-links">
          <Link className={`nav-link ${isActive('/')}`} to="/">Home</Link>
          <Link className={`nav-link ${isActive('/vibes')}`} to="/vibes?mood=calm">Vibes</Link>
          <Link className={`nav-link ${isActive('/bookings')}`} to="/bookings">Bookings</Link>
          <Link className={`nav-link ${isActive('/itinerary')}`} to="/itinerary">Itinerary</Link>

          {user ? (
            <button className="nav-btn nav-outline" onClick={onShowLogin}>{user.name}</button>
          ) : (
            <>
              <button className="nav-btn nav-outline" onClick={onShowLogin}>Profile</button>
              <button className="nav-btn nav-fill" onClick={onShowLogin}>Get Started</button>
            </>
          )}
        </div>
        <button className={`nav-ham ${drawerOpen ? 'open' : ''}`} onClick={toggleDrawer} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div className={`nav-drawer ${drawerOpen ? 'open' : ''}`} onClick={closeDrawer}>
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/vibes?mood=calm">Vibes</Link>
        <Link className="nav-link" to="/bookings">Bookings</Link>
        <Link className="nav-link" to="/itinerary">Itinerary</Link>
        <button className="nav-btn nav-outline mt-xs" onClick={onShowLogin}>
          {user ? user.name : 'Profile'}
        </button>
        {!user && <button className="nav-btn nav-fill" onClick={onShowLogin}>Get Started →</button>}
      </div>
    </>
  );
}
