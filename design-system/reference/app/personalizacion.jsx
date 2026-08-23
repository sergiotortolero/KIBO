// personalizacion.jsx — Todo lo que se puede cambiar de aspecto, en un solo
// sitio. «Mi progreso» se queda con lo que MIDES (perfil, estadísticas,
// logros); aquí vive lo que DECIDES: cómo se ve tu KIBO, tu carta, tus
// prestigios, tus divisas y la interfaz. Y como casi todo se compra, esta
// sección también vende: ver, comprar y equipar sin cambiar de pantalla.

const PERS_TABS = [
  { id: 'kibo',      name: 'KIBO',      icon: 'user',     desc: 'Piel, marcas, aura y personalidad de tu mascota.' },
  { id: 'carta',     name: 'Carta',     icon: 'image',    desc: 'Portada, marco, título y compañero de tu carta de presentación.' },
  { id: 'prestigio', name: 'Prestigio', icon: 'crown',    desc: 'Cómo se llaman tus 16 prestigios.' },
  { id: 'divisas',   name: 'Divisas',   icon: 'sparkle',  desc: 'Nombre, glifo y color de tus recompensas.' },
  { id: 'interfaz',  name: 'Interfaz',  icon: 'settings', desc: 'Menú, rueda, tablero y tema.' },
];

// ── Glifos de divisa ─────────────────────────────────────────────
// Dibujados aquí y no en `icons.jsx` porque son objetos de marca (como la
// moneda y la materia), no íconos de interfaz.
function CurrencyGlyph({ glyph, color, size = 26, spin = false }) {
  const s = { width: size, height: size, display: 'block' };
  const c = color || 'var(--kb-void-1)';
  switch (glyph) {
    case 'spark':
      return (
        <svg viewBox="0 0 24 24" style={s} className={spin ? 'cg-spin' : ''}>
          <path d="M12 2.6l2.1 6.6 6.6 2.1-6.6 2.1L12 20l-2.1-6.6L3.3 11.3l6.6-2.1z" fill={c} />
          <circle cx="12" cy="11.3" r="2.4" fill="var(--kb-canvas)" opacity=".85" />
        </svg>
      );
    case 'drop':
      return (
        <svg viewBox="0 0 24 24" style={s} className={spin ? 'cg-spin' : ''}>
          <path d="M12 3c3.4 3.8 5.4 6.5 5.4 9a5.4 5.4 0 0 1-10.8 0c0-2.5 2-5.2 5.4-9z" fill={c} />
          <ellipse cx="9.6" cy="10.4" rx="1.5" ry="2.2" fill="var(--kb-canvas)" opacity=".55" />
        </svg>
      );
    case 'core':
      return (
        <svg viewBox="0 0 24 24" style={s} className={spin ? 'cg-spin' : ''}>
          <circle cx="12" cy="12" r="5.6" fill={c} />
          <circle cx="12" cy="12" r="9" fill="none" stroke={c} strokeWidth="1.4" opacity=".5" />
          <circle cx="10" cy="10" r="1.8" fill="var(--kb-canvas)" opacity=".5" />
        </svg>
      );
    case 'chip':
      return (
        <svg viewBox="0 0 24 24" style={s} className={spin ? 'cg-spin' : ''}>
          <circle cx="12" cy="12" r="9" fill={c} />
          <circle cx="12" cy="12" r="5.4" fill="var(--kb-canvas)" opacity=".9" />
          <circle cx="12" cy="12" r="2.6" fill={c} />
        </svg>
      );
    case 'leaf':
      return (
        <svg viewBox="0 0 24 24" style={s} className={spin ? 'cg-spin' : ''}>
          <path d="M19 4c0 8-4.6 12.6-11 13 0-7.4 4-12 11-13z" fill={c} />
          <path d="M17 6C12 9 9.6 12.4 8.4 17" stroke="var(--kb-canvas)" strokeWidth="1.3" fill="none" opacity=".7" />
        </svg>
      );
    case 'coin':
      return (
        <svg viewBox="0 0 24 24" style={s} className={spin ? 'cg-spin' : ''}>
          <circle cx="12" cy="12" r="9.2" fill={c} />
          <path d="M9.4 7.4v9.2M9.4 12.4l4.6-5M10.4 12.2l4.4 4.4" stroke="var(--kb-coin-ink)" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      );
    default: // orb — obsidiana con contorno
      return (
        <svg viewBox="0 0 24 24" style={s} className={spin ? 'cg-spin' : ''}>
          <circle cx="12" cy="12" r="8.4" fill={c} />
          <ellipse cx="12" cy="12" rx="9.6" ry="4" fill="none" stroke={c} strokeWidth="1.3" opacity=".7" transform="rotate(-22 12 12)" />
          <circle cx="9.4" cy="9.2" r="1.8" fill="var(--kb-canvas)" opacity=".4" />
        </svg>
      );
  }
}

// ── Ficha comprable genérica ─────────────────────────────────────
function PersCard({ owned, active, name, desc, cost, currency = 'gem', onPick, children, wide }) {
  return (
    <button type="button" className={`pers-card ${active ? 'on' : ''} ${owned ? '' : 'locked'} ${wide ? 'wide' : ''}`}
            onClick={onPick} title={desc}>
      <span className="pc-art">{children}</span>
      <span className="pc-meta">
        <strong>{name}</strong>
        {desc && <span>{desc}</span>}
      </span>
      {active ? <span className="pc-tag on"><KIcon name="check" size={11} /> Puesto</span>
        : owned ? <span className="pc-tag">Poner</span>
        : <span className="pc-tag buy">{currency === 'gem' ? <GemIcon size={11} /> : <CoinIcon size={11} />} {cost}</span>}
    </button>
  );
}

// ── Pestaña · Prestigio ──────────────────────────────────────────
function PersPrestigio({ stats, flash, ask }) {
  const live = usePrestigeNames();
  const owned = pfOwned();
  const [draft, setDraft] = React.useState(null); // los 16 nombres en edición

  function pick(f) {
    if (!owned.has(f.id)) {
      const have = parseInt(stats?.gems, 10) || 0;
      if (have < f.cost) { flash('No tienes suficiente materia oscura — gánala en retos o ábrela en cofres'); return; }
      ask({
        title: `Comprar «${f.name}»`, confirmLabel: 'Comprar y poner',
        message: `Cuesta ${f.cost} de materia oscura. Cambia el nombre de tus 16 prestigios; el número y lo que valen no se tocan.`,
        onConfirm: () => { pfOwn(f.id); pfSetCustom(null); pfSetActive(f.id); flash(`Prestigios «${f.name}» ✓`); },
      });
      return;
    }
    pfSetCustom(null); pfSetActive(f.id);
    flash(`Prestigios «${f.name}»`);
  }

  function startCustom() {
    const have = parseInt(stats?.gems, 10) || 0;
    const already = live.custom;
    if (!already && have < PF_CUSTOM_COST) { flash('Escribir los tuyos cuesta ' + PF_CUSTOM_COST + ' de materia oscura'); return; }
    setDraft(live.names.slice());
  }

  return (
    <div className="pers-pane">
      <div className="pers-lead">
        <p>Los 16 prestigios son un <strong>número</strong> — el nombre es cosmético. Cámbialo por una familia entera o escribe los tuyos.</p>
        <span className="kbv-meta">El nivel se sigue viendo junto al nombre, así que nadie pierde la referencia.</span>
      </div>

      <div className="pers-grid">
        {PRESTIGE_FAMILIES.map(f => (
          <PersCard key={f.id} wide
                    owned={owned.has(f.id)} active={!live.custom && live.family === f.id}
                    name={f.name} desc={f.desc} cost={f.cost} onPick={() => pick(f)}>
            <span className="pf-sample">
              {[1, 8, 16].map(n => (
                <span key={n} className="pf-chip"><b>{n}</b> {f.names[n - 1]}</span>
              ))}
            </span>
          </PersCard>
        ))}

        <button type="button" className={`pers-card wide custom ${live.custom ? 'on' : ''}`} onClick={startCustom}>
          <span className="pc-art"><KIcon name="edit" size={22} /></span>
          <span className="pc-meta">
            <strong>Escribe los tuyos</strong>
            <span>Los 16, con tus palabras. Se guardan y puedes volver a editarlos.</span>
          </span>
          {live.custom ? <span className="pc-tag on"><KIcon name="check" size={11} /> Puestos</span>
            : <span className="pc-tag buy"><GemIcon size={11} /> {PF_CUSTOM_COST}</span>}
        </button>
      </div>

      {draft && (
        <div className="kbv-modal-veil" onClick={() => setDraft(null)}>
          <div className="kbv-modal-card" onClick={e => e.stopPropagation()}>
            <div className="kbv-modal-head">
              <h3 className="kbv-h3">Tus 16 prestigios</h3>
              <button type="button" className="kbv-icon-btn" onClick={() => setDraft(null)} aria-label="Cerrar"><KIcon name="x" size={16} /></button>
            </div>
            <div className="pers-custom-list">
              {draft.map((v, i) => (
                <label key={i} className="pers-custom-row">
                  <span className="n">{i + 1}</span>
                  <input value={v} maxLength={28}
                         onChange={e => setDraft(d => d.map((x, j) => j === i ? e.target.value : x))} />
                </label>
              ))}
            </div>
            <div className="kbv-modal-foot">
              {live.custom && (
                <button type="button" className="kbv-btn kbv-btn-ghost"
                        onClick={() => { pfSetCustom(null); setDraft(null); flash('Volviste a la familia elegida'); }}>
                  Quitar los míos
                </button>
              )}
              <button type="button" className="kbv-btn kbv-btn-secondary" onClick={() => setDraft(null)}>Cancelar</button>
              <button type="button" className="kbv-btn kbv-btn-primary"
                      onClick={() => {
                        if (draft.some(x => !x.trim())) { flash('Ninguno puede quedar vacío'); return; }
                        pfSetCustom(draft.map(x => x.trim())); setDraft(null); flash('Prestigios a tu manera ✓');
                      }}>
                Guardar los 16
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Pestaña · Divisas ────────────────────────────────────────────
function PersDivisas({ stats, flash, ask }) {
  const live = useCurrencySkin();
  const owned = csOwned();
  const [naming, setNaming] = React.useState(null);

  function pick(kind, skin) {
    if (!owned.has(skin.id)) {
      const have = parseInt(stats?.gems, 10) || 0;
      if (have < skin.cost) { flash('No tienes suficiente materia oscura'); return; }
      ask({
        title: `Comprar «${skin.name}»`, confirmLabel: 'Comprar y poner',
        message: `Cuesta ${skin.cost} de materia oscura. Cambia cómo se ve y cómo se llama; lo que vale, no.`,
        onConfirm: () => { csOwn(skin.id); csSet(kind, skin.id); flash(`${skin.name} ✓`); },
      });
      return;
    }
    csSet(kind, skin.id);
    flash(`${skin.name} puesta`);
  }

  const blocks = [
    { kind: 'dark', title: 'Materia oscura', sub: 'La recompensa rara: cofres, retos y prestigios.' },
    { kind: 'coin', title: 'Monedas', sub: 'La de todos los días: hábitos, tareas y rachas.' },
  ];

  return (
    <div className="pers-pane">
      <div className="pers-lead">
        <p>Cambia el <strong>nombre</strong>, el <strong>glifo</strong> y el <strong>color</strong> de tus recompensas. La economía no se entera: siguen valiendo lo mismo y ganándose igual.</p>
      </div>

      {blocks.map(b => (
        <div key={b.kind} className="pers-block">
          <div className="pers-block-head">
            <div>
              <h3 className="kbv-h3">{csLabel(b.kind)}</h3>
              <span className="kbv-meta">{b.sub}</span>
            </div>
            <button type="button" className="kbv-btn kbv-btn-secondary" onClick={() => setNaming({ kind: b.kind, value: csLabel(b.kind) })}>
              <KIcon name="edit" size={13} /> Renombrar
            </button>
          </div>
          <div className="pers-grid">
            {CURRENCY_SKINS[b.kind].map(sk => (
              <PersCard key={sk.id} owned={owned.has(sk.id)} active={live[b.kind].id === sk.id}
                        name={sk.name} desc={sk.desc} cost={sk.cost} onPick={() => pick(b.kind, sk)}>
                <span className="cg-stage">
                  <CurrencyGlyph glyph={sk.glyph} color={sk.color} size={38} spin={live[b.kind].id === sk.id} />
                </span>
              </PersCard>
            ))}
          </div>
        </div>
      ))}

      {naming && (
        <div className="kbv-modal-veil" onClick={() => setNaming(null)}>
          <div className="kbv-modal-card sm" onClick={e => e.stopPropagation()}>
            <div className="kbv-modal-head"><h3 className="kbv-h3">¿Cómo se llama?</h3></div>
            <div className="kbv-form-row">
              <input autoFocus value={naming.value} maxLength={22}
                     onChange={e => setNaming(n => ({ ...n, value: e.target.value }))} />
            </div>
            <div className="kbv-modal-foot">
              <button type="button" className="kbv-btn kbv-btn-secondary" onClick={() => setNaming(null)}>Cancelar</button>
              <button type="button" className="kbv-btn kbv-btn-primary"
                      onClick={() => { csSetName(naming.kind, naming.value.trim()); setNaming(null); flash('Listo — se llama así en toda la plataforma'); }}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Pestaña · Interfaz ───────────────────────────────────────────
function PersInterfaz({ flash, onNavigate }) {
  const prefs = (typeof useKbPrefs === 'function') ? useKbPrefs() : {};
  const mode = prefs.sidebarMode || 'replegable';
  const dense = prefs.density || 'estandar';
  return (
    <div className="pers-pane">
      <div className="pers-lead">
        <p>Cómo se comporta la plataforma alrededor de tu contenido.</p>
      </div>

      <div className="pers-block">
        <div className="pers-block-head"><div><h3 className="kbv-h3">Menú lateral</h3><span className="kbv-meta">También puedes fijarlo desde la chincheta del propio menú.</span></div></div>
        <div className="pers-choices">
          {[{ id: 'replegable', n: 'Replegable', d: 'Con botón para colapsarlo a riel.' },
            { id: 'fijo', n: 'Fijo', d: 'Siempre abierto, con los nombres a la vista.' }].map(o => (
            <button key={o.id} type="button" className={`pers-choice ${mode === o.id ? 'on' : ''}`}
                    onClick={() => { kbSetPref('sidebarMode', o.id); flash('Listo'); }}>
              <strong>{o.n}</strong><span>{o.d}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pers-block">
        <div className="pers-block-head"><div><h3 className="kbv-h3">Densidad</h3><span className="kbv-meta">Cuánto aire hay entre las cosas.</span></div></div>
        <div className="pers-choices">
          {[{ id: 'compacta', n: 'Compacta', d: 'Más contenido a la vista.' },
            { id: 'estandar', n: 'Estándar', d: 'El equilibrio de siempre.' },
            { id: 'amplia', n: 'Amplia', d: 'Más aire, menos por pantalla.' }].map(o => (
            <button key={o.id} type="button" className={`pers-choice ${dense === o.id ? 'on' : ''}`}
                    onClick={() => { kbSetPref('density', o.id); flash('Listo'); }}>
              <strong>{o.n}</strong><span>{o.d}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pers-block">
        <div className="pers-block-head"><div><h3 className="kbv-h3">Atajos</h3><span className="kbv-meta">Lo que se configura en su propio sitio.</span></div></div>
        <div className="pers-links">
          <button type="button" className="pers-link" onClick={() => onNavigate && onNavigate('today')}>
            <KIcon name="layers" size={16} /><span><strong>Widgets del tablero</strong><em>Añadir, quitar y redimensionar en «Hoy»</em></span><KIcon name="arrow-right" size={14} />
          </button>
          <button type="button" className="pers-link" onClick={() => { flash('Toca a KIBO y usa el ⋯ bajo él'); }}>
            <KIcon name="grip" size={16} /><span><strong>Tu rueda de acción rápida</strong><em>Qué rubros salen y en qué orden</em></span><KIcon name="arrow-right" size={14} />
          </button>
          <button type="button" className="pers-link" onClick={() => onNavigate && onNavigate('config')}>
            <KIcon name="settings" size={16} /><span><strong>Configuración</strong><em>Notificaciones, juego, integraciones y cuenta</em></span><KIcon name="arrow-right" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── La pantalla ──────────────────────────────────────────────────
function PersonalizacionScreen({ user, stats, onNavigate, initialTab }) {
  const [tab, setTab] = React.useState(initialTab || 'kibo');
  const [toast, setToast] = React.useState(null);
  const [ask, confirmDialog] = useConfirm();
  function flash(m) { setToast(m); clearTimeout(flash._t); flash._t = setTimeout(() => setToast(null), 2400); }
  const meta = PERS_TABS.find(t => t.id === tab) || PERS_TABS[0];

  return (
    <div className="kbv-main kbv-pers">
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--kb-primary)' }}>Tuyo · cómo se ve todo</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Personalización.</h1>
          <p className="kbv-meta" style={{ marginTop: 6, maxWidth: 620 }}>{meta.desc}</p>
        </div>
      </div>

      <div className="kbv-store-tabs">
        {PERS_TABS.map(t => (
          <button key={t.id} type="button" className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            <KIcon name={t.icon} size={14} /> {t.name}
          </button>
        ))}
      </div>

      {tab === 'kibo' && typeof KiboStyleTab === 'function' && <KiboStyleTab stats={stats} flash={flash} />}
      {tab === 'carta' && (
        <div className="pers-pane">
          <div className="pers-lead">
            <p>Así te ven los demás. Toca <strong>Editar</strong> en la carta para elegir qué presumes; abajo, con qué se viste.</p>
          </div>
          {typeof CallingCard === 'function' && typeof prestigeInfo === 'function' && (() => {
            const level = (stats && stats.level) || 8;
            const completed = (stats && stats.prestigeMaster) ? 16 : ((stats && stats.prestigeCompleted) ?? 0);
            return (
              <CallingCard user={user} pres={prestigeInfo(completed, level)} level={level}
                           xp={(stats && stats.xp) || 0} xpMax={(stats && stats.xpMax) || 4000}
                           paragonLevel={(stats && stats.paragonLevel) || 0} />
            );
          })()}
          {typeof VitrinaStoreTab === 'function' && <VitrinaStoreTab />}
        </div>
      )}
      {tab === 'prestigio' && <PersPrestigio stats={stats} flash={flash} ask={ask} />}
      {tab === 'divisas' && <PersDivisas stats={stats} flash={flash} ask={ask} />}
      {tab === 'interfaz' && <PersInterfaz flash={flash} onNavigate={onNavigate} />}

      {toast && <div className="kbv-toast show">{toast}</div>}
      {confirmDialog}
    </div>
  );
}

Object.assign(window, { PersonalizacionScreen, PERS_TABS, CurrencyGlyph });
