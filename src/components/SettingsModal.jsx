import { useEffect, useRef, useState } from 'react';
import { TALENT_META } from '../data/talents/index.js';
import { PATCH, PATCH_ORIGIN } from '../data/patchNotes.js';
import { GEAR_META } from '../data/gearData.js';
import { CHANGES_META } from '../data/classChangesData.js';
import { DUNGEON_META } from '../data/dungeons/index.js';
import { MAPS_META } from '../data/zoneMapsData.js';
import { LEGACY_META } from '../data/legacy.js';
import { Icon } from './icons.jsx';
import { TEXT_SIZES, setPref, usePrefs } from '../lib/prefs.js';
import { appUpdatesSupported, checkAppUpdate, installAppUpdate, useAppUpdate } from '../lib/appUpdate.js';
import {
  appInfo, autoCheckEnabled, checkForUpdates, downloadUpdate, needsUpdate, openExternal, restartApp,
  revertTalentUpdate, setAutoCheck, updatesSupported, useUpdates,
} from '../lib/updates.js';

const RESTART_DELAY_S = 3;
const day = (ymd) => (ymd ? new Date(ymd + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—');
const when = (iso) => (iso ? new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Never');

/**
 * Settings window. "Check for updates" compares the guides' talent trees and pre-raid gear lists with the
 * latest WoW Forever release; if either is behind, it downloads it with a progress bar and restarts the app.
 */
export default function SettingsModal({ initialMode = 'settings', onClose }) {
  const { result } = useUpdates();
  const prefs = usePrefs();
  const appUpdate = useAppUpdate();
  const [phase, setPhase] = useState('settings'); // settings | checking | uptodate | updating | restarting | error
  const [progress, setProgress] = useState({ percent: 0, label: '' });
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState(null);
  const [updating, setUpdating] = useState([]); // what's being updated, e.g. ['talent trees', 'gear lists']
  const [countdown, setCountdown] = useState(RESTART_DELAY_S);
  const [info, setInfo] = useState(null);
  const [auto, setAuto] = useState(autoCheckEnabled);
  const [tab, setTab] = useState('updates');
  const started = useRef(false);
  const supported = updatesSupported();
  const busy = phase === 'checking' || phase === 'updating' || phase === 'restarting';

  useEffect(() => {
    appInfo().then(setInfo).catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !busy && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [busy, onClose]);

  const runCheck = async () => {
    setError(null);
    setPhase('checking');
    try {
      const res = await checkForUpdates({ force: true });
      setNotes(res?.patchNotes?.changed ? res.patchNotes : null);
      if (res?.talents?.error) throw new Error(`Couldn't reach the WoW Forever data: ${res.talents.error}`);
      if (!needsUpdate(res)) return setPhase('uptodate');
      setUpdating([res.talents?.changed && 'talent trees', res.gear?.changed && 'pre-raid gear lists', res.dungeons?.changed && 'dungeon guides', res.maps?.changed && 'zone maps', res.legacy?.changed && 'Legacy perks', res.patchNotes?.changed && 'beta patch notes',
        res.changes?.changed && "“What's new” class comparisons"].filter(Boolean));
      setProgress({ percent: 0, label: 'Starting update…' });
      setPhase('updating');
      const applied = await downloadUpdate(setProgress, res);
      if (!applied.ok) throw new Error(applied.error);
      setProgress({ percent: 100, label: 'Update complete' });
      setPhase('restarting');
    } catch (e) {
      setError(e.message);
      setPhase('error');
    }
  };

  // Opened from an "Update" button: start right away.
  useEffect(() => {
    if (initialMode === 'update' && supported && !started.current) {
      started.current = true;
      runCheck();
    }
  });

  // Count down, then restart into the updated guides.
  useEffect(() => {
    if (phase !== 'restarting') return undefined;
    if (countdown <= 0) {
      restartApp();
      return undefined;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, countdown]);

  const toggleAuto = () => {
    setAutoCheck(!auto);
    setAuto(!auto);
  };

  return (
    <div className="modal-backdrop" onMouseDown={() => !busy && onClose()}>
      <div className="modal settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title" onMouseDown={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <h2 id="settings-title">{phase === 'settings' ? 'Settings' : 'Guide updates'}</h2>
          {!busy && <button className="ub-close" onClick={onClose} title="Close (Esc)"><Icon name="x" size={16} /></button>}
        </header>

        {phase === 'settings' && (
          <div className="modal-body">
            <nav className="set-tabs" role="tablist">
              {[['updates', 'Updates'], ['appearance', 'Appearance'], ['about', 'About']].map(([id, label]) => (
                <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{label}</button>
              ))}
            </nav>

            {tab === 'updates' && (<>
            <section className="set-section">
              <div className="set-row">
                <div>
                  <h3>Guide updates</h3>
                  <p>Checks the guides against the latest World of Warcraft Forever release and updates them if they&apos;re behind.</p>
                </div>
                <button className="btn-primary" onClick={runCheck} disabled={!supported}>Check for updates</button>
              </div>
              <ul className="set-facts">
                <li><span>Talent data</span><b>{TALENT_META.origin === 'downloaded' ? 'Updated in-app' : 'Bundled with app'} · {day(TALENT_META.importedAt)}</b></li>
                <li><span>Gear lists</span><b>{GEAR_META.origin === 'downloaded' ? 'Updated in-app' : 'Bundled with app'} · {day(GEAR_META.importedAt)}</b></li>
                <li><span>Dungeon guides</span><b>{DUNGEON_META.origin === 'downloaded' ? 'Updated in-app' : 'Bundled with app'} · {day(DUNGEON_META.importedAt)}</b></li>
                <li><span>Zone maps</span><b>{MAPS_META.origin === 'downloaded' ? 'Updated in-app' : 'Bundled with app'} · {day(MAPS_META.importedAt)}</b></li>
                <li><span>Legacy perks</span><b>{LEGACY_META.origin === 'downloaded' ? 'Updated in-app' : 'Bundled with app'} · {day(LEGACY_META.importedAt)}</b></li>
                <li><span>Patch notes</span><b>{PATCH_ORIGIN === 'downloaded' ? 'Imported in-app' : 'Bundled with app'} · {PATCH.build}</b></li>
                <li><span>Last checked</span><b>{supported ? when(result?.checkedAt) : 'Desktop app only'}</b></li>
              </ul>
              {!supported && <p className="fine">Updates are only available in the desktop app.</p>}
            </section>

            <section className="set-section">
              <div className="set-row">
                <div>
                  <h3>Check automatically</h3>
                  <p>Look for new WoW Forever data and new app versions when the app starts.</p>
                </div>
                <button className={`toggle ${auto ? 'on' : ''}`} role="switch" aria-checked={auto} onClick={toggleAuto}>
                  <span />
                </button>
              </div>
              {(TALENT_META.origin === 'downloaded' || GEAR_META.origin === 'downloaded' || CHANGES_META.origin === 'downloaded' || DUNGEON_META.origin === 'downloaded' || MAPS_META.origin === 'downloaded' || PATCH_ORIGIN === 'downloaded' || LEGACY_META.origin === 'downloaded') && (
                <div className="set-row">
                  <div>
                    <h3>Use bundled guide data</h3>
                    <p>Undo downloaded updates and go back to the guide data, maps and patch notes that shipped with the app.</p>
                  </div>
                  <button className="btn-ghost" onClick={revertTalentUpdate}>Revert & restart</button>
                </div>
              )}
            </section>

            <section className="set-section">
              <h3 className="set-title">App version</h3>
              <div className="set-row">
                <div>
                  <h3>Everhart Guides {info?.version ?? ''}</h3>
                  <p>
                    {!appUpdatesSupported() || appUpdate.state === 'unsupported' ? 'App updates work in the installed app (download it from GitHub Releases).'
                      : appUpdate.state === 'checking' ? 'Checking GitHub for a new version…'
                        : appUpdate.state === 'downloading' ? `Downloading version ${appUpdate.version ?? ''}… ${appUpdate.percent ?? 0}%`
                          : appUpdate.state === 'ready' ? `Version ${appUpdate.version} is ready. Restart to finish updating.`
                            : appUpdate.state === 'none' ? 'You have the latest version.'
                              : appUpdate.state === 'error' ? `Couldn't check for app updates: ${appUpdate.error}`
                                : 'New versions download in the background and install when you restart.'}
                  </p>
                  {appUpdate.state === 'downloading' && <div className="progress small"><i style={{ width: `${appUpdate.percent ?? 0}%` }} /></div>}
                </div>
                {appUpdate.state === 'ready'
                  ? <button className="btn-primary" onClick={installAppUpdate}>Restart &amp; update</button>
                  : <button className="btn-ghost" onClick={checkAppUpdate} disabled={!appUpdatesSupported() || appUpdate.state === 'unsupported' || appUpdate.state === 'checking' || appUpdate.state === 'downloading'}>Check for app updates</button>}
              </div>
            </section>

            </>)}

            {tab === 'appearance' && (<>
            <section className="set-section">
              <div className="set-row">
                <div><h3>Theme</h3><p>Current is the classic Everhart look. Horde and Alliance recolor the app and add your faction&apos;s crest behind the pages.</p></div>
                <div className="seg" role="radiogroup" aria-label="Theme">
                  {[['dark', 'Current'], ['horde', 'Horde'], ['alliance', 'Alliance']].map(([id, label]) => (
                    <button key={id} role="radio" aria-checked={prefs.theme === id} className={`theme-opt theme-${id} ${prefs.theme === id ? 'active' : ''}`} onClick={() => setPref('theme', id)}>
                      <span className="theme-swatch" /> {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="set-row">
                <div><h3>Text size</h3><p>Scales the whole app, including talent trees.</p></div>
                <div className="seg" role="radiogroup" aria-label="Text size">
                  {TEXT_SIZES.map(([v, label]) => (
                    <button key={v} role="radio" aria-checked={prefs.textSize === v} className={prefs.textSize === v ? 'active' : ''} onClick={() => setPref('textSize', v)}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="set-row">
                <div><h3>Background orbs</h3><p>Floating orbs in your theme&apos;s colors behind the pages.</p></div>
                <button className={`toggle ${prefs.orbs !== false ? 'on' : ''}`} role="switch" aria-checked={prefs.orbs !== false} onClick={() => setPref('orbs', prefs.orbs === false)}>
                  <span />
                </button>
              </div>
              <div className="set-row">
                <div><h3>Compact layout</h3><p>Tighter spacing and a slimmer sidebar. Auto switches it on for small windows.</p></div>
                <div className="seg" role="radiogroup" aria-label="Compact layout">
                  {[['off', 'Off'], ['auto', 'Auto'], ['on', 'On']].map(([id, label]) => (
                    <button key={id} role="radio" aria-checked={prefs.compact === id} className={prefs.compact === id ? 'active' : ''} onClick={() => setPref('compact', id)}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            </>)}

            {tab === 'about' && (
            <section className="set-section about">
              <ul className="set-facts">
                <li><span>Everhart Guides</span><b>Version {info?.version ?? '—'}</b></li>
                <li><span>Talent source</span><b>{TALENT_META.source}</b></li>
                <li><span>Data folder</span><b className="mono">{info?.dataFolder ?? '—'}</b></li>
              </ul>
              <p className="set-credits">
                A free, unofficial fan project. Game data comes from the WoW Forever beta via Wowhead, and patch notes from
                Blizzard&apos;s official forum. World of Warcraft, WoW Forever and their artwork belong to Blizzard Entertainment.
              </p>
              <button className="btn-ghost" onClick={() => openExternal('https://github.com/Everhart09/everhart-guides')}>View on GitHub <Icon name="arrow" size={12} /></button>
            </section>
            )}
          </div>
        )}

        {phase === 'checking' && (
          <div className="modal-body center">
            <div className="spinner" />
            <h3>Checking for updates…</h3>
            <p>Comparing your guides with the latest World of Warcraft Forever data.</p>
          </div>
        )}

        {phase === 'uptodate' && (
          <div className="modal-body center">
            <div className="big-check"><Icon name="check" size={34} /></div>
            <h3>All guides are up to date!</h3>
            <p>Your talent trees, gear lists, dungeon guides, zone maps, Legacy perks, class comparisons and patch notes match the latest WoW Forever release.</p>
            {notes && (
              <p className="modal-note">
                Blizzard has posted newer beta notes: <i>{notes.title}</i>
                <button className="link-btn" onClick={() => openExternal(notes.url)}>Read them</button>
              </p>
            )}
            <button className="btn-primary" onClick={onClose}>Done</button>
          </div>
        )}

        {(phase === 'updating' || phase === 'restarting') && (
          <div className="modal-body center">
            <h3>{phase === 'restarting' ? 'Update complete' : 'Updating guides…'}</h3>
            {updating.length > 0 && <p className="updating-what">Updating {updating.join(' and ')}</p>}
            <div className="progress" role="progressbar" aria-valuenow={progress.percent} aria-valuemin={0} aria-valuemax={100}>
              <i style={{ width: `${progress.percent}%` }} />
            </div>
            <div className="progress-meta">
              <span>{progress.label}</span>
              <b>{progress.percent}%</b>
            </div>
            {phase === 'restarting' && (
              <p className="restart-note">Restarting Everhart Guides in {countdown}…</p>
            )}
          </div>
        )}

        {phase === 'error' && (
          <div className="modal-body center">
            <div className="big-check bad"><Icon name="x" size={30} /></div>
            <h3>Update failed</h3>
            <p>{error}</p>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setPhase('settings')}>Back</button>
              <button className="btn-primary" onClick={runCheck}>Try again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
