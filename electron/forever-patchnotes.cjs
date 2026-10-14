// Imports Blizzard's WoW Forever patch notes forum thread into the app's patch notes format (see src/data/patchNotes.js).
// Each new build is a new post in the same thread; the newest post with content is the current notes. Used by the
// desktop app's updater.
//
// During the beta that's the "WoW Forever Beta Development Notes" thread. After launch Blizzard will post live patch
// notes in a new thread, so the thread to read comes from `sources.json` in the app's GitHub repo: change
// `patchNotesTopic` there to the new thread's number and every installed copy switches on its next update check,
// without a new release. If the file can't be read, the beta thread is used.

const FORUM = 'https://us.forums.blizzard.com/en/wow/t';
const BETA_TOPIC = 2360696;
const SOURCES = 'https://raw.githubusercontent.com/Everhart09/everhart-guides/main/sources.json';
const UA = { 'User-Agent': 'Mozilla/5.0 (EverhartGuides)', Accept: 'application/json' };

/** The forum thread number to import patch notes from. */
async function topicId() {
  try {
    const res = await fetch(SOURCES, { headers: { 'User-Agent': UA['User-Agent'] }, signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const id = Number((await res.json()).patchNotesTopic);
      if (Number.isInteger(id) && id > 0) return id;
    }
  } catch {
    /* offline or GitHub unreachable: use the beta thread */
  }
  return BETA_TOPIC;
}
const topicPage = (topic) => `${FORUM}/${topic.slug ?? 'topic'}/${topic.id}`;

const CLASS_IDS = ['druid', 'hunter', 'mage', 'paladin', 'priest', 'rogue', 'shaman', 'warlock', 'warrior'];
// Section headings in the notes → our section ids. Anything else becomes its own section.
const SECTION_OF = [
  [/^(bug ?fixes|changes and updates|general|world|camping|items|races|dungeons?)$/i, 'general', 'General & World'],
  [/^classes?$/i, 'classes', 'Classes'],
  [/^(pvp|player versus player|honor)/i, 'pvp', 'Player versus Player'],
  [/^professions?/i, 'professions', 'Professions'],
  [/^quests?/i, 'quests', 'Quests'],
  [/^(user interface|interface|ui|cooldown manager|gamepad)/i, 'ui', 'Interface, Cooldown Manager & Gamepad'],
  [/^known issues/i, 'known', 'Known Issues'],
];

// ── A tiny HTML tree builder (the forum's "cooked" HTML is simple and well-formed) ─────────────────────────────────
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', ndash: '–', mdash: '—', hellip: '…' };
const decode = (s) => s.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (m, e) =>
  e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : ENTITIES[e.toLowerCase()] ?? m);
const VOID = new Set(['br', 'img', 'hr', 'input', 'meta', 'link']);

function parse(html) {
  const root = { tag: 'root', children: [] };
  const stack = [root];
  for (const m of html.matchAll(/<(\/?)([a-z0-9]+)[^>]*?(\/?)>|([^<]+)/gi)) {
    const top = stack[stack.length - 1];
    if (m[4] !== undefined) { top.children.push({ text: decode(m[4]) }); continue; }
    const tag = m[2].toLowerCase();
    if (m[1]) {
      const i = stack.map((n) => n.tag).lastIndexOf(tag);
      if (i > 0) stack.length = i;
    } else {
      const node = { tag, children: [] };
      top.children.push(node);
      if (!VOID.has(tag) && !m[3]) stack.push(node);
    }
  }
  return root;
}
const textOf = (n) => (n.text !== undefined ? n.text : n.tag === 'br' ? ' ' : n.children.map(textOf).join(''));
const clean = (s) => s.replace(/\s+/g, ' ').replace(/\s+([.,;:])/g, '$1').trim();
const childEls = (n, tag) => n.children.filter((c) => c.tag === tag);
const isHeadingOnly = (li) => {
  // <li><strong>Druid</strong><ul>…</ul></li>
  const own = li.children.filter((c) => c.tag !== 'ul');
  return own.length > 0 && own.every((c) => c.tag === 'strong' || (c.text !== undefined && !c.text.trim())) && childEls(li, 'ul').length > 0;
};
const DEV_NOTE = /^developers[’']? ?notes?:\s*/i;

/** One <li> → a string, or { t, note?, sub? }. */
function toItem(li) {
  const own = clean(li.children.filter((c) => c.tag !== 'ul').map(textOf).join(''));
  const subs = [];
  let note = null;
  for (const ul of childEls(li, 'ul')) {
    for (const sub of childEls(ul, 'li')) {
      const t = clean(textOf(sub));
      if (!t) continue;
      if (DEV_NOTE.test(t)) note = t.replace(DEV_NOTE, '');
      else if (childEls(sub, 'ul').length && !clean(sub.children.filter((c) => c.tag !== 'ul').map(textOf).join(''))) {
        // An empty <li> wrapping another list (seen in dungeon lists): flatten it.
        subs.push(childEls(sub, 'ul').flatMap((u) => childEls(u, 'li').map((x) => clean(textOf(x)))).join(', '));
      } else subs.push(clean(textOf(sub)));
    }
  }
  if (!note && !subs.length) return own;
  return { t: own, ...(note ? { note } : {}), ...(subs.length ? { sub: subs } : {}) };
}

/** Items in a <ul>; nested "<li><strong>Heading</strong><ul>" become prefixed items or their own groups. */
function listItems(ul, prefix = '') {
  const out = [];
  for (const li of childEls(ul, 'li')) {
    if (isHeadingOnly(li)) {
      const head = clean(childEls(li, 'strong').map(textOf).join(' '));
      for (const inner of childEls(li, 'ul')) out.push(...listItems(inner, prefix ? `${prefix} — ${head}` : head));
      continue;
    }
    const item = toItem(li);
    if (!prefix) out.push(item);
    else if (typeof item === 'string') out.push(`${prefix} — ${item}`);
    else out.push({ ...item, t: `${prefix} — ${item.t}` });
  }
  return out;
}

function sectionFor(heading) {
  const hit = SECTION_OF.find(([re]) => re.test(heading));
  return hit ? { id: hit[1], title: hit[2] } : { id: heading.toLowerCase().replace(/[^a-z0-9]+/g, '-'), title: heading };
}

/** Converts one notes post into sections → groups → items. */
function toSections(cooked) {
  const root = parse(cooked.replace(/<a [^>]*class="anchor"[^>]*><\/a>/g, ''));
  const sections = new Map();
  const section = (heading) => {
    const s = sectionFor(heading);
    if (!sections.has(s.id)) sections.set(s.id, { id: s.id, title: s.title, groups: [] });
    return sections.get(s.id);
  };
  let heading = 'General';
  for (const node of root.children) {
    if (node.tag === 'p' || /^h\d$/.test(node.tag ?? '')) {
      const strong = childEls(node, 'strong');
      const t = clean(textOf(node));
      if (/^h\d$/.test(node.tag) && /known issues/i.test(t)) heading = 'Known Issues';
      else if ((strong.length && clean(strong.map(textOf).join(' ')) === t) || /^h[34]$/.test(node.tag)) heading = t;
      continue;
    }
    if (node.tag !== 'ul') continue;
    const sec = section(heading);
    if (sec.id === 'classes') {
      // <li><strong>Druid</strong><ul>…</ul></li> per class
      for (const li of childEls(node, 'li')) {
        const name = clean(childEls(li, 'strong').map(textOf).join(' ')).toLowerCase();
        const classId = CLASS_IDS.find((c) => name === c);
        if (classId && isHeadingOnly(li)) {
          let g = sec.groups.find((x) => x.classId === classId);
          if (!g) sec.groups.push((g = { classId, items: [] }));
          for (const ul of childEls(li, 'ul')) g.items.push(...attachNotes(listItems(ul)));
        } else {
          let g = sec.groups.find((x) => x.title === 'All classes');
          if (!g) sec.groups.unshift((g = { title: 'All classes', items: [] }));
          g.items.push(toItem(li));
        }
      }
      continue;
    }
    // Top-level items under the heading form a group; "<li><strong>Camping</strong><ul>" become their own groups.
    const loose = [];
    const at = sec.groups.length;
    for (const li of childEls(node, 'li')) {
      if (isHeadingOnly(li)) {
        const title = clean(childEls(li, 'strong').map(textOf).join(' '));
        sec.groups.push({ title, items: attachNotes(childEls(li, 'ul').flatMap((ul) => listItems(ul))) });
      } else loose.push(toItem(li));
    }
    if (loose.length) sec.groups.splice(at, 0, { title: sec.id === 'known' ? undefined : heading, items: attachNotes(loose) });
  }
  // Keep a stable order: general, classes, then the rest as they appeared, known issues last.
  const order = ['general', 'classes'];
  return [...sections.values()].sort((a, b) => {
    const ia = order.includes(a.id) ? order.indexOf(a.id) : a.id === 'known' ? 99 : 50;
    const ib = order.includes(b.id) ? order.indexOf(b.id) : b.id === 'known' ? 99 : 50;
    return ia - ib;
  });
}

/** A list item that is only a developers' note belongs to the item before it. */
function attachNotes(items) {
  const out = [];
  for (const it of items) {
    const t = typeof it === 'string' ? it : it.t;
    if (DEV_NOTE.test(t ?? '') && out.length) {
      const prev = out[out.length - 1];
      out[out.length - 1] = typeof prev === 'string' ? { t: prev, note: t.replace(DEV_NOTE, '') } : { ...prev, note: t.replace(DEV_NOTE, '') };
    } else out.push(it);
  }
  return out;
}

const flat = (sections) => sections.flatMap((s) => s.groups.flatMap((g) => g.items.map((it) => (typeof it === 'string' ? it : it.t))));

/** A few headline facts for the top of the page, found in the notes themselves. */
function highlightsOf(sections, niceDate) {
  const all = flat(sections);
  const out = [];
  const cap = all.map((t) => t.match(/maximum of level (\d+)|level cap[^.]*?(\d+)/i)).find(Boolean);
  if (cap) out.push({ label: 'Level cap', value: cap[1] ?? cap[2], text: `Beta players can now level to ${cap[1] ?? cap[2]}` });
  for (const t of all.filter((x) => /^new (dungeon|zone|raid)/i.test(x)).slice(0, 2)) {
    const [, kind, rest] = t.match(/^new (dungeon|zone|raid)\s*[-–—:]\s*(.+?)\.?$/i) ?? [];
    if (rest) out.push({ label: `New ${kind.toLowerCase()}`, value: rest.replace(/\s*\(.*\)$/, '').split(':').pop().trim(), text: t });
  }
  const classes = sections.find((s) => s.id === 'classes')?.groups.filter((g) => g.classId).length ?? 0;
  if (classes) out.push({ label: 'Class changes', value: String(classes), text: `${classes} classes have changes in this build` });
  out.push({ label: 'Total changes', value: String(all.length), text: `Changes listed in the ${niceDate.replace(/, \d{4}$/, '')} notes` });
  return out.slice(0, 4);
}

/** Fetches the thread and returns { topic, post, url } for the newest notes post. */
async function latestPost() {
  const id = await topicId();
  const res = await fetch(`${FORUM}/${id}.json`, { headers: UA });
  if (!res.ok) throw new Error(`Blizzard forums returned HTTP ${res.status}`);
  const topic = await res.json();
  const posts = (topic.post_stream?.posts ?? []).filter((p) => p.cooked && p.cooked.length > 200);
  // The thread may have more posts than the first page shows; fetch the newest ones if needed.
  const stream = topic.post_stream?.stream ?? [];
  const lastId = stream[stream.length - 1];
  let newest = posts[posts.length - 1];
  if (lastId && !posts.some((p) => p.id === lastId)) {
    const r = await fetch(`${FORUM}/${id}/posts.json?${stream.slice(-10).map((id) => `post_ids[]=${id}`).join('&')}`, { headers: UA });
    if (r.ok) {
      const more = ((await r.json()).post_stream?.posts ?? []).filter((p) => p.cooked && p.cooked.length > 200);
      if (more.length) newest = more[more.length - 1];
    }
  }
  if (!newest) throw new Error('No patch notes post found in the thread.');
  return { topic, post: newest, url: topicPage(topic) };
}

/** Downloads and converts the newest notes. `previous` is the PATCH being replaced (for the "previous build" box). */
async function fetchPatchNotes(previous = null) {
  const { topic, post, url } = await latestPost();
  const sections = toSections(post.cooked);
  const date = (post.created_at ?? new Date().toISOString()).slice(0, 10);
  const nice = new Date(date + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return {
    title: /beta/i.test(topic.title ?? '') ? 'Beta Development Notes' : 'Patch Notes',
    build: `${nice} update`,
    forumTitle: topic.title,
    postId: post.id,
    date,
    author: post.username,
    source: `${url}/${post.post_number}`,
    imported: true,
    highlights: highlightsOf(sections, nice),
    sections,
    previous: previous && previous.build !== `${nice} update`
      ? { build: previous.build, items: (previous.highlights ?? []).map((h) => h.text).filter(Boolean) }
      : previous?.previous ?? null,
  };
}

module.exports = { fetchPatchNotes, latestPost, toSections };
