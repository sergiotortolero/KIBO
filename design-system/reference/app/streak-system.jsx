// streak-system.jsx — Flame tier system + HUD-level streak indicator

// Tiers proposed to Sergio: progresivos en el primer año, luego hitos largos
// Demo user is at 23d, so still naranja base.
const FLAME_TIERS = [
  { days: 0,    color: 'var(--kb-streak)', name: 'Naranja',  desc: 'La llama inicial. Constancia que se enciende.' },
  { days: 30,   color: 'var(--kb-hp)', name: 'Roja',     desc: 'Un mes seguido. Ya no es accidente.' },
  { days: 60,   color: 'var(--kb-coin)', name: 'Ámbar',    desc: 'Dos meses. El hábito empieza a definirte.' },
  { days: 90,   color: 'var(--kb-primary)', name: 'Verde',    desc: '90 días. La identidad ya cambió.' },
  { days: 180,  color: 'var(--area-will)', name: 'Cyan',     desc: 'Medio año. Pocos llegan aquí.' },
  { days: 270,  color: 'var(--area-community)', name: 'Violeta',  desc: '9 meses. Disciplina extraordinaria.' },
  { days: 365,  color: 'var(--kb-coin)', name: 'Dorada',   desc: 'Un año entero. La llama de oro.', gold: true },
  { days: 730,  color: 'var(--kb-surface-2)', name: 'Blanca',   desc: 'Dos años. Maestría silenciosa.', borderC: 'var(--kb-border-strong)' },
  { days: 1000, color: 'var(--kb-text)', name: 'Negra',    desc: '1,000 días. Puedes elegir cualquier color.', custom: true },
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
          fill="var(--kb-canvas)" fillOpacity="0.55"
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
        <path d="M9 12l2 2 4-4" fill="none" stroke="var(--kb-canvas)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
  const flameColor = challengeActive ? 'var(--kb-hp)' : tier.color;
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
              ? <>Racha en <span style={{ color: 'var(--kb-hp)' }}>reto activo</span></>
              : <>Racha — llama <span style={{ color: tier.color }}>{tier.name}</span></>}
          </h4>
          <p className="kbv-body" style={{ fontSize: 12, margin: 0 }}>
            {challengeActive ? (
              <>Estás en un reto activo. Tu racha está <strong style={{ color: 'var(--kb-hp)' }}>en juego</strong>. Si fallas, gastas un protector.</>
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
                    background: `color-mix(in oklab, ${t.color} 18%, var(--kb-canvas))`,
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

// ─── Divisas de Kibo (glifos de marca, intencionalmente rellenos) ─────
// Moneda: la "K" de Kibo acuñada en oro, con canto biselado.
function CoinIcon({ size = 14 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      {/* Planos, sin degradado: disco, canto y relieve. */}
      <circle cx="12" cy="12" r="10" fill="var(--kb-coin)" />
      <circle cx="12" cy="12" r="10" fill="none" stroke="var(--kb-coin-ink)" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="7.4" fill="none" stroke="var(--kb-coin-ink)" strokeWidth="0.9" opacity="0.35" />
      {/* K de Kibo, compacta y centrada */}
      <path d="M9.9 8.6 V 15.4 M14.2 8.9 L 9.9 12.4 M11.4 11 L 14.5 15.2"
            fill="none" stroke="var(--kb-coin-ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Materia oscura — la divisa de la atención. No refleja la luz: la dobla.
// Fragmento casi negro con halo de lente gravitacional y dos arcos de
// distorsión. Contrasta a propósito con la moneda dorada.
// Materia oscura — esfera de obsidiana: negro volcánico con reflejo vítreo y
// un contorno que gira despacio (la luz que la órbita, no que refleja).
function GemIcon({ size = 14 }) {
  return (
    <svg className="kb-obsidian" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle className="ob-halo" cx="12" cy="12" r="10.2" fill="none"
              stroke="var(--kb-dark-halo)" strokeWidth="1.6"
              strokeDasharray="7 5" strokeLinecap="round" opacity="0.9" />
      <circle cx="12" cy="12" r="8.4" fill="var(--kb-dark-core)" />
      <circle cx="12" cy="12" r="8.4" fill="none" stroke="var(--kb-dark-edge)" strokeWidth="1.1" />
      {/* facetas vítreas de la obsidiana */}
      <path d="M7.4 7.8 Q 11 5.4 14.6 6.6 Q 10.6 8 8.6 11 Z" fill="var(--kb-dark-facet)" opacity="0.75" />
      <path d="M15.4 15.8 Q 13.6 17.6 10.8 17.9 Q 14 16.4 15.2 13.8 Z" fill="var(--kb-dark-facet)" opacity="0.5" />
      <circle cx="9.4" cy="8.9" r="1.5" fill="var(--kb-dark-glint)" opacity="0.95" />
    </svg>
  );
}




Object.assign(window, { FLAME_TIERS, getFlameTier, getNextFlameTier, FlameSVG, ShieldSVG, HUDStreak, CoinIcon, GemIcon });
