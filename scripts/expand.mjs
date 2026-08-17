import { VIBES } from './src/data/vibes.js';

const stylesMap = {
  dest_spiti_valley: ['slow', 'active'],
  dest_munnar: ['slow', 'luxury'],
  dest_coorg: ['slow', 'luxury'],
  dest_rishikesh: ['active'],
  // I will programatically determine missing ones based on vibe name and destination
};

const companionsMap = {
  dest_spiti_valley: ['solo', 'partner', 'group'],
  dest_munnar: ['partner', 'group'],
  dest_coorg: ['partner', 'group'],
  dest_rishikesh: ['solo', 'group'],
  // I will programatically determine missing ones based on vibe name and destination
};

// Add companions and styles
VIBES.forEach(vibe => {
  vibe.dests.forEach(d => {
    // Add default companion/styles if missing
    d.companion = companionsMap[d.id] || ['solo', 'partner', 'group'];
    d.style = stylesMap[d.id] || ['slow', 'active', 'luxury'];
  });
});

console.log('Successfully imported VIBES. Count:', VIBES.length);
VIBES.forEach(v => console.log(`Vibe ${v.id} has ${v.dests.length} dests`));

