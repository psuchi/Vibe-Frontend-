import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { VIBES } from '../data/vibes';
import VeeAssistant from '../components/VeeAssistant';

export default function HomePage({ showToast, onShowLogin }) {
  useScrollReveal();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Vibe — Travel by Emotion';
    document.body.className = '';
  }, []);

  const featuredPicks = [
    { v: VIBES[0], d: VIBES[0].dests[0] },
    { v: VIBES[1], d: VIBES[1].dests[0] },
    { v: VIBES[2], d: VIBES[2].dests[0] }
  ];

  return (
    <main>
      {/* ── HERO ── */}
      <section id="hero">
        <div className="sr">
          <div className="eyebrow">A new way to travel</div>
          <h1 className="hero-h1">Don't pick a place.<br/>Pick a <em>feeling.</em></h1>
          <p className="hero-sub">
            Vibe matches your emotion to extraordinary Indian destinations — with curated stays,
            itineraries, and experiences built around how you want to feel.
          </p>
          <div className="hero-btns">
            <Link className="btn-fill" to="/vibes?mood=calm">Explore Vibes</Link>
            <button className="btn-outline" onClick={onShowLogin}>Create Account</button>
          </div>
        </div>
        <div className="hero-mosaic sr">
          <div className="mosaic-img mosaic-tall">
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=85" alt="Mountains"/>
          </div>
          <div className="mosaic-img">
            <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=85" alt="Nature"/>
          </div>
          <div className="mosaic-img">
            <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=85" alt="Adventure"/>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="pg">
        <div className="sr">
          <h2 className="sec-title">Travel that starts with<br/>how you want to <em>feel.</em></h2>
          <p className="sec-sub">
            Most booking sites start with a map. Vibe starts with an emotion. We match your desired state of mind — calm, wild, sacred, curated, or immersed in culture — to the destinations, stays, and itineraries built to deliver exactly that.
          </p>
        </div>
        <div id="about-stats" className="sr">
          <div className="astat"><b>5</b><span>Emotional worlds</span></div>
          <div className="astat"><b>40+</b><span>Curated destinations</span></div>
          <div className="astat"><b>24/7</b><span>VEE, your travel guide</span></div>
        </div>
      </section>

      {/* ── VIBES / HOW DO YOU WANT TO FEEL ── */}
      <section id="escape" className="pg">
        <div className="sr">
          <h2 className="sec-title">How do you want<br/>to <em>feel</em>?</h2>
          <p className="sec-sub">Five emotional universes. Tap one and the entire experience transforms to match your mood.</p>
        </div>
        <div id="vibesTop" className="sr grid-3 mt-sm">
          {VIBES.slice(0, 3).map(v => (
            <div key={v.id} className="vcard" onClick={() => navigate(`/vibes?mood=${v.id}`)}>
              <div className="vcard-bg" style={{ backgroundImage: `url('${v.cardImg}')` }}></div>
              <div className="vcard-overlay"></div>
              <div className="vcard-body">
                <div className="vcard-name">{v.name}</div>
                <div className="vcard-tag">{v.tag}</div>
                <span className="vcard-cta">Explore →</span>
              </div>
            </div>
          ))}
        </div>
        <div id="vibesBot" className="sr grid-2 mt-xs">
          {VIBES.slice(3, 5).map(v => (
            <div key={v.id} className="vcard" onClick={() => navigate(`/vibes?mood=${v.id}`)}>
              <div className="vcard-bg" style={{ backgroundImage: `url('${v.cardImg}')` }}></div>
              <div className="vcard-overlay"></div>
              <div className="vcard-body">
                <div className="vcard-name">{v.name}</div>
                <div className="vcard-tag">{v.tag}</div>
                <span className="vcard-cta">Explore →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="pg">
        <div className="sr">
          <h2 className="sec-title">Travel, <em>simplified</em><br/>by emotion.</h2>
          <p className="sec-sub">Four easy steps from choosing a feeling to boarding your flight — every detail handled so you just arrive and feel.</p>
        </div>
        <div className="steps4 sr grid-4">
          <div className="step"><div className="step-n">01</div><h3 className="step-h">Choose Mood</h3><p className="step-p">Pick from 5 emotional moods. Each unlocks a curated world built around that feeling.</p></div>
          <div className="step"><div className="step-n">02</div><h3 className="step-h">Discover Places</h3><p className="step-p">Browse hand-picked destinations matched and ranked to your mood.</p></div>
          <div className="step"><div className="step-n">03</div><h3 className="step-h">Plan Journey</h3><p className="step-p">Build a day-by-day itinerary — stays, experiences, and pace, all tailored.</p></div>
          <div className="step"><div className="step-n">04</div><h3 className="step-h">Book Trip</h3><p className="step-p">Confirm in seconds. Budget-friendly, balanced, or premium — ready when you are.</p></div>
        </div>
      </section>

      {/* ── WHY VIBE ── */}
      <section id="why" className="pg">
        <div className="sr">
          <h2 className="sec-title">Why <em>Vibe</em>, not<br/>another booking site.</h2>
          <p className="sec-sub">Every decision is designed around one question: will this help you feel the thing you came for?</p>
        </div>
        <div className="why-grid sr grid-4">
          <div className="why-card"><div className="why-icon">🎯</div><h3 className="why-h">Personalization</h3><p className="why-p">Every recommendation is filtered through your chosen emotion, budget, and travel style — not generic popularity.</p></div>
          <div className="why-card"><div className="why-icon">✦</div><h3 className="why-h">AI-Guided</h3><p className="why-p">VEE, your travel companion, is with you from mood selection to the last day of your itinerary.</p></div>
          <div className="why-card"><div className="why-icon">📖</div><h3 className="why-h">Storytelling</h3><p className="why-p">Every destination page tells you why it matches your mood — not just what's nearby.</p></div>
          <div className="why-card"><div className="why-icon">🛡</div><h3 className="why-h">Seamless Booking</h3><p className="why-p">Travel, stay, and experiences in one flow. No forms scattered across five tabs.</p></div>
        </div>
      </section>

      {/* ── FEATURED DESTINATIONS ── */}
      <section id="featured" className="pg">
        <div className="sr">
          <h2 className="sec-title">Featured <em>destinations.</em></h2>
          <p className="sec-sub">A few places our travelers keep returning to, across every mood.</p>
        </div>
        <div className="feat-grid sr grid-3 grid-gap-lg mt-md" id="featGrid">
          {featuredPicks.map(p => (
            <div key={p.d.city} className="feat-card-custom" onClick={() => navigate(`/destination?mood=${p.v.id}&city=${encodeURIComponent(p.d.city)}`)}>
              <img src={p.d.img} alt={p.d.city} />
              <div className="feat-ov"></div>
              <div className="feat-body">
                <div className="feat-tag">{p.v.name}</div>
                <div className="feat-name">{p.d.city}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── VEE SECTION ── */}
      <section id="veeSuggest" className="section-vee-suggest">
        <div>
          <h2 className="section-vee-suggest-title">Not sure where to start?</h2>
          <p className="section-vee-suggest-sub">VEE learns your mood as you browse and can shortlist a destination in seconds.</p>
        </div>
        <button className="btn-white" onClick={() => document.querySelector('.vee-orb')?.click()}>Ask VEE ✦</button>
      </section>

      <VeeAssistant pageKey="home" showToast={showToast} />
    </main>
  );
}
