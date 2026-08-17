import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogIn } from 'lucide-react';

export default function Navbar({ onShowLogin }) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const closeDrawer = () => setDrawerOpen(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
  };

  // Navigate to Home and always land at the hero section
  const goHome = (e) => {
    e.preventDefault();
    closeDrawer();
    if (location.pathname === '/') {
      const hero = document.getElementById('hero');
      hero ? hero.scrollIntoView({ behavior: 'smooth' }) : window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/vibes', label: 'Vibes', search: '?mood=calm' },
    { path: '/bookings', label: 'Journey' },
    { path: '/itinerary', label: 'Itinerary' }
  ];

  return (
    <>
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <a href="/" className="nav-logo-link" onClick={goHome}>
          <motion.svg whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="nav-logo-svg" viewBox="0 0 340 80" xmlns="http://www.w3.org/2000/svg">
            <polygon points="20,10 48,10 65,62 48,62" fill="var(--accent)"/>
            <polygon points="110,10 82,10 65,62 82,62" fill="var(--accent)"/>
            <rect x="55" y="18" width="20" height="20" transform="rotate(45 65 28)" fill="var(--accent)"/>
            <text x="124" y="64" fontFamily="'Cormorant Garamond', serif" fontSize="62" fontWeight="700" letterSpacing="-1px" fill="var(--accent)">VIBE</text>
          </motion.svg>
        </a>

        <div className="nav-center">
            {navLinks.map((link) => {
              const isMatch = link.path === '/vibes' ? location.pathname === '/vibes' : location.pathname === link.path;
              if (link.path === '/') {
                return (
                  <a key={link.path} href="/" className={`nav-link ${isMatch ? 'active' : ''}`} onClick={goHome}>
                    {link.label}
                    {isMatch && (
                      <motion.div
                        layoutId="navUnderline"
                        className="nav-active-indicator"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </a>
                );
              }
              return (
                <Link key={link.path} className={`nav-link ${isMatch ? 'active' : ''}`} to={`${link.path}${link.search || ''}`}>
                  {link.label}
                  {isMatch && (
                    <motion.div
                      layoutId="navUnderline"
                      className="nav-active-indicator"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

        <div className="nav-right">
          <button className="btn-pill btn-outline" style={{ padding: '8px 20px', fontSize: '13px' }} onClick={() => document.querySelector('.vee-orb')?.click()}>
            Chat with VEE ✦
          </button>
            
          <div className="nav-auth">
              {user ? (
                <div className="nav-profile-wrap" ref={profileRef}>
                  <button
                    className="nav-avatar"
                    onClick={() => setProfileOpen(!profileOpen)}
                    title={user.name}
                  >
                    <User size={18} />
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div 
                        className="nav-profile-dropdown"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="nav-profile-info">
                          <div className="nav-profile-name">{user.name}</div>
                          <div className="nav-profile-email">{user.email}</div>
                        </div>
                        <div className="nav-profile-divider"></div>
                        <button className="nav-profile-item" onClick={handleLogout}>
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button className="nav-avatar" onClick={onShowLogin} aria-label="Sign In">
                  <LogIn size={18} />
                </button>
              )}
            </div>

          </div>

        <button className={`nav-ham ${drawerOpen ? 'open' : ''}`} onClick={toggleDrawer} aria-label="Menu">
          {drawerOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div className={`nav-drawer-backdrop ${drawerOpen ? 'open' : ''}`} onClick={closeDrawer}></div>
      <div className={`nav-drawer ${drawerOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          link.path === '/' ?
            <a key={link.path} href="/" className="nav-link" onClick={goHome}>{link.label}</a> :
            <Link key={link.path} className="nav-link" to={`${link.path}${link.search || ''}`} onClick={closeDrawer}>{link.label}</Link>
        ))}
        <div className="nav-drawer-divider"></div>
        <button className="nav-link nav-drawer-vee" onClick={() => { closeDrawer(); document.querySelector('.vee-orb')?.click(); }}>
          Chat with VEE ✦
        </button>
        <div className="nav-drawer-divider"></div>
        {user ? (
          <>
            <div className="nav-drawer-user">
              <span className="nav-avatar-sm"><User size={14} /></span>
              <span>{user.name}</span>
            </div>
            <button className="btn-pill btn-outline" onClick={() => { handleLogout(); closeDrawer(); }}>Sign Out</button>
          </>
        ) : (
          <>
            <button className="btn-pill btn-outline" onClick={() => { onShowLogin(); closeDrawer(); }}>Sign In</button>
            <button className="btn-pill btn-fill" onClick={() => { onShowLogin(); closeDrawer(); }}>Get Started</button>
          </>
        )}
      </div>
    </>
  );
}
