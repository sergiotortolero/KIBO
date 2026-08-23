// prestige-system.jsx — Progresión estilo Call of Duty con un VIAJE astronómico.
//
// MODELO:
//  • Niveles 1–100 = "Rangos" militares (20 emblemas, salto cada 5 niveles).
//    Escala de materiales: Bronce → Plata → Oro → Platino → Obsidiana →
//    Diamante → Esmeralda → Rubí → Damasco (el más raro, con logo animado).
//  • Al Nivel 100 se desbloquea el PRESTIGIO: reinicias a Nv. 1 y subes de grado.
//  • 16 prestigios = un ESCALAFÓN ESPACIAL ascendente, de Cadete Estelar hasta
//    la Leyenda (singularidad / agujero negro animado), grado supremo.
//  • Los últimos 10 grados ganan un ANILLO animado que envuelve el emblema,
//    con un color propio y complejidad creciente; la Leyenda corona con un
//    aro espectral que late.
//  • Equipar libremente cualquier emblema es EXCLUSIVO de la Leyenda (Maestro).
//  • Maestro: niveles de paragón sin tope + un "Trayecto hacia deidad" que se
//    revela como una línea de tiempo cósmica (ascensión a deidad).

const PRESTIGE_LEVELS = 100;
const PRESTIGE_MAX = 16; // el 16 (Leyenda) es Maestro

// Prestigio = ESCALAFÓN ESPACIAL ascendente: de cadete a leyenda.
// Cada prestigio es un grado militar cósmico (medallón con campo estelar),
// el dispositivo central escala por grupo (galones → órbitas → alas → laureles
// → nova → galaxia) y culmina en la singularidad (Leyenda, agujero negro animado).
const CELESTIAL = [
{ n: 1, name: 'Cadete Estelar', sub: 'Primer ascenso', type: 'cadete', a: '#AFC6E8', b: '#5B7DB0', ink: '#1E3358', glow: '#D6E4FF' },
{ n: 2, name: 'Piloto Orbital', sub: 'Vuelo libre', type: 'piloto', a: '#AFC6E8', b: '#5B7DB0', ink: '#1E3358', glow: '#D6E4FF' },
{ n: 3, name: 'Explorador Sideral', sub: 'Vanguardia', type: 'explorador', a: '#AFC6E8', b: '#5B7DB0', ink: '#1E3358', glow: '#D6E4FF' },
{ n: 4, name: 'Teniente Sideral', sub: 'Oficial', type: 'teniente', a: '#DEE4EC', b: '#97A4B4', ink: '#2C3742', glow: '#F2F6FA' },
{ n: 5, name: 'Capitán de Nave', sub: 'Al mando', type: 'capitan', a: '#DEE4EC', b: '#97A4B4', ink: '#2C3742', glow: '#F2F6FA' },
{ n: 6, name: 'Comandante de Flota', sub: 'Flota propia', type: 'flota', a: '#DEE4EC', b: '#97A4B4', ink: '#2C3742', glow: '#F2F6FA' },
{ n: 7, name: 'Comodoro Galáctico', sub: 'Líder de escuadra', type: 'comodoro', a: '#F4DC92', b: '#D0A02E', ink: '#5E440E', glow: '#FFE7A0' },
{ n: 8, name: 'Almirante', sub: 'Alto mando', type: 'almirante', a: '#F4DC92', b: '#D0A02E', ink: '#5E440E', glow: '#FFE7A0' },
{ n: 9, name: 'Almirante de Galaxias', sub: 'Dominio galáctico', type: 'galaxias', a: '#F4DC92', b: '#D0A02E', ink: '#5E440E', glow: '#FFE7A0' },
{ n: 10, name: 'Gran Almirante', sub: 'Mando supremo', type: 'granalmirante', a: '#E2C9FB', b: '#9B5CF0', ink: '#3A1E80', glow: '#CDA6FF', fancy: true },
{ n: 11, name: 'Señor de Constelaciones', sub: 'Soberano estelar', type: 'constelacion', a: '#E2C9FB', b: '#9B5CF0', ink: '#3A1E80', glow: '#CDA6FF', fancy: true },
{ n: 12, name: 'Soberano del Cosmos', sub: 'Trono cósmico', type: 'soberano', a: '#E2C9FB', b: '#9B5CF0', ink: '#3A1E80', glow: '#CDA6FF', fancy: true },
{ n: 13, name: 'Arquitecto de Estrellas', sub: 'Forja de soles', type: 'arquitecto', a: '#CFF6FF', b: '#22B8D6', ink: '#0E5A6A', glow: '#7FE6FF', fancy: true },
{ n: 14, name: 'Titán Cósmico', sub: 'Fuerza universal', type: 'titan', a: '#FFE0EE', b: '#E8527A', ink: '#7A1E38', glow: '#FF8AB0', fancy: true },
{ n: 15, name: 'Avatar Cósmico', sub: 'Forma trascendente', type: 'avatar', a: '#CFFBEA', b: '#16C98A', ink: '#0B5638', glow: '#7DFFC2', fancy: true },
{ n: 16, name: 'Leyenda', sub: 'Singularidad', type: 'blackhole', a: '#FFD36A', b: '#E08A2B', ink: '#1A1208', glow: '#FFC94D', master: true }];


const PRESTIGE_RANKS = CELESTIAL.map((c) => c.name);

// ── 20 rangos militares (salto cada 5 niveles) ─────────────────
// Escalafón ascendente; el último (Nv. 100) es el grado supremo, justo antes
// del primer prestigio.
const RANK_NAMES = [
'Soldado', 'Soldado de primera', 'Cabo', 'Cabo primero', 'Cabo mayor',
'Sargento', 'Sargento de estado mayor', 'Sargento mayor', 'Subteniente', 'Alférez',
'Teniente', 'Capitán', 'Mayor', 'Teniente coronel', 'Coronel',
'General de brigada', 'Mayor general', 'Teniente general', 'General', 'Capitán general'];

function rankGroup(i) {
  // 9 materiales (20 niveles): Bronce → Plata → Oro → Platino → Obsidiana
  //   → Diamante → Esmeralda → Rubí → Damasco (el más raro, animado).
  if (i <= 2) return { t: 'chevron', c: i + 1, a: '#E0A878', b: '#A8632E', ink: '#4A2810', name: 'Bronce' };
  if (i <= 5) return { t: 'bar', c: i - 2, a: '#D2D9E1', b: '#8A95A2', ink: '#363E48', name: 'Plata' };
  if (i <= 8) return { t: 'star', c: i - 5, a: '#F8DC8A', b: '#D4A22B', ink: '#5E440E', name: 'Oro' };
  if (i <= 11) return { t: 'eagle', c: i - 8, a: '#E9EEF3', b: '#AAB6C4', ink: '#3A434E', name: 'Platino' };
  if (i <= 13) return { t: 'wreath', c: i - 11, a: '#6E6880', b: '#241F30', ink: '#E6E1F2', name: 'Obsidiana' };
  if (i <= 15) return { t: 'diamond', c: i - 13, a: '#CFF6FF', b: '#3FC0DE', ink: '#0E4A5A', name: 'Diamante', anim: 'shine' };
  if (i <= 17) return { t: 'diamond', c: i - 15, a: '#A8E6C0', b: '#1E9E63', ink: '#0C4A2C', name: 'Esmeralda', anim: 'shine' };
  if (i === 18) return { t: 'crown', c: 1, a: '#FF9DB0', b: '#C8102E', ink: '#FFFFFF', name: 'Rubí', anim: 'shine' };
  return { t: 'crown', c: 1, a: '#C9CDD4', b: '#5A5E68', ink: '#241B33', name: 'Damasco', anim: 'oil' };
}
function rankTier(level) {return Math.min(19, Math.floor((Math.max(1, level) - 1) / 5));}

function prestigeInfo(completed, levelInPrestige) {
  const c = Math.max(0, Math.min(PRESTIGE_MAX, completed | 0));
  const master = c >= PRESTIGE_MAX;
  return {
    completed: c, levelInPrestige: levelInPrestige || 0, master, prestiged: c >= 1,
    levelsToNextPrestige: master ? 0 : PRESTIGE_LEVELS - (levelInPrestige || 0),
    rank: PRESTIGE_RANKS[Math.min(Math.max(c, 1), PRESTIGE_RANKS.length) - 1]
  };
}

// ── Equip store ────────────────────────────────────────────────
const EMBLEM_KEY = 'kibo:equippedEmblem';
function getEquippedEmblem() {return localStorage.getItem(EMBLEM_KEY) || null;}
function setEquippedEmblem(key) {
  try {localStorage.setItem(EMBLEM_KEY, key);} catch (_) {}
  try {window.dispatchEvent(new CustomEvent('kibo:emblem-change', { detail: { key } }));} catch (_) {}
}

let __emUid = 0;
function starPath(cx, cy, r) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const ang = Math.PI / 5 * i - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.45;
    d += (i === 0 ? 'M' : 'L') + (cx + rad * Math.cos(ang)).toFixed(1) + ' ' + (cy + rad * Math.sin(ang)).toFixed(1) + ' ';
  }
  return d + 'Z';
}

// ── Emblema de prestigio (cuerpo / estructura cósmica) ─────────
function PrestigeEmblem({ tier, size = 64, locked = false }) {
  const uid = React.useMemo(() => `ce${++__emUid}`, []);
  const t = CELESTIAL[(tier || 1) - 1] || CELESTIAL[0];
  const rg = `${uid}-r`,coreG = `${uid}-core`;
  const A = locked ? '#E2DED6' : t.a;
  const B = locked ? '#C7C1B5' : t.b;
  const ink = locked ? '#A39C8E' : t.ink;
  const glow = locked ? '#D8D3C8' : t.glow || t.a;
  const dev = t.dev || 1;
  const fancy = !locked && t.fancy,master = !locked && t.master;

  function ringStars(n, rad) {
    return Array.from({ length: n }).map((_, i) => {
      const a = Math.PI * 2 / n * i - Math.PI / 2;
      return <circle key={i} cx={(50 + Math.cos(a) * rad).toFixed(1)} cy={(50 + Math.sin(a) * rad).toFixed(1)} r="1.6" fill="#fff" opacity="0.9" />;
    });
  }

  // Anillo animado que envuelve el emblema. Sólo los últimos 10 grados (n>=7).
  // El nivel (1..10) escala la complejidad: de un aro punteado simple que gira,
  // a luz viajera + doble aro contrarrotante, hasta un aro espectral que late.
  const ringLvl = locked ? 0 : Math.max(0, Math.min(10, (t.n || tier) - 6));
  const prismId = `${uid}-pr`;
  function ringFx() {
    if (!ringLvl) return null;
    const col = t.glow || t.b;
    const prism = ringLvl >= 10;
    const dash = ringLvl >= 6 ? '3 5' : ringLvl >= 3 ? '2 6' : '1.5 8';
    const els = [];
    els.push(
      <g key="rot" className="cel-ring" style={{ animationDuration: 32 - ringLvl * 1.8 + 's' }}>
        <circle cx="50" cy="50" r="48" fill="none" stroke={prism ? `url(#${prismId})` : col}
        strokeWidth={ringLvl >= 6 ? 2.2 : 1.5} strokeDasharray={prism ? null : dash}
        strokeLinecap="round" opacity={prism ? 1 : 0.82} />
      </g>);
    if (ringLvl >= 3)
    els.push(<circle key="sw" className="cel-ring-sweep" cx="50" cy="50" r="48" fill="none" stroke="#fff"
    strokeWidth="2.4" pathLength="100" strokeDasharray={`${9 + ringLvl} ${91 - ringLvl}`} strokeLinecap="round"
    opacity="0.92" style={{ animationDuration: 8.5 - Math.min(5, ringLvl - 3) * 0.7 + 's' }} />);
    if (ringLvl >= 5)
    els.push(<g key="rev" className="cel-ring cel-ring-rev" style={{ animationDuration: 22 - ringLvl + 's' }}>
        <circle cx="50" cy="50" r="44.5" fill="none" stroke={col} strokeWidth="1" strokeDasharray="1 9" opacity="0.6" />
      </g>);
    return <g className={`cel-ringfx ${ringLvl >= 8 ? 'cel-ring-pulse' : ''}`}>{els}</g>;
  }

  function body() {
    switch (t.type) {
      case 'cadete': // galón + estrella guía — primer ascenso
        return <g>
          <path d="M34 58 L50 49 L66 58" fill="none" stroke={glow} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d={starPath(50, 38, 6)} fill="#fff" />
        </g>;
      case 'piloto': // alas + órbita de vuelo
        return <g>
          <ellipse cx="50" cy="50" rx="24" ry="9" fill="none" stroke={B} strokeWidth="1.6" opacity="0.7" transform="rotate(-18 50 50)" />
          <circle cx="71" cy="44" r="2.4" fill={glow} />
          <path d="M47 50 Q33 43 18 49 Q32 52 47 56 Z" fill={glow} />
          <path d="M53 50 Q67 43 82 49 Q68 52 53 56 Z" fill={glow} />
          <circle cx="50" cy="50" r="5" fill="#fff" />
        </g>;
      case 'explorador': // rosa de los vientos / brújula sideral
        return <g>
          <circle cx="50" cy="50" r="22" fill="none" stroke={B} strokeWidth="1.4" strokeDasharray="2 4" opacity="0.7" />
          <path d="M50 28 L55 50 L50 72 L45 50 Z" fill={glow} />
          <path d="M28 50 L50 45 L72 50 L50 55 Z" fill="#fff" opacity="0.9" />
          <circle cx="50" cy="50" r="3" fill={ink} />
        </g>;
      case 'teniente': // dos barras de oficial + estrella
        return <g>
          <path d={starPath(50, 33, 5)} fill="#fff" />
          <rect x="35" y="46" width="30" height="5" rx="2.5" fill={glow} />
          <rect x="35" y="57" width="30" height="5" rx="2.5" fill={glow} />
        </g>;
      case 'capitan': // timón de nave — al mando
        return <g>
          <circle cx="50" cy="50" r="16" fill="none" stroke={glow} strokeWidth="3" />
          {[0, 1, 2, 3, 4, 5].map((i) => {const a = Math.PI / 3 * i;return <line key={i} x1={(50 + Math.cos(a) * 5).toFixed(1)} y1={(50 + Math.sin(a) * 5).toFixed(1)} x2={(50 + Math.cos(a) * 23).toFixed(1)} y2={(50 + Math.sin(a) * 23).toFixed(1)} stroke={glow} strokeWidth="2.4" strokeLinecap="round" />;})}
          <circle cx="50" cy="50" r="5" fill="#fff" />
        </g>;
      case 'flota': // formación de tres naves
        return <g fill={glow} stroke={ink} strokeWidth="0.6">
          <path d="M50 32 l8 15 l-16 0 Z" />
          <path d="M33 54 l6.5 12 l-13 0 Z" />
          <path d="M67 54 l6.5 12 l-13 0 Z" />
        </g>;
      case 'comodoro': // alas amplias + estrella de escuadra
        return <g>
          <path d={starPath(50, 36, 5.5)} fill="#fff" />
          <path d="M49 52 Q29 44 12 51 Q29 54 49 58 Z" fill={glow} />
          <path d="M51 52 Q71 44 88 51 Q71 54 51 58 Z" fill={glow} />
          <circle cx="50" cy="53" r="4.5" fill="#fff" stroke={ink} strokeWidth="1" />
        </g>;
      case 'almirante': // almirante galáctico — ancla estelar sobre órbita + estrellas
        return <g>
          <ellipse cx="50" cy="52" rx="28" ry="10" fill="none" stroke={B} strokeWidth="1.4" opacity="0.55" transform="rotate(-16 50 52)" />
          <path d={starPath(24, 44, 2.8)} fill={glow} /><path d={starPath(78, 58, 2.6)} fill={glow} />
          <g fill="none" stroke={glow} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="50" cy="32" r="4" />
            <line x1="50" y1="36" x2="50" y2="64" />
            <line x1="40" y1="45" x2="60" y2="45" />
            <path d="M34 55 Q36 67 50 67 Q64 67 66 55" />
            <path d="M31 53 L34 57 M69 53 L66 57" />
          </g>
        </g>;
      case 'galaxias': // galaxia espiral girando + cúmulo
        return <g className="cel-spin"><g>
          <ellipse cx="50" cy="50" rx="28" ry="11" fill="none" stroke={B} strokeWidth="1.4" opacity="0.55" transform="rotate(-22 50 50)" />
          <path d="M50 50 Q70 42 78 53 M50 50 Q30 58 22 47" stroke={glow} strokeWidth="3" fill="none" strokeLinecap="round" transform="rotate(-22 50 50)" />
          <circle cx="50" cy="50" r="6" fill="#fff" />
          {ringStars(5, 27)}
        </g></g>;
      case 'granalmirante': // laurel + gran estrella — mando supremo
        return <g>
          <g fill="none" stroke={glow} strokeWidth="2.8" strokeLinecap="round"><path d="M40 66 Q25 55 30 35" /><path d="M60 66 Q75 55 70 35" /></g>
          <path d={starPath(50, 46, 9)} fill="#fff" />
          <path d={starPath(36, 38, 3)} fill="#fff" /><path d={starPath(64, 38, 3)} fill="#fff" />
        </g>;
      case 'constelacion': // constelación trazada
        return <g>
          <path d="M28 42 L44 56 L60 34 L74 56 L54 68" fill="none" stroke={glow} strokeWidth="1.4" opacity="0.75" />
          {[[28, 42, 3.2], [44, 56, 3.6], [60, 34, 4.8], [74, 56, 3.2], [54, 68, 3]].map(([x, y, r], i) => <path key={i} d={starPath(x, y, r)} fill="#fff" />)}
        </g>;
      case 'soberano': // corona + órbita — trono cósmico
        return <g>
          <ellipse cx="50" cy="56" rx="25" ry="8" fill="none" stroke={B} strokeWidth="1.5" opacity="0.6" transform="rotate(-10 50 56)" />
          <path d="M33 54 L36 36 L44 47 L50 31 L56 47 L64 36 L67 54 Z" fill={glow} stroke={glow} strokeWidth="1" strokeLinejoin="round" />
          <circle cx="50" cy="29" r="2.8" fill="#fff" />
          <circle cx="36" cy="36" r="2" fill="#fff" /><circle cx="64" cy="36" r="2" fill="#fff" />
        </g>;
      case 'arquitecto': // estrella en forja dentro de compás — forja de soles
        return <g>
          {!locked && <g className="cel-rays"><g>{Array.from({ length: 12 }).map((_, i) => {const a = Math.PI * 2 / 12 * i;return <line key={i} x1={(50 + Math.cos(a) * 13).toFixed(1)} y1={(50 + Math.sin(a) * 13).toFixed(1)} x2={(50 + Math.cos(a) * 30).toFixed(1)} y2={(50 + Math.sin(a) * 30).toFixed(1)} stroke={glow} strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />;})}</g></g>}
          <path d="M50 28 L70 64 L30 64 Z" fill="none" stroke={B} strokeWidth="1.8" opacity="0.65" strokeLinejoin="round" />
          <path d={starPath(50, 52, 8)} fill="#fff" />
        </g>;
      case 'titan': // orbe sostenido por arcos de fuerza, girando — fuerza universal
        return <g className="cel-spin"><g>
          <path d="M22 38 Q13 50 22 62" fill="none" stroke={glow} strokeWidth="3.2" strokeLinecap="round" />
          <path d="M78 38 Q87 50 78 62" fill="none" stroke={glow} strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="50" cy="50" r="15" fill={`url(#${rg})`} stroke="#fff" strokeWidth="1.5" />
          <circle cx="44" cy="44" r="4.5" fill="#fff" opacity="0.5" />
          {ringStars(3, 30)}
        </g></g>;
      case 'avatar': // forma trascendente — supernova ascendida, antesala de la leyenda
        return <g>
          {!locked && <g className="cel-rays"><g>{Array.from({ length: 16 }).map((_, i) => {const a = Math.PI * 2 / 16 * i;return <line key={i} x1={(50 + Math.cos(a) * 12).toFixed(1)} y1={(50 + Math.sin(a) * 12).toFixed(1)} x2={(50 + Math.cos(a) * 28).toFixed(1)} y2={(50 + Math.sin(a) * 28).toFixed(1)} stroke={glow} strokeWidth={i % 2 ? 1.3 : 2.4} strokeLinecap="round" opacity="0.85" />;})}</g></g>}
          <circle cx="50" cy="50" r="11" fill={`url(#${rg})`} stroke="#fff" strokeWidth="1.4" />
          <path d={starPath(50, 50, 7)} fill="#fff" />
          {ringStars(4, 30)}
        </g>;
      case 'blackhole': // Leyenda — singularidad dentro del medallón (mismo estándar), animada
        return <g>
          {/* halo lensado superior */}
          <path d="M30 50 A20 20 0 0 1 70 50" fill="none" stroke={t.glow} strokeWidth="3.6" opacity="0.92" strokeLinecap="round" />
          <path d="M30 50 A20 20 0 0 1 70 50" fill="none" stroke="#FFF2C8" strokeWidth="1.4" opacity="0.9" strokeLinecap="round" />
          {/* disco de acreción horizontal */}
          <ellipse cx="50" cy="50" rx="30" ry="7" fill="none" stroke={t.glow} strokeWidth="5" opacity="0.9" />
          {/* luz que recorre el anillo */}
          <ellipse className="bh-orbit" cx="50" cy="50" rx="30" ry="7" fill="none" stroke="#FFF2C8" strokeWidth="2.6" pathLength="100" strokeDasharray="16 84" strokeLinecap="round" opacity="0.95" />
          {/* horizonte de sucesos — negro puro */}
          <circle cx="50" cy="50" r="12" fill="#000" />
          {/* destello hacia el centro */}
          <circle className="bh-core-pulse" cx="50" cy="50" r="13" fill="none" stroke={t.glow} strokeWidth="2.2" />
        </g>;
      default:
        return <circle cx="50" cy="50" r="26" fill={`url(#${rg})`} stroke={t.ink} strokeWidth="1.5" />;
    }
  }

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={`kbv-emblem cel ${master ? 'master' : ''} ${fancy ? 'fancy' : ''} ${locked ? 'locked' : ''}`} aria-hidden="true">
      <defs>
        <radialGradient id={rg} cx="42%" cy="38%" r="70%">
          <stop offset="0" stopColor={locked ? '#EEEAE2' : glow} />
          <stop offset="0.55" stopColor={A} />
          <stop offset="1" stopColor={B} />
        </radialGradient>
        <radialGradient id={coreG} cx="50%" cy="42%" r="62%">
          <stop offset="0" stopColor={locked ? '#E6E2DA' : '#1C2748'} />
          <stop offset="1" stopColor={locked ? '#D7D2C8' : '#0B1022'} />
        </radialGradient>
        {ringLvl >= 10 &&
        <linearGradient id={prismId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF5D5D" /><stop offset="0.18" stopColor="#FFB13D" />
          <stop offset="0.36" stopColor="#FFE94D" /><stop offset="0.54" stopColor="#62E08A" />
          <stop offset="0.72" stopColor="#46C8FF" /><stop offset="0.86" stopColor="#8A7DFF" />
          <stop offset="1" stopColor="#FF6FE0" />
        </linearGradient>}
      </defs>
      {/* aro de grado — material / aura del rango espacial (común a TODA la escala, incluida Leyenda) */}
      <circle cx="50" cy="50" r="46" fill={`url(#${rg})`} stroke={ink} strokeWidth="2" />
      {/* campo estelar interior — el aire galáctico común a toda la escala */}
      <circle cx="50" cy="50" r="38" fill={`url(#${coreG})`} stroke={ink} strokeWidth="0.8" opacity="0.92" />
      {!locked && <g>{[[34, 30], [64, 28], [28, 52], [72, 56], [40, 70], [66, 72], [50, 24], [24, 40], [76, 42]].map(([sx, sy], k) =>
        <circle key={k} cx={sx} cy={sy} r={k % 3 === 0 ? 1.3 : 0.8} fill="#fff" opacity={0.45 + k % 3 * 0.18} />
        )}</g>}
      {!locked && <g className="cel-base"><circle cx="50" cy="50" r="42" fill="none" stroke={glow} strokeWidth="1" strokeDasharray="1.5 6" opacity="0.55" /></g>}
      {body()}
      {ringFx()}
      {locked &&
      <g opacity="0.82"><rect x="42" y="49" width="16" height="13" rx="2.5" fill="#7C7768" /><path d="M44 49 V44 a6 6 0 0 1 12 0 V49" fill="none" stroke="#7C7768" strokeWidth="2.6" /></g>
      }
    </svg>);

}

// ── Emblema de rango (insignia militar, niveles 1–100) ─────────
function RankEmblem({ level = 1, size = 50, locked = false }) {
  const tier = rankTier(level);
  const g = rankGroup(tier);
  const uid = React.useMemo(() => `re${++__emUid}`, []);
  const A = locked ? '#E2DED6' : g.a,B = locked ? '#C7C1B5' : g.b,ink = locked ? '#A39C8E' : g.ink;
  const shieldD = 'M50 7 L86 21 V51 Q86 79 50 93 Q14 79 14 51 V21 Z';
  const anim = locked ? null : g.anim || null; // 'shine' | 'oil'
  const animated = !!anim;
  const oil = anim === 'oil';

  function insignia() {
    const els = [];
    if (g.t === 'chevron') {
      for (let i = 0; i < g.c; i++) els.push(<path key={i} d={`M34 ${36 + i * 7} L50 ${30 + i * 7} L66 ${36 + i * 7}`} fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />);
    } else if (g.t === 'bar') {
      for (let i = 0; i < g.c; i++) els.push(<rect key={i} x="34" y={34 + i * 8} width="32" height="4.5" rx="2" fill={ink} />);
    } else if (g.t === 'star') {
      const sx = 50 - (g.c - 1) * 9 / 2;
      for (let i = 0; i < g.c; i++) els.push(<path key={i} d={starPath(sx + i * 9, 44, 5.5)} fill={ink} />);
    } else if (g.t === 'eagle') {
      els.push(<g key="e" fill={ink}><path d="M50 36 Q40 30 28 36 Q40 38 50 42 Q60 38 72 36 Q60 30 50 36 Z" /><circle cx="50" cy="40" r="3" /></g>);
      const sx = 50 - (g.c - 1) * 8 / 2;
      for (let i = 0; i < g.c; i++) els.push(<path key={'s' + i} d={starPath(sx + i * 8, 54, 3.6)} fill={ink} />);
    } else if (g.t === 'diamond') {// gemas facetadas (Diamante / Esmeralda)
      const sx = 50 - (g.c - 1) * 15 / 2;
      for (let i = 0; i < g.c; i++) {
        const cx = sx + i * 15;
        els.push(<g key={i}><path d={`M${cx} 35 L${cx + 8} 45 L${cx} 57 L${cx - 8} 45 Z`} fill={ink} /><path d={`M${cx - 8} 45 H${cx + 8} M${cx} 35 V57`} stroke={A} strokeWidth="0.9" opacity="0.75" /></g>);
      }
    } else if (g.t === 'crown') {// corona (Rubí / Damasco)
      els.push(<path key="c" d="M31 57 L34 39 L42 49 L50 35 L58 49 L66 39 L69 57 Z" fill={ink} stroke={ink} strokeWidth="1" strokeLinejoin="round" />);
      els.push(<rect key="cb" x="32" y="57" width="36" height="5" rx="1.6" fill={ink} />);
      els.push(<circle key="g1" cx="34" cy="37" r="2.3" fill={A} />);
      els.push(<circle key="g2" cx="50" cy="33" r="2.8" fill={A} />);
      els.push(<circle key="g3" cx="66" cy="37" r="2.3" fill={A} />);
    } else {// wreath
      els.push(<g key="w" fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round"><path d="M40 56 Q28 48 32 34" /><path d="M60 56 Q72 48 68 34" /></g>);
      const sx = 50 - g.c * 8 / 2;
      for (let i = 0; i <= g.c; i++) els.push(<path key={'s' + i} d={starPath(sx + i * 8, 44, 5)} fill={ink} />);
    }
    return <g opacity="0.95">{els}</g>;
  }

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={`kbv-emblem rank ${locked ? 'locked' : ''} ${anim ? 'anim-' + anim : ''}`} aria-hidden="true">
      <defs>
        {oil ?
        <linearGradient id={uid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9B6CF0" />
            <stop offset="0.28" stopColor="#4FC7E8" />
            <stop offset="0.52" stopColor="#F0D24B" />
            <stop offset="0.76" stopColor="#E86FB0" />
            <stop offset="1" stopColor="#6FE3B0" />
          </linearGradient> :

        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={A} /><stop offset="1" stopColor={B} /></linearGradient>
        }
        {animated && <clipPath id={uid + 'c'}><path d={shieldD} /></clipPath>}
        {animated && <linearGradient id={uid + 's'} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="0.5" stopColor="#fff" stopOpacity="0.85" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>}
      </defs>
      <path d={shieldD} fill={`url(#${uid})`} stroke={ink} strokeWidth="2.2" />
      {animated &&
      <g clipPath={`url(#${uid}c)`}>
          {oil && [16, 26, 36, 46, 56, 66, 78].map((y, k) =>
        <path key={k} d={`M8 ${y} Q26 ${y - 6} 50 ${y} T92 ${y}`} fill="none" stroke="#FFFFFF" strokeWidth="2.4" opacity="0.22" />
        )}
          <g className="dmsc-sheen"><rect x="-14" y="0" width="20" height="100" fill={`url(#${uid}s)`} transform="skewX(-16)" /></g>
        </g>
      }
      <path d={shieldD} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" transform="translate(0,2) scale(0.88)" style={{ transformOrigin: '50px 50px' }} />
      {insignia()}
      <text x="50" y="80" textAnchor="middle" fontFamily="var(--kb-f-mono), monospace" fontWeight="800" fontSize="15" fill={ink}>{level}</text>
      {locked && <g opacity="0.82"><rect x="42" y="49" width="16" height="13" rx="2.5" fill="#7C7768" /><path d="M44 49 V44 a6 6 0 0 1 12 0 V49" fill="none" stroke="#7C7768" strokeWidth="2.6" /></g>}
    </svg>);

}

// Hitos del "Trayecto hacia deidad" — cada 100 niveles asciendes un escalón divino.
const PARAGON_REWARDS = [
'Aura divina para Kibo', 'Halo de estrellas', 'Manto cósmico',
'Corona de nova', 'Aliento estelar', 'Cetro de luz',
'Trono del vacío', 'Forma ascendida', 'Avatar de deidad'];


// ── Badge para header/hero ─────────────────────────────────────
function EmblemBadge({ completed = 0, level = 1, master = false, size = 26 }) {
  const eq = getEquippedEmblem();
  if (master && eq) {
    if (eq[0] === 'p') return <PrestigeEmblem tier={parseInt(eq.slice(1), 10) || PRESTIGE_MAX} size={size} />;
    if (eq[0] === 'r') return <RankEmblem level={parseInt(eq.slice(1), 10) || 1} size={size} />;
  }
  if (completed >= 1) return <PrestigeEmblem tier={completed} size={size} />;
  return <RankEmblem level={level} size={size} />;
}
function PrestigeBadge(props) {return <EmblemBadge {...props} />;}

// ── Línea de tiempo arcoíris del paragón (dentro de Gargantúa) ──
function ParagonTimeline({ paragonLevel }) {
  const reached = Math.floor(paragonLevel / 100);
  const nodes = PARAGON_REWARDS.slice(0, 8);
  const pct = Math.min(100, reached / nodes.length * 100);
  return (
    <div className="pp-paragon-tl cosmic">
      <div className="ptl-stars" aria-hidden="true" />
      <div className="ptl-head">
        <span className="kbv-eyebrow">Trayecto hacia deidad</span>
        <span className="kbv-meta">Cada 100 niveles asciendes un escalón: de Leyenda hacia la deidad</span>
      </div>
      <div className="ptl-track">
        <div className="ptl-line" />
        <div className="ptl-line filled" style={{ width: `calc(${pct}% )` }} />
        <div className="ptl-nodes">
          {nodes.map((r, i) => {
            const revealed = i < reached;
            const here = i === reached;
            return (
              <div key={i} className={`ptl-node ${revealed ? 'on' : ''} ${here ? 'here' : ''}`}>
                <span className="ptl-dot">{revealed ? <KIcon name="check" size={10} /> : here ? <KIcon name="sparkle" size={10} /> : ''}</span>
                <span className="ptl-lvl">+{(i + 1) * 100}</span>
                <span className="ptl-name">{revealed ? r : here ? 'En curso…' : 'Por venir'}</span>
              </div>);

          })}
        </div>
      </div>
    </div>);

}

// ── Panel de progresión (rangos + viaje de prestigio) ──────────
function ProgressPanel({ completed, level, master, paragonLevel = 0, onPrestige }) {
  const prestiged = completed >= 1;
  const [tab, setTab] = React.useState(prestiged ? 'prestige' : 'rank');
  const [equipped, setEquipped] = React.useState(() => getEquippedEmblem());
  function equip(key) {if (!master) return;setEquipped(key);setEquippedEmblem(key);}
  const atCap = level >= PRESTIGE_LEVELS;
  const pct = Math.round(level / PRESTIGE_LEVELS * 100);

  return (
    <div className="kbv-prestige-panel">
      <div className="pp-head">
        <div className="pp-current">
          {prestiged ? <PrestigeEmblem tier={completed} size={66} /> : <RankEmblem level={level} size={66} />}
          <div className="pp-current-meta">
            <span className="pp-eyebrow">
              {master ? 'Prestigio máximo · Paragón' : prestiged ? `Prestigio ${completed} de ${PRESTIGE_MAX}` : 'Rango · niveles 1–100'}
            </span>
            <span className="pp-rank">
              {master ? 'Leyenda · grado supremo' : prestiged ? `${CELESTIAL[completed - 1].name} · ${CELESTIAL[completed - 1].sub}` : `${RANK_NAMES[rankTier(level)]} · Nivel ${level}`}
            </span>
            {master ?
            <span className="pp-sub">Nivel de paragón <strong>{paragonLevel}</strong> · sin tope.</span> :
            prestiged ?
            <span className="pp-sub">Nivel {level}/{PRESTIGE_LEVELS} · faltan <strong>{PRESTIGE_LEVELS - level}</strong> para {completed + 1 > PRESTIGE_MAX ? 'el Maestro' : `el prestigio ${completed + 1}`} ({(CELESTIAL[completed] || CELESTIAL[CELESTIAL.length - 1]).name})</span> :
            <span className="pp-sub">Nivel {level}/100 · faltan <strong>{100 - level}</strong> niveles para tu <strong>primer prestigio</strong>.</span>}
          </div>
        </div>
        <div className="pp-progress">
          <div className={`pp-track ${master ? 'paragon' : ''}`}><span style={{ width: master ? `${paragonLevel % 100}%` : `${pct}%` }} /></div>
          {!master ?
          <button type="button" className="pp-prestige-btn" onClick={onPrestige} disabled={!atCap} title={atCap ? 'Reinicia a Nv. 1 y avanza en el viaje' : 'Llega al Nv. 100 para prestigiar'}>
                <KIcon name="repeat" size={13} /> {atCap ? 'Prestigiar' : 'Nv. 100 para prestigiar'}
              </button> :
          <span className="kbv-meta" style={{ whiteSpace: 'nowrap' }}>Próximo hito en <strong>{100 - paragonLevel % 100}</strong> niv.</span>}
        </div>
      </div>

      {prestiged &&
      <div className="pp-tabs">
          <button className={tab === 'prestige' ? 'on' : ''} onClick={() => setTab('prestige')}>Viaje de prestigio</button>
          <button className={tab === 'rank' ? 'on' : ''} onClick={() => setTab('rank')}>Rangos 1–100</button>
        </div>
      }

      <div className="pp-gallery-head">
        <span className="kbv-eyebrow">{tab === 'prestige' ? `El viaje · ${PRESTIGE_MAX} destinos` : 'Insignias de rango'} {master ? '· toca para equipar' : prestiged ? '· tu colección' : '· se ganan al subir'}</span>
        {!master && <span className="kbv-meta">Equipar a gusto: exclusivo de Maestro</span>}
      </div>

      {tab === 'prestige' ?
      <div className="pp-gallery">
          {CELESTIAL.map((c) => {
          const unlocked = c.n <= completed || master;
          const key = 'p' + c.n;
          const isEq = master ? equipped === key || !equipped && c.n === PRESTIGE_MAX : c.n === completed;
          return (
            <button key={c.n} type="button"
            className={`pp-emblem ${unlocked ? 'unlocked' : 'locked'} ${isEq ? 'equipped' : ''} ${master ? 'pickable' : ''} ${c.master ? 'is-master' : ''}`}
            onClick={() => equip(key)} disabled={!master && !unlocked}
            title={unlocked ? `${c.n === PRESTIGE_MAX ? 'Maestro' : 'Prestigio ' + c.n} · ${c.name} (${c.sub})` : `Bloqueado · prestigio ${c.n}`} style={{ backgroundColor: "rgb(247, 247, 248)", textAlign: "left", borderWidth: "1px", borderStyle: "none", borderColor: "rgb(255, 255, 255)" }}>
                <PrestigeEmblem tier={c.n} locked={!unlocked} size={46} />
                <span className="pp-emblem-name">{c.name}</span>
                {isEq && <span className="pp-equipped-tag"><KIcon name="check" size={9} /></span>}
              </button>);

        })}
        </div> :

      <div className="pp-gallery ranks">
          {Array.from({ length: 20 }).map((_, i) => {
          const lvl = (i + 1) * 5;
          const reachedLevel = prestiged ? 100 : level;
          const unlocked = lvl <= reachedLevel;
          const key = 'r' + lvl;
          const isEq = master && equipped === key;
          return (
            <button key={i} type="button"
            className={`pp-emblem ${unlocked ? 'unlocked' : 'locked'} ${isEq ? 'equipped' : ''} ${master ? 'pickable' : ''}`}
            onClick={() => equip(key)} disabled={!master || !unlocked}
            title={unlocked ? `${RANK_NAMES[i]} · Nivel ${lvl}` : `Bloqueado · Nv. ${lvl}`}>
                <RankEmblem level={lvl} locked={!unlocked} size={46} />
                <span className="pp-emblem-name">{RANK_NAMES[i]}</span>
                {isEq && <span className="pp-equipped-tag"><KIcon name="check" size={9} /></span>}
              </button>);

        })}
        </div>
      }

      {!prestiged &&
      <div className="pp-next-reward">
          <span className="pp-nr-ico"><KIcon name="sparkle" size={15} /></span>
          <div className="pp-nr-body">
            <span className="pp-nr-label">Al llegar al Nivel 100 desbloqueas</span>
            <span className="pp-nr-text">El Prestigio · asciendes a Cadete Estelar + el escalafón espacial de emblemas</span>
          </div>
        </div>
      }
      {prestiged && !master &&
      <div className="pp-next-reward">
          <span className="pp-nr-ico"><KIcon name="sparkle" size={15} /></span>
          <div className="pp-nr-body">
            <span className="pp-nr-label">Tu próximo destino</span>
            <span className="pp-nr-text">Prestigio {completed + 1}: {(CELESTIAL[completed] || CELESTIAL[CELESTIAL.length - 1]).name} · {(CELESTIAL[completed] || CELESTIAL[CELESTIAL.length - 1]).sub}</span>
          </div>
        </div>
      }
      {master &&
      <>
          <div className="pp-master-perks">
            {['Equipar cualquier emblema', 'Niveles sin tope (paragón)', 'Ascensos cada 100 niv.', 'Leyenda animada'].map((p) =>
          <span key={p} className="pp-perk"><KIcon name="check" size={11} /> {p}</span>
          )}
          </div>
          <ParagonTimeline paragonLevel={paragonLevel} />
        </>
      }
    </div>);

}
function PrestigePanel(props) {return <ProgressPanel {...props} />;}

Object.assign(window, {
  PRESTIGE_LEVELS, PRESTIGE_MAX, PRESTIGE_RANKS, CELESTIAL, RANK_NAMES, rankTier, rankGroup,
  prestigeInfo, PrestigeEmblem, RankEmblem, EmblemBadge, PrestigeBadge, ProgressPanel, PrestigePanel,
  getEquippedEmblem, setEquippedEmblem
});