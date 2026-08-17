const fs = require('fs');

const coords = {
  'Spiti Valley': { lat: 32.22, lng: 78.03 },
  'Munnar': { lat: 10.08, lng: 77.06 },
  'Coorg': { lat: 12.33, lng: 75.80 },
  'Rishikesh': { lat: 30.08, lng: 78.26 },
  'Bir Billing': { lat: 32.04, lng: 76.72 },
  'Hampi': { lat: 15.33, lng: 76.46 },
  'Varanasi': { lat: 25.31, lng: 83.00 },
  'Amritsar': { lat: 31.63, lng: 74.87 },
  'Pondicherry': { lat: 11.94, lng: 79.80 },
  'Jaipur': { lat: 26.91, lng: 75.78 },
  'Meghalaya': { lat: 25.46, lng: 91.36 },
  'Ziro Valley': { lat: 27.63, lng: 93.83 }
};

let content = fs.readFileSync('./src/data/vibes.js', 'utf8');

for (const [city, coord] of Object.entries(coords)) {
  const regex = new RegExp(`("city":\\s*"${city}",\\s*"country":\\s*"India",)`);
  content = content.replace(regex, `$1\n        "lat": ${coord.lat},\n        "lng": ${coord.lng},`);
}

fs.writeFileSync('./src/data/vibes.js', content);
console.log('Coordinates added');
