import { useEffect } from 'react';
import { Icon } from './icons.jsx';
import {
  applyTalentUpdate, checkForUpdates, dismissUpdate, needsUpdate, openExternal, updateKey, updatesSupported, useUpdates,
} from '../lib/updates.js';
import { checkAppUpdateOnStartup, installAppUpdate, useAppUpdate } from '../lib/appUpdate.js';

/** Banner shown when Blizzard or Wowhead have newer WoW Forever beta data than the app. */
export default function UpdateBanner({ nav }) {
  const { status, result, error, dismissed } = useUpdates();
  const app = useAppUpdate();

  useEffect(() => {
    checkForUpdates().catch(() => {});
    checkAppUpdateOnStartup();
  }, []);

  if (!updatesSupported()) return null;

  if (app.state === 'ready') {
    return (
      <div className="update-banner app">
        <span className="ub-dot" />
        <div className="ub-text"><span><b>Everhart Guides {app.version} is ready.</b> Restart to finish updating; your notes and settings are kept.</span></div>
        <div className="ub-actions">
          <button className="btn-primary" onClick={installAppUpdate}>Restart &amp; update</button>
        </div>
      </div>
    );
  }

  if (status === 'applying') {
    return (
      <div className="update-banner">
        <span className="ub-dot spin" />
        <span>Updating guides with the latest WoW Forever data…</span>
      </div>
    );
  }
  if (status === 'error' && error) {
    return (
      <div className="update-banner error">
        <span>Update failed: {error}</span>
        <button className="btn-ghost" onClick={() => checkForUpdates({ force: true })}>Try again</button>
      </div>
    );
  }

  const talents = needsUpdate(result);
  const notes = result?.patchNotes?.changed;
  if (!talents && !notes) return null;
  if (dismissed === updateKey(result)) return null;

  return (
    <div className="update-banner">
      <span className="ub-dot" />
      <div className="ub-text">
        {talents && <span><b>New WoW Forever beta data is available.</b> Update to refresh talent trees, gear, dungeon guides and zone maps.</span>}
        {notes && <span>Blizzard posted new beta notes: <i>{result.patchNotes.title}</i></span>}
      </div>
      <div className="ub-actions">
        {talents && <button className="btn-primary" onClick={applyTalentUpdate}>Update guides</button>}
        {notes && <button className="btn-ghost" onClick={() => openExternal(result.patchNotes.url)}>Read on forums <Icon name="arrow" size={12} /></button>}
        <button className="btn-ghost" onClick={nav.beta}>Details</button>
        <button className="ub-close" onClick={() => dismissUpdate(result)} title="Dismiss"><Icon name="x" size={14} /></button>
      </div>
    </div>
  );
}
