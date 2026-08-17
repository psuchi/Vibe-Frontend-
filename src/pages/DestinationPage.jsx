import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getVibe, getImages } from '../data/vibes';
import { getParallaxImage } from '../data/parallaxMapping';
import { useVibe } from '../context/VibeContext';
import VeeAssistant from '../components/VeeAssistant';
import LeafletMap from '../components/LeafletMap';
import Reveal from '../components/Reveal';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import placeholder1 from '../assets/destinations/spiti-valley-img.webp';
import placeholder2 from '../assets/destinations/munnar-img.webp';
import placeholder3 from '../assets/destinations/coorg-img.webp';
import placeholder4 from '../assets/destinations/rishikesh-img.webp';

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
  'Munnar': [10.0889, 77.0595],
  'Gokarna': [14.5500, 74.3181],
  'Tawang': [27.5855, 91.8617],
  'Gulmarg': [34.0484, 74.3805],
  'Auli': [30.5317, 79.5668],
  'Bir Billing': [32.0463, 76.7126],
  'Madurai': [9.9252, 78.1198],
  'Amritsar': [31.6340, 74.8723],
  'Konark': [19.8910, 86.0963],
  'Chandigarh': [30.7333, 76.7794],
  'Auroville': [12.0069, 79.8106],
  'Mumbai': [19.0760, 72.8777],
  'Kochi': [9.9312, 76.2673],
  'Gurugram': [28.4595, 77.0266],
  'Kolkata': [22.5726, 88.3639],
  'Jodhpur': [26.2389, 73.0243],
  'Lucknow': [26.8467, 80.9462],
  'Mysore': [12.2958, 76.6394],
};

/* ── HELPER: Vibe Check trait derivation ── */
const STYLE_TRAITS = {
  slow:      { icon: '🌿', label: 'SLOW TRAVEL',  desc: 'No agenda, just flow',        score: 90 },
  luxury:    { icon: '✦',  label: 'LUXURY',        desc: 'Premium comfort awaits',       score: 85 },
  adventure: { icon: '🏔', label: 'ADVENTURE',     desc: 'Thrills at every turn',        score: 88 },
  culture:   { icon: '🏛', label: 'CULTURE',       desc: 'Living history & art',         score: 87 },
  nature:    { icon: '🌱', label: 'NATURE',        desc: 'Immersed in the wild',         score: 92 },
  budget:    { icon: '💎', label: 'VALUE TRAVEL',  desc: 'Smart spend, rich memories',   score: 82 },
  spiritual: { icon: '🕉', label: 'SPIRITUAL',     desc: 'Inner journey begins',         score: 91 },
  offbeat:   { icon: '🗺', label: 'OFFBEAT',       desc: 'The road less travelled',      score: 89 },
};

const COMPANION_TRAITS = {
  solo:    { icon: '🧭', label: 'SOLO FRIENDLY', desc: 'Find yourself here',         score: 88 },
  partner: { icon: '💕', label: 'ROMANTIC',      desc: 'Made for two',                score: 92 },
  family:  { icon: '🏡', label: 'FAMILY',        desc: 'Joy for every generation',    score: 85 },
  friends: { icon: '🎉', label: 'SOCIAL',        desc: "Memories you'll keep",        score: 89 },
};

const FALLBACK_TRAITS = [
  { icon: '📸', label: 'PHOTOGENIC',  desc: 'Every corner is a frame',    score: 89 },
  { icon: '🍽', label: 'LOCAL FOOD', desc: 'Authentic flavours await',    score: 87 },
  { icon: '🛤', label: 'WALKABLE',   desc: 'Best explored on foot',      score: 84 },
  { icon: '🎨', label: 'ARTISTIC',   desc: 'Creative energy everywhere', score: 86 },
];

function getWeatherTrait(weather) {
  const w = (weather || '').toLowerCase();
  if (w.includes('pleasant'))             return { icon: '☀️', label: 'GREAT WEATHER',    desc: 'Perfect outdoor conditions', score: 88 };
  if (w.includes('cool') || w.includes('crisp')) return { icon: '🌬', label: 'COOL CLIMATE', desc: 'Refreshingly crisp',         score: 85 };
  if (w.includes('warm'))                 return { icon: '🌅', label: 'WARM VIBES',       desc: 'Golden hours daily',         score: 87 };
  if (w.includes('cold') || w.includes('snow')) return { icon: '❄️', label: 'CRISP AIR',  desc: 'Invigorating cold',          score: 80 };
  if (w.includes('foggy') || w.includes('mist')) return { icon: '🌫', label: 'MISTY MORNINGS', desc: 'Atmospheric & moody',   score: 82 };
  if (w.includes('humid'))                return { icon: '🌿', label: 'LUSH CLIMATE',    desc: 'Vibrant & tropical',         score: 84 };
  return { icon: '🌤', label: 'MILD WEATHER', desc: 'Comfortable & clear', score: 86 };
}

function getVibeCheckTraits(dest) {
  const traits = [];
  const seen = new Set();
  for (const s of (dest.style || [])) {
    if (STYLE_TRAITS[s] && !seen.has(`s_${s}`)) {
      traits.push({ ...STYLE_TRAITS[s] });
      seen.add(`s_${s}`);
    }
  }
  for (const c of (dest.companion || [])) {
    if (COMPANION_TRAITS[c] && !seen.has(`c_${c}`)) {
      traits.push({ ...COMPANION_TRAITS[c] });
      seen.add(`c_${c}`);
    }
  }
  if (traits.length < 4 && !seen.has('weather')) {
    traits.push(getWeatherTrait(dest.weather));
    seen.add('weather');
  }
  let fi = 0;
  while (traits.length < 4 && fi < FALLBACK_TRAITS.length) {
    traits.push({ ...FALLBACK_TRAITS[fi] });
    fi++;
  }
  return traits.slice(0, 4);
}

function getVibeTags(dest) {
  const styleLabels = {
    slow: 'Relaxed', luxury: 'Luxury', adventure: 'Adventure',
    culture: 'Culture', nature: 'Nature', budget: 'Value',
    spiritual: 'Spiritual', offbeat: 'Offbeat',
  };
  const compLabels = { solo: 'Solo', partner: 'Romantic', family: 'Family', friends: 'Social' };
  const tags = [];
  const seen = new Set();
  for (const s of (dest.style || []))
    if (styleLabels[s] && !seen.has(styleLabels[s])) { tags.push(styleLabels[s]); seen.add(styleLabels[s]); }
  for (const c of (dest.companion || []))
    if (compLabels[c] && !seen.has(compLabels[c])) { tags.push(compLabels[c]); seen.add(compLabels[c]); }
  return tags.slice(0, 4);
}

function getVeeRecommendation(dest, vibe) {
  const styleDesc = {
    slow: 'slow, restorative travel', luxury: 'premium comfort and refinement',
    adventure: 'thrill and exploration', culture: 'cultural depth and living history',
    nature: 'deep nature immersion', budget: 'incredible value travel',
    spiritual: 'spiritual depth and reflection', offbeat: 'the road less travelled',
  };
  const compDesc = {
    solo: 'solo travellers', partner: 'couples seeking something special',
    family: 'families', friends: 'friends chasing good times',
  };
  const styles = (dest.style || []).map(s => styleDesc[s]).filter(Boolean);
  const comps  = (dest.companion || []).map(c => compDesc[c]).filter(Boolean);
  if (styles.length && comps.length)
    return `A perfect blend of ${styles.join(' & ')} — ideal for ${comps[0]}.`;
  if (styles.length)
    return `VEE recommends ${dest.city} for ${styles[0]}. A curated experience that stays with you.`;
  if (comps.length)
    return `Handpicked by VEE for ${comps[0]}. ${dest.city} has everything to make it unforgettable.`;
  return `VEE has personally selected ${dest.city} — a destination that perfectly matches your ${vibe.name} mood.`;
}

function getWeatherDesc(dest) {
  const w = (dest.weather || '').toLowerCase();
  if (w.includes('pleasant'))               return 'Ideal for outdoor exploration';
  if (w.includes('cool') || w.includes('crisp')) return 'Refreshingly crisp air';
  if (w.includes('warm'))                   return 'Sun-kissed days await';
  if (w.includes('cold') || w.includes('snow'))  return 'Layer up for the adventure';
  if (w.includes('foggy') || w.includes('mist'))  return 'Moody & atmospheric skies';
  return 'Comfortable conditions';
}

function getBestTimeDesc(dest) {
  const b = (dest.best || '').toLowerCase();
  if (/oct|nov|dec|jan|feb|mar/.test(b)) return 'Perfect weather & festivals';
  if (/apr|may|jun/.test(b))             return 'Pre-monsoon at its best';
  if (/jul|aug|sep/.test(b))             return 'Monsoon magic season';
  return 'Peak season for this mood';
}

function getVibeLabel(dest) {
  const styleMap = {
    slow: 'Slow', luxury: 'Luxury', adventure: 'Wild',
    culture: 'Cultural', nature: 'Natural', spiritual: 'Sacred',
    budget: 'Value', offbeat: 'Offbeat',
  };
  const compMap = { solo: 'Solo', partner: 'Romantic', family: 'Family', friends: 'Social' };
  const parts = [
    ...(dest.style || []).map(s => styleMap[s]),
    ...(dest.companion || []).map(c => compMap[c]),
  ].filter(Boolean).slice(0, 3);
  return parts.length ? parts.join(' · ') : 'Authentic · Curated';
}

function getVibeSubLabel(dest) {
  const w = (dest.weather || '').toLowerCase();
  if (w.includes('pleasant'))               return 'Slow-paced & soulful';
  if (w.includes('cool') || w.includes('cold')) return 'Quiet & contemplative';
  if (w.includes('warm'))                   return 'Vibrant & energetic';
  return 'Curated by VEE';
}

function getVeeQuote(dest) {
  // Choose the sentence closest to ~80 chars — evocative but not too long or short
  const sentences = dest.story.split(/\./).map(s => s.trim()).filter(s => s.length > 15);
  if (!sentences.length) return dest.story;
  const sorted = [...sentences].sort((a, b) => Math.abs(a.length - 80) - Math.abs(b.length - 80));
  return sorted[0] + '.';
}

function getThreePicks(dest) {
  const exps = (dest.experiences || []).slice(0, 3).map(e => ({
    name: e.name, desc: e.desc, img: e.img,
  }));
  // Pad with hotels if fewer than 3 experiences
  if (exps.length < 3) {
    const hotelPicks = (dest.hotels || []).slice(0, 3 - exps.length).map(h => ({
      name: h.name, desc: h.amen, img: h.img,
    }));
    exps.push(...hotelPicks);
  }
  return exps.slice(0, 3);
}

export default function DestinationPage({ showToast }) {
  useScrollReveal();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCurrentMood, setBooking, preferences, setPreferences } = useVibe();

  const [lightboxImg, setLightboxImg] = useState(null);
  const [showPrefs, setShowPrefs] = useState(false);
  const [localPrefs, setLocalPrefs] = useState({ budget: null, stay: null, flight: null });
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const galleryRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const heroY = useTransform(scrollY, [0, 1000], [0, prefersReducedMotion ? 0 : 250]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const moodId = searchParams.get('mood') || 'calm';
  const vibe = getVibe(moodId);
  const city = searchParams.get('city');
  let dest = vibe.dests.find(d => d.city === city);
  if (!dest) {
    dest = vibe.dests[0];
  }

  useEffect(() => {
    setCurrentMood(moodId);
    document.title = `${dest.city} — Vibe`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [moodId, dest, setCurrentMood]);

  // Weather
  useEffect(() => {
    setWeatherLoading(true);
    axios.get(`${API_URL}/api/weather?city=${encodeURIComponent(dest.city)}`)
      .then(res => setWeather(res.data))
      .catch(() => setWeather({ temp: '--', desc: dest.weather, icon: '01d' }))
      .finally(() => setWeatherLoading(false));
  }, [dest.city, API_URL]);

  // Sync local prefs from context
  useEffect(() => {
    setLocalPrefs({ ...preferences });
  }, [preferences]);

  const destImages = getImages(dest.city) || [];
  const destImg = dest.img; // Use the main destination card image for the story section
  const parallaxImg = getParallaxImage(dest.city);

  // Build gallery images using only the dedicated gallery images
  const galleryImgs = [...destImages];
  
  // Pad to 5 with placeholders if necessary
  const placeholders = [
    placeholder1,
    placeholder2,
    placeholder3,
    placeholder4,
  ];
  while (galleryImgs.length < 5) {
    galleryImgs.push(placeholders[galleryImgs.length % placeholders.length]);
  }

  const handleApplyPrefs = () => {
    setPreferences(localPrefs);
    setShowPrefs(false);
    showToast('Preferences applied ✦');
  };

  const handleViewJourney = () => {
    setBooking({
      mood: moodId,
      city: dest.city,
    });
    navigate('/itinerary');
  };

    return (
    <div className="dp-root">

      {/* ── CINEMATIC HERO ── */}
      <section className="dp-hero">
        <motion.div style={{ y: heroY, position: 'absolute', top: '-250px', bottom: '-250px', left: 0, right: 0, zIndex: 0 }}>
          <div className="dp-hero-bg" style={{ backgroundImage: `url(${parallaxImg})` }} />
        </motion.div>
        <div className="dp-hero-ov" style={{ zIndex: 1 }} />

        <button className="dp-back" onClick={() => navigate(`/vibes?mood=${moodId}`)} style={{ zIndex: 2 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to {vibe.name}
        </button>

        <div className="dp-hero-body" style={{ zIndex: 2 }}>
          <span className="dp-vibe-pill">{vibe.name}</span>
          <h1 className="dp-hero-city">{dest.city}</h1>
          <p className="dp-hero-country">{dest.country}</p>
          <div className="dp-hero-pills">
            <span className="dp-hero-pill">★ {dest.r}</span>
            <span className="dp-hero-pill">{dest.duration}</span>
            <span className="dp-hero-pill dp-hero-pill--accent">{dest.match}% match</span>
            {!weatherLoading && weather && (
              <span className="dp-hero-pill">🌤 {weather.temp}°C</span>
            )}
          </div>
        </div>

        <div className="dp-scroll-cue">
          <span>Scroll to explore</span>
          <div className="dp-scroll-line" />
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <Reveal>
        <div className="dp-stats-band">
          <div className="dp-stat">
            <span className="dp-stat-value">{dest.match}%</span>
            <span className="dp-stat-label">Mood Match</span>
          </div>
          <div className="dp-stat-div" />
          <div className="dp-stat">
            <span className="dp-stat-value">{dest.r}</span>
            <span className="dp-stat-label">Traveler Rating</span>
          </div>
          <div className="dp-stat-div" />
          <div className="dp-stat">
            <span className="dp-stat-value">{dest.duration}</span>
            <span className="dp-stat-label">Ideal Stay</span>
          </div>
          <div className="dp-stat-div" />
          <div className="dp-stat">
            <span className="dp-stat-value">{dest.budget}</span>
            <span className="dp-stat-label">Budget Level</span>
          </div>
        </div>
      </Reveal>

      {/* ── EDITORIAL STORY (ds-) ── */}
      <Reveal>
        <section className="ds-section" id="destStory">

          {/* ── Top split: left text / right image card ── */}
          <div className="ds-grid">

            {/* LEFT: Story text + quote */}
            <div className="ds-left">
              <span className="dp-eyebrow">✦ The Story</span>
              <h2 className="ds-headline">Why <em>{dest.city}</em>?</h2>
              <div className="ds-divider" />
              <p className="ds-body">{dest.story}</p>
              <div className="ds-vee-take">
                <span className="ds-vee-take-mark">“</span>
                <em>{getVeeQuote(dest)}</em>
                <span className="ds-vee-take-attr">— VEE's Take</span>
              </div>
            </div>

            {/* RIGHT: Immersive image card with VEE recommendation */}
            <div className="ds-right">
              <div className="ds-image-card">
                <img src={destImg} alt={dest.city} className="ds-image" loading="lazy" />

                {/* VEE's Pick badge */}
                <div className="ds-pick-badge">
                  <span>♥</span> VEE'S PICK
                </div>

                {/* Recommendation overlay (bottom gradient) */}
                <div className="ds-rec-overlay">
                  <div className="ds-rec-content">
                    <p className="ds-rec-label">VEE RECOMMENDS ✨</p>
                    <p className="ds-rec-text">{getVeeRecommendation(dest, vibe)}</p>
                    <div className="ds-vibe-tags-wrap">
                      {getVibeTags(dest).map((tag, i) => (
                        <span key={i} className="ds-vibe-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Info row: Weather · Best Time · The Vibe ── */}
          <div className="ds-info-row">
            <div className="ds-info-card">
              <span className="ds-info-icon-wrap">⛅</span>
              <div>
                <p className="ds-info-label">WEATHER</p>
                <p className="ds-info-value">{dest.weather}</p>
                <p className="ds-info-sub">{getWeatherDesc(dest)}</p>
              </div>
            </div>
            <div className="ds-info-card">
              <span className="ds-info-icon-wrap">📅</span>
              <div>
                <p className="ds-info-label">BEST TIME TO VISIT</p>
                <p className="ds-info-value">{dest.best}</p>
                <p className="ds-info-sub">{getBestTimeDesc(dest)}</p>
              </div>
            </div>
            <div className="ds-info-card">
              <span className="ds-info-icon-wrap">📍</span>
              <div>
                <p className="ds-info-label">THE VIBE</p>
                <p className="ds-info-value">{getVibeLabel(dest)}</p>
                <p className="ds-info-sub">{getVibeSubLabel(dest)}</p>
              </div>
            </div>
          </div>

          {/* ── Bottom: Vibe Check + 3 Picks ── */}
          <div className="ds-bottom-row">

            {/* VEE'S VIBE CHECK */}
            <div className="ds-vibe-check">
              <span className="dp-eyebrow">✦ VEE's Vibe Check</span>
              <div className="ds-trait-grid">
                {getVibeCheckTraits(dest).map((trait, i) => (
                  <div key={i} className="ds-trait-card">
                    <span className="ds-trait-icon">{trait.icon}</span>
                    <p className="ds-trait-label">{trait.label}</p>
                    <div className="ds-trait-bar">
                      <div className="ds-trait-fill" style={{ width: `${trait.score}%` }} />
                    </div>
                    <p className="ds-trait-desc">{trait.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* VEE'S 3 PICKS FOR YOU */}
            <div className="ds-picks">
              <span className="dp-eyebrow">✦ VEE's 3 Picks For You</span>
              <div className="ds-picks-list">
                {getThreePicks(dest).map((pick, i) => (
                  <div key={i} className="ds-pick-item">
                    <span className="ds-pick-num">0{i + 1}</span>
                    {pick.img && (
                      <div className="ds-pick-img-wrap">
                        <img src={pick.img} alt={pick.name} className="ds-pick-img" loading="lazy" />
                      </div>
                    )}
                    <div className="ds-pick-info">
                      <p className="ds-pick-name">{pick.name}</p>
                      <p className="ds-pick-desc">{pick.desc}</p>
                    </div>
                    <span className="ds-pick-arrow">→</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </section>
      </Reveal>

      {/* ── HIGHLIGHTS ── */}
      <Reveal>
        <section className="dp-highlights">
          <span className="dp-eyebrow">✦ Experiences</span>
          <h2 className="dp-section-h2">What Awaits You</h2>
          <div className="dp-exp-grid">
            {(dest.experiences || []).map((a, i) => (
              <motion.div key={i} className="dp-exp-card" whileHover={{ y: -4, scale: 1.015 }}>
                <span className="dp-exp-icon">📍</span>
                <span>{a.name}</span>
              </motion.div>
            ))}
            {(dest.restaurants || []).map((r, i) => (
              <motion.div key={`r-${i}`} className="dp-exp-card" whileHover={{ y: -4, scale: 1.015 }}>
                <span className="dp-exp-icon">🍽</span>
                <span>{r}</span>
              </motion.div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── GALLERY ── */}
      <Reveal>
        <section className="dp-gallery-wrap">
          <div className="dp-gallery-head">
            <div>
              <span className="dp-eyebrow">✦ Gallery</span>
              <h2 className="dp-section-h2">Destination <em>in frames</em></h2>
            </div>
            <p className="dp-gallery-hint">Hover to pause · Click to expand</p>
          </div>
          <div className="dp-gallery-viewport" style={{ overflow: 'hidden', paddingRight: '5vw' }}>
            <div className="dp-gallery-track">
              {[...Array(2)].map((_, groupIndex) => (
                <div key={groupIndex} style={{ display: "flex", gap: "14px", paddingRight: "14px" }}>
                  {galleryImgs.slice(0, 5).map((src, i) => (
                    <div
                      key={i}
                      className={`dp-gallery-item${i === 0 ? ' dp-gallery-item--wide' : ''}`}
                      onClick={() => setLightboxImg(src)}
                    >
                      <img src={src} alt={`${dest.city} ${i + 1}`} draggable={false} loading="lazy" />
                      <div className="dp-gallery-ov"><span>⤢</span></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── MAP ── */}
      <Reveal>
        <section className="dp-split dp-split--single">
          <div className="dp-split-map">
            <span className="dp-eyebrow">✦ Location</span>
            <h2 className="dp-section-h2">Find it on the map</h2>
            <div className="dp-map-frame">
              <LeafletMap
                type="pin"
                center={CITY_COORDS[dest.city] || [20.5937, 78.9629]}
                zoom={CITY_COORDS[dest.city] ? 12 : 5}
              />
            </div>
            <div className="dp-map-chips">
              <span className="dp-map-chip">🌤 {dest.weather}</span>
              <span className="dp-map-chip">📅 Best: {dest.best}</span>
              <span className="dp-map-chip">💰 {dest.budgetRange}</span>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── CTA ── */}
      <Reveal>
        <section className="dp-cta">
          <div className="dp-cta-inner">
            <span className="dp-eyebrow dp-eyebrow--light">✦ Ready to Go?</span>
            <h2 className="dp-cta-title">Feel the <em>{vibe.name}</em> in {dest.city}</h2>
            <p className="dp-cta-sub">Your curated journey — flights, stay, and every experience — crafted by VEE, one click away.</p>
            <div className="dp-cta-btns">
              <button className="dp-btn-outline" onClick={() => setShowPrefs(true)}>
                ✦ Journey Preferences
              </button>
              <button className="dp-btn-primary" onClick={handleViewJourney}>
                Plan with VEE →
              </button>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── PREFERENCES MODAL ── */}
      <div className={`modal-overlay ${showPrefs ? 'show' : ''}`}>
        <div className="modal-backdrop" onClick={() => setShowPrefs(false)} />
        <div className="modal-panel" style={{ maxWidth: '480px' }}>
          <button className="modal-close" onClick={() => setShowPrefs(false)}>✕</button>
          <h2 className="modal-title">Journey Preferences</h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 'var(--space-lg)' }}>
            Personalize VEE's recommendations for your journey to {dest.city}.
          </p>
          {[
            { key: 'budget', label: 'Budget', opts: ['Budget', 'Mid-range', 'Luxury'] },
            { key: 'stay', label: 'Stay', opts: ['Hotel', 'Resort', 'Homestay'] },
            { key: 'flight', label: 'Flight Preference', opts: ['Cheapest', 'Best Value', 'Fastest'] },
          ].map(({ key, label, opts }) => (
            <div className="pref-group" key={key}>
              <span className="pref-label">{label}</span>
              <div className="pref-options">
                {opts.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setLocalPrefs({ ...localPrefs, [key]: opt })}
                    style={{
                      padding: '10px 20px', borderRadius: '999px', fontSize: '13px',
                      fontFamily: 'DM Sans, sans-serif', fontWeight: 500, cursor: 'pointer',
                      transition: 'all 0.25s',
                      border: `1.5px solid ${localPrefs[key] === opt ? 'var(--accent)' : 'var(--card-border)'}`,
                      background: localPrefs[key] === opt ? 'var(--accent)' : 'transparent',
                      color: localPrefs[key] === opt ? '#fff' : 'var(--text)',
                    }}
                  >{opt}</button>
                ))}
              </div>
            </div>
          ))}
          <button className="btn-fill w-full" style={{ marginTop: 'var(--space-md)' }} onClick={handleApplyPrefs}>
            Apply Preferences
          </button>
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div 
            className="lightbox show" 
            onClick={() => setLightboxImg(null)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <button className="lightbox-close">✕</button>
            <img className="lightbox-img" src={lightboxImg} alt="" onClick={e => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>

      <VeeAssistant pageKey="destination" showToast={showToast} />
    </div>
  );
}