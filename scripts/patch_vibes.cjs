const fs = require('fs');

let content = fs.readFileSync('src/data/vibes.js', 'utf-8');

// 1. Deep Calm: replace dest_phuket and stay_como_point_yamu__phuket
content = content.replace(/\{\s*id:\s*'dest_phuket'[\s\S]*?availableNow:\s*false\s*\}/, `{
        id: 'dest_munnar', city: 'Munnar', country: 'Kerala, India',
        img: 'https://placehold.co/1200x800?text=Munnar', // TODO: replace with real photo in Phase 3
        r: '4.6', budget: '₹32,000', duration: '3 nights', match: 92,
        story: 'Tea gardens roll over every hillside as far as you can see, and the fog doesn\\'t lift until the sun\\'s well up. Munnar trades the ocean for altitude but keeps the same unhurried stillness.',
        weather: '19°C · Cool & misty', best: 'Sep – Mar', budgetRange: '₹25k – ₹60k / person',
        attractions: ['Eravikulam National Park', 'Tea Museum & estate walk', 'Mattupetty Dam viewpoint', 'Top Station sunrise'],
        restaurants: ['Windermere Estate dining', 'Saravana Bhavan Munnar', 'Estate spice-trail cafe'],
        companion: ['solo', 'partner'], style: ['slow'], availableNow: true
      }`);

content = content.replace(/\{\s*id:\s*'stay_como_point_yamu__phuket'[^}]+\}/, 
  `{ id: 'stay_windermere_estate__munnar', lbl: 'Tea Estate Bungalow', name: 'Windermere Estate, Munnar', loc: 'Pothamedu, Munnar', basePrice: 9500, rate: '4.8 ★', amen: 'Colonial-era bungalow · Private tea garden · Farm-to-table dining · Valley views' }`);

// 2. Wild Heart: replace dest_chamonix and stay_h_tel_mont_blanc__chamonix
content = content.replace(/\{\s*id:\s*'dest_chamonix'[\s\S]*?availableNow:\s*true\s*\}/, `{
        id: 'dest_gulmarg', city: 'Gulmarg', country: 'Jammu & Kashmir, India',
        img: 'https://placehold.co/1200x800?text=Gulmarg', // TODO: replace with real photo in Phase 3
        r: '4.7', budget: '₹55,000', duration: '5 nights', match: 93,
        story: 'India\\'s only real ski town — a gondola climbs past 4,000m and drops you into backcountry powder with barely another skier in sight.',
        weather: '2°C · Alpine snow', best: 'Dec – Mar (skiing) / May – Sep (trekking)', budgetRange: '₹42k – ₹95k / person',
        attractions: ['Gondola ride to Apharwat Peak', 'Backcountry skiing', 'Alpather Lake trek', 'Strawberry Valley hike'],
        restaurants: ['The Khyber dining room', 'Nedou\\'s Hotel cafe', 'Local Kahwa & Wazwan tent'],
        companion: ['group', 'solo'], style: ['active'], availableNow: false
      }`);

content = content.replace(/\{\s*id:\s*'stay_h_tel_mont_blanc__chamonix'[^}]+\}/,
  `{ id: 'stay_the_khyber__gulmarg', lbl: 'Alpine Resort', name: 'The Khyber Himalayan Resort & Spa, Gulmarg', loc: 'Gulmarg, Kashmir', basePrice: 16000, rate: '4.8 ★', amen: 'Ski-in/out access · Kashmiri spa · Fireside dining · Valley suites' }`);

// 3. Sacred Heritage: replace dest_kyoto and stay_tawaraya_ryokan__kyoto
content = content.replace(/\{\s*id:\s*'dest_kyoto'[\s\S]*?availableNow:\s*false\s*\}/, `{
        id: 'dest_madurai', city: 'Madurai', country: 'Tamil Nadu, India',
        img: 'https://placehold.co/1200x800?text=Madurai', // TODO: replace with real photo in Phase 3
        r: '4.6', budget: '₹36,000', duration: '3 nights', match: 90,
        story: 'The Meenakshi temple has been the actual center of daily life here for over a thousand years — this isn\\'t a heritage site people visit, it\\'s one they live inside.',
        weather: '28°C · Warm & humid', best: 'Nov – Feb', budgetRange: '₹28k – ₹60k / person',
        attractions: ['Meenakshi Amman Temple dawn darshan', 'Thirumalai Nayakkar Palace', 'Alagar Kovil hill temple', 'Vaigai riverside walk'],
        restaurants: ['Heritage Madurai courtyard dining', 'Murugan Idli Shop', 'Amma Mess local thali'],
        companion: ['solo', 'group'], style: ['slow'], availableNow: true
      }`);

content = content.replace(/\{\s*id:\s*'stay_tawaraya_ryokan__kyoto'[^}]+\}/,
  `{ id: 'stay_heritage_madurai', lbl: 'Heritage Courtyard Stay', name: 'Heritage Madurai', loc: 'T.P.K Road, Madurai', basePrice: 7200, rate: '4.6 ★', amen: 'Restored heritage bungalows · Temple-view courtyard · South Indian breakfast · Cultural evenings' }`);

// 4. Modern Muse: replace all 3 destinations (milan, singapore, copenhagen)
const aestheticDests = `[
      {
        id: 'dest_mumbai', city: 'Mumbai', country: 'Maharashtra, India',
        img: 'https://placehold.co/1200x800?text=Mumbai', // TODO: replace with real photo in Phase 3
        r: '4.6', budget: '₹68,000', duration: '4 nights', match: 93,
        story: 'India\\'s biggest art-deco collection sits two blocks from its newest gallery openings. Mumbai doesn\\'t separate old design from new — it just keeps building on top of itself.',
        weather: '30°C · Coastal humid', best: 'Nov – Feb', budgetRange: '₹50k – ₹1.1L / person',
        attractions: ['Kala Ghoda art district walk', 'Jehangir Art Gallery', 'Bandra-Worli Sea Link at dusk', 'Marine Drive art-deco heritage trail'],
        restaurants: ['The Table', 'Bombay Canteen', 'Trishna seafood'],
        companion: ['partner', 'group', 'solo'], style: ['luxury'], availableNow: true
      },
      {
        id: 'dest_chandigarh', city: 'Chandigarh', country: 'Punjab & Haryana, India',
        img: 'https://placehold.co/1200x800?text=Chandigarh', // TODO: replace with real photo in Phase 3
        r: '4.4', budget: '₹40,000', duration: '3 nights', match: 87,
        story: 'India\\'s only city designed whole-cloth by an architect. Le Corbusier\\'s Capitol Complex is a UNESCO site, but the real story is a city that still runs on his original grid, sixty years on.',
        weather: '22°C · Pleasant', best: 'Oct – Mar', budgetRange: '₹30k – ₹65k / person',
        attractions: ['Capitol Complex (Le Corbusier UNESCO site)', 'Nek Chand Rock Garden', 'Sukhna Lake promenade', 'Government Museum & Art Gallery'],
        restaurants: ['Pal Dhaba', 'Backpackers Cafe, Sector 9', 'Virgin Courtyard'],
        companion: ['partner', 'solo'], style: ['slow'], availableNow: true
      },
      {
        id: 'dest_kochi', city: 'Kochi', country: 'Kerala, India',
        img: 'https://placehold.co/1200x800?text=Kochi', // TODO: replace with real photo in Phase 3
        r: '4.7', budget: '₹42,000', duration: '4 nights', match: 89,
        story: 'The Kochi-Muziris Biennale turned this port town into India\\'s contemporary art capital every two years — and the colonial warehouses it happens in are worth the trip alone.',
        weather: '29°C · Coastal warm', best: 'Nov – Feb', budgetRange: '₹32k – ₹75k / person',
        attractions: ['Kochi-Muziris Biennale galleries', 'Fort Kochi heritage walk', 'Chinese fishing nets at sunset', 'Jew Town antique & design district'],
        restaurants: ['Brunton Boatyard waterfront dining', 'Kashi Art Cafe', 'Dal Roti'],
        companion: ['solo', 'partner'], style: ['slow', 'luxury'], availableNow: true
      }
    ]`;

const aestheticStays = `[
      { id: 'stay_taj_mahal_palace__mumbai', lbl: 'Iconic Harbourfront', name: 'Taj Mahal Palace, Mumbai', loc: 'Colaba, Mumbai', basePrice: 24000, rate: '4.9 ★', amen: 'Sea-facing heritage wing · Rooftop bar · Art collection · Harbour views' },
      { id: 'stay_jw_marriott__chandigarh', lbl: 'Modernist City Stay', name: 'JW Marriott Hotel, Chandigarh', loc: 'Sector 35, Chandigarh', basePrice: 11000, rate: '4.6 ★', amen: 'Design-forward interiors · Rooftop pool · City skyline views · Contemporary dining' },
      { id: 'stay_brunton_boatyard__kochi', lbl: 'Heritage Waterfront', name: 'Brunton Boatyard, Kochi', loc: 'Fort Kochi', basePrice: 13500, rate: '4.8 ★', amen: 'Harbour-facing rooms · Colonial architecture · Spice Route dining · Sunset deck' }
    ]`;

const aestheticDays = `[
      {
        day: 'Day 01', title: 'Art Deco & Galleries', loc: 'Mumbai, Maharashtra', acts: [
          { t: '10:00', n: 'Kala Ghoda Art Walk', d: 'Private guided tour through Mumbai\\'s gallery district.' },
          { t: '14:00', n: 'Lunch at The Table', d: 'Modern Indian small plates in a converted warehouse space.' },
          { t: '17:00', n: 'Marine Drive Art Deco Trail', d: 'Guided walk through the world\\'s second-largest art deco collection.' }
        ]
      },
      {
        day: 'Day 02', title: 'Design & Studios', loc: 'Mumbai, Maharashtra', acts: [
          { t: '09:00', n: 'Jehangir Art Gallery Visit', d: 'Private curator walkthrough of the current exhibitions.' },
          { t: '13:00', n: 'Design Studio Visit', d: 'Behind-the-scenes at an independent textile and leather atelier.' },
          { t: '19:00', n: 'Sea Link Sunset Drive', d: 'Private car across the Bandra-Worli Sea Link at golden hour.' }
        ]
      },
      {
        day: 'Day 03', title: 'Contemporary Bombay', loc: 'Mumbai, Maharashtra', acts: [
          { t: '08:00', n: 'Sassoon Docks Photo Walk', d: 'Early-morning fish market, a favorite among street photographers.' },
          { t: '12:00', n: 'Colaba Causeway Design Shopping', d: 'Independent designers and concept stores.' },
          { t: '19:00', n: 'Rooftop Dinner', d: 'Skyline views over the Arabian Sea to close out the trip.' }
        ]
      }
    ]`;

// We'll replace the dests, stays, days blocks for aesthetic vibe.
// Find id: 'aesthetic' and replace its arrays
content = content.replace(/id:\s*'aesthetic'[\s\S]*?dests:\s*\[[\s\S]*?\]\s*,/g, (match) => {
    return match.replace(/dests:\s*\[[\s\S]*?\]\s*,/, `dests: ${aestheticDests},`);
});
content = content.replace(/id:\s*'aesthetic'[\s\S]*?stays:\s*\[[\s\S]*?\]\s*,/g, (match) => {
    return match.replace(/stays:\s*\[[\s\S]*?\]\s*,/, `stays: ${aestheticStays},`);
});
content = content.replace(/id:\s*'aesthetic'[\s\S]*?days:\s*\[[\s\S]*?\]\s*\n\s*\}/g, (match) => {
    return match.replace(/days:\s*\[[\s\S]*?\]\s*\n\s*\}/, `days: ${aestheticDays}\n  }`);
});

// 5. Living Culture: replace dest_istanbul and dest_oaxaca
content = content.replace(/\{\s*id:\s*'dest_istanbul'[\s\S]*?availableNow:\s*true\s*\}/, `{
        id: 'dest_amritsar', city: 'Amritsar', country: 'Punjab, India',
        img: 'https://placehold.co/1200x800?text=Amritsar', // TODO: replace with real photo in Phase 3
        r: '4.8', budget: '₹34,000', duration: '3 nights', match: 95,
        story: 'The Golden Temple\\'s langar feeds 100,000 people a day, for free, every day, no exceptions — and volunteering an hour in that kitchen tells you more about the city than any monument could.',
        weather: '24°C · Continental', best: 'Oct – Mar', budgetRange: '₹25k – ₹55k / person',
        attractions: ['Golden Temple dawn darshan', 'Langar community kitchen volunteering', 'Jallianwala Bagh', 'Wagah Border retreat ceremony'],
        restaurants: ['Kesar Da Dhaba', 'Brothers\\' Dhaba', 'Bharawan Da Dhaba'],
        companion: ['solo', 'group', 'partner'], style: ['slow', 'active'], availableNow: true
      }`);

content = content.replace(/\{\s*id:\s*'dest_oaxaca'[\s\S]*?availableNow:\s*false\s*\}/, `{
        id: 'dest_kolkata', city: 'Kolkata', country: 'West Bengal, India',
        img: 'https://placehold.co/1200x800?text=Kolkata', // TODO: replace with real photo in Phase 3
        r: '4.6', budget: '₹40,000', duration: '4 nights', match: 91,
        story: 'A city that still argues about poetry over coffee at 90-year-old coffeehouses. Kolkata\\'s culture isn\\'t curated for visitors — it\\'s just what people here do after work.',
        weather: '27°C · Humid', best: 'Oct – Feb', budgetRange: '₹30k – ₹65k / person',
        attractions: ['College Street book market', 'Indian Coffee House adda', 'Kumartuli potters\\' quarter', 'Dakshineswar Kali Temple'],
        restaurants: ['6 Ballygunge Place', 'Peter Cat', 'Park Street food crawl'],
        companion: ['solo', 'partner', 'group'], style: ['slow', 'active'], availableNow: true
      }`);

content = content.replace(/\{\s*id:\s*'stay___ra_an_palace_kempinski'[^}]+\}/,
  `{ id: 'stay_ranjits_svaasa__amritsar', lbl: 'Heritage Haveli', name: 'Ranjit\\'s Svaasa, Amritsar', loc: 'Kucha Kaudianwala, Amritsar', basePrice: 8000, rate: '4.7 ★', amen: '200-year-old haveli · Rooftop dining · Punjabi cooking class · Walking distance to Golden Temple' }`);

content = content.replace(/\{\s*id:\s*'stay_casa_oaxaca_hotel'[^}]+\}/,
  `{ id: 'stay_oberoi_grand__kolkata', lbl: 'Grand Heritage', name: 'The Oberoi Grand, Kolkata', loc: 'Chowringhee, Kolkata', basePrice: 12500, rate: '4.8 ★', amen: 'Colonial-era grandeur · Pool · Bengali fine dining · Central location' }`);


// Strip out NEW_DATA completely, as per instruction all 15 destinations are Indian now and that was an old artifact.
const new_data_index = content.indexOf('// Inject new Indian destinations');
if (new_data_index !== -1) {
    content = content.substring(0, new_data_index) + `
export const VIBES = RAW_VIBES;
export const BUDGET_CONFIG = {
  budget: { multiplier: 1.0, expMul: 1.0, concMul: 0.6, label: '🌿 Budget', info: 'Comfortable guesthouses & local experiences. Best value.' },
  balanced: { multiplier: 1.6, expMul: 1.4, concMul: 1.0, label: '✦ Balanced', info: 'Boutique hotels, private guides, curated meals.' },
  premium: { multiplier: 2.8, expMul: 2.0, concMul: 1.8, label: '👑 Premium', info: 'Luxury properties, exclusive access, personal concierge 24/7.' }
};
export const getVibe = (id) => VIBES.find(v => v.id === id) || VIBES[0];
`;
}

fs.writeFileSync('src/data/vibes.js', content, 'utf-8');
console.log("Done");
