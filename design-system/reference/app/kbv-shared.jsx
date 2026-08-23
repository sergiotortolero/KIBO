// kbv-shared.jsx — componentes canónicos de reutilización.
// Decisiones de unificación (turno 1): 1c tarjeta de hábito · 1g tarjeta de item · 1i barra de meta.
// Una sola implementación para toda la plataforma; las pantallas la envuelven, no la copian.

// ── 1c · Tarjeta de hábito ───────────────────────────────────────
// Check tocable + racha (del tablero) + semana y recompensa (del catálogo).
function KbHabitCard({ h, onToggle, onOpen, onEdit, onDelete, compact }) {
  const color = h.color || h.c || 'var(--kb-primary)';
  const week = Array.isArray(h.weeklyHistory) ? h.weeklyHistory : null;
  const rw = (h.energy != null && h.effort != null && typeof habitReward === 'function')
    ? habitReward(h.energy, h.effort)
    : { xp: h.xp != null ? h.xp : 10, coins: h.coins != null ? h.coins : null };
  const sched = h.schedule || h.when || null;
  const cls = ['kbv-habit-card', h.done ? 'done' : '', compact ? 'compact' : ''].filter(Boolean).join(' ');
  return (
    <div className={cls} style={{ '--c': color }}
         onClick={() => onOpen && onOpen(h)}>
      <button type="button" className="oh-check" aria-label={h.done ? 'Desmarcar hábito' : 'Marcar hecho'}
              onClick={(e) => { e.stopPropagation(); onToggle && onToggle(h.id); }}>
        {h.done && <KIcon name="check" size={compact ? 15 : 18} />}
      </button>
      <div className="oh-body">
        <div className="oh-top">
          <span className="oh-ico"><KIcon name={h.icon || 'flame'} size={13} /></span>
          <span className="oh-name" title={h.name}>
            {h.name}
            {h.fromReto && <span className="kbv-from-reto" title="Hábito heredado de un reto"><KIcon name="sword" size={9} /> De reto</span>}
          </span>
          {h.streak != null && <span className="oh-streak">🔥 {h.streak}d</span>}
        </div>
        {week && (
          <div className="oh-week">
            {['L','M','X','J','V','S','D'].map((d, i) => (
              <span key={i} className={`d ${week[i] ? 'on' : ''}`} title={d}>{d}</span>
            ))}
          </div>
        )}
        <div className="oh-foot">
          {sched && <span className="oh-sched"><KIcon name="clock" size={9} /> {sched}</span>}
          <span className="oh-xp">+{rw.xp} XP{rw.coins != null ? ` · +${rw.coins} mon.` : ''}</span>
          {(onEdit || onDelete) && (
            <div className="oh-actions" onClick={(e) => e.stopPropagation()}>
              {onEdit && (
                <button type="button" className="ic-btn" title="Editar" onClick={() => onEdit(h)}>
                  <KIcon name="edit" size={11} />
                </button>
              )}
              {onDelete && (
                <button type="button" className="ic-btn danger" title="Eliminar" onClick={() => onDelete(h.id)}>
                  <KIcon name="trash" size={11} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 1g · Tarjeta de item ─────────────────────────────────────────
// Base Vitrina: el arte manda y el precio va en el botón.
// Tienda, regalos a amigos, catálogo de widgets y cosméticos.
function ItemCard({ item, onBuy, onEdit, onDelete, actionLabel, disabled }) {
  const color = item.color || item.c || 'var(--kb-primary)';
  const currency = item.currency || item.cur || 'coin';
  const cost = item.cost != null ? item.cost : 0;
  const free = item.free || cost === 0;
  const owned = !!item.owned;
  return (
    <div className={`kbv-item-card ${owned ? 'owned' : ''}`} style={{ '--c': color }}>
      <div className="oiv-art">
        {item.customImage
          ? <span className="oiv-emoji">{item.customImage}</span>
          : <KIcon name={item.icon || 'sparkle'} size={38} />}
        {item.kind && <span className="oiv-kind">{item.kind}</span>}
        {item.custom && <span className="oiv-kind own">Tuya</span>}
      </div>
      <div className="oiv-body">
        <span className="oiv-name">{item.name}</span>
        {item.desc && <span className="oiv-desc">{item.desc}</span>}
      </div>
      {owned ? (
        <span className="oiv-owned"><KIcon name="check" size={13} /> Tuyo</span>
      ) : (
        <button type="button" className={`oiv-buy ${free ? 'free' : ''}`} disabled={disabled}
                onClick={() => onBuy && onBuy(item)}>
          {free ? 'Gratis' : (
            <React.Fragment>
              {currency === 'gem' ? <GemIcon size={13} /> : <CoinIcon size={13} />}
              {cost.toLocaleString('es-MX')}
            </React.Fragment>
          )}
          {actionLabel ? ` · ${actionLabel}` : ''}
        </button>
      )}
      {(onEdit || onDelete) && (
        <div className="oiv-actions">
          {onEdit && <button type="button" title="Editar" onClick={() => onEdit(item)}><KIcon name="edit" size={12} /></button>}
          {onDelete && <button type="button" className="danger" title="Borrar" onClick={() => onDelete(item)}><KIcon name="x" size={12} /></button>}
        </div>
      )}
    </div>
  );
}

// ── 1i · Barra de meta ───────────────────────────────────────────
// Donde hay dinero de por medio: deseos de amigos y ahorro de Finanzas.
// Cursos e hitos de proyecto conservan su barra simple.
function GoalBar({ label, who, cur, target, capPct, currency, money, color, head = true, right }) {
  const pct = target > 0 ? Math.min(100, Math.round((cur / target) * 100)) : 0;
  const fmt = (n) => (money ? '$' : '') + Number(n).toLocaleString('es-MX');
  return (
    <div className="kbv-goal unified" style={color ? { '--goal-c': color } : undefined}>
      {head && (
        <div className="og-head">
          <span className="og-name">{label}</span>
          <span className={`og-cur ${currency || ''}`}>
            {currency === 'gem' ? '◆' : currency === 'coin' ? '●' : ''} {fmt(target)}
          </span>
        </div>
      )}
      <div className="og-bar">
        <i style={{ width: pct + '%' }} />
        {capPct != null && <span className="cap" style={{ left: capPct + '%' }} title={`Tope: ${capPct}%`} />}
      </div>
      <div className="og-foot">
        <span className="kbv-meta">{fmt(cur)} · {pct}%</span>
        {who && <span className="kbv-meta">{who}</span>}
        {right && <span className="og-right" onClick={(e) => e.stopPropagation()}>{right}</span>}
      </div>
    </div>
  );
}

// ── 2i · SectionHead ─────────────────────────────────────────────
// Un solo encabezado de sección: título + meta + acción, siempre igual.
function SectionHead({ title, meta, action, onAction, level = 3, tight, children }) {
  const H = level === 4 ? 'h4' : 'h3';
  return (
    <div className={`kbv-section-head ${tight ? 'tight' : ''}`}>
      <div className="sh-id">
        {React.createElement(H, { className: level === 4 ? 'kbv-h4' : 'kbv-h3' }, title)}
        {meta && <span className="kbv-meta">{meta}</span>}
      </div>
      {children}
      {action && (
        <button type="button" className="kbv-btn kbv-btn-ghost sh-act" onClick={onAction}>
          {action} <KIcon name="arrow-right" size={12} />
        </button>
      )}
    </div>
  );
}

// ── 2k · MoneyRow ────────────────────────────────────────────────
// Cuentas, créditos y suscripciones: ícono + nombre + meta + monto.
function MoneyRow({ icon, color, name, meta, amount, suffix, negative, onClick, right }) {
  const Tag = onClick ? 'button' : 'div';
  const props = onClick ? { type: 'button', onClick } : {};
  return (
    <Tag className="kbv-money-row" style={{ '--c': color || 'var(--kb-primary)' }} {...props}>
      <span className="mr-ico"><KIcon name={icon || 'wealth'} size={15} /></span>
      <div className="mr-id">
        <span className="mr-name">{name}</span>
        {meta && <span className="mr-meta">{meta}</span>}
      </div>
      <span className={`mr-amt ${negative ? 'debt' : ''}`}>
        {negative ? '−' : ''}${Math.abs(Number(amount) || 0).toLocaleString('es-MX')}
        {suffix && <small>{suffix}</small>}
      </span>
      {right}
      {onClick && <KIcon name="arrow-right" size={11} style={{ color: 'var(--kb-text-3)' }} />}
    </Tag>
  );
}

// ── 2m · EmptyState ──────────────────────────────────────────────
// El vacío enseña qué es la sección y ofrece cómo llenarla.
function EmptyState({ icon, title, body, action, onAction, compact }) {
  return (
    <div className={`kbv-empty-state ${compact ? 'compact' : ''}`}>
      <span className="es-ico"><KIcon name={icon || 'sparkle'} size={compact ? 17 : 22} /></span>
      {title && <span className="es-title">{title}</span>}
      {body && <span className="kbv-meta">{body}</span>}
      {action && (
        <button type="button" className="kbv-btn kbv-btn-primary es-act" onClick={onAction}>
          <KIcon name="plus" size={13} /> {action}
        </button>
      )}
    </div>
  );
}

// ── 2g · PersonRow ───────────────────────────────────────────────
// Liga, aportantes y cualquier lista de personas. La métrica de la
// derecha se configura por sección; el resto es idéntico.
function PersonRow({ person, rank, metric, you, actions, onClick }) {
  const p = person || {};
  const m = metric || {};
  const Tag = onClick ? 'button' : 'div';
  const props = onClick ? { type: 'button', onClick } : {};
  return (
    <Tag className={`kbv-person-row lg ${p.risk ? 'risk' : ''} ${you ? 'you' : ''}`} {...props}>
      {rank != null && <span className="pr-rank">{rank}</span>}
      <span className="pr-av" style={{ '--c': p.color || 'var(--kb-primary)' }}>
        {(p.name || '?')[0]}{p.online && <i className="fr-dot" />}
      </span>
      <div className="pr-id">
        <span className="pr-name">{p.name}{you && <em> · tú</em>}</span>
        <span className="pr-meta">
          Nv. {p.level}
          {p.streak != null && <React.Fragment> · <span className={p.streak === 0 ? 'fr-streak-zero' : 'fr-streak'}>🔥 {p.streak} d</span></React.Fragment>}
          {p.note && ` · ${p.note}`}
        </span>
      </div>
      {m.value != null && (
        <div className="pr-metric">
          <span className="v">{typeof m.value === 'number' ? m.value.toLocaleString('es-MX') : m.value}</span>
          <span className="l">{m.label}</span>
        </div>
      )}
      {actions && <div className="pr-actions">{actions}</div>}
    </Tag>
  );
}

// ── 2o · PriorityRow + RateRow ───────────────────────────────────
const KB_PRIORITIES = [
  { id: 'urgent', label: 'Urgente', color: 'var(--pri-urgent)' },
  { id: 'high', label: 'Alta', color: 'var(--pri-high)' },
  { id: 'medium', label: 'Media', color: 'var(--pri-medium)' },
  { id: 'low', label: 'Baja', color: 'var(--pri-low)' },
  { id: 'vlow', label: 'Muy baja', color: 'var(--pri-vlow)' },
];

function PriorityRow({ value, onChange, compact }) {
  const hasGlyph = typeof PriorityIcon === 'function';
  return (
    <div className={`kbv-priority-row ${compact ? 'compact' : ''} ${hasGlyph ? 'glyphs' : ''}`}>
      {KB_PRIORITIES.map(p => (
        <button key={p.id} type="button" className={`kbv-pri ${value === p.id ? 'on' : ''}`}
                style={{ '--c': p.color }} onClick={() => onChange && onChange(p.id)} title={p.label}>
          {hasGlyph ? <PriorityIcon level={p.id} size={16} /> : <i />}
          {!compact && p.label}
        </button>
      ))}
    </div>
  );
}

// RateRow — la escala 1–5 canónica. Adopta el control de íconos del modal de
// hábito (llamas para esfuerzo, glifos para prioridad) en vez de números sueltos.
function RateRow({ label, hint, value, onChange, color, labels, icon = 'flame', showValue = true, compact, readOnly }) {
  return (
    <div className={`kbv-rate-scale ${compact ? 'compact' : ''}`} style={color ? { '--c': color } : undefined}>
      {(label || hint) && (
        <div className="rr-head">
          {label && <span className="rr-lbl">{label}</span>}
          {hint && <span className="kbv-meta">{hint}</span>}
        </div>
      )}
      <div className="rr-dots">
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} type="button" className={`rr-dot ${n <= (value || 0) ? 'on' : ''}`} disabled={readOnly}
                  onClick={() => onChange && onChange(n)} title={(labels && labels[n - 1]) || `${n}/5`}>
            <KIcon name={icon} size={compact ? 12 : 14} />
          </button>
        ))}
        {showValue && <span className="rr-val">{value || 0}/5</span>}
      </div>
    </div>
  );
}

// ── 2q · KbStepper · campo numérico ──────────────────────────────
// Reemplaza los <input type="number"> sueltos: mismo alto, misma etiqueta y
// una línea de ayuda que no descuadra la fila cuando falta.
function KbStepper({ label, value, onChange, min = 0, max = 999, step = 1, hint, suffix, tone }) {
  const v = Number(value) || 0;
  const set = (n) => onChange && onChange(Math.min(max, Math.max(min, n)));
  return (
    <div className={`kbv-stepper ${tone ? 'tone-' + tone : ''}`}>
      {label && <label>{label}</label>}
      <div className="st-ctl">
        <button type="button" onClick={() => set(v - step)} disabled={v <= min} aria-label="Restar">
          <KIcon name="minus" size={13} />
        </button>
        <span className="st-val">
          <input type="number" value={value} min={min} max={max}
                 onChange={(e) => set(parseInt(e.target.value || String(min), 10))} />
          {suffix && <em>{suffix}</em>}
        </span>
        <button type="button" onClick={() => set(v + step)} disabled={v >= max} aria-label="Sumar">
          <KIcon name="plus" size={13} />
        </button>
      </div>
      <span className="st-hint">{hint || ''}</span>
    </div>
  );
}

// ── 2p · Scale5 · el medidor 1–5 de solo lectura ─────────────────
// Un único indicador para toda escala 1–5 que solo se lee (tarjetas,
// filtros, detalles): 5 barras ascendentes. Sustituye a los rayos de
// energía, las estrellas y los pips sueltos.
function Scale5({ value = 0, max = 5, color, size = 1, label = 'Nivel' }) {
  const c = color || 'var(--kb-streak)';
  return (
    <span className="kbv-diff-meter" style={{ height: 18 * size }}
          title={`${label} ${value}/${max}`} aria-label={`${label} ${value} de ${max}`}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={`bar ${n <= value ? 'on' : ''}`}
              style={{ width: 4 * size, height: (5 + n * 2.5) * size,
                       background: n <= value ? c : 'var(--kb-surface-2)' }} />
      ))}
    </span>
  );
}

// Mapa semántico: un concepto ⇒ un ícono y un color, en toda la plataforma.
const KB_SCALES = {
  esfuerzo:  { icon: 'flame',      color: 'var(--kb-streak)',     label: 'Esfuerzo' },
  dificultad:{ icon: 'sword',      color: 'var(--kb-boss)',       label: 'Dificultad' },
  cognitivo: { icon: 'wisdom',     color: 'var(--area-wisdom)',   label: 'Esfuerzo cognitivo' },
  previo:    { icon: 'graduation', color: 'var(--area-community)',label: 'Conocimiento previo' },
  interes:   { icon: 'sparkle',    color: 'var(--kb-primary)',    label: 'Interés' },
};

// ── 2b · Confirmación en el pie ──────────────────────────────────
// Reemplaza los modales anidados y los confirm() del navegador.
function ConfirmFooter({ message, confirmLabel = 'Sí, continuar', cancelLabel = 'No', danger = true, onConfirm, onCancel }) {
  return (
    <div className={`kbv-confirm-strip ${danger ? 'danger' : ''}`}>
      <span className="cs-msg"><KIcon name={danger ? 'alert' : 'sparkle'} size={13} /> {message}</span>
      <div className="cs-acts">
        <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onCancel}>{cancelLabel}</button>
        <button type="button" className={`kbv-btn ${danger ? 'kbv-btn-danger' : 'kbv-btn-primary'}`} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </div>
  );
}

// Confirmación suelta (fuera de un modal): marco Kibo tamaño sm.
function ConfirmDialog({ title, message, confirmLabel = 'Sí, eliminar', cancelLabel = 'Cancelar', danger = true, onConfirm, onClose }) {
  return (
    <KBVModal title={title} size="sm" onClose={onClose}
      footer={<ConfirmFooter message={message} confirmLabel={confirmLabel} cancelLabel={cancelLabel}
                             danger={danger} onConfirm={() => { onConfirm && onConfirm(); onClose && onClose(); }}
                             onCancel={onClose} />}>
      <p className="kbv-body">{message}</p>
    </KBVModal>
  );
}

// Hook: pide confirmación sin ventanas del navegador.
//   const [ask, dialog] = useConfirm();  …  ask({ title, message, onConfirm })
function useConfirm() {
  const [req, setReq] = React.useState(null);
  const ask = React.useCallback((cfg) => setReq(cfg), []);
  const dialog = req
    ? <ConfirmDialog {...req} onClose={() => setReq(null)} />
    : null;
  return [ask, dialog];
}

// ── 2b-bis · Preferencias vivas ────────────────────────────────────────
// Las prefs se leían de localStorage en cada render, pero nada avisaba de un
// cambio: cambiar «menú fijo» en Configuración no hacía nada hasta recargar.
// Un solo evento las vuelve reactivas para cualquier pantalla.
const KB_PREFS_KEY = 'kibo:prefs';
function kbGetPrefs() {
  try { return JSON.parse(localStorage.getItem(KB_PREFS_KEY) || '{}'); } catch (_) { return {}; }
}
function kbSetPref(k, v) {
  const next = { ...kbGetPrefs(), [k]: v };
  try { localStorage.setItem(KB_PREFS_KEY, JSON.stringify(next)); } catch (_) {}
  try { window.dispatchEvent(new CustomEvent('kibo:prefs', { detail: next })); } catch (_) {}
  return next;
}
function useKbPrefs() {
  const [p, setP] = React.useState(kbGetPrefs);
  React.useEffect(() => {
    const h = () => setP(kbGetPrefs());
    window.addEventListener('kibo:prefs', h);
    window.addEventListener('storage', h);
    return () => { window.removeEventListener('kibo:prefs', h); window.removeEventListener('storage', h); };
  }, []);
  return p;
}

// ── 2b-ter · Divisas: un solo sitio por donde pasan ────────────────────
// La divisa personalizada se quedaba en su pantalla de ajustes porque cada
// sitio dibujaba `CoinIcon`/`GemIcon` a mano. Estos dos ayudantes leen el
// guardarropa de divisas, así renombrar o recolorear se ve en todas partes.
function curLabel(kind) {
  return (typeof csLabel === 'function') ? csLabel(kind) : (kind === 'coin' ? 'Monedas' : 'Materia oscura');
}
function curGlyph(kind, size) {
  const skin = (typeof csGet === 'function') ? csGet(kind) : null;
  if (skin && typeof CurrencyGlyph === 'function') {
    return React.createElement(CurrencyGlyph, { glyph: skin.glyph, color: skin.color, size: size || 16 });
  }
  const F = kind === 'coin' ? window.CoinIcon : window.GemIcon;
  return F ? React.createElement(F, { size: size || 16 }) : null;
}
// Repinta al cambiar la divisa: sin esto el HUD se queda con la anterior.
function useCurrencyRepaint() {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => {
    const h = () => force();
    window.addEventListener('kibo:currency-change', h);
    return () => window.removeEventListener('kibo:currency-change', h);
  }, []);
}

// ── 2b-quater · La migaja de sección, derivada del menú ────────────────
// Cada pantalla escribía «Trabajo · …» o «Más · …» a mano: al reagrupar el
// menú, las 18 migajas quedaron nombrando grupos que ya no existen. Ahora la
// primera mitad sale de `DEFAULT_SIDEBAR_SECTIONS`, el único sitio donde vive
// la agrupación.
function sectionNameOf(screenId) {
  const secs = window.DEFAULT_SIDEBAR_SECTIONS || [];
  for (const s of secs) {
    if ((s.items || []).some(it => it.id === screenId)) return s.name;
  }
  return 'General';
}
// La migaja completa: grupo (derivado) + de qué va la pantalla (suyo).
function crumb(screenId, what) {
  const g = sectionNameOf(screenId);
  return what ? g + ' · ' + what : g;
}

// ── 2c · TextPromptDialog ──────────────────────────────────────────────
// Alta rápida de un solo campo — reemplaza los prompt() del navegador.
function TextPromptDialog({ title, sub, label = 'Nombre', placeholder = '', confirmLabel = 'Agregar', value = '', onSubmit, onClose }) {
  const [val, setVal] = React.useState(value);
  const submit = () => { if (!val.trim()) return; onSubmit && onSubmit(val.trim()); onClose && onClose(); };
  return (
    <KBVModal title={title} sub={sub} size="md" onClose={onClose}
      footer={<div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
        <button type="button" className="kbv-btn kbv-btn-primary" disabled={!val.trim()} onClick={submit}>
          {confirmLabel} <KIcon name="check" size={14} />
        </button>
      </div>}>
      <div className="kbv-form-row">
        <label>{label} *</label>
        <input type="text" value={val} autoFocus placeholder={placeholder}
               onChange={(e) => setVal(e.target.value)}
               onKeyDown={(e) => { if (e.key === 'Enter') submit(); }} />
      </div>
    </KBVModal>
  );
}

// Hook gemelo de useConfirm:  const [askText, textDialog] = usePrompt();
function usePrompt() {
  const [req, setReq] = React.useState(null);
  const ask = React.useCallback((cfg) => setReq(cfg), []);
  const dialog = req ? <TextPromptDialog {...req} onClose={() => setReq(null)} /> : null;
  return [ask, dialog];
}

// ── fmtNum ────────────────────────────────────────────────────────
// Todo contador de la plataforma pasa por aquí: acepta número o cadena
// («24000», «9,999») y devuelve es-MX con separador de miles. Existe porque los
// pills de divisa nacían unos formateados y otros crudos, y se veían lado a lado.
function fmtNum(v, fallback = 0) {
  const n = typeof v === 'number' ? v : parseInt(String(v ?? '').replace(/[^\d-]/g, ''), 10);
  return (Number.isFinite(n) ? n : fallback).toLocaleString('es-MX');
}

Object.assign(window, {
  kbGetPrefs, kbSetPref, useKbPrefs, curLabel, curGlyph, useCurrencyRepaint,
  sectionNameOf, crumb,
  fmtNum,
  KbHabitCard, ItemCard, GoalBar,
  SectionHead, MoneyRow, EmptyState, PersonRow,
  PriorityRow, RateRow, KB_PRIORITIES, Scale5, KB_SCALES, KbStepper,
  ConfirmFooter, ConfirmDialog, useConfirm,
  TextPromptDialog, usePrompt,
});
