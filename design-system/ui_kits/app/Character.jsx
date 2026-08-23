/* Kibo App kit — Personaje (Character): prestige, rank emblems, area ranks, achievements */

function PrestigePanel({ p }) {
  return (
    <div className="kbv-card" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <div className="kb-prestige-ring" style={{ width: 76, height: 76, background: p.glow, boxShadow: `0 0 18px ${p.glow}` }}>
        <div className="kb-prestige-ring" style={{ width: 56, height: 56, background: `linear-gradient(145deg,${p.a},${p.b})`, color: p.ink, fontFamily: 'var(--kb-f-mono)', fontWeight: 700, fontSize: 20 }}>
          {p.grade}
        </div>
      </div>
      <div>
        <div className="kb-eyebrow">Prestigio · grado {p.grade}</div>
        <h2 className="kbv-h3" style={{ margin: '4px 0 4px' }}>{p.name}</h2>
        <p className="kbv-meta" style={{ margin: 0 }}>{p.sub}</p>
        <div className="kb-stars" style={{ marginTop: 8 }}>
          {[0, 1, 2].map((i) => <Icon key={i} name="star" size={16} color={i < p.stars ? 'var(--kb-coin)' : 'var(--kb-border-strong)'} style={{ fill: i < p.stars ? 'var(--kb-coin)' : 'none' }} />)}
        </div>
      </div>
    </div>
  );
}

function AreaRankRow({ area }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--kb-border-soft)' }}>
      <Emblem rank={KB.ranks[Math.min(4, Math.floor(area.level / 6))]} size={32} num={area.level} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontWeight: 700, fontSize: 13 }}>{area.name}</span>
          <span className="kb-area-lvl">NV {area.level} · {area.pct}%</span>
        </div>
        <Bar pct={area.pct} color={area.color} />
      </div>
    </div>
  );
}

function Character() {
  return (
    <div className="kb-page fade-in">
      <div className="kb-page-head">
        <div>
          <div className="kb-eyebrow">Tu personaje</div>
          <h1 className="kbv-h2" style={{ margin: '4px 0 0' }}>{KB.user.name}</h1>
        </div>
      </div>

      <PrestigePanel p={KB.prestige} />

      <div className="kb-cols" style={{ marginTop: 20, gridTemplateColumns: '1fr 360px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="kbv-card">
            <h2 className="kb-card-title" style={{ marginBottom: 4 }}>Rangos por material</h2>
            <p className="kbv-meta" style={{ marginTop: 0 }}>20 rangos militares (Nv 1–100) en 9 materiales.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(64px,1fr))', gap: 14, marginTop: 6 }}>
              {KB.ranks.map((r, i) => (
                <div key={r.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
                  <Emblem rank={r} size={48} num={(i + 1) * 11} locked={!r.unlocked} />
                  <span className="kbv-meta" style={{ fontSize: 11 }}>{r.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="kbv-card">
            <h2 className="kb-card-title" style={{ marginBottom: 8 }}>Logros</h2>
            <div className="kb-ach-grid">
              {KB.achievements.map((a) => (
                <div key={a.name} className={`kb-ach${a.unlocked ? '' : ' lock'}`}>
                  <div className="medal" style={a.unlocked ? { background: a.color } : null}>
                    <Icon name={a.unlocked ? a.icon : 'lock'} size={20} color="#fff" />
                  </div>
                  <span className="nm">{a.name}</span>
                  <span className="kb-eyebrow" style={{ fontSize: 9, color: a.color }}>{a.rarity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="kbv-card">
          <h2 className="kb-card-title" style={{ marginBottom: 4 }}>Habilidades</h2>
          <p className="kbv-meta" style={{ marginTop: 0, marginBottom: 6 }}>5 áreas × 50 niveles.</p>
          {KB.areas.map((a) => <AreaRankRow key={a.id} area={a} />)}
        </div>
      </div>
    </div>
  );
}

window.Character = Character;
