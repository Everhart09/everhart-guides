import { useEffect, useState } from 'react';
import { BETA_END, RELEASE, isLaunched, showLaunchBanner } from '../data/release.js';

const RELEASE_MS = Date.parse(RELEASE.at);
const BETA_END_MS = Date.parse(BETA_END.at);

function useNow(interval = 1000) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(id);
  }, [interval]);
  return now;
}

function parts(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
}

const localLaunch = new Date(RELEASE_MS).toLocaleString(undefined, {
  weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
});

/** Large countdown card for the home page. */
export function CountdownHero({ onPatchNotes }) {
  const now = useNow();
  if (!showLaunchBanner(now)) return null;
  const left = RELEASE_MS - now;
  const t = parts(left);
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section className="countdown">
      <div className="countdown-glow" />
      <div className="countdown-text">
        <div className="kicker">Full release</div>
        <h2>{left > 0 ? `${RELEASE.name} launches in` : `${RELEASE.name} is live!`}</h2>
        <p>{RELEASE.label} · your time: {localLaunch}</p>
        {onPatchNotes && <button className="btn-ghost" onClick={() => onPatchNotes()}>{left > 0 ? 'Read the latest beta patch notes' : 'Read the patch notes'}</button>}
      </div>
      {left > 0 ? (
        <div className="countdown-clock" role="timer" aria-live="off">
          {[['Days', t.days], ['Hours', pad(t.hours)], ['Minutes', pad(t.minutes)], ['Seconds', pad(t.seconds)]].map(([label, v]) => (
            <div key={label} className="cd-unit">
              <span className="cd-value">{v}</span>
              <span className="cd-label">{label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="countdown-live">Servers are open. Good luck out there!</div>
      )}
      {left > 0 && <BetaEnd now={now} />}
    </section>
  );
}

/** Strip under the launch countdown: time left in the beta, then a note once it has closed. Gone at launch. */
function BetaEnd({ now }) {
  const left = BETA_END_MS - now;
  const t = parts(left);
  const pad = (n) => String(n).padStart(2, '0');
  if (left <= 0) {
    return (
      <div className="cd-beta ended">
        <span className="cd-beta-label">Beta</span>
        <span>The beta closed on {BETA_END.short}. The next time anyone can play is launch day.</span>
      </div>
    );
  }
  return (
    <div className="cd-beta">
      <span className="cd-beta-label">Beta ends in</span>
      <b className="cd-beta-clock" role="timer" aria-live="off">{t.days}d {pad(t.hours)}h {pad(t.minutes)}m {pad(t.seconds)}s</b>
      <span className="cd-beta-when">{BETA_END.label} · exact closing time not announced yet</span>
    </div>
  );
}

/** Compact countdown for the title bar. */
export function CountdownPill({ onClick }) {
  const now = useNow(1000);
  if (isLaunched(now)) return null;
  const left = RELEASE_MS - now;
  const t = parts(left);
  return (
    <button className="cd-pill" onClick={onClick} title={`Full release: ${localLaunch}`}>
      <span className="cd-dot" />
      {left > 0
        ? <>Launch in <b>{t.days}d {t.hours}h {String(t.minutes).padStart(2, '0')}m</b></>
        : <b>Live now</b>}
    </button>
  );
}
