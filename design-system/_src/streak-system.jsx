// streak-system.jsx — Flame tier system + HUD-level streak indicator

// Tiers proposed to Sergio: progresivos en el primer año, luego hitos largos
// Demo user is at 23d, so still naranja base.
const FLAME_TIERS = [
  { days: 0,    color: '#FF7A45', name: 'Naranja',  desc: 'La llama inicial. Constancia que se enciende.' },
  { days: 30,   color: '#E64545', name: 'Roja',     desc: 'Un mes seguido. Ya no es accidente.' },
  { days: 60,   color: '#F4B740', name: 'Ámbar',    desc: 'Dos meses. El hábito empieza a definirte.' },
  { days: 90,   color: '#4CAF82', name: 'Verde',    desc: '90 días. La identidad ya cambió.' },
  { days: 180,  color: '#06B6D4', name: 'Cyan',     desc: 'Medio año. Pocos llegan aquí.' },
  { days: 270,  color: '#A855F7', name: 'Violeta',  desc: '9 meses. Disciplina extraordinaria.' },
  { days: 365,  color: '#F4B740', name: 'Dorada',   desc: 'Un año entero. La llama de oro.', gold: true },
  { days: 730,  color: '#EAF2F8', name: 'Blanca',   desc: 'Dos años. Maestría silenciosa.', borderC: '#C8D1DA' },
  { days: 1000, color: '#1A1A2E', name: 'Negra',    desc: '1,000 días. Puedes elegir cualquier color.', custom: true },
];

function getFlameTier(days) {
  let current = FLAME_TIERS[0];
  for (const t of FLAME_TIERS) {
    if (days >= t.days) current = t;
  }
  return current;
}

function getNextFlameTier(days) {
  return FLAME_TIERS.find(t => t.days > days) || null;
}

// SVG flame — cleaner teardrop shape with inner highlight
function FlameSVG({ size = 22, glow = true, tierColor }) {
  const style = tierColor ? { color: tierColor } : undefined;
  return (
    <span className={`kbv-flame ${glow ? 'glow' : ''}`} style={style}>
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id="kbv-flame-g" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%"   stopColor="currentColor" stopOpacity="0.95" />
            <stop offset="100%" stopColor="currentColor" />
          </linearGradient>
        </defs>
        {/* Outer flame — rounded teardrop with curl */}
        <path
          d="M12 2.4
             C 13.2 5.8, 16.6 7.8, 17.4 11.6
             C 18.2 15.4, 16.0 19.6, 12 20.4
             C 8.0 19.6, 5.6 15.6, 6.6 11.8
             C 7.2 9.4, 9.0 8.4, 9.4 6.0
             C 10.4 7.2, 11.0 8.6, 11.0 10.0
             C 11.5 8.0, 11.8 5.0, 12 2.4 Z"
          fill="url(#kbv-flame-g)"
        />
        {/* Inner core — lighter, smaller teardrop for depth */}
        <path
          d="M12 9.5
             C 13.2 11.5, 14.4 13.6, 13.4 16.4
             C 12.6 18.0, 11.0 18.2, 10.4 16.6
             C 9.6 14.6, 10.4 12.8, 11.4 11.2
             C 11.6 10.6, 11.8 10.0, 12 9.5 Z"
          fill="#FFFFFF" fillOpacity="0.55"
        />
      </svg>
    </span>
  );
}

// Shield (protector) SVG
function ShieldSVG({ size = 16, active }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"
         style={{ color: active ? 'var(--kb-primary)' : 'var(--kb-text-3)' }}>
      <path
        d="M12 2L4 5v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3z"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {active && (
        <path d="M9 12l2 2 4-4" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

// Always-visible streak chunk in the HUD (Header) — compact horizontal
function HUDStreak({ days = 23, protectors = 1, protectorsMax = 2, challengeActive = false }) {
  const [open, setOpen] = React.useState(false);
  const tier = getFlameTier(days);
  const next = getNextFlameTier(days);
  const ref = React.useRef(null);

  // When a procrastination challenge is active, the streak is "at risk":
  // surface that state with a red treatment + a sword (combat) icon overlay.
  const flameColor = challengeActive ? '#E64545' : tier.color;
  const tierName = challengeActive ? 'En reto' : tier.name;

  React.useEffect(() => {
    function onClick(e) { if (open && ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div ref={ref} className={`kbv-hud-streak ${challengeActive ? 'in-reto' : ''}`}
         style={{ '--flame-c': flameColor }}
         onClick={() => setOpen(o => !o)}
         title={challengeActive
           ? `Reto activo — racha en juego (${days} días)`
           : `Racha: ${days} días — llama ${tier.name}`}>
      <span className="flame-wrap">
        {challengeActive ? (
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            <FlameSVG size={22} tierColor={flameColor} />
            <span className="kbv-streak-reto-pip" aria-hidden="true">
              <KIcon name="sword" size={9} />
            </span>
          </span>
        ) : (
          <FlameSVG size={22} tierColor={tier.color} />
        )}
      </span>
      <div className="info">
        <span className="days"><strong>{days}</strong><span className="unit">d</span></span>
      </div>
      <div className="shields" title={`Protectores ${protectors}/${protectorsMax}`}>
        {Array.from({ length: protectorsMax }).map((_, i) =>
          <span key={i} className={`shield ${i < protectors ? 'on' : ''}`}>
            <ShieldSVG size={14} active={i < protectors} />
          </span>
        )}
      </div>

      {open && (
        <div className="kbv-flame-pop" onClick={(e) => e.stopPropagation()}>
          <h4>
            {challengeActive
              ? <>Racha en <span style={{ color: '#E64545' }}>reto activo</span></>
              : <>Racha — llama <span style={{ color: tier.color }}>{tier.name}</span></>}
          </h4>
          <p className="kbv-body" style={{ fontSize: 12, margin: 0 }}>
            {challengeActive ? (
              <>Estás en un reto activo. Tu racha está <strong style={{ color: '#E64545' }}>en juego</strong>. Si fallas, gastas un protector.</>
            ) : (
              <>Llevas <strong style={{ color: tier.color }}>{days} días</strong> seguidos.
                {next ? <> Próxima llama: <strong style={{ color: next.color }}>{next.name}</strong> en {next.days - days} días.</> : ' Llegaste al final de la escala.'}
              </>
            )}
          </p>
          <div className="kbv-flame-tiers">
            {FLAME_TIERS.map(t => {
              const unlocked = days >= t.days;
              const current = unlocked && t === tier;
              return (
                <div key={t.days}
                     className={`kbv-flame-tier ${unlocked ? 'unlocked' : 'locked'} ${current ? 'current' : ''}`}
                     style={{ '--tier-c': t.color }}>
                  <span className="swatch" style={{
                    background: `color-mix(in oklab, ${t.color} 18%, #FFFFFF)`,
                    color: t.color,
                    boxShadow: current
                      ? `0 0 0 1px ${t.color}, 0 0 0 3px color-mix(in oklab, ${t.color} 22%, transparent)`
                      : `0 0 0 1px color-mix(in oklab, ${t.color} 30%, var(--kb-border))`
                  }}>
                    <FlameSVG size={13} glow={false} tierColor={t.color} />
                  </span>
                  <span className="name" style={{ color: unlocked ? 'var(--kb-text)' : 'var(--kb-text-3)' }}>
                    {t.name}{t.custom ? ' · libre' : ''}
                    {current && <span className="current-pill">Aquí estás</span>}
                  </span>
                  <span className="when" style={{ color: t.color, fontWeight: 800 }}>
                    {t.days === 0 ? 'Inicio' : `${t.days}d`}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTop: '1px dashed var(--kb-border)' }}>
            <span className="kbv-meta">Protectores: <strong style={{ color: 'var(--kb-text)' }}>{protectors}/{protectorsMax}</strong></span>
            <span className="kbv-meta">Cada protector salva 1 día perdido.</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Coin / Gem icons (SVG, for HUD currency pills) ──────────────────
function CoinIcon({ size = 14 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="kbv-coin-g" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="60%" stopColor="#F4B740" />
          <stop offset="100%" stopColor="#C7900E" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#kbv-coin-g)" stroke="#8A6313" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="7" fill="none" stroke="#8A6313" strokeWidth="0.8" strokeDasharray="1.6 1.2" opacity="0.5"/>
      <path d="M12 7.6v8.8 M9.6 9.2h4.2a1.6 1.6 0 0 1 0 3.2H10a1.6 1.6 0 0 0 0 3.2h4.4"
            fill="none" stroke="#8A6313" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
function GemIcon({ size = 14 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="kbv-gem-g" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%"  stopColor="#A6DBFF" />
          <stop offset="55%" stopColor="#5BB4FF" />
          <stop offset="100%" stopColor="#1F7AD6" />
        </linearGradient>
      </defs>
      {/* Hex diamond shape — top facets + body */}
      <path d="M6 9 L 9 4 H 15 L 18 9 L 12 21 Z"
            fill="url(#kbv-gem-g)" stroke="#1F7AD6" strokeWidth="1.3" strokeLinejoin="round"/>
      {/* facet lines */}
      <path d="M6 9 H 18 M9 4 L 12 9 L 15 4 M9 4 L 12 21 M15 4 L 12 21"
            fill="none" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.65" strokeLinejoin="round"/>
      {/* sparkle */}
      <circle cx="10.5" cy="7" r="0.6" fill="#FFFFFF" opacity="0.85"/>
    </svg>
  );
}

Object.assign(window, { FLAME_TIERS, getFlameTier, getNextFlameTier, FlameSVG, ShieldSVG, HUDStreak, CoinIcon, GemIcon });
