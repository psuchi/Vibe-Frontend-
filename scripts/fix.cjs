const fs = require('fs');
const p = require('path').join(__dirname, 'src/data/vibes.js');
let code = fs.readFileSync(p, 'utf8');

code = code.replace('// Inject new Indian destinations\\nconst NEW_DATA = {', '// Inject new Indian destinations\nconst NEW_DATA = {');

code = code.replace(
  '};\n};\nRAW_VIBES.forEach(vibe => {\\n  if (NEW_DATA[vibe.id]) {\\n    vibe.dests.push(...NEW_DATA[vibe.id].dests);\\n    vibe.stays.push(...NEW_DATA[vibe.id].stays);\\n    vibe.days.push(...NEW_DATA[vibe.id].days);\\n  }\\n});\\n\\n// Filter out non-India data\\nexport const VIBES = RAW_VIBES.map(vibe => {\\n  const isIndia = d => d.country.includes(\\\'India\\\');\\n  const validIndices = vibe.dests.map((d, i) => isIndia(d) ? i : -1).filter(i => i !== -1);\\n  return {\\n    ...vibe,\\n    dests: validIndices.map(i => vibe.dests[i]),\\n    stays: validIndices.map(i => vibe.stays[i] || vibe.stays[0]),\\n    days: validIndices.map(i => vibe.days[i] || vibe.days[0])\\n  };\\n});\\nexport const BUDGET_CONFIG = {',
  `};
RAW_VIBES.forEach(vibe => {
  if (NEW_DATA[vibe.id]) {
    vibe.dests.push(...NEW_DATA[vibe.id].dests);
    vibe.stays.push(...NEW_DATA[vibe.id].stays);
    vibe.days.push(...NEW_DATA[vibe.id].days);
  }
});

// Filter out non-India data
export const VIBES = RAW_VIBES.map(vibe => {
  const isIndia = d => d.country.includes('India');
  const validIndices = vibe.dests.map((d, i) => isIndia(d) ? i : -1).filter(i => i !== -1);
  return {
    ...vibe,
    dests: validIndices.map(i => vibe.dests[i]),
    stays: validIndices.map(i => vibe.stays[i] || vibe.stays[0]),
    days: validIndices.map(i => vibe.days[i] || vibe.days[0])
  };
});
export const BUDGET_CONFIG = {`
);

// Fallback replace without exact match, since it might be brittle
code = code.split('\\n').join('\n');

fs.writeFileSync(p, code, 'utf8');
console.log('Fixed vibes.js');
