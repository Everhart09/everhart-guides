import { TALENT_META } from '../data/talents/index.js';
import { PATCH } from '../data/patchNotes.js';
import { GEAR_META } from '../data/gearData.js';
import { Icon } from './icons.jsx';
import {
  applyTalentUpdate, checkForUpdates, openExternal, revertTalentUpdate, updatesSupported, useUpdates,
} from '../lib/updates.js';

const when = (iso) => (iso ? new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'never');

/** "Data & updates" panel: what beta data the app uses and whether newer data exists. */
export default function DataStatus() {
  const { status, result, error } = useUpdates();
  const supported = updatesSupported();
  const downloaded = TALENT_META.origin === 'downloaded';
  const t = result?.talents;
  const n = result?.patchNotes;
  const g = result?.gear;

  return (
    <div className="data-status">
      <ul className="ds-rows">
        <li>
          <span className="ds-label">Talent trees</span>
          <span>
            {downloaded ? 'Downloaded update' : 'Bundled with the app'} · imported {TALENT_META.importedAt}
            {t?.error ? <em className="bad"> — check failed</em>
              : t ? <em className={t.changed ? 'warn' : 'good'}>{t.changed ? ' — newer data available' : ' — up to date'}</em> : null}
          </span>
        </li>
        <li>
          <span className="ds-label">Gear lists</span>
          <span>
            {GEAR_META.origin === 'downloaded' ? 'Downloaded update' : 'Bundled with the app'} · imported {GEAR_META.importedAt}
            {g?.error ? <em className="bad"> — check failed</em>
              : g ? <em className={g.changed ? 'warn' : 'good'}>{g.changed ? ' — newer data available' : ' — up to date'}</em> : null}
          </span>
        </li>
        <li>
          <span className="ds-label">Patch notes</span>
          <span>
            {PATCH.build}
            {n?.error ? <em className="bad"> — check failed</em>
              : n ? <em className={n.changed ? 'warn' : 'good'}>{n.changed ? ` — newer: ${n.title}` : ' — up to date'}</em> : null}
          </span>
        </li>
        <li>
          <span className="ds-label">Last checked</span>
          <span>{supported ? when(result?.checkedAt) : 'Only available in the desktop app'}</span>
        </li>
      </ul>
      {error && <p className="ds-error">{error}</p>}
      {supported && (
        <div className="ds-actions">
          <button className="btn-ghost" onClick={() => checkForUpdates({ force: true }).catch(() => {})} disabled={status === 'checking' || status === 'applying'}>
            {status === 'checking' ? 'Checking…' : 'Check now'}
          </button>
          {(t?.changed || g?.changed) && (
            <button className="btn-primary" onClick={applyTalentUpdate} disabled={status === 'applying'}>
              {status === 'applying' ? 'Downloading…' : 'Update guides'}
            </button>
          )}
          {n?.changed && (
            <button className="btn-ghost" onClick={() => openExternal(n.url)}>Read new notes <Icon name="arrow" size={12} /></button>
          )}
          {(downloaded || GEAR_META.origin === 'downloaded') && <button className="btn-ghost" onClick={revertTalentUpdate}>Use bundled trees</button>}
        </div>
      )}
      <p className="fine">
        Updates download talent trees and pre-raid gear lists straight from the Forever beta data on Wowhead. If a guide build no
        longer fits the new trees, its guide will say so and you can fix it in the Talent Calculator. Patch notes still
        need to be transcribed into the app by hand.
      </p>
    </div>
  );
}
