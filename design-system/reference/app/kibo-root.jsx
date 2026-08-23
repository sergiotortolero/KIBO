// kibo-root.jsx — raíz de la plataforma Kibo (sin marco de navegador ni panel de tweaks).
// Reemplaza a app-v2.jsx: el estado de pantalla vive aquí y se siembra desde las props.

const KIBO_PROFILES = {
  novato:     { label: 'Novato (recién onboarding)',   level: 4,   xp: 320,  xpMax: 1000, prestigeCompleted: 0,  prestige: 'Recluta',  streak: 2,  coins: '120',   gems: 40,    hp: 92 },
  intermedio: { label: 'Intermedio (medio prestigio)', level: 42,  xp: 2480, xpMax: 4000, prestigeCompleted: 7,  prestige: 'Templado', streak: 23, coins: '1,245', gems: 5340,  hp: 84 },
  maestro:    { label: 'Maestro (todo desbloqueado)',  level: 100, xp: 3850, xpMax: 4000, prestigeCompleted: 16, prestige: 'Maestro',  streak: 88, coins: '9,999', gems: 24000, hp: 100, paragonLevel: 340 },
};

const KIBO_DEFAULT_USER = {
  name: '',
  photo: null,
  bio: '',
  intents: [],
  areas: ['vigor', 'wisdom', 'wealth', 'community', 'will'],
};

const KIBO_DEMO_USER = {
  name: 'Mateo',
  photo: null,
  bio: 'Ingeniero, 32, intentando construir hábitos más sanos y llevar mejor mis finanzas.',
  intents: ['habits', 'finance', 'work'],
  areas: ['will', 'wisdom', 'vigor', 'community', 'wealth'],
};

const KIBO_SCREENS = ['login', 'register', 'welcome', 'identity', 'intent', 'tutorial', 'dashboard'];

const KIBO_SCREEN_LABELS = {
  login:    '01 · Inicio de sesión',
  register: '02 · Registro',
  welcome:  '03 · Bienvenida',
  identity: '04 · ¿Quién eres?',
  intent:   '05 · Tus prioridades',
  tutorial: '06 · Tutorial',
  dashboard:'07 · Hoy',
};

function KiboRoot(props) {
  const initial = KIBO_SCREENS.includes(props.screen) ? props.screen : 'dashboard';
  const [screen, setScreen] = React.useState(initial);
  const [user, setUser] = React.useState(KIBO_DEFAULT_USER);

  // La prop manda cuando cambia desde el editor
  React.useEffect(() => {
    if (KIBO_SCREENS.includes(props.screen)) setScreen(props.screen);
  }, [props.screen]);

  // Usuario demo al entrar directo a tutorial/dashboard
  React.useEffect(() => {
    if ((screen === 'tutorial' || screen === 'dashboard') && !user.name) setUser(KIBO_DEMO_USER);
  }, [screen]);

  React.useEffect(() => {
    const root = document.documentElement;
    const primary = props.primary || 'var(--kb-primary)'; // teal canónico del DS
    root.style.setProperty('--kb-primary', primary);
    root.style.setProperty('--kb-primary-hover', shadeHex(primary, -0.10));
    root.style.setProperty('--kb-primary-soft', `color-mix(in oklab, ${primary} 14%, var(--kb-canvas))`);
    root.style.setProperty('--kb-primary-ink', shadeHex(primary, -0.35));
    root.style.setProperty('--kb-xp', primary);
  }, [props.primary]);

  function navigate(next) {
    if (!KIBO_SCREENS.includes(next)) return;
    setScreen(next);
  }

  const PROFILE = KIBO_PROFILES[props.profile] || KIBO_PROFILES.intermedio;

  const stats = {
    level: PROFILE.level,
    prestige: PROFILE.prestige,
    prestigeCompleted: PROFILE.prestigeCompleted,
    prestigeMaster: PROFILE.prestigeCompleted >= 16,
    paragonLevel: PROFILE.paragonLevel || 0,
    hp: PROFILE.hp ?? 84, hpMax: 100, hpPct: PROFILE.hp ?? 84,
    xp: PROFILE.xp, xpMax: PROFILE.xpMax, xpPct: Math.round((PROFILE.xp / PROFILE.xpMax) * 100),
    streak: PROFILE.streak,
    protectors: 1,
    protectorsMax: 2,
    coins: PROFILE.coins,
    gems: PROFILE.gems,
    bossActive: props.bossActive !== false,
    profile: props.profile || 'intermedio',
  };

  let body = null;
  switch (screen) {
    case 'login':     body = <LoginScreenV2    onNavigate={navigate} />; break;
    case 'register':  body = <RegisterScreenV2 onNavigate={navigate} />; break;
    case 'welcome':   body = <WelcomeScreenV2  onNavigate={navigate} />; break;
    case 'identity':  body = <IdentityScreenV2 onNavigate={navigate} user={user} setUser={setUser} />; break;
    case 'intent':    body = <IntentScreenV2   onNavigate={navigate} user={user} setUser={setUser} />; break;
    case 'tutorial':  body = <TutorialOverlay  onNavigate={navigate} user={user} stats={stats} />; break;
    case 'dashboard': body = <DashboardScreenV2 onNavigate={navigate} user={user} stats={stats} />; break;
    default:          body = <DashboardScreenV2 onNavigate={navigate} user={user} stats={stats} />;
  }

  return (
    <div className="kbv-app">
      <div className="kbv-window" data-screen-label={KIBO_SCREEN_LABELS[screen]}>
        {body}
      </div>
    </div>
  );
}

window.KiboRoot = KiboRoot;
