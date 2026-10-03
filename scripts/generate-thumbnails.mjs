import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dataDir = path.join(root, 'data');
const yearsManifest = JSON.parse(await fs.readFile(path.join(dataDir, 'years.json'), 'utf8'));
const years = yearsManifest.years || [];
const result = {};

function extractMeta(html, property) {
  const re1 = new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i');
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`, 'i');
  return (html.match(re1)?.[1] || html.match(re2)?.[1] || '').trim();
}

for (const year of years) {
  const file = path.join(dataDir, `${year}.json`);
  const items = JSON.parse(await fs.readFile(file, 'utf8'));
  for (const p of items) {
    const source = p.thumbnailUrl || p.url || p.embedUrl;
    if (!source || result[p.id]) continue;
    try {
      const res = await fetch(source, {headers: {'user-agent': '360-Panorama-Archive/1.0 (+GitHub Pages)'}});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      const image = extractMeta(html, 'og:image') || extractMeta(html, 'twitter:image');
      if (image) {
        result[p.id] = {url: new URL(image, source).href, source};
        console.log(`OK  ${p.id} -> ${result[p.id].url}`);
      } else {
        console.log(`NO IMAGE  ${p.id}`);
      }
    } catch (e) {
      console.log(`SKIP ${p.id}: ${e.message}`);
    }
  }
}
await fs.writeFile(path.join(dataDir, 'thumbnails.json'), JSON.stringify(result, null, 2) + '\n');
console.log(`Wrote ${Object.keys(result).length} thumbnails.`);
