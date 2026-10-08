import { useEffect, useState } from 'react';
import { getClass, getSpec } from './data/classes/index.js';
import { TYPE_COLORS, getProfession } from './data/professions.js';
import TitleBar from './components/TitleBar.jsx';
import Sidebar from './components/Sidebar.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import Home from './pages/Home.jsx';
import ClassPage from './pages/ClassPage.jsx';
import GuidePage from './pages/GuidePage.jsx';
import ProfessionsHub from './pages/ProfessionsHub.jsx';
import ProfessionPage from './pages/ProfessionPage.jsx';
import BetaNotes from './pages/BetaNotes.jsx';
import PatchNotes from './pages/PatchNotes.jsx';
import TalentCalculator from './pages/TalentCalculator.jsx';
import UpdateBanner from './components/UpdateBanner.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import NotesDrawer from './components/NotesDrawer.jsx';
import BackgroundOrbs from './components/BackgroundOrbs.jsx';
import DungeonsHub from './pages/DungeonsHub.jsx';
import ClassPicker from './pages/ClassPicker.jsx';
import LegacyPage from './pages/LegacyPage.jsx';
import DungeonPage from './pages/DungeonPage.jsx';
import { getDungeon } from './data/dungeons/index.js';
import { pageKey } from './lib/pages.js';
import { rememberPage } from './lib/prefs.js';

const STORAGE_KEY = 'everhart.route';
const GOLD = '#c9a45c';

function isValid(r) {
  switch (r?.view) {
    case 'home': case 'professions': case 'beta': case 'patch': case 'dungeons': case 'picker': case 'legacy': return true;
    case 'dungeon': return !!getDungeon(r.dungeonId);
    case 'calc': return !!getClass(r.classId);
    case 'class': return !!getClass(r.classId);
    case 'guide': return !!getSpec(getClass(r.classId), r.specId);
    case 'profession': return !!getProfession(r.profId);
    default: return false;
  }
}

function loadRoute() {
  try {
    const r = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (isValid(r)) return r;
  } catch {
    /* ignore corrupt storage */
  }
  return { view: 'home' };
}

export default function App() {
  const [route, setRoute] = useState(loadRoute);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [settings, setSettings] = useState(null); // null | 'settings' | 'update'
  const [notesOpen, setNotesOpen] = useState(false);

  useEffect(() => {
    const open = (e) => setSettings(e.detail?.mode ?? 'settings');
    window.addEventListener('everhart:open-settings', open);
    return () => window.removeEventListener('everhart:open-settings', open);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(route));
      rememberPage(pageKey(route));
    } catch {
      /* storage unavailable */
    }
    document.querySelector('.main')?.scrollTo({ top: 0 });
  }, [route]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const cls = getClass(route.classId);
  const spec = getSpec(cls, route.specId);
  const prof = route.view === 'profession' ? getProfession(route.profId) : null;
  const dungeon = route.view === 'dungeon' ? getDungeon(route.dungeonId) : null;
  const accent = cls?.color ?? (prof ? TYPE_COLORS[prof.type] : GOLD);

  const nav = {
    home: () => setRoute({ view: 'home' }),
    cls: (classId, tab = 'overview') => setRoute({ view: 'class', classId, tab }),
    guide: (classId, specId, tab = 'overview') => setRoute({ view: 'guide', classId, specId, tab }),
    tab: (tab) => setRoute((r) => ({ ...r, tab })),
    professions: () => setRoute({ view: 'professions' }),
    prof: (profId, tab = 'overview') => setRoute({ view: 'profession', profId, tab }),
    beta: () => setRoute({ view: 'beta' }),
    patch: () => setRoute({ view: 'patch' }),
    dungeons: () => setRoute({ view: 'dungeons' }),
    picker: () => setRoute({ view: 'picker' }),
    legacy: () => setRoute({ view: 'legacy' }),
    dungeon: (dungeonId) => setRoute({ view: 'dungeon', dungeonId }),
    notes: () => setNotesOpen((o) => !o),
    settings: () => setSettings('settings'),
    calc: (classId = route.classId ?? 'warrior', from = null) => setRoute({ view: 'calc', classId, from }),
  };

  return (
    <div className="app" style={{ '--cls': accent }}>
      <TitleBar onSearch={() => setPaletteOpen(true)} onCountdown={nav.home} />
      <div className="body">
        <Sidebar route={route} nav={nav} />
        <BackgroundOrbs />
        <main className="main">
          <UpdateBanner nav={nav} />
          {route.view === 'home' && <Home nav={nav} />}
          {route.view === 'class' && cls && <ClassPage key={cls.id} cls={cls} tab={route.tab} nav={nav} />}
          {route.view === 'guide' && spec && (
            <GuidePage key={cls.id + spec.id} cls={cls} spec={spec} tab={route.tab} nav={nav} />
          )}
          {route.view === 'professions' && <ProfessionsHub nav={nav} />}
          {route.view === 'profession' && prof && (
            <ProfessionPage key={prof.id} prof={prof} tab={route.tab} nav={nav} />
          )}
          {route.view === 'beta' && <BetaNotes nav={nav} />}
          {route.view === 'patch' && <PatchNotes nav={nav} />}
          {route.view === 'dungeons' && <DungeonsHub nav={nav} />}
          {route.view === 'picker' && <ClassPicker nav={nav} />}
          {route.view === 'legacy' && <LegacyPage />}
          {route.view === 'dungeon' && dungeon && <DungeonPage key={dungeon.id} dungeon={dungeon} nav={nav} />}
          {route.view === 'calc' && cls && (
            <TalentCalculator key={cls.id + (route.from ?? '')} classId={cls.id} fromSpec={route.from} nav={nav} />
          )}
        </main>
      </div>
      {notesOpen && <NotesDrawer pageKey={pageKey(route)} nav={nav} onClose={() => setNotesOpen(false)} />}
      {paletteOpen && <CommandPalette nav={nav} onClose={() => setPaletteOpen(false)} />}
      {settings && <SettingsModal key={settings} initialMode={settings} onClose={() => setSettings(null)} />}
    </div>
  );
}
