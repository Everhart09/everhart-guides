// New versions of the app itself (from GitHub Releases), separate from guide-data updates in updates.js.
import { useSyncExternalStore } from 'react';
import { autoCheckEnabled } from './updates.js';

const bridge = () => globalThis.everhart;
export const appUpdatesSupported = () => Boolean(bridge()?.checkAppUpdate);

// state: idle | unsupported | checking | none | downloading | ready | error
let status = { state: appUpdatesSupported() ? 'idle' : 'unsupported', version: null, percent: 0, error: null, current: null };
const listeners = new Set();
const set = (next) => {
  status = { ...status, ...next };
  listeners.forEach((l) => l());
};

if (appUpdatesSupported()) {
  bridge().onAppUpdate(set);
  bridge().getAppUpdate().then(set).catch(() => {});
}

export const useAppUpdate = () => useSyncExternalStore((l) => (listeners.add(l), () => listeners.delete(l)), () => status);

export async function checkAppUpdate() {
  if (!appUpdatesSupported()) return status;
  set({ state: 'checking', error: null });
  set(await bridge().checkAppUpdate());
  return status;
}

export const installAppUpdate = () => bridge()?.installAppUpdate?.();

let startupChecked = false;
/** Quietly checks for a new app version once per launch, if automatic checks are on. */
export function checkAppUpdateOnStartup() {
  if (startupChecked || !appUpdatesSupported() || !autoCheckEnabled()) return;
  startupChecked = true;
  setTimeout(() => checkAppUpdate().catch(() => {}), 6000);
}
