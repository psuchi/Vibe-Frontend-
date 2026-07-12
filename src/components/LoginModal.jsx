import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ show, onClose, showToast }) {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    login(name, email);
    onClose();
    showToast(`Welcome to Vibe, ${name || 'Traveler'} ✦`);
  };

  return (
    <div id="loginOverlay" className={show ? 'show' : ''}>
      <div className="l-backdrop" onClick={onClose}></div>
      <div className="l-panel">
        <button className="l-close" onClick={onClose}>✕</button>
        <svg className="l-logo" viewBox="0 0 340 80" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20,10 48,10 65,62 48,62" fill="#1B3A6B"/>
          <polygon points="110,10 82,10 65,62 82,62" fill="#1B3A6B"/>
          <rect x="55" y="18" width="20" height="20" transform="rotate(45 65 28)" fill="#1B3A6B"/>
          <text x="124" y="64" fontFamily="Arial Black,sans-serif" fontSize="58" fontWeight="900" fill="#1B3A6B">VIBE</text>
        </svg>
        <p className="l-sub">Sign in to save your moods and journeys.</p>
        
        <label className="l-label">Full Name</label>
        <input 
          type="text" 
          className="l-input" 
          placeholder="Arjun Mehta" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        
        <label className="l-label">Email</label>
        <input 
          type="email" 
          className="l-input" 
          placeholder="you@email.com" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        
        <button className="l-btn" onClick={handleLogin}>Sign In to Vibe</button>
        
        <div className="l-div"><hr/><span>or</span><hr/></div>
        <div className="l-social">
          <button className="l-soc" onClick={handleLogin}>🇬 Google</button>
          <button className="l-soc" onClick={handleLogin}> Apple</button>
        </div>
        <p className="l-foot">New here? <a onClick={handleLogin}>Create account →</a></p>
      </div>
    </div>
  );
}
