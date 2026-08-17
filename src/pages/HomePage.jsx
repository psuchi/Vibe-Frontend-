import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, Mouse, Heart, Sparkles, Shield, Feather, Smile, MapPin, Briefcase, HeartHandshake, Star } from 'lucide-react';
import { VIBES } from '../data/vibes';
import VeeAssistant from '../components/VeeAssistant';
import Reveal from '../components/Reveal';
import { useVibe } from '../context/VibeContext';
import './HomePage.css';
import homeHeroImg from '../assets/destinations/hero-image.webp';

export default function HomePage({ showToast, onShowLogin }) {
  const navigate = useNavigate();
  const { setCurrentMood } = useVibe();
  const [activeVibeId, setActiveVibeId] = useState(VIBES[2]?.id || VIBES[0]?.id);
  const [selectedVibeId, setSelectedVibeId] = useState(null);

  useEffect(() => {
    document.title = 'Vibe — Travel by Emotion';
    document.body.className = '';
  }, []);

  const trendingDestinations = VIBES.slice(0, 5).map(v => ({
    vibe: v,
    dest: v.dests[0]
  }));

  const vibeScores = [91, 89, 92, 90, 90];

  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const heroY = useTransform(scrollY, [0, 1000], [0, prefersReducedMotion ? 0 : 250]);

  return (
    <main className="home-main">

      {/* ── HERO ── */}
      <section id="hero" className="home-hero">
        <div className="home-hero-bg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, display: 'block' }}>
          <img src={homeHeroImg} alt="Breathtaking mountain landscape" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '70% center', display: 'block', transform: 'scale(1.02)', filter: 'contrast(1.05) saturate(1.05) brightness(1.02)' }} />
          <div className="home-hero-scrim" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(10, 20, 35, 0.75) 0%, rgba(10, 20, 35, 0.3) 35%, transparent 60%)', zIndex: 1, pointerEvents: 'none' }} />
        </div>

        <div className="home-hero-content">
          <motion.div
            className="home-hero-eyebrow"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Don't pick a place.
          </motion.div>

          <motion.h1
            className="home-hero-headline"
            initial={{ opacity: 0, y: 38 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.18, ease: "easeOut" }}
          >
            Pick a feeling.
          </motion.h1>

          <motion.div
            className="home-hero-sub"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.36, ease: "easeOut" }}
          >
            Tell us how you want to feel — VEE crafts the perfect journey, just for you.
          </motion.div>

          <motion.div
            className="home-hero-cta"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.52, ease: "easeOut" }}
          >
            <Link className="home-btn-primary" to="/vibes?mood=calm">
              Explore Vibes <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>




      </section>

      {/* ── VIBES GRID ── */}
      <section className="home-vibes-section">
        <div className="home-section-header">
          <p className="home-overline">Choose Your Vibe</p>
          <h2 className="home-heading">How do you want to feel?</h2>
          <div className="home-heading-divider" />
        </div>

        <div className="home-vibes-grid">
          {VIBES.slice(0, 5).map((vibe, index) => {
            return (
              <motion.div
                key={vibe.id}
                className={`home-vibe-card-static vibe-${vibe.id}`}
                onClick={() => {
                  if (selectedVibeId) return;
                  setSelectedVibeId(vibe.id);
                  if (setCurrentMood) setCurrentMood(vibe.id);
                  const timer = setTimeout(() => {
                    navigate(`/vibes?mood=${vibe.id}`);
                  }, 350);
                }}
                whileHover={selectedVibeId !== vibe.id ? { y: -4 } : {}}
                animate={selectedVibeId === vibe.id ? {
                  scale: 0.98,
                  boxShadow: "0 0 0 1px var(--accent), 0 8px 24px rgba(0,0,0,0.1)"
                } : {}}
                transition={
                  selectedVibeId === vibe.id 
                    ? { duration: 0.2, ease: "easeOut" }
                    : { type: "spring", stiffness: 300, damping: 20 }
                }
                style={selectedVibeId === vibe.id ? { zIndex: 10, position: 'relative' } : {}}
              >
                <div className="home-vibe-card-static-bg">
                  <img src={vibe.cardImg} alt={vibe.name} />
                  <div className="home-vibe-card-static-scrim" />
                </div>

                <div className="home-vibe-card-static-content">
                  <div className="home-vibe-card-static-header">
                    <h3 className="home-vibe-card-static-title">{vibe.name}</h3>
                    <p className="home-vibe-card-static-desc">{vibe.desc.substring(0, 30)}...</p>
                  </div>
                  <div className="home-vibe-explore-btn">
                    Explore <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── FEATURE STRIP ── */}
      <section className="home-features-strip">
        <Reveal>
          <div className="home-features-container">
            <div className="home-feature-item">
              <div className="home-feature-icon"><Heart size={22} /></div>
              <h4>Emotion-first<br />travel discovery</h4>
              <p>Journeys that match how you feel, not just where you want to go.</p>
            </div>
            <div className="home-feature-item">
              <div className="home-feature-icon"><Sparkles size={22} /></div>
              <h4>AI-powered<br />journey planning</h4>
              <p>Smart, personalised recommendations crafted by VEE.</p>
            </div>
            <div className="home-feature-item">
              <div className="home-feature-icon"><Shield size={22} /></div>
              <h4>Curated<br />experiences</h4>
              <p>Handpicked stays, activities, and hidden gems.</p>
            </div>
            <div className="home-feature-item">
              <div className="home-feature-icon"><Feather size={22} /></div>
              <h4>Seamless<br />end-to-end trip</h4>
              <p>From planning to memories — we've got every step covered.</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── HOW VIBE WORKS ── */}
      <section className="home-how-section">
        <Reveal>
          <div className="home-section-header">
            <p className="home-overline">How Vibe Works</p>
            <h2 className="home-heading">Your perfect journey in 4 simple steps</h2>
            <div className="home-heading-divider" />
          </div>
        </Reveal>

        <div className="home-steps-wrapper">
          <div className="home-steps-container">
            <div className="home-steps-line" />
            {[
              { icon: Smile,         title: "Choose Your Vibe",          desc: "Pick how you want to feel on this trip" },
              { icon: MapPin,        title: "Discover Destinations",      desc: "Explore curated vibe-matched places" },
              { icon: Briefcase,     title: "Build Your Journey",         desc: "VEE crafts the perfect personalised plan" },
              { icon: HeartHandshake,title: "Travel & Collect Memories",  desc: "Live the vibe, forever" },
            ].map((step, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="home-step-item">
                  <div className="home-step-icon">
                    <step.icon size={26} />
                  </div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING DESTINATIONS ── */}
      <section className="home-trending-section">
        <div className="home-trending-inner">
          <div className="home-trending-header">
            <div>
              <p className="home-overline">Trending Destinations</p>
              <h2 className="home-heading">Handpicked escapes for every vibe</h2>
            </div>
            <Link to="/vibes?mood=calm" className="home-link-cta">
              Explore all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="home-trending-grid">
            {trendingDestinations.map((item, index) => (
              <Reveal key={item.dest.id} delay={index * 0.07}>
                <div
                  className="home-trend-card"
                  onClick={() => navigate(`/destination?mood=${item.vibe.id}&city=${encodeURIComponent(item.dest.city)}`)}
                >
                  <div className="home-trend-img-wrap">
                    <img src={item.dest.img} alt={item.dest.city} />
                    <div className="home-trend-scrim" />
                    {/* Vibe tag pill — uses existing vibe.name */}
                    <div className="home-trend-vibe-tag">
                      {item.vibe.name}
                    </div>
                    {/* Rating chip — uses existing dest.r field */}
                    {item.dest.r && (
                      <div className="home-trend-rating">
                        <Star size={9} fill="currentColor" />
                        {item.dest.r}
                      </div>
                    )}
                  </div>
                  <div className="home-trend-info">
                    <h4>{item.dest.city}</h4>
                    <p>{item.dest.country}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── VEE CTA ── */}
      <section className="home-vee-cta">
        <Reveal>
          <div className="home-vee-cta-container">
            <div className="home-vee-cta-glow" />
            <div className="home-vee-cta-content">
              <div className="home-vee-orb-visual">
                <div className="orb-core" />
                <div className="orb-ring" />
              </div>
              <div className="home-vee-cta-text">
                <h2>Still undecided? Let VEE guide you</h2>
                <p>Chat with your AI travel concierge — free, instant, personalised</p>
              </div>
            </div>
            <button
              className="home-btn-outline"
              onClick={() => document.querySelector('.vee-orb')?.click()}
            >
              Chat with VEE <Sparkles size={14} />
            </button>
          </div>
        </Reveal>
      </section>

      <VeeAssistant pageKey="home" showToast={showToast} />
    </main>
  );
}
