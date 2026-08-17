import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';

const vibesContent = fs.readFileSync('src/data/vibes.js', 'utf-8');

// We need to find all unique Unsplash URLs and assign them a local filename.
const urlRegex = /https:\/\/(images|plus)\.unsplash\.com[^"'\s`]+/g;
const urls = [...new Set(vibesContent.match(urlRegex) || [])];

const mapping = {};
let imageCounter = 1;

for (const url of urls) {
  // Try to generate a meaningful name by looking around the URL
  // But for simplicity and to avoid duplicates, we will use a counter or hash
  // We'll use a clean name like image-1.webp, image-2.webp etc.
  // Wait, user asked: "spiti-valley-card.webp, spiti-valley-hero.webp... not generic img1.webp"
  
  // Let's find context for this URL
  let contextName = 'image';
  const matchIndex = vibesContent.indexOf(url);
  if (matchIndex !== -1) {
    const beforeContext = vibesContent.substring(Math.max(0, matchIndex - 200), matchIndex);
    if (beforeContext.includes('"city": "')) {
      const match = beforeContext.match(/"city":\s*"([^"]+)"/);
      if (match) contextName = match[1].toLowerCase().replace(/[^a-z0-9]/g, '-');
    } else if (beforeContext.includes('"name": "')) {
      const match = beforeContext.match(/"name":\s*"([^"]+)"/);
      if (match) contextName = match[1].toLowerCase().replace(/[^a-z0-9]/g, '-');
    } else if (beforeContext.includes('"id": "')) {
      const match = beforeContext.match(/"id":\s*"([^"]+)"/);
      if (match) contextName = match[1].toLowerCase().replace(/[^a-z0-9]/g, '-');
    }
    
    let type = 'misc';
    if (beforeContext.includes('"cardImg":')) type = 'card';
    else if (beforeContext.includes('"heroImg":')) type = 'hero';
    else if (beforeContext.includes('"img":')) type = 'img';
    else if (beforeContext.includes('"gallery":')) type = 'gallery';
    
    contextName = `${contextName}-${type}`;
  }
  
  const ext = 'webp';
  let filename = `${contextName}.webp`;
  let counter = 1;
  while (Object.values(mapping).includes(filename)) {
    filename = `${contextName}-${counter}.webp`;
    counter++;
  }
  
  mapping[url] = filename;
}

console.log(`Found ${urls.length} unique URLs. Starting download...`);

const downloadImage = (url, destPath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, destPath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          await sharp(buffer)
            .resize({ width: 1200, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(destPath);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

async function processImages() {
  const failed = [];
  const outDir = 'src/assets/destinations';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const filename = mapping[url];
    const destPath = path.join(outDir, filename);
    
    if (fs.existsSync(destPath)) {
      console.log(`[${i+1}/${urls.length}] Skipped ${filename} (already exists)`);
      continue;
    }
    
    try {
      console.log(`[${i+1}/${urls.length}] Downloading ${filename}...`);
      await downloadImage(url, destPath);
    } catch (e) {
      console.error(`Error downloading ${url}:`, e.message);
      failed.push(url);
    }
  }

  if (failed.length > 0) {
    console.log(`\nFailed to download ${failed.length} images:`);
    failed.forEach(u => console.log(u));
  } else {
    console.log('\nAll images downloaded successfully!');
  }

  // Rewrite vibes.js
  let newVibes = vibesContent;
  
  // We will replace URLs with variables
  const imports = [];
  for (const [url, filename] of Object.entries(mapping)) {
    const varName = 'img_' + filename.replace(/[^a-zA-Z0-9]/g, '_');
    imports.push(`import ${varName} from '../assets/destinations/${filename}';`);
    
    // Replace all occurrences of "url" (with quotes) with varName
    newVibes = newVibes.split(`"${url}"`).join(varName);
  }
  
  newVibes = imports.join('\n') + '\n\n' + newVibes;
  
  fs.writeFileSync('src/data/vibes.js', newVibes, 'utf-8');
  console.log('Updated vibes.js with local imports.');
}

processImages();
