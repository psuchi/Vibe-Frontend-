import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getVibe } from '../data/vibes';
import { useVibe } from '../context/VibeContext';
import VeeAssistant from '../components/VeeAssistant';

export default function ConfirmationPage({ showToast }) {
  useScrollReveal();
  const navigate = useNavigate();
  const { bookingFinal, booking, setCurrentMood, bookingRef, setBookingRef } = useVibe();

  const draft = bookingFinal || booking;
  const moodId = draft?.mood || 'calm';
  const vibe = getVibe(moodId);
  const cityName = draft?.city || vibe.dests[0].city;
  const dest = vibe.dests.find(d => d.city === cityName) || vibe.dests[0];

  const nights = draft?.nights || 3;
  const stayName = draft?.stay || vibe.stays[0].name;
  const flight = draft?.flight || { al: 'IndiGo', price: 6200 };
  const attractions = draft?.attractions || [dest.attractions[0]];
  const stayObj = vibe.stays.find(s => s.name === stayName) || vibe.stays[0];
  const total = draft?.total || (stayObj.basePrice * nights + flight.price * 2 + attractions.length * 2200);

  useEffect(() => {
    setCurrentMood(moodId);
    document.title = `Booking Confirmed — ${dest.city} — Vibe`;
  }, [moodId, dest, setCurrentMood]);

  const handleDownload = () => {
    const lines = [
      `VIBE — BOOKING CONFIRMATION`,
      `Reference: ${bookingRef}`,
      ``,
      `Mood: ${vibe.name} (${vibe.tag})`,
      `Destination: ${dest.city}, ${dest.country}`,
      `Nights: ${nights}`,
      ``,
      `FLIGHT`,
      `${flight.al} round-trip — ₹${(flight.price*2).toLocaleString('en-IN')}`,
      ``,
      `STAY`,
      `${stayObj.name} (${stayObj.loc})`,
      ``,
      `EXPERIENCES`,
      ...attractions.map(a => `• ${a}`),
      ``,
      `TOTAL PAID: ₹${total.toLocaleString('en-IN')}`,
      ``,
      `— Have a beautiful trip. VEE will check in before departure. —`
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vibe-Itinerary-${dest.city.replace(/\s+/g,'')}-${bookingRef}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Itinerary downloaded ✦');
  };

  return (
    <main>
      <div className="cf-wrap">
        {/* ── CONFIRMATION MARK ── */}
        <div className="cf-mark sr">
          <div className="cf-circle">
            <svg className="cf-check" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <path className="cf-check-path" d="M10 21 L17 28 L30 13" />
            </svg>
          </div>
        </div>

        {/* ── HEADING ── */}
        <div className="cf-head sr">
          <h1>Your {vibe.name} journey is booked.</h1>
          <p>{dest.city}, {dest.country} is confirmed — matched to {vibe.tag.toLowerCase()}. VEE will check in as your dates get closer.</p>
          <div className="cf-ref">Booking reference <b>{bookingRef}</b></div>
        </div>

        {/* ── BOOKING SUMMARY CARD ── */}
        <div className="cf-card sr">
          <div className="cf-card-hero">
            <img src={dest.img} alt="" />
            <div className="cf-card-hero-ov"></div>
            <div className="cf-card-hero-txt">
              <div className="cf-card-tag">{vibe.name}</div>
              <div className="cf-card-city">{dest.city}, {dest.country}</div>
            </div>
          </div>
          <div className="cf-rows">
            <div className="cf-row"><span className="cf-row-lbl">Flight</span><span className="cf-row-val">{flight.al} round-trip · ₹{(flight.price*2).toLocaleString('en-IN')}</span></div>
            <div className="cf-row"><span className="cf-row-lbl">Stay</span><span className="cf-row-val">{stayObj.name} · {nights} nights</span></div>
            <div className="cf-row"><span className="cf-row-lbl">Experiences</span><span className="cf-attr-list">{attractions.map((a,i) => <span key={i} className="cf-attr-chip">{a}</span>)}</span></div>
            <div className="cf-row tot"><span className="cf-row-lbl">Total paid</span><span className="cf-row-val" style={{color:'var(--accent)',fontSize:'1.1rem'}}>₹{total.toLocaleString('en-IN')}</span></div>
          </div>
        </div>

        {/* ── ACTIONS ── */}
        <div className="cf-actions sr">
          <button className="btn-fill" onClick={handleDownload}>Download itinerary ⭳</button>
          <button className="btn-outline" onClick={() => navigate('/itinerary')}>View my itinerary →</button>
          <button className="btn-ghost" onClick={() => navigate('/')}>Return home</button>
        </div>

        {/* ── NEXT STEPS ── */}
        <div className="cf-next sr">
          <div className="cf-next-card"><div className="cf-next-icon">📩</div><div className="cf-next-h">Confirmation sent</div><div className="cf-next-p">Details and vouchers are saved to your trip — no separate email needed for this demo.</div></div>
          <div className="cf-next-card"><div className="cf-next-icon">🧳</div><div className="cf-next-h">Plan your days</div><div className="cf-next-p">Your itinerary is pre-built and fully editable — rearrange anything to fit your pace.</div></div>
          <div className="cf-next-card"><div className="cf-next-icon">✦</div><div className="cf-next-h">VEE is on call</div><div className="cf-next-p">Ask VEE for packing tips, local etiquette, or last-minute changes anytime.</div></div>
        </div>
      </div>
      <VeeAssistant pageKey="confirmation" showToast={showToast} />
    </main>
  );
}
