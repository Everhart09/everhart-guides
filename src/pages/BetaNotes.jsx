import { BETA } from '../data/foreverBeta.js';
import { PATCH } from '../data/patchNotes.js';
import { RELEASE } from '../data/release.js';
import { Panel } from '../components/ui.jsx';
import { Icon } from '../components/icons.jsx';
import DataStatus from '../components/DataStatus.jsx';

const DAY = 86400000;
const fmt = (d) => new Date(d + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

export default function BetaNotes({ nav, embedded = false }) {
  const now = Date.now();
  const end = Date.parse(BETA.end + 'T23:59:59-07:00');
  const daysLeft = Math.max(0, Math.ceil((end - now) / DAY));
  const daysToLaunch = Math.max(0, Math.ceil((Date.parse(RELEASE.at) - now) / DAY));
  const knownIssues = PATCH.sections.find((s) => s.id === 'known')?.groups.flatMap((g) => g.items) ?? [];

  return (
    <div className={embedded ? 'news-body' : 'page'}>
      {!embedded && (<>
      <header className="hero">
        <div className="hero-bg" />
        <div className="hero-crest beta-crest">β</div>
        <div className="hero-text">
          <div className="kicker">WoW Forever · {fmt(BETA.start)} – {fmt(BETA.end)}, 2026</div>
          <h1>WoW Forever Beta</h1>
          <p className="hero-desc">
            WoW Forever is in beta testing until {fmt(BETA.end)}. Here's what's open right now, what's still limited,
            and what that means for the guides in this app.
          </p>
          <div className="hero-meta">
            <button className="btn-ghost" onClick={nav.patch}>Latest beta patch notes <Icon name="arrow" size={13} /></button>
          </div>
        </div>
      </header>
      </>)}

      <div className="pn-highlights">
        <div className="pn-highlight">
          <span className="pn-hl-label">Beta status</span>
          <strong>{daysLeft > 0 ? 'Live' : 'Ended'}</strong>
          <span>{daysLeft > 0 ? `${daysLeft} days left — ends ${fmt(BETA.end)}` : `Ended ${fmt(BETA.end)}`}</span>
        </div>
        <div className="pn-highlight">
          <span className="pn-hl-label">Level cap</span>
          <strong>{BETA.current.levelCap}</strong>
          <span>As of the {BETA.current.build}</span>
        </div>
        <div className="pn-highlight">
          <span className="pn-hl-label">Dungeons open</span>
          <strong>{BETA.current.dungeons.length}</strong>
          <span>Including 3 brand-new dungeons</span>
        </div>
        <div className="pn-highlight">
          <span className="pn-hl-label">Full release</span>
          <strong>{daysToLaunch > 0 ? `${daysToLaunch} days` : 'Live'}</strong>
          <span>{RELEASE.label}</span>
        </div>
      </div>

      <div className="grid-beta">
        <Panel kicker="Schedule" title="Beta timeline" className="span-2">
          <ol className="beta-timeline">
            {BETA.timeline.map((t) => {
              const state = Date.parse(t.date + 'T12:00:00') <= now ? 'done' : 'upcoming';
              return (
                <li key={t.date} className={state}>
                  <span className="bt-date">{fmt(t.date)}</span>
                  <span className="bt-dot" />
                  <div>
                    <strong>{t.title}</strong>
                    <ul className="bullets small">{t.items.map((i) => <li key={i}>{i}</li>)}</ul>
                  </div>
                </li>
              );
            })}
          </ol>
        </Panel>

        <Panel kicker="Read this first" title="Beta limitations">
          <ul className="limit-list">
            {BETA.limitations.map((l) => (
              <li key={l.area}>
                <span className="sev sev-medium">{l.area}</span>
                <p>{l.text}</p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel kicker={`Level cap ${BETA.current.levelCap}`} title="Dungeons in the beta">
          <ul className="dungeon-list">
            {BETA.current.dungeons.map(([name, note]) => (
              <li key={name}>
                <span>{name}</span>
                {note && <em className={note.includes('new') ? 'new' : ''}>{note}</em>}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel kicker="Getting in" title="Beta access">
          <ul className="bullets">{BETA.access.map((a) => <li key={a}>{a}</li>)}</ul>
        </Panel>

        <Panel kicker={PATCH.build} title="Known beta issues">
          <ul className="bullets small">{knownIssues.map((k) => <li key={k}>{k}</li>)}</ul>
        </Panel>

        <Panel kicker="Stay current" title="Beta data & updates" className="span-2">
          <DataStatus />
        </Panel>

        <Panel kicker="About these guides" title="How the guides handle the beta" className="span-2">
          <ul className="bullets">{BETA.guideNotes.map((n) => <li key={n}>{n}</li>)}</ul>
        </Panel>
      </div>
    </div>
  );
}
