// achievements.jsx — Logros y trofeos (estilo videojuego).
//  • Logros normales: catálogo PÚBLICO (desbloqueados / en progreso / bloqueados).
//  • Logros secretos: se ven en "Todos" pero enmascarados; diseño que resalta.
//  • Logros ocultos: NO hay evidencia de que existen; solo aparecen YA ganados,
//    con una tarjeta espectacular y animada.
//  • Filtros por rareza y por frecuencia (qué tan raro es entre usuarios).

const ACH_RARITY = {
  comun:      { label: 'Común',      c: '#5FA98A' },
  raro:       { label: 'Raro',       c: '#6E8CF2' },
  epico:      { label: 'Épico',      c: '#A855F7' },
  legendario: { label: 'Legendario', c: '#E0A82B' },
  secreto:    { label: 'Secreto',    c: '#8A5CF0' },
  oculto:     { label: 'Oculto',     c: '#E0561B' },
};

// Trofeos por tiempo (mensuales) — se ganan al cumplir la meta del mes.
const MONTHLY_EMBLEMS = [
  { id: 'm5', month: 'May 2026', name: 'Imparable', icon: 'flame',  c: '#E64545', current: true },
  { id: 'm4', month: 'Abr 2026', name: 'Referente', icon: 'trophy', c: '#E0A82B' },
  { id: 'm3', month: 'Mar 2026', name: 'Constante', icon: 'check',  c: '#4CAF82' },
  { id: 'm2', month: 'Feb 2026', name: 'Enfocado',  icon: 'target', c: '#6E8CF2' },
];

// Retos cumplidos — estandartes. Los de alta exigencia se marcan como HITO.
const CHALLENGES_DONE = [
  { id: 'r1', name: 'Maratón de lectura · 30 días', date: '24 May 2026', difficulty: 'alta', hito: true, icon: 'flame', c: '#E64545' },
  { id: 'r2', name: '7 días sin redes sociales', date: '08 May 2026', difficulty: 'media', icon: 'shield', c: '#6E8CF2' },
  { id: 'r3', name: 'Sin azúcar · 30 días', date: '21 Abr 2026', difficulty: 'alta', hito: true, icon: 'target', c: '#E0A82B' },
  { id: 'r4', name: 'Madrugar 21 días seguidos', date: '02 Abr 2026', difficulty: 'media', icon: 'clock', c: '#4CAF82' },
  { id: 'r5', name: 'Meditar 14 días', date: '15 Mar 2026', difficulty: 'baja', icon: 'sparkle', c: '#A855F7' },
];

// freq = % de usuarios que lo tienen (menor = más raro).
const ACHIEVEMENTS = [
  { id: 'a1',  name: 'Primeros pasos', desc: 'Crea tu primera área de vida.',                rarity: 'comun',      icon: 'sparkle',   progress: 1,  goal: 1,   date: '12 Ene', freq: 96 },
  { id: 'a2',  name: 'Madrugador',     desc: 'Completa hábitos antes de las 7 am, 10 veces.', rarity: 'raro',      icon: 'clock',     progress: 10, goal: 10,  date: '04 Mar', freq: 28 },
  { id: 'a3',  name: 'Centurión',      desc: 'Cierra 100 tareas.',                            rarity: 'epico',     icon: 'check',     progress: 100, goal: 100, date: '21 Abr', freq: 12 },
  { id: 'a4',  name: 'Constante',      desc: 'Mantén una racha de 30 días.',                  rarity: 'raro',      icon: 'flame',     progress: 30,  goal: 30,  date: '18 Feb', freq: 22 },
  { id: 'a5',  name: 'Maratonista',    desc: 'Alcanza una racha de 100 días.',                rarity: 'epico',     icon: 'flame',     progress: 23,  goal: 100, freq: 6 },
  { id: 'a6',  name: 'Bibliófilo',     desc: 'Termina 12 libros en el año.',                  rarity: 'raro',      icon: 'book',      progress: 7,   goal: 12,  freq: 17 },
  { id: 'a7',  name: 'Foco total',     desc: 'Acumula 100 horas en foco.',                    rarity: 'epico',     icon: 'clock',     progress: 38,  goal: 100, freq: 9 },
  { id: 'a8',  name: 'Sin excusas',    desc: 'Un mes completo sin fallar un solo hábito.',    rarity: 'legendario',icon: 'shield',    progress: 18,  goal: 30, freq: 2.4 },
  { id: 'a9',  name: 'Coleccionista',  desc: 'Desbloquea los 15 prestigios.',                 rarity: 'legendario',icon: 'crown',     progress: 7,   goal: 15, freq: 0.8 },
  { id: 'a10', name: 'Filántropo',     desc: 'Aporta a la lista de deseos de 5 amigos.',      rarity: 'raro',      icon: 'community', progress: 2,   goal: 5,  freq: 14 },
  { id: 'a11', name: 'Explorador total', desc: 'Visita las 9 secciones del núcleo.',          rarity: 'comun',     icon: 'layers',    progress: 6,   goal: 9,  freq: 41 },
  // Secretos: visibles en "Todos" pero enmascarados (pista vaga). Diseño que resalta.
  { id: 's1', secret: true, hint: 'Algo sucede de madrugada…',   rarity: 'secreto', icon: 'mood-meh', reveal: { name: 'Búho nocturno', desc: 'Registra una entrada de diario después de las 3 am.' }, progress: 0, goal: 1, freq: 3.1 },
  { id: 's2', secret: true, hint: 'Cuando todo parecía perdido…', rarity: 'secreto', icon: 'flame',   reveal: { name: 'Ave Fénix', desc: 'Recupera tu racha el mismo día que la perdiste.' }, progress: 1, goal: 1, date: '02 May', freq: 1.6 },
  // Oculto: SIN evidencia previa. Solo aparece porque ya se ganó. Tarjeta espectacular.
  { id: 'h1', hidden: true, rarity: 'oculto', icon: 'sparkle', name: 'Singularidad', desc: 'Desbloqueaste un logro oculto haciendo algo extraordinario en Kibo.', progress: 1, goal: 1, date: '27 May', freq: 0.2 },
];

function pctOf(a) { return Math.min(100, Math.round((a.progress / a.goal) * 100)); }
function isEarned(a) { return !!a.date || a.progress >= a.goal; }

// Orden de meses (es-MX) para ordenar "últimos conseguidos" por recencia.
const ACH_MONTHS = { ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11 };
function achDateVal(d) {
  if (!d) return -1;
  const m = String(d).trim().match(/(\d{1,2})\s+([A-Za-z\u00e1\u00e9\u00ed\u00f3\u00fa]+)/);
  if (!m) return -1;
  const mo = ACH_MONTHS[m[2].slice(0, 3).toLowerCase()];
  return (mo == null ? 0 : mo) * 100 + parseInt(m[1], 10);
}

function AchievementTile({ a }) {
  const r = ACH_RARITY[a.rarity];
  const earned = isEarned(a);
  const [open, setOpen] = React.useState(false);
  // Secreto NO ganado → enmascarado, diseño distintivo (no rojo).
  if (a.secret && !earned) {
    return (
      <button type="button" className={`kbv-ach secret-locked ${open ? 'open' : ''}`} style={{ '--c': r.c }} onClick={() => setOpen(o => !o)}>
        <div className="ach-row">
          <span className="ach-ico"><KIcon name="sparkle" size={16} /></span>
          <div className="ach-body">
            <span className="ach-name">Logro secreto</span>
            <span className="ach-desc">{a.hint}</span>
          </div>
          <span className="ach-rarity" style={{ '--c': r.c }}>Secreto</span>
        </div>
        {open && (
          <div className="ach-detail">
            <span className="ad-how"><KIcon name="alert" size={12} /> Es un logro secreto: su forma de obtenerse se revela al desbloquearlo. Sigue explorando Kibo.</span>
          </div>
        )}
      </button>
    );
  }
  const hidden = a.hidden;
  const name = a.secret ? a.reveal.name : a.name;
  const desc = a.secret ? a.reveal.desc : a.desc;
  return (
    <button type="button" className={`kbv-ach ${earned ? 'earned' : ''} ${hidden ? 'hidden-unlocked' : ''} ${a.secret ? 'secret-unlocked' : ''} ${open ? 'open' : ''}`} style={{ '--c': r.c }} onClick={() => setOpen(o => !o)}>
      <div className="ach-row">
        <span className="ach-ico"><KIcon name={a.icon} size={16} /></span>
        <div className="ach-body">
          <span className="ach-name">{name}{hidden && <span className="ach-flag">OCULTO</span>}</span>
          <span className="ach-desc">{desc}</span>
          {!earned && (
            <div className="ach-prog">
              <div className="ach-bar"><span style={{ width: `${pctOf(a)}%` }} /></div>
              <span className="ach-num">{a.progress}/{a.goal}</span>
            </div>
          )}
          <span className="ach-freq" title="Porcentaje de usuarios que lo tienen">{a.freq}% lo tienen</span>
        </div>
        <span className="ach-side">
          {earned
            ? <span className="ach-earned"><KIcon name="check" size={10} /> {a.date || 'Listo'}</span>
            : <span className="ach-rarity" style={{ '--c': r.c }}>{r.label}</span>}
          <KIcon name={open ? 'eye' : 'eye'} size={12} />
        </span>
      </div>
      {open && (
        <div className="ach-detail">
          <span className="ad-how"><KIcon name="target" size={12} /> <strong>{earned ? 'Cómo lo conseguiste:' : 'Cómo se obtiene:'}</strong> {a.how || desc}</span>
          <div className="ad-meta">
            <span className="ad-chip" style={{ '--c': r.c }}>{r.label}</span>
            <span className="ad-chip">{a.freq}% lo tienen</span>
            {earned
              ? <span className="ad-chip done"><KIcon name="check" size={10} /> Obtenido {a.date || ''}</span>
              : <span className="ad-chip">{a.progress}/{a.goal} · {pctOf(a)}%</span>}
          </div>
        </div>
      )}
    </button>
  );
}

function AchievementsPanel() {
  const [tab, setTab] = React.useState('todos');
  const [rar, setRar] = React.useState('all');
  const [byFreq, setByFreq] = React.useState(false);

  const TABS = [
    { id: 'todos', l: 'Todos' },
    { id: 'desbloqueados', l: 'Desbloqueados' },
    { id: 'progreso', l: 'En progreso' },
    { id: 'bloqueados', l: 'Bloqueados' },
  ];
  const RAR_OPTS = [['all', 'Toda rareza'], ['comun', 'Común'], ['raro', 'Raro'], ['epico', 'Épico'], ['legendario', 'Legendario']];

  let list = ACHIEVEMENTS.filter(a => {
    const earned = isEarned(a);
    // Los ocultos solo se muestran si ya están ganados (sin evidencia previa).
    if (a.hidden && !earned) return false;
    if (tab === 'todos') return true;            // incluye secretos enmascarados
    if (a.secret || a.hidden) return false;      // fuera de Todos no aparecen secretos/ocultos
    if (tab === 'desbloqueados') return earned;
    if (tab === 'progreso') return !earned && a.progress > 0;
    if (tab === 'bloqueados') return !earned && a.progress === 0;
    return true;
  });
  if (rar !== 'all') list = list.filter(a => a.rarity === rar || (a.secret) || (a.hidden));
  if (byFreq) list = [...list].sort((x, y) => (x.freq || 100) - (y.freq || 100));

  const earnedCount = ACHIEVEMENTS.filter(a => isEarned(a) && !a.hidden).length;
  const publicTotal = ACHIEVEMENTS.filter(a => !a.secret && !a.hidden).length;

  return (
    <div className="kbv-ach-panel">
      {/* Retos cumplidos — estandartes */}
      <div className="kbv-ach-monthly-head">
        <span className="kbv-eyebrow">Retos cumplidos</span>
        <span className="kbv-meta">Tus estandartes · los de alta exigencia se marcan como hito</span>
      </div>
      <div className="kbv-challenge-banners">
        {CHALLENGES_DONE.map(r => (
          <div key={r.id} className={`kbv-challenge-banner ${r.hito ? 'hito' : ''}`} style={{ '--c': r.c }} title={`${r.name} · ${r.date}`}>
            <span className="cb-flag"><span className="cb-ico"><KIcon name={r.icon} size={16} /></span></span>
            <div className="cb-body">
              <span className="cb-name">{r.name}</span>
              <span className="cb-meta">
                <span className={`cb-diff ${r.difficulty}`}>{r.difficulty === 'alta' ? 'Alta exigencia' : r.difficulty === 'media' ? 'Exigencia media' : 'Exigencia baja'}</span>
                <span className="cb-date"><KIcon name="check" size={9} /> {r.date}</span>
              </span>
            </div>
            {r.hito && <span className="cb-hito"><KIcon name="trophy" size={10} /> Hito</span>}
          </div>
        ))}
      </div>

      {/* Últimos logros conseguidos — los 10 más recientes, con fecha de desbloqueo */}
      <div className="kbv-ach-monthly-head">
        <span className="kbv-eyebrow">Últimos logros conseguidos</span>
        <span className="kbv-meta">Tus 10 más recientes · con fecha de desbloqueo</span>
      </div>
      <div className="kbv-ach-recent">
        {ACHIEVEMENTS.filter(a => isEarned(a))
          .slice().sort((x, y) => achDateVal(y.date) - achDateVal(x.date))
          .slice(0, 10)
          .map(a => {
            const r = ACH_RARITY[a.rarity];
            const nm = a.secret ? (a.reveal ? a.reveal.name : 'Secreto') : a.name;
            return (
              <div key={a.id} className="kbv-recent-ach" style={{ '--c': r.c }} title={`${nm} · ${r.label}`}>
                <span className="ra-ico"><KIcon name={a.icon} size={16} /></span>
                <div className="ra-body">
                  <span className="ra-name">{nm}{a.hidden && <span className="ach-flag">OCULTO</span>}</span>
                  <span className="ra-rarity">{r.label}</span>
                </div>
                <span className="ra-date"><KIcon name="check" size={10} /> {a.date || 'Listo'}</span>
              </div>
            );
          })}
      </div>

      {/* Filtros */}
      <div className="kbv-ach-tabs-row">
        <div className="kbv-ach-tabs">
          {TABS.map(t => <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>{t.l}</button>)}
        </div>
        <div className="kbv-ach-filters">
          <select className="kbv-ach-sel" value={rar} onChange={e => setRar(e.target.value)} title="Filtrar por rareza">
            {RAR_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <button type="button" className={`kbv-ach-freqbtn ${byFreq ? 'on' : ''}`} onClick={() => setByFreq(v => !v)} title="Ordenar por frecuencia (más raros primero)">
            <KIcon name="trending-up" size={12} /> Más raros
          </button>
        </div>
      </div>
      <div className="kbv-ach-count kbv-meta">{earnedCount} de {publicTotal} logros públicos desbloqueados</div>

      <div className="kbv-ach-grid">
        {list.map(a => <AchievementTile key={a.id} a={a} />)}
      </div>
    </div>
  );
}

Object.assign(window, { AchievementsPanel, ACHIEVEMENTS, MONTHLY_EMBLEMS, CHALLENGES_DONE, ACH_RARITY });
