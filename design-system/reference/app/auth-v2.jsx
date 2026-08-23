// auth-v2.jsx — Login + Register (Spanish, light theme, Duolingo-adjacent)

// ─────────────────────────────────────────────────────────────
// Shared
// ─────────────────────────────────────────────────────────────
// Logo v2 — KIBO de verdad más el wordmark en minúsculas con punto teal.
// Antes la marca era un SVG dibujado a mano: un SEGUNDO KIBO que se separaba
// del de la esquina cada vez que el real cambiaba (cara v2, ojos, boca, piel).
// La marca monta el mismo componente que el fab, así no pueden divergir; solo
// se le quitan las capas que a 34px son ruido (aura, juguete) y el suelo.
function KiboLogo({ compact = false, onClick }) {
  const mark = (
    <span className="mark" aria-hidden="true">
      {typeof KiboBlob === 'function' ?
        <KiboBlob size={34} asMark mood="calma" idle={false} ground={false}
                  styleOverride={{ aura: 'au-none', toy: 'toy-none' }} /> : null}
    </span>
  );
  const body = (
    <React.Fragment>
      {mark}
      <span className="word">kibo<i className="dot" /></span>
    </React.Fragment>
  );
  if (!onClick) return <span className={`kbv-logo v2 ${compact ? 'compact' : ''}`}>{body}</span>;
  return (
    <button type="button" className={`kbv-logo v2 as-btn ${compact ? 'compact' : ''}`}
            onClick={onClick} title="Ir al inicio de Kibo" aria-label="Ir al inicio de Kibo">
      {body}
    </button>
  );
}

function AuthSide({ headline, sub, bubble, mood = 'happy' }) {
  return (
    <div className="kbv-auth-side">
      <KiboLogo />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start' }}>
        <h1 className="kbv-side-headline">{headline}</h1>
        <p className="kbv-side-sub">{sub}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
        <KiboMascot size={120} mood={mood} />
        <div className="kbv-bubble">
          <span className="from">Kibo</span>
          {bubble}
        </div>
      </div>
    </div>
  );
}

function SocialButtonsV2({ verb }) {
  return (
    <div className="kbv-social-grid">
      <button type="button" className="kbv-social">
        <KIcon name="google" size={16} />
        <span>{verb} con Google</span>
      </button>
      <button type="button" className="kbv-social">
        <KIcon name="microsoft" size={16} />
        <span>{verb} con Microsoft</span>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 1 — Login
// ─────────────────────────────────────────────────────────────
function LoginScreenV2({ onNavigate }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [failures, setFailures] = React.useState(0);
  const [captchaPassed, setCaptchaPassed] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [locked, setLocked] = React.useState(false);

  const needsCaptcha = failures >= 2 && !locked;

  function submit(e) {
    e && e.preventDefault();
    if (locked) return;
    if (!email || !password) { setError('Ingresa tu correo y contraseña.'); return; }
    if (needsCaptcha && !captchaPassed) { setError('Completa la verificación para continuar.'); return; }
    const ok = email.trim().toLowerCase() === 'hero@kibo.app' && password === 'Quest123!';
    if (ok) { setFailures(0); setError(null); onNavigate('dashboard'); return; }
    const next = failures + 1;
    setFailures(next);
    setCaptchaPassed(false);
    if (next >= 5) {
      setLocked(true);
      setError('Cuenta bloqueada tras 5 intentos. Recupera tu contraseña para continuar.');
    } else if (next >= 2) {
      setError(`Credenciales incorrectas. Verifica que no eres un robot (intento ${next} de 5).`);
    } else {
      setError(`No pudimos validar esas credenciales. Te quedan ${5 - next} intentos.`);
    }
  }

  const mood = error ? (locked ? 'alert' : 'worried') : 'happy';
  const bubble = locked
    ? "Te bloquearon. Recupera tu acceso y vuelve — te espero."
    : failures >= 2
      ? "Tómate un segundo. Verifica que no eres un bot y reintenta."
      : "¡Bienvenido de regreso! Tu héroe te está esperando.";

  return (
    <div className="kbv-auth kbv-fade">
      <AuthSide
        mood={mood}
        headline="Tu Hero te está esperando."
        sub="Kibo organiza tu vida con tareas, hábitos y un sistema RPG sutil que te mantiene en movimiento. Sin presión, sin ruido."
        bubble={bubble}
      />
      <div className="kbv-auth-form">
        <div className="inner">
          <div>
            <h2 className="kbv-h2">Inicia sesión</h2>
            <p className="kbv-body" style={{ marginTop: 4 }}>Continúa tu progreso desde donde lo dejaste.</p>
          </div>

          <form className="kbv-stack-16" onSubmit={submit}>
            <div className="kbv-field">
              <label className="kbv-label" htmlFor="login-email">Correo</label>
              <input
                id="login-email"
                className={`kbv-input ${error && !locked ? 'error' : ''}`}
                type="email"
                placeholder="hero@kibo.app"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                disabled={locked}
                autoComplete="email"
              />
            </div>

            <div className="kbv-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <label className="kbv-label" htmlFor="login-pw">Contraseña</label>
                <button type="button" className="kbv-btn-link" style={{ padding: 0, fontSize: 12 }}>¿Olvidaste tu contraseña?</button>
              </div>
              <div className="kbv-input-row">
                <input
                  id="login-pw"
                  className={`kbv-input ${error && !locked ? 'error' : ''}`}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  disabled={locked}
                  autoComplete="current-password"
                />
                <button type="button" className="eye-btn" onClick={() => setShowPw(s => !s)}>
                  <KIcon name={showPw ? 'eye-off' : 'eye'} size={16} />
                </button>
              </div>
            </div>

            {error && (
              <div className="kbv-error" role="alert">
                <KIcon name="alert" size={14} />
                <span>{error}</span>
              </div>
            )}

            {needsCaptcha && (
              <div className="kbv-captcha kbv-fade">
                <div
                  className={`box ${captchaPassed ? 'checked' : ''}`}
                  onClick={() => setCaptchaPassed(true)}
                  role="checkbox"
                  aria-checked={captchaPassed}
                />
                <div className="label">No soy un robot</div>
                <div className="brand">KIBO·CAPTCHA<br/>Privacidad · Términos</div>
              </div>
            )}

            <button type="submit" className="kbv-btn kbv-btn-primary lg" disabled={locked}>
              {locked ? 'Cuenta bloqueada' : 'Entrar'}
              {!locked && <KIcon name="arrow-right" size={16} />}
            </button>
          </form>

          <div className="kbv-divider">o continúa con</div>
          <SocialButtonsV2 verb="Entrar" />

          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--kb-text-2)' }}>
            ¿Aún no tienes cuenta?{' '}
            <button type="button" className="kbv-btn-link" onClick={() => onNavigate('register')} style={{ display: 'inline', padding: '0 4px' }}>
              Crear tu Hero
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 2 — Register
// ─────────────────────────────────────────────────────────────
function RegisterScreenV2({ onNavigate }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [touched, setTouched] = React.useState(false);
  const [error, setError] = React.useState(null);

  const requirements = React.useMemo(() => ([
    { id: 'len', label: '8+ caracteres', met: password.length >= 8 },
    { id: 'up',  label: 'Mayúscula',     met: /[A-Z]/.test(password) },
    { id: 'lo',  label: 'Minúscula',     met: /[a-z]/.test(password) },
    { id: 'n',   label: 'Número',        met: /[0-9]/.test(password) },
    { id: 's',   label: 'Símbolo',       met: /[^A-Za-z0-9]/.test(password) },
  ]), [password]);

  const score = requirements.filter(r => r.met).length;
  const matches = confirm.length > 0 && confirm === password;
  const allMet = score === 5;

  function submit(e) {
    e && e.preventDefault();
    setTouched(true);
    if (!email.includes('@')) { setError('Ingresa un correo válido.'); return; }
    if (!allMet) { setError('La contraseña no cumple todos los requisitos.'); return; }
    if (!matches) { setError('Las contraseñas no coinciden.'); return; }
    setError(null);
    onNavigate('avatar');
  }

  const mood = score >= 4 ? 'celebrating' : (touched && error ? 'worried' : 'happy');

  return (
    <div className="kbv-auth kbv-fade">
      <AuthSide
        mood={mood}
        headline="Forja un nuevo Hero."
        sub="Una cuenta, un Hero persistente, infinitas misiones. Funciona con correo corporativo, educativo o personal."
        bubble="Elige una contraseña que recuerdes — la vas a usar todos los días."
      />
      <div className="kbv-auth-form">
        <div className="inner">
          <div>
            <h2 className="kbv-h2">Crea tu cuenta</h2>
            <p className="kbv-body" style={{ marginTop: 4 }}>Empieza tu aventura en menos de un minuto.</p>
          </div>

          <form className="kbv-stack-16" onSubmit={submit}>
            <div className="kbv-field">
              <label className="kbv-label" htmlFor="reg-email">Correo</label>
              <input
                id="reg-email"
                className={`kbv-input ${touched && !email.includes('@') ? 'error' : ''}`}
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
              />
            </div>

            <div className="kbv-field">
              <label className="kbv-label" htmlFor="reg-pw">Contraseña</label>
              <div className="kbv-input-row">
                <input
                  id="reg-pw"
                  className={`kbv-input ${touched && !allMet ? 'error' : ''}`}
                  type={showPw ? 'text' : 'password'}
                  placeholder="Crea una contraseña segura"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPw(s => !s)}>
                  <KIcon name={showPw ? 'eye-off' : 'eye'} size={16} />
                </button>
              </div>
              <div className={`kbv-strength-meter s${score}`}>
                <span /><span /><span /><span /><span />
              </div>
              <div className="kbv-strength-list">
                {requirements.map(r => (
                  <div key={r.id} className={`kbv-strength-item ${r.met ? 'ok' : ''}`}>
                    <span className="dot" />
                    <span>{r.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="kbv-field">
              <label className="kbv-label" htmlFor="reg-conf">Confirmar contraseña</label>
              <input
                id="reg-conf"
                className={`kbv-input ${touched && !matches ? 'error' : ''}`}
                type={showPw ? 'text' : 'password'}
                placeholder="Repite la contraseña"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setError(null); }}
              />
              {confirm.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 12,
                              color: matches ? 'var(--kb-primary-ink)' : 'var(--kb-hp)', fontWeight: 600 }}>
                  <KIcon name={matches ? 'check' : 'alert'} size={14} />
                  <span>{matches ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}</span>
                </div>
              )}
            </div>

            {error && (
              <div className="kbv-error" role="alert">
                <KIcon name="alert" size={14} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="kbv-btn kbv-btn-primary lg">
              Crear cuenta
              <KIcon name="arrow-right" size={16} />
            </button>
          </form>

          <div className="kbv-divider">o regístrate con</div>
          <SocialButtonsV2 verb="Registrarme" />

          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--kb-text-2)' }}>
            ¿Ya tienes cuenta?{' '}
            <button type="button" className="kbv-btn-link" onClick={() => onNavigate('login')} style={{ display: 'inline', padding: '0 4px' }}>
              Inicia sesión
            </button>
          </div>

          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--kb-text-3)' }}>
            Al continuar aceptas el Código del Héroe · Términos · Privacidad.
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LoginScreenV2, RegisterScreenV2, KiboLogo, AuthSide });
