// modals-v2.jsx — Task creation modal + quick-action registration modals
// (one per FAB item: task, project, habit, entry, book, watch)

// ─────────────────────────────────────────────────────────────
// Generic modal frame
// ─────────────────────────────────────────────────────────────
const KBV_MODAL_SIZES = { sm: 'sm', md: '', lg: 'lg', full: 'full' };

function KBVModal({ title, sub, onClose, footer, children, size = 'md' }) {
  React.useEffect(() => {
    function onEsc(e) {if (e.key === 'Escape') onClose && onClose();}
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [onClose]);

  return (
    <div className="kbv-modal-veil" onClick={onClose}>
      <div className={`kbv-modal-card ${KBV_MODAL_SIZES[size] || ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="kbv-modal-head">
          <div>
            <h3 className="title">{title}</h3>
            {sub && <p className="sub">{sub}</p>}
          </div>
          <button type="button" className="kbv-modal-close" onClick={onClose} aria-label="Cerrar">
            <KIcon name="x" size={14} />
          </button>
        </div>
        <div className="kbv-modal-body">{children}</div>
        {footer && <div className="kbv-modal-foot">{footer}</div>}
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────
// Task creation modal — Sergio: defines which fields we'll capture
// ─────────────────────────────────────────────────────────────
const RECURRENCE_OPTIONS = [
{ id: 'once', label: 'Solo una vez' },
{ id: 'daily', label: 'Diaria' },
{ id: 'weekdays', label: 'L-V' },
{ id: 'weekly', label: 'Semanal' },
{ id: 'monthly', label: 'Mensual' }];


function CreateTaskModal({ onClose, onSave, defaults = {} }) {
  const [title, setTitle] = React.useState(defaults.title || '');
  const [desc, setDesc] = React.useState(defaults.desc || '');
  const [area, setArea] = React.useState(defaults.area || null);
  const [project, setProject] = React.useState(defaults.project || '');
  const [priority, setPriority] = React.useState(defaults.priority || 'medium');
  const [energy, setEnergy] = React.useState(defaults.energy || 3);
  const [estTime, setEstTime] = React.useState(defaults.estTime || '');
  const [due, setDue] = React.useState(defaults.due || '');
  const [dueTime, setDueTime] = React.useState(defaults.dueTime || '');
  const [recurrence, setRecurrence] = React.useState(defaults.recurrence || 'once');
  const [tags, setTags] = React.useState(defaults.tags || '');

  const PRI_W = { urgent: 5, high: 4, medium: 3, low: 2, vlow: 1 };
  const rwCoins = (PRI_W[priority] || 2) * (energy || 2) * 3;
  const rwXp = (PRI_W[priority] || 2) * (energy || 2) * 5;

  function save() {
    if (!title.trim()) return;
    onSave && onSave({
      id: 't' + Math.random().toString(36).slice(2, 8),
      title: title.trim(), desc, area, project, priority, energy,
      estTime, due, dueTime, recurrence, tags, done: false, status: 'todo'
    });
    onClose && onClose();
  }

  return (
    <KBVModal
      title="Nueva tarea"
      sub="Define los campos que vamos a capturar para cada actividad."
      onClose={onClose}
      size="lg"
      footer={
      <>
          <span className="kbv-reward-pill" title="Recompensa al cerrar, según prioridad × energía">
            <KIcon name="sparkle" size={13} /> Al cerrar: <strong>+{rwXp} XP</strong> · <strong>{rwCoins}</strong> <CoinIcon size={11} />
          </span>
          <div className="right">
            <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="button" className="kbv-btn kbv-btn-primary" onClick={save} disabled={!title.trim()}>
              Crear tarea <KIcon name="check" size={14} />
            </button>
          </div>
        </>
      }>
      
      <div className="kbv-form-grid full">
        <div className="kbv-form-row">
          <label>Título *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="¿Qué necesitas hacer?" autoFocus />
        </div>
        <div className="kbv-form-row">
          <label>Descripción</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Detalles, contexto, enlaces..." />
        </div>
      </div>

      <div className="kbv-form-grid">
        <div className="kbv-form-row span-2">
          <label>Área</label>
          <div className="kbv-area-row">
            {KIBO_AREAS_V2.map((a) =>
            <button
              key={a.id}
              type="button"
              className={`kbv-area-btn ${area === a.id ? 'active' : ''}`}
              style={{ '--c': a.color }}
              onClick={() => setArea(area === a.id ? null : a.id)}>
              
                <span className="dot" />
                {a.name}
              </button>
            )}
            <button type="button" className={`kbv-area-btn ${area === null ? 'active' : ''}`}
            style={{ '--c': 'var(--kb-text-3)' }}
            onClick={() => setArea(null)}>
              <span className="dot" />Sin área
            </button>
          </div>
          <span className="hint">Si la tarea es parte de un proyecto, hereda el área del proyecto.</span>
        </div>

        <div className="kbv-form-row">
          <label>Proyecto</label>
          <select value={project} onChange={(e) => setProject(e.target.value)}>
            <option value="">Sin proyecto</option>
            <option value="aurora">Cerrar cliente Aurora</option>
            <option value="maraton">Maratón otoño 2026</option>
            <option value="system-design">Curso System Design</option>
            <option value="ynab">Migrar gastos a YNAB</option>
          </select>
        </div>

        <div className="kbv-form-row">
          <label>Recurrencia</label>
          <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
            {RECURRENCE_OPTIONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </div>
      </div>

      <div className="kbv-form-grid">
        <div className="kbv-form-row span-2">
          <label>Prioridad</label>
          <PriorityRow value={priority} onChange={setPriority} />
        </div>

        <div className="kbv-form-row">
          <label>Esfuerzo</label>
          <RateRow value={energy} onChange={setEnergy} icon={KB_SCALES.esfuerzo.icon} color={KB_SCALES.esfuerzo.color} labels={KB_EFFORT_LABELS} />
          <span className="hint">Lo que te cuesta hacerla — 1 trivial, 5 te cuesta.</span>
        </div>

        <div className="kbv-form-row">
          <label>Duración estimada <span className="kbv-meta">(opcional)</span></label>
          <select value={estTime} onChange={(e) => setEstTime(e.target.value)}>
            <option value="">Sin estimación</option>
            <option value="5m">5 minutos</option>
            <option value="15m">15 minutos</option>
            <option value="30m">30 minutos</option>
            <option value="45m">45 minutos</option>
            <option value="1h">1 hora</option>
            <option value="2h">2 horas</option>
            <option value="4h">Media jornada</option>
            <option value="day">Un día completo</option>
          </select>
        </div>
      </div>

      <div className="kbv-form-grid">
        <div className="kbv-form-row">
          <label>Vence el</label>
          <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        </div>
        <div className="kbv-form-row">
          <label>Hora</label>
          <input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} />
        </div>
        <div className="kbv-form-row span-2">
          <label>Etiquetas</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="separadas por coma — ej: planeación, mañana, foco-profundo" />
        </div>
      </div>
    </KBVModal>);

}

// ─────────────────────────────────────────────────────────────
// Project registration modal
// ─────────────────────────────────────────────────────────────
function CreateProjectModal({ onClose, onSave }) {
  const [name, setName] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [area, setArea] = React.useState(null);
  const [complexity, setComplexity] = React.useState('medium');
  const [priority, setPriority] = React.useState('medium');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [goal, setGoal] = React.useState('');

  return (
    <KBVModal
      title="Nuevo proyecto"
      sub="Los proyectos agrupan tareas hacia un resultado. Si los ligas a un área, dan XP a esa área."
      onClose={onClose}
      size="lg"
      footer={
      <>
          <span className="kbv-meta">Podrás añadir tareas después.</span>
          <div className="right">
            <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => {onSave && onSave({ name, desc, area, complexity, priority, startDate, endDate, tags, goal });onClose();}} disabled={!name.trim()}>
              Crear proyecto <KIcon name="check" size={14} />
            </button>
          </div>
        </>
      }>
      
      <div className="kbv-form-grid full">
        <div className="kbv-form-row">
          <label>Nombre *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Mejorar VO2 max" autoFocus />
        </div>
        <div className="kbv-form-row">
          <label>Resultado esperado</label>
          <textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder='¿Cómo se ve "terminado"? Sé concreto.' />
        </div>
        <div className="kbv-form-row">
          <label>Descripción / contexto</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>
      </div>
      <div className="kbv-form-grid">
        <div className="kbv-form-row span-2">
          <label>Área asignada</label>
          <div className="kbv-area-row">
            {KIBO_AREAS_V2.filter((a) => a.id !== 'will').map((a) =>
            <button key={a.id} type="button"
            className={`kbv-area-btn ${area === a.id ? 'active' : ''}`}
            style={{ '--c': a.color }}
            onClick={() => setArea(area === a.id ? null : a.id)}>
                <span className="dot" /> {a.name}
              </button>
            )}
            <button type="button" className={`kbv-area-btn ${area === null ? 'active' : ''}`}
            style={{ '--c': 'var(--kb-text-3)' }}
            onClick={() => setArea(null)}>
              <span className="dot" />Sin área
            </button>
          </div>
          <span className="hint">Voluntad no acepta proyectos — se maneja con hábitos y misiones.</span>
        </div>
        <div className="kbv-form-row">
          <label>Complejidad</label>
          <div className="kbv-pri-row">
            {['simple', 'medium', 'complex', 'epic'].map((c) =>
            <button key={c} type="button"
            className={`kbv-pri-btn ${complexity === c ? 'active' : ''}`}
            style={{ '--c': c === 'epic' ? 'var(--area-community)' : c === 'complex' ? 'var(--pri-high)' : c === 'medium' ? 'var(--kb-coin)' : 'var(--kb-good-soft)' }}
            onClick={() => setComplexity(c)}>
                {c === 'simple' ? 'Simple' : c === 'medium' ? 'Media' : c === 'complex' ? 'Compleja' : 'Épica'}
              </button>
            )}
          </div>
          <span className="hint">Define el tiempo esperado y XP estimado.</span>
        </div>
        <div className="kbv-form-row">
          <label>Prioridad <span className="kbv-meta">(guía decisiones)</span></label>
          <div className="kbv-pri-row icons">
            {PRIORITY_ORDER.map((p) =>
            <button key={p} type="button"
            className={`kbv-pri-btn icon ${priority === p ? 'active' : ''}`}
            style={{ '--c': PRIORITY_DEFS[p].color }}
            onClick={() => setPriority(p)} title={PRIORITY_DEFS[p].label}>
                <PriorityIcon level={p} size={16} />
                <span className="lbl">{PRIORITY_DEFS[p].label}</span>
              </button>
            )}
          </div>
        </div>
        <div className="kbv-form-row">
          <label>Fecha inicio</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="kbv-form-row">
          <label>Fecha fin objetivo</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="kbv-form-row span-2">
          <label>Etiquetas</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="separadas por coma — ej: salud, q3, personal" />
        </div>
      </div>
    </KBVModal>);

}

// ─────────────────────────────────────────────────────────────
// Habit registration modal
// Escala de esfuerzo — mismos peldaños en tareas, hábitos, retos y cursos.
const KB_EFFORT_LABELS = ['1 · Trivial', '2 · Ligero', '3 · Notable', '4 · Duro', '5 · Te cuesta'];

// ─────────────────────────────────────────────────────────────
// Maps a 1–5 habit priority rating onto the app-wide priority levels/icons.
const HABIT_PRI_MAP = { 1: 'vlow', 2: 'low', 3: 'medium', 4: 'high', 5: 'urgent' };
const PRI_HABIT_MAP = { vlow: 1, low: 2, medium: 3, high: 4, urgent: 5 };

function CreateHabitModal({ onClose, onSave, edit }) {
  const [name, setName] = React.useState(edit?.name || '');
  const initSched = edit?.schedule || '';
  const [schedMode, setSchedMode] = React.useState(
    !initSched || initSched === 'Sin horario' ? 'none' :
    initSched.includes('—') ? 'range' :
    /^\d{1,2}:\d{2}$/.test(initSched) ? 'exact' : 'none'
  );
  const [exactTime, setExactTime] = React.useState(/^\d{1,2}:\d{2}$/.test(initSched) ? initSched : '08:00');
  const rangeM = initSched.match(/(\d{1,2}:\d{2})\s*—\s*(\d{1,2}:\d{2})/);
  const [rangeFrom, setRangeFrom] = React.useState(rangeM ? rangeM[1] : '07:00');
  const [rangeTo, setRangeTo] = React.useState(rangeM ? rangeM[2] : '09:00');
  const [days, setDays] = React.useState(edit?.days || ['L', 'M', 'X', 'J', 'V', 'S', 'D']);
  const [energy, setEnergy] = React.useState(edit?.energy || 2);
  const [effort, setEffort] = React.useState(edit?.effort || 2);

  function toggleDay(d) {setDays((ds) => ds.includes(d) ? ds.filter((x) => x !== d) : [...ds, d]);}
  const schedule = schedMode === 'exact' ? exactTime : schedMode === 'range' ? `${rangeFrom} — ${rangeTo}` : 'Sin horario';
  const rw = typeof habitReward === 'function' ? habitReward(energy, effort) : { xp: energy * effort * 2, coins: energy * effort };

  return (
    <KBVModal
      title={edit ? 'Editar hábito' : 'Nuevo hábito'}
      sub="Hábitos buenos que quieres reforzar — suman XP y monedas a tu Voluntad. (Los malos hábitos se combaten en Retos.)"
      onClose={onClose}
      size="lg"
      footer={
      <div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="kbv-meta">Recompensa: <strong style={{ color: 'var(--kb-primary)' }}>+{rw.xp} XP · {rw.coins} monedas</strong> / check</span>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-primary"
        onClick={() => {onSave && onSave({ id: edit?.id, name: name.trim(), schedule, days, energy, effort });onClose();}}
        disabled={!name.trim()}>
            {edit ? 'Guardar' : 'Crear hábito'} <KIcon name="check" size={14} />
          </button>
        </div>
      }>
      
      <div className="kbv-form-grid full">
        <div className="kbv-form-row">
          <label>Nombre *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Estiramientos AM, Tomar 2L de agua, Diario nocturno..." autoFocus />
        </div>
      </div>

      <div className="kbv-form-row">
        <label>Horario · cuándo te recordamos</label>
        <div className="kbv-pri-row">
          <button type="button" className={`kbv-pri-btn ${schedMode === 'exact' ? 'active' : ''}`} style={{ '--c': 'var(--kb-primary)' }} onClick={() => setSchedMode('exact')}>Hora exacta</button>
          <button type="button" className={`kbv-pri-btn ${schedMode === 'range' ? 'active' : ''}`} style={{ '--c': 'var(--kb-primary)' }} onClick={() => setSchedMode('range')}>Rango de horas</button>
          <button type="button" className={`kbv-pri-btn ${schedMode === 'none' ? 'active' : ''}`} style={{ '--c': 'var(--kb-primary)' }} onClick={() => setSchedMode('none')}>Sin horario</button>
        </div>
        {schedMode === 'exact' &&
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="time" value={exactTime} onChange={(e) => setExactTime(e.target.value)} style={{ maxWidth: 160 }} />
            <span className="kbv-meta">Te notificamos a esta hora.</span>
          </div>
        }
        {schedMode === 'range' &&
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="time" value={rangeFrom} onChange={(e) => setRangeFrom(e.target.value)} style={{ maxWidth: 140 }} />
            <span className="kbv-meta">a</span>
            <input type="time" value={rangeTo} onChange={(e) => setRangeTo(e.target.value)} style={{ maxWidth: 140 }} />
            <span className="kbv-meta">Recordatorio dentro de esta ventana.</span>
          </div>
        }
        {schedMode === 'none' && <span className="hint">Sin hora fija — aparece como pendiente flexible del día.</span>}
      </div>

      <div className="kbv-form-grid">
        <div className="kbv-form-row span-2">
          <label>Días</label>
          <div className="kbv-pri-row">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) =>
            <button key={d} type="button"
            className={`kbv-pri-btn ${days.includes(d) ? 'active' : ''}`}
            style={{ '--c': 'var(--kb-primary)' }}
            onClick={() => toggleDay(d)}>
                {d}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="kbv-form-grid">
        <div className="kbv-form-row">
          <label>Esfuerzo</label>
          <RateRow value={energy} onChange={setEnergy} icon={KB_SCALES.esfuerzo.icon} color={KB_SCALES.esfuerzo.color} labels={KB_EFFORT_LABELS} />
          <span className="hint">Lo que te cuesta cumplirlo — 1 trivial, 5 te cuesta.</span>
        </div>
        <div className="kbv-form-row">
          <label>Prioridad</label>
          <PriorityRow value={HABIT_PRI_MAP[effort]} onChange={(id) => setEffort(PRI_HABIT_MAP[id] || 3)} />
          <span className="hint">Qué tanto pesa este hábito frente a los demás.</span>
        </div>
      </div>

      <div className="kbv-reward-callout">
        <KIcon name="sparkle" size={16} />
        <span>Kibo calcula tu recompensa a partir del <strong>esfuerzo × prioridad</strong>. Este hábito otorga <strong>+{rw.xp} XP</strong> y <strong>{rw.coins} monedas</strong> cada vez que lo cumples.</span>
      </div>
    </KBVModal>);

}

// ─────────────────────────────────────────────────────────────
// Diary entry modal
// ─────────────────────────────────────────────────────────────
function CreateEntryModal({ onClose, onSave }) {
  const [mood, setMood] = React.useState('good');
  const [body, setBody] = React.useState('');
  const [gratitude, setGratitude] = React.useState('');
  const [lesson, setLesson] = React.useState('');
  const [tags, setTags] = React.useState('');
  const today = new Date().toISOString().slice(0, 10);
  const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const [date, setDate] = React.useState(today);
  const isBackdated = date !== today;

  return (
    <KBVModal
      title="Entrada de diario"
      sub="Registra hoy o atrás (hasta 30 días). El coach IA solo usa el contenido si lo autorizas."
      onClose={onClose}
      size="lg"
      footer={
      <div className="right" style={{ marginLeft: 'auto' }}>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" disabled={!body.trim()} onClick={() => {onSave && onSave({ mood, body, gratitude, lesson, tags, date });onClose();}}>
            Guardar entrada <KIcon name="check" size={14} />
          </button>
        </div>
      }>
      
      <div className="kbv-form-row">
        <label>Fecha de la entrada {isBackdated && <span className="kbv-tag" style={{ marginLeft: 6, background: 'rgba(244,183,64,0.18)', color: 'var(--kb-coin-ink)' }}>Retroactiva</span>}</label>
        <input type="date" value={date} min={oneMonthAgo} max={today} onChange={(e) => setDate(e.target.value)} />
        <span className="kbv-meta">Puedes registrar hasta hace 30 días — si pasaron más, queda como "memoria pasada" sin sumar racha.</span>
      </div>
      <div className="kbv-form-row">
        <label>¿Cómo te {isBackdated ? 'fue ese día' : 'fue hoy'}?</label>
        <div className="kbv-mood-row">
          {MOOD_OPTIONS.map((m) =>
          <button key={m.id} type="button"
          className={`kbv-mood ${mood === m.id ? 'active' : ''}`}
          style={{ '--m-color': m.color }}
          onClick={() => setMood(m.id)}>
              <KIcon name={m.icon} size={24} />
              <span className="lbl">{m.label}</span>
            </button>
          )}
        </div>
      </div>
      <div className="kbv-form-grid full">
        <div className="kbv-form-row">
          <label>Entrada libre</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} autoFocus placeholder="Lo que pase por tu cabeza — cómo estuvo el día, qué te preocupa, qué salió bien…" style={{ minHeight: 120 }} />
        </div>
      </div>
      <div className="kbv-form-grid">
        <div className="kbv-form-row">
          <label>Algo que agradezco</label>
          <textarea value={gratitude} onChange={(e) => setGratitude(e.target.value)} placeholder="Una persona, momento o cosa..." />
        </div>
        <div className="kbv-form-row">
          <label>Algo que aprendí</label>
          <textarea value={lesson} onChange={(e) => setLesson(e.target.value)} placeholder="Patrón, idea, error útil..." />
        </div>
        <div className="kbv-form-row span-2">
          <label>Tags / personas</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ej: trabajo, ana, dudas, decision-de-vida" />
        </div>
      </div>
    </KBVModal>);

}

// ─────────────────────────────────────────────────────────────
// Reading register modal
// ─────────────────────────────────────────────────────────────
function CreateBookModal({ onClose, onSave, locations = [] }) {
  const [mode, setMode] = React.useState(null); // null (choice) | 'search' | 'form'
  const [q, setQ] = React.useState('');
  const [prefill, setPrefill] = React.useState({});
  const EditForm = typeof window !== 'undefined' ? window.BookEditModal : null;

  const CATALOG = [
  { title: 'Atomic Habits', author: 'James Clear', editorial: 'Avery · Penguin', isbn: '978-0735211292', pages: 320, genre: 'Hábitos · Productividad', cover: 'linear-gradient(135deg,#2A3F8F,#1B2A60)', source: 'Open Library' },
  { title: 'Sapiens', author: 'Yuval Noah Harari', editorial: 'Debate', isbn: '978-8499926223', pages: 464, genre: 'Historia · Ensayo', cover: 'linear-gradient(135deg,#6E2E2E,#401414)', source: 'Google Books' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', editorial: 'FSG', isbn: '978-0374533557', pages: 499, genre: 'Psicología', cover: 'linear-gradient(135deg,#2D3A45,#131820)', source: 'Open Library' },
  { title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', editorial: 'Addison-Wesley', isbn: '978-0135957059', pages: 352, genre: 'Tecnología', cover: 'linear-gradient(135deg,#3A5A40,#1F3325)', source: 'Google Books' }];

  const results = CATALOG.filter((c) => !q.trim() || (c.title + ' ' + c.author + ' ' + c.isbn).toLowerCase().includes(q.toLowerCase()));
  function pickResult(c) {
    setPrefill({ title: c.title, author: c.author, editorial: c.editorial, publisher: c.editorial, isbn: c.isbn, genre: c.genre, pages: c.pages, cover: c.cover, status: 'reading', fromCatalog: true });
    setMode('form');
  }

  // Formulario unificado: el MISMO que se usa al editar (alta manual o tras buscar).
  if (mode === 'form') {
    if (typeof EditForm !== 'function') return null;
    return <EditForm isNew book={prefill} onClose={onClose} onSave={(b) => {onSave && onSave(b);}} />;
  }

  // ── Paso 1: elegir cómo registrar ──
  if (mode === null) {
    return (
      <KBVModal title="Registrar libro" sub="¿Cómo quieres añadirlo?" onClose={onClose}>
        <div className="kbv-reg-choice">
          <button type="button" className="reg-opt" onClick={() => setMode('search')}>
            <span className="ro-ico"><KIcon name="layers" size={22} /></span>
            <span className="ro-name">Buscar en catálogo</span>
            <span className="ro-desc">Open Library · Google Books. Trae título, autor, editorial, ISBN y páginas — luego completas lo demás en el mismo formulario.</span>
          </button>
          <button type="button" className="reg-opt" onClick={() => {setPrefill({ status: 'reading' });setMode('form');}}>
            <span className="ro-ico"><KIcon name="edit" size={22} /></span>
            <span className="ro-name">Registrar manualmente</span>
            <span className="ro-desc">Captura tú los datos — el mismo formulario completo que usas al editar.</span>
          </button>
        </div>
      </KBVModal>);

  }

  // ── Paso 2: búsqueda ──
  return (
    <KBVModal title="Buscar libro" sub="Elige un resultado para autocompletar; ajustas el resto en el formulario." onClose={onClose}
    footer={<div className="right" style={{ marginLeft: 'auto' }}>
        <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => setMode(null)}><KIcon name="arrow-left" size={13} /> Atrás</button>
        <button type="button" className="kbv-btn kbv-btn-secondary" onClick={() => {setPrefill({ status: 'reading' });setMode('form');}}>No lo encuentro · manual</button>
      </div>}>
      <div className="kbv-form-row">
        <label>Título, autor o ISBN</label>
        <input type="text" className="kbv-search-input highlighted" value={q} onChange={(e) => setQ(e.target.value)} placeholder='Ej: "Sapiens", "Kahneman", 978…' autoFocus />
      </div>
      <div className="kbv-catalog-grid">
        {results.map((c, k) =>
        <div key={k} className="kbv-catalog-item">
            <div className="cover" style={{ background: c.cover }}>{c.title.toUpperCase()}</div>
            <div className="body">
              <span className="title">{c.title}</span>
              <span className="author">{c.author} · {c.pages} pp</span>
              <span className="source">{c.editorial} · via {c.source}</span>
            </div>
            <button type="button" className="kbv-btn kbv-btn-primary" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => pickResult(c)}>
              <KIcon name="check" size={12} /> Usar
            </button>
          </div>
        )}
        {results.length === 0 && <EmptyState compact icon="search" title="Sin resultados" body="Prueba otros términos o regístralo manualmente." />}
      </div>
    </KBVModal>);

}

// ─────────────────────────────────────────────────────────────
// Watch (movie/series) modal — Trakt-style search stub
// ─────────────────────────────────────────────────────────────
function CreateWatchModal({ onClose, onSave }) {
  const [q, setQ] = React.useState('');
  const [picked, setPicked] = React.useState(null);
  const [rating, setRating] = React.useState(0);
  const [note, setNote] = React.useState('');
  const [status, setStatus] = React.useState('watching');

  const fake = [
  { id: '1', title: 'Severance', kind: 'Serie · 2025', poster: 'SEVERANCE', tone: 'linear-gradient(135deg, #1B2A60, #0A1130)' },
  { id: '2', title: 'Dune: Part Two', kind: 'Película · 2024', poster: 'DUNE 2', tone: 'linear-gradient(135deg, #B5784E, #6A3F1F)' },
  { id: '3', title: 'The Bear', kind: 'Serie · 2024', poster: 'THE BEAR', tone: 'linear-gradient(135deg, #2D3A45, #131820)' }].
  filter((x) => !q || x.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <KBVModal
      title="Marcar pelí / serie"
      sub="Busca en Trakt.tv, marca lo que estás viendo o registra rating y notas."
      onClose={onClose}
      size="lg"
      footer={
      <div className="right" style={{ marginLeft: 'auto' }}>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => {onSave && onSave({ picked, rating, note, status });onClose();}} disabled={!picked}>
            Guardar <KIcon name="check" size={14} />
          </button>
        </div>
      }>
      
      <div className="kbv-form-row">
        <label>Buscar en Trakt.tv</label>
        <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder='Ej: "Severance", "Dune"...' autoFocus />
      </div>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 0' }}>
        {fake.map((f) =>
        <button key={f.id} type="button"
        onClick={() => setPicked(f)}
        style={{
          border: picked?.id === f.id ? '2px solid var(--kb-primary)' : '1.5px solid var(--kb-border)',
          borderRadius: 12, padding: 10, background: 'var(--kb-card)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, minWidth: 220
        }}>
            <div style={{
            width: 50, height: 70, borderRadius: 6, flexShrink: 0,
            background: f.tone, color: 'var(--kb-canvas)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontFamily: 'var(--kb-f-display)', fontSize: 9, fontWeight: 800
          }}>{f.poster}</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: 'var(--kb-text)', fontSize: 13 }}>{f.title}</div>
              <div style={{ fontFamily: 'var(--kb-f-mono)', fontSize: 11, color: 'var(--kb-text-2)' }}>{f.kind}</div>
            </div>
          </button>
        )}
      </div>
      {picked &&
      <div className="kbv-form-grid">
          <div className="kbv-form-row">
            <label>Estado</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="wishlist">Quiero verlo</option>
              <option value="watching">Viendo</option>
              <option value="seen">Visto</option>
              <option value="dropped">Abandonado</option>
            </select>
          </div>
          <div className="kbv-form-row">
            <label>Rating</label>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map((n) =>
            <button key={n} type="button" onClick={() => setRating(n === rating ? 0 : n)}
            style={{ background: 'transparent', border: 0, fontSize: 24, color: rating >= n ? 'var(--kb-coin)' : 'var(--kb-border-strong)', cursor: 'pointer' }}>★</button>
            )}
            </div>
          </div>
          <div className="kbv-form-row span-2">
            <label>Nota</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="¿Qué te dejó?" />
          </div>
        </div>
      }
    </KBVModal>);

}

// ─────────────────────────────────────────────────────────────
// Custom Reward modal (for Tienda)
// ─────────────────────────────────────────────────────────────
const REWARD_ICONS = ['shop', 'sparkle', 'film', 'book', 'sword', 'flame', 'image', 'calendar'];
const REWARD_PALETTE = ['var(--area-community)', 'var(--area-wisdom)', 'var(--area-will)', 'var(--kb-primary)', 'var(--kb-coin)', 'var(--pri-high)', 'var(--kb-hp)', 'var(--kb-gem)'];

// Rareza para el sorteo de cofres (C-11): tú declaras qué tan especial es tu
// recompensa; el backend usa ese peso para decidir si aparece en un cofre.
const REWARD_RARITY = [
  { id: 'none',   label: 'Nunca',      hint: 'Solo se canjea en la Tienda, no sale en cofres', c: 'var(--kb-text-3)' },
  { id: 'comun',  label: 'Común',      hint: 'Puede salir seguido — premios chicos',            c: 'var(--kb-rarity-comun)' },
  { id: 'raro',   label: 'Raro',       hint: 'Ocasional — vale la pena verlo caer',             c: 'var(--kb-rarity-raro)' },
  { id: 'epico',  label: 'Épico',      hint: 'Poco frecuente — un buen premio',                 c: 'var(--kb-rarity-epico)' },
  { id: 'legend', label: 'Legendario', hint: 'Rarísimo — tu recompensa más deseada',            c: 'var(--kb-rarity-legendario)' },
];

function CreateRewardModal({ onClose, onSave, edit = null }) {
  const [name, setName] = React.useState(edit?.name || '');
  const [desc, setDesc] = React.useState(edit?.desc || '');
  const [cost, setCost] = React.useState(edit?.cost || 200);
  const [currency, setCurrency] = React.useState(edit?.currency || 'coin');
  const [icon, setIcon] = React.useState(edit?.icon || 'sparkle');
  const [color, setColor] = React.useState(edit?.color || 'var(--area-community)');
  const [stock, setStock] = React.useState(edit?.stock || 'unlimited');
  const [rarity, setRarity] = React.useState(edit?.rarity || 'none');

  return (
    <KBVModal
      title={edit ? 'Editar recompensa' : 'Nueva recompensa personalizada'}
      sub="Define tus propias recompensas — algo real (un café, una hora de videojuegos, una compra) que canjeas con tus monedas o fragmentos."
      onClose={onClose}
      size="lg"
      footer={
      <div className="right" style={{ marginLeft: 'auto' }}>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => {onSave && onSave({ id: edit?.id || 'r' + Math.random().toString(36).slice(2, 8), name, desc, cost, currency, icon, color, stock, rarity, custom: true });onClose();}} disabled={!name.trim()}>
            {edit ? 'Guardar cambios' : 'Crear recompensa'} <KIcon name="check" size={14} />
          </button>
        </div>
      }>
      
      <div className="kbv-form-grid">
        <div className="kbv-form-row span-2">
          <label>Nombre *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Café de especialidad, 1h videojuegos..." autoFocus />
        </div>
        <div className="kbv-form-row span-2">
          <label>Descripción</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="¿Qué te das exactamente?" />
        </div>

        <div className="kbv-form-row">
          <label>Costo</label>
          <input type="number" value={cost} onChange={(e) => setCost(parseInt(e.target.value || '0', 10))} min="1" />
        </div>
        <div className="kbv-form-row">
          <label>Moneda</label>
          <div className="kbv-pri-row">
            <button type="button" className={`kbv-pri-btn ${currency === 'coin' ? 'active' : ''}`} style={{ '--c': 'var(--kb-coin-ink)' }} onClick={() => setCurrency('coin')}>● Monedas</button>
            <button type="button" className={`kbv-pri-btn ${currency === 'gem' ? 'active' : ''}`} style={{ '--c': 'var(--kb-gem-ink)' }} onClick={() => setCurrency('gem')}>◆ Materia oscura</button>
          </div>
        </div>

        <div className="kbv-form-row span-2">
          <label>¿Puede caer en un cofre?</label>
          <div className="kbv-rarity-row">
            {REWARD_RARITY.map(r => (
              <button key={r.id} type="button" className={`kbv-rarity-btn ${rarity === r.id ? 'active' : ''}`}
                      style={{ '--c': r.c }} onClick={() => setRarity(r.id)} title={r.hint}>
                <span className="rb-dot" />
                <span className="rb-label">{r.label}</span>
              </button>
            ))}
          </div>
          <span className="kbv-meta">
            {(REWARD_RARITY.find(r => r.id === rarity) || REWARD_RARITY[0]).hint}
            {rarity !== 'none' && ' · nosotros calibramos la probabilidad exacta'}
          </span>
        </div>

        <div className="kbv-form-row">
          <label>Stock disponible</label>
          <select value={stock} onChange={(e) => setStock(e.target.value)}>
            <option value="unlimited">Ilimitado</option>
            <option value="weekly-1">1 por semana</option>
            <option value="weekly-3">3 por semana</option>
            <option value="monthly-1">1 por mes</option>
            <option value="once">Una sola vez</option>
          </select>
        </div>
        <div className="kbv-form-row">
          <label>Ícono</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {REWARD_ICONS.map((i) =>
            <button key={i} type="button"
            onClick={() => setIcon(i)}
            style={{
              width: 36, height: 36, borderRadius: 9,
              border: icon === i ? '2px solid var(--kb-primary)' : '1.5px solid var(--kb-border)',
              background: icon === i ? 'var(--kb-primary-soft)' : 'var(--kb-card)',
              color: 'var(--kb-text-2)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <KIcon name={i} size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="kbv-form-row span-2">
          <label>Color</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {REWARD_PALETTE.map((c) =>
            <button key={c} type="button" onClick={() => setColor(c)}
            style={{
              width: 32, height: 32, borderRadius: 50,
              background: c,
              border: color === c ? '3px solid var(--kb-canvas)' : '2px solid var(--kb-canvas)',
              boxShadow: color === c ? `0 0 0 2px ${c}` : `0 0 0 1px var(--kb-border)`,
              cursor: 'pointer'
            }} />
            )}
          </div>
        </div>

        <div className="kbv-form-row span-2">
          <label>Vista previa</label>
          <div className="kbv-store-item custom" style={{ '--cat-c': color, maxWidth: 240 }}>
            <div className="preview"><KIcon name={icon} size={36} /></div>
            <div className="name">{name || 'Tu recompensa'}</div>
            <div className="desc">{desc || 'Una descripción aparecerá aquí.'}</div>
            <div className="foot">
              <span className={`price ${currency}`}>
                <span className="ico">{currency === 'coin' ? '●' : '◆'}</span>
                {cost.toLocaleString('es-MX')}
              </span>
              <span className="kbv-meta">Tuyo</span>
            </div>
          </div>
        </div>
      </div>
    </KBVModal>);

}

// ─────────────────────────────────────────────────────────────
// Reto detail modal — full-screen modal with config, damage, rules
// ─────────────────────────────────────────────────────────────
function RetoDetailModal({ reto, onClose, onUpdate, onAbandon }) {
  const r = reto || { id: 'r1', name: 'Procrastinación nocturna', desc: 'Sin pantalla después de las 22:00. Si tocas el celular después de esa hora, cuenta como fallo.', difficulty: 3, kind: 'cortar-malhabito', daysTotal: 30, daysElapsed: 21, fails: 1, failsAllowed: 2, xpReward: 450, gemReward: 80 };
  const diff = typeof RETO_DIFFICULTY !== 'undefined' ? RETO_DIFFICULTY[r.difficulty] : { color: 'var(--kb-boss)', damage: 22, label: 'Exigente' };
  const damage = r.damage || diff && diff.damage || 22;
  const coinReward = r.coinReward || Math.round((r.xpReward || 0) * 0.5);
  const per = typeof retoPeriod === 'function' ? retoPeriod(r) : { short: 'Diario', label: 'Todos los días' };
  const isBuild = r.kind === 'construir-habito';
  const canAct = r.status === 'active'; // registrar acciones solo en activos
  const canAbandon = r.status === 'active' || r.status === 'planned'; // los pasados NO se abandonan
  const readOnly = !canAct && !canAbandon; // completados/pasados → solo consulta

  const [fails, setFails] = React.useState(r.fails || 0);
  const [daysElapsed, setDaysElapsed] = React.useState(r.daysElapsed || 0);
  const [confirmAbandon, setConfirmAbandon] = React.useState(false);
  const [flash, setFlash] = React.useState(null); // 'fail' | 'ok' | 'lost'
  const [todayMark, setTodayMark] = React.useState(r.todayMark || null); // 'done' | 'fail'
  const [confirmHito, setConfirmHito] = React.useState(false);
  const [confirmUndo, setConfirmUndo] = React.useState(false);
  const [confirmStart, setConfirmStart] = React.useState(false);

  const pct = r.daysTotal > 0 ? Math.round(daysElapsed / r.daysTotal * 100) : 0;
  const failsLeft = Math.max(0, (r.failsAllowed || 0) - fails);
  const lost = fails > (r.failsAllowed || 0);

  function registerFail() {
    const nf = fails + 1;
    const nd = Math.min(r.daysTotal, daysElapsed + 1);
    setFails(nf);
    setDaysElapsed(nd);
    setTodayMark('fail');
    // El daño escala con la dificultad del reto (1–5) — la regla del DS.
    if (typeof damageHP === 'function') {
      damageHP([8, 14, 22, 34, 50][Math.max(1, Math.min(5, r.difficulty || 2)) - 1], `Fallo en «${r.name}»`);
    }
    if (nf > (r.failsAllowed || 0)) {
      setFlash('lost');
      onUpdate && onUpdate({ ...r, fails: nf, daysElapsed: nd, todayMark: 'fail', lostDay: 'Hoy', lostDayN: nd, status: 'completed', success: false, critical: true, completedAt: 'Hoy' });
    } else {
      setFlash('fail');setTimeout(() => setFlash(null), 1200);
      onUpdate && onUpdate({ ...r, fails: nf, daysElapsed: nd, todayMark: 'fail' });
    }
  }
  function registerDone() {
    const nd = Math.min(r.daysTotal, daysElapsed + 1);
    setDaysElapsed(nd);
    setTodayMark('done');
    if (typeof healHP === 'function') healHP(4, `Día cumplido en «${r.name}»`);
    if (isBuild && nd >= r.daysTotal) {
      // Reto de construir-hábito completado → se crea el hábito ligado en Hábitos.
      setFlash('habit');
      onUpdate && onUpdate({ ...r, daysElapsed: nd, todayMark: 'done', status: 'completed', success: true, completedAt: 'Hoy', spawnedHabit: true });
      try {window.dispatchEvent(new CustomEvent('kibo:habit-from-reto', { detail: { name: r.name } }));} catch (_) {}
    } else {
      setFlash('ok');setTimeout(() => setFlash(null), 1400);
      onUpdate && onUpdate({ ...r, daysElapsed: nd, todayMark: 'done' });
    }
  }
  // Una sola acción por día — se puede deshacer si fue un error.
  function undoToday() {
    const wasFail = todayMark === 'fail';
    const nf = wasFail ? Math.max(0, fails - 1) : fails;
    const nd = Math.max(0, daysElapsed - 1);
    setFails(nf); setDaysElapsed(nd); setTodayMark(null); setFlash(null); setConfirmUndo(false);
    onUpdate && onUpdate({ ...r, fails: nf, daysElapsed: nd, todayMark: null, lostDay: undefined, lostDayN: undefined, status: 'active', success: undefined, critical: false, completedAt: undefined });
  }
  // Iniciar ahora un reto programado (con confirmación).
  function startNow() {
    setConfirmStart(false);
    onUpdate && onUpdate({ ...r, status: 'active', daysElapsed: 0, todayMark: null, startsAt: undefined });
    onClose && onClose();
  }

  // Penalización al abandonar: pierdes recompensas + la mitad del XP y fragmentos que ibas a ganar.
  const lostXp = Math.round((r.xpReward || 0) / 2);
  const lostGems = Math.round((r.gemReward || 0) / 2);

  return (
    <KBVModal
      title={`Reto · ${r.name}`}
      sub={`Desafío activo · ${Math.max(0, r.daysTotal - daysElapsed)} días restantes · ${per.label.toLowerCase()} · dificultad ${diff.label}`}
      onClose={onClose}
      size="lg"
      footer={
      <>
          <div className="left" style={{ display: 'flex', gap: 8, marginRight: 'auto' }}>
            {canAbandon &&
          <button type="button" className="kbv-btn kbv-btn-ghost danger" onClick={() => setConfirmAbandon(true)}>
                <KIcon name="x" size={14} /> Abandonar reto
              </button>
          }
          </div>
          <div className="right" style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="kbv-btn kbv-btn-secondary" onClick={onClose}>Cerrar</button>
            {r.status === 'planned' &&
          <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => setConfirmStart(true)}>
                <KIcon name="play" size={14} /> Iniciar ahora
              </button>
          }
            {canAct && (todayMark ?
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => setConfirmUndo(true)}>
                  <KIcon name="repeat" size={14} /> Desmarcar registro de hoy
                </button> :
          isBuild ?
          <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => setConfirmHito(true)} disabled={lost}
          style={{ background: 'var(--kb-primary)', borderColor: 'var(--kb-primary)' }}>
                  <KIcon name="check" size={14} /> Marcar realizado · +{r.xpReward} XP
                </button> :
          <button type="button" className="kbv-btn kbv-btn-danger" onClick={registerFail} disabled={lost}>
                  <KIcon name="sword" size={14} /> Registrar recaída
                </button>)}
          </div>
        </>
      }>
      <div className="kbv-reto-detail">
        {flash === 'lost' &&
        <div className="kbv-reto-notice lost" style={{ marginBottom: 4 }}>
            <KIcon name="alert" size={16} />
            <span>Superaste el límite de fallos: <strong>el reto se pierde</strong>. Recibes la mitad de lo que ibas a ganar (+{lostXp} XP · {lostGems}◆) y tu HP cae a <strong>10 — zona crítica</strong>, al borde del trance.</span>
          </div>
        }
        {flash === 'ok' &&
        <div className="kbv-reto-notice ok" style={{ marginBottom: 4 }}>
            <KIcon name="check" size={16} /><span>Día registrado. ¡Avance guardado!</span>
          </div>
        }
        {flash === 'habit' &&
        <div className="kbv-reto-notice ok" style={{ marginBottom: 4 }}>
            <KIcon name="flame" size={16} /><span>¡Reto completado! Se creó el hábito <strong>«{r.name}»</strong> en tu sección de <strong>Hábitos</strong> para que lo mantengas.</span>
          </div>
        }
        {readOnly &&
        <div className="kbv-reto-notice read" style={{ marginBottom: 4 }}>
            <KIcon name="check" size={16} /><span>Reto finalizado · <strong>solo consulta</strong>. Los retos pasados no pueden modificarse ni abandonarse.</span>
          </div>
        }
        {canAct && todayMark && !flash &&
        <div className={`kbv-reto-notice ${todayMark === 'fail' ? 'warn' : 'ok'}`} style={{ marginBottom: 4 }}>
            <KIcon name={todayMark === 'fail' ? 'sword' : 'check'} size={16} />
            <span>{todayMark === 'fail' ? 'Recaída registrada hoy' : 'Día registrado hoy'} · solo un registro por día. ¿Te equivocaste? Puedes <strong>desmarcarlo</strong> desde el botón de abajo.</span>
          </div>
        }

        <div className="kbv-reto-hero no-hp">
          <div className="left">
            <span className="kbv-eyebrow" style={{ color: diff.color }}>RETO · DIFICULTAD {r.difficulty} / 5 · {diff.label}</span>
            <h3 className="kbv-h2" style={{ marginTop: 4 }}>{r.name}</h3>
            <p className="kbv-body" style={{ marginTop: 4 }}>{r.desc}</p>
            <div className="kbv-reto-hero-pips">
              {typeof RETO_KIND_LABELS !== 'undefined' && RETO_KIND_LABELS[r.kind] &&
              <span className="pip"><KIcon name={RETO_KIND_LABELS[r.kind].icon} size={12} /> {RETO_KIND_LABELS[r.kind].label}</span>
              }
              <span className="pip"><KIcon name="repeat" size={11} /> {per.label}</span>
              <span className="pip danger"><KIcon name="sword" size={11} /> −{damage} de daño al fallar</span>
            </div>
          </div>
          <div className="kbv-reto-meter">
            <div className="ring">
              <svg viewBox="0 0 100 100" width={120} height={120}>
                <circle cx={50} cy={50} r={42} fill="none" stroke="var(--kb-surface-2)" strokeWidth={10} />
                <circle cx={50} cy={50} r={42} fill="none" stroke={diff.color} strokeWidth={10}
                strokeDasharray={`${2 * Math.PI * 42 * (pct / 100)} ${2 * Math.PI * 42}`}
                strokeDashoffset={2 * Math.PI * 42 * 0.25}
                strokeLinecap="round" transform="rotate(-90 50 50)" />
              </svg>
              <span className="pct">{pct}%</span>
            </div>
            <span className="meter-l">Avance del reto</span>
          </div>
        </div>

        {/* KPIs — redistribuidos, sin HP del personaje (vive en el HUD) */}
        <div className="kbv-reto-grid four">
          <div className="cell">
            <span className="l">Días restantes</span>
            <span className="v">{Math.max(0, r.daysTotal - daysElapsed)} <small>de {r.daysTotal}</small></span>
          </div>
          <div className="cell">
            <span className="l">Fallos restantes</span>
            <span className="v" style={{ color: failsLeft === 0 ? 'var(--kb-hp)' : 'inherit' }}>{failsLeft} <small>de {r.failsAllowed}</small></span>
          </div>
          <div className="cell danger-cell">
            <span className="l"><KIcon name="sword" size={11} /> Daño por fallo</span>
            <span className="v">−{damage}</span>
          </div>
          <div className="cell">
            <span className="l"><KIcon name="repeat" size={11} /> Periodicidad</span>
            <span className="v" style={{ fontSize: 15 }}>{per.short}</span>
          </div>
        </div>

        {/* Recompensa al cerrar — íconos y colores diferenciados */}
        <div className="kbv-reto-reward-row">
          <span className="rw-l">Al cumplir el reto</span>
          <div className="rw-vals">
            <span className="rw xp"><KIcon name="trending-up" size={13} /> +{r.xpReward} XP</span>
            <span className="rw coin">{typeof CoinIcon === 'function' ? <CoinIcon size={14} /> : '◈'} {coinReward}</span>
            <span className="rw gem">{typeof GemIcon === 'function' ? <GemIcon size={14} /> : '◆'} {r.gemReward}</span>
          </div>
        </div>

        {/* Nota de funcionamiento — auto-registro a medianoche */}
        <div className="kbv-reto-howto">
          <KIcon name="clock" size={13} />
          <span>
            {isBuild ?
            <>Cada día debes <strong>marcar realizado</strong>. Si no registras nada, a las <strong>00:00</strong> se cuenta como falla automáticamente.</> :
            <>No necesitas confirmar los días buenos: si <strong>no registras una recaída</strong>, a las <strong>00:00</strong> el día se aprueba solo. Solo registra cuando caigas.</>}
          </span>
        </div>

        {(() => {
          const WD = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
          const MO = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
          const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - (daysElapsed - 1));
          const dayInfo = (i) => { const dt = new Date(start); dt.setDate(start.getDate() + i); return { wd: WD[dt.getDay()], dd: dt.getDate(), mo: MO[dt.getMonth()], yr: dt.getFullYear(), full: `${WD[dt.getDay()]} ${dt.getDate()} ${MO[dt.getMonth()]} ${dt.getFullYear()}` }; };
          const lostIdx = r.lostDayN ? r.lostDayN - 1 : (lost ? daysElapsed - 1 : null);
          const lostInfo = lostIdx != null && lostIdx >= 0 ? dayInfo(lostIdx) : null;
          const yearStart = dayInfo(0).yr, yearEnd = dayInfo(Math.max(0, r.daysTotal - 1)).yr;
          return (
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8, gap: 8, flexWrap: 'wrap' }}>
                <h4 className="kbv-h4" style={{ margin: 0 }}>Línea del reto <span className="kbv-meta" style={{ fontWeight: 600 }}>· {yearStart === yearEnd ? yearStart : `${yearStart}–${yearEnd}`}</span></h4>
                {lostInfo && <span className="kbv-reto-lostflag"><KIcon name="alert" size={12} /> Reto perdido el <strong>{lostInfo.full}</strong></span>}
              </div>
              <div className="kbv-reto-timeline dated">
                {Array.from({ length: daysElapsed }).map((_, i) => {
                  const info = dayInfo(i);
                  const isToday = i === daysElapsed - 1;
                  const isLost = lostIdx != null && i === lostIdx;
                  const isFail = isLost || (!isToday && i % 13 === 5 && fails > 0);
                  const cls = isLost ? 'lost' : isToday ? 'today' : isFail ? 'fail' : 'pass';
                  return (
                    <div key={i} className={`tl-day ${cls}`} title={`${info.full}${isLost ? ' · reto perdido' : isToday ? ' · hoy' : isFail ? ' · recaída' : ''}`}>
                      <span className="tl-date"><span className="wd">{info.wd}</span><b>{info.dd}</b><i>{info.mo}</i></span>
                      <span className="tl-cube" />
                      {isLost && <span className="tl-flag">Perdido</span>}
                    </div>
                  );
                })}
                {Array.from({ length: Math.max(0, r.daysTotal - daysElapsed) }).map((_, i) => {
                  const info = dayInfo(daysElapsed + i);
                  return (
                    <div key={'f' + i} className="tl-day future" title={info.full}>
                      <span className="tl-date"><span className="wd">{info.wd}</span><b>{info.dd}</b><i>{info.mo}</i></span>
                      <span className="tl-cube" />
                    </div>
                  );
                })}
              </div>
              <span className="kbv-meta">{daysElapsed} días transcurridos · {fails} {fails === 1 ? 'fallo' : 'fallos'} · {Math.max(0, r.daysTotal - daysElapsed)} por delante{lostInfo ? ` · perdido el ${lostInfo.full}` : ''}</span>
            </div>
          );
        })()}
      </div>

      {confirmStart &&
      <KBVModal
        title="¿Iniciar el reto ahora?"
        sub={`«${r.name}» está programado${r.startsAt ? ` para el ${r.startsAt}` : ''}. Puedes adelantarlo y empezar hoy.`}
        onClose={() => setConfirmStart(false)}
        footer={
        <div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => setConfirmStart(false)}>Mantener programado</button>
              <button type="button" className="kbv-btn kbv-btn-primary" onClick={startNow}><KIcon name="play" size={14} /> Sí, iniciar ahora</button>
            </div>
        }>
        <p className="kbv-body">Al iniciar, el reto pasa a <strong>Activos</strong> y el conteo de días arranca <strong>hoy</strong>. Tendrás {r.daysTotal} días y {r.failsAllowed} {r.failsAllowed === 1 ? 'fallo permitido' : 'fallos permitidos'}.</p>
      </KBVModal>
      }

      {confirmHito &&
      <KBVModal
        title="¿Cumpliste el hito de hoy?"
        sub={`Registra el día solo si de verdad cumpliste «${r.name}».`}
        onClose={() => setConfirmHito(false)}
        footer={
        <div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => setConfirmHito(false)}>Aún no</button>
              <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => { setConfirmHito(false); registerDone(); }} style={{ background: 'var(--kb-primary)', borderColor: 'var(--kb-primary)' }}><KIcon name="check" size={14} /> Sí, lo cumplí</button>
            </div>
        }>
        <p className="kbv-body">Confirmar suma el día de hoy a tu avance y otorga la recompensa (+{r.xpReward} XP). Solo puedes registrar <strong>una vez al día</strong> — un registro falso rompe el sentido del reto.</p>
      </KBVModal>
      }

      {confirmUndo &&
      <KBVModal
        title="¿Deshacer el registro de hoy?"
        sub="Quita la marca de hoy por si te equivocaste."
        onClose={() => setConfirmUndo(false)}
        footer={
        <div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => setConfirmUndo(false)}>Conservar registro</button>
              <button type="button" className="kbv-btn kbv-btn-danger" onClick={undoToday}>Sí, desmarcar</button>
            </div>
        }>
        <p className="kbv-body">Se revertirá {todayMark === 'fail' ? 'la recaída' : 'el día'} registrado hoy. Podrás volver a registrar más tarde.</p>
      </KBVModal>
      }

      {confirmAbandon &&
      <KBVModal
        title="¿Abandonar el reto?"
        sub="Esta acción es seria — por eso pedimos confirmación."
        onClose={() => setConfirmAbandon(false)}
        footer={
        <div className="right" style={{ marginLeft: 'auto' }}>
              <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => setConfirmAbandon(false)}>Seguir en el reto</button>
              <button type="button" className="kbv-btn kbv-btn-danger" onClick={() => {onAbandon && onAbandon(r.id);}}>Sí, abandonar</button>
            </div>
        }>
          <div className="kbv-abandon-warn">
            <KIcon name="alert" size={20} />
            <div>
              <p style={{ margin: 0 }}>Un reto está pensado para <strong>comprometerte</strong>. Si lo abandonas sin cumplirlo:</p>
              <ul className="kbv-abandon-list">
                <li><strong>No ganas la recompensa</strong> del reto (+{r.xpReward} XP · {r.gemReward}◆).</li>
                <li>Además <strong>pierdes la mitad</strong> de lo que ibas a ganar: <strong>−{lostXp} XP</strong> y <strong>−{lostGems} fragmentos</strong>.</li>
                <li>Queda registrado como <strong>reto abandonado</strong> en tu historial.</li>
              </ul>
              <p style={{ margin: '6px 0 0' }}>¿Seguro que quieres rendirte?</p>
            </div>
          </div>
        </KBVModal>
      }
    </KBVModal>);

}

// ─────────────────────────────────────────────────────────────
// Quick action chooser — routes to the right modal
// ─────────────────────────────────────────────────────────────
function QuickActionRouter({ action, onClose, onCreated }) {
  if (action === 'task') return <CreateTaskModal onClose={onClose} onSave={onCreated} />;
  if (action === 'project') return <CreateProjectModal onClose={onClose} onSave={onCreated} />;
  if (action === 'habit') return <CreateHabitModal onClose={onClose} onSave={onCreated} />;
  if (action === 'entry') return <CreateEntryModal onClose={onClose} onSave={onCreated} />;
  if (action === 'book') return <CreateBookModal onClose={onClose} onSave={onCreated} />;
  if (action === 'watch') return <CreateWatchModal onClose={onClose} onSave={onCreated} />;
  if (action === 'reward') return <CreateRewardModal onClose={onClose} onSave={onCreated} />;
  return null;
}

Object.assign(window, { KB_EFFORT_LABELS,
  KBVModal,
  CreateTaskModal,
  CreateProjectModal,
  CreateHabitModal,
  CreateEntryModal,
  CreateBookModal,
  CreateWatchModal,
  CreateRewardModal,
  RetoDetailModal,
  QuickActionRouter
});