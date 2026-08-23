// screens-v2.jsx — New screens: Tareas, Proyectos, Tienda, Lectura, Diario, Finanzas
// All routed from the sidebar in dashboard-v2.jsx

// =================================================================
// Shared visual primitives — priority icons + energy meter
// =================================================================
function PriorityIcon({ level, size = 20, withLabel = false }) {
  const def = PRIORITY_DEFS[level] || PRIORITY_DEFS.medium;
  const c = def.color;
  // Shape per priority — small custom glyphs
  let glyph = null;
  switch (level) {
    case 'urgent': // double-up triangle + dot
      glyph = (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M5 11 L12 4 L19 11 Z" fill={c} />
          <path d="M5 20 L12 13 L19 20 Z" fill={c} opacity="0.55" />
        </svg>
      );
      break;
    case 'high':
      glyph = (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M4 17 L12 6 L20 17 Z" fill={c} />
        </svg>
      );
      break;
    case 'medium':
      glyph = (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="4" y="10" width="16" height="4" rx="2" fill={c} />
        </svg>
      );
      break;
    case 'low':
      glyph = (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M4 8 L20 8 L12 18 Z" fill={c} />
        </svg>
      );
      break;
    case 'vlow':
      glyph = (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M5 5 L19 5 L12 12 Z" fill={c} opacity="0.55" />
          <path d="M5 12 L19 12 L12 19 Z" fill={c} />
        </svg>
      );
      break;
    default:
      glyph = <span>{def.label}</span>;
  }
  if (!withLabel) return <span className="kbv-pri-glyph" title={def.label} aria-label={def.label}>{glyph}</span>;
  return (
    <span className="kbv-pri-glyph withlabel" title={def.label}>
      {glyph}
      <span style={{ color: c, fontWeight: 700, fontSize: 11, fontFamily: 'var(--kb-f-mono)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{def.label}</span>
    </span>
  );
}

// Medidor de esfuerzo — delega en Scale5, el indicador 1–5 canónico
// (mismo gráfico que la dificultad de retos y las rúbricas de estudio).
function EnergyMeter({ level = 3, size = 14 }) {
  return <Scale5 value={level} color="var(--kb-streak)" size={size / 14} label="Esfuerzo" />;
}

// =================================================================
// TAREAS — Kanban + filters + create-task modal
// =================================================================
const TASK_COLUMNS = [
  { id: 'todo',    name: 'Por hacer',  color: 'var(--pri-vlow)', locked: true,  position: 'first' },
  { id: 'doing',   name: 'En curso',   color: 'var(--kb-coin)', locked: false },
  { id: 'blocked', name: 'Bloqueado',  color: 'var(--kb-hp)', locked: false },
  { id: 'done',    name: 'Hecho',      color: 'var(--kb-primary)', locked: true,  position: 'last' },
];

const DEMO_TASKS_FULL = [
  { id: 'ta1', title: 'Cerrar propuesta para cliente Aurora',   area: 'wealth',    project: 'aurora', priority: 'urgent', energy: 4, estTime: '2h',  status: 'doing'  },
  { id: 'ta2', title: 'Llamar a finanzas por presupuesto',       area: 'wealth',    project: 'aurora', priority: 'high',   energy: 2, estTime: '30m', status: 'todo'   },
  { id: 'ta3', title: 'Correr 5 km — zona 2',                    area: 'vigor',     project: 'maraton',priority: 'high',   energy: 3, estTime: '1h',  status: 'todo'   },
  { id: 'ta4', title: 'Leer cap. 3 de Atomic Habits',            area: 'wisdom',    project: null,     priority: 'high',   energy: 2, estTime: '45m', status: 'doing'  },
  { id: 'ta5', title: 'Llamar a mamá',                           area: 'community', project: null,     priority: 'medium', energy: 1, estTime: '30m', status: 'todo'   },
  { id: 'ta6', title: 'Meditar 10 min sin pantalla',             area: 'will',      project: null,     priority: 'medium', energy: 1, estTime: '10m', status: 'done'   },
  { id: 'ta7', title: 'Revisar gastos de la semana',             area: 'wealth',    project: 'ynab',   priority: 'low',    energy: 2, estTime: '20m', status: 'doing'  },
  { id: 'ta8', title: 'Esperar respuesta del cliente Beta',      area: 'wealth',    project: null,     priority: 'medium', energy: 1, estTime: '5m',  status: 'blocked'},
  { id: 'ta9', title: 'Estiramientos AM',                        area: 'vigor',     project: null,     priority: 'medium', energy: 1, estTime: '10m', status: 'done'   },
  { id: 'ta10',title: 'Setup curso System Design — laptop',      area: 'wisdom',    project: 'system-design', priority: 'urgent', energy: 3, estTime: '1h', status: 'todo' },
  { id: 'ta11',title: 'Comprar tarjeta de regalo para Andrés',   area: 'community', project: null,     priority: 'low',    energy: 1, estTime: '15m', status: 'done'   },
  { id: 'ta12',title: 'Diario nocturno',                         area: 'will',      project: null,     priority: 'low',    energy: 1, estTime: '10m', status: 'todo'   },

  // ── Tareas académicas (Estudio) — viven en el mismo tablero de Tareas, área Sabiduría.
  //    Mismo modelo y mismo detalle que cualquier tarea de proyecto (homologado).
  { id: 'at1', title: 'Tarea 4 — Integrales por partes', area: 'wisdom', project: 'calculo-2', priority: 'high', energy: 3, estTime: '2h', status: 'doing', taskType: 'entrega',
    startDate: '2026-05-26', endDate: '2026-05-30', dueLabel: '30 May', dleft: 1,
    description: 'Ejercicios 4.1 a 4.20 del Stewart. Entregar en PDF por el campus de la materia.',
    checklist: [{ id: 'a1c1', text: 'Resolver ej. 4.1–4.10', done: true }, { id: 'a1c2', text: 'Resolver ej. 4.11–4.20', done: false }, { id: 'a1c3', text: 'Revisar y exportar a PDF', done: false }, { id: 'a1c4', text: 'Subir al campus', done: false }],
    subtasks: [{ id: 'a1s1', text: 'Repasar fórmula de integración por partes', done: true }] },
  { id: 'at2', title: 'Estudiar parcial de Cálculo II', area: 'wisdom', project: 'calculo-2', priority: 'urgent', energy: 5, estTime: '6h', status: 'todo', taskType: 'examen',
    startDate: '2026-06-01', endDate: '2026-06-06', dueLabel: '06 Jun', dleft: 8,
    description: 'Temas 3 y 4. Hacer 2 exámenes de práctica completos y repasar errores.',
    checklist: [{ id: 'a2c1', text: 'Repasar tema 3', done: false }, { id: 'a2c2', text: 'Repasar tema 4', done: false }, { id: 'a2c3', text: 'Examen muestra 1', done: false }, { id: 'a2c4', text: 'Examen muestra 2', done: false }],
    subtasks: [] },
  { id: 'at3', title: 'Proyecto final — esquema de BD', area: 'wisdom', project: 'bases-datos', priority: 'medium', energy: 4, estTime: '10h', status: 'todo', taskType: 'proyecto',
    startDate: '2026-06-05', endDate: '2026-06-20', dueLabel: '20 Jun', dleft: 22,
    description: 'Diseñar el modelo entidad-relación y normalizar a 3FN. Entregar documentación.',
    checklist: [{ id: 'a3c1', text: 'Modelo entidad-relación', done: false }, { id: 'a3c2', text: 'Normalización a 3FN', done: false }, { id: 'a3c3', text: 'Documentación', done: false }],
    subtasks: [{ id: 'a3s1', text: 'Definir entidades principales', done: false }, { id: 'a3s2', text: 'Diccionario de datos', done: false }] },
  { id: 'at4', title: 'Quiz 3 — Álgebra lineal', area: 'wisdom', project: 'algebra-lineal', priority: 'high', energy: 2, estTime: '1h', status: 'todo', taskType: 'examen',
    startDate: '2026-05-30', endDate: '2026-06-02', dueLabel: '02 Jun', dleft: 4,
    description: 'Espacios vectoriales y bases. Repasar ejercicios de la clase.',
    checklist: [{ id: 'a4c1', text: 'Releer apuntes de espacios vectoriales', done: false }, { id: 'a4c2', text: 'Resolver ejercicios de práctica', done: false }],
    subtasks: [] },
  { id: 'at5', title: 'Entrega: práctica 5 — BD', area: 'wisdom', project: 'bases-datos', priority: 'medium', energy: 2, estTime: '1.5h', status: 'done', taskType: 'entrega',
    startDate: '2026-05-24', endDate: '2026-05-28', dueLabel: '28 May', dleft: 0,
    description: 'Consultas SQL con JOINs sobre la base de ejemplo.',
    checklist: [{ id: 'a5c1', text: 'Resolver consultas', done: true }, { id: 'a5c2', text: 'Subir al campus', done: true }],
    subtasks: [] },
  { id: 'at6', title: 'Módulo 4 — System Design', area: 'wisdom', project: 'system-design', priority: 'high', energy: 3, estTime: '3h', status: 'doing', taskType: 'entrega',
    startDate: '2026-05-27', endDate: '2026-06-03', dueLabel: '03 Jun', dleft: 5,
    description: 'Completar el módulo de diseño de sistemas escalables y el ejercicio final.',
    checklist: [{ id: 'a6c1', text: 'Ver lecciones del módulo', done: true }, { id: 'a6c2', text: 'Ejercicio: diseñar un acortador de URLs', done: false }],
    subtasks: [] },
];

const DEMO_PROJECTS_FOR_FILTER = [
  { id: 'aurora',        name: 'Cliente Aurora',         area: 'wealth' },
  { id: 'maraton',       name: 'Maratón otoño 2026',    area: 'vigor' },
  { id: 'system-design', name: 'System Design Interview', area: 'wisdom' },
  { id: 'ynab',          name: 'Migrar gastos a YNAB',  area: 'wealth' },
  // Académicos — materias y cursos de Estudio aparecen como proyectos filtrables.
  { id: 'calculo-2',      name: 'Cálculo II',                   area: 'wisdom' },
  { id: 'algebra-lineal', name: 'Álgebra lineal',               area: 'wisdom' },
  { id: 'bases-datos',    name: 'Bases de datos',               area: 'wisdom' },
  { id: 'swiftui',        name: 'SwiftUI desde cero',           area: 'wisdom' },
  { id: 'ml-spec',        name: 'Machine Learning Specialization', area: 'wisdom' },
];

function KanbanCard({ task, onDragStart, onClick }) {
  const area = KIBO_AREAS_V2.find(a => a.id === task.area);
  const proj = DEMO_PROJECTS_FOR_FILTER.find(p => p.id === task.project);
  // Reward calc: priority weight × energy
  const PRI_W = { urgent: 5, high: 4, medium: 3, low: 2, vlow: 1 };
  const coinReward = ((PRI_W[task.priority] || 2) * (task.energy || 2)) * 3;
  return (
    <div
      className="kbv-kanban-card"
      style={{ '--c': area ? area.color : 'var(--kb-text-3)' }}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onClick={onClick}
    >
      <div className="title">
        <PriorityIcon level={task.priority} size={16} />
        <span style={{ flex: 1 }}>{task.title}</span>
      </div>
      <div className="meta">
        {area && (
          <button type="button" className="area-chip with-icon as-link" title={`Ir a ${area.name}`}
                  style={{ '--c': area.color }}
                  onClick={(e) => { e.stopPropagation(); goToArea(area.id, 'proyectos'); }}>
            <KIcon name={area.glyph} size={11} />
            {area.name}
          </button>
        )}
        {proj && (
          <span className="project-chip" title="Proyecto">
            <KIcon name="folder" size={11} />
            {proj.name}
          </span>
        )}
      </div>
      <div className="meta">
        {task.estTime && (
          <span className="kbv-meta" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <KIcon name="clock" size={11} /> {task.estTime}
          </span>
        )}
        <EnergyMeter level={task.energy} size={11} />
        <span className="task-coins" title={`Recompensa: ${coinReward} monedas al cerrar`}>
          <CoinIcon size={10} /> +{coinReward}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Task detail modal — descripción, checklist, subtareas, fechas
// ─────────────────────────────────────────────────────────────
function TaskDetailModal({ task, onClose, onSave }) {
  const [t, setT] = React.useState({
    description: task.description || '',
    checklist: task.checklist || [
      { id: 'cl1', text: 'Revisar contexto del proyecto', done: true },
      { id: 'cl2', text: 'Draft inicial del documento', done: true },
      { id: 'cl3', text: 'Pasar por revisión interna', done: false },
      { id: 'cl4', text: 'Enviar versión final al cliente', done: false },
    ],
    subtasks: task.subtasks || [
      { id: 'st1', text: 'Lanzar reunión de kickoff', done: false },
      { id: 'st2', text: 'Compartir doc con Ana', done: false },
    ],
    startDate: task.startDate || new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10),
    endDate: task.endDate || new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
    notes: task.notes || '',
    title: task.title,
    ...task,
  });
  const [editingMeta, setEditingMeta] = React.useState(false);
  const [newChecklist, setNewChecklist] = React.useState('');
  const [newSubtask, setNewSubtask] = React.useState('');

  const area = KIBO_AREAS_V2.find(a => a.id === t.area);
  const proj = DEMO_PROJECTS_FOR_FILTER.find(p => p.id === t.project);
  const pri = PRIORITY_DEFS[t.priority] || PRIORITY_DEFS.medium;

  const PRI_W = { urgent: 5, high: 4, medium: 3, low: 2, vlow: 1 };
  const coinReward = ((PRI_W[t.priority] || 2) * (t.energy || 2)) * 3;
  const xpReward = ((PRI_W[t.priority] || 2) * (t.energy || 2)) * 5;

  const clDone = t.checklist.filter(c => c.done).length;
  const clTotal = t.checklist.length;
  const stDone = t.subtasks.filter(s => s.done).length;
  const stTotal = t.subtasks.length;

  function update(field, value) { setT(prev => ({ ...prev, [field]: value })); }
  function toggleCl(id) { update('checklist', t.checklist.map(c => c.id === id ? { ...c, done: !c.done } : c)); }
  function toggleSt(id) { update('subtasks',  t.subtasks.map(s  => s.id === id ? { ...s, done: !s.done } : s)); }
  function addCl()      { if (!newChecklist.trim()) return; update('checklist', [...t.checklist, { id: 'cl' + Date.now(), text: newChecklist.trim(), done: false }]); setNewChecklist(''); }
  function addSt()      { if (!newSubtask.trim()) return; update('subtasks', [...t.subtasks, { id: 'st' + Date.now(), text: newSubtask.trim(), done: false }]); setNewSubtask(''); }
  function delCl(id)    { update('checklist', t.checklist.filter(c => c.id !== id)); }
  function delSt(id)    { update('subtasks',  t.subtasks.filter(s  => s.id !== id)); }

  return (
    <KBVModal
      title={t.title}
      sub={`Tarea · ${area?.name || 'Sin área'}${proj ? ' · ' + proj.name : ''}`}
      onClose={onClose}
      size="lg"
      footer={
        <div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="kbv-reward-pill" title="Recompensa al cerrar"><KIcon name="sparkle" size={13} /> Al cerrar: <strong>+{xpReward} XP</strong> · <strong>{coinReward}</strong> <CoinIcon size={11} /></span>
          <button type="button" className="kbv-btn kbv-btn-secondary"
                  onClick={() => { onClose(); try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'tarea', taskId: t.id } })); } catch (_) {} }}>
            <KIcon name="layers" size={14} /> Ver pantalla completa
          </button>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => { onSave && onSave(t); onClose(); }}>
            Guardar <KIcon name="check" size={14} />
          </button>
        </div>
      }>
      <div className="kbv-task-detail">
        {/* Header strip with meta — toggleable edit */}
        <div className="task-meta-strip">
          <span className={`pri-glyph-wrap`} style={{ '--c': pri.color }}>
            <PriorityIcon level={t.priority} size={20} />
            <strong>{pri.label}</strong>
          </span>
          <span className="task-divider" />
          <span className="meta-stat" title="Esfuerzo que requiere">
            <EnergyMeter level={t.energy} size={14} />
            <strong>{t.energy}/5</strong>
          </span>
          {t.estTime && (
            <>
              <span className="task-divider" />
              <span className="meta-stat" title="Tiempo estimado">
                <KIcon name="clock" size={14} />
                <strong>{t.estTime}</strong>
              </span>
            </>
          )}
          <span className="task-divider" />
          {area && (
            <button type="button" className="area-chip with-icon as-link" title={`Ir a ${area.name}`}
                    style={{ '--c': area.color }}
                    onClick={(e) => { e.stopPropagation(); goToArea(area.id, 'proyectos'); }}>
              <KIcon name={area.glyph} size={11} />
              {area.name}
            </button>
          )}
          {proj && (
            <span className="project-chip">
              <KIcon name="folder" size={11} /> {proj.name}
            </span>
          )}
          <button type="button" className="kbv-btn kbv-btn-ghost task-edit-btn" onClick={() => setEditingMeta(m => !m)}>
            <KIcon name="edit" size={11} /> {editingMeta ? 'Listo' : 'Editar'}
          </button>
        </div>

        {/* Edit meta block (only when toggled) */}
        {editingMeta && (
          <div className="task-edit-grid">
            <div className="kbv-form-row">
              <label>Título</label>
              <input type="text" value={t.title} onChange={(e) => update('title', e.target.value)} />
            </div>
            <div className="kbv-form-row">
              <label>Prioridad</label>
              <div className="kbv-cat-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                {PRIORITY_ORDER.map(p => (
                  <button key={p} type="button"
                          className={`kbv-cat-tile ${t.priority === p ? 'on' : ''}`}
                          style={{ '--c': PRIORITY_DEFS[p].color }}
                          onClick={() => update('priority', p)}>
                    <span className="glyph"><PriorityIcon level={p} size={14} /></span>
                  </button>
                ))}
              </div>
            </div>
            <div className="kbv-form-row">
              <label>Esfuerzo</label>
              <RateRow value={t.energy} onChange={(n) => update('energy', n)}
                       icon={KB_SCALES.esfuerzo.icon} color={KB_SCALES.esfuerzo.color} labels={KB_EFFORT_LABELS} />
            </div>
            <div className="kbv-form-row">
              <label>Área</label>
              <select value={t.area} onChange={(e) => update('area', e.target.value)}>
                {KIBO_AREAS_V2.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="kbv-form-row">
              <label>Proyecto</label>
              <select value={t.project || ''} onChange={(e) => update('project', e.target.value || null)}>
                <option value="">Sin proyecto</option>
                {DEMO_PROJECTS_FOR_FILTER.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="kbv-form-row">
              <label>Tiempo estimado</label>
              <input type="text" value={t.estTime} onChange={(e) => update('estTime', e.target.value)} placeholder="45m · 1.5h..." />
            </div>
          </div>
        )}

        <div className="task-dates">
          <div className="date-block">
            <span className="lbl">FECHA INICIO</span>
            <input type="date" value={t.startDate} onChange={(e) => update('startDate', e.target.value)} />
          </div>
          <div className="date-arrow"><KIcon name="arrow-right" size={14} /></div>
          <div className="date-block">
            <span className="lbl">FECHA OBJETIVO</span>
            <input type="date" value={t.endDate} onChange={(e) => update('endDate', e.target.value)} />
          </div>
          <div className="date-block end">
            <span className="lbl">DURACIÓN</span>
            <span className="val">{Math.max(1, Math.ceil((new Date(t.endDate) - new Date(t.startDate)) / 86400000))} días</span>
          </div>
        </div>

        <div className="kbv-form-row">
          <label>Descripción</label>
          <textarea value={t.description} onChange={(e) => update('description', e.target.value)}
                    placeholder="Contexto, objetivo, criterios de éxito... Lo descriptivo siempre se puede editar."
                    style={{ minHeight: 90 }} />
        </div>

        {/* Checklist */}
        <div className="task-list-block">
          <div className="task-list-head">
            <h4 className="kbv-h4">Checklist</h4>
            <span className="kbv-meta">{clDone}/{clTotal} completados</span>
          </div>
          <div className="kbv-progress" style={{ height: 4 }}>
            <div className="fill" style={{ width: `${(clDone / Math.max(1, clTotal)) * 100}%`, background: 'var(--kb-primary)' }} />
          </div>
          <div className="task-list">
            {t.checklist.map(c => (
              <div key={c.id} className={`task-list-item ${c.done ? 'done' : ''}`}>
                <button type="button" className="check" onClick={() => toggleCl(c.id)}>
                  {c.done ? <KIcon name="check" size={12} /> : null}
                </button>
                <span className="text">{c.text}</span>
                <button type="button" className="del" onClick={() => delCl(c.id)} title="Eliminar">
                  <KIcon name="x" size={11} />
                </button>
              </div>
            ))}
          </div>
          <div className="task-list-add">
            <input type="text" value={newChecklist}
                   onChange={(e) => setNewChecklist(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && addCl()}
                   placeholder="Nuevo ítem del checklist..." />
            <button type="button" className="kbv-btn kbv-btn-secondary" onClick={addCl}>
              <KIcon name="plus" size={12} />
            </button>
          </div>
        </div>

        {/* Subtasks */}
        <div className="task-list-block">
          <div className="task-list-head">
            <h4 className="kbv-h4">Sub-actividades</h4>
            <span className="kbv-meta">{stDone}/{stTotal} hechas</span>
          </div>
          <div className="task-list">
            {t.subtasks.map(s => (
              <div key={s.id} className={`task-list-item subtask ${s.done ? 'done' : ''}`}>
                <button type="button" className="check" onClick={() => toggleSt(s.id)}>
                  {s.done ? <KIcon name="check" size={12} /> : null}
                </button>
                <span className="text">{s.text}</span>
                <span className="kbv-meta">subtarea</span>
                <button type="button" className="del" onClick={() => delSt(s.id)}>
                  <KIcon name="x" size={11} />
                </button>
              </div>
            ))}
          </div>
          <div className="task-list-add">
            <input type="text" value={newSubtask}
                   onChange={(e) => setNewSubtask(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && addSt()}
                   placeholder="Nueva sub-actividad (se convierte en tarea propia)..." />
            <button type="button" className="kbv-btn kbv-btn-secondary" onClick={addSt}>
              <KIcon name="plus" size={12} />
            </button>
          </div>
        </div>

        <div className="kbv-form-row">
          <label>Notas adicionales</label>
          <textarea value={t.notes} onChange={(e) => update('notes', e.target.value)}
                    placeholder="Comentarios, decisiones, links..."
                    style={{ minHeight: 60 }} />
        </div>
      </div>
    </KBVModal>
  );
}


// ═══ 69 · TAREAS = EL BACKLOG GENERAL ════════════════════════════
// Tareas era un tablero más, hermano de Proyectos: mismas columnas, mismo
// gesto, y ninguna respuesta a la única pregunta que importa —«¿qué sigue?».
// Ahora Tareas es el BACKLOG: una sola lista con TODO lo que debes, venga de
// donde venga (proyecto, materia, área o suelta), ordenada por cuándo la vas
// a hacer. Proyectos queda como agrupador: dice de qué es cada cosa, no cuál
// toca. El tablero y la línea del tiempo siguen ahí, como vistas.
// Ventana de cada momento del backlog, en días desde hoy: el cronograma dibuja
// la tarea donde el usuario dijo que la haría.
const BUCKET_WINDOW = { hoy: [0, 1], semana: [1, 7], despues: [7, 30], algun: [30, 90], hecho: [-7, 0] };

// Fechas de una tarea para el cronograma: manda su fecha límite si la tiene y,
// si no, la ventana de su momento. Deterministas dentro de la ventana para que
// la misma tarea no salte de sitio en cada render.
function taskSpan(t) {
  const D = 86400000, today = new Date(); today.setHours(0, 0, 0, 0);
  const t0 = today.getTime();
  if (typeof t.dleft === 'number') {
    // Con fecha límite la barra es el plazo: de hoy hasta el día en que vence.
    const end = t0 + Math.max(1, t.dleft) * D;
    return { start: Math.min(t0, end - D), end };
  }
  const [a, b] = BUCKET_WINDOW[t.bucket] || BUCKET_WINDOW.despues;
  return { start: t0 + a * D, end: t0 + b * D };
}

const TAREAS_TABS = [
  { id: 'backlog', label: 'Backlog', icon: 'list' },
  { id: 'board', label: 'Tablero', icon: 'layers' },
  { id: 'time', label: 'Cronograma', icon: 'calendar' },
];

const TASK_BUCKETS = [
  { id: 'hoy',     name: 'Hoy',         c: 'var(--kb-hp)',      hint: 'Te comprometiste a hacerlo hoy' },
  { id: 'semana',  name: 'Esta semana', c: 'var(--kb-coin)',    hint: 'Cae dentro de la semana' },
  { id: 'despues', name: 'Después',     c: 'var(--kb-primary)', hint: 'Sí, pero no ahora' },
  { id: 'algun',   name: 'Algún día',   c: 'var(--kb-gem)',     hint: 'No se pierde, pero no compromete' },
];
// Bucket inicial: se deduce de lo que YA sabe la tarea (fecha límite y
// prioridad). A partir de ahí lo mueve el usuario arrastrando.
function seedBucket(t) {
  if (t.status === 'done') return 'hecho';
  if (typeof t.dleft === 'number') {
    if (t.dleft <= 1) return 'hoy';
    if (t.dleft <= 7) return 'semana';
    return 'despues';
  }
  if (t.priority === 'urgent') return 'hoy';
  if (t.priority === 'high') return 'semana';
  if (t.priority === 'low') return 'algun';
  return 'despues';
}

function BacklogRow({ t, onOpen, onToggle, onDragStart, dragging }) {
  const area = KIBO_AREAS_V2.find(a => a.id === t.area);
  const proj = (typeof DEMO_PROJECTS_FOR_FILTER !== 'undefined' ? DEMO_PROJECTS_FOR_FILTER : []).find(p => p.id === t.project);
  const done = t.status === 'done';
  return (
    <div className={`kbv-bl-row ${done ? 'done' : ''} ${dragging ? 'dragging' : ''}`}
         style={{ '--c': area ? area.color : 'var(--kb-text-3)' }}
         draggable onDragStart={(e) => onDragStart(e, t)}
         onClick={() => onOpen(t.id)} role="button" tabIndex={0}
         onKeyDown={(e) => { if (e.key === 'Enter') onOpen(t.id); }}>
      <span className="bl-grip" aria-hidden="true"><KIcon name="grip" size={12} /></span>
      <button type="button" className="bl-check" title={done ? 'Reabrir' : 'Marcar hecha'}
              onClick={(e) => { e.stopPropagation(); onToggle(t.id); }}>
        {done && <KIcon name="check" size={12} />}
      </button>
      <PriorityIcon level={t.priority} size={13} />
      <span className="bl-title">{t.title}</span>
      <span className="bl-origin">
        {proj ? <span className="bl-chip proj"><KIcon name="folder" size={10} /> {proj.name}</span> : null}
        {area ? <span className="bl-chip area" style={{ '--ac': area.color }}>{area.name}</span> : <span className="bl-chip loose">Suelta</span>}
      </span>
      <span className="bl-effort" title={`Esfuerzo ${t.energy}/5`}><EnergyMeter level={t.energy} size={9} /></span>
      <span className="bl-est">{t.estTime}</span>
      <span className={`bl-due ${typeof t.dleft === 'number' && t.dleft <= 1 ? 'soon' : ''}`}>
        {t.dueLabel || '—'}
      </span>
    </div>
  );
}

function TaskBacklog({ tasks, group, onGroup, onOpen, onToggle, onMoveBucket, onAdd }) {
  const [dragging, setDragging] = React.useState(null);
  const [over, setOver] = React.useState(null);
  const [draft, setDraft] = React.useState('');
  const [addTo, setAddTo] = React.useState('hoy');
  function dragStart(e, t) { setDragging(t); e.dataTransfer.effectAllowed = 'move'; }
  function drop(bucketId) { return (e) => { e.preventDefault(); if (dragging) onMoveBucket(dragging.id, bucketId); setDragging(null); setOver(null); }; }

  // Agrupadores alternos: el backlog no cambia, cambia por dónde lo lees.
  const GROUPS = [
    { id: 'bucket', l: 'Cuándo' },
    { id: 'project', l: 'Proyecto' },
    { id: 'area', l: 'Área' },
    { id: 'priority', l: 'Prioridad' },
  ];
  const pending = tasks.filter(t => t.status !== 'done');
  const doneTasks = tasks.filter(t => t.status === 'done');

  let sections;
  if (group === 'bucket') {
    sections = TASK_BUCKETS.map(b => ({ key: b.id, name: b.name, meta: b.hint, c: b.c, drop: b.id, items: pending.filter(t => t.bucket === b.id) }));
  } else if (group === 'project') {
    const projs = (typeof DEMO_PROJECTS_FOR_FILTER !== 'undefined' ? DEMO_PROJECTS_FOR_FILTER : []);
    sections = projs.map(p => ({ key: p.id, name: p.name, meta: 'Proyecto', c: 'var(--kb-primary)', items: pending.filter(t => t.project === p.id) }))
      .concat([{ key: '__none', name: 'Sin proyecto', meta: 'Tareas sueltas', c: 'var(--kb-text-3)', items: pending.filter(t => !t.project) }]);
  } else if (group === 'area') {
    sections = KIBO_AREAS_V2.map(a => ({ key: a.id, name: a.name, meta: 'Área', c: a.color, items: pending.filter(t => t.area === a.id) }))
      .concat([{ key: '__none', name: 'Sin área', meta: '', c: 'var(--kb-text-3)', items: pending.filter(t => !t.area) }]);
  } else {
    sections = PRIORITY_ORDER.map(p => ({ key: p, name: PRIORITY_DEFS[p].label, meta: 'Prioridad', c: PRIORITY_DEFS[p].color, items: pending.filter(t => t.priority === p) }));
  }
  sections = sections.filter(sec => sec.items.length > 0 || sec.drop);

  return (
    <div className="kbv-backlog">
      <div className="kbv-bl-bar">
        <div className="blb-add">
          <KIcon name="plus" size={14} />
          <input type="text" value={draft} placeholder="Escribe una tarea y presiona Enter…"
                 onChange={(e) => setDraft(e.target.value)}
                 onKeyDown={(e) => { if (e.key === 'Enter' && draft.trim()) { onAdd(draft.trim(), addTo); setDraft(''); } }} />
          <select value={addTo} onChange={(e) => setAddTo(e.target.value)} title="¿Cuándo la haces?">
            {TASK_BUCKETS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div className="blb-group">
          <span className="kbv-meta">Agrupar por</span>
          <div className="kbv-seg tight">
            {GROUPS.map(g => (
              <button key={g.id} type="button" className={group === g.id ? 'on' : ''} onClick={() => onGroup(g.id)}>{g.l}</button>
            ))}
          </div>
        </div>
      </div>

      {sections.map(sec => (
        <section key={sec.key} className={`kbv-bl-group ${over === sec.drop ? 'over' : ''}`} style={{ '--c': sec.c }}
                 onDragOver={sec.drop ? (e) => { if (dragging) { e.preventDefault(); setOver(sec.drop); } } : undefined}
                 onDrop={sec.drop ? drop(sec.drop) : undefined}
                 onDragLeave={() => setOver(null)}>
          <header className="blg-head">
            <span className="blg-name">{sec.name}</span>
            <span className="blg-n">{sec.items.length}</span>
            {sec.meta && <span className="blg-meta">{sec.meta}</span>}
          </header>
          {sec.items.length === 0
            ? <p className="blg-empty">{sec.drop ? 'Arrastra aquí lo que caiga en este momento.' : 'Nada por aquí.'}</p>
            : sec.items.map(t => (
                <BacklogRow key={t.id} t={t} onOpen={onOpen} onToggle={onToggle}
                            onDragStart={dragStart} dragging={dragging && dragging.id === t.id} />
              ))}
        </section>
      ))}

      {doneTasks.length > 0 && (
        <section className="kbv-bl-group done">
          <header className="blg-head">
            <span className="blg-name">Hechas</span>
            <span className="blg-n">{doneTasks.length}</span>
            <span className="blg-meta">Se quedan a la vista un rato: sirven de prueba de que sí avanzaste</span>
          </header>
          {doneTasks.map(t => (
            <BacklogRow key={t.id} t={t} onOpen={onOpen} onToggle={onToggle} onDragStart={dragStart} dragging={false} />
          ))}
        </section>
      )}
    </div>
  );
}

function TareasScreen({ hero, navDetail }) {
  const [tasks, setTasks] = React.useState(() => DEMO_TASKS_FULL.map(t => ({ ...t, bucket: seedBucket(t) })));
  // El backlog es la identidad de la pantalla; tablero y cronograma son
  // lecturas alternas de lo mismo.
  const [view, setView] = React.useState('backlog');
  const [group, setGroup] = React.useState('bucket');
  const [columns, setColumns] = React.useState(TASK_COLUMNS);
  const [filterArea, setFilterArea]       = React.useState('all');
  const [filterPriority, setFilterPriority] = React.useState('all');
  const [filterEnergy, setFilterEnergy]   = React.useState('all');
  const [filterProject, setFilterProject] = React.useState('all');
  const [createOpen, setCreateOpen]       = React.useState(false);
  const [dragging, setDragging]           = React.useState(null);
  const [overCol, setOverCol]             = React.useState(null);
  const [editingColId, setEditingColId]   = React.useState(null);
  const [colEditMode, setColEditMode]     = React.useState(false);
  const [draggingColId, setDraggingColId] = React.useState(null);
  const [tlStatus, setTlStatus] = React.useState('all');
  // Fechas movidas a mano en el cronograma: viven aquí para no recalcularse.
  const [tlDates, setTlDates] = React.useState({});

  const [openTaskId, setOpenTaskId] = React.useState(null);

  // Deep-link desde otras secciones (p. ej. “Actividad → Tareas” en Estudio):
  // aplica filtro de proyecto/área y, si procede, abre el detalle o el alta.
  React.useEffect(() => {
    if (!navDetail) return;
    if (navDetail.project) setFilterProject(navDetail.project);
    if (navDetail.area) setFilterArea(navDetail.area);
    if (navDetail.taskId) setOpenTaskId(navDetail.taskId);
    if (navDetail.create) setCreateOpen(true);
  }, [navDetail]);

  function onDragStart(e, t) { setDragging(t); e.dataTransfer.effectAllowed = 'move'; }
  function onDropCol(e, colId) {
    e.preventDefault();
    if (!dragging) return;
    setTasks(ts => ts.map(t => t.id === dragging.id ? { ...t, status: colId } : t));
    setDragging(null); setOverCol(null);
  }
  function onDragOverCol(e, colId) { if (dragging) { e.preventDefault(); setOverCol(colId); } }

  // Column reordering (edit mode only) — locked columns stay anchored
  function onColDragStart(id) { return (e) => { setDraggingColId(id); e.dataTransfer.effectAllowed = 'move'; }; }
  function onColDrop(targetId) { return (e) => {
    e.preventDefault();
    if (!draggingColId || draggingColId === targetId) { setDraggingColId(null); return; }
    const dragged = columns.find(c => c.id === draggingColId);
    const target  = columns.find(c => c.id === targetId);
    if (!dragged || dragged.locked) { setDraggingColId(null); return; }
    if (target && target.locked) { setDraggingColId(null); return; }
    const next = columns.filter(c => c.id !== draggingColId);
    const tIdx = next.findIndex(c => c.id === targetId);
    next.splice(tIdx, 0, dragged);
    setColumns(next);
    setDraggingColId(null);
  };}

  // Editable columns
  const COL_COLORS = ['var(--pri-vlow)', 'var(--kb-coin)', 'var(--kb-hp)', 'var(--kb-primary)', 'var(--kb-gem)', 'var(--area-community)', 'var(--kb-good-soft)', 'var(--pri-high)'];
  function renameColumn(id, name) {
    setColumns(cs => cs.map(c => c.id === id ? { ...c, name } : c));
  }
  function recolorColumn(id) {
    setColumns(cs => cs.map(c => {
      if (c.id !== id) return c;
      const idx = COL_COLORS.indexOf(c.color);
      return { ...c, color: COL_COLORS[(idx + 1) % COL_COLORS.length] };
    }));
  }
  function addColumn() {
    const id = 'col' + Math.random().toString(36).slice(2, 6);
    // Insert before the last locked column (Done)
    const newCol = { id, name: 'Nueva columna', color: COL_COLORS[columns.length % COL_COLORS.length], locked: false };
    setColumns(cs => {
      const lastIdx = cs.findIndex(c => c.position === 'last');
      if (lastIdx === -1) return [...cs, newCol];
      const next = [...cs]; next.splice(lastIdx, 0, newCol); return next;
    });
    setEditingColId(id);
  }
  const [askCol, colConfirmDialog] = useConfirm();
  function deleteColumn(id) {
    const col = columns.find(c => c.id === id);
    if (col?.locked) { askCol({ title: 'No se puede quitar', message: 'Esta columna es parte del flujo base del tablero.', confirmLabel: 'Entendido', danger: false, cancelLabel: 'Cerrar' }); return; }
    if (columns.length <= 2) { askCol({ title: 'Necesitas al menos 2 columnas', message: 'Un tablero con una sola columna no distingue estados.', confirmLabel: 'Entendido', danger: false, cancelLabel: 'Cerrar' }); return; }
    askCol({
      title: `Quitar «${col ? col.name : 'columna'}»`,
      message: 'Las tareas que estén aquí se moverán a «Por hacer» — no se pierden.',
      confirmLabel: 'Sí, quitar',
      onConfirm: () => {
        const fallback = columns.find(c => c.position === 'first')?.id || columns.find(c => c.id !== id)?.id;
        setTasks(ts => ts.map(t => t.status === id ? { ...t, status: fallback } : t));
        setColumns(cs => cs.filter(c => c.id !== id));
      },
    });
  }

  const filtered = tasks.filter(t => {
    if (filterArea !== 'all' && t.area !== filterArea) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (filterProject !== 'all' && t.project !== (filterProject === 'none' ? null : filterProject)) return false;
    if (filterEnergy !== 'all') {
      const e = parseInt(filterEnergy, 10);
      if (t.energy !== e) return false;
    }
    return true;
  });

  function add(newTask) { setTasks(ts => [...ts, { ...newTask, status: newTask.status || columns[0]?.id || 'todo', bucket: newTask.bucket || seedBucket(newTask) }]); }
  function quickAdd(title, bucket) {
    setTasks(ts => [...ts, {
      id: 'bl' + Math.random().toString(36).slice(2, 6), title,
      area: filterArea !== 'all' ? filterArea : null,
      project: filterProject !== 'all' && filterProject !== 'none' ? filterProject : null,
      priority: bucket === 'hoy' ? 'urgent' : bucket === 'semana' ? 'high' : bucket === 'algun' ? 'low' : 'medium',
      energy: 2, estTime: '30m', status: 'todo', bucket,
    }]);
  }
  function toggleDone(id) {
    setTasks(ts => ts.map(t => t.id !== id ? t : ({ ...t, status: t.status === 'done' ? 'todo' : 'done', bucket: t.status === 'done' ? seedBucket({ ...t, status: 'todo' }) : 'hecho' })));
  }
  function moveBucket(id, bucket) {
    setTasks(ts => ts.map(t => t.id !== id ? t : ({ ...t, bucket, status: t.status === 'done' ? 'todo' : t.status })));
  }

  const totals = columns.map(c => ({ ...c, count: filtered.filter(t => t.status === c.id).length }));

  const tlTasks = filtered.filter(t => tlStatus === 'all' || t.status === tlStatus);

  return (
    <div className="kbv-main">
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--kb-primary)' }}>{crumb('tareas', 'Tu backlog')}</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Tareas. <InfoDot label="i" text={"El backlog general: todo lo que debes, venga de un proyecto, de una materia, de un área o de la nada. Se ordena por cuándo lo vas a hacer, no por columna. Proyectos agrupa; aquí se decide qué sigue. Los hábitos viven aparte."} /></h1>
        </div>
        <div className="actions">
          {view === 'board' && (
            <button type="button"
                    className={`kbv-btn kbv-icon-only ${colEditMode ? 'kbv-btn-primary' : 'kbv-btn-secondary'}`}
                    title={colEditMode ? 'Terminar de editar columnas' : 'Configurar las columnas'}
                    aria-label="Configurar las columnas"
                    onClick={() => setColEditMode(m => !m)}>
              <KIcon name={colEditMode ? 'check' : 'settings'} size={16} />
            </button>
          )}
          <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => setCreateOpen(true)}>
            <KIcon name="plus" size={14} /> Nueva tarea
          </button>
        </div>
      </div>

      <div className="kbv-store-tabs-v2">
        {TAREAS_TABS.map(t => (
          <button key={t.id} type="button" className={view === t.id ? 'on' : ''} onClick={() => setView(t.id)}>
            <KIcon name={t.icon} size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* KPIs — en el backlog cuentan MOMENTOS (cuándo lo haces); en el
          tablero, columnas. Son dos preguntas distintas. */}
      <div className="kbv-kpi-grid kpi-wrap" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {view === 'backlog'
          ? TASK_BUCKETS.map(b => {
              const n = filtered.filter(t => t.status !== 'done' && t.bucket === b.id).length;
              return (
                <div key={b.id} className="kbv-kpi" style={{ '--c': b.c }}>
                  <span className="label">{b.name}</span>
                  <span className="val">{n}</span>
                  <span className="delta">{b.hint}</span>
                </div>
              );
            })
          : totals.map(t => (
              <div key={t.id} className="kbv-kpi" style={{ '--c': t.color }}>
                <span className="label">{t.name}</span>
                <span className="val">{t.count}</span>
                <span className="delta">de {filtered.length} en pantalla</span>
              </div>
            ))}
      </div>

      {/* Filters — re-organized */}
      <div className="kbv-filter-bar v2">
        <div className="filter-block">
          <span className="label">Filtros</span>
          <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)} title="Área">
            <option value="all">Todas las áreas</option>
            {KIBO_AREAS_V2.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)} title="Proyecto">
            <option value="all">Todos los proyectos</option>
            <option value="none">Sin proyecto</option>
            {DEMO_PROJECTS_FOR_FILTER.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div className="filter-block">
          <span className="label">Prioridad</span>
          <div className="group icon-group">
            <button className={filterPriority === 'all' ? 'on' : ''} onClick={() => setFilterPriority('all')} title="Todas">Todas</button>
            {PRIORITY_ORDER.map(p => (
              <button key={p} className={filterPriority === p ? 'on' : ''} onClick={() => setFilterPriority(p)} title={PRIORITY_DEFS[p].label}>
                <PriorityIcon level={p} size={14} />
              </button>
            ))}
          </div>
        </div>

        <div className="filter-block">
          <span className="label">Esfuerzo</span>
          <div className="group icon-group">
            <button className={filterEnergy === 'all' ? 'on' : ''} onClick={() => setFilterEnergy('all')}>Cualquiera</button>
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} className={filterEnergy === String(n) ? 'on' : ''} onClick={() => setFilterEnergy(String(n))} title={`Esfuerzo ${n}/5`}>
                <EnergyMeter level={n} size={10} />
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="kbv-btn-link"
                onClick={() => { setFilterArea('all'); setFilterPriority('all'); setFilterEnergy('all'); setFilterProject('all'); }}>
          Limpiar
        </button>
      </div>

      {view === 'backlog' && (
        <TaskBacklog tasks={filtered} group={group} onGroup={setGroup}
                     onOpen={setOpenTaskId} onToggle={toggleDone}
                     onMoveBucket={moveBucket} onAdd={quickAdd} />
      )}

      {view === 'board' && (<>
      <p className="kbv-meta" style={{ margin: 0 }}>
        {filtered.length} tareas filtradas · {columns.length} columnas
        {colEditMode ? ' · arrastra para reordenar, toca el nombre para renombrar' : ''}
      </p>

      {/* Kanban */}
      <div className={`kbv-kanban ${colEditMode ? 'col-edit' : ''}`} style={{ gridTemplateColumns: `repeat(${columns.length + (colEditMode ? 1 : 0)}, minmax(180px, 1fr))` }}>
        {columns.map(col => {
          const items = filtered.filter(t => t.status === col.id);
          const isDraggingThisCol = draggingColId === col.id;
          return (
            <div
              key={col.id}
              className={`kbv-kanban-col ${overCol === col.id ? 'over' : ''} ${col.locked ? 'locked' : ''} ${isDraggingThisCol ? 'col-dragging' : ''}`}
              draggable={colEditMode && !col.locked}
              onDragStart={colEditMode && !col.locked ? onColDragStart(col.id) : undefined}
              onDragOver={(e) => {
                if (colEditMode && draggingColId) { e.preventDefault(); }
                else { onDragOverCol(e, col.id); }
              }}
              onDrop={(e) => {
                if (colEditMode && draggingColId) { onColDrop(col.id)(e); }
                else { onDropCol(e, col.id); }
              }}
              onDragLeave={() => setOverCol(null)}>
              <div className="col-head">
                <span className="name" style={{ '--col-c': col.color }}>
                  {col.locked && <span className="lock-pip" title="Columna fija — no se mueve ni se borra"><KIcon name="shield" size={9} /></span>}
                  <button type="button" className="col-dot" onClick={() => recolorColumn(col.id)} title="Cambiar color" disabled={col.locked && !colEditMode} />
                  {editingColId === col.id ? (
                    <input
                      autoFocus
                      className="col-name-edit"
                      defaultValue={col.name}
                      onBlur={(e) => { renameColumn(col.id, e.target.value || col.name); setEditingColId(null); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') setEditingColId(null); }}
                    />
                  ) : (
                    <button type="button" className="col-name-btn" onClick={() => colEditMode && setEditingColId(col.id)} title={colEditMode ? 'Editar nombre' : 'Activa "Editar columnas" para renombrar'}>
                      {col.name}
                    </button>
                  )}
                </span>
                <div className="col-actions">
                  <span className="count">{items.length}</span>
                  {colEditMode && !col.locked && (
                    <button type="button" className="col-x" onClick={() => deleteColumn(col.id)} title="Quitar columna">
                      <KIcon name="x" size={11} />
                    </button>
                  )}
                </div>
              </div>
              {items.map(t => <KanbanCard key={t.id} task={t} onDragStart={onDragStart} onClick={() => setOpenTaskId(t.id)} />)}
              <button className="add-here" type="button" onClick={() => setCreateOpen(true)}>
                <KIcon name="plus" size={12} /> Tarea aquí
              </button>
            </div>
          );
        })}
        {colEditMode && (
          <button type="button" className="kbv-kanban-col add-col-btn" onClick={addColumn} title="Agregar columna">
            <span className="add-glyph"><KIcon name="plus" size={18} /></span>
            <span className="add-label">Nueva columna</span>
            <span className="add-sub">Mín 2 · "Por hacer" y "Hecho" fijos</span>
          </button>
        )}
      </div>
      </>)}

      {view === 'time' && (
      /* El mismo cronograma explorable que el roadmap de Proyectos: eje en
         tiempo real, zoom con la rueda, arrastre del lienzo y mini-mapa. */
      <KbGantt
        title="Cronograma · cuándo cae cada cosa"
        meta="Cada tarea en su momento. Acércate con la rueda, muévete arrastrando y toca una barra para abrirla."
        rowLabel="TAREA"
        initialDays={35}
        rows={tlTasks.map(t => {
          const area = KIBO_AREAS_V2.find(a => a.id === t.area);
          const sp = tlDates[t.id] || taskSpan(t);
          return {
            id: t.id, name: t.title, kind: 'task',
            icon: (PRIORITY_DEFS[t.priority] || {}).icon || 'list',
            color: area?.color || 'var(--kb-text-3)',
            start: sp.start, end: sp.end,
            progress: t.status === 'done' ? 100 : t.status === 'doing' ? 55 : null,
            label: area?.name || 'Sin área',
          };
        })}
        emptyText="Sin tareas en este periodo o estatus."
        onOpenRow={(r) => setOpenTaskId(r.id)}
        onChangeDates={(id, start, end) => setTlDates(prev => ({ ...prev, [id]: { start, end } }))}
        filters={
          <select value={tlStatus} onChange={(e) => setTlStatus(e.target.value)} title="Filtrar por estatus">
            <option value="all">Todos los estatus</option>
            {columns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        } />
      )}

      {colConfirmDialog}
      {createOpen && <CreateTaskModal onClose={() => setCreateOpen(false)} onSave={add} />}
      {openTaskId && (() => {
        const t = tasks.find(x => x.id === openTaskId);
        if (!t) return null;
        return <TaskDetailModal task={t}
          onClose={() => setOpenTaskId(null)}
          onSave={(updated) => setTasks(ts => ts.map(x => x.id === updated.id ? updated : x))} />;
      })()}
    </div>
  );
}

// =================================================================
// Configuración del tablero — columnas, límites y tarjetas.
// Vive en un modal: es algo que se toca una vez cada tanto, no información
// que merezca una banda permanente encima del tablero.
// =================================================================
const BOARD_CARD_FIELDS = [
  { id: 'area', label: 'Área', desc: 'Punto de color y nombre del área' },
  { id: 'complexity', label: 'Complejidad', desc: 'Etiqueta y XP al cerrar' },
  { id: 'tasks', label: 'Avance de tareas', desc: 'Cuántas van de cuántas' },
  { id: 'due', label: 'Fecha objetivo', desc: 'Cuándo debería terminar' },
];

function BoardConfigModal({ cfg, columns, avgDays, onClose, onSave }) {
  const [draft, setDraft] = React.useState(() => JSON.parse(JSON.stringify(cfg)));
  function setWip(colId, n) {
    setDraft(d => ({ ...d, wip: { ...d.wip, [colId]: n > 0 ? n : undefined } }));
  }
  return (
    <KBVModal title="Configurar el tablero" sub="Columnas, límites de trabajo en curso y qué enseña cada tarjeta"
              size="lg" onClose={onClose}
              footer={
                <React.Fragment>
                  <button type="button" className="kbv-btn kbv-btn-secondary" onClick={onClose}>Cancelar</button>
                  <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => { onSave(draft); onClose(); }}>
                    <KIcon name="check" size={14} /> Guardar
                  </button>
                </React.Fragment>
              }>
      <div className="kbv-board-cfg">
        <section>
          <h4 className="kbv-h4">Columnas y límite</h4>
          <p className="kbv-meta">Un límite fuerza el foco: si la columna se pasa, su contador se pone en rojo. Deja el límite en cero para no poner tope.</p>
          <div className="bc-cols">
            {columns.map(col => (
              <div key={col.id} className="bc-col">
                <span className="bc-dot" style={{ background: col.color }} />
                <span className="bc-name">
                  <strong>{col.name}</strong>
                  {col.locked && <em>Fija</em>}
                </span>
                <div className="kbv-wip-stepper">
                  <button type="button" aria-label="Menos" onClick={() => setWip(col.id, (draft.wip[col.id] || 0) - 1)}>−</button>
                  <span className="val">{draft.wip[col.id] || '—'}</span>
                  <button type="button" aria-label="Más" onClick={() => setWip(col.id, Math.min(20, (draft.wip[col.id] || 0) + 1))}>+</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h4 className="kbv-h4">Qué enseña cada tarjeta</h4>
          <p className="kbv-meta">Menos datos, tablero más rápido de leer.</p>
          <div className="bc-fields">
            {BOARD_CARD_FIELDS.map(f => (
              <button key={f.id} type="button" className={`bc-field ${draft.fields[f.id] ? 'on' : ''}`}
                      onClick={() => setDraft(d => ({ ...d, fields: { ...d.fields, [f.id]: !d.fields[f.id] } }))}>
                <span className="bc-check">{draft.fields[f.id] && <KIcon name="check" size={12} />}</span>
                <span className="bc-ftxt"><strong>{f.label}</strong><em>{f.desc}</em></span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h4 className="kbv-h4">Tiempo promedio para terminar</h4>
          <p className="kbv-meta">Por complejidad, según lo que ya cerraste.</p>
          <div className="bc-kpis">
            {Object.entries(COMPLEXITY_DEFS).map(([key, def]) => (
              <div key={key} className="bc-kpi" style={{ '--c': def.color }}>
                <span className="kbv-eyebrow">{def.label}</span>
                <strong>{avgDays[key]}<small> días</small></strong>
                <em>+{def.xpReward} XP al cerrar</em>
              </div>
            ))}
          </div>
        </section>
      </div>
    </KBVModal>
  );
}

// =================================================================
// PROYECTOS — Kanban + WIP limit + KPIs + filters
// =================================================================
const PROJECT_COLUMNS = [
  { id: 'idea',   name: 'Por hacer',    color: 'var(--pri-vlow)', locked: true,  position: 'first', internalLabel: 'Idea' },
  { id: 'plan',   name: 'Planeación',   color: 'var(--kb-gem)', locked: false },
  { id: 'wip',    name: 'En progreso',  color: 'var(--kb-coin)', locked: false },
  { id: 'review', name: 'Revisión',     color: 'var(--area-community)', locked: false },
  { id: 'done',   name: 'Terminado',    color: 'var(--kb-primary)', locked: true,  position: 'last',  internalLabel: 'Done' },
];

const DEMO_PROJECTS_KANBAN = [
  { id: 'p1', name: 'Maratón otoño 2026',         area: 'vigor',     complexity: 'epic',    progress: 38, tasks: 12, total: 32, status: 'wip',    started: '2026-02-01' },
  { id: 'p2', name: 'Mejorar VO2 max',            area: 'vigor',     complexity: 'medium',  progress: 56, tasks: 8,  total: 14, status: 'wip',    started: '2026-03-15' },
  { id: 'p3', name: 'Curso System Design',        area: 'wisdom',    complexity: 'complex', progress: 72, tasks: 18, total: 25, status: 'wip',    started: '2026-01-10' },
  { id: 'p4', name: 'Cerrar cliente Aurora',      area: 'wealth',    complexity: 'medium',  progress: 80, tasks: 4,  total: 5,  status: 'review', started: '2026-04-20' },
  { id: 'p5', name: 'Plan financiero 2026',       area: 'wealth',    complexity: 'complex', progress: 12, tasks: 2,  total: 16, status: 'plan',   started: '2026-05-10' },
  { id: 'p6', name: 'Cena mensual familia',       area: 'community', complexity: 'simple',  progress: 60, tasks: 3,  total: 5,  status: 'wip',    started: '2026-05-01' },
  { id: 'p7', name: 'Aprender italiano A2',       area: 'wisdom',    complexity: 'complex', progress: 0,  tasks: 0,  total: 0,  status: 'idea',   started: null },
  { id: 'p8', name: 'Reorganizar oficina',        area: null,        complexity: 'simple',  progress: 0,  tasks: 0,  total: 0,  status: 'idea',   started: null },
  { id: 'p9', name: 'Side project: Kibo Mascot',  area: 'wealth',    complexity: 'medium',  progress: 100, tasks: 20, total: 20, status: 'done', started: '2026-03-01' },
  { id: 'p10',name: 'Lectura: 12 libros del año', area: 'wisdom',    complexity: 'medium',  progress: 42, tasks: 5,  total: 12, status: 'wip',    started: '2026-01-01' },
];

const COMPLEXITY_DEFS = {
  simple:  { label: 'Simple',   color: 'var(--kb-good-soft)', expectedDays: 7,  xpReward: 100 },
  medium:  { label: 'Media',    color: 'var(--kb-coin)', expectedDays: 21, xpReward: 300 },
  complex: { label: 'Compleja', color: 'var(--pri-high)', expectedDays: 60, xpReward: 800 },
  epic:    { label: 'Épica',    color: 'var(--area-community)', expectedDays: 180, xpReward: 2000 },
};

// Cuántas tareas tiene un proyecto, de una sola fuente: las realmente ligadas
// cuando existe el vínculo, y el conteo propio del proyecto cuando no. Sin esto
// la tarjeta decía «12/32» y su detalle «0/1» a un clic de distancia.
function projectTaskCount(p) {
  const key = PROJECT_TASK_KEYS[p.name];
  const linked = key ? (window.DEMO_TASKS_FULL || []).filter(t => t.project === key) : [];
  if (linked.length) {
    const done = linked.filter(t => t.status === 'done').length;
    // El avance sale de la MISMA fuente que el conteo: con dos campos
    // independientes se leía «0/1 ligadas» junto a «38%» en la misma tarjeta.
    return { done, total: linked.length, linked: true, pct: Math.round((done / linked.length) * 100) };
  }
  return { done: p.tasks || 0, total: p.total || 0, linked: false, pct: p.progress || 0 };
}
function projectPct(p) { return projectTaskCount(p).pct; }

function ProjectKanbanCard({ project, onDragStart, onClick }) {
  const area = KIBO_AREAS_V2.find(a => a.id === project.area);
  const comp = COMPLEXITY_DEFS[project.complexity];
  return (
    <div
      className="kbv-kanban-card"
      style={{ '--c': area ? area.color : comp.color }}
      draggable
      onDragStart={(e) => onDragStart(e, project)}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <div className="title">{project.name}</div>
        <span className="pri" style={{ '--p': comp.color, fontSize: 9 }}>{comp.label}</span>
      </div>
      <div className="meta">
        {area && <span className="area-chip" style={{ '--c': area.color }}><span className="dot" />{area.name}</span>}
        {!area && <span className="kbv-meta">Sin área</span>}
      </div>
      {projectTaskCount(project).total > 0 && (
        <div className="meta">
          <span className="kbv-meta" title={projectTaskCount(project).linked ? 'Tareas ligadas a este proyecto' : 'Tareas del proyecto'}>
            {projectTaskCount(project).done}/{projectTaskCount(project).total}
            {projectTaskCount(project).linked ? ' ligadas' : ''}
          </span>
          <div className="progress" style={{ '--c': area ? area.color : comp.color }}>
            <div className="fill" style={{ width: `${projectPct(project)}%` }} />
          </div>
          <span className="kbv-meta">{projectPct(project)}%</span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Project detail — KPIs, info, related tasks (Bloque Q)
// ─────────────────────────────────────────────────────────────
const PROJECT_TASK_KEYS = {
  'Maratón otoño 2026': 'maraton',
  'Curso System Design': 'system-design',
  'Cerrar cliente Aurora': 'aurora',
  'Plan financiero 2026': 'ynab',
};

const PROJECT_VIS = [
  { id: 'privado', label: 'Solo yo', desc: 'Nadie más lo ve' },
  { id: 'familia', label: 'Mi familia', desc: 'Visible en el panel familiar' },
];

function ProjectConfig({ project, onSave, onBack }) {
  const [d, setD] = React.useState(() => ({
    name: project.name, desc: project.desc || '', goal: project.goal || '',
    area: project.area || null, complexity: project.complexity || 'medium',
    priority: project.priority || 'medium', tags: project.tags || '',
    visibility: project.visibility || 'privado',
    tlStart: project.tlStart, tlEnd: project.tlEnd,
  }));
  const [ask, confirmDialog] = useConfirm();
  const [saved, setSaved] = React.useState(false);
  const set = (k, v) => { setD(p => ({ ...p, [k]: v })); setSaved(false); };
  const area = KIBO_AREAS_V2.find(a => a.id === d.area);
  const toDate = (ms) => ms ? new Date(ms).toISOString().slice(0, 10) : '';

  return (
    <React.Fragment>
      <div className="kbv-card kbv-char-card">
        <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Identidad</h3><span className="kbv-meta">cómo se llama y para qué es</span></div>
        <div className="kbv-cfg-grid">
          <div className="kbv-form-row">
            <label>Nombre</label>
            <input type="text" value={d.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div className="kbv-form-row">
            <label>Meta</label>
            <input type="text" value={d.goal} placeholder="Qué quieres lograr con esto" onChange={(e) => set('goal', e.target.value)} />
          </div>
        </div>
        <div className="kbv-form-row" style={{ marginTop: 12 }}>
          <label>Descripción</label>
          <textarea rows={2} value={d.desc} placeholder="Contexto, alcance, lo que no entra" onChange={(e) => set('desc', e.target.value)} />
        </div>
        <div className="kbv-form-row" style={{ marginTop: 12 }}>
          <label>Etiquetas</label>
          <input type="text" value={d.tags} placeholder="cliente, q3, urgente" onChange={(e) => set('tags', e.target.value)} />
        </div>
      </div>

      <div className="kbv-card kbv-char-card">
        <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Área y color</h3><span className="kbv-meta">el color lo hereda del área</span></div>
        <div className="kbv-cfg-icons">
          {KIBO_AREAS_V2.filter(a => a.id !== 'will').map(a => (
            <button key={a.id} type="button" className={`cfg-ico ${d.area === a.id ? 'on' : ''}`}
                    style={{ '--c': a.color }} title={a.name} onClick={() => set('area', a.id)}>
              <KIcon name={a.glyph} size={17} />
            </button>
          ))}
        </div>
        <p className="kbv-meta" style={{ marginTop: 8 }}>
          {area ? `Este proyecto suma a ${area.name}.` : 'Sin área: no suma XP a ningún frente.'}
          {area && <button type="button" className="td-link" style={{ marginLeft: 8 }} onClick={() => goToArea(area.id, 'proyectos')}>Ver el área <KIcon name="arrow-right" size={11} /></button>}
        </p>
      </div>

      <div className="kbv-card kbv-char-card">
        <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Peso y urgencia</h3><span className="kbv-meta">deciden la recompensa</span></div>
        <div className="kbv-form-row">
          <label>Complejidad</label>
          <div className="kbv-cfg-diff">
            {Object.entries(COMPLEXITY_DEFS).map(([k, def]) => (
              <button key={k} type="button" className={`cfg-diff ${d.complexity === k ? 'on' : ''}`}
                      style={{ '--c': def.color }} onClick={() => set('complexity', k)}>
                <strong>{def.label}</strong><em>+{def.xpReward} XP</em>
              </button>
            ))}
          </div>
        </div>
        <div className="kbv-form-row" style={{ marginTop: 12 }}>
          <label>Prioridad</label>
          <div className="kbv-cfg-diff">
            {PRIORITY_ORDER.map(k => (
              <button key={k} type="button" className={`cfg-diff ${d.priority === k ? 'on' : ''}`}
                      style={{ '--c': PRIORITY_DEFS[k].color }} onClick={() => set('priority', k)}>
                <strong>{PRIORITY_DEFS[k].label}</strong>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="kbv-card kbv-char-card">
        <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Fechas</h3><span className="kbv-meta">también se mueven arrastrando en el cronograma</span></div>
        <div className="kbv-cfg-grid">
          <div className="kbv-form-row">
            <label>Inicio</label>
            <input type="date" value={toDate(d.tlStart)} onChange={(e) => set('tlStart', new Date(e.target.value).getTime())} />
          </div>
          <div className="kbv-form-row">
            <label>Fin objetivo</label>
            <input type="date" value={toDate(d.tlEnd)} onChange={(e) => set('tlEnd', new Date(e.target.value).getTime())} />
          </div>
        </div>
      </div>

      <div className="kbv-card kbv-char-card">
        <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Quién lo ve</h3><span className="kbv-meta">visibilidad</span></div>
        <div className="kbv-cfg-fondos">
          {PROJECT_VIS.map(v => (
            <button key={v.id} type="button" className={`cfg-fondo ${d.visibility === v.id ? 'on' : ''}`}
                    title={v.desc} onClick={() => set('visibility', v.id)}>{v.label}</button>
          ))}
        </div>
      </div>

      <div className="kbv-card kbv-char-card pc-danger">
        <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Archivar o borrar</h3><span className="kbv-meta">archivar se puede deshacer</span></div>
        <div className="pc-danger-row">
          <button type="button" className="kbv-btn kbv-btn-secondary"
                  onClick={() => { onSave && onSave({ ...project, ...d, archived: true }); onBack && onBack(); }}>
            <KIcon name="folder" size={14} /> Archivar
          </button>
          <button type="button" className="kbv-btn kbv-btn-danger"
                  onClick={() => ask({
                    title: `Borrar «${project.name}»`,
                    message: 'Sus tareas quedan sin proyecto, pero no se borran. Esto no se puede deshacer.',
                    confirmLabel: 'Sí, borrar el proyecto',
                    onConfirm: () => { onSave && onSave({ ...project, deleted: true }); onBack && onBack(); },
                  })}>
            <KIcon name="trash" size={14} /> Borrar
          </button>
        </div>
      </div>

      <div className="pc-save">
        <span className="kbv-meta">{saved ? 'Guardado ✓' : 'Cambios sin guardar'}</span>
        <button type="button" className="kbv-btn kbv-btn-primary"
                onClick={() => { onSave && onSave({ ...project, ...d }); setSaved(true); }}>
          <KIcon name="check" size={14} /> Guardar cambios
        </button>
      </div>
      {confirmDialog}
    </React.Fragment>
  );
}

const PROJECT_TABS = [
  { id: 'resumen', label: 'Resumen', icon: 'trending-up' },
  { id: 'tareas', label: 'Tareas', icon: 'list' },
  { id: 'crono', label: 'Cronograma', icon: 'calendar' },
  { id: 'config', label: 'Configuración', icon: 'settings' },
];

const PROJECT_STATUS_LABELS = { idea: 'Por hacer', plan: 'Planeación', wip: 'En progreso', review: 'Revisión', done: 'Terminado' };

// Hitos del proyecto, con el mismo lenguaje que la línea de hitos del área:
// lo logrado, lo que viene y lo que falta.
function projectMilestones(p) {
  const pct = projectPct(p);
  return [
    { label: 'Arranque', kind: 'level', state: pct > 0 ? 'done' : 'next', note: 'Alcance y primeras tareas' },
    { label: 'Primer tercio', kind: 'level', state: pct >= 33 ? 'done' : pct > 0 ? 'next' : 'todo', note: '33% del trabajo cerrado' },
    { label: 'Mitad', kind: 'level', state: pct >= 50 ? 'done' : pct >= 33 ? 'next' : 'todo', note: 'Punto de no retorno' },
    { label: 'Revisión', kind: 'trophy', state: pct >= 80 ? 'done' : pct >= 50 ? 'next' : 'todo', note: 'Últimos ajustes' },
    { label: 'Cierre', kind: 'trophy', state: pct >= 100 ? 'done' : 'todo', note: (COMPLEXITY_DEFS[p.complexity] || {}).xpReward + ' XP al cerrar' },
  ];
}

function ProjectDetail({ project, onBack, onOpenTask, onSave }) {
  const [tab, setTab] = React.useState('resumen');
  const area = KIBO_AREAS_V2.find(a => a.id === project.area);
  const comp = COMPLEXITY_DEFS[project.complexity] || COMPLEXITY_DEFS.medium;
  const pri = PRIORITY_DEFS[project.priority] || PRIORITY_DEFS.medium;
  const taskKey = PROJECT_TASK_KEYS[project.name];
  const related = (typeof DEMO_TASKS_FULL !== 'undefined') ? DEMO_TASKS_FULL.filter(t => t.project === taskKey) : [];
  const relDone = related.filter(t => t.status === 'done').length;
  const c = area?.color || comp.color;

  const pulse = [
    { l: 'Avance', v: projectPct(project) + '%' },
    { l: projectTaskCount(project).linked ? 'Tareas ligadas' : 'Tareas', v: `${projectTaskCount(project).done}/${projectTaskCount(project).total}` },
    { l: 'Complejidad', v: comp.label, c: comp.color },
    { l: 'Prioridad', v: pri.label, c: pri.color },
    { l: 'Estimado', v: comp.expectedDays + ' días' },
  ];

  return (
    <div className="kbv-main kbv-projectdetail" style={{ '--c': c }}>
      <button type="button" className="kbv-area-back" onClick={onBack}>
        <KIcon name="arrow-left" size={14} /> Todos los proyectos
      </button>

      <div className="kbv-area-detail-head td-head">
        <span className="adh-glyph"><KIcon name={area?.glyph || 'folder'} size={26} /></span>
        <div className="adh-id">
          <div className="td-head-crumbs">
            {area && (
              <button type="button" className="td-crumb" onClick={() => goToArea(area.id, 'proyectos')}>
                <KIcon name={area.glyph} size={11} /> {area.name}
              </button>
            )}
            <span className="status-pip">{PROJECT_STATUS_LABELS[project.status] || project.status}</span>
          </div>
          <h2 className="adh-name">{project.name}</h2>
          <p className="adh-desc">{project.goal || project.desc || `${comp.label} · ${comp.expectedDays} días estimados`}</p>
        </div>
        <div className="td-head-reward">
          <span className="tdr-l">Avance</span>
          <span className="tdr-v">{projectPct(project)}<em>%</em></span>
          <span className="tdr-c">{projectTaskCount(project).done}/{projectTaskCount(project).total} {projectTaskCount(project).linked ? 'ligadas' : 'tareas'}</span>
        </div>
      </div>

      <div className="kbv-card kbv-char-card td-pulse-card">
        <div className="kbv-area-pulsegrid">
          {pulse.map((m, i) => (
            <div key={i} className="apg-cell">
              <span className="apg-v" style={m.c ? { color: m.c } : undefined}>{m.v}</span>
              <span className="apg-l">{m.l}</span>
            </div>
          ))}
        </div>
        <div className="kbv-progress" style={{ height: 8, marginTop: 12 }}>
          <div className="fill" style={{ width: `${projectPct(project)}%`, background: c }} />
        </div>
      </div>

      <div className="kbv-store-tabs-v2" style={{ marginBottom: 4 }}>
        {PROJECT_TABS.map(x => (
          <button key={x.id} type="button" className={tab === x.id ? 'on' : ''} onClick={() => setTab(x.id)}>
            <KIcon name={x.icon} size={14} /> {x.label}
          </button>
        ))}
      </div>

      {tab === 'resumen' && (
        <React.Fragment>
          <div className="kbv-card kbv-char-card">
            <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Ficha</h3><span className="kbv-meta">lo que define el proyecto</span></div>
            <div className="kbv-detail-rows">
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
              <div className="row"><span className="l">Estado</span><span className="v">{PROJECT_STATUS_LABELS[project.status] || project.status}</span></div>
              <div className="row"><span className="l">Inicio</span><span className="v">{project.tlStart ? kgFmt(project.tlStart) : (project.startDate || project.started || '—')}</span></div>
              <div className="row"><span className="l">Fin objetivo</span><span className="v">{project.tlEnd ? kgFmt(project.tlEnd) : (project.endDate || '—')}</span></div>
              <div className="row"><span className="l">Etiquetas</span><span className="v">{project.tags ? project.tags.split(',').map((x, i) => <span key={i} className="kbv-tag">{x.trim()}</span>) : '—'}</span></div>
            </div>
            {project.desc && <p className="kbv-body" style={{ marginTop: 12 }}>{project.desc}</p>}
          </div>

          <div className="kbv-card kbv-char-card">
            <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Hitos del proyecto</h3><span className="kbv-meta">logrados y por venir</span></div>
            <div className="kbv-area-timeline">
              {projectMilestones(project).map((m, i) => {
                const k = (typeof MS_KIND !== 'undefined' && MS_KIND[m.kind]) || { c: c };
                return (
                  <div key={i} className={`atl-item ${m.state}`} style={{ '--mc': k.c }}>
                    <span className="atl-dot" />
                    <span className="atl-body">
                      <span className="atl-l">{m.label}</span>
                      <span className="atl-n">{m.note}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </React.Fragment>
      )}

      {tab === 'tareas' && (
        <div className="kbv-card kbv-char-card">
          <div className="kbv-study-section-head tight"><h3 className="kbv-h3">Tareas ligadas</h3><span className="kbv-meta">{related.length} ligadas · {relDone} hechas</span></div>
          {related.length === 0 ? (
            <EmptyState icon="list" title="Sin tareas ligadas"
                        body="Crea una tarea y asígnala a este proyecto para verla aquí." />
          ) : (
            <div className="kbv-related-tasks">
              {related.map(t => {
                const ta = KIBO_AREAS_V2.find(a => a.id === t.area);
                return (
                  <button key={t.id} type="button"
                          className={`related-task ${t.status === 'done' ? 'done' : ''}`}
                          style={{ '--c': ta?.color || 'var(--kb-text-3)' }}
                          onClick={() => onOpenTask && onOpenTask(t.id)}>
                    <PriorityIcon level={t.priority} size={14} />
                    <span className="ttl">{t.title}</span>
                    <EnergyMeter level={t.energy} size={10} />
                    <span className={`st-pip ${t.status}`}>{TASK_STATUS_LABELS_V2[t.status] || t.status}</span>
                    <KIcon name="arrow-right" size={13} />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'crono' && <ProjectScheduleCard project={project} tasks={related} onOpenTask={onOpenTask} />}

      {tab === 'config' && <ProjectConfig project={project} onSave={onSave} onBack={onBack} />}
    </div>
  );
}

function ProjectScheduleCard({ project, tasks, onOpenTask }) {
  const D = 86400000;
  const p = project.tlStart ? project : seedProjectDates([project])[0];
  const ST = { todo: 'var(--kb-text-3)', doing: 'var(--kb-primary)', blocked: 'var(--kb-hp)', done: 'var(--kb-good)' };
  const [dates, setDates] = React.useState({});
  const rows = tasks.map(t => {
    const d = dates[t.id];
    return {
      id: t.id, name: t.title, icon: 'list', kind: 'task',
      color: ST[t.status] || 'var(--kb-text-3)',
      start: d ? d.s : taskStart(t, p), end: d ? d.e : taskEnd(t, p),
      progress: t.status === 'done' ? 100 : t.status === 'doing' ? 55 : null,
      label: TASK_STATUS_LABELS_V2[t.status] || t.status,
    };
  });
  return (
    <KbGantt
      title="Cronograma del proyecto"
      meta="Sus tareas en el tiempo. Acércate con la rueda, muévete arrastrando y abre una tarea al tocarla."
      rowLabel="TAREA"
      rows={rows}
      emptyText="Este proyecto todavía no tiene tareas ligadas."
      onOpenRow={(r) => onOpenTask && onOpenTask(r.id)}
      onChangeDates={(id, s, e) => setDates(prev => ({ ...prev, [id]: { s, e } }))} />
  );
}

const TASK_STATUS_LABELS_V2 = { todo: 'Por hacer', doing: 'En curso', blocked: 'Bloqueado', done: 'Hecho' };

// Siembra determinista de fechas: el mismo proyecto cae siempre en el mismo
// tramo, y a partir de ahí el usuario las mueve.
function seedProjectDates(list) {
  const D = 86400000, today = new Date(); today.setHours(0, 0, 0, 0);
  const t0 = today.getTime();
  const compDays = { simple: 14, medium: 35, complex: 70, epic: 120 };
  return list.map((p, i) => {
    if (p.tlStart && p.tlEnd) return p;
    const dur = (compDays[p.complexity] || 35);
    const offset = ((p.id.charCodeAt(0) + i * 7) % 60) - 20;
    const start = t0 + offset * D;
    return { ...p, tlStart: start, tlEnd: start + dur * D };
  });
}

function ProjectsScreen({ hero, navDetail }) {
  const [projects, setProjects] = React.useState(() => seedProjectDates(DEMO_PROJECTS_KANBAN));
  const [openProject, setOpenProject] = React.useState(null);
  const [boardCfg, setBoardCfg] = React.useState(() => {
    try { const v = JSON.parse(localStorage.getItem('kibo:board-proyectos') || 'null'); if (v) return v; } catch (_) {}
    return { wip: { wip: 3 }, fields: { area: true, complexity: true, tasks: true, due: true } };
  });
  const [cfgOpen, setCfgOpen] = React.useState(false);
  // Un único origen del límite de «en progreso»: el resto de la pantalla lo lee
  // de aquí en vez de recordar dónde vive.
  const wipLimit = boardCfg.wip.wip;
  function saveBoardCfg(next) {
    setBoardCfg(next);
    try { localStorage.setItem('kibo:board-proyectos', JSON.stringify(next)); } catch (_) {}
  }
  const [filterArea, setFilterArea] = React.useState('all');
  const [filterComplexity, setFilterComplexity] = React.useState('all');
  const [createOpen, setCreateOpen] = React.useState(false);
  const [dragging, setDragging] = React.useState(null);
  const [overCol, setOverCol] = React.useState(null);

  // Deep-link desde Áreas: aplica el filtro del área (y abre proyecto/alta si procede).
  React.useEffect(() => {
    if (!navDetail) return;
    if (navDetail.area) setFilterArea(navDetail.area);
    // Con destino, abre; SIN destino, cierra. Antes solo contemplaba el primer
    // caso, así que volver a la propia pantalla desde el menú no hacía nada.
    if (navDetail.project) { const p = projects.find(x => x.id === navDetail.project) || DEMO_PROJECTS_KANBAN.find(x => x.id === navDetail.project); setOpenProject(p || null); }
    else setOpenProject(null);
    if (navDetail.create) setCreateOpen(true);
  }, [navDetail]);

  function onDragStart(e, p) { setDragging(p); e.dataTransfer.effectAllowed = 'move'; }
  function onDropCol(e, colId) {
    e.preventDefault();
    if (!dragging) return;
    setProjects(ps => ps.map(p => p.id === dragging.id ? { ...p, status: colId } : p));
    setDragging(null); setOverCol(null);
  }
  function onDragOverCol(e, colId) { if (dragging) { e.preventDefault(); setOverCol(colId); } }

  const filtered = projects.filter(p => {
    if (filterArea !== 'all' && p.area !== (filterArea === 'none' ? null : filterArea)) return false;
    if (filterComplexity !== 'all' && p.complexity !== filterComplexity) return false;
    return true;
  });

  // KPIs
  const activeWip = projects.filter(p => p.status === 'wip').length;
  const totalActive = projects.filter(p => p.status !== 'done' && p.status !== 'idea').length;
  const avgProgress = totalActive > 0
    ? Math.round(projects.filter(p => p.status === 'wip').reduce((a, p) => a + projectPct(p), 0) / Math.max(1, activeWip))
    : 0;
  const completedThisQuarter = projects.filter(p => p.status === 'done').length;
  // Avg days to finish by complexity (mock data — would be calculated from real history)
  const avgDaysByComplexity = { simple: 5, medium: 18, complex: 52, epic: 162 };

  function addProject(np) {
    if (!np.name?.trim()) return;
    setProjects(ps => [...ps, {
      id: 'p' + Math.random().toString(36).slice(2, 6),
      name: np.name, area: np.area, complexity: np.complexity || 'medium',
      priority: np.priority || 'medium', startDate: np.startDate || null, endDate: np.endDate || null,
      tags: np.tags || '', desc: np.desc || '', goal: np.goal || '',
      progress: 0, tasks: 0, total: 0, status: 'idea',
    }]);
  }

  if (openProject) return (
    <ProjectDetail project={openProject} onBack={() => setOpenProject(null)}
                   onOpenTask={(id) => { try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'tarea', taskId: id } })); } catch (_) {} }}
                   onSave={(next) => {
                     if (next.deleted) { setProjects(ps => ps.filter(p => p.id !== next.id)); setOpenProject(null); return; }
                     setProjects(ps => ps.map(p => p.id === next.id ? next : p));
                     setOpenProject(next);
                   }} />
  );

  return (
    <div className="kbv-main">
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--kb-primary)' }}>{crumb('projects', 'Vista completa')}</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Proyectos. <InfoDot label="i" text={"Tablero kanban para gestionar todo. Define cuántos proyectos puedes tener en progreso para forzar foco."} /></h1>
        </div>
        <div className="actions">
          <button type="button" className="kbv-btn kbv-btn-secondary kbv-icon-only" title="Configurar el tablero"
                  aria-label="Configurar el tablero" onClick={() => setCfgOpen(true)}>
            <KIcon name="settings" size={16} />
          </button>
          <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => setCreateOpen(true)}>
            <KIcon name="plus" size={14} /> Nuevo proyecto
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kbv-kpi-grid">
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-coin)' }}>
          <span className="label">En progreso (WIP)</span>
          <span className="val">
            {activeWip}{wipLimit ? <small> / {wipLimit}</small> : null}
          </span>
          <span className={`delta ${wipLimit && activeWip > wipLimit ? 'down' : ''}`}>
            {!wipLimit ? 'Sin tope — ponle uno en el engrane'
              : activeWip > wipLimit ? `${activeWip - wipLimit} sobre tu límite — frena algo`
              : 'Bajo tu límite — bien'}
          </span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-primary)' }}>
          <span className="label">Avance promedio</span>
          <span className="val">{avgProgress}<small>%</small></span>
          <span className="delta up">+8% vs hace 30 días</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--area-community)' }}>
          <span className="label">Completados este trim.</span>
          <span className="val">{completedThisQuarter}</span>
          <span className="delta">Q2 2026</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-gem)' }}>
          <span className="label">Ritmo de cierre</span>
          <span className="val">1.4<small>/sem</small></span>
          <span className="delta up">+0.3 vs trim. pasado</span>
        </div>
      </div>


      {/* Filters */}
      <div className="kbv-filter-bar">
        <span className="label">Filtros</span>
        <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)}>
          <option value="all">Todas las áreas</option>
          <option value="none">Sin área</option>
          {KIBO_AREAS_V2.filter(a => a.id !== 'will').map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <span className="label" style={{ marginLeft: 8 }}>Complejidad</span>
        <div className="group">
          <button className={filterComplexity === 'all' ? 'on' : ''} onClick={() => setFilterComplexity('all')}>Todas</button>
          {Object.entries(COMPLEXITY_DEFS).map(([k, d]) => (
            <button key={k} className={filterComplexity === k ? 'on' : ''} onClick={() => setFilterComplexity(k)}>{d.label}</button>
          ))}
        </div>
        <button type="button" className="kbv-btn-link" style={{ marginLeft: 'auto' }}
                onClick={() => { setFilterArea('all'); setFilterComplexity('all'); }}>
          Limpiar
        </button>
      </div>

      {/* Kanban (5 cols) */}
      <div className="kbv-kanban" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {PROJECT_COLUMNS.map(col => {
          const items = filtered.filter(p => p.status === col.id);
          const lim = boardCfg.wip[col.id];
          const overLimit = !!lim && items.length > lim;
          return (
            <div key={col.id}
                 className={`kbv-kanban-col ${overCol === col.id ? 'over' : ''} ${col.locked ? 'locked' : ''}`}
                 onDragOver={(e) => onDragOverCol(e, col.id)}
                 onDrop={(e) => onDropCol(e, col.id)}
                 onDragLeave={() => setOverCol(null)}>
              <div className="col-head">
                <span className="name" style={{ '--col-c': col.color }}>
                  {col.locked && <span className="lock-pip" title="Columna fija — no se mueve ni se borra"><KIcon name="shield" size={9} /></span>}
                  <span className="dot" />{col.name}
                </span>
                <span className={`count ${overLimit ? 'over-wip' : ''}`}>
                  {lim ? `${items.length}/${lim}` : items.length}
                </span>
              </div>
              {items.map(p => <ProjectKanbanCard key={p.id} project={p} onDragStart={onDragStart} onClick={() => setOpenProject(p)} />)}
              {col.id === 'idea' && (
                <button className="add-here" type="button" onClick={() => setCreateOpen(true)}>
                  <KIcon name="plus" size={12} /> Anotar idea
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Roadmap / Timeline */}
      <ProjectTimeline projects={filtered}
        onOpenProject={(p) => setOpenProject(p)}
        onOpenTask={(id) => { try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'tarea', taskId: id } })); } catch (_) {} }}
        onDates={(id, start, end) => setProjects(ps => ps.map(p => p.id === id ? { ...p, tlStart: start, tlEnd: end } : p))} />

      {createOpen && <CreateProjectModal onClose={() => setCreateOpen(false)} onSave={addProject} />}
      {cfgOpen && (
        <BoardConfigModal cfg={boardCfg} columns={PROJECT_COLUMNS} avgDays={avgDaysByComplexity}
                          onClose={() => setCfgOpen(false)} onSave={saveBoardCfg} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Project Timeline (roadmap) — multi-scale, drag to shift
// ─────────────────────────────────────────────────────────────
const TL_SCALES = [
  { k: '1w',  lbl: '1 sem',  buckets: 7,  unit: 'D', labels: ['L','M','X','J','V','S','D'] },
  { k: '2w',  lbl: '2 sem',  buckets: 14, unit: 'D', labels: Array.from({ length: 14 }, (_, i) => String(i+1)) },
  { k: '3w',  lbl: '3 sem',  buckets: 21, unit: 'D', labels: Array.from({ length: 21 }, (_, i) => String(i+1)) },
  { k: '6w',  lbl: '6 sem',  buckets: 6,  unit: 'S', labels: ['S1','S2','S3','S4','S5','S6'] },
  { k: '12w', lbl: '12 sem', buckets: 12, unit: 'S', labels: Array.from({ length: 12 }, (_, i) => `S${i+1}`) },
  { k: '6m',  lbl: '6 meses',  buckets: 6,  unit: 'M', labels: ['Jun','Jul','Ago','Sep','Oct','Nov'] },
  { k: '12m', lbl: '12 meses', buckets: 12, unit: 'M', labels: ['Jun','Jul','Ago','Sep','Oct','Nov','Dic','Ene','Feb','Mar','Abr','May'] },
  { k: '24m', lbl: '24 meses', buckets: 24, unit: 'M', labels: Array.from({ length: 24 }, (_, i) => String(i+1)) },
];

function ProjectTimeline({ projects, onOpenProject, onOpenTask, onDates }) {
  const [fArea, setFArea] = React.useState('all');
  const [fPri, setFPri] = React.useState('all');
  const [fProgress, setFProgress] = React.useState(0);

  const visible = projects.filter(p =>
    (fArea === 'all' || p.area === (fArea === 'none' ? null : fArea)) &&
    (fPri === 'all' || (p.priority || 'medium') === fPri) &&
    (projectPct(p) >= fProgress));

  const ST = { todo: 'var(--kb-text-3)', doing: 'var(--kb-primary)', blocked: 'var(--kb-hp)', done: 'var(--kb-good)' };
  const tasks = window.DEMO_TASKS_FULL || [];

  // Cada proyecto lleva sus tareas como hijas: desplegarlas es acercarse sin
  // cambiar de pantalla, y varios pueden estar abiertos a la vez.
  const rows = visible.map(p => {
    const area = KIBO_AREAS_V2.find(a => a.id === p.area);
    const comp = COMPLEXITY_DEFS[p.complexity] || COMPLEXITY_DEFS.medium;
    const kids = tasks.filter(t => t.project === PROJECT_TASK_KEYS[p.name]).map(t => ({
      id: t.id, name: t.title, kind: 'task', icon: 'list',
      color: ST[t.status] || 'var(--kb-text-3)',
      start: taskStart(t, p), end: taskEnd(t, p),
      progress: t.status === 'done' ? 100 : t.status === 'doing' ? 55 : null,
      label: TASK_STATUS_LABELS_V2[t.status] || t.status,
    }));
    return {
      id: p.id, name: p.name, kind: 'project',
      color: area?.color || comp.color,
      start: p.tlStart, end: p.tlEnd,
      progress: projectPct(p),
      label: `${comp.label} · ${projectPct(p)}%`,
      children: kids,
    };
  });

  return (
    <KbGantt
      title="Roadmap · cronograma"
      meta="Acércate, muévete y despliega las tareas de un proyecto sin salir de aquí."
      rowLabel="PROYECTO"
      rows={rows}
      emptyText="No hay proyectos que mostrar con estos filtros."
      onChangeDates={onDates}
      onOpenRow={(r) => {
        if (r.kind === 'task') { if (onOpenTask) onOpenTask(r.id); return; }
        if (onOpenProject) onOpenProject(projects.find(p => p.id === r.id));
      }}
      filters={
        <React.Fragment>
          <select value={fArea} onChange={(e) => setFArea(e.target.value)} title="Área">
            <option value="all">Todas las áreas</option>
            <option value="none">Sin área</option>
            {KIBO_AREAS_V2.filter(a => a.id !== 'will').map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <select value={fPri} onChange={(e) => setFPri(e.target.value)} title="Prioridad">
            <option value="all">Toda prioridad</option>
            {PRIORITY_ORDER.map(p => <option key={p} value={p}>{PRIORITY_DEFS[p].label}</option>)}
          </select>
          <label className="tl-progress-filter">
            Avance ≥ <strong>{fProgress}%</strong>
            <input type="range" min="0" max="100" step="10" value={fProgress} onChange={(e) => setFProgress(parseInt(e.target.value, 10))} />
          </label>
        </React.Fragment>
      } />
  );
}

// Fechas de una tarea dentro del rango de su proyecto: deterministas a partir
// de su id, para que la misma tarea caiga siempre en el mismo sitio.
function taskStart(t, p) {
  const span = Math.max(7 * 86400000, (p.tlEnd - p.tlStart));
  const seed = (t.id.charCodeAt(t.id.length - 1) || 0) % 10;
  return p.tlStart + Math.round(span * (seed / 14));
}
function taskEnd(t, p) {
  const span = Math.max(7 * 86400000, (p.tlEnd - p.tlStart));
  return taskStart(t, p) + Math.max(2 * 86400000, Math.round(span * (0.12 + (t.energy || 2) * 0.05)));
}

// =================================================================
// TIENDA — Generic platform rewards, cosmetics, custom rewards (CRUD)
// =================================================================
const STORE_PLATFORM = [
  { id: 'sp1', name: 'Protector de racha',     desc: 'Salva 1 día perdido en tu racha global.',     cost: 200, currency: 'coin', icon: 'sword', color: 'var(--kb-streak)', cat: 'platform' },
  { id: 'sp2', name: 'Booster XP × 1.5 (24h)', desc: 'Aumenta 50% el XP por tareas durante un día.',cost: 350, currency: 'coin', icon: 'sparkle', color: 'var(--kb-primary)', cat: 'platform' },
  { id: 'sp3', name: 'Reroll de boss',         desc: 'Cambia el boss semanal por otro a tu medida.',cost: 12,  currency: 'gem',  icon: 'sword', color: 'var(--kb-hp)', cat: 'platform' },
  { id: 'sp4', name: 'Día sabático (1 vez)',   desc: 'Congelas hábitos y bosses por 24h sin perder.',cost: 25, currency: 'gem',  icon: 'flame', color: 'var(--area-community)', cat: 'platform' },
  { id: 'sp5', name: 'Cofre del aventurero',   desc: 'Loot aleatorio: monedas, materia oscura, cosméticos.',  cost: 500, currency: 'coin', icon: 'shop',  color: 'var(--kb-coin)', cat: 'platform' },
  { id: 'sp6', name: 'Slot extra de hábito',   desc: 'Permite añadir un hábito más al tope diario.', cost: 18,  currency: 'gem',  icon: 'plus',  color: 'var(--area-wisdom)', cat: 'platform' },
];

const STORE_COSMETICS = [
  { id: 'sc1', name: 'Casaca real',         desc: 'Capa azul cobalto con borde dorado.',   cost: 800,  currency: 'coin', icon: 'user',    color: 'var(--area-wisdom)', cat: 'cosmetic', kind: 'clothing' },
  { id: 'sc2', name: 'Tinte cabello fuego', desc: 'Rojo neón para el pelo del Hero.',       cost: 300,  currency: 'coin', icon: 'sparkle', color: 'var(--kb-hp)', cat: 'cosmetic', kind: 'hair' },
  { id: 'sc3', name: 'Mascota: Kibo Sombra',desc: 'Versión negra del Kibo que te acompaña.', cost: 30,  currency: 'gem',  icon: 'sparkle', color: 'var(--kb-text)', cat: 'cosmetic', kind: 'pet' },
  { id: 'sc4', name: 'Aura dorada',         desc: 'Halo brillante alrededor del Hero.',     cost: 50,   currency: 'gem',  icon: 'flame',   color: 'var(--kb-coin)', cat: 'cosmetic', kind: 'effect' },
  { id: 'sc5', name: 'Sombrero de viajero', desc: 'Estilo aventurero clásico.',             cost: 450,  currency: 'coin', icon: 'user',    color: 'var(--kb-coin-ink)', cat: 'cosmetic', kind: 'head' },
  { id: 'sc6', name: 'Túnica del mago',     desc: 'Robe violeta con runas brillantes.',     cost: 900,  currency: 'coin', icon: 'user',    color: 'var(--area-community)', cat: 'cosmetic', kind: 'clothing' },
  { id: 'sc7', name: 'Llama verde (90 días)',desc: 'Desbloqueada por racha — solo presumir.',cost: 0,   currency: 'coin', icon: 'flame',   color: 'var(--kb-primary)', cat: 'cosmetic', kind: 'flame', owned: true },
  { id: 'sc8', name: 'Marco de retrato',    desc: 'Bordea tu avatar con un marco animado.', cost: 20,   currency: 'gem',  icon: 'image',   color: 'var(--kb-gem)', cat: 'cosmetic', kind: 'frame' },
];

const DEFAULT_CUSTOM_REWARDS = [
  { id: 'cr1', name: 'Café de especialidad',     desc: 'Un latte del barista que te gusta.',      cost: 80,  currency: 'coin', icon: 'shop',    color: 'var(--kb-coin-ink)', custom: true },
  { id: 'cr2', name: '1h de videojuegos',        desc: 'Sin culpa, sin reloj.',                   cost: 150, currency: 'coin', icon: 'sparkle', color: 'var(--area-community)', custom: true },
  { id: 'cr3', name: 'Pelí en el cine',          desc: 'Sin laptop ni notificaciones.',           cost: 8,   currency: 'gem',  icon: 'film',    color: 'var(--kb-hp)', custom: true },
];

// Tarjeta de item de Tienda — envoltura de la tarjeta canónica `ItemCard`
// (decisión 1g: base Vitrina, el arte manda y el precio va en el botón).
function StoreItem({ item, onBuy, onEdit, onDelete }) {
  const normalized = { ...item, kind: item.cat === 'cosmetic' ? item.kind : null };
  return (
    <ItemCard
      item={normalized}
      onBuy={onBuy}
      actionLabel={item.custom ? 'Canjear' : null}
      onEdit={item.custom ? onEdit : null}
      onDelete={item.custom ? onDelete : null} />
  );
}

function StoreScreen({ stats }) {
  const [tab, setTab] = React.useState('rewards'); // rewards | cosmetics | custom
  const [custom, setCustom] = React.useState(DEFAULT_CUSTOM_REWARDS);
  const [editing, setEditing] = React.useState(null);
  const [createOpen, setCreateOpen] = React.useState(false);

  function saveCustom(r) {
    if (editing) setCustom(cs => cs.map(c => c.id === r.id ? r : c));
    else setCustom(cs => [...cs, r]);
    setEditing(null);
  }
  function removeCustom(r) { setCustom(cs => cs.filter(c => c.id !== r.id)); }
  function buy(_r) { /* mock */ }

  return (
    <div className="kbv-main">
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--kb-primary)' }}>{crumb('store', 'Cofres, funciones y lo que tú defines')}</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Tienda. <InfoDot label="i" text={"Recompensas de la plataforma, cosméticos para tu Hero y recompensas personalizadas que tú defines."} /></h1>
        </div>
        <div className="actions">
          <div style={{ display: 'flex', gap: 10 }}>
            <span className="kbv-stat-pill coin"><span className="icon">●</span><span>{stats?.coins || '1,245'}</span></span>
            <span className="kbv-stat-pill gem"><span className="icon">◆</span><span>{stats?.gems || 38}</span></span>
          </div>
        </div>
      </div>

      <div className="kbv-store-tabs">
        <button type="button" className={tab === 'rewards' ? 'active' : ''} onClick={() => setTab('rewards')}>
          <KIcon name="sword" size={14} /> Plataforma
        </button>
        <button type="button" className={tab === 'cosmetics' ? 'active' : ''} onClick={() => setTab('cosmetics')}>
          <KIcon name="user" size={14} /> Cosméticos del Hero
        </button>
        <button type="button" className={tab === 'custom' ? 'active' : ''} onClick={() => setTab('custom')}>
          <KIcon name="sparkle" size={14} /> Recompensas personalizadas
        </button>
      </div>

      {tab === 'rewards' && (
        <div className="kbv-store-grid">
          {STORE_PLATFORM.map(it => <StoreItem key={it.id} item={it} onBuy={buy} />)}
        </div>
      )}

      {tab === 'cosmetics' && (
        <div className="kbv-store-grid cosmetics">
          {STORE_COSMETICS.map(it => <StoreItem key={it.id} item={it} onBuy={buy} />)}
        </div>
      )}

      {tab === 'custom' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--kb-primary-soft)', border: '1px solid var(--kb-primary-border)', borderRadius: 12, padding: '10px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <KIcon name="sparkle" size={18} style={{ color: 'var(--kb-primary)' }} />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--kb-primary-ink)', fontSize: 13 }}>Tus recompensas, tus reglas</div>
                <div style={{ fontSize: 12, color: 'var(--kb-text-2)' }}>Diseña recompensas que importen — un café, una hora de juegos, una compra que has querido. Tu Hero acumula monedas y materia oscura; tú decides en qué se gastan.</div>
              </div>
            </div>
            <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => { setEditing(null); setCreateOpen(true); }}>
              <KIcon name="plus" size={14} /> Nueva recompensa
            </button>
          </div>

          <div className="kbv-store-grid">
            {custom.map(it => <StoreItem key={it.id} item={it} onBuy={buy} onEdit={(r) => { setEditing(r); setCreateOpen(true); }} onDelete={removeCustom} />)}
            <button className="kbv-store-add" type="button" onClick={() => { setEditing(null); setCreateOpen(true); }}>
              <span className="glyph"><KIcon name="plus" size={20} /></span>
              <span className="name">Crear recompensa</span>
              <span className="sub">Algo real que canjeas con tus monedas o materia oscura.</span>
            </button>
          </div>
        </>
      )}

      {createOpen && (
        <CreateRewardModal
          edit={editing}
          onClose={() => { setCreateOpen(false); setEditing(null); }}
          onSave={saveCustom}
        />
      )}
    </div>
  );
}

// =================================================================
// LECTURA — Books log with notes & learnings
// =================================================================
const SESSION_KIND_LABELS = {
  reading: 'Lectura',
  rereading: 'Relectura',
  notes: 'Notas',
};

const BOOK_FORMATS = {
  physical: { label: 'Físico',            color: 'var(--kb-coin-ink)', icon: 'book' },
  digital:  { label: 'Digital',           color: 'var(--kb-gem)', icon: 'book-open' },
  kindle:   { label: 'Lector electrónico', color: 'var(--kb-text)', icon: 'tablet' },
  audible:  { label: 'Audiolibro',        color: 'var(--area-community)', icon: 'headphones' },
};

// El Acervo — dónde vive cada libro. Lugares/dispositivos registrados por el usuario.
const READING_LOCATIONS = [
  { id: 'loc-sala',   name: 'Librero de la sala',   type: 'shelf',    icon: 'book',       books: 24 },
  { id: 'loc-estudio',name: 'Repisa del estudio',   type: 'shelf',    icon: 'book',       books: 11 },
  { id: 'loc-kindle', name: 'Kindle Paperwhite',    type: 'ereader',  icon: 'tablet',     books: 38 },
  { id: 'loc-ipad',   name: 'iPad de Mateo',        type: 'ereader',  icon: 'tablet',     books: 9 },
  { id: 'loc-icloud', name: 'iCloud · Libros',      type: 'cloud',    icon: 'cloud',      books: 17 },
  { id: 'loc-laptop', name: 'MacBook · Documentos', type: 'device',   icon: 'laptop',     books: 6 },
  { id: 'loc-audible',name: 'Audible',              type: 'platform', icon: 'headphones', books: 14 },
  { id: 'loc-spotify',name: 'Spotify · audiolibros',type: 'platform', icon: 'headphones', books: 5 },
];
// Qué tipos de ubicación aplican según el formato del libro.
const FORMAT_LOCATION = {
  physical: { types: ['shelf'],            label: 'Ubicación física',         hint: 'Repisa, librero o lugar donde lo guardas.', addLabel: 'estante / lugar' },
  kindle:   { types: ['ereader'],          label: 'Dispositivo',              hint: 'En qué lector electrónico lo tienes.',      addLabel: 'dispositivo' },
  digital:  { types: ['cloud', 'device'],  label: '¿Dónde está el archivo?',  hint: 'Nube, computadora o dispositivo donde vive el archivo.', addLabel: 'nube / equipo' },
  audible:  { types: ['platform'],         label: 'Plataforma de audio',      hint: 'Dónde lo escuchas.',                        addLabel: 'plataforma' },
};
const LOC_TYPE_LABEL = { shelf: 'Estante', ereader: 'Lector', cloud: 'Nube', device: 'Equipo', platform: 'Audio' };
const LOC_TYPE_COLOR = { shelf: 'var(--kb-coin-ink)', ereader: 'var(--kb-text)', cloud: 'var(--kb-gem)', device: 'var(--kb-primary)', platform: 'var(--area-community)' };
const LOC_TYPE_ICON  = { shelf: 'book', ereader: 'tablet', cloud: 'cloud', device: 'laptop', platform: 'headphones' };

const DEMO_BOOKS = [
  {
    id: 'b1', title: 'Atomic Habits', author: 'James Clear', pages: 320, page: 127,
    status: 'reading', rating: 0, cover: 'linear-gradient(135deg, #2A3F8F 0%, #1B2A60 100%)',
    started: '2026-05-01',
    format: 'kindle',
    editorial: 'Avery · Penguin Random House', isbn: '978-0-7352-1129-2', genre: 'Hábitos · Productividad', year: 2018, anticipation: 5,
    sessions: [
      { id: 's1', date: '2026-05-22', from: 105, to: 127, mins: 38, kind: 'reading', xp: 22 },
      { id: 's2', date: '2026-05-19', from: 80,  to: 105, mins: 42, kind: 'reading', xp: 25 },
      { id: 's3', date: '2026-05-15', from: 50,  to: 80,  mins: 45, kind: 'reading', xp: 28 },
      { id: 's4', date: '2026-05-08', from: 20,  to: 50,  mins: 50, kind: 'reading', xp: 30 },
      { id: 's5', date: '2026-05-01', from: 0,   to: 20,  mins: 35, kind: 'reading', xp: 18 },
    ],
    notes: [
      { id: 'n1', kind: 'learning', body: 'Los hábitos son la interés compuesto de la auto-mejora — 1% mejor cada día = 37× al año.', when: 'Cap. 1' },
      { id: 'n2', kind: 'idea', body: 'No te enfoques en metas, enfócate en sistemas. Las metas son para definir dirección; los sistemas, para avanzar.', when: 'Cap. 1' },
      { id: 'n3', kind: 'quote', body: 'Cada acción es un voto a favor del tipo de persona que quieres ser.', when: 'Cap. 2' },
    ],
  },
  {
    id: 'b2', title: 'Deep Work', author: 'Cal Newport', pages: 296, page: 296,
    status: 'done', rating: 5, cover: 'linear-gradient(135deg, #2D4A3A 0%, #15301F 100%)',
    started: '2026-03-15', finished: '2026-04-22',
    format: 'physical',
    editorial: 'Grand Central Publishing', isbn: '978-1-4555-8669-1', genre: 'Productividad · Foco', year: 2016, anticipation: 4,
    sessions: [
      { id: 's6', date: '2026-04-22', from: 250, to: 296, mins: 60, kind: 'reading', xp: 38 },
      { id: 's7', date: '2026-04-15', from: 200, to: 250, mins: 55, kind: 'reading', xp: 32 },
      { id: 's8', date: '2026-04-08', from: 150, to: 200, mins: 50, kind: 'reading', xp: 30 },
      { id: 's9', date: '2026-03-30', from: 100, to: 150, mins: 65, kind: 'reading', xp: 36 },
      { id: 's10',date: '2026-03-23', from: 50,  to: 100, mins: 70, kind: 'reading', xp: 40 },
      { id: 's11',date: '2026-03-15', from: 0,   to: 50,  mins: 80, kind: 'reading', xp: 45 },
    ],
    notes: [
      { id: 'n4', kind: 'learning', body: 'Hay dos tipos de trabajo: superficial y profundo. El profundo crea valor real y es escaso en la economía actual.', when: 'Cap. 1' },
      { id: 'n5', kind: 'opinion', body: 'Cambió cómo organizo mi semana. Bloques de 90 min sin notificaciones, mañanas reservadas. Diferencia brutal en output.', when: 'Cierre' },
      { id: 'n6', kind: 'quote', body: 'La capacidad de hacer trabajo profundo es cada vez más rara y al mismo tiempo más valiosa.', when: 'Intro' },
    ],
  },
  {
    id: 'b3', title: 'Range', author: 'David Epstein', pages: 352, page: 352,
    status: 'done', rating: 4, cover: 'linear-gradient(135deg, #8A5630 0%, #4E2E16 100%)',
    started: '2026-02-01', finished: '2026-03-10',
    format: 'digital', genre: 'Aprendizaje · Ensayo', anticipation: 3,
    sessions: [
      { id: 's12', date: '2026-03-10', from: 280, to: 352, mins: 72, kind: 'reading', xp: 40 },
      { id: 's13', date: '2026-03-01', from: 200, to: 280, mins: 65, kind: 'reading', xp: 35 },
      { id: 's14', date: '2026-02-20', from: 120, to: 200, mins: 70, kind: 'reading', xp: 38 },
      { id: 's15', date: '2026-02-10', from: 60,  to: 120, mins: 50, kind: 'reading', xp: 30 },
      { id: 's16', date: '2026-02-01', from: 0,   to: 60,  mins: 55, kind: 'reading', xp: 32 },
    ],
    notes: [
      { id: 'n7', kind: 'learning', body: 'Los generalistas suelen ganar a largo plazo en dominios complejos. Especializarse temprano sobreestima ventajas.', when: 'Cap. 1' },
      { id: 'n8', kind: 'opinion', body: 'Me dio permiso de seguir explorando intereses. La presión a especializarse es a veces dañina.', when: 'Cierre' },
    ],
  },
  {
    id: 'b4', title: 'The Almanack of Naval Ravikant', author: 'Eric Jorgenson', pages: 244, page: 244,
    status: 'done', rating: 5, cover: 'linear-gradient(135deg, #C2A65A 0%, #6E5424 100%)',
    started: '2026-01-05', finished: '2026-01-25',
    format: 'audible', genre: 'Riqueza · Filosofía', anticipation: 5,
    sessions: [
      { id: 's17', date: '2026-01-25', from: 180, to: 244, mins: 50, kind: 'reading', xp: 28 },
      { id: 's18', date: '2026-01-18', from: 120, to: 180, mins: 45, kind: 'reading', xp: 25 },
      { id: 's19', date: '2026-01-12', from: 60,  to: 120, mins: 50, kind: 'reading', xp: 28 },
      { id: 's20', date: '2026-01-05', from: 0,   to: 60,  mins: 55, kind: 'reading', xp: 30 },
    ],
    notes: [
      { id: 'n9', kind: 'quote', body: 'Aprende a vender, aprende a construir. Si haces ambas cosas, serás imparable.', when: 'Wealth' },
      { id: 'n10', kind: 'learning', body: 'La riqueza son activos que generan dinero mientras duermes. El dinero es una forma de transferir tiempo y trabajo.', when: 'Wealth' },
    ],
  },
  {
    id: 'b5', title: 'Sapiens', author: 'Yuval Noah Harari', pages: 464, page: 60,
    status: 'paused', rating: 0, cover: 'linear-gradient(135deg, #6E2E2E 0%, #401414 100%)',
    started: '2026-04-01',
    format: 'physical', genre: 'Historia · Ensayo', anticipation: 4,
    sessions: [
      { id: 's21', date: '2026-04-08', from: 30, to: 60, mins: 35, kind: 'reading', xp: 18 },
      { id: 's22', date: '2026-04-01', from: 0,  to: 30, mins: 32, kind: 'reading', xp: 16 },
    ],
    notes: [],
  },
  {
    id: 'b6', title: 'Thinking in Systems', author: 'Donella Meadows', pages: 240, page: 0,
    status: 'wishlist', rating: 0, cover: 'linear-gradient(135deg, #5B6478 0%, #2A2F3D 100%)',
    genre: 'Sistemas · Pensamiento', anticipation: 4,
    sessions: [],
    notes: [],
  },
];

const NOTE_KIND_LABELS = {
  learning: 'Aprendizaje',
  opinion: 'Opinión',
  quote: 'Cita',
  idea: 'Idea',
};

// Mock external catalog (Open Library / Google Books style)
const CATALOG_RESULTS = [
  { id: 'c1', title: 'Hyperion',         author: 'Dan Simmons',     pages: 482, cover: 'linear-gradient(135deg, #2D1B4D 0%, #14071F 100%)', source: 'Open Library' },
  { id: 'c2', title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', pages: 320, cover: 'linear-gradient(135deg, #6B2D1F 0%, #3D1107 100%)', source: 'Google Books' },
  { id: 'c3', title: 'A Brief History of Time', author: 'Stephen Hawking', pages: 256, cover: 'linear-gradient(135deg, #0A1A4F 0%, #050B26 100%)', source: 'Open Library' },
  { id: 'c4', title: 'Educated',         author: 'Tara Westover',   pages: 334, cover: 'linear-gradient(135deg, #6E5424 0%, #3B2C0D 100%)', source: 'Google Books' },
  { id: 'c5', title: 'Project Hail Mary',author: 'Andy Weir',       pages: 476, cover: 'linear-gradient(135deg, #C9A044 0%, #6E5424 100%)', source: 'Open Library' },
  { id: 'c6', title: 'The Power of Now', author: 'Eckhart Tolle',   pages: 236, cover: 'linear-gradient(135deg, #1B3D24 0%, #0C1F12 100%)', source: 'Google Books' },
];

function BookCard({ book, onClick }) {
  const pct = book.pages > 0 ? (book.page / book.pages) * 100 : 0;
  const fmt = BOOK_FORMATS[book.format] || null;
  return (
    <div className="kbv-book-card" onClick={onClick}>
      <div style={{ display: 'flex', gap: 14 }}>
        <div className="cover" style={{ background: book.coverImg ? `center/cover no-repeat url(${book.coverImg})` : book.cover, position: 'relative' }}>
          {!book.coverImg && book.title.toUpperCase().split(' ').slice(0, 2).join('\n')}
          {fmt && (
            <span className="format-pip" style={{ background: fmt.color }} title={fmt.label}>
              <KIcon name={fmt.icon} size={10} />
            </span>
          )}
        </div>
        <div className="body">
          <span className="title">{book.title}</span>
          <span className="author">{book.author} · {book.pages} pp</span>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className={`status ${book.status}`}>
              {book.status === 'reading' ? 'Leyendo' : book.status === 'done' ? 'Terminado' : book.status === 'wishlist' ? 'Wishlist' : 'En pausa'}
            </span>
            {fmt && (
              <span className="format-chip" style={{ '--c': fmt.color }}>
                <KIcon name={fmt.icon} size={9} /> {fmt.label}
              </span>
            )}
          </div>
          {book.status === 'done' && book.rating > 0 && (
            <div className="stars">
              {[1, 2, 3, 4, 5].map(n => <span key={n} className={n <= book.rating ? '' : 'off'}>★</span>)}
            </div>
          )}
          {(book.status === 'reading' || book.status === 'paused') && (
            <>
              <div className="progress-mini">
                <div className="fill" style={{ width: `${pct}%`, background: book.status === 'paused' ? 'var(--kb-text-3)' : 'var(--kb-primary)' }} />
              </div>
              <span className="kbv-meta" style={{ marginTop: 2 }}>{book.page}/{book.pages} ({Math.round(pct)}%)</span>
            </>
          )}
          {(book.sessions || []).length > 0 && (
            <span className="kbv-meta" style={{ marginTop: 2, fontFamily: 'var(--kb-f-mono)', fontWeight: 700, color: 'var(--kb-text-2)', fontSize: 10 }}>
              {book.sessions.length} sesión{book.sessions.length === 1 ? '' : 'es'} · {(book.sessions.reduce((a, s) => a + (s.mins || 0), 0) / 60).toFixed(1)}h leídas
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Book edit modal — tags, dates, format, full details
// ─────────────────────────────────────────────────────────────
function BookEditModal({ book, onClose, onSave, isNew = false }) {
  const [b, setB] = React.useState({
    title: book.title || '',
    author: book.author || '',
    pages: book.pages || 0,
    page: book.page || 0,
    status: book.status || 'reading',
    rating: book.rating || 0,
    format: book.format || 'physical',
    started: book.started || new Date().toISOString().slice(0, 10),
    finished: book.finished || '',
    tags: book.tags || (isNew ? [] : ['no-ficción', 'productividad']),
    publisher: book.publisher || book.editorial || '',
    year: book.year || '',
    isbn: book.isbn || '',
    genre: book.genre || '',
    anticipation: book.anticipation || 3,
    summary: book.summary || '',
    why: book.why || '',
    location: book.location || '',
    cover: book.cover || 'linear-gradient(135deg, #5B6478, #2A2F3D)',
    coverImg: book.coverImg || null,
    rereadCount: book.rereadCount || 0,
  });
  const [tagInput, setTagInput] = React.useState('');
  const [customLoc, setCustomLoc] = React.useState(false);
  const [reSearch, setReSearch] = React.useState(false);
  const apiLocked = !!book.fromCatalog && !reSearch; // datos del catálogo: no editables salvo "Buscar de nuevo"
  const lockProps = apiLocked ? { disabled: true, className: 'locked-field' } : {};

  function update(field, value) { setB(prev => ({ ...prev, [field]: value })); }
  function onCover(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => update('coverImg', r.result);
    r.readAsDataURL(f);
  }
  function addTag() {
    if (!tagInput.trim() || b.tags.includes(tagInput.trim())) return;
    update('tags', [...b.tags, tagInput.trim()]);
    setTagInput('');
  }
  function delTag(t) { update('tags', b.tags.filter(x => x !== t)); }

  const locCfg = FORMAT_LOCATION[b.format] || FORMAT_LOCATION.physical;
  const locOptions = READING_LOCATIONS.filter(l => locCfg.types.includes(l.type));
  const knownLoc = locOptions.some(l => l.name === b.location);
  const showCustom = customLoc || (b.location && !knownLoc);

  const STATUS_OPTS = [
    { id: 'wishlist', label: 'Wishlist', color: 'var(--kb-coin)' },
    { id: 'reading',  label: 'Leyendo',  color: 'var(--kb-primary)' },
    { id: 'paused',   label: 'En pausa', color: 'var(--kb-text-3)' },
    { id: 'abandoned',label: 'Abandonado', color: 'var(--kb-hp)' },
    { id: 'done',     label: 'Terminado', color: 'var(--kb-primary)' },
  ];

  return (
    <KBVModal
      title={isNew ? 'Registrar libro' : `Editar: ${book.title}`}
      sub={isNew ? 'Mismos campos que al editar — busca para autocompletar o captura a mano: estado, formato, dónde lo tienes, etiquetas, ganas y por qué leerlo.' : 'Información completa del libro. Etiquetas para búsqueda, formato para identificar dónde lo lees, dates para tu historial.'}
      onClose={onClose}
      size="lg"
      footer={
        <div className="right" style={{ marginLeft: 'auto' }}>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" disabled={!b.title.trim()} onClick={() => { onSave({ ...book, ...b }); if (isNew) onClose(); }}>
            {isNew ? 'Registrar libro' : 'Guardar cambios'} <KIcon name="check" size={14} />
          </button>
        </div>
      }>
      {/* Portada — opcional, el usuario puede subir su propia foto */}
      <div className="kbv-book-cover-edit">
        <div className="cover-prev" style={{ background: b.coverImg ? `center/cover no-repeat url(${b.coverImg})` : b.cover }}>
          {!b.coverImg && <span>{(b.title || 'Nuevo libro').toUpperCase().split(' ').slice(0, 2).join('\n')}</span>}
        </div>
        <div className="cover-actions">
          <span className="kbv-label" style={{ marginBottom: 0 }}>Portada</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label className="kbv-btn kbv-btn-secondary" style={{ cursor: 'pointer' }}>
              <KIcon name="image-up" size={13} /> {b.coverImg ? 'Cambiar foto' : 'Subir foto'}
              <input type="file" accept="image/*" onChange={onCover} style={{ display: 'none' }} />
            </label>
            {b.coverImg && <button type="button" className="kbv-btn-link" style={{ fontSize: 12 }} onClick={() => update('coverImg', null)}>Quitar</button>}
          </div>
          <span className="hint" style={{ fontSize: 11 }}>Opcional. Sube la foto de tu ejemplar — o se autocompleta al buscar el título.</span>
        </div>
      </div>

      {apiLocked && (
        <div className="kbv-catalog-banner" style={{ marginBottom: 4 }}>
          <KIcon name="check" size={13} /> Datos del catálogo (título, autor, editorial, ISBN, género, año) — no editables.
          <button type="button" className="kbv-btn-link" style={{ fontSize: 12, marginLeft: 8 }} onClick={() => setReSearch(true)}>Buscar de nuevo para cambiarlos</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <div className="kbv-form-row">
          <label>Título {!apiLocked && <span className="kbv-meta">— busca para autocompletar</span>}</label>
          <div className="kbv-search-title">
            <input type="text" value={b.title} onChange={(e) => update('title', e.target.value)} placeholder="Escribe y busca en catálogo público…" autoFocus {...lockProps} />
            <button type="button" className="kbv-btn kbv-btn-secondary" title="Buscar en catálogo público (Open Library)" onClick={() => setReSearch(true)}><KIcon name="sparkle" size={13} /> {apiLocked ? 'Buscar de nuevo' : 'Buscar'}</button>
          </div>
          {!apiLocked && <span className="hint" style={{ fontSize: 11 }}>Al elegir un resultado se autocompletan autor, editorial, año y portada.</span>}
        </div>
        <div className="kbv-form-row">
          <label>Año</label>
          <input type="text" value={b.year} onChange={(e) => update('year', e.target.value)} placeholder="2018" {...lockProps} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <div className="kbv-form-row">
          <label>Autor(es)</label>
          <input type="text" value={b.author} onChange={(e) => update('author', e.target.value)} {...lockProps} />
        </div>
        <div className="kbv-form-row">
          <label>Editorial</label>
          <input type="text" value={b.publisher} onChange={(e) => update('publisher', e.target.value)} placeholder="Penguin Books..." {...lockProps} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 12 }}>
        <div className="kbv-form-row">
          <label>ISBN</label>
          <input type="text" value={b.isbn} onChange={(e) => update('isbn', e.target.value)} placeholder="978-…" {...lockProps} />
        </div>
        <div className="kbv-form-row">
          <label>Género</label>
          <input type="text" value={b.genre} onChange={(e) => update('genre', e.target.value)} placeholder="p. ej. Ensayo, Novela, Productividad…" {...lockProps} />
        </div>
      </div>

      <div className="kbv-form-row">
          <label>¿Cuántas ganas tienes de leerlo?</label>
          <div className="kbv-anticipation">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} type="button" className={`ant-flame ${n <= b.anticipation ? 'on' : ''}`} onClick={() => update('anticipation', n)} title={`${n}/5`}>
                <KIcon name="flame" size={18} />
              </button>
            ))}
          </div>
        </div>

      <div className="kbv-form-row">
        <label>Estado</label>
        <div className="kbv-cat-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {STATUS_OPTS.map(s => (
            <button key={s.id} type="button"
                    className={`kbv-cat-tile ${b.status === s.id ? 'on' : ''}`}
                    style={{ '--c': s.color }}
                    onClick={() => update('status', s.id)}>
              <span className="lbl">{s.label}</span>
            </button>
          ))}
        </div>
        {b.status === 'abandoned' && (
          <div style={{ marginTop: 8 }}>
            <textarea value={b.abandonReason || ''} onChange={(e) => update('abandonReason', e.target.value)} placeholder="¿Por qué lo dejaste? (opcional) — no te juzgamos, ayuda a tu historial." style={{ minHeight: 54 }} />
          </div>
        )}
      </div>

      <div className="kbv-form-row">
        <label>Formato — dónde lo lees</label>
        <div className="kbv-cat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {Object.entries(BOOK_FORMATS).map(([k, def]) => (
            <button key={k} type="button"
                    className={`kbv-cat-tile ${b.format === k ? 'on' : ''}`}
                    style={{ '--c': def.color }}
                    onClick={() => update('format', k)}>
              <span className="glyph"><KIcon name={def.icon} size={16} /></span>
              <span className="lbl">{def.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <div className="kbv-form-row">
          <KbStepper label="Total páginas" value={b.pages} onChange={(n) => update('pages', n)} min={1} max={9999} step={10} />
        </div>
        <div className="kbv-form-row">
          <KbStepper label="Página actual" value={b.page} onChange={(n) => update('page', n)} min={0} max={b.pages} step={5} hint={`de ${b.pages}`} />
        </div>
        <div className="kbv-form-row">
          <KbStepper label="Veces releído" value={b.rereadCount} onChange={(n) => update('rereadCount', n)} min={0} max={99} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="kbv-form-row">
          <label>Iniciado</label>
          <input type="date" value={b.started} onChange={(e) => update('started', e.target.value)} />
        </div>
        <div className="kbv-form-row">
          <label>Terminado</label>
          <input type="date" value={b.finished} onChange={(e) => update('finished', e.target.value)} disabled={b.status !== 'done'} />
        </div>
      </div>

      {b.status === 'done' && (
        <div className="kbv-form-row">
          <label>Rating</label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} type="button"
                      onClick={() => update('rating', n)}
                      style={{
                        border: 0, background: 'transparent', cursor: 'pointer',
                        fontSize: 26, padding: 4,
                        color: n <= b.rating ? 'var(--kb-coin)' : 'var(--kb-border-strong)',
                      }}>★</button>
            ))}
            {b.rating > 0 && (
              <button type="button" className="kbv-btn-link" style={{ marginLeft: 8, fontSize: 12 }}
                      onClick={() => update('rating', 0)}>Limpiar</button>
            )}
          </div>
        </div>
      )}

      <div className="kbv-form-row">
        <label>Etiquetas</label>
        <div className="book-tags-row">
          {b.tags.map(t => (
            <span key={t} className="book-tag">
              {t}
              <button type="button" onClick={() => delTag(t)} aria-label="Quitar etiqueta">×</button>
            </span>
          ))}
          <div className="book-tag-add">
            <input type="text" value={tagInput}
                   onChange={(e) => setTagInput(e.target.value)}
                   onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                   placeholder="Agregar etiqueta..." />
            <button type="button" onClick={addTag}><KIcon name="plus" size={11} /></button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        <div className="kbv-form-row">
          <label>{locCfg.label}</label>
          <select
            value={showCustom ? '__custom' : b.location}
            onChange={(e) => {
              if (e.target.value === '__custom') { setCustomLoc(true); update('location', ''); }
              else { setCustomLoc(false); update('location', e.target.value); }
            }}>
            <option value="">— Selecciona {locCfg.addLabel} —</option>
            {locOptions.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
            <option value="__custom">+ Otro / nuevo {locCfg.addLabel}…</option>
          </select>
          {showCustom && (
            <input type="text" value={b.location} onChange={(e) => update('location', e.target.value)}
                   placeholder={`Nombre del ${locCfg.addLabel}`} style={{ marginTop: 8 }} autoFocus />
          )}
          <span className="hint">{locCfg.hint} Gestiona tus lugares y dispositivos en <strong>El Acervo</strong>.</span>
        </div>
      </div>

      <div className="kbv-form-row">
        <label>Resumen / sinopsis personal</label>
        <textarea value={b.summary} onChange={(e) => update('summary', e.target.value)}
                  placeholder="En 2-3 líneas, ¿de qué va? Lo que recordarás cuando vuelvas a este libro."
                  style={{ minHeight: 80 }} />
      </div>

      <div className="kbv-form-row">
        <label>¿Por qué este libro?</label>
        <textarea value={b.why} onChange={(e) => update('why', e.target.value)}
                  placeholder="Qué esperas aprender o cómo llegaste a él." style={{ minHeight: 60 }} />
      </div>
    </KBVModal>
  );
}

// ─────────────────────────────────────────────────────────────
// Música para leer — reproductor mock (Spotify / YouTube Music).
// Emulado: no reproduce audio real; liga tu cuenta para sonar.
// ─────────────────────────────────────────────────────────────
function ReadingMusicPlayer() {
  const TRACKS = [
    { t: 'Weightless', a: 'Marconi Union', art: 'linear-gradient(135deg,#3B7D8C,#1B3A45)', len: '8:09' },
    { t: 'Saturn', a: 'Sleeping at Last', art: 'linear-gradient(135deg,#6E5BA8,#2E2350)', len: '4:51' },
    { t: 'Awake', a: 'Tycho', art: 'linear-gradient(135deg,#C68A4E,#6E4423)', len: '5:34' },
    { t: 're: stacks', a: 'Bon Iver', art: 'linear-gradient(135deg,#4C7A5B,#1F3A2A)', len: '6:40' },
  ];
  const [src, setSrc] = React.useState('spotify');
  const [i, setI] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [pos, setPos] = React.useState(22);
  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setPos(p => (p >= 100 ? 0 : p + 0.7)), 200);
    return () => clearInterval(id);
  }, [playing]);
  function go(d) { setI(n => (n + d + TRACKS.length) % TRACKS.length); setPos(0); }
  const tr = TRACKS[i];
  return (
    <div className={`kbv-read-music ${src}`}>
      <div className="rm-head">
        <span className="rm-title"><KIcon name="headphones" size={13} /> Música para concentrarte</span>
        <div className="rm-src">
          <button type="button" className={src === 'spotify' ? 'on' : ''} onClick={() => setSrc('spotify')}>Spotify</button>
          <button type="button" className={src === 'ytm' ? 'on' : ''} onClick={() => setSrc('ytm')}>YT Music</button>
        </div>
      </div>
      <div className="rm-now">
        <div className="rm-art" style={{ background: tr.art }}>
          <span className={`rm-eq ${playing ? 'on' : ''}`}><i /><i /><i /><i /></span>
        </div>
        <div className="rm-info">
          <span className="rm-track">{tr.t}</span>
          <span className="rm-artist">{tr.a} · Focus Flow</span>
          <div className="rm-bar"><span style={{ width: `${pos}%` }} /></div>
        </div>
        <div className="rm-ctrl">
          <button type="button" onClick={() => go(-1)} title="Anterior"><KIcon name="arrow-left" size={14} /></button>
          <button type="button" className="play" onClick={() => setPlaying(p => !p)} title={playing ? 'Pausar' : 'Reproducir'}>
            <KIcon name={playing ? 'square' : 'book-open'} size={15} />
          </button>
          <button type="button" onClick={() => go(1)} title="Siguiente"><KIcon name="arrow-right" size={14} /></button>
        </div>
      </div>
      <span className="rm-foot">Conecta tu cuenta de {src === 'spotify' ? 'Spotify' : 'YouTube Music'} para sonar de verdad · la música no suma a tu tiempo de lectura.</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function ReadingSessionModal({ book, onClose, onComplete }) {
  const [phase, setPhase] = React.useState('active'); // active | summary
  const [secs, setSecs] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [pageFrom] = React.useState(book.page || 0);
  const [pageTo, setPageTo] = React.useState(book.page || 0);

  React.useEffect(() => {
    if (paused || phase !== 'active') return;
    const id = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [paused, phase]);

  const mins = Math.max(1, Math.round(secs / 60));
  const pagesRead = Math.max(0, pageTo - pageFrom);
  const xpEarned = Math.round(mins * 0.6) + pagesRead * 2;
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');

  function endSession() {
    setPaused(true);
    setPhase('summary');
  }
  function complete(addNotes) {
    onComplete && onComplete({ mins, pageFrom, pageTo, xp: xpEarned, addNotes, note: null });
    onClose();
  }

  return (
    <KBVModal
      title={phase === 'active' ? 'Sesión de lectura' : 'Resumen de la sesión'}
      sub={phase === 'active' ? `${book.title} · ${book.author}` : 'Confirma hasta dónde llegaste y, si quieres, registra tus notas.'}
      onClose={onClose}
      footer={
        phase === 'active' ? (
          <div className="right" style={{ marginLeft: 'auto' }}>
            <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => setPaused(p => !p)}>
              {paused ? 'Reanudar' : 'Pausar'}
            </button>
            <button type="button" className="kbv-btn kbv-btn-danger" onClick={endSession}>
              <KIcon name="square" size={14} /> Terminar sesión
            </button>
          </div>
        ) : (
          <div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => complete(false)}>Guardar sin notas</button>
            <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => complete(true)}>
              Guardar y registrar nota <KIcon name="arrow-right" size={14} />
            </button>
          </div>
        )
      }>
      {phase === 'active' ? (
        <div className="kbv-session-active">
          <div className="timer">
            <div className="time">{mm}:{ss}</div>
            <div className="label">{paused ? 'Sesión pausada' : 'En sesión'}</div>
          </div>
          <div className="kbv-meta">
            Empezaste en la página {pageFrom}. Al terminar te pregunto hasta dónde llegaste — tú concéntrate en leer.
          </div>
          <div className="kbv-session-xp">
            <span className="lbl">XP estimado al cerrar</span>
            <span className="val">+{Math.round(mins * 0.6)} XP <small style={{ fontWeight: 500 }}>+ páginas</small></span>
            <span className="kbv-meta">en Sabiduría</span>
          </div>
          <ReadingMusicPlayer />
        </div>
      ) : (
        <div className="kbv-stack-12">
          <div className="kbv-form-row">
            <label>¿Hasta qué página llegaste?</label>
            <KbStepper value={pageTo} onChange={setPageTo} min={pageFrom} max={book.pages} step={5} suffix="pág." />
            <span className="kbv-meta">Empezaste en la página {pageFrom} de {book.pages}.</span>
          </div>
          <div className="kbv-session-summary">
            <div className="kpi">
              <span className="l">Tiempo</span>
              <span className="v">{mins}<small> min</small></span>
            </div>
            <div className="kpi">
              <span className="l">Páginas</span>
              <span className="v">{pagesRead}</span>
            </div>
            <div className="kpi">
              <span className="l">Ritmo</span>
              <span className="v">{mins > 0 ? Math.round(pagesRead / mins * 60) : '—'}<small> pp/h</small></span>
            </div>
            <div className="kpi xp">
              <span className="l">XP ganado</span>
              <span className="v">+{xpEarned}</span>
            </div>
          </div>
          <div className="kbv-meta" style={{ textAlign: 'center' }}>
            Al guardar, podrás registrar aprendizajes, citas, ideas u opiniones con el mismo registro de notas (y añadir varias).
          </div>
        </div>
      )}
    </KBVModal>
  );
}

// ─────────────────────────────────────────────────────────────
// Note composer — in-platform, multi-type (aprendizaje/opinión/cita/idea),
// voz a texto emulada, y para CITAS: foto o dictado.
// ─────────────────────────────────────────────────────────────
const NOTE_KIND_META = {
  learning: { l: 'Aprendizaje', icon: 'book-open', c: 'var(--area-community)' },
  opinion:  { l: 'Opinión',     icon: 'mood-meh',  c: 'var(--kb-good-soft)' },
  quote:    { l: 'Cita',        icon: 'sparkle',   c: 'var(--kb-coin)' },
  idea:     { l: 'Idea',        icon: 'flame',     c: 'var(--kb-gem)' },
};
const DICTATION_SAMPLES = [
  'La constancia supera al talento cuando el talento no es constante.',
  'Pequeños cambios diarios componen resultados extraordinarios con el tiempo.',
  'No subes al nivel de tus metas, caes al nivel de tus sistemas.',
  'Lo que se mide, mejora; lo que se celebra, se repite.',
];
function NoteComposerModal({ book, startVoice, onClose, onAdd }) {
  const [kind, setKind] = React.useState('learning');
  const [body, setBody] = React.useState('');
  const [chapter, setChapter] = React.useState('');
  const [page, setPage] = React.useState('');
  const [ref, setRef] = React.useState('');
  const [photo, setPhoto] = React.useState(null);
  const [voice, setVoice] = React.useState(!!startVoice);
  const [staged, setStaged] = React.useState([]);
  const [step, setStep] = React.useState('form'); // form | saved
  const [lastSaved, setLastSaved] = React.useState(null);
  const photoRef = React.useRef(null);

  // Dictado emulado: agrega palabras gradualmente mientras "escucha".
  React.useEffect(() => {
    if (!voice) return;
    const sentence = DICTATION_SAMPLES[Math.floor(Math.random() * DICTATION_SAMPLES.length)];
    const words = sentence.split(' ');
    let j = 0;
    const id = setInterval(() => {
      if (j >= words.length) { setVoice(false); clearInterval(id); return; }
      setBody(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + words[j]);
      j++;
    }, 320);
    return () => clearInterval(id);
  }, [voice]);

  function readPhoto(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const fr = new FileReader();
    fr.onload = () => setPhoto(fr.result);
    fr.readAsDataURL(file);
  }
  function buildNote() {
    const where = [chapter.trim(), page.trim() ? `pág. ${page.trim()}` : '', ref.trim()].filter(Boolean).join(' · ');
    return { id: 'n' + Math.random().toString(36).slice(2, 6), kind, body: body.trim(), when: where || 'Nota manual', chapter: chapter.trim(), page: page.trim(), ref: ref.trim(), photo: kind === 'quote' ? photo : null };
  }
  const canSave = body.trim() || (kind === 'quote' && photo);
  function reset() { setKind('learning'); setBody(''); setPhoto(null); setChapter(''); setPage(''); setRef(''); setVoice(false); }
  function saveOne() {
    if (!canSave) return;
    const n = buildNote();
    setStaged(s => [n, ...s]);
    setLastSaved(n);
    setStep('saved');
  }
  function finish() { onAdd(staged); onClose(); }     // guarda todo lo registrado y cierra
  function addAnother() { reset(); setStep('form'); }

  // ── Paso: confirmación tras guardar una nota ──
  if (step === 'saved') {
    const m = NOTE_KIND_META[lastSaved.kind] || {};
    return (
      <KBVModal title="Nota guardada" sub={book.title} onClose={finish}
        footer={
          <div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button type="button" className="kbv-btn kbv-btn-secondary" onClick={addAnother}><KIcon name="plus" size={14} /> Sí, añadir otra</button>
            <button type="button" className="kbv-btn kbv-btn-primary" onClick={finish}>No, listo <KIcon name="check" size={14} /></button>
          </div>
        }>
        <div className="nc-saved">
          <span className="nc-saved-ico"><KIcon name="check" size={26} /></span>
          <p className="nc-saved-q">Registré tu {(m.l || 'nota').toLowerCase()}. ¿Quieres añadir otra nota, cita o idea de este libro?</p>
          <div className="nc-saved-prev" style={{ '--c': m.c }}>
            <span className="tag">{m.l}</span>
            {lastSaved.photo && <img src={lastSaved.photo} alt="" />}
            <span className="txt">{lastSaved.body || '(solo foto)'}</span>
          </div>
          {staged.length > 1 && <span className="kbv-meta">{staged.length} notas registradas en esta tanda</span>}
        </div>
      </KBVModal>
    );
  }

  return (
    <KBVModal
      title="Nueva nota"
      sub={`${book.title} · elige el tipo y registra aprendizajes, opiniones, citas e ideas`}
      onClose={finish}
      footer={
        <div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" onClick={saveOne} disabled={!canSave}>
            Guardar nota <KIcon name="check" size={14} />
          </button>
        </div>
      }>
      <div className="kbv-note-composer">
        <div className="kbv-form-row">
          <label>Tipo de nota</label>
          <div className="nc-kinds">
            {Object.entries(NOTE_KIND_META).map(([k, m]) => (
              <button key={k} type="button" className={`nc-kind ${kind === k ? 'on' : ''}`} style={{ '--c': m.c }} onClick={() => setKind(k)}>
                <KIcon name={m.icon} size={14} /> {m.l}
              </button>
            ))}
          </div>
        </div>

        <div className="kbv-form-row">
          <label>{kind === 'quote' ? 'Cita textual' : 'Lo que registras'}</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} style={{ minHeight: 96 }}
            placeholder={kind === 'quote' ? 'Escribe la cita, díctala o sube una foto de la página…' : 'Una idea, un aprendizaje, una opinión — lo que te marcó.'} />
          <div className="nc-tools">
            <button type="button" className={`kbv-voice-btn ${voice ? 'recording' : ''}`} onClick={() => setVoice(v => !v)}>
              <KIcon name={voice ? 'square' : 'mic'} size={14} />
              <span>{voice ? 'Dictando…' : (kind === 'quote' ? 'Dictar cita' : 'Dictar')}</span>
            </button>
            <span className="kbv-meta">Reconocimiento on-device · solo guarda texto</span>
          </div>
        </div>

        {kind === 'quote' && (
          <div className="kbv-form-row">
            <label>Foto de la cita <span className="kbv-meta" style={{ fontWeight: 400 }}>(opcional · se guarda para usarla después)</span></label>
            <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { readPhoto(e.target.files && e.target.files[0]); e.target.value = ''; }} />
            {photo ? (
              <div className="nc-photo has">
                <img src={photo} alt="Cita" />
                <button type="button" className="nc-photo-x" onClick={() => setPhoto(null)}><KIcon name="x" size={13} /></button>
              </div>
            ) : (
              <button type="button" className="nc-photo" onClick={() => photoRef.current && photoRef.current.click()}>
                <KIcon name="camera" size={20} />
                <span>Tomar o subir foto de la página</span>
              </button>
            )}
          </div>
        )}

        <div className="kbv-form-row">
          <label>¿Dónde lo encontraste? <span className="kbv-meta" style={{ fontWeight: 400 }}>(opcional)</span></label>
          <div className="nc-where">
            <input type="text" value={chapter} onChange={(e) => setChapter(e.target.value)} placeholder="Capítulo / sección — p. ej. Cap. 3, Intro" />
            <input type="text" value={page} onChange={(e) => setPage(e.target.value)} placeholder="Página — p. ej. 87" style={{ maxWidth: 140 }} />
          </div>
          <input type="text" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="Referencia — p. ej. §12, ed. Gredos, Bekker 1094a" style={{ marginTop: 8 }} />
        </div>
      </div>
    </KBVModal>
  );
}

// ─────────────────────────────────────────────────────────────
// Detalle de una nota — vista completa al tocar una nota.
// ─────────────────────────────────────────────────────────────
function NoteDetailModal({ note, onClose }) {
  const m = NOTE_KIND_META[note.kind] || { l: note.kind, c: 'var(--kb-primary)' };
  const where = [note.chapter, note.page ? `pág. ${note.page}` : '', note.ref].filter(Boolean);
  return (
    <KBVModal title={m.l} sub="Detalle de la nota" onClose={onClose}
      footer={<div className="right" style={{ marginLeft: 'auto' }}><button type="button" className="kbv-btn kbv-btn-primary" onClick={onClose}>Cerrar</button></div>}>
      <div className="nc-detail" style={{ '--c': m.c }}>
        <span className="ncd-tag"><KIcon name={m.icon} size={13} /> {m.l}</span>
        {note.photo && <img className="ncd-photo" src={note.photo} alt="Foto de la cita" />}
        <p className={`ncd-body ${note.kind === 'quote' ? 'quote' : ''}`}>{note.body || '(sin texto)'}</p>
        {where.length > 0 && (
          <div className="ncd-where">
            {where.map((w, i) => <span key={i} className="ncd-chip"><KIcon name="book-open" size={11} /> {w}</span>)}
          </div>
        )}
        {(!where.length) && <span className="kbv-meta">{note.when}</span>}
      </div>
    </KBVModal>
  );
}

// ─────────────────────────────────────────────────────────────
// Book detail — separate "screen" view (push-replace inside Lectura)
// ─────────────────────────────────────────────────────────────
function BookDetail({ book, locations = [], onBack, onStartSession, onUpdateBook }) {
  const [showSession, setShowSession] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [composer, setComposer] = React.useState(null); // null | 'note' | 'voice'
  const [noteDetail, setNoteDetail] = React.useState(null);
  const [noteSearch, setNoteSearch] = React.useState('');
  const [noteKind, setNoteKind] = React.useState('all');
  const sessions = book.sessions || [];
  const totalMins = sessions.reduce((a, s) => a + (s.mins || 0), 0);
  const totalXP = sessions.reduce((a, s) => a + (s.xp || 0), 0);
  const pagesRead = sessions.reduce((a, s) => a + Math.max(0, (s.to || 0) - (s.from || 0)), 0);
  const avgPace = totalMins > 0 ? Math.round(pagesRead / totalMins * 60) : 0;
  const longestSession = sessions.reduce((a, s) => Math.max(a, s.mins || 0), 0);
  const learnings = (book.notes || []).filter(n => n.kind === 'learning').length;
  const quotes = (book.notes || []).filter(n => n.kind === 'quote').length;
  const ideas = (book.notes || []).filter(n => n.kind === 'idea').length;
  const opinions = (book.notes || []).filter(n => n.kind === 'opinion').length;
  const fmt = BOOK_FORMATS[book.format] || null;
  const bookLoc = (locations || []).find(l => l.name === book.location);
  const quickLink = bookLoc && bookLoc.link ? bookLoc : null;

  const filteredNotes = (book.notes || []).filter(n => {
    if (noteKind !== 'all' && n.kind !== noteKind) return false;
    if (noteSearch.trim() && !((n.body + ' ' + n.when).toLowerCase().includes(noteSearch.toLowerCase()))) return false;
    return true;
  });

  // Densidad de conocimiento — agrupa notas/ideas/citas/opiniones por capítulo.
  // Usa el capítulo explícito; ignora ruido de "Sesión de…"/"Nota manual".
  function noteChapter(n) {
    if (n.chapter && n.chapter.trim()) return n.chapter.trim();
    if (n.when && !/^(sesi[oó]n|nota manual)/i.test(n.when)) return n.when;
    return 'Sin capítulo';
  }
  const chapterCounts = {};
  (book.notes || []).forEach(n => {
    const k = noteChapter(n);
    chapterCounts[k] = (chapterCounts[k] || 0) + 1;
  });
  const hotRanges = Object.entries(chapterCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div className="kbv-main kbv-book-screen">
      <div className="kbv-page-head">
        <div>
          <button type="button" className="kbv-btn kbv-btn-secondary kbv-back-btn" onClick={onBack}>
            <KIcon name="arrow-left" size={12} /> Volver a Lectura
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="kbv-eyebrow" style={{ color: 'var(--kb-primary)' }}>Lectura · Libro</span>
            {fmt && (
              <span className="format-chip lg" style={{ '--c': fmt.color }}>
                <KIcon name={fmt.icon} size={11} /> {fmt.label}
              </span>
            )}
          </div>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>{book.title}</h1>
          <p className="kbv-body" style={{ marginTop: 4 }}>
            {book.author} · {book.pages} páginas · {book.status === 'done' ? `Iniciado ${book.started} · Terminado ${book.finished}` : book.status === 'reading' ? `Iniciado ${book.started}` : book.status === 'paused' ? `En pausa · iniciado ${book.started}` : 'En tu wishlist'}
          </p>
        </div>
        <div className="actions" style={{ gap: 8 }}>
          {quickLink && (
            <a className="kbv-btn kbv-btn-secondary" href={quickLink.link} target="_blank" rel="noopener noreferrer" title={`Abrir en ${quickLink.name}`}>
              <KIcon name={quickLink.type === 'platform' ? 'headphones' : 'layers'} size={14} /> {quickLink.type === 'platform' ? 'Escuchar' : 'Abrir'} en {quickLink.name}
            </a>
          )}
          {(book.status === 'reading' || book.status === 'paused') && (
            <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => setShowSession(true)}>
              <KIcon name="book-open" size={14} /> Iniciar sesión de lectura
            </button>
          )}
          {book.status === 'wishlist' && (
            <button type="button" className="kbv-btn kbv-btn-primary">
              <KIcon name="plus" size={14} /> Empezar a leer
            </button>
          )}
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => setEditOpen(true)}>
            <KIcon name="edit" size={14} /> Editar libro
          </button>
        </div>
      </div>

      {editOpen && (
        <BookEditModal book={book} onClose={() => setEditOpen(false)} onSave={(b) => {
          onUpdateBook && onUpdateBook(b);
          setEditOpen(false);
        }} />
      )}

      {/* Compact hero: cover small + progress inline */}
      <div className="kbv-book-hero compact">
        <div className="cover" style={{ background: book.coverImg ? `center/cover no-repeat url(${book.coverImg})` : book.cover }}>
          {!book.coverImg && book.title.toUpperCase()}
        </div>
        <div className="info">
          <div className="block">
            <span className="kbv-meta">PROGRESO</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: 'var(--kb-f-display)', fontSize: 24, fontWeight: 800, color: 'var(--kb-text)' }}>
                {book.page}<small style={{ fontSize: 13, color: 'var(--kb-text-2)', fontWeight: 600 }}> / {book.pages}</small>
              </span>
              <span style={{ fontFamily: 'var(--kb-f-mono)', fontWeight: 700, color: 'var(--kb-primary)', fontSize: 14 }}>
                {Math.round((book.page / book.pages) * 100)}%
              </span>
            </div>
            <div className="kbv-progress" style={{ marginTop: 4, height: 6 }}>
              <div className="fill" style={{ width: `${(book.page / book.pages) * 100}%` }} />
            </div>
          </div>
          {book.status === 'done' && book.rating > 0 && (
            <div className="block">
              <span className="kbv-meta">RATING</span>
              <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
                {[1, 2, 3, 4, 5].map(n =>
                  <span key={n} style={{ color: n <= book.rating ? 'var(--kb-coin)' : 'var(--kb-border-strong)', fontSize: 18 }}>★</span>
                )}
              </div>
            </div>
          )}
          <div className="block">
            <span className="kbv-meta">SESIONES</span>
            <div style={{ fontFamily: 'var(--kb-f-display)', fontSize: 24, fontWeight: 800, color: 'var(--kb-text)' }}>
              {sessions.length}<small style={{ fontSize: 13, fontWeight: 600, color: 'var(--kb-text-2)' }}> · {(totalMins/60).toFixed(1)}h</small>
            </div>
          </div>
          <div className="block">
            <span className="kbv-meta">RITMO</span>
            <div style={{ fontFamily: 'var(--kb-f-display)', fontSize: 24, fontWeight: 800, color: 'var(--kb-text)' }}>
              {avgPace}<small style={{ fontSize: 13, fontWeight: 600, color: 'var(--kb-text-2)' }}> pp/h</small>
            </div>
          </div>
        </div>
      </div>

      {/* Notes-first layout: notes section takes most of the width */}
      <div className="kbv-book-detail-grid notes-first">
        {/* Notes — the BIG section */}
        <div className="kbv-fin-card notes-card">
          <div className="head">
            <div>
              <h3 className="kbv-h3">Notas, aprendizajes y citas</h3>
              <span className="kbv-meta">{filteredNotes.length} de {(book.notes || []).length} · busca, filtra y registra desde aquí</span>
            </div>
            <div className="notes-head-actions">
              <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => setComposer('note')}>
                <KIcon name="plus" size={14} /> Nueva nota o transcripción
              </button>
            </div>
          </div>

          {/* Note KPIs */}
          <div className="note-kpi-strip">
            <div className="kpi" style={{ '--c': 'var(--area-community)' }}>
              <span className="v">{learnings}</span>
              <span className="l">Aprendizajes</span>
            </div>
            <div className="kpi" style={{ '--c': 'var(--kb-coin)' }}>
              <span className="v">{quotes}</span>
              <span className="l">Citas</span>
            </div>
            <div className="kpi" style={{ '--c': 'var(--kb-gem)' }}>
              <span className="v">{ideas}</span>
              <span className="l">Ideas</span>
            </div>
            <div className="kpi" style={{ '--c': 'var(--kb-good-soft)' }}>
              <span className="v">{opinions}</span>
              <span className="l">Opiniones</span>
            </div>
          </div>

          {/* Densidad de conocimiento — en qué capítulos se concentran tus notas, ideas y citas */}
          {hotRanges.length > 0 && (
            <div className="insight-density">
              <span className="kbv-meta">Densidad de conocimiento · por capítulo</span>
              <div className="bars">
                {hotRanges.map(([cap, n]) => (
                  <div key={cap} className="bar">
                    <span className="bar-label">{cap}</span>
                    <div className="bar-track"><div className="bar-fill" style={{ width: `${(n / Math.max(...hotRanges.map(([_, c]) => c))) * 100}%` }} /></div>
                    <span className="bar-count">{n}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filter + search */}
          <div className="notes-toolbar">
            <div className="group">
              {[
                { k: 'all', l: `Todas (${(book.notes || []).length})` },
                { k: 'learning', l: `Aprendizajes (${learnings})` },
                { k: 'quote', l: `Citas (${quotes})` },
                { k: 'idea', l: `Ideas (${ideas})` },
                { k: 'opinion', l: `Opiniones (${opinions})` },
              ].map(o => (
                <button key={o.k} className={noteKind === o.k ? 'on' : ''} onClick={() => setNoteKind(o.k)}>{o.l}</button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Buscar en notas… (texto o capítulo)"
              value={noteSearch}
              onChange={(e) => setNoteSearch(e.target.value)}
              className="kbv-search-input"
              style={{ flex: 1, minWidth: 180, padding: '6px 12px', fontSize: 13 }} />
          </div>

          {(book.notes || []).length === 0 ? (
            <EmptyState icon="edit" title="Sin notas" body="Cuando vuelvas a leer, anota lo que te marque — frase, idea, contradicción." />
          ) : filteredNotes.length === 0 ? (
            <EmptyState compact icon="search" title="Sin resultados" body="Ajusta el filtro o la búsqueda." />
          ) : (
            <div className="kbv-note-list">
              {filteredNotes.map(n => (
                <button type="button" key={n.id} className={`kbv-note ${n.kind} clickable`} onClick={() => setNoteDetail(n)} title="Ver detalle de la nota">
                  <span className="tag">{NOTE_KIND_LABELS[n.kind] || n.kind}</span>
                  {n.photo && <img className="note-photo" src={n.photo} alt="Foto de la cita" />}
                  <div className="body">{n.body}</div>
                  <span className="when">{n.when}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Columna derecha: sesiones + ritmo/meta */}
        <div className="bd-right-col">
        {/* Sessions — narrower right column */}
        <div className="kbv-fin-card sessions-card">
          <div className="head">
            <h3 className="kbv-h3">Sesiones</h3>
            <span className="kbv-meta">{sessions.length} · {longestSession}m máx</span>
          </div>
          {sessions.length === 0 ? (
            <EmptyState icon="clock" title="Sin sesiones" body="Inicia una para empezar a sumar tiempo y XP." />
          ) : (
            <div className="kbv-session-log compact">
              {sessions.map(s => (
                <div key={s.id} className="kbv-session-item">
                  <div className="date">{s.date}</div>
                  <div className="meta">
                    <span><KIcon name="clock" size={11} /> {s.mins} min</span>
                    <span><KIcon name="book-open" size={11} /> {s.to - s.from} pp</span>
                  </div>
                  <div className="xp">+{s.xp}</div>
                </div>
              ))}
            </div>
          )}
          <div className="session-totals">
            <div className="t">
              <span className="l">Total leído</span>
              <span className="v">{pagesRead} pp · {(totalMins/60).toFixed(1)}h</span>
            </div>
            <div className="t">
              <span className="l">XP otorgado</span>
              <span className="v" style={{ color: 'var(--area-community)' }}>+{totalXP} XP</span>
            </div>
          </div>
        </div>

        {/* Ritmo y meta — proyección de término */}
        <div className="kbv-fin-card bd-pace-card">
          <div className="head">
            <h3 className="kbv-h3">Ritmo y meta</h3>
            <span className="kbv-meta">A tu paso actual</span>
          </div>
          {(() => {
            const pagesLeft = Math.max(0, (book.pages || 0) - (book.page || 0));
            const avgPP = sessions.length ? Math.round(pagesRead / sessions.length) : 0;
            const estSessions = avgPP > 0 ? Math.ceil(pagesLeft / avgPP) : null;
            const readingDays = new Set(sessions.map(s => s.date)).size;
            const done = book.status === 'done';
            return (
              <div className="bd-pace-grid">
                <div className="pc"><span className="v">{done ? 0 : pagesLeft}</span><span className="l">pp restantes</span></div>
                <div className="pc"><span className="v">{Math.round(((book.page || 0) / (book.pages || 1)) * 100)}<small>%</small></span><span className="l">leído</span></div>
                <div className="pc"><span className="v">{longestSession}<small>m</small></span><span className="l">mejor sesión</span></div>
                <div className="pc"><span className="v">{avgPace || '—'}<small> pp/h</small></span><span className="l">ritmo medio</span></div>
                <div className="pc"><span className="v">{readingDays}</span><span className="l">días con lectura</span></div>
                <div className="pc"><span className="v">{done ? '✓' : (estSessions != null ? `~${estSessions}` : '—')}</span><span className="l">{done ? 'terminado' : 'sesiones p/ terminar'}</span></div>
              </div>
            );
          })()}
        </div>
        </div>
      </div>

      {showSession && (
        <ReadingSessionModal
          book={book}
          onClose={() => setShowSession(false)}
          onComplete={(payload) => { onStartSession && onStartSession(book, payload); if (payload.addNotes) setComposer('note'); }}
        />
      )}
      {composer && (
        <NoteComposerModal
          book={book}
          startVoice={composer === 'voice'}
          onClose={() => setComposer(null)}
          onAdd={(newNotes) => onUpdateBook && onUpdateBook({ ...book, notes: [...newNotes, ...(book.notes || [])] })}
        />
      )}
      {noteDetail && <NoteDetailModal note={noteDetail} onClose={() => setNoteDetail(null)} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// El Acervo — alta/edición de lugar o dispositivo dentro de la plataforma.
// Paso 1: ¿qué tipo? (tarjetas). Paso 2: campos según naturaleza
//   · físico → ubicación + mini-mapa   · digital → hipervínculo   · dispositivo → nombre/descripción
// Personalizable: icono y color. Sirve también como vista de detalle (edición).
// ─────────────────────────────────────────────────────────────
const ACERVO_TYPES = {
  shelf:    { l: 'Lugar físico', sub: 'Estante, repisa, casa de alguien…', nature: 'physical', icon: 'pin' },
  ereader:  { l: 'Lector electrónico', sub: 'Kindle, Kobo, Nook…', nature: 'device', icon: 'tablet' },
  device:   { l: 'Equipo', sub: 'Laptop, tablet, teléfono…', nature: 'device', icon: 'laptop' },
  cloud:    { l: 'Nube / archivo', sub: 'Drive, iCloud, Dropbox…', nature: 'digital', icon: 'cloud' },
  platform: { l: 'Plataforma de audio', sub: 'Audible, Spotify, pódcast…', nature: 'digital', icon: 'headphones' },
};
const ACERVO_ICONS = ['pin', 'book', 'tablet', 'laptop', 'cloud', 'headphones', 'layers', 'sparkle'];
const ACERVO_COLORS = ['var(--kb-coin-ink)', 'var(--kb-text)', 'var(--kb-gem)', 'var(--kb-primary)', 'var(--area-community)', 'var(--kb-hp)', 'var(--area-will)', 'var(--kb-coin)'];

function AcervoModal({ initial, onClose, onSave, onDelete }) {
  const editing = !!initial;
  const [type, setType] = React.useState(initial ? initial.type : null);
  const [name, setName] = React.useState(initial ? initial.name : '');
  const [desc, setDesc] = React.useState(initial ? (initial.desc || '') : '');
  const [icon, setIcon] = React.useState(initial ? initial.icon : 'pin');
  const [color, setColor] = React.useState(initial ? (initial.color || LOC_TYPE_COLOR[initial.type]) : ACERVO_COLORS[0]);
  const [place, setPlace] = React.useState(initial ? (initial.place || '') : '');
  const [link, setLink] = React.useState(initial ? (initial.link || '') : '');
  const [pin, setPin] = React.useState(initial && initial.pin ? initial.pin : { x: 50, y: 46 });

  function placePin(e) {
    const r = e.currentTarget.getBoundingClientRect();
    setPin({ x: Math.round(((e.clientX - r.left) / r.width) * 100), y: Math.round(((e.clientY - r.top) / r.height) * 100) });
  }
  function chooseType(t) {
    setType(t);
    if (!editing) { setIcon(ACERVO_TYPES[t].icon); setColor(LOC_TYPE_COLOR[t] || ACERVO_COLORS[0]); }
  }
  const nature = type ? ACERVO_TYPES[type].nature : null;

  // Paso 1 — elegir tipo (sólo en alta)
  if (!type) {
    return (
      <KBVModal title="Agregar al Acervo" sub="¿Qué tipo de lugar o dispositivo es? Así te muestro solo lo que aplica." onClose={onClose}>
        <div className="acervo-type-grid">
          {Object.entries(ACERVO_TYPES).map(([k, info]) => (
            <button key={k} type="button" className="acervo-type-opt" style={{ '--c': LOC_TYPE_COLOR[k] }} onClick={() => chooseType(k)}>
              <span className="at-ico"><KIcon name={info.icon} size={20} /></span>
              <span className="at-l">{info.l}</span>
              <span className="at-sub">{info.sub}</span>
            </button>
          ))}
        </div>
      </KBVModal>
    );
  }

  // Paso 2 — campos según naturaleza
  return (
    <KBVModal
      title={editing ? name || 'Detalle del lugar' : `Nuevo · ${ACERVO_TYPES[type].l}`}
      sub={editing ? 'Edita el nombre, la descripción o personalízalo.' : ACERVO_TYPES[type].sub}
      onClose={onClose}
      footer={
        <div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {editing && <button type="button" className="kbv-btn kbv-btn-danger" onClick={() => { onDelete && onDelete(); onClose(); }} style={{ marginRight: 'auto' }}><KIcon name="x" size={13} /> Eliminar</button>}
          {!editing && <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => setType(null)}><KIcon name="arrow-left" size={13} /> Tipo</button>}
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" disabled={!name.trim()}
            onClick={() => { onSave && onSave({ type, name: name.trim(), desc: desc.trim(), icon, color, place: nature === 'physical' ? place.trim() : '', link: nature === 'digital' ? link.trim() : '', pin: nature === 'physical' ? pin : null }); onClose(); }}>
            {editing ? 'Guardar cambios' : 'Guardar'} <KIcon name="check" size={14} />
          </button>
        </div>
      }>
      {/* Vista previa + personalización */}
      <div className="acervo-edit-head">
        <span className="ae-preview" style={{ '--c': color }}><KIcon name={icon} size={22} /></span>
        <div className="ae-pick">
          <span className="kbv-label-sm">Icono</span>
          <div className="ae-icons">
            {ACERVO_ICONS.map(ic => (
              <button key={ic} type="button" className={`ae-icon ${icon === ic ? 'on' : ''}`} onClick={() => setIcon(ic)}><KIcon name={ic} size={15} /></button>
            ))}
          </div>
          <span className="kbv-label-sm" style={{ marginTop: 6 }}>Color</span>
          <div className="ae-colors">
            {ACERVO_COLORS.map(c => (
              <button key={c} type="button" className={`ae-color ${color === c ? 'on' : ''}`} style={{ background: c }} onClick={() => setColor(c)} aria-label="color" />
            ))}
          </div>
        </div>
      </div>

      <div className="kbv-form-row">
        <label>Nombre *</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={nature === 'physical' ? 'p. ej. Librero de la sala' : nature === 'digital' ? 'p. ej. Google Drive · Libros' : 'p. ej. Kindle de Mateo'} autoFocus />
      </div>
      <div className="kbv-form-row">
        <label>Descripción <span className="kbv-meta" style={{ fontWeight: 400 }}>(opcional)</span></label>
        <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder={nature === 'device' ? 'Para identificarlo: color, dueño, dónde suele estar…' : 'Una nota para ti'} />
      </div>

      {nature === 'physical' && (
        <div className="acervo-map-wrap">
          <div className="kbv-form-row" style={{ marginBottom: 8 }}>
            <label>Lugar (ciudad / dirección)</label>
            <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="p. ej. Casa · CDMX, o Casa de la abuela" />
          </div>
          <span className="kbv-label-sm">Ubícalo en el mapa</span>
          <div className="acervo-map" onClick={placePin}>
            <span className="am-pin" style={{ left: `${pin.x}%`, top: `${pin.y}%`, color }}><KIcon name="pin" size={18} /></span>
          </div>
          <span className="kbv-meta">Toca el mapa para fijar dónde está y reencontrar el libro después.</span>
        </div>
      )}

      {nature === 'digital' && (
        <div className="kbv-form-row">
          <label>Hipervínculo <span className="kbv-meta" style={{ fontWeight: 400 }}>(para abrir/escuchar directo)</span></label>
          <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://drive.google.com/… o https://open.spotify.com/…" />
          <span className="hint">Al asignar un libro a este lugar, el enlace aparece como botón rápido en el detalle del libro.</span>
        </div>
      )}

      {nature === 'device' && (
        <span className="kbv-meta" style={{ display: 'block' }}>Los dispositivos no llevan mapa: lo importante es identificarlo por nombre y descripción para saber a dónde mandar cada libro.</span>
      )}
    </KBVModal>
  );
}

function LecturaScreen() {
  const [books, setBooks] = React.useState(DEMO_BOOKS);
  const [filter, setFilter] = React.useState('all');
  const [selectedId, setSelectedId] = React.useState(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [showCatalog, setShowCatalog] = React.useState(false);
  const [locations, setLocations] = React.useState(READING_LOCATIONS);
  const [acervoModal, setAcervoModal] = React.useState(false);
  const [acervoEdit, setAcervoEdit] = React.useState(null);

  function saveLocation(loc) {
    setLocations(ls => [...ls, { id: 'loc-' + Math.random().toString(36).slice(2, 6), books: 0, ...loc, icon: loc.icon || LOC_TYPE_ICON[loc.type] || 'book' }]);
  }
  function updateLocation(id, patch) {
    setLocations(ls => ls.map(l => l.id === id ? { ...l, ...patch } : l));
  }
  function removeLocation(id) {
    setLocations(ls => ls.filter(l => l.id !== id));
  }

  const filtered = books.filter(b => filter === 'all' ? true : b.status === filter);
  const totals = {
    all: books.length,
    reading: books.filter(b => b.status === 'reading').length,
    done: books.filter(b => b.status === 'done').length,
    paused: books.filter(b => b.status === 'paused').length,
    wishlist: books.filter(b => b.status === 'wishlist').length,
  };
  const totalNotes = books.reduce((a, b) => a + b.notes.length, 0);
  const yearAvg = Math.round(books.filter(b => b.status === 'done' && b.rating > 0).reduce((a, b) => a + b.rating, 0) / Math.max(1, books.filter(b => b.status === 'done' && b.rating > 0).length) * 10) / 10;
  const totalHours = (books.reduce((a, b) => a + (b.sessions || []).reduce((aa, s) => aa + (s.mins || 0), 0), 0) / 60).toFixed(1);

  function addBook(b) {
    setBooks(bs => [...bs, {
      ...b,
      id: 'b' + Math.random().toString(36).slice(2, 6),
      pages: parseInt(b.pages || 0, 10),
      page: parseInt(b.page || 0, 10),
      rating: b.rating || 0,
      cover: b.cover || 'linear-gradient(135deg, #5B6478, #2A2F3D)',
      editorial: b.editorial || b.publisher || '',
      started: b.started || new Date().toISOString().slice(0, 10),
      notes: [], sessions: [],
    }]);
  }
  function addFromCatalog(c) {
    addBook({ ...c, page: 0, status: 'wishlist' });
    setShowCatalog(false);
  }
  function recordSession(book, payload) {
    setBooks(bs => bs.map(b => {
      if (b.id !== book.id) return b;
      const newSession = {
        id: 's' + Math.random().toString(36).slice(2, 6),
        date: new Date().toISOString().slice(0, 10),
        from: payload.pageFrom, to: payload.pageTo, mins: payload.mins, kind: 'reading', xp: payload.xp,
      };
      const newNotes = payload.note ? [...(b.notes || []), { id: 'n' + Math.random().toString(36).slice(2, 6), ...payload.note }] : b.notes;
      return { ...b, page: payload.pageTo, sessions: [newSession, ...(b.sessions || [])], notes: newNotes };
    }));
  }

  // If a book is selected, show its dedicated screen
  if (selectedId) {
    const book = books.find(b => b.id === selectedId);
    if (book) return <BookDetail book={book}
      locations={locations}
      onBack={() => setSelectedId(null)}
      onStartSession={recordSession}
      onUpdateBook={(b) => setBooks(bs => bs.map(x => x.id === b.id ? b : x))} />;
  }

  const catalogFiltered = CATALOG_RESULTS.filter(c => !search.trim() || (c.title + ' ' + c.author).toLowerCase().includes(search.toLowerCase()));

  // Tendencias de lectura
  const genreCounts = {};
  books.forEach(b => { if (b.genre) b.genre.split('·').forEach(g => { const k = g.trim(); if (k) genreCounts[k] = (genreCounts[k] || 0) + 1; }); });
  const topGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const startedBooks = books.filter(b => b.status !== 'wishlist').length;
  const finishRate = startedBooks ? Math.round((totals.done / startedBooks) * 100) : 0;
  const ratedBooks = books.filter(b => b.rating > 0);
  const avgRatingTrend = ratedBooks.length ? (ratedBooks.reduce((a, b) => a + b.rating, 0) / ratedBooks.length) : 0;
  const antBooks = books.filter(b => b.anticipation > 0);
  const avgAnt = antBooks.length ? (antBooks.reduce((a, b) => a + b.anticipation, 0) / antBooks.length) : 0;

  return (
    <div className="kbv-main">
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--kb-primary)' }}>{crumb('lectura', 'Registro de lectura')}</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Lectura. <InfoDot label="i" text={"Todo lo que leemos, con notas y aprendizajes. El libro es el medio; lo que queda en ti es lo importante."} /></h1>
        </div>
        <div className="actions" style={{ gap: 8 }}>
          <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => setCreateOpen(true)}>
            <KIcon name="plus" size={14} /> Registrar libro
          </button>
        </div>
      </div>

      <div className="kbv-kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-primary)' }}>
          <span className="label">Terminados este año</span>
          <span className="val">{totals.done}</span>
          <span className="delta up">+1 vs el año pasado</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-gem)' }}>
          <span className="label">En curso</span>
          <span className="val">{totals.reading}</span>
          <span className="delta">+{totals.paused} en pausa</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--area-community)' }}>
          <span className="label">Notas capturadas</span>
          <span className="val">{totalNotes}</span>
          <span className="delta">Aprendizajes + citas</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-coin)' }}>
          <span className="label">Rating promedio</span>
          <span className="val">{yearAvg || '—'}<small> / 5</small></span>
          <span className="delta">De los terminados</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-good-soft)' }}>
          <span className="label">Horas leídas</span>
          <span className="val">{totalHours}<small> h</small></span>
          <span className="delta">Sumadas de sesiones</span>
        </div>
      </div>

      <div className="kbv-filter-bar">
        <span className="label">Estado</span>
        <div className="group">
          <button className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>Todos ({totals.all})</button>
          <button className={filter === 'reading' ? 'on' : ''} onClick={() => setFilter('reading')}>Leyendo ({totals.reading})</button>
          <button className={filter === 'done' ? 'on' : ''} onClick={() => setFilter('done')}>Terminados ({totals.done})</button>
          <button className={filter === 'paused' ? 'on' : ''} onClick={() => setFilter('paused')}>En pausa ({totals.paused})</button>
          <button className={filter === 'wishlist' ? 'on' : ''} onClick={() => setFilter('wishlist')}>Wishlist ({totals.wishlist})</button>
        </div>
      </div>

      <div className="kbv-reading-grid">
        {filtered.map(b => (
          <BookCard key={b.id} book={b} onClick={() => setSelectedId(b.id)} />
        ))}
      </div>

      {/* Tendencias de lectura */}
      <div className="kbv-reading-trends">
        <div className="rt-head">
          <h3 className="kbv-h3">Tendencias de lectura</h3>
          <span className="kbv-meta">Qué lees más, qué tanto terminas y si cumple tus expectativas</span>
        </div>
        <div className="rt-grid">
          <div className="rt-card">
            <span className="rt-label">Géneros que más lees</span>
            {topGenres.length > 0 ? (
              <div className="rt-bars">
                {topGenres.map(([g, n]) => (
                  <div key={g} className="rt-bar">
                    <span className="rt-bar-l">{g}</span>
                    <div className="rt-bar-track"><div className="rt-bar-fill" style={{ width: `${(n / topGenres[0][1]) * 100}%` }} /></div>
                    <span className="rt-bar-n">{n}</span>
                  </div>
                ))}
              </div>
            ) : <span className="kbv-meta">Aún sin géneros registrados.</span>}
          </div>
          <div className="rt-card center">
            <span className="rt-label">Tasa de término</span>
            <div className="rt-ring" style={{ '--p': finishRate }}>
              <span>{finishRate}<small>%</small></span>
            </div>
            <span className="kbv-meta">{totals.done} de {startedBooks} empezados</span>
          </div>
          <div className="rt-card">
            <span className="rt-label">Expectativa vs. realidad</span>
            <div className="rt-evr">
              <div className="evr-row">
                <span className="evr-k"><KIcon name="flame" size={12} /> Ganas (antes)</span>
                <div className="evr-track"><div className="evr-fill ant" style={{ width: `${(avgAnt / 5) * 100}%` }} /></div>
                <span className="evr-v">{avgAnt.toFixed(1)}</span>
              </div>
              <div className="evr-row">
                <span className="evr-k">★ Rating (después)</span>
                <div className="evr-track"><div className="evr-fill rat" style={{ width: `${(avgRatingTrend / 5) * 100}%` }} /></div>
                <span className="evr-v">{avgRatingTrend.toFixed(1)}</span>
              </div>
            </div>
            <span className="kbv-meta">{avgRatingTrend >= avgAnt ? 'Tus lecturas suelen cumplir o superar lo que esperabas.' : 'En promedio esperabas un poco más de lo que resultó.'}</span>
          </div>
        </div>
      </div>

      {/* El Acervo — dónde vive cada libro */}
      <div className="kbv-acervo">
        <div className="acervo-head">
          <div>
            <span className="at-name"><KIcon name="pin" size={18} /> El Acervo</span>
            <p className="kbv-body" style={{ marginTop: 3, fontSize: 12.5, maxWidth: 580 }}>
              Tu mapa de dónde vive cada libro: estantes y libreros, lectores electrónicos, la nube y plataformas de audio. Asigna una ubicación a cada libro y vuelve a encontrarlo en segundos.
            </p>
          </div>
          <span className="kbv-meta">{locations.length} lugares · {locations.reduce((a, l) => a + l.books, 0)} libros ubicados</span>
        </div>
        <div className="kbv-acervo-grid">
          {locations.map(l => (
            <div key={l.id} className="kbv-acervo-loc clickable" style={{ '--lc': l.color || LOC_TYPE_COLOR[l.type] }} role="button" title="Ver detalle / editar" onClick={() => setAcervoEdit(l)}>
              <span className="lc-ico"><KIcon name={l.icon} size={16} /></span>
              <div className="lc-info">
                <span className="lc-name">{l.name}</span>
                <span className="lc-meta">{l.link ? <><KIcon name="layers" size={10} /> Enlace listo</> : l.place ? <><KIcon name="pin" size={10} /> {l.place}</> : `${l.books} ${l.books === 1 ? 'libro' : 'libros'}`}</span>
              </div>
              <span className="lc-type">{LOC_TYPE_LABEL[l.type]}</span>
              <button type="button" className="lc-del" title="Eliminar del Acervo" onClick={(e) => { e.stopPropagation(); removeLocation(l.id); }}>
                <KIcon name="x" size={12} />
              </button>
            </div>
          ))}
          <button type="button" className="kbv-acervo-add" onClick={() => setAcervoModal(true)}>
            <KIcon name="plus" size={13} /> Agregar lugar o dispositivo
          </button>
        </div>
      </div>

      {acervoModal && <AcervoModal onClose={() => setAcervoModal(false)} onSave={saveLocation} />}
      {acervoEdit && <AcervoModal initial={acervoEdit} onClose={() => setAcervoEdit(null)} onSave={(patch) => updateLocation(acervoEdit.id, patch)} onDelete={() => removeLocation(acervoEdit.id)} />}

      {createOpen && <CreateBookModal onClose={() => setCreateOpen(false)} onSave={addBook} locations={locations} />}
    </div>
  );
}

// =================================================================
// DIARIO — Radial mood chart, week entries, AI chat stub
// =================================================================
const DEMO_DIARY_ENTRIES = [
  { id: 'd1', day: 25, dayLbl: 'Lun', mood: 'good',  at: '21:32', preview: 'Empezó pesado pero cerré la propuesta de Aurora. Buena conversación con Ana — me dejó pensando en cómo medimos el éxito.', photo: true,  gratitude: 'La paciencia de Ana en la junta.', learned: 'Bloquear notificaciones antes de las 10 me cambia la mañana.', tags: ['#trabajo', '#aurora', '#foco'] },
  { id: 'd2', day: 24, dayLbl: 'Dom', mood: 'great', at: '20:10', preview: 'Día sin pantalla casi entero. Caminata de 12 km con la familia, leí un poco. Domingo perfecto.', photo: true,  gratitude: 'Tiempo lento con la familia.', learned: 'Descansar también es productivo.', tags: ['#familia', '#descanso'] },
  { id: 'd3', day: 23, dayLbl: 'Sáb', mood: 'great', at: '22:05', preview: 'Sábado de cocinar. Salieron unas pastas decentes. Llamada larga con mamá.', photo: false, gratitude: 'La llamada con mamá.', learned: '', tags: ['#cocina', '#mamá'] },
  { id: 'd4', day: 22, dayLbl: 'Vie', mood: 'meh',   at: '23:48', preview: 'Reunión innecesaria de 90 min me arruinó el bloque profundo. Frustración. Terminé tarde.', photo: false, gratitude: '', learned: 'Defender mi tiempo de foco no es egoísta.', tags: ['#trabajo'] },
  { id: 'd5', day: 21, dayLbl: 'Jue', mood: 'good',  at: '21:00', preview: 'Buen día de foco. Avancé 18 páginas del curso de System Design.', photo: false, gratitude: '', learned: '', tags: ['#estudio'] },
  { id: 'd6', day: 20, dayLbl: 'Mié', mood: 'low',   at: '22:40', preview: 'Cansado todo el día. Mal dormí. Bajé la intensidad sin culpa.', photo: false, gratitude: 'Poder bajar el ritmo sin culpa.', learned: '', tags: ['#descanso'] },
  { id: 'd7', day: 19, dayLbl: 'Mar', mood: 'good',  at: '21:15', preview: 'Rutina sólida. Sin sobresaltos. A veces eso es exactamente lo que necesito.', photo: false, gratitude: '', learned: '', tags: [] },
];

const MOOD_COUNTS_30D = { great: 9, good: 12, meh: 5, low: 3, sad: 1 };

function MoodRadar({ counts }) {
  const size = 240, cx = size / 2, cy = size / 2, r = 92;
  const moods = MOOD_OPTIONS;
  const N = moods.length;
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  // Each axis angle, starting from top
  const angles = moods.map((_, i) => (i / N) * Math.PI * 2 - Math.PI / 2);

  // Polygon rings (4 levels)
  const rings = [0.25, 0.5, 0.75, 1.0];

  function polyPoints(scale) {
    return angles.map((a) => {
      const x = cx + Math.cos(a) * r * scale;
      const y = cy + Math.sin(a) * r * scale;
      return `${x},${y}`;
    }).join(' ');
  }

  const maxVal = Math.max(1, ...moods.map(m => counts[m.id] || 0));
  const valuePoints = moods.map((m, i) => {
    const v = counts[m.id] || 0;
    const scale = v / maxVal;
    const a = angles[i];
    return {
      x: cx + Math.cos(a) * r * scale,
      y: cy + Math.sin(a) * r * scale,
      count: v,
      color: m.color,
      id: m.id,
    };
  });

  const labelPoints = moods.map((m, i) => {
    const a = angles[i];
    const labelR = r + 22;
    return {
      x: cx + Math.cos(a) * labelR,
      y: cy + Math.sin(a) * labelR,
      label: m.label,
      color: m.color,
      icon: m.icon,
      id: m.id,
    };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size + 20}`} width={size + 40} height={size + 60} style={{ overflow: 'visible' }}>
      {/* Grid rings */}
      {rings.map((ring, i) => (
        <polygon key={i} points={polyPoints(ring)}
                 fill="none"
                 stroke="var(--kb-border)" strokeWidth={i === rings.length - 1 ? 1.5 : 1}
                 opacity={i === rings.length - 1 ? 0.9 : 0.4} />
      ))}
      {/* Axis lines */}
      {angles.map((a, i) => (
        <line key={i} x1={cx} y1={cy}
              x2={cx + Math.cos(a) * r}
              y2={cy + Math.sin(a) * r}
              stroke="var(--kb-border)" strokeWidth={1} opacity={0.5} />
      ))}
      {/* Value polygon — filled */}
      <polygon points={valuePoints.map(p => `${p.x},${p.y}`).join(' ')}
               fill="var(--kb-primary)" opacity={0.18} />
      <polygon points={valuePoints.map(p => `${p.x},${p.y}`).join(' ')}
               fill="none" stroke="var(--kb-primary)" strokeWidth={2.5} strokeLinejoin="round" />
      {/* Value dots */}
      {valuePoints.map(p => (
        <circle key={p.id} cx={p.x} cy={p.y} r={5}
                fill={p.color} stroke="var(--kb-canvas)" strokeWidth={2} />
      ))}
      {/* Axis labels */}
      {labelPoints.map(p => (
        <g key={p.id}>
          <text x={p.x} y={p.y - 6} textAnchor="middle"
                fontFamily="var(--kb-f-mono)" fontSize="9" fontWeight="800"
                fill="var(--kb-text-2)" letterSpacing="0.06em">
            {p.label.toUpperCase()}
          </text>
          <text x={p.x} y={p.y + 8} textAnchor="middle"
                fontFamily="var(--kb-f-display)" fontSize="14" fontWeight="800"
                fill={p.color}>
            {counts[p.id] || 0}
          </text>
        </g>
      ))}
      {/* Center label */}
      <text x={cx} y={cy + 4} textAnchor="middle"
            fontFamily="var(--kb-f-mono)" fontSize="10" fontWeight="800"
            fill="var(--kb-text-2)" letterSpacing="0.08em">
        {total} ENTRADAS
      </text>
    </svg>
  );
}

// Keep MoodRadial as alias for backwards compat
function MoodRadial(props) { return <MoodRadar {...props} />; }

function DiarioScreen() {
  const [range, setRange] = React.useState('30d');
  const [mood, setMood] = React.useState('good');
  const [body, setBody] = React.useState('');
  const [gratitude, setGratitude] = React.useState('');
  const [lesson, setLesson] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [transcribing, setTranscribing] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [openEntryId, setOpenEntryId] = React.useState(null);
  const [dayPhoto, setDayPhoto] = React.useState(null);
  const [photoOver, setPhotoOver] = React.useState(false);
  const photoInputRef = React.useRef(null);
  function readPhoto(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const fr = new FileReader();
    fr.onload = () => setDayPhoto(fr.result);
    fr.readAsDataURL(file);
  }

  React.useEffect(() => {
    if (!transcribing) return;
    const chunks = [
      ' Hoy fue un día denso pero salió bien la propuesta de Aurora.',
      ' Sentí cansancio en la tarde, pero retomé después de caminar 10 minutos al jardín.',
      ' Me llevo que necesito proteger mejor mis mañanas — bloquear notificaciones antes de las 10.',
    ];
    let i = 0;
    const id = setInterval(() => {
      if (i >= chunks.length) { setTranscribing(false); clearInterval(id); return; }
      setBody(b => b + chunks[i++]);
    }, 900);
    return () => clearInterval(id);
  }, [transcribing]);

  // KPI calculations (mock — would derive from real entries)
  const kpis = [
    { c: 'var(--kb-primary)', label: 'Entradas este mes',     val: 22,   delta: '+3 vs Abril',                deltaCls: 'up',  icon: 'edit' },
    { c: 'var(--pri-high)',           label: 'Racha de diario',        val: 17,   delta: 'días seguidos · récord 31',  deltaCls: '',    icon: 'flame', anim: true },
    { c: 'var(--kb-coin)',           label: 'Mood dominante',          val: 'Bien', delta: '54% del rango',            deltaCls: '',    icon: 'mood-good' },
    { c: 'var(--kb-hp)',           label: 'Días con mood "bajo"',   val: 4,    delta: 'En el rango actual',          deltaCls: '',    icon: 'mood-low' },
  ];

  return (
    <div className="kbv-main">
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--kb-primary)' }}>{crumb('diario', 'Tu archivo personal')}</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Diario. <InfoDot label="i" text={"Captura cómo te fue, escribe lo que pasó, dicta una nota de voz. Aquí queda todo — texto, audio y mood."} /></h1>
        </div>
        <div className="actions">
          <button type="button" className="kbv-btn kbv-btn-secondary" onClick={() => setCreateOpen(true)}>
            <KIcon name="calendar" size={14} /> Entrada con fecha
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kbv-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {kpis.map(k => (
          <div key={k.label} className="kbv-kpi" style={{ '--c': k.c }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <span className="label">{k.label}</span>
              {k.icon && (
                <span className={`kbv-kpi-icon ${k.anim ? 'pulse' : ''}`} style={{ '--c': k.c }}>
                  <KIcon name={k.icon} size={14} />
                </span>
              )}
            </div>
            <span className="val" style={{ fontSize: typeof k.val === 'string' ? 22 : undefined }}>{k.val}</span>
            <span className={`delta ${k.deltaCls}`}>{k.delta}</span>
          </div>
        ))}
      </div>

      {/* Capture card — big, primary action */}
      <div className="kbv-diario-capture">
        <div className="capture-head">
          <div>
            <span className="kbv-eyebrow">Lun 25 May · Captura del día</span>
            <h3 className="kbv-h3" style={{ marginTop: 2 }}>Cuenta cómo te fue hoy.</h3>
            <span className="kbv-meta" style={{ marginTop: 2, display: 'block' }}>
              Texto libre + nota de voz (con transcripción automática) + foto. Tú decides cuánto registras.
            </span>
          </div>
          <div className="kbv-mood-row">
            {MOOD_OPTIONS.map(m => (
              <button key={m.id} type="button"
                      className={`kbv-mood ${mood === m.id ? 'active' : ''}`}
                      style={{ '--m-color': m.color }}
                      onClick={() => setMood(m.id)}>
                <KIcon name={m.icon} size={22} />
                <span className="lbl">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="capture-body">
          <div className="capture-left">
            <div className="kbv-label">
              <span>Escribe lo que pasó</span>
            </div>
            <textarea
              className="kbv-diario-text"
              placeholder="Una frase, un pensamiento, un párrafo entero. Lo que sea."
              value={body}
              onChange={(e) => setBody(e.target.value)} />

            {/* Transcription strip — voice-to-text only, no audio storage */}
            <div className="capture-voice-strip">
              <button
                type="button"
                className={`kbv-voice-btn primary ${transcribing ? 'recording' : ''}`}
                onClick={() => setTranscribing(t => !t)}
                title={transcribing ? 'Detener transcripción' : 'Empezar transcripción de voz a texto'}>
                <KIcon name={transcribing ? 'square' : 'mic'} size={16} />
                <span>{transcribing ? 'Dictando…' : 'Lector dictado'}</span>
              </button>
              <span className="kbv-meta" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <KIcon name="sparkle" size={12} style={{ color: 'var(--area-community)' }} />
                Reconocimiento on-device · solo guarda texto, nunca audio
              </span>
            </div>

            {/* Reflexiones rápidas — gratitud, aprendizaje, tags */}
            <div className="kbv-diario-reflect">
              <div className="rf">
                <label><KIcon name="sparkle" size={12} /> Algo que agradezco</label>
                <input type="text" value={gratitude} onChange={(e) => setGratitude(e.target.value)} placeholder="Una persona, un momento, algo pequeño…" />
              </div>
              <div className="rf">
                <label><KIcon name="book-open" size={12} /> Algo que aprendí</label>
                <input type="text" value={lesson} onChange={(e) => setLesson(e.target.value)} placeholder="Una lección o idea del día…" />
              </div>
              <div className="rf">
                <label><KIcon name="flag" size={12} /> Tags / personas</label>
                <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="#trabajo  #ana  #foco" />
              </div>
            </div>
          </div>

          <div className="capture-right">
            <input ref={photoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { readPhoto(e.target.files && e.target.files[0]); e.target.value = ''; }} />
            <div
              className={`kbv-diario-photo tall ${dayPhoto ? 'has-img' : ''} ${photoOver ? 'over' : ''}`}
              title="Foto del día"
              onClick={() => photoInputRef.current && photoInputRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setPhotoOver(true); }}
              onDragLeave={() => setPhotoOver(false)}
              onDrop={(e) => { e.preventDefault(); setPhotoOver(false); readPhoto(e.dataTransfer.files && e.dataTransfer.files[0]); }}>
              {dayPhoto ? (
                <>
                  <img src={dayPhoto} alt="Foto del día" className="dp-img" />
                  <button type="button" className="dp-remove" title="Quitar foto" onClick={(e) => { e.stopPropagation(); setDayPhoto(null); }}>
                    <KIcon name="x" size={14} />
                  </button>
                  <span className="dp-change"><KIcon name="camera" size={13} /> Cambiar foto</span>
                </>
              ) : (
                <div className="dp-empty">
                  <span className="glyph"><KIcon name="camera" size={26} /></span>
                  <div className="label">
                    <span className="name">Foto del día</span>
                    <span className="sub">Arrastra o haz clic · JPG/PNG</span>
                  </div>
                </div>
              )}
            </div>
            <button type="button" className="kbv-btn kbv-btn-primary" style={{ width: '100%' }}>
              <KIcon name="check" size={14} /> Guardar entrada · +15 XP
            </button>
            <span className="kbv-meta" style={{ textAlign: 'center' }}>
              Se guarda en local. La transcripción usa IA on-device.
            </span>
          </div>
        </div>
      </div>

      {/* Mood radial + word cloud + week — same as before but full-width single col */}
      <div className="kbv-mood-radial">
        <div className="head">
          <div>
            <h3 className="kbv-h3" style={{ marginBottom: 2 }}>Mood a lo largo del tiempo</h3>
            <span className="kbv-meta">Estados de ánimo registrados en el rango seleccionado</span>
          </div>
          <div className="range-tabs">
            <button className={range === '7d' ? 'on' : ''} onClick={() => setRange('7d')}>Semana</button>
            <button className={range === '30d' ? 'on' : ''} onClick={() => setRange('30d')}>Mes</button>
            <button className={range === '90d' ? 'on' : ''} onClick={() => setRange('90d')}>3 meses</button>
            <button className={range === 'custom' ? 'on' : ''} onClick={() => setRange('custom')}>Personalizado</button>
          </div>
        </div>
        {range === 'custom' && (
          <div className="kbv-daterange" style={{ marginBottom: 12 }}>
            <span className="dr-l"><KIcon name="calendar" size={12} /> Del</span>
            <input type="date" defaultValue="2026-01-01" />
            <span className="dr-sep"><KIcon name="arrow-right" size={11} /></span>
            <span className="dr-l">al</span>
            <input type="date" defaultValue="2026-05-31" />
          </div>
        )}
        <div className="chart-row">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <MoodRadial counts={MOOD_COUNTS_30D} />
          </div>
          <div className="legend">
            {MOOD_OPTIONS.map(m => {
              const total = Object.values(MOOD_COUNTS_30D).reduce((a, b) => a + b, 0);
              const v = MOOD_COUNTS_30D[m.id] || 0;
              const pct = total > 0 ? Math.round((v / total) * 100) : 0;
              return (
                <div key={m.id} className="item">
                  <span className="swatch" style={{ background: m.color }} />
                  <span>{m.label}</span>
                  <span className="count">{v} · {pct}%</span>
                </div>
              );
            })}
            <div style={{ marginTop: 6, padding: '6px 0', borderTop: '1px dashed var(--kb-border)', fontSize: 11, color: 'var(--kb-text-2)' }}>
              Tu mood dominante: <strong style={{ color: 'var(--kb-text)' }}>Bien</strong>. Buen mes.
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="kbv-h3" style={{ marginBottom: 10 }}>Entradas de la semana</h3>
        <div className="kbv-week-entries">
          {DEMO_DIARY_ENTRIES.map(e => {
            const m = MOOD_OPTIONS.find(mo => mo.id === e.mood);
            return (
              <button key={e.id} type="button" className="kbv-week-entry" onClick={() => setOpenEntryId(e.id)}>
                <div className="day">
                  <span className="num">{e.day}</span>
                  <span className="lbl">{e.dayLbl}</span>
                </div>
                <div className="mood" style={{ '--m-color': m.color }}>
                  <KIcon name={m.icon} size={16} />
                </div>
                <div className="preview">{e.preview}</div>
                {e.photo ? (
                  <div className="photo-thumb"><KIcon name="image" size={20} /></div>
                ) : (
                  <span className="kbv-meta">—</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Word cloud */}
      <div>
        <h3 className="kbv-h3" style={{ marginBottom: 10 }}>De qué hablaste más</h3>
        <div className="kbv-wordcloud">
          {[
            { w: 'trabajo', sz: 24, c: 'var(--area-wealth)' },
            { w: 'familia', sz: 21, c: 'var(--area-community)' },
            { w: 'foco', sz: 19, c: 'var(--kb-primary)' },
            { w: 'aurora', sz: 17, c: 'var(--area-wealth)' },
            { w: 'caminar', sz: 16, c: 'var(--area-vigor)' },
            { w: 'cansancio', sz: 15, c: 'var(--kb-hp)' },
            { w: 'ana', sz: 14, c: 'var(--area-community)' },
            { w: 'lectura', sz: 14, c: 'var(--area-wisdom)' },
            { w: 'cocina', sz: 13, c: 'var(--area-community)' },
            { w: 'mamá', sz: 13, c: 'var(--area-community)' },
            { w: 'sistema', sz: 12, c: 'var(--area-wisdom)' },
            { w: 'reunión', sz: 12, c: 'var(--area-wealth)' },
            { w: 'frustración', sz: 11, c: 'var(--kb-hp)' },
            { w: 'energía', sz: 11, c: 'var(--area-vigor)' },
            { w: 'dormir', sz: 10, c: 'var(--kb-text)' },
          ].map(t => (
            <span key={t.w} className="word" style={{ fontSize: t.sz, color: t.c, opacity: 0.55 + t.sz / 50 }}>{t.w}</span>
          ))}
        </div>
      </div>

      {createOpen && <CreateEntryModal onClose={() => setCreateOpen(false)} onSave={() => {}} />}
      {openEntryId && (
        <EntryDetailModal entry={DEMO_DIARY_ENTRIES.find(e => e.id === openEntryId)} onClose={() => setOpenEntryId(null)} />
      )}
    </div>
  );
}

function EntryDetailModal({ entry, onClose }) {
  if (!entry) return null;
  const m = MOOD_OPTIONS.find(mo => mo.id === entry.mood);
  const fullBody = entry.preview + ' Algo extra: aquí se mostraría el texto íntegro de la entrada, con la transcripción del día y cualquier nota registrada.';
  const transcripts = entry.day === 22 ? ['(0:00) "Hoy me costó arrancar, pero al medio día retomé."', '(2:15) "La reunión fue innecesaria — discutimos cosas que ya teníamos cerradas."'] : [];
  const tags = entry.tags || [];

  return (
    <KBVModal
      title={`Entrada del ${entry.dayLbl} ${entry.day} de mayo`}
      sub={`Mood: ${m?.label}`}
      onClose={onClose}
      size="lg"
      footer={
        <div className="right" style={{ marginLeft: 'auto' }}>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cerrar</button>
          <button type="button" className="kbv-btn kbv-btn-secondary">
            <KIcon name="edit" size={14} /> Editar
          </button>
          <button type="button" className="kbv-btn kbv-btn-primary">
            <KIcon name="arrow-right" size={14} /> Ir al diario del día
          </button>
        </div>
      }>
      <div className="kbv-entry-detail">
        <div className="head" style={{ '--m-color': m.color }}>
          <div className="mood-circ">
            <KIcon name={m.icon} size={24} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--kb-f-display)', fontWeight: 800, fontSize: 18, color: 'var(--kb-text)' }}>
              {m.label}
            </div>
            <div className="kbv-meta" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <KIcon name="clock" size={12} /> Hora de registro · {entry.at || '21:32'}
            </div>
          </div>
          {tags.length > 0 && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {tags.map(t => <span key={t} className="kbv-tag" style={{ background: 'var(--kb-surface)' }}>{t}</span>)}
            </div>
          )}
        </div>

        {entry.photo && (
          <div className="entry-photo">
            <KIcon name="image" size={28} />
            <span>Foto del día · ver completa</span>
          </div>
        )}

        <div className="entry-body">
          <h4 className="kbv-h4" style={{ marginBottom: 6 }}>Texto</h4>
          <p>{fullBody}</p>
        </div>

        {/* Reflexiones — solo si existen */}
        {(entry.gratitude || entry.learned) && (
          <div className="kbv-entry-reflect">
            {entry.gratitude && (
              <div className="rf-card grat">
                <span className="rf-l"><KIcon name="sparkle" size={13} /> Algo que agradecí</span>
                <p>{entry.gratitude}</p>
              </div>
            )}
            {entry.learned && (
              <div className="rf-card learn">
                <span className="rf-l"><KIcon name="book-open" size={13} /> Algo que aprendí</span>
                <p>{entry.learned}</p>
              </div>
            )}
          </div>
        )}

        {transcripts.length > 0 && (
          <div className="entry-body">
            <h4 className="kbv-h4" style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <KIcon name="mic" size={14} style={{ color: 'var(--area-community)' }} /> Transcripción de voz
            </h4>
            <div className="entry-transcripts">
              {transcripts.map((t, i) => <div key={i} className="line">{t}</div>)}
            </div>
          </div>
        )}
      </div>
    </KBVModal>
  );
}

// =================================================================
// FINANZAS — Financial module (replaces Wealth as area focus)
// =================================================================
const DEMO_TX = [
  { id: 'tx1', name: 'Salario Mayo',         meta: 'Empresa · 28 May',  amt: 38500, kind: 'income',  cat: 'salary',     icon: 'shop',  catC: 'var(--kb-primary)', catBg: 'rgba(76,175,130,0.14)', src: 'manual' },
  { id: 'tx2', name: 'Renta departamento',   meta: 'Casa · 25 May',     amt: -12500,kind: 'expense', cat: 'housing',    icon: 'home',  catC: 'var(--kb-hp)', catBg: 'rgba(230,69,69,0.10)', src: 'email' },
  { id: 'tx3', name: 'Supermercado',         meta: 'Comida · 24 May',   amt: -2840, kind: 'expense', cat: 'food',       icon: 'shop',  catC: 'var(--pri-high)', catBg: 'rgba(244,129,31,0.12)', src: 'manual' },
  { id: 'tx4', name: 'Side project — depósito',meta: 'Ingreso · 22 May',amt: 6000,  kind: 'income',  cat: 'side',       icon: 'sparkle',catC: 'var(--kb-primary)', catBg: 'rgba(76,175,130,0.14)', src: 'notif' },
  { id: 'tx5', name: 'Netflix + Spotify',    meta: 'Servicios · 21 May',amt: -549,  kind: 'expense', cat: 'subs',       icon: 'film',  catC: 'var(--area-community)', catBg: 'rgba(168,85,247,0.14)', src: 'email' },
  { id: 'tx6', name: 'Café',                 meta: 'Comida · 21 May',   amt: -120,  kind: 'expense', cat: 'food',       icon: 'shop',  catC: 'var(--pri-high)', catBg: 'rgba(244,129,31,0.12)', src: 'manual' },
  { id: 'tx7', name: 'Transporte (Uber)',    meta: 'Transporte · 20 May',amt: -380, kind: 'expense', cat: 'transport',  icon: 'film',  catC: 'var(--kb-gem)', catBg: 'rgba(110,140,242,0.14)', src: 'notif' },
];

const BUDGET = [
  { name: 'Casa',         used: 12500, limit: 13000, color: 'var(--kb-hp)' },
  { name: 'Comida',       used: 3960,  limit: 5000,  color: 'var(--pri-high)' },
  { name: 'Transporte',   used: 1240,  limit: 1500,  color: 'var(--kb-gem)' },
  { name: 'Suscripciones',used: 549,   limit: 600,   color: 'var(--area-community)' },
  { name: 'Ocio',         used: 1380,  limit: 1200,  color: 'var(--kb-coin)' }, // over
  { name: 'Salud',        used: 420,   limit: 1000,  color: 'var(--kb-primary)' },
];

const FIN_PROJECTS = [
  {
    id: 'fp1', name: 'Fondo de emergencia', icon: 'shield', color: 'var(--kb-primary)', current: 58200, target: 75000,
    kind: 'saving', monthly: 4500, projDate: 'Sep 2026', desc: '6 meses de gastos básicos como colchón.',
    history: [12000, 18500, 25000, 35000, 44000, 50000, 58200],
  },
  {
    id: 'fp2', name: 'Inversión mensual', icon: 'wealth', color: 'var(--kb-gem)', current: 6500, target: 10000,
    kind: 'invest', monthly: 6500, projDate: 'Cada mes', desc: 'Aporte fijo a tu portafolio diversificado.',
    history: [3000, 4500, 5000, 5500, 6000, 6200, 6500],
  },
  {
    id: 'fp3', name: 'Viaje 2026', icon: 'film', color: 'var(--kb-coin)', current: 12400, target: 40000,
    kind: 'saving', monthly: 3000, projDate: 'Oct 2026', desc: '2 semanas en Japón con un colchón para imprevistos.',
    history: [0, 1500, 3000, 5500, 8000, 10000, 12400],
  },
  {
    id: 'fp4', name: 'Liquidar tarjeta', icon: 'alert', color: 'var(--kb-hp)', current: 14200, target: 28000,
    kind: 'debt', monthly: 4000, projDate: 'Ago 2026', desc: 'Saldo pendiente · plan de extinción acelerada.',
    history: [28000, 25000, 22000, 19000, 17000, 16000, 14200],
  },
];

// ─────────────────────────────────────────────────────────────
// Modals — Registrar Movimiento / Nuevo Proyecto financiero
// ─────────────────────────────────────────────────────────────
const TX_CATEGORIES = [
  { id: 'salary',    name: 'Salario',         icon: 'shop',  c: 'var(--kb-primary)', kind: 'income' },
  { id: 'side',      name: 'Side income',     icon: 'sparkle', c: 'var(--kb-primary)', kind: 'income' },
  { id: 'invest',    name: 'Rendimiento',     icon: 'wealth', c: 'var(--kb-primary)', kind: 'income' },
  { id: 'housing',   name: 'Casa',            icon: 'home',  c: 'var(--kb-hp)', kind: 'expense' },
  { id: 'food',      name: 'Comida',          icon: 'shop',  c: 'var(--pri-high)', kind: 'expense' },
  { id: 'transport', name: 'Transporte',      icon: 'film',  c: 'var(--kb-gem)', kind: 'expense' },
  { id: 'subs',      name: 'Suscripciones',   icon: 'film',  c: 'var(--area-community)', kind: 'expense' },
  { id: 'health',    name: 'Salud',           icon: 'sparkle', c: 'var(--kb-primary)', kind: 'expense' },
  { id: 'fun',       name: 'Ocio',            icon: 'sparkle', c: 'var(--kb-coin)', kind: 'expense' },
  { id: 'other',     name: 'Otro',            icon: 'layers', c: 'var(--pri-vlow)', kind: 'expense' },
];

function RegistrarMovimientoModal({ onClose, onSave }) {
  const [kind, setKind] = React.useState('expense');
  const [amount, setAmount] = React.useState('');
  const [name, setName] = React.useState('');
  const [catId, setCatId] = React.useState('food');
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [account, setAccount] = React.useState('bbva');
  const [tab, setTab] = React.useState('manual'); // manual | scan | email | notif

  const cats = TX_CATEGORIES.filter(c => c.kind === kind);
  const cat = TX_CATEGORIES.find(c => c.id === catId) || cats[0];

  function save() {
    if (!amount || !name.trim()) return;
    const amt = parseFloat(amount) * (kind === 'expense' ? -1 : 1);
    onSave && onSave({
      id: 'tx' + Math.random().toString(36).slice(2, 6),
      name: name.trim(), meta: `${cat?.name} · ${date}`, amt, kind, cat: catId,
      icon: cat?.icon || 'shop', catC: cat?.c, catBg: `color-mix(in oklab, ${cat?.c} 12%, var(--kb-canvas))`, src: 'manual',
    });
    onClose();
  }

  return (
    <KBVModal
      title="Registrar movimiento"
      sub="Ingreso o gasto manual. Pronto se auto-llena leyendo correos y notificaciones."
      onClose={onClose}
      size="lg"
      footer={
        <div className="right" style={{ marginLeft: 'auto' }}>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" disabled={!amount || !name.trim()} onClick={save}>
            Guardar movimiento <KIcon name="check" size={14} />
          </button>
        </div>
      }>
      <div className="kbv-store-tabs" style={{ marginBottom: 14 }}>
        <button className={tab === 'manual' ? 'active' : ''} onClick={() => setTab('manual')}>
          <KIcon name="edit" size={14} /> Manual
        </button>
        <button className={tab === 'scan' ? 'active' : ''} onClick={() => setTab('scan')}>
          <KIcon name="camera" size={14} /> Escanear recibo
        </button>
        <button className={tab === 'email' ? 'active' : ''} onClick={() => setTab('email')}>
          <KIcon name="alert" size={14} /> Desde correo
        </button>
        <button className={tab === 'notif' ? 'active' : ''} onClick={() => setTab('notif')}>
          <KIcon name="alert" size={14} /> Desde notificación
        </button>
      </div>

      {tab === 'manual' && (
        <div className="kbv-stack-12">
          <div className="kbv-fin-toggle">
            <button type="button" className={kind === 'expense' ? 'on' : ''} onClick={() => { setKind('expense'); setCatId('food'); }}>
              Gasto
            </button>
            <button type="button" className={kind === 'income' ? 'on' : ''} onClick={() => { setKind('income'); setCatId('salary'); }}>
              Ingreso
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
            <div className="kbv-form-row">
              <label>Monto</label>
              <div className="kbv-amount-input">
                <span className="prefix">$</span>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" autoFocus />
                <span className="suffix">MXN</span>
              </div>
            </div>
            <div className="kbv-form-row">
              <label>Fecha</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          <div className="kbv-form-row">
            <label>Concepto</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Súper de la semana, salario, etc." />
          </div>
          <div className="kbv-form-row">
            <label>Categoría</label>
            <div className="kbv-cat-grid">
              {cats.map(c => (
                <button key={c.id} type="button"
                        className={`kbv-cat-tile ${catId === c.id ? 'on' : ''}`}
                        style={{ '--c': c.c }}
                        onClick={() => setCatId(c.id)}>
                  <span className="glyph"><KIcon name={c.icon} size={16} /></span>
                  <span className="lbl">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="kbv-form-row">
            <label>Cuenta</label>
            <select value={account} onChange={(e) => setAccount(e.target.value)}>
              <option value="bbva">BBVA · Débito</option>
              <option value="nu">Nu · Ahorro</option>
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta de crédito</option>
            </select>
          </div>
        </div>
      )}

      {tab === 'scan' && (
        <div className="kbv-fin-coming">
          <div className="ico"><KIcon name="camera" size={32} /></div>
          <h4 className="kbv-h4">Escaneo de recibos · próx</h4>
          <p>Toma foto del ticket o sube el PDF. Reconocimiento OCR extrae monto, categoría y fecha. Confirma con un toque.</p>
        </div>
      )}

      {tab === 'email' && (
        <div className="kbv-fin-coming">
          <div className="ico"><KIcon name="alert" size={32} /></div>
          <h4 className="kbv-h4">Auto-registro desde correos · próx</h4>
          <p>Conecta tu Gmail u Outlook. Kibo lee correos de bancos, SPEI y suscripciones — extrae monto, comercio y fecha. Tú apruebas o rechazas cada movimiento detectado.</p>
          <button type="button" className="kbv-btn kbv-btn-secondary" style={{ marginTop: 8 }}>
            <KIcon name="google" size={14} /> Conectar Gmail
          </button>
        </div>
      )}

      {tab === 'notif' && (
        <div className="kbv-fin-coming">
          <div className="ico"><KIcon name="alert" size={32} /></div>
          <h4 className="kbv-h4">Auto-registro desde notificaciones del celular · próx</h4>
          <p>Activa el acceso a notificaciones en la app móvil. Cada vez que tu banco te avise (compra, cargo, depósito), Kibo lo detecta y crea un borrador del movimiento.</p>
          <span className="kbv-tag soon">Requiere app móvil · sprint 3</span>
        </div>
      )}
    </KBVModal>
  );
}

function CreateFinanceProjectModal({ onClose, onSave }) {
  const [name, setName] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [kind, setKind] = React.useState('saving');
  const [target, setTarget] = React.useState('');
  const [current, setCurrent] = React.useState('');
  const [monthly, setMonthly] = React.useState('');
  const [date, setDate] = React.useState('');

  const KINDS = [
    { id: 'saving', name: 'Ahorro',    icon: 'shield', color: 'var(--kb-primary)', desc: 'Acumular dinero para una meta concreta.' },
    { id: 'invest', name: 'Inversión', icon: 'wealth', color: 'var(--kb-gem)', desc: 'Aportar a un instrumento (fondo, acciones, cetes).' },
    { id: 'debt',   name: 'Deuda',     icon: 'alert',  color: 'var(--kb-hp)', desc: 'Plan de pago acelerado para liquidar pasivos.' },
    { id: 'income', name: 'Ingreso',   icon: 'sparkle', color: 'var(--kb-coin)', desc: 'Meta de ingreso recurrente o pico (freelance, side hustle).' },
  ];

  const k = KINDS.find(x => x.id === kind);
  const monthsToTarget = (target && monthly && parseFloat(monthly) > 0)
    ? Math.ceil(Math.max(0, parseFloat(target) - parseFloat(current || 0)) / parseFloat(monthly))
    : null;

  return (
    <KBVModal
      title="Nuevo proyecto financiero"
      sub="Una meta de dinero — ahorro, inversión, deuda o ingreso. Kibo te muestra la proyección automáticamente."
      onClose={onClose}
      size="lg"
      footer={
        <div className="right" style={{ marginLeft: 'auto' }}>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" disabled={!name.trim() || !target} onClick={() => {
            onSave && onSave({
              id: 'fp' + Math.random().toString(36).slice(2, 6),
              name: name.trim(), desc, kind,
              icon: k.icon, color: k.color,
              current: parseFloat(current || 0),
              target: parseFloat(target),
              monthly: parseFloat(monthly || 0),
              projDate: date || k.id === 'invest' ? 'Cada mes' : '—',
              history: [parseFloat(current || 0)],
            });
            onClose();
          }}>
            Crear proyecto <KIcon name="check" size={14} />
          </button>
        </div>
      }>
      <div className="kbv-form-row">
        <label>Tipo</label>
        <div className="kbv-cat-grid four">
          {KINDS.map(x => (
            <button key={x.id} type="button"
                    className={`kbv-cat-tile big ${kind === x.id ? 'on' : ''}`}
                    style={{ '--c': x.color }}
                    onClick={() => setKind(x.id)}>
              <span className="glyph big"><KIcon name={x.icon} size={20} /></span>
              <span className="lbl">{x.name}</span>
              <span className="sub">{x.desc}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
        <div className="kbv-form-row">
          <label>Nombre del proyecto</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Fondo de emergencia, viaje, liquidar tarjeta..." autoFocus />
        </div>
        <div className="kbv-form-row">
          <label>Fecha objetivo</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <div className="kbv-form-row">
        <label>Descripción</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Por qué importa y cómo se ve éxito." />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <div className="kbv-form-row">
          <label>{kind === 'debt' ? 'Saldo actual' : 'Acumulado hoy'}</label>
          <div className="kbv-amount-input"><span className="prefix">$</span><input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="0" /><span className="suffix">MXN</span></div>
        </div>
        <div className="kbv-form-row">
          <label>{kind === 'debt' ? 'Meta · liquidar' : 'Meta total'}</label>
          <div className="kbv-amount-input"><span className="prefix">$</span><input type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="75,000" /><span className="suffix">MXN</span></div>
        </div>
        <div className="kbv-form-row">
          <label>Aporte mensual</label>
          <div className="kbv-amount-input"><span className="prefix">$</span><input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="4,500" /><span className="suffix">MXN</span></div>
        </div>
      </div>
      {monthsToTarget !== null && (
        <div className="kbv-fin-projection">
          <KIcon name="sparkle" size={16} style={{ color: 'var(--kb-gem)' }} />
          Con $${parseFloat(monthly).toLocaleString('es-MX')} al mes alcanzas la meta en <strong>{monthsToTarget} meses</strong>.
        </div>
      )}
    </KBVModal>
  );
}

// ─────────────────────────────────────────────────────────────
// Finance project drill-in card
// ─────────────────────────────────────────────────────────────
function FinProjectCard({ project }) {
  const pct = Math.min(100, (project.current / project.target) * 100);
  const remain = Math.max(0, project.target - project.current);
  const monthsToGo = project.monthly > 0 ? Math.ceil(remain / project.monthly) : '—';
  return (
    <div className="kbv-fin-project-card" style={{ '--c': project.color }}>
      <div className="head">
        <span className="glyph"><KIcon name={project.icon} size={18} /></span>
        <div style={{ flex: 1 }}>
          <h4>{project.name}</h4>
          <span className="kbv-meta">{project.desc}</span>
        </div>
        <span className={`kind kind-${project.kind}`}>{project.kind === 'saving' ? 'Ahorro' : project.kind === 'invest' ? 'Inversión' : project.kind === 'debt' ? 'Deuda' : 'Ingreso'}</span>
      </div>
      <div className="amounts">
        <div className="block">
          <span className="l">{project.kind === 'debt' ? 'Restante' : 'Acumulado'}</span>
          <span className="v">${project.current.toLocaleString('es-MX')}</span>
        </div>
        <div className="block">
          <span className="l">Meta</span>
          <span className="v">${project.target.toLocaleString('es-MX')}</span>
        </div>
        <div className="block">
          <span className="l">Aporte/mes</span>
          <span className="v">${project.monthly.toLocaleString('es-MX')}</span>
        </div>
      </div>
      <div className="kbv-progress" style={{ height: 10 }}>
        <div className="fill" style={{ width: `${pct}%`, background: project.color }} />
      </div>
      <div className="footrow">
        <span className="kbv-meta">{Math.round(pct)}% completado</span>
        <span className="kbv-meta">{monthsToGo} meses para meta · proyección {project.projDate}</span>
      </div>
      {/* Sparkline */}
      <div className="kbv-fin-sparkline">
        {project.history.map((v, i) => {
          const max = Math.max(...project.history) || 1;
          const h = Math.max(2, (v / max) * 100);
          return <span key={i} className="bar" style={{ height: `${h}%`, background: project.color }} />;
        })}
      </div>
    </div>
  );
}

const DEFAULT_ACCOUNTS = [
  { id: 'a1', name: 'BBVA',  type: 'debit',   bank: 'BBVA México', last4: '4521', balance: 18420, color: '#0040A8', linked: true },
  { id: 'a2', name: 'Nu Ahorro', type: 'savings', bank: 'Nu',      last4: '8821', balance: 48200, color: '#820AD1', linked: true },
  { id: 'a3', name: 'Efectivo', type: 'cash',  bank: null,         last4: null,   balance: 5800,  color: 'var(--kb-primary)', linked: false },
];

const DEFAULT_CREDITS = [
  { id: 'c1', name: 'Tarjeta Oro · BBVA', type: 'credit-card', bank: 'BBVA', balance: -14200, limit: 60000, dueDay: 15, apr: 36.5, color: '#0040A8', linked: true },
  { id: 'c2', name: 'Hipoteca · Banorte', type: 'mortgage',    bank: 'Banorte', balance: -1240000, limit: 1500000, dueDay: 5, apr: 9.8, color: 'var(--kb-hp)', linked: true },
  { id: 'c3', name: 'Kueski · préstamo',  type: 'online-loan', bank: 'Kueski', balance: -8500, limit: 15000, dueDay: 20, apr: 78, color: 'var(--pri-high)', linked: false },
];

const ACCOUNT_TYPES = {
  debit:        { label: 'Débito',    icon: 'wealth', color: 'var(--area-wisdom)' },
  savings:      { label: 'Ahorro',    icon: 'shield', color: 'var(--kb-primary)' },
  cash:         { label: 'Efectivo',  icon: 'shop',   color: 'var(--kb-good-soft)' },
  investment:   { label: 'Inversión', icon: 'wealth', color: 'var(--area-community)' },
};

const CREDIT_TYPES = {
  'credit-card': { label: 'Tarjeta de crédito', icon: 'wealth', color: 'var(--kb-gem)' },
  'mortgage':    { label: 'Hipoteca',           icon: 'home',   color: 'var(--kb-hp)' },
  'online-loan': { label: 'Préstamo online',    icon: 'alert',  color: 'var(--pri-high)' },
  'auto-loan':   { label: 'Crédito auto',       icon: 'film',   color: 'var(--kb-coin-ink)' },
  'personal':    { label: 'Personal',           icon: 'user',   color: 'var(--area-community)' },
};

function FinanzasScreen() {
  const [transactions, setTransactions] = React.useState(DEMO_TX);
  const [projects, setProjects] = React.useState(FIN_PROJECTS);
  const [accounts, setAccounts] = React.useState(DEFAULT_ACCOUNTS);
  const [credits, setCredits] = React.useState(DEFAULT_CREDITS);
  const [movOpen, setMovOpen] = React.useState(false);
  const [projOpen, setProjOpen] = React.useState(false);
  const [accountTab, setAccountTab] = React.useState('accounts'); // accounts | credits

  const totalIncome = transactions.filter(t => t.kind === 'income').reduce((a, b) => a + b.amt, 0);
  const totalExpense = Math.abs(transactions.filter(t => t.kind === 'expense').reduce((a, b) => a + b.amt, 0));
  const net = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((net / totalIncome) * 100) : 0;
  const subsTotal = transactions.filter(t => t.cat === 'subs').reduce((a, b) => a + Math.abs(b.amt), 0);
  const budgetUsedPct = Math.round((totalExpense / BUDGET.reduce((a, b) => a + b.limit, 0)) * 100);
  const debtTotal = projects.filter(p => p.kind === 'debt').reduce((a, p) => a + p.current, 0);
  const burnRate = totalExpense / 30; // mock daily avg
  const runway = 72420 / Math.max(1, burnRate); // months runway from balance

  function addTx(tx) { setTransactions(ts => [tx, ...ts]); }
  function addProject(p) { setProjects(ps => [...ps, p]); }

  return (
    <div className="kbv-main">
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--kb-primary)' }}>{crumb('finanzas', 'Dinero y recursos')}</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Finanzas. <InfoDot label="i" text={"Ingresos, gastos, presupuestos y proyectos. Auto-registro desde correo y notificaciones (pronto) — para que dejes de capturar a mano."} /></h1>
        </div>
        <div className="actions">
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => setMovOpen(true)}>
            <KIcon name="plus" size={14} /> Registrar movimiento
          </button>
          <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => setProjOpen(true)}>
            <KIcon name="sparkle" size={14} /> Nuevo proyecto financiero
          </button>
        </div>
      </div>

      {/* Hero — keep, with one extra block */}
      <div className="kbv-fin-hero" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="label">Saldo neto · Mayo</span>
          <div className="amount">${net.toLocaleString('es-MX')}<small> MXN</small></div>
          <span className="sub"><span className="delta">+18%</span> vs Abril · meta $25,000</span>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="label">Ingresos</span>
          <div className="amount">${totalIncome.toLocaleString('es-MX')}</div>
          <span className="sub">2 fuentes activas</span>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="label">Gastos</span>
          <div className="amount">${totalExpense.toLocaleString('es-MX')}</div>
          <span className="sub"><span className="delta down">+4%</span> vs Abril</span>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="label">Tasa de ahorro</span>
          <div className="amount">{savingsRate}<small>%</small></div>
          <span className="sub">{savingsRate >= 20 ? 'Por arriba de 20% — bien' : 'Bajo 20% — ajusta'}</span>
        </div>
      </div>

      {/* Wide KPI strip */}
      <div className="kbv-kpi-grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        <div className="kbv-kpi" style={{ '--c': 'var(--area-community)' }}>
          <span className="label">Suscripciones / mes</span>
          <span className="val">${subsTotal.toLocaleString('es-MX')}</span>
          <span className="delta">{transactions.filter(t => t.cat === 'subs').length} activas</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-gem)' }}>
          <span className="label">Patrimonio neto</span>
          <span className="val">$58.2<small>K</small></span>
          <span className="delta up">+8% vs Q1</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-hp)' }}>
          <span className="label">Deuda total</span>
          <span className="val">${(debtTotal/1000).toFixed(1)}<small>K</small></span>
          <span className="delta down">−$3K este mes</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-coin)' }}>
          <span className="label">Quema diaria</span>
          <span className="val">${Math.round(burnRate).toLocaleString('es-MX')}</span>
          <span className="delta">{Math.round(burnRate * 30).toLocaleString('es-MX')} / mes</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-primary)' }}>
          <span className="label">Runway (meses)</span>
          <span className="val">{runway.toFixed(1)}</span>
          <span className="delta">Con saldo actual y gasto actual</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--pri-high)' }}>
          <span className="label">% Presupuesto usado</span>
          <span className="val">{budgetUsedPct}<small>%</small></span>
          <span className="delta">{BUDGET.filter(b => b.used > b.limit).length} sobre el límite</span>
        </div>
      </div>

      {/* Automation pending banner */}
      <div className="kbv-fin-automation">
        <div className="left">
          <div className="ico"><KIcon name="sparkle" size={20} /></div>
          <div>
            <h4>Auto-registro de movimientos <span className="kbv-tag soon">próximo sprint</span></h4>
            <p>Conecta Gmail/Outlook y deja que Kibo lea los correos de bancos, SPEI y suscripciones. En la app móvil, activa el acceso a notificaciones — cada cargo se vuelve un borrador que apruebas con un toque.</p>
          </div>
        </div>
        <div className="actions">
          <button type="button" className="kbv-btn kbv-btn-secondary">
            <KIcon name="google" size={14} /> Conectar Gmail
          </button>
          <button type="button" className="kbv-btn kbv-btn-secondary">
            <KIcon name="microsoft" size={14} /> Conectar Outlook
          </button>
          <button type="button" className="kbv-btn kbv-btn-ghost">
            <KIcon name="alert" size={14} /> Notificaciones (móvil)
          </button>
        </div>
      </div>

      <div className="kbv-fin-grid">
        {/* Transactions */}
        <div className="kbv-fin-card">
          <div className="head">
            <h3 className="kbv-h3">Movimientos recientes</h3>
            <button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }}>Ver todos</button>
          </div>
          <div className="kbv-tx-list">
            {transactions.map(tx => (
              <div key={tx.id} className="kbv-tx" style={{ '--cat-c': tx.catC, '--cat-bg': tx.catBg }}>
                <span className="ico"><KIcon name={tx.icon} size={14} /></span>
                <div>
                  <div className="name">
                    {tx.name}
                    {tx.src === 'email'  && <span className="src-pill email" title="Detectado desde correo">📧</span>}
                    {tx.src === 'notif'  && <span className="src-pill notif" title="Detectado desde notificación">📱</span>}
                  </div>
                  <div className="meta">{tx.meta}</div>
                </div>
                <span className={`amt ${tx.kind}`}>
                  {tx.kind === 'income' ? '+' : ''}${tx.amt.toLocaleString('es-MX')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="kbv-fin-card">
          <div className="head">
            <h3 className="kbv-h3">Presupuesto · Mayo</h3>
            <span className="kbv-meta">{budgetUsedPct}% gastado</span>
          </div>
          <div>
            {BUDGET.map(b => {
              const pct = Math.min(100, (b.used / b.limit) * 100);
              const over = b.used > b.limit;
              return (
                <div key={b.name} className="kbv-budget-row" style={{ '--c': b.color }}>
                  <div className="name">
                    <span className="dot" />
                    {b.name}
                  </div>
                  <div className="bar">
                    <div className={`fill ${over ? 'over' : ''}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="nums">
                    <span className="used">${b.used.toLocaleString('es-MX')}</span>
                    <span> / ${b.limit.toLocaleString('es-MX')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Financial projects — full drill-in cards */}
      <div className="kbv-fin-card">
        <div className="head">
          <h3 className="kbv-h3">Proyectos financieros</h3>
          <button type="button" className="kbv-btn kbv-btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => setProjOpen(true)}>
            <KIcon name="plus" size={12} /> Nuevo proyecto
          </button>
        </div>
        <div className="kbv-fin-project-grid">
          {projects.map(p => <FinProjectCard key={p.id} project={p} />)}
        </div>
      </div>

      {/* Accounts & Credits management */}
      <div className="kbv-fin-card">
        <div className="head">
          <div>
            <h3 className="kbv-h3">Cuentas y créditos</h3>
            <span className="kbv-meta">Gestión completa de tus instrumentos financieros — auto-registro de movimientos cuando estén conectados.</span>
          </div>
          <div className="kbv-store-tabs" style={{ marginBottom: 0 }}>
            <button type="button" className={accountTab === 'accounts' ? 'active' : ''} onClick={() => setAccountTab('accounts')}>
              <KIcon name="wealth" size={14} /> Cuentas ({accounts.length})
            </button>
            <button type="button" className={accountTab === 'credits' ? 'active' : ''} onClick={() => setAccountTab('credits')}>
              <KIcon name="alert" size={14} /> Créditos ({credits.length})
            </button>
          </div>
        </div>

        {accountTab === 'accounts' && (
          <>
            <div className="kbv-account-grid">
              {accounts.map(a => {
                const t = ACCOUNT_TYPES[a.type] || ACCOUNT_TYPES.debit;
                return (
                  <div key={a.id} className="kbv-account-card" style={{ '--c': a.color }}>
                    <div className="top">
                      <span className="bank">{a.bank || '—'}</span>
                      <span className={`type-pip ${a.type}`} style={{ '--c': t.color }}>
                        <KIcon name={t.icon} size={10} /> {t.label}
                      </span>
                    </div>
                    <div className="name">{a.name}</div>
                    <div className="balance">${a.balance.toLocaleString('es-MX')}<small> MXN</small></div>
                    <div className="bottom">
                      <span className="last4">{a.last4 ? `•• •• •• ${a.last4}` : 'Sin tarjeta'}</span>
                      <span className={`link-state ${a.linked ? 'on' : ''}`}>
                        {a.linked ? <><KIcon name="check" size={10} /> Conectada</> : <><KIcon name="alert" size={10} /> Manual</>}
                      </span>
                    </div>
                  </div>
                );
              })}
              <button type="button" className="kbv-account-add">
                <span className="glyph"><KIcon name="plus" size={20} /></span>
                <span className="name">Agregar cuenta</span>
                <span className="sub">Débito · Ahorro · Inversión · Efectivo</span>
              </button>
            </div>

            <div className="kbv-fin-automation" style={{ marginTop: 12, background: 'linear-gradient(135deg, var(--kb-primary-soft) 0%, var(--kb-canvas) 100%)', borderColor: 'var(--kb-primary-border)' }}>
              <div className="left">
                <div className="ico" style={{ background: 'rgba(76,175,130,0.20)', color: 'var(--kb-primary-ink)' }}>
                  <KIcon name="sparkle" size={20} />
                </div>
                <div>
                  <h4>Conexión bancaria · próx sprint</h4>
                  <p>Conectar tus cuentas con Belvo / Plaid lee saldos en tiempo real y registra movimientos sin que captures nada. Mientras tanto puedes registrar manual.</p>
                </div>
              </div>
              <div className="actions">
                <button type="button" className="kbv-btn kbv-btn-secondary">
                  <KIcon name="sparkle" size={14} /> Conectar banco
                </button>
              </div>
            </div>
          </>
        )}

        {accountTab === 'credits' && (
          <>
            <div className="kbv-credit-grid">
              {credits.map(c => {
                const t = CREDIT_TYPES[c.type] || CREDIT_TYPES['personal'];
                const usedPct = c.limit > 0 ? Math.min(100, (Math.abs(c.balance) / c.limit) * 100) : 0;
                return (
                  <div key={c.id} className="kbv-credit-card" style={{ '--c': c.color }}>
                    <div className="top">
                      <span className="type-pip" style={{ '--c': t.color }}>
                        <KIcon name={t.icon} size={10} /> {t.label}
                      </span>
                      <span className={`link-state ${c.linked ? 'on' : ''}`}>
                        {c.linked ? <><KIcon name="check" size={10} /> Conectado</> : <><KIcon name="alert" size={10} /> Manual</>}
                      </span>
                    </div>
                    <div className="name">{c.name}</div>
                    <div className="balance">
                      <span className="bal">${Math.abs(c.balance).toLocaleString('es-MX')}</span>
                      <span className="cap">de ${c.limit.toLocaleString('es-MX')}</span>
                    </div>
                    <div className="kbv-progress" style={{ height: 6 }}>
                      <div className="fill" style={{ width: `${usedPct}%`, background: usedPct > 80 ? 'var(--kb-hp)' : c.color }} />
                    </div>
                    <div className="bottom">
                      <span>Vence día <strong>{c.dueDay}</strong></span>
                      <span>CAT <strong style={{ color: c.apr > 50 ? 'var(--kb-hp)' : c.color }}>{c.apr}%</strong></span>
                    </div>
                  </div>
                );
              })}
              <button type="button" className="kbv-account-add">
                <span className="glyph"><KIcon name="plus" size={20} /></span>
                <span className="name">Agregar crédito</span>
                <span className="sub">Tarjeta · Hipoteca · Préstamo · Auto</span>
              </button>
            </div>

            <div className="kbv-fin-automation" style={{ marginTop: 12, background: 'linear-gradient(135deg, var(--kb-hp-soft) 0%, var(--kb-canvas) 100%)', borderColor: 'var(--kb-coin-border)' }}>
              <div className="left">
                <div className="ico" style={{ background: 'rgba(230,69,69,0.18)', color: 'var(--kb-hp-ink)' }}>
                  <KIcon name="alert" size={20} />
                </div>
                <div>
                  <h4>Estrategia anti-deuda · próx sprint</h4>
                  <p>Kibo calcula bola de nieve o avalancha de pagos según tus créditos. Visualiza cuándo terminarías de pagar y cuánto interés ahorras acelerando.</p>
                </div>
              </div>
              <div className="actions">
                <button type="button" className="kbv-btn kbv-btn-secondary">
                  <KIcon name="sparkle" size={14} /> Plan de extinción
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {movOpen && <RegistrarMovimientoModal onClose={() => setMovOpen(false)} onSave={addTx} />}
      {projOpen && <CreateFinanceProjectModal onClose={() => setProjOpen(false)} onSave={addProject} />}
    </div>
  );
}

Object.assign(window, {
  TareasScreen, ProjectsScreen, StoreScreen, LecturaScreen, DiarioScreen, FinanzasScreen,
  TASK_COLUMNS, PROJECT_COLUMNS, COMPLEXITY_DEFS, BookEditModal,
  TaskDetailModal, DEMO_TASKS_FULL, DEMO_PROJECTS_FOR_FILTER, DEMO_BOOKS,
  // La fuente de los proyectos: sin exportarla, cualquier widget que hable de
  // proyectos se queda leyendo `undefined` y pinta una tarjeta en blanco.
  DEMO_PROJECTS_KANBAN, seedProjectDates, projectPct, PROJECT_TASK_KEYS,
});
