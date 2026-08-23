// opciones2.jsx — Turno 2 de la hoja de decisiones: reutilización pendiente + revisión de modales.
// Envuelve KiboOptionView del turno 1 (fallback) y añade las variantes nuevas.

const OPC2_PREV_VIEW = window.KiboOptionView;

// Marco que contiene el velo de un modal real dentro de la hoja.
function OpcModalFrame({ height = 340, children }) {
  return <div className="opc-modal-frame" style={{ height }}>{children}</div>;
}

// ── E · Modales ──────────────────────────────────────────────────
function OpcModalNested() {
  return (
    <OpcModalFrame height={360}>
      <KBVModal title="Eliminar hábito" sub="Meditar 10 min · racha de 12 días" onClose={() => {}}
        footer={<div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button type="button" className="kbv-btn kbv-btn-ghost">Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-danger">Eliminar</button>
        </div>}>
        <p className="kbv-body">Se pierde el historial y la racha. Esta acción no se puede deshacer.</p>
        <KBVModal title="¿Seguro?" sub="Confirmación anidada — el patrón actual." onClose={() => {}}
          footer={<div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button type="button" className="kbv-btn kbv-btn-ghost">No</button>
            <button type="button" className="kbv-btn kbv-btn-danger">Sí, eliminar</button>
          </div>}>
          <p className="kbv-body">Dos velos apilados, dos cabeceras y dos pies.</p>
        </KBVModal>
      </KBVModal>
    </OpcModalFrame>
  );
}

function OpcModalInline() {
  const [armed, setArmed] = React.useState(true);
  return (
    <OpcModalFrame height={360}>
      <KBVModal title="Eliminar hábito" sub="Meditar 10 min · racha de 12 días" onClose={() => {}}
        footer={armed
          ? <div className="opc-confirm-strip">
              <span><KIcon name="alert" size={13} /> Se pierde la racha de 12 días. ¿Confirmas?</span>
              <div className="acts">
                <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => setArmed(false)}>No</button>
                <button type="button" className="kbv-btn kbv-btn-danger">Sí, eliminar</button>
              </div>
            </div>
          : <div className="right" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button type="button" className="kbv-btn kbv-btn-ghost">Cancelar</button>
              <button type="button" className="kbv-btn kbv-btn-danger" onClick={() => setArmed(true)}>Eliminar</button>
            </div>}>
        <p className="kbv-body">Se pierde el historial y la racha. Esta acción no se puede deshacer.</p>
        <span className="kbv-meta">El pie se convierte en la confirmación: un solo velo, sin perder el contexto de lo que ibas a borrar.</span>
      </KBVModal>
    </OpcModalFrame>
  );
}

function OpcModalNative() {
  return (
    <div className="opc-native-confirm">
      <div className="nc-bar">kibo.app dice</div>
      <div className="nc-body">¿Eliminar este hábito? Se pierde el historial y la racha. Esta acción no se puede deshacer.</div>
      <div className="nc-foot">
        <button type="button" className="nc-btn">Cancelar</button>
        <button type="button" className="nc-btn primary">Aceptar</button>
      </div>
      <span className="kbv-meta" style={{ padding: '0 14px 12px' }}>Así se ve hoy al borrar un hábito (Hábitos y Áreas) y al quitar una columna del tablero de Tareas: diálogo del navegador, sin marca ni tono Kibo.</span>
    </div>
  );
}

const OPC2_MODAL_SIZES = [
  { id: 'sm', label: 'sm · 420px', use: 'Confirmaciones y avisos de una frase.' },
  { id: 'md', label: 'md · 560px', use: 'Alta rápida: hábito, movimiento, entrada de diario.' },
  { id: 'lg', label: 'lg · 720px', use: 'Formularios largos y detalle de entidad.' },
  { id: 'full', label: 'full · 1040px', use: 'Galería de widgets y catálogos con rejilla.' },
];

function OpcModalSizes() {
  return (
    <div className="opc-sizes">
      {OPC2_MODAL_SIZES.map(s => (
        <div key={s.id} className="opc-size-row">
          <span className={`opc-size-bar ${s.id}`} />
          <div className="opc-size-txt">
            <span className="kbv-eyebrow" style={{ fontSize: 10 }}>{s.label}</span>
            <span className="kbv-meta">{s.use}</span>
          </div>
        </div>
      ))}
      <span className="kbv-meta">Hoy solo existen <strong>md</strong> y <strong>lg</strong>: las confirmaciones se ven enormes y la galería de widgets tuvo que salirse de <code>KBVModal</code>.</span>
    </div>
  );
}

function OpcModalOrphans() {
  const rows = [
    { n: 'Galería de widgets', w: 'Velo propio (kbv-gallery)', f: 'KBVModal size="full"' },
    { n: 'Regalar a un amigo', w: 'Velo propio (kbv-gift-modal)', f: 'KBVModal size="md"' },
    { n: 'Eliminar hábito (Hábitos y Áreas)', w: 'confirm() del navegador', f: 'Confirmación Kibo' },
    { n: 'Quitar columna del tablero', w: 'confirm() + alert()', f: 'Confirmación Kibo' },
  ];
  return (
    <div className="opc-orphans">
      {rows.map(r => (
        <div key={r.n} className="opc-orphan-row">
          <span className="on-name">{r.n}</span>
          <span className="on-now">{r.w}</span>
          <KIcon name="arrow-right" size={13} />
          <span className="on-fix">{r.f}</span>
        </div>
      ))}
    </div>
  );
}

// ── G · Encabezado de sección ────────────────────────────────────
function OpcSectionHeadNow() {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div className="kbv-char-section-head tight">
        <div>
          <h3 className="kbv-h3">Tus amigos</h3>
          <p className="kbv-body" style={{ marginTop: 2, fontSize: 12.5, whiteSpace: 'nowrap' }}>5 amigos · 3 en línea</p>
        </div>
      </div>
      <div className="kbv-char-section-head">
        <h3 className="kbv-h3">Expediente médico</h3>
        <span className="kbv-meta">12 documentos · último: 14 may</span>
      </div>
      <div className="kbv-char-section-head tight">
        <div><h4 className="kbv-h4">XP a lo largo del tiempo</h4></div>
      </div>
    </div>
  );
}

function OpcSectionHead({ title, meta, action }) {
  return (
    <div className="opc-section-head">
      <div className="sh-id">
        <span className="sh-title">{title}</span>
        {meta && <span className="kbv-meta">{meta}</span>}
      </div>
      {action && <button type="button" className="kbv-btn kbv-btn-ghost sh-act">{action} <KIcon name="arrow-right" size={12} /></button>}
    </div>
  );
}

function OpcSectionHeadUni() {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <OpcSectionHead title="Tus amigos" meta="5 amigos · 3 en línea" action="Buscar" />
      <OpcSectionHead title="Expediente médico" meta="12 documentos · último 14 may" action="Agregar" />
      <OpcSectionHead title="XP a lo largo del tiempo" meta="Últimos 90 días" />
    </div>
  );
}

// ── H · Filas de dinero ──────────────────────────────────────────
function OpcMoneyRow({ icon, color, name, meta, amount, negative }) {
  return (
    <div className="opc-money-row" style={{ '--c': color }}>
      <span className="mr-ico"><KIcon name={icon} size={16} /></span>
      <div className="mr-id">
        <span className="mr-name">{name}</span>
        <span className="kbv-meta">{meta}</span>
      </div>
      <span className={`mr-amt ${negative ? 'debt' : ''}`}>{negative ? '−' : ''}${amount.toLocaleString('es-MX')}</span>
    </div>
  );
}

function OpcMoneyNow() {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {/* Cuentas — .kbv-fin-mini-row (Resumen) */}
      <button type="button" className="kbv-fin-mini-row" style={{ '--c': '#0040A8' }}>
        <span className="ico"><KIcon name="wealth" size={14} /></span>
        <div className="info">
          <span className="name">BBVA</span>
          <span className="meta">Débito · ****4521</span>
        </div>
        <span className="amt">$18,420</span>
        <KIcon name="arrow-right" size={11} style={{ color: 'var(--kb-text-3)' }} />
      </button>
      {/* Créditos — .kbv-credit-card (Deudas) */}
      <div className="kbv-credit-card" style={{ '--c': 'var(--kb-hp)' }}>
        <div className="top">
          <span className="type-pip" style={{ '--c': 'var(--kb-hp)' }}><KIcon name="alert" size={10} /> Tarjeta</span>
          <span className="link-state on"><KIcon name="check" size={10} /> Conectado</span>
        </div>
        <div className="name">TC BBVA Azul</div>
        <div className="balance">
          <span className="bal">$12,400</span>
          <span className="cap">de $40,000</span>
        </div>
        <div className="kbv-progress" style={{ height: 6 }}>
          <div className="fill" style={{ width: '31%', background: 'var(--kb-hp)' }} />
        </div>
        <div className="bottom">
          <span>Vence día <strong>15</strong></span>
          <span>CAT <strong style={{ color: 'var(--kb-hp)' }}>78%</strong></span>
        </div>
      </div>
      {/* Suscripciones — .kbv-sub-row */}
      <div className="kbv-sub-row" style={{ '--c': 'var(--area-community)' }}>
        <span className="ico"><KIcon name="tv" size={14} /></span>
        <div className="info">
          <span className="name">Netflix</span>
          <span className="meta">Streaming · día 8 · <strong>BBVA</strong></span>
        </div>
        <span className="amt">$299<small>/mes</small></span>
      </div>
    </div>
  );
}

function OpcMoneyUni() {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <OpcMoneyRow icon="wealth" color="#0040A8" name="BBVA" meta="Débito · ****4521" amount={18420} />
      <OpcMoneyRow icon="alert" color="var(--kb-hp)" name="TC BBVA Azul" meta="Tarjeta · CAT 78% · vence día 15" amount={12400} negative />
      <OpcMoneyRow icon="tv" color="var(--area-community)" name="Netflix" meta="Streaming · día 8 · BBVA" amount={299} />
    </div>
  );
}

// ── I · Estados vacíos ───────────────────────────────────────────
function OpcEmptyNow() {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div className="kbv-project-empty">No hay retos activos. Lanza uno en la sección de Retos.</div>
      <div className="kbv-project-empty">Sin solicitudes pendientes.</div>
      <div className="kbv-project-empty">Sin resultados. Prueba otros términos o regístralo manualmente.</div>
    </div>
  );
}

function OpcEmptyState({ icon, title, body, action }) {
  return (
    <div className="opc-empty">
      <span className="oe-ico"><KIcon name={icon} size={22} /></span>
      <span className="oe-title">{title}</span>
      <span className="kbv-meta">{body}</span>
      {action && <button type="button" className="kbv-btn kbv-btn-primary oe-act"><KIcon name="plus" size={13} /> {action}</button>}
    </div>
  );
}

function OpcEmptyUni() {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <OpcEmptyState icon="sword" title="Sin retos activos" body="Un reto es un cambio concreto con días contados. El fracaso reencauza." action="Lanzar reto" />
      <OpcEmptyState icon="user" title="Sin solicitudes" body="Cuando alguien te agregue, aparecerá aquí." />
    </div>
  );
}

// ── J · Filas de formulario ──────────────────────────────────────
const OPC2_PRIORITIES = [
  ['urgent', 'Urgente', 'var(--pri-urgent)'], ['high', 'Alta', 'var(--pri-high)'],
  ['medium', 'Media', 'var(--pri-medium)'], ['low', 'Baja', 'var(--pri-low)'], ['vlow', 'Muy baja', 'var(--pri-vlow)'],
];

function OpcPriorityRow() {
  const [v, setV] = React.useState('high');
  return (
    <div className="opc-pri-row">
      {OPC2_PRIORITIES.map(([id, lbl, c]) => (
        <button key={id} type="button" className={`opc-pri ${v === id ? 'on' : ''}`} style={{ '--c': c }} onClick={() => setV(id)}>
          <i /> {lbl}
        </button>
      ))}
    </div>
  );
}

function OpcRateRow({ label, hint }) {
  const [v, setV] = React.useState(3);
  return (
    <div className="opc-rate-row">
      <div className="rr-head"><span className="rr-lbl">{label}</span><span className="kbv-meta">{hint}</span></div>
      <div className="rr-dots">
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} type="button" className={`rr-dot ${n <= v ? 'on' : ''}`} onClick={() => setV(n)}>{n}</button>
        ))}
      </div>
    </div>
  );
}

function OpcFormRowsUni() {
  return (
    <div className="opc-formcard">
      <span className="kbv-eyebrow" style={{ fontSize: 10 }}>Prioridad</span>
      <OpcPriorityRow />
      <OpcRateRow label="Esfuerzo" hint="1 = trivial · 5 = te cuesta" />
      <OpcRateRow label="Energía" hint="lo que te drena hacerlo" />
    </div>
  );
}

function OpcFormRowsNow() {
  return (
    <div className="opc-formcard">
      <span className="kbv-eyebrow" style={{ fontSize: 10 }}>Tarea · prioridad</span>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {[['Urgente', 'var(--kb-hp)'], ['Alta', 'var(--pri-high)'], ['Media', 'var(--kb-coin)'], ['Baja', 'var(--kb-gem)'], ['Muy baja', 'var(--pri-vlow)']].map(([l, c]) => (
          <span key={l} className="opc-legacy-chip" style={{ borderColor: c, color: c }}>{l}</span>
        ))}
      </div>
      <span className="kbv-eyebrow" style={{ fontSize: 10, marginTop: 6 }}>Hábito · esfuerzo 1–5</span>
      <div style={{ display: 'flex', gap: 6 }}>
        {[1, 2, 3, 4, 5].map(n => <span key={n} className="opc-legacy-sq">{n}</span>)}
      </div>
      <span className="kbv-eyebrow" style={{ fontSize: 10, marginTop: 6 }}>Reto · dificultad 1–5</span>
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
        {[1, 2, 3, 4, 5].map(n => <span key={n} className="opc-legacy-bar" style={{ height: 6 + n * 3 }} />)}
      </div>
      <span className="kbv-meta">Tres controles distintos para lo mismo, con hex sueltos en el JSX.</span>
    </div>
  );
}

// ── Router del turno 2 ───────────────────────────────────────────
function KiboOptionView2(props) {
  const demoFriend = { id: 'f3', name: 'Sofía', color: 'var(--kb-primary)', level: 14, streak: 88, weekXP: 3120, online: true, risk: false };
  switch (props.variant) {
    case 'modal-nested':   return <OpcModalNested />;
    case 'modal-inline':   return <OpcModalInline />;
    case 'modal-native':   return <OpcModalNative />;
    case 'modal-sizes':    return <OpcModalSizes />;
    case 'modal-orphans':  return <OpcModalOrphans />;
    case 'person-now':     return <div style={{ maxWidth: 420 }}><FriendRow f={demoFriend} rank={1} onNudge={() => {}} onGift={() => {}} /></div>;
    case 'person-uni':     return <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
                                    <OpcPersonRow metric="xp" /><OpcPersonRow metric="streak" /><OpcPersonRow metric="coin" />
                                  </div>;
    case 'head-now':       return <div style={{ maxWidth: 420 }}><OpcSectionHeadNow /></div>;
    case 'head-uni':       return <div style={{ maxWidth: 420 }}><OpcSectionHeadUni /></div>;
    case 'money-now':      return <div style={{ maxWidth: 420 }}><OpcMoneyNow /></div>;
    case 'money-uni':      return <div style={{ maxWidth: 420 }}><OpcMoneyUni /></div>;
    case 'empty-now':      return <div style={{ maxWidth: 420 }}><OpcEmptyNow /></div>;
    case 'empty-uni':      return <div style={{ maxWidth: 420 }}><OpcEmptyUni /></div>;
    case 'formrows-now':   return <div style={{ maxWidth: 360 }}><OpcFormRowsNow /></div>;
    case 'formrows-uni':   return <div style={{ maxWidth: 360 }}><OpcFormRowsUni /></div>;
    default:               return OPC2_PREV_VIEW ? <OPC2_PREV_VIEW {...props} /> : null;
  }
}

Object.assign(window, { KiboOptionView: KiboOptionView2, OpcSectionHead, OpcMoneyRow, OpcEmptyState, OpcPriorityRow, OpcRateRow });
