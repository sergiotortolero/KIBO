// widgets-v3.jsx — Bloque F · Widget framework
// Sobreescribe componentes existentes con versiones size-aware (w, h)
// Cada widget tiene variantes según el tamaño asignado en WIDGET_REGISTRY.

// ═══════════════════════════════════════════════════════════════
// Reto widget — sin modal interno, click → pantalla Retos
// ═══════════════════════════════════════════════════════════════

// Reserva mínima por si el widget se monta antes que la pantalla de Retos.
const RETO_FALLBACK = {
  id: 'r1', name: 'Procrastinación nocturna', desc: 'Sin pantalla después de las 22:00 por 30 días.',
  kind: 'cortar-malhabito', status: 'active', daysTotal: 30, daysElapsed: 21,
  fails: 1, failsAllowed: 2, difficulty: 3, daysRemaining: 9, xpReward: 450, pct: 70,
};

function RetoWidget({ size = 'S', w = 1, h = 1, bossActive = true }) {
  // Un solo origen: el reto activo del store de Retos.
  const reto = (typeof kbActiveReto === 'function' && kbActiveReto()) || RETO_FALLBACK;
  function openReto() {
    try {
      const evt = new CustomEvent('kibo:navigate', { detail: { screen: 'retos', retoId: reto.id } });
      window.dispatchEvent(evt);
    } catch (_) {}
  }

  if (!bossActive) {
    return (
      <button type="button" className="kbv-reto-widget empty" onClick={openReto}>
        <span className="ico"><KIcon name="sword" size={w >= 2 ? 22 : 16} /></span>
        <div className="info">
          <span className="lbl">SIN RETO ACTIVO</span>
          <span className="ttl">Lanza un reto</span>
        </div>
      </button>
    );
  }

  // Decisión 1d: el tablero muestra la MISMA tarjeta de reto, en versión mini.
  return (
    <div className="kbv-reto-widget-wrap" onClick={openReto}>
      <RetoCard r={reto} compact onOpen={openReto} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Hábitos widget — limpio, solo XP + tarjetas con horario específico
// (sin llama, sin racha, sin protectores)
// ═══════════════════════════════════════════════════════════════

const DEMO_HABITS_CLEAN = [
  { id: 'h1', name: 'Tomar 2L de agua',       schedule: 'Cualquier hora', xp: 10, color: 'var(--area-wisdom)', icon: 'vigor',   done: true },
  { id: 'h2', name: 'No redes después de 22h', schedule: '22:00 — 24:00',  xp: 15, color: 'var(--area-community)', icon: 'flame',   done: true },
  { id: 'h3', name: 'Estiramientos AM',        schedule: '07:00 — 09:00',  xp: 10, color: 'var(--area-vigor)', icon: 'vigor',   done: false },
  { id: 'h4', name: 'Diario nocturno',         schedule: '22:30',           xp: 12, color: 'var(--area-community)', icon: 'edit',    done: false },
  { id: 'h5', name: 'Llamar a un ser querido', schedule: '3× por semana',  xp: 20, color: 'var(--pri-high)', icon: 'community', done: false },
  { id: 'h6', name: 'Sin azúcar añadida',      schedule: 'Todo el día',    xp: 15, color: 'var(--kb-hp)', icon: 'flame',   done: false },
];

function HabitsWidget({ size = 'S', w = 1, h = 1 }) {
  const [habits, setHabits] = React.useState(DEMO_HABITS_CLEAN);
  const totalXP = habits.filter(h => h.done).reduce((a, x) => a + x.xp, 0);
  const possibleXP = habits.reduce((a, x) => a + x.xp, 0);

  function toggle(id) {
    setHabits(hs => hs.map(h => h.id === id ? { ...h, done: !h.done } : h));
  }

  function openHabits() {
    try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'habits' } })); } catch(_) {}
  }
  function openCreate() {
    try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'habits', action: 'create' } })); } catch(_) {}
  }

  // El span del widget decide CUÁNTAS tarjetas caben en memoria, pero no cuántas
  // columnas: eso lo decide el ancho real con auto-fill, porque a 4 columnas
  // fijas las tarjetas caían a 187px y el texto se partía en 2–3 líneas.
  const cols = w >= 4 ? 4 : w >= 2 ? 2 : 1;
  const maxCount = cols * Math.max(1, h) * 2;
  const gridCols = cols === 1 ? '1fr' : `repeat(auto-fill, minmax(220px, 1fr))`;
  const visible = habits.slice(0, maxCount);
  const compact = w === 1 && h === 1;

  return (
    <section className={`kbv-habits-clean w-${w} h-${h}`}>
      <div className="head">
        <div className="left">
          <h3>Hábitos de hoy</h3>
          {!compact && <span className="xp-pill">+{totalXP}<small>/{possibleXP} XP</small></span>}
        </div>
        <button type="button" className="add" onClick={openCreate} title="Nuevo hábito">
          <KIcon name="plus" size={14} />
        </button>
      </div>
      <div className="cards" style={{ gridTemplateColumns: gridCols }}>
        {visible.map(h => (
          <KbHabitCard key={h.id} h={h} compact={compact} onToggle={toggle} />
        ))}
      </div>
      {habits.length > maxCount && (
        <button type="button" className="more-btn" onClick={openHabits}>
          Ver {habits.length - maxCount} más <KIcon name="arrow-right" size={10} />
        </button>
      )}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// Tareas widget — lista compacta o lista + kanban según tamaño
// ═══════════════════════════════════════════════════════════════

const DEMO_TASKS_FOR_WIDGET = [
  { id: 't1', title: 'Cerrar propuesta Aurora',            priority: 'urgent', energy: 4, status: 'todo',   area: 'wealth' },
  { id: 't2', title: 'Correr 5 km zona 2',                 priority: 'high',   energy: 3, status: 'todo',   area: 'vigor' },
  { id: 't3', title: 'Leer cap. 3 de Atomic Habits',       priority: 'high',   energy: 2, status: 'doing',  area: 'wisdom' },
  { id: 't4', title: 'Llamar a mamá',                       priority: 'medium', energy: 1, status: 'todo',   area: 'community' },
  { id: 't5', title: 'Meditar 10 min',                      priority: 'medium', energy: 1, status: 'done',   area: 'will' },
  { id: 't6', title: 'Revisar gastos semana',               priority: 'low',    energy: 2, status: 'doing',  area: 'wealth' },
  { id: 't7', title: 'Esperar respuesta Beta',              priority: 'medium', energy: 1, status: 'blocked',area: 'wealth' },
];

const KANBAN_COLS_MINI = [
  { id: 'todo',    name: 'Por hacer',  color: 'var(--pri-vlow)' },
  { id: 'doing',   name: 'En curso',   color: 'var(--kb-coin)' },
  { id: 'blocked', name: 'Bloqueado',  color: 'var(--kb-hp)' },
  { id: 'done',    name: 'Hecho',      color: 'var(--kb-primary)' },
];

function TasksWidget({ size = 'S', w = 1, h = 1 }) {
  const tasks = DEMO_TASKS_FOR_WIDGET;

  function openTasks() {
    try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'tareas' } })); } catch(_) {}
  }
  function openTaskDetail(id) {
    try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'tareas', taskId: id } })); } catch(_) {}
  }

  // Large variant: 4×2+ → kanban on right, compact list on left
  if (w >= 4 && h >= 2) {
    const priOrdered = ['urgent','high','medium','low','vlow'];
    const sortedTodo = tasks.filter(t => t.status === 'todo' || t.status === 'doing').sort((a, b) =>
      priOrdered.indexOf(a.priority) - priOrdered.indexOf(b.priority)
    );
    return (
      <div className="kbv-tasks-widget large">
        <div className="head">
          <h3>Tareas de hoy</h3>
          <button type="button" className="kbv-btn-link" onClick={openTasks}>Ver todas <KIcon name="arrow-right" size={10} /></button>
        </div>
        <div className="body">
          <div className="list-col">
            <span className="col-label">PRIORIZADAS</span>
            <div className="list">
              {sortedTodo.slice(0, 5).map(t => (
                <button key={t.id} type="button" className="row" onClick={() => openTaskDetail(t.id)}>
                  <PriorityIcon level={t.priority} size={12} />
                  <span className="ttl">{t.title}</span>
                  <EnergyMeter level={t.energy} size={9} />
                </button>
              ))}
            </div>
          </div>
          <div className="kanban-col">
            <span className="col-label">KANBAN</span>
            <div className="kanban-grid">
              {KANBAN_COLS_MINI.map(col => {
                const items = tasks.filter(t => t.status === col.id);
                return (
                  <div key={col.id} className="k-col" style={{ '--c': col.color }}>
                    <div className="k-head">
                      <span className="dot" />
                      <span className="name">{col.name}</span>
                      <span className="count">{items.length}</span>
                    </div>
                    <div className="k-items">
                      {items.slice(0, 3).map(t => (
                        <button key={t.id} type="button" className="k-item" onClick={() => openTaskDetail(t.id)}>
                          <PriorityIcon level={t.priority} size={9} />
                          <span>{t.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Medium 2×2 — 2 columns, 3 rows of tasks
  if (w === 2 && h === 2) {
    return (
      <div className="kbv-tasks-widget medium">
        <div className="head">
          <h3>Tareas de hoy</h3>
          <span className="kbv-meta">{tasks.filter(t => t.status !== 'done').length} pendientes</span>
        </div>
        <div className="grid-2col">
          {tasks.slice(0, 6).map(t => (
            <button key={t.id} type="button" className={`row ${t.status === 'done' ? 'done' : ''}`} onClick={() => openTaskDetail(t.id)}>
              <PriorityIcon level={t.priority} size={11} />
              <span className="ttl">{t.title}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Small 1×1 / 1×2 — compact list
  const maxRows = h === 2 ? 6 : 3;
  return (
    <div className="kbv-tasks-widget small">
      <div className="head">
        <h3>Tareas</h3>
        <span className="kbv-meta">{tasks.filter(t => t.status !== 'done').length}</span>
      </div>
      <div className="list">
        {tasks.slice(0, maxRows).map(t => (
          <button key={t.id} type="button" className="row" onClick={() => openTaskDetail(t.id)}>
            <PriorityIcon level={t.priority} size={11} />
            <span className="ttl">{t.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Coach widget — IA-powered, 2 tamaños
// ═══════════════════════════════════════════════════════════════

const COACH_AI_MESSAGES = [
  { mood: 'happy', body: 'Empieza por lo Urgente. Cuando termines una tarea de máxima prioridad, todo lo demás se siente más ligero.', src: 'Tu prioridad: Trabajo · Hábitos' },
  { mood: 'sparkle', body: 'Llevas 21 días sin caer en el reto nocturno. Estás a 9 días de la recompensa más grande del mes.', src: 'Análisis · Tu racha de retos' },
  { mood: 'happy', body: 'Tus tardes son cuando más bajas en mood. Considera mover tu bloque de estudio a las 10am — tu energía es más alta.', src: 'IA · 30 días de diario' },
  { mood: 'wave', body: 'Hoy es tu día de comunidad. ¿A quién no llamas desde hace más de 2 semanas?', src: 'Tu prioridad: Relaciones' },
];

function CoachWidget({ ctx, size = 'S', w = 1, h = 1 }) {
  const [msgIdx, setMsgIdx] = React.useState(0);
  const msg = COACH_AI_MESSAGES[msgIdx];
  function next() { setMsgIdx(i => (i + 1) % COACH_AI_MESSAGES.length); }

  // 1×1 — compact
  if (w === 1 && h === 1) {
    return (
      <div className="kbv-coach-v3 compact">
        <div className="head">
          <KiboMascot size={28} pose="head" mood={msg.mood} />
          <span className="from">KIBO · IA</span>
        </div>
        <p className="msg">{msg.body.slice(0, 90)}{msg.body.length > 90 ? '…' : ''}</p>
        <button type="button" className="more" onClick={next} title="Siguiente mensaje">
          <KIcon name="arrow-right" size={11} />
        </button>
      </div>
    );
  }

  // 2×1 — horizontal con detalle
  return (
    <div className="kbv-coach-v3 horizontal">
      <KiboMascot size={56} pose="head" mood={msg.mood} />
      <div className="info">
        <div className="head">
          <span className="from">KIBO · COACH IA</span>
          <span className="src">{msg.src}</span>
        </div>
        <p className="msg">{msg.body}</p>
        <div className="actions">
          <button type="button" className="kbv-btn-link" onClick={next}>
            Siguiente <KIcon name="arrow-right" size={11} />
          </button>
          <span className="kbv-meta">{msgIdx + 1} / {COACH_AI_MESSAGES.length}</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Bolsa widget — Monedas + Materia oscura, con transacciones en grande
// ═══════════════════════════════════════════════════════════════

const BOLSA_TX = [
  { id: 'b1', amt: +25,  kind: 'coin',  reason: 'Hábitos completados', when: 'Hoy', sign: 'in' },
  { id: 'b2', amt: +60,  kind: 'coin',  reason: 'Sesión de lectura',   when: 'Hoy', sign: 'in' },
  { id: 'b3', amt: -120, kind: 'coin',  reason: 'Cena italiana',       when: 'Ayer', sign: 'out' },
  { id: 'b4', amt: -8,   kind: 'gem',   reason: 'Fila dashboard',      when: 'Hoy', sign: 'out' },
  { id: 'b5', amt: +40,  kind: 'gem',   reason: 'Reto completado',     when: 'Mar', sign: 'in' },
];

function EconomyWidget({ size = 'S', w = 1, h = 1 }) {
  const coins = '1,245';
  const gems = 5340;

  // 1×1 — solo numbers
  if (w === 1 && h === 1) {
    return (
      <div className="kbv-side-card bolsa-compact">
        <h3>Bolsa</h3>
        <div className="bolsa-stack">
          <div className="bolsa-row">
            <span className="ico coin"><CoinIcon size={14} /></span>
            <span className="lbl">Monedas</span>
            <span className="val">{coins}</span>
          </div>
          <div className="bolsa-row">
            <span className="ico gem"><GemIcon size={14} /></span>
            <span className="lbl">Materia oscura</span>
            <span className="val">{gems.toLocaleString('es-MX')}</span>
          </div>
        </div>
      </div>
    );
  }

  // 2×1 — con últimas 3 tx
  if (w === 2 && h === 1) {
    return (
      <div className="kbv-side-card bolsa-medium">
        <div className="bolsa-head">
          <h3>Bolsa</h3>
          <div className="totals">
            <span><CoinIcon size={12} /> {coins}</span>
            <span><GemIcon size={12} /> {gems.toLocaleString('es-MX')}</span>
          </div>
        </div>
        <div className="bolsa-tx-list">
          {BOLSA_TX.slice(0, 3).map(t => (
            <div key={t.id} className={`tx ${t.sign}`}>
              <span className="amt">{t.amt > 0 ? '+' : ''}{t.amt}{t.kind === 'coin' ? <CoinIcon size={9} /> : <GemIcon size={9} />}</span>
              <span className="reason">{t.reason}</span>
              <span className="when">{t.when}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2×2 — totales + lista completa
  return (
    <div className="kbv-side-card bolsa-large">
      <div className="bolsa-head">
        <h3>Bolsa</h3>
        <div className="totals big">
          <div className="block coin">
            <span className="ico"><CoinIcon size={18} /></span>
            <span className="num">{coins}</span>
            <span className="lbl">monedas</span>
          </div>
          <div className="block gem">
            <span className="ico"><GemIcon size={18} /></span>
            <span className="num">{gems.toLocaleString('es-MX')}</span>
            <span className="lbl">fragmentos</span>
          </div>
        </div>
      </div>
      <div className="bolsa-tx-list expanded">
        {BOLSA_TX.map(t => (
          <div key={t.id} className={`tx ${t.sign}`}>
            <span className="amt">{t.amt > 0 ? '+' : ''}{t.amt}{t.kind === 'coin' ? <CoinIcon size={10} /> : <GemIcon size={10} />}</span>
            <div className="info">
              <span className="reason">{t.reason}</span>
              <span className="when">{t.when}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Streak widget — separado de hábitos
// ═══════════════════════════════════════════════════════════════

function StreakWidget({ size = 'S', w = 1, h = 1 }) {
  const days = 23;
  const tier = (typeof getFlameTier === 'function') ? getFlameTier(days) : { color: 'var(--kb-streak)', name: 'Naranja', toNext: 7 };
  const protectors = 1;
  const protectorsMax = 2;
  const weekDots = [1, 1, 1, 1, 0, 1, 1]; // last 7 days

  // 1×1 — compacto
  if (w === 1 && h === 1) {
    return (
      <div className="kbv-streak-v3 compact">
        <span className="flame-big">
          {typeof FlameSVG === 'function' ? <FlameSVG size={42} tierColor={tier.color} /> : <span>🔥</span>}
        </span>
        <div className="info">
          <span className="days">{days}</span>
          <span className="lbl">días de racha</span>
          <span className="tier" style={{ color: tier.color }}>Llama {tier.name}</span>
        </div>
      </div>
    );
  }

  // 2×1 — con protectores
  if (w === 2 && h === 1) {
    return (
      <div className="kbv-streak-v3 horizontal">
        <span className="flame-big">
          {typeof FlameSVG === 'function' ? <FlameSVG size={56} tierColor={tier.color} /> : <span>🔥</span>}
        </span>
        <div className="info">
          <span className="days">{days}<small> días</small></span>
          <span className="tier" style={{ color: tier.color }}>Llama {tier.name}</span>
          <div className="meta">
            <span className="kbv-meta">Protectores: <strong>{protectors}/{protectorsMax}</strong></span>
            <span className="kbv-meta">{tier.toNext}d a próx llama</span>
          </div>
        </div>
      </div>
    );
  }

  // 2×2 — con calendario semana
  return (
    <div className="kbv-streak-v3 large">
      <div className="top">
        <span className="flame-big">
          {typeof FlameSVG === 'function' ? <FlameSVG size={72} tierColor={tier.color} /> : <span>🔥</span>}
        </span>
        <div className="info">
          <span className="days">{days}<small> días</small></span>
          <span className="tier" style={{ color: tier.color }}>Llama {tier.name}</span>
        </div>
      </div>
      <div className="protectors">
        <span className="kbv-meta">PROTECTORES</span>
        <div className="prot-dots">
          {Array.from({ length: protectorsMax }).map((_, i) => (
            <span key={i} className={`prot ${i < protectors ? 'on' : ''}`}>
              <KIcon name="shield" size={12} />
            </span>
          ))}
        </div>
      </div>
      <div className="week">
        <span className="kbv-meta">ÚLTIMOS 7 DÍAS</span>
        <div className="week-dots">
          {['L','M','X','J','V','S','D'].map((d, i) => (
            <span key={i} className={`day ${weekDots[i] ? 'on' : ''}`}>
              <span className="lbl">{d}</span>
              {weekDots[i] && <span className="check">·</span>}
            </span>
          ))}
        </div>
      </div>
      <div className="footer">
        <span className="kbv-meta">Récord histórico: <strong style={{ color: 'var(--kb-text)' }}>47 días</strong></span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Diario widget — variantes según tamaño
// ═══════════════════════════════════════════════════════════════

const MOOD_OPTIONS_W3 = [
  { id: 'great',   icon: 'mood-great',   label: 'Genial',   color: 'var(--kb-primary)' },
  { id: 'good',    icon: 'mood-good',    label: 'Bien',     color: 'var(--kb-good-soft)' },
  { id: 'neutral', icon: 'mood-meh', label: 'Regular',  color: 'var(--kb-coin)' },
  { id: 'low',     icon: 'mood-low',     label: 'Bajón',    color: 'var(--kb-streak)' },
  { id: 'bad',     icon: 'mood-sad',     label: 'Mal',      color: 'var(--kb-hp)' },
];

function DiarioWidget({ size = 'S', w = 1, h = 1 }) {
  const [mood, setMood] = React.useState('good');
  const [text, setText] = React.useState('');
  const [transcribing, setTranscribing] = React.useState(false);

  React.useEffect(() => {
    if (!transcribing) return;
    const chunks = [' Hoy fue productivo.', ' Salí a caminar al medio día.', ' Necesito proteger mis mañanas.'];
    let i = 0;
    const id = setInterval(() => {
      if (i >= chunks.length) { setTranscribing(false); clearInterval(id); return; }
      setText(t => t + chunks[i++]);
    }, 900);
    return () => clearInterval(id);
  }, [transcribing]);

  // 1×1 — solo mood + foto + transcripción rápida
  if (w === 1 && h === 1) {
    return (
      <div className="kbv-diario-v3 compact">
        <h3>Diario</h3>
        <div className="mood-row">
          {MOOD_OPTIONS_W3.map(m => (
            <button key={m.id} type="button"
                    className={`mood-tile ${mood === m.id ? 'on' : ''}`}
                    style={{ '--c': m.color }}
                    onClick={() => setMood(m.id)}
                    title={m.label}>
              <KIcon name={m.icon} size={16} />
            </button>
          ))}
        </div>
        <div className="actions">
          <button type="button" className="action photo"><KIcon name="camera" size={12} /></button>
          <button type="button" className={`action mic ${transcribing ? 'on' : ''}`}
                  onClick={() => setTranscribing(t => !t)}>
            <KIcon name={transcribing ? 'square' : 'mic'} size={12} />
          </button>
          <button type="button" className="action save"><KIcon name="check" size={12} /></button>
        </div>
      </div>
    );
  }

  // 1×2 — mood + transcripción visible + foto
  if (w === 1 && h === 2) {
    return (
      <div className="kbv-diario-v3 tall">
        <h3>Diario del día</h3>
        <div className="mood-row">
          {MOOD_OPTIONS_W3.map(m => (
            <button key={m.id} type="button"
                    className={`mood-tile ${mood === m.id ? 'on' : ''}`}
                    style={{ '--c': m.color }}
                    onClick={() => setMood(m.id)}
                    title={m.label}>
              <KIcon name={m.icon} size={18} />
            </button>
          ))}
        </div>
        <textarea
          placeholder="Escribe o transcribe…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ minHeight: 80 }}
        />
        <div className="actions">
          <button type="button" className="kbv-voice-btn"
                  onClick={() => setTranscribing(t => !t)}>
            <KIcon name={transcribing ? 'square' : 'mic'} size={12} />
            <span>{transcribing ? 'Transcribiendo…' : 'Lector dictado'}</span>
          </button>
          <button type="button" className="kbv-btn kbv-btn-primary"><KIcon name="check" size={12} /> Guardar</button>
        </div>
      </div>
    );
  }

  // 2×2 y 4×2 — versión completa (existing DiarioWidget content stays useful here)
  return (
    <div className="kbv-diario-v3 full">
      <div className="head">
        <div>
          <h3>Diario del día</h3>
          <span className="kbv-meta">Lun 25 May · No guardado</span>
        </div>
        <button type="button" className="kbv-btn-link">Historial</button>
      </div>
      <div className="kbv-mood-row">
        {MOOD_OPTIONS_W3.map(m => (
          <button key={m.id} type="button"
                  className={`kbv-mood ${mood === m.id ? 'active' : ''}`}
                  style={{ '--m-color': m.color }}
                  onClick={() => setMood(m.id)}>
            <KIcon name={m.icon} size={22} />
            <span className="lbl">{m.label}</span>
          </button>
        ))}
      </div>
      <textarea
        className="kbv-diario-text"
        placeholder="Escribe sobre tu día… o usa el lector de dictado."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="capture-voice-strip">
        <button type="button"
                className={`kbv-voice-btn primary ${transcribing ? 'recording' : ''}`}
                onClick={() => setTranscribing(t => !t)}>
          <KIcon name={transcribing ? 'square' : 'mic'} size={14} />
          <span>{transcribing ? 'Transcribiendo…' : 'Lector dictado'}</span>
        </button>
        <button type="button" className="kbv-voice-btn"><KIcon name="camera" size={12} /><span>Foto</span></button>
        <button type="button" className="kbv-btn kbv-btn-primary" style={{ marginLeft: 'auto' }}>
          <KIcon name="check" size={12} /> Guardar · +15 XP
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Wire up — sobreescribir WIDGET_COMPONENTS
// ═══════════════════════════════════════════════════════════════
if (typeof WIDGET_COMPONENTS !== 'undefined') {
  Object.assign(WIDGET_COMPONENTS, {
    reto:    (props) => <RetoWidget {...props} bossActive={props.ctx?.bossActive} />,
    habits:  (props) => <HabitsWidget {...props} />,
    tasks:   (props) => <TasksWidget {...props} />,
    coach:   (props) => <CoachWidget {...props} />,
    economy: (props) => <EconomyWidget {...props} />,
    streak:  (props) => <StreakWidget {...props} />,
    diario:  (props) => <DiarioWidget {...props} />,
  });
}

// Asegurar que reto, habits, tasks estén en el registry
if (typeof WIDGET_REGISTRY !== 'undefined') {
  Object.assign(WIDGET_REGISTRY, {
    reto:   { id: 'reto',   name: 'Reto activo',    desc: 'Reto en curso. Click → abre el detalle.',                icon: 'sword',  cost: 'free', sizes: [[1,1],[2,1],[4,1]],          defaultW: 4, defaultH: 1, category: 'today' },
    habits: { id: 'habits', name: 'Hábitos de hoy', desc: 'Tarjetas con horario, XP y check. Sin racha embebida.',  icon: 'flame',  cost: 'free', sizes: [[1,1],[1,2],[2,1],[2,2],[4,1],[4,2]], defaultW: 4, defaultH: 1, category: 'today' },
    tasks:  { id: 'tasks',  name: 'Tareas de hoy',  desc: 'Lista 1×1 → kanban + lista en 4×2.',                     icon: 'list',   cost: 'free', sizes: [[1,1],[1,2],[2,2],[4,2],[4,3]], defaultW: 3, defaultH: 2, category: 'today' },
  });
}

Object.assign(window, {
  RetoWidget, HabitsWidget, TasksWidget,
  CoachWidget, EconomyWidget, StreakWidget,
  DiarioWidget,
  COACH_AI_MESSAGES, DEMO_HABITS_CLEAN, DEMO_TASKS_FOR_WIDGET, KANBAN_COLS_MINI,
});
