import { Panel } from '../../components/ui.jsx';
import PreRaidGear from './PreRaidGear.jsx';
import { TIER_MEANING, statDescription } from '../../data/statGlossary.js';

const TIER_ORDER = ['Best', 'Good', 'Usable', 'Avoid'];

export default function GearTab({ cls, spec }) {
  const max = Math.max(...spec.stats.map((s) => s.weight));
  const weapons = [...spec.weapons].sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));

  return (
    <div className="grid-gear">
      <Panel kicker="Priority" title="Stat preferences" className="span-2">
        <ol className="stat-how">
          <li><b>Cap your hit first</b> if a stat says "to X%". Below that cap, hit is worth more than anything else.</li>
          <li><b>Then follow the order below.</b> Higher bars are worth more per point.</li>
          <li><b>Comparing two items?</b> The pre-raid gear list further down does the math for you using these weights.</li>
        </ol>
        <ol className="stat-list">
          {spec.stats.map((s, i) => (
            <li key={s.name}>
              <span className="stat-rank">{i + 1}</span>
              <div className="stat-body">
                <strong>{s.name}</strong>
                <div className="stat-bar"><i style={{ width: `${(s.weight / max) * 100}%` }} /></div>
                {s.note && <span className="stat-note">{s.note}</span>}
                {statDescription(s.name) && <span className="stat-what">{statDescription(s.name)}</span>}
              </div>
            </li>
          ))}
        </ol>
        <p className="fine">Bars show how much one point of each stat is worth for {spec.name} compared to the top stat.</p>
      </Panel>

      <Panel kicker="Armory" title="Weapon preferences">
        <ul className="weapon-list">
          {weapons.map((w) => (
            <li key={w.type}>
              <span className={`tier tier-${w.tier.toLowerCase()}`}>{w.tier}</span>
              <div>
                <strong>{w.type}</strong>
                {w.note && <span>{w.note}</span>}
                {TIER_MEANING[w.tier] && <span className="tier-meaning">{w.tier}: {TIER_MEANING[w.tier]}</span>}
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel kicker="Equipment" title="Armor & proficiencies">
        <dl className="facts stacked">
          <div><dt>Armor</dt><dd>{cls.armor}</dd></div>
          <div><dt>Can equip</dt><dd>{cls.weaponsUsable}</dd></div>
          <div><dt>Resource</dt><dd>{cls.resource}</dd></div>
        </dl>
      </Panel>

      <PreRaidGear cls={cls} spec={spec} />
    </div>
  );
}
