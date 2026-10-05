// Fetches the official WoW Forever talent trees, talent icons and ability learn levels from
// Wowhead's Forever talent calculator. Shared by scripts/import-talents.mjs and the Electron app.

// Wowhead environments: 'forever' (WoW Forever) or 'classic' (Classic Era, used for the Classic vs Forever comparison).
const calcPage = (env) => `https://www.wowhead.com/${env}/talent-calc/priest`;
const PATCH_NOTES_TOPIC = 'https://us.forums.blizzard.com/en/wow/t/2360696.json';
const PATCH_NOTES_URL = 'https://us.forums.blizzard.com/en/wow/t/wow-forever-beta-development-notes/2360696';
const ICON_CDN = 'https://wow.zamimg.com/images/wow/icons/large/';
const UA = { 'User-Agent': 'Mozilla/5.0' };

// Wowhead tree name → [class id, tree id, display name], in the order trees appear in game.
const TREES = [
  ['WarriorArms', 'warrior', 'arms', 'Arms'], ['WarriorFury', 'warrior', 'fury', 'Fury'], ['WarriorProtection', 'warrior', 'protection', 'Protection'],
  ['PaladinHoly', 'paladin', 'holy', 'Holy'], ['PaladinProtection', 'paladin', 'protection', 'Protection'], ['PaladinCombat', 'paladin', 'retribution', 'Retribution'],
  ['HunterBeastMastery', 'hunter', 'beast-mastery', 'Beast Mastery'], ['HunterMarksmanship', 'hunter', 'marksmanship', 'Marksmanship'], ['HunterSurvival', 'hunter', 'survival', 'Survival'],
  ['RogueAssassination', 'rogue', 'assassination', 'Assassination'], ['RogueCombat', 'rogue', 'combat', 'Combat'], ['RogueSubtlety', 'rogue', 'subtlety', 'Subtlety'],
  ['PriestDiscipline', 'priest', 'discipline', 'Discipline'], ['PriestHoly', 'priest', 'holy', 'Holy'], ['PriestShadow', 'priest', 'shadow', 'Shadow'],
  ['ShamanElementalCombat', 'shaman', 'elemental', 'Elemental'], ['ShamanEnhancement', 'shaman', 'enhancement', 'Enhancement'], ['ShamanRestoration', 'shaman', 'restoration', 'Restoration'],
  ['MageArcane', 'mage', 'arcane', 'Arcane'], ['MageFire', 'mage', 'fire', 'Fire'], ['MageFrost', 'mage', 'frost', 'Frost'],
  ['WarlockCurses', 'warlock', 'affliction', 'Affliction'], ['WarlockSummoning', 'warlock', 'demonology', 'Demonology'], ['WarlockDestruction', 'warlock', 'destruction', 'Destruction'],
  ['DruidBalance', 'druid', 'balance', 'Balance'], ['DruidFeralCombat', 'druid', 'feral', 'Feral Combat'], ['DruidRestoration', 'druid', 'restoration', 'Restoration'],
];
const CLASS_NUM = { warrior: 1, paladin: 2, hunter: 3, rogue: 4, priest: 5, shaman: 7, mage: 8, warlock: 9, druid: 11 };

/** Tooltip HTML → plain text with line breaks. */
const cleanText = (html) =>
  html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/[ \t]+/g, ' ')
    .split('\n').map((l) => l.trim()).filter(Boolean).join('\n');

async function getText(url) {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`${url} returned HTTP ${res.status}`);
  return res.text();
}

/** The current talent data URL from Wowhead. It changes whenever Wowhead picks up a new beta build. */
async function latestDataUrl(env = 'forever') {
  const page = await getText(calcPage(env));
  const url = page.match(new RegExp(`https://nether\\.wowhead\\.com/${env}/data/talents-classic\\?[^"'\\s]+`))?.[0];
  if (!url) throw new Error('Could not find the talent data URL on the Wowhead page.');
  return url.replace(/&amp;/g, '&');
}

/** Runs Wowhead's data script against a stub `WH` object and captures what it registers. */
function captureData(src) {
  const page = {};
  const spells = {};
  const stub = new Proxy(function () {}, {
    get: (_t, k) => (k === 'setPageData' ? (key, val) => { page[key] = val; } : stub),
    apply: (_t, _self, args) => {
      for (const a of args) {
        if (a && typeof a === 'object') for (const [id, v] of Object.entries(a)) if (v?.name_enus) spells[id] = { name: v.name_enus, icon: v.icon, desc: v.description_enus };
      }
      return stub;
    },
  });
  new Function('WH', '$WH', src)(stub, stub);
  const key = Object.keys(page).find((k) => k.startsWith('wow.talentCalcClassic.') && k.endsWith('.data'));
  return { data: page[key], spells };
}

/**
 * Downloads and converts everything. Returns { meta, classes, abilities, icons }.
 * onProgress(fraction 0–1, label) is called as each stage completes.
 */
async function fetchForeverData(onProgress = () => {}, env = 'forever') {
  onProgress(0.05, 'Finding the latest WoW Forever beta data…');
  const dataUrl = await latestDataUrl(env);
  onProgress(0.2, 'Downloading talent trees…');
  const raw = await getText(dataUrl);
  onProgress(0.6, 'Reading talent trees…');
  const { data, spells } = captureData(raw);
  if (!data?.trees) throw new Error('Talent data not found in the downloaded file.');

  const byDesc = Object.fromEntries(Object.values(data.trees).map((t) => [t.description, t.id]));
  const classes = {};
  const icons = {};
  for (const [desc, classId, treeId, treeName] of TREES) {
    const raw = data.talents[byDesc[desc]];
    if (!raw) throw new Error(`Missing tree ${desc}`);
    // Forever data names talents directly; Classic data only gives spell ids per rank, so fall back to spell data.
    const nameOf = (t) => t.name ?? spells[t.ranks?.[0]]?.name ?? `Talent ${t.id}`;
    const idToName = Object.fromEntries(Object.values(raw).map((t) => [t.id, nameOf(t)]));
    const talents = Object.values(raw)
      .sort((a, b) => a.row - b.row || a.col - b.col)
      .map((t) => {
        const max = t.ranks.length;
        const req = t.requires?.[0];
        const name = nameOf(t);
        icons[`${classId}/${name}`] = t.icon;
        return {
          name,
          row: t.row,
          col: t.col,
          max,
          ranks: Array.from({ length: max }, (_, i) => cleanText(t.descriptions?.[String(i + 1)] ?? spells[t.ranks[i]]?.desc ?? '')),
          ...(req ? { req: idToName[req.id], reqQty: req.qty } : {}),
        };
      });
    (classes[classId] ||= []).push({ id: treeId, name: treeName, talents });
  }

  // Abilities: [name, first level, [level of every rank]]. Icons go in the icon map as ability/<class>/<name>.
  const abilities = {};
  for (const [classId, num] of Object.entries(CLASS_NUM)) {
    const levels = {};
    for (const a of data.abilities[num] ?? []) {
      const spell = spells[a.id];
      if (!spell) continue;
      (levels[spell.name] ||= new Set()).add(a.level);
      if (spell.icon) icons[`ability/${classId}/${spell.name}`] = spell.icon;
    }
    abilities[classId] = Object.entries(levels)
      .map(([name, set]) => { const ranks = [...set].sort((x, y) => x - y); return [name, ranks[0], ranks]; })
      .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]));
  }

  onProgress(0.75, 'Converting talents and abilities…');
  const meta = { source: `Wowhead ${env === 'forever' ? 'Forever' : 'Classic'} talent calculator`, dataUrl, importedAt: new Date().toISOString().slice(0, 10) };
  return { meta, classes, abilities, icons };
}

/** Latest title and update time of Blizzard's beta development notes thread. */
async function latestPatchNotes() {
  const res = await fetch(PATCH_NOTES_TOPIC, { headers: { ...UA, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Blizzard forums returned HTTP ${res.status}`);
  const topic = await res.json();
  return { title: topic.title, updatedAt: topic.last_posted_at ?? topic.bumped_at ?? null, url: PATCH_NOTES_URL };
}

/** Downloads one icon image; returns a Buffer or null. */
async function fetchIcon(name) {
  const res = await fetch(ICON_CDN + name + '.jpg', { headers: UA });
  return res.ok ? Buffer.from(await res.arrayBuffer()) : null;
}

module.exports = { fetchForeverData, latestDataUrl, latestPatchNotes, fetchIcon, TREES };
