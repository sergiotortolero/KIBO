// opciones.jsx — piezas de comparación visual para decidir la unificación.
// Cada variante se dibuja con las clases reales del prototipo para que lo que
// veas sea exactamente lo que se implementaría.

const OPC_HABIT = {
  id: 'h1', name: 'Meditar 10 min', icon: 'will', color: 'var(--area-will)', streak: 12,
  schedule: '07:00', when: 'Mañana', goal: 'diario', energy: 2, effort: 2, xp: 18,
  weeklyHistory: [true, true, false, true, true, true, false], done: false,
};

const OPC_RETO = {
  id: 'r1', name: 'Procrastinación nocturna', desc: 'Sin pantallas después de las 22:30.',
  difficulty: 4, kind: 'cortar-malhabito', daysElapsed: 21, daysTotal: 30, fails: 1, failsAllowed: 6, xpReward: 480,
};

const OPC_ITEM = {
  id: 'i1', name: 'Marco dorado', desc: 'Marco de avatar para tu vitrina.',
  icon: 'crown', color: 'var(--kb-coin)', currency: 'gem', cost: 240, cat: 'cosmetic', kind: 'Marco',
};

function OpcPersonRow({ metric }) {
  const p = { name: 'Sofía', color: 'var(--kb-primary)', level: 14, streak: 88 };
  const val = metric === 'xp' ? '3,120' : metric === 'streak' ? '88' : '240';
  const lbl = metric === 'xp' ? 'XP · semana' : metric === 'streak' ? 'días de racha' : 'aportado';
  return (
    <div className="kbv-person-row">
      <span className="pr-av" style={{ '--c': p.color }}>{p.name[0]}</span>
      <div className="pr-id">
        <span className="pr-name">{p.name}</span>
        <span className="pr-meta">Nv. {p.level} · 🔥 {p.streak} d</span>
      </div>
      <div className="opc-metric"><span className="v">{val}</span><span className="l">{lbl}</span></div>
    </div>
  );
}

function OpcPalette({ extended }) {
  const ds = [
    ['Vigor', 'var(--area-vigor)'], ['Sabiduría', 'var(--area-wisdom)'], ['Riqueza', 'var(--area-wealth)'],
    ['Comunidad', 'var(--area-community)'], ['Voluntad', 'var(--area-will)'],
    ['Urgente', 'var(--kb-hp)'], ['Alta', 'var(--pri-high)'], ['Media', 'var(--kb-coin)'], ['Baja', 'var(--kb-gem)'], ['Muy baja', 'var(--kb-text-2)'],
  ];
  const ext = [
    ['Teal', 'var(--kb-primary)'], ['Menta', '#10B981'], ['Cian', 'var(--area-will)'], ['Índigo', '#6366F1'],
    ['Rosa', '#EC4899'], ['Coral', '#FB7185'], ['Ámbar', '#F59E0B'], ['Lima', '#84CC16'],
    ['Pizarra', '#64748B'], ['Vino', '#9F1239'],
  ];
  return (
    <div className="opc-palette">
      <span className="kbv-eyebrow" style={{ fontSize: 10 }}>Del sistema · con significado</span>
      <div className="op-row">
        {ds.map(([n, c]) => <span key={n} className="op-sw" style={{ '--c': c }} title={n}><i /><em>{n}</em></span>)}
      </div>
      {extended && (
        <React.Fragment>
          <span className="kbv-eyebrow" style={{ fontSize: 10, marginTop: 10 }}>Fila extendida · solo decorativa</span>
          <div className="op-row">
            {ext.map(([n, c]) => <span key={n} className="op-sw" style={{ '--c': c }} title={n}><i /><em>{n}</em></span>)}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

// Las opciones descartadas del turno 1 ya no existen en el código: sus
// envoltorios delegan en el componente adoptado, así que dibujarlas mentiría.
// Se muestran como ficha de registro.
function OpcRetired({ what, why, winner }) {
  return (
    <div className="opc-retired">
      <span className="or-tag">Diseño retirado</span>
      <span className="or-what">{what}</span>
      <span className="kbv-meta">{why}</span>
      <span className="or-win"><KIcon name="check" size={12} /> Sustituido por <a href={`#${winner}`}>{winner}</a></span>
    </div>
  );
}

function KiboOptionView(props) {
  const v = props.variant;
  switch (v) {
    case 'habit-dashboard':
      return <div style={{ maxWidth: 340 }}><OpcRetired what="Tarjeta grande del tablero" why="Check grande y racha, sin la semana ni la recompensa en monedas. Ocupaba una fila entera." winner="1c" /></div>;
    case 'habit-catalog':
      return <div style={{ maxWidth: 340 }}><OpcRetired what="Tarjeta del catálogo" why="Semana, recompensa y editar, pero marcar el hábito no era la acción principal." winner="1c" /></div>;
    case 'habit-hybrid':
      return <div style={{ maxWidth: 340 }}><KbHabitCard h={OPC_HABIT} onToggle={() => {}} /></div>;
    case 'reto-mini':
      return <div style={{ maxWidth: 340 }}><RetoCard r={OPC_RETO} compact onOpen={() => {}} /></div>;
    case 'reto-compact':
      return <div style={{ maxWidth: 340 }}><OpcRetired what="Widget compacto propio" why="Tres marcados distintos (1×1, 2×1 y 4×1) que evolucionaban aparte de la sección Retos." winner="1d" /></div>;
    case 'item-store':
      return <div style={{ maxWidth: 230 }}><OpcRetired what="Tarjeta densa de Tienda" why="Precio y acción en la misma línea, arte pequeño. Cabían más por pantalla." winner="1g" /></div>;
    case 'item-vitrina':
      return <div style={{ maxWidth: 230 }}><ItemCard item={OPC_ITEM} onBuy={() => {}} /></div>;
    case 'goal-unified':
      return <div style={{ display: 'grid', gap: 10, maxWidth: 340 }}>
        <GoalBar label="Tema oscuro premium" who="Lucía · amigos aportan hasta 90%" cur={720} target={1000} capPct={90} currency="coin" />
        <GoalBar label="Fondo de emergencia" who="Ahorro · Finanzas" cur={38000} target={60000} money />
        <GoalBar label="Curso de React avanzado" who="Estudio · 12 de 20 lecciones" cur={12} target={20} />
      </div>;
    case 'goal-split':
      return <div style={{ display: 'grid', gap: 10, maxWidth: 340 }}>
        <GoalBar label="Tema oscuro premium" who="Lucía · amigos aportan hasta 90%" cur={720} target={1000} capPct={90} currency="coin" />
        <GoalBar label="Curso de React avanzado" who="Estudio · barra simple actual" cur={12} target={20} />
      </div>;
    case 'person-row':
      return <div style={{ display: 'grid', gap: 8, maxWidth: 380 }}>
        <OpcPersonRow metric="xp" />
        <OpcPersonRow metric="streak" />
        <OpcPersonRow metric="coin" />
      </div>;
    case 'palette':
      return <OpcPalette extended={true} />;
    default:
      return <div className="kbv-project-empty">Variante desconocida: {String(v)}</div>;
  }
}

Object.assign(window, { KiboOptionView, OpcPersonRow, OpcPalette });
