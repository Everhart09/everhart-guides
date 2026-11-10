// Character lookups from Blizzard's API for the Armory page, using the player's own API client (develop.battle.net).
// The client ID and secret are stored on this computer only, encrypted with the operating system's key store.
// WoW Forever uses the profile-forever-<region> namespace; characters are realmless ("first-last") and appear in the
// API from level 10, after they log out.
const fs = require('fs');
const path = require('path');
const { safeStorage } = require('electron');

const REGIONS = ['us', 'eu', 'kr', 'tw'];
const UA = { 'User-Agent': 'EverhartGuides' };

let dir = null;
let tokens = {}; // region -> { token, expires }
const keyFile = () => path.join(dir, 'armory-key.bin');
const iconMapFile = () => path.join(dir, 'armory-item-icons.json');
const mediaDir = () => path.join(dir, 'armory');

function init(userDir) {
  dir = userDir;
}

// --- Credentials -------------------------------------------------------------------------------

function readKey() {
  try {
    const raw = fs.readFileSync(keyFile());
    const json = safeStorage.isEncryptionAvailable() ? safeStorage.decryptString(raw) : raw.toString('utf8');
    const k = JSON.parse(json);
    return k?.id && k?.secret ? k : null;
  } catch {
    return null;
  }
}

function writeKey(key) {
  if (!key) {
    fs.rmSync(keyFile(), { force: true });
    tokens = {};
    return;
  }
  const json = JSON.stringify({ id: key.id.trim(), secret: key.secret.trim() });
  fs.writeFileSync(keyFile(), safeStorage.isEncryptionAvailable() ? safeStorage.encryptString(json) : json);
  tokens = {};
}

async function token(region) {
  const t = tokens[region];
  if (t && t.expires > Date.now() + 60_000) return t.token;
  const key = readKey();
  if (!key) throw Object.assign(new Error('Add your Blizzard API key first.'), { code: 'nokey' });
  const host = region === 'cn' ? 'https://oauth.battlenet.com.cn' : 'https://oauth.battle.net';
  const res = await fetch(`${host}/token`, {
    method: 'POST',
    headers: { ...UA, Authorization: `Basic ${Buffer.from(`${key.id}:${key.secret}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  if (res.status === 401 || res.status === 400) throw Object.assign(new Error('Blizzard rejected the API key. Check the client ID and secret.'), { code: 'badkey' });
  if (!res.ok) throw new Error(`Blizzard sign-in failed (HTTP ${res.status}).`);
  const json = await res.json();
  tokens[region] = { token: json.access_token, expires: Date.now() + (json.expires_in ?? 3600) * 1000 };
  return json.access_token;
}

async function api(region, apiPath, namespace) {
  const url = `https://${region}.api.blizzard.com${apiPath}${apiPath.includes('?') ? '&' : '?'}namespace=${namespace}-forever-${region}&locale=en_US`;
  const res = await fetch(url, { headers: { ...UA, Authorization: `Bearer ${await token(region)}` } });
  if (res.status === 404) return null;
  if (res.status === 401) { tokens[region] = null; throw new Error('Blizzard API token expired; try again.'); }
  if (res.status === 429) throw new Error('Too many requests to Blizzard right now; try again in a minute.');
  if (!res.ok) throw new Error(`Blizzard API returned HTTP ${res.status}.`);
  return res.json();
}

// --- Parsing (defensive: Forever's profile responses are undocumented) ------------------------------

const nameOf = (v) => (typeof v === 'string' ? v : v?.name ?? v?.en_US ?? null);

/** Every { talent name, rank } pair anywhere in the specializations response. */
function collectTalents(node, out = {}) {
  if (Array.isArray(node)) node.forEach((n) => collectTalents(n, out));
  else if (node && typeof node === 'object') {
    const name = nameOf(node.talent) ?? nameOf(node.spell_tooltip?.spell) ?? null;
    const rank = node.talent_rank ?? node.rank ?? null;
    if (name && typeof rank === 'number') out[name] = Math.max(out[name] ?? 0, rank);
    for (const v of Object.values(node)) if (v && typeof v === 'object') collectTalents(v, out);
  }
  return out;
}

function collectProfessions(json) {
  const list = [...(json?.primaries ?? []), ...(json?.secondaries ?? [])];
  return list.map((p) => {
    const tier = (p.tiers ?? [])[0];
    return {
      name: nameOf(p.profession) ?? '?',
      skill: p.skill_points ?? tier?.skill_points ?? null,
      max: p.max_skill_points ?? tier?.max_skill_points ?? null,
    };
  });
}

// --- Media -------------------------------------------------------------------------------------

function readIconMap() {
  try { return JSON.parse(fs.readFileSync(iconMapFile(), 'utf8')); } catch { return {}; }
}

/** Icon names (as used by ehicon://icons) for item ids, from Blizzard's item media; cached on disk. */
async function itemIcons(region, ids, fetchIcon, iconDir, findIcon) {
  const map = readIconMap();
  const todo = ids.filter((id) => !(id in map));
  for (const id of todo) {
    try {
      const media = await api(region, `/data/wow/media/item/${id}`, 'static');
      const url = media?.assets?.find((a) => a.key === 'icon')?.value;
      map[id] = url ? path.basename(new URL(url).pathname).replace(/\.\w+$/, '').toLowerCase() : null;
    } catch {
      /* leave it for next time */
    }
  }
  if (todo.length) fs.writeFileSync(iconMapFile(), JSON.stringify(map));
  fs.mkdirSync(iconDir, { recursive: true });
  for (const name of new Set(ids.map((id) => map[id]).filter(Boolean))) {
    if (findIcon(name)) continue;
    const img = await fetchIcon(name).catch(() => null);
    if (img) fs.writeFileSync(path.join(iconDir, `${name}.jpg`), img);
  }
  return map;
}

/** Downloads the character's render images; returns { avatar, main } as ehicon://armory/ URLs. */
async function characterImages(region, slug, json) {
  const out = {};
  const want = { avatar: 'avatar', inset: 'inset', main: 'main-raw' };
  fs.mkdirSync(mediaDir(), { recursive: true });
  for (const [label, key] of Object.entries(want)) {
    const url = json?.assets?.find((a) => a.key === key)?.value;
    if (!url) continue;
    try {
      const res = await fetch(url, { headers: UA });
      if (!res.ok) continue;
      const ext = path.extname(new URL(url).pathname) || '.jpg';
      const file = `${region}-${slug}-${label}${ext}`.replace(/[^a-z0-9._-]/gi, '');
      fs.writeFileSync(path.join(mediaDir(), file), Buffer.from(await res.arrayBuffer()));
      out[label] = `ehicon://armory/${file}?t=${Date.now()}`;
    } catch {
      /* image is optional */
    }
  }
  return out;
}

/** File for ehicon://armory/<file>, or null. */
function mediaFile(name) {
  const file = path.join(mediaDir(), path.basename(name));
  return fs.existsSync(file) ? file : null;
}

// --- Lookup ------------------------------------------------------------------------------------

/** "Morgan Ladimore" / "morgan-ladimore" -> "morgan-ladimore". */
const slugOf = (name) => name.trim().toLowerCase().replace(/\s+/g, '-');

async function lookup({ region, name }, deps) {
  if (!REGIONS.includes(region)) throw new Error('Unknown region.');
  const slug = slugOf(name);
  if (!/^[^-\s]+-[^-\s]+$/.test(slug)) throw Object.assign(new Error('WoW Forever names have two parts: enter the first and last name, like "Morgan Ladimore".'), { code: 'name' });
  const base = `/profile/wow/character/${encodeURIComponent(slug)}`;
  const summary = await api(region, base, 'profile');
  if (!summary) {
    throw Object.assign(new Error('Blizzard has no character by that name in this region yet. Characters appear from level 10, a little while after they log out.'), { code: 'notfound' });
  }
  const part = (p) => api(region, base + p, 'profile').catch(() => null);
  const [equipment, specs, professions, media] = await Promise.all([part('/equipment'), part('/specializations'), part('/professions'), part('/character-media')]);

  const items = (equipment?.equipped_items ?? []).map((it) => ({
    id: it.item?.id ?? null,
    slot: nameOf(it.slot) ?? it.slot?.type ?? '',
    slotType: it.slot?.type ?? '',
    name: nameOf(it.name) ?? nameOf(it.item) ?? '?',
    quality: (it.quality?.type ?? 'COMMON').toLowerCase(),
    itemLevel: it.level?.value ?? null,
    enchant: (it.enchantments ?? []).map((e) => e.display_string).filter(Boolean)[0] ?? null,
  }));
  const iconMap = await itemIcons(region, items.map((i) => i.id).filter(Boolean), deps.fetchIcon, deps.iconDir, deps.findIcon).catch(() => ({}));
  for (const it of items) it.icon = iconMap[it.id] ?? null;

  return {
    region,
    slug,
    name: summary.name ?? name,
    surname: summary.surname ?? null,
    level: summary.level ?? null,
    race: nameOf(summary.race),
    className: nameOf(summary.character_class),
    gender: summary.gender?.type ?? null,
    faction: summary.faction?.type ?? null,
    guild: nameOf(summary.guild),
    ruleset: nameOf(summary.ruleset) ?? (summary.ruleset?.id != null ? `Ruleset ${summary.ruleset.id}` : null),
    itemLevel: summary.equipped_item_level ?? summary.average_item_level ?? null,
    lastLogin: summary.last_login_timestamp ?? null,
    talents: collectTalents(specs),
    professions: collectProfessions(professions),
    items,
    images: await characterImages(region, slug, media),
    fetchedAt: Date.now(),
  };
}

/** Checks a key by signing in; returns { ok } or { ok: false, error }. */
async function testKey(key) {
  const previous = readKey();
  writeKey(key);
  try {
    await token('us');
    return { ok: true };
  } catch (e) {
    writeKey(previous);
    return { ok: false, error: e.message };
  }
}

module.exports = { init, readKey, writeKey, testKey, lookup, mediaFile, REGIONS };
