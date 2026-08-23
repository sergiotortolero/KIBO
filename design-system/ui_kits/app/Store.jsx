/* Kibo App kit — Tienda / Vitrina (cosmetics store) */

function Price({ cost, cur }) {
  if (cost === 0) return <span className="kb-price" style={{ color: 'var(--kb-primary-ink)' }}>Gratis</span>;
  return (
    <span className="kb-price" style={{ color: cur === 'gem' ? 'var(--kb-gem)' : '#b5851a' }}>
      {cur === 'gem' ? <GemIcon size={14} /> : <CoinIcon size={15} />} {cost}
    </span>
  );
}

function Store() {
  const [tab, setTab] = React.useState('backgrounds');
  const tabs = [
    { id: 'backgrounds', label: 'Portadas' },
    { id: 'frames', label: 'Marcos' },
    { id: 'chests', label: 'Cofres' },
  ];

  return (
    <div className="kb-page fade-in">
      <div className="kb-page-head">
        <div>
          <div className="kb-eyebrow">Vitrina</div>
          <h1 className="kbv-h2" style={{ margin: '4px 0 0' }}>Tienda</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <StatPill><CoinIcon /> {KB.user.coins.toLocaleString('es-MX')}</StatPill>
          <StatPill><GemIcon /> {KB.user.gems}</StatPill>
        </div>
      </div>

      <div className="kbv-chips" style={{ marginBottom: 18 }}>
        {tabs.map((t) => <Chip key={t.id} on={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</Chip>)}
      </div>

      {tab === 'backgrounds' && (
        <div className="kb-store-grid">
          {KB.store.backgrounds.map((b) => (
            <div key={b.id} className="kb-vt-card">
              <div className="kb-backdrop" style={{ background: b.css }}>
                {b.locked && <div className="kb-lock-badge"><Icon name="lock" size={22} color="#fff" /></div>}
              </div>
              <div className="kb-vt-foot">
                <span className="kb-vt-name">{b.name}</span>
                {b.locked ? <span className="kb-eyebrow">Pronto</span> : <Price cost={b.cost} cur={b.cur} />}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'frames' && (
        <div className="kb-store-grid">
          {KB.store.frames.map((f) => (
            <div key={f.id} className="kb-vt-card">
              <div className="kb-backdrop" style={{ background: 'var(--kb-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="kb-avatar" style={{ width: 52, height: 52, boxShadow: f.ring }}>{KB.user.initial}</div>
              </div>
              <div className="kb-vt-foot">
                <span className="kb-vt-name">{f.name}</span>
                <Price cost={f.cost} cur={f.cur} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'chests' && (
        <div className="kb-store-grid">
          {[
            { n: 'Cofre de madera', r: '1–5 gemas', c: '#A8632E', a: '#E0A878' },
            { n: 'Cofre de metal', r: '5–20 gemas', c: '#8A95A2', a: '#D2D9E1' },
            { n: 'Cofre de oro', r: '20–40 gemas', c: '#D4A22B', a: '#F8DC8A' },
          ].map((ch) => (
            <div key={ch.n} className="kb-vt-card">
              <div className="kb-backdrop" style={{ background: `linear-gradient(160deg,${ch.a},${ch.c})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="gift" size={40} color="#fff" />
              </div>
              <div className="kb-vt-foot">
                <div>
                  <div className="kb-vt-name">{ch.n}</div>
                  <div className="kb-eyebrow" style={{ marginTop: 3 }}>{ch.r}</div>
                </div>
                <Button variant="secondary" style={{ padding: '7px 12px' }}>Abrir</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

window.Store = Store;
