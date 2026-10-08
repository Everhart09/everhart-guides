// Updates the app itself from GitHub Releases (github.com/Everhart09/everhart-guides) with electron-updater.
// New versions download in the background; the page shows a "Restart to update" prompt when one is ready.
// Guide *data* updates are separate (see updates:check / updates:apply in main.cjs).
const { app, BrowserWindow, ipcMain } = require('electron');

let status = { state: 'idle', version: null, percent: 0, error: null, current: app.getVersion() };
let updater = null;
const IS_MAC = process.platform === 'darwin';
// electron-updater errors include whole HTTP dumps; keep a short, readable line for the Settings screen.
const shortError = (e) => {
  const msg = String(e?.message ?? e ?? 'Unknown error');
  if (/latest\.yml/.test(msg) && /404/.test(msg)) return 'The latest release has no update information yet.';
  if (/ENOTFOUND|ECONNREFUSED|ETIMEDOUT|net::ERR/.test(msg)) return "Couldn't reach GitHub. Check your internet connection.";
  return msg.split('\n')[0].slice(0, 160);
};

function broadcast(patch) {
  status = { ...status, ...patch };
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.webContents.isDestroyed()) win.webContents.send('appupdate:status', status);
  }
}

function getUpdater() {
  if (updater || !app.isPackaged) return updater; // only installed copies can update themselves
  ({ autoUpdater: updater } = require('electron-updater'));
  // macOS only installs updates for code-signed apps, so there we just announce new versions with a download link.
  updater.autoDownload = !IS_MAC;
  updater.autoInstallOnAppQuit = true; // if the user just quits, the update installs then
  updater.on('checking-for-update', () => broadcast({ state: 'checking', error: null }));
  updater.on('update-available', (info) => broadcast(IS_MAC
    ? { state: 'available', version: info.version, url: `https://github.com/Everhart09/everhart-guides/releases/tag/v${info.version}` }
    : { state: 'downloading', version: info.version, notes: info.releaseNotes ?? null, percent: 0 }));
  updater.on('update-not-available', () => broadcast({ state: 'none' }));
  updater.on('download-progress', (p) => broadcast({ state: 'downloading', percent: Math.round(p.percent) }));
  updater.on('update-downloaded', (info) => broadcast({ state: 'ready', version: info.version, percent: 100 }));
  updater.on('error', (e) => broadcast({ state: 'error', error: shortError(e) }));
  return updater;
}

async function check() {
  const u = getUpdater();
  if (!u) return { ...status, state: 'unsupported' };
  if (status.state === 'downloading' || status.state === 'ready' || status.state === 'available') return status;
  try {
    await u.checkForUpdates();
  } catch (e) {
    broadcast({ state: 'error', error: shortError(e) });
  }
  return status;
}

function register() {
  ipcMain.handle('appupdate:get', () => (app.isPackaged ? status : { ...status, state: 'unsupported' }));
  ipcMain.handle('appupdate:check', () => check());
  ipcMain.handle('appupdate:install', () => {
    if (status.state === 'ready') setImmediate(() => getUpdater()?.quitAndInstall(false, true));
  });
}

/** Called once the window exists: quietly checks a few seconds after launch (if the user allows automatic checks). */
function checkOnStartup(enabled) {
  if (enabled && app.isPackaged) setTimeout(() => check(), 8000);
}

module.exports = { register, check, checkOnStartup };
