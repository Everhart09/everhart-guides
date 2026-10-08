// WoW Forever beta: schedule, current state, access and limitations.
// The written parts below are the baseline. `BETA` (exported at the bottom) also pulls the latest build, level cap,
// new dungeons and a timeline entry from the newest patch notes, which the app imports automatically.
import { PATCH } from './patchNotes.js';

const BASE = {
  start: '2026-09-17',
  end: '2026-10-21',
  current: {
    build: 'October 1, 2026 update',
    levelCap: 30,
    dungeons: [
      ['Ragefire Chasm', ''], ['Hall of Thanes', '13–18 · new'], ['Ruins of Lordaeron', '15–20 · new'], ['Wailing Caverns', ''],
      ['The Deadmines', ''], ['Shadowfang Keep', ''], ['The Stockade', ''], ['Blackfathom Deeps', ''],
      ['Gnomeregan', ''], ['Razorfen Kraul', ''], ['Scarlet Monastery', ''], ['Excavation Site: Wetlands', '26–31 · new'],
      ['Razorfen Downs', '25+'], ['Uldaman', '30+'],
    ],
  },
  timeline: [
    { date: '2026-09-17', title: 'Beta opens — Week 1', items: ['Level cap 20', 'New dungeons Hall of Thanes (13–18) and Ruins of Lordaeron (15–20)', 'New Skyborne race and Zephras Isle zone playable', 'All zone content up to level 20'] },
    { date: '2026-09-24', title: 'Week 2 development update', items: ['Cooldown Manager introduced (off by default)', 'First big class tuning pass', 'Temporary beta respec cost of 1 silver'] },
    { date: '2026-10-01', title: 'Week 3 — level 30 update', items: ['Level cap raised to 30', 'New dungeon Excavation Site: Wetlands (26–31), plus Razorfen Downs and Uldaman', 'Dungeon quest bonus XP cut by 50%', 'Honor cap raised to 25,000'] },
    { date: '2026-10-21', title: 'Beta ends', items: ['Beta access closes'] },
    { date: '2026-11-04', title: 'Full release', items: ['WoW Forever launches worldwide at 3:00 PM PST'] },
  ],
  access: [
    'Buyers of the Skyborne Epic Pack or the limited-time Warcraft Forever Collection get beta access',
    'Players who opted in can be selected throughout the test — invitations go out regularly',
  ],
  limitations: [
    { area: 'Level cap', text: 'You can only level to {cap} right now. Content above that (including raids) cannot be tested yet.' },
    { area: 'Talents', text: 'Talent trees are still changing between builds — talents have been added, removed and moved every week.' },
    { area: 'Respecs', text: 'Respecs temporarily cost only 1 silver during the beta to encourage testing builds.' },
    { area: 'Leveling speed', text: 'Blizzard is still tuning XP (dungeon quest XP was halved on Oct 1) and creature respawn rates in busy zones.' },
    { area: 'Short test', text: 'The beta runs about five weeks and closes two weeks before launch.' },
  ],
  guideNotes: [
    'Talent trees, gear, dungeon data, zone maps and patch notes update from the latest beta build through Settings → Check for updates.',
    'Builds and leveling advice cover levels 1–60, but the beta only reaches {cap}. Everything above that is untested until launch.',
    'Stat priorities, pros/cons and playstyle advice build on Classic knowledge adjusted for Forever changes.',
    "Pre-raid gear lists come from the WoW Forever item database on Wowhead. Many new Forever items don't list a source yet, and trinket effects aren't scored.",
    'Profession leveling steps and material counts are estimates — buy ~10–20% extra.',
    'Game icons are © Blizzard Entertainment (via the Wowhead CDN). Everhart Guides is a non-commercial fan project, not affiliated with Blizzard.',
  ],
};

// ── Keep the page current from the newest patch notes ──────────────────────────────────────────────────────────────
const fmtDate = (ymd) => new Date(ymd + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

function live(base, patch) {
  const newer = patch?.date && patch.date > (base.timeline.filter((t) => t.date <= new Date().toISOString().slice(0, 10)).at(-1)?.date ?? '');
  const capHighlight = Number(patch?.highlights?.find((h) => /level cap/i.test(h.label))?.value) || null;
  const levelCap = newer && capHighlight ? capHighlight : base.current.levelCap;

  const dungeons = [...base.current.dungeons];
  for (const h of patch?.highlights ?? []) {
    if (!/new dungeon/i.test(h.label)) continue;
    const name = h.text.replace(/^new dungeon\s*[-–—:]\s*/i, '').replace(/\.$/, '');
    if (!dungeons.some(([n]) => name.toLowerCase().includes(n.toLowerCase()))) dungeons.push([name.replace(/\s*\(.*\)$/, ''), 'new']);
  }

  const timeline = [...base.timeline];
  if (newer && !timeline.some((t) => t.date === patch.date)) {
    const at = timeline.findIndex((t) => t.date > patch.date);
    const entry = {
      date: patch.date,
      title: `${fmtDate(patch.date)} beta update`,
      items: (patch.highlights ?? []).filter((h) => !/total changes/i.test(h.label)).map((h) => h.text).slice(0, 4),
    };
    timeline.splice(at === -1 ? timeline.length : at, 0, entry);
  }

  const fill = (t) => t.replace(/\{cap\}/g, String(levelCap));
  return {
    ...base,
    current: { ...base.current, build: newer ? patch.build : base.current.build, levelCap, dungeons },
    timeline,
    limitations: base.limitations.map((l) => ({ ...l, text: fill(l.text) })),
    guideNotes: base.guideNotes.map(fill),
  };
}

export const BETA = live(BASE, PATCH);
