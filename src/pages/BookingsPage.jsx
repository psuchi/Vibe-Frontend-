import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getVibe } from '../data/vibes';
import { useVibe } from '../context/VibeContext';
import VeeAssistant from '../components/VeeAssistant';
import { getAirportQuery } from '../data/destinationAirports';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MAJOR_CITIES = [
  { name: 'Hyderabad', code: 'HYD', lat: 17.3850, lng: 78.4867 },
  { name: 'Delhi', code: 'DEL', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', code: 'BOM', lat: 19.0760, lng: 72.8777 },
  { name: 'Bangalore', code: 'BLR', lat: 12.9716, lng: 77.5946 },
  { name: 'Chennai', code: 'MAA', lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata', code: 'CCU', lat: 22.5726, lng: 88.3639 },
  { name: 'Pune', code: 'PNQ', lat: 18.5204, lng: 73.8567 },
  { name: 'Ahmedabad', code: 'AMD', lat: 23.0225, lng: 72.5714 }
];
const DEFAULT_CITY = MAJOR_CITIES[0]; // Hyderabad

function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function findNearestCity(lat, lng) {
  let minCity = DEFAULT_CITY;
  let minDist = Infinity;
  for (const city of MAJOR_CITIES) {
    const d = getHaversineDistance(lat, lng, city.lat, city.lng);
    if (d < minDist) {
      minDist = d;
      minCity = city;
    }
  }
  return minCity;
}

function parseFlights(apiData, dest, depCity = DEFAULT_CITY) {
  const depCode = depCity.code;
  try {
    const itineraries = apiData?.data?.itineraries || apiData?.data?.data?.itineraries || [];
    if (itineraries.length > 0) {
      return itineraries.slice(0, 6).map(it => {
        const leg = it.legs?.[0] || {};
        const durationMins = leg.durationInMinutes || 120;
        const h = Math.floor(durationMins / 60);
        const m = durationMins % 60;
        return {
          al: leg.carriers?.marketing?.[0]?.name || 'Airline',
          from: leg.origin?.displayCode || depCode,
          to: leg.destination?.displayCode || dest.city.substring(0, 3).toUpperCase(),
          dep: leg.departure || '06:00',
          arr: leg.arrival || '08:00',
          dur: `${h}h ${m}m`,
          stops: leg.stopCount ?? 0,
          price: it.price?.raw || 5100,
        };
      });
    }
  } catch (e) { console.warn('parseFlights error', e); }
  
  if ((dest.flights || []).length > 0) {
    if (depCode === 'HYD') return dest.flights;
    return dest.flights.map((f, i) => {
       const priceOffset = (MAJOR_CITIES.findIndex(c => c.code === depCode) * 500) % 2000;
       return {
         ...f,
         from: depCode,
         price: f.price + priceOffset,
         dep: String((parseInt(f.dep.split(':')[0]) + i) % 24).padStart(2, '0') + ':' + f.dep.split(':')[1],
       };
    });
  }

  return [
    { al: 'IndiGo', from: depCode, to: dest.city.slice(0, 3).toUpperCase(), dep: '06:15', arr: '08:40', dur: '2h 25m', stops: 0, price: 5100 }
  ];
}

function parseHotels(apiData, dest) {
  try {
    if (Array.isArray(apiData) && apiData.length > 0) {
      return apiData.slice(0, 6).map((h, i) => ({
        name: h.name || `Hotel ${i + 1}`,
        loc: h.address || dest.city,
        amen: h.amenities || 'WiFi',
        rate: h.rate || '4.3',
        basePrice: h.basePrice || 4500,
        img: h.img || dest.img,
      }));
    }
  } catch (e) { console.warn('parseHotels error', e); }
  return (dest.hotels || []).length > 0
    ? dest.hotels.map(h => ({ name: h.name, loc: h.loc, amen: h.amen, rate: h.rate, basePrice: h.basePrice, img: h.img || dest.img }))
    : [{ name: dest.city + ' Stay', loc: dest.city, amen: 'WiFi · Pool', rate: '4.5', basePrice: 5000, img: dest.img }];
}

function parseExperiences(apiData, dest) {
  try {
    const items = apiData?.data?.Attractions_Products_Search?.results || apiData?.data || [];
    if (Array.isArray(items) && items.length > 0) {
      return items.slice(0, 6).map(e => ({
        name: e.name || e.title || 'Experience',
        desc: e.description || e.shortDescription || 'A curated local experience.',
        price: typeof e.price === 'number' ? e.price : 2500,
        img: e.photo?.images?.original?.url || e.coverPhoto?.photo?.photoSizes?.[0]?.url || dest.img,
      }));
    }
  } catch (e) { console.warn('parseExperiences error', e); }
  return (dest.experiences || []).length > 0
    ? dest.experiences.map(e => ({ name: e.name, desc: e.desc, price: e.price, img: e.img || dest.img }))
    : [{ name: dest.city + ' Tour', desc: 'Curated experience', price: 2500, img: dest.img }];
}

function SkeletonRow() {
  return (
    <div style={{ padding: '1.2rem 1.6rem', display: 'flex', gap: 16, alignItems: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--card-border)', animation: 'loaderPulse 1.5s infinite', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 12, width: '55%', background: 'var(--card-border)', borderRadius: 6, marginBottom: 10, animation: 'loaderPulse 1.5s infinite' }} />
        <div style={{ height: 10, width: '75%', background: 'var(--card-border)', borderRadius: 6, animation: 'loaderPulse 1.5s infinite' }} />
      </div>
    </div>
  );
}

export default function BookingsPage({ showToast }) {
  useScrollReveal();
  const navigate = useNavigate();
  const { booking, setBooking, setBookingFinal, setCurrentMood, setBookingRef, setBookingId, preferences } = useVibe();

  const [viewMoreType, setViewMoreType] = useState(null);
  const [selFlight, setSelFlight] = useState(0);
  const [selStay, setSelStay] = useState(0);
  const [selExps, setSelExps] = useState([0]);

  const [flights, setFlights] = useState(null);
  const [hotels, setHotels] = useState(null);
  const [experiences, setExperiences] = useState(null);
  const [loading, setLoading] = useState({ flights: true, hotels: true, experiences: true });

  const [depCity, setDepCity] = useState(DEFAULT_CITY);
  const [locationStatus, setLocationStatus] = useState('Finding nearest airport...');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const nearest = findNearestCity(position.coords.latitude, position.coords.longitude);
          setDepCity(nearest);
          setLocationStatus(`Flights from ${nearest.name} (${nearest.code})`);
        },
        () => {
          setDepCity(DEFAULT_CITY);
          setLocationStatus(`Flights from ${DEFAULT_CITY.name} (${DEFAULT_CITY.code})`);
        },
        { timeout: 5000 }
      );
    } else {
      setDepCity(DEFAULT_CITY);
      setLocationStatus(`Flights from ${DEFAULT_CITY.name} (${DEFAULT_CITY.code})`);
    }
  }, []);

  const moodId = booking?.mood || 'calm';
  const vibe = getVibe(moodId);
  const cityName = booking?.city || vibe.dests[0].city;
  let dest = vibe.dests.find(d => d.city === cityName) || vibe.dests[0];

  useEffect(() => {
    setCurrentMood(moodId);
    document.title = `Journey Plan — ${dest.city} — Vibe`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [moodId, dest, setCurrentMood]);

  useEffect(() => {
    setLoading(l => ({ ...l, flights: true }));
    const airportQuery = getAirportQuery(dest.city);
    axios.get(`${API_URL}/api/flights`, {
      params: { origin: depCity.name, destination: dest.city, originAirportQuery: depCity.name, destinationAirportQuery: airportQuery }
    })
      .then(res => setFlights(parseFlights(res.data, dest, depCity)))
      .catch(() => setFlights(parseFlights(null, dest, depCity)))
      .finally(() => setLoading(l => ({ ...l, flights: false })));
  }, [dest.city, depCity]);

  useEffect(() => {
    axios.get(`${API_URL}/api/hotels`, { params: { city: dest.city } })
      .then(res => setHotels(parseHotels(res.data, dest)))
      .catch(() => setHotels(parseHotels(null, dest)))
      .finally(() => setLoading(l => ({ ...l, hotels: false })));
  }, [dest.city]);

  useEffect(() => {
    axios.get(`${API_URL}/api/experiences`, { params: { city: dest.city, mood: moodId } })
      .then(res => setExperiences(parseExperiences(res.data, dest)))
      .catch(() => setExperiences(parseExperiences(null, dest)))
      .finally(() => setLoading(l => ({ ...l, experiences: false })));
  }, [dest.city, moodId]);

  const localFlights = parseFlights(null, dest, depCity);
  const localHotels = parseHotels(null, dest);
  const localExperiences = parseExperiences(null, dest);

  const rawFlights = flights || localFlights;
  const rawHotels = hotels || localHotels;
  const rawExperiences = experiences || localExperiences;

  const sortedFlights = [...rawFlights];
  if (preferences.flight === 'Cheapest') sortedFlights.sort((a, b) => a.price - b.price);
  else if (preferences.flight === 'Fastest') sortedFlights.sort((a, b) => parseInt(a.dur) - parseInt(b.dur));

  const currentFlight = sortedFlights[selFlight] || sortedFlights[0];
  const currentHotel = rawHotels[selStay] || rawHotels[0];

  const flightTotal = (currentFlight?.price || 5100) * 2;
  const stayTotal = (currentHotel?.basePrice || 5000) * 4;
  const expTotal = selExps.reduce((acc, i) => acc + (rawExperiences[i]?.price || 2500), 0) * 2;
  const total = flightTotal + stayTotal + expTotal;

  const recFlightIdx = sortedFlights.reduce((best, f, i, arr) => f.price < arr[best].price ? i : best, 0);
  const recStayIdx = rawHotels.reduce((best, h, i, arr) => parseFloat(h.rate) > parseFloat(arr[best].rate) ? i : best, 0);

  const handleConfirm = async () => {
    const newBooking = {
      ...booking,
      mood: moodId,
      city: dest.city,
      tier: preferences.budget || 'balanced',
      dates: 'Next month',
      guests: 2,
      stay: currentHotel?.name,
      flight: currentFlight,
      attractions: selExps.map(i => rawExperiences[i]?.name).filter(Boolean),
      nights: 4,
      total,
      flightTotal,
      stayTotal,
      expTotal,
    };
    setBooking(newBooking);
    setBookingFinal(null);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`${API_URL}/api/bookings`, newBooking, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.data.reference) setBookingRef(res.data.reference);
      if (res.data._id) setBookingId(res.data._id);
      navigate('/confirmation');
    } catch (err) {
      console.error('Booking POST error:', err);
      // Fallback for demo when backend is down
      const fakeRef = 'VB-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + new Date().getFullYear();
      setBookingRef(fakeRef);
      navigate('/confirmation');
    }
  };

  const handleSelectOption = (type, index) => {
    if (type === 'flights') {
      setSelFlight(index);
      setViewMoreType(null);
    } else if (type === 'hotels') {
      setSelStay(index);
      setViewMoreType(null);
    } else if (type === 'experiences') {
      setSelExps(prev => {
        if (prev.includes(index)) {
          if (prev.length === 1) return prev; // Keep at least one
          return prev.filter(i => i !== index);
        }
        return [...prev, index];
      });
    }
  };

  const getModalOptions = () => {
    if (viewMoreType === 'flights') return sortedFlights.map((f, i) => ({
      title: `${f.al} · ${f.from} to ${f.to}`,
      detail: `${f.dep} - ${f.arr} · ${f.dur} · ${f.stops === 0 ? 'Non-stop' : f.stops + ' stop'}`,
      price: `Rs.${(f.price || 0).toLocaleString('en-IN')}`,
      selected: i === selFlight,
      index: i,
    }));
    if (viewMoreType === 'hotels') return rawHotels.map((h, i) => ({
      title: h.name,
      detail: `${h.loc} · ${h.amen} · Rating: ${h.rate}`,
      price: `Rs.${(h.basePrice || 0).toLocaleString('en-IN')}/night`,
      selected: i === selStay,
      index: i,
    }));
    if (viewMoreType === 'experiences') return rawExperiences.map((e, i) => ({
      title: e.name,
      detail: e.desc,
      price: `Rs.${(e.price || 0).toLocaleString('en-IN')}/person`,
      selected: selExps.includes(i),
      index: i,
    }));
    return [];
  };

  const isLoading = loading.flights || loading.hotels || loading.experiences;

  return (
    <div className="bk-root">

      {/* HERO */}
      <div className="bk-hero">
        <div className="bk-hero-bg" style={{ backgroundImage: `url(${dest.img})` }} />
        <div className="bk-hero-ov" />
        <div className="bk-hero-content">
          <button className="bk-back-btn" onClick={() => navigate(`/destination?mood=${moodId}&city=${encodeURIComponent(dest.city)}`)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to {dest.city}
          </button>
          <div className="bk-hero-eyebrow">VEE's Journey Plan</div>
          <h1 className="bk-hero-title">{dest.city}</h1>
          <p className="bk-hero-sub">Curated for your <em>{vibe.name}</em> mood</p>
          <div className="bk-hero-tags">
            <span className="bk-hero-tag">{dest.duration}</span>
            <span className="bk-hero-tag">★ {dest.r}</span>
            <span className="bk-hero-tag bk-hero-tag--accent">{dest.match}% match</span>
          </div>
        </div>
      </div>

      {/* LAYOUT */}
      <div className="bk-layout">

        {/* LEFT */}
        <div className="bk-left">
          <p className="bk-section-eyebrow">✦ Customize your journey</p>

          {/* FLIGHT CARD */}
          <div className="bk-card">
            <div className="bk-card-top">
              <div className="bk-card-icon-circle bk-card-icon-circle--flight">✈</div>
              <div className="bk-card-top-info" style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingRight: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="bk-card-category">Flight</div>
                  <div className="bk-location-override" style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    <select 
                      value={depCity.code} 
                      onChange={(e) => {
                        const selected = MAJOR_CITIES.find(c => c.code === e.target.value);
                        if (selected) {
                          setDepCity(selected);
                          setLocationStatus(`Flights from ${selected.name} (${selected.code})`);
                        }
                      }}
                      style={{ background: 'transparent', border: '1px solid var(--card-border)', color: 'inherit', borderRadius: '4px', padding: '2px 4px', cursor: 'pointer', outline: 'none' }}
                    >
                      {MAJOR_CITIES.map(c => (
                        <option key={c.code} value={c.code} style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>{c.name} ({c.code})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="bk-card-name" style={{ marginTop: '4px' }}>
                  {loading.flights ? locationStatus : `${currentFlight?.al} · ${currentFlight?.from} → ${currentFlight?.to}`}
                </div>
                {!loading.flights && <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>{locationStatus}</div>}
              </div>
              {!loading.flights && selFlight === recFlightIdx && <span className="bk-vee-badge">✦ VEE Pick</span>}
            </div>
            {loading.flights ? <SkeletonRow /> : (
              <div className="bk-card-body">
                <div className="bk-meta-grid">
                  <div className="bk-meta-item">
                    <span className="bk-meta-label">Departure</span>
                    <span className="bk-meta-val">{currentFlight?.dep}</span>
                  </div>
                  <div className="bk-meta-item">
                    <span className="bk-meta-label">Arrival</span>
                    <span className="bk-meta-val">{currentFlight?.arr}</span>
                  </div>
                  <div className="bk-meta-item">
                    <span className="bk-meta-label">Duration</span>
                    <span className="bk-meta-val">{currentFlight?.dur}</span>
                  </div>
                  <div className="bk-meta-item">
                    <span className="bk-meta-label">Stops</span>
                    <span className="bk-meta-val">{currentFlight?.stops === 0 ? 'Non-stop' : `${currentFlight?.stops} stop`}</span>
                  </div>
                </div>
                <div className="bk-card-foot">
                  <div>
                    <span className="bk-price">Rs.{(currentFlight?.price || 0).toLocaleString('en-IN')}</span>
                    <span className="bk-price-sub"> / person</span>
                  </div>
                  <button className="bk-switch-btn" onClick={() => setViewMoreType('flights')}>
                    View All Flights →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* HOTEL CARD */}
          <div className="bk-card">
            <div className="bk-card-top">
              <div className="bk-card-thumb">
                {!loading.hotels && <img src={currentHotel?.img || dest.img} alt={currentHotel?.name} />}
              </div>
              <div className="bk-card-top-info">
                <div className="bk-card-category">Stay</div>
                <div className="bk-card-name">
                  {loading.hotels ? 'Finding best stays…' : currentHotel?.name}
                </div>
              </div>
              {!loading.hotels && selStay === recStayIdx && <span className="bk-vee-badge">✦ VEE Pick</span>}
            </div>
            {loading.hotels ? <SkeletonRow /> : (
              <div className="bk-card-body">
                <div className="bk-meta-grid">
                  <div className="bk-meta-item">
                    <span className="bk-meta-label">Location</span>
                    <span className="bk-meta-val">{currentHotel?.loc}</span>
                  </div>
                  <div className="bk-meta-item">
                    <span className="bk-meta-label">Rating</span>
                    <span className="bk-meta-val">★ {currentHotel?.rate}</span>
                  </div>
                  <div className="bk-meta-item" style={{ gridColumn: 'span 2' }}>
                    <span className="bk-meta-label">Amenities</span>
                    <span className="bk-meta-val">{currentHotel?.amen}</span>
                  </div>
                </div>
                <div className="bk-card-foot">
                  <div>
                    <span className="bk-price">Rs.{(currentHotel?.basePrice || 0).toLocaleString('en-IN')}</span>
                    <span className="bk-price-sub"> / night</span>
                  </div>
                  <button className="bk-switch-btn" onClick={() => setViewMoreType('hotels')}>
                    View All Stays →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* EXPERIENCE CARD */}
          <div className="bk-card">
            <div className="bk-card-top">
              <div className="bk-card-thumb">
                {!loading.experiences && <img src={rawExperiences[selExps[0]]?.img || dest.img} alt={rawExperiences[selExps[0]]?.name} />}
              </div>
              <div className="bk-card-top-info">
                <div className="bk-card-category">{selExps.length > 1 ? 'Experiences' : 'Experience'}</div>
                <div className="bk-card-name">
                  {loading.experiences ? 'Finding experiences…' : selExps.length > 1 ? `${selExps.length} Experiences Selected` : rawExperiences[selExps[0]]?.name}
                </div>
              </div>
              <span className="bk-vee-badge bk-vee-badge--mood">{vibe.name}</span>
            </div>
            {loading.experiences ? <SkeletonRow /> : (
              <div className="bk-card-body">
                <div className="bk-exp-desc" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selExps.length > 1 
                    ? selExps.map(i => <span key={i}>• {rawExperiences[i]?.name}</span>)
                    : <span>{rawExperiences[selExps[0]]?.desc}</span>}
                </div>
                <div className="bk-card-foot">
                  <div>
                    <span className="bk-price">Rs.{(expTotal / 2).toLocaleString('en-IN')}</span>
                    <span className="bk-price-sub"> / person</span>
                  </div>
                  <button className="bk-switch-btn" onClick={() => setViewMoreType('experiences')}>
                    View All Experiences →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: SUMMARY */}
        <aside className="bk-summary">
          <div className="bk-summary-card">
            <div className="bk-summary-img" style={{ backgroundImage: `url(${dest.img})` }} />
            <div className="bk-summary-body">
              <div className="bk-summary-eyebrow">Journey Summary</div>
              <div className="bk-summary-city">{dest.city}</div>
              <div className="bk-summary-mood">{vibe.name} · {dest.duration}</div>

              <div className="bk-summary-lines">
                <div className="bk-summary-line">
                  <span className="bk-summary-icon">✈</span>
                  <div className="bk-summary-info">
                    <span className="bk-summary-name">{loading.flights ? '—' : currentFlight?.al}</span>
                    <span className="bk-summary-sub">2 passengers</span>
                  </div>
                  <span className="bk-summary-amt">Rs.{flightTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="bk-summary-line">
                  <span className="bk-summary-icon">🏨</span>
                  <div className="bk-summary-info">
                    <span className="bk-summary-name">{loading.hotels ? '—' : currentHotel?.name}</span>
                    <span className="bk-summary-sub">4 nights</span>
                  </div>
                  <span className="bk-summary-amt">Rs.{stayTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="bk-summary-line">
                  <span className="bk-summary-icon">🎒</span>
                  <div className="bk-summary-info">
                    <span className="bk-summary-name">{loading.experiences ? '—' : selExps.length > 1 ? `${selExps.length} Experiences` : rawExperiences[selExps[0]]?.name}</span>
                    <span className="bk-summary-sub">2 persons</span>
                  </div>
                  <span className="bk-summary-amt">Rs.{expTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="bk-total-row">
                <span>Total Estimate</span>
                <span className="bk-total-val">Rs.{total.toLocaleString('en-IN')}</span>
              </div>

              {(preferences.budget || preferences.stay || preferences.flight) && (
                <div className="bk-prefs-row">
                  {preferences.budget && <span className="bk-pref-tag">💰 {preferences.budget}</span>}
                  {preferences.stay && <span className="bk-pref-tag">🏠 {preferences.stay}</span>}
                  {preferences.flight && <span className="bk-pref-tag">✈ {preferences.flight}</span>}
                </div>
              )}

              <button className="bk-confirm-btn" onClick={handleConfirm} disabled={isLoading}>
                {isLoading ? 'Loading options…' : 'Confirm Journey →'}
              </button>

              <p className="bk-disclaimer">
                ✦ Prices are estimates. Final amount confirmed at checkout.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* MODAL */}
      <div className={`modal-overlay ${viewMoreType ? 'show' : ''}`}>
        <div className="modal-backdrop" onClick={() => setViewMoreType(null)} />
        <div className="modal-panel">
          <button className="modal-close" onClick={() => setViewMoreType(null)}>✕</button>
          <h2 className="modal-title">
            {viewMoreType === 'flights' ? '✈ Available Flights' :
             viewMoreType === 'hotels' ? '🏨 Available Stays' : '🎒 Available Experiences'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '1.2rem', lineHeight: 1.6 }}>
            {viewMoreType === 'experiences' ? 'Select one or more experiences to add to your journey.' : 'Select your preferred option. VEE\'s recommendation is highlighted.'}
          </p>
          <div className="jb-modal-list">
            {getModalOptions().map(opt => (
              <div
                key={opt.index}
                className={`jb-modal-option ${opt.selected ? 'selected' : ''}`}
                onClick={() => handleSelectOption(viewMoreType, opt.index)}
              >
                <div className="jb-modal-option-info">
                  <div className="jb-modal-option-title">{opt.title}</div>
                  <div className="jb-modal-option-detail">{opt.detail}</div>
                </div>
                <span className="jb-modal-option-price">{opt.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <VeeAssistant pageKey="bookings" showToast={showToast} />
    </div>
  );
}
