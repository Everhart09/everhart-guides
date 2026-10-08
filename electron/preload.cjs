// Exposes a small, safe API to the page. The page never gets direct Node or filesystem access.
const { contextBridge, ipcRenderer, webFrame } = require('electron');

contextBridge.exposeInMainWorld('everhart', {
  isDesktop: true,
  platform: process.platform,
  /** Downloaded talent data (or null to use the data bundled with the app). Synchronous so data modules can load it. */
  getTalentOverride: () => ipcRenderer.sendSync('talents:get-override'),
  /** Downloaded pre-raid gear lists (or null to use the bundled ones). */
  getGearOverride: () => ipcRenderer.sendSync('gear:get-override'),
  /** Downloaded dungeon abilities, loot and boss info (or null to use the bundled data). */
  getDungeonOverride: () => ipcRenderer.sendSync('dungeons:get-override'),
  /** Downloaded Legacy System perk data (or null to use the bundled data). */
  getLegacyOverride: () => ipcRenderer.sendSync('legacy:get-override'),
  /** Downloaded beta patch notes (or null to use the bundled ones). */
  getPatchNotesOverride: () => ipcRenderer.sendSync('patchnotes:get-override'),
  /** Info about downloaded zone maps (or null to use the bundled maps). */
  getMapsMeta: () => ipcRenderer.sendSync('maps:get-meta'),
  /** Downloaded Classic-vs-Forever class comparison (or null to use the bundled one). */
  getChangesOverride: () => ipcRenderer.sendSync('changes:get-override'),
  checkForUpdates: (current) => ipcRenderer.invoke('updates:check', current),
  /** Download talents, gear and/or class comparisons: { talents, gear, dungeons, changes (bools), gearProfiles, classGear, dungeonIds }. */
  applyUpdate: (options) => ipcRenderer.invoke('updates:apply', options),
  clearTalentUpdate: () => ipcRenderer.invoke('updates:clear-talents'),
  /** Subscribe to { percent, label } progress while an update downloads. Returns an unsubscribe function. */
  onUpdateProgress: (callback) => {
    const listener = (_event, progress) => callback(progress);
    ipcRenderer.on('updates:progress', listener);
    return () => ipcRenderer.removeListener('updates:progress', listener);
  },
  getAppInfo: () => ipcRenderer.invoke('app:info'),
  restartApp: () => ipcRenderer.invoke('app:restart'),
  openExternal: (url) => ipcRenderer.invoke('app:open-external', url),
  /** Scales the whole window (text size setting). */
  setZoom: (factor) => webFrame.setZoomFactor(Math.min(1.5, Math.max(0.75, Number(factor) || 1))),
  /** App (not guide data) updates from GitHub Releases. */
  getAppUpdate: () => ipcRenderer.invoke('appupdate:get'),
  checkAppUpdate: () => ipcRenderer.invoke('appupdate:check'),
  installAppUpdate: () => ipcRenderer.invoke('appupdate:install'),
  onAppUpdate: (callback) => {
    const listener = (_event, status) => callback(status);
    ipcRenderer.on('appupdate:status', listener);
    return () => ipcRenderer.removeListener('appupdate:status', listener);
  },
  /** Recolors the window controls to match the theme ('dark' | 'light'). */
  setTheme: (theme) => ipcRenderer.send('app:set-theme', theme),
  /** Saves the page's print layout as a PDF. Resolves to { ok, path? , canceled? }. */
  exportPdf: (fileName) => ipcRenderer.invoke('app:export-pdf', fileName),
});
