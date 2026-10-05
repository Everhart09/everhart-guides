// Scores every spec against the class picker answers and explains why the top picks fit.
import { CLASSES } from '../data/classes/index.js';
import { HYBRIDS, QUESTIONS, STYLE } from '../data/classPicker.js';

const rangeOf = (spec) => (/ranged/i.test(spec.role) || spec.roles.includes('healer') ? 'ranged' : 'melee');
const tagsOf = (cls, spec) => [...(STYLE[cls.id]?.tags ?? []), ...(STYLE[cls.id]?.specs[spec.id] ?? [])];
const asList = (x) => (Array.isArray(x) ? x : x ? [x] : []);
const option = (qid, answers) => QUESTIONS.find((q) => q.id === qid)?.options.find((o) => o.id === answers[qid]);

const RATING_WORDS = { leveling: 'leveling', solo: 'solo play', group: 'dungeons', pvp: 'PvP', raid: 'raiding' };

/** Returns specs sorted by fit: [{ cls, spec, score, pct, reasons }]. */
export function scoreSpecs(answers) {
  const results = [];
  for (const cls of CLASSES) for (const spec of cls.specs) {
    let score = 0;
    const reasons = [];
    const tags = tagsOf(cls, spec);

    const role = option('role', answers);
    if (role?.role) {
      if (spec.roles.includes(role.role)) { score += 30; reasons.push(`Fills the ${role.role === 'dps' ? 'damage' : role.role} role you want`); }
      else score -= 25;
    }

    const range = option('range', answers);
    if (range?.range) {
      if (rangeOf(spec) === range.range) { score += 12; reasons.push(range.range === 'melee' ? 'Fights up close' : 'Fights from range'); }
      else score -= 10;
    }

    const fantasy = option('fantasy', answers);
    const wanted = asList(fantasy?.tag);
    if (wanted.some((t) => tags.includes(t))) { score += 16; reasons.push(`Matches the "${fantasy.label.toLowerCase()}" fantasy`); }

    for (const qid of ['focus', 'social']) {
      const o = option(qid, answers);
      if (o?.rating) {
        const r = spec.ratings[o.rating] ?? 3;
        score += (r - 3) * 6;
        if (r >= 5) reasons.push(`Excellent at ${RATING_WORDS[o.rating]}`);
        else if (r >= 4) reasons.push(`Strong at ${RATING_WORDS[o.rating]}`);
      }
    }

    const cx = option('complexity', answers);
    if (cx?.difficulty) {
      const d = spec.difficulty;
      const fit = cx.difficulty === 'low' ? d <= 2 : cx.difficulty === 'mid' ? d >= 2 && d <= 3 : d >= 3;
      if (fit) { score += 10; reasons.push(cx.difficulty === 'low' ? 'Easy to pick up' : cx.difficulty === 'mid' ? 'Rewards learning it well' : 'High skill ceiling'); }
      else score -= Math.abs(d - (cx.difficulty === 'low' ? 1.5 : cx.difficulty === 'mid' ? 2.5 : 3.5)) * 4;
    }

    const pet = option('pet', answers);
    if (pet?.pet) {
      const hasPet = tags.includes('pet');
      if (pet.pet > 0 && hasPet) { score += 12; reasons.push('Comes with a permanent companion'); }
      if (pet.pet > 0 && !hasPet) score -= 4;
      if (pet.pet < 0 && hasPet) score -= 14;
    }

    const hybrid = option('hybrid', answers);
    if (hybrid?.hybrid === 1 && HYBRIDS.includes(cls.id)) { score += 9; reasons.push('Can switch to other roles with a respec'); }
    if (hybrid?.hybrid === 0 && !HYBRIDS.includes(cls.id)) score += 3;

    results.push({ cls, spec, score, reasons: [...new Set(reasons)] });
  }
  results.sort((a, b) => b.score - a.score);
  const top = results[0]?.score ?? 1;
  const bottom = results[results.length - 1]?.score ?? 0;
  for (const r of results) r.pct = Math.round(55 + (45 * (r.score - bottom)) / Math.max(1, top - bottom));
  return results;
}

/** Best spec per class, top N classes. */
export function topPicks(answers, n = 3) {
  const seen = new Set();
  return scoreSpecs(answers).filter((r) => (seen.has(r.cls.id) ? false : seen.add(r.cls.id))).slice(0, n);
}
