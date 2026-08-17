const fs = require('fs');
const path = require('path');

const NEW_DATA = {
  calm: {
    dests: [
      { id: 'dest_munnar', city: 'Munnar', country: 'Kerala, India', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85', r: '4.8', budget: '₹48,000', duration: '3 nights', match: 94, story: 'Tea gardens rolling endlessly into the mist. Munnar is green, quiet, and smells of fresh rain.', weather: '20°C · Cool & breezy', best: 'Sep – Mar', budgetRange: '₹38k – ₹85k / person', attractions: ['Tea estate walk', 'Eravikulam National Park', 'Mattupetty Dam', 'Top Station sunrise'], restaurants: ['Rapsy Restaurant', 'Saravana Bhavan', 'Tea County dining'], companion: ['solo', 'partner'], style: ['slow'], availableNow: true },
      { id: 'dest_gokarna', city: 'Gokarna', country: 'Karnataka, India', img: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=85', r: '4.6', budget: '₹35,000', duration: '4 nights', match: 92, story: 'Where the Western Ghats meet the Arabian Sea. Quiet beaches and temple bells.', weather: '28°C · Tropical warm', best: 'Oct – Mar', budgetRange: '₹25k – ₹60k / person', attractions: ['Om Beach sunset', 'Mahabaleshwar Temple', 'Half Moon Beach trek', 'Mirjan Fort'], restaurants: ['Namaste Cafe', 'Mantra Cafe', 'Prema Restaurant'], companion: ['solo', 'group'], style: ['slow'], availableNow: true },
      { id: 'dest_tawang', city: 'Tawang', country: 'Arunachal Pradesh, India', img: 'https://images.unsplash.com/photo-1626083533860-63ce2f03de35?auto=format&fit=crop&w=1200&q=85', r: '4.9', budget: '₹65,000', duration: '5 nights', match: 95, story: 'Monasteries wrapped in clouds. A place so remote the journey itself is a meditation.', weather: '12°C · Crisp mountain air', best: 'Mar – May / Sep – Oct', budgetRange: '₹55k – ₹1L / person', attractions: ['Tawang Monastery', 'Sela Pass', 'Nuranang Falls', 'Bum La Pass'], restaurants: ['Dragon Restaurant', 'Woodland Restaurant', 'Monastery kitchen'], companion: ['solo', 'partner'], style: ['slow'], availableNow: true }
    ],
    stays: [
      { id: 'stay_windermere_estate', lbl: 'Plantation Retreat', name: 'Windermere Estate, Munnar', loc: 'Munnar, Kerala', basePrice: 12500, rate: '4.8 ★', amen: 'Tea tasting · Valley view · Organic food · Bonfire' },
      { id: 'stay_swaswara_gokarna', lbl: 'Wellness Retreat', name: 'SwaSwara, Gokarna', loc: 'Om Beach, Gokarna', basePrice: 18000, rate: '4.9 ★', amen: 'Ayurveda · Yoga · Private beach access · Vegan meals' },
      { id: 'stay_tawang_homestay', lbl: 'Mountain Homestay', name: 'Tawang Heights Homestay', loc: 'Tawang, Arunachal', basePrice: 4500, rate: '4.7 ★', amen: 'Local host · Valley views · Home-cooked meals · Heater' }
    ],
    days: [
      { day: 'Day 01', title: 'Arrival & Views', loc: 'Local area', acts: [{t:'14:00', n:'Check-in', d:'Settle into your retreat and enjoy the panoramic views.'}, {t:'16:30', n:'Evening Stroll', d:'Walk around the property.'}, {t:'19:30', n:'Dinner', d:'Quiet local dinner.'}] },
      { day: 'Day 01', title: 'Arrival & Views', loc: 'Local area', acts: [{t:'14:00', n:'Check-in', d:'Settle into your retreat and enjoy the panoramic views.'}, {t:'16:30', n:'Evening Stroll', d:'Walk around the property.'}, {t:'19:30', n:'Dinner', d:'Quiet local dinner.'}] },
      { day: 'Day 01', title: 'Arrival & Views', loc: 'Local area', acts: [{t:'14:00', n:'Check-in', d:'Settle into your retreat and enjoy the panoramic views.'}, {t:'16:30', n:'Evening Stroll', d:'Walk around the property.'}, {t:'19:30', n:'Dinner', d:'Quiet local dinner.'}] }
    ]
  },
  adventure: {
    dests: [
      { id: 'dest_gulmarg', city: 'Gulmarg', country: 'Jammu & Kashmir, India', img: 'https://images.unsplash.com/photo-1605640840469-87c12658a2d3?auto=format&fit=crop&w=1200&q=85', r: '4.9', budget: '₹75,000', duration: '4 nights', match: 96, story: 'Powder snow and the highest gondola in the world. Pure alpine adrenaline.', weather: '2°C · Snowy', best: 'Dec – Mar', budgetRange: '₹60k – ₹1.2L / person', attractions: ['Gulmarg Gondola', 'Apharwat Peak skiing', 'Alpather Lake trek', 'Igloo cafe'], restaurants: ['Highland Park', 'Nedous Dining', 'Bakshi Restaurant'], companion: ['partner', 'group'], style: ['active', 'luxury'], availableNow: true },
      { id: 'dest_auli', city: 'Auli', country: 'Uttarakhand, India', img: 'https://images.unsplash.com/photo-1610014022416-8968981f92e8?auto=format&fit=crop&w=1200&q=85', r: '4.7', budget: '₹52,000', duration: '4 nights', match: 93, story: 'Ski slopes backed by Nanda Devi. The Himalayas at their most dramatic.', weather: '5°C · Cold & clear', best: 'Jan – Mar', budgetRange: '₹45k – ₹90k / person', attractions: ['Auli Ropeway', 'Gorson Bugyal trek', 'Artificial Lake', 'Skiing lessons'], restaurants: ['Cliff Top Club dining', 'Auli D and D', 'GMVN Canteen'], companion: ['solo', 'group'], style: ['active'], availableNow: true },
      { id: 'dest_bir_billing', city: 'Bir Billing', country: 'Himachal Pradesh, India', img: 'https://images.unsplash.com/photo-1598273617325-1e8131336c5f?auto=format&fit=crop&w=1200&q=85', r: '4.8', budget: '₹35,000', duration: '3 nights', match: 94, story: 'The paragliding capital of India. Leap from the mountains and soar above the valleys.', weather: '18°C · Pleasant', best: 'Sep – Nov / Mar – Jun', budgetRange: '₹25k – ₹60k / person', attractions: ['Tandem Paragliding', 'Chokling Monastery', 'Sherab Ling', 'Deer Park Institute'], restaurants: ['Avva Cafe', 'Silver Linings', 'Northern Cafe'], companion: ['solo', 'group'], style: ['active'], availableNow: true }
    ],
    stays: [
      { id: 'stay_khyber_gulmarg', lbl: 'Luxury Resort', name: 'The Khyber Resort, Gulmarg', loc: 'Gulmarg, J&K', basePrice: 28000, rate: '4.9 ★', amen: 'Heated pool · Spa · Ski concierge · Mountain views' },
      { id: 'stay_cliff_top_auli', lbl: 'Ski Resort', name: 'Cliff Top Club, Auli', loc: 'Auli, Uttarakhand', basePrice: 12000, rate: '4.5 ★', amen: 'Ski-in/out · Hot water · Bonfire · Summit views' },
      { id: 'stay_bir_camp', lbl: 'Glamping', name: 'Camp Oak View, Bir', loc: 'Bir Billing, HP', basePrice: 3500, rate: '4.8 ★', amen: 'Luxury tents · Paragliding tie-ups · Bonfire · Trek guides' }
    ],
    days: [
      { day: 'Day 01', title: 'Arrival & Views', loc: 'Local area', acts: [{t:'14:00', n:'Check-in', d:'Settle into your retreat and enjoy the panoramic views.'}, {t:'16:30', n:'Evening Stroll', d:'Walk around the property.'}, {t:'19:30', n:'Dinner', d:'Quiet local dinner.'}] },
      { day: 'Day 01', title: 'Arrival & Views', loc: 'Local area', acts: [{t:'14:00', n:'Check-in', d:'Settle into your retreat and enjoy the panoramic views.'}, {t:'16:30', n:'Evening Stroll', d:'Walk around the property.'}, {t:'19:30', n:'Dinner', d:'Quiet local dinner.'}] },
      { day: 'Day 01', title: 'Arrival & Views', loc: 'Local area', acts: [{t:'14:00', n:'Check-in', d:'Settle into your retreat and enjoy the panoramic views.'}, {t:'16:30', n:'Evening Stroll', d:'Walk around the property.'}, {t:'19:30', n:'Dinner', d:'Quiet local dinner.'}] }
    ]
  },
  sacred: {
    dests: [
      { id: 'dest_madurai', city: 'Madurai', country: 'Tamil Nadu, India', img: 'https://images.unsplash.com/photo-1616086708493-27038890db8f?auto=format&fit=crop&w=1200&q=85', r: '4.8', budget: '₹40,000', duration: '3 nights', match: 95, story: 'A city built around the spectacular Meenakshi Temple. The pulse of Tamil culture.', weather: '32°C · Warm', best: 'Oct – Mar', budgetRange: '₹30k – ₹70k / person', attractions: ['Meenakshi Amman Temple', 'Thirumalai Nayakkar Mahal', 'Gandhi Museum', 'Flower market'], restaurants: ['Murugan Idli Shop', 'Kumar Mess', 'Amma Mess'], companion: ['solo', 'group'], style: ['slow', 'active'], availableNow: true },
      { id: 'dest_amritsar', city: 'Amritsar', country: 'Punjab, India', img: 'https://images.unsplash.com/photo-1590050882772-2d1847144e05?auto=format&fit=crop&w=1200&q=85', r: '4.9', budget: '₹35,000', duration: '3 nights', match: 96, story: 'The Golden Temple glows at dawn, offering peace and langar to all who visit.', weather: '24°C · Pleasant', best: 'Oct – Mar', budgetRange: '₹25k – ₹65k / person', attractions: ['Golden Temple', 'Jallianwala Bagh', 'Wagah Border ceremony', 'Partition Museum'], restaurants: ['Kesar Da Dhaba', 'Bharawan Da Dhaba', 'Langar hall'], companion: ['solo', 'group'], style: ['slow', 'active'], availableNow: true },
      { id: 'dest_konark', city: 'Konark', country: 'Odisha, India', img: 'https://images.unsplash.com/photo-1610488663189-e58f000305f8?auto=format&fit=crop&w=1200&q=85', r: '4.7', budget: '₹32,000', duration: '3 nights', match: 92, story: 'The magnificent Sun Temple stands as a masterpiece of ancient Indian architecture.', weather: '30°C · Tropical', best: 'Sep – Mar', budgetRange: '₹22k – ₹60k / person', attractions: ['Sun Temple', 'Chandrabhaga Beach', 'ASI Museum', 'Ramachandi Temple'], restaurants: ['Marwari Bhojnalaya', 'Lotus Resort Dining', 'Local seafood shacks'], companion: ['solo', 'group'], style: ['slow'], availableNow: true }
    ],
    stays: [
      { id: 'stay_heritage_madurai', lbl: 'Heritage Hotel', name: 'Heritage Madurai', loc: 'Madurai, TN', basePrice: 8500, rate: '4.7 ★', amen: 'Temple architecture · Pool · Banyan tree dining · Spa' },
      { id: 'stay_taj_swarna', lbl: 'Luxury Hotel', name: 'Taj Swarna, Amritsar', loc: 'Amritsar, Punjab', basePrice: 11000, rate: '4.9 ★', amen: 'City views · Jiva Spa · Fine dining · Pool' },
      { id: 'stay_lotus_resort', lbl: 'Eco Resort', name: 'Lotus Eco Resort', loc: 'Konark, Odisha', basePrice: 6500, rate: '4.5 ★', amen: 'Beach access · Sustainable · Local cuisine · Private villas' }
    ],
    days: [
      { day: 'Day 01', title: 'Arrival & Views', loc: 'Local area', acts: [{t:'14:00', n:'Check-in', d:'Settle into your retreat and enjoy the panoramic views.'}, {t:'16:30', n:'Evening Stroll', d:'Walk around the property.'}, {t:'19:30', n:'Dinner', d:'Quiet local dinner.'}] },
      { day: 'Day 01', title: 'Arrival & Views', loc: 'Local area', acts: [{t:'14:00', n:'Check-in', d:'Settle into your retreat and enjoy the panoramic views.'}, {t:'16:30', n:'Evening Stroll', d:'Walk around the property.'}, {t:'19:30', n:'Dinner', d:'Quiet local dinner.'}] },
      { day: 'Day 01', title: 'Arrival & Views', loc: 'Local area', acts: [{t:'14:00', n:'Check-in', d:'Settle into your retreat and enjoy the panoramic views.'}, {t:'16:30', n:'Evening Stroll', d:'Walk around the property.'}, {t:'19:30', n:'Dinner', d:'Quiet local dinner.'}] }
    ]
  },
  aesthetic: {
    dests: [
      { id: 'dest_chandigarh', city: 'Chandigarh', country: 'Punjab, India', img: 'https://images.unsplash.com/photo-1627885741708-59616e00cfb6?auto=format&fit=crop&w=1200&q=85', r: '4.6', budget: '₹45,000', duration: '3 nights', match: 91, story: 'Le Corbusier\'s modernist masterpiece in concrete and green spaces.', weather: '25°C · Pleasant', best: 'Oct – Mar', budgetRange: '₹35k – ₹80k / person', attractions: ['Rock Garden', 'Capitol Complex', 'Sukhna Lake', 'Le Corbusier Centre'], restaurants: ['Virgin Courtyard', 'Swagath', 'Pal Dhaba'], companion: ['solo', 'partner'], style: ['slow', 'luxury'], availableNow: true },
      { id: 'dest_auroville', city: 'Auroville', country: 'Tamil Nadu, India', img: 'https://images.unsplash.com/photo-1596711516035-c34f5de0e7da?auto=format&fit=crop&w=1200&q=85', r: '4.8', budget: '₹35,000', duration: '4 nights', match: 94, story: 'An experimental township dedicated to human unity and unique sustainable architecture.', weather: '31°C · Humid', best: 'Nov – Mar', budgetRange: '₹25k – ₹65k / person', attractions: ['Matrimandir', 'Auroville Bakery', 'Svaram', 'Quiet Healing Center'], restaurants: ['Tanto Pizzeria', 'Marcs Cafe', 'Naturellement'], companion: ['solo', 'group'], style: ['slow'], availableNow: true },
      { id: 'dest_mumbai', city: 'Mumbai', country: 'Maharashtra, India', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=85', r: '4.7', budget: '₹85,000', duration: '4 nights', match: 92, story: 'Art deco buildings in Kala Ghoda, modern galleries, and a skyline that never stops growing.', weather: '30°C · Humid', best: 'Oct – Mar', budgetRange: '₹60k – ₹1.5L / person', attractions: ['Kala Ghoda art walk', 'CSMT heritage tour', 'Marine Drive', 'Bandra street art'], restaurants: ['The Bombay Canteen', 'Leopold Cafe', 'Masque'], companion: ['partner', 'group'], style: ['active', 'luxury'], availableNow: true },
      { id: 'dest_kochi', city: 'Kochi', country: 'Kerala, India', img: 'https://images.unsplash.com/photo-1593693397690-362cb9666cb3?auto=format&fit=crop&w=1200&q=85', r: '4.7', budget: '₹55,000', duration: '4 nights', match: 93, story: 'The Kochi Muziris Biennale has turned this heritage port city into India\'s global art hub.', weather: '29°C · Tropical', best: 'Sep – Mar', budgetRange: '₹40k – ₹95k / person', attractions: ['Fort Kochi Biennale spaces', 'Chinese Fishing Nets', 'Jew Town', 'Mattancherry Palace'], restaurants: ['Kashi Art Cafe', 'Oceanos', 'Qissa Cafe'], companion: ['solo', 'partner'], style: ['slow', 'active'], availableNow: true },
      { id: 'dest_gurugram', city: 'Gurugram', country: 'Haryana, India', img: 'https://images.unsplash.com/photo-1598282302307-e070d65b7045?auto=format&fit=crop&w=1200&q=85', r: '4.5', budget: '₹65,000', duration: '3 nights', match: 89, story: 'Glass skyscrapers, Cyber Hub aesthetics, and the pulse of modern corporate India.', weather: '32°C · Warm', best: 'Oct – Mar', budgetRange: '₹50k – ₹1.2L / person', attractions: ['Cyber Hub', 'Museo Camera', 'Aravalli Biodiversity Park', 'Ambience Mall'], restaurants: ['Farzi Cafe', 'Indian Accent (Delhi nearby)', 'Comorin'], companion: ['partner', 'group'], style: ['active', 'luxury'], availableNow: true }
    ],
    stays: [
      { id: 'stay_taj_chandigarh', lbl: 'Luxury Hotel', name: 'Taj Chandigarh', loc: 'Chandigarh, Punjab', basePrice: 12000, rate: '4.8 ★', amen: 'City views · Spa · Fine dining · Pool' },
      { id: 'stay_auroville_guest', lbl: 'Eco Guesthouse', name: 'Auroville Guest House', loc: 'Auroville, TN', basePrice: 3500, rate: '4.6 ★', amen: 'Organic farm · Solar powered · Yoga space · Vegan cafe' },
      { id: 'stay_taj_mahal_palace', lbl: 'Heritage Luxury', name: 'The Taj Mahal Palace', loc: 'Colaba, Mumbai', basePrice: 25000, rate: '4.9 ★', amen: 'Sea view · Historic architecture · Michelin chefs · Jiva Spa' },
      { id: 'stay_brunton_boatyard', lbl: 'Heritage Hotel', name: 'Brunton Boatyard', loc: 'Fort Kochi, Kerala', basePrice: 16000, rate: '4.8 ★', amen: 'Harbour views · Colonial architecture · Ayurvedic spa · Seafood dining' },
      { id: 'stay_leela_ambience', lbl: 'Modern Luxury', name: 'The Leela Ambience', loc: 'Gurugram, Haryana', basePrice: 18000, rate: '4.7 ★', amen: 'Skyline views · Award-winning spa · Spectra dining · Club lounge' }
    ],
    days: [
      { day: 'Day 01', title: 'Arrival & Views', loc: 'Local area', acts: [{t:'14:00', n:'Check-in', d:'Settle into your retreat and enjoy the panoramic views.'}, {t:'16:30', n:'Evening Stroll', d:'Walk around the property.'}, {t:'19:30', n:'Dinner', d:'Quiet local dinner.'}] },
      { day: 'Day 01', title: 'Arrival & Views', loc: 'Local area', acts: [{t:'14:00', n:'Check-in', d:'Settle into your retreat and enjoy the panoramic views.'}, {t:'16:30', n:'Evening Stroll', d:'Walk around the property.'}, {t:'19:30', n:'Dinner', d:'Quiet local dinner.'}] },
      { day: 'Day 01', title: 'Arrival & Views', loc: 'Local area', acts: [{t:'14:00', n:'Check-in', d:'Settle into your retreat and enjoy the panoramic views.'}, {t:'16:30', n:'Evening Stroll', d:'Walk around the property.'}, {t:'19:30', n:'Dinner', d:'Quiet local dinner.'}] },
      { day: 'Day 01', title: 'Arrival & Views', loc: 'Local area', acts: [{t:'14:00', n:'Check-in', d:'Settle into your retreat and enjoy the panoramic views.'}, {t:'16:30', n:'Evening Stroll', d:'Walk around the property.'}, {t:'19:30', n:'Dinner', d:'Quiet local dinner.'}] },
      { day: 'Day 01', title: 'Arrival & Views', loc: 'Local area', acts: [{t:'14:00', n:'Check-in', d:'Settle into your retreat and enjoy the panoramic views.'}, {t:'16:30', n:'Evening Stroll', d:'Walk around the property.'}, {t:'19:30', n:'Dinner', d:'Quiet local dinner.'}] }
    ]
  },
  culture: {
    dests: [
      { id: 'dest_kolkata', city: 'Kolkata', country: 'West Bengal, India', img: 'https://images.unsplash.com/photo-1627914856019-21a418659d4c?auto=format&fit=crop&w=1200&q=85', r: '4.7', budget: '₹42,000', duration: '4 nights', match: 94, story: 'The cultural capital. Sweets, literature, and colonial heritage in every lane.', weather: '32°C · Humid', best: 'Oct – Mar', budgetRange: '₹30k – ₹75k / person', attractions: ['Victoria Memorial', 'Kumartuli idol makers', 'College Street books', 'Howrah Bridge'], restaurants: ['Peter Cat', '6 Ballygunge Place', 'Flurys'], companion: ['solo', 'group'], style: ['slow', 'active'], availableNow: true },
      { id: 'dest_jodhpur', city: 'Jodhpur', country: 'Rajasthan, India', img: 'https://images.unsplash.com/photo-1598273617325-1e8131336c5f?auto=format&fit=crop&w=1200&q=85', r: '4.8', budget: '₹48,000', duration: '3 nights', match: 95, story: 'The Blue City wrapped around the mighty Mehrangarh Fort. Marwari culture thrives here.', weather: '28°C · Dry & warm', best: 'Oct – Mar', budgetRange: '₹35k – ₹85k / person', attractions: ['Mehrangarh Fort', 'Jaswant Thada', 'Clock Tower market', 'Umaid Bhawan'], restaurants: ['Indique', 'Gypsy Restaurant', 'Janta Sweet Home'], companion: ['solo', 'partner'], style: ['active', 'luxury'], availableNow: true },
      { id: 'dest_lucknow', city: 'Lucknow', country: 'Uttar Pradesh, India', img: 'https://images.unsplash.com/photo-1627885741708-59616e00cfb6?auto=format&fit=crop&w=1200&q=85', r: '4.6', budget: '₹40,000', duration: '3 nights', match: 92, story: 'The city of Nawabs. Awadhi cuisine and Chikankari embroidery define the local soul.', weather: '30°C · Warm', best: 'Oct – Mar', budgetRange: '₹28k – ₹70k / person', attractions: ['Bara Imambara', 'Rumi Darwaza', 'Hazratganj market', 'Chowk walk'], restaurants: ['Tunday Kababi', 'Dastarkhwan', 'Idris Biryani'], companion: ['group'], style: ['slow', 'active'], availableNow: true },
      { id: 'dest_mysore', city: 'Mysore', country: 'Karnataka, India', img: 'https://images.unsplash.com/photo-1616086708493-27038890db8f?auto=format&fit=crop&w=1200&q=85', r: '4.7', budget: '₹38,000', duration: '3 nights', match: 93, story: 'Silk, sandalwood, and royal palaces. The cultural heart of Karnataka.', weather: '26°C · Pleasant', best: 'Sep – Mar', budgetRange: '₹25k – ₹65k / person', attractions: ['Mysore Palace', 'Chamundi Hill', 'Devaraja Market', 'Silk factory tour'], restaurants: ['Mylari Agrahara', 'RRR Biryani', 'Green Leaf'], companion: ['solo', 'partner'], style: ['slow'], availableNow: true }
    ],
    stays: [
      { id: 'stay_oberoi_grand', lbl: 'Heritage Luxury', name: 'The Oberoi Grand', loc: 'Kolkata, WB', basePrice: 15000, rate: '4.9 ★', amen: 'Colonial charm · Pool · Threesixtythree dining · Spa' },
      { id: 'stay_raas_jodhpur', lbl: 'Boutique Hotel', name: 'RAAS Jodhpur', loc: 'Jodhpur, Rajasthan', basePrice: 22000, rate: '4.8 ★', amen: 'Fort views · Heritage restoration · Stepwell dining · Spa' },
      { id: 'stay_vivanta_lucknow', lbl: 'Modern Comfort', name: 'Vivanta by Taj', loc: 'Lucknow, UP', basePrice: 10500, rate: '4.6 ★', amen: 'City views · Pool · Awadhi dining · Fitness center' },
      { id: 'stay_lalitha_mahal', lbl: 'Palace Hotel', name: 'Lalitha Mahal Palace', loc: 'Mysore, Karnataka', basePrice: 8500, rate: '4.4 ★', amen: 'Palace architecture · Royal dining · Billiards room · Gardens' }
    ],
    days: [
      { day: 'Day 01', title: 'Arrival & Views', loc: 'Local area', acts: [{t:'14:00', n:'Check-in', d:'Settle into your retreat and enjoy the panoramic views.'}, {t:'16:30', n:'Evening Stroll', d:'Walk around the property.'}, {t:'19:30', n:'Dinner', d:'Quiet local dinner.'}] },
      { day: 'Day 01', title: 'Arrival & Views', loc: 'Local area', acts: [{t:'14:00', n:'Check-in', d:'Settle into your retreat and enjoy the panoramic views.'}, {t:'16:30', n:'Evening Stroll', d:'Walk around the property.'}, {t:'19:30', n:'Dinner', d:'Quiet local dinner.'}] },
      { day: 'Day 01', title: 'Arrival & Views', loc: 'Local area', acts: [{t:'14:00', n:'Check-in', d:'Settle into your retreat and enjoy the panoramic views.'}, {t:'16:30', n:'Evening Stroll', d:'Walk around the property.'}, {t:'19:30', n:'Dinner', d:'Quiet local dinner.'}] },
      { day: 'Day 01', title: 'Arrival & Views', loc: 'Local area', acts: [{t:'14:00', n:'Check-in', d:'Settle into your retreat and enjoy the panoramic views.'}, {t:'16:30', n:'Evening Stroll', d:'Walk around the property.'}, {t:'19:30', n:'Dinner', d:'Quiet local dinner.'}] }
    ]
  }
};

const vibesPath = path.join(__dirname, 'src/data/vibes.js');
let code = fs.readFileSync(vibesPath, 'utf8');

// Replace export const VIBES = [ with const RAW_VIBES = [
code = code.replace('export const VIBES = [', 'const RAW_VIBES = [');

const endOfArrayMatch = code.indexOf('export const BUDGET_CONFIG');
let vibesPart = code.substring(0, endOfArrayMatch);
let restPart = code.substring(endOfArrayMatch);

const modifierScript = [
  "// Inject new Indian destinations",
  "const NEW_DATA = " + JSON.stringify(NEW_DATA, null, 2) + ";",
  "RAW_VIBES.forEach(vibe => {",
  "  if (NEW_DATA[vibe.id]) {",
  "    vibe.dests.push(...NEW_DATA[vibe.id].dests);",
  "    vibe.stays.push(...NEW_DATA[vibe.id].stays);",
  "    vibe.days.push(...NEW_DATA[vibe.id].days);",
  "  }",
  "});",
  "",
  "// Filter out non-India data",
  "export const VIBES = RAW_VIBES.map(vibe => {",
  "  const isIndia = d => d.country.includes('India');",
  "  const validIndices = vibe.dests.map((d, i) => isIndia(d) ? i : -1).filter(i => i !== -1);",
  "  return {",
  "    ...vibe,",
  "    dests: validIndices.map(i => vibe.dests[i]),",
  "    stays: validIndices.map(i => vibe.stays[i] || vibe.stays[0]),",
  "    days: validIndices.map(i => vibe.days[i] || vibe.days[0])",
  "  };",
  "});",
  ""
].join('\\n');

let finalCode = vibesPart + modifierScript + restPart;

const appendImageDb = [
  "// Append new images to IMAGE_DB",
  "Object.keys(NEW_DATA).forEach(vid => {",
  "  NEW_DATA[vid].dests.forEach(d => {",
  "    IMAGE_DB[d.id] = [d.img];",
  "  });",
  "});"
].join('\\n');

finalCode += '\\n' + appendImageDb;

fs.writeFileSync(vibesPath, finalCode, 'utf8');
console.log('Modified vibes.js successfully');
