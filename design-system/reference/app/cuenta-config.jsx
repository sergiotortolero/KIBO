// cuenta-config.jsx — Cuenta y Configuración.
// Dos pantallas de ajustes con el mismo vocabulario: tarjetas kbv-char-card,
// SectionHead, filas de ajuste (label + control a la derecha) y KbToggle.

// ── KbToggle — el switch del sistema ─────────────────────────────
function KbToggle({ on, onChange, disabled }) {
  return (
    <button type="button" role="switch" aria-checked={!!on} disabled={disabled}
            className={`kbv-toggle ${on ? 'on' : ''}`}
            onClick={() => onChange && onChange(!on)}>
      <i />
    </button>
  );
}

// Fila de ajuste: texto a la izquierda, control a la derecha.
function SettingRow({ icon, color = 'var(--kb-primary)', title, sub, children, onClick }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag type={onClick ? 'button' : undefined} className={`kbv-setting-row ${onClick ? 'clickable' : ''}`} onClick={onClick}>
      {icon && <span className="sr-ico" style={{ '--c': color }}><KIcon name={icon} size={15} /></span>}
      <span className="sr-txt">
        <span className="sr-title">{title}</span>
        {sub && <span className="sr-sub">{sub}</span>}
      </span>
      <span className="sr-ctl">{children}</span>
    </Tag>
  );
}

// ═══════════════════════════════════════════════════════════════
// CUENTA — identidad, acceso, plan y datos.
// ═══════════════════════════════════════════════════════════════
function CuentaScreen({ user }) {
  const name = (user?.name || 'Hero').trim() || 'Hero';
  const [toast, setToast] = React.useState(null);
  const [ask, confirmDialog] = useConfirm();
  const flash = (m) => { setToast(m); clearTimeout(flash._t); flash._t = setTimeout(() => setToast(null), 2400); };

  const SESSIONS = [
    { id: 's1', device: 'MacBook Pro · Chrome', where: 'CDMX, MX', when: 'Esta sesión', current: true },
    { id: 's2', device: 'iPhone 15 · App Kibo', where: 'CDMX, MX', when: 'hace 2 h' },
    { id: 's3', device: 'iPad · Safari', where: 'Querétaro, MX', when: 'hace 9 días' },
  ];
  const [sessions, setSessions] = React.useState(SESSIONS);
  const [priv, setPriv] = React.useState({ retos: true, usage: true });

  return (
    <div className="kbv-main kbv-settings">
      {confirmDialog}
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--kb-primary)' }}>{crumb('cuenta', 'Tu identidad')}</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Cuenta.</h1>
        </div>
      </div>

      {/* Identidad */}
      <div className="kbv-card kbv-char-card">
        <SectionHead tight title="Perfil" meta="Cómo te ve tu círculo — el resto de tu identidad visual vive en la Vitrina" />
        <div className="kbv-account-id">
          {typeof UserAvatar === 'function' ? <UserAvatar user={user} size={64} /> : <span className="acc-av">{name[0]}</span>}
          <div className="acc-fields">
            <div className="kbv-form-row"><label>Nombre</label><input type="text" defaultValue={name} /></div>
            <div className="kbv-form-row"><label>Usuario</label><input type="text" defaultValue={'@' + name.toLowerCase().replace(/\s+/g, '.')} /></div>
          </div>
          <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => flash('Perfil guardado ✓')}>Guardar</button>
        </div>
      </div>

      {/* Acceso */}
      <div className="kbv-card kbv-char-card">
        <SectionHead tight title="Acceso" meta="Correo, contraseña y cuentas conectadas" />
        <div className="kbv-settings-list">
          <SettingRow icon="user" title="Correo" sub="hero@kibo.mx · verificado">
            <button type="button" className="fr-btn" onClick={() => flash('Te enviamos un correo para cambiarlo')}>Cambiar</button>
          </SettingRow>
          <SettingRow icon="shield" color="var(--kb-gem)" title="Contraseña" sub="Actualizada hace 3 meses">
            <button type="button" className="fr-btn" onClick={() => flash('Te enviamos un enlace seguro')}>Cambiar</button>
          </SettingRow>
          <SettingRow icon="google" color="var(--kb-text-2)" title="Google" sub="Conectada · inicio de sesión rápido">
            <button type="button" className="fr-btn ghost" title="Desconectar" onClick={() => flash('Google desconectado')}><KIcon name="x" size={13} /></button>
          </SettingRow>
          <SettingRow icon="microsoft" color="var(--kb-text-2)" title="Microsoft" sub="Sin conectar">
            <button type="button" className="fr-btn" onClick={() => flash('Abriendo Microsoft…')}>Conectar</button>
          </SettingRow>
        </div>
      </div>

      {/* Plan */}
      <div className="kbv-card kbv-char-card kbv-plan-card">
        <SectionHead tight title="Plan" meta="Lo que incluye tu suscripción">
          <span className="kbv-tag" style={{ background: 'var(--kb-primary-soft)', color: 'var(--kb-primary-ink)' }}>Premium anual</span>
        </SectionHead>
        <div className="kbv-plan-body">
          <div className="plan-perks">
            {['Materia oscura mensual incluida', 'Cofres con mejores probabilidades', 'IA: insights y coach semanal', 'Sin límite de importaciones'].map(p => (
              <span key={p} className="plan-perk"><KIcon name="check" size={13} /> {p}</span>
            ))}
          </div>
          <div className="plan-meta">
            <span className="kbv-meta">Renueva el <strong>12 ene 2027</strong> · $899 MXN/año</span>
            <div className="plan-actions">
              <button type="button" className="fr-btn" onClick={() => flash('Abriendo facturas…')}>Ver facturas</button>
              <button type="button" className="fr-btn ghost" title="Administrar plan" onClick={() => flash('Abriendo administración del plan…')}><KIcon name="settings" size={13} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Facturación y pagos */}
      <div className="kbv-card kbv-char-card">
        <SectionHead tight title="Facturación y pagos" meta="Método de pago, historial y datos fiscales" />
        <div className="kbv-settings-list">
          <SettingRow icon="wealth" color="var(--kb-coin)" title="Método de pago" sub="Visa terminación 4521 · vence 08/28">
            <button type="button" className="fr-btn" onClick={() => flash('Abriendo cambio de tarjeta…')}>Cambiar</button>
          </SettingRow>
          <SettingRow icon="book" title="Datos fiscales" sub="RFC HELO900101XX0 · uso CFDI: G03">
            <button type="button" className="fr-btn" onClick={() => flash('Editando datos fiscales…')}>Editar</button>
          </SettingRow>
          {[
            { id: 'f3', when: '12 ene 2026', what: 'Premium anual', amt: '$899.00' },
            { id: 'f2', when: '3 nov 2025', what: 'Pack de materia oscura · 500', amt: '$149.00' },
            { id: 'f1', when: '12 ene 2025', what: 'Premium anual', amt: '$799.00' },
          ].map(f => (
            <SettingRow key={f.id} icon="check" color="var(--kb-primary)" title={f.what} sub={f.when + ' · pagado'}>
              <span className="kbv-num" style={{ fontSize: 'var(--kb-fs-md, 13px)' }}>{f.amt}</span>
              <button type="button" className="fr-btn ghost" title="Descargar factura" onClick={() => flash('Descargando factura…')}><KIcon name="upload" size={13} style={{ transform: 'rotate(180deg)' }} /></button>
            </SettingRow>
          ))}
        </div>
      </div>

      {/* Privacidad de la cuenta */}
      <div className="kbv-card kbv-char-card">
        <SectionHead tight title="Privacidad" meta="Quién te ve, quién te contacta y qué guardamos" />
        <div className="kbv-settings-list">
          <SettingRow icon="search" title="Quién puede encontrarte" sub="En búsquedas de amigos por nombre o @usuario">
            <select defaultValue="todos" onChange={() => flash('Preferencia guardada ✓')}>
              <option value="todos">Todos</option>
              <option value="fof">Amigos de amigos</option>
              <option value="nadie">Nadie · solo por invitación</option>
            </select>
          </SettingRow>
          <SettingRow icon="sword" color="var(--kb-boss)" title="Invitaciones a retos" sub="Permitir que tus amigos te propongan retos compartidos">
            <KbToggle on={priv.retos} onChange={(v) => setPriv(p => ({ ...p, retos: v }))} />
          </SettingRow>
          <SettingRow icon="chart" title="Datos de uso anónimos" sub="Ayudan a mejorar Kibo; nunca incluyen tu contenido">
            <KbToggle on={priv.usage} onChange={(v) => setPriv(p => ({ ...p, usage: v }))} />
          </SettingRow>
          <SettingRow icon="community" color="var(--area-community)" title="Borrar historial social" sub="Elimina tu rastro del feed de tus amigos (aplausos, eventos)">
            <button type="button" className="fr-btn danger"
                    onClick={() => ask({ title: 'Borrar historial social', message: 'Tus eventos desaparecen del feed de todos tus amigos. Tus logros y rachas NO se tocan.', confirmLabel: 'Sí, borrar', onConfirm: () => flash('Historial social borrado ✓') })}>
              Borrar
            </button>
          </SettingRow>
        </div>
      </div>

      {/* Sesiones */}
      <div className="kbv-card kbv-char-card">
        <SectionHead tight title="Sesiones activas" meta="Dónde está abierta tu cuenta" />
        <div className="kbv-settings-list">
          {sessions.map(s => (
            <SettingRow key={s.id} icon={s.device.includes('iPhone') || s.device.includes('iPad') ? 'camera' : 'chart'}
                        color={s.current ? 'var(--kb-primary)' : 'var(--kb-text-2)'}
                        title={s.device} sub={`${s.where} · ${s.when}`}>
              {s.current
                ? <span className="kbv-tag" style={{ background: 'var(--kb-primary-soft)', color: 'var(--kb-primary-ink)' }}>Actual</span>
                : <button type="button" className="fr-btn ghost" title="Cerrar sesión"
                          onClick={() => { setSessions(ss => ss.filter(x => x.id !== s.id)); flash('Sesión cerrada'); }}><KIcon name="x" size={13} /></button>}
            </SettingRow>
          ))}
        </div>
      </div>

      {/* Datos y zona delicada */}
      <div className="kbv-card kbv-char-card">
        <SectionHead tight title="Tus datos" meta="Tu historia es tuya — llévatela cuando quieras" />
        <div className="kbv-settings-list">
          <SettingRow icon="book" color="var(--kb-primary)" title="Exportar todo" sub="Markdown + CSV: hábitos, retos, diario, finanzas, notas">
            <button type="button" className="fr-btn" onClick={() => flash('Preparando tu exportación — te avisamos por correo')}>Exportar</button>
          </SettingRow>
          <SettingRow icon="alert" color="var(--kb-hp)" title="Eliminar cuenta" sub="Borra tu personaje, tu historia y tus datos. Sin vuelta atrás.">
            <button type="button" className="fr-btn danger"
                    onClick={() => ask({ title: 'Eliminar tu cuenta', message: 'Se borra TODO: personaje, rachas, logros, finanzas y notas. No hay recuperación. ¿Seguro?', confirmLabel: 'Sí, eliminar todo', onConfirm: () => flash('Cuenta programada para eliminarse en 14 días') })}>
              Eliminar
            </button>
          </SettingRow>
        </div>
      </div>

      {toast && <div className="kbv-social-toast"><KIcon name="check" size={14} /> {toast}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN — preferencias, notificaciones, juego, integraciones.
// ═══════════════════════════════════════════════════════════════
const KIBO_PREFS_KEY = 'kibo:prefs';
function loadPrefs() {
  const def = {
    lang: 'es-MX', weekStart: 'lunes', dayEnd: '02:00',
    notifHabits: true, notifSocial: true, notifSummary: true, notifStreak: true,
    sounds: true, celebrations: true, reducedMotion: false, hardcore: false,
    publicProfile: true, showActivity: true,
    sidebarMode: 'replegable', aiProvider: 'ninguno', aiKey: '',
  };
  try { return { ...def, ...(JSON.parse(localStorage.getItem(KIBO_PREFS_KEY) || '{}')) }; } catch (_) { return def; }
}

function ConfigScreen() {
  const [prefs, setPrefs] = React.useState(loadPrefs);
  const [toast, setToast] = React.useState(null);
  const flash = (m) => { setToast(m); clearTimeout(flash._t); flash._t = setTimeout(() => setToast(null), 2400); };
  function set(k, v) {
    setPrefs(p => {
      const next = { ...p, [k]: v };
      try { localStorage.setItem(KIBO_PREFS_KEY, JSON.stringify(next)); } catch (_) {}
      // Avisar: el resto de la app escucha y se aplica en el momento.
      try { window.dispatchEvent(new CustomEvent('kibo:prefs', { detail: next })); } catch (_) {}
      return next;
    });
  }

  const INTEGRATIONS = [
    { id: 'obsidian', name: 'Obsidian', desc: 'Abre tu Bóveda tal cual, sin conversión', icon: 'book-open', color: 'var(--area-community)', status: 'nuevo' },
    { id: 'gcal', name: 'Google Calendar', desc: 'Eventos en tu Agenda y Hoy', icon: 'calendar', color: 'var(--kb-primary)', status: 'off' },
    { id: 'health', name: 'Apple Salud / Google Fit', desc: 'Pasos, sueño y entrenos hacia Salud', icon: 'vigor', color: 'var(--area-vigor)', status: 'off' },
    { id: 'notion', name: 'Notion', desc: 'Importa bases de datos como listas', icon: 'layers', color: 'var(--kb-text-2)', status: 'off' },
  ];

  return (
    <div className="kbv-main kbv-settings">
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--kb-primary)' }}>{crumb('config', 'Tu plataforma, a tu modo')}</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Configuración.</h1>
        </div>
      </div>

      <div className="kbv-settings-grid">
        {/* Preferencias */}
        <div className="kbv-card kbv-char-card">
          <SectionHead tight title="Preferencias" meta="Idioma y calendario" />
          <div className="kbv-settings-list">
            <SettingRow icon="chart" title="Idioma" sub="La voz de KIBO también cambia">
              <select value={prefs.lang} onChange={(e) => set('lang', e.target.value)}>
                <option value="es-MX">Español (MX)</option>
                <option value="en">English</option>
              </select>
            </SettingRow>
            <SettingRow icon="calendar" title="La semana empieza en" sub="Afecta rachas y resúmenes semanales">
              <select value={prefs.weekStart} onChange={(e) => set('weekStart', e.target.value)}>
                <option value="lunes">Lunes</option>
                <option value="domingo">Domingo</option>
              </select>
            </SettingRow>
            <SettingRow icon="clock" title="Tu día termina a las" sub="Lo que hagas antes de esa hora cuenta para el día anterior">
              <select value={prefs.dayEnd} onChange={(e) => set('dayEnd', e.target.value)}>
                <option value="00:00">Medianoche</option>
                <option value="02:00">2:00 am</option>
                <option value="04:00">4:00 am</option>
              </select>
            </SettingRow>
            <SettingRow icon="layers" title="Menú lateral" sub="Replegable muestra el botón para colapsarlo">
              <select value={prefs.sidebarMode} onChange={(e) => { set('sidebarMode', e.target.value); flash('Listo — el menú ya quedó así'); }}>
                <option value="replegable">Replegable</option>
                <option value="fijo">Fijo · siempre abierto</option>
              </select>
            </SettingRow>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="kbv-card kbv-char-card">
          <SectionHead tight title="Notificaciones" meta="Solo las que empujan — nada de ruido" />
          <div className="kbv-settings-list">
            <SettingRow icon="flame" color="var(--kb-streak)" title="Rescate de racha" sub="Aviso cuando tu racha esté por romperse">
              <KbToggle on={prefs.notifStreak} onChange={(v) => set('notifStreak', v)} />
            </SettingRow>
            <SettingRow icon="check" title="Recordatorios de hábitos" sub="A la hora que definiste en cada hábito">
              <KbToggle on={prefs.notifHabits} onChange={(v) => set('notifHabits', v)} />
            </SettingRow>
            <SettingRow icon="community" color="var(--area-community)" title="Empujones del círculo" sub="Cuando un amigo te anima o te reta">
              <KbToggle on={prefs.notifSocial} onChange={(v) => set('notifSocial', v)} />
            </SettingRow>
            <SettingRow icon="chart" title="Resumen semanal" sub="Domingo por la noche, con tu semana leída por KIBO">
              <KbToggle on={prefs.notifSummary} onChange={(v) => set('notifSummary', v)} />
            </SettingRow>
          </div>
        </div>

        {/* Juego */}
        <div className="kbv-card kbv-char-card">
          <SectionHead tight title="Juego y motion" meta="Cuánta fiesta quieres en pantalla" />
          <div className="kbv-settings-list">
            <SettingRow icon="sparkle" title="Celebraciones" sub="Pop al completar, ceremonia de cofres, level-up">
              <KbToggle on={prefs.celebrations} onChange={(v) => set('celebrations', v)} />
            </SettingRow>
            <SettingRow icon="mood-great" title="Sonidos" sub="Chispas discretas al ganar monedas y XP">
              <KbToggle on={prefs.sounds} onChange={(v) => set('sounds', v)} />
            </SettingRow>
            <SettingRow icon="gauge" title="Menos movimiento" sub="Reduce animaciones — respeta el ajuste del sistema">
              <KbToggle on={prefs.reducedMotion} onChange={(v) => set('reducedMotion', v)} />
            </SettingRow>
            <SettingRow icon="sword" color="var(--kb-hp)" title="Modo hardcore" sub="Doble daño al fallar retos. Para valientes.">
              <KbToggle on={prefs.hardcore} onChange={(v) => { set('hardcore', v); flash(v ? 'Modo hardcore activado ⚔' : 'Modo hardcore apagado'); }} />
            </SettingRow>
          </div>
        </div>

        {/* Privacidad */}
        <div className="kbv-card kbv-char-card">
          <SectionHead tight title="Privacidad" meta="Qué ve tu círculo de ti" />
          <div className="kbv-settings-list">
            <SettingRow icon="user" title="Perfil visible" sub="Tu vitrina aparece en búsquedas de amigos">
              <KbToggle on={prefs.publicProfile} onChange={(v) => set('publicProfile', v)} />
            </SettingRow>
            <SettingRow icon="community" color="var(--area-community)" title="Actividad en el círculo" sub="Tus logros y niveles aparecen en el feed de tus amigos">
              <KbToggle on={prefs.showActivity} onChange={(v) => set('showActivity', v)} />
            </SettingRow>
          </div>
        </div>
      </div>

      {/* Asistente KIBO · IA */}
      <div className="kbv-card kbv-char-card">
        <SectionHead tight title="Asistente KIBO" meta="El intérprete de «dile a KIBO qué hiciste» — tú eliges quién piensa" />
        <div className="kbv-settings-list">
          <SettingRow icon="mic" title="Proveedor de IA" sub="Sin proveedor, KIBO usa reglas locales básicas (montos, páginas, hábitos)">
            <select value={prefs.aiProvider} onChange={(e) => set('aiProvider', e.target.value)}>
              <option value="ninguno">Reglas locales (incluido)</option>
              <option value="propia">Mi API key (OpenAI / Anthropic / compatible)</option>
              <option value="local">IA local (Ollama · requisitos en el PRD)</option>
            </select>
          </SettingRow>
          {prefs.aiProvider === 'propia' && (
            <SettingRow icon="shield" color="var(--kb-gem)" title="API key" sub="Se guarda solo en este dispositivo, nunca en nuestros servidores">
              <input type="password" value={prefs.aiKey} placeholder="sk-…" style={{ width: 180 }}
                     onChange={(e) => set('aiKey', e.target.value)} />
            </SettingRow>
          )}
          {prefs.aiProvider === 'local' && (
            <SettingRow icon="gauge" title="IA local" sub="Ollama en http://localhost:11434 · modelo sugerido: llama3.2 3B (8 GB RAM)">
              <button type="button" className="fr-btn" onClick={() => flash('Buscando Ollama en tu equipo… (demo)')}>Probar conexión</button>
            </SettingRow>
          )}
        </div>
      </div>

      {/* Integraciones */}
      <div className="kbv-card kbv-char-card">
        <SectionHead tight title="Integraciones" meta="Kibo habla con lo que ya usas — tu data entra y sale en formatos abiertos" />
        <div className="kbv-integr-grid">
          {INTEGRATIONS.map(it => (
            <div key={it.id} className="kbv-integr" style={{ '--c': it.color }}>
              <span className="ig-ico"><KIcon name={it.icon} size={18} /></span>
              <div className="ig-txt">
                <span className="ig-name">{it.name}{it.status === 'nuevo' && <em className="ig-new">Nuevo</em>}</span>
                <span className="ig-desc">{it.desc}</span>
              </div>
              <button type="button" className="fr-btn" onClick={() => {
                if (it.id === 'obsidian') { try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'resources' } })); } catch (_) {} }
                else flash(`Conectando ${it.name}…`);
              }}>{it.id === 'obsidian' ? 'Ver en Bóveda' : 'Conectar'}</button>
            </div>
          ))}
        </div>
      </div>

      {toast && <div className="kbv-social-toast"><KIcon name="check" size={14} /> {toast}</div>}
    </div>
  );
}

Object.assign(window, { CuentaScreen, ConfigScreen, KbToggle, SettingRow });
