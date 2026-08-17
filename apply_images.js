import fs from 'fs';

let vibesCode = fs.readFileSync('./src/data/vibes.js', 'utf8');
let evalCode = vibesCode.replace(/export const /g, 'const ');
evalCode += '\n global.VIBES = VIBES; global.BUDGET_CONFIG = BUDGET_CONFIG;';
eval(evalCode);

const VIBES = global.VIBES;
const BUDGET_CONFIG = global.BUDGET_CONFIG;
const imagesData = JSON.parse(fs.readFileSync('images_data.json', 'utf8'));

const vibeMapping = {
  'calm': ['Spiti Valley', 'Munnar', 'Coorg'],
  'adventure': ['Rishikesh', 'Bir Billing'],
  'sacred': ['Hampi', 'Varanasi', 'Amritsar'],
  'aesthetic': ['Pondicherry', 'Jaipur'],
  'culture': ['Meghalaya', 'Ziro Valley']
};

const templateDest = VIBES[0].dests[0];

VIBES.forEach(vibe => {
  const newDests = [];
  const targetCities = vibeMapping[vibe.id] || [];

  targetCities.forEach(city => {
    let existingDest = null;
    VIBES.forEach(v => {
      const found = v.dests.find(d => d.city === city);
      if (found) existingDest = found;
    });

    const dest = JSON.parse(JSON.stringify(existingDest || templateDest));
    dest.id = 'dest_' + city.toLowerCase().replace(/\s+/g, '_');
    dest.city = city;

    const imgs = imagesData[city];
    if (imgs) {
      dest.img = imgs.hero;
      dest.gallery = imgs.gallery;

      if (dest.hotels) {
        dest.hotels.forEach(h => h.img = imgs.hotel);
      }

      if (dest.experiences) {
        dest.experiences.forEach(e => e.img = imgs.exp);
      }
    }

    newDests.push(dest);
  });

  vibe.dests = newDests;
});

let output = '// Auto-generated detailed mock data\n';
output += 'export const VIBES = ' + JSON.stringify(VIBES, null, 2) + ';\n\n';
output += 'export const BUDGET_CONFIG = ' + JSON.stringify(BUDGET_CONFIG, null, 2) + ';\n\n';
output += 'export const getVibe = (id) => VIBES.find(v => v.id === id) || VIBES[0];\n\n';
output += `export const getImages = (id, title = 'Image') => {
  for (const vibe of VIBES) {
    const dest = vibe.dests.find(d => d.id === id);
    if (dest && dest.gallery && dest.gallery.length > 0) return dest.gallery;
    if (dest && dest.img) return [dest.img];
  }
  return ['https://images.unsplash.com/photo-1506461883276-594a12b11ac3?auto=format&fit=crop&w=600&q=85'];
};
`;

fs.writeFileSync('src/data/vibes.js', output);
console.log('Applied images and updated vibes.js');
