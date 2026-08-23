// tienda-screen.jsx — Tienda restructurada (Bloque D)
// Sobreescribe StoreScreen de screens-v2.jsx — cargado después en el HTML.
//
// Secciones:
//   1. Recompensas — solo monedas (custom rewards con icono custom)
//   2. Cofres — paga monedas, abre y obtienes MONEDAS + materia oscura + sorpresas
//   3. Widgets — compra widgets premium para el dashboard
//   4. Funciones — desbloqueables (más áreas, más hábitos, slots extra)
//   5. Cosméticos de Kibo — colores/skins para la mascota (no avatar)

// ─────────────────────────────────────────────────────────────
// Catálogos
// ─────────────────────────────────────────────────────────────

// ── Premios de cofre ─────────────────────────────────────────────
// Cada premio dice EXACTAMENTE qué hace. Nada de "sorpresa": la gracia está en
// no saber cuál cae, no en no saber qué te dieron.
const CHEST_PRIZES = {
  'xp-vigor':   { label: 'Multiplicador ×2 · Vigor',      sub: '48 h de XP doble en Salud y entrenos', icon: 'vigor',      color: 'var(--area-vigor)' },
  'xp-wisdom':  { label: 'Multiplicador ×2 · Sabiduría',  sub: '48 h de XP doble en Estudio y Lectura', icon: 'graduation', color: 'var(--area-wisdom)' },
  'xp-wealth':  { label: 'Multiplicador ×2 · Riqueza',    sub: '48 h de XP doble en Finanzas',         icon: 'wealth',     color: 'var(--kb-coin)' },
  'xp-all':     { label: 'Multiplicador ×3 · todas',      sub: '24 h de XP triple en las cinco áreas', icon: 'sparkle',    color: 'var(--kb-primary)' },
  'dayoff':     { label: 'Day off',                       sub: 'Un día sin registrar y tu racha no se rompe', icon: 'calendar', color: 'var(--kb-primary)' },
  'dayoff2':    { label: 'Doble day off',                 sub: 'Dos días de gracia para tus rachas',   icon: 'calendar',   color: 'var(--kb-primary)' },
  'shield':     { label: 'Protector de racha',            sub: 'Absorbe un día fallado automáticamente', icon: 'shield',   color: 'var(--kb-streak)' },
  'rescue':     { label: 'Rescate de reto',               sub: 'Convierte un fallo de reto en día neutro', icon: 'flag',    color: 'var(--kb-hp)' },
  'disc-20':    { label: 'Cupón −20 %',                   sub: 'En tu próxima recompensa personalizada', icon: 'shop',      color: 'var(--kb-good)' },
  'disc-50':    { label: 'Cupón −50 %',                   sub: 'En tu próxima recompensa personalizada', icon: 'shop',      color: 'var(--kb-good)' },
  'disc-free':  { label: 'Recompensa gratis',             sub: 'Canjea una recompensa tuya sin pagar monedas', icon: 'gift', color: 'var(--kb-hp)' },
  'cosm-comun': { label: 'Cosmético común',               sub: 'Piel o accesorio de KIBO',             icon: 'sparkle',    color: 'var(--kb-rarity-comun)' },
  'cosm-raro':  { label: 'Cosmético raro',                sub: 'Aura, juguete o portada de Vitrina',   icon: 'sparkle',    color: 'var(--kb-rarity-raro)' },
  'cosm-epico': { label: 'Cosmético épico',               sub: 'Piel animada o marco premium',        icon: 'crown',      color: 'var(--kb-rarity-epico)' },
  'cosm-legend':{ label: 'Cosmético legendario',          sub: 'Título honorífico o compañero KIBO',   icon: 'crown',      color: 'var(--kb-rarity-legendario)' },
  'slot':       { label: 'Casilla de Vitrina',            sub: 'Un espacio más para fijar logros',     icon: 'image',      color: 'var(--kb-coin)' },
};

// CHESTS — pagas monedas y el tesoro devuelve los DOS metales de la economía:
// monedas (más de las que metiste, si hay suerte) y materia oscura. Tier escalado.
// extras: probabilidad + premio, para el tooltip y para el roll real al abrir.
const STORE_CHESTS = [
  {
    id: 'ch1', name: 'Cofre de Madera', tier: 'madera',
    cost: 250, currency: 'coin',
    color: 'var(--kb-mat-madera)', accent: 'var(--kb-mat-madera-ink)',
    band: 'var(--kb-mat-hierro-ink)',
    gemRange: [2, 8], coinRange: [60, 180],
    odds: [
      { p: 0.22, prize: 'cosm-comun' },
      { p: 0.14, prize: 'shield' },
      { p: 0.10, prize: 'disc-20' },
      { p: 0.08, kind: 'coins', amount: 120 },
    ],
    desc: 'El cofre básico — pequeñas alegrías.',
  },
  {
    id: 'ch2', name: 'Cofre de Hierro', tier: 'hierro',
    cost: 800, currency: 'coin',
    color: 'var(--kb-mat-hierro)', accent: 'var(--kb-mat-hierro-ink)',
    band: 'var(--kb-mat-hierro-ink)',
    odds: [
      { p: 0.28, prize: 'cosm-comun' },
      { p: 0.18, prize: 'xp-vigor' },
      { p: 0.14, prize: 'dayoff' },
      { p: 0.12, prize: 'disc-20' },
      { p: 0.10, kind: 'coins', amount: 400 },
      { p: 0.06, prize: 'cosm-raro' },
    ],
    gemRange: [10, 30], coinRange: [220, 600],
    desc: 'Mejor recompensa de materia oscura y cosméticos raros.',
  },
  {
    id: 'ch3', name: 'Cofre de Oro', tier: 'oro',
    cost: 2000, currency: 'coin',
    color: 'var(--kb-mat-oro)', accent: 'var(--kb-mat-oro-ink)',
    band: 'var(--kb-mat-oro-ink)',
    odds: [
      { p: 0.34, prize: 'cosm-raro' },
      { p: 0.24, prize: 'xp-all' },
      { p: 0.20, prize: 'dayoff2' },
      { p: 0.16, prize: 'disc-50' },
      { p: 0.12, prize: 'rescue' },
      { p: 0.10, kind: 'coins', amount: 1000 },
      { p: 0.08, prize: 'cosm-epico' },
    ],
    gemRange: [40, 100], coinRange: [700, 1800],
    desc: 'Mucha materia oscura, alta probabilidad de cosmético raro.',
  },
  {
    id: 'ch4', name: 'Cofre Mítico', tier: 'mitico',
    cost: 5000, currency: 'coin',
    color: 'var(--area-community)', accent: 'var(--kb-community-ink)',
    band: 'var(--kb-mat-oro-ink)', animated: true,
    gemRange: [150, 400], coinRange: [2000, 5200],
    odds: [
      { p: 1.00, prize: 'cosm-legend', guaranteed: true },
      { p: 0.45, prize: 'disc-free' },
      { p: 0.35, prize: 'slot' },
      { p: 0.30, prize: 'xp-all' },
      { p: 0.25, prize: 'dayoff2' },
    ],
    desc: 'El cofre top — solo para los más rachudos.',
  },
];

// WIDGETS comprables (los gratuitos viven en la galería del dashboard)
const STORE_WIDGETS = [
  // free (referencia visual, no comprables — la mitad)
  { id: 'wg-coach',     name: 'Kibo Coach',          desc: 'Mensajes contextuales del mascot.', cost: 0, currency: 'coin', icon: 'sparkle',    color: 'var(--kb-primary)', owned: true,  free: true },
  { id: 'wg-streak',    name: 'Racha global',        desc: 'Tu racha + protectores + récord.',   cost: 0, currency: 'coin', icon: 'flame',      color: 'var(--kb-streak)', owned: true,  free: true },
  { id: 'wg-habits',    name: 'Hábitos de hoy',      desc: 'Marca tus hábitos del día.',         cost: 0, currency: 'coin', icon: 'flame',      color: 'var(--kb-streak)', owned: true,  free: true },
  { id: 'wg-tasks',     name: 'Tareas de hoy',       desc: 'Lista priorizada de pendientes.',     cost: 0, currency: 'coin', icon: 'list',       color: 'var(--kb-primary)', owned: true,  free: true },
  { id: 'wg-diario',    name: 'Diario del día',      desc: 'Mood + texto + transcripción.',       cost: 0, currency: 'coin', icon: 'edit',       color: 'var(--area-community)', owned: true,  free: true },
  { id: 'wg-lectura',   name: 'Lectura activa',      desc: 'Libro actual + páginas.',             cost: 0, currency: 'coin', icon: 'book-open',  color: 'var(--kb-gem)', owned: true,  free: true },
  // paid
  { id: 'wg-boss',      name: 'Panel de combate',    desc: 'Métricas avanzadas del reto · log de daño · proyección.', cost: 200, currency: 'gem',  icon: 'sword',   color: 'var(--kb-hp)' },
  { id: 'wg-weather',   name: 'Clima del día',       desc: 'Pronóstico + sugerencias de hábitos según el clima.',     cost: 600, currency: 'coin', icon: 'calendar',color: 'var(--kb-gem)' },
  { id: 'wg-goals',     name: 'Metas trimestrales',  desc: 'Objetivos de largo plazo con progreso visual.',           cost: 300, currency: 'coin', icon: 'layers',  color: 'var(--kb-good-soft)' },
  { id: 'wg-radar',     name: 'Radar de balance',    desc: 'Pentágono de áreas — visualización al instante.',         cost: 80,  currency: 'gem',  icon: 'sparkle', color: 'var(--area-community)' },
  { id: 'wg-ai-tip',    name: 'Tip diario IA',        desc: 'Recomendación personalizada cada día — basada en tu data.', cost: 150, currency: 'gem',  icon: 'sparkle', color: 'var(--kb-gem-ink)' },
  { id: 'wg-cal-month', name: 'Calendario mensual',   desc: 'Tu mes con hábitos · tareas · eventos · racha visible.', cost: 1200, currency: 'coin', icon: 'calendar',color: 'var(--kb-coin)' },
  { id: 'wg-fin-balance',name:'Balance financiero',   desc: 'Saldo neto · ingresos · gastos en mini-formato.',        cost: 800, currency: 'coin', icon: 'wealth',  color: 'var(--kb-primary)' },
  { id: 'wg-fin-budget', name:'Presupuesto del mes',   desc: 'Cuánto vas vs lo planeado por categoría.',                cost: 100, currency: 'gem',  icon: 'layers',  color: 'var(--pri-high)' },
];

// UNLOCKS — funciones / capacidades, agrupadas por lo que amplían.
const STORE_UNLOCK_GROUPS = [
  { id: 'g-space', name: 'Más espacio',      icon: 'layers',  color: 'var(--kb-gem)',        desc: 'Slots y filas extra para crecer tu sistema.' },
  { id: 'g-power', name: 'Más potencia',     icon: 'gauge',   color: 'var(--kb-primary)',    desc: 'Capacidades que amplían lo que Kibo hace por ti.' },
  { id: 'g-guard', name: 'Protección',       icon: 'shield',  color: 'var(--kb-streak)',     desc: 'Seguros contra los días malos — el fracaso reencauza.' },
  { id: 'g-ai',    name: 'Inteligencia',     icon: 'sparkle', color: 'var(--area-community)',desc: 'Análisis y recomendaciones sobre tu propia data.' },
  { id: 'g-wheel', name: 'Rueda de KIBO',    icon: 'mic',     color: 'var(--kb-primary)',    desc: 'Rubros extra para la acción rápida — registra sin navegar.' },
];
const STORE_UNLOCKS = [
  // Más espacio
  { id: 'u-area',      group: 'g-space', name: 'Área extra',              desc: 'Slot adicional para una nueva área (5 → 6).',                 cost: 200, currency: 'gem',  icon: 'layers',  color: 'var(--kb-gem)' },
  { id: 'u-row',       group: 'g-space', name: 'Fila extra de dashboard', desc: 'Una fila más para acomodar widgets en tu Hoy.',               cost: 8,   currency: 'gem',  icon: 'plus',    color: 'var(--area-community)' },
  { id: 'u-habit-slot',group: 'g-space', name: 'Slot extra de hábito',    desc: 'Sube tu tope de hábitos diarios (límite seguro de Kibo).',    cost: 18,  currency: 'gem',  icon: 'flame',   color: 'var(--kb-streak)' },
  { id: 'u-vitrina-xl',group: 'g-space', name: 'Vitrina ampliada',        desc: 'Sube el tope de casillas de tu carta de 6 a 9.',              cost: 120, currency: 'gem',  icon: 'image',   color: 'var(--kb-coin)' },
  // Más potencia
  { id: 'u-priority',  group: 'g-power', name: 'Prioridades extendidas',  desc: 'Prioriza hasta 8 tareas críticas en lugar de 5.',             cost: 60,  currency: 'gem',  icon: 'sword',   color: 'var(--kb-hp)' },
  { id: 'u-import',    group: 'g-power', name: 'Importaciones ilimitadas',desc: 'Sin límite mensual de estados de cuenta.',                    cost: 300, currency: 'gem',  icon: 'upload',  color: 'var(--kb-primary)' },
  { id: 'u-templates', group: 'g-power', name: 'Plantillas pro',          desc: 'Rutinas completas listas: gym, tesis, ahorro, lectura.',      cost: 90,  currency: 'gem',  icon: 'list',    color: 'var(--kb-gem-ink)' },
  { id: 'u-focus',     group: 'g-power', name: 'Modo enfoque pro',        desc: 'Sesiones pomodoro con bloqueo de módulos y música.',          cost: 150, currency: 'gem',  icon: 'target',  color: 'var(--area-wisdom)' },
  { id: 'u-export',    group: 'g-power', name: 'Exportar mi data',        desc: 'Tu histórico completo en Markdown/CSV — tuyo, portable.',     cost: 40,  currency: 'gem',  icon: 'book',    color: 'var(--kb-text-2)' },
  // Protección
  { id: 'u-shield-auto',group:'g-guard', name: 'Protector automático',    desc: 'Si olvidas un día, se gasta solo un protector de racha.',     cost: 220, currency: 'gem',  icon: 'shield',  color: 'var(--kb-streak)' },
  { id: 'u-sabbath',   group: 'g-guard', name: 'Días sabáticos',          desc: '2 días al mes que pausan TODAS las rachas sin romperlas.',    cost: 180, currency: 'gem',  icon: 'calendar',color: 'var(--kb-primary)' },
  { id: 'u-rescue',    group: 'g-guard', name: 'Rescate de reto',         desc: 'Una vez por reto: convierte un fallo en día neutro.',         cost: 90,  currency: 'gem',  icon: 'flag',    color: 'var(--kb-hp)' },
  // Inteligencia
  { id: 'u-ai',        group: 'g-ai',    name: 'Pack IA · recomendaciones',desc: 'Finanzas + tendencias de mood + insights de lectura.',       cost: 500, currency: 'gem',  icon: 'sparkle', color: 'var(--kb-gem-ink)' },
  { id: 'u-ai-coach',  group: 'g-ai',    name: 'KIBO coach semanal',      desc: 'Cada domingo, KIBO te lee tu semana y propone el plan.',      cost: 350, currency: 'gem',  icon: 'mood-great', color: 'var(--kb-primary)' },
  { id: 'u-stats-pro', group: 'g-ai',    name: 'Estadísticas avanzadas',  desc: 'Correlaciones: sueño vs ánimo, gasto vs estrés, etc.',        cost: 260, currency: 'gem',  icon: 'chart',   color: 'var(--area-community)' },
  // (Los rubros de la rueda se agregan abajo, derivados del catálogo real.)
];

// Rueda de KIBO — DERIVADOS de `KIBO_QA_MODULES`, no escritos a mano. Eran dos
// listas que debían coincidir por buena voluntad, y no coincidían: la tienda
// ofrecía dos de los cinco rubros de pago — Entretenimiento, Amigos y Bóveda no
// se podían comprar en ninguna parte. Ahora un rubro con precio en el catálogo
// aparece en la tienda por el solo hecho de existir.
(function addWheelUnlocks() {
  const mods = (typeof KIBO_QA_MODULES !== 'undefined' && KIBO_QA_MODULES) || [];
  mods.filter(m => m.cost).forEach(m => {
    STORE_UNLOCKS.push({
      id: m.id, group: 'g-wheel', qa: true,
      name: `Rubro · ${m.name}`,
      desc: m.actions.map(a => a.name).join(' · ') + ' — sin salir de donde estés.',
      cost: m.cost, currency: 'gem', icon: m.icon, color: m.color,
    });
  });
})();

// (El catálogo de cosméticos de KIBO vive en kibo-style.jsx — guardarropa
// compartido que el blob del sidebar lee en vivo.)

// CUSTOM REWARDS — solo monedas. La materia oscura es premium-only.
const DEFAULT_CUSTOM_REWARDS_V2 = [
  { id: 'cr1', name: 'Café de especialidad', desc: 'Un latte del barista que te gusta.',     cost: 80,  currency: 'coin', icon: 'shop',    color: 'var(--kb-coin-ink)', customImage: null },
  { id: 'cr2', name: '1h de videojuegos',    desc: 'Sin culpa, sin reloj.',                  cost: 150, currency: 'coin', icon: 'sparkle', color: 'var(--area-community)', customImage: null },
  { id: 'cr3', name: 'Pelí en el cine',      desc: 'Sin laptop ni notificaciones.',          cost: 400, currency: 'coin', icon: 'film',    color: 'var(--kb-hp)', customImage: null },
  { id: 'cr4', name: 'Sushi de antojo',      desc: 'El roll que cuesta más, sin culpa.',     cost: 600, currency: 'coin', icon: 'shop',    color: 'var(--pri-high)', customImage: '🍣' },
];

// Reward icon presets — incluye opción de subir custom
const REWARD_ICON_PRESETS = [
  { id: 'shop',    icon: 'shop',    label: 'Compra' },
  { id: 'film',    icon: 'film',    label: 'Pantalla' },
  { id: 'sparkle', icon: 'sparkle', label: 'Brillo' },
  { id: 'flame',   icon: 'flame',   label: 'Llama' },
  { id: 'book',    icon: 'book',    label: 'Libro' },
  { id: 'home',    icon: 'home',    label: 'Casa' },
  { id: 'wealth',  icon: 'wealth',  label: 'Riqueza' },
  { id: 'sword',   icon: 'sword',   label: 'Espada' },
];

// ─────────────────────────────────────────────────────────────
// Items
// ─────────────────────────────────────────────────────────────

// Arte del cofre — un solo dibujo parametrizado por tier; `open` levanta la
// tapa (lo usa la animación de apertura).
// Arte del cofre — vista de tres cuartos con la BISAGRA ATRÁS: la tapa gira
// sobre su borde superior-posterior (rotateX), así se entreabre de atrás hacia
// adelante y el candado queda al frente, como debe ser.
// Colores planos por material (sin degradados): la textura la dan las vetas de
// la madera, los remaches del hierro y los biseles del oro.
// Arte del cofre — frontal y plano (estilo del referente): herrajes de esquina
// en metal, duelas horizontales del material, zunchos, placa de candado central
// con bocallave, y remaches. La tapa se abre hacia ATRÁS (rotateX), dejando ver
// el tesoro dentro.
// Arte del cofre — vista de 3/4 desde arriba: se ve la CARA SUPERIOR, así que
// existe una arista trasera real donde bisagra la tapa (arriba en pantalla =
// más al fondo). El tesoro se dibuja DENTRO de la cavidad y la pared frontal
// se pinta después, ocluyéndolo: por eso se lee «dentro de un contenedor».
// ═══ Cofre · propuesta 2D (sin 3D) ═══════════════════════════════
// El rotateX sobre arte plano siempre se lee como losa girando. Aquí la tapa
// tiene DOS ESTADOS DIBUJADOS —cerrada y abierta con su cara interior a la
// vista— y la transición es un levantar-e-inclinar en 2D. Es el método de la
// ilustración de juego: nunca puede verse como un panel volteándose.
// ═══ Cofre · proporciones de la referencia ═══════════════════════
// Reglas de composición (medidas sobre viewBox 0 0 120 120):
//   · el CUERPO es la masa dominante (y=52..116, ~2/3 del arte)
//   · la placa del candado ocupa ~1/3 del frente, no lo domina
//   · la tapa tiene su propia costura, distinta de la banda del cuerpo
//   · abierta, el arco sube a y=6..30 y deja 22 unidades limpias de cavidad
// Sin 3D: dos estados dibujados y transición 2D.
function ChestArt({ chest, size = 120, open = false }) {
  const band = chest.band || chest.accent;
  const wood = chest.color;
  const dark = chest.accent;
  const tier = chest.tier;
  const gid = 'sh-' + chest.id;

  const grain = tier === 'madera'
    ? <g stroke={dark} strokeWidth="1.4" opacity="0.34" fill="none"><path d="M 40 64 L 39 110" /><path d="M 60 64 L 60 110" /><path d="M 80 64 L 81 110" /></g>
    : tier === 'hierro'
      ? <g fill={dark} opacity="0.38"><circle cx="42" cy="100" r="2" /><circle cx="78" cy="100" r="2" /></g>
      : tier === 'oro'
        ? <path d="M 38 106 H 82" stroke={band} strokeWidth="3.4" opacity="0.6" />
        : <g className="ca-runes" fill="var(--kb-coin)"><circle cx="40" cy="98" r="2.2" /><circle cx="80" cy="98" r="2.2" /></g>;

  return (
    <svg className={`kbv-chest-art tier-${tier} ${open ? 'open' : ''}`} viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--kb-coin)" stopOpacity="0.55" />
          <stop offset="55%" stopColor="var(--kb-coin)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--kb-coin)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ── TAPA ABIERTA ── bien arriba del rim: deja la cavidad despejada */}
      <g className="ca-lid-open">
        <path d="M 22 22 Q 60 2 98 22 L 94 30 Q 60 10 26 30 Z" fill={dark} />
        <path d="M 26 30 Q 60 10 94 30 L 92 35 Q 60 16 28 35 Z" fill={band} />
        <path d="M 32 26 Q 60 12 88 26 Q 60 20 32 26 Z" fill="var(--kb-canvas)" opacity="0.2" />
      </g>

      {/* ── CAVIDAD ── 22 unidades limpias entre la tapa abierta y el rim */}
      <g className="ca-inner">
        <path d="M 24 33 H 96 V 62 H 24 Z" fill="var(--kb-dark-core)" />
        <path className="ca-shine" d="M 28 62 L 36 6 H 84 L 92 62 Z" fill={`url(#${gid})`} />
        <g className="ca-loot">
          {/* materia oscura: esferas de obsidiana con su halo — el mismo
              lenguaje del ícono de la moneda premium */}
          <circle cx="60" cy="46" r="11.5" fill="none" stroke="var(--kb-dark-halo)" strokeWidth="1.8" strokeDasharray="7 5" strokeLinecap="round" opacity="0.9" />
          <circle cx="60" cy="46" r="9.4" fill="var(--kb-dark-core)" stroke="var(--kb-dark-edge)" strokeWidth="1.2" />
          <path d="M 54 41 Q 58 37.6 63 39 Q 57.6 40.6 55.4 44.6 Z" fill="var(--kb-dark-facet)" opacity="0.75" />
          <circle cx="56.4" cy="42.2" r="1.7" fill="var(--kb-dark-glint)" opacity="0.95" />
          <circle cx="38" cy="52" r="6.4" fill="var(--kb-dark-core)" stroke="var(--kb-dark-edge)" strokeWidth="1" />
          <circle cx="36.2" cy="50" r="1.3" fill="var(--kb-dark-glint)" opacity="0.9" />
          <circle cx="83" cy="51" r="5.6" fill="var(--kb-dark-core)" stroke="var(--kb-dark-edge)" strokeWidth="1" />
          <circle cx="81.4" cy="49.2" r="1.2" fill="var(--kb-dark-glint)" opacity="0.9" />
          {/* oro acuñado: cantos vistos de lado + caras con la K */}
          <ellipse cx="31" cy="60" rx="8" ry="3" fill="var(--kb-mat-oro-ink)" />
          <ellipse cx="31" cy="58" rx="8" ry="3" fill="var(--kb-coin)" />
          <ellipse cx="47" cy="61" rx="7" ry="2.7" fill="var(--kb-mat-oro-ink)" />
          <ellipse cx="47" cy="59.2" rx="7" ry="2.7" fill="var(--kb-coin)" />
          <ellipse cx="73" cy="61" rx="7.4" ry="2.8" fill="var(--kb-mat-oro-ink)" />
          <ellipse cx="73" cy="59.2" rx="7.4" ry="2.8" fill="var(--kb-coin)" />
          <circle cx="90" cy="58" r="5.4" fill="var(--kb-coin)" stroke="var(--kb-mat-oro-ink)" strokeWidth="1.1" />
          <circle cx="90" cy="58" r="2.2" fill="var(--kb-mat-oro-ink)" opacity="0.5" />
        </g>
      </g>

      {/* ── CUERPO ── masa dominante, con su propia banda superior */}
      <g className="ca-base">
        <path d="M 18 60 H 102 V 110 Q 102 116 96 116 H 24 Q 18 116 18 110 Z" fill={wood} />
        <path d="M 18 60 H 102 V 70 H 18 Z" fill={band} />
        {grain}
        <path d="M 12 60 H 32 V 116 Q 32 120 28 120 H 16 Q 12 120 12 116 Z" fill={band} />
        <path d="M 88 60 H 108 V 116 Q 108 120 104 120 H 92 Q 88 120 88 116 Z" fill={band} />
        <circle cx="22" cy="80" r="2.4" fill={dark} opacity="0.5" />
        <circle cx="22" cy="108" r="2.4" fill={dark} opacity="0.5" />
        <circle cx="98" cy="80" r="2.4" fill={dark} opacity="0.5" />
        <circle cx="98" cy="108" r="2.4" fill={dark} opacity="0.5" />
        {/* placa del candado: ~1/3 del frente (h=19 de 56), no lo domina */}
        <g className="ca-lock">
          <rect x="49" y="76" width="22" height="19" rx="5" fill={band} />
          <circle cx="60" cy="83" r="3.2" fill={dark} />
          <path d="M 58 85 H 62 L 63 91 H 57 Z" fill={dark} />
        </g>
      </g>

      {/* ── TAPA CERRADA ── domo con costura PROPIA (y=48..58), distinta de la
           banda del cuerpo (y=60..70): se ve dónde abre. */}
      <g className="ca-lid-closed">
        <path d="M 18 60 H 102 V 44 Q 60 18 18 44 Z" fill={wood} />
        <path d="M 18 46 Q 60 22 102 46 L 102 56 Q 60 32 18 56 Z" fill={band} opacity="0.85" />
        <path d="M 12 52 H 108 V 60 Q 60 38 12 60 Z" fill={band} />
        <path d="M 28 36 Q 60 22 92 36 Q 60 28 28 36 Z" fill="var(--kb-canvas)" opacity="0.22" />
        <circle cx="22" cy="54" r="2.4" fill={dark} opacity="0.45" />
        <circle cx="98" cy="54" r="2.4" fill={dark} opacity="0.45" />
        {tier === 'mitico' && (
          <g className="ca-runes" fill="var(--kb-coin)">
            <circle cx="46" cy="36" r="2" /><circle cx="60" cy="29" r="1.8" /><circle cx="74" cy="36" r="2" />
          </g>
        )}
      </g>
    </svg>
  );
}

// Tooltip de contenido — lo garantizado y las probabilidades viven aquí,
// no regadas en la tarjeta.
function oddLabel(o) {
  if (o.prize) return CHEST_PRIZES[o.prize].label;
  if (o.kind === 'coins') return `+${o.amount.toLocaleString('es-MX')} monedas`;
  return o.label || 'Premio';
}
function chestOddsTip(chest) {
  const rows = [
    `Garantizado: ${chest.coinRange[0].toLocaleString('es-MX')}–${chest.coinRange[1].toLocaleString('es-MX')} monedas`,
    `Garantizado: ${chest.gemRange[0]}–${chest.gemRange[1]} de materia oscura`,
  ];
  (chest.odds || []).forEach(o => rows.push(o.guaranteed ? `Garantizado: ${oddLabel(o)}` : `${Math.round(o.p * 100)}%: ${oddLabel(o)}`));
  return rows.join(' · ');
}

function ChestCard({ chest, onOpen }) {
  return (
    <div className={`kbv-chest-card tier-${chest.tier}`} style={{ '--c': chest.color, '--accent': chest.accent }}>
      <div className="lid"><ChestArt chest={chest} size={124} /></div>
      <div className="info">
        <h4>
          {chest.name}
          <InfoDot label="i" text={chestOddsTip(chest)} />
        </h4>
        <p>{chest.desc}</p>
        <div className="ch-loot">
          <span className="cl-cell"><CoinIcon size={14} /> {chest.coinRange[0].toLocaleString('es-MX')}–{chest.coinRange[1].toLocaleString('es-MX')}</span>
          <span className="cl-cell"><GemIcon size={14} /> {chest.gemRange[0]}–{chest.gemRange[1]}</span>
          <em>seguros, en los dos metales</em>
        </div>
      </div>
      <button type="button" className="kbv-btn kbv-btn-primary buy" onClick={() => onOpen(chest)}>
        <CoinIcon size={12} /> Abrir · {chest.cost.toLocaleString('es-MX')}
      </button>
    </div>
  );
}

// ── Apertura de cofre · ceremonia a pantalla completa ────────────
// Fases: caer → sacudirse → estallar → recompensas en cascada.
// Con prefers-reduced-motion se salta directo a las recompensas.
// Intensidad de la ceremonia por rareza — madera es modesta, mítico es fiesta.
const CHEST_FANFARE = {
  madera: { sparks: 6,  rings: 1, shake: 1.5, hold: 900  },
  hierro: { sparks: 10, rings: 2, shake: 1.4, hold: 1200 },
  oro:    { sparks: 14, rings: 3, shake: 1.2, hold: 1500 },
  mitico: { sparks: 20, rings: 3, shake: 1.0, hold: 1900 },
};

function ChestOpeningOverlay({ chest, rewards, onClaim }) {
  const fan = CHEST_FANFARE[chest.tier] || CHEST_FANFARE.madera;
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [phase, setPhase] = React.useState(reduced ? 'rewards' : 'drop');
  // Guion completo: cae (0.7s) → se sacude (1.4s) → se abre la tapa (0.55s) →
  // estalla el destello y se expande el círculo (0.75s) → recompensas.
  // Antes 'burst' vivía 600ms con animaciones de 500ms encima y la tapa se
  // quedaba a medio abrir: por eso se veía cortada.
  React.useEffect(() => {
    if (reduced) return;
    // Cuanto más raro el cofre, más se hace esperar (y más grande el estallido).
    const t0 = 700, t1 = t0 + fan.hold, t2 = t1 + 550, t3 = t2 + 750;
    const ts = [
      setTimeout(() => setPhase('shake'), t0),
      setTimeout(() => setPhase('unlock'), t1),
      setTimeout(() => setPhase('burst'), t2),
      setTimeout(() => setPhase('rewards'), t3),
    ];
    return () => ts.forEach(clearTimeout);
  }, [reduced, fan.hold]);
  const showRewards = phase === 'rewards';
  const opening = phase === 'unlock' || phase === 'burst';
  return (
    <div className={`kbv-chest-ceremony tier-${chest.tier} ${phase}`}
         style={{ '--c': chest.color, '--accent': chest.accent, '--shake': fan.shake, '--rings': fan.rings }}
         role="dialog" aria-label={`Abriendo ${chest.name}`}>
      <div className="cc-veil" />
      {phase === 'burst' && [...Array(fan.rings)].map((_, i) => (
        <div key={i} className="cc-ring" style={{ '--r': i }} aria-hidden="true" />
      ))}
      <div className="cc-stage">
        {!showRewards && (
          <React.Fragment>
            <div className={`cc-chest ${phase}`}>
              <ChestArt chest={chest} size={210} open={opening} />
            </div>
            {/* Chispas FUERA del cofre: antes vivían dentro y heredaban su
                sacudida y escala, así que el anillo entero se movía rígido.
                Ahora suben con trayectoria propia y tiempos desfasados. */}
            {phase !== 'drop' && (
              <div className="cc-sparks" aria-hidden="true">
                {[...Array(fan.sparks)].map((_, i) => {
                  // Reparto uniforme en el abanico + jitter chico: el hash de
                  // antes dejaba el centro vacío y todo cargado a la izquierda.
                  const t = (i + 0.5) / fan.sparks;
                  const j = (((i * 2654435761) % 1000) / 1000 - 0.5) * 0.12;
                  const u = ((i * 40503) % 1000) / 1000;
                  return (
                    <i key={i} style={{
                      '--sx': `${(-46 + (t + j) * 92).toFixed(1)}%`,
                      '--dx': `${-30 + u * 60}px`,
                      '--dy': `${-120 - t * 130}px`,
                      '--sc': 0.5 + u * 0.7,
                      '--dl': `${(i % 7) * 0.16 + t * 0.4}s`,
                      '--du': `${1.9 + u * 1.3}s`,
                    }}>
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path d="M12 2 C 13.4 8 16 10.6 22 12 C 16 13.4 13.4 16 12 22 C 10.6 16 8 13.4 2 12 C 8 10.6 10.6 8 12 2 Z" fill="currentColor" />
                      </svg>
                    </i>
                  );
                })}
              </div>
            )}
          </React.Fragment>
        )}
        {showRewards && (
          <div className="cc-rewards">
            <span className="cc-title">¡{chest.name} abierto!</span>
            <div className="cc-cards">
              {rewards.map((r, i) => (
                <div key={i} className={`cc-card ${r.kind}`} style={{ '--d': `${0.12 + i * 0.14}s`, '--pc': r.color || 'var(--kb-primary)' }}>
                  <span className="cc-ico">
                    {r.kind === 'gems' ? <GemIcon size={30} /> : r.kind === 'coins' ? <CoinIcon size={30} /> : <KIcon name={r.icon || 'sparkle'} size={28} />}
                  </span>
                  <span className="cc-amount">{r.amount ? `+${r.amount.toLocaleString('es-MX')}` : r.label}</span>
                  <span className="cc-kind">{r.kind === 'gems' ? 'de materia oscura' : r.kind === 'coins' ? 'monedas' : r.sub}</span>
                </div>
              ))}
            </div>
            <button type="button" className="kbv-btn kbv-btn-primary cc-claim" autoFocus onClick={onClaim}>
              <KIcon name="check" size={15} /> Reclamar todo
            </button>
            <span className="kbv-meta">La materia oscura ya está en tu cartera.</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Widget de la Tienda — misma tarjeta de item que el resto de la plataforma (1g).
function WidgetStoreItem({ item, onBuy }) {
  return <ItemCard item={{ ...item, kind: item.free ? 'Gratis' : (item.currency === 'gem' ? 'Premium' : 'Pagado') }} onBuy={onBuy} />;
}

function UnlockItem({ item, owned, onBuy }) {
  // Un destello corto al pasar a «tuya»: sin él, comprar y no comprar se veían
  // casi igual y no quedaba claro si el clic había hecho algo.
  const first = React.useRef(owned);
  const [just, setJust] = React.useState(false);
  React.useEffect(() => {
    if (owned && !first.current) { setJust(true); const t = setTimeout(() => setJust(false), 700); return () => clearTimeout(t); }
    first.current = owned;
  }, [owned]);
  return (
    <div className={`kbv-unlock-item ${owned ? 'owned' : ''} ${just ? 'just' : ''}`} style={{ '--c': item.color }}>
      <div className="ico"><KIcon name={item.icon} size={20} /></div>
      <div className="body">
        <h4>{item.name}</h4>
        <p>{item.desc}</p>
      </div>
      {owned
        ? <span className="have"><KIcon name="check" size={12} /> Desbloqueado</span>
        : (
          <button type="button" className={`buy ${item.qa ? '' : 'soon'}`} onClick={() => onBuy(item)}>
            {item.currency === 'gem' ? <GemIcon size={12} /> : <CoinIcon size={12} />}
            {item.cost.toLocaleString('es-MX')}
          </button>
        )}
    </div>
  );
}

// ── Tienda · KIBO cosmético — el guardarropa ─────────────────────
// Vista previa EN VIVO a la izquierda (el mismo KiboBlob del sidebar la
// refleja al instante); catálogo por categoría a la derecha. Pasar el mouse
// sobre un item lo previsualiza; equipar escribe el guardarropa compartido.
const KIBO_STYLE_SECTIONS = [
  { part: 'skin', name: 'Pieles',        icon: 'sparkle', hint: 'El gel del cuerpo — y lo que se ve a través de él.' },
  { part: 'mark', name: 'Marcas',        icon: 'sparkle', multi: true, hint: 'Van en la cara: frente, nariz o cachetes. Ponte varias.' },
  { part: 'aura', name: 'Auras',         icon: 'flame',   hint: 'Grandes: rebasan la silueta.' },
  { part: 'pers', name: 'Personalidad',  icon: 'mood-great', hint: 'Sereno de fábrica; los comportamientos se compran.' },
];

function KiboStyleTab({ stats, flash }) {
  const style = (typeof useKiboStyle === 'function') ? useKiboStyle() : {};
  const [owned, setOwned] = React.useState(() => (typeof getKiboOwned === 'function') ? getKiboOwned() : new Set());
  const [preview, setPreview] = React.useState(null); // { part, id } | null
  const [ask, confirmDialog] = useConfirm();
  React.useEffect(() => {
    const upd = () => setOwned(getKiboOwned());
    window.addEventListener('kibo:kibo-change', upd);
    return () => window.removeEventListener('kibo:kibo-change', upd);
  }, []);

  function afford(it) {
    const have = it.currency === 'gem' ? (parseInt(stats?.gems, 10) || 0) : (parseInt(String(stats?.coins).replace(/,/g, ''), 10) || 0);
    return have >= it.cost;
  }
  function buy(part, it) {
    if (!afford(it)) {
      flash(it.currency === 'gem' ? 'No tienes suficiente materia oscura — ábrela en cofres' : 'No tienes suficientes monedas — gánalas con hábitos y retos');
      return;
    }
    ask({
      title: `Comprar ${it.name}`, danger: false, confirmLabel: 'Comprar y equipar',
      message: `Cuesta ${it.cost.toLocaleString('es-MX')} ${it.currency === 'gem' ? 'de materia oscura' : 'monedas'}. Se equipa al instante — lo verás en tu KIBO de la izquierda.`,
      onConfirm: () => { ownKiboItem(it.id); setKiboStyle(part, it.id); flash(`${it.name} equipado ✨`); },
    });
  }
  const overrideStyle = preview ? { [preview.part]: preview.id } : null;

  return (
    <div className="kbv-kibo-wardrobe">
      {confirmDialog}
      <aside className="kw-preview">
        <span className="kbv-eyebrow">Vista previa</span>
        <div className="kw-stage">
          {typeof KiboBlob === 'function' && <KiboBlob size={150} idle styleOverride={overrideStyle} />}
        </div>
        <span className="kw-note kbv-meta">
          {preview ? 'Suelta el mouse para volver a tu look actual.' : 'Así se ve tu KIBO ahora — en el panel izquierdo y aquí.'}
        </span>
        <div className="kw-fit">
          {KIBO_STYLE_SECTIONS.map(sec => {
            const cat = KIBO_STYLE_CATALOG[sec.part] || [];
            const ids = String(style[sec.part] || '').split(',').map(x => x.split('@')[0]).filter(x => x && !/-none$/.test(x));
            const names = ids.map(id => (cat.find(x => x.id === id) || {}).name).filter(Boolean);
            return <span key={sec.part} className="kw-fit-row"><em>{sec.name}</em>{names.length ? names.join(' · ') : '—'}</span>;
          })}
        </div>
      </aside>

      <div className="kw-catalog">
        {KIBO_STYLE_SECTIONS.map(sec => (
          <section key={sec.part} className="kw-section">
            <SectionHead level={4} tight title={sec.name} meta={sec.hint} />
            <div className="kw-grid">
              {(KIBO_STYLE_CATALOG[sec.part] || []).map(it => {
                const has = owned.has(it.id) || it.cost === 0;
                const on = sec.multi
                  ? String(style[sec.part] || '').split(',').some(x => x.split('@')[0] === it.id)
                  : style[sec.part] === it.id;
                return (
                  <button key={it.id} type="button"
                          className={`kw-item ${on ? 'on' : ''} ${has ? '' : 'locked'}`}
                          onMouseEnter={() => setPreview({ part: sec.part, id: it.id })}
                          onMouseLeave={() => setPreview(null)}
                          onFocus={() => setPreview({ part: sec.part, id: it.id })}
                          onBlur={() => setPreview(null)}
                          onClick={() => {
                            if (!has) { buy(sec.part, it); return; }
                            if (!sec.multi) { if (on) return; setKiboStyle(sec.part, it.id); flash(`${it.name} equipado ✨`); return; }
                            // Multi: alternar y conservar la posición elegida.
                            const cur = String(style[sec.part] || '').split(',').filter(x => x && x !== 'mk-none');
                            const idx = cur.findIndex(x => x.split('@')[0] === it.id);
                            const next = idx >= 0 ? cur.filter((_, i) => i !== idx) : [...cur, it.id];
                            setKiboStyle(sec.part, next.length ? next.join(',') : 'mk-none');
                            flash(idx >= 0 ? `${it.name} retirado` : `${it.name} puesto ✨`);
                          }}
                          title={it.desc}>
                    <span className="kw-mini">{typeof KiboSpecimen === 'function' && <KiboSpecimen part={sec.part} item={it} />}</span>
                    <span className="kw-name">{it.name}</span>
                    <span className="kw-price">
                      {on ? (sec.multi ? 'Puesto' : 'Equipado') : has ? 'Lo tienes' : <React.Fragment>{it.currency === 'gem' ? <GemIcon size={11} /> : <CoinIcon size={11} />} {it.cost.toLocaleString('es-MX')}</React.Fragment>}
                    </span>
                    {sec.multi && on && it.id !== 'mk-none' && (
                      <span className="kw-slots" onClick={(e) => e.stopPropagation()}>
                        {Object.keys(window.MARK_SLOTS || {}).map(sl => {
                          const cur = String(style[sec.part] || '').split(',').filter(Boolean);
                          const mine = cur.find(x => x.split('@')[0] === it.id) || it.id;
                          const activo = (mine.split('@')[1] || 'cder') === sl;
                          return (
                            <button key={sl} type="button" className={`kw-slot ${activo ? 'on' : ''}`} title={window.MARK_SLOTS[sl].label}
                                    onClick={() => {
                                      const next = cur.map(x => x.split('@')[0] === it.id
                                        ? (sl === 'cder' ? it.id : it.id + '@' + sl) : x);
                                      setKiboStyle(sec.part, next.join(','));
                                    }}>{window.MARK_SLOTS[sl].key}</button>
                          );
                        })}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

// ── Tienda · Vitrina (portadas, marcos, títulos, compañero, casillas) ──
// El compañero muestra TU KIBO — piel, marcas y aura incluidas — repitiendo
// el gesto que se compra, no un blob genérico con otro ánimo (KiboPet).
function VitrinaStoreTab() {
  const cos = (typeof useCardCosmetics === 'function') ? useCardCosmetics() : { bg: 'vt-bg-slate', frame: 'vt-fr-none', slots: 3 };
  const owned = (typeof getCardOwned === 'function') ? getCardOwned() : new Set();
  const maxSlots = window.VITRINA_MAX_SLOTS || 6;
  const [askText, promptDialog] = usePrompt();
  const [imgErr, setImgErr] = React.useState(null);

  function Price({ it }) {
    return <span className="vts-price">{it.currency === 'gem' ? <GemIcon size={12} /> : <CoinIcon size={12} />} {it.cost.toLocaleString('es-MX')}</span>;
  }

  function editTitle() {
    askText({
      title: 'Tu título', label: '¿Cómo quieres que te lean?', value: getCardTitleText(),
      placeholder: 'Hasta 22 letras', confirmLabel: 'Guardar',
      onSubmit: (v) => { const t = String(v || '').trim(); if (t) setCardTitleText(t); },
    });
  }

  // La imagen propia vive en localStorage como data URL: no hay backend que
  // la guarde, y una portada que se pierde al recargar no es una portada.
  function pickImage(ev, after) {
    const file = ev.target.files && ev.target.files[0];
    ev.target.value = '';
    if (!file) return;
    if (file.size > 1.8 * 1024 * 1024) { setImgErr('La imagen pesa más de 1.8 MB — baja la resolución o súbela en JPG.'); return; }
    const rd = new FileReader();
    rd.onload = () => { setImgErr(null); setCardBgImage(String(rd.result)); after && after(); };
    rd.onerror = () => setImgErr('No se pudo leer el archivo.');
    rd.readAsDataURL(file);
  }

  return (
    <>
      {promptDialog}
      {imgErr ? <div className="vts-warn" role="alert">{imgErr}</div> : null}
      <div className="kbv-fin-card" style={{ background: 'linear-gradient(135deg, var(--kb-community-soft) 0%, var(--kb-canvas) 100%)', borderColor: 'var(--kb-community-border)' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'color-mix(in oklab, var(--area-community) 16%, var(--kb-canvas))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6D3BD0', flexShrink: 0 }}>
            <KIcon name="image" size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontFamily: 'var(--kb-f-display)', fontWeight: 800, fontSize: 15 }}>Tu carta de presentación</h4>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--kb-text-2)', lineHeight: 1.5 }}>
              Personaliza la vitrina que ve la comunidad: <strong>portadas</strong> de fondo, <strong>marcos</strong> para tu foto y <strong>casillas</strong> extra para presumir más logros. Lo que equipes aquí se refleja también en tu HUD.
            </p>
          </div>
        </div>
      </div>

      {/* PORTADAS */}
      <div className="kbv-vts-head"><h4 className="kbv-h4">Portadas</h4><span className="kbv-meta">Fondo de tu vitrina y del HUD</span></div>
      <div className="kbv-vts-grid">
        {(window.CARD_BACKGROUNDS || []).map(b => {
          const isOwned = owned.has(b.id);
          const isOn = cos.bg === b.id;
          return (
            <div key={b.id} className={`kbv-vts-item ${isOn ? 'equipped' : ''}`}>
              <div className="vts-prev bg">
                {typeof CardBackdrop === 'function' && <CardBackdrop bgId={b.id} className="vts-cover" scrim={false} />}
              </div>
              <div className="vts-name">{b.name}</div>
              <div className="vts-desc">{b.desc}</div>
              {b.solid && isOwned ? (
                <div className="vts-tools">
                  <label className="vts-hex">
                    <input type="color" value={getCardBgColor()}
                           onChange={(ev) => { setCardBgColor(ev.target.value); if (!isOn) setCardBg(b.id); }} />
                    <input type="text" value={getCardBgColor()} spellCheck="false" aria-label="Código HEX"
                           onChange={(ev) => { const hex = normalizeHex(ev.target.value); if (hex) { setCardBgColor(hex); if (!isOn) setCardBg(b.id); } }} />
                  </label>
                  <div className="vts-swatches">
                    {(window.CARD_SOLIDS || []).map(c => (
                      <button key={c} type="button" className={`vts-sw ${getCardBgColor().toLowerCase() === c.toLowerCase() ? 'on' : ''}`}
                              style={{ background: c }} title={`Usar ${c}`}
                              onClick={() => { setCardBgColor(c); if (!isOn) setCardBg(b.id); }} />
                    ))}
                  </div>
                </div>
              ) : null}
              {b.image && isOwned ? (
                <div className="vts-tools">
                  <label className="vts-edit">
                    <KIcon name="upload" size={11} /> {getCardBgImage() ? 'Cambiar imagen' : 'Subir imagen'}
                    <input type="file" accept="image/*" onChange={(ev) => pickImage(ev, () => { if (!isOn) setCardBg(b.id); })} />
                  </label>
                  {getCardBgImage()
                    ? <button type="button" className="vts-edit" onClick={() => setCardBgImage(null)}><KIcon name="trash" size={11} /> Quitar</button>
                    : <span className="vts-nada">1200×360 px</span>}
                </div>
              ) : null}
              {isOn ? (
                <button type="button" className="buy equipped" disabled><KIcon name="check" size={11} /> Activa</button>
              ) : isOwned ? (
                <button type="button" className="buy" onClick={() => setCardBg(b.id)}>Equipar</button>
              ) : (
                <button type="button" className="buy" onClick={() => { buyCard(b.id); setCardBg(b.id); }}><Price it={b} /></button>
              )}
            </div>
          );
        })}
      </div>

      {/* MARCOS */}
      <div className="kbv-vts-head"><h4 className="kbv-h4">Marcos</h4><span className="kbv-meta">Rodean tu foto de perfil</span></div>
      <div className="kbv-vts-grid">
        {(window.CARD_FRAMES || []).map(f => {
          const isOwned = owned.has(f.id);
          const isOn = cos.frame === f.id;
          return (
            <div key={f.id} className={`kbv-vts-item ${isOn ? 'equipped' : ''}`}>
              <div className="vts-prev frame">
                <span className={`vts-frame-ring ${f.ring === 'none' ? 'nada' : ''}`} style={f.ring !== 'none' ? { boxShadow: f.ring } : undefined} />
              </div>
              <div className="vts-name">{f.name}</div>
              <div className="vts-desc">{f.desc}</div>
              {isOn ? (
                <button type="button" className="buy equipped" disabled><KIcon name="check" size={11} /> Activo</button>
              ) : isOwned ? (
                <button type="button" className="buy" onClick={() => setCardFrame(f.id)}>Equipar</button>
              ) : (
                <button type="button" className="buy" onClick={() => { buyCard(f.id); setCardFrame(f.id); }}><Price it={f} /></button>
              )}
            </div>
          );
        })}
      </div>

      {/* TÍTULOS */}
      <div className="kbv-vts-head"><h4 className="kbv-h4">Títulos</h4><span className="kbv-meta">Se portan bajo tu nombre — elige uno</span></div>
      <div className="kbv-vts-grid">
        {(window.CARD_TITLES || []).map(ti => {
          const has = owned.has(ti.id) || ti.cost === 0;
          const on = cos.title === ti.id;
          const shown = ti.custom && typeof cardTitleById === 'function' ? cardTitleById(ti.id) : ti;
          return (
            <div key={ti.id} className={`kbv-vts-item ${on ? 'equipped' : ''} ${ti.custom ? 'custom' : ''}`}>
              <div className="vts-prev title-prev">
                {shown.text
                  ? <span className="vt-honor big" style={{ '--c': shown.c }}><KIcon name="sparkle" size={10} /> {shown.text}</span>
                  : <span className="vts-nada">Solo tu rango</span>}
              </div>
              <div className="vts-name">{ti.name}</div>
              <div className="vts-desc">{ti.desc}</div>
              {ti.custom && has ? (
                <div className="vts-swatches">
                  <button type="button" className="vts-edit" onClick={editTitle}><KIcon name="edit" size={11} /> Texto</button>
                  {(window.TITLE_COLORS || []).map(c => (
                    <button key={c} type="button" className={`vts-sw ${getCardTitleColor() === c ? 'on' : ''}`}
                            style={{ background: c }} title="Color del título" onClick={() => setCardTitleColor(c)} />
                  ))}
                </div>
              ) : null}
              {on ? <button type="button" className="buy equipped" disabled>Portando</button>
                : has ? <button type="button" className="buy" onClick={() => setCardTitle(ti.id)}>Portar</button>
                : <button type="button" className="buy" onClick={() => { (typeof buyCard === 'function') && buyCard(ti.id); setCardTitle(ti.id); if (ti.custom) editTitle(); }}><Price it={ti} /></button>}
            </div>
          );
        })}
      </div>

      {/* COMPAÑERO KIBO */}
      <div className="kbv-vts-head"><h4 className="kbv-h4">Compañero</h4><span className="kbv-meta">Tu KIBO en la carta — con tu piel y tus marcas; eliges el gesto</span></div>
      <div className="kbv-vts-grid">
        {(window.CARD_PETS || []).map(p => {
          const has = owned.has(p.id) || p.cost === 0;
          const on = cos.pet === p.id;
          return (
            <div key={p.id} className={`kbv-vts-item ${on ? 'equipped' : ''}`}>
              <div className="vts-prev pet-prev" data-pose={p.id}>
                {p.id === 'vt-pet-none' ? <span className="vts-nada">Carta limpia</span> : <KiboPet gesture={p.gesture} />}
              </div>
              <div className="vts-name">{p.name}</div>
              <div className="vts-desc">{p.desc}</div>
              {on ? <button type="button" className="buy equipped" disabled>Equipado</button>
                : has ? <button type="button" className="buy" onClick={() => setCardPet(p.id)}>Equipar</button>
                : <button type="button" className="buy" onClick={() => { (typeof buyCard === 'function') && buyCard(p.id); setCardPet(p.id); }}><Price it={p} /></button>}
            </div>
          );
        })}
      </div>

      {/* CASILLAS */}
      <div className="kbv-vts-head"><h4 className="kbv-h4">Casillas de vitrina</h4><span className="kbv-meta">Tienes <strong>{cos.slots}</strong> de {maxSlots}</span></div>
      <div className="kbv-vts-grid">
        {(window.SLOT_PACKS || []).map(p => {
          const full = cos.slots >= maxSlots;
          return (
            <div key={p.id} className="kbv-vts-item">
              <div className="vts-prev slot"><KIcon name="plus" size={22} /><span className="vts-slot-n">+{p.slots}</span></div>
              <div className="vts-name">{p.name}</div>
              <div className="vts-desc">{p.desc}</div>
              {full ? (
                <button type="button" className="buy equipped" disabled>Vitrina llena</button>
              ) : (
                <button type="button" className="buy" onClick={() => { (typeof addCardSlots === 'function') && addCardSlots(p.slots); }}><Price it={p} /></button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

// Tarjeta de recompensa personalizada — tarjeta de item canónica (1g).
function CustomRewardItemV2({ item, onBuy, onEdit, onDelete }) {
  return (
    <ItemCard
      item={{ ...item, custom: true, currency: 'coin' }}
      onBuy={onBuy}
      actionLabel="Canjear"
      onEdit={onEdit}
      onDelete={onDelete} />
  );
}

// ─────────────────────────────────────────────────────────────
// Custom reward modal v2 — solo monedas, icono custom (emoji o preset)
// ─────────────────────────────────────────────────────────────
function CustomRewardModalV2({ edit, onClose, onSave }) {
  const [name, setName] = React.useState(edit?.name || '');
  const [desc, setDesc] = React.useState(edit?.desc || '');
  const [cost, setCost] = React.useState(edit?.cost || 100);
  const [iconMode, setIconMode] = React.useState(edit?.customImage ? 'custom' : 'preset');
  const [icon, setIcon] = React.useState(edit?.icon || 'shop');
  const [customImage, setCustomImage] = React.useState(edit?.customImage || '');
  const [color, setColor] = React.useState(edit?.color || 'var(--area-community)');
  const COLORS = ['var(--kb-coin-ink)', 'var(--area-community)', 'var(--kb-hp)', 'var(--pri-high)', 'var(--kb-primary)', 'var(--kb-gem)', 'var(--kb-coin)', 'var(--kb-good-soft)'];

  function save() {
    onSave({
      id: edit?.id || 'cr' + Math.random().toString(36).slice(2, 6),
      name, desc, cost: parseInt(cost, 10) || 50,
      currency: 'coin', // siempre monedas
      icon: iconMode === 'preset' ? icon : 'shop',
      customImage: iconMode === 'custom' ? customImage : null,
      color, custom: true,
    });
    onClose();
  }

  return (
    <KBVModal
      title={edit ? 'Editar recompensa' : 'Nueva recompensa'}
      sub="Las recompensas se consumen con monedas que ganas por actividad. La materia oscura es exclusiva de usuarios Premium."
      onClose={onClose}
      footer={
        <div className="right" style={{ marginLeft: 'auto' }}>
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" disabled={!name.trim()} onClick={save}>
            {edit ? 'Guardar' : 'Crear'} <KIcon name="check" size={14} />
          </button>
        </div>
      }>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
        <div className="kbv-form-row">
          <label>Nombre</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Café especial, película..." autoFocus />
        </div>
        <div className="kbv-form-row">
          <label>Costo en monedas</label>
          <div className="kbv-amount-input">
            <span className="prefix"><CoinIcon size={14} /></span>
            <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} min={1} />
            <span className="suffix">monedas</span>
          </div>
        </div>
      </div>
      <div className="kbv-form-row">
        <label>Descripción</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Detalle de la recompensa..." />
      </div>

      <div className="kbv-form-row">
        <label>Icono</label>
        <div className="kbv-icon-mode-tabs">
          <button type="button" className={iconMode === 'preset' ? 'on' : ''} onClick={() => setIconMode('preset')}>
            <KIcon name="layers" size={12} /> Preset
          </button>
          <button type="button" className={iconMode === 'custom' ? 'on' : ''} onClick={() => setIconMode('custom')}>
            <KIcon name="image" size={12} /> Custom
          </button>
        </div>

        {iconMode === 'preset' && (
          <div className="kbv-icon-grid">
            {REWARD_ICON_PRESETS.map(p => (
              <button key={p.id} type="button"
                      className={`kbv-icon-tile ${icon === p.id ? 'on' : ''}`}
                      style={{ '--c': color }}
                      onClick={() => setIcon(p.id)}>
                <KIcon name={p.icon} size={20} />
                <span className="lbl">{p.label}</span>
              </button>
            ))}
          </div>
        )}

        {iconMode === 'custom' && (
          <div className="kbv-custom-icon-row">
            <div className="custom-preview" style={{ background: color }}>
              {customImage ? <span className="emoji">{customImage}</span> : <KIcon name="image" size={28} />}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input type="text" value={customImage} onChange={(e) => setCustomImage(e.target.value)}
                     placeholder="Pega un emoji aquí: 🍣 🎮 ☕ 🎁 ..."
                     maxLength={4} />
              <button type="button" className="kbv-btn kbv-btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>
                <KIcon name="upload" size={12} /> O sube imagen (PNG, JPG, SVG)
              </button>
              <span className="kbv-meta">El emoji o imagen aparecerá como ícono de tu recompensa. Pega cualquier emoji desde tu teclado.</span>
            </div>
          </div>
        )}
      </div>

      <div className="kbv-form-row">
        <label>Color de acento</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {COLORS.map(c => (
            <button key={c} type="button"
                    onClick={() => setColor(c)}
                    style={{ width: 32, height: 32, borderRadius: 8, background: c, border: color === c ? '3px solid var(--kb-text)' : '1.5px solid var(--kb-border)', cursor: 'pointer' }} />
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--kb-coin-soft)', border: '1px solid var(--kb-coin-border)', borderRadius: 10, padding: 10, fontSize: 12, color: 'var(--kb-coin-ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <KIcon name="alert" size={16} />
        <span>Las recompensas custom solo cuestan <strong>monedas</strong>. La materia oscura es exclusiva de usuarios <strong>Premium</strong> y se gana en retos o se compra en paquetes.</span>
      </div>
    </KBVModal>
  );
}

// ─────────────────────────────────────────────────────────────
// Bloque G · Widgets de la tienda — leídos del catálogo real
// (WIDGET_REGISTRY), segmentados por sección de la plataforma.
// El dashboard y la tienda comparten el mismo catálogo y precios.
// ─────────────────────────────────────────────────────────────
const TIENDA_WIDGET_SECTIONS = [
  { id: 'today',           name: 'Hoy',                desc: 'Coach IA, bolsa, racha y resumen del día.',    icon: 'home',      color: 'var(--kb-primary)' },
  { id: 'personal',        name: 'Hábitos y Retos',    desc: 'Próximo hábito, días de reto y daño.',         icon: 'flame',     color: 'var(--kb-streak)' },
  { id: 'work',            name: 'Tareas y Proyectos', desc: 'Prioridades, timeline y tableros kanban.',     icon: 'list',      color: 'var(--kb-primary)' },
  { id: 'diario',          name: 'Diario',             desc: 'Mood, captura rápida, gratitud y bitácora.',   icon: 'edit',      color: 'var(--area-community)' },
  { id: 'lectura',         name: 'Lectura',            desc: 'Libro activo, sesiones y notas.',              icon: 'book-open', color: 'var(--kb-gem)' },
  { id: 'estudio',         name: 'Estudio · Pomodoro', desc: 'Pomodoro suelto, cursos y próxima clase.',     icon: 'layers',    color: 'var(--area-wisdom)' },
  { id: 'entretenimiento', name: 'Entretenimiento',    desc: 'Series, pelis, cine y resumen anual.',         icon: 'film',      color: 'var(--kb-media)' },
  { id: 'finance',         name: 'Finanzas',           desc: 'Balance, gastos, presupuesto, suscripciones.', icon: 'wealth',    color: 'var(--area-wealth)' },
];

function parseWidgetCost(cost) {
  if (!cost || cost === 'free') return { free: true, amount: 0, currency: 'coin' };
  // Acepta el nombre viejo y el nuevo de la divisa: si esto no matchea, el
  // widget se volvería GRATIS sin avisar.
  const m = String(cost).match(/([\d,]+)\s*(gema|fragmento|materia|moneda)/i);
  if (!m) { console.warn('[Kibo] precio de widget no reconocido:', cost); return { free: false, amount: 0, currency: 'coin' }; }
  return { free: false, amount: parseInt(m[1].replace(/,/g, ''), 10), currency: /moneda/i.test(m[2]) ? 'coin' : 'gem' };
}

function storeWidgets() {
  const reg = (typeof WIDGET_REGISTRY !== 'undefined') ? WIDGET_REGISTRY : {};
  return Object.values(reg).filter(w => w && !w.hidden);
}

// Widget del catálogo — tarjeta de item canónica (1g); el tamaño va en el sello.
function RegistryWidgetCard({ w, owned, onBuy, sectionColor }) {
  const p = parseWidgetCost(w.cost);
  const sizesLabel = (w.sizes || [[1, 1]]).map(([cw, ch]) => `${cw}×${ch}`).join(' · ');
  return (
    <ItemCard
      item={{
        name: w.name, desc: w.desc, icon: w.icon, color: sectionColor,
        kind: sizesLabel, currency: p.currency, cost: p.amount, free: p.free, owned,
      }}
      onBuy={() => onBuy(w, p)} />
  );
}

// ── Lista de deseos: apartas y, al llenarse la barra, se compra sola ──
function WishlistTab({ stats }) {
  if (typeof useCurrencyRepaint === 'function') useCurrencyRepaint();
  const [goals, setGoals] = React.useState(() => (window.WISHLIST || []).slice());
  const [slots, setSlots] = React.useState(4);
  const [ask, confirmDialog] = useConfirm();
  const [toast, setToast] = React.useState(null);
  function flash(m) { setToast(m); clearTimeout(flash._t); flash._t = setTimeout(() => setToast(null), 2200); }

  function contribute(id) {
    setGoals(gs => gs.map(g => g.id === id ? { ...g, saved: Math.min(g.target, g.saved + Math.round(g.perWeek / 4)) } : g));
  }
  function withdraw(id) {
    setGoals(gs => gs.map(g => {
      if (g.id !== id) return g;
      // Lo que aportaron tus amigos no se retira: no es tuyo para sacarlo.
      const own = g.saved - (g.fromFriends || 0);
      if (own <= 0) return g;
      const step = Math.min(own, Math.max(5, Math.round(g.perWeek / 4)));
      return { ...g, saved: g.saved - step };
    }));
  }
  const reservedGems = goals.reduce((s, g) => s + (g.cur === 'gem' ? Math.min(g.saved, g.target) : 0), 0);
  const reservedCoins = goals.reduce((s, g) => s + (g.cur === 'coin' ? Math.min(g.saved, g.target) : 0), 0);
  const friendGems = goals.reduce((s, g) => s + (g.cur === 'gem' ? (g.fromFriends || 0) : 0), 0);

  return (
    <div className="kbv-card kbv-char-card">
      <SectionHead tight title="Lista de deseos"
        meta={`Funciones de la plataforma que quieres desbloquear. Aparta ${curLabel('dark')} o ${curLabel('coin')} y, al llenarse la barra, se compra sola. Nada que ver con tus finanzas reales.`}>
        <div className="kbv-wish-reserved">
          <span className="wr-title">Apartado en tu lista</span>
          <div className="wr-pills">
            <span className="wr-pill gem">{curGlyph('dark', 12)} {reservedGems} <em>· {friendGems} de amigos</em></span>
            <span className="wr-pill coin">{curGlyph('coin', 12)} {reservedCoins}</span>
          </div>
        </div>
      </SectionHead>
      <div className="kbv-wish-grid">
        {goals.map(g => <WishlistItem key={g.id} goal={g} onContribute={contribute} onWithdraw={withdraw} />)}
        {goals.length < slots ? (
          <div className="kbv-wish-add as-note">
            <span className="glyph"><KIcon name="plus" size={20} /></span>
            <span className="lbl">Añade una función</span>
            <span className="sub">Te queda{slots - goals.length === 1 ? '' : 'n'} {slots - goals.length} de {slots} espacios. Elígela en «Módulos» o «Funciones» y apártala aquí.</span>
          </div>
        ) : (
          <button type="button" className="kbv-wish-add buy"
                  onClick={() => ask({
                    title: 'Un espacio más en tu lista',
                    message: `Cuesta 150 de ${curLabel('dark')}. Podrás apartar para una función más a la vez.`,
                    confirmLabel: 'Comprar el espacio',
                    onConfirm: () => { setSlots(s => s + 1); flash('Espacio añadido ✓'); },
                  })}>
            <span className="glyph">{curGlyph('dark', 18)}</span>
            <span className="lbl">Comprar espacio extra</span>
            <span className="sub">Llegaste al máximo de {slots}. Amplía tu lista por <strong>150 de {curLabel('dark')}</strong>.</span>
          </button>
        )}
      </div>
      {toast && <div className="kbv-toast show">{toast}</div>}
      {confirmDialog}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Pantalla Tienda
// ─────────────────────────────────────────────────────────────
function StoreScreen({ stats, unlockedModules = [], onUnlock, initialTab }) {
  const COSMETIC_TABS = ['kibo', 'vitrina'];
  const [tab, setTab] = React.useState(
    // Las pestañas cosméticas se fueron a Personalización: un enlace viejo que
    // las pida aterriza en Módulos en vez de en una pantalla en blanco.
    COSMETIC_TABS.includes(initialTab) ? 'modules' : (initialTab || 'modules'));
  const [custom, setCustom] = React.useState(DEFAULT_CUSTOM_REWARDS_V2);
  const [editing, setEditing] = React.useState(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [chestResult, setChestResult] = React.useState(null);
  const [ownedWidgets, setOwnedWidgets] = React.useState(new Set());
  const [toast, setToast] = React.useState(null);
  const [ask, confirmDialog] = useConfirm();
  function flash(msg) { setToast(msg); clearTimeout(flash._t); flash._t = setTimeout(() => setToast(null), 2600); }

  // Rubros de la rueda: mismo trato que cualquier compra — se cobra, se
  // confirma y queda puesto. Antes el clic no hacía nada.
  const [qaHas, setQaHas] = React.useState(() => (typeof qaOwned === 'function') ? qaOwned() : new Set());
  React.useEffect(() => {
    const h = () => setQaHas(qaOwned());
    window.addEventListener('kibo:qa-change', h);
    return () => window.removeEventListener('kibo:qa-change', h);
  }, []);

  function buyUnlock(u) {
    // Solo los rubros de la rueda tienen a dónde ir hoy. Decirlo, en vez de
    // fingir una compra: el mensaje anterior afirmaba que la función quedaba
    // activa cuando no pasaba absolutamente nada.
    if (!u.qa) { flash(`${u.name} llega en una próxima versión — todavía no se puede comprar.`); return; }
    const have = parseInt(stats?.gems, 10) || 0;
    if (have < u.cost) { flash('No tienes suficiente materia oscura — gánala en retos o ábrela en cofres'); return; }
    ask({
      title: `Comprar ${u.name}`, confirmLabel: 'Comprar y poner en la rueda',
      message: `Cuesta ${u.cost.toLocaleString('es-MX')} de materia oscura. Queda en tu acción rápida al instante; puedes ordenarla o quitarla desde el «⋯» de KIBO.`,
      onConfirm: () => { qaOwn(u.id); flash(`${u.name} ya está en tu rueda ✓`); },
    });
  }

  function buyWidget(w, p) {
    const have = p.currency === 'gem' ? (parseInt(stats?.gems, 10) || 0) : (parseInt(String(stats?.coins).replace(/,/g, ''), 10) || 0);
    if (have < p.amount) {
      flash(p.currency === 'gem'
        ? 'No tienes suficiente materia oscura — gánala en retos o ábrela en cofres'
        : 'No tienes suficientes monedas — gánalas con hábitos, tareas y retos');
      return;
    }
    setOwnedWidgets(s => new Set([...s, w.id]));
  }

  function saveCustom(r) {
    if (editing) setCustom(cs => cs.map(c => c.id === r.id ? r : c));
    else setCustom(cs => [...cs, r]);
    setEditing(null);
  }
  function removeCustom(r) {
    ask({ title: 'Borrar recompensa', message: `¿Borrar «${r.name}»? No afecta lo que ya canjeaste.`, confirmLabel: 'Sí, borrar', onConfirm: () => setCustom(cs => cs.filter(c => c.id !== r.id)) });
  }
  function openChest(chest) {
    if (typeof kiboLog === 'function') kiboLog({ kind: 'money-out', label: `${chest.name} · ${chest.cost} monedas` });
    const gem = Math.floor(Math.random() * (chest.gemRange[1] - chest.gemRange[0]) + chest.gemRange[0]);
    const cr = chest.coinRange || [0, 0];
    const coin = Math.floor(Math.random() * (cr[1] - cr[0]) + cr[0]);
    const rewards = [{ kind: 'coins', amount: coin }, { kind: 'gems', amount: gem }];
    (chest.odds || []).forEach(o => {
      if (!(o.guaranteed || Math.random() < o.p)) return;
      if (o.kind === 'coins') { rewards.push({ kind: 'coins', amount: o.amount }); return; }
      const p = CHEST_PRIZES[o.prize];
      rewards.push({ kind: 'prize', label: p.label, sub: p.sub, icon: p.icon, color: p.color });
    });
    setChestResult({ chest, rewards });
  }

  return (
    <div className="kbv-main">
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--kb-primary)' }}>{crumb('store', 'Cofres, funciones y lo que tú defines')}</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Tienda. <InfoDot label="i" text={"Recompensas personalizadas con tus monedas, cofres que dan materia oscura, widgets premium, funciones desbloqueables y cosméticos de Kibo. Tu Hero no se compra — Kibo sí se viste."} /></h1>
        </div>
        <div className="actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="kbv-stat-pill coin">
            <span className="icon" style={{ background: 'transparent', padding: 0 }}><CoinIcon size={14} /></span>
            <span>{stats?.coins || '1,245'}</span>
          </span>
          <span className="kbv-stat-pill gem">
            <span className="icon" style={{ background: 'transparent', padding: 0 }}><GemIcon size={14} /></span>
            <span>{fmtNum(stats?.gems, 5340)}</span>
          </span>
        </div>
      </div>

      <div className="kbv-store-tabs-v2">
        <button type="button" className={tab === 'modules' ? 'on' : ''} onClick={() => setTab('modules')}>
          <KIcon name="shield" size={14} /> Módulos <span className="ct">{Object.keys((typeof PREMIUM_MODULES !== 'undefined' ? PREMIUM_MODULES : {})).length}</span>
        </button>
        <button type="button" className={tab === 'wishlist' ? 'on' : ''} onClick={() => setTab('wishlist')}>
          <KIcon name="target" size={14} /> Lista de deseos
        </button>
        <button type="button" className={tab === 'rewards' ? 'on' : ''} onClick={() => setTab('rewards')}>
          <KIcon name="sparkle" size={14} /> Mis recompensas <span className="ct">{custom.length}</span>
        </button>
        <button type="button" className={tab === 'chests' ? 'on' : ''} onClick={() => setTab('chests')}>
          <KIcon name="shop" size={14} /> Cofres
        </button>
        <button type="button" className={tab === 'widgets' ? 'on' : ''} onClick={() => setTab('widgets')}>
          <KIcon name="layers" size={14} /> Widgets <span className="ct">{storeWidgets().length}</span>
        </button>
        <button type="button" className={tab === 'unlocks' ? 'on' : ''} onClick={() => setTab('unlocks')}>
          <KIcon name="plus" size={14} /> Funciones <span className="ct">{STORE_UNLOCKS.length}</span>
        </button>

      </div>

      {/* ─────────── TAB · MÓDULOS PREMIUM (freemium) ─────────── */}
      {tab === 'modules' && (() => {
        const MODS = (typeof PREMIUM_MODULES !== 'undefined') ? PREMIUM_MODULES : {};
        return (
          <>
            <div className="kbv-fin-card" style={{ background: 'linear-gradient(135deg, var(--kb-primary-soft) 0%, var(--kb-canvas) 100%)', borderColor: 'var(--kb-primary-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--kb-primary-soft)', color: 'var(--kb-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <KIcon name="shield" size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontFamily: 'var(--kb-f-display)', fontWeight: 800, fontSize: 15 }}>Kibo es modular y freemium</h4>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--kb-text-2)', lineHeight: 1.5 }}>
                    El núcleo (Inicio, Mi progreso, Hábitos, Áreas, Retos, Tareas, Proyectos, Amigos) es <strong>gratis para siempre</strong>. Estos módulos se desbloquean con <strong>materia oscura</strong> — que también ganas jugando, así que puedes tenerlos sin pagar.
                  </p>
                </div>
              </div>
            </div>
            <div className="kbv-modules-grid">
              {Object.keys(MODS).map(id => {
                const m = MODS[id];
                const owned = unlockedModules.includes(id);
                return (
                  <div key={id} className={`kbv-module-item ${owned ? 'owned' : ''}`}>
                    <div className="mi-ico"><KIcon name={m.icon} size={22} /></div>
                    <div className="mi-body">
                      <div className="mi-name">{m.name}{owned && <span className="mi-badge"><KIcon name="check" size={10} /> Activo</span>}</div>
                      <p>{m.desc}</p>
                    </div>
                    {owned
                      ? <span className="mi-owned"><KIcon name="check" size={12} /> Desbloqueado</span>
                      : <button type="button" className="mi-buy" onClick={() => onUnlock && onUnlock(id)}><GemIcon size={12} /> {m.cost}</button>}
                  </div>
                );
              })}
            </div>
          </>
        );
      })()}

      {/* ─────────── TAB · LISTA DE DESEOS ───────────
          Apartar monedas hasta que una función se compre sola es economía, no
          una lectura de cómo vas: vivía en «Mi progreso», que ahora es solo
          perfil y estadísticas. */}
      {tab === 'wishlist' && typeof WishlistTab === 'function' && <WishlistTab stats={stats} />}

      {/* ─────────── TAB · RECOMPENSAS PERSONALIZADAS ─────────── */}
      {tab === 'rewards' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--kb-primary-soft)', border: '1px solid var(--kb-primary-border)', borderRadius: 12, padding: '10px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <KIcon name="sparkle" size={18} style={{ color: 'var(--kb-primary)' }} />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--kb-primary-ink)', fontSize: 13 }}>Tus recompensas, tus reglas</div>
                <div style={{ fontSize: 12, color: 'var(--kb-text-2)' }}>Diseña recompensas reales — un café, una compra que quieres, una hora de juegos. Costo en monedas que ganas con tareas, hábitos y retos.</div>
              </div>
            </div>
            <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => { setEditing(null); setCreateOpen(true); }}>
              <KIcon name="plus" size={14} /> Nueva recompensa
            </button>
          </div>

          <div className="kbv-store-grid">
            {custom.map(it => (
              <CustomRewardItemV2 key={it.id} item={it}
                onBuy={() => {}}
                onEdit={(r) => { setEditing(r); setCreateOpen(true); }}
                onDelete={removeCustom} />
            ))}
            <button className="kbv-store-add" type="button" onClick={() => { setEditing(null); setCreateOpen(true); }}>
              <span className="glyph"><KIcon name="plus" size={20} /></span>
              <span className="name">Crear recompensa</span>
              <span className="sub">Algo real que canjeas con tus monedas.</span>
            </button>
          </div>
        </>
      )}

      {/* ─────────── TAB · COFRES ─────────── */}
      {tab === 'chests' && (
        <>
          <div className="kbv-fin-card" style={{ background: 'linear-gradient(135deg, var(--kb-coin-soft) 0%, var(--kb-canvas) 100%)', borderColor: 'var(--kb-coin-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(244,183,64,0.20)', color: 'var(--kb-coin-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <KIcon name="shop" size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontFamily: 'var(--kb-f-display)', fontWeight: 800, fontSize: 15 }}>Compra cofres con monedas, gana materia oscura</h4>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--kb-text-2)', lineHeight: 1.5 }}>
                  Los cofres son la única forma de convertir monedas en materia oscura sin pagar Premium. Dentro hay los dos metales — monedas y materia oscura, ambos garantizados — más las sorpresas que caigan.
                </p>
              </div>
            </div>
          </div>
          <div className="kbv-chests-grid">
            {STORE_CHESTS.map(c => <ChestCard key={c.id} chest={c} onOpen={openChest} />)}
          </div>
        </>
      )}

      {/* ─────────── TAB · WIDGETS (segmentados por sección) ─────────── */}
      {tab === 'widgets' && (() => {
        const all = storeWidgets();
        const paidTotal = all.filter(w => !parseWidgetCost(w.cost).free).length;
        const freeTotal = all.length - paidTotal;
        return (
          <>
            <div className="kbv-fin-card" style={{ background: 'linear-gradient(135deg, var(--kb-surface) 0%, var(--kb-canvas) 100%)', borderColor: 'var(--kb-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(110,140,242,0.15)', color: 'var(--kb-gem-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <KIcon name="layers" size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontFamily: 'var(--kb-f-display)', fontWeight: 800, fontSize: 15 }}>Widgets para tu dashboard</h4>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--kb-text-2)', lineHeight: 1.5 }}>
                    Cada módulo de la plataforma trae sus propios widgets. <strong>{freeTotal} están incluidos</strong> y <strong>{paidTotal} se compran</strong> con monedas o materia oscura. Los comprados se agregan a la galería de tu Hoy.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <span className="kbv-stat-pill coin"><span className="icon" style={{ background: 'transparent', padding: 0 }}><CoinIcon size={13} /></span>{stats?.coins || '1,245'}</span>
                  <span className="kbv-stat-pill gem"><span className="icon" style={{ background: 'transparent', padding: 0 }}><GemIcon size={13} /></span>{fmtNum(stats?.gems, 5340)}</span>
                </div>
              </div>
            </div>

            {TIENDA_WIDGET_SECTIONS.map(sec => {
              const list = all.filter(w => (w.category || 'today') === sec.id);
              if (!list.length) return null;
              list.sort((a, b) => {
                const pa = parseWidgetCost(a.cost), pb = parseWidgetCost(b.cost);
                if (pa.free !== pb.free) return pa.free ? -1 : 1;
                if (pa.currency !== pb.currency) return pa.currency === 'coin' ? -1 : 1;
                return pa.amount - pb.amount;
              });
              const paid = list.filter(w => !parseWidgetCost(w.cost).free).length;
              return (
                <div className="kbv-store-wsection" key={sec.id}>
                  <div className="head" style={{ '--c': sec.color }}>
                    <span className="ico"><KIcon name={sec.icon} size={16} /></span>
                    <div className="meta">
                      <h3>{sec.name}</h3>
                      <span>{sec.desc}</span>
                    </div>
                    <span className="counts">{list.length} widgets · {paid} de pago</span>
                  </div>
                  <div className="kbv-widget-store-grid">
                    {list.map(w => (
                      <RegistryWidgetCard
                        key={w.id}
                        w={w}
                        sectionColor={sec.color}
                        owned={ownedWidgets.has(w.id)}
                        onBuy={buyWidget} />
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        );
      })()}

      {/* ─────────── TAB · FUNCIONES ─────────── */}
      {tab === 'unlocks' && (
        <>
          <div className="kbv-fin-card" style={{ background: 'linear-gradient(135deg, var(--kb-community-soft) 0%, var(--kb-canvas) 100%)', borderColor: 'var(--kb-community-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(168,85,247,0.15)', color: 'var(--kb-community-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <KIcon name="plus" size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontFamily: 'var(--kb-f-display)', fontWeight: 800, fontSize: 15 }}>Capacidades extra</h4>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--kb-text-2)', lineHeight: 1.5 }}>
                  Slots adicionales, importaciones ilimitadas, packs IA. Estas mejoras escalan lo que puedes hacer dentro de la plataforma.
                </p>
              </div>
            </div>
          </div>
          {STORE_UNLOCK_GROUPS.map(g => (
            <div className="kbv-store-wsection" key={g.id}>
              <div className="head" style={{ '--c': g.color }}>
                <span className="ico"><KIcon name={g.icon} size={16} /></span>
                <div className="meta"><h3>{g.name}</h3><span>{g.desc}</span></div>
                {(() => {
                  const list = STORE_UNLOCKS.filter(u => u.group === g.id);
                  const mine = list.filter(u => u.qa && qaHas.has(u.id)).length;
                  return <span className="counts">{mine > 0 && <b>{mine} tuyas</b>}{mine > 0 ? ' · ' : ''}{list.length} funciones</span>;
                })()}
              </div>
              <div className="kbv-unlocks-grid">
                {STORE_UNLOCKS.filter(u => u.group === g.id).map(u => (
                  <UnlockItem key={u.id} item={u} owned={u.qa && qaHas.has(u.id)}
                    onBuy={() => buyUnlock(u)} />
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Lo cosmético no vive aquí: se ve, se compra y se equipa en
          Personalización, donde cada ítem tiene su propia vista previa. */}
      {tab === 'modules' && (
      <div className="kbv-card st-elsewhere">
        <span className="ste-ico"><KIcon name="sparkle" size={18} /></span>
        <div className="ste-txt">
          <strong>¿Buscas cosméticos?</strong>
          <span>Tu KIBO, tu carta, los nombres de tus prestigios y tus divisas viven en Personalización — ahí se ven, se compran y se ponen.</span>
        </div>
        <button type="button" className="kbv-btn kbv-btn-secondary"
                onClick={() => { try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'personalizar' } })); } catch (_) {} }}>
          Abrir Personalización <KIcon name="arrow-right" size={13} />
        </button>
      </div>
      )}

      {createOpen && (
        <CustomRewardModalV2
          edit={editing}
          onClose={() => { setCreateOpen(false); setEditing(null); }}
          onSave={saveCustom} />
      )}

      {chestResult && (
        <ChestOpeningOverlay
          chest={chestResult.chest}
          rewards={chestResult.rewards}
          onClaim={() => { flash(`Reclamaste ${chestResult.chest.name} ✓`); setChestResult(null); }} />
      )}
      {confirmDialog}
      {toast && <div className="kbv-social-toast"><KIcon name="check" size={14} /> {toast}</div>}
    </div>
  );
}

Object.assign(window, {
  StoreScreen, KiboStyleTab, VitrinaStoreTab, WishlistTab,
  STORE_CHESTS, STORE_WIDGETS, STORE_UNLOCKS, STORE_UNLOCK_GROUPS,
  DEFAULT_CUSTOM_REWARDS_V2, REWARD_ICON_PRESETS,
  CustomRewardModalV2,
});
