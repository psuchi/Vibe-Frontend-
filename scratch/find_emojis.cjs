const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/suchi pujar/OneDrive/Desktop/major project/vibe/frontend/src';

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{2B50}\u{231A}\u{23F0}\u{23F3}\u{231B}\u{23E9}-\u{23EC}\u{23F8}-\u{23FA}\u{25B6}\u{2194}\u{2195}\u{2196}-\u{2199}\u{21A9}\u{21AA}\u{25AA}\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2B05}-\u{2B07}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}\u{203C}\u{2049}\u{A9}\u{AE}\u{2122}\u{3297}\u{3299}\u{23F0}\u{2139}\u{24C2}\u{25AA}\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2B05}-\u{2B07}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}\u{203C}\u{2049}\u{A9}\u{AE}\u{2122}\u{3297}\u{3299}\u{2139}\u{24C2}\u{200D}\u{FE0F}\u{2728}\u{2714}\u{274C}\u{2191}\u{2193}\u{2715}]/u;
// Simple script to find files and lines containing characters > \u007F

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(dir);

const allEmojis = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    // try to find non-ascii chars
    const hasNonAscii = /[^\x00-\x7F]/.test(line);
    if (hasNonAscii) {
      // print line content
      console.log(`${file}:${i + 1}: ${line.trim()}`);
    }
  });
});
