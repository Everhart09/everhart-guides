// Checks whether Blizzard/Wowhead have newer WoW Forever beta data than the app is using.
// Only works in the desktop app (the Electron bridge does the network requests).
import { useSyncExternalStore } from 'react';
import { TALENT_META } from '../data/talents/index.js';
import { PATCH } from '../data/patchNotes.js';
import { GEAR_META } from '../data/gearData.js';
import { CLASS_GEAR, GEAR_PROFILES } from '../data/gearProfiles.js';
import { CHANGES_META } from '../data/classChangesData.js';
import { DUNGEON_IDS, DUNGEON_META } from '../data/dungeons/index.js';
import { MAP_ZONES, MAPS_META } from '../data/zoneMapsData.js';

const LAST_KEY = 'everhart.updates.last';
const DISMISS_KEY = 'everhart.updates.dismissed';
const AUTO_KEY = 'everhart.updates.auto';
const AUTO_INTERVAL_MS = 6 * 60 * 60 * 1000; // automatic checks at most every 6 hours

const bridge = () => globalThis.everhart;
export const updatesSupported = () => Boolean(bridge()?.checkForUpdates);

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

// The cached result only counts if it was made against the data we're using now.
const cached = read(LAST_KEY);
let state = {
  status: 'idle', // idle | checking | applying | error
  result: cached?.talents?.current === TALENT_META.dataUrl && (cached?.gear?.current ?? null) === (GEAR_META.db ?? null)
    && (cached?.changes?.current ?? null) === (CHANGES_META.forever ?? null)
    && (cached?.dungeons?.current ?? null) === (DUNGEON_META.db ?? null)
    && (cached?.maps?.current ?? null) === (MAPS_META.db ?? null) ? cached : null,
  error: null,
  dismissed: read(DISMISS_KEY),
};
const listeners = new Set();
const set = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

export function useUpdates() {
  return useSyncExternalStore((l) => (listeners.add(l), () => listeners.delete(l)), () => state);
}

/** Key identifying the specific update on offer, so dismissing hides only that one. */
export const updateKey = (result) => `${result?.talents?.latest ?? ''}|${result?.gear?.latest ?? ''}|${result?.changes?.changed ? 'changes' : ''}|${result?.dungeons?.latest ?? ''}|${result?.maps?.changed ? 'maps' : ''}|${result?.patchNotes?.title ?? ''}`;

/** Whether the app checks for updates by itself on startup (on by default). */
export const autoCheckEnabled = () => read(AUTO_KEY) !== false;
export function setAutoCheck(enabled) {
  write(AUTO_KEY, enabled);
  set({});
}

/** Checks for newer data. Automatic checks are throttled; force=true always checks. Returns the result. */
export async function checkForUpdates({ force = false } = {}) {
  if (!updatesSupported() || state.status === 'checking') return state.result;
  if (!force && !autoCheckEnabled()) return state.result;
  if (!force && state.result && Date.now() - Date.parse(state.result.checkedAt) < AUTO_INTERVAL_MS) return state.result;
  set({ status: 'checking', error: null });
  try {
    const result = await bridge().checkForUpdates({
      talentDataUrl: TALENT_META.dataUrl, gearDb: GEAR_META.db ?? null, changesFor: CHANGES_META.forever ?? null, dungeonsDb: DUNGEON_META.db ?? null, mapsDb: MAPS_META.db ?? null,
      patchTitle: PATCH.forumTitle,
    });
    write(LAST_KEY, result);
    set({ status: 'idle', result });
    return result;
  } catch (e) {
    set({ status: 'error', error: e.message });
    throw e;
  }
}

/** True when the guides' talent trees, gear lists, dungeon data, zone maps or class comparisons are behind the latest WoW Forever data. */
export const needsUpdate = (result) => Boolean(result?.talents?.changed || result?.gear?.changed || result?.dungeons?.changed || result?.maps?.changed || result?.changes?.changed);

/** Downloads whatever is out of date (talent trees, gear lists, dungeon data, class comparisons), reporting { percent, label }. Returns { ok, error? }. */
export async function downloadUpdate(onProgress, result = state.result) {
  const unsubscribe = bridge().onUpdateProgress?.(onProgress) ?? (() => {});
  set({ status: 'applying', error: null });
  try {
    const res = await bridge().applyUpdate({
      talents: Boolean(result?.talents?.changed),
      gear: Boolean(result?.gear?.changed),
      changes: Boolean(result?.changes?.changed),
      dungeons: Boolean(result?.dungeons?.changed),
      dungeonIds: DUNGEON_IDS,
      maps: Boolean(result?.maps?.changed),
      mapZones: MAP_ZONES,
      gearProfiles: GEAR_PROFILES,
      classGear: CLASS_GEAR,
    });
    if (res.ok) write(LAST_KEY, null);
    set({ status: res.ok ? 'idle' : 'error', error: res.ok ? null : res.error });
    return res;
  } finally {
    unsubscribe();
  }
}

export const restartApp = () => bridge()?.restartApp?.();
export const appInfo = () => bridge()?.getAppInfo?.() ?? Promise.resolve(null);

/** Opens the Settings window. mode 'update' immediately checks and updates (used by the banner). */
export function openSettings(mode = 'settings') {
  window.dispatchEvent(new CustomEvent('everhart:open-settings', { detail: { mode } }));
}

/** Checks and, if needed, downloads the newest talent trees and gear lists with a progress bar, then restarts. */
export const applyTalentUpdate = () => openSettings('update');

/** Goes back to the talent trees, gear lists, dungeon data and class comparisons bundled with the app. */
export async function revertTalentUpdate() {
  await bridge().clearTalentUpdate();
  write(LAST_KEY, null);
  restartApp();
}

export function dismissUpdate(result) {
  const key = updateKey(result);
  write(DISMISS_KEY, key);
  set({ dismissed: key });
}

export const openExternal = (url) => bridge()?.openExternal?.(url);
