/* Kibo App kit — secondary pages: Hábitos, Retos, and the locked premium module */

function HabitCard({ name, area, freq, streak }) {
  return (
    <div className="kbv-card click" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: `${area.hex}1f`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={area.icon} size={16} color={area.color} />
        </span>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{name}</div>
        <span className="kb-statpill" style={{ marginLeft: 'auto', padding: '4px 9px', color: 'var(--kb-streak)' }}>
          <FlameSVG size={13} /> {streak}
        </span>
      </div>
      <div className="kbv-meta" style={{ marginBottom: 10 }}>{area.name} · {freq}</div>
      <div style={{ display: 'flex', gap: 5 }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} style={{ flex: 1, height: 20, borderRadius: 5, background: i < 5 ? area.color : 'var(--kb-surface-2)' }} />
        ))}
      </div>
    </div>
  );
}

function Habits() {
  const a = (id) => KB.areas.find((x) => x.id === id);
  const items = [
    { name: 'Leer 20 minutos', area: a('wisdom'), freq: 'Diario', streak: 42 },
    { name: 'Entrenar fuerza', area: a('vigor'), freq: 'Lun · Mié · Vie', streak: 18 },
    { name: 'Meditar 10 min', area: a('will'), freq: 'Diario', streak: 7 },
    { name: 'Registrar gastos', area: a('wealth'), freq: 'Diario', streak: 90 },
    { name: 'Llamar a un amigo', area: a('community'), freq: 'Semanal', streak: 4 },
    { name: 'Caminar 8 000 pasos', area: a('vigor'), freq: 'Diario', streak: 23 },
  ];
  return (
    <div className="kb-page fade-in">
      <div className="kb-page-head">
        <div><div className="kb-eyebrow">Rutina</div><h1 className="kbv-h2" style={{ margin: '4px 0 0' }}>Hábitos</h1></div>
        <Button><Icon name="plus" size={16} color="#fff" /> Nuevo hábito</Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
        {items.map((it) => <HabitCard key={it.name} {...it} />)}
      </div>
    </div>
  );
}

function Retos() {
  const a = (id) => KB.areas.find((x) => x.id === id);
  const retos = [
    { name: '30 días sin azúcar', area: a('vigor'), day: 12, total: 30 },
    { name: 'Leer 4 libros este mes', area: a('wisdom'), day: 2, total: 4 },
    { name: 'Ahorrar $5 000', area: a('wealth'), day: 3200, total: 5000, money: true },
  ];
  return (
    <div className="kb-page fade-in">
      <div className="kb-page-head">
        <div><div className="kb-eyebrow">Desafíos</div><h1 className="kbv-h2" style={{ margin: '4px 0 0' }}>Retos</h1></div>
        <Button><Icon name="plus" size={16} color="#fff" /> Nuevo reto</Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
        {retos.map((r) => (
          <div key={r.name} className="kbv-card click">
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
              <span className="kb-area-dot" style={{ background: r.area.color }} />
              <span className="kb-eyebrow">{r.area.name}</span>
            </div>
            <h3 className="kb-card-title" style={{ marginBottom: 12 }}>{r.name}</h3>
            <Bar pct={Math.round((r.day / r.total) * 100)} color={r.area.color} />
            <div className="kbv-meta" style={{ marginTop: 8 }}>
              {r.money ? `$${r.day.toLocaleString('es-MX')} / $${r.total.toLocaleString('es-MX')}` : `Día ${r.day} de ${r.total}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModuleLocked() {
  return (
    <div className="kb-page fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="kbv-card" style={{ maxWidth: 420, textAlign: 'center', padding: 36 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--kb-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Icon name="sparkles" size={26} color="var(--kb-primary)" />
        </div>
        <h2 className="kbv-h3" style={{ margin: '0 0 8px' }}>Proyectos es premium</h2>
        <p className="kbv-body" style={{ color: 'var(--kb-text-2)', margin: '0 0 18px' }}>
          Organiza misiones grandes en proyectos con sub-metas, plazos y recompensas. Desbloquéalo con Kibo Pro.
        </p>
        <Button>Probar Kibo Pro</Button>
      </div>
    </div>
  );
}

Object.assign(window, { Habits, Retos, ModuleLocked });
