import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getVibe, BUDGET_CONFIG } from '../data/vibes';
import { useVibe } from '../context/VibeContext';
import VeeAssistant from '../components/VeeAssistant';

export default function BookingsPage({ showToast }) {
  useScrollReveal();
  const navigate = useNavigate();
  const { booking, setBooking, setCurrentMood, setBookingRef, setBookingId } = useVibe();

  const [step, setStep] = useState(1);
  const [selFlight, setSelFlight] = useState(booking?.destSelections?.flight ? 0 : 0);
  const [selStay, setSelStay] = useState(booking?.destSelections?.stay ? 0 : 0);
  const [selAttr, setSelAttr] = useState(new Set(booking?.destSelections?.exp ? [0] : []));
  const [tier, setTier] = useState('balanced');

  const moodId = booking?.mood || 'calm';
  const vibe = getVibe(moodId);
  const cityName = booking?.city || vibe.dests[0].city;
  const dest = vibe.dests.find(d => d.city === cityName) || vibe.dests[0];

  useEffect(() => {
    setCurrentMood(moodId);
    document.title = `Book — ${dest.city} — Vibe`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [moodId, dest, setCurrentMood]);

  const destCode = booking?.destSelections?.flight?.title?.split('to ')?.[1] || dest.city.substring(0, 3).toUpperCase();

  let flightOpt1 = { al: 'IndiGo', from: 'BLR', dep: '06:15', to: destCode, arr: '08:40', dur: '2h 25m', stops: 0, price: 5100 };

  if (booking?.destSelections?.flight) {
    const fData = booking.destSelections.flight;
    const priceVal = parseInt(String(fData.price || '').replace(/[^\d]/g, ''), 10) || 5100;
    let airline = fData.title || 'Flight';
    if (airline.includes('·')) airline = airline.split('·')[0].trim();
    if (airline.includes('Flight to')) airline = 'Flight';
    flightOpt1 = {
      al: airline, from: 'BLR', dep: 'Any', to: destCode, arr: 'Any',
      dur: fData.detail || 'Direct', stops: 0,
      price: Math.round(priceVal / 2)
    };
  }

  const flights = [
    flightOpt1,
    { al: 'Air India', from: 'BLR', dep: '10:30', to: destCode, arr: '13:15', dur: '2h 45m', stops: 0, price: 6200 },
    { al: 'Vistara', from: 'BLR', dep: '15:00', to: destCode, arr: '19:30', dur: '4h 30m', stops: 1, price: 8400 }
  ];

  const staysList = vibe.stays.slice();
  if (booking?.destSelections?.stay) {
    const sData = booking.destSelections.stay;
    staysList[0] = {
      name: sData.title,
      loc: dest.city,
      amen: sData.detail || staysList[0].amen,
      rate: (sData.detail || '').match(/★ ([\d.]+)/)?.[1] || '4.5',
      basePrice: parseInt(String(sData.price || '').replace(/[^\d]/g, ''), 10) || staysList[0].basePrice,
      img: sData.img || dest.img,
      lbl: 'Best Match'
    };
  }

  const ATTR_EMOJIS = ['🏔', '🌊', '🏯', '🎭', '🍽', '🧘', '🛶', '🎨'];
  const attractions = dest.attractions.map((a, i) => ({
    name: a,
    price: 1500 + i * 800,
    emoji: ATTR_EMOJIS[i % ATTR_EMOJIS.length]
  }));

  if (booking?.destSelections?.exp) {
    const eData = booking.destSelections.exp;
    attractions[0] = {
      name: eData.title || attractions[0].name,
      price: parseInt(String(eData.price || '').replace(/[^\d]/g, ''), 10) || 2500,
      emoji: '🌟'
    };
  }

  const toggleAttr = (i) => {
    const next = new Set(selAttr);
    if (next.has(i)) next.delete(i); else next.add(i);
    setSelAttr(next);
  };

  const handleConfirm = async () => {
    const flight = flights[selFlight];
    const stay = staysList[selStay];
    const selectedAttractions = Array.from(selAttr).map(i => attractions[i].name);
    const flightTotal = flight.price * 2;
    const stayTotal = stay.basePrice * 4;
    let attrTotal = 0;
    selAttr.forEach(i => { attrTotal += attractions[i].price * 2; });
    const total = flightTotal + stayTotal + attrTotal;

    const newBooking = {
      ...booking, tier, dates: 'Next month', guests: 2,
      stay: stay.name, flight: flight,
      attractions: selectedAttractions, nights: 4, total
    };

    setBooking(newBooking);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings`, newBooking, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.data.reference) setBookingRef(res.data.reference);
      if (res.data._id) setBookingId(res.data._id);
    } catch (err) {
      console.error('Booking POST error:', err);
    }
    navigate('/confirmation');
  };

  const flightTotal = flights[selFlight].price * 2;
  const stayTotal = staysList[selStay].basePrice * 4;
  let attrTotal = 0;
  selAttr.forEach(i => { attrTotal += attractions[i].price * 2; });
  const total = flightTotal + stayTotal + attrTotal;

  return (
    <main>
      <div className="bk-wrap sr">
        {/* ── HEADER ── */}
        <div className="bk-head">
          <h1 className="sec-title" style={{ fontSize: '2.4rem' }}>Design Your Journey</h1>
          <p className="sec-sub" style={{ margin: '0 auto' }}>Customize your flights, stay, and experiences for {dest.city}.</p>
        </div>

        {/* ── STEP INDICATOR ── */}
        <div className="step-indicator">
          <div className={`si-step ${step > 1 ? 'done' : step === 1 ? 'on' : ''}`}>
            <div className="si-dot">{step > 1 ? '✓' : '1'}</div>
            <div className="si-label">Travel</div>
          </div>
          <div className={`si-line ${step > 1 ? 'done' : ''}`}></div>
          <div className={`si-step ${step > 2 ? 'done' : step === 2 ? 'on' : ''}`}>
            <div className="si-dot">{step > 2 ? '✓' : '2'}</div>
            <div className="si-label">Stay</div>
          </div>
          <div className={`si-line ${step > 2 ? 'done' : ''}`}></div>
          <div className={`si-step ${step > 3 ? 'done' : step === 3 ? 'on' : ''}`}>
            <div className="si-dot">{step > 3 ? '✓' : '3'}</div>
            <div className="si-label">Experiences</div>
          </div>
          <div className={`si-line ${step > 3 ? 'done' : ''}`}></div>
          <div className={`si-step ${step === 4 ? 'on' : ''}`}>
            <div className="si-dot">4</div>
            <div className="si-label">Review</div>
          </div>
        </div>

        {/* ── STEP 1: FLIGHTS ── */}
        {step === 1 && (
          <section className="bk-panel on">
            <div className="bk-panel-header">
              <h2>✈ Choose Your Flight</h2>
              <p>Select a flight that works for your schedule and budget.</p>
            </div>
            <div id="flightList">
              {flights.map((f, i) => (
                <div key={i} className={`flight-card ${i === selFlight ? 'sel' : ''}`} onClick={() => setSelFlight(i)}>
                  <div className="fl-left">
                    <div className="fl-icon">✈</div>
                    <div>
                      <div className="fl-airline">{f.al}</div>
                      <div className="fl-route">{f.from} {f.dep} → {f.to} {f.arr}</div>
                      <div className="fl-meta">{f.dur} · {f.stops === 0 ? 'Non-stop' : f.stops + ' stop'}</div>
                    </div>
                  </div>
                  <div className="fl-price">₹{f.price.toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── STEP 2: STAY ── */}
        {step === 2 && (
          <section className="bk-panel on">
            <div className="bk-panel-header">
              <h2>🏨 Choose Your Stay</h2>
              <p>Pick the accommodation that matches your mood and budget tier.</p>
            </div>
            <div className="stay-grid">
              {staysList.map((s, i) => (
                <div key={i} className={`stay-card ${i === selStay ? 'sel' : ''}`} onClick={() => setSelStay(i)}>
                  <img src={s.img || dest.img} alt={s.name} />
                  <div className="stay-card-body">
                    <div className="scard-lbl">{s.lbl || 'Recommended'}</div>
                    <div className="scard-name">{s.name}</div>
                    <div className="scard-loc">{s.loc}</div>
                    <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginBottom: '1rem', lineHeight: 1.6 }}>{s.amen}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--card-border)', paddingTop: '0.9rem' }}>
                      <span className="scard-price">₹{s.basePrice.toLocaleString('en-IN')}<span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 400 }}>/night</span></span>
                      <span className="scard-rate">★ {s.rate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── STEP 3: EXPERIENCES ── */}
        {step === 3 && (
          <section className="bk-panel on">
            <div className="bk-panel-header">
              <h2>🌍 Pick Your Experiences</h2>
              <p>Add curated activities and attractions that match your vibe. Optional — add or skip anything.</p>
            </div>
            <div className="attr-grid">
              {attractions.map((a, i) => {
                const isSel = selAttr.has(i);
                return (
                  <div key={i} className={`attr-card ${isSel ? 'sel' : ''}`} onClick={() => toggleAttr(i)}>
                    <div className="attr-left">
                      <div className="attr-emoji">{a.emoji}</div>
                      <div>
                        <div className="attr-name">{a.name}</div>
                        <div className="attr-price">₹{a.price.toLocaleString('en-IN')} / person</div>
                      </div>
                    </div>
                    <div className="attr-check">{isSel ? '✓' : ''}</div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── STEP 4: REVIEW ── */}
        {step === 4 && (
          <section className="bk-panel on">
            <div className="bk-panel-header">
              <h2>✓ Review & Confirm</h2>
              <p>Everything looks good? Hit confirm to lock in your journey.</p>
            </div>
            <div className="sum-card">
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.8rem' }}>Journey to {dest.city}</div>
              <div className="sum-row">
                <span className="sum-lbl">Flights ({flights[selFlight].al}) x2</span>
                <span>₹{flightTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="sum-row">
                <span className="sum-lbl">Stay ({staysList[selStay].name}) x4 nights</span>
                <span>₹{stayTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="sum-row">
                <span className="sum-lbl">Experiences ({selAttr.size}) x2</span>
                <span>₹{attrTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="sum-row tot">
                <span>Total</span>
                <span style={{ color: 'var(--accent)' }}>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </section>
        )}

        {/* ── NAVIGATION ── */}
        <div className="bk-nav">
          {step > 1 ? (
            <button className="btn-ghost" onClick={() => setStep(step - 1)}>← Back</button>
          ) : (
            <div></div>
          )}
          {step < 4 ? (
            <button className="btn-fill" onClick={(e) => {
              e.preventDefault();
              try { window.scrollTo(0, 0); } catch (err) {}
              setStep(step + 1);
            }}>Next Step →</button>
          ) : (
            <button className="btn-fill" onClick={handleConfirm}>Confirm Booking ✓</button>
          )}
        </div>
      </div>
      <VeeAssistant pageKey="bookings" showToast={showToast} />
    </main>
  );
}