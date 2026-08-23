/* Kibo App kit — Dashboard (Inicio) */

function Kpi({ icon, iconBg, iconColor, value, label }) {
  return (
    <div className="kbv-kpi">
      <div className="kbv-kpi-icon" style={{ background: iconBg, color: iconColor }}>
        <Icon name={icon} size={18} color={iconColor} />
      </div>
      <div className="v">{value}</div>
      <div className="k">{label}</div>
    </div>
  );
}

function HabitRow({ habit, area, onToggle }) {
  return (
    <div className={`kb-habit${habit.done ? ' is-done' : ''}`}>
      <button className={`kb-check${habit.done ? ' done' : ''}`} onClick={onToggle} aria-label="completar">
        {habit.done && <Icon name="check" size={15} color="#fff" />}
      </button>
      <span className="kb-area-dot" style={{ background: area.color }} />
      <span className="kb-habit-name">{habit.name}</span>
      <span style={{ marginLeft: 'auto' }} className="kb-xp-gain">+{habit.xp} XP</span>
    </div>
  );
}

function AreaMini({ area }) {
  return (
    <div className="kb-area-mini">
      <div className="top">
        <span className="kb-area-dot" style={{ width: 22, height: 22, borderRadius: 7, background: `${area.hex}1f`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={area.icon} size={13} color={area.color} />
        </span>
        <span className="nm">{area.name}</span>
        <span className="kb-area-lvl">NV {area.level}</span>
      </div>
      <Bar pct={area.pct} color={area.color} />
    </div>
  );
}

function Dashboard() {
  const [habits, setHabits] = React.useState(KB.habits);
  const [showModal, setShowModal] = React.useState(false);
  const areaById = (id) => KB.areas.find((a) => a.id === id);
  const doneCount = habits.filter((h) => h.done).length;

  const toggle = (id) => setHabits((hs) => hs.map((h) => h.id === id ? { ...h, done: !h.done } : h));
  const bossPct = Math.round(((KB.boss.hpMax - KB.boss.hp) / KB.boss.hpMax) * 100);

  return (
    <div className="kb-page fade-in">
      <div className="kb-page-head">
        <div>
          <div className="kb-eyebrow">Martes · 3 jun</div>
          <h1 className="kbv-h2" style={{ margin: '4px 0 0' }}>Buen día, {KB.user.name}</h1>
        </div>
        <Button onClick={() => setShowModal(true)}><Icon name="plus" size={16} color="#fff" /> Nueva misión</Button>
      </div>

      <div className="kb-grid-kpi">
        <Kpi icon="zap"   iconBg="var(--kb-primary-soft)" iconColor="var(--kb-primary-ink)" value={KB.user.xp.toLocaleString('es-MX')} label="Experiencia" />
        <Kpi icon="flame" iconBg="#FFF1E6" iconColor="var(--kb-streak)" value={KB.user.streak} label="Racha · días" />
        <Kpi icon="circle-dollar-sign" iconBg="#FDF3DC" iconColor="#b5851a" value={KB.user.coins.toLocaleString('es-MX')} label="Monedas" />
        <Kpi icon="heart" iconBg="var(--kb-hp-soft)" iconColor="var(--kb-hp)" value={`${KB.user.hp}%`} label="Salud" />
      </div>

      <div className="kb-cols">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="kbv-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <h2 className="kb-card-title">Hoy</h2>
              <span className="kb-eyebrow">{doneCount}/{habits.length} completadas</span>
            </div>
            {habits.map((h) => <HabitRow key={h.id} habit={h} area={areaById(h.area)} onToggle={() => toggle(h.id)} />)}
          </div>

          <div>
            <h2 className="kb-card-title" style={{ marginBottom: 12 }}>Áreas de vida</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12 }}>
              {KB.areas.map((a) => <AreaMini key={a.id} area={a} />)}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="kb-coach">
            <div className="kb-eyebrow" style={{ color: 'var(--kb-primary)', marginBottom: 8 }}>Coach Kibo</div>
            <p className="quote">El fracaso no castiga: reencauza.</p>
            <p className="kbv-meta" style={{ marginTop: 8, marginBottom: 0 }}>Fallaste 1 hábito ayer. Hoy es un nuevo intento — vas 86% de salud.</p>
          </div>

          <div className="kb-boss">
            <div className="tag"><Icon name="swords" size={13} color="var(--kb-boss)" /> Jefe activo</div>
            <h3 className="kb-card-title" style={{ color: 'var(--kb-boss)', margin: '8px 0 2px' }}>{KB.boss.name}</h3>
            <p className="kbv-meta" style={{ margin: '0 0 12px' }}>{KB.boss.hp.toLocaleString('es-MX')} / {KB.boss.hpMax.toLocaleString('es-MX')} HP restante</p>
            <Bar pct={bossPct} color="var(--kb-boss)" track="#fadbdb" />
          </div>

          <div className="kbv-card">
            <div className="kb-eyebrow" style={{ marginBottom: 8 }}>Leyendo</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 44, height: 60, borderRadius: 6, background: 'linear-gradient(160deg,#2E8B63,#155C40)', flex: 'none' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>Hábitos Atómicos</div>
                <div className="kbv-meta" style={{ margin: '2px 0 8px' }}>p. 142 / 320</div>
                <Bar pct={44} color="var(--area-wisdom)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal title="Nueva misión" onClose={() => setShowModal(false)}
          foot={<><Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button><Button onClick={() => setShowModal(false)}>Crear misión</Button></>}>
          <div className="kbv-field">
            <label>Nombre</label>
            <input className="kbv-input" placeholder="¿Qué quieres lograr?" autoFocus />
          </div>
          <div className="kbv-field">
            <label>Área de vida</label>
            <div className="kbv-chips">
              {KB.areas.map((a, i) => <button key={a.id} className={`kbv-chip${i === 1 ? ' on' : ''}`}>{a.name}</button>)}
            </div>
          </div>
          <div className="kbv-field">
            <label>Prioridad</label>
            <div className="kbv-chips">
              {KB.priorities.map((p, i) => (
                <button key={p.id} className={`kbv-chip${i === 0 ? ' on' : ''}`}>
                  <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: p.color, marginRight: 6 }} />{p.name}
                </button>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

window.Dashboard = Dashboard;
