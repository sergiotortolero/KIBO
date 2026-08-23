/* Kibo App kit — mock data. Values follow the canonical DS spec. */

const KB = {
  user: { name: 'Mariana', initial: 'M', level: 27, xp: 2480, xpNext: 3200, hp: 86, coins: 1250, gems: 38, streak: 42 },

  areas: [
    { id: 'vigor',     name: 'Vigor',     icon: 'dumbbell',   color: 'var(--area-vigor)',     hex:'#EF4444', level: 18, pct: 64 },
    { id: 'wisdom',    name: 'Sabiduría', icon: 'book-open',  color: 'var(--area-wisdom)',    hex:'#3B82F6', level: 24, pct: 41 },
    { id: 'wealth',    name: 'Riqueza',   icon: 'piggy-bank', color: 'var(--area-wealth)',    hex:'#EAB308', level: 12, pct: 78 },
    { id: 'community', name: 'Comunidad', icon: 'users',      color: 'var(--area-community)', hex:'#A855F7', level: 9,  pct: 30 },
    { id: 'will',      name: 'Voluntad',  icon: 'target',     color: 'var(--area-will)',      hex:'#06B6D4', level: 15, pct: 55 },
  ],

  habits: [
    { id: 'h1', name: 'Leer 20 minutos', area: 'wisdom',    xp: 30, done: false },
    { id: 'h2', name: 'Entrenar fuerza', area: 'vigor',     xp: 45, done: true  },
    { id: 'h3', name: 'Meditar 10 min',  area: 'will',      xp: 25, done: false },
    { id: 'h4', name: 'Registrar gastos',area: 'wealth',    xp: 20, done: false },
    { id: 'h5', name: 'Llamar a un amigo',area:'community', xp: 35, done: false },
  ],

  boss: { name: 'Terminar la tesis', area: 'wealth', hpMax: 3000, hp: 1140 },

  priorities: [
    { id: 'urgent', name: 'Urgente', color: 'var(--pri-urgent)' },
    { id: 'high',   name: 'Alta',    color: 'var(--pri-high)' },
    { id: 'medium', name: 'Media',   color: 'var(--pri-medium)' },
    { id: 'low',    name: 'Baja',    color: 'var(--pri-low)' },
  ],

  // Rank materials (gradient a/b + ink), from the spec's scoped tokens.
  ranks: [
    { name: 'Bronce',    a:'#E0A878', b:'#A8632E', ink:'#4A2810', unlocked:true },
    { name: 'Plata',     a:'#D2D9E1', b:'#8A95A2', ink:'#363E48', unlocked:true },
    { name: 'Oro',       a:'#F8DC8A', b:'#D4A22B', ink:'#5E440E', unlocked:true },
    { name: 'Platino',   a:'#E9EEF3', b:'#AAB6C4', ink:'#3A434E', unlocked:true },
    { name: 'Obsidiana', a:'#6E6880', b:'#241F30', ink:'#E6E1F2', unlocked:false },
    { name: 'Diamante',  a:'#CFF6FF', b:'#3FC0DE', ink:'#0E4A5A', unlocked:false },
    { name: 'Esmeralda', a:'#A8E6C0', b:'#1E9E63', ink:'#0C4A2C', unlocked:false },
    { name: 'Rubí',      a:'#FF9DB0', b:'#C8102E', ink:'#FFFFFF', unlocked:false },
    { name: 'Damasco',   a:'#C9CDD4', b:'#5A5E68', ink:'#241B33', unlocked:false },
  ],

  prestige: { grade: 7, name: 'Comodoro Galáctico', sub: 'Líder de escuadra',
    a:'#F4DC92', b:'#D0A02E', ink:'#5E440E', glow:'#FFE7A0', stars: 2 },

  achievements: [
    { name:'Madrugador',   color:'#5FA98A', icon:'sunrise',   unlocked:true,  rarity:'Común' },
    { name:'Imparable',    color:'#E64545', icon:'flame',     unlocked:true,  rarity:'Legendario' },
    { name:'Mente clara',  color:'#6E8CF2', icon:'brain',     unlocked:true,  rarity:'Raro' },
    { name:'Constante',    color:'#4CAF82', icon:'calendar-check', unlocked:true, rarity:'Común' },
    { name:'Ahorrador',    color:'#E0A82B', icon:'piggy-bank',unlocked:true,  rarity:'Épico' },
    { name:'Maratonista',  color:'#A855F7', icon:'medal',     unlocked:false, rarity:'Épico' },
    { name:'Mentor',       color:'#06B6D4', icon:'heart-handshake', unlocked:false, rarity:'Raro' },
    { name:'???',          color:'#8A5CF0', icon:'lock',      unlocked:false, rarity:'Secreto' },
  ],

  store: {
    backgrounds: [
      { id:'slate',  name:'Pizarra',  cost:0,   cur:'coin', locked:false, css:'linear-gradient(155deg,#2B313D 0%,#181C25 100%)' },
      { id:'aurora', name:'Aurora',   cost:450, cur:'coin', locked:false, css:'linear-gradient(135deg,#155C40 0%,#2E8B63 55%,#6FD3A2 100%)' },
      { id:'dusk',   name:'Crepúsculo',cost:550,cur:'coin', locked:false, css:'linear-gradient(135deg,#5A2150 0%,#B23A4A 55%,#E0731B 100%)' },
      { id:'nebula', name:'Nebulosa', cost:35,  cur:'gem',  locked:false, css:'linear-gradient(135deg,#221C66 0%,#6D3BD0 55%,#B06BF5 100%)' },
      { id:'cosmos', name:'Cosmos',   cost:80,  cur:'gem',  locked:false, css:'radial-gradient(120% 110% at 18% 0%,#2A2057 0%,#140F33 48%,#08061A 100%)' },
      { id:'collab', name:'Colab de marca', cost:0, cur:'coin', locked:true, css:'linear-gradient(135deg,#3a3f4b,#22262f)' },
    ],
    frames: [
      { id:'gold',   name:'Marco oro',    cost:300, cur:'coin', ring:'0 0 0 3px #F4C24B, 0 0 0 6px rgba(244,194,75,.28)' },
      { id:'aurora', name:'Marco aurora', cost:300, cur:'coin', ring:'0 0 0 3px #4CAF82, 0 0 0 6px rgba(76,175,130,.28)' },
      { id:'neon',   name:'Marco neón',   cost:28,  cur:'gem',  ring:'0 0 0 3px #22D3EE, 0 0 12px rgba(34,211,238,.6)' },
      { id:'obsid',  name:'Marco obsidiana',cost:24,cur:'gem',  ring:'0 0 0 3px #2A2438, 0 0 0 6px rgba(138,130,168,.4)' },
    ],
  },
};

window.KB = KB;
