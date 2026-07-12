export const VIBES = [
  {
    id: 'calm',
    cls: 'vibe-calm',
    name: 'Deep Calm',
    tag: 'Serenity & Solitude',
    subtitle: 'Serene Escape',
    desc: 'Breathable landscapes, slow mornings, and spaces where the only agenda is peace.',
    cardImg: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=85',
    heroImg: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1600&q=85',
    dests: [
      {
        city: 'Coorg', country: 'Karnataka, India',
        img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=85',
        r: '4.7', budget: '₹42,000', duration: '3 nights', match: 96,
        story: 'Coffee estates roll into mist before sunrise, and the loudest thing you\'ll hear all day is a hornbill overhead. Coorg is where Deep Calm lives — plantation trails, slow breakfasts, and mornings with no agenda.',
        weather: '22°C · Cool & misty', best: 'Oct – Mar', budgetRange: '₹35k – ₹90k / person',
        attractions: ['Abbey Falls dawn hike', 'Namdroling Monastery', 'Talakaveri source walk', 'Estate coffee tour'],
        restaurants: ['Coorg Cuisine at Raintree', 'Kadumane Estate table', 'Tamara plantation dining'],
        companion: ['solo', 'partner'], style: ['slow'], availableNow: true
      },
      {
        city: 'Rishikesh', country: 'Uttarakhand, India',
        img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85',
        r: '4.5', budget: '₹65,000', duration: '4 nights', match: 91,
        story: 'The Ganga moves slower here, and so do you. Rishikesh pairs riverside stillness with centuries of meditation practice — sunrise yoga on stone ghats, silence between chants.',
        weather: '18°C · Crisp mornings', best: 'Sep – Apr', budgetRange: '₹45k – ₹1.1L / person',
        attractions: ['Laxman Jhula sunrise walk', 'Beatles Ashram', 'Neer Garh Waterfall', 'Triveni Ghat aarti'],
        restaurants: ['Ananda riverside dining', 'Chotiwala thali house', 'Beatles Cafe'],
        companion: ['solo'], style: ['slow'], availableNow: true
      },
      {
        city: 'Phuket', country: 'Thailand',
        img: 'https://i.pinimg.com/1200x/70/73/27/707327c07ff1a9666bb6eaa8b1cc279b.jpg',
        r: '4.8', budget: '₹78,000', duration: '5 nights', match: 88,
        story: 'Beyond the tourist strip, Phuket has quiet coves where the Andaman Sea barely moves at dawn. This is the island for slow swims and longer sunsets.',
        weather: '29°C · Warm & humid', best: 'Nov – Feb', budgetRange: '₹60k – ₹1.4L / person',
        attractions: ['Freedom Beach at sunrise', 'Big Buddha at dusk', 'Kata Noi quiet cove', 'Thai spa ritual'],
        restaurants: ['COMO Point Yamu terrace', 'Suay fine dining', 'Raya Thai'],
        companion: ['partner', 'group'], style: ['slow', 'luxury'], availableNow: false
      }
    ],
    stays: [
      { lbl: 'Forest Retreat', name: 'The Mist Cabin, Coorg', loc: 'Gonikoppal, Karnataka', basePrice: 8500, rate: '4.9 ★', amen: 'Private plunge pool · Forest canopy view · Ayurvedic spa · Organic breakfast' },
      { lbl: 'Riverside Zen', name: 'Ananda in the Himalayas', loc: 'Narendra Nagar, Rishikesh', basePrice: 22000, rate: '4.8 ★', amen: 'Yoga & meditation · Ayurveda · Riverside infinity pool · Organic cuisine' },
      { lbl: 'Beachfront Villa', name: 'COMO Point Yamu, Phuket', loc: 'Cape Yamu, Phuket', basePrice: 18000, rate: '4.7 ★', amen: 'Private beach · 2 pools · Thai spa · Sea-facing suites' }
    ],
    days: [
      {
        day: 'Day 01', title: 'Arrival & Immersion', loc: 'Coorg, Karnataka', acts: [
          { t: '15:00', n: 'Private Transfer', d: 'Scenic mountain drive through coffee estates with curated playlist.' },
          { t: '17:30', n: 'Welcome Forest Walk', d: 'Barefoot trail through the estate with a local naturalist. No phones.' },
          { t: '19:30', n: 'Farm-to-Table Dinner', d: 'Served on your cabin terrace under the stars with Kodava cuisine.' }
        ]
      },
      {
        day: 'Day 02', title: 'Deep Rest & Stillness', loc: 'Coorg, Karnataka', acts: [
          { t: '06:00', n: 'Sunrise Sound Bath', d: 'Tibetan singing bowls meditation at the estate\'s forest clearing.' },
          { t: '09:00', n: 'Slow Breakfast in Mist', d: 'Coorg-style breakfast with freshly harvested coffee as the fog lifts.' },
          { t: '14:00', n: 'Abhyanga Massage', d: '2-hour warm oil massage at the property\'s private spa pavilion.' }
        ]
      },
      {
        day: 'Day 03', title: 'Waterfall & Reflection', loc: 'Abbey Falls, Coorg', acts: [
          { t: '07:00', n: 'Abbey Falls Dawn Hike', d: 'Private access before tourists arrive. Pure silence and mist.' },
          { t: '11:00', n: 'Journaling Workshop', d: 'Guided reflection session with mindfulness coach Meera Iyer.' },
          { t: '18:00', n: 'Farewell Bonfire', d: 'Cedar-scented bonfire by the lake with handcrafted cocktails.' }
        ]
      }
    ]
  },
  {
    id: 'adventure',
    cls: 'vibe-adventure',
    name: 'Wild Heart',
    tag: 'Movement & Adrenaline',
    subtitle: 'Explorer Mode',
    desc: 'For those who find peace in motion, heights, and the raw indifference of untamed nature.',
    cardImg: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    heroImg: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85',
    dests: [
      {
        city: 'Spiti Valley', country: 'Himachal Pradesh',
        img: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=85',
        r: '4.8', budget: '₹58,000', duration: '6 nights', match: 97,
        story: 'A cold desert at 4,000 metres where monasteries cling to cliffs and the silence is total. Spiti rewards those willing to trade comfort for altitude and awe.',
        weather: '8°C · High-altitude dry', best: 'May – Sep', budgetRange: '₹50k – ₹1L / person',
        attractions: ['Chandratal Lake circuit', 'Kanamo Peak summit', 'Ki Monastery', 'Langza fossil village'],
        restaurants: ['Ki Monastery butter-tea kitchen', 'Kaza Sol Cafe', 'Spiti Valley homestays'],
        companion: ['group', 'solo'], style: ['active'], availableNow: false
      },
      {
        city: 'Zanskar', country: 'Ladakh, India',
        img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85',
        r: '4.6', budget: '₹49,000', duration: '5 nights', match: 90,
        story: 'One of the last truly remote valleys in the Himalayas — river gorges, yak trails, and villages that see a handful of travelers a year.',
        weather: '10°C · Dry mountain air', best: 'Jun – Sep', budgetRange: '₹40k – ₹85k / person',
        attractions: ['Zanskar river rafting', 'Phugtal Monastery trek', 'Yak safari', 'Padum village walk'],
        restaurants: ['Ladakh Camp riverside kitchen', 'Monastery-hosted meals'],
        companion: ['group'], style: ['active'], availableNow: false
      },
      {
        city: 'Chamonix', country: 'France',
        img: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1200&q=85',
        r: '4.9', budget: '₹1,45,000', duration: '5 nights', match: 85,
        story: 'Beneath Mont Blanc, Chamonix is Europe\'s adrenaline capital — glacier trails, via ferrata, and alpine air that resets your whole nervous system.',
        weather: '6°C · Alpine crisp', best: 'Dec – Mar / Jun – Sep', budgetRange: '₹1.1L – ₹2.2L / person',
        attractions: ['Aiguille du Midi cable car', 'Mer de Glace glacier', 'Via ferrata routes', 'Summit skiing'],
        restaurants: ['Hôtel Mont-Blanc dining room', 'La Maison Carrier', 'Le Panier des 4 Saisons'],
        companion: ['partner', 'group'], style: ['active', 'luxury'], availableNow: true
      }
    ],
    stays: [
      { lbl: 'Clifftop Camp', name: 'Eagle Eye Ridge Camp', loc: 'Kaza, Spiti Valley', basePrice: 7500, rate: '4.9 ★', amen: 'High-altitude camping · All meals · Certified trek guides · Stargazing kit' },
      { lbl: 'Base Station', name: 'The Ladakh Camp, Zanskar', loc: 'Padum, Ladakh', basePrice: 5500, rate: '4.7 ★', amen: 'Heated tents · River rafting · Yak safari · Monk-cooked meals' },
      { lbl: 'Mountain Chalet', name: 'Hôtel Mont-Blanc, Chamonix', loc: 'Mont Blanc, France', basePrice: 28000, rate: '4.9 ★', amen: 'Ski-in/out · Heated floors · Summit views · Private guide' }
    ],
    days: [
      {
        day: 'Day 01', title: 'Into the Wild', loc: 'Spiti Valley', acts: [
          { t: '05:00', n: 'Pre-Dawn Jeep Convoy', d: 'From Manali through Rohtang Pass as the sky turns gold.' },
          { t: '13:00', n: 'Chandratal Lake Circuit', d: '8km trail around the crescent moon lake at 4,300m altitude.' },
          { t: '20:00', n: 'Camp Bonfire at Kunzum', d: 'Himalayan dhal and chai under the clearest night sky on earth.' }
        ]
      },
      {
        day: 'Day 02', title: 'Summit & Descent', loc: 'Kaza, Spiti', acts: [
          { t: '04:30', n: 'Kanamo Peak Summit', d: '6,250m non-technical summit. Guides: Tenzin and Dorje.' },
          { t: '14:00', n: 'Fossil Hunt at Langza', d: 'Ancient marine fossils in a village at 4,400m. Truly otherworldly.' },
          { t: '19:00', n: 'Monastery Dinner', d: 'Hosted by monks of Ki Monastery — butter tea included.' }
        ]
      },
      {
        day: 'Day 03', title: 'River & Rock', loc: 'Pin Valley', acts: [
          { t: '08:00', n: 'Class IV Rafting', d: 'Rapid descent through gorges cut 5,000m into the Himalayas.' },
          { t: '13:00', n: 'Rock Climbing Session', d: 'Sport climbing on granite faces with certified instructor.' },
          { t: '17:30', n: 'Golden Hour Ridge Walk', d: 'Panoramic views across Pin Valley as the sun sets over the peaks.' }
        ]
      }
    ]
  },
  {
    id: 'sacred',
    cls: 'vibe-sacred',
    name: 'Sacred Heritage',
    tag: 'Spirituality & History',
    subtitle: 'Divine Mode',
    desc: 'Ancient traditions, living faith, and the architecture of devotion across centuries of unbroken culture.',
    cardImg: 'https://i.pinimg.com/736x/83/5c/e6/835ce6ce03a7da236d46b7474dc17b37.jpg',
    heroImg: 'https://i.pinimg.com/736x/83/5c/e6/835ce6ce03a7da236d46b7474dc17b37.jpg',
    dests: [
      {
        city: 'Varanasi', country: 'Uttar Pradesh, India',
        img: 'https://i.pinimg.com/1200x/89/ae/f2/89aef2c17f12958be13eb09a9ff63f70.jpg',
        r: '4.7', budget: '₹52,000', duration: '4 nights', match: 98,
        story: 'The oldest living city on earth. Fire and river meet on the ghats every dawn and dusk, and 3,000 years of unbroken ritual carry on regardless of who watches.',
        weather: '24°C · Riverside warm', best: 'Oct – Mar', budgetRange: '₹40k – ₹95k / person',
        attractions: ['Dawn Ganga Aarti boat', 'Kashi Vishwanath darshan', 'Sarnath pilgrimage', 'Old city heritage walk'],
        restaurants: ['Brijrama Palace heritage dining', 'Kashi Chat Bhandar', 'Blue Lassi Shop'],
        companion: ['solo', 'group'], style: ['slow'], availableNow: true
      },
      {
        city: 'Hampi', country: 'Karnataka, India',
        img: 'https://i.pinimg.com/736x/07/75/2d/07752dbfa7d5b9c14349ee72ab24017b.jpg',
        r: '4.5', budget: '₹38,000', duration: '3 nights', match: 89,
        story: 'A ruined empire scattered across boulder-strewn plains. Hampi\'s temples feel less like monuments and more like they\'re still mid-prayer.',
        weather: '27°C · Dry & sunny', best: 'Oct – Feb', budgetRange: '₹28k – ₹65k / person',
        attractions: ['Virupaksha Temple at dawn', 'Coracle ride on Tungabhadra', 'Vittala Temple ruins', 'Matanga Hill sunset'],
        restaurants: ['Evolve Back local chef table', 'Mango Tree', 'Laughing Buddha'],
        companion: ['solo', 'partner'], style: ['slow', 'active'], availableNow: true
      },
      {
        city: 'Kyoto', country: 'Japan',
        img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85',
        r: '4.9', budget: '₹1,60,000', duration: '5 nights', match: 87,
        story: 'A thousand temples and a code of quiet precision. Kyoto turns devotion into design — raked gravel, still ponds, tea ceremonies measured in seconds of silence.',
        weather: '14°C · Mild & clear', best: 'Mar – May / Oct – Nov', budgetRange: '₹1.2L – ₹2.4L / person',
        attractions: ['Fushimi Inari torii gates', 'Kinkaku-ji golden pavilion', 'Tea ceremony at a ryokan', 'Arashiyama bamboo grove'],
        restaurants: ['Tawaraya kaiseki dinner', 'Gion district kaiseki', 'Nishiki Market stalls'],
        companion: ['partner'], style: ['slow', 'luxury'], availableNow: false
      }
    ],
    stays: [
      { lbl: 'Heritage Palace', name: 'Brijrama Palace, Varanasi', loc: 'Darbhanga Ghat, Varanasi', basePrice: 15500, rate: '5.0 ★', amen: 'Ganga-facing rooms · Private puja · Heritage dining · Ghat sunrise rituals' },
      { lbl: 'Temple View', name: 'Evolve Back Hampi', loc: 'Kamalapura, Hampi', basePrice: 9800, rate: '4.8 ★', amen: 'Ruins private access · Coracle boat · Stargazing · Local chef' },
      { lbl: 'Zen Ryokan', name: 'Tawaraya Ryokan, Kyoto', loc: 'Nakagyo-ku, Kyoto', basePrice: 32000, rate: '4.9 ★', amen: 'Kaiseki 8-course dinner · Private onsen · Tea ceremony · Garden suite' }
    ],
    days: [
      {
        day: 'Day 01', title: 'Arrival on the Ghats', loc: 'Varanasi, UP', acts: [
          { t: '05:30', n: 'Dawn Ganga Aarti', d: 'Private boat to witness the morning fire ritual from the water.' },
          { t: '09:00', n: 'Heritage Walk, Old City', d: 'Navigate 3,000-year-old lanes with scholar Dr. Alok Mishra.' },
          { t: '19:00', n: 'Evening Aarti Ceremony', d: 'Reserved platform above the ghats for the grand evening ceremony.' }
        ]
      },
      {
        day: 'Day 02', title: 'Living Temples', loc: 'Sarnath & Varanasi', acts: [
          { t: '07:00', n: 'Sarnath Pilgrimage', d: 'Where Buddha delivered his first sermon. Dhamek Stupa at dawn.' },
          { t: '12:00', n: 'Silk Weaving Workshop', d: 'Private class with Banarasi silk artisans at their looms.' },
          { t: '16:00', n: 'Kashi Vishwanath Darshan', d: 'VIP darshan facilitated by the temple trust. No queues.' }
        ]
      },
      {
        day: 'Day 03', title: 'The Eternal City at Dusk', loc: 'Varanasi Ghats', acts: [
          { t: '06:00', n: 'Manikarnika at Dawn', d: 'A quiet, respectful meditation at the sacred cremation ghats.' },
          { t: '11:00', n: 'Sanskrit Chanting', d: '90-min immersive chanting experience at Kashi Vidyapith.' },
          { t: '18:30', n: 'Farewell Puja on the Ganga', d: 'Personal ceremony with a pandit on a private boat at sunset.' }
        ]
      }
    ]
  },
  {
    id: 'aesthetic',
    cls: 'vibe-aesthetic',
    name: 'Modern Muse',
    tag: 'Design & Visual Culture',
    subtitle: 'Curated Offbeat',
    desc: 'Minimalist lines, extraordinary architecture, and stays that exist at the intersection of art and hospitality.',
    cardImg: 'https://i.pinimg.com/1200x/0b/f5/70/0bf570a2a7cf1e507d36db8ded2c9abd.jpg',
    heroImg: 'https://i.pinimg.com/1200x/0b/f5/70/0bf570a2a7cf1e507d36db8ded2c9abd.jpg',
    dests: [
      {
        city: 'Milan', country: 'Italy',
        img: 'https://i.pinimg.com/1200x/6f/20/88/6f208866e17f1a768d15dd8493ce956a.jpg',
        r: '4.6', budget: '₹1,40,000', duration: '4 nights', match: 95,
        story: 'Fashion capital by day, design archive by night. Milan\'s beauty is in restraint — a single Rem Koolhaas gallery says more than a hundred landmarks.',
        weather: '17°C · Mild city climate', best: 'Apr – Jun / Sep – Oct', budgetRange: '₹1L – ₹2.2L / person',
        attractions: ['Fondazione Prada tour', 'Armani/Silos archive', 'Navigli gallery walk', 'Duomo rooftop'],
        restaurants: ['Marchesi 1824', '10 Corso Como terrace', 'Ristorante Cracco'],
        companion: ['partner', 'group'], style: ['luxury'], availableNow: true
      },
      {
        city: 'Singapore', country: 'Southeast Asia',
        img: 'https://i.pinimg.com/1200x/ff/92/62/ff926215a168ced36d421051754d7ba8.jpg',
        r: '4.5', budget: '₹95,000', duration: '4 nights', match: 88,
        story: 'A city engineered like a gallery — heritage shophouses beside glass towers, art woven into infrastructure itself.',
        weather: '30°C · Tropical humid', best: 'Feb – Apr', budgetRange: '₹75k – ₹1.6L / person',
        attractions: ['Gardens by the Bay', 'Heritage shophouse trail', 'Gillman Barracks art district', 'National Gallery'],
        restaurants: ['The Warehouse Hotel bar', 'Odette', 'Chinatown hawker crawl'],
        companion: ['partner', 'group', 'solo'], style: ['luxury'], availableNow: true
      },
      {
        city: 'Copenhagen', country: 'Denmark',
        img: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1200&q=85',
        r: '4.7', budget: '₹1,55,000', duration: '5 nights', match: 84,
        story: 'Nordic minimalism at street level — bike lanes, hygge interiors, and a design culture so consistent it borders on philosophy.',
        weather: '11°C · Cool coastal', best: 'May – Aug', budgetRange: '₹1.2L – ₹2.3L / person',
        attractions: ['Tivoli Gardens', 'Designmuseum Danmark', 'Nyhavn waterfront', 'CopenHill architecture'],
        restaurants: ['Nimb Hotel rooftop', 'Noma-adjacent tasting menus', 'Torvehallerne market'],
        companion: ['partner'], style: ['luxury', 'slow'], availableNow: false
      }
    ],
    stays: [
      { lbl: 'Design Hotel', name: 'Bulgari Hotel Milano', loc: 'Via Privata Gabba, Milan', basePrice: 42000, rate: '4.9 ★', amen: 'Private spa · 2 Michelin restaurants · Art collection · Garden suite' },
      { lbl: 'Heritage Warehouse', name: 'The Warehouse Hotel', loc: 'Robertson Quay, Singapore', basePrice: 18500, rate: '4.8 ★', amen: 'Heritage architecture · Bespoke cocktail bar · Rooftop pool · Art tours' },
      { lbl: 'Nordic Loft', name: 'Nimb Hotel', loc: 'Tivoli Gardens, Copenhagen', basePrice: 22000, rate: '4.9 ★', amen: 'Tivoli private access · Michelin dining · Rooftop terrace · Design suites' }
    ],
    days: [
      {
        day: 'Day 01', title: 'Milan by Design', loc: 'Milan, Italy', acts: [
          { t: '10:00', n: 'Fondazione Prada Tour', d: 'Private tour through Rem Koolhaas-designed complex with a curator.' },
          { t: '14:00', n: 'Lunch at Marchesi 1824', d: 'The Bulgari Galleria — the most elegant pastry counter in Europe.' },
          { t: '17:00', n: 'Navigli Gallery Walk', d: 'Private access to 3 emerging artist studios along the canal district.' }
        ]
      },
      {
        day: 'Day 02', title: 'Fashion & Form', loc: 'Milan, Italy', acts: [
          { t: '09:00', n: 'Armani/Silos Visit', d: '40 years of Italian design in Giorgio Armani\'s private archive museum.' },
          { t: '13:00', n: 'Atelier Visit', d: 'Behind-the-scenes at an invitation-only luxury fashion atelier.' },
          { t: '19:00', n: 'Aperitivo at 10 Corso Como', d: 'Milan\'s most iconic concept store terrace.' }
        ]
      },
      {
        day: 'Day 03', title: 'Lake Como', loc: 'Lake Como, Italy', acts: [
          { t: '08:00', n: 'Villa Balbianello', d: 'Morning access before public opening. Alone with the lake and sky.' },
          { t: '13:00', n: 'Boat to Bellagio', d: 'Private wooden boat through the clearest water in Europe.' },
          { t: '17:00', n: 'Sunset at the Terrace', d: 'Prosecco as the Alps turn amber. The best single hour in Italy.' }
        ]
      }
    ]
  },
  {
    id: 'culture',
    cls: 'vibe-culture',
    name: 'Living Culture',
    tag: 'Food, Art & People',
    subtitle: 'Deep Local Mode',
    desc: 'Markets, kitchens, studios, and conversations that don\'t just show you a place — they change you.',
    cardImg: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=85',
    heroImg: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=85',
    dests: [
      {
        city: 'Jaipur', country: 'Rajasthan, India',
        img: 'https://i.pinimg.com/1200x/aa/5d/92/aa5d9273ec5f92954c510d75f4f1b19f.jpg',
        r: '4.6', budget: '₹46,000', duration: '4 nights', match: 94,
        story: 'The Pink City runs on artisans — gem cutters, block printers, puppeteers — practicing crafts passed down for centuries in the same lanes their grandparents worked.',
        weather: '26°C · Warm & dry', best: 'Oct – Mar', budgetRange: '₹35k – ₹80k / person',
        attractions: ['Amber Fort at dawn', 'Johari Bazaar market walk', 'Block-print studio visit', 'Nahargarh sunset'],
        restaurants: ['Samode Haveli garden dining', 'Suvarna Mahal', 'Local dal baati family lunch'],
        companion: ['solo', 'partner', 'group'], style: ['slow', 'active'], availableNow: true
      },
      {
        city: 'Istanbul', country: 'Turkey',
        img: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=85',
        r: '4.8', budget: '₹98,000', duration: '5 nights', match: 90,
        story: 'Two continents, one bazaar. Istanbul\'s culture lives in its spice markets, hammams, and the call to prayer echoing across the Bosphorus at dusk.',
        weather: '19°C · Mediterranean mild', best: 'Apr – Jun / Sep – Nov', budgetRange: '₹70k – ₹1.5L / person',
        attractions: ['Grand Bazaar', 'Hagia Sophia', 'Bosphorus sunset cruise', 'Turkish hammam ritual'],
        restaurants: ['Çırağan Palace terrace', 'Karaköy Lokantası', 'Balat neighborhood cafes'],
        companion: ['partner', 'group'], style: ['active', 'luxury'], availableNow: true
      },
      {
        city: 'Oaxaca', country: 'Mexico',
        img: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1200&q=85',
        r: '4.7', budget: '₹1,10,000', duration: '5 nights', match: 86,
        story: 'Mexico\'s culinary and craft capital — mezcal distilleries, mole recipes older than the country itself, and a market culture that never stopped being local.',
        weather: '23°C · Highland mild', best: 'Oct – Apr', budgetRange: '₹85k – ₹1.7L / person',
        attractions: ['Mercado Benito Juárez', 'Monte Albán ruins', 'Mezcal distillery tour', 'Textile weaving village'],
        restaurants: ['Casa Oaxaca rooftop', 'Los Danzantes', 'Street-side tlayudas'],
        companion: ['solo', 'partner'], style: ['active'], availableNow: false
      }
    ],
    stays: [
      { lbl: 'Heritage Haveli', name: 'Samode Haveli, Jaipur', loc: 'Gangapole, Jaipur', basePrice: 9800, rate: '4.8 ★', amen: '18th-century haveli · Pool · Durbar Hall · Garden dining · Puppet shows' },
      { lbl: 'Bosphorus Palace', name: 'Çırağan Palace Kempinski', loc: 'Beşiktaş, Istanbul', basePrice: 38000, rate: '5.0 ★', amen: 'Ottoman palace · Bosphorus suite · Private jetty · Turkish hammam' },
      { lbl: 'Casa Local', name: 'Casa Oaxaca Hotel', loc: 'Centro Histórico, Oaxaca', basePrice: 14000, rate: '4.9 ★', amen: 'Resident chef program · Rooftop mezcal bar · Art gallery · Market tours' }
    ],
    days: [
      {
        day: 'Day 01', title: 'Market to Table', loc: 'Jaipur, Rajasthan', acts: [
          { t: '07:00', n: 'Dawn Market Walk', d: 'With chef Manish Puri — buying ingredients at Johari Bazaar for your class.' },
          { t: '10:00', n: 'Cooking Masterclass', d: 'Cook a 6-course Rajasthani meal in a 300-year-old haveli kitchen.' },
          { t: '16:00', n: 'Block Print Studio', d: 'Master Ramesh teaches the 800-year-old Bagru technique in Sanganer.' }
        ]
      },
      {
        day: 'Day 02', title: 'Artisan & Archive', loc: 'Jaipur, Rajasthan', acts: [
          { t: '08:00', n: 'Gem Cutter\'s Workshop', d: 'Jaipur is the world\'s gem capital. A master cutter opens his atelier.' },
          { t: '13:00', n: 'Lunch with a Local Family', d: 'Home-cooked dal baati in a lived-in family home near Bani Park.' },
          { t: '18:00', n: 'Puppet Theatre', d: 'Private Kathputli performance by a third-generation puppeteer family.' }
        ]
      },
      {
        day: 'Day 03', title: 'Stories in Stone', loc: 'Amber & Nahargarh', acts: [
          { t: '06:00', n: 'Amber Fort at Dawn', d: 'Enter before opening hours through a side passage. Completely empty.' },
          { t: '11:00', n: 'Miniature Painting Class', d: 'A Mughal-era art form taught by miniaturist Amit Sharma in his studio.' },
          { t: '17:00', n: 'Nahargarh Farewell Dinner', d: 'The Pink City below you as the lights come on at dusk.' }
        ]
      }
    ]
  }
];

export const BUDGET_CONFIG = {
  budget: { multiplier: 1.0, expMul: 1.0, concMul: 0.6, label: '🌿 Budget', info: 'Comfortable guesthouses & local experiences. Best value.' },
  balanced: { multiplier: 1.6, expMul: 1.4, concMul: 1.0, label: '✦ Balanced', info: 'Boutique hotels, private guides, curated meals.' },
  premium: { multiplier: 2.8, expMul: 2.0, concMul: 1.8, label: '👑 Premium', info: 'Luxury properties, exclusive access, personal concierge 24/7.' }
};

export const getVibe = (id) => VIBES.find(v => v.id === id) || VIBES[0];
