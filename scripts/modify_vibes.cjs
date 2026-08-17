const fs = require('fs');

let content = fs.readFileSync('src/data/vibes.js', 'utf8');

const imageDb = {};

// Inject id to each dest and stay.
content = content.replace(/city: '([^']+)',/g, (match, city) => {
  const id = `dest_${city.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  return `id: '${id}', city: '${city}',`;
});

content = content.replace(/lbl: '([^']+)', name: '([^']+)',/g, (match, lbl, name) => {
  const id = `stay_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  return `id: '${id}', lbl: '${lbl}', name: '${name}',`;
});

// Extract existing img: '...' to populate IMAGE_DB, then remove the img line
content = content.replace(/id: '([^']+)',[^}]*?img: '([^']+)',/gs, (match, id, imgUrl) => {
  imageDb[id] = [imgUrl];
  return match.replace(/img: '[^']+',\r?\n\s*/, '');
});

let imageDbString = "export const IMAGE_DB = {\n";
for (const [id, urls] of Object.entries(imageDb)) {
  imageDbString += `  '${id}': ${JSON.stringify(urls)},\n`;
}
imageDbString += "};\n";

const imageDbTemplate = `
${imageDbString}

export const getImages = (id, title = 'Image') => {
  if (IMAGE_DB[id] && IMAGE_DB[id].length > 0) {
    return IMAGE_DB[id];
  }
  return [\`https://placehold.co/600x400?text=\${encodeURIComponent(title)}+Not+Available\`];
};
`;

content += '\n' + imageDbTemplate;

fs.writeFileSync('src/data/vibes.js', content, 'utf8');
console.log('Modified vibes.js successfully.');
