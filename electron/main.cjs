const { app, BrowserWindow, dialog, ipcMain, net, protocol, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { fetchForeverData, latestDataUrl, latestPatchNotes, fetchIcon } = require('./forever-data.cjs');
const { buildGearData, dbFromUrl } = require('./forever-gear.cjs');
const { buildClassChanges } = require('./class-changes.cjs');
const { buildDungeonData, portraitSource } = require('./forever-dungeons.cjs');
const appUpdater = require('./app-updater.cjs');
const { fetchPatchNotes, latestPost } = require('./forever-patchnotes.cjs');
const { buildLegacyData } = require('./forever-legacy.cjs');

appUpdater.register();

const isDev = process.argv.includes('--dev');

// Downloaded updates (talent trees, gear lists, dungeon data and class comparisons) live in the user's app-data folder, so they survive app updates.
const userDir = () => app.getPath('userData');
const overrideFile = () => path.join(userDir(), 'forever-talents.json');
const gearFile = () => path.join(userDir(), 'forever-gear.json');
const changesFile = () => path.join(userDir(), 'class-changes.json');
const patchNotesFile = () => path.join(userDir(), 'patch-notes.json');
const legacyFile = () => path.join(userDir(), 'forever-legacy.json');
const dungeonsFile = () => path.join(userDir(), 'forever-dungeons.json');
const userIconDir = () => path.join(userDir(), 'icons');
const bundledIconDirs = () => [path.join(__dirname, '..', 'dist', 'icons'), path.join(__dirname, '..', 'public', 'icons')];
// Boss portraits for the dungeon guides: downloaded first, then the ones bundled with the app.
const userPortraitDir = () => path.join(userDir(), 'portraits');
const bundledPortraitDirs = () => [path.join(__dirname, '..', 'dist', 'portraits'), path.join(__dirname, '..', 'public', 'portraits')];
function findPortrait(model) {
  for (const dir of [userPortraitDir(), ...bundledPortraitDirs()]) {
    const file = path.join(dir, `${model}.webp`);
    if (fs.existsSync(file)) return file;
  }
  return null;
}
// Zone maps for the leveling route: downloaded updates first, then the maps bundled with the app.
const userMapDir = () => path.join(userDir(), 'maps');
const bundledMapDirs = () => [path.join(__dirname, '..', 'dist', 'maps'), path.join(__dirname, '..', 'public', 'maps')];
const MAP_CDN = 'https://wow.zamimg.com/images/wow/classicplus/maps/enus/zoom/'; // "classicplus" = WoW Forever on Wowhead
function findMap(id) {
  for (const dir of [userMapDir(), ...bundledMapDirs()]) {
    const file = path.join(dir, `${id}.jpg`);
    if (fs.existsSync(file)) return file;
  }
  return null;
}

protocol.registerSchemesAsPrivileged([
  { scheme: 'ehicon', privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}
const readOverride = () => readJSON(overrideFile());

function findIcon(name) {
  for (const dir of [userIconDir(), ...bundledIconDirs()]) {
    const file = path.join(dir, `${name}.jpg`);
    if (fs.existsSync(file)) return file;
  }
  return null;
}

/** Downloads any icons we don't already have; reports progress between from and to. */
async function downloadIcons(names, progress, from, to, label) {
  fs.mkdirSync(userIconDir(), { recursive: true });
  const missing = [...new Set(names)].filter((icon) => icon && !findIcon(icon));
  for (const [i, icon] of missing.entries()) {
    progress(from + ((to - from) * i) / missing.length, `${label} (${i + 1} of ${missing.length})…`);
    const img = await fetchIcon(icon);
    if (img) fs.writeFileSync(path.join(userIconDir(), `${icon}.jpg`), img);
  }
  return missing.length;
}

// --- IPC: guide data & update checks --------------------------------------------------------

ipcMain.on('talents:get-override', (event) => {
  event.returnValue = readOverride();
});

ipcMain.on('gear:get-override', (event) => {
  event.returnValue = readJSON(gearFile());
});

ipcMain.on('dungeons:get-override', (event) => {
  event.returnValue = readJSON(dungeonsFile());
});

ipcMain.on('legacy:get-override', (event) => {
  event.returnValue = readJSON(legacyFile());
});

ipcMain.on('patchnotes:get-override', (event) => {
  event.returnValue = readJSON(patchNotesFile());
});

ipcMain.on('maps:get-meta', (event) => {
  event.returnValue = readJSON(path.join(userMapDir(), 'meta.json'));
});

ipcMain.on('changes:get-override', (event) => {
  event.returnValue = readJSON(changesFile());
});

ipcMain.handle('updates:check', async (_event, current) => {
  const result = { checkedAt: new Date().toISOString(), talents: null, gear: null, dungeons: null, maps: null, legacy: null, changes: null, patchNotes: null };
  try {
    const latest = await latestDataUrl();
    const latestDb = dbFromUrl(latest);
    result.talents = { latest, current: current?.talentDataUrl ?? null, changed: latest !== current?.talentDataUrl };
    result.gear = { latest: latestDb, current: current?.gearDb ?? null, changed: Boolean(latestDb) && latestDb !== current?.gearDb };
    result.dungeons = { latest: latestDb, current: current?.dungeonsDb ?? null, changed: Boolean(latestDb) && latestDb !== current?.dungeonsDb };
    result.maps = { latest: latestDb, current: current?.mapsDb ?? null, changed: Boolean(latestDb) && latestDb !== current?.mapsDb };
    result.legacy = { latest: latestDb, current: current?.legacyDb ?? null, changed: Boolean(latestDb) && latestDb !== current?.legacyDb };
    // The Classic-vs-Forever comparison is out of date whenever it was built from different Forever data than the latest.
    result.changes = { latest, current: current?.changesFor ?? null, changed: latest !== current?.changesFor };
  } catch (e) {
    result.talents = { error: e.message };
    result.gear = { error: e.message };
    result.dungeons = { error: e.message };
    result.maps = { error: e.message };
    result.legacy = { error: e.message };
    result.changes = { error: e.message };
  }
  try {
    const { topic, post } = await latestPost();
    const notes = { title: topic.title, postId: post.id, updatedAt: post.created_at, url: 'https://us.forums.blizzard.com/en/wow/t/wow-forever-beta-development-notes/2360696' };
    const norm = (s) => (s ?? '').replace(/[–—-]/g, '-').replace(/\s+/g, ' ').trim().toLowerCase();
    // New notes = a new thread title, or (once we know which post we have) a newer post in the thread.
    const newerPost = current?.patchPostId ? notes.postId !== current.patchPostId : false;
    result.patchNotes = { ...notes, changed: norm(notes.title) !== norm(current?.patchTitle) || newerPost };
  } catch (e) {
    result.patchNotes = { error: e.message };
  }
  return result;
});

/**
 * Downloads the latest WoW Forever data for the guides: talent trees, pre-raid gear lists and the
 * Classic-vs-Forever class comparison (each if requested). The page passes the gear profiles (stat weights) because they live in the app's source.
 * Progress goes to the page as { percent, label } for the progress bar.
 */
ipcMain.handle('updates:apply', async (event, options = {}) => {
  const send = (fraction, label) => {
    if (!event.sender.isDestroyed()) event.sender.send('updates:progress', { percent: Math.round(fraction * 100), label });
  };
  const doTalents = options.talents !== false;
  const doGear = Boolean(options.gear && options.gearProfiles && options.classGear);
  const doDungeons = Boolean(options.dungeons && options.dungeonIds);
  const doMaps = Boolean(options.maps && options.mapZones?.length);
  const doPatch = Boolean(options.patchNotes);
  const doLegacy = Boolean(options.legacy && options.legacySpells?.length);
  const doChanges = Boolean(options.changes);

  // Each step gets a slice of the progress bar (0–95%) sized by roughly how long it takes; saving is the last 5%.
  const weights = { talents: doTalents ? 2 : 0, gear: doGear ? 6 : 0, dungeons: doDungeons ? 3 : 0, maps: doMaps ? 2 : 0, patch: doPatch ? 0.5 : 0, legacy: doLegacy ? 0.5 : 0, changes: doChanges ? 0.6 : 0 };
  const total = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
  const ranges = {};
  let at = 0;
  for (const [step, w] of Object.entries(weights)) {
    ranges[step] = [at, at + (0.95 * w) / total];
    at = ranges[step][1];
  }
  // progress for a step: f (0–1) within its slice.
  const stepProgress = (step) => (f, label) => send(ranges[step][0] + f * (ranges[step][1] - ranges[step][0]), label);
  const split = (step, share) => ranges[step][0] + share * (ranges[step][1] - ranges[step][0]);

  try {
    let talentData = null;
    if (doTalents) {
      talentData = await fetchForeverData((f, label) => stepProgress('talents')(f * 0.85, label));
      await downloadIcons(Object.values(talentData.icons), send, split('talents', 0.85), ranges.talents[1], 'Downloading new talent icons');
    }
    const db = dbFromUrl(talentData?.meta.dataUrl ?? (await latestDataUrl()));

    let gearData = null;
    if (doGear) {
      const { icons, ...gear } = await buildGearData({
        profiles: options.gearProfiles,
        classGear: options.classGear,
        db,
        onProgress: (f, label) => stepProgress('gear')(f * 0.9, label),
      });
      await downloadIcons(icons, send, split('gear', 0.9), ranges.gear[1], 'Downloading new item icons');
      gearData = gear;
    }

    let dungeonData = null;
    if (doDungeons) {
      const { data, icons } = await buildDungeonData({
        ids: options.dungeonIds,
        db,
        onProgress: (f, label) => stepProgress('dungeons')(f * 0.9, label),
      });
      await downloadIcons(icons, send, split('dungeons', 0.9), split('dungeons', 0.95), 'Downloading new dungeon icons');
      // Portraits for any boss the app doesn't have one for yet (new bosses in a beta build).
      const missingPortraits = (options.dungeonIds.models ?? []).filter((m) => !findPortrait(m));
      fs.mkdirSync(userPortraitDir(), { recursive: true });
      for (const [i, model] of missingPortraits.entries()) {
        send(split('dungeons', 0.95 + (0.05 * i) / missingPortraits.length), `Downloading boss portraits (${i + 1} of ${missingPortraits.length})…`);
        const res = await fetch(portraitSource(model), { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (res.ok) fs.writeFileSync(path.join(userPortraitDir(), `${model}.webp`), Buffer.from(await res.arrayBuffer()));
      }
      dungeonData = data;
    }

    let mapsMeta = null;
    if (doMaps) {
      // Maps download into a staging folder and replace the old ones only once every map has arrived.
      const staging = path.join(userDir(), 'maps-new');
      fs.rmSync(staging, { recursive: true, force: true });
      fs.mkdirSync(staging, { recursive: true });
      const zones = [...new Set(options.mapZones)];
      for (const [i, id] of zones.entries()) {
        stepProgress('maps')(i / zones.length, `Downloading zone maps (${i + 1} of ${zones.length})…`);
        const res = await fetch(`${MAP_CDN}${id}.jpg`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (res.ok) fs.writeFileSync(path.join(staging, `${id}.jpg`), Buffer.from(await res.arrayBuffer()));
      }
      mapsMeta = { db, importedAt: new Date().toISOString().slice(0, 10), count: fs.readdirSync(staging).length };
      fs.writeFileSync(path.join(staging, 'meta.json'), JSON.stringify(mapsMeta));
    }

    let legacyData = null;
    if (doLegacy) {
      const { data, icons } = await buildLegacyData({ spellIds: options.legacySpells, db, onProgress: (f, label) => stepProgress('legacy')(f * 0.9, label) });
      await downloadIcons(icons, send, split('legacy', 0.9), ranges.legacy[1], 'Downloading Legacy perk icons');
      legacyData = data;
    }

    let patchData = null;
    if (doPatch) {
      send(ranges.patch[0], 'Downloading the latest beta patch notes…');
      patchData = await fetchPatchNotes(options.currentPatch ?? null);
    }

    let changesData = null;
    // Compare against the Forever data the app will use after restarting: what we just downloaded, or an earlier download.
    const foreverData = talentData ?? readOverride();
    if (doChanges && foreverData?.abilities) {
      send(ranges.changes[0], 'Comparing Classic and Forever classes…');
      const classic = await fetchForeverData((f) => stepProgress('changes')(f * 0.9, 'Downloading Classic talent data for comparison…'), 'classic');
      changesData = buildClassChanges(foreverData, classic);
    }

    send(0.97, 'Saving the updated guides…');
    if (talentData) fs.writeFileSync(overrideFile(), JSON.stringify(talentData));
    if (gearData) fs.writeFileSync(gearFile(), JSON.stringify(gearData));
    if (dungeonData) fs.writeFileSync(dungeonsFile(), JSON.stringify(dungeonData));
    if (mapsMeta) {
      fs.rmSync(userMapDir(), { recursive: true, force: true });
      fs.renameSync(path.join(userDir(), 'maps-new'), userMapDir());
    }
    if (changesData) fs.writeFileSync(changesFile(), JSON.stringify(changesData));
    if (patchData) fs.writeFileSync(patchNotesFile(), JSON.stringify(patchData));
    if (legacyData) fs.writeFileSync(legacyFile(), JSON.stringify(legacyData));
    send(1, 'Update complete');
    return {
      ok: true, talents: talentData?.meta ?? null, gear: gearData?.meta ?? null, dungeons: dungeonData?.meta ?? null, maps: mapsMeta, patchNotes: patchData ? { build: patchData.build } : null, changes: changesData?.meta ?? null,
    };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

ipcMain.handle('app:info', () => ({
  version: require('../package.json').version,
  electron: process.versions.electron,
  dataFolder: userDir(),
}));

ipcMain.handle('app:restart', () => {
  app.relaunch();
  app.exit(0);
});

ipcMain.handle('updates:clear-talents', () => {
  try {
    fs.rmSync(overrideFile(), { force: true });
    fs.rmSync(gearFile(), { force: true });
    fs.rmSync(changesFile(), { force: true });
    fs.rmSync(dungeonsFile(), { force: true });
    fs.rmSync(patchNotesFile(), { force: true });
    fs.rmSync(legacyFile(), { force: true });
    fs.rmSync(userMapDir(), { recursive: true, force: true });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

ipcMain.handle('app:open-external', (_event, url) => {
  if (/^https:\/\//.test(url)) shell.openExternal(url);
});

const OVERLAY = { dark: { color: '#0c0e13', symbolColor: '#c9a45c' }, light: { color: '#f3efe6', symbolColor: '#8a6118' } };
ipcMain.on('app:set-theme', (event, theme) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  try {
    win?.setTitleBarOverlay?.({ ...(OVERLAY[theme] ?? OVERLAY.dark), height: 44 });
    win?.setBackgroundColor(OVERLAY[theme]?.color ?? OVERLAY.dark.color);
  } catch {
    /* no overlay on this platform */
  }
});

// Saves the current page as a PDF using its print stylesheet (the guide cheat sheet).
ipcMain.handle('app:export-pdf', async (event, fileName = 'Everhart Guide') => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const safe = String(fileName).replace(/[\\/:*?"<>|]+/g, '').slice(0, 80) || 'Everhart Guide';
  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    title: 'Save cheat sheet as PDF',
    defaultPath: path.join(app.getPath('documents'), `${safe}.pdf`),
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  });
  if (canceled || !filePath) return { ok: false, canceled: true };
  try {
    const pdf = await event.sender.printToPDF({ pageSize: 'Letter', printBackground: true, margins: { marginType: 'none' } });
    fs.writeFileSync(filePath, pdf);
    shell.openPath(filePath);
    return { ok: true, path: filePath };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

// --- Window ---------------------------------------------------------------------------------

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: '#0c0e13',
    title: 'Everhart Guides',
    titleBarStyle: 'hidden',
    titleBarOverlay: { color: '#0c0e13', symbolColor: '#c9a45c', height: 44 },
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.once('ready-to-show', () => win.show());

  // Open any external links in the user's browser rather than inside the app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  // ehicon://icons/<name>.jpg → downloaded icons first, then the icons bundled with the app.
  protocol.handle('ehicon', (request) => {
    const url = new URL(request.url);
    const name = path.basename(url.pathname).replace(/\.(jpg|webp)$/, '').replace(/[^a-z0-9_-]/gi, '');
    // ehicon://maps/<zone id>.jpg → zone maps; ehicon://portraits/<model>.webp → boss portraits; ehicon://icons/<name>.jpg → icons.
    const file = url.hostname === 'maps' ? findMap(name) : url.hostname === 'portraits' ? findPortrait(name) : findIcon(name);
    return file ? net.fetch(pathToFileURL(file).toString()) : new Response('', { status: 404 });
  });

  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
