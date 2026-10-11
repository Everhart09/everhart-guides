// Scores every spec against the class picker answers and explains why the top picks fit.
import { CLASSES } from '../data/classes/index.js';
import { HYBRIDS, QUESTIONS, TRAITS } from '../data/classPicker.js';

const rangeOf = (spec) => (/ranged/i.test(spec.role) || spec.roles.includes('healer') ? 'ranged' : 'melee');
const tagsOf = (cls, spec) => TRAITS[cls.id]?.[spec.id] ?? [];
const asList = (x) => (Array.isArray(x) ? x : x ? [x] : []);
const option = (qid, answers) => QUESTIONS.find((q) => q.id === qid)?.options.find((o) => o.id === answers[qid]);

// Small stable number per (answers, spec). It only orders specs whose scores are exactly equal, so ties
// don't always fall to whichever class is listed first, while the same answers keep giving the same result.
const tieBreak = (answers, key) => {
  let h = 2166136261;
  for (const ch of JSON.stringify(answers) + key) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (h >>> 0) / 2 ** 32;
};

const RATING_WORDS = { leveling: 'leveling', solo: 'solo play', group: 'dungeons', pvp: 'PvP', raid: 'raiding' };

// Points per answer. Role is the strongest filter, then fantasy; the playstyle questions separate specs inside a class.
const W = { role: 30, offRole: -25, range: 12, offRange: -10, fantasy: 16, pace: 9, survive: 8, brings: 7, focus: 5, social: 4, difficulty: 8, hybrid: 6 };

/** Returns specs sorted by fit: [{ cls, spec, score, pct, reasons }]. */
export function scoreSpecs(answers) {
  const results = [];
  for (const cls of CLASSES) for (const spec of cls.specs) {
    let score = 0;
    const reasons = [];
    const tags = tagsOf(cls, spec);

    const role = option('role', answers);
    if (role?.role) {
      // Dual-role specs (Feral) match more answers, so each match counts a little less than a dedicated spec's.
      if (spec.roles.includes(role.role)) { score += spec.roles.length > 1 ? W.role - 8 : W.role; reasons.push(`Fills the ${role.role === 'dps' ? 'damage' : role.role} role you want`); }
      else score += W.offRole;
    }

    const range = option('range', answers);
    if (range?.range) {
      if (rangeOf(spec) === range.range) { score += W.range; reasons.push(range.range === 'melee' ? 'Fights up close' : 'Fights from range'); }
      else score += W.offRange;
    }

    const fantasy = option('fantasy', answers);
    if (asList(fantasy?.tag).some((t) => tags.includes(t))) { score += W.fantasy; reasons.push(`Matches the "${fantasy.label.toLowerCase()}" fantasy`); }

    for (const qid of ['pace', 'survive', 'brings']) {
      const o = option(qid, answers);
      if (o?.tag && tags.includes(o.tag)) { score += W[qid]; reasons.push(o.why); }
    }

    for (const qid of ['focus', 'social']) {
      const o = option(qid, answers);
      if (o?.rating) {
        const r = spec.ratings[o.rating] ?? 3;
        // Low ratings count half: a weak spot shouldn't bury a spec that fits everything else.
        score += (r - 3) * W[qid] * (r < 3 ? 0.5 : 1);
        if (r >= 5) reasons.push(`Excellent at ${RATING_WORDS[o.rating]}`);
        else if (r >= 4) reasons.push(`Strong at ${RATING_WORDS[o.rating]}`);
      }
    }

    const cx = option('complexity', answers);
    if (cx?.difficulty) {
      const d = spec.difficulty;
      const fit = cx.difficulty === 'low' ? d <= 2 : cx.difficulty === 'mid' ? d >= 2 && d <= 3 : d >= 3;
      if (fit) { score += W.difficulty; reasons.push(cx.difficulty === 'low' ? 'Easy to pick up' : cx.difficulty === 'mid' ? 'Rewards learning it well' : 'High skill ceiling'); }
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
    if (hybrid?.hybrid === 1 && HYBRIDS.includes(cls.id)) { score += W.hybrid; reasons.push('Can switch to other roles with a respec'); }
    if (hybrid?.hybrid === 0 && !HYBRIDS.includes(cls.id)) score += 3;

    results.push({ cls, spec, score, tie: tieBreak(answers, cls.id + spec.id), reasons: [...new Set(reasons)] });
  }
  results.sort((a, b) => b.score - a.score || b.tie - a.tie);
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
