// estudio-screen.jsx — Estudio como módulo amplio de gestión académica.
// Inspirado en el módulo Finanzas: pestañas para Foco, Cursos, Agenda y
// Trayectoria. Reutiliza POMODORO_PRESETS, STUDY_COURSES y CreateCourseModal
// (definidos en personal-screens.jsx, scope global).

// ── Demo data ────────────────────────────────────────────────
const STUDY_BACKLOG = [
  { id: 'bk1', name: 'Rust desde cero',            platform: 'Plan propio', why: 'Para proyectos de performance', priority: 'alta', kind: 'online', interest: 4, prereq: 'C / punteros' },
  { id: 'bk2', name: 'Estadística para ML',         platform: 'Khan / libro', why: 'Base que me falta para ML', priority: 'alta', kind: 'project', interest: 5, linkedTo: 'c3' },
  { id: 'bk3', name: 'Diseño de producto',          platform: 'Reforge',     why: 'Crecer hacia PM técnico', priority: 'media', kind: 'online', interest: 3 },
  { id: 'bk4', name: 'Inglés C2 · writing',         platform: 'Tutor',       why: 'Escritura más clara', priority: 'baja', kind: 'formal', interest: 2 },
  { id: 'bk5', name: 'Finanzas personales avanzado','platform': 'Libro',     why: 'Invertir mejor', priority: 'media', kind: 'project', interest: 3 },
];

const STUDY_SCHEDULE = [
  { day: 'Lun', blocks: [{ t: '07:00', subject: 'Lectura técnica', color: 'var(--kb-gem)', kind: 'auto' }, { t: '20:00', subject: 'System Design', color: '#2D4A3A', kind: 'curso' }] },
  { day: 'Mar', blocks: [{ t: '19:00', subject: 'Cálculo II (uni)', color: 'var(--area-community)', kind: 'clase' }] },
  { day: 'Mié', blocks: [{ t: '07:00', subject: 'Lectura técnica', color: 'var(--kb-gem)', kind: 'auto' }, { t: '20:00', subject: 'SwiftUI', color: '#98CA3F', kind: 'curso' }] },
  { day: 'Jue', blocks: [{ t: '19:00', subject: 'Cálculo II (uni)', color: 'var(--area-community)', kind: 'clase' }] },
  { day: 'Vie', blocks: [{ t: '18:00', subject: 'ML Specialization', color: '#0056D2', kind: 'curso' }] },
  { day: 'Sáb', blocks: [{ t: '10:00', subject: 'Proyecto personal', color: 'var(--kb-primary)', kind: 'proyecto' }] },
  { day: 'Dom', blocks: [] },
];

const STUDY_DEADLINES = [
  { id: 'dl1', title: 'Entrega: Tarea 4 — Cálculo II', course: 'Cálculo II', type: 'entrega', date: '30 May', dleft: 1, done: false },
  { id: 'dl2', title: 'Examen parcial — Cálculo II', course: 'Cálculo II', type: 'examen', date: '06 Jun', dleft: 8, done: false },
  { id: 'dl3', title: 'Proyecto final — System Design', course: 'System Design', type: 'proyecto', date: '20 Jun', dleft: 22, done: false },
  { id: 'dl4', title: 'Quiz semana 3 — ML', course: 'ML Specialization', type: 'examen', date: '02 Jun', dleft: 4, done: false },
  { id: 'dl5', title: 'Entrega: ensayo — Inglés', course: 'Inglés C2', type: 'entrega', date: '28 May', dleft: 0, done: true },
];

const DEADLINE_TYPE = {
  entrega:  { label: 'Entrega', color: 'var(--kb-gem)', icon: 'upload' },
  examen:   { label: 'Examen',  color: 'var(--kb-hp)', icon: 'edit' },
  proyecto: { label: 'Proyecto',color: 'var(--kb-primary)', icon: 'layers' },
};

const STUDY_EVALS = [
  { course: 'Cálculo II', color: 'var(--area-community)', items: [{ name: 'Exámenes', weight: 50, grade: 88 }, { name: 'Tareas', weight: 30, grade: 95 }, { name: 'Proyecto', weight: 20, grade: null }] },
  { course: 'System Design', color: '#2D4A3A', items: [{ name: 'Proyecto final', weight: 60, grade: null }, { name: 'Ejercicios', weight: 40, grade: 90 }] },
];

const STUDY_PROFESSORS = [
  { id: 'pr1', name: 'Dra. Elena Ríos',  subject: 'Cálculo II', school: 'UNAM', rating: 5 },
  { id: 'pr2', name: 'Mtro. Juan Pérez',  subject: 'Álgebra lineal', school: 'UNAM', rating: 4 },
  { id: 'pr3', name: 'Alexander (Educative)', subject: 'System Design', school: 'Educative', rating: 5 },
  { id: 'pr4', name: 'Andrew Ng', subject: 'Machine Learning', school: 'Coursera', rating: 5 },
];

const STUDY_SCHOOLS = [
  { id: 'sc1', name: 'UNAM · Fac. Ingeniería', kind: 'Universidad', period: '2014 – 2019', status: 'Titulado' },
  { id: 'sc2', name: 'Platzi', kind: 'Plataforma', period: '2020 – hoy', status: 'Activo' },
  { id: 'sc3', name: 'Coursera', kind: 'Plataforma', period: '2021 – hoy', status: 'Activo' },
  { id: 'sc4', name: 'Educative', kind: 'Plataforma', period: '2026 – hoy', status: 'Activo' },
];

// ── KPI animado: XP → niveles → periodo ──────────────────────
function AnimatedWisdomKpi() {
  const lvl = (typeof AREA_LEVELS_V2 !== 'undefined' && AREA_LEVELS_V2.wisdom) ? AREA_LEVELS_V2.wisdom : { level: 6 };
  const xpGain = 1080;
  const levelsGain = 2;
  const [phase, setPhase] = React.useState(0); // 0: xp, 1: niveles
  React.useEffect(() => {
    const id = setInterval(() => setPhase(p => (p + 1) % 2), 3200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="kbv-kpi anim" style={{ '--c': 'var(--area-community)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className="label">XP en Sabiduría</span>
        <span className="kbv-kpi-icon pulse" style={{ '--c': 'var(--area-community)' }}><KIcon name="wisdom" size={14} /></span>
      </div>
      <div className="kbv-kpi-anim-stack">
        <div className={`slot ${phase === 0 ? 'in' : 'out'}`}>
          <span className="val" style={{ color: 'var(--area-community)' }}>+{xpGain.toLocaleString('es-MX')}</span>
          <span className="delta up">en los últimos 30 días</span>
        </div>
        <div className={`slot ${phase === 1 ? 'in' : 'out'}`}>
          <span className="val" style={{ color: 'var(--area-community)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <KIcon name="trending-up" size={18} /> +{levelsGain} niv.
          </span>
          <span className="delta up">Sabiduría · Nv. {lvl.level} en 30 días</span>
        </div>
      </div>
    </div>
  );
}

function KiboStudyRec({ inProgress, backlogCount }) {
  const [open, setOpen] = React.useState(false);
  let rec;
  if (inProgress >= 4) {
    rec = { tone: 'warn', title: 'Estás disperso en demasiados frentes', body: `Tienes ${inProgress} cursos en curso a la vez. Enfócate: elige 2 para cerrarlos este mes y manda el resto al backlog. Terminar pesa más que empezar — y tu XP de Sabiduría se dispara al completar.` };
  } else if (inProgress === 0) {
    rec = { tone: 'ok', title: 'Bandeja limpia', body: `No tienes cursos activos. Saca uno de tus ${backlogCount} del backlog, ponle un horario y arranca con un Pomodoro.` };
  } else {
    rec = { tone: 'ok', title: 'Buen nivel de foco', body: `${inProgress} curso(s) en curso — un número sano. Mantén el ritmo, registra tus sesiones y cuando cierres uno saca el siguiente del backlog.` };
  }
  return (
    <div className={`kbv-study-rec collapsible ${rec.tone} ${open ? 'open' : ''}`}>
      {typeof KiboMascot === 'function' ? <KiboMascot size={40} mood={rec.tone === 'warn' ? 'thinking' : 'happy'} /> : <span className="kbv-study-rec-glyph"><KIcon name="sparkle" size={18} /></span>}
      <div className="rec-body">
        <span className="rec-from">Kibo · recomendación</span>
        <strong>{rec.title}</strong>
        {open && <p>{rec.body}</p>}
      </div>
      <button type="button" className="rec-toggle" onClick={() => setOpen(o => !o)}>
        {open ? 'Ocultar' : 'Ver'}
      </button>
    </div>
  );
}

// ── Widget de música: enlaza a tu plataforma (no reproduce audio real) ──
const FOCUS_PLATFORMS = {
  spotify: { label: 'Spotify',      c: '#1ED760', url: 'https://open.spotify.com/genre/focus' },
  ytm:     { label: 'YouTube Music', c: '#FF4E45', url: 'https://music.youtube.com/search?q=focus' },
  apple:   { label: 'Apple Music',  c: '#FA2D48', url: 'https://music.apple.com/us/room/focus' },
};
const FOCUS_PLAYLISTS = [
  { t: 'Deep Focus',      a: 'Instrumental · sin letra', art: 'linear-gradient(135deg,#3B7D8C,#1B3A45)' },
  { t: 'Lo-fi beats',     a: 'Chill para estudiar',      art: 'linear-gradient(135deg,#6E5BA8,#2E2350)' },
  { t: 'Ambient / nature',a: 'Lluvia y ruido blanco',     art: 'linear-gradient(135deg,#4C7A5B,#1F3A2A)' },
  { t: 'Clásica para concentrarse', a: 'Piano y cuerdas', art: 'linear-gradient(135deg,#C68A4E,#6E4423)' },
];
function FocusMusicWidget() {
  const [plat, setPlat] = React.useState('spotify');
  const [i, setI] = React.useState(0);
  const p = FOCUS_PLATFORMS[plat];
  const pl = FOCUS_PLAYLISTS[i];
  return (
    <div className={`kbv-read-music ${plat === 'spotify' ? 'spotify' : 'ytm'}`} style={{ marginTop: 4 }}>
      <div className="rm-head">
        <span className="rm-title"><KIcon name="headphones" size={13} /> Música para concentrarte</span>
        <div className="rm-src">
          {Object.entries(FOCUS_PLATFORMS).map(([k, v]) => (
            <button key={k} type="button" className={plat === k ? 'on' : ''} onClick={() => setPlat(k)}>{v.label}</button>
          ))}
        </div>
      </div>
      <div className="rm-now">
        <div className="rm-art" style={{ background: pl.art }}><span className="rm-eq"><i /><i /><i /><i /></span></div>
        <div className="rm-info">
          <span className="rm-track">{pl.t}</span>
          <span className="rm-artist">{pl.a}</span>
        </div>
        <div className="rm-ctrl">
          <button type="button" onClick={() => setI(n => (n - 1 + FOCUS_PLAYLISTS.length) % FOCUS_PLAYLISTS.length)} title="Anterior"><KIcon name="arrow-left" size={14} /></button>
          <button type="button" onClick={() => setI(n => (n + 1) % FOCUS_PLAYLISTS.length)} title="Siguiente"><KIcon name="arrow-right" size={14} /></button>
        </div>
      </div>
      <a className="rm-open" href={p.url} target="_blank" rel="noopener noreferrer" style={{ '--pc': p.c }}>
        <KIcon name="arrow-right" size={13} /> Abrir “{pl.t}” en {p.label}
      </a>
      <span className="rm-foot">La reproducción ocurre en {p.label} · Kibo solo te lleva ahí. No suma a tu tiempo de foco.</span>
    </div>
  );
}

// ── Pestaña: Foco (Pomodoro + KPIs con periodo) ──────────────
function EstudioFoco({ courses }) {
  const [preset, setPreset] = React.useState('classic');
  const [custom, setCustom] = React.useState({ work: 30, short: 6, long: 20, cycles: 4 });
  const [sound, setSound] = React.useState(true);
  const [running, setRunning] = React.useState(false);
  const [phase, setPhase] = React.useState('work');
  const [secs, setSecs] = React.useState(25 * 60);
  const [cycle, setCycle] = React.useState(1);
  const [awaiting, setAwaiting] = React.useState(null); // próxima fase pendiente de confirmar
  const [idleMsg, setIdleMsg] = React.useState('');
  const [bg, setBg] = React.useState('none'); // música de fondo
  const [activeCourseId, setActiveCourseId] = React.useState(courses[0] ? courses[0].id : '');

  const presetDef = preset === 'custom'
    ? { id: 'custom', label: 'Personalizado', work: custom.work, short: custom.short, long: custom.long, cycles: custom.cycles }
    : POMODORO_PRESETS.find(p => p.id === preset);

  function beep() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      const ctx = new AC(); const o = ctx.createOscillator(); const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination); o.frequency.value = 660; o.type = 'sine';
      g.gain.setValueAtTime(0.0001, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5); o.start(); o.stop(ctx.currentTime + 0.5);
    } catch (_) {}
  }
  React.useEffect(() => {
    if (!running) return;
    if (secs <= 0) { setRunning(false); return; }
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running, secs]);
  // Fin de fase → pedir confirmación (verifica que sigues en foco)
  React.useEffect(() => {
    if (running && secs === 0) {
      setRunning(false);
      if (sound) beep();
      const next = phase === 'work' ? (cycle >= presetDef.cycles ? 'long' : 'short') : 'work';
      setAwaiting(next);
      setIdleMsg('');
    }
  }, [secs, running]);
  // Si no confirmas en 20 min, la sesión NO se registra
  React.useEffect(() => {
    if (!awaiting) return;
    const id = setTimeout(() => { setAwaiting(null); reset(); setIdleMsg('Sesión no registrada: pasaron más de 20 min sin confirmar que seguías en foco.'); }, 20 * 60 * 1000);
    return () => clearTimeout(id);
  }, [awaiting]);
  function confirmNext() {
    const next = awaiting;
    setAwaiting(null); setIdleMsg('');
    setPhase(next);
    setSecs((next === 'work' ? presetDef.work : next === 'short' ? presetDef.short : presetDef.long) * 60);
    if (next === 'work') setCycle(c => c + 1);
    setRunning(true);
  }
  function stopHere() { setAwaiting(null); setRunning(false); }
  React.useEffect(() => { setSecs(presetDef.work * 60); setPhase('work'); setCycle(1); setRunning(false); setAwaiting(null); }, [preset, custom.work]);

  const phaseDuration = phase === 'work' ? presetDef.work * 60 : phase === 'short' ? presetDef.short * 60 : presetDef.long * 60;
  const phasePct = phaseDuration > 0 ? ((phaseDuration - secs) / phaseDuration) * 100 : 100;
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  function skipPhase() {
    if (phase === 'work') { if (cycle >= presetDef.cycles) { setPhase('long'); setSecs(presetDef.long * 60); } else { setPhase('short'); setSecs(presetDef.short * 60); } }
    else { setPhase('work'); setSecs(presetDef.work * 60); setCycle(c => c + 1); }
  }
  function reset() { setRunning(false); setPhase('work'); setSecs(presetDef.work * 60); setCycle(1); }
  const activeCourse = courses.find(c => c.id === activeCourseId);
  const inProgress = courses.filter(c => !c.done).length;

  return (
    <>
      {/* KPIs con periodo explícito */}
      <div className="kbv-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="kbv-kpi" style={{ '--c': 'var(--area-wisdom)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="label">Pomodoros · hoy</span>
            <span className="kbv-kpi-icon pulse" style={{ '--c': 'var(--area-wisdom)' }}><KIcon name="clock" size={14} /></span>
          </div>
          <span className="val">4</span>
          <span className="delta up">100 min en foco hoy</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-gem)' }}>
          <span className="label">Horas en foco · 7 días</span>
          <span className="val">9.4<small> h</small></span>
          <span className="delta">vs 7.1 h la semana previa</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-hp)' }}>
          <span className="label">Racha de estudio</span>
          <span className="val">9<small> días</small></span>
          <span className="delta">récord 14 · al hilo</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="label">Foco completado · hoy</span>
            <span className="kbv-kpi-icon" style={{ '--c': 'var(--kb-primary)' }}><KIcon name="check" size={14} /></span>
          </div>
          <span className="val">87<small>%</small></span>
          <span className="delta up">fases confirmadas sin abandono</span>
        </div>
      </div>

      {/* Pomodoro hero */}
      <div className="kbv-pomodoro">
        <div className="ring-wrap" style={{ '--phase-c': phase === 'work' ? 'var(--area-wisdom)' : phase === 'short' ? 'var(--kb-gem)' : 'var(--kb-primary)' }}>
          <svg viewBox="0 0 200 200" width="200" height="200">
            <circle cx="100" cy="100" r="86" fill="none" stroke="var(--kb-surface-2)" strokeWidth="12" />
            <circle cx="100" cy="100" r="86" fill="none" stroke="var(--phase-c)" strokeWidth="12" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 86 * (phasePct / 100)} ${2 * Math.PI * 86}`} transform="rotate(-90 100 100)" />
          </svg>
          <div className="time-stack">
            <span className="phase">{phase === 'work' ? 'FOCO' : phase === 'short' ? 'DESCANSO' : 'PAUSA LARGA'}</span>
            <span className="time">{mm}:{ss}</span>
            <span className="cycle">Ciclo {cycle}/{presetDef.cycles}</span>
          </div>
          {awaiting && (
            <div className="pomo-confirm">
              <span className="pc-q">Fase terminada · ¿iniciar {awaiting === 'work' ? 'FOCO' : awaiting === 'short' ? 'DESCANSO' : 'PAUSA LARGA'}?</span>
              <div className="pc-btns">
                <button type="button" className="kbv-btn kbv-btn-primary" onClick={confirmNext}>Continuar</button>
                <button type="button" className="kbv-btn kbv-btn-ghost" onClick={stopHere}>Terminar</button>
              </div>
              <span className="pc-note">Confirma para registrar · sin acción en 20 min se descarta</span>
            </div>
          )}
        </div>
        <div className="pomo-side">
          <div>
            <span className="kbv-eyebrow">Pomodoro · ligado a (opcional)</span>
            <h3 className="kbv-h3" style={{ marginTop: 4 }}>{activeCourse ? activeCourse.name : 'Foco libre · sin vincular'}</h3>
            {activeCourse && <span className="kbv-meta">{activeCourse.platform} · {activeCourse.skill}</span>}
          </div>
          <div className="kbv-form-row" style={{ margin: 0 }}>
            <label>Vincular a (opcional)</label>
            <select value={activeCourseId} onChange={(e) => setActiveCourseId(e.target.value)}>
              <option value="">Sin vincular · foco libre</option>
              <optgroup label="Cursos">
                {courses.filter(c => !c.done).map(c => <option key={c.id} value={c.id}>{c.name} — {c.platform}</option>)}
              </optgroup>
            </select>
          </div>
          <div>
            <span className="kbv-meta" style={{ display: 'block', marginBottom: 6 }}>PRESET POMODORO · o personalízalo</span>
            <div className="preset-grid">
              {POMODORO_PRESETS.map(p => (
                <button key={p.id} type="button" className={`preset-card ${preset === p.id ? 'on' : ''}`} onClick={() => setPreset(p.id)}>
                  <span className="lbl">{p.label}</span>
                  <span className="vals">{p.work}m · {p.short}/{p.long}m</span>
                </button>
              ))}
              <button type="button" className={`preset-card ${preset === 'custom' ? 'on' : ''}`} onClick={() => setPreset('custom')}>
                <span className="lbl">Personalizado</span>
                <span className="vals">tú defines</span>
              </button>
            </div>
            {preset === 'custom' && (
              <div className="pomo-custom">
                {[['work', 'Foco'], ['short', 'Descanso'], ['long', 'Pausa larga'], ['cycles', 'Ciclos']].map(([k, l]) => (
                  <label key={k} className="pc-field">
                    <span>{l}{k !== 'cycles' ? ' (min)' : ''}</span>
                    <input type="number" min="1" value={custom[k]} onChange={(e) => setCustom(c => ({ ...c, [k]: Math.max(1, parseInt(e.target.value || '1', 10)) }))} />
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="controls">
            <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => setRunning(r => !r)} disabled={!!awaiting}>
              <KIcon name={running ? 'square' : 'play'} size={14} /> {running ? 'Pausar' : 'Iniciar'}
            </button>
            <button type="button" className="kbv-btn kbv-btn-secondary" onClick={skipPhase} disabled={!!awaiting}><KIcon name="arrow-right" size={14} /> Saltar fase</button>
            <button type="button" className="kbv-btn kbv-btn-ghost" onClick={reset}>Reset</button>
          </div>
          <div className="pomo-extras">
            <button type="button" className={`pomo-toggle ${sound ? 'on' : ''}`} onClick={() => setSound(s => !s)}>
              <KIcon name="alert" size={12} /> Sonido {sound ? 'on' : 'off'}
            </button>
            {activeCourse && <span className="pomo-link"><KIcon name="graduation" size={11} /> {activeCourse.platform}{activeCourse.url ? ` · ${activeCourse.url}` : ''}</span>}
          </div>
          <FocusMusicWidget />
          {idleMsg && <div className="notif-strip warn"><KIcon name="alert" size={12} /><span>{idleMsg}</span></div>}
          <div className="notif-strip"><KIcon name="alert" size={12} /><span>Al terminar cada fase te pedimos confirmar que sigues en foco. Sin confirmar en 20 min, la sesión no se registra.</span></div>
        </div>
      </div>
    </>
  );
}

// ── Escuela formal: semestres, materias, calificaciones en vivo, materiales ──
const SCHOOL_SEMESTER = { name: '2026-1 · Primavera', school: 'UNAM · Fac. Ingeniería', start: '2026-02-03', end: '2026-06-12', credits: 32 };
const SCHOOL_SUBJECTS = [
  {
    id: 'm1', name: 'Cálculo II', professor: 'Dra. Elena Ríos', modality: 'presencial', credits: 8, color: 'var(--area-community)',
    schedule: 'Mar/Jue 19:00', room: 'Aula 204',
    evals: [{ name: 'Exámenes', weight: 50, grade: 88 }, { name: 'Tareas', weight: 30, grade: 95 }, { name: 'Proyecto', weight: 20, grade: null }],
    materials: [{ name: 'Cálculo · Stewart (libro)', cost: 890 }, { name: 'Calculadora TI-84', cost: 1850 }],
  },
  {
    id: 'm2', name: 'Álgebra lineal', professor: 'Mtro. Juan Pérez', modality: 'híbrida', credits: 8, color: 'var(--kb-gem)',
    schedule: 'Lun/Mié 17:00', room: 'Aula 110 / Zoom',
    evals: [{ name: 'Parciales', weight: 60, grade: 79 }, { name: 'Quizzes', weight: 40, grade: 84 }],
    materials: [{ name: 'Apuntes impresos', cost: 220 }],
  },
  {
    id: 'm3', name: 'Bases de datos', professor: 'Dra. M. Soto', modality: 'en línea', credits: 6, color: 'var(--kb-primary)',
    schedule: 'Vie 16:00', room: 'Campus virtual',
    evals: [{ name: 'Proyecto final', weight: 50, grade: null }, { name: 'Prácticas', weight: 50, grade: 92 }],
    materials: [],
  },
];
const MODALITY_PILL = { presencial: { l: 'Presencial', c: 'var(--kb-hp)' }, 'en línea': { l: 'En línea', c: 'var(--kb-gem)' }, híbrida: { l: 'Híbrida', c: 'var(--area-community)' } };

function subjectGrade(s) {
  const gradedWeight = s.evals.reduce((a, e) => a + (e.grade != null ? e.weight : 0), 0);
  const score = s.evals.reduce((a, e) => a + (e.grade != null ? e.grade * e.weight / 100 : 0), 0);
  return { score: Math.round(score), gradedWeight, projected: gradedWeight ? Math.round(score / gradedWeight * 100) : null };
}

function EstudioEscuela() {
  const subjects = SCHOOL_SUBJECTS;
  const totalCost = subjects.reduce((a, s) => a + s.materials.reduce((x, m) => x + m.cost, 0), 0);
  const graded = subjects.map(subjectGrade).filter(g => g.projected != null);
  const avg = graded.length ? Math.round(graded.reduce((a, g) => a + g.projected, 0) / graded.length) : null;
  const today = new Date('2026-05-29');
  const start = new Date(SCHOOL_SEMESTER.start), end = new Date(SCHOOL_SEMESTER.end);
  const pct = Math.max(0, Math.min(100, Math.round((today - start) / (end - start) * 100)));
  return (
    <>
      <div className="kbv-study-rec ok" style={{ marginBottom: 4 }}>
        <span className="kbv-study-rec-glyph"><KIcon name="graduation" size={20} /></span>
        <div className="rec-body">
          <span className="rec-from">Escuela formal</span>
          <strong>Tu semestre, materia por materia.</strong>
          <p>La escuela formal funciona distinto a un curso suelto: tiene <strong>semestre con fechas</strong>, materias <strong>presenciales/híbridas</strong>, <strong>métodos de evaluación por profesor</strong>, <strong>materiales con costo</strong> y <strong>calificaciones en vivo</strong>. Registra todo aquí para llevar tu promedio al día.</p>
        </div>
      </div>

      {/* Semestre actual */}
      <div className="kbv-semester-card">
        <div className="sem-info">
          <span className="kbv-eyebrow">{SCHOOL_SEMESTER.school}</span>
          <h3 className="kbv-h3" style={{ marginTop: 2 }}>{SCHOOL_SEMESTER.name}</h3>
          <span className="kbv-meta">{SCHOOL_SEMESTER.start} → {SCHOOL_SEMESTER.end} · {SCHOOL_SEMESTER.credits} créditos · {subjects.length} materias</span>
          <div className="sem-bar"><span style={{ width: `${pct}%` }} /></div>
          <span className="kbv-meta">{pct}% del semestre transcurrido</span>
        </div>
        <div className="sem-stats">
          <div className="ss-cell"><span className="ss-v">{avg != null ? avg : '—'}</span><span className="ss-l">promedio en vivo</span></div>
          <div className="ss-cell"><span className="ss-v">${totalCost.toLocaleString('es-MX')}</span><span className="ss-l">invertido en material</span></div>
        </div>
      </div>

      <SectionHead title="Materias" meta={`${subjects.length} registradas`}>
        <button type="button" className="kbv-btn kbv-btn-primary" style={{ padding: '8px 12px', fontSize: 13 }}><KIcon name="plus" size={13} /> Agregar materia</button>
      </SectionHead>
      <div className="kbv-subjects-grid">
        {subjects.map(s => {
          const g = subjectGrade(s);
          const mat = s.materials.reduce((a, m) => a + m.cost, 0);
          const mod = MODALITY_PILL[s.modality] || { l: s.modality, c: 'var(--kb-text-3)' };
          return (
            <div key={s.id} className="kbv-subject-card" style={{ '--c': s.color }}>
              <div className="subj-head">
                <div className="subj-id">
                  <span className="subj-name">{s.name}</span>
                  <span className="subj-prof"><KIcon name="community" size={10} /> {s.professor}</span>
                </div>
                <span className="subj-grade">{g.projected != null ? g.projected : '—'}<small>/100</small></span>
              </div>
              <div className="subj-meta">
                <span className="subj-pill" style={{ '--mc': mod.c }}>{mod.l}</span>
                <span className="subj-tag">{s.credits} créd.</span>
                <span className="subj-tag"><KIcon name="clock" size={9} /> {s.schedule}</span>
                <span className="subj-tag">{s.room}</span>
              </div>
              <div className="subj-evals">
                <span className="kbv-meta">Evaluación ({g.gradedWeight}% calificado)</span>
                {s.evals.map((e, i) => (
                  <div key={i} className="subj-eval-row">
                    <span className="se-name">{e.name}</span>
                    <span className="se-weight">{e.weight}%</span>
                    <span className={`se-grade ${e.grade == null ? 'pend' : ''}`}>{e.grade != null ? e.grade : 'pend.'}</span>
                  </div>
                ))}
              </div>
              <div className="subj-materials">
                <span className="kbv-meta">Material {mat > 0 ? `· $${mat.toLocaleString('es-MX')}` : '· sin costo'}</span>
                {s.materials.length === 0 ? <span className="sm-none">Sin material registrado</span> : s.materials.map((m, i) => (
                  <div key={i} className="sm-row"><span>{m.name}</span><span className="sm-cost">${m.cost.toLocaleString('es-MX')}</span></div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── Pestaña: Cursos (catálogo + backlog/plan de carrera) ─────
// Mapa curso → proyecto filtrable en Tareas (mismo id que DEMO_PROJECTS_FOR_FILTER).
const COURSE_TO_PROJECT = { c1: 'system-design', c2: 'swiftui', c3: 'ml-spec', c6: 'calculo-2' };

function CourseCard({ c, onClick }) {
  const projectId = COURSE_TO_PROJECT[c.id] || c.id;
  return (
    <div className={`kbv-course-card ${c.done ? 'done' : ''}`} style={{ '--c': c.color }} onClick={onClick}>
      <div className="top">
        <span className="ico"><KIcon name={c.icon} size={18} /></span>
        <div className="info">
          <div className="name">{c.name}</div>
          <div className="meta">
            <span className="platform">{c.platform}</span>
            {c.kind && <span className="course-kind-pip">{({ online: 'En línea', formal: 'Formal', autoguiado: 'Autoguiado', project: 'Proyecto' })[c.kind] || c.kind}</span>}
            {c.isBook && <span className="book-pip"><KIcon name="book-open" size={9} /> Desde Lectura</span>}
          </div>
        </div>
        {c.done && <span className="done-badge"><KIcon name="check" size={12} /></span>}
      </div>
      <div className="progress-row">
        <div className="kbv-progress" style={{ height: 6 }}><div className="fill" style={{ width: `${c.progress}%`, background: c.color }} /></div>
        <span className="pct">{c.progress}%</span>
      </div>
      <div className="footer">
        <span><KIcon name="clock" size={10} /> {c.doneHrs}h / {c.totalHrs}h</span>
        <span style={{ color: 'var(--area-wisdom)', fontWeight: 700 }}>+{c.xpEarned} XP</span>
      </div>
      <div className="course-card-actions" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="cc-act" onClick={() => { try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'tareas', area: 'wisdom', project: projectId } })); } catch (_) {} }}>
          <KIcon name="list" size={11} /> Ver tareas del curso
        </button>
        <button type="button" className="cc-act ghost" onClick={() => { try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'tareas', create: true, area: 'wisdom', project: projectId } })); } catch (_) {} }}>
          <KIcon name="plus" size={11} /> Nueva tarea
        </button>
      </div>
    </div>
  );
}

const PRIORITY_PILL = { alta: { c: 'var(--kb-hp)', l: 'Alta' }, media: { c: 'var(--kb-coin)', l: 'Media' }, baja: { c: 'var(--kb-gem)', l: 'Baja' } };

function EstudioCursos({ courses, backlog, onAddCourse, onPromote, onAddBacklog, onOpenCourse }) {
  const active = courses.filter(c => !c.done);
  const done = courses.filter(c => c.done);
  return (
    <>
      <SectionHead title="En curso" meta={`${active.length} cursos activos`}>
        <button type="button" className="kbv-btn kbv-btn-primary" style={{ padding: '8px 12px', fontSize: 13 }} onClick={onAddCourse}><KIcon name="plus" size={13} /> Agregar curso</button>
      </SectionHead>
      <div className="kbv-courses-grid">
        {active.map(c => <CourseCard key={c.id} c={c} onClick={() => onOpenCourse && onOpenCourse(c)} />)}
        {done.map(c => <CourseCard key={c.id} c={c} onClick={() => onOpenCourse && onOpenCourse(c)} />)}
      </div>

      {/* Backlog / plan de carrera + intereses */}
      <div className="kbv-study-cols" style={{ marginTop: 8 }}>
        {typeof EstudioBacklog === 'function'
          ? <EstudioBacklog backlog={backlog} courses={courses} onPromote={onPromote} onAdd={onAddBacklog} />
          : null}
        {typeof EstudioIntereses === 'function' ? <EstudioIntereses /> : null}
      </div>
    </>
  );
}

// ── Pestaña: Agenda (horario + entregas + evaluación) ────────
function EstudioAgenda() {
  const [deadlines, setDeadlines] = React.useState(STUDY_DEADLINES);
  function toggle(id) { setDeadlines(ds => ds.map(d => d.id === id ? { ...d, done: !d.done } : d)); }
  const sorted = [...deadlines].sort((a, b) => (a.done - b.done) || (a.dleft - b.dleft));
  return (
    <>
      {/* Horario semanal */}
      <SectionHead title="Horario semanal" meta="Clases, cursos y bloques de estudio recurrentes" />
      <div className="kbv-schedule">
        {STUDY_SCHEDULE.map(d => (
          <div key={d.day} className={`sch-col ${d.blocks.length === 0 ? 'empty' : ''}`}>
            <div className="sch-day">{d.day}</div>
            {d.blocks.length === 0 ? <span className="sch-free">libre</span> : d.blocks.map((b, i) => (
              <div key={i} className="sch-block" style={{ '--bc': b.color }}>
                <span className="t">{b.t}</span>
                <span className="s">{b.subject}</span>
                <span className="k">{b.kind}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="kbv-study-cols">
        {/* Entregas / fechas importantes */}
        <div className="kbv-card kbv-char-card">
          <SectionHead tight title="Entregas y fechas">
            <button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }}>+ Agregar</button>
          </SectionHead>
          <div className="kbv-deadlines">
            {sorted.map(d => {
              const t = DEADLINE_TYPE[d.type];
              const urgent = !d.done && d.dleft <= 3;
              return (
                <div key={d.id} className={`dl-row ${d.done ? 'done' : ''} ${urgent ? 'urgent' : ''}`} onClick={() => toggle(d.id)}>
                  <span className="dl-check" />
                  <span className="dl-type" style={{ '--tc': t.color }}><KIcon name={t.icon} size={11} /> {t.label}</span>
                  <span className="dl-title">{d.title}</span>
                  <span className="dl-date">{d.done ? 'Entregado' : d.dleft === 0 ? 'Hoy' : `en ${d.dleft} d`}<small>{!d.done && ` · ${d.date}`}</small></span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Métodos de evaluación */}
        <div className="kbv-card kbv-char-card">
          <SectionHead tight title="Métodos de evaluación" meta="Cómo se califica cada materia" />
          <div className="kbv-evals">
            {STUDY_EVALS.map(ev => {
              const projected = Math.round(ev.items.reduce((a, it) => a + (it.grade != null ? it.grade * it.weight / 100 : 0), 0));
              const gradedWeight = ev.items.reduce((a, it) => a + (it.grade != null ? it.weight : 0), 0);
              return (
                <div key={ev.course} className="ev-card" style={{ '--ec': ev.color }}>
                  <div className="ev-head">
                    <span className="ev-name">{ev.course}</span>
                    <span className="ev-grade">{gradedWeight > 0 ? `${projected} pts` : 'Sin calif.'}<small>de {gradedWeight}%</small></span>
                  </div>
                  <div className="ev-bar">
                    {ev.items.map((it, i) => (
                      <span key={i} className={`seg ${it.grade == null ? 'pending' : ''}`} style={{ width: `${it.weight}%` }} title={`${it.name} · ${it.weight}%`} />
                    ))}
                  </div>
                  <div className="ev-items">
                    {ev.items.map((it, i) => (
                      <span key={i} className="ev-item">
                        <b>{it.name}</b> {it.weight}% {it.grade != null ? <em>· {it.grade}</em> : <em className="pend">· pend.</em>}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Pestaña: Trayectoria (profesores, escuelas, ranking) ─────
function EstudioTrayectoria({ courses = [] }) {
  const topByTime = courses.slice().sort((a, b) => (b.doneHrs || 0) - (a.doneHrs || 0))[0];
  const totalHrs = courses.reduce((a, c) => a + (c.doneHrs || 0), 0);
  const activeNow = courses.filter(c => !c.done).length;
  // Ranking de materias/skills por XP
  const ranking = [
    { name: 'System Design', xp: 320, color: '#2D4A3A' },
    { name: 'UX / Producto', xp: 280, color: '#A435F0' },
    { name: 'Machine Learning', xp: 220, color: '#0056D2' },
    { name: 'iOS · Swift', xp: 180, color: '#98CA3F' },
    { name: 'Hábitos / lectura', xp: 80, color: '#1B2A60' },
  ].sort((a, b) => b.xp - a.xp);
  const maxXp = ranking[0].xp;

  return (
    <div className="kbv-study-cols tri">
      {/* Ranking */}
      <div className="kbv-card kbv-char-card">
        <SectionHead tight title="Ranking de conocimiento" meta="XP por disciplina · suma a Sabiduría" />
        {topByTime && (
          <div className="kbv-knowledge-top">
            <div className="kt-cell"><span className="kt-v">{topByTime.name}</span><span className="kt-l">curso con más horas · {topByTime.doneHrs}h</span></div>
            <div className="kt-cell"><span className="kt-v">{totalHrs.toFixed(0)}<small> h</small></span><span className="kt-l">horas totales registradas</span></div>
            <div className="kt-cell"><span className="kt-v">{activeNow}</span><span className="kt-l">en curso ahora</span></div>
          </div>
        )}
        <div className="kbv-rank">
          {ranking.map((r, i) => (
            <div key={r.name} className="rank-row">
              <span className="rk-pos">{i + 1}</span>
              <div className="rk-body">
                <div className="rk-head"><span className="rk-name">{r.name}</span><span className="rk-xp">+{r.xp} XP</span></div>
                <div className="rk-bar"><span style={{ width: `${(r.xp / maxXp) * 100}%`, background: r.color }} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profesores */}
      <div className="kbv-card kbv-char-card">
        <SectionHead tight title="Profesores">
          <button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }}>+ Registrar</button>
        </SectionHead>
        <div className="kbv-prof-list">
          {STUDY_PROFESSORS.map(p => (
            <div key={p.id} className="prof-row">
              <span className="pf-av">{p.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</span>
              <div className="pf-info">
                <span className="pf-name">{p.name}</span>
                <span className="pf-meta">{p.subject} · {p.school}</span>
              </div>
              <span className="pf-stars">{'★'.repeat(p.rating)}<span className="off">{'★'.repeat(5 - p.rating)}</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Escuelas */}
      <div className="kbv-card kbv-char-card">
        <SectionHead tight title="Escuelas e instituciones">
          <button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }}>+ Agregar</button>
        </SectionHead>
        <div className="kbv-school-list">
          {STUDY_SCHOOLS.map(s => (
            <div key={s.id} className="school-row">
              <span className="sc-ico"><KIcon name="graduation" size={15} /></span>
              <div className="sc-info">
                <span className="sc-name">{s.name}</span>
                <span className="sc-meta">{s.kind} · {s.period}</span>
              </div>
              <span className={`sc-status ${s.status === 'Activo' ? 'on' : ''}`}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Pantalla principal con pestañas ──────────────────────────
function EstudioScreenV2() {
  const [tab, setTab] = React.useState('agenda');
  const [courses, setCourses] = React.useState(typeof STUDY_COURSES !== 'undefined' ? STUDY_COURSES : []);
  const [backlog, setBacklog] = React.useState(STUDY_BACKLOG);
  const [courseOpen, setCourseOpen] = React.useState(false);
  const [openCourse, setOpenCourse] = React.useState(null);
  const [askText, textDialog] = usePrompt();

  function promote(id) {
    const b = backlog.find(x => x.id === id);
    if (!b) return;
    setBacklog(bs => bs.filter(x => x.id !== id));
    setCourses(cs => [...cs, { id: 'c' + Math.random().toString(36).slice(2, 6), name: b.name, platform: b.platform, icon: 'layers', color: 'var(--kb-gem)', progress: 0, totalHrs: 0, doneHrs: 0, lastSessionAt: 'Nuevo', skill: '', xpEarned: 0, syncing: false }]);
  }
  function addBacklog() {
    askText({ title: 'Agregar al backlog', sub: 'Lo que quieres aprender — luego lo conviertes en curso cuando arranque.', label: 'Curso o tema', placeholder: 'p. ej. Rust desde cero, teoría musical, SQL avanzado…',
      onSubmit: (name) => setBacklog(bs => [...bs, { id: 'bk' + Math.random().toString(36).slice(2, 6), name, platform: 'Plan propio', why: '', priority: 'media', kind: 'project' }]) });
  }
  function addCourse(c) {
    setCourses(cs => [...cs, { id: 'c' + Math.random().toString(36).slice(2, 6), name: c.name, platform: c.platform || (c.kind === 'taller' ? 'Taller' : 'Proyecto'), icon: c.kind === 'taller' ? 'community' : 'layers', color: 'var(--kb-gem)', progress: 0, totalHrs: 0, doneHrs: 0, lastSessionAt: 'Nuevo', skill: c.subject || '', xpEarned: 0, kind: c.kind || 'online', url: c.url || null, energy: c.energy, effort: c.effort, prior: c.prior, reward: c.reward, topics: c.topics || [], taller: c.taller || null, professor: c.professor || '' }]);
  }

  // Detalle de curso (homologado con Proyectos)
  if (openCourse && typeof CourseDetail === 'function') {
    const live = courses.find(c => c.id === openCourse.id) || openCourse;
    return <CourseDetail course={live} onBack={() => setOpenCourse(null)} />;
  }

  const TABS = [
    { id: 'agenda', label: 'Agenda', icon: 'calendar' },
    { id: 'cursos', label: 'Cursos', icon: 'layers' },
    { id: 'escuela', label: 'Escuela', icon: 'graduation' },
    { id: 'trayectoria', label: 'Trayectoria', icon: 'trending-up' },
    { id: 'foco', label: 'Foco', icon: 'clock' },
  ];

  return (
    <div className="kbv-main">
      {textDialog}
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--area-wisdom)' }}>{crumb('estudio', 'Aprendizaje')}</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Estudio. <InfoDot label="i" text={"Tu centro académico: foco con Pomodoro, cursos y plan de carrera, agenda de clases y entregas, y tu trayectoria. Todo suma XP a Sabiduría. Registro manual — sin depender de integraciones externas."} /></h1>
        </div>
      </div>

      <div className="kbv-store-tabs-v2" style={{ marginBottom: 4 }}>
        {TABS.map(t => (
          <button key={t.id} type="button" className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            <KIcon name={t.icon} size={14} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'foco' && <EstudioFoco courses={courses} />}
      {tab === 'cursos' && <EstudioCursos courses={courses} backlog={backlog} onAddCourse={() => setCourseOpen(true)} onPromote={promote} onAddBacklog={addBacklog} onOpenCourse={setOpenCourse} />}
      {tab === 'escuela' && (typeof EstudioEscuelaV2 === 'function' ? <EstudioEscuelaV2 /> : <EstudioEscuela />)}
      {tab === 'agenda' && (typeof EstudioAgendaV2 === 'function' ? <EstudioAgendaV2 /> : <EstudioAgenda />)}
      {tab === 'trayectoria' && (typeof EstudioTrayectoriaV2 === 'function' ? <EstudioTrayectoriaV2 courses={courses} /> : <EstudioTrayectoria courses={courses} />)}

      {/* Recomendación de Kibo — notificación flotante (mascota) */}
      {typeof KiboTip === 'function' && (() => {
        const ip = courses.filter(c => !c.done).length;
        const tip = ip >= 4
          ? { tone: 'warn', title: 'Estás disperso en demasiados frentes', body: `Tienes ${ip} cursos en curso a la vez. Enfócate: elige 2 para cerrarlos este mes y manda el resto al backlog. Terminar pesa más que empezar.` }
          : ip === 0
            ? { tone: 'ok', title: 'Bandeja limpia', body: `No tienes cursos activos. Saca uno de tus ${backlog.length} del backlog, ponle horario y arranca con un Pomodoro.` }
            : { tone: 'ok', title: 'Buen nivel de foco', body: `${ip} curso(s) en curso — un número sano. Mantén el ritmo y cuando cierres uno saca el siguiente del backlog.` };
        return <KiboTip from="Kibo · recomendación" tone={tip.tone} title={tip.title} body={tip.body} storageKey="estudio" />;
      })()}

      {courseOpen && (typeof CreateCourseModalV2 === 'function'
        ? <CreateCourseModalV2 onClose={() => setCourseOpen(false)} onSave={addCourse} allCourses={courses.filter(c => !c.done)} />
        : (typeof CreateCourseModal === 'function' && <CreateCourseModal onClose={() => setCourseOpen(false)} onSave={addCourse} />))}
    </div>
  );
}

Object.assign(window, { EstudioScreenV2, SCHOOL_SUBJECTS, SCHOOL_SEMESTER });
