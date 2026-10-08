// Legacy System perk data: each perk is a spell in the WoW Forever game data. Downloads the official names,
// descriptions (at max rank) and icons from Wowhead's Forever tooltip API. Used by `npm run legacy` and the updater.
const { parseSpell, getTooltip } = require('./forever-dungeons.cjs');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** spellIds: number[]. Returns { data: { meta, spells }, icons, missing }. */
async function buildLegacyData({ spellIds, db = null, onProgress = () => {}, delay = 150 }) {
  const data = { meta: { importedAt: new Date().toISOString().slice(0, 10), db, source: 'Wowhead WoW Forever tooltips' }, spells: {} };
  const missing = [];
  for (const [i, id] of spellIds.entries()) {
    onProgress(i / spellIds.length, `Downloading Legacy perks (${i + 1} of ${spellIds.length})…`);
    const j = await getTooltip('spell', id);
    if (j?.name) {
      const { name, icon, desc } = parseSpell(j);
      data.spells[id] = { name, icon, desc };
    } else missing.push(id);
    await sleep(delay);
  }
  const icons = [...new Set(Object.values(data.spells).map((s) => s.icon).filter(Boolean))];
  return { data, icons, missing };
}

module.exports = { buildLegacyData };
