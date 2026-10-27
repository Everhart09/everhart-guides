// WoW Forever full release: November 4, 2026, 3:00 p.m. PST (single global launch).
export const RELEASE = {
  name: 'WoW Forever',
  at: '2026-11-04T23:00:00Z',
  label: 'Wed, Nov 4, 2026 · 3:00 PM PST',
};

// The beta runs until October 21, 2026 (Pacific time). Blizzard hasn't announced an exact closing time, so the
// countdown runs to the end of that day: 11:59 PM PDT.
export const BETA_END = {
  at: '2026-10-22T06:59:59Z',
  label: 'Wed, Oct 21, 2026 (Pacific time)',
  short: 'October 21',
};

const RELEASE_MS = Date.parse(RELEASE.at);
const BETA_END_MS = Date.parse(BETA_END.at);
const WEEK = 7 * 24 * 60 * 60 * 1000;
/** True once WoW Forever has launched: the launch countdown and banner switch over. */
export const isLaunched = (now = Date.now()) => now >= RELEASE_MS;
/** True once the beta has closed. Everything beta-only (beta page, beta cap, beta wording) switches off from here. */
export const isBetaOver = (now = Date.now()) => now >= BETA_END_MS;
/** The "WoW Forever is live!" banner stays up for a week after launch. */
export const showLaunchBanner = (now = Date.now()) => now < RELEASE_MS + WEEK;
/** Beta wording while the beta runs, normal wording once it has ended. Use it for any text that mentions the beta. */
export const stage = (betaText, liveText) => (isBetaOver() ? liveText : betaText);
