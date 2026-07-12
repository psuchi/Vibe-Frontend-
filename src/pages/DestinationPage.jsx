import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getVibe } from '../data/vibes';
import { useVibe } from '../context/VibeContext';
import VeeAssistant from '../components/VeeAssistant';
import LeafletMap from '../components/LeafletMap';

const CITY_COORDS = {
  'Coorg': [12.3375, 75.8069],
  'Rishikesh': [30.0869, 78.2676],
  'Phuket': [7.8804, 98.3923],
  'Spiti Valley': [32.2461, 78.0148],
  'Zanskar': [33.5277, 76.7528],
  'Chamonix': [45.9237, 6.8694],
  'Varanasi': [25.3176, 82.9739],
  'Hampi': [15.3350, 76.4600],
  'Kyoto': [35.0116, 135.7681],
  'Milan': [45.4642, 9.1900],
  'Singapore': [1.3521, 103.8198],
  'Copenhagen': [55.6761, 12.5683],
  'Jaipur': [26.9124, 75.7873],
  'Istanbul': [41.0082, 28.9784],
  'Oaxaca': [17.0600, -96.7220],
};

export default function DestinationPage({ showToast }) {
  useScrollReveal();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCurrentMood, setBooking } = useVibe();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCards, setSelectedCards] = useState(new Set());
  const [lightboxImg, setLightboxImg] = useState(null);
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [filters, setFilters] = useState({ price: 100000, duration: 'any', rating: 'any', type: {flights:true, hotels:true, experiences:true} });

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [liveBookingCards, setLiveBookingCards] = useState(null);
  const [loadingCards, setLoadingCards] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const moodId = searchParams.get('mood') || 'calm';
  const vibe = getVibe(moodId);
  const city = searchParams.get('city');
  const dest = vibe.dests.find(d => d.city === city) || vibe.dests[0];

  useEffect(() => {
    setCurrentMood(moodId);
    document.title = `${dest.city} — Vibe`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [moodId, dest, setCurrentMood]);

  useEffect(() => {
    setWeatherLoading(true);
    setWeather(null);
    axios.get(`${API_URL}/api/weather?city=${encodeURIComponent(dest.city)}`)
      .then(res => setWeather(res.data))
      .catch(() => setWeather({ temp: '--', desc: dest.weather, icon: '01d' }))
      .finally(() => setWeatherLoading(false));

    setLoadingCards(true);
    Promise.allSettled([
      axios.get(`${API_URL}/api/flights?origin=Bengaluru&destination=${encodeURIComponent(dest.city)}`),
      axios.get(`${API_URL}/api/hotels?city=${encodeURIComponent(dest.city)}`),
      axios.get(`${API_URL}/api/experiences?city=${encodeURIComponent(dest.city)}&mood=${moodId}`)
    ]).then(([flightsRes, hotelsRes, expRes]) => {
      const fData = flightsRes.status === 'fulfilled' ? flightsRes.value.data : null;
      const hData = hotelsRes.status === 'fulfilled' ? hotelsRes.value.data : null;
      const eData = expRes.status === 'fulfilled' ? expRes.value.data : null;

      const fallbackFlights = { type: 'Flights', title: `IndiGo · BLR → ${fData?.skyId || dest.city.slice(0,3).toUpperCase()}`, detail: 'Non-stop · 2h 25m · Departs 06:15 · Returns from ₹5,100', price: '₹6,200', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80', cta: 'Select Flight' };
      const fallbackStay = { type: 'Hotels', title: vibe.stays[0].name, detail: `${vibe.stays[0].loc} · ${vibe.stays[0].amen.split('·')[0].trim()} · ★ ${vibe.stays[0].rate}`, price: `₹${vibe.stays[0].basePrice.toLocaleString('en-IN')}/night`, img: dest.img, cta: 'Select Stay' };
      const fallbackExp = { type: 'Experiences', title: dest.attractions[0], detail: `Curated ${vibe.name.toLowerCase()} experience · Private guided · Full day`, price: '₹2,500/person', img: vibe.heroImg, cta: 'Add Experience' };

      const extractImgUrl = (photos) => photos?.[0]?.sizes?.urlTemplate ? photos[0].sizes.urlTemplate.replace('{width}', '600').replace('{height}', '400') : null;

      const newCards = [
        (fData?.data?.itineraries?.length > 0) ? {
          type: 'Flights',
          title: `Flight to ${fData.skyId || dest.city}`,
          detail: `From ${fData.data.itineraries[0].price?.formatted || '₹10,000'}`,
          price: fData.data.itineraries[0].price?.formatted || '₹10,000',
          img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80',
          cta: 'Select Flight',
          rawData: fData.data.itineraries[0]
        } : fallbackFlights,
        (hData?.data?.data?.length > 0) ? {
          type: 'Hotels',
          title: hData.data.data[0].title,
          detail: `★ ${hData.data.data[0].bubbleRating?.rating || '4.5'} · ${hData.data.data[0].primaryInfo || ''}`,
          price: hData.data.data[0].priceForDisplay || fallbackStay.price,
          img: extractImgUrl(hData.data.data[0].cardPhotos) || fallbackStay.img,
          cta: 'Select Stay',
          rawData: hData.data.data[0]
        } : fallbackStay,
        (eData?.data?.data?.length > 0) ? {
          type: 'Experiences',
          title: eData.data.data[0].title,
          detail: `Live Data · ${eData.data.data[0].primaryInfo || ''}`,
          price: eData.data.data[0].priceForDisplay || fallbackExp.price,
          img: extractImgUrl(eData.data.data[0].cardPhotos) || fallbackExp.img,
          cta: 'Add Experience',
          rawData: eData.data.data[0]
        } : fallbackExp
      ];
      setLiveBookingCards(newCards);
    }).finally(() => setLoadingCards(false));
  }, [dest.city, moodId, API_URL]);

  const handleStartBooking = () => {
    const flightCard = selectedCards.has(0) ? BOOKING_CARDS[0] : null;
    const stayCard = selectedCards.has(1) ? BOOKING_CARDS[1] : null;
    const expCard = selectedCards.has(2) ? BOOKING_CARDS[2] : null;

    const passedSelections = {
      flight: flightCard,
      stay: stayCard,
      exp: expCard
    };
    setBooking({
      mood: moodId,
      city: dest.city,
      stay: stayCard ? stayCard.title : vibe.stays[0].name,
      basePrice: vibe.stays[0].basePrice,
      vibeName: vibe.name,
      destSelections: passedSelections
    });
    navigate('/bookings');
  };

  const BOOKING_CARDS = liveBookingCards || [
    { type: 'Flights', title: `IndiGo · BLR → ${dest.city.slice(0,3).toUpperCase()}`, detail: 'Non-stop · 2h 25m · Departs 06:15 · Returns from ₹5,100', price: '₹6,200', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80', cta: 'Select Flight' },
    { type: 'Hotels', title: vibe.stays[0].name, detail: `${vibe.stays[0].loc} · ${vibe.stays[0].amen.split('·')[0].trim()} · ★ ${vibe.stays[0].rate}`, price: `₹${vibe.stays[0].basePrice.toLocaleString('en-IN')}/night`, img: dest.img, cta: 'Select Stay' },
    { type: 'Experiences', title: dest.attractions[0], detail: `Curated ${vibe.name.toLowerCase()} experience · Private guided · Full day`, price: '₹2,500/person', img: vibe.heroImg, cta: 'Add Experience' }
  ];

  const toggleCard = (i) => {
    const newSel = new Set(selectedCards);
    if(newSel.has(i)) newSel.delete(i);
    else newSel.add(i);
    setSelectedCards(newSel);
  };

  const galleryImgs = [
    dest.img, vibe.heroImg,
    vibe.dests[(vibe.dests.indexOf(dest)+1)%vibe.dests.length].img,
    vibe.dests[(vibe.dests.indexOf(dest)+2)%vibe.dests.length].img,
    vibe.cardImg, vibe.dests[0].img,
    vibe.dests.length>1?vibe.dests[1].img:dest.img, vibe.stays[0]?dest.img:vibe.heroImg
  ];

  return (
    <main>
      {/* ── HERO ── */}
      <section className="d-hero sr">
        <div className="d-hero-bg" style={{backgroundImage:`url(${dest.img})`}}></div>
        <div className="d-hero-ov"></div>
        <div className="d-hero-content">
          <button className="d-back" onClick={() => navigate(`/vibes?mood=${moodId}`)}>← Back to Vibes</button>
          <span className="d-vtag">{vibe.name}</span>
          <h1 className="d-title">{dest.city}</h1>
          <p className="d-country">{dest.country}</p>
        </div>
      </section>

      {/* ── STICKY HEADER WITH TABS ── */}
      <div className="d-header-block sr">
        <div className="d-header-top">
          <div>
            <div className="d-header-name">{dest.city}</div>
            <div style={{fontSize:'13px',color:'var(--muted)',marginTop:'4px'}}>{dest.country} · {vibe.name} vibe</div>
          </div>
          <div className="d-header-meta">
            <span>★ {dest.r}</span>
            <span>{dest.budget}</span>
            <span>{dest.duration}</span>
            <span style={{color:'var(--accent)',fontWeight:600}}>{dest.match}% match</span>
            {weather && (
              <span className="weather-badge">
                {weatherLoading ? '...' : `${weather.temp}°C ${weather.desc}`}
              </span>
            )}
          </div>
        </div>
        <div className="d-tabs" role="tablist">
          <button className={`d-tab ${activeTab==='overview'?'active':''}`} onClick={()=>setActiveTab('overview')}>Overview</button>
          <button className={`d-tab ${activeTab==='experiences'?'active':''}`} onClick={()=>setActiveTab('experiences')}>Experiences</button>
        </div>
      </div>

      {/* ── OVERVIEW TAB ── */}
      <div className={`d-panel ${activeTab==='overview'?'on':''}`}>
        <div style={{padding:'3rem 5vw'}}>
          <div className="d-info-grid sr">
            <div className="d-info-card">
              <div className="d-info-lbl">Weather</div>
              <div className="d-info-val">{dest.weather}</div>
            </div>
            <div className="d-info-card">
              <div className="d-info-lbl">Best Time</div>
              <div className="d-info-val">{dest.best}</div>
            </div>
            <div className="d-info-card">
              <div className="d-info-lbl">Budget Range</div>
              <div className="d-info-val">{dest.budgetRange}</div>
            </div>
            <div className="d-info-card">
              <div className="d-info-lbl">Mood Match</div>
              <div className="d-info-val">{dest.match}% for {vibe.name}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── EXPERIENCES TAB ── */}
      <div className={`d-panel ${activeTab==='experiences'?'on':''}`}>
        <div style={{padding:'3rem 5vw'}}>
          <div style={{marginBottom:'2.5rem'}} className="sr">
            <div className="sec-divider"><div className="sec-divider-line"></div><span className="sec-divider-label">Top Attractions</span><div className="sec-divider-line"></div></div>
            <div className="d-attractions-grid">
              {dest.attractions.map((a,i)=><div key={i} className="d-attr-item">📍 {a}</div>)}
            </div>
          </div>
          <div style={{marginBottom:'2.5rem'}} className="sr">
            <div className="sec-divider"><div className="sec-divider-line"></div><span className="sec-divider-label">Where to Eat</span><div className="sec-divider-line"></div></div>
            <div className="d-attractions-grid">
              {dest.restaurants.map((r,i)=><div key={i} className="d-attr-item">🍽 {r}</div>)}
            </div>
          </div>
          <div className="d-story-block sr">
            <div style={{fontSize:'10.5px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--accent)',marginBottom:'1rem'}}>The Story Here</div>
            <p>{dest.story}</p>
          </div>
        </div>
      </div>

      {/* ── MAP SECTION ── */}
      <div className="d-map-section sr">
        <div className="d-map-label"><span style={{fontSize:'1.4rem'}}>🗺</span><h2>Location</h2></div>
        <div className="d-map-frame" style={{position:'relative'}}>
          <LeafletMap type="pin" center={CITY_COORDS[dest.city] || [20.5937, 78.9629]} zoom={CITY_COORDS[dest.city] ? 12 : 5} />
        </div>
        <div className="d-map-info-row">
          <div className="d-map-info-chip">🌤 {dest.weather}</div>
          <div className="d-map-info-chip">📅 Best: {dest.best}</div>
          <div className="d-map-info-chip">💰 {dest.budgetRange}</div>
        </div>
      </div>

      {/* ── BOOK YOUR STAY, FLIGHTS & EXPERIENCES ── */}
      <div className="d-booking-section sr">
        <div className="d-booking-header">
          <h2>Book your <em style={{fontStyle:'italic',color:'var(--accent)'}}>stay, flights & experiences</em></h2>
          <p>Handpicked options matched to your vibe. Select any card to add it to your journey.</p>
        </div>

        <div style={{margin:'0 0 2rem'}}>
          <div className="sec-divider"><div className="sec-divider-line"></div><span className="sec-divider-label">Choose What to Book</span><div className="sec-divider-line"></div></div>
        </div>

        <div className="d-booking-layout">
          <div>
            <div className="bk-card-grid">
              {BOOKING_CARDS.map((c,i) => {
                const sel = selectedCards.has(i);
                return (
                  <div key={i} className="bk-card" style={sel ? {borderColor:'var(--accent)',boxShadow:'0 0 0 3px var(--accent-light)'} : {}}>
                    <img className="bk-card-img" src={c.img} alt={c.type} />
                    <div className="bk-card-body">
                      <div className="bk-card-type">{c.type}</div>
                      <div className="bk-card-title">{c.title}</div>
                      <div className="bk-card-detail">{c.detail}</div>
                      <div className="bk-card-foot">
                        <span className="bk-card-price">{c.price}</span>
                        <button
                          className="bk-card-cta"
                          style={sel ? {background:'var(--accent)',opacity:0.75} : {}}
                          onClick={()=>toggleCard(i)}
                        >
                          {sel ? '✓ Selected' : c.cta}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="d-filter-col">
            <aside className={`filter-sidebar ${filterDrawer?'open':''}`}>
              <div className="filter-sidebar-h">
                Filters <button className="filter-sidebar-reset" onClick={()=>setFilters({ price: 100000, duration: 'any', rating: 'any', type: {flights:true, hotels:true, experiences:true} })}>Reset</button>
              </div>
              <div className="filter-group">
                <span className="filter-group-label">Price Range</span>
                <input type="range" className="filter-range" min="0" max="100000" step="5000" value={filters.price} onChange={e=>setFilters({...filters, price:e.target.value})} />
                <div className="filter-range-labels">
                  <span>₹0</span>
                  <span>{filters.price >= 100000 ? 'Any' : `Up to ₹${parseInt(filters.price).toLocaleString('en-IN')}`}</span>
                </div>
              </div>
              <div className="filter-group">
                <span className="filter-group-label">Duration</span>
                <div className="filter-pills">
                  {['any','short','mid','long'].map(v=><button key={v} className={`filter-pill ${filters.duration===v?'on':''}`} onClick={()=>setFilters({...filters,duration:v})}>{v==='any'?'Any':v==='short'?'Weekend':v==='mid'?'4-6 nights':'7+ nights'}</button>)}
                </div>
              </div>
              <div className="filter-group">
                <span className="filter-group-label">Style</span>
                <div className="filter-check-group">
                  {['flights','hotels','experiences'].map(k => (
                    <label key={k} className="filter-check-item">
                      <input type="checkbox" checked={filters.type[k]} onChange={()=>setFilters({...filters, type:{...filters.type, [k]:!filters.type[k]}})} /> {k.charAt(0).toUpperCase() + k.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* ── GALLERY ── */}
      <div className="d-gallery-section sr">
        <h2>Destination <em style={{fontStyle:'italic',color:'var(--accent)'}}>gallery</em></h2>
        <p>A visual taste of what awaits — click any image to view full-size.</p>
        <div className="gallery-grid">
          {galleryImgs.map((src, i) => (
            <div key={i} className="gallery-item" onClick={()=>setLightboxImg(src)}>
              <img src={src} alt="Gallery" />
              <div className="gallery-item-ov"><span>⤢</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CONTINUE CTA ── */}
      <div className="d-continue sr">
        <div className="d-continue-inner">
          <h2>Ready to feel {vibe.name}?</h2>
          <p>Your curated journey — flights, stay, and experiences — is one click away.</p>
          <button className="d-continue-btn" onClick={handleStartBooking}>Continue to Booking →</button>
        </div>
      </div>

      {/* ── TRAVELER REVIEWS ── */}
      <div style={{padding:'3rem 5vw 4.5rem',background:'var(--section-bg)',borderTop:'1px solid var(--card-border)'}}>
        <div style={{maxWidth:'700px',margin:'0 auto'}} className="sr">
          <div className="sec-divider" style={{marginBottom:'1.6rem'}}><div className="sec-divider-line"></div><span className="sec-divider-label">Traveler Reviews</span><div className="sec-divider-line"></div></div>
          <div className="d-reviews">
            {[
              { n:'Priya S.', s:5, t:`Exactly the ${vibe.tag.toLowerCase()} I was craving. VEE's pacing was spot on.` },
              { n:'Daniel K.', s:5, t:`${dest.city} matched the mood better than any guidebook could've told me.` },
              { n:'Meera R.', s:4, t:'Beautifully curated — wish the itinerary had a bit more downtime, but unforgettable.' }
            ].map((r,i) => (
              <div key={i} className="d-review">
                <div className="d-review-top"><span>{r.n}</span><span style={{color:'var(--accent)',fontSize:'13px'}}>{'★'.repeat(r.s)}{'☆'.repeat(5-r.s)}</span></div>
                <div style={{fontSize:'13px',color:'var(--muted)',lineHeight:1.7}}>{r.t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {lightboxImg && (
        <div className="lightbox show" onClick={()=>setLightboxImg(null)}>
          <button className="lightbox-close">✕</button>
          <img className="lightbox-img" src={lightboxImg} alt="" onClick={e=>e.stopPropagation()} />
        </div>
      )}

      <VeeAssistant pageKey="destination" showToast={showToast} />
    </main>
  );
}