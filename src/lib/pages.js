// Stable keys for pages, used by favorites and notes, and how to label and open them again.
import { CLASSES, getClass, getSpec } from '../data/classes/index.js';
import { getProfession } from '../data/professions.js';
import { getDungeon } from '../data/dungeons/index.js';

const VIEW_LABELS = { home: 'Overview', patch: 'Patch notes', calc: 'Talent calculator', route: 'Leveling route', picker: 'Class picker', beta: 'WoW Forever Beta', professions: 'All professions', dungeons: 'Dungeons & raids' };

/** The key of the page a route shows, e.g. "guide:priest/shadow". */
export function pageKey(route) {
  switch (route.view) {
    case 'guide': return `guide:${route.classId}/${route.specId}`;
    case 'class': return `class:${route.classId}`;
    case 'profession': return `prof:${route.profId}`;
    case 'dungeon': return `dungeon:${route.dungeonId}`;
    default: return route.view;
  }
}

/** { label, sub, color, go(nav) } for a page key, or null if the page no longer exists. */
export function pageInfo(key) {
  const [kind, rest = ''] = key.split(':');
  if (kind === 'guide') {
    const [c, s] = rest.split('/');
    const cls = getClass(c);
    const spec = getSpec(cls, s);
    return spec ? { label: `${spec.name} ${cls.name}`, sub: 'Guide', color: cls.color, classId: cls.id, go: (nav) => nav.guide(cls.id, spec.id) } : null;
  }
  if (kind === 'class') {
    const cls = getClass(rest);
    return cls ? { label: cls.name, sub: 'Class', color: cls.color, classId: cls.id, go: (nav) => nav.cls(cls.id) } : null;
  }
  if (kind === 'prof') {
    const p = getProfession(rest);
    return p ? { label: p.name, sub: 'Profession', color: '#d9a659', profId: p.id, go: (nav) => nav.prof(p.id) } : null;
  }
  if (kind === 'dungeon') {
    const d = getDungeon(rest);
    return d ? { label: d.name, sub: d.raid ? 'Raid' : 'Dungeon', color: '#c9a45c', dungeonId: d.id, go: (nav) => nav.dungeon(d.id) } : null;
  }
  if (VIEW_LABELS[kind]) return { label: VIEW_LABELS[kind], sub: 'Page', color: '#c9a45c', go: (nav) => nav[kind === 'calc' ? 'calc' : kind]?.() };
  return null;
}

export const favoriteKeyFor = (route) => (['guide', 'class', 'profession', 'dungeon'].includes(route.view) ? pageKey(route) : null);
export { CLASSES };
