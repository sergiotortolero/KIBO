// onboarding-v2.jsx — Welcome / Identity (name + photo) / Intent / Areas
// Replaces the old avatar-builder flow.

// ─────────────────────────────────────────────────────────────
// Areas — definitions (kept for the rest of the app)
// ─────────────────────────────────────────────────────────────
const KIBO_AREAS_V2 = [
  { id: 'vigor',     name: 'Vigor',     desc: 'Cuerpo, salud y energía física.',     color: 'var(--area-vigor)',     glyph: 'vigor' },
  { id: 'wisdom',    name: 'Sabiduría', desc: 'Mente, aprendizaje y oficio.',         color: 'var(--area-wisdom)',    glyph: 'wisdom' },
  { id: 'wealth',    name: 'Riqueza',   desc: 'Dinero, recursos y trabajo.',           color: 'var(--area-wealth)',    glyph: 'wealth' },
  { id: 'community', name: 'Comunidad', desc: 'Relaciones, vínculos y presencia.',     color: 'var(--area-community)', glyph: 'community' },
  { id: 'will',      name: 'Voluntad',  desc: 'Disciplina, foco y constancia.',        color: 'var(--area-will)',      glyph: 'will' },
];

// ─────────────────────────────────────────────────────────────
// UserAvatar — what replaces PixelHero everywhere
// Shows uploaded photo, otherwise initials on a colored disk
// ─────────────────────────────────────────────────────────────
function UserAvatar({ user, size = 36, ring }) {
  const initials = (user?.name || '?').trim().split(/\s+/).slice(0, 2).map(s => s[0]).join('').toUpperCase() || '?';
  const ringStyle = ring ? { boxShadow: `0 0 0 2px var(--kb-canvas), 0 0 0 4px ${ring}` } : undefined;
  if (user?.photo) {
    return (
      <span style={{
        width: size, height: size, borderRadius: '50%',
        background: 'var(--kb-surface-2)',
        overflow: 'hidden', display: 'inline-flex',
        flexShrink: 0,
        ...ringStyle,
      }}>
        <img src={user.photo} alt="" draggable={false}
             style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </span>
    );
  }
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, var(--kb-primary), var(--kb-primary-ink))`,
      color: 'var(--kb-canvas)',
      fontFamily: 'var(--kb-f-display)',
      fontWeight: 800,
      fontSize: size * 0.42,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      ...ringStyle,
    }}>{initials}</span>
  );
}

// ─────────────────────────────────────────────────────────────
// Onboarding shell
// ─────────────────────────────────────────────────────────────
function OnboardingShell({ step, total = 3, title, subtitle, children, footer }) {
  return (
    <div className="kbv-fade" style={{
      flex: 1, display: 'grid', gridTemplateColumns: '1fr',
      background: 'var(--kb-canvas)', minHeight: 760,
    }}>
      <div style={{
        padding: '20px 32px 18px', display: 'flex', flexDirection: 'column', gap: 12,
        borderBottom: '1px solid var(--kb-border)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <KiboLogo />
          <span className="kbv-meta">
            Paso {String(step).padStart(2,'0')} / {String(total).padStart(2,'0')}
          </span>
        </div>
        <div className="kbv-stepbar">
          {Array.from({length: total}).map((_, i) => (
            <div key={i} className={`seg ${i + 1 < step ? 'done' : ''} ${i + 1 === step ? 'active' : ''}`} />
          ))}
        </div>
      </div>
      <div style={{
        flex: 1, padding: '32px 48px 24px',
        display: 'flex', flexDirection: 'column', gap: 24,
        overflowY: 'auto',
      }}>
        <div className="kbv-stack-8">
          <h1 className="kbv-h1">{title}</h1>
          {subtitle && <p className="kbv-body" style={{ maxWidth: 640 }}>{subtitle}</p>}
        </div>
        {children}
        {footer}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 1 — Welcome / "What is Kibo"
// ─────────────────────────────────────────────────────────────
const KIBO_PILLARS = [
  { icon: 'flame',     c: 'var(--kb-streak)', name: 'Hábitos',         desc: 'Pequeños actos diarios que te definen. La racha cuenta.' },
  { icon: 'sword',     c: 'var(--kb-hp)', name: 'Retos',           desc: 'Combatir un mal hábito o construir uno nuevo. Riesgo real.' },
  { icon: 'list',      c: 'var(--kb-primary)', name: 'Tareas',          desc: 'Todo lo que tienes que hacer, en un tablero claro.' },
  { icon: 'folder',    c: 'var(--kb-gem)', name: 'Proyectos',       desc: 'Resultados de largo plazo con foco y límites.' },
  { icon: 'wealth',    c: 'var(--kb-coin)', name: 'Finanzas',        desc: 'Cuentas, créditos, ahorros y movimientos en un sistema.' },
  { icon: 'edit',      c: 'var(--area-community)', name: 'Diario',          desc: 'Reflexión, mood, fotos, transcripción de voz.' },
  { icon: 'book-open', c: 'var(--kb-gem-ink)', name: 'Lectura',         desc: 'Libros con notas, aprendizajes y citas.' },
  { icon: 'layers',    c: 'var(--kb-good)', name: 'Estudio',         desc: 'Pomodoro + sync con Platzi · Coursera · Udemy.' },
  { icon: 'film',      c: 'var(--kb-media)', name: 'Entretenimiento', desc: 'Pelis y series con rating y reflexiones por episodio.' },
];

function WelcomeScreenV2({ onNavigate }) {
  return (
    <OnboardingShell step={1} total={3}
      title="Hola — soy Kibo."
      subtitle="Un sistema personal para llevar tu vida con foco: hábitos, retos, tareas, proyectos, lectura, estudio, entretenimiento, finanzas y reflexión, todo en un mismo lugar. La diferencia: tu progreso real desbloquea recompensas reales — tú decides cuáles."
    >
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 32, alignItems: 'start' }}>
        {/* Kibo greeting */}
        <div style={{
          background: 'linear-gradient(180deg, var(--kb-surface) 0%, color-mix(in oklab, var(--kb-hp) 12%, var(--kb-canvas)) 100%)',
          border: '2px solid color-mix(in oklab, var(--kb-hp) 24%, var(--kb-canvas))',
          borderRadius: 20,
          padding: 20,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          textAlign: 'center',
        }}>
          <KiboMascot size={180} pose="body" mood="wave" />
          <div>
            <h3 className="kbv-h3" style={{ marginBottom: 4 }}>Encantado.</h3>
            <p className="kbv-body" style={{ fontSize: 13 }}>
              Te acompañaré durante el setup. Después aparezco solo cuando vale la pena —
              prometo no ser molesto.
            </p>
          </div>
        </div>

        {/* What Kibo does */}
        <div className="kbv-stack-16">
          <h3 className="kbv-h3">Qué encontrarás aquí</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {KIBO_PILLARS.map(p => (
              <div key={p.name} style={{
                background: 'var(--kb-card)',
                border: '1px solid var(--kb-border)',
                borderLeft: `3px solid ${p.c}`,
                borderRadius: 12,
                padding: '12px 14px',
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <span style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `color-mix(in oklab, ${p.c} 14%, var(--kb-canvas))`,
                  color: p.c,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <KIcon name={p.icon} size={16} />
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--kb-text)' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--kb-text-2)', marginTop: 1 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: 'var(--kb-primary-soft)',
            border: '1px solid var(--kb-primary-border)',
            borderRadius: 12,
            padding: '12px 14px',
            display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <KIcon name="sparkle" size={20} style={{ color: 'var(--kb-primary-ink)', flexShrink: 0 }} />
            <div style={{ fontSize: 12, color: 'var(--kb-text-2)' }}>
              <strong style={{ color: 'var(--kb-primary-ink)' }}>Tu dashboard se arma a tu medida</strong> — en el siguiente paso te preguntamos qué te importa más para mostrarte primero lo relevante.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => onNavigate('login')}>
              <KIcon name="arrow-left" size={14} /> Atrás
            </button>
            <button type="button" className="kbv-btn kbv-btn-primary lg" style={{ flex: 1 }} onClick={() => onNavigate('identity')}>
              Empezar — solo toma 1 minuto
              <KIcon name="arrow-right" size={16} />
            </button>
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 2 — Identity (name + photo + bio)
// ─────────────────────────────────────────────────────────────
function IdentityScreenV2({ onNavigate, user, setUser }) {
  const [touched, setTouched] = React.useState(false);
  const fileRef = React.useRef(null);
  const nameValid = (user?.name || '').trim().length > 0;

  function update(k, v) { setUser(u => ({ ...u, [k]: v })); }

  function onFilePick(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => update('photo', ev.target.result);
    reader.readAsDataURL(f);
  }

  function submit() {
    setTouched(true);
    if (!nameValid) return;
    onNavigate('intent');
  }

  return (
    <OnboardingShell step={2} total={3}
      title="Empecemos por ti."
      subtitle="Solo lo necesario para que Kibo te trate como persona. Puedes cambiarlo cuando quieras desde tu cuenta."
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start', maxWidth: 900 }}>
        {/* Photo upload — large drag-drop area */}
        <div>
          <label className="kbv-label" style={{ marginBottom: 8, display: 'block' }}>Tu foto (opcional)</label>
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer?.files?.[0];
              if (!f) return;
              const r = new FileReader();
              r.onload = (ev) => update('photo', ev.target.result);
              r.readAsDataURL(f);
            }}
            style={{
              border: '2px dashed var(--kb-border-strong)',
              borderRadius: 18,
              padding: 24,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
              background: 'var(--kb-card)',
              transition: 'all 160ms',
              minHeight: 280,
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--kb-primary)'; e.currentTarget.style.background = 'var(--kb-primary-soft)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--kb-border-strong)'; e.currentTarget.style.background = 'var(--kb-card)'; }}
          >
            {user?.photo ? (
              <>
                <UserAvatar user={user} size={140} ring="var(--kb-primary)" />
                <button type="button" className="kbv-btn-link" onClick={(e) => { e.stopPropagation(); update('photo', null); }}>
                  Quitar foto
                </button>
              </>
            ) : (
              <>
                <div style={{
                  width: 140, height: 140, borderRadius: '50%',
                  background: 'var(--kb-surface)',
                  border: '2px solid var(--kb-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--kb-text-3)',
                }}>
                  <KIcon name="camera" size={48} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: 'var(--kb-text)', fontSize: 14 }}>Sube tu foto</div>
                  <div style={{ fontSize: 12, color: 'var(--kb-text-2)', marginTop: 2 }}>
                    Arrástrala aquí o haz clic. PNG, JPG hasta 5MB.
                  </div>
                </div>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFilePick} />
          </div>
          <p className="kbv-meta" style={{ marginTop: 8 }}>
            Si la dejas vacía, usamos las iniciales de tu nombre en un círculo de color.
          </p>
        </div>

        {/* Name + bio */}
        <div className="kbv-stack-20">
          <div className="kbv-field">
            <label className="kbv-label" htmlFor="user-name">¿Cómo quieres que te digamos?</label>
            <input
              id="user-name"
              className={`kbv-input ${touched && !nameValid ? 'error' : ''}`}
              type="text"
              placeholder="Tu nombre o apodo"
              maxLength={28}
              value={user?.name || ''}
              onChange={(e) => update('name', e.target.value)}
              autoFocus
            />
            {touched && !nameValid && (
              <div className="kbv-error">
                <KIcon name="alert" size={14} />
                <span>Necesitamos un nombre para personalizar la experiencia.</span>
              </div>
            )}
          </div>

          <div className="kbv-field">
            <label className="kbv-label" htmlFor="user-bio">Cuéntanos quién eres (opcional)</label>
            <textarea
              id="user-bio"
              className="kbv-input"
              style={{ minHeight: 100, resize: 'vertical', fontFamily: 'var(--kb-f-body)' }}
              placeholder="Ej: Ingeniero de 32, papá, intento construir hábitos más sanos. Me cuesta el foco profundo."
              maxLength={300}
              value={user?.bio || ''}
              onChange={(e) => update('bio', e.target.value)}
            />
            <div className="kbv-meta" style={{ marginTop: 4 }}>
              Esto nos ayuda a sugerirte hábitos, lecturas y configuraciones más relevantes. Privado — no se comparte.
            </div>
          </div>

          {/* Live preview chip */}
          <div style={{
            background: 'var(--kb-surface)',
            border: '1px solid var(--kb-border)',
            borderRadius: 12,
            padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <UserAvatar user={user} size={44} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--kb-text)' }}>
                {user?.name?.trim() || 'Tu nombre'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--kb-text-2)' }}>
                Así te verás en la app.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
            <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => onNavigate('welcome')}>
              <KIcon name="arrow-left" size={14} /> Atrás
            </button>
            <button type="button" className="kbv-btn kbv-btn-primary lg" style={{ flex: 1 }} disabled={!nameValid} onClick={submit}>
              Siguiente
              <KIcon name="arrow-right" size={16} />
            </button>
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 3 — Intent / "¿Qué es lo más importante para ti ahora?"
//   Multi-select. Each option seeds a different set of default
//   widgets and sidebar emphasis on the dashboard.
// ─────────────────────────────────────────────────────────────
const INTENT_OPTIONS = [
  { id: 'organize',     icon: 'layers',    c: 'var(--kb-primary)', name: 'Ordenar mi vida',           desc: 'Quiero un panorama claro de todo lo que tengo entre manos.',
    seeds: ['highlight', 'tasks', 'streak', 'coach'] },
  { id: 'habits',       icon: 'flame',     c: 'var(--kb-streak)', name: 'Construir hábitos sólidos', desc: 'Quiero que la racha y los hábitos sean lo primero que vea.',
    seeds: ['habits-big', 'streak', 'weekMood', 'coach'] },
  { id: 'reduce',       icon: 'sword',     c: 'var(--kb-hp)', name: 'Cortar malos hábitos',      desc: 'Quiero lanzar retos para vencer dependencias y vicios.',
    seeds: ['reto', 'streak', 'coach', 'weekMood'] },
  { id: 'finance',      icon: 'wealth',    c: 'var(--kb-coin)', name: 'Llevar mis finanzas',       desc: 'Quiero ver mi dinero — cuentas, créditos, gastos, ingresos.',
    seeds: ['finance-balance', 'finance-expenses', 'finance-budget', 'streak'] },
  { id: 'work',         icon: 'folder',    c: 'var(--kb-gem)', name: 'Avanzar en mi trabajo',     desc: 'Proyectos, tareas urgentes y foco profundo.',
    seeds: ['tasks', 'projects-mini', 'streak', 'coach'] },
  { id: 'health',       icon: 'vigor',     c: 'var(--area-vigor)', name: 'Mejorar mi salud',          desc: 'Energía física, entrenamientos, descanso.',
    seeds: ['habits-big', 'weekMood', 'streak', 'highlight'] },
  { id: 'learning',     icon: 'wisdom',    c: 'var(--kb-gem-ink)', name: 'Aprender algo nuevo',       desc: 'Lectura, cursos, Pomodoro, notas, progreso intelectual.',
    seeds: ['lectura', 'highlight', 'streak', 'coach'] },
  { id: 'study',        icon: 'layers',    c: 'var(--kb-good)', name: 'Estudiar de verdad',         desc: 'Pomodoro + sync con Platzi/Coursera/Udemy. XP a Sabiduría.',
    seeds: ['lectura', 'pomodoro', 'streak', 'coach'] },
  { id: 'relationships',icon: 'community', c: 'var(--area-community)', name: 'Mejorar mis relaciones',    desc: 'Llamadas, mensajes, momentos con quien quiero.',
    seeds: ['highlight', 'gratitude', 'streak', 'coach'] },
  { id: 'journal',      icon: 'edit',      c: 'var(--area-community)', name: 'Llevar un diario',          desc: 'Reflexión diaria, mood, fotos, transcripción de voz.',
    seeds: ['moodPicker', 'prompt', 'gratitude', 'weekMood'] },
  { id: 'media',        icon: 'film',      c: 'var(--kb-media)', name: 'Trackear lo que consumo',   desc: 'Libros, pelis, series — con rating y reflexiones.',
    seeds: ['lectura', 'watch', 'games', 'highlight'] },
  { id: 'creative',     icon: 'sparkle',   c: 'var(--area-will)', name: 'Crear más',                 desc: 'Proyectos personales, side-projects, lo que me llena.',
    seeds: ['projects-mini', 'tasks', 'coach', 'streak'] },
];

function IntentScreenV2({ onNavigate, user, setUser }) {
  const selected = user?.intents || [];
  function toggle(id) {
    setUser(u => {
      const cur = u?.intents || [];
      const next = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id];
      return { ...u, intents: next };
    });
  }

  const canContinue = selected.length > 0 && selected.length <= 5;

  return (
    <OnboardingShell step={3} total={3}
      title="¿Qué es lo más importante para ti ahora?"
      subtitle="Elige hasta 5. Con esto armamos tu dashboard inicial — las áreas y widgets más relevantes salen al frente. No te preocupes, todo se puede ajustar después."
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32, alignItems: 'start' }}>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {INTENT_OPTIONS.map(o => {
              const on = selected.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => toggle(o.id)}
                  style={{
                    background: on ? `color-mix(in oklab, ${o.c} 10%, var(--kb-canvas))` : 'var(--kb-card)',
                    border: on ? `2px solid ${o.c}` : '1.5px solid var(--kb-border)',
                    borderRadius: 14,
                    padding: '14px 16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 160ms',
                    display: 'flex', flexDirection: 'column', gap: 8,
                    minHeight: 130,
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: `color-mix(in oklab, ${o.c} 18%, var(--kb-canvas))`,
                      color: o.c,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <KIcon name={o.icon} size={18} />
                    </span>
                    {on && (
                      <span style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: o.c, color: 'var(--kb-canvas)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <KIcon name="check" size={12} />
                      </span>
                    )}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'var(--kb-f-display)',
                      fontWeight: 800, fontSize: 14,
                      color: on ? o.c : 'var(--kb-text)',
                    }}>{o.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--kb-text-2)', marginTop: 4, lineHeight: 1.4 }}>{o.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, alignItems: 'center' }}>
            <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => onNavigate('identity')}>
              <KIcon name="arrow-left" size={14} /> Atrás
            </button>
            <div style={{ flex: 1, fontSize: 12, color: 'var(--kb-text-2)' }}>
              {selected.length === 0
                ? <>Elige al menos 1 para continuar.</>
                : selected.length > 5
                  ? <>Máximo 5 prioridades — selecciona menos.</>
                  : <>Has elegido <strong style={{ color: 'var(--kb-text)' }}>{selected.length}</strong>. Bien — pocas y claras es mejor que muchas.</>}
            </div>
            <button type="button" className="kbv-btn kbv-btn-primary lg" disabled={!canContinue} onClick={() => onNavigate('tutorial')}>
              Continuar <KIcon name="arrow-right" size={16} />
            </button>
          </div>
        </div>

        <div className="kbv-stack-16" style={{ position: 'sticky', top: 0 }}>
          <div className="kbv-coach" style={{ alignItems: 'flex-start' }}>
            <KiboMascot size={56} pose="head" mood="happy" />
            <div className="msg">
              <span className="from">Kibo</span>
              Si todo te importa todo, nada importa. Elige las 2-3 que más mueven la aguja para ti ahorita — el resto se puede agregar después.
            </div>
          </div>
          <div style={{
            background: 'var(--kb-card)',
            border: '1px solid var(--kb-border)',
            borderRadius: 12,
            padding: 14,
          }}>
            <span className="kbv-eyebrow" style={{ marginBottom: 8, display: 'block' }}>Tu dashboard incluirá</span>
            {selected.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--kb-text-3)', fontStyle: 'italic' }}>
                Elige prioridades para ver los widgets recomendados.
              </div>
            ) : (
              <div className="kbv-stack-8">
                {Array.from(new Set(selected.flatMap(id => INTENT_OPTIONS.find(o => o.id === id)?.seeds || []))).slice(0, 8).map(w => (
                  <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--kb-primary)' }} />
                    <span style={{ color: 'var(--kb-text)', fontWeight: 600 }}>{labelForWidget(w)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}

function labelForWidget(id) {
  const labels = {
    'highlight': 'Resumen del día',
    'tasks': 'Tareas de hoy',
    'streak': 'Tu racha global',
    'coach': 'Consejos de Kibo',
    'habits-big': 'Hábitos de hoy (grande)',
    'weekMood': 'Mood semanal',
    'moodPicker': 'Selector de mood',
    'prompt': 'Prompt del día',
    'gratitude': 'Gratitud',
    'lectura': 'Lectura activa',
    'watch': 'Pelis y series',
    'games': 'Videojuegos',
    'projects-mini': 'Proyectos en curso',
    'finance-balance': 'Balance financiero',
    'finance-expenses': 'Gastos recientes',
    'finance-budget': 'Presupuesto del mes',
  };
  return labels[id] || id;
}

// ─────────────────────────────────────────────────────────────
// SCREEN 4 — Areas ranking (kept, simpler header)
// ─────────────────────────────────────────────────────────────
function AreasScreenV2({ onNavigate, user, setUser }) {
  const order = user?.areas || ['vigor', 'wisdom', 'wealth', 'community', 'will'];
  const [draggingId, setDraggingId] = React.useState(null);
  const [overIdx, setOverIdx] = React.useState(null);

  function move(from, to) {
    if (from === to) return;
    const next = [...order];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setUser(u => ({ ...u, areas: next }));
  }
  function moveUp(i) { if (i > 0) move(i, i - 1); }
  function moveDown(i) { if (i < order.length - 1) move(i, i + 1); }

  function onDragStart(e, id) {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', id); } catch (_) {}
  }
  function onDragOver(e, i) { e.preventDefault(); setOverIdx(i); }
  function onDrop(e, i) {
    e.preventDefault();
    if (!draggingId) return;
    const fromIdx = order.indexOf(draggingId);
    if (fromIdx !== -1) move(fromIdx, i);
    reset();
  }
  function reset() { setDraggingId(null); setOverIdx(null); }

  return (
    <OnboardingShell step={4} total={4}
      title="Ordena tus áreas de vida."
      subtitle="Las áreas son los frentes de tu vida — el orden afecta cómo se acomoda tu dashboard. Esto se puede cambiar más adelante."
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>
        <div className="kbv-stack-12">
          {order.map((areaId, i) => {
            const a = KIBO_AREAS_V2.find(x => x.id === areaId);
            const isDragging = draggingId === areaId;
            const showHover = overIdx === i && draggingId && draggingId !== areaId;
            return (
              <div
                key={areaId}
                className={`kbv-area-card ${isDragging ? 'dragging' : ''}`}
                style={{
                  '--c': a.color,
                  outline: showHover ? `2px dashed ${a.color}` : 'none',
                  outlineOffset: showHover ? 2 : 0,
                }}
                draggable
                onDragStart={(e) => onDragStart(e, areaId)}
                onDragOver={(e) => onDragOver(e, i)}
                onDrop={(e) => onDrop(e, i)}
                onDragEnd={reset}
              >
                <span className="rank">{i + 1}</span>
                <span className="glyph"><KIcon name={a.glyph} size={24} /></span>
                <div className="body">
                  <div className="name">{a.name}</div>
                  <div className="desc">{a.desc}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button type="button" onClick={() => moveUp(i)} disabled={i === 0}
                    style={{ background: 'transparent', border: 0, padding: 4, cursor: i === 0 ? 'default' : 'pointer', color: i === 0 ? 'var(--kb-text-3)' : 'var(--kb-text-2)' }}
                    aria-label="Subir">
                    <svg width="14" height="10" viewBox="0 0 14 10"><path d="M2 8l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button type="button" onClick={() => moveDown(i)} disabled={i === order.length - 1}
                    style={{ background: 'transparent', border: 0, padding: 4, cursor: i === order.length - 1 ? 'default' : 'pointer', color: i === order.length - 1 ? 'var(--kb-text-3)' : 'var(--kb-text-2)' }}
                    aria-label="Bajar">
                    <svg width="14" height="10" viewBox="0 0 14 10"><path d="M2 2l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
                <span className="grip" aria-hidden><KIcon name="grip" size={16} /></span>
              </div>
            );
          })}

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button type="button" className="kbv-btn kbv-btn-ghost" onClick={() => onNavigate('intent')}>
              <KIcon name="arrow-left" size={14} /> Atrás
            </button>
            <button type="button" className="kbv-btn kbv-btn-primary lg" style={{ flex: 1 }} onClick={() => onNavigate('tutorial')}>
              Entrar al tutorial <KIcon name="arrow-right" size={16} />
            </button>
          </div>
        </div>

        <div className="kbv-stack-16">
          <div className="kbv-coach">
            <KiboMascot size={56} pose="head" mood="happy" />
            <div className="msg">
              <span className="from">Kibo</span>
              No hay respuestas correctas. Arrastra hasta que el orden refleje lo que TÚ priorizas.
            </div>
          </div>
          <div className="kbv-card" style={{ padding: 16 }}>
            <span className="kbv-eyebrow" style={{ marginBottom: 10, display: 'block' }}>Las cinco áreas</span>
            <div className="kbv-stack-12">
              {KIBO_AREAS_V2.map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--kb-text)' }}>{a.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--kb-text-2)' }}>{a.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}

Object.assign(window, {
  WelcomeScreenV2, IdentityScreenV2, IntentScreenV2, AreasScreenV2,
  OnboardingShell, UserAvatar,
  KIBO_AREAS_V2, INTENT_OPTIONS, KIBO_PILLARS,
});
