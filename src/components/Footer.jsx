import { Link, useNavigate } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

export default function Footer({ onShowLogin, showToast }) {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = (e) => {
    e.preventDefault();
    navigate('/');
    setTimeout(() => {
      const hero = document.getElementById('hero');
      hero ? hero.scrollIntoView({ behavior: 'smooth' }) : window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="home-footer">
      <div className="foot-container">
        <div className="foot-grid">
          <div className="foot-col-brand">
            <svg className="foot-logo-svg" viewBox="0 0 340 80" xmlns="http://www.w3.org/2000/svg">
              <polygon points="20,10 48,10 65,62 48,62" fill="currentColor"/>
              <polygon points="110,10 82,10 65,62 82,62" fill="currentColor"/>
              <rect x="55" y="18" width="20" height="20" transform="rotate(45 65 28)" fill="currentColor"/>
              <text x="124" y="64" fontFamily="'Cormorant Garamond', serif" fontSize="62" fontWeight="700" letterSpacing="-1px" fill="currentColor">VIBE</text>
            </svg>
            <p className="foot-brand-sub">Emotion-first travel discovery<br/>that helps you explore the world<br/>the way you want to feel.</p>
          </div>
          
          <div className="foot-col">
            <div className="foot-h">EXPLORE</div>
            <div className="foot-links">
              <Link to="/vibes?mood=calm">Vibes</Link>
              <a href="/" onClick={goHome} style={{ cursor: 'pointer' }}>Destinations</a>
              <Link to="/bookings">Experiences</Link>
              <Link to="/itinerary">Travel Guide</Link>
            </div>
          </div>
          
          <div className="foot-col">
            <div className="foot-h">COMPANY</div>
            <div className="foot-links">
              <button onClick={() => showToast('Coming soon')}>About Us</button>
              <button onClick={() => showToast('Coming soon')}>Careers</button>
              <button onClick={() => showToast('Coming soon')}>Blog</button>
              <button onClick={() => showToast('Coming soon')}>Press</button>
            </div>
          </div>
          
          <div className="foot-col">
            <div className="foot-h">SUPPORT</div>
            <div className="foot-links">
              <button onClick={() => showToast('Coming soon')}>Help Center</button>
              <button onClick={() => showToast('Coming soon')}>Contact Us</button>
              <button onClick={() => showToast('Coming soon')}>FAQs</button>
            </div>
          </div>

          <div className="foot-col">
            <div className="foot-h">LEGAL</div>
            <div className="foot-links">
              <button onClick={() => showToast('Coming soon')}>Terms & Conditions</button>
              <button onClick={() => showToast('Coming soon')}>Privacy Policy</button>
              <button onClick={() => showToast('Coming soon')}>Cookie Policy</button>
            </div>
          </div>
        </div>

        <div className="foot-bottom">
          <p>© {currentYear} Vibe. All rights reserved.</p>
          <button className="btn-pill btn-ghost foot-to-top" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', padding: 0 }} onClick={scrollToTop} aria-label="Scroll to top">
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
}
