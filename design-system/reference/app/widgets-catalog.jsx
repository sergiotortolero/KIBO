// widgets-catalog.jsx — Full widget catalog (Block F/G)
// Adds section widgets with TWO sizes each: compact 1×1 + extended 4×2.
// Loaded AFTER widgets-v2.jsx + dashboard-v2.jsx so it augments the registry.

// ─────────────────────────────────────────────────────────────
// Small shared helpers
// ─────────────────────────────────────────────────────────────
function WCard({ title, icon, iconColor, action, children, className = '' }) {
  return (
    <div className={`kbv-side-card ${className}`} style={{ height: '100%' }}>
      {(title || action) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <h3 className="kbv-h4" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {icon && <KIcon name={icon} size={15} style={{ color: iconColor || 'var(--kb-primary)' }} />}
            {title}
          </h3>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

function WRing({ pct, color = 'var(--kb-primary)', size = 48, label }) {
  const r = 18, c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg viewBox="0 0 44 44" width={size} height={size}>
        <circle cx="22" cy="22" r={r} fill="none" stroke="var(--kb-surface-2)" strokeWidth="5" />
        <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
                strokeDasharray={`${c * pct / 100} ${c}`} transform="rotate(-90 22 22)" />
      </svg>
      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                     fontFamily: 'var(--kb-f-display)', fontWeight: 800, fontSize: size > 44 ? 13 : 11, color }}>
        {label != null ? label : `${pct}%`}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DIARIO — solo mood, mood semanal, gratitud (diario completo ya existe)
// ═══════════════════════════════════════════════════════════════
function WGratitude({ w = 1 }) {
  const items = ['Mi mamá llamó sin razón', 'El café salió perfecto', 'Terminé el reporte a tiempo'];
  if (w < 4) {
    return (
      <WCard title="Gratitud" icon="sparkle" iconColor="var(--area-community)">
        <input className="kbv-mini-input" placeholder="Hoy agradezco…" />
        <span className="kbv-meta" style={{ marginTop: 'auto' }}>Suma a tu bienestar diario</span>
      </WCard>
    );
  }
  return (
    <WCard title="Gratitud" icon="sparkle" iconColor="var(--area-community)" action={<span className="kbv-meta">Esta semana</span>}>
      <input className="kbv-mini-input" placeholder="Hoy agradezco…" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
        {items.map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--kb-text-2)' }}>
            <KIcon name="sparkle" size={11} style={{ color: 'var(--area-community)', flexShrink: 0 }} /> {t}
          </div>
        ))}
      </div>
    </WCard>
  );
}

// ═══════════════════════════════════════════════════════════════
// LECTURA — sesión rápida, notas recientes
// ═══════════════════════════════════════════════════════════════
function WReadingSession({ w = 1, ctx }) {
  const go = () => ctx?.onNavigate && ctx.onNavigate('lectura');
  if (w < 4) {
    return (
      <WCard title="Sesión" icon="book-open" iconColor="var(--kb-gem)">
        <div style={{ fontSize: 12, color: 'var(--kb-text-2)', marginBottom: 6 }}>Atomic Habits · p.127</div>
        <button type="button" className="kbv-btn kbv-btn-primary" style={{ width: '100%', marginTop: 'auto' }} onClick={go}>
          <KIcon name="book-open" size={13} /> Iniciar
        </button>
      </WCard>
    );
  }
  const active = [
    { t: 'Atomic Habits', a: 'James Clear', p: 127, tot: 320 },
    { t: 'Deep Work', a: 'Cal Newport', p: 88, tot: 296 },
  ];
  return (
    <WCard title="Sesión de lectura" icon="book-open" iconColor="var(--kb-gem)" action={<button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }} onClick={go}>Ver todos</button>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {active.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, background: 'var(--kb-surface)', borderRadius: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--kb-text)' }}>{b.t}</div>
              <div className="kbv-progress" style={{ height: 5, marginTop: 4 }}><div className="fill" style={{ width: `${b.p / b.tot * 100}%` }} /></div>
              <span className="kbv-meta" style={{ marginTop: 2, display: 'block' }}>p.{b.p}/{b.tot}</span>
            </div>
            <button type="button" className="kbv-btn kbv-btn-primary" style={{ padding: '6px 10px', fontSize: 12 }} onClick={go}>Iniciar</button>
          </div>
        ))}
      </div>
    </WCard>
  );
}

function WReadingNotes({ w = 1, ctx }) {
  const go = () => ctx?.onNavigate && ctx.onNavigate('lectura');
  const notes = [
    { k: 'Aprendizaje', t: 'Los hábitos son interés compuesto de la auto-mejora.', c: 'var(--area-community)' },
    { k: 'Cita', t: '"Cada acción es un voto por el tipo de persona que quieres ser."', c: 'var(--kb-coin)' },
    { k: 'Idea', t: 'Enfócate en sistemas, no en metas.', c: 'var(--kb-gem)' },
  ];
  if (w < 4) {
    return (
      <WCard title="Notas" icon="edit" iconColor="var(--area-community)" className="clickable" >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, cursor: 'pointer' }} onClick={go}>
          <span className="kbv-num" style={{ fontSize: 26, color: 'var(--area-community)' }}>24</span>
          <span className="kbv-meta">notas · aprendizajes · citas</span>
        </div>
      </WCard>
    );
  }
  return (
    <WCard title="Notas recientes" icon="edit" iconColor="var(--area-community)" action={<button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }} onClick={go}>Ver todas</button>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {notes.map((n, i) => (
          <div key={i} style={{ padding: 8, background: 'var(--kb-surface)', borderRadius: 8, borderLeft: `3px solid ${n.c}` }}>
            <span style={{ fontFamily: 'var(--kb-f-mono)', fontSize: 9, fontWeight: 800, color: n.c, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{n.k}</span>
            <div style={{ fontSize: 12, color: 'var(--kb-text)', marginTop: 2 }}>{n.t}</div>
          </div>
        ))}
      </div>
    </WCard>
  );
}

// ═══════════════════════════════════════════════════════════════
// ESTUDIO — pomodoro, cursos en curso, próxima clase
// ═══════════════════════════════════════════════════════════════
function WPomodoro({ w = 1, ctx }) {
  const [running, setRunning] = React.useState(false);
  const [secs, setSecs] = React.useState(25 * 60);
  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  const pct = (1 - secs / (25 * 60)) * 100;
  if (w < 4) {
    return (
      <WCard title="Pomodoro" icon="clock" iconColor="var(--area-wisdom)">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
          <span className="kbv-num" style={{ fontSize: 26, fontVariantNumeric: 'tabular-nums', color: 'var(--kb-text)' }}>{mm}:{ss}</span>
        </div>
        <button type="button" className="kbv-btn kbv-btn-primary" style={{ width: '100%', marginTop: 'auto' }} onClick={() => setRunning(r => !r)}>
          <KIcon name={running ? 'square' : 'play'} size={13} /> {running ? 'Pausar' : 'Iniciar'}
        </button>
      </WCard>
    );
  }
  return (
    <WCard title="Pomodoro" icon="clock" iconColor="var(--area-wisdom)" action={<span className="kbv-meta">Foco · 25 min</span>}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <WRing pct={Math.round(pct)} color="var(--area-wisdom)" size={72} label={`${mm}:${ss}`} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <span className="kbv-meta">Ligado a</span>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--kb-text)' }}>Curso · System Design</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" className="kbv-btn kbv-btn-primary" style={{ flex: 1 }} onClick={() => setRunning(r => !r)}>
              <KIcon name={running ? 'square' : 'play'} size={13} /> {running ? 'Pausar' : 'Iniciar'}
            </button>
            <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => { setRunning(false); setSecs(25 * 60); }}>Reset</button>
          </div>
        </div>
      </div>
    </WCard>
  );
}

function WCourses({ w = 1, ctx }) {
  const go = () => ctx?.onNavigate && ctx.onNavigate('estudio');
  const courses = [
    { n: 'System Design', plat: 'Educative', pct: 72, c: '#2D4A3A' },
    { n: 'SwiftUI', plat: 'Platzi', pct: 45, c: '#98CA3F' },
    { n: 'Machine Learning', plat: 'Coursera', pct: 23, c: '#0056D2' },
  ];
  if (w < 4) {
    return (
      <WCard title="Cursos" icon="layers" iconColor="var(--kb-gem)" className="clickable">
        <div onClick={go} style={{ cursor: 'pointer' }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--kb-text)' }}>{courses[0].n}</div>
          <div className="kbv-progress" style={{ height: 5, marginTop: 4 }}><div className="fill" style={{ width: `${courses[0].pct}%`, background: courses[0].c }} /></div>
          <span className="kbv-meta" style={{ marginTop: 4, display: 'block' }}>+{courses.length - 1} cursos más</span>
        </div>
      </WCard>
    );
  }
  return (
    <WCard title="Cursos en curso" icon="layers" iconColor="var(--kb-gem)" action={<button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }} onClick={go}>Ir a Estudio</button>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {courses.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: 12, color: 'var(--kb-text)' }}>{c.n}</span>
                <span className="kbv-meta">{c.plat}</span>
              </div>
              <div className="kbv-progress" style={{ height: 6, marginTop: 4 }}><div className="fill" style={{ width: `${c.pct}%`, background: c.c }} /></div>
            </div>
            <span style={{ fontFamily: 'var(--kb-f-mono)', fontWeight: 800, fontSize: 12, color: c.c }}>{c.pct}%</span>
          </div>
        ))}
      </div>
    </WCard>
  );
}

function WNextClass({ w = 1, ctx }) {
  const go = () => ctx?.onNavigate && ctx.onNavigate('estudio');
  const classes = [
    { d: 'Hoy', h: '18:00', n: 'Cálculo III', prof: 'Dra. Méndez' },
    { d: 'Mié', h: '10:00', n: 'Bases de datos', prof: 'Ing. Soto' },
    { d: 'Jue', h: '16:00', n: 'Ética profesional', prof: 'Mtro. Lara' },
  ];
  if (w < 4) {
    return (
      <WCard title="Próxima clase" icon="calendar" iconColor="var(--pri-high)" className="clickable">
        <div onClick={go} style={{ cursor: 'pointer' }}>
          <div style={{ fontFamily: 'var(--kb-f-mono)', fontWeight: 800, color: 'var(--pri-high)', fontSize: 12 }}>{classes[0].d} · {classes[0].h}</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--kb-text)', marginTop: 2 }}>{classes[0].n}</div>
          <span className="kbv-meta">{classes[0].prof}</span>
        </div>
      </WCard>
    );
  }
  return (
    <WCard title="Agenda de clases" icon="calendar" iconColor="var(--pri-high)" action={<button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }} onClick={go}>Ver agenda</button>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {classes.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, background: 'var(--kb-surface)', borderRadius: 8 }}>
            <div style={{ textAlign: 'center', minWidth: 44 }}>
              <div style={{ fontFamily: 'var(--kb-f-mono)', fontWeight: 800, fontSize: 11, color: 'var(--pri-high)' }}>{c.d}</div>
              <div style={{ fontSize: 11, color: 'var(--kb-text-2)' }}>{c.h}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--kb-text)' }}>{c.n}</div>
              <span className="kbv-meta">{c.prof}</span>
            </div>
          </div>
        ))}
      </div>
    </WCard>
  );
}

// ═══════════════════════════════════════════════════════════════
// ENTRETENIMIENTO — siguiente episodio, wishlist, visto este año
// ═══════════════════════════════════════════════════════════════
function WNextEpisode({ w = 1, ctx }) {
  const go = () => ctx?.onNavigate && ctx.onNavigate('watch');
  const shows = [
    { t: 'Severance', s: 2, e: 7, cover: 'linear-gradient(135deg,#1A1A2E,#0A0A1E)' },
    { t: 'The Bear', s: 3, e: 4, cover: 'linear-gradient(135deg,#6E2E2E,#401414)' },
  ];
  if (w < 4) {
    return (
      <WCard title="Viendo" icon="film" iconColor="var(--area-community)" className="clickable">
        <div onClick={go} style={{ cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ width: 36, height: 50, borderRadius: 6, background: shows[0].cover, flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--kb-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{shows[0].t}</div>
            <span className="kbv-meta">T{shows[0].s} · E{shows[0].e}</span>
          </div>
        </div>
      </WCard>
    );
  }
  return (
    <WCard title="Siguiente episodio" icon="film" iconColor="var(--area-community)" action={<button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }} onClick={go}>Ver todo</button>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {shows.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 8, background: 'var(--kb-surface)', borderRadius: 10 }}>
            <div style={{ width: 40, height: 56, borderRadius: 6, background: s.cover, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--kb-text)' }}>{s.t}</div>
              <span className="kbv-meta">Siguiente: T{s.s} · E{s.e}</span>
            </div>
            <button type="button" className="kbv-btn kbv-btn-primary" style={{ padding: '6px 10px', fontSize: 12 }} onClick={go}>
              <KIcon name="check" size={12} /> Visto
            </button>
          </div>
        ))}
      </div>
    </WCard>
  );
}

function WWatchYear({ w = 1, ctx }) {
  const go = () => ctx?.onNavigate && ctx.onNavigate('watch');
  if (w < 4) {
    return (
      <WCard title="Este año" icon="film" iconColor="var(--kb-media)" className="clickable">
        <div onClick={go} style={{ cursor: 'pointer' }}>
          <span className="kbv-num" style={{ fontSize: 26, color: 'var(--kb-media)' }}>34</span>
          <span className="kbv-meta" style={{ display: 'block' }}>vistos en 2026</span>
        </div>
      </WCard>
    );
  }
  const stats = [
    { l: 'Películas', v: 22, c: 'var(--kb-media)' },
    { l: 'Series', v: 12, c: 'var(--area-community)' },
    { l: 'Horas', v: 186, c: 'var(--kb-gem)' },
    { l: 'Cine', v: 8, c: 'var(--pri-high)' },
  ];
  return (
    <WCard title="Visto este año" icon="film" iconColor="var(--kb-media)" action={<span className="kbv-meta">2026</span>}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: 'center', padding: 10, background: 'var(--kb-surface)', borderRadius: 10 }}>
            <div style={{ fontFamily: 'var(--kb-f-display)', fontWeight: 800, fontSize: 22, color: s.c }}>{s.v}</div>
            <span className="kbv-meta">{s.l}</span>
          </div>
        ))}
      </div>
    </WCard>
  );
}

// ═══════════════════════════════════════════════════════════════
// HÁBITOS — próximo hábito (hábitos de hoy ya existe)
// ═══════════════════════════════════════════════════════════════
function WNextHabit({ w = 1, ctx }) {
  const go = () => ctx?.onNavigate && ctx.onNavigate('habits');
  const habits = [
    { n: 'Estiramientos AM', h: '07:00 – 09:00', done: false },
    { n: 'Tomar 2L de agua', h: 'Cualquier hora', done: true },
    { n: 'Diario nocturno', h: '22:00', done: false },
  ];
  const next = habits.find(h => !h.done);
  if (w < 4) {
    return (
      <WCard title="Próximo hábito" icon="flame" iconColor="var(--kb-streak)" className="clickable">
        <div onClick={go} style={{ cursor: 'pointer' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--kb-text)' }}>{next?.n}</div>
          <span className="kbv-meta" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <KIcon name="clock" size={11} /> {next?.h}
          </span>
        </div>
      </WCard>
    );
  }
  return (
    <WCard title="Hábitos por horario" icon="flame" iconColor="var(--kb-streak)" action={<button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }} onClick={go}>Ver todos</button>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {habits.map((h, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, background: 'var(--kb-surface)', borderRadius: 8, opacity: h.done ? 0.55 : 1 }}>
            <span style={{ width: 18, height: 18, borderRadius: 5, border: '1.5px solid var(--kb-border-strong)', background: h.done ? 'var(--kb-primary)' : 'transparent', flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--kb-text)', textDecoration: h.done ? 'line-through' : 'none' }}>{h.n}</span>
            <span className="kbv-meta" style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><KIcon name="clock" size={10} /> {h.h}</span>
          </div>
        ))}
      </div>
    </WCard>
  );
}

// ═══════════════════════════════════════════════════════════════
// RETOS — días de reto (reto activo ya existe)
// ═══════════════════════════════════════════════════════════════
function WRetoDays({ w = 1, ctx }) {
  const go = () => ctx?.onNavigate && ctx.onNavigate('retos');
  const r = (typeof kbActiveReto === 'function' && kbActiveReto()) || null;
  const total = r ? r.daysTotal : 30, elapsed = r ? r.daysElapsed : 21;
  const fails = r ? r.fails : 1, allowed = r ? r.failsAllowed : 2;
  const name = r ? r.name : 'Reto activo';
  if (w < 4) {
    return (
      <WCard title="Días de reto" icon="sword" iconColor="var(--kb-boss)" className="clickable">
        <div onClick={go} style={{ cursor: 'pointer' }}>
          <span className="kbv-num" style={{ fontSize: 26, color: 'var(--kb-boss)' }}>{total - elapsed}</span>
          <span className="kbv-meta" style={{ display: 'block' }}>días restantes · {fails} {fails === 1 ? 'fallo' : 'fallos'}</span>
        </div>
      </WCard>
    );
  }
  return (
    <WCard title={name} icon="sword" iconColor="var(--kb-boss)" action={<button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }} onClick={go}>Abrir reto</button>}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(30,1fr)', gap: 3, marginTop: 4 }}>
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} style={{ height: 20, borderRadius: 3,
            background: i < elapsed - fails ? 'var(--kb-primary)' : i === 19 ? 'var(--kb-boss)' : i < elapsed ? 'var(--kb-primary)' : i === elapsed ? 'var(--kb-coin)' : 'var(--kb-surface-2)' }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'var(--kb-text-2)' }}>
        <span><strong style={{ color: 'var(--kb-text)' }}>{total - elapsed}</strong> días restantes</span>
        <span><strong style={{ color: 'var(--kb-boss)' }}>{fails}</strong>/{allowed} fallos · daño 15 HP</span>
      </div>
    </WCard>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAREAS — por prioridad, timeline (tareas de hoy ya existe)
// ═══════════════════════════════════════════════════════════════
function WTasksPriority({ w = 1, ctx }) {
  const go = () => ctx?.onNavigate && ctx.onNavigate('tareas');
  const PD = (typeof PRIORITY_DEFS !== 'undefined') ? PRIORITY_DEFS : {};
  const groups = [
    { p: 'urgent', items: ['Cerrar propuesta Aurora'] },
    { p: 'high', items: ['Correr 5 km', 'Leer cap. 3'] },
    { p: 'medium', items: ['Llamar a mamá'] },
  ];
  if (w < 4) {
    return (
      <WCard title="Urgente" icon="list" iconColor="var(--kb-hp)" className="clickable">
        <div onClick={go} style={{ cursor: 'pointer' }}>
          {typeof PriorityIcon !== 'undefined' && <PriorityIcon level="urgent" size={16} />}
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--kb-text)', marginTop: 4 }}>Cerrar propuesta Aurora</div>
          <span className="kbv-meta">+3 tareas más por prioridad</span>
        </div>
      </WCard>
    );
  }
  return (
    <WCard title="Tareas por prioridad" icon="list" iconColor="var(--kb-primary)" action={<button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }} onClick={go}>Ver todas</button>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {groups.map((g, i) => (
          <div key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              {typeof PriorityIcon !== 'undefined' && <PriorityIcon level={g.p} size={13} />}
              <span style={{ fontFamily: 'var(--kb-f-mono)', fontSize: 10, fontWeight: 800, color: PD[g.p]?.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{PD[g.p]?.label || g.p}</span>
            </div>
            {g.items.map((t, j) => (
              <div key={j} style={{ fontSize: 12, color: 'var(--kb-text)', padding: '3px 0 3px 19px' }}>{t}</div>
            ))}
          </div>
        ))}
      </div>
    </WCard>
  );
}

function WTasksTimeline({ w = 1, ctx }) {
  const go = () => ctx?.onNavigate && ctx.onNavigate('tareas');
  const bars = [
    { n: 'Propuesta Aurora', start: 0, span: 2, c: 'var(--kb-coin)' },
    { n: 'Correr 5 km', start: 1, span: 1, c: 'var(--area-vigor)' },
    { n: 'Leer cap. 3', start: 2, span: 2, c: 'var(--area-community)' },
  ];
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  if (w < 4) {
    return (
      <WCard title="Timeline" icon="calendar" iconColor="var(--kb-gem)" className="clickable">
        <div onClick={go} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
          {bars.slice(0, 3).map((b, i) => (
            <div key={i} style={{ height: 8, borderRadius: 3, background: b.c, width: `${b.span / 4 * 100}%`, marginLeft: `${b.start / 4 * 100}%` }} />
          ))}
          <span className="kbv-meta" style={{ marginTop: 2 }}>Plan de la semana</span>
        </div>
      </WCard>
    );
  }
  return (
    <WCard title="Línea del tiempo" icon="calendar" iconColor="var(--kb-gem)" action={<button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }} onClick={go}>Ver completa</button>}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 4 }}>
        {days.map(d => <span key={d} style={{ textAlign: 'center', fontFamily: 'var(--kb-f-mono)', fontSize: 9, fontWeight: 800, color: 'var(--kb-text-3)' }}>{d}</span>)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {bars.map((b, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, alignItems: 'center' }}>
            <div style={{ gridColumn: `${b.start + 1} / span ${b.span}`, height: 22, borderRadius: 6, background: `color-mix(in oklab, ${b.c} 18%, var(--kb-canvas))`, borderLeft: `3px solid ${b.c}`, display: 'flex', alignItems: 'center', padding: '0 6px', fontSize: 10, fontWeight: 700, color: `color-mix(in oklab, ${b.c} 70%, #000)`, whiteSpace: 'nowrap', overflow: 'hidden' }}>{b.n}</div>
          </div>
        ))}
      </div>
    </WCard>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROYECTOS — activos, avance
// ═══════════════════════════════════════════════════════════════
function WProjectsActive({ w = 1, ctx }) {
  const go = () => ctx?.onNavigate && ctx.onNavigate('projects');
  const cols = [
    { n: 'Por hacer', c: 'var(--pri-vlow)', items: ['Rediseño app', 'Blog'] },
    { n: 'En progreso', c: 'var(--kb-coin)', items: ['Curso online'] },
    { n: 'Terminado', c: 'var(--kb-primary)', items: ['Mudanza', 'Taxes'] },
  ];
  if (w < 4) {
    return (
      <WCard title="Proyectos" icon="folder" iconColor="var(--kb-gem)" className="clickable">
        <div onClick={go} style={{ cursor: 'pointer' }}>
          <span className="kbv-num" style={{ fontSize: 26, color: 'var(--kb-gem)' }}>5</span>
          <span className="kbv-meta" style={{ display: 'block' }}>activos · 1 en progreso</span>
        </div>
      </WCard>
    );
  }
  return (
    <WCard title="Proyectos activos" icon="folder" iconColor="var(--kb-gem)" action={<button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }} onClick={go}>Ir a Proyectos</button>}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {cols.map((c, i) => (
          <div key={i} style={{ background: 'var(--kb-surface)', borderRadius: 10, padding: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.c }} />
              <span style={{ fontFamily: 'var(--kb-f-mono)', fontSize: 9, fontWeight: 800, color: 'var(--kb-text-2)', textTransform: 'uppercase' }}>{c.n}</span>
            </div>
            {c.items.map((it, j) => (
              <div key={j} style={{ fontSize: 11, color: 'var(--kb-text)', padding: '3px 6px', background: 'var(--kb-card)', borderRadius: 5, borderLeft: `3px solid ${c.c}`, marginBottom: 3 }}>{it}</div>
            ))}
          </div>
        ))}
      </div>
    </WCard>
  );
}

function WProjectsProgress({ w = 1, ctx }) {
  const go = () => ctx?.onNavigate && ctx.onNavigate('projects');
  const projects = [
    { n: 'Rediseño app', pct: 65, c: 'var(--kb-gem)' },
    { n: 'Curso online', pct: 40, c: 'var(--kb-primary)' },
    { n: 'Blog técnico', pct: 15, c: 'var(--kb-coin)' },
  ];
  const avg = Math.round(projects.reduce((a, p) => a + p.pct, 0) / projects.length);
  if (w < 4) {
    return (
      <WCard title="Avance" icon="layers" iconColor="var(--kb-primary)">
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }} onClick={go}>
          <WRing pct={avg} color="var(--kb-primary)" size={56} />
        </div>
      </WCard>
    );
  }
  return (
    <WCard title="Avance de proyectos" icon="layers" iconColor="var(--kb-primary)" action={<button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }} onClick={go}>Ver todos</button>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {projects.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: 'var(--kb-text)' }}>{p.n}</span>
            <div className="kbv-progress" style={{ height: 6, flex: 1 }}><div className="fill" style={{ width: `${p.pct}%`, background: p.c }} /></div>
            <span style={{ fontFamily: 'var(--kb-f-mono)', fontWeight: 800, fontSize: 12, color: p.c, minWidth: 32, textAlign: 'right' }}>{p.pct}%</span>
          </div>
        ))}
      </div>
    </WCard>
  );
}

// ═══════════════════════════════════════════════════════════════
// FINANZAS — suscripciones (balance, gastos, presupuesto ya existen)
// ═══════════════════════════════════════════════════════════════
function WSubscriptions({ w = 1, ctx }) {
  const go = () => ctx?.onNavigate && ctx.onNavigate('finanzas');
  const subs = [
    { n: 'Netflix', amt: 219, c: '#E50914' },
    { n: 'Spotify', amt: 129, c: '#1DB954' },
    { n: 'Xbox Game Pass', amt: 229, c: '#107C10' },
    { n: 'iCloud', amt: 49, c: 'var(--kb-gem-ink)' },
  ];
  const total = subs.reduce((a, s) => a + s.amt, 0);
  if (w < 4) {
    return (
      <WCard title="Suscripciones" icon="film" iconColor="var(--area-community)" className="clickable">
        <div onClick={go} style={{ cursor: 'pointer' }}>
          <span className="kbv-num" style={{ fontSize: 24, color: 'var(--area-community)' }}>${total}</span>
          <span className="kbv-meta" style={{ display: 'block' }}>{subs.length} activas / mes</span>
        </div>
      </WCard>
    );
  }
  return (
    <WCard title="Suscripciones" icon="film" iconColor="var(--area-community)" action={<span className="kbv-meta">${total}/mes</span>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {subs.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderTop: i ? '1px solid var(--kb-border-soft)' : 'none' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.c }} />
            <span style={{ flex: 1, fontSize: 12, color: 'var(--kb-text)' }}>{s.n}</span>
            <span style={{ fontFamily: 'var(--kb-f-mono)', fontWeight: 700, fontSize: 12, color: 'var(--kb-text-2)' }}>${s.amt}</span>
          </div>
        ))}
      </div>
    </WCard>
  );
}

// ─────────────────────────────────────────────────────────────
// Register all new widgets + categories
// ─────────────────────────────────────────────────────────────
if (typeof WIDGET_REGISTRY !== 'undefined') {
  // Re-tag existing base widgets into proper sections + tailored size sets.
  // Bloque F: every widget supports at least 1×1 and 1×2; larger sizes are
  // per-widget and unlock extra functionality (NOT just a stretched layout).
  const retag = {
    coach:     { category: 'today',          sizes: [[1,1],[1,2],[2,1]] },
    highlight: { category: 'today',          sizes: [[1,1],[1,2],[2,1]] },
    economy:   { category: 'today',          sizes: [[1,1],[1,2],[2,1]] },
    streak:    { category: 'today',          sizes: [[1,1],[1,2],[2,1]] },
    diario:    { category: 'diario',         sizes: [[1,1],[1,2],[2,2],[4,2]] },
    moodPicker:{ category: 'diario',         sizes: [[1,1],[1,2],[2,1]] },
    weekMood:  { category: 'diario',         sizes: [[1,1],[2,2],[4,2]] },
    gratitude: { category: 'diario',         sizes: [[1,1],[1,2],[4,2]] },
    lectura:   { category: 'lectura',        sizes: [[1,1],[1,2],[2,2],[4,2]] },
    watch:     { category: 'entretenimiento',sizes: [[1,1],[1,2],[2,2]] },
    games:     { category: 'entretenimiento',sizes: [[1,1],[1,2]] },
    financeBalance:  { category: 'finance',  sizes: [[1,1],[1,2],[2,1]] },
    financeExpenses: { category: 'finance',  sizes: [[1,1],[2,2],[4,2]] },
    financeBudget:   { category: 'finance',  sizes: [[1,1],[1,2],[2,2]] },
  };
  Object.entries(retag).forEach(([k, v]) => { if (WIDGET_REGISTRY[k]) Object.assign(WIDGET_REGISTRY[k], v); });
  // Remove deprecated catalog noise
  ['prompt', 'photo'].forEach(k => { if (WIDGET_REGISTRY[k]) WIDGET_REGISTRY[k].category = 'diario'; });

  Object.assign(WIDGET_REGISTRY, {
    gratitude:       { id: 'gratitude',       name: 'Gratitud',           desc: 'Anota algo que agradeces. Grande: últimas entradas.',     icon: 'sparkle',   cost: 'free',        sizes: [[1,1],[1,2],[4,2]], defaultW: 1, defaultH: 1, category: 'diario' },
    readingSession:  { id: 'readingSession',  name: 'Sesión de lectura',  desc: 'Inicia una sesión. Grande: tus libros activos.',          icon: 'book-open', cost: 'free',        sizes: [[1,1],[1,2],[4,2]], defaultW: 1, defaultH: 1, category: 'lectura' },
    readingNotes:    { id: 'readingNotes',    name: 'Notas de lectura',   desc: 'Conteo de notas. Grande: últimas notas y citas.',         icon: 'edit',      cost: '120 monedas', sizes: [[1,1],[1,2],[4,2]], defaultW: 1, defaultH: 1, locked: true, category: 'lectura' },
    pomodoro:        { id: 'pomodoro',        name: 'Pomodoro',           desc: 'Timer de foco. Grande: anillo + tarea ligada.',           icon: 'clock',     cost: 'free',        sizes: [[1,1],[1,2],[4,2]], defaultW: 1, defaultH: 1, category: 'estudio' },
    courses:         { id: 'courses',         name: 'Cursos en curso',    desc: 'Progreso de tus cursos. Grande: lista completa.',         icon: 'layers',    cost: 'free',        sizes: [[1,1],[1,2],[4,2]], defaultW: 1, defaultH: 1, category: 'estudio' },
    nextClass:       { id: 'nextClass',       name: 'Próxima clase',      desc: 'Tu siguiente clase. Grande: agenda de la semana.',        icon: 'calendar',  cost: '150 monedas', sizes: [[1,1],[1,2],[4,2]], defaultW: 1, defaultH: 1, locked: true, category: 'estudio' },
    nextEpisode:     { id: 'nextEpisode',     name: 'Siguiente episodio', desc: 'Lo que estás viendo. Grande: marca vistos.',              icon: 'film',      cost: 'free',        sizes: [[1,1],[1,2],[4,2]], defaultW: 1, defaultH: 1, category: 'entretenimiento' },
    watchYear:       { id: 'watchYear',       name: 'Visto este año',     desc: 'Resumen anual. Grande: pelis, series, horas, cine.',      icon: 'film',      cost: '200 monedas', sizes: [[1,1],[1,2],[4,2]], defaultW: 1, defaultH: 1, locked: true, category: 'entretenimiento' },
    nextHabit:       { id: 'nextHabit',       name: 'Próximo hábito',     desc: 'Tu siguiente hábito por horario. Grande: lista del día.', icon: 'flame',     cost: 'free',        sizes: [[1,1],[1,2],[4,2]], defaultW: 1, defaultH: 1, category: 'personal' },
    retoDays:        { id: 'retoDays',        name: 'Días de reto',       desc: 'Días restantes. Grande: línea de días y fallos.',         icon: 'sword',     cost: 'free',        sizes: [[1,1],[1,2],[4,2]], defaultW: 1, defaultH: 1, category: 'personal' },
    tasksPriority:   { id: 'tasksPriority',   name: 'Por prioridad',      desc: 'Tu tarea top. Grande: agrupadas por prioridad.',          icon: 'list',      cost: 'free',        sizes: [[1,1],[1,2],[4,2]], defaultW: 1, defaultH: 1, category: 'work' },
    tasksTimeline:   { id: 'tasksTimeline',   name: 'Timeline de tareas', desc: 'Mini gantt. Grande: plan semanal completo.',              icon: 'calendar',  cost: '180 monedas', sizes: [[1,1],[1,2],[4,2]], defaultW: 1, defaultH: 1, locked: true, category: 'work' },
    projectsActive:  { id: 'projectsActive',  name: 'Proyectos activos',  desc: 'Conteo. Grande: mini tablero por estatus.',               icon: 'folder',    cost: 'free',        sizes: [[1,1],[1,2],[4,2]], defaultW: 1, defaultH: 1, category: 'work' },
    projectsProgress:{ id: 'projectsProgress',name: 'Avance proyectos',   desc: 'Anillo global. Grande: % por proyecto.',                  icon: 'layers',    cost: '150 monedas', sizes: [[1,1],[1,2],[4,2]], defaultW: 1, defaultH: 1, locked: true, category: 'work' },
    subscriptions:   { id: 'subscriptions',   name: 'Suscripciones',      desc: 'Total mensual. Grande: lista de recurrentes.',            icon: 'film',      cost: '100 fragmentos',   sizes: [[1,1],[1,2],[4,2]], defaultW: 1, defaultH: 1, locked: true, category: 'finance' },
  });
}

if (typeof WIDGET_COMPONENTS !== 'undefined') {
  Object.assign(WIDGET_COMPONENTS, {
    gratitude:       ({ w, h }) => <WGratitude w={w} h={h} />,
    readingSession:  ({ ctx, w, h }) => <WReadingSession ctx={ctx} w={w} h={h} />,
    readingNotes:    ({ ctx, w, h }) => <WReadingNotes ctx={ctx} w={w} h={h} />,
    pomodoro:        ({ ctx, w, h }) => <WPomodoro ctx={ctx} w={w} h={h} />,
    courses:         ({ ctx, w, h }) => <WCourses ctx={ctx} w={w} h={h} />,
    nextClass:       ({ ctx, w, h }) => <WNextClass ctx={ctx} w={w} h={h} />,
    nextEpisode:     ({ ctx, w, h }) => <WNextEpisode ctx={ctx} w={w} h={h} />,
    watchYear:       ({ ctx, w, h }) => <WWatchYear ctx={ctx} w={w} h={h} />,
    nextHabit:       ({ ctx, w, h }) => <WNextHabit ctx={ctx} w={w} h={h} />,
    retoDays:        ({ ctx, w, h }) => <WRetoDays ctx={ctx} w={w} h={h} />,
    tasksPriority:   ({ ctx, w, h }) => <WTasksPriority ctx={ctx} w={w} h={h} />,
    tasksTimeline:   ({ ctx, w, h }) => <WTasksTimeline ctx={ctx} w={w} h={h} />,
    projectsActive:  ({ ctx, w, h }) => <WProjectsActive ctx={ctx} w={w} h={h} />,
    projectsProgress:({ ctx, w, h }) => <WProjectsProgress ctx={ctx} w={w} h={h} />,
    subscriptions:   ({ ctx, w, h }) => <WSubscriptions ctx={ctx} w={w} h={h} />,
  });
}

Object.assign(window, {
  WGratitude, WReadingSession, WReadingNotes, WPomodoro, WCourses, WNextClass,
  WNextEpisode, WWatchYear, WNextHabit, WRetoDays, WTasksPriority, WTasksTimeline,
  WProjectsActive, WProjectsProgress, WSubscriptions, WCard, WRing,
});

// ─────────────────────────────────────────────────────────────
// Bloque G · Centralized widget pricing — single source of truth for
// free vs paid. Drives BOTH the dashboard gallery and the Tienda store,
// so they never disagree. ~half are paid (monedas o fragmentos).
// ─────────────────────────────────────────────────────────────
const WIDGET_PRICING = {
  // FREE · base / esenciales (viven en el dashboard sin comprar)
  reto: 'free', habits: 'free', tasks: 'free', coach: 'free', streak: 'free',
  economy: 'free', diario: 'free', lectura: 'free', highlight: 'free', watch: 'free',
  pomodoro: 'free', readingSession: 'free', nextEpisode: 'free', tasksPriority: 'free',
  projectsActive: 'free', financeBalance: 'free',
  // PAID · monedas
  gratitude: '80 monedas', moodPicker: '80 monedas', weekMood: '150 monedas',
  nextHabit: '90 monedas', retoDays: '120 monedas', courses: '150 monedas',
  readingNotes: '120 monedas', nextClass: '150 monedas', games: '100 monedas',
  watchYear: '200 monedas', tasksTimeline: '180 monedas', projectsProgress: '150 monedas',
  financeExpenses: '120 monedas', goals: '300 monedas', weather: '600 monedas',
  // PAID · fragmentos (premium)
  bossPanel: '200 fragmentos', financeBudget: '100 fragmentos', subscriptions: '100 fragmentos',
};
if (typeof WIDGET_REGISTRY !== 'undefined') {
  Object.entries(WIDGET_PRICING).forEach(([id, cost]) => {
    const w = WIDGET_REGISTRY[id];
    if (!w) return;
    w.cost = cost;
    w.locked = cost !== 'free';
  });
  // Legacy placeholders that aren't real widgets — keep them out of catalogs.
  ['prompt', 'photo'].forEach(id => { if (WIDGET_REGISTRY[id]) WIDGET_REGISTRY[id].hidden = true; });
}
window.WIDGET_PRICING = WIDGET_PRICING;
