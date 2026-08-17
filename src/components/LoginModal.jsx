import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ show, onClose, showToast }) {
  const { login, register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (isRegister && !name.trim()) {
      setError('Name is required for registration.');
      return;
    }
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    setError('');
    try {
      if (isRegister) {
        await register(name, email);
        onClose();
        showToast(`Welcome to Vibe, ${name} ✦`);
      } else {
        const user = await login(email);
        onClose();
        showToast(`Welcome back, ${user.name} ✦`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Service unavailable. Please try again later.');
    }
  };

  const handleSocialLogin = async () => {
    setError('');
    try {
      const user = await register('Demo User', 'demo@gmail.com');
      onClose();
      showToast(`Welcome to Vibe, ${user.name} ✦`);
    } catch (err) {
      try {
        const user = await login('demo@gmail.com');
        onClose();
        showToast(`Welcome back, ${user.name} ✦`);
      } catch (loginErr) {
        setError(loginErr.response?.data?.message || 'Service unavailable. Please try again later.');
      }
    }
  };

  const toggleRegister = () => {
    setIsRegister(!isRegister);
    setError('');
  };

  return (
    <div id="loginOverlay" className={show ? 'show' : ''}>
      <div className="l-backdrop" onClick={onClose}></div>
      <div className="l-panel">
        <button className="l-close" onClick={onClose}>✕</button>
        <svg className="l-logo" style={{ color: 'var(--accent)' }} viewBox="0 0 340 80" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20,10 48,10 65,62 48,62" fill="currentColor"/>
          <polygon points="110,10 82,10 65,62 82,62" fill="currentColor"/>
          <rect x="55" y="18" width="20" height="20" transform="rotate(45 65 28)" fill="currentColor"/>
          <text x="124" y="64" fontFamily="Arial Black,sans-serif" fontSize="58" fontWeight="900" fill="currentColor">VIBE</text>
        </svg>
        <p className="l-sub">{isRegister ? 'Create an account to save your journeys.' : 'Sign in to save your moods and journeys.'}</p>
        
        <form onSubmit={handleLogin}>
          {isRegister && (
            <>
              <label className="l-label">Full Name</label>
              <input 
                type="text" 
                className="l-input" 
                placeholder="Arjun Mehta" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </>
          )}
          
          <label className="l-label">Email</label>
          <input 
            type="email" 
            className="l-input" 
            placeholder="you@email.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          {error && <div style={{ color: '#d32f2f', fontSize: '13px', marginTop: '-12px', marginBottom: '12px' }}>{error}</div>}
          
          <button type="submit" className="l-btn">{isRegister ? 'Sign Up for Vibe' : 'Sign In to Vibe'}</button>
        </form>
        
        <div className="l-div"><hr/><span>or</span><hr/></div>
        <div className="l-social">
          <button type="button" className="l-soc" onClick={handleSocialLogin} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button type="button" className="l-soc" onClick={handleSocialLogin} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.19 2.24-.86 3.64-.8 1.68.17 2.92.8 3.73 1.96-3.13 1.9-2.58 5.96.48 7.15-.65 1.6-1.57 3.07-2.93 3.86zm-2.83-14.8c.4-1.89-1.02-3.7-2.91-4.04-.54 1.91 1.15 3.86 2.91 4.04z" />
            </svg>
            Apple
          </button>
        </div>
        <p className="l-foot">{isRegister ? 'Already have an account?' : 'New here?'} <button type="button" style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }} onClick={toggleRegister}>{isRegister ? 'Sign in →' : 'Create account →'}</button></p>
      </div>
    </div>
  );
}
