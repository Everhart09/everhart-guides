// Imports the official WoW Forever talent trees, talent icons and class ability levels into the
// bundled app data (src/data/talents) from Wowhead's Forever talent calculator.
// Re-run whenever Blizzard pushes a new beta build:  npm run talents
// (The app can also download updates itself at runtime — see electron/main.cjs.)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { fetchForeverData, fetchIcon } = require('../electron/forever-data.cjs');

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'src', 'data', 'talents');
const ICON_MAP = path.join(ROOT, 'src', 'data', 'icons.json');
const ICON_DIR = path.join(ROOT, 'public', 'icons');

const { meta, classes, abilities, icons } = await fetchForeverData();

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(path.join(OUT_DIR, 'forever.json'), JSON.stringify({ meta, classes }, null, 1) + '\n');
writeFileSync(path.join(OUT_DIR, 'abilities.json'), JSON.stringify(abilities, null, 1) + '\n');

// Refresh talent icons: drop old talent keys, keep class/profession icons, add the new ones.
const map = existsSync(ICON_MAP) ? JSON.parse(readFileSync(ICON_MAP, 'utf8')) : {};
for (const key of Object.keys(map)) if (!key.startsWith('class/') && !key.startsWith('prof/')) delete map[key];
Object.assign(map, icons);
writeFileSync(ICON_MAP, JSON.stringify(map, null, 2) + '\n');

mkdirSync(ICON_DIR, { recursive: true });
let downloaded = 0;
const failed = [];
for (const icon of new Set(Object.values(map))) {
  const out = path.join(ICON_DIR, `${icon}.jpg`);
  if (existsSync(out)) continue;
  const img = await fetchIcon(icon);
  if (!img) { failed.push(icon); continue; }
  writeFileSync(out, img);
  downloaded++;
}

const talentCount = Object.values(classes).flat().reduce((n, t) => n + t.talents.length, 0);
console.log(`Imported ${talentCount} talents in 27 trees (${meta.importedAt}). ${downloaded} new icons downloaded.`);
if (failed.length) console.log('Icons that failed to download:', failed.join(', '));
