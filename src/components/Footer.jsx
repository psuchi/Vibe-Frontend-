import { Link } from 'react-router-dom';

export default function Footer({ onShowLogin, showToast }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="foot-grid">
        <div>
          <svg className="nav-logo-svg foot-logo-svg" viewBox="0 0 340 80" xmlns="http://www.w3.org/2000/svg">
            <polygon points="20,10 48,10 65,62 48,62" fill="#fff"/>
            <polygon points="110,10 82,10 65,62 82,62" fill="#fff"/>
            <rect x="55" y="18" width="20" height="20" transform="rotate(45 65 28)" fill="#fff"/>
            <text x="124" y="64" fontFamily="Arial Black,sans-serif" fontSize="58" fontWeight="900" fill="#fff">VIBE</text>
          </svg>
          <p className="foot-brand-sub">Emotion-first travel planning. Choose how you want to feel, and we'll handle the rest.</p>
        </div>
        <div>
          <div className="foot-h">Explore</div>
          <div className="foot-links">
            <Link to="/vibes?mood=calm">Vibes</Link>
            <Link to="/#featured">Destinations</Link>
            <Link to="/bookings">Bookings</Link>
            <Link to="/itinerary">Itinerary</Link>
          </div>
        </div>
        <div>
          <div className="foot-h">Company</div>
          <div className="foot-links">
            <button onClick={() => showToast('Coming soon')}>About</button>
            <button onClick={() => showToast('Coming soon')}>Careers</button>
            <button onClick={() => showToast('Coming soon')}>Press</button>
          </div>
        </div>
        <div>
          <div className="foot-h">Support</div>
          <div className="foot-links">
            <button onClick={() => showToast('Coming soon')}>Help Center</button>
            <button onClick={() => showToast('Coming soon')}>Contact</button>
            <button onClick={onShowLogin}>Profile</button>
          </div>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© {currentYear} Vibe. All rights reserved.</span>
        <span>Travel by feeling, not by map.</span>
      </div>
    </footer>
  );
}
