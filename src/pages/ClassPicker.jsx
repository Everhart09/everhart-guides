import { useState } from 'react';
import { QUESTIONS } from '../data/classPicker.js';
import { scoreSpecs, topPicks } from '../lib/classPicker.js';
import { ClassEmblem } from '../components/GameIcon.jsx';
import { Icon, ROLE_ICON } from '../components/icons.jsx';
import ClassReveal from '../components/ClassReveal.jsx';

const KEY = 'everhart.picker';
const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {};
  } catch {
    return {};
  }
};
const write = (answers) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(answers));
  } catch {
    /* storage unavailable */
  }
};
const done = (answers) => QUESTIONS.every((q) => answers[q.id]);

export default function ClassPicker({ nav }) {
  const [answers, setAnswers] = useState(read);
  const [step, setStep] = useState(() => (done(read()) ? QUESTIONS.length : -1)); // -1 intro, 0..n-1 questions, n results
  const [reveal, setReveal] = useState(null); // top pick shown in the reveal modal right after finishing

  const choose = (qid, oid) => {
    const next = { ...answers, [qid]: oid };
    setAnswers(next);
    write(next);
    if (step === QUESTIONS.length - 1 && done(next)) setReveal(topPicks(next, 1)[0]);
    setStep((s) => s + 1);
  };
  const restart = () => {
    setAnswers({});
    write({});
    setStep(0);
  };

  return (
    <div className="page picker">
      <header className="hero">
        <div className="hero-bg" />
        <div className="hero-crest"><Icon name="star" size={38} /></div>
        <div className="hero-text">
          <div className="kicker">WoW Forever · Class Picker</div>
          <h1>Find your class</h1>
          <p className="hero-desc">
            Answer {QUESTIONS.length} quick questions about how you like to play and we&apos;ll suggest the classes and specs that fit
            you best, based on the ratings in every guide.
          </p>
        </div>
      </header>

      {step === -1 && (
        <section className="panel pk-intro">
          <p>There are no wrong answers. Pick whatever sounds most fun, and you can retake it any time.</p>
          <button className="btn-primary" onClick={() => setStep(0)}>Start <Icon name="arrow" size={14} /></button>
        </section>
      )}

      {step >= 0 && step < QUESTIONS.length && (() => {
        const q = QUESTIONS[step];
        return (
          <section className="panel pk-question" key={q.id}>
            <div className="pk-progress">
              <span>Question {step + 1} of {QUESTIONS.length}</span>
              <div className="pk-bar"><i style={{ width: `${(step / QUESTIONS.length) * 100}%` }} /></div>
            </div>
            <h2>{q.q}</h2>
            {q.hint && <p className="pk-hint">{q.hint}</p>}
            <div className="pk-options">
              {q.options.map((o) => (
                <button key={o.id} className={`pk-option ${answers[q.id] === o.id ? 'picked' : ''}`} onClick={() => choose(q.id, o.id)}>
                  <strong>{o.label}</strong>
                  {o.sub && <span>{o.sub}</span>}
                </button>
              ))}
            </div>
            <div className="pk-nav">
              <button className="btn-ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>Back</button>
              {answers[q.id] && <button className="btn-ghost" onClick={() => setStep((s) => s + 1)}>Next</button>}
            </div>
          </section>
        );
      })()}

      {step >= QUESTIONS.length && done(answers) && <Results answers={answers} nav={nav} onRestart={restart} onEdit={() => setStep(0)} />}
      {reveal && (
        <ClassReveal pick={reveal} onClose={() => setReveal(null)} onGuide={() => { setReveal(null); nav.guide(reveal.cls.id, reveal.spec.id); }} />
      )}
    </div>
  );
}

function Results({ answers, nav, onRestart, onEdit }) {
  const picks = topPicks(answers, 3);
  const shown = new Set(picks.map((p) => p.spec.id + p.cls.id));
  const more = scoreSpecs(answers).filter((r) => !shown.has(r.spec.id + r.cls.id)).slice(0, 6);

  return (
    <>
      <div className="section-title"><h2>Your best matches</h2><span className="rule" /></div>
      <div className="pk-results">
        {picks.map((p, i) => (
          <article key={p.cls.id} className={`panel pk-card ${i === 0 ? 'best' : ''}`} style={{ '--c': p.cls.color }}>
            {i === 0 && <span className="pk-best">Best match</span>}
            <header>
              <ClassEmblem id={p.cls.id} size={52} />
              <div>
                <h3>{p.spec.name} {p.cls.name}</h3>
                <span className="pk-role"><Icon name={ROLE_ICON[p.spec.roles[0]]} size={12} /> {p.spec.role}</span>
              </div>
              <b className="pk-pct">{p.pct}%</b>
            </header>
            <p className="pk-tagline">{p.spec.tagline}</p>
            <ul className="pk-reasons">{p.reasons.slice(0, 5).map((r) => <li key={r}><Icon name="check" size={13} /> {r}</li>)}</ul>
            <div className="pk-actions">
              <button className="btn-primary" onClick={() => nav.guide(p.cls.id, p.spec.id)}>Read the guide</button>
              <button className="btn-ghost" onClick={() => nav.cls(p.cls.id)}>Class overview</button>
            </div>
          </article>
        ))}
      </div>

      <section className="panel pk-more">
        <div className="kicker">Also worth a look</div>
        <ul>
          {more.map((r) => (
            <li key={r.cls.id + r.spec.id} style={{ '--c': r.cls.color }}>
              <button onClick={() => nav.guide(r.cls.id, r.spec.id)}>
                <ClassEmblem id={r.cls.id} size={24} />
                <span>{r.spec.name} {r.cls.name}</span>
                <em>{r.pct}%</em>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="pk-footer">
        <button className="btn-ghost" onClick={onEdit}>Change my answers</button>
        <button className="btn-ghost" onClick={onRestart}>Start over</button>
        <p className="fine">Matches use each spec&apos;s ratings, role and difficulty from the guides, plus your playstyle answers.</p>
      </div>
    </>
  );
}
