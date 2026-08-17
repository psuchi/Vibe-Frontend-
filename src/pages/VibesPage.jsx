import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getVibe, VIBES } from '../data/vibes';
import { useVibe } from '../context/VibeContext';
import VeeAssistant from '../components/VeeAssistant';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Wallet, Clock, Users, Compass, ArrowRight, SlidersHorizontal } from 'lucide-react';
import Reveal from '../components/Reveal';

export default function VibesPage({ showToast }) {
  useScrollReveal();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCurrentMood } = useVibe();

  const moodId = searchParams.get('mood') || 'calm';
  const vibe = getVibe(moodId);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ budget: 'any', duration: 'any', companion: 'any', style: 'any' });
  const [selectedTabId, setSelectedTabId] = useState(null);

  useEffect(() => {
    setCurrentMood(moodId);
    document.title = `${vibe.name} — Vibe`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [moodId, vibe, setCurrentMood]);

  const durationNights = (d) => parseInt(d) || 3;
  const budgetNum = (b) => parseInt(b.replace(/[₹,]/g, '')) || 0;

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
    if (filters.companion !== 'any' && (!d.companion || !d.companion.includes(filters.companion))) return false;
    if (filters.style !== 'any' && (!d.style || !d.style.includes(filters.style))) return false;
    return true;
  };

  const shownDests = vibe.dests.filter(passFilters);
  const activeFilters = Object.values(filters).filter(v => v !== 'any').length;

  const resetFilters = () => setFilters({ budget: 'any', duration: 'any', companion: 'any', style: 'any' });
  const handleFilterClick = (group, val) => setFilters(prev => ({ ...prev, [group]: val }));

  return (
    <main className="vibes-main">

      {/* ══ CINEMATIC HERO ══ */}
      <section className="v-hero">
        <AnimatePresence mode="wait">
          <motion.div
            key={moodId}
            className="v-hero-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ backgroundImage: `url('${vibe.heroImg}')` }}
          />
        </AnimatePresence>
        <div className="v-hero-ov" />

        <div className="v-hero-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={moodId + '-text'}
              className="v-hero-text"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="v-eyebrow">Mood · {vibe.subtitle}</span>
              <h1 className="v-title">{vibe.name}</h1>
              <p className="v-sub">{vibe.desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ══ MOOD NAVIGATION ══ */}
      <nav className="v-mood-nav" aria-label="Select mood">
        <div className="v-mood-nav-inner">
          {VIBES.map(v => (
            <motion.button
              key={v.id}
              className={`v-mood-tab vibe-${v.id} ${v.id === moodId ? 'active' : ''}`}
              onClick={() => {
                if (selectedTabId || v.id === moodId) return;
                setSelectedTabId(v.id);
                setCurrentMood(v.id);
                const timer = setTimeout(() => {
                  navigate(`/vibes?mood=${v.id}`);
                  setSelectedTabId(null);
                }, 350);
              }}
              animate={selectedTabId === v.id ? {
                scale: 0.98
              } : {}}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {v.id === moodId && (
                <motion.span
                  layoutId="moodUnderline"
                  className="v-mood-tab-line"
                  transition={{ type: 'spring', stiffness: 400, damping: 36 }}
                />
              )}
              <span className="v-mood-tab-name">{v.name}</span>
            </motion.button>
          ))}
        </div>
      </nav>

      {/* ══ MAIN CONTENT ══ */}
      <div className="v-layout">

        {/* Left: Destination cards */}
        <section className="v-cards-section">
          <div className="v-section-header">
            <div>
              <p className="v-section-eyebrow">Curated for you</p>
              <h2 className="v-section-title">
                {vibe.tag}
              </h2>
            </div>
            <div className="v-header-right">
              <span className="v-count">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={shownDests.length}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    style={{ display: 'inline-block' }}
                  >
                    {shownDests.length}
                  </motion.span>
                </AnimatePresence>
                {' '}of {vibe.dests.length}
              </span>
              {/* Mobile filter toggle */}
              <button
                className={`v-filter-toggle ${filterOpen ? 'open' : ''} ${activeFilters > 0 ? 'has-active' : ''}`}
                onClick={() => setFilterOpen(p => !p)}
                aria-expanded={filterOpen}
              >
                <SlidersHorizontal size={15} />
                Filters
                {activeFilters > 0 && <span className="v-filter-badge">{activeFilters}</span>}
              </button>
            </div>
          </div>

          {/* Mobile filter drawer */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                className="v-filter-drawer"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <FilterPanel filters={filters} onFilter={handleFilterClick} onReset={resetFilters} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Destination cards */}
          <motion.div layout className="v-dest-grid">
            <AnimatePresence>
              {shownDests.length > 0 ? shownDests.map((d, i) => (
                <motion.article
                  key={d.city}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="vcard-editorial"
                  whileHover={{ y: -6, scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  onClick={() => navigate(`/destination?mood=${moodId}&city=${encodeURIComponent(d.city)}`)}
                  tabIndex={0}
                  role="link"
                  onKeyDown={e => e.key === 'Enter' && navigate(`/destination?mood=${moodId}&city=${encodeURIComponent(d.city)}`)}
                >
                  {/* Image panel */}
                  <div className="vcard-img-wrap">
                    <img
                      className="vcard-img"
                      src={d.img}
                      alt={d.city}
                      loading="lazy"
                    />
                    {/* Match badge — only shown if high */}
                    {d.match >= 85 && (
                      <span className="vcard-match">{d.match}% match</span>
                    )}
                    {/* Accent bar driven by the current vibe colour */}
                    <span className="vcard-accent-bar" />
                  </div>

                  {/* Body */}
                  <div className="vcard-body">
                    <div className="vcard-top-row">
                      <div>
                        <h3 className="vcard-city">{d.city}</h3>
                        <p className="vcard-country">{d.country}</p>
                      </div>
                      <span className="vcard-rating">
                        <Star size={12} strokeWidth={2.5} />
                        {d.r}
                      </span>
                    </div>

                    <p className="vcard-story">{d.story}</p>

                    {/* Key metadata — minimal, only what matters */}
                    <div className="vcard-meta">
                      <span className="vcard-meta-item">{d.budget}</span>
                      <span className="vcard-meta-item">{d.duration}</span>
                      <span className="vcard-meta-item">{d.weather}</span>
                    </div>

                    <div className="vcard-cta">
                      Explore
                      <ArrowRight size={14} strokeWidth={2} />
                    </div>
                  </div>
                </motion.article>
              )) : (
                <Reveal>
                  <div className="v-empty-state">
                    <p>No destinations match these filters.</p>
                    <button className="btn-outline" onClick={resetFilters}>Reset Filters</button>
                  </div>
                </Reveal>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Right: Filter panel (desktop) */}
        <aside className="v-filter-panel">
          <FilterPanel filters={filters} onFilter={handleFilterClick} onReset={resetFilters} />
        </aside>
      </div>

      {/* ══ VEE CTA STRIP ══ */}
      <Reveal>
        <div className="v-vee-strip">
          <div className="v-vee-strip-inner">
            <div>
              <p className="v-vee-eyebrow">Your AI travel concierge</p>
              <h2 className="v-vee-title">Can't find your feeling?</h2>
              <p className="v-vee-sub">VEE analyses your mood, pace and preferences to surface places standard filters can't find.</p>
            </div>
            <button className="btn-white" onClick={() => document.querySelector('.vee-orb')?.click()}>
              Let VEE help ✦
            </button>
          </div>
        </div>
      </Reveal>

      <VeeAssistant pageKey="vibes" showToast={showToast} />
    </main>
  );
}

/* ─── Filter Panel Component ─────────────────────────────────── */
function FilterPanel({ filters, onFilter, onReset }) {
  const groups = [
    {
      key: 'budget', label: 'Budget', icon: Wallet,
      opts: [
        { v: 'any', l: 'Any' }, { v: 'low', l: 'Under ₹50k' },
        { v: 'mid', l: '₹50k – ₹1L' }, { v: 'high', l: '₹1L+' }
      ]
    },
    {
      key: 'duration', label: 'Duration', icon: Clock,
      opts: [
        { v: 'any', l: 'Any' }, { v: 'short', l: 'Weekend' },
        { v: 'mid', l: '4–5 nights' }, { v: 'long', l: '6+ nights' }
      ]
    },
    {
      key: 'companion', label: 'Companion', icon: Users,
      opts: [
        { v: 'any', l: 'Any' }, { v: 'solo', l: 'Solo' },
        { v: 'partner', l: 'Partner' }, { v: 'group', l: 'Group' }
      ]
    },
    {
      key: 'style', label: 'Travel Style', icon: Compass,
      opts: [
        { v: 'any', l: 'Any' }, { v: 'slow', l: 'Slow' },
        { v: 'active', l: 'Active' }, { v: 'luxury', l: 'Luxury' }
      ]
    },
  ];

  return (
    <div className="fp-wrap">
      <div className="fp-header">
        <span className="fp-label">Filters</span>
      </div>
      {groups.map(({ key, label, icon: Icon, opts }) => (
        <div key={key} className="fp-group">
          <span className="fp-group-label">
            <Icon size={13} strokeWidth={2.2} />
            {label}
          </span>
          <div className="fp-opts">
            {opts.map(({ v, l }) => (
              <motion.button
                key={v}
                whileTap={{ scale: 0.95 }}
                className={`fp-opt ${filters[key] === v ? 'active' : ''}`}
                onClick={() => onFilter(key, v)}
              >
                {l}
              </motion.button>
            ))}
          </div>
        </div>
      ))}
      <button className="fp-reset" onClick={onReset}>Clear all</button>
    </div>
  );
}
