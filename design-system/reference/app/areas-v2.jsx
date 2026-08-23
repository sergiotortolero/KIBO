// areas-v2.jsx — Áreas como CENTRO DE ANÁLISIS (cima de la jerarquía).
// ───────────────────────────────────────────────────────────────────────
// Jerarquía de la plataforma (varía por área):
//   ÁREA → PROYECTO → TAREA   (vigor / comunidad / personalizadas)
//   ÁREA → CURSO·MATERIA → TAREA          (Sabiduría · vive en Estudio/Lectura)
//   ÁREA → PROYECTO FINANCIERO → MOVIMIENTO (Riqueza · vive en Finanzas)
//   ÁREA → RETO·HÁBITO                     (Voluntad · NO tiene proyectos)
// Esta pantalla NO ejecuta: analiza el cúmulo de información de cada área y
// salta por hipervínculo a donde se hace el trabajo.
//
// Progresión de área: 5 PRESTIGIOS × 50 NIVELES c/u. El 5º es MAESTRO
// (ascenso infinito), misma dinámica que el prestigio maestro general.
// Reutiliza el rubro de RANGOS (RankEmblem) limitado a 50 niv / mitad de íconos.

const AREA_LP = 50;            // niveles por prestigio
const AREA_PRESTIGE_TIERS = 5; // 5º = Maestro

// Progresión por área: prestigios completados + nivel dentro del prestigio.
// En Maestro (prestigio 5) el nivel sigue subiendo: cada 50 niveles = un ciclo
// con recompensas (materia oscura/monedas/multiplicadores), hasta el infinito.
const AREA_PROG_V3 = {
  vigor:     { prestige: 2, level: 23 },
  wisdom:    { prestige: 3, level: 41 },
  wealth:    { prestige: 4, level: 8 },
  community: { prestige: 1, level: 27 },
  will:      { prestige: 5, level: 67 }, // Maestro · 2º ciclo (17/50)
};
function areaProg(id) { return AREA_PROG_V3[id] || { prestige: 0, level: 1 }; }
function areaRankIdx(level) { return Math.min(9, Math.floor((Math.max(1, level) - 1) / 5)); } // 10 tiers (mitad)
function areaRankName(level) { return (typeof RANK_NAMES !== 'undefined' ? RANK_NAMES : [])[areaRankIdx(level)] || 'Rango'; }

// Índice de actividad semanal (8 semanas) — alimenta tendencia y momentum.
const AREA_TREND_V3 = {
  vigor:     [3, 4, 4, 5, 5, 6, 6, 7],
  wisdom:    [4, 5, 6, 6, 7, 8, 9, 9],
  wealth:    [2, 2, 3, 3, 3, 3, 4, 4],
  community: [4, 3, 3, 2, 2, 2, 1, 1],
  will:      [6, 7, 7, 8, 8, 9, 9, 9],
};
function areaMomentum(id) { const t = AREA_TREND_V3[id] || [0]; return t[t.length - 1]; }
function areaTrendDelta(id) { const t = AREA_TREND_V3[id] || [0, 0]; return t[t.length - 1] - t[t.length - 2]; }
function areaDecline(id) { const t = AREA_TREND_V3[id] || [1, 1]; return Math.round((t[0] - t[t.length - 1]) / Math.max(1, t[0]) * 100); }

// Indicadores por periodo (30 días) para las tarjetas de insight.
const AREA_PERIOD_V3 = {
  vigor:     { xp30: 620,  lvlUp: 1 },
  wisdom:    { xp30: 1080, lvlUp: 2 },
  wealth:    { xp30: 240,  lvlUp: 0 },
  community: { xp30: 90,   lvlUp: 0 },
  will:      { xp30: 1340, lvlUp: 1 },
};

// Historial de ranking entre áreas (posición + semanas en ella + movimiento).
const AREA_RANKHIST_V3 = {
  will:      { weeks: 6, moved: 0 },
  wisdom:    { weeks: 3, moved: 1 },
  vigor:     { weeks: 2, moved: 1 },
  wealth:    { weeks: 5, moved: -2 },
  community: { weeks: 4, moved: -1 },
};

// Pulso estratégico (más profundo que 3 métricas, menos que la sección madre).
// tone: good | warn | bad | neutral — colorea el valor y muestra ícono de señal.
const AREA_PULSE_V3 = {
  vigor:     { period: 'últimos 30 días', metrics: [{ v: '8.2k', l: 'pasos/día', tone: 'good' }, { v: '4', l: 'entrenos/sem', tone: 'good' }, { v: '7h 10m', l: 'sueño prom.', tone: 'neutral' }, { v: '62', l: 'ppm reposo', tone: 'good' }, { v: '2', l: 'metas activas', tone: 'neutral' }, { v: '+620', l: 'XP del periodo', tone: 'good' }] },
  wisdom:    { period: 'últimos 30 días', metrics: [{ v: '3', l: 'cursos en curso', tone: 'neutral' }, { v: '2', l: 'libros activos', tone: 'neutral' }, { v: '38 h', l: 'foco · mes', tone: 'good' }, { v: '12', l: 'notas nuevas', tone: 'good' }, { v: '7', l: 'tareas abiertas', tone: 'warn' }, { v: '+1,080', l: 'XP del periodo', tone: 'good' }] },
  wealth:    { period: 'este mes', metrics: [{ v: '+$28.1K', l: 'saldo', tone: 'good' }, { v: '78%', l: 'fondo emerg.', tone: 'good' }, { v: '$14.2K', l: 'deuda', tone: 'bad' }, { v: '4', l: 'cuentas', tone: 'neutral' }, { v: '3', l: 'metas activas', tone: 'neutral' }, { v: '+$8.2K', l: 'ahorro · mes', tone: 'good' }] },
  community: { period: 'últimos 30 días', metrics: [{ v: '5', l: 'personas cerca', tone: 'neutral' }, { v: '2', l: 'eventos/mes', tone: 'neutral' }, { v: '8', l: 'gestos', tone: 'good' }, { v: '1', l: 'proyecto activo', tone: 'neutral' }, { v: '14 d', l: 'sin contacto clave', tone: 'bad' }, { v: '+90', l: 'XP del periodo', tone: 'warn' }] },
  will:      { period: 'últimos 30 días', metrics: [{ v: '3', l: 'hábitos activos', tone: 'good' }, { v: '92%', l: 'cumplimiento', tone: 'good' }, { v: '21 d', l: 'mejor racha', tone: 'good' }, { v: '2', l: 'retos en curso', tone: 'neutral' }, { v: '1', l: 'mal hábito venciendo', tone: 'warn' }, { v: '+1,340', l: 'XP del periodo', tone: 'good' }] },
};
const PULSE_TONE = {
  good:    { c: 'var(--kb-good)', g: '▲' },
  bad:     { c: 'var(--kb-hp-ink)', g: '▼' },
  warn:    { c: 'var(--kb-warn)', g: '!' },
  neutral: { c: 'var(--kb-text-3)', g: '–' },
};

// Hitos — momentos importantes (logrados) y metas próximas, por área.
const MS_KIND = {
  level:    { l: 'Nivel',     icon: 'trending-up', c: 'var(--kb-gem)' },
  record:   { l: 'Récord',    icon: 'sparkle',     c: 'var(--kb-coin)' },
  project:  { l: 'Proyecto',  icon: 'layers',      c: 'var(--kb-primary)' },
  streak:   { l: 'Racha',     icon: 'flame',       c: 'var(--kb-hp)' },
  prestige: { l: 'Prestigio', icon: 'sparkle',     c: 'var(--area-community)' },
  goal:     { l: 'Meta',      icon: 'calendar',    c: 'var(--area-community)' },
  logro:    { l: 'Logro',     icon: 'trophy',      c: 'var(--kb-medal)' },
};
const AREA_MILESTONES_V3 = {
  vigor: [
    { kind: 'goal', title: 'Maratón otoño 2026', when: 'Sep 28', state: 'next', detail: '38% · proyecto activo' },
    { kind: 'logro', title: 'Logro: “Primer 10K”', when: '12 May', state: 'done', detail: 'Desbloqueado · +1 insignia de Vigor', achievement: true },
    { kind: 'record', title: 'Récord: 10 km sin parar', when: '12 May', state: 'done', detail: '57 min · zona 2' },
    { kind: 'level', title: 'Subiste a Nivel 23', when: '28 Abr', state: 'done', detail: '+500 XP de Vigor' },
    { kind: 'streak', title: '30 días de movimiento', when: '14 Abr', state: 'done', detail: 'Mejor racha física' },
  ],
  wisdom: [
    { kind: 'goal', title: 'Cerrar curso System Design', when: 'Jun 30', state: 'next', detail: '72% · 18/25 tareas' },
    { kind: 'logro', title: 'Logro: “Mente curiosa”', when: '20 May', state: 'done', detail: 'Desbloqueado · 5 cursos completados', achievement: true },
    { kind: 'prestige', title: 'Prestigio 3 alcanzado', when: '20 May', state: 'done', detail: 'Tu área más prestigiada' },
    { kind: 'project', title: 'Terminaste “UX para No-Diseñadores”', when: '02 May', state: 'done', detail: '+280 XP' },
    { kind: 'level', title: 'Subiste a Nivel 41', when: '18 Abr', state: 'done', detail: 'Sabiduría' },
  ],
  wealth: [
    { kind: 'goal', title: 'Fondo de emergencia al 100%', when: 'Ago 2026', state: 'next', detail: '78% · faltan $5.4K' },
    { kind: 'logro', title: 'Logro: “Mes en verde”', when: '30 Abr', state: 'done', detail: 'Desbloqueado · ahorro positivo 3 meses', achievement: true },
    { kind: 'record', title: 'Mejor mes de ahorro', when: '30 Abr', state: 'done', detail: '+$8.2K netos' },
    { kind: 'prestige', title: 'Prestigio 4 alcanzado', when: '10 Abr', state: 'done', detail: 'A un paso de Maestro' },
  ],
  community: [
    { kind: 'goal', title: 'Cena mensual familia', when: 'May 28', state: 'next', detail: '60% organizado' },
    { kind: 'logro', title: 'Logro: “Presente”', when: '25 Abr', state: 'done', detail: 'Desbloqueado · 8 gestos en un mes', achievement: true },
    { kind: 'level', title: 'Subiste a Nivel 27', when: '02 Abr', state: 'done', detail: 'Comunidad' },
  ],
  will: [
    { kind: 'streak', title: 'Racha de 21 días', when: 'Hoy', state: 'next', detail: 'Diario nocturno · sigue' },
    { kind: 'logro', title: 'Logro: “Inquebrantable”', when: '15 May', state: 'done', detail: 'Desbloqueado · prestigio Maestro', achievement: true },
    { kind: 'prestige', title: 'Prestigio Maestro', when: '15 May', state: 'done', detail: 'Ascenso infinito' },
    { kind: 'project', title: 'Venciste “Procrastinación”', when: '12 Abr', state: 'done', detail: 'Reto completado' },
  ],
};

// Jerarquía hacia abajo por área (qué cuelga del área y dónde vive).
const AREA_HIER_V3 = {
  vigor:     { kind: 'projects', label: 'Proyectos y metas físicas', screen: 'salud',    home: 'Salud' },
  wisdom:    { kind: 'study',    label: 'Cursos, materias y lectura', screen: 'estudio',  home: 'Estudio' },
  wealth:    { kind: 'finance',  label: 'Proyectos financieros',      screen: 'finanzas', home: 'Finanzas' },
  community: { kind: 'projects', label: 'Proyectos',                  screen: null,       home: null },
  will:      { kind: 'will',     label: 'Retos y hábitos (no hay proyectos)', screen: 'habits', home: 'Hábitos y Retos' },
};

// Fondos de área para prestigio Maestro (personalización exclusiva).
const AREA_MASTER_BG = [
  { id: 'cosmos', label: 'Cosmos',    css: 'radial-gradient(130% 90% at 12% 0%, #241A4D 0%, #160F33 45%, #0B0820 100%)' },
  { id: 'nebula', label: 'Nebulosa',  css: 'radial-gradient(120% 100% at 82% 0%, #3A1E5C 0%, #1A1030 60%, #0B0820 100%)' },
  { id: 'aurora', label: 'Aurora',    css: 'linear-gradient(135deg, #0B2A2A 0%, #103A4A 55%, #0B0820 100%)' },
  { id: 'ember',  label: 'Brasa',     css: 'radial-gradient(120% 100% at 20% 0%, #45221E 0%, #2A1020 60%, #0B0820 100%)' },
];

// ── Util de tareas por proyecto ─────────────────────────────────────────
function tasksOfProject(pid) { return (typeof DEMO_TASKS_FULL !== 'undefined' ? DEMO_TASKS_FULL : []).filter(t => t.project === pid); }
function statusCounts(tasks) {
  const c = { todo: 0, doing: 0, blocked: 0, done: 0 };
  tasks.forEach(t => { c[t.status] = (c[t.status] || 0) + 1; });
  return c;
}

// ── Punto de info (tooltip propio, renderizado en portal para que nunca
//    quede clipeado ni detrás de otros componentes) ──────────────────────
function InfoDot({ text, label }) {
  const ref = React.useRef(null);
  const [tip, setTip] = React.useState(null); // { x, y, below }
  function show() {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const below = r.top < 130; // si el dato está muy arriba, abrir hacia abajo
    setTip({ x: r.left + r.width / 2, y: below ? r.bottom + 9 : r.top - 9, below });
  }
  function hide() { setTip(null); }
  return (
    <>
      <span ref={ref} className="kbv-infodot" tabIndex={0} aria-label={text}
            onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>{label || 'i'}</span>
      {tip && typeof ReactDOM !== 'undefined' && ReactDOM.createPortal(
        <span className={`kbv-tip-pop ${tip.below ? 'below' : 'above'}`} style={{ left: tip.x, top: tip.y }} role="tooltip">{text}</span>,
        document.body
      )}
    </>
  );
}

// ── Sparkline mínima ────────────────────────────────────────────────────
function AreaSparkline({ data = [], color = 'var(--kb-gem)', w = 132, h = 38 }) {
  if (!data.length) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const span = Math.max(1, max - min);
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => [i * step, h - 4 - ((v - min) / span) * (h - 10)]);
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  return (
    <svg className="kbv-area-spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={`${d} L${w} ${h} L0 ${h} Z`} fill={color} opacity="0.12" />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.6" fill={color} />
    </svg>
  );
}

// ── Fila de hipervínculo a actividad ────────────────────────────────────
function ActivityLink({ icon, name, meta, badge, badgeColor, onClick }) {
  return (
    <button type="button" className="kbv-area-actlink" onClick={onClick}>
      <span className="al-ico"><KIcon name={icon} size={14} /></span>
      <span className="al-body">
        <span className="al-name">{name}</span>
        {meta && <span className="al-meta">{meta}</span>}
      </span>
      {badge != null && <span className="al-badge" style={{ '--bc': badgeColor || 'var(--kb-text-3)' }}>{badge}</span>}
      <KIcon name="arrow-right" size={13} className="al-arrow" />
    </button>
  );
}

// ── Insignia circular de prestigio/rango del área ───────────────────────
function AreaEmblem({ id, size = 56 }) {
  const master = areaIsMaster(id);
  const prog = areaProg(id);
  if (master && typeof PrestigeEmblem === 'function') return <PrestigeEmblem tier={16} size={size} />;
  if (typeof RankEmblem === 'function') return <RankEmblem level={prog.level || 1} size={size} />;
  return <span className="adh-glyph-fallback" />;
}

// Nivel mostrado: en Maestro continúa más allá de 50 (ascenso infinito).
function areaDisplayLevel(id) { const p = areaProg(id); return p.level || 1; }

// Estrellas de prestigio del área (V3) — 1 estrella por prestigio; Maestro = 5 doradas animadas.
function AreaRankStars({ id }) {
  const master = areaIsMaster(id);
  const p = areaPrestige(id);
  if (master) {
    return (
      <span className="kbv-rankstars master" title="Prestigio Maestro · 5 de 5">
        <span className="rs-stars">{'★★★★★'}</span>
        <span className="rs-label">Maestro</span>
      </span>
    );
  }
  return (
    <span className="kbv-rankstars" title={`Prestigio ${p} de ${AREA_PRESTIGE_TIERS}`}>
      {Array.from({ length: AREA_PRESTIGE_TIERS }).map((_, i) => <span key={i} className={`rs-s ${i < p ? 'on' : ''}`}>★</span>)}
    </span>
  );
}

// ════════════════════════════════════════════════════════════════════════
// VISTA GENERAL — la principal: balance, patrones, prioridades.
// ════════════════════════════════════════════════════════════════════════
function AreasGeneralV3({ areas, onOpen }) {
  const rows = areas.map(a => {
    const prog = areaProg(a.id);
    const openTasks = (typeof DEMO_TASKS_FULL !== 'undefined' ? DEMO_TASKS_FULL : []).filter(t => t.area === a.id && t.status !== 'done');
    const doing = openTasks.filter(t => t.status === 'doing').length;
    const projects = DEMO_PROJECTS_BY_AREA[a.id] || [];
    return {
      area: a, prestige: prog.prestige, level: prog.level, master: areaIsMaster(a.id),
      momentum: areaMomentum(a.id), delta: areaTrendDelta(a.id),
      activeProjects: projects.filter(p => p.status !== 'done').length,
      openTasks: openTasks.length, doing,
    };
  });
  // Ranking por (prestigio, nivel)
  const ranked = [...rows].sort((a, b) => (b.prestige - a.prestige) || (b.level - a.level));
  ranked.forEach((r, i) => { r.rank = i + 1; });
  const strongest = [...rows].sort((a, b) => b.momentum - a.momentum)[0];
  const weakest = [...rows].sort((a, b) => areaDecline(b.area.id) - areaDecline(a.area.id))[0];
  const priority = [...rows].sort((a, b) => b.openTasks - a.openTasks)[0];
  const sP = AREA_PERIOD_V3[strongest.area.id] || {};
  const decl = areaDecline(weakest.area.id);

  return (
    <>
      {/* Insights — número primero, periodo explícito */}
      <div className="kbv-area-insights">
        <div className="ai-card" style={{ '--c': strongest.area.color }}>
          <span className="ai-tag"><KIcon name="trending-up" size={12} /> Patrón · 30 días</span>
          <span className="ai-num">+{(sP.xp30 || 0).toLocaleString('es-MX')} <small>XP</small></span>
          <span className="ai-sub">{strongest.area.name}{sP.lvlUp ? ` · +${sP.lvlUp} niv.` : ''} — lleva el impulso</span>
          <button type="button" className="ai-link" onClick={() => onOpen(strongest.area.id)}>Analizar <KIcon name="arrow-right" size={12} /></button>
        </div>
        <div className="ai-card" style={{ '--c': weakest.area.color }}>
          <span className="ai-tag"><KIcon name="alert" size={12} /> Oportunidad · 8 sem</span>
          <span className="ai-num" style={{ color: 'var(--kb-hp-ink)' }}>{decl > 0 ? `−${decl}%` : 'estable'}</span>
          <span className="ai-sub">{weakest.area.name} — actividad a la baja</span>
          <button type="button" className="ai-link" onClick={() => onOpen(weakest.area.id)}>Revisar <KIcon name="arrow-right" size={12} /></button>
        </div>
        <div className="ai-card" style={{ '--c': priority.area.color }}>
          <span className="ai-tag"><KIcon name="list" size={12} /> Prioridad · ahora</span>
          <span className="ai-num">{priority.openTasks} <small>abiertas · {priority.doing} en curso</small></span>
          <span className="ai-sub">{priority.area.name} — concentra el pendiente</span>
          <button type="button" className="ai-link" onClick={() => onOpen(priority.area.id)}>Ver proyectos <KIcon name="arrow-right" size={12} /></button>
        </div>
      </div>

      {/* Tarjetas de área */}
      <div className="kbv-study-section-head" style={{ marginTop: 4 }}>
        <h3 className="kbv-h3">Tus áreas <span className="kbv-meta">({areas.length})</span></h3>
        <span className="kbv-meta">Toca un área para ver su detalle</span>
      </div>
      <div className="kbv-area-cards">
        {rows.map(r => {
          const pulse = (AREA_PULSE_V3[r.area.id] || {}).metrics?.[0];
          return (
            <button type="button" key={r.area.id} className={`kbv-area-mini ${r.master ? 'master' : ''}`} onClick={() => onOpen(r.area.id)} style={{ '--c': r.area.color }}>
              <div className="am-top">
                <span className="am-glyph"><KIcon name={r.area.glyph} size={20} /></span>
                <div className="am-id">
                  <span className="am-name">{r.area.name}</span>
                  <AreaRankStars id={r.area.id} />
                </div>
                <span className="am-lvl">Nv {areaDisplayLevel(r.area.id)}</span>
              </div>
              <AreaSparkline data={AREA_TREND_V3[r.area.id]} color={r.area.color} w={240} h={34} />
              <div className="am-foot">
                {pulse && <span className="am-pulse"><b>{pulse.v}</b> {pulse.l}</span>}
                <span className="am-stat">{r.activeProjects} proy · {r.openTasks} tareas</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Balance entre áreas — ranking, posición, histórico, movimiento */}
      <div className="kbv-fin-card" style={{ marginTop: 8 }}>
        <div className="head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <h3 className="kbv-h3" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Balance entre áreas <InfoDot text="Ranking por prestigio y nivel. ▲▼ = cómo se movió tu posición en las últimas semanas." /></h3>
          </div>
        </div>
        <div className="kbv-area-compare ranked">
          <div className="cmp-row cmp-head">
            <span className="cmp-rank">#</span>
            <span className="cmp-id">Área</span>
            <span className="cmp-lvl">Rango</span>
            <span className="cmp-track-h">Progreso general</span>
            <span className="cmp-hist">En el puesto</span>
            <span className="cmp-delta">Mov.</span>
          </div>
          {ranked.map(r => {
            const hist = AREA_RANKHIST_V3[r.area.id] || { weeks: 1, moved: 0 };
            const maxLp = AREA_PRESTIGE_TIERS * AREA_LP;
            const overall = ((r.master ? AREA_PRESTIGE_TIERS - 1 : r.prestige) * AREA_LP + (r.master ? AREA_LP : r.level)) / maxLp * 100;
            return (
              <button type="button" key={r.area.id} className="cmp-row" onClick={() => onOpen(r.area.id)} style={{ '--c': r.area.color }}>
                <span className="cmp-rank">#{r.rank}</span>
                <span className="cmp-id"><span className="cmp-glyph"><KIcon name={r.area.glyph} size={14} /></span>{r.area.name}</span>
                <span className="cmp-lvl">{r.master ? 'Maestro' : `P${r.prestige} · Nv ${r.level}`}</span>
                <div className="cmp-track"><span style={{ width: `${overall}%` }} /></div>
                <span className="cmp-hist" title={`${hist.weeks} semanas en el puesto #${r.rank}`}>{hist.weeks} sem</span>
                <span className={`cmp-delta ${hist.moved > 0 ? 'up' : hist.moved < 0 ? 'down' : ''}`}>{hist.moved > 0 ? `▲ ${hist.moved}` : hist.moved < 0 ? `▼ ${Math.abs(hist.moved)}` : '–'}</span>
              </button>
            );
          })}
        </div>
      </div>

    </>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PANEL DE RANGO DEL ÁREA (reutiliza RankEmblem, limitado a 50 niv / mitad)
// ════════════════════════════════════════════════════════════════════════
function AreaRankPanel({ area }) {
  const prog = areaProg(area.id);
  const master = areaIsMaster(area.id);
  // En Maestro el nivel sigue subiendo en ciclos de 50; cada ciclo da recompensas.
  const cycle = master ? Math.ceil(prog.level / AREA_LP) : 0;
  const lineStart = master ? (cycle - 1) * AREA_LP : 0;            // 50 para el ciclo 2 (niv 51–100)
  const cycleLevel = prog.level - lineStart;                       // posición dentro del ciclo
  const fillPct = (cycleLevel / AREA_LP) * 100;
  const tickOffsets = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  const masterRewards = { 10: '◆', 25: '◉', 50: '×2' };           // materia oscura · monedas · multiplicador

  return (
    <div className="kbv-card kbv-char-card kbv-area-rankpanel" style={{ '--c': area.color }}>
      <div className="arp-head">
        <span className={`arp-glyph ${master ? 'master' : ''}`}><KIcon name={area.glyph} size={26} /></span>
        <div className="arp-meta">
          <span className="kbv-eyebrow">{master ? 'Prestigio Maestro' : `Prestigio ${prog.prestige} de ${AREA_PRESTIGE_TIERS}`}</span>
          <span className="arp-rank">{master ? 'Maestro' : areaRankName(prog.level)} <span className="arp-rank-lvl">· Nivel {prog.level}</span></span>
          <span className="arp-sub">
            {master
              ? <>Ciclo {cycle} · sigues ascendiendo sin tope. Próximo cofre en el nivel <strong>{lineStart + AREA_LP}</strong>.</>
              : <>Nivel {prog.level}/{AREA_LP} · faltan <strong>{AREA_LP - prog.level}</strong> para {prog.prestige + 1 >= AREA_PRESTIGE_TIERS ? 'el Maestro' : `el prestigio ${prog.prestige + 1}`}.</>}
          </span>
        </div>
        {!master && (
          <div className="arp-prog">
            <div className="arp-track"><span style={{ width: `${Math.round(fillPct)}%`, background: area.color }} /></div>
            <span className="kbv-meta">{Math.round(fillPct)}% al siguiente prestigio</span>
          </div>
        )}
      </div>

      {/* Una estrella por prestigio (Maestro = doradas con arcoíris animado) */}
      <div className="arp-prestige-stars">
        {Array.from({ length: AREA_PRESTIGE_TIERS }).map((_, i) => (
          <span key={i} className={`aps ${(master || i < prog.prestige) ? 'on' : ''} ${master ? 'master' : ''}`}>★</span>
        ))}
        <span className="aps-label">{master ? 'Maestro · 5/5 prestigios' : `${prog.prestige}/${AREA_PRESTIGE_TIERS} prestigios completados`}</span>
      </div>

      {/* Línea del tiempo de niveles — muestra el rango real del usuario (Nv {lineStart+1}–{lineStart+50}) */}
      <div className={`arp-levelline ${master ? 'master' : ''}`}>
        <div className="all-track">
          <div className="all-trail" style={{ width: `${fillPct}%` }} />
          <span className="all-comet" style={{ left: `${fillPct}%` }}><em className="all-comet-lvl">Nv {prog.level}</em></span>
        </div>
        <div className="all-ticks">
          {tickOffsets.map(off => {
            const abs = lineStart + off;
            return (
              <span key={off} className={`all-tick ${cycleLevel >= off ? 'reached' : ''}`} style={{ left: `${(off / AREA_LP) * 100}%` }}>
                {master && masterRewards[off] && <b className="all-reward" data-tip="Recompensa de ciclo">{masterRewards[off]}</b>}
                <i /><em>{abs}</em>
              </span>
            );
          })}
        </div>
      </div>
      {master && <span className="arp-reward-note"><KIcon name="sparkle" size={11} /> Cada ciclo de 50 niveles desbloquea <strong>materia oscura ◆, monedas ◉ y multiplicadores ×2</strong> — sin tope, después del prestigio 5.</span>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// DETALLE DE ÁREA — pestañas: Progreso (con hitos) · Proyectos · Configuración
// ════════════════════════════════════════════════════════════════════════
function AreaDetailV3({ area, areas, onBack, onSave, initialTab }) {
  const [sub, setSub] = React.useState(initialTab || 'progreso');
  const [openHito, setOpenHito] = React.useState(null);
  const rules = AREA_RULES[area.id] || { editable: 'full', deletable: true, projects: true };
  const master = areaIsMaster(area.id);
  const prog = areaProg(area.id);
  const hier = AREA_HIER_V3[area.id] || { kind: 'projects', label: 'Proyectos', screen: null, home: null };
  const pulse = AREA_PULSE_V3[area.id] || { period: '', metrics: [] };
  const milestones = AREA_MILESTONES_V3[area.id] || [];

  const SUBTABS = [
    { id: 'progreso', label: 'Progreso', icon: 'trending-up' },
    { id: 'proyectos', label: hier.kind === 'will' ? 'Retos y hábitos' : hier.kind === 'study' ? 'Aprendizaje' : hier.kind === 'finance' ? 'Finanzas' : 'Proyectos', icon: 'layers' },
    { id: 'config', label: 'Configuración', icon: 'settings' },
  ];

  return (
    <div className="kbv-area-detail" style={{ '--c': area.color }}>
      <button type="button" className="kbv-area-back" onClick={onBack}><KIcon name="arrow-left" size={14} /> Todas las áreas</button>

      {/* Header del área — ícono propio del área; contorno arcoíris si Maestro */}
      <div className={`kbv-area-detail-head ${master ? 'master' : ''}`} style={area.bgTint ? { background: `color-mix(in oklab, ${area.color} ${area.bgTint * 9}%, var(--kb-card))` } : undefined}>
        <span className={`adh-glyph ${master ? 'master-ring' : ''}`}><KIcon name={area.glyph} size={26} /></span>
        <div className="adh-id">
          <div className="adh-name-row">
            <h2 className="adh-name">{area.name}</h2>
            <AreaRankStars id={area.id} />
          </div>
          <p className="adh-desc">{master ? 'Grado supremo · ascenso infinito' : `${areaRankName(prog.level)} · Prestigio ${prog.prestige}/${AREA_PRESTIGE_TIERS}`} — {area.desc}</p>
        </div>
        <div className="adh-lvl">
          <span className="adh-lvl-v">Nv {areaDisplayLevel(area.id)}</span>
          <span className="adh-lvl-l">{master ? 'sin tope' : `de ${AREA_LP}`}</span>
        </div>
      </div>

      <div className="kbv-store-tabs-v2" style={{ marginBottom: 4 }}>
        {SUBTABS.map(t => (
          <button key={t.id} type="button" className={sub === t.id ? 'on' : ''} onClick={() => setSub(t.id)}>
            <KIcon name={t.icon} size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* ── PROGRESO (incluye rango + pulso + hitos embebidos) ── */}
      {sub === 'progreso' && (
        <>
          <AreaRankPanel area={area} />

          <div className="kbv-card kbv-char-card">
            <div className="kbv-study-section-head tight"><h3 className="kbv-h3" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Pulso del área <InfoDot text={`Resumen estratégico — ${pulse.period}. Vista de alto nivel; el detalle fino vive en su módulo.`} /></h3><span className="kbv-meta">{pulse.period}</span></div>
            <div className="kbv-area-pulsegrid">
              {pulse.metrics.map((m, i) => {
                const tone = PULSE_TONE[m.tone] || PULSE_TONE.neutral;
                return (
                  <div key={i} className="apg-cell">
                    <span className="apg-flag" style={{ color: tone.c }}>{tone.g}</span>
                    <span className="apg-v" style={m.tone === 'good' || m.tone === 'bad' ? { color: tone.c } : undefined}>{m.v}</span>
                    <span className="apg-l">{m.l}</span>
                  </div>
                );
              })}
            </div>
            <div className="kbv-area-trendrow">
              <div className="atr-chart"><span className="kbv-meta">Tendencia · 8 semanas</span><AreaSparkline data={AREA_TREND_V3[area.id]} color={area.color} w={520} h={52} /></div>
              {(() => {
                const d = areaTrendDelta(area.id);
                const cls = d > 0 ? 'up' : d < 0 ? 'down' : 'flat';
                return <div className="atr-stat"><span className={`atr-v ${cls}`}>{d > 0 ? '▲' : d < 0 ? '▼' : '–'} {Math.abs(d)}</span><span className="kbv-meta">{d === 0 ? 'sin cambios' : 'vs semana previa'}</span></div>;
              })()}
            </div>
          </div>

          {/* Hitos embebidos en Progreso */}
          <div className="kbv-card kbv-char-card">
            <div className="kbv-study-section-head tight"><h3 className="kbv-h3" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Hitos y logros <InfoDot text="Lo que ya lograste y lo que viene. Toca cualquier hito para ver su detalle." /></h3><span className="kbv-meta">próximos y logrados</span></div>
            <div className="kbv-area-timeline">
              {milestones.map((m, i) => {
                const k = MS_KIND[m.kind] || MS_KIND.level;
                return (
                  <button type="button" key={i} className={`atl-item clickable ${m.state}`} style={{ '--mc': k.c }} onClick={() => setOpenHito(m)}>
                    <span className="atl-dot"><KIcon name={k.icon} size={12} /></span>
                    <div className="atl-body">
                      <div className="atl-head">
                        <span className={`atl-kind ${m.state === 'next' ? 'next' : ''}`}>{m.state === 'next' ? 'Próximo' : k.l}</span>
                        <span className="atl-when">{m.when}</span>
                      </div>
                      <span className="atl-title">{m.title}</span>
                      {m.detail && <span className="atl-detail">{m.detail}</span>}
                    </div>
                    <KIcon name="arrow-right" size={12} className="atl-arrow" />
                  </button>
                );
              })}
            </div>
          </div>
          {openHito && <HitoModal hito={openHito} onClose={() => setOpenHito(null)} />}
        </>
      )}

      {/* ── PROYECTOS (jerarquía hacia abajo, por tipo de área) ── */}
      {sub === 'proyectos' && <AreaProjectsV3 area={area} hier={hier} />}

      {/* ── CONFIGURACIÓN ── */}
      {sub === 'config' && (
        <AreaConfigV3 area={area} rules={rules} hier={hier} master={master} onSave={onSave} />
      )}
    </div>
  );
}

// ── Pestaña Proyectos — adapta la jerarquía de cada área ────────────────
const WILL_RETOS_V3 = [
  { id: 'q1', name: 'Vencer “Procrastinación nocturna”', daysLeft: 9, pct: 70, started: '12 Abr', target: 'Dormir antes de 23:30, 21 noches', best: 'racha 6 d', desc: 'Reto de 30 días para cortar el ciclo de pantallas nocturnas. Cada noche cumplida suma a Voluntad.' },
  { id: 'q2', name: 'Cortar el azúcar 30 días', daysLeft: 12, pct: 40, started: '01 May', target: '30 días sin azúcar añadida', best: 'racha 9 d', desc: 'Sin postres ni bebidas azucaradas. Un desliz reinicia la racha del reto.' },
];
const WILL_HABITOS_V3 = [
  { id: 'h1', name: 'Diario nocturno', streak: 21, pct: 92, freq: 'Diario · noche', best: 26, last30: 28, desc: 'Escribir 3 líneas antes de dormir. Tu hábito ancla — sostiene la racha de Voluntad.' },
  { id: 'h2', name: 'No redes < 22h', streak: 12, pct: 80, freq: 'Diario', best: 18, last30: 24, desc: 'Sin redes sociales después de las 22:00. Protege tu sueño y tu foco.' },
  { id: 'h3', name: 'Meditación AM', streak: 8, pct: 60, freq: 'Diario · mañana', best: 15, last30: 18, desc: '10 minutos al despertar. Baja la ansiedad y mejora el arranque del día.' },
];
const FINANCE_KPIS_V3 = [
  { v: '+$28.1K', l: 'saldo total', tone: 'good' },
  { v: '$42.3K', l: 'patrimonio neto', tone: 'good' },
  { v: '$14.2K', l: 'deuda activa', tone: 'bad' },
  { v: '+$8.2K', l: 'ahorro · mes', tone: 'good' },
];
const FINANCE_GOALS_V3 = [
  { id: 'emergencia', name: 'Fondo de emergencia', amount: '$18.6K', target: '$24K', pct: 78 },
  { id: 'inversion', name: 'Inversión mensual', amount: '$6.5K', target: '$6.5K/mes', pct: 100 },
  { id: 'viaje', name: 'Viaje 2026', amount: '$12.4K', target: '$40K', pct: 31 },
];

// ── Detalle homologado de reto / hábito (mismo que su módulo, con acciones) ──
function WillItemModal({ item, kind, onClose, onAction }) {
  const isHabit = kind === 'habito';
  const accent = isHabit ? 'var(--kb-primary)' : 'var(--kb-hp)';
  return (
    <KBVModal title={item.name} sub={`${isHabit ? 'Hábito' : 'Reto'} · Voluntad`} onClose={onClose} size="lg"
      footer={<div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cerrar</button>
        <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => { onAction && onAction(item.id); }}><KIcon name="check" size={14} /> {isHabit ? 'Marcar hoy' : 'Registrar avance'}</button>
      </div>}>
      <div className="kbv-atask-meta">
        <span className="am-pill" style={{ '--c': accent }}><KIcon name={isHabit ? 'check' : 'flame'} size={11} /> {isHabit ? 'Hábito' : 'Reto'}</span>
        <span className="am-pill area" style={{ '--c': 'var(--area-will)' }}><KIcon name="will" size={11} /> Voluntad</span>
        {isHabit ? <span className="am-chip"><KIcon name="flame" size={11} /> Racha <strong>{item.streak} d</strong></span>
                 : <span className="am-chip"><KIcon name="calendar" size={11} /> Faltan <strong>{item.daysLeft} d</strong></span>}
      </div>
      <div className="kbv-progress" style={{ height: 8, marginTop: 12 }}><div className="fill" style={{ width: `${item.pct}%`, background: accent }} /></div>
      <span className="kbv-meta" style={{ display: 'block', marginTop: 4 }}>{item.pct}% {isHabit ? 'de cumplimiento (30 días)' : 'del reto completado'}</span>
      <div className="kbv-detail-rows" style={{ marginTop: 12 }}>
        {isHabit ? <>
          <div className="row"><span className="l">Frecuencia</span><span className="v">{item.freq}</span></div>
          <div className="row"><span className="l">Mejor racha</span><span className="v">{item.best} días</span></div>
          <div className="row"><span className="l">Últimos 30 días</span><span className="v">{item.last30}/30 cumplidos</span></div>
        </> : <>
          <div className="row"><span className="l">Objetivo</span><span className="v">{item.target}</span></div>
          <div className="row"><span className="l">Iniciado</span><span className="v">{item.started}</span></div>
          <div className="row"><span className="l">Mejor marca</span><span className="v">{item.best}</span></div>
        </>}
        <div className="row"><span className="l">Suma a</span><span className="v">Voluntad · XP por constancia</span></div>
      </div>
      {item.desc && <p className="kbv-body" style={{ marginTop: 12 }}>{item.desc}</p>}
      <div className="kbv-quick-actions">
        <button type="button" className="kbv-qa" onClick={() => onAction && onAction(item.id)}><KIcon name="check" size={13} /> {isHabit ? 'Marcar hoy' : 'Registrar avance'}</button>
        <button type="button" className="kbv-qa" onClick={() => nav(isHabit ? 'habits' : 'retos', { [isHabit ? 'habit' : 'reto']: item.id })}><KIcon name="arrow-right" size={13} /> Abrir en {isHabit ? 'Hábitos' : 'Retos'}</button>
      </div>
    </KBVModal>
  );
}

// ── Detalle de hito / logro ─────────────────────────────────────────────
function HitoModal({ hito, onClose }) {
  const k = MS_KIND[hito.kind] || MS_KIND.level;
  return (
    <KBVModal title={hito.title} sub={`${hito.state === 'next' ? 'Próximo' : k.l} · ${hito.when}`} onClose={onClose}
      footer={<div className="right" style={{ marginLeft: 'auto' }}><button type="button" className="kbv-btn kbv-btn-primary" onClick={onClose}>Listo</button></div>}>
      <div className="kbv-atask-meta">
        <span className="am-pill" style={{ '--c': k.c }}><KIcon name={k.icon} size={11} /> {k.l}</span>
        <span className="am-chip">{hito.when}</span>
        {hito.achievement && <span className="am-pill" style={{ '--c': 'var(--kb-medal)' }}><KIcon name="trophy" size={11} /> Logro</span>}
      </div>
      {hito.detail && <p className="kbv-body" style={{ marginTop: 12 }}>{hito.detail}</p>}
      <p className="kbv-meta" style={{ marginTop: 8 }}>{hito.state === 'next' ? 'Meta próxima — al cumplirla quedará registrada en tu trayectoria.' : 'Logrado y guardado en tu trayectoria de esta área.'}</p>
    </KBVModal>
  );
}

// ── Detalle de curso / materia (proyecto de Estudio) ────────────────────
const STUDY_MATERIA_IDS = ['calculo-2', 'algebra-lineal', 'bases-datos'];
function CourseAreaModal({ item, onClose }) {
  const isMateria = item.kind === 'materia';
  const tasks = tasksOfProject(item.id);
  return (
    <KBVModal title={item.name} sub={`${isMateria ? 'Materia' : 'Curso'} · Sabiduría`} onClose={onClose} size="lg"
      footer={<div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cerrar</button>
        <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => nav('estudio', { project: item.id })}><KIcon name="arrow-right" size={14} /> Abrir en Estudio</button>
      </div>}>
      <div className="kbv-atask-meta">
        <span className="am-pill" style={{ '--c': isMateria ? 'var(--area-community)' : 'var(--kb-gem)' }}><KIcon name={isMateria ? 'graduation' : 'layers'} size={11} /> {isMateria ? 'Materia' : 'Curso'}</span>
        <span className="am-pill area" style={{ '--c': 'var(--area-wisdom)' }}><KIcon name="wisdom" size={11} /> Sabiduría</span>
        <span className="am-chip">{tasks.length} tareas · {item.pct}% completado</span>
      </div>
      <div className="kbv-progress" style={{ height: 8, marginTop: 12 }}><div className="fill" style={{ width: `${item.pct}%`, background: 'var(--area-wisdom)' }} /></div>
      <div className="kbv-detail-rows" style={{ marginTop: 12 }}>
        <div className="row"><span className="l">Por hacer</span><span className="v">{item.counts.todo}</span></div>
        <div className="row"><span className="l">En curso</span><span className="v">{item.counts.doing}</span></div>
        {item.counts.blocked > 0 && <div className="row"><span className="l">Bloqueadas</span><span className="v">{item.counts.blocked}</span></div>}
        <div className="row"><span className="l">Hechas</span><span className="v">{item.counts.done}</span></div>
      </div>
      {tasks.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <span className="kbv-meta" style={{ fontWeight: 700 }}>Tareas de {isMateria ? 'la materia' : 'el curso'}</span>
          <div className="kbv-area-actlist">
            {tasks.slice(0, 6).map(t => (
              <ActivityLink key={t.id} icon="check" name={t.title} meta={({ todo: 'Por hacer', doing: 'En curso', blocked: 'Bloqueado', done: 'Hecha' })[t.status] || t.status} badge={t.status === 'done' ? '✓' : null} badgeColor="var(--kb-primary)" onClick={() => nav('tareas', { area: 'wisdom', taskId: t.id })} />
            ))}
          </div>
        </div>
      )}
    </KBVModal>
  );
}

// Voluntad — homologado 1:1 con Retos y Hábitos: las MISMAS tarjetas y los
// MISMOS modales de detalle, con las mismas acciones (registrar, editar, etc.).
function AreaWillTab({ area }) {
  const [habits, setHabits] = React.useState(() => (typeof HabitsStore !== 'undefined' ? HabitsStore.get() : []));
  React.useEffect(() => { if (typeof HabitsStore !== 'undefined') return HabitsStore.subscribe(setHabits); }, []);
  const [retos, setRetos] = React.useState(() => (typeof RETOS_DEMO !== 'undefined' ? RETOS_DEMO.slice() : []));
  const [openHabit, setOpenHabit] = React.useState(null);
  const [editingHabit, setEditingHabit] = React.useState(null);
  const [openReto, setOpenReto] = React.useState(null);

  const activeRetos = retos.filter(r => r.status === 'active');

  const [ask, confirmDialog] = useConfirm();
  function deleteHabit(id) {
    const h = (typeof habits !== 'undefined' ? habits : []).find(x => x.id === id);
    ask({
      title: `Eliminar «${h ? h.name : 'hábito'}»`,
      message: h && h.streak > 0
        ? `Se pierde el historial y la racha de ${h.streak} días. Esto no se puede deshacer.`
        : 'Se pierde el historial completo. Esto no se puede deshacer.',
      confirmLabel: 'Sí, eliminar',
      onConfirm: () => { HabitsStore.set(hs => hs.filter(x => x.id !== id)); setOpenHabit(null); },
    });
  }
  function onSaveHabit(h) { if (h.id) HabitsStore.set(hs => hs.map(x => x.id === h.id ? { ...x, ...h } : x)); }
  function registerDay(id) { setRetos(rs => rs.map(r => r.id === id ? { ...r, daysElapsed: Math.min(r.daysTotal, r.daysElapsed + 1), todayMark: 'done' } : r)); }
  function registerFail(id) {
    setRetos(rs => rs.map(r => {
      if (r.id !== id) return r;
      const fails = r.fails + 1; const daysElapsed = Math.min(r.daysTotal, r.daysElapsed + 1);
      if (fails > r.failsAllowed) return { ...r, fails, daysElapsed, todayMark: 'fail', lostDay: 'Hoy', lostDayN: daysElapsed, status: 'completed', success: false, critical: true, completedAt: 'Hoy' };
      return { ...r, fails, daysElapsed, todayMark: 'fail' };
    }));
  }
  function undoToday(id) {
    setRetos(rs => rs.map(r => {
      if (r.id !== id || !r.todayMark) return r;
      if (r.todayMark === 'fail') return { ...r, fails: Math.max(0, r.fails - 1), daysElapsed: Math.max(0, r.daysElapsed - 1), todayMark: null, lostDay: undefined, lostDayN: undefined, status: 'active', success: undefined, critical: false, completedAt: undefined };
      return { ...r, daysElapsed: Math.max(0, r.daysElapsed - 1), todayMark: null };
    }));
  }

  return (
    <>
      <div className="kbv-area-feedback"><KIcon name="sparkle" size={14} /><span>Estas son las <strong>mismas tarjetas</strong> de Retos y Hábitos: registra, abre el detalle y ejecuta las mismas acciones sin salir de Áreas. Las rachas son las que suben Voluntad.</span></div>

      <div className="kbv-card kbv-char-card">
        <div className="kbv-study-section-head tight"><h3 className="kbv-h3"><KIcon name="flame" size={13} style={{ color: 'var(--kb-hp)', verticalAlign: '-2px' }} /> Retos activos <span className="kbv-meta">({activeRetos.length})</span></h3><button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }} onClick={() => nav('retos')}>Abrir Retos <KIcon name="arrow-right" size={12} /></button></div>
        <div className="kbv-retos-grid">
          {activeRetos.length ? activeRetos.map(r => (
            <RetoCard key={r.id} r={r} onOpen={setOpenReto} onRegister={registerDay} onFail={registerFail} onUndo={undoToday} />
          )) : <span className="kbv-meta">No hay retos activos. Lanza uno en la sección de Retos.</span>}
        </div>
      </div>

      <div className="kbv-card kbv-char-card">
        <div className="kbv-study-section-head tight"><h3 className="kbv-h3"><KIcon name="check" size={13} style={{ color: 'var(--kb-primary)', verticalAlign: '-2px' }} /> Hábitos <span className="kbv-meta">({habits.length})</span></h3><button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }} onClick={() => nav('habits')}>Abrir Hábitos <KIcon name="arrow-right" size={12} /></button></div>
        <div className="kbv-habits-catalog">
          {habits.map(h => (
            <HabitCatalogCard key={h.id} h={h} onOpen={setOpenHabit} onEdit={setOpenHabit} onDelete={deleteHabit} />
          ))}
        </div>
      </div>

      {openReto && <RetoDetailModal reto={openReto} onClose={() => setOpenReto(null)} onUpdate={(r) => setRetos(rs => rs.map(x => x.id === r.id ? r : x))} onAbandon={(id) => { setRetos(rs => rs.filter(x => x.id !== id)); setOpenReto(null); }} />}
      {openHabit && <HabitDetailModal habit={openHabit} onClose={() => setOpenHabit(null)} onDelete={deleteHabit} onEdit={(h) => { setOpenHabit(null); setEditingHabit(h); }} />}
      {editingHabit && typeof CreateHabitModal === 'function' && <CreateHabitModal edit={editingHabit} onClose={() => setEditingHabit(null)} onSave={onSaveHabit} />}
      {confirmDialog}
    </>
  );
}

function AreaProjectsV3({ area, hier }) {
  const [openWill, setOpenWill] = React.useState(null); // {item, kind}
  const [openCourse, setOpenCourse] = React.useState(null);
  const [retos, setRetos] = React.useState(WILL_RETOS_V3);
  const [habitos, setHabitos] = React.useState(WILL_HABITOS_V3);

  // ——— Voluntad: retos y hábitos homologados con sus secciones (mismas tarjetas y modales) ———
  if (hier.kind === 'will') {
    return <AreaWillTab area={area} />;
  }

  // ——— Riqueza: indicadores financieros + metas con monto y % ———
  if (hier.kind === 'finance') {
    return (
      <>
        <div className="kbv-area-actnote"><KIcon name="alert" size={13} /><span>Riqueza se gestiona en <strong>Finanzas</strong>. No tiene tareas: aquí ves tus <strong>indicadores clave</strong> y el avance de cada meta financiera.</span></div>
        <div className="kbv-area-rollup">
          {FINANCE_KPIS_V3.map((k, i) => {
            const tone = PULSE_TONE[k.tone] || PULSE_TONE.neutral;
            return <div key={i} className="rollup-cell"><span className="ru-v" style={{ color: k.tone === 'bad' ? 'var(--kb-hp-ink)' : k.tone === 'good' ? 'var(--kb-good)' : undefined }}>{k.v}</span><span className="ru-l">{k.l}</span></div>;
          })}
        </div>
        <div className="kbv-area-feedback"><KIcon name="sparkle" size={14} /><span>Tu fondo de emergencia va al 78% — la meta más cercana a cerrarse. Prioriza esos $5.4K antes de acelerar el viaje 2026.</span></div>
        <div className="kbv-card kbv-char-card">
          <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Metas financieras <span className="kbv-meta">({FINANCE_GOALS_V3.length})</span></h3><button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }} onClick={() => nav('finanzas', { section: 'projects' })}>Abrir Finanzas <KIcon name="arrow-right" size={12} /></button></div>
          <div className="kbv-area-projlist">
            {FINANCE_GOALS_V3.map(g => (
              <button type="button" key={g.id} className="kbv-area-projcard" onClick={() => nav('finanzas', { project: g.id })} style={{ '--c': area.color }}>
                <span className="apc-ico"><KIcon name="wealth" size={15} /></span>
                <div className="apc-body">
                  <div className="apc-top"><span className="apc-name">{g.name}</span><span className="apc-amount">{g.amount} <small>/ {g.target}</small></span></div>
                  <div className="apc-bar"><span style={{ width: `${g.pct}%`, background: area.color }} /></div>
                </div>
                <span className="apc-pct">{g.pct}%</span>
              </button>
            ))}
          </div>
        </div>
      </>
    );
  }

  // ——— Sabiduría: cursos y materias separados, con detalle al tocar ———
  if (hier.kind === 'study') {
    const projs = (typeof DEMO_PROJECTS_FOR_FILTER !== 'undefined' ? DEMO_PROJECTS_FOR_FILTER : []).filter(p => p.area === area.id);
    const mk = (p, kind) => { const ts = tasksOfProject(p.id); const sc = statusCounts(ts); return { id: p.id, name: p.name, kind, pct: ts.length ? Math.round((sc.done / ts.length) * 100) : 0, counts: sc, total: ts.length }; };
    const materias = projs.filter(p => STUDY_MATERIA_IDS.includes(p.id)).map(p => mk(p, 'materia'));
    const cursos = projs.filter(p => !STUDY_MATERIA_IDS.includes(p.id)).map(p => mk(p, 'curso'));
    const all = [...materias, ...cursos];
    const sBlocked = all.reduce((a, it) => a + it.counts.blocked, 0);
    const sDoing = all.reduce((a, it) => a + it.counts.doing, 0);
    const sOpen = all.reduce((a, it) => a + it.counts.todo + it.counts.doing + it.counts.blocked, 0);
    const busy = [...all].sort((a, b) => (b.counts.todo + b.counts.doing) - (a.counts.todo + a.counts.doing))[0];

    const Card = (it) => (
      <button type="button" key={it.id} className="kbv-area-projcard" onClick={() => setOpenCourse(it)} style={{ '--c': it.kind === 'materia' ? 'var(--area-community)' : 'var(--kb-gem)' }}>
        <span className="apc-ico"><KIcon name={it.kind === 'materia' ? 'graduation' : 'layers'} size={15} /></span>
        <div className="apc-body">
          <div className="apc-top"><span className="apc-name">{it.name}</span><span className="apc-type">{it.kind === 'materia' ? 'Materia' : 'Curso'}</span></div>
          <span className="apc-meta">{it.total} tareas</span>
          <div className="apc-bar"><span style={{ width: `${it.pct}%`, background: it.kind === 'materia' ? 'var(--area-community)' : 'var(--kb-gem)' }} /></div>
          <div className="apc-status">
            <span className="st todo">{it.counts.todo} por hacer</span>
            <span className="st doing">{it.counts.doing} en curso</span>
            {it.counts.blocked > 0 && <span className="st blocked">{it.counts.blocked} bloqueada</span>}
            <span className="st done">{it.counts.done} hechas</span>
          </div>
        </div>
        <span className="apc-pct">{it.pct}%</span>
      </button>
    );

    return (
      <>
        <div className="kbv-area-actnote"><KIcon name="alert" size={13} /><span>De <strong>Sabiduría</strong> cuelgan <strong>materias</strong> (escuela formal) y <strong>cursos</strong> (autoaprendizaje); de cada uno, sus tareas. Toca uno para ver su detalle.</span></div>
        <div className="kbv-area-rollup">
          <div className="rollup-cell"><span className="ru-v">{all.length}</span><span className="ru-l">materias y cursos</span></div>
          <div className="rollup-cell"><span className="ru-v">{sOpen}</span><span className="ru-l">actividades abiertas</span></div>
          <div className="rollup-cell"><span className="ru-v" style={{ color: 'var(--pri-high)' }}>{sDoing}</span><span className="ru-l">en progreso</span></div>
          <div className="rollup-cell"><span className="ru-v" style={{ color: sBlocked ? 'var(--kb-hp)' : 'var(--kb-text)' }}>{sBlocked}</span><span className="ru-l">bloqueadas</span></div>
        </div>
        {busy && <div className="kbv-area-feedback"><KIcon name="sparkle" size={14} /><span>“{busy.name}” concentra el trabajo abierto. Cerrar ahí primero es lo que más mueve a Sabiduría.</span></div>}

        <div className="kbv-card kbv-char-card">
          <div className="kbv-study-section-head tight"><h3 className="kbv-h3"><KIcon name="graduation" size={13} style={{ color: 'var(--area-community)', verticalAlign: '-2px' }} /> Materias <span className="kbv-meta">({materias.length})</span></h3><button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }} onClick={() => nav('estudio', { area: area.id })}>Abrir Estudio <KIcon name="arrow-right" size={12} /></button></div>
          <div className="kbv-area-projlist">{materias.length ? materias.map(Card) : <span className="kbv-meta">Sin materias registradas.</span>}</div>
        </div>
        <div className="kbv-card kbv-char-card">
          <div className="kbv-study-section-head tight"><h3 className="kbv-h3"><KIcon name="layers" size={13} style={{ color: 'var(--kb-gem)', verticalAlign: '-2px' }} /> Cursos <span className="kbv-meta">({cursos.length})</span></h3><button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }} onClick={() => nav('estudio', { area: area.id })}>Abrir Estudio <KIcon name="arrow-right" size={12} /></button></div>
          <div className="kbv-area-projlist">{cursos.length ? cursos.map(Card) : <span className="kbv-meta">Sin cursos registrados.</span>}</div>
        </div>

        {openCourse && <CourseAreaModal item={openCourse} onClose={() => setOpenCourse(null)} />}
      </>
    );
  }

  // ——— Vigor · Comunidad · personalizadas (proyectos) ———
  let items = [];
  {
    const projs = DEMO_PROJECTS_BY_AREA[area.id] || [];
    items = projs.map(p => {
      const ts = tasksOfProject(p.id); const sc = statusCounts(ts);
      const total = ts.length || parseInt((p.tasks || '0/0').split('/')[1], 10) || 0;
      return { id: p.id, icon: 'layers', name: p.name, meta: `vence ${p.due}`, pct: p.progress, type: 'Proyecto', screen: 'projects', counts: sc, total };
    });
  }

  const totalOpen = items.reduce((a, it) => a + (it.counts ? (it.counts.todo + it.counts.doing + it.counts.blocked) : 0), 0);
  const totalDoing = items.reduce((a, it) => a + (it.counts ? it.counts.doing : 0), 0);
  const totalBlocked = items.reduce((a, it) => a + (it.counts ? it.counts.blocked : 0), 0);
  const busiest = items.filter(it => it.counts).sort((a, b) => (b.counts.todo + b.counts.doing + b.counts.blocked) - (a.counts.todo + a.counts.doing + a.counts.blocked))[0];
  const goLabel = hier.home ? `Abrir ${hier.home}` : 'Abrir Proyectos';
  const goScreen = hier.screen || 'projects';

  let feedback;
  if (totalBlocked > 0) feedback = `Tienes ${totalBlocked} tarea(s) bloqueada(s). Desbloquéalas primero: detienen el avance de toda el área.`;
  else if (busiest) feedback = `“${busiest.name}” concentra el trabajo abierto. Cerrar ahí primero es lo que más mueve a ${area.name}.`;
  else feedback = `Buen balance de carga en ${area.name}. Saca el siguiente del backlog cuando cierres lo activo.`;

  return (
    <>
      <div className="kbv-area-actnote"><KIcon name="alert" size={13} /><span>Jerarquía de <strong>{area.name}</strong>: {hier.label}. Aquí <strong>analizas</strong>; toca un elemento para abrirlo donde se ejecuta.</span></div>

      <div className="kbv-area-rollup">
        <div className="rollup-cell"><span className="ru-v">{items.length}</span><span className="ru-l">proyectos</span></div>
        <div className="rollup-cell"><span className="ru-v">{totalOpen}</span><span className="ru-l">actividades abiertas</span></div>
        <div className="rollup-cell"><span className="ru-v" style={{ color: 'var(--pri-high)' }}>{totalDoing}</span><span className="ru-l">en progreso</span></div>
        <div className="rollup-cell"><span className="ru-v" style={{ color: totalBlocked ? 'var(--kb-hp)' : 'var(--kb-text)' }}>{totalBlocked}</span><span className="ru-l">bloqueadas</span></div>
      </div>
      <div className="kbv-area-feedback"><KIcon name="sparkle" size={14} /><span>{feedback}</span></div>

      <div className="kbv-card kbv-char-card">
        <div className="kbv-study-section-head tight">
          <h3 className="kbv-h3">Proyectos <span className="kbv-meta">({items.length})</span></h3>
          <button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }} onClick={() => nav(goScreen, { area: area.id })}>{goLabel} <KIcon name="arrow-right" size={12} /></button>
        </div>
        <div className="kbv-area-projlist">
          {items.length ? items.map(it => (
            <button type="button" key={it.id} className="kbv-area-projcard" onClick={() => nav(it.screen, { area: area.id, project: it.id })} style={{ '--c': area.color }}>
              <span className="apc-ico"><KIcon name={it.icon} size={15} /></span>
              <div className="apc-body">
                <div className="apc-top"><span className="apc-name">{it.name}</span><span className="apc-type">{it.type}</span></div>
                <span className="apc-meta">{it.meta}</span>
                <div className="apc-bar"><span style={{ width: `${it.pct}%`, background: area.color }} /></div>
                {it.counts && (
                  <div className="apc-status">
                    <span className="st todo">{it.counts.todo} por hacer</span>
                    <span className="st doing">{it.counts.doing} en curso</span>
                    {it.counts.blocked > 0 && <span className="st blocked">{it.counts.blocked} bloqueada</span>}
                    <span className="st done">{it.counts.done} hechas</span>
                  </div>
                )}
              </div>
              <span className="apc-pct">{it.pct}%</span>
            </button>
          )) : <span className="kbv-meta">Aún no hay nada en esta área. Crea el primero para que empiece a subir.</span>}
        </div>
      </div>
    </>
  );
}

// ── Configuración de área — edición inline con guardar ──────────────────
const AREA_COLORS_V3 = ['var(--area-vigor)', 'var(--area-wisdom)', 'var(--kb-primary)', 'var(--kb-coin)', 'var(--pri-high)', 'var(--area-community)', 'var(--kb-hp)', 'var(--kb-gem)', 'var(--kb-good-soft)', 'var(--area-community)'];
const AREA_FONDOS_V3 = [
  { id: 0, label: 'Limpio' },
  { id: 1, label: 'Suave' },
  { id: 2, label: 'Intenso' },
];
function AreaConfigV3({ area, rules, hier, master, onSave }) {
  const isCustom = String(area.id).startsWith('custom-') || rules.editable === 'full';
  const canColorIcon = rules.editable === 'full' || rules.editable === 'icon-name-color';
  const prog = areaProg(area.id);
  const young = !master && prog.prestige === 0 && prog.level < 8;
  const palette = (typeof ICON_PALETTE !== 'undefined' ? ICON_PALETTE : ['sparkle', 'layers', 'flame', 'book', 'home', 'shop']);

  const [draft, setDraft] = React.useState({ name: area.name, desc: area.desc || '', glyph: area.glyph, color: area.color, bgTint: area.bgTint || 0, difficulty: area.difficulty || 2 });
  React.useEffect(() => { setDraft({ name: area.name, desc: area.desc || '', glyph: area.glyph, color: area.color, bgTint: area.bgTint || 0, difficulty: area.difficulty || 2 }); }, [area.id]);
  // Tope de cambios de dificultad por área — por defecto 3.
  const [changesLeft, setChangesLeft] = React.useState(area.difficultyChangesLeft != null ? area.difficultyChangesLeft : 3);
  React.useEffect(() => { setChangesLeft(area.difficultyChangesLeft != null ? area.difficultyChangesLeft : 3); }, [area.id]);
  const dirty = draft.name !== area.name || draft.desc !== (area.desc || '') || draft.glyph !== area.glyph || draft.color !== area.color || (draft.bgTint || 0) !== (area.bgTint || 0) || (draft.difficulty || 2) !== (area.difficulty || 2);
  function set(k, v) { setDraft(d => ({ ...d, [k]: v })); }
  function save() {
    if (!draft.name.trim()) return;
    const diffChanged = (rules.difficulty !== false) && (draft.difficulty || 2) !== (area.difficulty || 2);
    if (diffChanged && changesLeft <= 0) return; // sin cambios de dificultad disponibles
    const nextLeft = diffChanged ? Math.max(0, changesLeft - 1) : changesLeft;
    onSave && onSave({ ...area, name: draft.name.trim(), desc: draft.desc, glyph: draft.glyph, color: draft.color, bgTint: draft.bgTint, difficulty: draft.difficulty, difficultyChangesLeft: nextLeft });
    setChangesLeft(nextLeft);
  }
  const canDifficulty = rules.difficulty !== false;
  const diffs = (typeof DIFFICULTY_LEVELS !== 'undefined' ? DIFFICULTY_LEVELS : []);

  const childNode = hier.kind === 'will' ? 'Reto / Hábito' : hier.kind === 'study' ? 'Curso / Materia' : hier.kind === 'finance' ? 'Proyecto financiero' : 'Proyecto';
  const childIcon = hier.kind === 'will' ? 'flame' : hier.kind === 'finance' ? 'wealth' : 'layers';

  return (
    <>
      {/* Editor inline */}
      <div className="kbv-card kbv-char-card">
        <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Personalizar área</h3><span className="kbv-meta">{isCustom ? 'Área libre' : 'Área de vida fija'}</span></div>

        <div className="kbv-cfg-grid">
          <div className="kbv-form-row">
            <label>Nombre</label>
            <input type="text" value={draft.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          {isCustom && (
            <div className="kbv-form-row">
              <label>Descripción</label>
              <input type="text" value={draft.desc} onChange={(e) => set('desc', e.target.value)} placeholder="Qué cubre este frente de tu vida" />
            </div>
          )}
        </div>

        {canColorIcon ? (
          <>
            <div className="kbv-form-row" style={{ marginTop: 12 }}>
              <label>Ícono</label>
              <div className="kbv-cfg-icons">
                {palette.map(i => (
                  <button key={i} type="button" className={`cfg-ico ${draft.glyph === i ? 'on' : ''}`} style={{ '--c': draft.color }} onClick={() => set('glyph', i)}><KIcon name={i} size={17} /></button>
                ))}
              </div>
            </div>
            <div className="kbv-form-row" style={{ marginTop: 12 }}>
              <label>Color</label>
              <div className="kbv-cfg-colors">
                {AREA_COLORS_V3.map(c => (
                  <button key={c} type="button" className={`cfg-col ${draft.color === c ? 'on' : ''}`} style={{ background: c }} onClick={() => set('color', c)} title={c} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="kbv-meta" style={{ marginTop: 10 }}>El ícono y color de esta área de vida son fijos. Puedes ajustar su nombre y fondo.</p>
        )}

        <div className="kbv-form-row" style={{ marginTop: 12 }}>
          <label>Fondo del encabezado</label>
          <div className="kbv-cfg-fondos">
            {AREA_FONDOS_V3.map(f => (
              <button key={f.id} type="button" className={`cfg-fondo ${draft.bgTint === f.id ? 'on' : ''}`} onClick={() => set('bgTint', f.id)}
                style={{ background: f.id === 0 ? 'var(--kb-card)' : `color-mix(in oklab, ${draft.color} ${f.id * 9}%, var(--kb-card))`, borderColor: draft.bgTint === f.id ? draft.color : 'var(--kb-border)' }}>
                {f.label}
              </button>
            ))}
            {master && <span className="kbv-meta" style={{ alignSelf: 'center' }}>El contorno arcoíris de Maestro se mantiene siempre.</span>}
          </div>
        </div>

        {/* Dificultad — solo donde el área lo permite (personalizadas / Comunidad) */}
        {canDifficulty && (() => {
          const noChangesLeft = changesLeft <= 0;
          const diffPending = (draft.difficulty || 2) !== (area.difficulty || 2);
          const fixedLabel = (diffs.find(x => x.id === (area.difficulty || 2)) || {}).label || (area.difficulty || 2);
          return (
          <div className="kbv-form-row" style={{ marginTop: 12 }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Dificultad para subir de nivel <InfoDot text="Multiplica el XP que cuesta cada nivel. Más exigente = subir cuesta más, pero las recompensas pesan igual. El número de cambios es limitado para que sea una decisión meditada." /></label>
            <div className="kbv-cfg-diff">
              {diffs.map(d => {
                const locked = noChangesLeft && d.id !== (area.difficulty || 2);
                return (
                  <button key={d.id} type="button" className={`cfg-diff ${draft.difficulty === d.id ? 'on' : ''} ${locked ? 'locked' : ''}`} style={{ '--c': draft.color }} disabled={locked} onClick={() => !locked && set('difficulty', d.id)}>
                    <span className="cd-mult">×{d.mult}</span>
                    <span className="cd-lbl">{d.label}</span>
                    <span className="cd-desc">{d.desc}</span>
                  </button>
                );
              })}
            </div>
            {/* Paso: cuántos cambios de dificultad quedan disponibles (por defecto 3) */}
            <div className="kbv-diff-changes">
              <span className={`dc-pill ${noChangesLeft ? 'empty' : ''}`}>
                <KIcon name={noChangesLeft ? 'alert' : 'repeat'} size={12} />
                {noChangesLeft ? 'Sin cambios de dificultad disponibles' : <>Te quedan <strong>{changesLeft}</strong> de 3 cambios de dificultad</>}
              </span>
              {diffPending && !noChangesLeft && <span className="dc-note">Guardar este cambio usará <strong>1</strong> — quedarán {changesLeft - 1}.</span>}
              {noChangesLeft && <span className="dc-note">Alcanzaste el límite. La dificultad queda fija en «{fixedLabel}».</span>}
            </div>
          </div>
          );
        })()}

        <div className="kbv-cfg-actions">
          <button type="button" className="kbv-btn kbv-btn-primary" disabled={!dirty} onClick={save}><KIcon name="check" size={13} /> Guardar cambios</button>
          {dirty && <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => setDraft({ name: area.name, desc: area.desc || '', glyph: area.glyph, color: area.color, bgTint: area.bgTint || 0 })}>Descartar</button>}
          <span className="kbv-meta">{dirty ? 'Tienes cambios sin guardar.' : 'Todo guardado.'}</span>
        </div>
      </div>

      {/* Qué vive en esta área — diagrama de jerarquía */}
      <div className="kbv-card kbv-char-card">
        <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Qué vive en {area.name}</h3><span className="kbv-meta">jerarquía hacia abajo</span></div>
        <div className="kbv-hier-diagram" style={{ '--c': area.color }}>
          <div className="hd-node area"><span className="hd-ico"><KIcon name={area.glyph} size={18} /></span><span className="hd-l">Área</span><span className="hd-s">{area.name}</span></div>
          <span className="hd-link"><KIcon name="arrow-right" size={14} /></span>
          <div className="hd-node"><span className="hd-ico"><KIcon name={childIcon} size={18} /></span><span className="hd-l">{childNode}</span><span className="hd-s">{hier.kind === 'will' ? 'con fin / recurrente' : hier.home || 'Proyectos'}</span></div>
          {hier.kind !== 'will' && <><span className="hd-link"><KIcon name="arrow-right" size={14} /></span>
            <div className="hd-node"><span className="hd-ico"><KIcon name="check" size={18} /></span><span className="hd-l">Tarea</span><span className="hd-s">lo que haces y cierras</span></div></>}
        </div>
        <p className="kbv-body" style={{ fontSize: 12.5, margin: '10px 0 0' }}>
          {hier.kind === 'will'
            ? <><strong>{area.name}</strong> no usa proyectos: lo que cuelga del área son <strong>retos</strong> (con fin) y <strong>hábitos</strong> (recurrentes). Ahí está su progreso.</>
            : <>De <strong>{area.name}</strong> cuelgan <strong>{hier.label.toLowerCase()}</strong>, y de cada uno, sus <strong>tareas</strong>. Se gestiona en {hier.home || 'Proyectos'} y se analiza aquí.</>}
        </p>
      </div>

      {young && (
        <div className="kbv-area-feedback"><KIcon name="sparkle" size={14} /><span>Esta área lleva poco tiempo: su proyección se ve acotada al inicio. Conforme registres proyectos y cierres tareas, su tendencia y ranking toman forma y se comparan de igual a igual con las consolidadas.</span></div>
      )}

      {isCustom && (
        <div className="kbv-card kbv-char-card">
          <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Cómo funcionan las áreas personalizadas</h3></div>
          <ol className="kbv-area-howto">
            <li><strong>5 áreas base</strong> incluidas; las extra ocupan un <strong>slot que se compra con materia oscura</strong> — a propósito tiene costo para decidir con intención.</li>
            <li><strong>Misma jerarquía y progresión:</strong> 5 prestigios × 50 niveles, hasta Maestro (infinito), igual que las base.</li>
            <li><strong>Dificultad ajustable</strong> — defines cuánto XP cuesta cada nivel.</li>
            <li><strong>Análisis aquí, ejecución en su módulo.</strong></li>
          </ol>
        </div>
      )}
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════
// ORQUESTADOR
// ════════════════════════════════════════════════════════════════════════
function AreasScreenV3({ hero, stats, onNavigate, navDetail }) {
  const orderedIds = hero?.areas || ['vigor', 'wisdom', 'wealth', 'community', 'will'];
  const [areas, setAreas] = React.useState(() => orderedIds.map(id => KIBO_AREAS_V2.find(a => a.id === id)).filter(Boolean));
  const [view, setView] = React.useState('general');
  const [editingArea, setEditingArea] = React.useState(null);
  const [createOpen, setCreateOpen] = React.useState(false);

  const [subTab, setSubTab] = React.useState(null);
  React.useEffect(() => {
    if (!navDetail) return;
    // Igual que en Proyectos: con destino entra al área, sin destino vuelve al
    // panorama. Volver desde el menú a la propia pantalla es una navegación.
    if (navDetail.area) setView(navDetail.area);
    else { setView('general'); setSubTab(null); }
    if (navDetail.tab) setSubTab(navDetail.tab);
  }, [navDetail]);

  const [askArea, areaConfirmDialog] = useConfirm();
  function onSaveArea(updated) { setAreas(as => as.map(a => a.id === updated.id ? updated : a)); }
  function onDeleteArea(area) {
    askArea({
      title: `Quitar «${area.name}»`,
      message: 'Los proyectos asociados quedarán sin área, pero no se borran.',
      confirmLabel: 'Sí, quitar área',
      onConfirm: () => { setAreas(as => as.filter(a => a.id !== area.id)); setView('general'); },
    });
  }
  function onCreateArea(data) {
    const id = 'custom-' + Math.random().toString(36).slice(2, 6);
    setAreas(as => [...as, { id, name: data.name, desc: data.desc, color: data.color, glyph: data.glyph, difficulty: data.difficulty }]);
  }

  const current = view !== 'general' ? areas.find(a => a.id === view) : null;

  return (
    <div className="kbv-main">
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--kb-primary)', display: 'block' }}>Áreas · Centro de análisis</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>
            Áreas.
            <InfoDot text="Analiza cada frente de tu vida y salta a donde se hace el trabajo. Jerarquía: Área → Proyecto → Tarea (en Voluntad: Reto/Hábito). Aquí solo analizas; la ejecución vive en cada módulo." />
          </h1>
        </div>
      </div>

      {view === 'general' || !current
        ? <AreasGeneralV3 areas={areas} onOpen={(id) => setView(id)} />
        : <AreaDetailV3 key={current.id + ':' + (subTab || '')} area={current} areas={areas} initialTab={subTab}
                        onBack={() => { setSubTab(null); setView('general'); }} onSave={onSaveArea} />}

      {view === 'general' && (
        <div style={{ marginTop: 10 }}>
          {typeof BuyAreaSlotCard === 'function' &&
            <BuyAreaSlotCard price={200} balance={parseInt(stats && stats.gems, 10) || 0}
                             owned={areas.length} onBuy={() => setCreateOpen(true)} />}
        </div>
      )}

      {editingArea && typeof EditAreaModal === 'function' && (
        <EditAreaModal area={editingArea} onClose={() => setEditingArea(null)} onSave={onSaveArea} />
      )}
      {areaConfirmDialog}
      {createOpen && typeof CreateAreaModal === 'function' && (
        <CreateAreaModal onClose={() => setCreateOpen(false)} onSave={onCreateArea} price={200} />
      )}
    </div>
  );
}

Object.assign(window, { AreasScreenV3, AreaDetailV3, AreasGeneralV3, AreaProjectsV3, AreaConfigV3, AreaRankPanel });
