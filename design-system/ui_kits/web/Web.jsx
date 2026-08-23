/* Kibo · Web kit — marketing, auth, onboarding components */

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.6 9.2c0-.6 0-1.1-.2-1.7H9v3.3h4.8a4 4 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5z"/><path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.8v2.3A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.9 10.7a5.4 5.4 0 0 1 0-3.4V5H.8a9 9 0 0 0 0 8l3.1-2.3z"/><path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6A9 9 0 0 0 .8 5l3.1 2.3C4.6 5.2 6.6 3.6 9 3.6z"/></svg>
  );
}
function MsMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 21 21"><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>
  );
}

function Nav({ go }) {
  return (
    <header className="web-nav">
      <div className="web-nav-in">
        <a onClick={() => go('landing')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="../../assets/kibo-mark.svg" width="30" height="30" alt="" />
          <b style={{ fontFamily: 'var(--kb-f-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-.02em' }}>Kibo</b>
        </a>
        <nav className="web-nav-links">
          <a>Filosofía</a><a>Blog</a><a>FAQ</a>
        </nav>
        <div style={{ display: 'flex', gap: 10 }}>
          <a className="kbv-btn kbv-btn-secondary" onClick={() => go('login')}>Entrar</a>
          <a className="kbv-btn kbv-btn-primary" onClick={() => go('register')}>Crear cuenta</a>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return <footer className="web-foot">© {new Date().getFullYear()} Kibo · Personal OS gamificado · Hecho en México</footer>;
}

function Landing({ go }) {
  return (
    <>
      <section className="hero">
        <h1>Tu vida es la mejor<br /><span className="accent">aventura</span> que jugarás.</h1>
        <p>Kibo convierte tus metas en misiones, tus hábitos en rachas y cada avance en experiencia. Un segundo cerebro con filosofía zen.</p>
        <div className="hero-cta">
          <a className="kbv-btn kbv-btn-primary kbv-btn-lg" onClick={() => go('register')}>Empezar onboarding →</a>
          <a className="kbv-btn kbv-btn-secondary kbv-btn-lg" onClick={() => go('login')}>Ya tengo cuenta</a>
        </div>
        <div className="hero-chips">
          <span className="hero-chip"><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--area-vigor)' }} />Vigor</span>
          <span className="hero-chip"><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--area-wisdom)' }} />Sabiduría</span>
          <span className="hero-chip"><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--area-wealth)' }} />Riqueza</span>
          <span className="hero-chip"><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--area-community)' }} />Comunidad</span>
          <span className="hero-chip"><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--area-will)' }} />Voluntad</span>
        </div>
      </section>
      <div className="hero-preview">
        <div className="hero-frame">
          <div style={{ display: 'flex', gap: 16, padding: 28, background: 'var(--kb-surface)' }}>
            {[['XP', '2 480', 'var(--kb-primary)'], ['Racha', '42 días', 'var(--kb-streak)'], ['Nivel', '27', 'var(--kb-text)']].map(([k, v, c]) => (
              <div key={k} style={{ flex: 1, background: '#fff', border: '1px solid var(--kb-border)', borderRadius: 'var(--kb-r-lg)', padding: 18, boxShadow: 'var(--kb-sh-1)' }}>
                <div style={{ fontFamily: 'var(--kb-f-mono)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--kb-text-3)' }}>{k}</div>
                <div style={{ fontFamily: 'var(--kb-f-mono)', fontSize: 26, color: c, marginTop: 6 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function OAuthRow() {
  return (
    <>
      <div className="oauth-row">
        <button className="oauth-btn"><MsMark /> Microsoft</button>
        <button className="oauth-btn"><GoogleMark /> Google</button>
      </div>
      <div className="divider"><span>O continúa con</span></div>
    </>
  );
}

function Register({ go }) {
  const [pw, setPw] = React.useState('');
  const checks = [
    { ok: pw.length >= 6, label: 'Al menos 6 caracteres' },
    { ok: /[A-Z]/.test(pw), label: 'Una mayúscula' },
    { ok: /[0-9]/.test(pw), label: 'Un número' },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ['var(--kb-surface-2)', 'var(--pri-high)', 'var(--kb-coin)', 'var(--kb-primary)'];
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-head"><h2>Crear cuenta</h2><p>Únete a Kibo y comienza tu aventura</p></div>
        <OAuthRow />
        <div className="field"><label>Nombre de usuario</label><input placeholder="tu_nombre_usuario" /></div>
        <div className="field"><label>Correo electrónico</label><input type="email" placeholder="tu@email.com" /></div>
        <div className="field"><label>Contraseña</label><input type="password" placeholder="••••••••" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
        <div className="strength">
          <div className="strength-bars">{[0, 1, 2].map((i) => <i key={i} style={{ background: i < score ? colors[score] : 'var(--kb-surface-2)' }} />)}</div>
          {checks.map((c) => <span key={c.label} className={`strength-item${c.ok ? ' ok' : ''}`}><Icon name={c.ok ? 'check-circle-2' : 'circle'} size={13} /> {c.label}</span>)}
        </div>
        <button className="kbv-btn kbv-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }} onClick={() => go('onboarding')}>Crear cuenta</button>
        <div className="auth-foot">¿Ya tienes una cuenta? <a onClick={() => go('login')}>Inicia sesión</a></div>
      </div>
    </div>
  );
}

function Login({ go }) {
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-head"><h2>Bienvenido a Kibo</h2><p>Inicia sesión para continuar tu aventura</p></div>
        <OAuthRow />
        <div className="field"><label>Correo electrónico</label><input type="email" placeholder="tu@email.com" /></div>
        <div className="field">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label>Contraseña</label><a style={{ fontSize: 11, color: 'var(--kb-text-3)', cursor: 'pointer' }}>¿Olvidaste tu contraseña?</a>
          </div>
          <input type="password" placeholder="••••••••" />
        </div>
        <button className="kbv-btn kbv-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12, marginTop: 4 }} onClick={() => go('onboarding')}>Iniciar sesión</button>
        <div className="auth-foot">¿Nuevo en Kibo? <a onClick={() => go('register')}>Crear cuenta</a></div>
      </div>
    </div>
  );
}

function Onboarding({ go }) {
  return (
    <>
      <div className="onb-progress"><i style={{ width: '33%' }} /></div>
      <div className="onb-wrap">
        <div className="onb-card">
          <div className="onb-head">
            <div className="onb-badge"><Icon name="user-round" size={32} color="var(--kb-primary)" /></div>
            <h2>Configura tu personaje</h2>
            <p>Toda gran aventura comienza con un nombre. ¿Cómo te llamaremos?</p>
          </div>
          <div className="onb-avatar">
            <div className="onb-avatar-ring">
              <Icon name="user-round" size={52} color="var(--kb-text-3)" />
              <div className="onb-cam"><Icon name="camera" size={16} color="#fff" /></div>
            </div>
            <span className="field hint" style={{ margin: 0 }}>Subir foto</span>
          </div>
          <div className="field"><label>Tu nombre</label><input placeholder="¿Cómo te dicen tus amigos?" defaultValue="Mariana" /></div>
          <div className="field"><label>Género</label>
            <select><option>Selecciona una opción</option><option>Mujer</option><option>Hombre</option><option>No binario</option><option>Prefiero no decir</option></select>
            <span className="hint">Para dirigirnos a ti correctamente.</span>
          </div>
          <div className="field"><label>Fecha de nacimiento</label><input type="date" /><span className="hint">¡Para celebrar tu vuelta al sol!</span></div>
          <div className="field"><label>Tu misión actual</label><textarea rows="3" placeholder="¿Qué quieres lograr este año?"></textarea><span className="hint">Opcional, pero nos ayuda a conocerte mejor.</span></div>
          <div className="onb-foot">
            <button className="kbv-btn kbv-btn-secondary" onClick={() => go('register')}>Volver</button>
            <button className="kbv-btn kbv-btn-primary" onClick={() => go('landing')}>¡Listo, vamos! 🚀</button>
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--kb-text-3)', marginTop: 14 }}>Paso 1 de 3</div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { Nav, Footer, Landing, Register, Login, Onboarding });
