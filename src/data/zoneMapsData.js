// Zone maps for the leveling route. Bundled maps come from `npm run maps` (meta in zoneMaps.json); the desktop app
// downloads newer maps from Settings → Check for updates, and those are used first.
import BUNDLED from './zoneMaps.json' with { type: 'json' };
import { ZONES } from './levelingRoute.js';

const downloaded = (() => {
  try {
    return globalThis.everhart?.getMapsMeta?.() ?? null;
  } catch {
    return null;
  }
})();

export const MAPS_META = { ...(downloaded ?? BUNDLED), origin: downloaded ? 'downloaded' : 'bundled' };
/** Every zone id that has a map, so the updater knows what to download. */
export const MAP_ZONES = [...new Set(ZONES.map((z) => z.zone).filter(Boolean))];

const DESKTOP = Boolean(globalThis.everhart?.isDesktop);
/** URL for a zone's map. In the desktop app, downloaded maps take priority over bundled ones. */
export const mapUrl = (zoneId) => (DESKTOP ? `ehicon://maps/${zoneId}.jpg` : new URL(`maps/${zoneId}.jpg`, document.baseURI).href);
