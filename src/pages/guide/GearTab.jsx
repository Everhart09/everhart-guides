import { Panel } from '../../components/ui.jsx';
import PreRaidGear from './PreRaidGear.jsx';

const TIER_ORDER = ['Best', 'Good', 'Usable', 'Avoid'];

export default function GearTab({ cls, spec }) {
  const max = Math.max(...spec.stats.map((s) => s.weight));
  const weapons = [...spec.weapons].sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));

  return (
    <div className="grid-gear">
      <Panel kicker="Priority" title="Stat preferences" className="span-2">
        <ol className="stat-list">
          {spec.stats.map((s, i) => (
            <li key={s.name}>
              <span className="stat-rank">{i + 1}</span>
              <div className="stat-body">
                <strong>{s.name}</strong>
                <div className="stat-bar"><i style={{ width: `${(s.weight / max) * 100}%` }} /></div>
                {s.note && <span className="stat-note">{s.note}</span>}
              </div>
            </li>
          ))}
        </ol>
        <p className="fine">Bars show relative value. Get your hit cap first, then follow the order.</p>
      </Panel>

      <Panel kicker="Armory" title="Weapon preferences">
        <ul className="weapon-list">
          {weapons.map((w) => (
            <li key={w.type}>
              <span className={`tier tier-${w.tier.toLowerCase()}`}>{w.tier}</span>
              <div>
                <strong>{w.type}</strong>
                {w.note && <span>{w.note}</span>}
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
