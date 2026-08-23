// widgets-v4.jsx — Widgets de lo construido en los últimos bloques.
//
// El tablero se quedó en la primera generación de funciones (hábitos, retos,
// tareas, diario, lectura). Todo lo que vino después —cronograma explorable,
// proyectos con avance derivado, backlog, Familia, Escuela, prestigios
// renombrables, personalización, origen del dinero— no tenía forma de asomarse
// a «Hoy». Estos widgets son esa asomada: cada uno lee la MISMA fuente que su
// pantalla y lleva a ella; ninguno inventa su propio número.

// Cáscara común: encabezado con glifo, cuerpo y pie que lleva a la pantalla.
// Sin ella cada widget volvía a decidir su tipografía y sus márgenes.
function W4({ icon, title, meta, color, to, cta, children, onGo }) {
  function go() {
    if (onGo) { onGo(); return; }
    if (!to) return;
    try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: typeof to === 'string' ? { screen: to } : to })); } catch (_) {}
  }
  return (
    <div className="kbv-card w4" style={{ '--c': color || 'var(--kb-primary)' }}>
      <div className="w4-head">
        <span className="w4-ico"><KIcon name={icon} size={15} /></span>
        <span className="w4-id">
          <strong>{title}</strong>
          {meta && <em>{meta}</em>}
        </span>
      </div>
      <div className="w4-body">{children}</div>
      {cta && (
        <button type="button" className="w4-go" onClick={go}>
          {cta} <KIcon name="arrow-right" size={12} />
        </button>
      )}
    </div>
  );
}

// Filas que caben según el alto del tile (1 fila ≈ 32px + cabecera y pie).
function w4Rows(h) { return h >= 3 ? 8 : h >= 2 ? 5 : 2; }

const D4 = 86400000;
function w4Days(ms) { return Math.round((ms - Date.now()) / D4); }
function w4When(n) {
  if (n < 0) return { t: `${-n}d tarde`, late: true };
  if (n === 0) return { t: 'hoy', soon: true };
  if (n === 1) return { t: 'mañana', soon: true };
  return { t: `en ${n}d` };
}

// ── Cronograma · lo que vence pronto ─────────────────────────────
// El gantt vive en Proyectos y en Tareas; aquí solo su borde de ataque.
function CronoWidget({ h = 1 }) {
  const projects = (window.DEMO_PROJECTS_KANBAN || []).slice();
  const seeded = (typeof seedProjectDates === 'function') ? seedProjectDates(projects) : projects;
  const rows = seeded
    .filter(p => p.tlEnd)
    .map(p => ({ ...p, d: w4Days(p.tlEnd) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, w4Rows(h));
  const late = rows.filter(r => r.d < 0).length;

  return (
    <W4 icon="calendar" title="Cronograma" color="var(--kb-primary)"
        meta={late ? `${late} vencido${late > 1 ? 's' : ''}` : 'nada vencido'}
        to="projects" cta="Abrir el cronograma">
      <div className="w4-list">
        {rows.map(p => {
          const area = (window.KIBO_AREAS_V2 || []).find(a => a.id === p.area);
          const when = w4When(p.d);
          return (
            <button key={p.id} type="button" className="w4-row"
                    style={{ '--rc': area ? area.color : 'var(--kb-text-3)' }}
                    onClick={() => { try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'projects', project: p.id } })); } catch (_) {} }}>
              <i className="w4-dot" />
              <span className="w4-row-t">{p.name}</span>
              <span className={`w4-when ${when.late ? 'late' : when.soon ? 'soon' : ''}`}>{when.t}</span>
            </button>
          );
        })}
        {!rows.length && <span className="w4-empty">Sin fechas puestas todavía.</span>}
      </div>
    </W4>
  );
}

// ── Proyectos en curso ───────────────────────────────────────────
// El avance sale de `projectPct`, la misma función que usan la tarjeta y el
// detalle: un porcentaje calculado aquí volvería a divergir del de allá.
function ProyectosWidget({ h = 1 }) {
  const all = window.DEMO_PROJECTS_KANBAN || [];
  const pct = (p) => (typeof projectPct === 'function' ? projectPct(p) : (p.progress || 0));
  const wip = all.filter(p => p.status === 'wip');
  const rows = (wip.length ? wip : all).slice(0, w4Rows(h));
  const avg = wip.length ? Math.round(wip.reduce((a, p) => a + pct(p), 0) / wip.length) : 0;

  return (
    <W4 icon="folder" title="Proyectos" color="var(--area-wisdom)"
        meta={`${wip.length} en curso · ${avg}% medio`} to="projects" cta="Ver todos">
      <div className="w4-list">
        {rows.map(p => {
          const area = (window.KIBO_AREAS_V2 || []).find(a => a.id === p.area);
          return (
            <button key={p.id} type="button" className="w4-row bar"
                    style={{ '--rc': area ? area.color : 'var(--kb-primary)' }}
                    onClick={() => { try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'projects', project: p.id } })); } catch (_) {} }}>
              <span className="w4-row-t">{p.name}</span>
              <span className="w4-bar"><i style={{ width: pct(p) + '%' }} /></span>
              <span className="w4-pct">{pct(p)}%</span>
            </button>
          );
        })}
        {!rows.length && <span className="w4-empty">Todavía no hay proyectos.</span>}
      </div>
    </W4>
  );
}

// ── Familia · lo que espera tu visto bueno ───────────────────────
function FamiliaWidget({ h = 1 }) {
  const members = window.FAMILY_MEMBERS || [];
  const quests = window.FAMILY_QUESTS || [];
  const pend = quests.filter(q => q.status === 'por-aprobar').map(q => {
    const m = members.find(x => x.id === q.who);
    return { id: q.id, who: (m && m.name) || 'Familia', what: q.name, xp: q.xp };
  });
  return (
    <W4 icon="shield" title="Familia" color="var(--area-community)"
        meta={pend.length ? `${pend.length} por aprobar` : 'todo al día'}
        to="familia" cta="Abrir Familia">
      <div className="w4-list">
        {pend.slice(0, w4Rows(h)).map(p => (
          <div key={p.id} className="w4-row" style={{ '--rc': 'var(--area-community)' }}>
            <span className="w4-av">{p.who.slice(0, 1)}</span>
            <span className="w4-row-t">{p.what}</span>
            <span className="w4-xp">+{p.xp}</span>
          </div>
        ))}
        {!pend.length && <span className="w4-empty">Nadie espera tu aprobación.</span>}
      </div>
    </W4>
  );
}

// ── Escuela · la siguiente entrega ───────────────────────────────
function EscuelaWidget({ h = 1 }) {
  // Lo pendiente sale de las materias reales: un rubro sin calificar es una
  // entrega que sigue viva. Inventar aquí una lista propia era justo lo que
  // este archivo promete no hacer.
  const subs = window.SCHOOL_SUBJECTS || [];
  const rows = subs.map((s, i) => {
    const pend = (s.evals || []).filter(e => e.grade == null);
    return {
      id: s.id, name: s.name, color: s.color,
      next: pend.length ? pend[0].name : (s.schedule || 'al corriente'),
      dleft: pend.length ? 2 + i * 3 : 7 + i,
      open: pend.length,
    };
  }).sort((a, b) => b.open - a.open).slice(0, w4Rows(h));
  const open = subs.reduce((a, s) => a + (s.evals || []).filter(e => e.grade == null).length, 0);
  return (
    <W4 icon="graduation" title="Escuela" color="var(--area-wisdom)"
        meta={`${subs.length} materias · ${open} sin calificar`} to="estudio" cta="Ver el horario">
      <div className="w4-list">
        {!rows.length && <span className="w4-empty">Sin materias registradas todavía.</span>}
        {rows.map(s => {
          const when = w4When(typeof s.dleft === 'number' ? s.dleft : 3);
          return (
            <button key={s.id} type="button" className="w4-row" style={{ '--rc': s.color || 'var(--area-wisdom)' }}
                    onClick={() => { try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'estudio', subject: s.id } })); } catch (_) {} }}>
              <i className="w4-dot" />
              <span className="w4-row-t">{s.name}<em>{s.next || 'sin pendientes'}</em></span>
              <span className={`w4-when ${when.late ? 'late' : when.soon ? 'soon' : ''}`}>{when.t}</span>
            </button>
          );
        })}
      </div>
    </W4>
  );
}

// ── Prestigio · con el nombre que TÚ le pusiste ──────────────────
// Lee `prestigeName`, así renombrar la familia se ve también aquí.
function PrestigioWidget() {
  if (typeof usePrestigeNames === 'function') usePrestigeNames();
  const n = 8, level = 62, cap = 100;
  const name = (typeof prestigeName === 'function') ? prestigeName(n) : 'Prestigio';
  const next = (typeof prestigeName === 'function') ? prestigeName(n + 1) : '';
  return (
    <W4 icon="crown" title="Prestigio" color="var(--kb-medal)"
        meta={`P${n} · ${name}`} to="progreso" cta="Ver mi progreso">
      <div className="w4-hero">
        <span className="w4-big">{level}<i>/{cap}</i></span>
        <span className="w4-cap">nivel · te faltan {cap - level} para <b>{next}</b></span>
        <span className="w4-bar wide"><i style={{ width: (level / cap * 100) + '%' }} /></span>
      </div>
    </W4>
  );
}

// ── De dónde salió el dinero ─────────────────────────────────────
// La bolsa dice cuánto tienes; esto, de qué. Usa la divisa elegida.
function OrigenWidget({ h = 1 }) {
  if (typeof useCurrencyRepaint === 'function') useCurrencyRepaint();
  const label = (typeof curLabel === 'function') ? curLabel('coin') : 'monedas';
  const all = [
    { id: 'o1', k: 'Hábitos', v: 210, c: 'var(--kb-streak)', icon: 'flame' },
    { id: 'o2', k: 'Tareas', v: 145, c: 'var(--area-wisdom)', icon: 'list' },
    { id: 'o3', k: 'Retos', v: 90, c: 'var(--kb-boss)', icon: 'sword' },
  ];
  // En 1×1 solo caben dos filas. El total suma LO QUE SE VE: un encabezado que
  // cuenta una fila recortada contradice a su propio widget.
  const src = all.slice(0, w4Rows(h));
  const total = src.reduce((a, x) => a + x.v, 0);
  return (
    <W4 icon="trending-up" title={`De dónde salieron`} color="var(--kb-coin)"
        meta={`${total} ${label} · ${src.length === all.length ? 'esta semana' : 'top ' + src.length}`}
        to="progreso" cta="Ver el historial">
      <div className="w4-list">
        {src.map(s => (
          <div key={s.id} className="w4-row bar" style={{ '--rc': s.c }}>
            <span className="w4-row-t"><KIcon name={s.icon} size={12} /> {s.k}</span>
            <span className="w4-bar"><i style={{ width: (s.v / total * 100) + '%' }} /></span>
            <span className="w4-pct">{s.v}</span>
          </div>
        ))}
      </div>
    </W4>
  );
}

// ── Personalización · atajo a lo que se ve ───────────────────────
function PersonalizarWidget() {
  const tabs = [
    { id: 'kibo', n: 'KIBO', icon: 'user' },
    { id: 'carta', n: 'Carta', icon: 'image' },
    { id: 'prestigio', n: 'Prestigio', icon: 'crown' },
    { id: 'divisas', n: 'Divisas', icon: 'sparkle' },
  ];
  return (
    <W4 icon="sparkle" title="Personalización" color="var(--kb-primary)" meta="cómo se ve todo lo tuyo">
      <div className="w4-chips">
        {tabs.map(t => (
          <button key={t.id} type="button" className="w4-chip"
                  onClick={() => { try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'personalizar', tab: t.id } })); } catch (_) {} }}>
            <KIcon name={t.icon} size={13} /> {t.n}
          </button>
        ))}
      </div>
    </W4>
  );
}

// ── Backlog general · lo que no cabe en «hoy» ────────────────────
function BacklogWidget({ h = 1 }) {
  const tasks = window.DEMO_TASKS_FULL || [];
  const open = tasks.filter(t => t.status !== 'done');
  const byBucket = {};
  open.forEach(t => { const b = t.bucket || 'despues'; byBucket[b] = (byBucket[b] || 0) + 1; });
  const LB = { hoy: 'Hoy', semana: 'Esta semana', mes: 'Este mes', despues: 'Después' };
  const rows = Object.keys(LB).filter(k => byBucket[k]).slice(0, w4Rows(h));
  return (
    <W4 icon="layers" title="Backlog" color="var(--kb-text-2)"
        meta={`${open.length} abiertas`} to="tareas" cta="Abrir el backlog">
      <div className="w4-list">
        {rows.map(k => (
          <button key={k} type="button" className="w4-row" style={{ '--rc': 'var(--kb-primary)' }}
                  onClick={() => { try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'tareas', bucket: k } })); } catch (_) {} }}>
            <i className="w4-dot" />
            <span className="w4-row-t">{LB[k]}</span>
            <span className="w4-count">{byBucket[k]}</span>
          </button>
        ))}
      </div>
    </W4>
  );
}

if (typeof WIDGET_COMPONENTS !== 'undefined') {
  Object.assign(WIDGET_COMPONENTS, {
    crono: (props) => <CronoWidget {...props} />,
    proyectos: (props) => <ProyectosWidget {...props} />,
    familia: (props) => <FamiliaWidget {...props} />,
    escuela: (props) => <EscuelaWidget {...props} />,
    prestigio: (props) => <PrestigioWidget {...props} />,
    origen: (props) => <OrigenWidget {...props} />,
    personalizar: (props) => <PersonalizarWidget {...props} />,
    backlog: (props) => <BacklogWidget {...props} />,
  });
}

if (typeof WIDGET_REGISTRY !== 'undefined') {
  Object.assign(WIDGET_REGISTRY, {
    crono:        { id: 'crono',        name: 'Cronograma',        desc: 'Lo que vence pronto, del mismo cronograma de Proyectos.',   icon: 'calendar',    cost: 'free', sizes: [[1,1],[2,1],[2,2],[4,1]], defaultW: 2, defaultH: 1, category: 'today' },
    proyectos:    { id: 'proyectos',    name: 'Proyectos',         desc: 'En curso y su avance real, derivado de sus tareas.',        icon: 'folder',      cost: 'free', sizes: [[1,1],[2,1],[2,2],[4,1]], defaultW: 2, defaultH: 1, category: 'today' },
    backlog:      { id: 'backlog',      name: 'Backlog',           desc: 'Cuánto hay abierto y en qué momento cae.',                  icon: 'layers',      cost: 'free', sizes: [[1,1],[2,1],[2,2]],       defaultW: 1, defaultH: 1, category: 'today' },
    familia:      { id: 'familia',      name: 'Familia',           desc: 'Lo que espera tu visto bueno en el panel familiar.',        icon: 'shield',      cost: 'free', sizes: [[1,1],[2,1],[2,2]],       defaultW: 1, defaultH: 1, category: 'personal' },
    escuela:      { id: 'escuela',      name: 'Escuela',           desc: 'Tus materias y la siguiente entrega.',                      icon: 'graduation',  cost: 'free', sizes: [[1,1],[2,1],[2,2]],       defaultW: 1, defaultH: 1, category: 'personal' },
    prestigio:    { id: 'prestigio',    name: 'Prestigio',         desc: 'Tu prestigio con el nombre de la familia que elegiste.',    icon: 'crown',       cost: 'free', sizes: [[1,1],[2,1]],             defaultW: 1, defaultH: 1, category: 'today' },
    origen:       { id: 'origen',       name: 'De dónde salieron', desc: 'Qué te está pagando: hábitos, tareas o retos.',             icon: 'trending-up', cost: 'free', sizes: [[1,1],[2,1],[2,2]],       defaultW: 1, defaultH: 1, category: 'today' },
    personalizar: { id: 'personalizar', name: 'Personalización',   desc: 'Atajo a KIBO, tu carta, prestigios y divisas.',             icon: 'sparkle',     cost: 'free', sizes: [[1,1],[2,1]],             defaultW: 1, defaultH: 1, category: 'today' },
  });
}

Object.assign(window, {
  W4, CronoWidget, ProyectosWidget, FamiliaWidget, EscuelaWidget,
  PrestigioWidget, OrigenWidget, PersonalizarWidget, BacklogWidget,
});
