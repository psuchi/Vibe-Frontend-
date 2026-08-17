import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getVibe } from '../data/vibes';
import { useVibe } from '../context/VibeContext';
import VeeAssistant from '../components/VeeAssistant';

/* ── Safe PDF that won't blank the page ──────────────────────────────────── */
function safePdfDownload(element, opt, onDone) {
  element.style.position = 'fixed';
  element.style.left = '-9999px';
  element.style.top = '0';
  element.style.width = '800px';
  element.style.zIndex = '-1';
  document.body.appendChild(element);
  html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => {
      if (document.body.contains(element)) document.body.removeChild(element);
      if (onDone) onDone();
    })
    .catch(() => {
      if (document.body.contains(element)) document.body.removeChild(element);
      if (onDone) onDone();
    });
}

export default function ConfirmationPage({ showToast }) {
  useScrollReveal();
  const navigate = useNavigate();
  const { bookingFinal, booking, setCurrentMood, bookingRef, getItinerary } = useVibe();

  const [showConfetti, setShowConfetti] = useState(true);
  const [trueItinerary, setTrueItinerary] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const draft = bookingFinal || booking;
  const moodId = draft?.mood || 'calm';
  const vibe = getVibe(moodId);
  const cityName = draft?.city || vibe.dests[0].city;
  const dest = vibe.dests.find(d => d.city === cityName) || vibe.dests[0];

  const nights = draft?.nights || 4;
  const stayName = draft?.stay || dest.hotels?.[0]?.name || 'Stay';
  const flight = draft?.flight || { al: 'IndiGo', from: 'BLR', to: dest.city.slice(0, 3).toUpperCase(), dep: '06:15', arr: '08:40', price: 6200 };
  const attractions = draft?.attractions || [dest.experiences?.[0]?.name || 'Experience'];
  const total = draft?.total || 50000;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCurrentMood(moodId);
    document.title = `Booking Confirmed — ${dest.city} — Vibe`;
    setTimeout(() => setShowConfetti(false), 5000);
    
    let saved = getItinerary(moodId, cityName);
    if (!saved || saved.length === 0) {
      saved = vibe.days || [];
    }
    setTrueItinerary(saved);
  }, [moodId, dest, cityName, setCurrentMood, getItinerary]);

  const getDeterministicMock = (seed, type) => {
    let hash = 0;
    const str = String(seed);
    for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i);
    const posHash = Math.abs(hash);
    if (type === 'flightNum') return 'VB' + (100 + (posHash % 900));
    if (type === 'hotelAddr') return (10 + (posHash % 200)) + ' Vibe Boulevard, ' + dest.city;
    if (type === 'pickupLoc') return dest.city + ' Arrivals Gate';
    if (type === 'pickupDriver') return ['John', 'Raj', 'Alex', 'Sam'][posHash % 4] + ' (White Sedan ' + (1000 + (posHash % 9000)) + ')';
    if (type === 'dropoffLoc') return 'Departures, ' + dest.city + ' Airport';
    if (type === 'resNum') return 'RES-' + (10000 + (posHash % 90000));
    return posHash;
  };

  const seed = bookingRef || cityName;
  const flightNum = getDeterministicMock(seed, 'flightNum');
  const hotelAddr = getDeterministicMock(seed, 'hotelAddr');
  const pickupLoc = getDeterministicMock(seed, 'pickupLoc');
  const pickupDriver = getDeterministicMock(seed, 'pickupDriver');
  const dropoffLoc = getDeterministicMock(seed, 'dropoffLoc');

  const handleDownload = () => {
    if (isDownloading) return;
    setIsDownloading(true);
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: sans-serif; padding: 20px; color: #111;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">
          <h1 style="color: #6C5CE7; font-size: 24px; margin: 0;">VIBE</h1>
          <span style="font-size: 14px; color: #555;">Ref: ${bookingRef || 'VB-DEMO'}</span>
        </div>
        
        <h2 style="font-size: 20px; margin-bottom: 5px;">Your Reserved Trip: ${dest.city}</h2>
        <p style="margin-top: 0; color: #666; font-size: 14px; margin-bottom: 20px;">Mood: ${vibe.name} · ${nights} Nights</p>

        <!-- Flight Section -->
        <h3 style="font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">✈️ Flight Details</h3>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Airline:</strong> ${flight.al} (Flight ${flightNum})</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Route:</strong> ${flight.from} to ${flight.to}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Times:</strong> ${flight.dep} - ${flight.arr}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Gate/Terminal:</strong> Terminal 1, Gate ${10 + (getDeterministicMock(seed, 'gate') % 40)}</p>

        <!-- Hotel Section -->
        <h3 style="font-size: 16px; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">🏨 Accommodation</h3>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Hotel:</strong> ${stayName}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Address:</strong> ${hotelAddr}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Check-in:</strong> 14:00 | <strong>Check-out:</strong> 11:00</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Reservation:</strong> ${getDeterministicMock(seed + 'hotel', 'resNum')}</p>

        <!-- Transport Section -->
        <h3 style="font-size: 16px; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">🚗 Transfers</h3>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Airport Pickup:</strong> ${pickupLoc} at ${flight.arr}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Driver:</strong> ${pickupDriver}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Airport Drop-off:</strong> ${dropoffLoc} (approx 3 hrs before departure)</p>

        <!-- Experiences Section -->
        <h3 style="font-size: 16px; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">🎟️ Reserved Experiences</h3>
        ${attractions.map((a, i) => `
          <div style="margin-bottom: 8px;">
            <p style="margin: 2px 0; font-size: 14px;"><strong>${a}</strong></p>
            <p style="margin: 0; font-size: 13px; color: #555;">Meeting Point: Central Plaza | Timing: ${9 + (i % 4)}:00 AM | Ref: ${getDeterministicMock(seed + i, 'resNum')}</p>
          </div>
        `).join('')}

        <!-- Itinerary Section -->
        <h3 style="font-size: 16px; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">📅 Daily Itinerary</h3>
        ${trueItinerary.map(d => `
          <div style="margin-bottom: 10px;">
            <p style="margin: 4px 0; font-size: 14px; font-weight: bold;">${d.day}: ${d.title}</p>
            ${d.acts.length === 0 ? '<p style="margin: 2px 0; font-size: 13px; color: #666;">Rest day</p>' : ''}
            ${d.acts.map(a => `<p style="margin: 2px 0; font-size: 13px;">• ${a.t}: ${a.n}</p>`).join('')}
          </div>
        `).join('')}

        <div style="margin-top: 30px; border-top: 2px solid #eee; padding-top: 10px; text-align: right;">
          <h3 style="font-size: 18px; margin: 0;">Total Amount: ₹${total.toLocaleString('en-IN')}</h3>
        </div>
      </div>
    `;
    const opt = {
      margin: 0.5,
      filename: `Vibe-ReservedTrip-${dest.city.replace(/\s+/g, '')}-${bookingRef || 'DEMO'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    safePdfDownload(element, opt, () => {
      setIsDownloading(false);
      showToast('Reserved Trip downloaded ✦');
    });
  };

  return (
    <main className="cf-main">
      {showConfetti && <div className="cf-confetti"></div>}

      <div className="cf-bg" style={{ backgroundImage: `url(${dest.img})` }}>
        <div className="cf-bg-overlay"></div>
      </div>

      <div className="cf-content-wrap">
        <div className="cf-header sr">
          <div className="cf-success-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1 className="cf-title">Journey Confirmed</h1>
          <p className="cf-subtitle">
            Your {vibe.name.toLowerCase()} escape to {dest.city} is ready.
          </p>
          <div className="cf-reference-badge">
            Ref: <span>{bookingRef || 'VB-DEMO'}</span>
          </div>
        </div>

        <div className="cf-ticket-card sr">
          <div className="cf-ticket-top">
            <div className="cf-ticket-dest">
              <span className="cf-ticket-city">{dest.city}</span>
              <span className="cf-ticket-country">{dest.country}</span>
            </div>
            <div className="cf-ticket-vibe">
              <span className="cf-ticket-mood-tag">{vibe.name}</span>
            </div>
          </div>

          <div className="cf-ticket-divider"></div>

          <div className="cf-ticket-body">
            {/* Flight */}
            <div className="cf-ticket-row" style={{ alignItems: 'flex-start' }}>
              <div className="cf-ticket-icon">✈️</div>
              <div className="cf-ticket-info">
                <span className="cf-ticket-label">Flight</span>
                <span className="cf-ticket-value">{flight.al} (Flight {flightNum})</span>
                <span style={{fontSize:'12px', color:'var(--muted)', display:'block', marginTop:'4px'}}>{flight.from} → {flight.to} | Dep: {flight.dep} Arr: {flight.arr}</span>
              </div>
            </div>

            {/* Hotel */}
            <div className="cf-ticket-row" style={{ alignItems: 'flex-start' }}>
              <div className="cf-ticket-icon">🏨</div>
              <div className="cf-ticket-info">
                <span className="cf-ticket-label">Stay</span>
                <span className="cf-ticket-value">{stayName} · {nights} Nights</span>
                <span style={{fontSize:'12px', color:'var(--muted)', display:'block', marginTop:'4px'}}>{hotelAddr} | Ref: {getDeterministicMock(seed + 'hotel', 'resNum')}</span>
              </div>
            </div>

            {/* Transfers */}
            <div className="cf-ticket-row" style={{ alignItems: 'flex-start' }}>
              <div className="cf-ticket-icon">🚗</div>
              <div className="cf-ticket-info">
                <span className="cf-ticket-label">Transfers</span>
                <span className="cf-ticket-value">Pickup: {pickupLoc}</span>
                <span style={{fontSize:'12px', color:'var(--muted)', display:'block', marginTop:'4px'}}>{pickupDriver}</span>
              </div>
            </div>

            {/* Experiences */}
            <div className="cf-ticket-row" style={{ alignItems: 'flex-start' }}>
              <div className="cf-ticket-icon">🎟️</div>
              <div className="cf-ticket-info">
                <span className="cf-ticket-label">Reserved Experiences</span>
                <div className="cf-ticket-tags" style={{marginTop:'6px'}}>
                  {attractions.map((a, i) => (
                    <div key={i} style={{marginBottom:'8px'}}>
                      <span className="cf-ticket-tag" style={{display:'inline-block'}}>{a}</span>
                      <span style={{fontSize:'12px', color:'var(--muted)', display:'block', marginTop:'4px'}}>Ref: {getDeterministicMock(seed + i, 'resNum')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Itinerary Snippet */}
            <div className="cf-ticket-row" style={{ alignItems: 'flex-start' }}>
              <div className="cf-ticket-icon">📅</div>
              <div className="cf-ticket-info">
                <span className="cf-ticket-label">Itinerary</span>
                <span className="cf-ticket-value">{trueItinerary.length} Days Planned</span>
                <span style={{fontSize:'12px', color:'var(--muted)', display:'block', marginTop:'4px'}}>Available for review below or in the PDF.</span>
              </div>
            </div>
          </div>

          <div className="cf-ticket-footer">
            <div className="cf-ticket-total-label">Total Amount</div>
            <div className="cf-ticket-total-value">₹{total.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="cf-actions sr" style={{ flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center', flexWrap: 'nowrap' }}>
            <button className="cf-btn cf-btn-primary" onClick={handleDownload} disabled={isDownloading} style={{ whiteSpace: 'nowrap' }}>
              {isDownloading ? 'Preparing PDF…' : 'Download Reserved Trip'}
            </button>
            <button className="cf-btn cf-btn-secondary" onClick={() => navigate('/itinerary')} style={{ whiteSpace: 'nowrap' }}>
              View Reserved Trip →
            </button>
          </div>
          <button className="cf-btn cf-btn-outline" onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ width: 'auto', minWidth: '120px' }}>
            Home
          </button>
        </div>

      </div>
      <VeeAssistant pageKey="confirmation" showToast={showToast} />
    </main>
  );
}
