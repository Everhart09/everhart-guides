// Personal preferences saved on this computer: appearance, favorites and notes.
import { useSyncExternalStore } from 'react';

const KEY = 'everhart.prefs';
const NOTES_KEY = 'everhart.notes';
const DEFAULTS = { theme: 'dark', textSize: 1, compact: 'auto', orbs: true, favorites: [] };
export const TEXT_SIZES = [[0.9, 'Small'], [1, 'Default'], [1.1, 'Large'], [1.25, 'Extra large']];
const SMALL_SCREEN = '(max-width: 1180px)';

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

let prefs = { ...DEFAULTS, ...read(KEY) };
let notes = read(NOTES_KEY) ?? {};
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l) => (listeners.add(l), () => listeners.delete(l));

export const usePrefs = () => useSyncExternalStore(subscribe, () => prefs);
export function setPref(key, value) {
  prefs = { ...prefs, [key]: value };
  write(KEY, prefs);
  applyAppearance();
  emit();
}

// --- Appearance ---------------------------------------------------------------------------

const media = (q) => globalThis.matchMedia?.(q);
const resolvedTheme = () => (prefs.theme === 'system' ? (media('(prefers-color-scheme: light)')?.matches ? 'light' : 'dark') : prefs.theme);
const isCompact = () => prefs.compact === 'on' || (prefs.compact === 'auto' && Boolean(media(SMALL_SCREEN)?.matches));

/** Puts the theme, density and text size on the page. Called at startup and whenever a preference changes. */
export function applyAppearance() {
  const root = document.documentElement;
  root.dataset.theme = resolvedTheme();
  globalThis.everhart?.setTheme?.(root.dataset.theme);
  root.dataset.density = isCompact() ? 'compact' : 'comfortable';
  // The desktop app zooms the whole window (crisp, and tooltips stay aligned); a browser falls back to CSS zoom.
  if (globalThis.everhart?.setZoom) globalThis.everhart.setZoom(prefs.textSize);
  else root.style.zoom = prefs.textSize === 1 ? '' : String(prefs.textSize);
}

export function watchSystem() {
  media('(prefers-color-scheme: light)')?.addEventListener?.('change', applyAppearance);
  media(SMALL_SCREEN)?.addEventListener?.('change', applyAppearance);
}

// --- Favorites ----------------------------------------------------------------------------
// Keys look like "spec:priest/shadow", "class:mage" or "dungeon:deadmines".

export const isFavorite = (key) => prefs.favorites.includes(key);
export function toggleFavorite(key) {
  setPref('favorites', isFavorite(key) ? prefs.favorites.filter((k) => k !== key) : [...prefs.favorites, key]);
}

// --- Notes --------------------------------------------------------------------------------
// One note per page, keyed like "guide:priest/shadow" or "dungeon:deadmines".

export const useNotes = () => useSyncExternalStore(subscribe, () => notes);
export function setNote(key, text) {
  notes = { ...notes };
  if (text.trim()) notes[key] = { text, updated: new Date().toISOString() };
  else delete notes[key];
  write(NOTES_KEY, notes);
  emit();
}
