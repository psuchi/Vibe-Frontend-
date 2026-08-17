import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getVibe } from '../data/vibes';
import { useVibe } from '../context/VibeContext';
import VeeAssistant from '../components/VeeAssistant';
import LeafletMap from '../components/LeafletMap';

/* ── DESTINATION-AWARE RICH ACTIVITY TEMPLATES ───────────────────────────── */
// These provide real, generic-but-meaningful activities for every destination.
function getRichActivities(dest, city) {
  const c = city;
  const w = (dest.weather || '').toLowerCase();
  const styles = dest.style || [];
  const isNature   = styles.includes('nature')    || styles.includes('slow');
  const isAdventure= styles.includes('adventure') || styles.includes('offbeat');
  const isCulture  = styles.includes('culture')   || styles.includes('spiritual');
  const isLuxury   = styles.includes('luxury');
  const isBudget   = styles.includes('budget');

  const breakfasts = [
    { t: '08:00', n: `Breakfast at ${c}`, d: `Start with a hearty breakfast — try local specialties from ${c}'s vibrant food scene.` },
    { t: '08:30', n: 'Morning Tea & Sunrise', d: `Sip local tea while watching the sunrise — one of ${c}'s finest morning rituals.` },
    { t: '08:00', n: 'Local Market Breakfast', d: `Head to the local market for fresh, authentic breakfast — a true taste of ${c}.` },
  ];

  const lunches = [
    { t: '13:00', n: 'Local Lunch', d: `Explore ${c}'s local cuisine — ask locals for the best spots.` },
    { t: '13:00', n: 'Midday Meal', d: `Recharge with a relaxed lunch at a café or local eatery in ${c}.` },
    { t: '13:30', n: 'Leisurely Lunch', d: `Take your time over a local meal — ${c} has excellent regional food options.` },
  ];

  const dinners = [
    { t: '19:00', n: 'Dinner & Evening', d: `End the day with dinner at one of ${c}'s recommended restaurants, followed by a gentle evening walk.` },
    { t: '19:30', n: 'Evening Meal', d: `Enjoy a relaxed dinner in ${c} as the day winds down.` },
    { t: '20:00', n: 'Farewell Dinner', d: `Savour a memorable final meal — a perfect way to celebrate your time in ${c}.` },
  ];

  const morningActs = [];
  const afternoonActs = [];

  if (isNature) {
    morningActs.push(
      { t: '09:30', n: `${c} Nature Walk`, d: `A guided nature walk through ${c}'s scenic landscapes — breathtaking in the morning light.` },
      { t: '10:00', n: `Sunrise Viewpoint`, d: `Catch the morning golden hour at ${c}'s most scenic viewpoint.` },
      { t: '09:30', n: `Forest Trail & Bird Watching`, d: `Explore the local trail system — ${c} is home to rich flora and birdlife.` },
    );
    afternoonActs.push(
      { t: '15:00', n: `Tea/Coffee Estate Visit`, d: `Tour a local estate and learn about cultivation practices unique to this region.` },
      { t: '16:00', n: `Sunset at ${c}`, d: `Head to the best sunset spot — a ritual every visitor to ${c} must experience.` },
      { t: '15:30', n: `Waterfall / Lake Walk`, d: `A scenic stroll to a nearby natural feature — quintessential ${c}.` },
    );
  } else if (isAdventure) {
    morningActs.push(
      { t: '09:00', n: `${c} Adventure Activity`, d: `Start the day with an exhilarating activity that ${c} is famous for.` },
      { t: '09:30', n: `Trekking / Hiking`, d: `Hit the trail early — ${c}'s terrain is best experienced in the cooler morning hours.` },
      { t: '10:00', n: `Guided Outdoor Experience`, d: `Join a local guide for an authentic outdoor adventure in ${c}.` },
    );
    afternoonActs.push(
      { t: '14:00', n: `Afternoon Adventure`, d: `A second activity session — ${c} offers multiple experiences to stack in a single day.` },
      { t: '15:00', n: `Local Skills Workshop`, d: `Learn a local craft or skill — a unique way to connect with ${c}'s culture.` },
      { t: '16:00', n: `Explore ${c} on Foot`, d: `Wander freely through ${c}'s streets and lanes — often the best discoveries are unplanned.` },
    );
  } else if (isCulture) {
    morningActs.push(
      { t: '09:00', n: `Heritage Walk — ${c}`, d: `A curated walking tour of ${c}'s historic quarters, monuments, and local landmarks.` },
      { t: '09:30', n: `Temple / Monument Visit`, d: `Visit ${c}'s most significant cultural or religious site — best experienced in the morning.` },
      { t: '10:00', n: `${c} Art & History Tour`, d: `Explore the local museum or art galleries to understand ${c}'s rich cultural identity.` },
    );
    afternoonActs.push(
      { t: '14:00', n: `Artisan Quarter`, d: `Browse local craftspeople and workshops — ${c} has a thriving artisan tradition.` },
      { t: '15:30', n: `Local Bazaar`, d: `Wander through ${c}'s vibrant market — the sights, sounds, and smells are unforgettable.` },
      { t: '16:00', n: `Cultural Landmark Visit`, d: `A second afternoon stop at a key cultural or heritage site in ${c}.` },
    );
  } else if (isLuxury) {
    morningActs.push(
      { t: '09:00', n: `Spa Morning`, d: `Begin the day with a premium spa treatment at your hotel — the ultimate ${c} luxury experience.` },
      { t: '10:00', n: `Curated City Tour`, d: `A private guided tour of ${c}'s finest locations, tailored to your interests.` },
      { t: '09:30', n: `${c} Signature Experience`, d: `Enjoy ${c}'s most exclusive activity, arranged by your concierge.` },
    );
    afternoonActs.push(
      { t: '14:00', n: `Fine Dining Lunch`, d: `A multi-course lunch at one of ${c}'s best restaurants.` },
      { t: '16:00', n: `Afternoon at Leisure`, d: `Pool, spa, or simply relaxing — ${c}'s premium properties make it easy to unwind.` },
      { t: '15:30', n: `Shopping in ${c}`, d: `Browse high-end boutiques and curated local shops for the finest souvenirs.` },
    );
  } else {
    morningActs.push(
      { t: '09:30', n: `${c} Morning Walk`, d: `A relaxed morning stroll to get your bearings and soak in the local atmosphere.` },
      { t: '10:00', n: `Explore ${c} Central`, d: `Visit the main square, promenade, or waterfront — the heart of ${c}.` },
      { t: '09:30', n: `Local Neighbourhood Visit`, d: `Explore a neighbourhood beyond the tourist trail — ${c} has hidden gems worth finding.` },
    );
    afternoonActs.push(
      { t: '15:00', n: `${c} Afternoon Excursion`, d: `A short excursion to a nearby attraction or viewpoint outside the main centre.` },
      { t: '14:30', n: `Local Experience`, d: `Immerse yourself in something uniquely ${c} — a cooking class, workshop, or guided experience.` },
      { t: '16:00', n: `Photography Walk`, d: `Golden afternoon light makes ${c} exceptionally photogenic — a walker's delight.` },
    );
  }

  return { breakfasts, lunches, dinners, morningActs, afternoonActs };
}

/* ── VEE ITINERARY GENERATOR ─────────────────────────────────────────────── */
// Works for every destination, even with no experiences / no restaurants.
function generateVeeItinerary(dest, numDays) {
  const exps = (dest.experiences || []).filter(e => e && e.name);

  const dayThemes = [
    'Arrive & Discover',
    'Deep Exploration',
    'Local Immersion',
    'Leisure & Unwind',
    'Final Morning & Depart',
  ];

  const city = dest.city;
  const { breakfasts, lunches, dinners, morningActs, afternoonActs } = getRichActivities(dest, city);

  const days = [];
  for (let i = 0; i < numDays; i++) {
    const acts = [];
    const theme = dayThemes[i % dayThemes.length];

    // Day 1: arrival
    if (i === 0) {
      acts.push({ t: '14:00', n: `Arrive in ${city}`, d: `Check into your accommodation and freshen up. Take it easy — your ${city} adventure starts now.` });
      acts.push({ t: '16:00', n: breakfasts[2].n, d: breakfasts[2].d });
    } else {
      // Rotate breakfasts
      const bf = breakfasts[i % breakfasts.length];
      acts.push({ t: bf.t, n: bf.n, d: bf.d });
    }

    // Morning experience — use real data if available, else rich fallback
    const expIdx = (i * 2) % Math.max(exps.length, 1);
    const morningExp = exps[expIdx];
    if (morningExp) {
      acts.push({ t: '10:00', n: morningExp.name, d: morningExp.desc || `Explore ${morningExp.name} — one of ${city}'s most recommended activities.` });
    } else {
      const mAct = morningActs[i % morningActs.length];
      acts.push({ t: mAct.t, n: mAct.n, d: mAct.d });
    }

    // Lunch
    const lunch = lunches[i % lunches.length];
    acts.push({ t: lunch.t, n: lunch.n, d: lunch.d });

    // Afternoon experience — use real data if available, else rich fallback
    const exp2Idx = (i * 2 + 1) % Math.max(exps.length, 1);
    const afternoonExp = exps[exp2Idx];
    if (afternoonExp && afternoonExp !== morningExp) {
      acts.push({ t: '15:00', n: afternoonExp.name, d: afternoonExp.desc || `A curated afternoon experience unique to ${city}.` });
    } else {
      const aAct = afternoonActs[i % afternoonActs.length];
      acts.push({ t: aAct.t, n: aAct.n, d: aAct.d });
    }

    // Evening
    if (i < numDays - 1) {
      const din = dinners[i % 2]; // cycle between dinner[0] and dinner[1]
      acts.push({ t: din.t, n: din.n, d: din.d });
    } else {
      // Last day: pack and farewell
      acts.push({ t: '19:00', n: dinners[2].n, d: dinners[2].d });
    }

    days.push({ day: `Day ${i + 1}`, title: theme, acts });
  }
  return days;
}

/* ── APPLY PREFERENCE FILTERING ─────────────────────────────────────────── */
function applyPrefsToItinerary(baseDays, pace, focus, dest) {
  const exps = (dest.experiences || []).filter(e => e && e.name);
  const city = dest.city;

  const focusKeywords = {
    Food:      ['food', 'lunch', 'dinner', 'breakfast', 'meal', 'culinary', 'eat', 'dining', 'market breakfast', 'restaurant'],
    Culture:   ['heritage', 'temple', 'museum', 'fort', 'monument', 'art', 'history', 'cultural', 'walk', 'ghats', 'tour'],
    Adventure: ['trek', 'hike', 'rafting', 'paragliding', 'camping', 'adventure', 'climb', 'kayak', 'zip', 'trail', 'outdoor'],
    Nature:    ['forest', 'garden', 'waterfall', 'park', 'nature', 'sunrise', 'sunset', 'lake', 'hill', 'bird', 'trail', 'estate'],
    Shopping:  ['market', 'shop', 'bazaar', 'craft', 'souvenirs', 'mall', 'boutique'],
  };

  const newDays = JSON.parse(JSON.stringify(baseDays));

  newDays.forEach((d) => {
    // Pace adjustments
    if (pace === 'Relaxed' && d.acts.length > 3) {
      d.acts = d.acts.slice(0, 3);
    } else if (pace === 'Packed' && d.acts.length < 6) {
      // Inject an extra experience if available
      const extra = exps.find(e => !d.acts.some(a => a.n === e.name));
      if (extra) {
        d.acts.push({ t: '17:30', n: extra.name, d: extra.desc || `Extra afternoon activity in ${city}.` });
      } else {
        d.acts.push({ t: '17:30', n: `Evening Exploration — ${city}`, d: `Extra time to explore ${city} at your own pace.` });
      }
    }

    // Focus injection — only add if no matching activity already present
    const hasMatch = (kw) => d.acts.some(a =>
      focusKeywords[kw]?.some(k => (a.n + ' ' + a.d).toLowerCase().includes(k))
    );

    focus.forEach((f) => {
      if (!hasMatch(f)) {
        if (f === 'Food') {
          d.acts.unshift({ t: '08:00', n: `${city} Food Walk`, d: `Start with a local food walk — sample street food and regional breakfast specialties.` });
        } else if (f === 'Culture') {
          const cExp = exps.find(e => ['heritage', 'walk', 'tour', 'museum', 'temple', 'history', 'art'].some(k => e.name.toLowerCase().includes(k)));
          if (cExp) {
            d.acts.unshift({ t: '08:30', n: cExp.name, d: cExp.desc || `Cultural experience in ${city}.` });
          } else {
            d.acts.unshift({ t: '08:30', n: `Heritage Walk — ${city}`, d: `Explore ${city}'s historic streets and cultural landmarks on foot.` });
          }
        } else if (f === 'Adventure') {
          const aExp = exps.find(e => ['trek', 'hike', 'adventure', 'trail', 'outdoor'].some(k => e.name.toLowerCase().includes(k)));
          if (aExp) {
            d.acts.push({ t: '14:30', n: aExp.name, d: aExp.desc || `Adventure activity in ${city}.` });
          } else {
            d.acts.push({ t: '14:30', n: `${city} Outdoor Adventure`, d: `Join a local guide for an outdoor adventure — ${city} has excellent options for thrill-seekers.` });
          }
        } else if (f === 'Nature') {
          const nExp = exps.find(e => ['nature', 'forest', 'trail', 'garden', 'lake', 'waterfall', 'sunrise'].some(k => e.name.toLowerCase().includes(k)));
          if (nExp) {
            d.acts.push({ t: '16:00', n: nExp.name, d: nExp.desc || `Nature experience in ${city}.` });
          } else {
            d.acts.push({ t: '16:00', n: `Nature Walk — ${city}`, d: `A peaceful afternoon walk through ${city}'s natural surroundings.` });
          }
        } else if (f === 'Shopping') {
          d.acts.push({ t: '17:00', n: `${city} Local Market`, d: `Browse local crafts, textiles, and souvenirs — ${city} has excellent markets worth exploring.` });
        }
      }
    });
  });

  return newDays;
}

/* ── SAFE PDF DOWNLOAD ────────────────────────────────────────────────────── */
// html2pdf appends elements to <body> to render them, which can disrupt React.
// We explicitly hide it off-screen, let html2pdf do its work, then clean up.
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
      document.body.removeChild(element);
      if (onDone) onDone();
    })
    .catch(() => {
      if (document.body.contains(element)) document.body.removeChild(element);
      if (onDone) onDone();
    });
}

/* ── COMPONENT ───────────────────────────────────────────────────────────── */
export default function ItineraryPage({ showToast }) {
  useScrollReveal();
  const navigate = useNavigate();
  const { booking, setBooking, setCurrentMood, getItinerary, saveItinerary, preferences, setPreferences } = useVibe();

  const moodId = booking?.mood || 'calm';
  const vibe = getVibe(moodId);
  const city = booking?.city || vibe.dests[0].city;
  const dest = vibe.dests.find(d => d.city === city) || vibe.dests[0];

  // Correctly parse numDays from duration string e.g. "3 nights" → 3
  const rawDuration = dest.duration || '';
  const parsedDuration = parseInt(rawDuration, 10);
  const numDays = (booking?.nights && booking.nights > 0)
    ? booking.nights
    : (!isNaN(parsedDuration) && parsedDuration > 0 ? parsedDuration : 4);

  const [days, setDays] = useState([]);
  const [activeDay, setActiveDay] = useState(0);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [appliedPrefs, setAppliedPrefs] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Edit panel state
  const [localPace, setLocalPace] = useState(preferences?.pace || 'Balanced');
  const [localFocus, setLocalFocus] = useState(preferences?.focus || []);
  const [localCompanion, setLocalCompanion] = useState(preferences?.companion || 'Couple');
  const [localFreeText, setLocalFreeText] = useState(preferences?.freeText || '');

  // Store the clean VEE-generated base so curate always re-derives from it
  const [baseDays, setBaseDays] = useState([]);

  useEffect(() => {
    setCurrentMood(moodId);
    document.title = `VEE's Trip Plan — ${dest.city} — Vibe`;
    window.scrollTo({ top: 0, behavior: 'instant' });

    let loaded = getItinerary(moodId, city);
    if (!loaded || loaded.length === 0) {
      loaded = generateVeeItinerary(dest, numDays);

      // Inject any already-selected attractions from a partial booking
      const attractions = booking?.attractions || [];
      attractions.forEach((actName, idx) => {
        const dayIdx = idx % loaded.length;
        if (!loaded[dayIdx].acts.some(a => a.n === actName)) {
          loaded[dayIdx].acts.push({ t: 'Flexible', n: actName, d: 'From your selected experiences.' });
        }
      });

      saveItinerary(moodId, city, loaded);
    }
    setBaseDays(loaded);
    setDays(loaded);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moodId, city]);

  const toggleFocus = (f) => {
    setLocalFocus(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  };

  const handleApplyPrefs = () => {
    setPreferences({ ...preferences, pace: localPace, focus: localFocus, companion: localCompanion, freeText: localFreeText });
    const newDays = applyPrefsToItinerary(baseDays, localPace, localFocus, dest);
    setDays(newDays);
    saveItinerary(moodId, city, newDays);
    setAppliedPrefs(true);
    setShowEditPanel(false);
    showToast('Your Perfect Itinerary is ready ✨');
  };

  const moveAct = (dayIdx, actIdx, dir) => {
    const nd = [...days];
    const acts = nd[dayIdx].acts;
    if (dir === 'up' && actIdx > 0) {
      [acts[actIdx - 1], acts[actIdx]] = [acts[actIdx], acts[actIdx - 1]];
    } else if (dir === 'down' && actIdx < acts.length - 1) {
      [acts[actIdx], acts[actIdx + 1]] = [acts[actIdx + 1], acts[actIdx]];
    } else return;
    setDays(nd);
    saveItinerary(moodId, city, nd);
    showToast('Itinerary updated ✦');
  };

  const removeAct = (dayIdx, actIdx) => {
    const nd = [...days];
    nd[dayIdx].acts.splice(actIdx, 1);
    setDays(nd);
    saveItinerary(moodId, city, nd);
    showToast('Activity removed');
  };

  const addAct = (dayIdx) => {
    const nd = [...days];
    nd[dayIdx].acts.push({ t: 'Flexible', n: 'New Experience', d: 'A customizable activity added to your day.' });
    setDays(nd);
    saveItinerary(moodId, city, nd);
    showToast('Activity added ✦');
  };

  const handleConfirmBooking = () => {
    setBooking({ ...booking, mood: moodId, city: dest.city, itinerary: days });
    navigate('/bookings');
  };

  // Build experience name list for the PDF
  const expNames = (dest.experiences || []).slice(0, 3).map(e => e.name).filter(Boolean);

  const handleDownload = () => {
    if (isDownloading) return;
    setIsDownloading(true);

    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: Georgia, serif; padding: 32px; color: #111; max-width: 760px; margin: 0 auto;">
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:baseline; border-bottom:3px solid #6C5CE7; padding-bottom:12px; margin-bottom:24px;">
          <div>
            <h1 style="color:#6C5CE7; font-size:28px; margin:0; font-family:sans-serif; font-weight:900; letter-spacing:2px;">VIBE</h1>
            <p style="margin:4px 0 0 0; font-size:12px; color:#888; font-family:sans-serif;">Planning Itinerary — Not a Reservation Document</p>
          </div>
          <div style="text-align:right;">
            <p style="font-size:13px; color:#555; margin:0; font-family:sans-serif;">${new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</p>
          </div>
        </div>

        <!-- Trip Header -->
        <h2 style="font-size:26px; margin-bottom:4px; font-family:sans-serif;">${dest.city} Trip Plan</h2>
        <p style="color:#666; font-size:14px; margin-top:0; margin-bottom:4px; font-family:sans-serif;">
          ${vibe.name} · ${days.length} Day${days.length !== 1 ? 's' : ''} · ${dest.country}
        </p>
        <p style="color:#888; font-size:13px; margin-bottom:8px; font-family:sans-serif;">
          📅 Best time to visit: ${dest.best} &nbsp;|&nbsp; 🌤 Weather: ${dest.weather}
          ${dest.budget ? ` &nbsp;|&nbsp; 💰 Budget: ${dest.budget}` : ''}
        </p>
        ${dest.story ? `<p style="color:#555; font-size:13px; font-style:italic; border-left:3px solid #6C5CE7; padding-left:12px; margin-bottom:20px; font-family:sans-serif;">"${dest.story}"</p>` : ''}

        <!-- Preferences Box -->
        <div style="background:#f8f6ff; border-left:4px solid #6C5CE7; padding:14px 18px; border-radius:8px; margin-bottom:28px; font-family:sans-serif;">
          ${appliedPrefs ? `
            <h3 style="margin-top:0; margin-bottom:10px; font-size:15px; color:#6C5CE7;">Your Perfect Itinerary ✨</h3>
            <p style="margin:3px 0; font-size:13px;"><strong>Pace:</strong> ${localPace}</p>
            <p style="margin:3px 0; font-size:13px;"><strong>Focus:</strong> ${localFocus.join(', ') || 'General'}</p>
            <p style="margin:3px 0; font-size:13px;"><strong>Travelling with:</strong> ${localCompanion}</p>
            ${localFreeText ? `<p style="margin:8px 0 0 0; font-size:13px; color:#555; font-style:italic;">"${localFreeText}"</p>` : ''}
          ` : `
            <h3 style="margin-top:0; margin-bottom:8px; font-size:15px; color:#6C5CE7;">YOUR TRIP, CURATED BY VEE ✦</h3>
            <p style="margin:0; font-size:13px; color:#555;">A recommended day-by-day plan based on your ${vibe.name} mood and ${dest.city} destination.</p>
          `}
        </div>

        <!-- Day-by-Day -->
        ${days.map((d, di) => `
          <div style="margin-bottom:28px; page-break-inside:avoid;">
            <div style="background:#6C5CE7; color:#fff; padding:8px 16px; border-radius:6px 6px 0 0; font-family:sans-serif;">
              <h3 style="margin:0; font-size:15px; font-weight:700; letter-spacing:1px;">
                DAY ${String(di + 1).padStart(2, '0')} — ${d.title.toUpperCase()}
              </h3>
            </div>
            <div style="border:1px solid #e5e0ff; border-top:none; border-radius:0 0 6px 6px; padding:16px;">
              ${d.acts.length === 0
                ? '<p style="font-size:14px; color:#999; font-style:italic; margin:0;">A day of rest and reflection.</p>'
                : d.acts.map(a => `
                  <div style="display:flex; gap:16px; margin-bottom:12px; padding-bottom:12px; border-bottom:1px dashed #eee;">
                    <div style="min-width:52px; font-size:13px; font-weight:700; color:#6C5CE7; font-family:sans-serif; padding-top:2px;">${a.t}</div>
                    <div>
                      <div style="font-size:14px; font-weight:700; color:#222; font-family:sans-serif; margin-bottom:3px;">${a.n}</div>
                      <div style="font-size:12px; color:#666; line-height:1.5; font-family:sans-serif;">${a.d}</div>
                    </div>
                  </div>
                `).join('')}
            </div>
          </div>
        `).join('')}

        ${expNames.length > 0 ? `
          <!-- Recommended Experiences -->
          <div style="margin-top:8px; border-top:2px solid #eee; padding-top:20px;">
            <h3 style="font-size:15px; font-family:sans-serif; margin-bottom:12px; color:#333;">📍 Recommended Experiences</h3>
            ${expNames.map(e => `<p style="font-size:13px; font-family:sans-serif; margin:4px 0; color:#555;">• ${e}</p>`).join('')}
          </div>
        ` : ''}

        <!-- Footer -->
        <div style="margin-top:32px; padding-top:14px; border-top:2px solid #eee; display:flex; justify-content:space-between; font-family:sans-serif;">
          <p style="font-size:11px; color:#aaa; margin:0;">This is a planning document only.<br>Flights, hotels, and booking references are not included.</p>
          <p style="font-size:11px; color:#aaa; margin:0; text-align:right;">Generated by <strong style="color:#6C5CE7;">VIBE</strong></p>
        </div>
      </div>
    `;

    const opt = {
      margin: 0.4,
      filename: `Vibe-TripPlan-${dest.city.replace(/\s+/g, '')}-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    safePdfDownload(element, opt, () => {
      setIsDownloading(false);
      showToast('Planning itinerary downloaded ✦');
    });
  };

  return (
    <main>
      {/* ── HEADER ── */}
      <div className="it-head">
        <div className="it-head-inner">
          <div className="eyebrow" style={{ marginBottom: '1rem' }}>
            {appliedPrefs ? 'Your Perfect Itinerary ✨' : 'YOUR TRIP, CURATED BY VEE'}
          </div>
          <h1 className="sec-title" style={{ fontSize: '2.2rem' }}>
            {dest.city} — {days.length} Day{days.length !== 1 ? 's' : ''}
          </h1>
          <p className="sec-sub" style={{ marginBottom: 0 }}>
            {appliedPrefs
              ? `Personalised for your ${localPace.toLowerCase()} pace${localFocus.length ? ` · Focus: ${localFocus.join(' & ')}` : ''}.`
              : `A recommended plan based on your ${vibe.name} mood and destination.`}
          </p>
        </div>
      </div>

      <div className="it-body sr">
        {/* ── MAIN TIMELINE ── */}
        <div>
          {/* Day tabs */}
          <div className="it-tabs">
            {days.map((d, i) => (
              <div key={i} className={`it-tab ${activeDay === i ? 'on' : ''}`} onClick={() => setActiveDay(i)}>
                Day {d.day.split(' ')[1]} <b>{d.title}</b>
              </div>
            ))}
          </div>

          {/* Section divider */}
          <div className="it-main-section-header">
            <div className="sec-divider" style={{ marginBottom: '1.2rem' }}>
              <div className="sec-divider-line"></div>
              <span className="sec-divider-label">
                {appliedPrefs ? 'Your Perfect Itinerary ✨' : "VEE's Recommended Plan"}
              </span>
              <div className="sec-divider-line"></div>
            </div>
          </div>

          {/* Timeline */}
          <div className="timeline">
            {days[activeDay]?.acts.length === 0 && (
              <p style={{ color: 'var(--muted)', fontSize: '13.5px', paddingLeft: '4px' }}>
                A day of rest and exploration at your own pace.
              </p>
            )}
            {days[activeDay]?.acts.map((a, i) => (
              <div key={i} className="tl-item">
                <div className="tl-top">
                  <div>
                    <div className="tl-time">{a.t}</div>
                    <div className="tl-name">{a.n}</div>
                    <div className="tl-desc">{a.d}</div>
                  </div>
                  <div className="tl-actions">
                    <button className="tl-btn" onClick={() => moveAct(activeDay, i, 'up')} disabled={i === 0}>↑</button>
                    <button className="tl-btn" onClick={() => moveAct(activeDay, i, 'down')} disabled={i === days[activeDay].acts.length - 1}>↓</button>
                    <button className="tl-btn" onClick={() => removeAct(activeDay, i)}>✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="add-act-btn" onClick={() => addAct(activeDay)}>+ Add activity to this day</button>

          {/* ── BOTTOM CTAs ── */}
          <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button className="btn-fill" style={{ maxWidth: '320px' }} onClick={handleConfirmBooking}>
              Confirm Your Booking →
            </button>
            <button className="btn-outline" onClick={() => setShowEditPanel(v => !v)}>
              {showEditPanel ? '✕ Close Editor' : '✦ Edit / Curate My Itinerary'}
            </button>
            <button className="btn-outline" onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? 'Preparing PDF…' : '↓ Download Itinerary'}
            </button>
          </div>

          {/* ── EDIT / CURATE PANEL (collapsible) ── */}
          {showEditPanel && (
            <div style={{
              marginTop: '2rem',
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '6px', fontSize: '18px' }}>
                ✦ Edit / Curate My Itinerary
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px', marginTop: 0 }}>
                Personalise VEE's plan to match exactly what you want from this trip.
              </p>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '10px', color: 'var(--text)' }}>
                  What kind of trip do you want?
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['Relaxed', 'Balanced', 'Packed'].map(p => (
                    <button key={p} onClick={() => setLocalPace(p)} style={{
                      padding: '8px 18px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer',
                      fontFamily: 'inherit',
                      background: localPace === p ? 'var(--accent)' : 'transparent',
                      color: localPace === p ? '#fff' : 'var(--text)',
                      border: `1.5px solid ${localPace === p ? 'var(--accent)' : 'var(--card-border)'}`
                    }}>{p}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '10px', color: 'var(--text)' }}>
                  What do you want to focus on?
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['Food', 'Culture', 'Adventure', 'Nature', 'Shopping'].map(f => (
                    <button key={f} onClick={() => toggleFocus(f)} style={{
                      padding: '8px 18px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer',
                      fontFamily: 'inherit',
                      background: localFocus.includes(f) ? 'var(--accent)' : 'transparent',
                      color: localFocus.includes(f) ? '#fff' : 'var(--text)',
                      border: `1.5px solid ${localFocus.includes(f) ? 'var(--accent)' : 'var(--card-border)'}`
                    }}>{f}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '10px', color: 'var(--text)' }}>
                  Who are you travelling with?
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['Solo', 'Couple', 'Friends', 'Family'].map(c => (
                    <button key={c} onClick={() => setLocalCompanion(c)} style={{
                      padding: '8px 18px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer',
                      fontFamily: 'inherit',
                      background: localCompanion === c ? 'var(--accent)' : 'transparent',
                      color: localCompanion === c ? '#fff' : 'var(--text)',
                      border: `1.5px solid ${localCompanion === c ? 'var(--accent)' : 'var(--card-border)'}`
                    }}>{c}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '10px', color: 'var(--text)' }}>
                  Tell VIBE what you want from your trip...
                </label>
                <textarea
                  value={localFreeText}
                  onChange={(e) => setLocalFreeText(e.target.value)}
                  placeholder="E.g., I want to try local street food and see historical monuments."
                  style={{
                    width: '100%', padding: '12px', borderRadius: '8px',
                    border: '1.5px solid var(--card-border)', background: 'transparent',
                    color: 'var(--text)', fontSize: '14px', minHeight: '80px',
                    fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical'
                  }}
                />
                {localFreeText && (
                  <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px', fontStyle: 'italic' }}>
                    ✦ Your note will appear in the downloaded itinerary.
                  </p>
                )}
              </div>

              <button className="btn-fill" onClick={handleApplyPrefs}>
                Generate My Perfect Itinerary ✨
              </button>
            </div>
          )}
        </div>

        {/* ── SIDEBAR ── */}
        <div className="it-sidebar">
          <div className="side-card">
            <div className="side-h">🌤 Weather &amp; Best Time</div>
            <p style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.7 }}>
              Expect {dest.weather.toLowerCase()} during your trip. Best visited: {dest.best}.
            </p>
          </div>
          <div className="side-card">
            <div className="side-h">🗺 Map Preview</div>
            <div className="map-box" style={{ height: '160px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
              <LeafletMap type="pin" center={[dest.lat || 20, dest.lng || 78]} zoom={10} />
            </div>
          </div>
          {(dest.experiences || []).length > 0 && (
            <div className="side-card">
              <div className="side-h">📍 Top Experiences</div>
              <div>
                {(dest.experiences || []).slice(0, 4).map((e, i) => (
                  <div key={i} className="restaurant-item">{e.name}</div>
                ))}
              </div>
            </div>
          )}
          <div className="side-card">
            <div className="side-h">🧳 Packing Tips</div>
            <div className="pack-list">
              <span className="pack-chip">Comfortable shoes</span>
              <span className="pack-chip">Layers</span>
              <span className="pack-chip">Camera</span>
              <span className="pack-chip">Sunscreen</span>
            </div>
          </div>
          {dest.budgetRange && (
            <div className="side-card">
              <div className="side-h">💰 Budget Range</div>
              <p style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
                {dest.budgetRange} per person
              </p>
            </div>
          )}
        </div>
      </div>

      <VeeAssistant pageKey="itinerary" showToast={showToast} />
    </main>
  );
}