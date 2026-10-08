// WoW Forever full release: November 4, 2026, 3:00 p.m. PST (single global launch).
export const RELEASE = {
  name: 'WoW Forever',
  at: '2026-11-04T23:00:00Z',
  label: 'Wed, Nov 4, 2026 · 3:00 PM PST',
};

const RELEASE_MS = Date.parse(RELEASE.at);
const WEEK = 7 * 24 * 60 * 60 * 1000;
/** True once WoW Forever has launched: beta-only bits of the app (beta page, beta cap, countdown) switch off. */
export const isLaunched = (now = Date.now()) => now >= RELEASE_MS;
/** The "WoW Forever is live!" banner stays up for a week after launch. */
export const showLaunchBanner = (now = Date.now()) => now < RELEASE_MS + WEEK;
