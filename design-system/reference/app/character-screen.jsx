// character-screen.jsx — "Mi progreso": perfil, prestigio (estilo COD),
// indicadores con filtro de periodo, gráficos de tendencia/proyección,
// consistencia, XP por semana y lista de deseos de funciones.
// Prestigio y emblemas viven en prestige-system.jsx; gráficos en progress-charts.jsx.

// Demo: nivel 8 dentro del prestigio actual; 7 prestigios completados (emblemas 1-7).
const DEMO_PRESTIGE_COMPLETED = 7;

// Benchmarks base — el valor/delta se reescala según el periodo seleccionado.
const CHAR_BENCH = [
  { id: 'xp',     label: 'XP ganado',        base: 9360,  icon: 'trending-up', c: 'var(--kb-primary)', seed: 11, fmt: 'n',   areaLink: null },
  { id: 'xpRate', label: 'XP por día',       base: 312,   icon: 'gauge',       c: 'var(--kb-gem)',           seed: 23, fmt: 'rate', areaLink: null },
  { id: 'tasks',  label: 'Tareas cerradas',  base: 168,   icon: 'check',       c: 'var(--kb-primary)',           seed: 31, fmt: 'n',   areaLink: null },
  { id: 'habits', label: 'Cumplimiento hábitos', base: 92, sfx: '%', icon: 'flame', c: 'var(--pri-high)',     seed: 5,  fmt: 'pct',  areaLink: null },
  { id: 'retos',  label: 'Retos ganados',    base: 11,    icon: 'trophy',      c: 'var(--area-community)',           seed: 17, fmt: 'n',   areaLink: null },
  { id: 'focus',  label: 'Horas en foco',    base: 38,    icon: 'clock',       c: 'var(--kb-streak)', sfx: ' h',seed: 41, fmt: 'n',   areaLink: null },
  { id: 'streak', label: 'Racha actual',     base: 23, sfx: ' d', icon: 'flame', c: 'var(--kb-hp)',         seed: 3,  fmt: 'flat', areaLink: null },
  { id: 'active', label: 'Días activos',     base: 0,     icon: 'calendar',    c: 'var(--kb-good-soft)',           seed: 9,  fmt: 'days', areaLink: null },
];

// Escala un KPI base a un periodo. Acumulables crecen con el periodo; tasas/%, no.
function scaleBench(b, meta, rnd) {
  const factor = meta.days / 30; // base mensual
  const jitter = 1 + (rnd() - 0.5) * 0.12;
  if (b.fmt === 'n') {
    const v = Math.round(b.base * factor * jitter);
    return { val: v >= 1000 ? v.toLocaleString('es-MX') : String(v), delta: `+${Math.round(8 + rnd() * 14)}% vs periodo previo`, up: true };
  }
  if (b.fmt === 'rate') {
    const v = Math.round(b.base * jitter);
    return { val: String(v), delta: `${meta.note} · +${Math.round(4 + rnd() * 12)}%`, up: true };
  }
  if (b.fmt === 'pct') {
    const v = Math.min(99, Math.round(b.base + (rnd() - 0.4) * 8));
    return { val: String(v), delta: `cumplimiento en ${meta.l.toLowerCase()}`, up: true };
  }
  if (b.fmt === 'days') {
    const v = Math.round(meta.days * (0.78 + rnd() * 0.14));
    return { val: String(v), delta: `${Math.round((v / meta.days) * 100)}% del periodo`, up: true };
  }
  // flat (racha)
  return { val: String(b.base), delta: 'récord 41 días', up: false };
}

// ── Sparkline mini para tarjetas KPI ───────────────────────────
function Sparkline({ seed, color, period }) {
  const meta = periodMeta(period);
  const s = genSeries(period, { seed, base: 100, growth: 0.22, vol: 0.32 });
  const pts = s.points;
  const max = s.max, min = Math.min(...pts.map(p => p.v));
  const W = 120, H = 30;
  const x = (i) => (i / Math.max(1, pts.length - 1)) * W;
  const y = (v) => H - 3 - ((v - min) / Math.max(1, max - min)) * (H - 6);
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.v).toFixed(1)}`).join(' ');
  return (
    <svg className="kbv-sparkline" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height={H}>
      <path d={`${d} L ${W} ${H} L 0 ${H} Z`} fill={color} opacity="0.12" />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Lista de deseos (antes "Metas de ahorro") ──────────────────
// Wishlist de funciones de la plataforma: juntas fragmentos/monedas y al llenarse
// se compra/desbloquea sola.
const WISHLIST = [
  { id: 's1', name: 'Módulo "Recursos"',        desc: 'Notas con IA + sintetizador de lecturas', icon: 'book',    cur: 'gem',  saved: 180, target: 300,  perWeek: 40, fromFriends: 35 },
  { id: 's2', name: 'Slot de área de vida extra', desc: 'Una sexta área 100% personalizable',     icon: 'layers',  cur: 'gem',  saved: 95,  target: 200,  perWeek: 40, fromFriends: 20 },
  { id: 's3', name: 'Tema oscuro premium',        desc: 'Apariencia nocturna para toda la app',   icon: 'sparkle', cur: 'coin', saved: 980, target: 1000, perWeek: 210, fromFriends: 0 },
];

function CurGlyph({ cur, size = 13 }) {
  if (cur === 'coin') return (typeof CoinIcon === 'function') ? <CoinIcon size={size} /> : <span>◈</span>;
  return (typeof GemIcon === 'function') ? <GemIcon size={size} /> : <span>◆</span>;
}

function AreaBench({ area, lvl, stats, top, onOpen }) {
  const xpPct = Math.round((lvl.xpToNext / lvl.xpMax) * 100);
  const s = stats || { count: 0, active: 0, tasksDone: 0, tasksTotal: 0, avg: 0 };
  const master = typeof areaIsMaster === 'function' && areaIsMaster(area.id);
  return (
    <button type="button" className={`kbv-area-bench rich ${top ? 'top' : ''} ${master ? 'area-master' : ''}`} style={{ '--c': area.color }} onClick={() => onOpen(area.id)} title={`Abrir ${area.name} en Áreas`}>
      {master && <span className="area-master-stars" aria-hidden="true" />}
      <div className="ab-head">
        <span className="ab-ico"><KIcon name={area.glyph} size={16} /></span>
        <span className="ab-name">{area.name}</span>
        {typeof AreaPrestigeStars === 'function' && <AreaPrestigeStars id={area.id} />}
        {top && <span className="ab-top"><KIcon name="trophy" size={9} /> Prioridad</span>}
        <span className="ab-lvl">Nv. {lvl.level}</span>
        <span className="ab-go"><KIcon name="arrow-right" size={13} /></span>
      </div>
      <div className="ab-bar"><span style={{ width: `${xpPct}%` }} /></div>
      <div className="ab-stats">
        <span className="ab-stat"><strong>{s.active}</strong> proyectos</span>
        <span className="ab-stat"><strong>{s.tasksDone}/{s.tasksTotal || '—'}</strong> tareas</span>
        <span className="ab-stat"><strong>{s.count ? s.avg + '%' : '—'}</strong> avance</span>
      </div>
      <div className="ab-foot">
        <span className="kbv-num">{lvl.xpToNext}/{lvl.xpMax} XP</span>
        <span className="ab-eta"><KIcon name="trending-up" size={10} /> Nv. {lvl.level} · {xpPct}% al siguiente</span>
      </div>
    </button>
  );
}

function WishlistItem({ goal, onContribute, onWithdraw }) {
  const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
  const weeks = Math.max(1, Math.ceil((goal.target - goal.saved) / goal.perWeek));
  const done = goal.saved >= goal.target;
  const own = goal.saved - (goal.fromFriends || 0);
  return (
    <div className={`kbv-wish-item ${done ? 'done' : ''}`}>
      <div className="wi-head">
        <span className="wi-ico"><KIcon name={done ? 'check' : goal.icon} size={16} /></span>
        <div className="wi-id">
          <span className="wi-name">{goal.name}</span>
          <span className="wi-desc">{goal.desc}</span>
        </div>
        <span className={`wi-cur ${goal.cur}`}><CurGlyph cur={goal.cur} size={13} /> {goal.target}</span>
      </div>
      <div className="wi-bar">
        <span className="own" style={{ width: `${pct}%` }} />
        {goal.fromFriends > 0 && <span className="fr" style={{ width: `${Math.min(100, Math.round((goal.fromFriends / goal.target) * 100))}%` }} />}
      </div>
      <div className="wi-foot">
        <span className="wi-prog"><CurGlyph cur={goal.cur} size={11} /> <strong>{Math.min(goal.saved, goal.target)}</strong> / {goal.target} · {pct}%</span>
        {done
          ? <span className="wi-ready"><KIcon name="check" size={11} /> ¡Desbloqueado! Se compró solo</span>
          : <span className="wi-eta"><KIcon name="target" size={11} /> ~{weeks} sem a tu ritmo</span>}
      </div>
      {goal.fromFriends > 0 && !done && (
        <span className="wi-friends"><KIcon name="community" size={11} /> Amigos aportaron <strong>{goal.fromFriends}</strong> de {curLabel(goal.cur === 'gem' ? 'dark' : 'coin')} · no retirables</span>
      )}
      {!done && (
        <div className="wi-actions">
          <button type="button" className="wi-add" onClick={() => onContribute(goal.id)}>
            <KIcon name="plus" size={11} /> Apartar {Math.round(goal.perWeek / 4)}
          </button>
          <button type="button" className="wi-withdraw" disabled={own <= 0} onClick={() => onWithdraw(goal.id)} title={own > 0 ? 'Recupera lo que tú apartaste (lo de amigos no)' : 'No tienes aportes propios para retirar'}>
            <KIcon name="arrow-left" size={11} /> Retirar
          </button>
        </div>
      )}
    </div>
  );
}

// Vitrina (carta de presentación) — identidad + nivel + lo que presumes, todo en
// una sola tarjeta con portada y marco editables. Así te ve la comunidad.
// La Tienda ya no vende cosméticos: las casillas de la carta se compran en
// Personalización → Carta. Este enlace apuntaba a una pestaña que ya no existe.
function goVitrinaTienda() { try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'personalizar', tab: 'carta' } })); } catch (_) {} }

function CallingCard({ user, pres, level, xp = 0, xpMax = 1, etaDays = 0, xpPerDay = 0, paragonLevel = 0, readOnly = false }) {
  const userName = (user?.name || 'Hero').trim() || 'Hero';
  const cos = (typeof useCardCosmetics === 'function') ? useCardCosmetics() : { bg: 'vt-bg-slate', frame: 'vt-fr-none', slots: 3 };
  const slots = cos.slots;
  const pool = React.useMemo(() => {
    const ach = (window.ACHIEVEMENTS || []).filter(a => a.date || a.progress >= a.goal)
      .map(a => ({ key: 'a' + a.id, name: a.secret ? (a.reveal ? a.reveal.name : 'Secreto') : a.name, icon: a.icon, c: (window.ACH_RARITY && window.ACH_RARITY[a.rarity] ? window.ACH_RARITY[a.rarity].c : 'var(--kb-gem)') }));
    const tro = (window.MONTHLY_EMBLEMS || []).map(m => ({ key: 't' + m.id, name: `${m.name} · ${m.month}`, icon: m.icon, c: m.c }));
    return [...tro, ...ach];
  }, []);
  const byKey = k => pool.find(p => p.key === k);

  const PIN_KEY = 'kibo:cardPins', TAG_KEY = 'kibo:cardTagline';
  const [pins, setPins] = React.useState(() => {
    let saved = null; try { saved = JSON.parse(localStorage.getItem(PIN_KEY) || 'null'); } catch (_) {}
    return Array.isArray(saved) ? saved : pool.slice(0, 3).map(p => p.key);
  });
  React.useEffect(() => { try { localStorage.setItem(PIN_KEY, JSON.stringify(pins)); } catch (_) {} }, [pins]);
  const [tagline, setTagline] = React.useState(() => { try { return localStorage.getItem(TAG_KEY) || ''; } catch (_) { return ''; } });
  React.useEffect(() => { try { localStorage.setItem(TAG_KEY, tagline); } catch (_) {} }, [tagline]);

  const [picking, setPicking] = React.useState(null);
  const [editing, setEditing] = React.useState(false);
  // En lectura ninguna casilla es editable, pase lo que pase con el estado.
  const canEdit = !readOnly && editing;

  const view = Array.from({ length: slots }).map((_, i) => pins[i] || null);
  function setPinAt(i, key) { setPins(ps => { const next = Array.from({ length: slots }).map((_, j) => ps[j] || null); next[i] = key; return next; }); }

  const title = pres.master ? 'Leyenda · grado supremo' : pres.prestiged ? `Prestigio ${pres.completed} · ${pres.rank}` : `${RANK_NAMES[rankTier(level)]} · Nv. ${level}`;
  const xpPct = Math.max(0, Math.min(100, Math.round((xp / Math.max(1, xpMax)) * 100)));
  const maxSlots = window.VITRINA_MAX_SLOTS || 6;

  return (
    <div className="kbv-callingcard vt-card">
      {typeof CardBackdrop === 'function' && <CardBackdrop bgId={cos.bg} className="vt-card-bg" />}

      <div className="vt-card-inner">
        <div className="cc-identity">
          <div className="vt-avatar-wrap" style={(typeof frameRingStyle === 'function') ? frameRingStyle(cos.frame) : {}}>
            {typeof UserAvatar === 'function' ? <UserAvatar user={user} size={60} /> : <div className="ch-avatar">{userName[0]}</div>}
            <span className="vt-emblem"><EmblemBadge completed={pres.completed} level={level} master={pres.master} size={28} /></span>
          </div>
          <div className="cc-meta">
            <span className="cc-name">{userName}</span>
            <span className="cc-title">{pres.master ? <><span className="vt-legend">Leyenda</span> · grado supremo</> : title}</span>
            {(() => {
              const t = (typeof cardTitleById === 'function') ? cardTitleById(cos.title) : null;
              return t && t.text ? <span className="vt-honor" style={{ '--c': t.c }}><KIcon name="sparkle" size={9} /> {t.text}</span> : null;
            })()}
            {tagline ? <span className="vt-tagline">{tagline}</span> : null}
          </div>
        </div>

        <div className={`vt-level ${pres.master ? 'legend' : ''}`}>
          <div className="vt-level-head">
            <span className="vt-level-num">{pres.master ? <>Nivel total <strong>{paragonLevel.toLocaleString('es-MX')}</strong></> : <>Nivel <strong>{level}</strong></>}</span>
            <span className="vt-xp kbv-num">{pres.master ? `Paragón · escalón ${Math.floor(paragonLevel / 100) + 1}` : `${xp.toLocaleString('es-MX')} / ${xpMax.toLocaleString('es-MX')} XP`}</span>
          </div>
          <div className={`vt-track ${pres.master ? 'rainbow' : ''}`}><span style={{ width: `${pres.master ? (paragonLevel % 100) : xpPct}%` }} /></div>
          {pres.master
            ? <span className="vt-eta"><KIcon name="sparkle" size={10} /> Trayecto hacia deidad · próximo hito en {100 - (paragonLevel % 100)} niv.</span>
            : (etaDays > 0 ? <span className="vt-eta"><KIcon name="clock" size={10} /> ~{etaDays} días al Nv. {level + 1} <em>(a {xpPerDay} XP/día)</em></span> : null)}
        </div>

        {readOnly ? (
          <button type="button" className="vt-edit-toggle" onClick={goVitrinaTienda} title="Personalizar tu carta">
            <KIcon name="sparkle" size={12} /> Personalizar
          </button>
        ) : (
          <button type="button" className={`vt-edit-toggle ${editing ? 'on' : ''}`} onClick={() => { setEditing(e => !e); setPicking(null); }} title="Editar tu carta de presentación">
            <KIcon name={editing ? 'check' : 'edit'} size={12} /> {editing ? 'Listo' : 'Editar'}
          </button>
        )}
      </div>

      {(() => {
        const pet = (typeof cardPetById === 'function') ? cardPetById(cos.pet) : null;
        return pet && pet.id !== 'vt-pet-none' && typeof KiboPet === 'function'
          ? <span className={`vt-pet ${pet.id}`} aria-hidden="true"><KiboPet gesture={pet.gesture} size={54} every={9000} /></span>
          : null;
      })()}
      <div className="vt-pins-row">
        <span className="vt-pins-label">Presumes</span>
        <div className="cc-pins">
          {view.map((k, i) => {
            const it = byKey(k);
            if (readOnly) {
              // Sin `it` no hay nada que presumir: una casilla vacía en lectura
              // es ruido, no un hueco donde tocar.
              if (!it) return null;
              return (
                <span key={i} className="cc-pin static" style={{ '--c': it.c }}>
                  <span className="cc-pin-ico"><KIcon name={it.icon} size={15} /></span>
                  <span className="cc-pin-name">{it.name}</span>
                </span>
              );
            }
            return (
              <div key={i} className="cc-pin-wrap">
                <button type="button" className={`cc-pin ${it ? '' : 'empty'}`} style={{ '--c': it ? it.c : 'rgba(255,255,255,0.45)' }} onClick={() => setPicking(picking === i ? null : i)} title="Cambiar lo que muestras">
                  <span className="cc-pin-ico"><KIcon name={it ? it.icon : 'plus'} size={15} /></span>
                  <span className="cc-pin-name">{it ? it.name : 'Fijar…'}</span>
                  <KIcon name="edit" size={9} />
                </button>
                {picking === i && (
                  <div className="cc-picker" onMouseLeave={() => setPicking(null)}>
                    {pool.map(p => (
                      <button key={p.key} type="button" className={`cc-pick ${view[i] === p.key ? 'on' : ''}`} style={{ '--c': p.c }}
                        onClick={() => { setPinAt(i, p.key); setPicking(null); }}>
                        <span className="cc-pin-ico"><KIcon name={p.icon} size={13} /></span> {p.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {readOnly && !view.some(Boolean) && (
            <span className="cc-pin static empty-note">Todavía no presumes nada</span>
          )}
          {!readOnly && slots < maxSlots ? (
            <button type="button" className="cc-pin add-slot" onClick={goVitrinaTienda} title="Compra más casillas en Personalización">
              <span className="cc-pin-ico"><KIcon name="plus" size={15} /></span>
              <span className="cc-pin-name">Más casillas</span>
            </button>
          ) : null}
        </div>
      </div>

      {canEdit ? (
        <div className="vt-edit-panel">
          <div className="vt-edit-group">
            <span className="vt-edit-label">Portada</span>
            <div className="vt-swatches">
              {(window.CARD_BACKGROUNDS || []).map(b => {
                const owned = (typeof ownsCard === 'function') ? ownsCard(b.id) : true;
                const on = cos.bg === b.id;
                return (
                  <button key={b.id} type="button" className={`vt-swatch ${on ? 'on' : ''} ${owned ? '' : 'locked'}`}
                    style={{ background: b.css === 'placeholder' ? 'repeating-linear-gradient(45deg,var(--kb-border-soft),var(--kb-border-soft) 6px,var(--kb-border) 6px,var(--kb-border) 12px)' : b.css }}
                    onClick={() => { if (owned) setCardBg(b.id); else goVitrinaTienda(); }}
                    title={owned ? b.name : `${b.name} · conseguir en Tienda`}>
                    {on ? <KIcon name="check" size={12} /> : null}
                    {!owned ? <span className="vt-swatch-lock"><KIcon name="shop" size={10} /></span> : null}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="vt-edit-group">
            <span className="vt-edit-label">Marco de la foto</span>
            <div className="vt-swatches">
              {(window.CARD_FRAMES || []).map(f => {
                const owned = (typeof ownsCard === 'function') ? ownsCard(f.id) : true;
                const on = cos.frame === f.id;
                return (
                  <button key={f.id} type="button" className={`vt-swatch frame ${on ? 'on' : ''} ${owned ? '' : 'locked'}`}
                    style={f.ring !== 'none' ? { boxShadow: 'inset ' + f.ring } : {}}
                    onClick={() => { if (owned) setCardFrame(f.id); else goVitrinaTienda(); }}
                    title={owned ? f.name : `${f.name} · conseguir en Tienda`}>
                    {on ? <KIcon name="check" size={12} /> : null}
                    {!owned ? <span className="vt-swatch-lock"><KIcon name="shop" size={10} /></span> : null}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="vt-edit-group wide">
            <span className="vt-edit-label">Tu frase (opcional)</span>
            <input type="text" className="vt-tag-input" value={tagline} maxLength={48} placeholder="p. ej. Construyendo hábitos, un día a la vez"
              onChange={e => setTagline(e.target.value)} />
          </div>
          <button type="button" className="vt-tienda-link" onClick={goVitrinaTienda}>
            <KIcon name="shop" size={12} /> Conseguir portadas, marcos y casillas
          </button>
        </div>
      ) : null}

      <span className="cc-hint">
        Tu carta de presentación · así te ve la comunidad.
        {readOnly ? ' Personalízala desde el botón de arriba.' : ' Edita portada, marco y lo que presumes.'}
      </span>
    </div>
  );
}

function CharacterScreen({ user, stats, onNavigate }) {
  const userName = (user?.name || 'Hero').trim() || 'Hero';
  const level = stats?.level ?? 8;
  const xp = stats?.xp ?? 2480;
  const xpMax = stats?.xpMax ?? 4000;
  const xpPerDay = 312;
  const completed = stats?.prestigeMaster ? 16 : (stats?.prestigeCompleted ?? DEMO_PRESTIGE_COMPLETED);
  const pres = prestigeInfo(completed, level);
  const paragonLevel = (completed >= 16) ? (stats?.paragonLevel ?? 340) : 0;
  const xpToLevel = Math.max(0, xpMax - xp);
  const etaDays = Math.max(1, Math.ceil(xpToLevel / xpPerDay));

  // Filtro de periodo — gobierna TODOS los gráficos de esta sección.
  const [period, setPeriod, meta] = usePeriod('30d');

  // Emblema equipado (para el hero) — re-render al cambiar.
  const [, forceTick] = React.useState(0);
  React.useEffect(() => {
    const h = () => forceTick(t => t + 1);
    window.addEventListener('kibo:emblem-change', h);
    return () => window.removeEventListener('kibo:emblem-change', h);
  }, []);

  const [goals, setGoals] = React.useState(WISHLIST);
  const [slots, setSlots] = React.useState(4); // máx. de objetos en la lista
  function contribute(id) {
    setGoals(gs => gs.map(g => g.id === id ? { ...g, saved: Math.min(g.target, g.saved + Math.round(g.perWeek / 4)) } : g));
  }
  function withdraw(id) {
    setGoals(gs => gs.map(g => {
      if (g.id !== id) return g;
      const own = g.saved - (g.fromFriends || 0);      // lo de amigos NO se retira
      if (own <= 0) return g;
      const step = Math.min(own, Math.max(5, Math.round(g.perWeek / 4)));
      return { ...g, saved: g.saved - step };
    }));
  }
  // Totales apartados (separando monedas y fragmentos; y lo intocable de amigos)
  const reservedGems = goals.reduce((s, g) => s + (g.cur === 'gem' ? Math.min(g.saved, g.target) : 0), 0);
  const reservedCoins = goals.reduce((s, g) => s + (g.cur === 'coin' ? Math.min(g.saved, g.target) : 0), 0);
  const friendGems = goals.reduce((s, g) => s + (g.cur === 'gem' ? (g.fromFriends || 0) : 0), 0);

  // Navegar a un área concreta (deep-link)
  function openArea(areaId) {
    try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'areas', area: areaId } })); }
    catch (_) { onNavigate && onNavigate('areas'); }
  }

  // Datos por área
  const areaIds = user?.areas || ['vigor', 'wisdom', 'wealth', 'community', 'will'];
  const areas = areaIds.map(id => (typeof KIBO_AREAS_V2 !== 'undefined') ? KIBO_AREAS_V2.find(a => a.id === id) : null).filter(Boolean);
  const areaLevels = (typeof AREA_LEVELS_V2 !== 'undefined') ? AREA_LEVELS_V2 : {};
  const areaXP = areas.map(a => ({ a, xp: (areaLevels[a.id]?.level || 1) * 100 + (areaLevels[a.id]?.xpToNext || 0) }));
  const totalAreaXP = areaXP.reduce((s, x) => s + x.xp, 0) || 1;

  // Detalle por área: proyectos activos, tareas y % de avance
  const projByArea = (typeof DEMO_PROJECTS_BY_AREA !== 'undefined') ? DEMO_PROJECTS_BY_AREA : {};
  const areaStats = {};
  areas.forEach(a => {
    const ps = projByArea[a.id] || [];
    let dT = 0, tT = 0;
    ps.forEach(p => { const m = /(\d+)\/(\d+)/.exec(p.tasks || ''); if (m) { dT += +m[1]; tT += +m[2]; } });
    areaStats[a.id] = { count: ps.length, active: ps.filter(p => p.status !== 'done').length, tasksDone: dT, tasksTotal: tT, avg: ps.length ? Math.round(ps.reduce((s, p) => s + p.progress, 0) / ps.length) : 0 };
  });
  // Área prioritaria = la de mayor XP acumulado
  const topAreaId = [...areaXP].sort((x, y) => y.xp - x.xp)[0]?.a.id;

  // ETA al próximo prestigio según el ritmo
  const levelsToCap = Math.max(0, 100 - level);
  const daysToPrestige = Math.max(1, Math.round(levelsToCap * xpMax / xpPerDay));
  const etaPrestigeTxt = daysToPrestige >= 60 ? `~${Math.round(daysToPrestige / 30)} meses` : `~${daysToPrestige} días`;
  // El nombre sale de la familia elegida (el `sub` sigue siendo el del viaje):
  // leerlo de CELESTIAL hacía que la MISMA pantalla mostrara el mismo prestigio
  // con dos nombres distintos a la vez.
  if (typeof usePrestigeRepaint === 'function') usePrestigeRepaint();
  const nextBase = (typeof CELESTIAL !== 'undefined') ? (CELESTIAL[completed] || CELESTIAL[CELESTIAL.length - 1]) : { name: 'tu próximo destino', sub: '' };
  const nextDest = { ...nextBase, name: (typeof prestigeName === 'function' ? prestigeName(Math.min(completed + 1, 16)) : nextBase.name) };

  // Series para gráficos (responden al periodo)
  const xpSeries = React.useMemo(() => genSeries(period, { seed: 11, base: 280, growth: 0.32, vol: 0.30 }), [period]);
  const weeklySeries = React.useMemo(() => genSeries(period, { seed: 47, base: 320, growth: 0.26, vol: 0.22 }), [period]);
  const benchRnd = mulberry(meta.days * 7 + 3);

  // Proyección
  const projGain = Math.round(xpPerDay * meta.days * 0.55);
  const projLevels = Math.max(1, Math.round(projGain / xpMax));

  return (
    <div className="kbv-main kbv-char">
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--kb-primary)' }}>Perfil · Indicadores personales</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Mi progreso. <InfoDot label="i" text={"Una lectura honesta de cómo avanzas: tu nivel y prestigio, tus números a lo largo del tiempo, dónde inviertes energía y qué te falta para tu próxima meta."} /></h1>
        </div>
      </div>

      {/* VITRINA — carta de presentación (identidad + nivel + lo que presumes) */}
      <CallingCard readOnly user={user} pres={pres} level={level} xp={xp} xpMax={xpMax} etaDays={etaDays} xpPerDay={xpPerDay} paragonLevel={paragonLevel} />

      {/* PROGRESIÓN — rangos (1-100) → prestigios estelares (estilo COD) */}
      <SectionHead title={pres.prestiged ? 'Prestigio y emblemas' : 'Rango y progresión'} />
      <div className="kbv-card kbv-char-card">
        <ProgressPanel completed={pres.completed} level={level} master={pres.master} paragonLevel={paragonLevel} onPrestige={() => {}} />
      </div>

      {/* LOGROS */}
      <SectionHead title="Logros" meta="Tu vitrina y trofeos del mes · estandartes de retos · catálogo completo" />
      <div className="kbv-card kbv-char-card">
        {typeof AchievementsPanel === 'function' && <AchievementsPanel />}
      </div>

      {/* FILTRO DE PERIODO — gobierna los gráficos de abajo */}
      <PeriodFilter period={period} onChange={setPeriod} label="Periodo · afecta los indicadores y gráficos" />

      {/* BENCHMARKS GENERALES — con periodo + mini tendencia */}
      <SectionHead title="Tus números" meta={`${meta.note} · histórico y tendencia`} />
      <div className="kbv-char-bench-grid">
        {CHAR_BENCH.map(b => {
          const s = scaleBench(b, meta, benchRnd);
          return (
            <div key={b.id} className="kbv-bench" style={{ '--c': b.c }}>
              <div className="bn-top">
                <span className="bn-ico"><KIcon name={b.icon} size={15} /></span>
                <span className="bn-label">{b.label}</span>
              </div>
              <span className="bn-val">{s.val}{b.sfx && <small>{b.sfx}</small>}</span>
              <span className={`bn-delta ${s.up ? 'up' : ''}`}>{s.delta}</span>
              <Sparkline seed={b.seed} color={b.c.startsWith('var') ? 'var(--kb-primary)' : b.c} period={period} />
            </div>
          );
        })}
      </div>

      {/* GRÁFICOS DE TENDENCIA */}
      <div className="kbv-char-charts">
        <div className="kbv-card kbv-char-card">
          <SectionHead tight level={4} title="XP a lo largo del tiempo" meta={`${meta.note} · ${fmtN(xpSeries.total)} XP en total`}>
            <span className="kbv-chart-pill" style={{ '--c': 'var(--kb-primary)' }}><span className="dot" /> XP por {meta.unitLabel}</span>
          </SectionHead>
          <LineChart series={xpSeries} color="var(--kb-primary)" height={170} unit="" />
        </div>

        <div className="kbv-card kbv-char-card">
          <SectionHead tight level={4} title="XP acumulado + proyección" meta={`${meta.note} · curva acumulada`}>
            <span className="kbv-chart-pill" style={{ '--c': 'var(--kb-gem)' }}><span className="dot" /> Proyección</span>
          </SectionHead>
          <LineChart series={xpSeries} color="var(--kb-gem)" height={170} cumulative={true} projection={Math.round(xpSeries.points.length * 0.35)}
            projectionLabel={`Si mantienes ~${xpPerDay} XP/día, sumas ~${fmtN(projGain)} XP (~${projLevels} niveles) en lo que resta del periodo.`} />
        </div>
      </div>

      {/* PROYECCIÓN — ETA a nivel y a próximo prestigio según el periodo */}
      <div className="kbv-proj-callout">
        <span className="pc-ico"><KIcon name="trending-up" size={18} /></span>
        <div className="pc-body">
          <span className="pc-title">A tu ritmo · {meta.l.toLowerCase()}</span>
          <span className="pc-text">
            En <strong>{meta.l.toLowerCase()}</strong> proyectas <strong>+{fmtN(projGain)} XP</strong> (~{projLevels} niveles). Manteniendo ~{xpPerDay} XP/día:
          </span>
          <div className="pc-etas">
            <span className="pc-eta"><span className="pc-eta-v">~{etaDays} d</span><span className="pc-eta-l">al Nv. {level + 1}</span></span>
            {!pres.master
              ? <span className="pc-eta"><span className="pc-eta-v">{etaPrestigeTxt}</span><span className="pc-eta-l">al {pres.prestiged ? `Prestigio ${completed + 1}` : '1er prestigio'} · {nextDest.name}</span></span>
              : <span className="pc-eta"><span className="pc-eta-v">~{Math.max(1, Math.round((100 - (paragonLevel % 100)) * xpMax / xpPerDay / 30))} m</span><span className="pc-eta-l">al próximo hito de paragón</span></span>}
            <span className="pc-eta"><span className="pc-eta-v">{nextDest.name}</span><span className="pc-eta-l">próximo destino · {nextDest.sub}</span></span>
          </div>
        </div>
      </div>

      {/* CONSISTENCIA + RITMO POR DÍA */}
      <div className="kbv-char-charts">
        <div className="kbv-card kbv-char-card">
          <SectionHead tight title="Consistencia" meta="Mapa de actividad · últimos 6 meses" />
          <ConsistencyHeatmap period={period} />
        </div>
        <div className="kbv-card kbv-char-card">
          <SectionHead tight title="Tu ritmo por día" meta={`${meta.note} · en qué días generas más XP`} />
          <WeekdayBars period={period} color="var(--kb-primary)" />
        </div>
      </div>

      {/* POR ÁREA — detalle + acceso directo */}
      <div className="kbv-card kbv-char-card">
        <SectionHead tight title="Por área de vida" meta="Proyectos, tareas y avance · toca para abrir el área" action="Ver áreas" onAction={() => onNavigate && onNavigate('areas')} />
        <div className="kbv-area-dist-frame">
          <div className="kbv-area-dist">
            {areaXP.map(({ a, xp }) => (
              <div key={a.id} className="seg" style={{ width: `${(xp / totalAreaXP) * 100}%`, background: a.color }} title={`${a.name}: ${Math.round((xp / totalAreaXP) * 100)}%`} />
            ))}
          </div>
          <div className="kbv-area-dist-legend">
            {areaXP.map(({ a, xp }) => (
              <span key={a.id} className="lg"><span className="dot" style={{ background: a.color }} />{a.name} · {Math.round((xp / totalAreaXP) * 100)}%</span>
            ))}
          </div>
        </div>
        <div className="kbv-area-bench-grid">
          {areas.map(a => areaLevels[a.id] && <AreaBench key={a.id} area={a} lvl={areaLevels[a.id]} stats={areaStats[a.id]} top={a.id === topAreaId} onOpen={openArea} />)}
        </div>
      </div>

    </div>
  );
}

Object.assign(window, {
  CharacterScreen, CallingCard, prestigeInfo,
  // La lista de deseos vive ahora en la Tienda (economía real).
  WISHLIST, WishlistItem, CurGlyph,
});
