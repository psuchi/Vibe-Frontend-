import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getVibe, VIBES } from '../data/vibes';
import { useVibe } from '../context/VibeContext';
import VeeAssistant from '../components/VeeAssistant';

export default function VibesPage({ showToast }) {
  useScrollReveal();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCurrentMood } = useVibe();

  const moodId = searchParams.get('mood') || 'calm';
  const vibe = getVibe(moodId);

  useEffect(() => {
    setCurrentMood(moodId);
    document.title = `${vibe.name} — Vibe`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [moodId, vibe, setCurrentMood]);

  const [filters, setFilters] = useState({ budget: 'any', duration: 'any', companion: 'any', style: 'any', season: 'any', weather: 'any' });

  const durationNights = (d) => parseInt(d) || 3;
  const budgetNum = (b) => parseInt(b.replace(/[₹,]/g,'')) || 0;

  const passFilters = (d) => {
    if (filters.budget !== 'any') {
      const n = budgetNum(d.budget);
      if (filters.budget === 'low' && n >= 50000) return false;
      if (filters.budget === 'mid' && (n < 50000 || n > 100000)) return false;
      if (filters.budget === 'high' && n <= 100000) return false;
    }
    if (filters.duration !== 'any') {
      const n = durationNights(d.duration);
      if (filters.duration === 'short' && n > 3) return false;
      if (filters.duration === 'mid' && (n < 4 || n > 5)) return false;
      if (filters.duration === 'long' && n < 6) return false;
    }
    if (filters.weather !== 'any') {
      const cool = /1[0-9]°C|[0-9]°C/.test(d.weather) && parseInt(d.weather) < 20;
      if (filters.weather === 'cool' && !cool) return false;
      if (filters.weather === 'warm' && cool) return false;
    }
    if (filters.companion !== 'any' && (!d.companion || !d.companion.includes(filters.companion))) return false;
    if (filters.style !== 'any' && (!d.style || !d.style.includes(filters.style))) return false;
    if (filters.season === 'now' && !d.availableNow) return false;
    return true;
  };

  const shownDests = vibe.dests.filter(passFilters);

  const resetFilters = () => {
    setFilters({ budget: 'any', duration: 'any', companion: 'any', style: 'any', season: 'any', weather: 'any' });
  };

  const handleFilterClick = (group, val) => {
    setFilters(prev => ({ ...prev, [group]: val }));
  };

  return (
    <main>
      {/* ── HERO ── */}
      <section className="v-hero">
        <div className="v-hero-bg" style={{ backgroundImage: `url('${vibe.heroImg}')` }}></div>
        <div className="v-hero-ov"></div>
        <div className="v-hero-content">
          <div>
            <span className="v-tag">{vibe.subtitle}</span>
            <h1 className="v-title">{vibe.name}</h1>
            <p className="v-sub">{vibe.desc}</p>
          </div>
          <div className="v-ambient">
            <img src={vibe.dests[0].img} alt="" />
          </div>
        </div>
      </section>

      {/* ── MOOD SWITCHER ── */}
      <div className="v-mood-switch">
        {VIBES.map(v => (
          <button
            key={v.id}
            className={`v-mood-pill ${v.id === moodId ? 'on' : ''}`}
            onClick={() => navigate(`/vibes?mood=${v.id}`)}
          >
            {v.name}
          </button>
        ))}
      </div>

      {/* ── DESTINATIONS + FILTERS ── */}
      <div className="v-layout">
        <div>
          <div className="v-results-h">
            <h2 className="sec-title v-results-h2">Recommended for you</h2>
            <span className="v-count">{shownDests.length} of {vibe.dests.length} destinations</span>
          </div>
          <div className="dest-list">
            {shownDests.length > 0 ? shownDests.map(d => (
              <div key={d.city} className="dcard-row" onClick={() => navigate(`/destination?mood=${moodId}&city=${encodeURIComponent(d.city)}`)}>
                <div className="dcard-row-img">
                  <img src={d.img} alt={d.city} />
                  <span className="dcard-row-match">{d.match}% match</span>
                </div>
                <div className="dcard-row-body">
                  <div className="dcard-row-top">
                    <div>
                      <div className="dcard-row-city">{d.city}</div>
                      <div className="dcard-row-country">{d.country}</div>
                    </div>
                    <div className="dcard-row-rating">★ {d.r}</div>
                  </div>
                  <p className="dcard-row-desc">{d.story}</p>
                  <div className="dcard-row-meta">
                    <span>{d.budget}</span><span>{d.duration}</span><span>{d.weather}</span>
                  </div>
                </div>
              </div>
            )) : (
              <p className="empty-state">
                No destinations match these filters.
                <button className="f-reset f-reset-inline" onClick={resetFilters}>Reset</button>
              </p>
            )}
          </div>
        </div>

        {/* ── FILTER PANEL ── */}
        <aside className="filter-panel">
          <div className="filter-h">Filter</div>

          <div className="f-group">
            <span className="f-label">Budget</span>
            <div className="f-pills">
              {['any', 'low', 'mid', 'high'].map(val => (
                <button key={val} className={`f-pill ${filters.budget === val ? 'on' : ''}`} onClick={() => handleFilterClick('budget', val)}>
                  {val === 'any' ? 'Any' : val === 'low' ? 'Under ₹50k' : val === 'mid' ? '₹50k–₹1L' : '₹1L+'}
                </button>
              ))}
            </div>
          </div>

          <div className="f-group">
            <span className="f-label">Duration</span>
            <div className="f-pills">
              {['any', 'short', 'mid', 'long'].map(val => (
                <button key={val} className={`f-pill ${filters.duration === val ? 'on' : ''}`} onClick={() => handleFilterClick('duration', val)}>
                  {val === 'any' ? 'Any' : val === 'short' ? 'Weekend' : val === 'mid' ? '4–5 nights' : '6+ nights'}
                </button>
              ))}
            </div>
          </div>

          <div className="f-group">
            <span className="f-label">Companion</span>
            <div className="f-pills">
              {['any', 'solo', 'partner', 'group'].map(val => (
                <button key={val} className={`f-pill ${filters.companion === val ? 'on' : ''}`} onClick={() => handleFilterClick('companion', val)}>
                  {val.charAt(0).toUpperCase() + val.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="f-group">
            <span className="f-label">Travel Style</span>
            <div className="f-pills">
              {['any', 'slow', 'active', 'luxury'].map(val => (
                <button key={val} className={`f-pill ${filters.style === val ? 'on' : ''}`} onClick={() => handleFilterClick('style', val)}>
                  {val.charAt(0).toUpperCase() + val.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button className="f-reset" onClick={resetFilters}>Reset filters</button>
        </aside>
      </div>

      {/* ── VEE CTA ── */}
      <div className="v-ask-vee sr v-ask-vee-wrap">
        <div>
          <h2 className="v-ask-vee-title">Still unable to find your destination?</h2>
          <p className="v-ask-vee-sub">Let VEE help you narrow it down based on what you're really craving right now.</p>
        </div>
        <button className="btn-white" onClick={() => document.querySelector('.vee-orb')?.click()}>Let VEE help ✦</button>
      </div>

      <VeeAssistant pageKey="vibes" showToast={showToast} />
    </main>
  );
}
