// Smoke test: boots the built app and visits every page and tab, failing if any page crashes or logs an error.
// Usage: npm run smoke   (builds first). Run it before publishing a release.
const { app, BrowserWindow } = require('electron');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false, width: 1440, height: 900, webPreferences: { backgroundThrottling: false } });
  const errors = [];
  win.webContents.on('console-message', (_e, level, msg) => { if (level >= 3) errors.push(msg); });
  win.webContents.on('render-process-gone', (_e, d) => errors.push(`Renderer crashed: ${d.reason}`));
  await win.loadFile(path.join(ROOT, 'dist', 'index.html'));
  await wait(800);
  const js = (code) => win.webContents.executeJavaScript(code);

  // Top-level pages; classes, specs, professions and dungeons are discovered from the app's own sidebar and hub below.
  const routes = [{ view: 'home' }, { view: 'picker' }, { view: 'patch', tab: 'notes' }, { view: 'patch', tab: 'beta' },
    { view: 'calc', classId: 'warrior' }, { view: 'legacy' }, { view: 'dungeons' }, { view: 'professions' }];

  const pages = [];
  const visit = async (route, label) => {
    const before = errors.length;
    await js(`localStorage.setItem('everhart.route', ${JSON.stringify(JSON.stringify(route))}); location.reload(); true`);
    await wait(700);
    const ok = await js(`!!document.querySelector('.page') && document.querySelector('#root').children.length > 0`);
    if (!ok) errors.push(`${label}: page did not render`);
    pages.push(`${errors.length > before || !ok ? 'FAIL' : ' ok '} ${label}`);
  };

  for (const r of routes) await visit(r, `${r.view}${r.tab ? '/' + r.tab : ''}`);

  // Read the catalog through the UI: open each class, then each spec tab.
  await visit({ view: 'home' }, 'home (catalog)');
  const classIds = ['warrior', 'paladin', 'hunter', 'rogue', 'priest', 'shaman', 'mage', 'warlock', 'druid'];
  for (const c of classIds) {
    for (const tab of ['overview', 'changes', 'trainer']) await visit({ view: 'class', classId: c, tab }, `class ${c}/${tab}`);
    await visit({ view: 'class', classId: c }, `class ${c}`);
    const specs = await js(`[...document.querySelectorAll('.side-specs button')].map((b) => b.textContent.trim().toLowerCase().replace(/\\s+/g, '-'))`);
    for (const s of specs) {
      for (const tab of ['overview', 'talents', 'gear', 'rotation', 'leveling']) await visit({ view: 'guide', classId: c, specId: s, tab }, `guide ${c}/${s}/${tab}`);
    }
  }
  await visit({ view: 'professions' }, 'professions (catalog)');
  const profs = await js(`[...document.querySelectorAll('.side-specs button')].map((b) => b.textContent.trim().toLowerCase().replace(/\\s+/g, '-'))`);
  for (const p of profs) for (const tab of ['overview', 'leveling', 'recipes']) await visit({ view: 'profession', profId: p, tab }, `profession ${p}/${tab}`);
  await visit({ view: 'dungeons' }, 'dungeons (catalog)');
  const dungeonCount = await js(`document.querySelectorAll('.dh-card').length`);
  for (let i = 0; i < dungeonCount; i++) {
    await visit({ view: 'dungeons' }, 'dungeons');
    await js(`document.querySelectorAll('.dh-card')[${i}].click(); true`);
    await wait(500);
    const name = await js(`document.querySelector('.hero h1')?.textContent ?? '?'`);
    const ok = await js(`document.querySelectorAll('.boss-section').length > 0`);
    pages.push(`${ok ? ' ok ' : 'FAIL'} dungeon ${name}`);
    if (!ok) errors.push(`dungeon ${name}: no boss sections`);
  }

  const failed = pages.filter((p) => p.startsWith('FAIL'));
  console.log(pages.join('\n'));
  console.log(`\n${pages.length} pages visited, ${failed.length} failed, ${errors.length} errors.`);
  if (errors.length) console.log('\nErrors:\n' + [...new Set(errors)].slice(0, 30).join('\n'));
  app.exit(failed.length || errors.length ? 1 : 0);
});
