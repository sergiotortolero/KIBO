// tarea-detalle.jsx — La tarea como PANTALLA, no como modal.
//
// El modal sirve para editar de pasada; una tarea con proyecto, checklist,
// subtareas, recompensa y sobre todo un HISTÓRICO no cabe en una ventana
// flotante. Esta pantalla es el destino canónico de cualquier enlace a una
// tarea: el tablero, el proyecto, el buscador y KIBO llegan aquí.

const TASK_STATUS_LABELS = { todo: 'Por hacer', doing: 'En curso', blocked: 'Bloqueado', done: 'Hecho' };

// ── Histórico ────────────────────────────────────────────────────
// Cada evento dice QUIÉN, QUÉ y CUÁNDO. El tipo decide el ícono y el color, así
// que añadir un tipo nuevo no obliga a tocar la vista.
const TASK_EVENT_KINDS = {
  created:  { icon: 'plus',        color: 'var(--kb-primary)',     what: 'Tarea creada',        tag: 'Creación' },
  moved:    { icon: 'trending-up', color: 'var(--kb-gem)',         what: 'Movida de columna',   tag: 'Columna' },
  priority: { icon: 'flag',        color: 'var(--kb-streak)',      what: 'Prioridad cambiada',  tag: 'Prioridad' },
  check:    { icon: 'check',       color: 'var(--kb-good)',        what: 'Paso marcado',        tag: 'Pasos' },
  date:     { icon: 'calendar',    color: 'var(--area-will)',      what: 'Fechas ajustadas',    tag: 'Fechas' },
  note:     { icon: 'edit',        color: 'var(--area-community)', what: 'Nota escrita',        tag: 'Notas' },
  link:     { icon: 'folder',      color: 'var(--kb-coin-ink)',    what: 'Ligada a un proyecto',tag: 'Proyecto' },
  reward:   { icon: 'sparkle',     color: 'var(--kb-medal)',       what: 'Recompensa cobrada',  tag: 'Recompensa' },
};

function taskHistory(task) {
  if (task.history && task.history.length) return task.history;
  // Historia derivada del estado real de la tarea: así una tarea «hecha» no
  // muestra un histórico que se queda a medias.
  const day = 86400000;
  const ago = (n) => new Date(Date.now() - n * day).toISOString();
  const h = [
    { id: 'h1', kind: 'created', at: ago(9), who: 'Tú', what: task.title },
  ];
  if (task.project) {
    const proj = (window.DEMO_PROJECTS_FOR_FILTER || []).find(p => p.id === task.project);
    h.push({ id: 'h2', kind: 'link', at: ago(9), who: 'Tú', what: (proj && proj.name) || task.project });
  }
  h.push({ id: 'h3', kind: 'priority', at: ago(7), who: 'Tú', what: 'Media → ' + (({ urgent: 'Urgente', high: 'Alta', medium: 'Media', low: 'Baja', vlow: 'Muy baja' })[task.priority] || 'Media') });
  h.push({ id: 'h4', kind: 'date', at: ago(6), who: 'Tú', what: 'Fin objetivo en 3 días' });
  if (task.status !== 'todo') h.push({ id: 'h5', kind: 'moved', at: ago(4), who: 'Tú', what: 'Por hacer → ' + (TASK_STATUS_LABELS[task.status] || task.status) });
  if ((task.checklist || []).some(c => c.done)) h.push({ id: 'h6', kind: 'check', at: ago(3), who: 'Tú', what: (task.checklist.find(c => c.done) || {}).text });
  h.push({ id: 'h7', kind: 'note', at: ago(2), who: 'Tú', what: 'Pendiente confirmar alcance con el cliente antes de cerrar.' });
  if (task.status === 'done') h.push({ id: 'h8', kind: 'reward', at: ago(1), who: 'Kibo', what: 'XP y monedas acreditadas' });
  return h.reverse();
}

function fmtWhen(iso) {
  const d = new Date(iso), now = new Date();
  const days = Math.round((now - d) / 86400000);
  const hhmm = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  if (days <= 0) return 'Hoy · ' + hhmm;
  if (days === 1) return 'Ayer · ' + hhmm;
  if (days < 7) return `Hace ${days} días · ${hhmm}`;
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) + ' · ' + hhmm;
}

function TaskHistory({ task }) {
  const [filter, setFilter] = React.useState('all');
  const all = taskHistory(task);
  const kinds = [...new Set(all.map(e => e.kind))];
  const rows = filter === 'all' ? all : all.filter(e => e.kind === filter);
  return (
    <div className="kbv-card kbv-th">
      <SectionHead title="Histórico de cambios" meta={`${all.length} movimientos`} />
      <div className="th-filters">
        <button type="button" className={`kbv-chip ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>Todo</button>
        {kinds.map(k => (
          <button key={k} type="button" className={`kbv-chip ${filter === k ? 'on' : ''}`}
                  style={{ '--c': TASK_EVENT_KINDS[k].color }} onClick={() => setFilter(k)}>
            <KIcon name={TASK_EVENT_KINDS[k].icon} size={12} /> {TASK_EVENT_KINDS[k].tag}
          </button>
        ))}
      </div>
      <ol className="th-list">
        {rows.map(e => {
          const k = TASK_EVENT_KINDS[e.kind] || TASK_EVENT_KINDS.note;
          return (
            <li key={e.id} className="th-row" style={{ '--c': k.color }}>
              <span className="th-dot"><KIcon name={k.icon} size={13} /></span>
              <span className="th-body">
                <span className="th-line">{k.what} <em>· {e.who}</em></span>
                {e.what && <span className="th-what">{e.what}</span>}
              </span>
              <span className="th-when">{fmtWhen(e.at)}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// El salto al área respeta DESDE DÓNDE entras: desde una tarea, lo que sigue
// en la jerarquía es el frente de proyectos de esa área, no su progreso.
function goToArea(areaId, tab) {
  try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'areas', area: areaId, tab: tab || 'proyectos' } })); } catch (_) {}
}

const TD_TABS = [
  { id: 'detalle', label: 'Detalle', icon: 'list' },
  { id: 'pasos', label: 'Pasos', icon: 'check' },
  { id: 'historico', label: 'Histórico', icon: 'clock' },
];

function TaskDetailScreen({ taskId, onBack, onNavigate }) {
  const base = (window.DEMO_TASKS_FULL || []).find(t => t.id === taskId);
  const [t, setT] = React.useState(() => base ? { ...base } : null);
  const [tab, setTab] = React.useState('detalle');
  const [editOpen, setEditOpen] = React.useState(false);
  const [note, setNote] = React.useState('');
  const [toast, setToast] = React.useState(null);
  function flash(m) { setToast(m); clearTimeout(flash._t); flash._t = setTimeout(() => setToast(null), 2200); }

  if (!t) {
    return (
      <div className="kbv-main">
        <EmptyState icon="list" title="Esa tarea ya no existe"
                    body="Puede que se haya borrado. Vuelve al tablero para ver las de hoy."
                    action="Ir a Tareas" onAction={onBack} />
      </div>
    );
  }

  const area = KIBO_AREAS_V2.find(a => a.id === t.area);
  const proj = (window.DEMO_PROJECTS_FOR_FILTER || []).find(p => p.id === t.project);
  const pri = PRIORITY_DEFS[t.priority] || PRIORITY_DEFS.medium;
  const PRI_W = { urgent: 5, high: 4, medium: 3, low: 2, vlow: 1 };
  const xp = ((PRI_W[t.priority] || 2) * (t.energy || 2)) * 5;
  const coins = ((PRI_W[t.priority] || 2) * (t.energy || 2)) * 3;
  const checklist = t.checklist || [];
  const subtasks = t.subtasks || [];
  const clDone = checklist.filter(c => c.done).length;
  const stDone = subtasks.filter(s => s.done).length;
  const steps = checklist.length + subtasks.length;
  const stepsDone = clDone + stDone;

  function toggle(list, id) {
    setT(prev => ({ ...prev, [list]: (prev[list] || []).map(x => x.id === id ? { ...x, done: !x.done } : x) }));
  }
  function setStatus(s) {
    setT(prev => ({ ...prev, status: s }));
    flash(s === 'done' ? `Cerrada ✓ +${xp} XP · ${coins} monedas` : `Movida a «${TASK_STATUS_LABELS[s]}»`);
  }

  const pulse = [
    { l: 'Estado', v: TASK_STATUS_LABELS[t.status] || t.status },
    { l: 'Prioridad', v: pri.label, c: pri.color },
    { l: 'Energía', v: '·'.repeat(t.energy || 2) || '—' },
    { l: 'Tiempo', v: t.estTime || '—' },
    { l: 'Pasos', v: steps ? `${stepsDone}/${steps}` : '—' },
  ];

  return (
    <div className="kbv-main kbv-taskdetail" style={{ '--c': area?.color || 'var(--kb-primary)' }}>
      <button type="button" className="kbv-area-back" onClick={onBack}>
        <KIcon name="arrow-left" size={14} /> Todas las tareas
      </button>

      {/* Encabezado tintado, como el de un área */}
      <div className="kbv-area-detail-head td-head">
        <span className="adh-glyph"><KIcon name={area?.glyph || 'list'} size={26} /></span>
        <div className="adh-id">
          <div className="td-head-crumbs">
            <button type="button" className="td-crumb" onClick={() => goToArea(t.area, 'proyectos')}>
              <KIcon name={area?.glyph || 'layers'} size={11} /> {area?.name || 'Sin área'}
            </button>
            {proj && (
              <button type="button" className="td-crumb" onClick={() => onNavigate && onNavigate('projects', { project: proj.id })}>
                <KIcon name="folder" size={11} /> {proj.name}
              </button>
            )}
          </div>
          <h2 className="adh-name">{t.title}</h2>
          <p className="adh-desc">{t.description || 'Sin descripción todavía — edítala para dejar el contexto que necesitas al retomarla.'}</p>
        </div>
        <div className="td-head-reward">
          <span className="tdr-l">Al cerrar</span>
          <span className="tdr-v">+{xp} <em>XP</em></span>
          <span className="tdr-c">{coins} <CoinIcon size={12} /></span>
        </div>
      </div>

      {/* Pulso de la tarea: lo que se consulta de un vistazo */}
      <div className="kbv-card kbv-char-card td-pulse-card">
        <div className="kbv-area-pulsegrid">
          {pulse.map((m, i) => (
            <div key={i} className="apg-cell">
              <span className="apg-v" style={m.c ? { color: m.c } : undefined}>{m.v}</span>
              <span className="apg-l">{m.l}</span>
            </div>
          ))}
        </div>
        <div className="td-status">
          {Object.entries(TASK_STATUS_LABELS).map(([id, label]) => (
            <button key={id} type="button" className={`td-st ${t.status === id ? 'on' : ''} ${id}`}
                    onClick={() => setStatus(id)}>{label}</button>
          ))}
          <div className="td-status-acts">
            <button type="button" className="kbv-btn kbv-btn-secondary" onClick={() => setEditOpen(true)}>
              <KIcon name="edit" size={14} /> Editar
            </button>
            {t.status !== 'done' && (
              <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => setStatus('done')}>
                <KIcon name="check" size={14} /> Marcar hecha
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="kbv-store-tabs-v2" style={{ marginBottom: 4 }}>
        {TD_TABS.map(x => (
          <button key={x.id} type="button" className={tab === x.id ? 'on' : ''} onClick={() => setTab(x.id)}>
            <KIcon name={x.icon} size={14} /> {x.label}
          </button>
        ))}
      </div>

      {tab === 'detalle' && (
        <React.Fragment>
          <div className="kbv-card kbv-char-card">
            <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Ficha</h3><span className="kbv-meta">lo que define la tarea</span></div>
            <div className="kbv-detail-rows">
              <div className="row"><span className="l">Estado</span><span className="v">{TASK_STATUS_LABELS[t.status] || t.status}</span></div>
              <div className="row"><span className="l">Prioridad</span><span className="v" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><PriorityIcon level={t.priority} size={14} /> {pri.label}</span></div>
              <div className="row"><span className="l">Energía</span><span className="v"><EnergyMeter level={t.energy} size={10} /></span></div>
              <div className="row"><span className="l">Tiempo estimado</span><span className="v">{t.estTime || '—'}</span></div>
              <div className="row">
                <span className="l">Área</span>
                <span className="v">
                  {area ? (
                    <button type="button" className="area-chip with-icon as-link" style={{ '--c': area.color }} onClick={() => goToArea(area.id, 'proyectos')}>
                      <KIcon name={area.glyph} size={11} /> {area.name} <KIcon name="arrow-right" size={10} />
                    </button>
                  ) : 'Sin área'}
                </span>
              </div>
              <div className="row">
                <span className="l">Proyecto</span>
                <span className="v">
                  {proj ? (
                    <button type="button" className="td-link" onClick={() => onNavigate && onNavigate('projects', { project: proj.id })}>
                      {proj.name} <KIcon name="arrow-right" size={11} />
                    </button>
                  ) : 'Sin proyecto'}
                </span>
              </div>
            </div>
          </div>

          <div className="kbv-card kbv-char-card">
            <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Lo que mueve</h3><span className="kbv-meta">al cerrarla</span></div>
            <div className="td-rewards">
              <div className="td-rw" style={{ '--c': 'var(--kb-xp)' }}><span className="k">XP</span><strong>+{xp}</strong><em>{area?.name || 'Sin área'}</em></div>
              <div className="td-rw" style={{ '--c': 'var(--kb-coin)' }}><span className="k">Monedas</span><strong>{coins}</strong><em>{curLabel('coin')}</em></div>
            </div>
            <p className="kbv-meta" style={{ marginTop: 8 }}>Sale de la prioridad por la energía: lo difícil paga más.</p>
          </div>
        </React.Fragment>
      )}

      {tab === 'pasos' && (
        <React.Fragment>
          <div className="kbv-card kbv-char-card">
            <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Pasos</h3><span className="kbv-meta">{checklist.length ? `${clDone} de ${checklist.length}` : 'sin pasos'}</span></div>
            {checklist.length === 0 ? (
              <p className="kbv-meta">Divide la tarea en pasos para no perder el hilo al retomarla.</p>
            ) : (
              <div className="td-checks">
                {checklist.map(c => (
                  <button key={c.id} type="button" className={`td-check ${c.done ? 'on' : ''}`} onClick={() => toggle('checklist', c.id)}>
                    <span className="box">{c.done && <KIcon name="check" size={12} />}</span>
                    <span className="txt">{c.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="kbv-card kbv-char-card">
            <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Subtareas</h3><span className="kbv-meta">{subtasks.length ? `${stDone} de ${subtasks.length}` : 'sin subtareas'}</span></div>
            {subtasks.length === 0 ? (
              <p className="kbv-meta">Una subtarea es trabajo que podría vivir solo; un paso, no.</p>
            ) : (
              <div className="td-checks">
                {subtasks.map(s => (
                  <button key={s.id} type="button" className={`td-check ${s.done ? 'on' : ''}`} onClick={() => toggle('subtasks', s.id)}>
                    <span className="box">{s.done && <KIcon name="check" size={12} />}</span>
                    <span className="txt">{s.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </React.Fragment>
      )}

      {tab === 'historico' && (
        <React.Fragment>
          <TaskHistory task={t} />
          <div className="kbv-card kbv-char-card">
            <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Añadir una nota</h3><span className="kbv-meta">queda en el histórico</span></div>
            <div className="td-note">
              <textarea rows={2} value={note} placeholder="Qué pasó, qué falta, qué decidiste…"
                        onChange={(e) => setNote(e.target.value)} />
              <button type="button" className="kbv-btn kbv-btn-primary" disabled={!note.trim()}
                      onClick={() => {
                        setT(prev => ({ ...prev, history: [{ id: 'n' + Date.now(), kind: 'note', at: new Date().toISOString(), who: 'Tú', what: note.trim() }, ...taskHistory(prev)] }));
                        setNote(''); flash('Nota guardada en el histórico');
                      }}>
                <KIcon name="plus" size={14} /> Añadir
              </button>
            </div>
          </div>
        </React.Fragment>
      )}

      {editOpen && typeof TaskDetailModal === 'function' && (
        <TaskDetailModal task={t} onClose={() => setEditOpen(false)} onSave={(next) => { setT(next); flash('Cambios guardados'); }} />
      )}
      {toast && <div className="kbv-toast show">{toast}</div>}
    </div>
  );
}

Object.assign(window, { TaskDetailScreen, TaskHistory, taskHistory, TASK_STATUS_LABELS, TASK_EVENT_KINDS, goToArea });
