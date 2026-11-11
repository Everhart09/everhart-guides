// Imports Blizzard's "WoW: Forever Hotfixes" forum thread: one entry per day, newest first, in the same
// sections → groups → items format as the patch notes. Blizzard keeps one thread and adds a post for each day of
// hotfixes (the first post repeats the newest day). The thread number comes from `hotfixesTopic` in the repo's
// sources.json, so a new thread can be picked up without a release.
const { toSections } = require('./forever-patchnotes.cjs');

const FORUM = 'https://us.forums.blizzard.com/en/wow/t';
const DEFAULT_TOPIC = 2403040;
const SOURCES = 'https://raw.githubusercontent.com/Everhart09/everhart-guides/main/sources.json';
const UA = { 'User-Agent': 'Mozilla/5.0 (EverhartGuides)', Accept: 'application/json' };
const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December';
const DATE = new RegExp(`\\b(${MONTHS})\\s+(\\d{1,2}),\\s+(\\d{4})\\b`);

async function topicId() {
  try {
    const res = await fetch(SOURCES, { headers: { 'User-Agent': UA['User-Agent'] }, signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const id = Number((await res.json()).hotfixesTopic);
      if (Number.isInteger(id) && id > 0) return id;
    }
  } catch {
    /* offline or GitHub unreachable */
  }
  return DEFAULT_TOPIC;
}

const plain = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

/** "2026-11-10" from the first date written in a post, or null. */
function dateOf(cooked) {
  const m = plain(cooked).slice(0, 200).match(DATE);
  if (!m) return null;
  const month = MONTHS.split('|').indexOf(m[1]) + 1;
  return `${m[3]}-${String(month).padStart(2, '0')}-${m[2].padStart(2, '0')}`;
}

/** Sections for one day's post. The date line ("November 10, 2026") isn't a section: its items go under General. */
function daySections(cooked) {
  const sections = toSections(cooked);
  const general = sections.find((s) => s.id === 'general');
  const out = [];
  for (const s of sections) {
    if (DATE.test(s.title) || /^hotfixes?\b/i.test(s.title)) {
      const groups = s.groups.map((g) => ({ ...g, title: g.title && (DATE.test(g.title) || /^hotfixes?\b/i.test(g.title)) ? undefined : g.title }));
      if (general) general.groups.unshift(...groups);
      else out.unshift({ id: 'general', title: 'General & World', groups });
    } else out.push(s);
  }
  return out.filter((s) => s.groups.some((g) => g.items.length));
}

async function getJSON(url) {
  const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`Blizzard forums returned HTTP ${res.status}`);
  return res.json();
}

/** Downloads the hotfix thread: { forumTitle, source, topicId, fetchedAt, days: [{ date, title, postId, source, updatedAt, sections }] }. */
async function fetchHotfixes() {
  const id = await topicId();
  const topic = await getJSON(`${FORUM}/${id}.json`);
  const posts = [...(topic.post_stream?.posts ?? [])];
  const stream = topic.post_stream?.stream ?? [];
  const missing = stream.filter((pid) => !posts.some((p) => p.id === pid));
  for (let i = 0; i < missing.length; i += 20) {
    const more = await getJSON(`${FORUM}/${id}/posts.json?${missing.slice(i, i + 20).map((p) => `post_ids[]=${p}`).join('&')}`);
    posts.push(...(more.post_stream?.posts ?? []));
  }
  const url = `${FORUM}/${topic.slug ?? 'topic'}/${id}`;
  const byDate = new Map();
  // Blizzard staff posts only; the first post repeats the newest day, so a day's own post wins over it.
  for (const p of posts.filter((x) => x.cooked && plain(x.cooked).length > 60 && (x.staff || x.post_number === 1 || x.username === topic.details?.created_by?.username)).sort((a, b) => b.post_number - a.post_number)) {
    const date = dateOf(p.cooked);
    if (!date || byDate.has(date)) continue;
    const sections = daySections(p.cooked);
    if (!sections.length) continue;
    byDate.set(date, {
      date,
      title: new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
      postId: p.id,
      source: `${url}/${p.post_number}`,
      updatedAt: p.updated_at ?? p.created_at,
      sections,
    });
  }
  const days = [...byDate.values()].sort((a, b) => b.date.localeCompare(a.date));
  if (!days.length) throw new Error('No hotfixes found in the thread.');
  return { forumTitle: topic.title, source: url, topicId: id, fetchedAt: new Date().toISOString(), days };
}

module.exports = { fetchHotfixes };
