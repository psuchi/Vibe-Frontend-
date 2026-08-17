import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spline from '@splinetool/react-spline';

const VEE_CONTEXT = {
  home: {
    msg: "Don't choose a place — choose a feeling first.", suggestions: [
      { label: '🧭 Help me pick a mood', action: (navigate) => navigate('/vibes?mood=calm') },
      { label: '✦ Show me what\'s popular', action: () => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' }) }
    ]
  },
  vibes: {
    msg: "Still unable to find your destination? Let me help.", suggestions: [
      { label: '🎯 Match me to a destination', action: (n, toast) => toast('Based on your mood, I\'d start with the top match below ✦') },
      { label: '⚙ Adjust filters for me', action: () => document.querySelector('.filter-panel')?.scrollIntoView({ behavior: 'smooth' }) }
    ]
  },
  destination: {
    msg: "Want the story behind this place before you book?", suggestions: [
      { label: '📖 Tell me the story', action: () => document.getElementById('destStory')?.scrollIntoView({ behavior: 'smooth' }) },
      { label: '🛏 Take me to booking', action: () => { const b = document.getElementById('startBooking'); if (b) b.click(); } }
    ]
  },
  bookings: {
    msg: "I'll flag anything unusual as you go — no surprises at checkout.", suggestions: [
      { label: '💡 Recommend a budget tier', action: (n, toast) => toast('Balanced gives the best value for this mood ✦') }
    ]
  },
  itinerary: {
    msg: "This plan is yours to rearrange — tap any day to edit.", suggestions: [
      { label: '🧳 What should I pack?', action: () => document.getElementById('packing')?.scrollIntoView({ behavior: 'smooth' }) },
      { label: '💰 Show budget breakdown', action: () => document.getElementById('budgetBreak')?.scrollIntoView({ behavior: 'smooth' }) }
    ]
  },
  confirmation: {
    msg: "Your journey's booked. I'll check in before departure.", suggestions: [
      { label: '🏠 Back to Home', action: (navigate) => navigate('/') }
    ]
  }
};

export default function VeeAssistant({ pageKey, showToast }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [bubbleMsg, setBubbleMsg] = useState('');
  const [bubbleShow, setBubbleShow] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const panelRef = useRef(null);
  const navigate = useNavigate();

  const ctx = VEE_CONTEXT[pageKey] || VEE_CONTEXT.home;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const timer1 = setTimeout(() => {
      if (!panelOpen) {
        setBubbleMsg(ctx.msg);
        setBubbleShow(true);
      }
    }, 1800);

    const timer2 = setTimeout(() => {
      setBubbleShow(false);
    }, 7200);

    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, [pageKey, ctx.msg, panelOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close panel if click is outside #vee container
      if (panelOpen && panelRef.current && !panelRef.current.contains(event.target)) {
        setPanelOpen(false);
        setBubbleShow(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [panelOpen]);

  const togglePanel = () => {
    setPanelOpen(!panelOpen);
    if (!panelOpen) setBubbleShow(false);
  };

  const handleSuggestClick = (action) => {
    action(navigate, showToast);
    togglePanel();
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput('');
    setBubbleMsg('Thinking...');
    setBubbleShow(true);

    try {
      const res = await axios.post(`${API_URL}/api/chat`, {
        message: userMsg,
        context: pageKey
      });
      setBubbleMsg(res.data.reply);
    } catch (error) {
      console.error(error);
      setBubbleMsg('I am disconnected from the network right now.');
    }

    setTimeout(() => setBubbleShow(false), 20000);
  };

  return (
    <div id="vee" ref={panelRef}>
      <div className={`vee-panel ${panelOpen ? 'show' : ''}`}>
        <div className="vee-panel-h">
          VEE suggests
          <button className="vee-panel-close" onClick={() => { setPanelOpen(false); setBubbleShow(false); }}>×</button>
        </div>
        {ctx.suggestions.map((s, i) => (
          <button key={i} className="vee-sugg" onClick={() => handleSuggestClick(s.action)}>
            {s.label}
          </button>
        ))}

        <form onSubmit={handleChatSubmit} className="vee-form">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Ask VEE anything..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="vee-input"
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              title="Send"
              style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'var(--accent)', border: 'none',
                color: '#fff', fontSize: '15px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0, padding: 0
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >↑</button>
          </div>
        </form>
      </div>

      <div className={`vee-bubble ${bubbleShow ? 'show' : ''}`}>
        {bubbleMsg}
      </div>

      <button className="vee-orb" onClick={togglePanel} title="VEE — your travel companion">
        <div style={{ pointerEvents: 'none', width: '100%', height: '100%' }}>
          <div style={{ width: '100%', height: '100%', transform: 'scale(1.4) translateX(-18%) translateY(-6%)' }}>
            <Spline scene="https://prod.spline.design/mGOecgxCWVEopM2F/scene.splinecode" />
          </div>
        </div>
      </button>
    </div>
  );
}
