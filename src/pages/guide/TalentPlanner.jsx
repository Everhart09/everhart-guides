import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../components/icons.jsx';
import { FIRST_TALENT_LEVEL, MAX_LEVEL, TOTAL_POINTS, indexTalents, rankText, stateAtLevel } from '../../lib/talents.js';
import TalentTree from './TalentTree.jsx';
import { talentIcon } from '../../lib/icons.js';

const PLAY_INTERVAL_MS = 420;

export default function TalentPlanner({ cls, spec, picks, onCustomize }) {
  const [level, setLevel] = useState(MAX_LEVEL);
  const [playing, setPlaying] = useState(false);
  const [tip, setTip] = useState(null);

  const talents = useMemo(() => indexTalents(cls), [cls]);
  const state = useMemo(() => stateAtLevel(picks, level), [picks, level]);
  const final = useMemo(() => stateAtLevel(picks, MAX_LEVEL), [picks]);
  const learnedAt = useMemo(() => {
    const m = {};
    picks.forEach((p) => (m[p.name] ||= []).push(p.level));
    return m;
  }, [picks]);

  const clamp = (l) => Math.max(1, Math.min(MAX_LEVEL, l));
  const step = (d) => { setPlaying(false); setLevel((l) => clamp(l + d)); };

  const togglePlay = () => {
    if (!playing && level >= MAX_LEVEL) setLevel(FIRST_TALENT_LEVEL - 1);
    setPlaying((p) => !p);
  };

  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(() => {
      setLevel((l) => {
        if (l >= MAX_LEVEL) { setPlaying(false); return MAX_LEVEL; }
        return l + 1;
      });
    }, PLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [playing]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' && e.target.type !== 'range') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); step(-1); }
      else if (e.key === 'Home') { e.preventDefault(); setPlaying(false); setLevel(FIRST_TALENT_LEVEL); }
      else if (e.key === 'End') { e.preventDefault(); setPlaying(false); setLevel(MAX_LEVEL); }
      else if (e.key === ' ' && e.target.tagName !== 'BUTTON') { e.preventDefault(); togglePlay(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const pct = ((level - 1) / (MAX_LEVEL - 1)) * 100;
  const current = picks.find((p) => p.level === level);
  const next = picks.find((p) => p.level === Math.max(level + 1, FIRST_TALENT_LEVEL));
  const signature = picks.filter((p) => p.max === 1);
  const treeById = Object.fromEntries(cls.trees.map((t) => [t.id, t]));

  return (
    <div className="planner">
      <section className="panel planner-head">
        <div className="planner-level">
          <span className="pl-label">Character level</span>
          <span className="pl-value">{level}</span>
          <span className="pl-points">{state.spent} <em>/ {TOTAL_POINTS} points</em></span>
        </div>

        <div className="planner-slider">
          <div className="slider-wrap">
            <div className="slider-markers">
              {signature.map((p) => (
                <button key={p.name} className={`marker ${p.level <= level ? 'on' : ''}`}
                  style={{ left: `${((p.level - 1) / (MAX_LEVEL - 1)) * 100}%`, '--t': treeById[p.tree].color }}
                  onClick={() => { setPlaying(false); setLevel(p.level); }}
                  title={`Lv ${p.level} · ${p.name}`}>
                  <span className="marker-label">{p.name}</span>
                </button>
              ))}
            </div>
            <input type="range" min={1} max={MAX_LEVEL} value={level} className="level-range"
              style={{ '--pct': `${pct}%` }} aria-label="Character level"
              onChange={(e) => { setPlaying(false); setLevel(Number(e.target.value)); }} />
            <div className="slider-ticks">
              {[1, 10, 20, 30, 40, 50, 60].map((t) => (
                <button key={t} style={{ left: `${((t - 1) / (MAX_LEVEL - 1)) * 100}%` }}
                  className={t <= level ? 'on' : ''} onClick={() => { setPlaying(false); setLevel(t); }}>{t}</button>
              ))}
            </div>
          </div>
          <div className="transport">
            <button onClick={() => { setPlaying(false); setLevel(FIRST_TALENT_LEVEL); }} title="First talent (Home)"><Icon name="first" size={14} /></button>
            <button onClick={() => step(-1)} title="Previous level (←)"><Icon name="minus" size={14} /></button>
            <button className="play" onClick={togglePlay} title="Play / pause (Space)">
              <Icon name={playing ? 'pause' : 'play'} size={15} />
            </button>
            <button onClick={() => step(1)} title="Next level (→)"><Icon name="plus" size={14} /></button>
            <button onClick={() => { setPlaying(false); setLevel(MAX_LEVEL); }} title="Level 60 (End)"><Icon name="last" size={14} /></button>
          </div>
        </div>

        <div className="planner-now">
          {level < FIRST_TALENT_LEVEL || !current ? (
            <>
              <span className="now-label">No talents yet</span>
              <strong>Talent points start at level {FIRST_TALENT_LEVEL}</strong>
              <span className="now-sub">Press play to watch the build unfold</span>
            </>
          ) : (
            <>
              <span className="now-label">Level {level} pick</span>
              <strong style={{ color: treeById[current.tree].color }}>{current.name}</strong>
              <span className="now-sub">
                Rank {current.rank}/{current.max} · {treeById[current.tree].name}
                {next && level < MAX_LEVEL && <> · next: {next.name}</>}
              </span>
            </>
          )}
        </div>
      </section>

      <div className="trees">
        {cls.trees.map((tree) => (
          <TalentTree
            key={tree.id}
            classId={cls.id}
            tree={tree}
            talents={talents}
            ranks={state.ranks}
            finalRanks={final.ranks}
            spent={state.treeTotals[tree.id] || 0}
            target={final.treeTotals[tree.id] || 0}
            freshName={current?.tree === tree.id ? current.name : null}
            isMain={tree.id === spec.tree}
            onTip={setTip}
          />
        ))}
      </div>

      <section className="panel">
        <header className="panel-head">
          <div>
            <div className="kicker">Level by level</div>
            <h3>Pick order</h3>
          </div>
          <button className="btn-ghost" onClick={onCustomize}>Customize in calculator <Icon name="arrow" size={12} /></button>
          <div className="legend">
            {cls.trees.map((t) => <span key={t.id} style={{ '--t': t.color }}>{t.name}</span>)}
          </div>
        </header>
        <ol className="pick-order">
          {picks.map((p) => (
            <li key={p.level}>
              <button
                className={p.level === level ? 'current' : p.level < level ? 'past' : 'future'}
                style={{ '--t': treeById[p.tree].color }}
                onClick={() => { setPlaying(false); setLevel(p.level); }}
              >
                <span className="po-level">{p.level}</span>
                <span className="po-name">{p.name}</span>
                <span className="po-rank">{p.rank}/{p.max}</span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      {tip && createPortal(
        <div className="talent-tip" style={{ left: tip.x, top: tip.y }}>
          <div className="tt-head">
            {talentIcon(cls.id, tip.talent.name) && <img src={talentIcon(cls.id, tip.talent.name)} alt="" width={36} height={36} />}
            <div className="tt-name">{tip.talent.name}</div>
          </div>
          <div className="tt-rank">
            Rank {state.ranks[tip.talent.name] || 0}/{tip.talent.max}
            {finalRankNote(final.ranks[tip.talent.name], tip.talent.max)}
          </div>
          {tip.talent.row > 0 && (
            <div className={`tt-req ${(state.treeTotals[tip.talent.tree] || 0) >= tip.talent.row * 5 ? 'met' : ''}`}>
              Requires {tip.talent.row * 5} points in {treeById[tip.talent.tree].name}
            </div>
          )}
          {tip.talent.req && (
            <div className={`tt-req ${(state.ranks[tip.talent.req] || 0) >= talents[tip.talent.req].max ? 'met' : ''}`}>
              Requires {talents[tip.talent.req].max} points in {tip.talent.req}
            </div>
          )}
          <p className="tt-desc">{rankText(tip.talent, state.ranks[tip.talent.name] || 1)}</p>
          {(state.ranks[tip.talent.name] || 0) > 0 && state.ranks[tip.talent.name] < tip.talent.max && (
            <p className="tt-next"><b>Next rank:</b> {rankText(tip.talent, state.ranks[tip.talent.name] + 1)}</p>
          )}
          {learnedAt[tip.talent.name] && (
            <div className="tt-levels">Learned at level {learnedAt[tip.talent.name].join(', ')}</div>
          )}
          {!learnedAt[tip.talent.name] && <div className="tt-skip">Not taken in this build</div>}
        </div>,
        document.body,
      )}
    </div>
  );
}

function finalRankNote(finalRank, max) {
  if (!finalRank) return null;
  return <span className="tt-final"> · build takes {finalRank}/{max}</span>;
}
