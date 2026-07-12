import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

    setTimeout(() => setBubbleShow(false), 8000);
  };

  return (
    <div id="vee">
      <div className={`vee-panel ${panelOpen ? 'show' : ''}`}>
        <div className="vee-panel-h">VEE suggests</div>
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
              style={{
                padding: '9px 14px', borderRadius: '10px',
                background: 'rgba(79,142,247,0.25)', border: '1px solid rgba(79,142,247,0.4)',
                color: '#7eb3ff', fontSize: '13px', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap',
                transition: 'background 0.2s'
              }}
            >Send ✦</button>
          </div>
        </form>
      </div>

      <div className={`vee-bubble ${bubbleShow ? 'show' : ''}`}>
        {bubbleMsg}
      </div>

      <button className="vee-orb" onClick={togglePanel} title="VEE — your travel companion">
        <span className="vee-face">✦</span>
      </button>
    </div>
  );
}
