import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CLASSES } from '../data/classes/index.js';
import { ClassEmblem } from './GameIcon.jsx';
import { Icon } from './icons.jsx';

const ITEM = 132; // px per emblem slot
const LOOPS = 6; // full passes through the classes before landing
const SPIN_MS = 3400;
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Slot-machine style reveal: class emblems scroll past quickly, slow down and land on the suggested class,
 * then its spec and class name appear below.
 */
export default function ClassReveal({ pick, onClose, onGuide }) {
  const targetIndex = LOOPS * CLASSES.length + CLASSES.findIndex((c) => c.id === pick.cls.id);
  const strip = Array.from({ length: targetIndex + 4 }, (_, i) => CLASSES[i % CLASSES.length]);
  const [offset, setOffset] = useState(0);
  const [landed, setLanded] = useState(false);
  const [instant, setInstant] = useState(false);
  const viewport = useRef(null);

  useEffect(() => {
    // Center the target slot in the viewport.
    const width = viewport.current?.clientWidth ?? 660;
    const final = targetIndex * ITEM - (width / 2 - ITEM / 2);
    if (reducedMotion()) {
      setOffset(final);
      setLanded(true);
      return undefined;
    }
    const start = requestAnimationFrame(() => requestAnimationFrame(() => setOffset(final)));
    const done = setTimeout(() => setLanded(true), SPIN_MS + 80);
    return () => { cancelAnimationFrame(start); clearTimeout(done); };
  }, [targetIndex]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div className="modal-backdrop reveal-backdrop" onMouseDown={() => landed && onClose()}>
      <div className={`modal reveal ${landed ? 'landed' : 'spinning'}`} style={{ '--c': pick.cls.color }} onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Your class">
        <div className="reveal-glow" />
        <div className="reveal-stage">
          <div className="reveal-head">
            <div className="kicker">{landed ? 'Your best match' : 'Class picker'}</div>
            <h3>{landed ? 'You should play…' : 'Finding your class…'}</h3>
          </div>
          <div className="reel-wrap">
            <span className="reel-pointer top" />
            <div className="reel" ref={viewport}>
              <div
                className="reel-strip"
                style={{ transform: `translate3d(${-offset}px, 0, 0)`, transitionDuration: instant || reducedMotion() ? '0ms' : `${SPIN_MS}ms` }}
              >
                {strip.map((c, i) => (
                  <div key={i} className={`reel-item ${landed && i === targetIndex ? 'hit' : ''}`} style={{ width: ITEM }}>
                    <span className="reel-tile"><ClassEmblem id={c.id} size={76} /></span>
                  </div>
                ))}
              </div>
              <div className="reel-frame" />
              {landed && <span className="reel-burst" />}
            </div>
            <span className="reel-pointer bottom" />
          </div>
          <div className="reveal-result" aria-live="polite">
            {landed && (
              <>
                <h2>{pick.spec.name} {pick.cls.name}</h2>
                <p>{pick.spec.tagline}</p>
                <span className="reveal-pct">{pick.pct}% match</span>
                <div className="reveal-actions">
                  <button className="btn-primary" onClick={onGuide}>Read the guide <Icon name="arrow" size={14} /></button>
                  <button className="btn-ghost" onClick={onClose}>See all my matches</button>
                </div>
              </>
            )}
          </div>
        </div>
        {!landed && <button className="reveal-skip" onClick={() => { setInstant(true); setLanded(true); }}>Skip</button>}
      </div>
    </div>,
    document.body,
  );
}
