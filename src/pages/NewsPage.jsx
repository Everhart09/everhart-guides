import { PATCH } from '../data/patchNotes.js';
import { isLaunched } from '../data/release.js';
import { Icon } from '../components/icons.jsx';
import PatchNotes from './PatchNotes.jsx';
import BetaNotes from './BetaNotes.jsx';

/** Patch notes and (until launch) the beta overview, on one page. */
export default function NewsPage({ tab = 'notes', nav }) {
  const launched = isLaunched();
  const showBeta = !launched;
  const current = showBeta && tab === 'beta' ? 'beta' : 'notes';

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-bg" />
        <img className="hero-logo" src="./brand/wow-forever-logo.png" alt="World of Warcraft: Forever" />
        <div className="hero-text">
          <div className="kicker">{launched ? 'Latest patch' : 'Latest beta patch'} · {PATCH.build}</div>
          <h1>{launched ? 'WoW Forever Patch Notes' : 'WoW Forever News'}</h1>
          <p className="hero-desc">
            {launched
              ? `Blizzard's official notes for the latest update, posted by ${PATCH.author}. Filter by class or category, or search for a change.`
              : `Blizzard's latest beta development notes, plus where the beta stands: level cap, open dungeons, known issues and the schedule to launch.`}
          </p>
          <div className="hero-meta">
            <a className="btn-ghost" href={PATCH.source} target="_blank" rel="noreferrer">
              Open the official forum post <Icon name="arrow" size={13} />
            </a>
          </div>
        </div>
      </header>

      {showBeta && (
        <nav className="tabs">
          <button className={current === 'notes' ? 'active' : ''} onClick={() => nav.patch('notes')}>Patch notes</button>
          <button className={current === 'beta' ? 'active' : ''} onClick={() => nav.patch('beta')}>Beta overview</button>
        </nav>
      )}

      {current === 'notes' ? <PatchNotes nav={nav} embedded /> : <BetaNotes nav={nav} embedded />}
    </div>
  );
}
