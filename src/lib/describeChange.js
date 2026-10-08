// Turns a talent's Classic and Forever descriptions into a one-line, plain-English summary of what changed.

const NUMBER = /(\d+(?:\.\d+)?)\s*(%|sec|min|yards?|yd|rage|energy|mana)?/gi;
const numbersIn = (text) => [...text.matchAll(NUMBER)].map((m) => ({ value: Number(m[1]), unit: (m[2] ?? '').toLowerCase(), raw: m[0].trim() }));
// Filler words that don't tell the player anything about the change.
const FILLER = new Set(['your', 'done', 'total', 'that', 'this', 'with', 'when', 'have', 'also', 'into', 'from', 'each', 'they', 'their', 'them', 'which', 'while', 'will', 'been', 'being', 'after', 'effect', 'effects', 'chance', 'gives', 'causes', 'increases', 'reduces', 'amount']);
const words = (text) => new Set((text.toLowerCase().match(/[a-z][a-z']+/g) ?? []).filter((w) => !FILLER.has(w)));

/** { kind: 'numbers' | 'expanded' | 'trimmed' | 'reworded', text } */
export function describeChange(before, after) {
  if (!before || !after) return null;
  const a = numbersIn(before);
  const b = numbersIn(after);

  if (a.length === b.length && a.length > 0) {
    const changed = a.map((x, i) => [x, b[i]]).filter(([x, y]) => x.value !== y.value);
    if (changed.length) {
      const list = changed.slice(0, 3).map(([x, y]) => `${x.raw} → ${y.raw}`).join(', ');
      return { kind: 'numbers', text: `Numbers changed: ${list}${changed.length > 3 ? '…' : ''}` };
    }
  }

  // New words in Forever's text usually mean an added effect or a narrowed/expanded scope.
  const added = [...words(after)].filter((w) => !words(before).has(w) && w.length > 3);
  if (b.length > a.length || after.length > before.length * 1.25) {
    return { kind: 'expanded', text: `Expanded: now does more${added.length ? ` (mentions ${added.slice(0, 4).join(', ')})` : ''}` };
  }
  if (b.length < a.length || after.length < before.length * 0.75) {
    return { kind: 'trimmed', text: 'Trimmed: does less than in Classic' };
  }
  return { kind: 'reworded', text: added.length ? `Adjusted: same numbers, changed scope (${added.slice(0, 4).join(', ')})` : 'Reworded: same effect, clearer wording' };
}
