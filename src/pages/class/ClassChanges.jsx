import { useState } from 'react';
import { CHANGES } from '../../data/classChangesData.js';
import { Panel } from '../../components/ui.jsx';
import { talentIcon, iconUrl } from '../../lib/icons.js';
import { describeChange } from '../../lib/describeChange.js';

const day = (ymd) => new Date(ymd + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

function ChangedTalent({ t, classId }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="chg-row">
      <div className="chg-main">
        {talentIcon(classId, t.name) && <img className="chg-icon" src={talentIcon(classId, t.name)} alt="" width={30} height={30} />}
        <div className="chg-text">
          <strong>{t.name}</strong> <span className="chg-tree">{t.tree}</span>
          <div className="chg-notes">{t.notes.filter((n) => n !== 'Effect changed').map((n) => <span key={n} className="chip">{n}</span>)}</div>
          {t.before && (() => { const d = describeChange(t.before, t.after); return d && <p className={`chg-summary-line ${d.kind}`}>{d.text}</p>; })()}
        </div>
        {t.before && <button className="btn-ghost" onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Compare'}</button>}
      </div>
      {open && t.before && (
        <div className="chg-compare">
          <div><span className="chg-label">Classic</span><p>{t.before}</p></div>
          <div><span className="chg-label new">Forever</span><p>{t.after}</p></div>
        </div>
      )}
    </li>
  );
}

export default function ClassChanges({ cls, nav }) {
  const data = CHANGES.classes[cls.id];
  const [showAllChanged, setShowAllChanged] = useState(false);
  if (!data) return <p className="fine">No comparison data for this class yet.</p>;
  const { talents, abilities } = data;
  const byTree = (list) => cls.trees.map((tr) => [tr.name, list.filter((t) => t.tree === tr.name)]).filter(([, l]) => l.length);
  const changed = showAllChanged ? talents.changed : talents.changed.slice(0, 12);

  return (
    <div className="changes">
      <section className="panel chg-summary">
        <div className="kicker">Classic Era → WoW Forever</div>
        <h3>What&apos;s new for {cls.name}s</h3>
        <p className="lead small">
          A side-by-side of the Classic {cls.name} and the Forever version, generated from Wowhead&apos;s Classic and Forever data
          (updated {day(CHANGES.meta.importedAt)}). For the reasons behind changes, see the{' '}
          <button className="link-btn inline" onClick={nav.patch}>patch notes</button>.
        </p>
        <div className="chg-stats">
          <div><b>{talents.added.length}</b><span>New talents</span></div>
          <div><b>{talents.removed.length}</b><span>Removed talents</span></div>
          <div><b>{talents.changed.length}</b><span>Changed talents</span></div>
          <div><b>{abilities.added.length}</b><span>New abilities</span></div>
          <div><b>{abilities.removed.length + abilities.renamed.length}</b><span>Removed / renamed</span></div>
        </div>
      </section>

      <div className="chg-grid">
        <Panel kicker="Talents" title="New in Forever">
          {byTree(talents.added).map(([tree, list]) => (
            <div key={tree} className="chg-group">
              <h4>{tree}</h4>
              <ul>
                {list.map((t) => (
                  <li key={t.name} className="chg-row">
                    <div className="chg-main">
                      {talentIcon(cls.id, t.name) && <img className="chg-icon" src={talentIcon(cls.id, t.name)} alt="" width={30} height={30} />}
                      <div className="chg-text">
                        <strong>{t.name}</strong> <span className="chg-tree">{t.max} rank{t.max > 1 ? 's' : ''}</span>
                        <p>{t.desc}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Panel>

        <Panel kicker="Talents" title="Removed from the trees">
          {byTree(talents.removed).map(([tree, list]) => (
            <div key={tree} className="chg-group">
              <h4>{tree}</h4>
              <ul>
                {list.map((t) => (
                  <li key={t.name} className="chg-row removed">
                    <div className="chg-text">
                      <strong>{t.name}</strong> <span className="chg-tree">{t.max} rank{t.max > 1 ? 's' : ''}</span>
                      {t.note && <span className="chg-note">{t.note}</span>}
                      <p>{t.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Panel>
      </div>

      <Panel kicker="Talents" title="Reworked talents" className="chg-changed">
        <ul>{changed.map((t) => <ChangedTalent key={t.name} t={t} classId={cls.id} />)}</ul>
        {talents.changed.length > 12 && (
          <button className="gear-more" onClick={() => setShowAllChanged(!showAllChanged)}>
            {showAllChanged ? 'Show fewer' : `Show all ${talents.changed.length} changed talents`}
          </button>
        )}
      </Panel>

      <Panel kicker="Abilities" title="Spellbook changes">
        <div className="chg-abilities">
          <div>
            <h4>New abilities</h4>
            {abilities.added.length ? (
              <ul>
                {abilities.added.map((a) => (
                  <li key={a.name}>
                    {iconUrl(`ability/${cls.id}/${a.name}`) && <img src={iconUrl(`ability/${cls.id}/${a.name}`)} alt="" width={22} height={22} />}
                    <span><b>{a.name}</b> · level {a.level}{a.note && <em className="chg-note">{a.note}</em>}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="fine">None</p>}
          </div>
          <div>
            <h4>Renamed</h4>
            {abilities.renamed.length ? (
              <ul>{abilities.renamed.map((r) => <li key={r.from}><span>{r.from} → <b>{r.to}</b></span></li>)}</ul>
            ) : <p className="fine">None</p>}
            <h4>Removed</h4>
            {abilities.removed.length ? (
              <ul>{abilities.removed.map((a) => <li key={a.name}><span>{a.name}{a.note ? <em className="chg-note">{a.note}</em> : ` (was level ${a.level})`}</span></li>)}</ul>
            ) : <p className="fine">None</p>}
          </div>
          <div>
            <h4>Learned at a different level</h4>
            {abilities.levelChanged.length ? (
              <ul>{abilities.levelChanged.map((a) => <li key={a.name}><span><b>{a.name}</b> · {a.from} → <b className={a.to < a.from ? 'earlier' : 'later'}>{a.to}</b></span></li>)}</ul>
            ) : <p className="fine">None</p>}
          </div>
        </div>
        <p className="fine">
          Classic data excludes Season of Discovery runes; spells that were runes and are now trained normally are marked as such.
        </p>
      </Panel>
    </div>
  );
}
