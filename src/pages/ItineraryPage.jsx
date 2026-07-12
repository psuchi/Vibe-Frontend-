import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getVibe } from '../data/vibes';
import { useVibe } from '../context/VibeContext';
import VeeAssistant from '../components/VeeAssistant';

export default function ItineraryPage({ showToast }) {
  useScrollReveal();
  const navigate = useNavigate();
  const { booking, setBookingFinal, setCurrentMood, getItinerary, saveItinerary } = useVibe();

  const moodId = booking?.mood || 'calm';
  const vibe = getVibe(moodId);
  const city = booking?.city || vibe.dests[0].city;
  const dest = vibe.dests.find(d => d.city === city) || vibe.dests[0];

  const [days, setDays] = useState([]);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    setCurrentMood(moodId);
    document.title = `Itinerary — ${dest.city} — Vibe`;
    window.scrollTo({ top: 0, behavior: 'instant' });

    let loaded = getItinerary(moodId, city);
    if (!loaded) {
      loaded = JSON.parse(JSON.stringify(vibe.days || []));
      saveItinerary(moodId, city, loaded);
    }
    setDays(loaded);
  }, [moodId, city, dest, vibe, setCurrentMood]);

  const moveAct = (dayIdx, actIdx, direction) => {
    const newDays = [...days];
    const acts = newDays[dayIdx].acts;
    if (direction === 'up' && actIdx > 0) {
      [acts[actIdx-1], acts[actIdx]] = [acts[actIdx], acts[actIdx-1]];
    } else if (direction === 'down' && actIdx < acts.length - 1) {
      [acts[actIdx], acts[actIdx+1]] = [acts[actIdx+1], acts[actIdx]];
    } else {
      return;
    }
    setDays(newDays);
    saveItinerary(moodId, city, newDays);
    showToast('Itinerary updated ✦');
  };

  const removeAct = (dayIdx, actIdx) => {
    const newDays = [...days];
    newDays[dayIdx].acts.splice(actIdx, 1);
    setDays(newDays);
    saveItinerary(moodId, city, newDays);
    showToast('Experience removed');
  };

  const addAct = (dayIdx) => {
    const newDays = [...days];
    newDays[dayIdx].acts.push({
      t: 'Flexible',
      n: 'New Experience',
      d: 'A customizable activity added to your day.'
    });
    setDays(newDays);
    saveItinerary(moodId, city, newDays);
    showToast('Activity added ✦');
  };

  const handleConfirm = () => {
    setBookingFinal({ ...booking, itinerary: days });
    navigate('/confirmation');
  };

  return (
    <main>
      {/* ── HEADER ── */}
      <div className="it-head">
        <div className="it-head-inner">
          <div className="eyebrow" style={{marginBottom:'1rem'}}>Your Itinerary</div>
          <h1 className="sec-title" style={{fontSize:'2.2rem'}}>Your Tailored Pace</h1>
          <p className="sec-sub" style={{marginBottom:0}}>Tap any activity to edit it — this plan is built around you.</p>
        </div>
      </div>

      <div className="it-body sr">
        {/* ── MAIN TIMELINE ── */}
        <div>
          <div className="it-main-section-header">
            <div className="sec-divider" style={{marginBottom:'1.2rem'}}>
              <div className="sec-divider-line"></div>
              <span className="sec-divider-label">Your Days</span>
              <div className="sec-divider-line"></div>
            </div>
          </div>

          {/* Day tabs */}
          <div className="it-tabs">
            {days.map((d, i) => (
              <div key={i} className={`it-tab ${activeDay === i ? 'on' : ''}`} onClick={() => setActiveDay(i)}>
                Day {d.day.split(' ')[1]} <b>{d.title}</b>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="timeline">
            {days[activeDay]?.acts.length === 0 && <p style={{color:'var(--muted)',fontSize:'13.5px',paddingLeft:'4px'}}>A day of absolute rest.</p>}
            {days[activeDay]?.acts.map((a, i) => (
              <div key={i} className="tl-item">
                <div className="tl-top">
                  <div>
                    <div className="tl-time">{a.t}</div>
                    <div className="tl-name">{a.n}</div>
                    <div className="tl-desc">{a.d}</div>
                  </div>
                  <div className="tl-actions">
                    <button className="tl-btn" onClick={() => moveAct(activeDay, i, 'up')} disabled={i === 0}>↑</button>
                    <button className="tl-btn" onClick={() => moveAct(activeDay, i, 'down')} disabled={i === days[activeDay].acts.length - 1}>↓</button>
                    <button className="tl-btn" onClick={() => removeAct(activeDay, i)}>✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="add-act-btn" onClick={() => addAct(activeDay)}>+ Add activity to this day</button>

          <div style={{marginTop:'3rem'}}>
            <button className="btn-fill w-full" style={{maxWidth:'320px'}} onClick={handleConfirm}>Continue to Confirmation →</button>
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <div className="it-sidebar">
          <div className="side-card">
            <div className="side-h">🌤 Weather & Best Time</div>
            <p style={{fontSize:'13.5px',color:'var(--muted)',lineHeight:1.7}}>Expect {dest.weather.toLowerCase()} during your {booking?.dates || 'Next month'} trip. {dest.best} is typically recommended.</p>
          </div>
          <div className="side-card">
            <div className="side-h">🗺 Map Preview</div>
            <div className="map-box">Route preview</div>
          </div>
          <div className="side-card">
            <div className="side-h">🍽 Where to Eat</div>
            <div>
              {dest.restaurants.map((r,i) => <div key={i} className="restaurant-item">{r}</div>)}
            </div>
          </div>
          <div className="side-card">
            <div className="side-h">🧳 Packing Suggestions</div>
            <div className="pack-list">
              <span className="pack-chip">Comfortable shoes</span>
              <span className="pack-chip">Layers</span>
              <span className="pack-chip">Camera</span>
            </div>
          </div>
          <div className="side-card">
            <div className="side-h">💰 Budget Breakdown</div>
            <div>
              <div className="budget-row"><span>Flights & Stay</span><span>₹{((booking?.total||0) * 0.7).toLocaleString('en-IN')}</span></div>
              <div className="budget-row"><span>Experiences</span><span>₹{((booking?.total||0) * 0.2).toLocaleString('en-IN')}</span></div>
              <div className="budget-row"><span>Concierge & Misc</span><span>₹{((booking?.total||0) * 0.1).toLocaleString('en-IN')}</span></div>
              <div className="budget-row tot"><span>Total Est.</span><span>₹{(booking?.total||0).toLocaleString('en-IN')}</span></div>
            </div>
          </div>
        </div>
      </div>

      <VeeAssistant pageKey="itinerary" showToast={showToast} />
    </main>
  );
}