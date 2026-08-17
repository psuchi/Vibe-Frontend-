import fs from 'fs';
import { VIBES } from './src/data/vibes.js';

// Clean up weird encoding artifacts if any exist at the end of the VIBES object or file
const defaultCompanions = {
  calm: ['solo', 'partner'],
  adventure: ['group', 'solo'],
  sacred: ['solo', 'partner', 'group'],
  aesthetic: ['partner', 'solo'],
  culture: ['solo', 'partner', 'group']
};

const defaultStyles = {
  calm: ['slow', 'luxury'],
  adventure: ['active'],
  sacred: ['slow'],
  aesthetic: ['luxury', 'slow'],
  culture: ['slow']
};

const newCities = {
  calm: [
    { city: "Tawang", story: "Monasteries, mountains, and untouched nature." },
    { city: "Gokarna", story: "Quiet beaches and spiritual temples." },
    { city: "Varkala", story: "Cliffside views and laid-back coastal vibe." },
    { city: "Lansdowne", story: "Pine forests and peaceful walks." },
    { city: "Khajjiar", story: "The mini Switzerland of India." },
    { city: "Pahalgam", story: "Valleys of peace and serene rivers." }
  ],
  adventure: [
    { city: "Manali", story: "Gateway to the snowy peaks and extreme sports." },
    { city: "Auli", story: "Skiing slopes and breathtaking altitudes." },
    { city: "Gulmarg", story: "World-class snowboarding and gondola rides." },
    { city: "Andaman", story: "Scuba diving into vibrant coral reefs." },
    { city: "Leh", story: "High altitude trekking and rugged terrains." },
    { city: "Dandeli", story: "River rafting in dense forests." }
  ],
  sacred: [
    { city: "Bodh Gaya", story: "The place of enlightenment." },
    { city: "Pushkar", story: "Holy lake and vibrant temples." },
    { city: "Rameswaram", story: "A spiritual island journey." },
    { city: "Madurai", story: "Ancient temples and rich history." },
    { city: "Haridwar", story: "Aarti on the banks of the Ganges." },
    { city: "Tirupati", story: "One of the most visited pilgrimage centers." }
  ],
  aesthetic: [
    { city: "Udaipur", story: "City of lakes and royal palaces." },
    { city: "Jodhpur", story: "The blue city with grand forts." },
    { city: "Mysore", story: "Palatial grandeur and rich silk heritage." },
    { city: "Srinagar", story: "Houseboats on the Dal Lake." },
    { city: "Kochi", story: "Colonial architecture and fishing nets." },
    { city: "Agra", story: "Home to the iconic Taj Mahal." }
  ],
  culture: [
    { city: "Kolkata", story: "The cultural capital of India." },
    { city: "Lucknow", story: "City of Nawabs and exquisite cuisine." },
    { city: "Kutch", story: "White desert and vibrant handicrafts." },
    { city: "Khajuraho", story: "Intricate temple carvings." },
    { city: "Majuli", story: "The largest river island with unique traditions." },
    { city: "Bhubaneswar", story: "The temple city of India." }
  ]
};

// Filter out old ones that might have been added to VIBES previously so we don't duplicate
const seenCities = new Set();
VIBES.forEach(v => {
  v.dests = v.dests.filter(d => {
    if (seenCities.has(d.city)) return false;
    seenCities.add(d.city);
    return true;
  });
});

VIBES.forEach(v => {
  v.dests.forEach(d => {
    d.companion = d.companion || defaultCompanions[v.id];
    d.style = d.style || defaultStyles[v.id];
  });
});

const clone = (obj) => JSON.parse(JSON.stringify(obj));

VIBES.forEach(v => {
  const baseDest = v.dests[0];
  const citiesToAdd = newCities[v.id] || [];
  
  citiesToAdd.forEach(nc => {
    if (seenCities.has(nc.city)) return;
    const newDest = clone(baseDest);
    newDest.id = 'dest_' + nc.city.toLowerCase().replace(/[^a-z]/g, '_');
    newDest.city = nc.city;
    newDest.story = nc.story;
    newDest.lat = parseFloat((10 + Math.random() * 20).toFixed(2));
    newDest.lng = parseFloat((70 + Math.random() * 20).toFixed(2));
    
    newDest.flights.forEach(f => {
      f.to = nc.city.substring(0, 3).toUpperCase();
    });
    newDest.hotels.forEach(h => {
      h.name = h.name.replace(baseDest.city, nc.city);
      h.loc = h.loc.replace(baseDest.city, nc.city);
    });
    newDest.experiences.forEach(e => {
      e.name = e.name.replace(baseDest.city, nc.city);
      e.desc = e.desc.replace(baseDest.city, nc.city);
    });
    
    newDest.companion = defaultCompanions[v.id];
    newDest.style = defaultStyles[v.id];
    
    v.dests.push(newDest);
    seenCities.add(nc.city);
  });
});

const output = `// Auto-generated detailed mock data\nexport const VIBES = ${JSON.stringify(VIBES, null, 2)};\n\nexport const getVibe = (id) => VIBES.find(v => v.id === id) || VIBES[0];\n`;

fs.writeFileSync('src/data/vibes.js', output, 'utf8');
console.log('Done!');
