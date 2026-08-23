// areas-screen.jsx — Editable Áreas page
// Per-area rules:
//   will   → No proyectos. Hábitos + misiones (malos hábitos). Solo nombre editable. No se borra.
//   wisdom → Totalmente editable (nombre, descripción, ícono).
//   vigor  → Totalmente editable.
//   community → Totalmente editable.
//   wealth → Liga al módulo Financiero. Solo nombre editable. Proyectos viven en Finanzas.

const DEMO_PROJECTS_BY_AREA = {
  vigor: [
    { id: 'p1', name: 'Maratón otoño 2026',   status: 'prog', progress: 38, tasks: '12/32', due: 'Sep 28' },
    { id: 'p2', name: 'Mejorar VO2 max',      status: 'prog', progress: 56, tasks: '8/14',  due: 'Jul 15' },
  ],
  wisdom: [
    { id: 'p3', name: 'Curso de System Design', status: 'prog', progress: 72, tasks: '18/25', due: 'Jun 30' },
  ],
  community: [
    { id: 'p8', name: 'Cena mensual familia',   status: 'prog', progress: 60, tasks: '3/5',   due: 'May 28' },
  ],
  wealth: [], // managed in Finanzas now
  will:   [], // no projects ever
};

const AREA_LEVELS_V2 = {
  vigor:     { level: 4, xpToNext: 280, xpMax: 500 },
  wisdom:    { level: 6, xpToNext: 120, xpMax: 600 },
  wealth:    { level: 3, xpToNext: 80,  xpMax: 400 },
  community: { level: 2, xpToNext: 200, xpMax: 300 },
  will:      { level: 7, xpToNext: 340, xpMax: 700 },
};

// Prestigio por área — esquema simplificado: hasta 5 prestigios.
// El 5º es PRESTIGIO MAESTRO (ascenso infinito) y baña el área en la estética
// cósmica del Maestro: arcoíris intraespacial + agujero negro.
const AREA_PRESTIGE_MAX = 5;
const AREA_PRESTIGE_V2 = { vigor: 2, wisdom: 3, wealth: 4, community: 1, will: 5 };
function areaPrestige(id) { return AREA_PRESTIGE_V2[id] || 0; }
function areaIsMaster(id) { return areaPrestige(id) >= AREA_PRESTIGE_MAX; }

// Pulso por área — cómo vas (métricas relevantes a cada frente de vida).
const AREA_PULSE = {
  will:      [{ v: '21d', l: 'mejor racha' }, { v: '92%', l: 'cumplimiento' }, { v: '3', l: 'hábitos activos' }],
  wisdom:    [{ v: '2', l: 'libros activos' }, { v: '38h', l: 'foco · mes' }, { v: '12', l: 'notas nuevas' }],
  vigor:     [{ v: '8.2k', l: 'pasos/día' }, { v: '4', l: 'entrenos/sem' }, { v: '7h', l: 'sueño' }],
  wealth:    [{ v: '+$28.1K', l: 'saldo' }, { v: '78%', l: 'fondo emerg.' }, { v: '4', l: 'cuentas' }],
  community: [{ v: '5', l: 'personas cerca' }, { v: '2', l: 'eventos/mes' }, { v: '8', l: 'gestos' }],
};

// Estrellas de prestigio por área (reutilizable en todas las vistas de áreas).
function AreaPrestigeStars({ id, prestige, paragon }) {
  const p = prestige != null ? prestige : areaPrestige(id);
  const master = p >= AREA_PRESTIGE_MAX;
  if (master) {
    return (
      <span className="area-prestige master" title="Prestigio maestro · ascenso infinito">
        <span className="apx-bh" aria-hidden="true"><span className="apx-disk" /></span>
        <span className="apx-label">Maestro{paragon ? ` · ${paragon}` : ''}</span>
      </span>
    );
  }
  return (
    <span className="area-prestige" title={`Prestigio ${p} de ${AREA_PRESTIGE_MAX}`}>
      {Array.from({ length: AREA_PRESTIGE_MAX }).map((_, i) => (
        <span key={i} className={`apx-star ${i < p ? 'on' : ''}`}>★</span>
      ))}
    </span>
  );
}

// Per-area rules table
// Special life-areas (vigor, wisdom, will, wealth) are fixed: you may change
// their name, icon and color, but NOT their difficulty (the system measures it).
// Only Comunidad is fully user-editable — the customizable life-area slot.
const AREA_RULES = {
  will:      { editable: 'icon-name-color', deletable: false, projects: false,     special: 'will',    difficulty: false },
  wisdom:    { editable: 'icon-name-color', deletable: false, projects: 'wisdom',   special: 'wisdom',  difficulty: false },
  vigor:     { editable: 'icon-name-color', deletable: false, projects: true,       special: 'vigor',   difficulty: false },
  community: { editable: 'full',            deletable: true,  projects: true,       special: null,      difficulty: true },
  wealth:    { editable: 'icon-name-color', deletable: false, projects: 'finance',  special: 'finance', difficulty: false },
};

// Difficulty multipliers — affect XP needed to level up
const DIFFICULTY_LEVELS = [
  { id: 1, label: 'Suave',    mult: 0.6,  desc: 'Sube rápido. Ideal para áreas exploratorias.' },
  { id: 2, label: 'Estándar', mult: 1.0,  desc: 'XP base — el ajuste por defecto.' },
  { id: 3, label: 'Exigente', mult: 1.6,  desc: 'Subir cuesta más. Te fuerza a ser disciplinado.' },
  { id: 4, label: 'Brutal',   mult: 2.5,  desc: 'Solo para áreas críticas — XP triplicado.' },
];

const ICON_PALETTE = ['vigor', 'wisdom', 'wealth', 'community', 'will', 'sword', 'flame', 'sparkle', 'book', 'shop', 'home', 'layers', 'film', 'book-open', 'edit', 'user'];

// Mini cards for Voluntad's habits & quests
const WILL_HABITS_MINI = [
  { id: 'hm1', name: 'Diario nocturno',       streak: 21 },
  { id: 'hm2', name: 'No redes < 22h',         streak: 12 },
  { id: 'hm3', name: 'Meditación AM',          streak: 8 },
];
const WILL_QUESTS_MINI = [
  { id: 'q1', name: 'Vencer "Procrastinación nocturna"', remaining: '9 días' },
  { id: 'q2', name: 'Cortar el azúcar 30 días',           remaining: '12 días' },
];

// ─────────────────────────────────────────────────────────────
// Project card
// ─────────────────────────────────────────────────────────────
function ProjectCard({ project, areaColor }) {
  const status = project.status;
  const statusLabel = status === 'done' ? 'Hecho' : status === 'prog' ? 'En curso' : 'Por hacer';
  return (
    <div className="kbv-project" style={{ '--c': areaColor }}>
      <span className={`status ${status}`}>{statusLabel}</span>
      <div className="name">{project.name}</div>
      <div className="meta">
        <span>{project.tasks} tareas</span>
        <div className="progress"><div className="fill" style={{ width: `${project.progress}%` }} /></div>
        <span style={{ fontFamily: 'var(--kb-f-mono)', fontWeight: 600 }}>{project.progress}%</span>
      </div>
      <div className="meta" style={{ fontSize: 11, color: 'var(--kb-text-3)' }}>
        <span>Vence {project.due}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Edit area dialog
// ─────────────────────────────────────────────────────────────
function EditAreaModal({ area, onClose, onSave }) {
  const rules = AREA_RULES[area.id] || { editable: 'full' };
  const isFull = rules.editable === 'full';
  const canCustomize = isFull || rules.editable === 'icon-name-color'; // name + icon + color
  const allowDifficulty = rules.difficulty !== false;
  const [name, setName] = React.useState(area.name);
  const [desc, setDesc] = React.useState(area.desc);
  const [glyph, setGlyph] = React.useState(area.glyph);
  const [color, setColor] = React.useState(area.color);
  const [difficulty, setDifficulty] = React.useState(area.difficulty || 2);

  const COLORS = ['var(--area-vigor)', 'var(--area-wisdom)', 'var(--kb-primary)', 'var(--kb-coin)', 'var(--pri-high)', 'var(--area-community)', 'var(--kb-hp)', 'var(--kb-gem)', 'var(--kb-good-soft)', 'var(--area-community)'];

  return (
    <KBVModal
      title={`Editar ${area.name}`}
      sub={isFull
        ? 'Personaliza nombre, descripción, ícono, color y dificultad — esta es tu área totalmente libre.'
        : 'Esta área de vida es fija, pero la haces tuya: cambia su nombre, ícono y color. La dificultad la mide el sistema.'}
      onClose={onClose}
      footer={
        <div className="right" style={{ marginLeft: 'auto' }}>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => { onSave({ ...area, name, desc, glyph, color, difficulty }); onClose(); }} disabled={!name.trim()}>
            Guardar <KIcon name="check" size={14} />
          </button>
        </div>
      }
    >
      <div className="kbv-form-row">
        <label>Nombre</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      </div>
      {isFull && (
        <div className="kbv-form-row">
          <label>Descripción</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>
      )}
      {canCustomize && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14 }}>
          <div className="kbv-form-row">
            <label>Ícono</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {ICON_PALETTE.map(i => (
                <button key={i} type="button" onClick={() => setGlyph(i)}
                        style={{
                          width: 38, height: 38, borderRadius: 10,
                          border: glyph === i ? `2px solid ${color}` : '1.5px solid var(--kb-border)',
                          background: glyph === i ? `color-mix(in oklab, ${color} 12%, var(--kb-canvas))` : 'var(--kb-card)',
                          color: glyph === i ? color : 'var(--kb-text-2)',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                  <KIcon name={i} size={18} />
                </button>
              ))}
            </div>
          </div>
          <div className="kbv-form-row">
            <label>Color</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                        style={{
                          width: 30, height: 30, borderRadius: 9,
                          background: c,
                          border: color === c ? '3px solid var(--kb-text)' : '1.5px solid var(--kb-border)',
                          cursor: 'pointer',
                        }}
                        title={c} />
              ))}
            </div>
          </div>
        </div>
      )}
      {allowDifficulty && (
        <div className="kbv-form-row">
          <label>Dificultad de subir de nivel</label>
          <div className="kbv-difficulty-grid">
            {DIFFICULTY_LEVELS.map(d => (
              <button key={d.id} type="button"
                      className={`kbv-difficulty-tile ${difficulty === d.id ? 'on' : ''}`}
                      style={{ '--c': color }}
                      onClick={() => setDifficulty(d.id)}>
                <span className="pip">×{d.mult}</span>
                <span className="lbl">{d.label}</span>
                <span className="desc">{d.desc}</span>
              </button>
            ))}
          </div>
          <span className="kbv-meta">El multiplicador afecta el XP requerido para subir cada nivel — no cambia las recompensas.</span>
        </div>
      )}
      {rules.special === 'vigor' && (
        <div style={{ background: 'color-mix(in oklab, var(--area-vigor) 10%, var(--kb-canvas))', border: '1px solid color-mix(in oklab, var(--area-vigor) 35%, var(--kb-canvas))', borderRadius: 10, padding: 10, fontSize: 12, color: 'var(--kb-text-2)' }}>
          <strong style={{ color: 'var(--kb-hp-ink)' }}>Vigor</strong> está ligada a tu <strong>cuerpo</strong>: actividad física, salud, energía y descanso. Su nivel y proyectos se nutren de entrenamientos, nutrición y movimiento — por eso es un área fija. Puedes personalizar nombre, ícono y color, pero no se elimina ni cambia su dificultad.
        </div>
      )}
      {rules.special === 'will' && (
        <div style={{ background: 'var(--kb-primary-soft)', border: '1px solid var(--kb-primary-border)', borderRadius: 10, padding: 10, fontSize: 12, color: 'var(--kb-text-2)' }}>
          <strong style={{ color: 'var(--kb-primary-ink)' }}>Voluntad</strong> está conectada a tus hábitos y retos contra malos hábitos. No tiene proyectos, no puede eliminarse y la dificultad la mide el sistema automáticamente. Personaliza su nombre, ícono y color.
        </div>
      )}
      {rules.special === 'finance' && (
        <div style={{ background: 'var(--kb-coin-soft)', border: '1px solid var(--kb-coin-border)', borderRadius: 10, padding: 10, fontSize: 12, color: 'var(--kb-coin-ink)' }}>
          <strong>Riqueza</strong> se gestiona desde el <strong>módulo Financiero</strong>: ingresos, gastos, presupuestos y proyectos financieros viven ahí. Sube de nivel automáticamente con tu actividad financiera. Personaliza su nombre, ícono y color.
        </div>
      )}
      {rules.special === 'wisdom' && (
        <div style={{ background: 'var(--kb-community-soft)', border: '1px solid var(--kb-community-border)', borderRadius: 10, padding: 10, fontSize: 12, color: 'var(--kb-community-ink)' }}>
          <strong>Sabiduría</strong> está ligada a tu actividad de <strong>Lectura y aprendizaje</strong>: libros, cursos, notas y sesiones suben de nivel esta área automáticamente. Personaliza su nombre, ícono y color — el resto se administra desde Lectura.
        </div>
      )}
    </KBVModal>
  );
}

// ─────────────────────────────────────────────────────────────
// Create area modal — used by BuyAreaSlotCard
// ─────────────────────────────────────────────────────────────
function CreateAreaModal({ onClose, onSave, price = 200 }) {
  const [name, setName] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [glyph, setGlyph] = React.useState('sparkle');
  const [color, setColor] = React.useState('var(--area-community)');
  const [difficulty, setDifficulty] = React.useState(2);

  const COLORS = ['var(--area-community)', 'var(--area-wisdom)', 'var(--kb-primary)', 'var(--kb-coin)', 'var(--pri-high)', 'var(--kb-hp)', 'var(--kb-gem)', 'var(--kb-good-soft)'];

  return (
    <KBVModal
      title="Nueva área personalizada"
      sub={`Compra un slot extra por ${price} fragmentos — luego configura nombre, ícono, color y dificultad de subir de nivel.`}
      onClose={onClose}
      size="lg"
      footer={
        <div className="right" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="kbv-meta">Costo: <strong style={{ color: 'var(--kb-gem-ink)' }}>◆ {price} fragmentos</strong></span>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" disabled={!name.trim()}
                  onClick={() => { onSave && onSave({ name: name.trim(), desc, glyph, color, difficulty }); onClose(); }}>
            <KIcon name="check" size={14} /> Comprar y crear
          </button>
        </div>
      }>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
        <div className="kbv-form-row">
          <label>Nombre del área</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Creatividad, Familia, Negocio…" autoFocus />
        </div>
        <div className="kbv-form-row">
          <label>Color</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {COLORS.map(c => (
              <button key={c} type="button" onClick={() => setColor(c)}
                      style={{
                        width: 32, height: 32, borderRadius: 10,
                        background: c,
                        border: color === c ? '3px solid var(--kb-text)' : '1.5px solid var(--kb-border)',
                        cursor: 'pointer',
                      }}
                      title={c} />
            ))}
          </div>
        </div>
      </div>
      <div className="kbv-form-row">
        <label>Descripción</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Qué cubre este frente de tu vida..." />
      </div>
      <div className="kbv-form-row">
        <label>Ícono</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {ICON_PALETTE.map(i => (
            <button key={i} type="button" onClick={() => setGlyph(i)}
                    style={{
                      width: 40, height: 40, borderRadius: 10,
                      border: glyph === i ? `2px solid ${color}` : '1.5px solid var(--kb-border)',
                      background: glyph === i ? `color-mix(in oklab, ${color} 12%, var(--kb-canvas))` : 'var(--kb-card)',
                      color: glyph === i ? color : 'var(--kb-text-2)',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
              <KIcon name={i} size={18} />
            </button>
          ))}
        </div>
      </div>
      <div className="kbv-form-row">
        <label>Dificultad de subir de nivel</label>
        <div className="kbv-difficulty-grid">
          {DIFFICULTY_LEVELS.map(d => (
            <button key={d.id} type="button"
                    className={`kbv-difficulty-tile ${difficulty === d.id ? 'on' : ''}`}
                    style={{ '--c': color }}
                    onClick={() => setDifficulty(d.id)}>
              <span className="pip">×{d.mult}</span>
              <span className="lbl">{d.label}</span>
              <span className="desc">{d.desc}</span>
            </button>
          ))}
        </div>
        <span className="kbv-meta">Define qué tan exigente quieres que sea — siempre puedes ajustarla después.</span>
      </div>
    </KBVModal>
  );
}

// ─────────────────────────────────────────────────────────────
// Panel de sincronización de salud (área Cuerpo / Vigor)
// ─────────────────────────────────────────────────────────────
function HealthSyncPanel({ color }) {
  const SOURCES = [
    { id: 'apple', name: 'Apple Health', icon: 'phone' },
    { id: 'samsung', name: 'Samsung Health', icon: 'phone' },
    { id: 'google', name: 'Google Fit', icon: 'vigor' },
  ];
  const [connected, setConnected] = React.useState({});
  const any = Object.values(connected).some(Boolean);
  return (
    <div className="kbv-health-sync" style={{ '--c': color }}>
      <div className="hs-head">
        <span className="kbv-eyebrow">Sincroniza tu cuerpo</span>
        <span className="kbv-meta">Conecta tus apps de salud y tus metas físicas se registran solas.</span>
      </div>
      <div className="hs-sources">
        {SOURCES.map(s => (
          <button key={s.id} type="button" className={`hs-source ${connected[s.id] ? 'on' : ''}`}
            onClick={() => setConnected(c => ({ ...c, [s.id]: !c[s.id] }))}>
            <KIcon name={s.icon} size={16} />
            <span className="hs-name">{s.name}</span>
            <span className="hs-state">{connected[s.id] ? <><KIcon name="check" size={11} /> Conectado</> : 'Conectar'}</span>
          </button>
        ))}
      </div>
      {any && (
        <div className="hs-metrics">
          <div className="hs-metric"><span className="v">8,240</span><span className="l">pasos hoy</span></div>
          <div className="hs-metric"><span className="v">7h 12m</span><span className="l">sueño</span></div>
          <div className="hs-metric"><span className="v">62</span><span className="l">ppm reposo</span></div>
          <div className="hs-metric"><span className="v" style={{ color }}>+45 XP</span><span className="l">a esta área hoy</span></div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Area block
// ─────────────────────────────────────────────────────────────
function nav(screen, detail) { try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen, ...(detail || {}) } })); } catch (_) {} }

function AreaBlock({ area, onEdit, onDelete, innerRef, highlight }) {
  const rules = AREA_RULES[area.id] || { editable: 'full', deletable: true, projects: true };
  const projects = DEMO_PROJECTS_BY_AREA[area.id] || [];
  const lvl = AREA_LEVELS_V2[area.id];
  const xpPct = lvl.xpToNext / lvl.xpMax * 100;
  const active = projects.filter(p => p.status !== 'done').length;

  const specialClass = rules.special === 'will' ? 'special-will' : '';
  const master = areaIsMaster(area.id);
  const prestige = areaPrestige(area.id);

  return (
    <div ref={innerRef} id={`area-block-${area.id}`} className={`kbv-area-block ${specialClass} ${master ? 'area-master' : ''} ${highlight ? 'highlighted' : ''}`} style={{ '--c': area.color }}>
      {master && <span className="area-master-stars" aria-hidden="true" />}
      <div className="head">
        <div className="glyph"><KIcon name={area.glyph} size={24} /></div>
        <div className="info">
          <div className="name" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {area.name}
            <AreaPrestigeStars id={area.id} paragon={master ? `Nv. ${(AREA_LEVELS_V2[area.id] || {}).level || ''}` : null} />
            {rules.special === 'will' && <span className="kbv-tag" style={{ background: 'color-mix(in oklab, var(--area-will) 14%, var(--kb-canvas))', color: 'var(--area-will)' }}>Hábitos · misiones</span>}
            {rules.special === 'wisdom' && <span className="kbv-tag" style={{ background: 'color-mix(in oklab, var(--area-wisdom) 14%, var(--kb-canvas))', color: 'var(--area-wisdom)' }}>Lectura · aprendizaje</span>}
            {rules.special === 'finance' && <span className="kbv-tag" style={{ background: 'var(--kb-coin-wash)', color: 'var(--kb-coin-ink)' }}>Premium · Finanzas</span>}
          </div>
          <div className="desc">{area.desc}</div>
        </div>
        <div className="stats" style={{ display: 'flex', gap: 24 }}>
          <div>
            <span className="val">Nv. {lvl.level}</span>
            <span style={{ fontFamily: 'var(--kb-f-mono)', fontSize: 11, color: 'var(--kb-text-2)' }}>
              {lvl.xpToNext} / {lvl.xpMax} XP
            </span>
          </div>
          {rules.projects === true && (
            <div>
              <span className="val">{active}</span>
              <span style={{ fontFamily: 'var(--kb-f-mono)', fontSize: 11, color: 'var(--kb-text-2)' }}>
                proyectos activos
              </span>
            </div>
          )}
        </div>
        <div className="actions-row">
          <button type="button" onClick={() => onEdit(area)} title={rules.editable === 'full' ? 'Editar área' : 'Personalizar nombre, ícono y color'}>
            <KIcon name="edit" size={14} />
          </button>
          <button type="button" className={`danger ${!rules.deletable ? 'locked' : ''}`}
                  onClick={() => rules.deletable && onDelete(area)}
                  disabled={!rules.deletable}
                  title={rules.deletable ? 'Borrar área' : 'Esta área no puede eliminarse'}>
            <KIcon name="x" size={14} />
          </button>
        </div>
      </div>

      {/* XP bar */}
      <div style={{ padding: '0 22px', marginTop: -2, marginBottom: 0 }}>
        <div style={{ height: 5, background: 'var(--kb-surface-2)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: area.color, width: `${xpPct}%`, borderRadius: 999 }} />
        </div>
      </div>

      {/* Pulso del área — cómo vas */}
      {AREA_PULSE[area.id] && (
        <div className="kbv-area-pulse">
          {AREA_PULSE[area.id].map((m, i) => (
            <div key={i} className="ap-metric"><span className="ap-v">{m.v}</span><span className="ap-l">{m.l}</span></div>
          ))}
        </div>
      )}

      {/* Body — depende del tipo de área */}
      {rules.special === 'will' ? (
        <div className="kbv-area-will-content">
          <div className="kbv-mini-card kbv-area-redirect" onClick={() => nav('habits')}>
            <h4><KIcon name="flame" size={14} style={{ color: 'var(--kb-streak)' }} /><span style={{ flex: 1, whiteSpace: 'nowrap' }}>Hábitos vinculados</span><KIcon name="arrow-right" size={11} style={{ color: 'var(--kb-text-3)' }} /></h4>
            {WILL_HABITS_MINI.map(h => (
              <div key={h.id} className="kbv-habit-mini clickable" onClick={(e) => { e.stopPropagation(); nav('habits', { habit: h.id }); }}>
                <span className="name">{h.name}</span>
                <span className="streak">🔥 {h.streak}d</span>
              </div>
            ))}
            <button type="button" className="kbv-btn-link" style={{ alignSelf: 'flex-start', padding: 0, fontSize: 12 }} onClick={(e) => { e.stopPropagation(); nav('habits', { create: true }); }}>
              <KIcon name="plus" size={12} /> Nuevo hábito
            </button>
          </div>
          <div className="kbv-mini-card kbv-area-redirect" onClick={() => nav('retos')}>
            <h4><KIcon name="flame" size={14} style={{ color: 'var(--kb-boss)' }} /><span style={{ flex: 1, whiteSpace: 'nowrap' }}>Retos activos</span><KIcon name="arrow-right" size={11} style={{ color: 'var(--kb-text-3)' }} /></h4>
            {WILL_QUESTS_MINI.map(q => (
              <div key={q.id} className="kbv-quest-mini clickable" onClick={(e) => { e.stopPropagation(); nav('retos', { reto: q.id }); }}>
                <KIcon name="flame" size={14} className="icon" style={{ color: 'var(--kb-boss)' }} />
                <span className="name">{q.name}</span>
                <span className="kbv-meta">{q.remaining}</span>
              </div>
            ))}
            <span className="kbv-meta" style={{ marginTop: 4 }}>
              Voluntad mide tu disciplina diaria. Sin proyectos — se vive en hábitos y retos.
            </span>
          </div>
        </div>
      ) : rules.special === 'finance' ? (
        <div className="kbv-area-will-content">
          <div className="kbv-mini-card kbv-area-redirect" onClick={() => nav('finanzas', { section: 'projects' })}>
            <h4><KIcon name="wealth" size={14} style={{ color: 'var(--kb-coin-ink)' }} /><span style={{ flex: 1, whiteSpace: 'nowrap' }}>Proyectos financieros</span><KIcon name="arrow-right" size={11} style={{ color: 'var(--kb-text-3)' }} /></h4>
            <div className="kbv-habit-mini clickable" onClick={(e) => { e.stopPropagation(); nav('finanzas', { project: 'emergencia' }); }}><span className="name">Fondo de emergencia</span><span className="streak" style={{ color: 'var(--kb-primary)' }}>78%</span></div>
            <div className="kbv-habit-mini clickable" onClick={(e) => { e.stopPropagation(); nav('finanzas', { project: 'inversion' }); }}><span className="name">Inversión mensual</span><span className="streak" style={{ color: 'var(--kb-gem)' }}>$6.5K</span></div>
            <div className="kbv-habit-mini clickable" onClick={(e) => { e.stopPropagation(); nav('finanzas', { project: 'viaje' }); }}><span className="name">Viaje 2026</span><span className="streak" style={{ color: 'var(--kb-coin)' }}>31%</span></div>
            <button type="button" className="kbv-btn-link" style={{ alignSelf: 'flex-start', padding: 0, fontSize: 12 }}>
              <KIcon name="arrow-right" size={12} /> Abrir Finanzas
            </button>
          </div>
          <div className="kbv-mini-card kbv-area-redirect" onClick={() => nav('finanzas')}>
            <h4><KIcon name="shop" size={14} style={{ color: 'var(--kb-primary)' }} /><span style={{ flex: 1, whiteSpace: 'nowrap' }}>Accesos rápidos</span><KIcon name="arrow-right" size={11} style={{ color: 'var(--kb-text-3)' }} /></h4>
            <div className="kbv-area-quick">
              <button type="button" onClick={(e) => { e.stopPropagation(); nav('finanzas', { section: 'saldo' }); }}><span className="qv" style={{ color: 'var(--kb-good)' }}>+$28.1K</span><span className="ql">Saldo</span></button>
              <button type="button" onClick={(e) => { e.stopPropagation(); nav('finanzas', { section: 'deudas' }); }}><span className="qv" style={{ color: 'var(--kb-hp-ink)' }}>$14.2K</span><span className="ql">Deudas</span></button>
              <button type="button" onClick={(e) => { e.stopPropagation(); nav('finanzas', { section: 'cuentas' }); }}><span className="qv">4</span><span className="ql">Cuentas</span></button>
            </div>
            <span className="kbv-meta" style={{ marginTop: 4 }}>
              Riqueza vive en Finanzas (módulo premium): saldo, deudas y cuentas con auto-registro.
            </span>
          </div>
        </div>
      ) : rules.special === 'wisdom' ? (
        <div className="kbv-area-will-content">
          <div className="kbv-mini-card kbv-area-redirect" onClick={() => nav('lectura')}>
            <h4><KIcon name="book-open" size={14} style={{ color: 'var(--area-wisdom)' }} /><span style={{ flex: 1, whiteSpace: 'nowrap' }}>Lectura activa</span><KIcon name="arrow-right" size={11} style={{ color: 'var(--kb-text-3)' }} /></h4>
            <div className="kbv-habit-mini clickable" onClick={(e) => { e.stopPropagation(); nav('lectura', { book: 'atomic-habits' }); }}><span className="name">Atomic Habits · Cap. 4</span><span className="streak">127/320</span></div>
            <div className="kbv-habit-mini"><span className="name">Libros activos</span><span className="streak" style={{ color: 'var(--area-wisdom)' }}>2</span></div>
            <button type="button" className="kbv-btn-link" style={{ alignSelf: 'flex-start', padding: 0, fontSize: 12 }}>
              <KIcon name="book-open" size={12} /> Abrir Lectura
            </button>
          </div>
          <div className="kbv-mini-card kbv-area-redirect" onClick={() => nav('estudio')}>
            <h4><KIcon name="layers" size={14} style={{ color: 'var(--kb-gem)' }} /><span style={{ flex: 1, whiteSpace: 'nowrap' }}>Estudio y aprendizaje</span><KIcon name="arrow-right" size={11} style={{ color: 'var(--kb-text-3)' }} /></h4>
            <div className="kbv-habit-mini clickable" onClick={(e) => { e.stopPropagation(); nav('estudio', { course: 'system-design' }); }}><span className="name">Curso System Design</span><span className="streak">72%</span></div>
            <div className="kbv-habit-mini"><span className="name">Cursos en curso</span><span className="streak" style={{ color: 'var(--kb-gem)' }}>3</span></div>
            <button type="button" className="kbv-btn-link" style={{ alignSelf: 'flex-start', padding: 0, fontSize: 12 }}>
              <KIcon name="layers" size={12} /> Abrir Estudio
            </button>
          </div>
        </div>
      ) : rules.special === 'vigor' ? (
        <div className="body">
          <div className="body-head">
            <span className="kbv-eyebrow">Metas físicas · proyectos</span>
            <button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }}>
              <KIcon name="plus" size={12} /> Nueva meta
            </button>
          </div>
          <div className="kbv-project-grid">
            {projects.length > 0 ?
              projects.map(p => <ProjectCard key={p.id} project={p} areaColor={area.color} />) :
              <EmptyState icon="target" title="Sin metas físicas" body="Crea una para que esta área suba de nivel." />
            }
          </div>
          <HealthSyncPanel color={area.color} />
        </div>
      ) : (
        <div className="body">
          <div className="body-head">
            <span className="kbv-eyebrow">Proyectos ligados</span>
            <button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }}>
              <KIcon name="plus" size={12} /> Nuevo proyecto
            </button>
          </div>
          <div className="kbv-project-grid">
            {projects.length > 0 ?
              projects.map(p => <ProjectCard key={p.id} project={p} areaColor={area.color} />) :
              <div className="kbv-project-empty">
                Aún no tienes proyectos en <strong style={{ color: area.color }}>{area.name}</strong>. Empieza uno para que esta área suba de nivel.
              </div>
            }
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Buy area slot card
// ─────────────────────────────────────────────────────────────
function BuyAreaSlotCard({ onBuy, price = 200, balance = 0, owned = 5 }) {
  if (typeof useCurrencyRepaint === 'function') useCurrencyRepaint();
  const skin = (typeof csGet === 'function') ? csGet('dark') : null;
  const money = (typeof curLabel === 'function') ? curLabel('dark') : 'materia oscura';
  const glyph = (n) => (typeof curGlyph === 'function') ? curGlyph('dark', n) : null;
  const enough = balance >= price;
  const falta = price - balance;
  const [ask, confirmDialog] = (typeof useConfirm === 'function') ? useConfirm() : [null, null];

  function buy() {
    if (!enough) return;
    if (!ask) { onBuy(); return; }
    ask({
      title: 'Un área más',
      message: `Cuesta ${price} de ${money} y te quedarán ${balance - price}. El área nueva empieza en nivel 1 y sube como cualquier otra.`,
      confirmLabel: 'Comprar y crearla',
      onConfirm: onBuy,
    });
  }

  return (
    <div className={`kbv-area-slot-buy ${enough ? '' : 'short'}`} style={{ '--c': (skin && skin.color) || 'var(--kb-void-1)' }}>
      <span className="slot-glyph" aria-hidden="true">{glyph(30)}</span>
      <div className="info">
        <span className="name">Un área más</span>
        <span className="desc">
          Kibo te da cinco. Una sexta se compra con {money} y funciona igual: nivel propio, proyectos y XP.
          Cuesta a propósito — se piensa antes de abrir un frente nuevo.
        </span>
        <span className="slot-facts">
          <b>{owned}</b> áreas activas
          <i />
          <b>{price}</b> {money}
          <i />
          <b>{balance}</b> disponible
        </span>
      </div>
      <div className="slot-act">
        <button type="button" className="kbv-btn kbv-btn-primary slot-buy" onClick={buy} disabled={!enough}>
          {glyph(15)} {enough ? `Comprar · ${price}` : `Te faltan ${falta}`}
        </button>
        <span className="kbv-meta">{enough ? `Te quedarían ${balance - price}` : `Gánala en retos o cofres`}</span>
      </div>
      {confirmDialog}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Areas screen
// ─────────────────────────────────────────────────────────────
function AreasScreen({ hero, stats, onNavigate, navDetail }) {
  if (typeof AreasScreenV3 === 'function') {
    return <AreasScreenV3 hero={hero} stats={stats} onNavigate={onNavigate} navDetail={navDetail} />;
  }
  const orderedIds = hero?.areas || ['vigor', 'wisdom', 'wealth', 'community', 'will'];
  // Local state for area edits
  const [areas, setAreas] = React.useState(() => orderedIds.map(id => KIBO_AREAS_V2.find(a => a.id === id)).filter(Boolean));
  const [editingArea, setEditingArea] = React.useState(null);
  const [createOpen, setCreateOpen] = React.useState(false);

  // Deep-link: abrir/destacar un área concreta (desde Mi progreso → tarjeta)
  const [focusArea, setFocusArea] = React.useState(navDetail?.area || null);
  const blockRefs = React.useRef({});
  React.useEffect(() => { if (navDetail?.area) setFocusArea(navDetail.area); }, [navDetail]);
  React.useEffect(() => {
    if (!focusArea) return;
    const el = blockRefs.current[focusArea];
    if (el) {
      let sc = el.parentElement;
      while (sc) { const oy = getComputedStyle(sc).overflowY; if ((oy === 'auto' || oy === 'scroll') && sc.scrollHeight > sc.clientHeight) break; sc = sc.parentElement; }
      try {
        if (sc) { const r = el.getBoundingClientRect(), sr = sc.getBoundingClientRect(); sc.scrollTo({ top: sc.scrollTop + (r.top - sr.top) - 18, behavior: 'smooth' }); }
        else { window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 18, behavior: 'smooth' }); }
      } catch (_) {}
    }
    const t = setTimeout(() => setFocusArea(null), 2400);
    return () => clearTimeout(t);
  }, [focusArea, areas]);

  function onSaveArea(updated) {
    setAreas(as => as.map(a => a.id === updated.id ? updated : a));
  }
  function onDeleteArea(area) {
    if (!confirm(`¿Quitar el área "${area.name}"? Los proyectos asociados quedarán sin área pero no se borran.`)) return;
    setAreas(as => as.filter(a => a.id !== area.id));
  }
  function onCreateArea(data) {
    const id = 'custom-' + Math.random().toString(36).slice(2, 6);
    setAreas(as => [...as, {
      id, name: data.name, desc: data.desc, color: data.color, glyph: data.glyph, difficulty: data.difficulty,
    }]);
  }

  // Totals
  const totalProjects = Object.values(DEMO_PROJECTS_BY_AREA).flat().length;
  const totalActive = Object.values(DEMO_PROJECTS_BY_AREA).flat().filter(p => p.status !== 'done').length;

  return (
    <div className="kbv-main">
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--kb-primary)' }}>Áreas · Tus frentes de vida</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Áreas y proyectos. <InfoDot label="i" text={"Cómo vas en cada frente de tu vida: tu nivel y prestigio por área, tu pulso (rachas, lectura, cuerpo, finanzas, comunidad) y accesos directos a donde se vive cada cosa. Cada área tiene su propia escala de prestigio (hasta Maestro). Personaliza nombre, ícono y color; Comunidad es tu área libre."} /></h1>
        </div>
        <div style={{
          display: 'flex',
          gap: 18,
          alignItems: 'center',
          background: 'var(--kb-card)',
          border: '1px solid var(--kb-border)',
          borderRadius: 12,
          padding: '10px 16px',
        }}>
          <div>
            <span className="kbv-meta">PROYECTOS</span>
            <div className="kbv-num" style={{ fontSize: 22, color: 'var(--kb-text)' }}>{totalProjects}</div>
          </div>
          <div style={{ width: 1, height: 32, background: 'var(--kb-border)' }} />
          <div>
            <span className="kbv-meta">ACTIVOS</span>
            <div className="kbv-num" style={{ fontSize: 22, color: 'var(--kb-primary)' }}>{totalActive}</div>
          </div>
        </div>
      </div>

      <div className="kbv-area-page">
        {areas.map(a => <AreaBlock key={a.id} area={a} onEdit={setEditingArea} onDelete={onDeleteArea} innerRef={(el) => { blockRefs.current[a.id] = el; }} highlight={focusArea === a.id} />)}
        <BuyAreaSlotCard price={200} onBuy={() => setCreateOpen(true)} />
      </div>

      <div className="kbv-coach" style={{ marginTop: 8 }}>
        <KiboMascot size={48} mood="happy" />
        <div className="msg">
          <span className="from">Kibo · tip</span>
          Los proyectos sin área no son malos — solo dan XP general al Hero, no a un área específica. Útil para tareas sueltas o experimentos sin compromiso.
        </div>
      </div>

      {editingArea && (
        <EditAreaModal
          area={editingArea}
          onClose={() => setEditingArea(null)}
          onSave={onSaveArea}
        />
      )}

      {createOpen && (
        <CreateAreaModal
          onClose={() => setCreateOpen(false)}
          onSave={onCreateArea}
          price={200}
        />
      )}
    </div>
  );
}

Object.assign(window, { AreasScreen, EditAreaModal, CreateAreaModal, BuyAreaSlotCard, DEMO_PROJECTS_BY_AREA, AREA_LEVELS_V2, AREA_RULES, DIFFICULTY_LEVELS, AREA_PRESTIGE_V2, AreaPrestigeStars, areaPrestige, areaIsMaster });
