import ICONS from '../data/icons.json';
import { OVERRIDE_ICONS } from '../data/talents/index.js';

// In the desktop app, icons load through the ehicon:// protocol so icons downloaded by the in-app
// updater work alongside the bundled ones. In a plain browser (vite dev), use the bundled files.
const DESKTOP = Boolean(globalThis.everhart?.isDesktop);
const MAP = { ...ICONS, ...OVERRIDE_ICONS };

/** URL for a game icon, or null if we don't have one (UI falls back to glyphs). */
export function iconUrl(key) {
  const name = MAP[key];
  if (!name) return null;
  return DESKTOP ? `ehicon://icons/${name}.jpg` : `./icons/${name}.jpg`;
}

/** URL for an icon by its file name (used for item icons, which come with the gear data). */
export const iconByName = (name) => (name ? (DESKTOP ? `ehicon://icons/${name}.jpg` : `./icons/${name}.jpg`) : null);

export const talentIcon = (classId, talentName) => iconUrl(`${classId}/${talentName}`);
export const classIcon = (classId) => iconUrl(`class/${classId}`);
export const professionIcon = (profId) => iconUrl(`prof/${profId}`);
