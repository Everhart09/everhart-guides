import { CLASSES } from '../data/classes/index.js';
import { PROFESSIONS } from '../data/professions.js';
import { Icon, ROLE_ICON } from './icons.jsx';
import { ClassEmblem, ProfessionEmblem } from './GameIcon.jsx';
import { needsUpdate, updatesSupported, useUpdates } from '../lib/updates.js';
import { toggleFavorite, usePrefs } from '../lib/prefs.js';
import { pageInfo, pageKey } from '../lib/pages.js';

function FavIcon({ info }) {
  if (info.classId) return <ClassEmblem id={info.classId} size={20} />;
  if (info.profId) return <ProfessionEmblem id={info.profId} size={20} />;
  return <Icon name="skull" size={16} />;
}

export default function Sidebar({ route, nav }) {
  const inProfessions = route.view === 'professions' || route.view === 'profession';
  const { result, status } = useUpdates();
  const { favorites } = usePrefs();
  const current = pageKey(route);
  const favs = favorites.map((key) => ({ key, info: pageInfo(key) })).filter((f) => f.info);
  const updateDot = !updatesSupported() ? '' : status === 'checking' ? 'checking' : needsUpdate(result) ? 'update' : result ? 'ok' : '';

  return (
    <nav className="sidebar">
      <button className={`side-home ${route.view === 'home' ? 'active' : ''}`} onClick={nav.home}>
        <Icon name="home" size={16} /> Overview
      </button>
      <button className={`side-home ${route.view === 'picker' ? 'active' : ''}`} onClick={nav.picker}>
        <Icon name="star" size={16} /> Class Picker
      </button>
      <button className={`side-home ${route.view === 'patch' ? 'active' : ''}`} onClick={nav.patch}>
        <Icon name="check" size={16} /> Patch Notes <span className="side-new">Oct 1</span>
      </button>
      <button className={`side-home ${route.view === 'calc' ? 'active' : ''}`} onClick={() => nav.calc()}>
        <Icon name="plus" size={16} /> Talent Calculator
      </button>
      <button className={`side-home ${route.view === 'route' ? 'active' : ''}`} onClick={nav.route}>
        <Icon name="arrow" size={16} /> Leveling Route
      </button>
      <button className={`side-home ${route.view === 'dungeons' || route.view === 'dungeon' ? 'active' : ''}`} onClick={nav.dungeons}>
        <Icon name="skull" size={16} /> Dungeons &amp; Raids
      </button>

      {favs.length > 0 && (
        <>
          <div className="side-label">Favorites</div>
          <ul className="side-favs">
            {favs.map(({ key, info }) => (
              <li key={key} style={{ '--c': info.color }}>
                <button className={`side-fav ${current === key ? 'active' : ''}`} onClick={() => info.go(nav)} title={`${info.label} · ${info.sub}`}>
                  <span className="side-icon"><FavIcon info={info} /></span>
                  <span className="side-fav-label">{info.label}</span>
                </button>
                <button className="side-unfav" onClick={() => toggleFavorite(key)} title="Remove from favorites" aria-label={`Remove ${info.label} from favorites`}>
                  <Icon name="x" size={12} />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="side-label">Classes</div>
      <ul className="side-classes">
        {CLASSES.map((c) => {
          const open = route.classId === c.id && (route.view === 'class' || route.view === 'guide');
          return (
            <li key={c.id} className={open ? 'open' : ''} style={{ '--c': c.color }}>
              <button
                className={`side-class ${open && route.view === 'class' ? 'active' : ''}`}
                onClick={() => nav.cls(c.id)}
              >
                <span className="side-icon"><ClassEmblem id={c.id} size={22} /></span>
                <span>{c.name}</span>
              </button>
              {open && (
                <ul className="side-specs">
                  {c.specs.map((s) => (
                    <li key={s.id}>
                      <button
                        className={route.view === 'guide' && route.specId === s.id ? 'active' : ''}
                        onClick={() => nav.guide(c.id, s.id, route.view === 'guide' ? route.tab : 'overview')}
                      >
                        <Icon name={ROLE_ICON[s.roles[0]]} size={12} />
                        {s.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      <div className="side-label">Professions</div>
      <ul className="side-classes">
        <li className={inProfessions ? 'open' : ''} style={{ '--c': '#d9a659' }}>
          <button className={`side-class ${route.view === 'professions' ? 'active' : ''}`} onClick={nav.professions}>
            <span className="side-icon"><ProfessionEmblem id="blacksmithing" size={22} /></span>
            <span>All Professions</span>
          </button>
          {inProfessions && (
            <ul className="side-specs">
              {PROFESSIONS.map((p) => (
                <li key={p.id}>
                  <button className={route.profId === p.id && route.view === 'profession' ? 'active' : ''}
                    onClick={() => nav.prof(p.id, route.view === 'profession' ? route.tab : 'overview')}>
                    <ProfessionEmblem id={p.id} size={14} className="side-prof-icon" />
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>

      <button className={`side-beta ${route.view === 'beta' ? 'active' : ''}`} onClick={nav.beta}>
        <span className="side-beta-dot" /> WoW Forever Beta
      </button>
      <button className="side-settings" onClick={nav.settings} title="Settings & updates">
        <Icon name="settings" size={16} />
        <span>Settings</span>
        {updateDot && <span className={`set-dot ${updateDot}`} title={updateDot === 'update' ? 'Guide update available' : updateDot === 'ok' ? 'Guides are up to date' : 'Checking…'} />}
      </button>
    </nav>
  );
}
