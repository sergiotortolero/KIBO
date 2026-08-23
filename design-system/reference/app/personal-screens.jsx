// personal-screens.jsx — Hábitos, Retos, Estudio, Entretenimiento
// All four routed from the sidebar in dashboard-v2.jsx

// =================================================================
// HÁBITOS — Gestión central de hábitos
// =================================================================

// Hábitos: solo afectan Voluntad. Sin tipo (los malos hábitos son Retos),
// sin área. La recompensa se calcula a partir de energía × esfuerzo.
function habitReward(energy, effort) {
  const base = (energy || 1) * (effort || 1);
  return { xp: Math.round(base * 2 + 4), coins: Math.max(1, Math.round(base * 0.8)) };
}

const HABITS_DEMO = [
  { id: 'h1', name: 'Tomar 2L de agua',        icon: 'vigor',     color: 'var(--area-wisdom)', streak: 14, schedule: 'Sin horario',   energy: 1, effort: 1, done: true,  goal: 'diario',  weeklyHistory: [1,1,1,1,1,1,1] },
  { id: 'h2', name: 'No redes después de 22h', icon: 'will',      color: 'var(--area-community)', streak: 12, schedule: '22:00 — 24:00', energy: 3, effort: 4, done: true,  goal: 'diario',  weeklyHistory: [1,1,1,0,1,1,1] },
  { id: 'h3', name: 'Estiramientos AM',        icon: 'vigor',     color: 'var(--area-vigor)', streak: 8,  schedule: '07:00 — 09:00', energy: 2, effort: 2, done: false, goal: 'diario',  weeklyHistory: [1,1,1,1,0,1,1] },
  { id: 'h4', name: 'Diario nocturno',         icon: 'edit',      color: 'var(--area-community)', streak: 21, schedule: '22:30',         energy: 2, effort: 3, done: false, goal: 'diario',  weeklyHistory: [1,1,1,1,1,1,1] },
  { id: 'h5', name: 'Llamar a un ser querido', icon: 'community', color: 'var(--pri-high)', streak: 4,  schedule: '3× por semana', energy: 2, effort: 3, done: false, goal: 'semanal', weeklyHistory: [1,0,1,0,0,1,0] },
  { id: 'h6', name: 'Sin azúcar añadida',      icon: 'flame',     color: 'var(--kb-hp)', streak: 6,  schedule: 'Todo el día',   energy: 4, effort: 4, done: false, goal: 'diario',  weeklyHistory: [1,1,0,1,1,1,0], fromReto: true },
];

// Store compartido de hábitos — fuente única de verdad. Un reto que se "convierte
// en hábito" (evento kibo:habit-from-reto) se agrega aquí y aparece en Hábitos.
const HabitsStore = (function () {
  let habits = HABITS_DEMO.slice();
  const subs = new Set();
  const emit = () => subs.forEach(fn => { try { fn(habits); } catch (_) {} });
  const get = () => habits;
  const set = (next) => { habits = (typeof next === 'function') ? next(habits) : next; emit(); };
  const add = (h) => { habits = [{ ...h }, ...habits]; emit(); };
  const subscribe = (fn) => { subs.add(fn); return () => subs.delete(fn); };
  try {
    window.addEventListener('kibo:habit-from-reto', (e) => {
      const d = e.detail || {};
      const name = (d.name || 'Hábito nuevo').trim();
      if (habits.some(h => h.fromReto && h.name === name)) return;
      add({ id: 'hr' + Date.now().toString(36), name, icon: 'flame', color: 'var(--kb-primary)', streak: 0, schedule: d.schedule || 'Diario', energy: 2, effort: 2, done: false, goal: 'diario', weeklyHistory: [0, 0, 0, 0, 0, 0, 0], fromReto: true });
    });
  } catch (_) {}
  return { get, set, add, subscribe };
})();

const HABIT_SORTS = [
  { id: 'orden', label: 'Mi orden' },
  { id: 'nombre', label: 'Nombre' },
  { id: 'racha', label: 'Racha' },
  { id: 'cadencia', label: 'Cadencia' },
];

function HabitsManager({ habits, onEdit, onDelete, onTogglePause, onReorder, onCreate }) {
  const [q, setQ] = React.useState('');
  const [sort, setSort] = React.useState('orden');
  const [drag, setDrag] = React.useState(null);

  const shown = habits
    .filter(h => !q.trim() || (h.name + ' ' + (h.schedule || '')).toLowerCase().includes(q.trim().toLowerCase()))
    .slice()
    .sort((a, b) => {
      if (sort === 'nombre') return a.name.localeCompare(b.name, 'es');
      if (sort === 'racha') return (b.streak || 0) - (a.streak || 0);
      if (sort === 'cadencia') return String(a.schedule || '').localeCompare(String(b.schedule || ''), 'es');
      return 0;
    });
  const canDrag = sort === 'orden' && !q.trim();
  const activos = habits.filter(h => !h.paused).length;

  return (
    <div className="kbv-card kbv-char-card kbv-habit-manager">
      <div className="kbv-study-section-head tight">
        <h3 className="kbv-h3">Mis hábitos</h3>
        <span className="kbv-meta">{activos} activos de {habits.length} · aquí se definen; marcarlos es cosa de arriba</span>
      </div>

      <div className="hm-tools">
        <label className="hm-search">
          <KIcon name="search" size={14} />
          <input value={q} placeholder="Buscar un hábito" onChange={(e) => setQ(e.target.value)} />
        </label>
        <div className="hm-sort">
          {HABIT_SORTS.map(s => (
            <button key={s.id} type="button" className={sort === s.id ? 'on' : ''} onClick={() => setSort(s.id)}>{s.label}</button>
          ))}
        </div>
        <button type="button" className="kbv-btn kbv-btn-primary hm-new" onClick={onCreate}>
          <KIcon name="plus" size={14} /> Nuevo hábito
        </button>
      </div>

      <div className="hm-list">
        <div className="hm-row hm-head">
          <span className="hm-grip" />
          <span className="hm-name">Hábito</span>
          <span className="hm-cad">Cadencia</span>
          <span className="hm-streak">Racha</span>
          <span className="hm-pay">Paga</span>
          <span className="hm-state">Estado</span>
          <span className="hm-acts" />
        </div>

        {shown.length === 0 && (
          <p className="kbv-meta hm-empty">Nada con «{q}». Prueba otro nombre o crea el hábito.</p>
        )}

        {shown.map((h, i) => {
          const xp = 5 + (h.effort || h.energy || 2) * 5;
          return (
            <div key={h.id}
                 className={`hm-row ${h.paused ? 'paused' : ''} ${drag === h.id ? 'dragging' : ''}`}
                 style={{ '--c': h.color }}
                 draggable={canDrag}
                 onDragStart={canDrag ? () => setDrag(h.id) : undefined}
                 onDragOver={canDrag && drag ? (e) => e.preventDefault() : undefined}
                 onDrop={canDrag && drag ? (e) => { e.preventDefault(); onReorder(drag, h.id); setDrag(null); } : undefined}>
              <span className="hm-grip" title={canDrag ? 'Arrastra para reordenar' : 'Vuelve a «Mi orden» para reordenar'}>
                <KIcon name="grip" size={12} />
              </span>
              <button type="button" className="hm-name" onClick={() => onEdit(h)} title="Editar este hábito">
                <span className="hm-ico"><KIcon name={h.icon || 'flame'} size={15} /></span>
                <span className="hm-id">
                  <strong>{h.name}</strong>
                  {h.fromReto && <em><KIcon name="sword" size={9} /> nació de un reto</em>}
                </span>
              </button>
              <span className="hm-cad">{h.schedule || 'Diario'}</span>
              <span className="hm-streak">
                {h.streak ? <React.Fragment><KIcon name="flame" size={12} /> {h.streak}<i>d</i></React.Fragment> : <em>sin racha</em>}
              </span>
              <span className="hm-pay">+{xp}<i>XP</i></span>
              <span className="hm-state">
                <button type="button" className={`hm-sw ${h.paused ? '' : 'on'}`} onClick={() => onTogglePause(h)}
                        title={h.paused ? 'Reactivar: vuelve a pedirte el check' : 'Pausar: deja de contar y no rompe la racha'}
                        aria-pressed={!h.paused}>
                  <i />
                </button>
                <span className="hm-state-l">{h.paused ? 'Pausado' : 'Activo'}</span>
              </span>
              <span className="hm-acts">
                <button type="button" onClick={() => onEdit(h)} title="Editar"><KIcon name="edit" size={14} /></button>
                <button type="button" className="danger" onClick={() => onDelete(h.id)} title="Eliminar"><KIcon name="trash" size={14} /></button>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HabitsScreen({ onNavigate, navDetail }) {
  const [habits, setHabits] = React.useState(() => HabitsStore.get());
  React.useEffect(() => HabitsStore.subscribe(setHabits), []);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [openHabit, setOpenHabit] = React.useState(null);
  const [editingHabit, setEditingHabit] = React.useState(null);

  // Deep-link from the dashboard habit widget "+" button o desde Áreas → Voluntad
  React.useEffect(() => {
    if (navDetail && (navDetail.action === 'create' || navDetail.create)) setCreateOpen(true);
  }, [navDetail]);

  // Lo de hoy solo muestra lo activo: un hábito pausado que siguiera pidiendo
  // check haría que «pausar» no signifique nada.
  const filtered = habits.filter(h => !h.paused);

  const [ask, confirmDialog] = useConfirm();
  function toggle(id) {
    const h = habits.find(x => x.id === id);
    HabitsStore.set(hs => hs.map(x => x.id === id ? { ...x, done: !x.done } : x));
    // Cumplir un hábito cura y KIBO lo festeja; desmarcar solo revierte.
    if (h && !h.done) {
      if (typeof healHP === 'function') healHP(3, `Hábito: ${h.name}`);
      else if (typeof kiboLog === 'function') kiboLog({ kind: 'habit', label: h.name });
    }
  }
  function deleteHabit(id) {
    const h = habits.find(x => x.id === id);
    ask({
      title: `Eliminar «${h ? h.name : 'hábito'}»`,
      message: h && h.streak > 0
        ? `Se pierde el historial y la racha de ${h.streak} días. Esto no se puede deshacer.`
        : 'Se pierde el historial completo. Esto no se puede deshacer.',
      confirmLabel: 'Sí, eliminar',
      onConfirm: () => { HabitsStore.set(hs => hs.filter(x => x.id !== id)); setOpenHabit(null); },
    });
  }

  const doneToday = habits.filter(h => h.done).length;
  const longestStreak = Math.max(...habits.map(h => h.streak), 0);
  const totalXP = habits.filter(h => h.done).reduce((a, h) => a + habitReward(h.energy, h.effort).xp, 0);
  const totalCoins = habits.filter(h => h.done).reduce((a, h) => a + habitReward(h.energy, h.effort).coins, 0);
  const avgStreak = Math.round(habits.reduce((a, h) => a + h.streak, 0) / Math.max(1, habits.length));
  const weeklyCompliance = Math.round(habits.reduce((a, h) => a + (h.weeklyHistory.filter(x => x).length / 7), 0) / Math.max(1, habits.length) * 100);
  // Patrones — cumplimiento por día de la semana + hábitos heredados de retos
  const DAY_LBL = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const dayTotals = DAY_LBL.map((_, i) => habits.filter(h => h.weeklyHistory[i]).length);
  const dayMax = Math.max(1, ...dayTotals);
  const bestDayIdx = dayTotals.indexOf(Math.max(...dayTotals));
  const fromRetoCount = habits.filter(h => h.fromReto).length;

  function onSaveNewHabit(h) {
    if (h.id) { HabitsStore.set(hs => hs.map(x => x.id === h.id ? { ...x, ...h } : x)); return; }
    HabitsStore.add({
      id: 'h' + Math.random().toString(36).slice(2, 6),
      name: h.name || 'Nuevo hábito',
      icon: h.icon || 'flame',
      color: h.color || 'var(--kb-primary)',
      streak: 0,
      schedule: h.schedule || 'Sin horario',
      energy: h.energy || 1,
      effort: h.effort || 1,
      done: false,
      goal: h.goal || 'diario',
      weeklyHistory: [0,0,0,0,0,0,0],
    });
  }

  return (
    <div className="kbv-main">
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--kb-primary)' }}>{crumb('habits', 'Voluntad')}</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Hábitos. <InfoDot label="i" text={"Tu disciplina diaria. Cada check suma XP y monedas a Voluntad. Los malos hábitos no van aquí — se combaten en Retos."} /></h1>
        </div>
        <div className="actions">
          <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => setCreateOpen(true)}>
            <KIcon name="plus" size={14} /> Nuevo hábito
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kbv-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="label">Hechos hoy</span>
            <span className="kbv-kpi-icon" style={{ '--c': 'var(--kb-primary)' }}><KIcon name="check" size={14} /></span>
          </div>
          <span className="val">{doneToday}<small>/{habits.length}</small></span>
          <span className="delta up">+{totalXP} XP · {totalCoins}◈ hoy</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-streak)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="label">Racha más larga</span>
            <span className="kbv-kpi-icon pulse" style={{ '--c': 'var(--kb-streak)' }}><KIcon name="flame" size={14} /></span>
          </div>
          <span className="val">{longestStreak}<small> días</small></span>
          <span className="delta">en "{habits.find(h => h.streak === longestStreak)?.name?.slice(0, 18)}"</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-gem)' }}>
          <span className="label">Racha promedio</span>
          <span className="val">{avgStreak}<small> días</small></span>
          <span className="delta">en {habits.length} hábitos</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-primary)' }}>
          <span className="label">Cumplimiento semanal</span>
          <span className="val">{weeklyCompliance}<small>%</small></span>
          <span className="delta up">+8% vs sem. anterior</span>
        </div>
      </div>

      {/* Lo de hoy: la acción de la pantalla, antes de cualquier análisis. */}
      <HabitsBig habits={filtered} onToggle={toggle} showAdd={false} streakDays={23} protectors={1} protectorsMax={2} />

      {/* Patrones — cumplimiento por día + hábitos heredados de retos */}
      <div className="kbv-habit-patterns">
        <div className="hp-chart">
          <div className="hp-head">
            <span className="kbv-eyebrow">Patrón semanal</span>
            <span className="kbv-meta">En qué días cumples más · mejor día: <strong>{['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][bestDayIdx]}</strong></span>
          </div>
          <div className="hp-bars">
            {DAY_LBL.map((d, i) => (
              <div key={i} className="hp-bar" title={`${dayTotals[i]} de ${habits.length} hábitos`}>
                <div className="hp-bar-track"><div className={`hp-bar-fill ${i === bestDayIdx ? 'best' : ''}`} style={{ height: `${(dayTotals[i] / dayMax) * 100}%` }} /></div>
                <span className="hp-bar-l">{d}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hp-side">
          <div className="hp-ind"><span className="hp-v">{habits.length}</span><span className="hp-l">hábitos activos</span></div>
          <div className="hp-ind"><span className="hp-v">{weeklyCompliance}<small>%</small></span><span className="hp-l">cumplimiento semanal</span></div>
          <div className="hp-ind reto"><span className="hp-v"><KIcon name="sword" size={14} /> {fromRetoCount}</span><span className="hp-l">vienen de un reto</span></div>
        </div>
      </div>

      {/* Gestión: definir, ordenar, pausar y borrar — nunca marcar. */}
      <HabitsManager habits={habits}
        onCreate={() => setCreateOpen(true)}
        onEdit={(h) => { setEditingHabit(h); setCreateOpen(true); }}
        onDelete={deleteHabit}
        onTogglePause={(h) => HabitsStore.set(hs => hs.map(x => x.id === h.id ? { ...x, paused: !x.paused } : x))}
        onReorder={(fromId, toId) => HabitsStore.set(hs => {
          if (fromId === toId) return hs;
          const next = hs.slice();
          const from = next.findIndex(x => x.id === fromId);
          const [moved] = next.splice(from, 1);
          next.splice(next.findIndex(x => x.id === toId), 0, moved);
          return next;
        })} />

      {createOpen && <CreateHabitModal edit={editingHabit} onClose={() => { setCreateOpen(false); setEditingHabit(null); }} onSave={onSaveNewHabit} />}
      {openHabit && <HabitDetailModal habit={openHabit} onClose={() => setOpenHabit(null)} onDelete={deleteHabit} onEdit={(h) => { setOpenHabit(null); setEditingHabit(h); setCreateOpen(true); }} />}
      {confirmDialog}
    </div>
  );
}

function HabitDetailModal({ habit, onClose, onDelete, onEdit }) {
  const monthlyHistory = Array.from({ length: 30 }, (_, i) => i % 4 !== 2);
  const rw = habitReward(habit.energy, habit.effort);
  return (
    <KBVModal
      title={habit.name}
      sub={`Voluntad · ${habit.schedule} · ${habit.goal === 'semanal' ? 'semanal' : 'diario'}`}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <button type="button" className="kbv-btn kbv-btn-ghost danger" onClick={() => onDelete && onDelete(habit.id)}>
            <KIcon name="trash" size={14} /> Eliminar
          </button>
          <div className="right" style={{ marginLeft: 'auto' }}>
            <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cerrar</button>
            <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => onEdit && onEdit(habit)}><KIcon name="edit" size={14} /> Editar hábito</button>
          </div>
        </>
      }>
      <div className="kbv-habit-detail">
        <div className="hero" style={{ '--c': habit.color }}>
          <div className="ico"><KIcon name={habit.icon} size={28} /></div>
          <div>
            <div className="streak-big">🔥 {habit.streak} días</div>
            <div className="kbv-meta">Racha actual · récord 31 días</div>
          </div>
          <div className="stats">
            <div><span className="v">+{rw.xp}</span><span className="l">XP / check</span></div>
            <div><span className="v" style={{ color: 'var(--kb-coin-ink)' }}>+{rw.coins}</span><span className="l">monedas / check</span></div>
            <div><span className="v">{habit.energy}<small>/5</small></span><span className="l">Esfuerzo</span></div>
            <div><span className="v" style={{ color: (PRIORITY_DEFS[HABIT_PRI_MAP[habit.effort]] || {}).color }}>{(PRIORITY_DEFS[HABIT_PRI_MAP[habit.effort]] || {}).label || habit.effort + '/5'}</span><span className="l">Prioridad</span></div>
          </div>
        </div>

        <div>
          <h4 className="kbv-h4" style={{ marginBottom: 6 }}>Últimos 30 días</h4>
          <div className="kbv-month-grid">
            {monthlyHistory.map((done, i) => (
              <span key={i} className={`d ${done ? 'on' : ''} ${i === 29 ? 'today' : ''}`} title={`Día ${i + 1}`} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 11, color: 'var(--kb-text-2)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--kb-primary)' }} /> Completado</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--kb-surface-2)' }} /> Fallido</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--kb-coin)' }} /> Hoy</span>
          </div>
        </div>
      </div>
    </KBVModal>
  );
}

// =================================================================
// RETOS — activos / pasados / futuros
// =================================================================

const RETOS_DEMO = [
  { id: 'r1', name: 'Procrastinación nocturna', desc: 'Sin pantalla después de las 22:00 por 30 días.', difficulty: 3, kind: 'cortar-malhabito', status: 'active', daysTotal: 30, daysElapsed: 21, fails: 1, failsAllowed: 2, xpReward: 450, gemReward: 80, area: 'will' },
  { id: 'r2', name: 'Caminar 8K pasos diarios', desc: 'Llegar a los 8,000 pasos cada día durante un mes.', difficulty: 2, kind: 'construir-habito', status: 'active', daysTotal: 30, daysElapsed: 12, fails: 0, failsAllowed: 3, xpReward: 300, gemReward: 50, area: 'vigor' },
  { id: 'r3', name: 'Dejar de fumar', desc: 'Erradicación total — 0 cigarrillos, 90 días.', difficulty: 5, kind: 'cortar-malhabito', status: 'planned', daysTotal: 90, daysElapsed: 0, fails: 0, failsAllowed: 1, xpReward: 1200, gemReward: 300, area: 'will', startsAt: '2026-07-01' },
  { id: 'r4', name: 'Meditar 30 días', desc: '10 minutos diarios, sin excusas.', difficulty: 2, kind: 'construir-habito', status: 'completed', daysTotal: 30, daysElapsed: 30, fails: 0, failsAllowed: 3, xpReward: 250, gemReward: 40, area: 'will', completedAt: '2026-04-15', success: true },
  { id: 'r5', name: 'Sin azúcar 21 días', desc: 'Reset metabólico.', difficulty: 3, kind: 'cortar-malhabito', status: 'completed', daysTotal: 21, daysElapsed: 14, fails: 4, failsAllowed: 2, xpReward: 350, gemReward: 60, area: 'vigor', completedAt: '2026-03-22', success: false },
  { id: 'r6', name: '7 días sin redes sociales', desc: 'Detox digital de una semana.', difficulty: 4, kind: 'cortar-malhabito', status: 'completed', daysTotal: 7, daysElapsed: 7, fails: 0, failsAllowed: 0, xpReward: 200, gemReward: 30, area: 'will', completedAt: '2026-02-08', success: true },
];

const RETO_DIFFICULTY = {
  1: { label: 'Suave',     color: 'var(--kb-primary)',  damage: 8,  desc: 'Algo concreto · poca fricción. Daño leve al fallar.' },
  2: { label: 'Estándar',  color: 'var(--kb-gem)',      damage: 14, desc: 'Esfuerzo medible diario. Daño moderado.' },
  3: { label: 'Exigente',  color: 'var(--kb-coin)',     damage: 22, desc: 'Cambio sostenido · mes o más. Daño alto.' },
  4: { label: 'Brutal',    color: 'var(--kb-streak)',   damage: 34, desc: 'Compromiso fuerte. Cada fallo duele de verdad.' },
  5: { label: 'Extremo',   color: 'var(--kb-hp)',       damage: 50, desc: 'Adicción / cambio de identidad. Daño crítico — cuida tu HP.' },
};

const RETO_KIND_LABELS = {
  'cortar-malhabito': { label: 'Cortar mal hábito', icon: 'sword',  desc: 'Eliminar un patrón dañino. Cada caída cuenta como fallo y te hace daño.' },
  'construir-habito': { label: 'Construir hábito',  icon: 'flame',  desc: 'Establecer una rutina nueva sostenida. Sumar días sin romper la cadena.' },
};

// Daño por fallo derivado de la dificultad (golpea el HP del personaje).
function retoDamage(difficulty) { return (RETO_DIFFICULTY[difficulty] || RETO_DIFFICULTY[3]).damage; }
// Tope de fallos tolerados: nunca más del 20% de los días del reto.
function maxFails(days) { return Math.max(0, Math.floor((days || 0) * 0.2)); }

// Periodicidad — con qué frecuencia debe cumplirse el reto. No cambia la
// dificultad (el daño se mantiene), pero sí escala las recompensas: menos
// días exigidos por semana ⇒ menos XP/monedas/materia oscura.
const RETO_PERIODICITY = {
  daily:    { label: 'Todos los días', short: 'Diario',     perWeek: 7, factor: 1.0,  desc: 'Hay que registrarlo cada día.' },
  weekdays: { label: 'Entre semana',   short: 'L–V',        perWeek: 5, factor: 0.78, desc: 'Lunes a viernes — libre el fin de semana.' },
  three:    { label: '3× por semana',  short: '3×/sem',     perWeek: 3, factor: 0.55, desc: 'Tres días cualesquiera de la semana.' },
  weekly:   { label: '1× por semana',  short: '1×/sem',     perWeek: 1, factor: 0.32, desc: 'Una vez por semana — para retos pesados o esporádicos.' },
};
function retoPeriod(r) { return RETO_PERIODICITY[r && r.periodicity] || RETO_PERIODICITY.daily; }

// Medidor de dificultad — delega en Scale5, el indicador 1–5 canónico.
function RetoDifficultyMeter({ difficulty = 3, color = 'var(--kb-streak)', size = 1 }) {
  return <Scale5 value={difficulty} color={color} size={size} label="Dificultad" />;
}

// Single reto card — used by both the per-tab grid and the "Todos" stacked view.
function RetoCard({ r, onOpen, onRegister, onFail, onUndo, compact }) {
  const [confirm, setConfirm] = React.useState(null); // 'hito' | 'undo'
  const d = RETO_DIFFICULTY[r.difficulty];
  const k = RETO_KIND_LABELS[r.kind];
  let per; try { per = retoPeriod(r); } catch (_) { per = { short: 'diario' }; }
  const pct = r.daysTotal > 0 ? (r.daysElapsed / r.daysTotal) * 100 : 0;
  const isFailing = r.fails >= r.failsAllowed;
  const isBuild = r.kind === 'construir-habito';

  // Versión mini (decisión 1d): misma anatomía, sin descripción ni registro diario.
  // La usa el widget de retos del tablero — un solo componente que mantener.
  if (compact) {
    return (
      <div className={`kbv-reto-card compact ${r.status || 'active'}`}
           style={{ '--c': d.color, '--area-c': d.color }}
           onClick={() => onOpen && onOpen(r)}>
        <div className="top">
          <div className="diff" style={{ background: d.color }}>
            <KIcon name={k.icon} size={13} /><span>{d.label}</span>
          </div>
          <RetoDifficultyMeter difficulty={r.difficulty} color={d.color} />
        </div>
        <h4 className="name">{r.name}</h4>
        <div className="kind-strip">
          <span className="kind-pip"><KIcon name={k.icon} size={11} /> {k.label}</span>
          <span className="kind-pip period"><KIcon name="repeat" size={10} /> {per.short}</span>
        </div>
        <div className="progress-row">
          <div className="kbv-progress" style={{ height: 8 }}>
            <div className="fill" style={{ width: `${pct}%`, background: isFailing ? 'var(--kb-hp)' : d.color }} />
          </div>
          <span className="pct">{Math.round(pct)}%</span>
        </div>
        <div className="stats">
          <span>Día <strong>{r.daysElapsed}</strong>/{r.daysTotal}</span>
          <span>Fallos <strong className={isFailing ? 'fail-warn' : ''}>{r.fails}</strong>/{r.failsAllowed}</span>
          <span className="xp"><KIcon name="trending-up" size={11} /> +{r.xpReward} XP</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`kbv-reto-card ${r.status} ${r.success === false ? 'failed' : ''} ${r.critical ? 'critical' : ''}`}
         style={{ '--c': d.color, '--area-c': d.color }}
         onClick={() => onOpen(r)}>
      <div className="top">
        <div className="diff" style={{ background: d.color }}>
          <KIcon name={k.icon} size={14} />
          <span>{d.label}</span>
        </div>
        <RetoDifficultyMeter difficulty={r.difficulty} color={d.color} />
      </div>

      <h4 className="name">{r.name}</h4>
      <p className="desc">{r.desc}</p>

      <div className="kind-strip">
        <span className="kind-pip"><KIcon name={k.icon} size={11} /> {k.label}</span>
        <span className="kind-pip period"><KIcon name="repeat" size={10} /> {per.short}</span>
      </div>

      {r.status === 'active' && (
        <>
          <div className="progress-row">
            <div className="kbv-progress" style={{ height: 8 }}>
              <div className="fill" style={{ width: `${pct}%`, background: isFailing ? 'var(--kb-hp)' : d.color }} />
            </div>
            <span className="pct">{Math.round(pct)}%</span>
          </div>
          <div className="stats">
            <span>Día <strong>{r.daysElapsed}</strong>/{r.daysTotal}</span>
            <span>Fallos <strong className={isFailing ? 'fail-warn' : ''}>{r.fails}</strong>/{r.failsAllowed}</span>
            <span className="xp"><KIcon name="trending-up" size={11} /> +{r.xpReward} XP</span>
          </div>
          {/* Registro diario — una sola acción por día, según el tipo de reto */}
          <div className="kbv-reto-register" onClick={(e) => e.stopPropagation()}>
            {r.todayMark ? (
              <div className="reg-marked">
                <span className={`reg-marked-badge ${r.todayMark === 'fail' ? 'fail' : 'ok'}`}>
                  <KIcon name={r.todayMark === 'fail' ? 'sword' : 'check'} size={14} />
                  {r.todayMark === 'fail' ? 'Recaída registrada hoy' : 'Día registrado hoy'}
                </span>
                <button type="button" className="reg-undo" onClick={() => setConfirm('undo')} title="Deshacer el registro de hoy">
                  <KIcon name="repeat" size={12} /> Desmarcar
                </button>
              </div>
            ) : isBuild ? (
              <button type="button" className="kbv-btn kbv-btn-primary reg-main" onClick={() => setConfirm('hito')}>
                <KIcon name="check" size={15} /> Registrar día
              </button>
            ) : (
              <button type="button" className="kbv-btn kbv-btn-danger reg-main relapse" onClick={() => onFail(r.id)}>
                <KIcon name="sword" size={15} /> Registrar recaída
              </button>
            )}
          </div>
          <span className="kbv-reto-auto"><KIcon name="clock" size={10} /> {r.todayMark ? 'Solo un registro por día — puedes desmarcarlo si te equivocaste.' : isBuild ? 'Solo se registra si cumpliste el hito de hoy. Si no, a las 00:00 cuenta como falla.' : 'Una recaída por día. Si no registras ninguna, el día se aprueba solo a las 00:00.'}</span>

          {confirm === 'hito' && (
            <div onClick={(e) => e.stopPropagation()}>
              <KBVModal title="¿Cumpliste el hito de hoy?"
                sub={`Registra el día solo si de verdad cumpliste «${r.name}».`}
                onClose={() => setConfirm(null)}
                footer={<div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                  <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => setConfirm(null)}>Aún no</button>
                  <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => { setConfirm(null); onRegister(r.id); }}><KIcon name="check" size={14} /> Sí, lo cumplí</button>
                </div>}>
                <p className="kbv-body">Confirmar suma el día de hoy a tu avance y otorga la recompensa. Solo puedes registrar una vez al día — un registro falso rompe el sentido del reto.</p>
              </KBVModal>
            </div>
          )}
          {confirm === 'undo' && (
            <div onClick={(e) => e.stopPropagation()}>
              <KBVModal title="¿Deshacer el registro de hoy?"
                sub="Quita la marca de hoy por si te equivocaste."
                onClose={() => setConfirm(null)}
                footer={<div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                  <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => setConfirm(null)}>Conservar registro</button>
                  <button type="button" className="kbv-btn kbv-btn-danger" onClick={() => { setConfirm(null); onUndo && onUndo(r.id); }}>Sí, desmarcar</button>
                </div>}>
                <p className="kbv-body">Se revertirá {r.todayMark === 'fail' ? 'la recaída' : 'el día'} registrado hoy. Podrás volver a registrar más tarde.</p>
              </KBVModal>
            </div>
          )}
        </>
      )}

      {r.status === 'planned' && (
        <div className="planned-strip">
          <KIcon name="calendar" size={12} />
          <span>Inicia <strong>{r.startsAt}</strong></span>
          <span className="kbv-meta">{r.daysTotal} días · {per.short} · +{r.xpReward} XP</span>
        </div>
      )}

      {r.status === 'completed' && (
        <div className={`result-strip ${r.success ? 'success' : 'failed'}`}>
          <KIcon name={r.success ? 'trophy' : 'x'} size={14} />
          <span>{r.success ? `Logrado · +${r.xpReward} XP · ${r.gemReward}◆` : (r.critical ? `Perdido · superó ${r.failsAllowed} fallos · zona crítica` : `Falló · ${r.fails} fallos vs ${r.failsAllowed} permitidos`)}</span>
          <span className="kbv-meta">{r.completedAt}</span>
        </div>
      )}
    </div>
  );
}

// =================================================================
// RETOS COMPARTIDOS — un reto compartido ES un reto (misma anatomía,
// mismos elementos que los personales) + la capa social: con quién,
// quién registró hoy y el HP de ambos en juego. Viven aquí, en Retos;
// la sección Amigos solo muestra un resumen que redirige acá.
// =================================================================
const SHARED_CHALLENGES = [
  { id: 'sc1', name: '30 días sin azúcar', desc: 'Cero azúcar añadida. Ambos registran cada día.', friend: 'Lucía', fc: 'var(--area-community)',
    difficulty: 3, kind: 'cortar-malhabito', periodicity: 'daily', daysElapsed: 12, daysTotal: 30, fails: 1, failsAllowed: 6,
    xpReward: 350, meDone: true, friendDone: true, hp: 8,
    myDays: 11, myFails: 1, myStreak: 6, friendDays: 12, friendFails: 0, friendStreak: 12 },
  { id: 'sc2', name: 'Leer 20 min diarios', desc: 'Veinte minutos de lectura, los dos, sin romper la cadena.', friend: 'Sofía', fc: 'var(--kb-primary)',
    difficulty: 2, kind: 'construir-habito', periodicity: 'daily', daysElapsed: 6, daysTotal: 21, fails: 0, failsAllowed: 4,
    xpReward: 260, meDone: false, friendDone: true, hp: 5,
    myDays: 6, myFails: 0, myStreak: 6, friendDays: 5, friendFails: 1, friendStreak: 3 },
];

function SharedRetoCard({ sc, onRegister }) {
  const d = RETO_DIFFICULTY[sc.difficulty] || { label: 'Exigente', color: 'var(--kb-boss)' };
  const k = RETO_KIND_LABELS[sc.kind] || { label: 'Reto', icon: 'sword' };
  const per = typeof retoPeriod === 'function' ? retoPeriod(sc) : { short: 'diario' };
  const pct = sc.daysTotal > 0 ? (sc.daysElapsed / sc.daysTotal) * 100 : 0;
  const bothToday = sc.meDone && sc.friendDone;
  return (
    <div className={`kbv-reto-card active shared ${sc.pending ? 'pending' : ''}`} style={{ '--c': d.color, '--area-c': d.color }}>
      <div className="top">
        <div className="diff" style={{ background: d.color }}>
          <KIcon name={k.icon} size={14} />
          <span>{d.label}</span>
        </div>
        <RetoDifficultyMeter difficulty={sc.difficulty} color={d.color} />
      </div>
      <h4 className="name">{sc.name}</h4>
      <p className="desc">{sc.desc}</p>
      <div className="kind-strip">
        <span className="kind-pip"><KIcon name={k.icon} size={11} /> {k.label}</span>
        <span className="kind-pip period"><KIcon name="repeat" size={10} /> {per.short}</span>
        <span className="kind-pip" style={{ '--c': sc.fc }}><KIcon name="community" size={10} /> con {sc.friend}</span>
      </div>
      {sc.pending ? (
        <div className="sh-pending"><KIcon name="clock" size={12} /> Propuesta enviada — esperando a que {sc.friend} acepte.</div>
      ) : (
        <React.Fragment>
          <div className="progress-row">
            <div className="kbv-progress" style={{ height: 8 }}>
              <div className="fill" style={{ width: `${pct}%`, background: d.color }} />
            </div>
            <span className="pct">{Math.round(pct)}%</span>
          </div>
          <div className="stats">
            <span>Día <strong>{sc.daysElapsed}</strong>/{sc.daysTotal}</span>
            <span>Fallos <strong>{sc.fails}</strong>/{sc.failsAllowed}</span>
            <span className="xp"><KIcon name="trending-up" size={11} /> +{sc.xpReward} XP</span>
          </div>
          <div className="sh-people">
            <span className={`sh-chip ${sc.meDone ? 'done' : ''}`}><KIcon name={sc.meDone ? 'check' : 'clock'} size={11} /> Tú</span>
            <span className={`sh-chip ${sc.friendDone ? 'done' : ''}`} style={{ '--c': sc.fc }}><KIcon name={sc.friendDone ? 'check' : 'clock'} size={11} /> {sc.friend}</span>
          </div>
          <div className="sh-foot">
            <span className={`sh-hp ${bothToday ? 'ok' : 'warn'}`}>
              <KIcon name={bothToday ? 'shield' : 'sword'} size={11} />
              {bothToday ? `+${sc.hp} HP a ambos hoy` : `Si alguno falla, −${sc.hp} HP a ambos`}
            </span>
            <span className="kbv-meta">Al cerrar: materia oscura + emblema dúo</span>
          </div>
          {!sc.meDone && (
            <div className="kbv-reto-register">
              <button type="button" className="kbv-btn kbv-btn-primary reg-main" onClick={() => onRegister && onRegister(sc)}>
                <KIcon name="check" size={15} /> Registrar mi día
              </button>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
}

function RetosScreen({ navDetail }) {
  const [retos, setRetos] = React.useState(RETOS_DEMO);
  const [tab, setTab] = React.useState('todos');
  const [openReto, setOpenReto] = React.useState(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [notice, setNotice] = React.useState(null);
  const [shared, setShared] = React.useState(SHARED_CHALLENGES);
  const [sharedCreateOpen, setSharedCreateOpen] = React.useState(false);

  // Alta de reto compartido — una propuesta por persona invitada.
  function addShared(list) {
    const items = Array.isArray(list) ? list : [list];
    if (!items.length) return;
    setShared(ss => [...ss, ...items]);
    setTab('compartidos');
    const names = items.map(x => x.friend);
    const who = names.length === 1 ? names[0]
      : names.slice(0, -1).join(', ') + ' y ' + names[names.length - 1];
    setNotice({ kind: 'ok', msg: `Invitación enviada a ${who}. El reto arranca cuando ${names.length === 1 ? 'acepte' : 'acepten'}.` });
  }

  // Deep-link desde Amigos / Salud: pestaña compartidos o alta directa
  React.useEffect(() => {
    const d = navDetail || {};
    if (d.tab === 'compartidos' || d.action === 'create-shared') setTab('compartidos');
    if (d.action === 'create-shared') setSharedCreateOpen(true);
    if (d.action === 'create') setCreateOpen(true);
  }, [navDetail]);

  const counts = {
    active:    retos.filter(r => r.status === 'active').length,
    planned:   retos.filter(r => r.status === 'planned').length,
    completed: retos.filter(r => r.status === 'completed').length,
  };

  // ── Quick register handlers ──────────────────────────────
  function registerDay(id) {
    setRetos(rs => rs.map(r => r.id === id ? { ...r, daysElapsed: Math.min(r.daysTotal, r.daysElapsed + 1), todayMark: 'done' } : r));
    setNotice({ kind: 'ok', msg: 'Día registrado. ¡Sigue así!' });
  }
  function registerFail(id) {
    setRetos(rs => rs.map(r => {
      if (r.id !== id) return r;
      const fails = r.fails + 1;
      const daysElapsed = Math.min(r.daysTotal, r.daysElapsed + 1);
      if (fails > r.failsAllowed) {
        // Mecánica de pérdida: superar el tope = reto perdido + zona crítica.
        setTimeout(() => setNotice({ kind: 'lost', msg: `Superaste el límite de fallos en "${r.name}". El reto se pierde: recibes la mitad de las recompensas y tu HP cae a 10 — al borde del trance.` }), 0);
        return { ...r, fails, daysElapsed, todayMark: 'fail', lostDay: 'Hoy', lostDayN: daysElapsed, status: 'completed', success: false, critical: true, completedAt: 'Hoy' };
      }
      return { ...r, fails, daysElapsed, todayMark: 'fail' };
    }));
    setNotice(n => n && n.kind === 'lost' ? n : { kind: 'warn', msg: 'Fallo registrado. Cuidado con el límite.' });
  }
  // Deshacer el registro de hoy (una sola acción por día se puede revertir).
  function undoToday(id) {
    setRetos(rs => rs.map(r => {
      if (r.id !== id || !r.todayMark) return r;
      if (r.todayMark === 'fail') {
        return { ...r, fails: Math.max(0, r.fails - 1), daysElapsed: Math.max(0, r.daysElapsed - 1), todayMark: null, lostDay: undefined, lostDayN: undefined, status: 'active', success: undefined, critical: false, completedAt: undefined };
      }
      return { ...r, daysElapsed: Math.max(0, r.daysElapsed - 1), todayMark: null };
    }));
    setNotice({ kind: 'ok', msg: 'Registro de hoy deshecho.' });
  }

  // ── KPIs (higher-value) ──────────────────────────────────
  const active = retos.filter(r => r.status === 'active');
  const completed = retos.filter(r => r.status === 'completed');
  const successRate = completed.length ? Math.round(completed.filter(r => r.success).length / completed.length * 100) : 0;
  // Constancia: días aprobados / días vividos en los retos activos
  const elapsedSum = active.reduce((a, r) => a + r.daysElapsed, 0);
  const failsSum = active.reduce((a, r) => a + r.fails, 0);
  const consistency = elapsedSum ? Math.round((elapsedSum - failsSum) / elapsedSum * 100) : 100;
  // Dificultad promedio y proporción exigente (≥3)
  const allTracked = retos.filter(r => r.status !== 'planned');
  const avgDiff = active.length ? (active.reduce((a, r) => a + r.difficulty, 0) / active.length) : 0;
  const hardCount = retos.filter(r => r.difficulty >= 4).length;
  const hardPct = retos.length ? Math.round(hardCount / retos.length * 100) : 0;
  // Días limpios: la racha activa más larga sin fallar (aprox por reto)
  const cleanStreak = active.length ? Math.max(...active.map(r => Math.max(0, r.daysElapsed - r.fails * 3))) : 0;
  // Distribución por dificultad (1–5) sobre todos los retos
  const diffDist = [1, 2, 3, 4, 5].map(lvl => retos.filter(r => r.difficulty === lvl).length);
  const diffMax = Math.max(1, ...diffDist);

  const sections = [
    { id: 'active',    label: 'Activos',   dot: 'var(--kb-boss)', list: retos.filter(r => r.status === 'active'),    empty: 'No tienes retos activos. Lanza uno cuando estés listo.' },
    { id: 'planned',   label: 'Planeados', dot: 'var(--kb-gem)',        list: retos.filter(r => r.status === 'planned'),   empty: 'Sin retos planeados. Agenda uno para empezar pronto.' },
    { id: 'completed', label: 'Pasados',   dot: 'var(--kb-primary)',        list: retos.filter(r => r.status === 'completed'), empty: 'Aún no hay retos terminados.' },
  ];
  const visibleSections = tab === 'todos' ? sections : tab === 'compartidos' ? [] : sections.filter(s => s.id === tab);

  return (
    <div className="kbv-main">
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--kb-boss)' }}>{crumb('retos', 'Voluntad')}</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Retos. <InfoDot label="i" text={"Las batallas más grandes — cambios de identidad, malos hábitos a cortar, objetivos a alcanzar. Difíciles, definidos, con recompensas reales."} /></h1>
        </div>
        <div className="actions">
          <button type="button" className="kbv-btn kbv-btn-danger" onClick={() => setCreateOpen(true)}>
            <KIcon name="sword" size={14} /> Nuevo reto
          </button>
        </div>
      </div>

      {notice && (
        <div className={`kbv-reto-notice ${notice.kind}`}>
          <KIcon name={notice.kind === 'ok' ? 'check' : 'alert'} size={15} />
          <span>{notice.msg}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label="Cerrar"><KIcon name="x" size={12} /></button>
        </div>
      )}

      {/* KPIs — constancia, éxito, dificultad, días limpios + distribución */}
      <div className="kbv-char-section-head tight" style={{ marginBottom: 2 }}>
        <h3 className="kbv-h3">Indicadores</h3>
        <span className="kbv-reto-period"><KIcon name="clock" size={11} /> Periodo: año en curso · 2026 <em>· los de retos activos reflejan el estado de hoy</em></span>
      </div>
      <div className="kbv-reto-kpis">
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-boss)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="label">Constancia (activos)</span>
            <span className="kbv-kpi-icon" style={{ '--c': 'var(--kb-boss)' }}><KIcon name="trending-up" size={14} /></span>
          </div>
          <span className="val">{consistency}<small>%</small></span>
          <span className="delta">días aprobados de los vividos</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="label">Tasa de éxito</span>
            <span className="kbv-kpi-icon" style={{ '--c': 'var(--kb-primary)' }}><KIcon name="trophy" size={14} /></span>
          </div>
          <span className="val">{successRate}<small>%</small></span>
          <span className="delta">{completed.length} retos cerrados</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--pri-high)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="label">Dificultad media</span>
            <span className="kbv-kpi-icon" style={{ '--c': 'var(--pri-high)' }}><KIcon name="gauge" size={14} /></span>
          </div>
          <span className="val">{avgDiff.toFixed(1)}<small>/5</small></span>
          <span className="delta">{hardPct}% de alto calibre</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--area-community)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="label">Días limpios</span>
            <span className="kbv-kpi-icon pulse" style={{ '--c': 'var(--area-community)' }}><KIcon name="flame" size={14} /></span>
          </div>
          <span className="val">{cleanStreak}<small> días</small></span>
          <span className="delta">mejor racha activa sin fallar</span>
        </div>
        {/* Mini distribución por dificultad */}
        <div className="kbv-reto-dist">
          <div className="dist-head"><span>Retos por dificultad</span><span className="kbv-meta">{retos.length} en total</span></div>
          <div className="dist-bars">
            {diffDist.map((n, i) => {
              const def = RETO_DIFFICULTY[i + 1];
              return (
                <div key={i} className="dist-col" title={`${def.label}: ${n}`}>
                  <span className="bar" style={{ height: `${10 + (n / diffMax) * 78}%`, background: def.color }}>{n > 0 && <em>{n}</em>}</span>
                  <span className="lbl" style={{ color: def.color }}>{i + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs — con "Todos" */}
      <div className="kbv-store-tabs" style={{ marginBottom: 0 }}>
        <button type="button" className={tab === 'todos' ? 'active' : ''} onClick={() => setTab('todos')}>
          <span className="dot" style={{ background: 'var(--kb-text)' }} /> Todos ({retos.length})
        </button>
        <button type="button" className={tab === 'active' ? 'active' : ''} onClick={() => setTab('active')}>
          <span className="dot" style={{ background: 'var(--kb-boss)' }} /> Activos ({counts.active})
        </button>
        <button type="button" className={tab === 'planned' ? 'active' : ''} onClick={() => setTab('planned')}>
          <span className="dot" style={{ background: 'var(--kb-gem)' }} /> Planeados ({counts.planned})
        </button>
        <button type="button" className={tab === 'completed' ? 'active' : ''} onClick={() => setTab('completed')}>
          <span className="dot" style={{ background: 'var(--kb-primary)' }} /> Pasados ({counts.completed})
        </button>
        <button type="button" className={tab === 'compartidos' ? 'active' : ''} onClick={() => setTab('compartidos')}>
          <span className="dot" style={{ background: 'var(--area-community)' }} /> Compartidos ({shared.length})
        </button>
      </div>

      {/* Stacked sections — activos primero, luego planeados, al final pasados */}
      {visibleSections.map(section => (
        <div key={section.id} className="kbv-reto-section">
          {tab === 'todos' && (section.list.length > 0 || section.id === 'active') && (
            <div className="kbv-reto-section-head">
              <span className="dot" style={{ background: section.dot }} />
              <h3 className="kbv-h4">{section.label}</h3>
              <span className="kbv-meta">{section.list.length}</span>
            </div>
          )}
          <div className="kbv-retos-grid">
            {section.list.length === 0 ? (
              (tab === 'todos' && section.id !== 'active') ? null : (
                <div style={{ gridColumn: '1 / -1' }}>
                  <EmptyState icon={section.id === 'active' ? 'sword' : 'flag'} title={section.emptyTitle || 'Nada por aquí'} body={section.empty} />
                </div>
              )
            ) : section.list.map(r => (
              <RetoCard key={r.id} r={r} onOpen={setOpenReto} onRegister={registerDay} onFail={registerFail} onUndo={undoToday} />
            ))}
            {section.id === 'active' && (
              <button type="button" className="kbv-reto-add-card" onClick={() => setCreateOpen(true)}>
                <span className="glyph"><KIcon name="plus" size={24} /></span>
                <span className="lbl">Lanzar reto nuevo</span>
                <span className="sub">Cortar un mal hábito, construir uno nuevo, lograr una meta.</span>
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Compartidos — pestaña propia; misma tarjeta que los personales */}
      {tab === 'compartidos' && (
        <div className="kbv-reto-section">
          <div className="kbv-reto-section-head">
            <span className="dot" style={{ background: 'var(--area-community)' }} />
            <h3 className="kbv-h4">Retos compartidos</h3>
            <span className="kbv-meta">ambos registran · el HP de los dos en juego · recompensa dúo al cerrar</span>
          </div>
          <div className="kbv-retos-grid">
            {shared.map(sc => (
              <SharedRetoCard key={sc.id} sc={sc} onRegister={(x) => {
                setShared(ss => ss.map(s => s.id === x.id ? { ...s, meDone: true, daysElapsed: Math.min(s.daysTotal, s.daysElapsed + 1) } : s));
                setNotice({ kind: 'ok', msg: `Registraste tu día en «${x.name}». ${x.friendDone ? `Ambos cumplieron: +${x.hp} HP para los dos.` : `Falta ${x.friend} — le avisamos.`}` });
              }} />
            ))}
            <button type="button" className="kbv-reto-add-card" onClick={() => setSharedCreateOpen(true)}>
              <span className="glyph"><KIcon name="community" size={24} /></span>
              <span className="lbl">Nuevo reto compartido</span>
              <span className="sub">Propón un reto a un amigo — empieza cuando acepte.</span>
            </button>
          </div>
        </div>
      )}

      {openReto && <RetoDetailModal reto={openReto} onClose={() => setOpenReto(null)} onUpdate={(r) => setRetos(rs => rs.map(x => x.id === r.id ? r : x))} onAbandon={(id) => { setRetos(rs => rs.filter(x => x.id !== id)); setOpenReto(null); }} />}
      {sharedCreateOpen && <CreateRetoModal initialMode="duo" onClose={() => setSharedCreateOpen(false)} onSaveShared={addShared} />}
      {createOpen && <CreateRetoModal onClose={() => setCreateOpen(false)}
        onSave={(r) => setRetos(rs => [...rs, { ...r, id: 'r' + Math.random().toString(36).slice(2, 6), status: 'planned' }])}
        onSaveShared={addShared} />}
    </div>
  );
}

// =================================================================
// ESTUDIO — Pomodoro + cursos
// =================================================================

const STUDY_COURSES = [
  { id: 'c1', name: 'System Design Interview',  platform: 'Educative',  url: 'educative.io', icon: 'layers', color: '#2D4A3A', progress: 72, totalHrs: 24, doneHrs: 17.3, lastSessionAt: 'Hoy · 14:20', skill: 'System Design', xpEarned: 320, kind: 'online' },
  { id: 'c2', name: 'Curso de SwiftUI desde cero', platform: 'Platzi',  url: 'platzi.com',  icon: 'tv',     color: '#98CA3F', progress: 45, totalHrs: 16, doneHrs: 7.2,  lastSessionAt: 'Ayer',         skill: 'iOS · Swift',    xpEarned: 180, kind: 'online' },
  { id: 'c3', name: 'Machine Learning Specialization', platform: 'Coursera', url: 'coursera.org', icon: 'sparkle', color: '#0056D2', progress: 23, totalHrs: 60, doneHrs: 13.8, lastSessionAt: '2 días',     skill: 'ML',             xpEarned: 220, kind: 'online' },
  { id: 'c4', name: 'Diseño UX para No-Diseñadores', platform: 'Udemy', url: 'udemy.com', icon: 'edit',     color: '#A435F0', progress: 100, totalHrs: 12, doneHrs: 12,   lastSessionAt: 'Hace 1 mes',  skill: 'UX',             xpEarned: 280, kind: 'online', done: true },
  { id: 'c5', name: 'Atomic Habits',             platform: 'Lectura',   url: null,         icon: 'book-open', color: '#1B2A60', progress: 40, totalHrs: 8,  doneHrs: 3.2,  lastSessionAt: 'Hoy',          skill: 'Hábitos',        xpEarned: 80,  kind: 'autoguiado', isBook: true },
  { id: 'c6', name: 'Cálculo II',                platform: 'UNAM',      url: null,         icon: 'graduation', color: 'var(--area-community)', progress: 60, totalHrs: 64, doneHrs: 38,   lastSessionAt: 'Ayer',         skill: 'Matemáticas',    xpEarned: 240, kind: 'formal' },
];

const POMODORO_PRESETS = [
  { id: 'classic', label: 'Clásico',  work: 25, short: 5,  long: 15, cycles: 4 },
  { id: 'long',    label: 'Largo',    work: 50, short: 10, long: 30, cycles: 3 },
  { id: 'sprint',  label: 'Sprint',   work: 90, short: 0,  long: 0,  cycles: 1 },
  { id: 'micro',   label: 'Micro',    work: 15, short: 3,  long: 10, cycles: 6 },
];

function CreateCourseModal({ onClose, onSave }) {
  const [name, setName] = React.useState('');
  const [kind, setKind] = React.useState('online');
  const [platform, setPlatform] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [professor, setProfessor] = React.useState('');
  const [start, setStart] = React.useState('');
  const [end, setEnd] = React.useState('');
  const KINDS = [
    { id: 'online', label: 'Curso online', desc: 'Platzi, Coursera, Udemy…', icon: 'tv' },
    { id: 'formal', label: 'Materia formal', desc: 'Clase con profesor y calificación', icon: 'layers' },
    { id: 'project', label: 'Proyecto personal', desc: 'Estudio autodirigido', icon: 'sparkle' },
  ];
  const isFormal = kind === 'formal';
  return (
    <KBVModal
      title="Agregar curso o estudio"
      sub="Cursos en línea, materias formales o proyectos personales — todo tu aprendizaje en un lugar."
      onClose={onClose}
      size="lg"
      footer={
        <div className="right" style={{ marginLeft: 'auto' }}>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" disabled={!name.trim()} onClick={() => { onSave && onSave({ name: name.trim(), kind, platform, subject, professor, start, end }); onClose(); }}>
            Agregar <KIcon name="check" size={14} />
          </button>
        </div>
      }>
      <div className="kbv-form-row">
        <label>Tipo</label>
        <div className="kbv-cat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {KINDS.map(k => (
            <button key={k.id} type="button" className={`kbv-cat-tile big ${kind === k.id ? 'on' : ''}`} style={{ '--c': 'var(--area-wisdom)' }} onClick={() => setKind(k.id)}>
              <span className="glyph big"><KIcon name={k.icon} size={20} /></span>
              <div><span className="lbl">{k.label}</span><span className="sub">{k.desc}</span></div>
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
        <div className="kbv-form-row">
          <label>Nombre</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: System Design, Cálculo II…" autoFocus />
        </div>
        <div className="kbv-form-row">
          <label>{kind === 'online' ? 'Plataforma / URL' : kind === 'formal' ? 'Institución' : 'Fuente'}</label>
          <input type="text" value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder={kind === 'online' ? 'platzi.com / Coursera…' : kind === 'formal' ? 'Universidad / escuela' : 'Libros, docs, YouTube…'} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="kbv-form-row">
          <label>Materia / área de conocimiento</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="iOS, ML, Finanzas…" />
        </div>
        <div className="kbv-form-row">
          <label>{isFormal ? 'Profesor(es)' : 'Profesor / mentor (opcional)'}</label>
          <input type="text" value={professor} onChange={(e) => setProfessor(e.target.value)} placeholder={isFormal ? 'Para calificar y dar seguimiento' : 'Opcional'} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="kbv-form-row">
          <label>Inicio</label>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div className="kbv-form-row">
          <label>Fecha importante / entrega</label>
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
      </div>
      {isFormal && (
        <div style={{ padding: 10, background: 'var(--kb-primary-soft)', border: '1px solid var(--kb-primary-border)', borderRadius: 10, fontSize: 12, color: 'var(--kb-text-2)' }}>
          En materias formales podrás agregar <strong>clases, profesores a calificar y tareas escolares</strong> con seguimiento dentro del curso.
        </div>
      )}
    </KBVModal>
  );
}

function EstudioScreen() {
  const [courses, setCourses] = React.useState(STUDY_COURSES);
  const [preset, setPreset] = React.useState('classic');
  const [running, setRunning] = React.useState(false);
  const [phase, setPhase] = React.useState('work'); // work | short | long
  const [secs, setSecs] = React.useState(25 * 60);
  const [cycle, setCycle] = React.useState(1);
  const [activeCourseId, setActiveCourseId] = React.useState(courses[0].id);
  const [courseOpen, setCourseOpen] = React.useState(false);

  const presetDef = POMODORO_PRESETS.find(p => p.id === preset);

  React.useEffect(() => {
    if (!running) return;
    if (secs <= 0) { setRunning(false); return; }
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running, secs]);

  React.useEffect(() => {
    // Reset on preset change
    setSecs(presetDef.work * 60);
    setPhase('work');
    setCycle(1);
    setRunning(false);
  }, [preset]);

  const phaseDuration = phase === 'work' ? presetDef.work * 60
                      : phase === 'short' ? presetDef.short * 60
                      : presetDef.long * 60;
  const phasePct = phaseDuration > 0 ? ((phaseDuration - secs) / phaseDuration) * 100 : 100;
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');

  function skipPhase() {
    if (phase === 'work') {
      if (cycle >= presetDef.cycles) { setPhase('long'); setSecs(presetDef.long * 60); }
      else { setPhase('short'); setSecs(presetDef.short * 60); }
    } else {
      setPhase('work');
      setSecs(presetDef.work * 60);
      setCycle(c => c + 1);
    }
  }

  function reset() {
    setRunning(false); setPhase('work'); setSecs(presetDef.work * 60); setCycle(1);
  }

  // KPIs
  const totalStudyHrs = courses.reduce((a, c) => a + c.doneHrs, 0);
  const inProgress = courses.filter(c => !c.done).length;
  const completed = courses.filter(c => c.done).length;
  const totalXP = courses.reduce((a, c) => a + c.xpEarned, 0);
  const todayPomodoros = 4;
  const todayMins = 100;

  const activeCourse = courses.find(c => c.id === activeCourseId);

  return (
    <div className="kbv-main">
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--area-wisdom)' }}>{crumb('estudio', 'Aprendizaje')}</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Estudio. <InfoDot label="i" text={"Pomodoro para foco, catálogo de cursos sincronizado con Platzi, Coursera, Udemy y más. Cada sesión suma XP a Sabiduría."} /></h1>
        </div>
        <div className="actions">
          <button type="button" className="kbv-btn kbv-btn-secondary"><KIcon name="layers" size={14} /> Sync plataformas</button>
          <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => setCourseOpen(true)}><KIcon name="plus" size={14} /> Agregar curso</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kbv-kpi-grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        <div className="kbv-kpi" style={{ '--c': 'var(--area-wisdom)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="label">Pomodoros hoy</span>
            <span className="kbv-kpi-icon pulse" style={{ '--c': 'var(--area-wisdom)' }}><KIcon name="clock" size={14} /></span>
          </div>
          <span className="val">{todayPomodoros}</span>
          <span className="delta up">{todayMins} min en foco</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-gem)' }}>
          <span className="label">Horas totales</span>
          <span className="val">{totalStudyHrs.toFixed(1)}<small> h</small></span>
          <span className="delta">en {courses.length} cursos</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-coin)' }}>
          <span className="label">En curso</span>
          <span className="val">{inProgress}</span>
          <span className="delta">activos esta sem</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-primary)' }}>
          <span className="label">Terminados</span>
          <span className="val">{completed}</span>
          <span className="delta">+1 este trim</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--area-community)' }}>
          <span className="label">XP en Sabiduría</span>
          <span className="val">+{totalXP}</span>
          <span className="delta">Acumulado</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-hp)' }}>
          <span className="label">Racha estudio</span>
          <span className="val">9<small> días</small></span>
          <span className="delta">📈 récord 14</span>
        </div>
      </div>

      {/* Pomodoro hero */}
      <div className="kbv-pomodoro">
        <div className="ring-wrap" style={{ '--phase-c': phase === 'work' ? 'var(--area-wisdom)' : phase === 'short' ? 'var(--kb-gem)' : 'var(--kb-primary)' }}>
          <svg viewBox="0 0 200 200" width="200" height="200">
            <circle cx="100" cy="100" r="86" fill="none" stroke="var(--kb-surface-2)" strokeWidth="12" />
            <circle cx="100" cy="100" r="86" fill="none"
                    stroke="var(--phase-c)" strokeWidth="12" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 86 * (phasePct / 100)} ${2 * Math.PI * 86}`}
                    transform="rotate(-90 100 100)" />
          </svg>
          <div className="time-stack">
            <span className="phase">{phase === 'work' ? 'FOCO' : phase === 'short' ? 'DESCANSO' : 'PAUSA LARGA'}</span>
            <span className="time">{mm}:{ss}</span>
            <span className="cycle">Ciclo {cycle}/{presetDef.cycles}</span>
          </div>
        </div>

        <div className="pomo-side">
          <div>
            <span className="kbv-eyebrow">Pomodoro · ligado a (opcional)</span>
            <h3 className="kbv-h3" style={{ marginTop: 4 }}>{activeCourse?.name || 'Foco libre · sin vincular'}</h3>
            {activeCourse && <span className="kbv-meta">{activeCourse.platform} · {activeCourse.skill}</span>}
          </div>

          <div className="kbv-form-row" style={{ margin: 0 }}>
            <label>Vincular a (opcional)</label>
            <select value={activeCourseId} onChange={(e) => setActiveCourseId(e.target.value)}>
              <option value="">Sin vincular · foco libre</option>
              <optgroup label="Cursos">
                {courses.filter(c => !c.done).map(c => <option key={c.id} value={c.id}>{c.name} — {c.platform}</option>)}
              </optgroup>
              <optgroup label="Tareas">
                <option value="t-aurora">Cerrar propuesta Aurora</option>
                <option value="t-leer">Leer cap. 3 · Atomic Habits</option>
              </optgroup>
            </select>
          </div>

          <div>
            <span className="kbv-meta" style={{ display: 'block', marginBottom: 6 }}>PRESET POMODORO</span>
            <div className="preset-grid">
              {POMODORO_PRESETS.map(p => (
                <button key={p.id} type="button"
                        className={`preset-card ${preset === p.id ? 'on' : ''}`}
                        onClick={() => setPreset(p.id)}>
                  <span className="lbl">{p.label}</span>
                  <span className="vals">{p.work}m · {p.short}/{p.long}m</span>
                </button>
              ))}
            </div>
          </div>

          <div className="controls">
            <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => setRunning(r => !r)}>
              <KIcon name={running ? 'square' : 'play'} size={14} /> {running ? 'Pausar' : 'Iniciar'}
            </button>
            <button type="button" className="kbv-btn kbv-btn-secondary" onClick={skipPhase}>
              <KIcon name="arrow-right" size={14} /> Saltar fase
            </button>
            <button type="button" className="kbv-btn kbv-btn-ghost" onClick={reset}>Reset</button>
          </div>

          <div className="notif-strip">
            <KIcon name="alert" size={12} />
            <span>Notificaciones del navegador habilitadas · sonido al cambiar fase</span>
          </div>
        </div>
      </div>

      {/* Course catalog */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <h3 className="kbv-h3">Catálogo de cursos</h3>
          <span className="kbv-meta">Sincronizado con Platzi · Coursera · Udemy · Educative</span>
        </div>
        <div className="kbv-courses-grid">
          {courses.map(c => (
            <div key={c.id} className={`kbv-course-card ${c.done ? 'done' : ''}`}
                 style={{ '--c': c.color }}
                 onClick={() => setActiveCourseId(c.id)}>
              <div className="top">
                <span className="ico"><KIcon name={c.icon} size={18} /></span>
                <div className="info">
                  <div className="name">{c.name}</div>
                  <div className="meta">
                    <span className="platform">{c.platform}</span>
                    {c.syncing && <span className="sync-pip"><KIcon name="check" size={9} /> Sync</span>}
                    {c.isBook && <span className="book-pip"><KIcon name="book-open" size={9} /> Desde Lectura</span>}
                  </div>
                </div>
                {c.done && <span className="done-badge"><KIcon name="check" size={12} /></span>}
              </div>
              <div className="progress-row">
                <div className="kbv-progress" style={{ height: 6 }}>
                  <div className="fill" style={{ width: `${c.progress}%`, background: c.color }} />
                </div>
                <span className="pct">{c.progress}%</span>
              </div>
              <div className="footer">
                <span><KIcon name="clock" size={10} /> {c.doneHrs}h / {c.totalHrs}h</span>
                <span style={{ color: 'var(--area-wisdom)', fontWeight: 700 }}>+{c.xpEarned} XP</span>
              </div>
              <div className="last-session">Última: {c.lastSessionAt}</div>
            </div>
          ))}
          <button type="button" className="kbv-course-add" onClick={() => setCourseOpen(true)}>
            <span className="glyph"><KIcon name="plus" size={20} /></span>
            <span className="lbl">Agregar curso o estudio</span>
            <span className="sub">Curso online, materia formal o proyecto personal</span>
          </button>
        </div>
      </div>
      {courseOpen && <CreateCourseModal onClose={() => setCourseOpen(false)} onSave={(c) => setCourses(cs => [...cs, { id: 'c' + Math.random().toString(36).slice(2, 6), name: c.name, platform: c.platform || (c.kind === 'formal' ? 'Materia' : 'Proyecto'), icon: 'layers', color: 'var(--kb-gem)', progress: 0, totalHrs: 0, doneHrs: 0, lastSessionAt: 'Nuevo', skill: c.subject || '', xpEarned: 0, syncing: false }])} />}
    </div>
  );
}

// =================================================================
// ENTRETENIMIENTO — Pelis y series con rating/comentarios/reflexiones
// =================================================================

const SHOWS_DEMO = [
  { id: 's1', kind: 'series', title: 'Severance', meta: 'Apple TV+ · 2 temporadas · 19 ep', cover: 'linear-gradient(135deg, #1A1A2E 0%, #0A0A1E 100%)', status: 'watching', rating: 5, currentSeason: 2, currentEpisode: 7, totalEpisodes: 19, lastWatched: 'Hoy', platforms: ['Apple TV+'], hours: 17 },
  { id: 's2', kind: 'movie',  title: 'Dune: Parte Dos', meta: 'Sci-fi · 166 min', cover: 'linear-gradient(135deg, #C2A65A 0%, #6E5424 100%)', status: 'watched', rating: 5, lastWatched: '2026-04-20', platforms: ['Max', 'Prime'], hours: 2.8 },
  { id: 's3', kind: 'series', title: 'The Bear', meta: 'FX · 3 temporadas · 28 ep', cover: 'linear-gradient(135deg, #6E2E2E 0%, #401414 100%)', status: 'watching', rating: 5, currentSeason: 3, currentEpisode: 4, totalEpisodes: 28, lastWatched: 'Ayer', platforms: ['Disney+'], hours: 14 },
  { id: 's4', kind: 'movie',  title: 'Past Lives', meta: 'Drama · 105 min', cover: 'linear-gradient(135deg, #2D4A3A 0%, #15301F 100%)', status: 'watched', rating: 4, lastWatched: '2026-03-10', platforms: ['Mubi'], hours: 1.75 },
  { id: 's5', kind: 'series', title: 'Andor', meta: 'Star Wars · 1 temporada · 12 ep', cover: 'linear-gradient(135deg, #2A3F8F 0%, #1B2A60 100%)', status: 'paused', rating: 0, currentSeason: 1, currentEpisode: 5, totalEpisodes: 12, lastWatched: '2026-04-01', platforms: ['Disney+'], hours: 5 },
  { id: 's6', kind: 'movie',  title: 'Anora', meta: 'Drama · 139 min', cover: 'linear-gradient(135deg, #A855F7 0%, #5A3FB0 100%)', status: 'wishlist', rating: 0, lastWatched: null, platforms: ['Cines'], hours: 0 },
];

const PLATFORM_PRICES = {
  'Apple TV+':  { mxn: '$179/mes',  color: '#000000' },
  'Disney+':    { mxn: '$199/mes',  color: '#0E54A6' },
  'Max':        { mxn: '$149/mes',  color: '#7B2CBF' },
  'Prime':      { mxn: '$99/mes',   color: '#00A8E1' },
  'Mubi':       { mxn: '$199/mes',  color: '#FF0000' },
  'Netflix':    { mxn: '$219/mes',  color: '#E50914' },
  'Cines':      { mxn: '~$80/boleto', color: 'var(--pri-high)' },
};

function EntretenimientoScreen() {
  const [items, setItems] = React.useState(SHOWS_DEMO);
  const [filter, setFilter] = React.useState('all');
  const [kind, setKind] = React.useState('all');
  const [selected, setSelected] = React.useState(null);
  const [period, setPeriod] = React.useState('year');
  const cinemaCount = items.filter(i => (i.platforms || []).includes('Cines')).length;

  const filtered = items.filter(i => {
    if (filter !== 'all' && i.status !== filter) return false;
    if (kind !== 'all' && i.kind !== kind) return false;
    return true;
  });

  const counts = {
    all: items.length,
    watching: items.filter(i => i.status === 'watching').length,
    watched: items.filter(i => i.status === 'watched').length,
    paused: items.filter(i => i.status === 'paused').length,
    wishlist: items.filter(i => i.status === 'wishlist').length,
    series: items.filter(i => i.kind === 'series').length,
    movies: items.filter(i => i.kind === 'movie').length,
  };
  const totalHours = items.reduce((a, i) => a + i.hours, 0);
  const avgRating = (items.filter(i => i.rating > 0).reduce((a, i) => a + i.rating, 0) / Math.max(1, items.filter(i => i.rating > 0).length)).toFixed(1);
  const episodesWatched = items.filter(i => i.kind === 'series').reduce((a, i) => a + ((i.currentSeason - 1) * 10 + (i.currentEpisode || 0)), 0);

  if (selected) {
    const show = items.find(s => s.id === selected);
    if (show) return <ShowDetail show={show} onBack={() => setSelected(null)} onUpdate={(s) => setItems(its => its.map(x => x.id === s.id ? s : x))} />;
  }

  return (
    <div className="kbv-main">
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--area-community)' }}>{crumb('watch', 'Entretenimiento')}</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Entretenimiento. <InfoDot label="i" text={"Pelis y series — todo en un mismo registro. Rating, comentarios y reflexiones, sin depender de apps externas."} /></h1>
        </div>
        <div className="actions" style={{ gap: 8 }}>
          <button type="button" className="kbv-btn kbv-btn-secondary"><KIcon name="plus" size={14} /> Agregar a lista</button>
          <button type="button" className="kbv-btn kbv-btn-primary"><KIcon name="check" size={14} /> Registrar vista</button>
        </div>
      </div>

      {/* Periodo de KPIs */}
      <div className="kbv-fin-period">
        <span className="kbv-meta"><KIcon name="calendar" size={13} /> Indicadores por periodo</span>
        <div className="range-tabs">
          <button className={period === 'year' ? 'on' : ''} onClick={() => setPeriod('year')}>Este año</button>
          <button className={period === 'custom' ? 'on' : ''} onClick={() => setPeriod('custom')}>Personalizado</button>
          <button className={period === 'all' ? 'on' : ''} onClick={() => setPeriod('all')}>Todo el tiempo</button>
        </div>
        <span className="kbv-meta period-note">{period === 'year' ? 'Año activo · 2026' : period === 'all' ? 'Histórico completo' : 'Rango personalizado'}</span>
      </div>

      {/* KPIs */}
      <div className="kbv-kpi-grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        <div className="kbv-kpi" style={{ '--c': 'var(--area-community)' }}>
          <span className="label">En curso</span>
          <span className="val">{counts.watching}</span>
          <span className="delta">{counts.series} series · {counts.movies} pelis total</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-primary)' }}>
          <span className="label">Terminados</span>
          <span className="val">{counts.watched}</span>
          <span className="delta">vistos completos</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-gem)' }}>
          <span className="label">Episodios vistos</span>
          <span className="val">{episodesWatched}</span>
          <span className="delta">acumulados</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-coin)' }}>
          <span className="label">Rating promedio</span>
          <span className="val">{avgRating}<small>/5</small></span>
          <span className="delta">de tus calificados</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-good-soft)' }}>
          <span className="label">Horas totales</span>
          <span className="val">{totalHours.toFixed(0)}<small>h</small></span>
          <span className="delta">en pantalla</span>
        </div>
        <div className="kbv-kpi" style={{ '--c': 'var(--kb-hp)' }}>
          <span className="label">Veces al cine</span>
          <span className="val">{cinemaCount}</span>
          <span className="delta">{period === 'all' ? 'en total' : period === 'year' ? 'este año' : 'en el periodo'}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="kbv-filter-bar v2">
        <div className="filter-block">
          <span className="label">Estado</span>
          <div className="group">
            <button className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>Todos ({counts.all})</button>
            <button className={filter === 'watching' ? 'on' : ''} onClick={() => setFilter('watching')}>Viendo ({counts.watching})</button>
            <button className={filter === 'watched' ? 'on' : ''} onClick={() => setFilter('watched')}>Vistos ({counts.watched})</button>
            <button className={filter === 'paused' ? 'on' : ''} onClick={() => setFilter('paused')}>En pausa ({counts.paused})</button>
            <button className={filter === 'wishlist' ? 'on' : ''} onClick={() => setFilter('wishlist')}>Wishlist ({counts.wishlist})</button>
          </div>
        </div>
        <div className="filter-block">
          <span className="label">Tipo</span>
          <div className="group">
            <button className={kind === 'all' ? 'on' : ''} onClick={() => setKind('all')}>Todo</button>
            <button className={kind === 'series' ? 'on' : ''} onClick={() => setKind('series')}><KIcon name="tv" size={11} /> Series</button>
            <button className={kind === 'movie' ? 'on' : ''} onClick={() => setKind('movie')}><KIcon name="film" size={11} /> Pelis</button>
          </div>
        </div>
      </div>

      <div className="kbv-shows-grid">
        {filtered.map(s => (
          <div key={s.id} className="kbv-show-card" onClick={() => setSelected(s.id)}>
            <div className="cover" style={{ background: s.cover }}>
              <div className="kind-pip">{s.kind === 'series' ? <KIcon name="tv" size={11} /> : <KIcon name="film" size={11} />} {s.kind === 'series' ? 'Serie' : 'Peli'}</div>
              <div className="title">{s.title.toUpperCase()}</div>
            </div>
            <div className="body">
              <span className="ttl">{s.title}</span>
              <span className="meta">{s.meta}</span>
              <div className="status-row">
                <span className={`status ${s.status}`}>
                  {s.status === 'watching' ? 'Viendo' : s.status === 'watched' ? 'Visto' : s.status === 'paused' ? 'En pausa' : 'Wishlist'}
                </span>
                {s.rating > 0 && (
                  <div className="stars">
                    {[1,2,3,4,5].map(n => <span key={n} className={n <= s.rating ? '' : 'off'}>★</span>)}
                  </div>
                )}
              </div>
              {s.kind === 'series' && s.currentEpisode && (
                <div className="ep-progress">
                  <span>T{s.currentSeason} · E{s.currentEpisode}</span>
                  <div className="kbv-progress" style={{ height: 4, flex: 1 }}>
                    <div className="fill" style={{ width: `${((s.currentSeason - 1) * 10 + s.currentEpisode) / s.totalEpisodes * 100}%`, background: 'var(--area-community)' }} />
                  </div>
                </div>
              )}
              <div className="platforms">
                {s.platforms.map(p => {
                  const def = PLATFORM_PRICES[p] || { mxn: '?', color: 'var(--pri-vlow)' };
                  return <span key={p} className="platform" style={{ '--p-c': def.color }}>{p}</span>;
                })}
              </div>
              <div className="kbv-show-quick" onClick={(e) => e.stopPropagation()}>
                {s.kind === 'series'
                  ? <button type="button" title="Registrar capítulo visto"><KIcon name="check" size={12} /> Capítulo</button>
                  : <button type="button" title="Marcar como vista"><KIcon name="check" size={12} /> Vista</button>}
                <button type="button" title="Calificar"><KIcon name="sparkle" size={12} /> Calificar</button>
                <button type="button" title="Comentar / reflexión"><KIcon name="edit" size={12} /> Comentar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShowDetail({ show, onBack, onUpdate }) {
  const [commentOpen, setCommentOpen] = React.useState(false);
  const [newComment, setNewComment] = React.useState('');
  const [newRating, setNewRating] = React.useState(show.rating || 0);
  const [comments, setComments] = React.useState([
    { id: 'cm1', when: show.kind === 'series' ? 'T1 · E5' : 'Después de verla', kind: 'reflexion', body: 'La forma en que muestra el aislamiento corporativo me hizo pensar en cómo separo "trabajo" y "vida" yo mismo.', ts: '2026-04-22' },
    { id: 'cm2', when: show.kind === 'series' ? 'T2 · E1' : 'Reseña', kind: 'opinion', body: 'Visualmente impecable. El sonido es protagonista. 5 estrellas sin duda.', ts: '2026-05-15' },
  ]);

  const seasonsData = show.kind === 'series' ? [
    { num: 1, episodes: 9, watched: show.currentSeason > 1 ? 9 : (show.currentSeason === 1 ? show.currentEpisode : 0) },
    { num: 2, episodes: 10, watched: show.currentSeason > 2 ? 10 : (show.currentSeason === 2 ? show.currentEpisode : 0) },
  ] : null;

  return (
    <div className="kbv-main">
      <div className="kbv-page-head">
        <div>
          <button type="button" className="kbv-btn kbv-btn-secondary kbv-back-btn" onClick={onBack}>
            <KIcon name="arrow-left" size={12} /> Volver a Entretenimiento
          </button>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="kbv-eyebrow" style={{ color: 'var(--area-community)' }}>{show.kind === 'series' ? 'Serie' : 'Película'}</span>
            <span className="status-pip">{show.status === 'watching' ? 'Viendo' : show.status === 'watched' ? 'Visto' : show.status === 'paused' ? 'En pausa' : 'Wishlist'}</span>
          </div>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>{show.title}</h1>
          <p className="kbv-body" style={{ marginTop: 4 }}>{show.meta}</p>
        </div>
        <div className="actions" style={{ gap: 8 }}>
          {show.kind === 'series' && show.status === 'watching' && (
            <button type="button" className="kbv-btn kbv-btn-primary"><KIcon name="check" size={14} /> Marcar siguiente ep</button>
          )}
          {show.kind === 'movie' && show.status !== 'watched' && (
            <button type="button" className="kbv-btn kbv-btn-primary"><KIcon name="check" size={14} /> Marcar como vista</button>
          )}
          <button type="button" className="kbv-btn kbv-btn-secondary"><KIcon name="edit" size={14} /> Editar</button>
        </div>
      </div>

      {/* Compact hero */}
      <div className="kbv-book-hero compact" style={{ gridTemplateColumns: '100px 1fr' }}>
        <div className="cover" style={{ background: show.cover, width: 100, height: 150 }}>
          {show.title.toUpperCase()}
        </div>
        <div className="info">
          {show.kind === 'series' && show.currentEpisode && (
            <div className="block">
              <span className="kbv-meta">PROGRESO</span>
              <div style={{ fontFamily: 'var(--kb-f-display)', fontSize: 22, fontWeight: 800, color: 'var(--kb-text)' }}>
                T{show.currentSeason} · E{show.currentEpisode}<small style={{ fontSize: 12, color: 'var(--kb-text-2)', fontWeight: 600 }}> / {show.totalEpisodes}</small>
              </div>
            </div>
          )}
          <div className="block">
            <span className="kbv-meta">RATING</span>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button"
                        onClick={() => { setNewRating(n); onUpdate({ ...show, rating: n }); }}
                        style={{ border: 0, background: 'transparent', cursor: 'pointer',
                                 color: n <= (newRating || show.rating) ? 'var(--kb-coin)' : 'var(--kb-border-strong)',
                                 fontSize: 22, padding: 0 }}>★</button>
              ))}
            </div>
          </div>
          <div className="block">
            <span className="kbv-meta">HORAS</span>
            <div style={{ fontFamily: 'var(--kb-f-display)', fontSize: 22, fontWeight: 800, color: 'var(--kb-text)' }}>
              {show.hours}<small style={{ fontSize: 12, color: 'var(--kb-text-2)', fontWeight: 600 }}> h</small>
            </div>
          </div>
          <div className="block">
            <span className="kbv-meta">DISPONIBLE EN</span>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
              {show.platforms.map(p => {
                const def = PLATFORM_PRICES[p] || { mxn: '?', color: 'var(--pri-vlow)' };
                return (
                  <span key={p} className="platform-chip" style={{ '--p-c': def.color }} title={`${p} · ${def.mxn}`}>
                    {p} · <strong>{def.mxn}</strong>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Seasons & episodes (series) */}
      {show.kind === 'series' && seasonsData && (
        <div className="kbv-fin-card">
          <div className="head">
            <h3 className="kbv-h3">Temporadas y episodios</h3>
            <span className="kbv-meta">Click en un episodio para marcarlo como visto y agregar reflexión</span>
          </div>
          <div className="kbv-seasons">
            {seasonsData.map(s => (
              <div key={s.num} className="season">
                <div className="season-head">
                  <h4>Temporada {s.num}</h4>
                  <span className="kbv-meta">{s.watched}/{s.episodes} ep · {Math.round(s.watched / s.episodes * 100)}%</span>
                </div>
                <div className="episodes">
                  {Array.from({ length: s.episodes }, (_, i) => (
                    <button key={i} type="button" className={`episode ${i < s.watched ? 'watched' : ''}`}
                            title={`T${s.num}·E${i + 1}`}>
                      E{i + 1}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments & reflections */}
      <div className="kbv-fin-card">
        <div className="head">
          <h3 className="kbv-h3">Comentarios y reflexiones</h3>
          <button type="button" className="kbv-btn kbv-btn-primary" style={{ padding: '6px 12px', fontSize: 12 }}
                  onClick={() => setCommentOpen(true)}>
            <KIcon name="plus" size={12} /> Nueva reflexión
          </button>
        </div>
        {commentOpen && (
          <div style={{ marginBottom: 12, padding: 12, background: 'var(--kb-surface)', borderRadius: 10 }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={`Una reflexión sobre ${show.kind === 'series' ? 'esta temporada/episodio' : 'la película'} — qué te marcó, ideas que dejó, conexiones con tu vida...`}
              style={{ minHeight: 100 }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 8 }}>
              <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => { setCommentOpen(false); setNewComment(''); }}>Cancelar</button>
              <button type="button" className="kbv-btn kbv-btn-primary"
                      onClick={() => {
                        if (!newComment.trim()) return;
                        setComments(cs => [{ id: 'cm' + Date.now(), when: show.kind === 'series' ? `T${show.currentSeason} · E${show.currentEpisode}` : 'Reflexión', kind: 'reflexion', body: newComment.trim(), ts: new Date().toISOString().slice(0, 10) }, ...cs]);
                        setNewComment(''); setCommentOpen(false);
                      }}>
                Guardar reflexión
              </button>
            </div>
          </div>
        )}
        {comments.length === 0 ? (
          <EmptyState icon="edit" title="Sin reflexiones" body="Cuando algo te marque, déjalo escrito." />
        ) : (
          <div className="kbv-note-list">
            {comments.map(c => (
              <div key={c.id} className={`kbv-note ${c.kind}`}>
                <span className="tag">{c.kind === 'reflexion' ? 'Reflexión' : 'Opinión'}</span>
                <div className="body">{c.body}</div>
                <span className="when">{c.when} · {c.ts}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// =================================================================
// Create / Detail modals — Hábito y Reto
// =================================================================

function CreateRetoModal({ onClose, onSave, onSaveShared, initialMode }) {
  const friends = typeof DEMO_FRIENDS !== 'undefined' ? DEMO_FRIENDS : [];
  const [mode, setMode] = React.useState(initialMode === 'duo' ? 'duo' : 'solo');
  const [friendIds, setFriendIds] = React.useState([]);
  const [hp, setHp] = React.useState(5);
  const chosen = friends.filter(x => friendIds.includes(x.id));
  const duo = mode === 'duo';
  const toggleFriend = (id) => setFriendIds(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const [name, setName] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [kind, setKind] = React.useState('cortar-malhabito');
  const [toHabit, setToHabit] = React.useState(true);
  const [difficulty, setDifficulty] = React.useState(3);
  const [days, setDays] = React.useState(30);
  const [periodicity, setPeriodicity] = React.useState('daily');
  const [failsAllowed, setFailsAllowed] = React.useState(2);
  const [startsAt, setStartsAt] = React.useState(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));

  const d = RETO_DIFFICULTY[difficulty];
  const per = RETO_PERIODICITY[periodicity];
  const failCap = maxFails(days);
  const damage = retoDamage(difficulty);
  // La periodicidad escala las recompensas (no la dificultad ni el daño).
  const xpReward = Math.round(days * difficulty * 8 * per.factor);
  const gemReward = Math.round(days * difficulty * 1.5 * per.factor);
  const coinReward = Math.round(days * difficulty * 4 * per.factor);

  // Los fallos tolerados nunca pueden superar el 20% de los días.
  React.useEffect(() => { setFailsAllowed(f => Math.min(f, failCap)); }, [failCap]);

  return (
    <KBVModal
      title={duo ? 'Nuevo reto compartido' : 'Nuevo reto'}
      sub={duo
        ? 'Invitas a una o varias personas. El reto no arranca hasta que acepten; luego todos registran cada día y cada quien juega su propio HP.'
        : 'Define un cambio concreto, mide los días y acepta el riesgo. Más dificultad = más daño al fallar y más recompensa al lograr.'}
      onClose={onClose}
      size="lg"
      footer={
        <div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-danger" disabled={!name.trim() || (duo && chosen.length === 0)}
                  onClick={() => {
                    if (duo) {
                      onSaveShared && onSaveShared(chosen.map(fr => ({
                        id: 'sc' + Math.random().toString(36).slice(2, 6), name: name.trim(), desc, friend: fr.name, fc: fr.color,
                        difficulty, kind, periodicity, daysElapsed: 0, daysTotal: days, fails: 0, failsAllowed: Math.min(failsAllowed, failCap),
                        xpReward, meDone: false, friendDone: false, hp, pending: true })));
                    } else {
                      onSave && onSave({ name: name.trim(), desc, kind, difficulty, periodicity, daysTotal: days, daysElapsed: 0, fails: 0, failsAllowed: Math.min(failsAllowed, failCap), damage, xpReward, gemReward, coinReward, startsAt, toHabit: kind === 'construir-habito' ? toHabit : false });
                    }
                    onClose();
                  }}>
            <KIcon name={duo ? 'community' : 'sword'} size={14} /> {duo ? 'Proponer reto' : 'Lanzar reto'}
          </button>
        </div>
      }>
      <div className="kbv-form-row">
        <label>¿Lo haces solo o con alguien?</label>
        <div className="kbv-pick-row">
          <button type="button" className={`kbv-pick ${!duo ? 'on' : ''}`} onClick={() => setMode('solo')}>
            <KIcon name="user" size={13} /> Solo
          </button>
          <button type="button" className={`kbv-pick ${duo ? 'on' : ''}`} onClick={() => setMode('duo')}>
            <KIcon name="community" size={13} /> Con un amigo
          </button>
        </div>
        <span className="kbv-meta">{duo ? 'Todos registran cada día y cada quien juega su propio HP.' : 'Solo tu HP está en juego.'}</span>
      </div>
      {duo && (
        <div className="kbv-form-row">
          <label>A quién invitas <span className="kbv-meta">· puedes elegir varios</span></label>
          <div className="kbv-pick-row">
            {friends.map(fr => {
              const on = friendIds.includes(fr.id);
              return (
                <button key={fr.id} type="button" className={`kbv-pick ${on ? 'on' : ''}`} style={{ '--c': fr.color }}
                        aria-pressed={on} onClick={() => toggleFriend(fr.id)}>
                  <span className="pk-av">{on ? <KIcon name="check" size={11} /> : fr.name[0]}</span> {fr.name}
                </button>
              );
            })}
          </div>
          <span className="hint">
            {chosen.length === 0
              ? 'Elige al menos a una persona.'
              : `Se enviará la invitación a ${chosen.map(f => f.name).join(', ')}. El reto arranca cuando acepten — si alguien no acepta, arranca con quienes sí.`}
          </span>
        </div>
      )}
      <div className="kbv-form-row">
        <label>Tipo de reto</label>
        <div className="kbv-cat-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {Object.entries(RETO_KIND_LABELS).map(([k, def]) => (
            <button key={k} type="button"
                    className={`kbv-cat-tile big ${kind === k ? 'on' : ''}`}
                    style={{ '--c': 'var(--kb-boss)' }}
                    onClick={() => setKind(k)}>
              <span className="glyph big"><KIcon name={def.icon} size={20} /></span>
              <div>
                <span className="lbl">{def.label}</span>
                <span className="sub">{def.desc}</span>
              </div>
            </button>
          ))}
        </div>
        <span className="kbv-meta">Un reto golpea el HP de tu personaje en general — no afecta un área específica.</span>
      </div>
      {kind === 'construir-habito' && (
        <div className="kbv-form-row">
          <button type="button" className={`kbv-reto-tohabit ${toHabit ? 'on' : ''}`} onClick={() => setToHabit(v => !v)}>
            <span className={`th-check ${toHabit ? 'on' : ''}`}>{toHabit && <KIcon name="check" size={12} />}</span>
            <div className="th-body">
              <span className="th-title"><KIcon name="repeat" size={13} /> Al terminar, convertirlo en hábito permanente</span>
              <span className="th-desc">Empieza como reto —con sus repercusiones al fallar— y al cerrar el periodo pasa a tu lista de Hábitos automáticamente.</span>
            </div>
          </button>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
        <div className="kbv-form-row">
          <label>Nombre del reto</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Dejar de fumar, 30 días sin azúcar..." autoFocus />
        </div>
        <div className="kbv-form-row">
          <label>Empieza</label>
          <input type="date" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
        </div>
      </div>
      <div className="kbv-form-row">
        <label>Descripción · qué cuenta como fallo</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Define exactamente qué cuenta como fallo. Cuanto más concreto, mejor." />
      </div>
      <div className="kbv-form-row">
        <label>Dificultad · define el daño por fallo</label>
        <RateRow value={difficulty} onChange={setDifficulty} icon="sword" color={d.color}
                 labels={Object.values(RETO_DIFFICULTY).map(x => `${x.label} · −${x.damage} HP`)} />
        <span className="kbv-meta"><strong style={{ color: d.color }}>{d.label} · −{d.damage} HP por fallo.</strong> {d.desc}</span>
      </div>
      <div className="kbv-form-row">
        <label>Periodicidad · cada cuánto debes cumplirlo</label>
        <div className="kbv-period-row">
          {Object.entries(RETO_PERIODICITY).map(([k, def]) => (
            <button key={k} type="button"
                    className={`kbv-period-btn ${periodicity === k ? 'on' : ''}`}
                    onClick={() => setPeriodicity(k)}>
              <KIcon name="repeat" size={12} />
              <span className="lbl">{def.label}</span>
              <span className="sub">×{def.factor}</span>
            </button>
          ))}
        </div>
        <span className="kbv-meta">{per.desc} La periodicidad escala las recompensas (no la dificultad). El daño por fallo se mantiene en <strong>−{damage}</strong>.</span>
      </div>

      <div className="kbv-stepper-row">
        <KbStepper label="Duración" value={days} onChange={setDays} min={3} max={365} suffix="días"
                   hint="entre 3 y 365 días" />
        <KbStepper label="Fallos tolerados" value={failsAllowed} onChange={setFailsAllowed} min={0} max={failCap}
                   hint={`máx ${failCap} · 20% de ${days} días`} />
        {duo && (
          <KbStepper label="HP en juego" value={hp} onChange={setHp} min={1} max={20} suffix="HP"
                     hint="por día fallado · para cada quien" tone="danger" />
        )}
      </div>
      <div className="kbv-form-note">
        <KIcon name="alert" size={14} />
        <span>Si superas <strong>{failCap}</strong> fallos, el reto se pierde: recibes la mitad de las recompensas y tu HP cae a zona crítica.</span>
      </div>

      <div className="kbv-reto-summary">
        <div className="cell danger">
          <span className="l"><KIcon name="sword" size={11} /> Daño por fallo</span>
          <span className="v">−{damage}</span>
        </div>
        <div className="cell reward">
          <span className="l"><KIcon name="trophy" size={11} /> Al cumplir</span>
          <span className="v reward-vals">
            <span className="xp"><KIcon name="trending-up" size={12} /> +{xpReward} XP</span>
            <span className="coin"><CoinIcon size={13} /> {coinReward}</span>
            <span className="gem"><GemIcon size={13} /> {gemReward}</span>
          </span>
        </div>
        <div className="cell warn">
          <span className="l"><KIcon name="alert" size={11} /> Si superas los fallos</span>
          <span className="v" style={{ fontSize: 13 }}>Pierdes · <strong>zona crítica</strong></span>
        </div>
      </div>
    </KBVModal>
  );
}

// El reto activo es UNO y vive aquí, donde vive la pantalla de Retos. Antes
// cada superficie traía su propia copia (`DEMO_RETO_FOR_WIDGET` en widgets-v3,
// números sueltos en el catálogo, un widget muerto en el dashboard): el mismo
// reto contaba días distintos según dónde lo miraras.
function kbActiveReto() {
  const list = typeof RETOS_DEMO !== 'undefined' ? RETOS_DEMO : [];
  const r = list.find(x => x.status === 'active');
  if (!r) return null;
  const pct = Math.round((r.daysElapsed / Math.max(1, r.daysTotal)) * 100);
  return { ...r, pct, daysRemaining: Math.max(0, r.daysTotal - r.daysElapsed) };
}

Object.assign(window, {
  HabitsScreen, RetosScreen, EstudioScreen, EntretenimientoScreen,
  HABITS_DEMO, RETOS_DEMO, RETO_DIFFICULTY, RETO_KIND_LABELS, kbActiveReto,
  STUDY_COURSES, SHOWS_DEMO, PLATFORM_PRICES,
  HabitDetailModal, CreateRetoModal,
});
