// social-screen.jsx — Social / Amigos. Economía que interactúa entre usuarios
// SIN transferencias directas: regalas items de la Tienda (multiplicadores,
// protectores), aportas un % topado a la lista de deseos de tus amigos (nunca la
// completas), te empujan estilo Duolingo a no perder la racha, y compites o
// cooperas en retos compartidos que afectan el HP de ambos personajes.
//
// Composición (ronda 2): nada de dos columnas angostas con huecos. La pantalla
// se lee de arriba abajo en bandas de ancho completo — pulso · círculo ·
// liga · retos · metas · actividad — y las pestañas del directorio viven en su
// propia fila, no apretadas dentro del encabezado.

const FRIEND_GIFTS = [
  { id: 'xp2x',     name: 'Multiplicador XP', desc: 'x2 XP por 1 hora',        icon: 'sparkle', cur: 'gem',  cost: 12, c: 'var(--area-community)' },
  { id: 'shield',   name: 'Protector de racha', desc: 'Salva 1 día de racha',  icon: 'shield',  cur: 'gem',  cost: 20, c: 'var(--kb-primary)' },
  { id: 'coins',    name: 'Cofre de monedas',   desc: '+50 monedas',           icon: 'shop',    cur: 'coin', cost: 80, c: 'var(--kb-coin)' },
  { id: 'streakfr', name: 'Congelar racha',     desc: 'Pausa la racha 1 día',  icon: 'flame',   cur: 'gem',  cost: 15, c: 'var(--kb-streak)' },
];

const DEMO_FRIENDS = [
  { id: 'f1', name: 'Lucía',  color: 'var(--area-community)', level: 11, streak: 41, weekXP: 2180, online: true,  risk: false,
    card: { bg: 'vt-bg-nebula', frame: 'vt-fr-neon', pet: 'vt-pet-peek', title: 'Inquebrantable', tc: 'var(--kb-streak)', tagline: 'Un día a la vez.' },
    wishlist: [{ id: 'w1', name: 'Tema oscuro premium', cur: 'coin', saved: 720, target: 1000, fromFriends: 120 }] },
  { id: 'f2', name: 'Diego',  color: 'var(--kb-gem)', level: 9,  streak: 4,  weekXP: 1640, online: false, risk: true,
    card: { bg: 'vt-bg-solid', color: '#3C1F52', frame: 'vt-fr-none', pet: null, title: null, tagline: 'Volviendo al ruedo.' },
    wishlist: [{ id: 'w2', name: 'Slot de área extra', cur: 'gem', saved: 110, target: 200, fromFriends: 30 }] },
  { id: 'f3', name: 'Sofía',  color: 'var(--kb-primary)', level: 14, streak: 88, weekXP: 3120, online: true,  risk: false,
    card: { bg: 'vt-bg-arrecife', frame: 'vt-fr-gold', pet: 'vt-pet-travi', title: 'Cazadora de jefes', tc: 'var(--kb-hp)', tagline: 'El fracaso reencauza ✨' },
    wishlist: [{ id: 'w3', name: 'Módulo "Recursos"', cur: 'gem', saved: 240, target: 300, fromFriends: 60 }] },
  { id: 'f4', name: 'Andrés', color: 'var(--kb-streak)', level: 7,  streak: 0,  weekXP: 540,  online: false, risk: true,
    card: { bg: 'vt-bg-jurasico', frame: 'vt-fr-obsid', pet: 'vt-pet-dormi', title: null, tagline: 'Aquí seguimos.' },
    wishlist: [] },
  { id: 'f5', name: 'Renata', color: 'var(--kb-hp)', level: 10, streak: 23, weekXP: 1980, online: true,  risk: false,
    card: { bg: 'vt-bg-aurora', frame: 'vt-fr-esmer', pet: 'vt-pet-beso', title: 'Madrugadora', tc: 'var(--kb-coin)', tagline: '5:50 am, todos los días.' },
    wishlist: [{ id: 'w5', name: 'Pack de stickers de Kibo', cur: 'coin', saved: 300, target: 500, fromFriends: 90 }] },
];

// Retos compartidos viven en la sección RETOS (personal-screens.jsx) — aquí
// solo se muestra un resumen que redirige allá.

// Personas que aún no son tus amigos — pool de búsqueda / sugerencias
const SEARCH_POOL = [
  { id: 's1', name: 'Marcela', handle: '@marce.fit', color: 'var(--kb-coin)', level: 12, mutual: 3 },
  { id: 's2', name: 'Iván', handle: '@ivan.dev', color: 'var(--area-wisdom)', level: 6, mutual: 1 },
  { id: 's3', name: 'Paula', handle: '@pau.lee', color: 'var(--kb-hp)', level: 17, mutual: 4 },
  { id: 's4', name: 'Jorge', handle: '@jorge.mx', color: 'var(--kb-primary)', level: 3, mutual: 0 },
  { id: 's5', name: 'Camila', handle: '@cami.runs', color: 'var(--area-community)', level: 21, mutual: 2 },
];

const REQUESTS_IN = [
  { id: 'q1', name: 'Valeria', handle: '@vale.g', color: 'var(--area-will)', level: 8, mutual: 2, note: 'Estuvo en tu liga de mayo' },
  { id: 'q2', name: 'Héctor', handle: '@hec.tor', color: 'var(--kb-streak)', level: 15, mutual: 5, note: '5 amigos en común' },
];

// Actividad del círculo — lo que pasó con tus amigos esta semana.
const SOCIAL_FEED = [
  { id: 'a1', who: 'Sofía',  c: 'var(--kb-primary)',       icon: 'trophy',      kind: 'logro',  when: 'hace 2 h',
    text: 'cumplió el reto «Sin azúcar · 30 días»', claps: 4 },
  { id: 'a2', who: 'Lucía',  c: 'var(--area-community)',   icon: 'trending-up', kind: 'nivel',  when: 'hace 5 h',
    text: 'subió a Nivel 11 en Comunidad', claps: 2 },
  { id: 'a3', who: 'Diego',  c: 'var(--kb-gem)',           icon: 'flame',       kind: 'riesgo', when: 'hace 6 h',
    text: 'está por perder su racha de 4 días', claps: 0, nudge: 'f2' },
  { id: 'a4', who: 'Renata', c: 'var(--kb-hp)',            icon: 'shop',        kind: 'regalo', when: 'ayer',
    text: 'aportó 90 monedas a tu meta «Marco dorado»', claps: 1 },
  { id: 'a5', who: 'Sofía',  c: 'var(--kb-primary)',       icon: 'sword',       kind: 'reto',   when: 'ayer',
    text: 'y tú llevan 12 días en «Leer 20 min»', claps: 3 },
  { id: 'a6', who: 'Andrés', c: 'var(--kb-streak)',        icon: 'alert',       kind: 'riesgo', when: 'hace 2 días',
    text: 'perdió su racha de 31 días — mándale ánimo', claps: 0, nudge: 'f4' },
];

// ═══ FAMILIA — Kibo para padres: misiones, mesada y aprobaciones ═══
const FAMILY_MEMBERS = [
  { id: 'fm1', name: 'Emma', age: 9,  color: 'var(--kb-hp)',       level: 4, streak: 6,  role: 'peque', mesada: 120 },
  { id: 'fm2', name: 'Leo',  age: 12, color: 'var(--area-wisdom)', level: 7, streak: 15, role: 'peque', mesada: 180 },
  { id: 'fm3', name: 'Ana',  age: 38, color: 'var(--area-community)', level: 11, streak: 34, role: 'adulto' },
];
const FAMILY_QUESTS = [
  { id: 'fq1', name: 'Tender su cama',        who: 'fm1', coins: 10, xp: 15, status: 'aprobada',   daily: true },
  { id: 'fq2', name: 'Leer 15 min',           who: 'fm1', coins: 15, xp: 25, status: 'por-aprobar', daily: true },
  { id: 'fq3', name: 'Sacar al perro',        who: 'fm2', coins: 15, xp: 20, status: 'pendiente',  daily: true },
  { id: 'fq4', name: 'Terminar tarea de mate', who: 'fm2', coins: 25, xp: 40, status: 'por-aprobar' },
  { id: 'fq5', name: 'Recoger juguetes',      who: 'fm1', coins: 8,  xp: 10, status: 'pendiente', daily: true },
];

function FamilyPanel({ flash }) {
  const [quests, setQuests] = React.useState(FAMILY_QUESTS);
  const [askText, textDialog] = usePrompt();
  const kids = FAMILY_MEMBERS.filter(m => m.role === 'peque');
  const byId = (id) => FAMILY_MEMBERS.find(m => m.id === id);
  const toApprove = quests.filter(q => q.status === 'por-aprobar');
  function approve(q, ok) {
    setQuests(qs => qs.map(x => x.id === q.id ? { ...x, status: ok ? 'aprobada' : 'pendiente' } : x));
    const kid = byId(q.who);
    flash(ok ? `Aprobada ✓ ${kid.name} recibe ${q.coins} monedas y ${q.xp} XP` : `«${q.name}» regresó a pendiente — que lo intente de nuevo`);
  }
  return (
    <div className="kbv-family">
      {textDialog}
      <div className="kbv-family-strip">
        <span className="fam-msg">
          <KIcon name="home" size={14} />
          <strong>Modo familia.</strong>
          Los peques tienen cuentas protegidas: sin social público, recompensas que apruebas tú, y su mesada se liga a misiones — no al chantaje.
        </span>
        <button type="button" className="fr-btn" onClick={() => askText({ title: 'Invitar a la familia', sub: 'Le llega un código para unirse con cuenta protegida.', label: 'Nombre', placeholder: 'p. ej. Sofía (hija), abuelo Raúl…', confirmLabel: 'Invitar', onSubmit: (n) => flash(`Invitación enviada a ${n} 🏡`) })}>
          <KIcon name="user-plus" size={13} /> Agregar familiar
        </button>
      </div>

      {toApprove.length > 0 && (
        <div className="kbv-fam-approvals">
          <SectionHead level={4} tight title="Por aprobar" meta="Marcaron la misión como hecha — tú das el visto bueno" />
          <div className="fam-approve-list">
            {toApprove.map(q => {
              const kid = byId(q.who);
              return (
                <div key={q.id} className="fam-approve" style={{ '--c': kid.color }}>
                  <span className="fa-av">{kid.name[0]}</span>
                  <span className="fa-txt"><strong>{kid.name}</strong> terminó «{q.name}»</span>
                  <span className="fa-reward"><CoinIcon size={12} /> {q.coins} · {q.xp} XP</span>
                  <div className="fa-acts">
                    <button type="button" className="fr-btn" onClick={() => approve(q, true)}><KIcon name="check" size={12} /> Aprobar</button>
                    <button type="button" className="fr-btn ghost" title="Devolver" onClick={() => approve(q, false)}><KIcon name="x" size={12} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="kbv-fam-kids">
        {kids.map(kid => {
          const kq = quests.filter(q => q.who === kid.id);
          const done = kq.filter(q => q.status === 'aprobada').length;
          return (
            <div key={kid.id} className="kbv-fam-kid" style={{ '--c': kid.color }}>
              <div className="fk-head">
                <span className="fk-av">{kid.name[0]}</span>
                <div className="fk-id">
                  <span className="fk-name">{kid.name} <em>· {kid.age} años</em></span>
                  <span className="fk-meta">Nv. {kid.level} · 🔥 {kid.streak} días · cuenta protegida</span>
                </div>
                <span className="fk-mesada" title="Mesada semanal ligada a misiones"><CoinIcon size={13} /> {kid.mesada}<small>/sem</small></span>
              </div>
              <div className="fk-quests">
                {kq.map(q => (
                  <div key={q.id} className={`fk-quest ${q.status}`}>
                    <KIcon name={q.status === 'aprobada' ? 'check' : q.status === 'por-aprobar' ? 'clock' : 'flag'} size={12} />
                    <span className="qn">{q.name}</span>
                    {q.daily && <span className="qd">diaria</span>}
                    <span className="qr"><CoinIcon size={10} /> {q.coins}</span>
                  </div>
                ))}
              </div>
              <div className="fk-foot">
                <span className="kbv-meta">{done} de {kq.length} misiones aprobadas hoy</span>
                <button type="button" className="fr-btn" onClick={() => askText({ title: `Nueva misión para ${kid.name}`, sub: 'Define qué cuenta como hecha; tú la apruebas.', label: 'Misión', placeholder: 'p. ej. Regar las plantas, 20 min de piano…', confirmLabel: 'Asignar', onSubmit: (n) => { setQuests(qs => [...qs, { id: 'fq' + Math.random().toString(36).slice(2, 5), name: n, who: kid.id, coins: 12, xp: 18, status: 'pendiente' }]); flash(`Misión asignada a ${kid.name} ✓`); } })}>
                  <KIcon name="plus" size={12} /> Misión
                </button>
              </div>
            </div>
          );
        })}
        <div className="kbv-fam-kid adult" style={{ '--c': FAMILY_MEMBERS[2].color }}>
          <div className="fk-head">
            <span className="fk-av">A</span>
            <div className="fk-id">
              <span className="fk-name">Ana <em>· co-admin</em></span>
              <span className="fk-meta">Nv. 11 · 🔥 34 días · aprueba misiones igual que tú</span>
            </div>
          </div>
          <EmptyState compact icon="community" title="Compiten en secreto" body="Tú y Ana comparten la administración — y una liga privada de rachas." />
        </div>
      </div>
    </div>
  );
}

// Tarjeta compacta de amigo — datos a grosso modo: avatar, nombre, nivel,
// racha y XP de la semana, con las acciones sociales de siempre.
// La tarjeta de amigo LLEVA su vitrina: portada, marco, título y compañero.
// Sin eso la personalización que el usuario compra solo la ve él, y la
// vitrina existe precisamente para que la vea su círculo.
function FriendCard({ f, onNudge, onGift, onOpen, sharedCount }) {
  const card = f.card || {};
  const pet = card.pet && typeof cardPetById === 'function' ? cardPetById(card.pet) : null;
  return (
    <div className={`kbv-friend-card ${f.risk ? 'risk' : ''}`} onClick={() => onOpen && onOpen(f)}>
      <div className="fc-cover">
        {typeof CardBackdrop === 'function' && <CardBackdrop bgId={card.bg || 'vt-bg-slate'} className="fc-cover-bg" color={card.color} scrim={false} />}
        {pet && typeof KiboPet === 'function' &&
          <span className={`vt-pet fc-pet ${card.pet}`} aria-hidden="true"><KiboPet gesture={pet.gesture} size={44} every={12000} /></span>}
        <button type="button" className="fc-gift" title="Regalar un item de la Tienda"
                onClick={(e) => { e.stopPropagation(); onGift(f); }}><KIcon name="shop" size={14} /></button>
      </div>
      <div className="fc-top">
        <span className="fc-av" style={{ '--c': f.color, ...(typeof frameRingStyle === 'function' ? frameRingStyle(card.frame) : {}) }}>{f.name[0]}{f.online && <i className="fr-dot" />}</span>
        <div className="fc-id">
          <span className="fc-name">{f.name}</span>
          {card.title
            ? <span className="vt-honor fc-honor" style={{ '--c': card.tc || f.color }}><KIcon name="sparkle" size={9} /> {card.title}</span>
            : null}
          <span className="fc-meta">{f.online ? 'En línea' : 'Ausente'}{f.risk ? ' · racha en riesgo' : ''}</span>
        </div>
      </div>
      <div className="fc-stats">
        <span className="fc-stat"><em className="kbv-num">{f.level}</em>nivel</span>
        <span className={`fc-stat ${f.streak === 0 ? 'zero' : 'fire'}`}><em className="kbv-num">{f.streak}</em>racha · d</span>
        <span className="fc-stat"><em className="kbv-num">{f.weekXP.toLocaleString('es-MX')}</em>XP sem.</span>
      </div>
      {sharedCount > 0 && (
        <span className="fc-shared"><KIcon name="sword" size={10} /> {sharedCount} reto{sharedCount > 1 ? 's' : ''} juntos</span>
      )}
      <button type="button" className={`fc-cta ${f.risk ? 'warn' : ''}`}
              onClick={(e) => { e.stopPropagation(); onNudge(f, f.risk ? 'racha' : 'animo'); }}>
        <KIcon name={f.risk ? 'flame' : 'sparkle'} size={13} /> {f.risk ? 'Recordar racha' : 'Animar'}
      </button>
    </div>
  );
}

// Marcador de un reto compartido — el ranking que sí significa algo: quién
// lleva más días cumplidos DENTRO de este reto. Sustituye a la liga de XP
// abstracta, que no estaba ligada a nada.
function RetoScoreboard({ sc, you, friendColor, onRegister, onOpenFriend }) {
  const pct = sc.daysTotal > 0 ? Math.round((sc.daysElapsed / sc.daysTotal) * 100) : 0;
  const players = [
    { id: 'me', name: (you && you.name) || 'Tú', color: 'var(--kb-primary)', days: sc.myDays ?? 0, fails: sc.myFails ?? 0,
      streak: sc.myStreak ?? 0, done: sc.meDone, you: true },
    { id: 'fr', name: sc.friend, color: friendColor || sc.fc, days: sc.friendDays ?? 0, fails: sc.friendFails ?? 0,
      streak: sc.friendStreak ?? 0, done: sc.friendDone },
  ].sort((a, b) => (b.days - a.days) || (a.fails - b.fails));
  const lead = players[0].days - players[1].days;
  const maxDays = Math.max(1, sc.daysElapsed);

  return (
    <div className="kbv-scoreboard">
      <div className="sbd-head">
        <div className="sbd-id">
          <span className="sbd-name">{sc.name}</span>
          <span className="kbv-meta">con {sc.friend} · día {sc.daysElapsed} de {sc.daysTotal}</span>
        </div>
        <div className="sbd-risk">
          <RetoDifficultyMeter difficulty={sc.difficulty} />
          <span className="sbd-hp"><KIcon name="alert" size={11} /> −{sc.hp} HP por fallo</span>
        </div>
      </div>

      <div className="sbd-bar"><i style={{ width: pct + '%' }} /><span>{pct}%</span></div>

      <div className="sbd-players">
        {players.map((pl, i) => (
          <div key={pl.id} className={`sbd-row ${pl.you ? 'you' : ''} ${i === 0 && lead > 0 ? 'lead' : ''}`} style={{ '--c': pl.color }}>
            <span className="sbd-rank">{i === 0 && lead > 0 ? <KIcon name="crown" size={13} /> : i + 1}</span>
            <button type="button" className="sbd-av" disabled={pl.you}
                    onClick={() => !pl.you && onOpenFriend && onOpenFriend()}>{pl.you ? 'T' : pl.name[0]}</button>
            <span className="sbd-who">{pl.name}{pl.you && <em> · tú</em>}</span>
            <span className="sbd-track"><i style={{ width: (pl.days / maxDays) * 100 + '%' }} /></span>
            <span className="sbd-stat"><b>{pl.days}</b> días</span>
            <span className={`sbd-stat ${pl.fails > 0 ? 'warn' : ''}`}><b>{pl.fails}</b> fallo{pl.fails === 1 ? '' : 's'}</span>
            <span className="sbd-stat flame"><KIcon name="flame" size={11} /><b>{pl.streak}</b></span>
          </div>
        ))}
      </div>

      <div className="sbd-foot">
        <span className="kbv-meta">
          {lead === 0
            ? 'Empatados — hoy define quién se adelanta.'
            : `${players[0].you ? 'Vas' : players[0].name + ' va'} ${lead} día${lead === 1 ? '' : 's'} arriba.`}
        </span>
        <div className="sbd-today">
          <span className={`sbd-chk ${sc.meDone ? 'on' : ''}`}><KIcon name={sc.meDone ? 'check' : 'clock'} size={11} /> tú</span>
          <span className={`sbd-chk ${sc.friendDone ? 'on' : ''}`}><KIcon name={sc.friendDone ? 'check' : 'clock'} size={11} /> {sc.friend}</span>
          {!sc.meDone && (
            <button type="button" className="sbd-reg" onClick={onRegister}>
              <KIcon name="check" size={13} /> Registrar hoy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function GiftModal({ friend, onClose, onSend }) {
  return (
    <KBVModal title={`Regalar a ${friend.name}`}
      sub="No envías dinero ni fragmentos directo — regalas items de la Tienda que le sirven en su día a día."
      size="lg" onClose={onClose}
      footer={<div className="right" style={{ marginLeft: 'auto' }}>
        <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cerrar</button>
      </div>}>
      <div className="gm-grid">
        {FRIEND_GIFTS.map(g => (
          <ItemCard key={g.id} item={g} onBuy={() => onSend(friend, g)} />
        ))}
      </div>
    </KBVModal>
  );
}

// Perfil rápido de un amigo — su pulso, lo que comparten y las acciones.
function FriendProfileModal({ friend, you, shared, onClose, onNudge, onGift, onReto, onContribute }) {
  const f = friend;
  const diffXP = f.weekXP - (you.weekXP || 0);
  const card = f.card || {};
  return (
    <KBVModal title="Resumen de jugador" sub="Su carta de presentación — lo que la comunidad ve"
      size="lg" onClose={onClose}
      footer={<>
        <span className="kbv-meta">Las acciones sociales no transfieren dinero: regalas items y aportas a metas.</span>
        <div className="right">
          <button type="button" className="kbv-btn kbv-btn-ghost" onClick={onClose}>Cerrar</button>
          <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => { onReto(f); onClose(); }}>
            <KIcon name="sword" size={14} /> Proponer reto
          </button>
        </div>
      </>}>
      <div className="kbv-fp-card">
        {typeof CardBackdrop === 'function' && <CardBackdrop bgId={card.bg || 'vt-bg-slate'} className="vt-card-bg" color={card.color} />}
        {card.pet && typeof KiboPet === 'function' &&
          <span className={`vt-pet fpc-pet ${card.pet}`} aria-hidden="true"><KiboPet gesture={(cardPetById(card.pet) || {}).gesture} size={42} every={11000} /></span>}
        <div className="fpc-inner">
          <span className="fpc-av" style={{ '--c': f.color, ...(typeof frameRingStyle === 'function' ? frameRingStyle(card.frame) : {}) }}>{f.name[0]}{f.online && <i className="fr-dot" />}</span>
          <div className="fpc-id">
            <span className="fpc-name">{f.name}</span>
            {card.title && <span className="vt-honor" style={{ '--c': card.tc || f.color }}><KIcon name="sparkle" size={9} /> {card.title}</span>}
            {card.tagline && <span className="fpc-tag">“{card.tagline}”</span>}
          </div>
          <span className="fpc-lv">Nv. <strong>{f.level}</strong></span>
        </div>
      </div>
      <div className="kbv-fp-stats">
        <div className="fp-stat"><span className="l">Nivel</span><span className="v">{f.level}</span></div>
        <div className="fp-stat"><span className="l">Racha</span><span className={`v ${f.streak === 0 ? 'zero' : 'fire'}`}>{f.streak} d</span></div>
        <div className="fp-stat"><span className="l">XP semana</span><span className="v">{f.weekXP.toLocaleString('es-MX')}</span></div>
        <div className="fp-stat"><span className="l">Contra ti</span>
          <span className={`v ${diffXP >= 0 ? 'up' : 'down'}`}>{diffXP >= 0 ? '+' : '−'}{Math.abs(diffXP).toLocaleString('es-MX')}</span></div>
      </div>

      <div className="kbv-fp-acts">
        <button type="button" className="fp-act" onClick={() => onNudge(f, f.risk ? 'racha' : 'animo')}>
          <KIcon name={f.risk ? 'flame' : 'sparkle'} size={14} /> {f.risk ? 'Recordar su racha' : 'Mandar ánimo'}
        </button>
        <button type="button" className="fp-act" onClick={() => { onClose(); onGift(f); }}>
          <KIcon name="shop" size={14} /> Regalar un item
        </button>
      </div>

      <SectionHead level={4} tight title="Retos que comparten" meta={shared.length ? `${shared.length} en curso` : 'ninguno todavía'} />
      {shared.length === 0 ? (
        <EmptyState compact icon="sword" title="Aún no comparten un reto"
                    body="Un reto compartido pone el HP de los dos en juego: ambos registran cada día." />
      ) : (
        <div className="kbv-fp-retos">
          {shared.map(sc => {
            const pct = Math.round((sc.daysElapsed / sc.daysTotal) * 100);
            return (
              <div key={sc.id} className="fp-reto">
                <span className="fpr-name">{sc.name}</span>
                <span className="fpr-bar"><i style={{ width: pct + '%' }} /></span>
                <span className="kbv-meta">día {sc.daysElapsed} de {sc.daysTotal} · {sc.fails} fallo{sc.fails === 1 ? '' : 's'}</span>
              </div>
            );
          })}
        </div>
      )}

      <SectionHead level={4} tight title="Su lista de deseos" meta="Puedes cubrir hasta el 90% entre todos" />
      {(!f.wishlist || f.wishlist.length === 0) ? (
        <EmptyState compact icon="sparkle" title="Sin metas publicadas" body={`${f.name} no ha puesto nada en su lista de deseos.`} />
      ) : f.wishlist.map(w => {
        const cap = Math.floor(w.target * 0.9);
        const capped = w.saved >= cap;
        return (
          <GoalBar key={w.id} label={w.name} cur={w.saved} target={w.target} capPct={90} currency={w.cur}
                   who={`amigos ${Math.round(((w.fromFriends || 0) / w.target) * 100)}%`}
                   right={<button type="button" className="fw-add" disabled={capped} onClick={() => onContribute(f.id, w.id)}>
                     <KIcon name="plus" size={11} /> Aportar 5%
                   </button>} />
        );
      })}
    </KBVModal>
  );
}


// ═══ 68 · Familia como SECCIÓN propia ════════════════════════════
// Vivía como cuarta pestaña del hub de Amigos, y ahí se leía como un anexo:
// misma caja, mismo encabezado «Tu círculo». La casa no es un anexo del
// círculo social — administra personas, dinero y permisos. Tiene su entrada,
// su encabezado y su resumen.
function FamiliaScreen({ onNavigate }) {
  const [toast, setToast] = React.useState(null);
  function flash(m) { setToast(m); clearTimeout(flash._t); flash._t = setTimeout(() => setToast(null), 2200); }
  const kids = FAMILY_MEMBERS.filter(m => m.role === 'peque');
  const mesada = kids.reduce((a, k) => a + (k.mesada || 0), 0);
  const porAprobar = FAMILY_QUESTS.filter(q => q.status === 'por-aprobar').length;
  return (
    <div className="kbv-main kbv-social">
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--area-community)' }}>{crumb('familia', 'Tu casa')}</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>
            Familia.
            <InfoDot label="i" text="Kibo para padres: cuentas protegidas para los peques, misiones que tú apruebas y mesada ligada al esfuerzo — no al chantaje. Los peques no ven social público ni tienda de materia oscura." />
          </h1>
        </div>
      </div>

      <div className="kbv-social-band">
        <div className="sb-cell">
          <span className="sb-ico" style={{ '--c': 'var(--area-community)' }}><KIcon name="home" size={15} /></span>
          <span className="sb-v">{FAMILY_MEMBERS.length}</span>
          <span className="sb-l">en tu casa · {kids.length} con cuenta protegida</span>
        </div>
        <div className="sb-cell">
          <span className="sb-ico" style={{ '--c': 'var(--kb-streak)' }}><KIcon name="clock" size={15} /></span>
          <span className="sb-v">{porAprobar}</span>
          <span className="sb-l">{porAprobar === 1 ? 'misión esperando tu visto bueno' : 'misiones esperando tu visto bueno'}</span>
        </div>
        <div className="sb-cell">
          <span className="sb-ico" style={{ '--c': 'var(--kb-coin)' }}><KIcon name="wealth" size={15} /></span>
          <span className="sb-v">{mesada.toLocaleString('es-MX')}</span>
          <span className="sb-l">monedas de mesada por semana</span>
        </div>
      </div>

      <FamilyPanel flash={flash} />
      {toast && <div className="kbv-toast show">{toast}</div>}
    </div>
  );
}

function SocialScreen({ user, stats, onNavigate }) {
  const youName = (user?.name || 'Tú').trim() || 'Tú';
  const you = { id: 'me', name: youName, color: 'var(--kb-primary)', level: stats?.level ?? 8, streak: stats?.streak ?? 23, weekXP: 1840, online: true };
  const [friends, setFriends] = React.useState(DEMO_FRIENDS);
  const [giftFor, setGiftFor] = React.useState(null);
  const [profileFor, setProfileFor] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const [hubTab, setHubTab] = React.useState('amigos');
  const [query, setQuery] = React.useState('');
  const [requests, setRequests] = React.useState(REQUESTS_IN);
  const [sent, setSent] = React.useState([]);
  const [claps, setClaps] = React.useState({});
  const [retoId, setRetoId] = React.useState(null);
  const [feedTab, setFeedTab] = React.useState('todo');

  function flash(msg) { setToast(msg); clearTimeout(flash._t); flash._t = setTimeout(() => setToast(null), 2600); }

  const ranked = [...friends, you].sort((a, b) => b.weekXP - a.weekXP);
  const atRisk = friends.filter(f => f.risk);
  const circleXP = ranked.reduce((a, f) => a + f.weekXP, 0);
  const retosLeading = (typeof SHARED_CHALLENGES !== 'undefined' ? SHARED_CHALLENGES : [])
    .filter(sc => !sc.pending && (sc.myDays ?? 0) >= (sc.friendDays ?? 0)).length;
  const sharedList = typeof SHARED_CHALLENGES !== 'undefined' ? SHARED_CHALLENGES : [];
  const sharedOf = (name) => sharedList.filter(sc => sc.friend === name);
  const activeShared = sharedList.filter(sc => !sc.pending);
  const pendingShared = sharedList.filter(sc => sc.pending);
  const curReto = activeShared.find(sc => sc.id === retoId) || activeShared[0] || null;

  function nudge(f, kind) {
    flash(kind === 'racha' ? `Le recordaste a ${f.name} que no pierda su racha 🔥` : `Le mandaste ánimo a ${f.name} ✨`);
  }
  function send(f, g) {
    setGiftFor(null);
    flash(`Regalaste "${g.name}" a ${f.name} 🎁`);
  }
  function clap(id) {
    setClaps(c => ({ ...c, [id]: !c[id] }));
  }
  function contribute(friendId, itemId) {
    setFriends(fs => fs.map(f => {
      if (f.id !== friendId) return f;
      return { ...f, wishlist: f.wishlist.map(w => {
        const cap = Math.floor(w.target * 0.9);              // amigos solo hasta el 90%
        const step = Math.max(1, Math.round(w.target * 0.05)); // 5% por aporte
        if (w.saved >= cap) return w;
        const add = Math.min(step, cap - w.saved);
        return { ...w, saved: w.saved + add, fromFriends: (w.fromFriends || 0) + add };
      }) };
    }));
    const fr = friends.find(f => f.id === friendId);
    flash(`Aportaste a la lista de deseos de ${fr ? fr.name : 'tu amigo'} 💚`);
  }

  const friendsWithWishes = friends.filter(f => f.wishlist && f.wishlist.length);

  // Actividad agrupada por cuándo pasó — se lee como un diario, no como una lista plana.
  const feedRows = SOCIAL_FEED.filter(a => feedTab === 'todo' || a.kind === feedTab);
  const feedGroups = Object.entries(feedRows.reduce((acc, a) => {
    const day = /hace \d+ h|hace \d+ min/.test(a.when) ? 'Hoy' : a.when === 'ayer' ? 'Ayer' : 'Esta semana';
    (acc[day] = acc[day] || []).push(a);
    return acc;
  }, {}));

  // ── búsqueda y solicitudes ──
  const results = (query.trim()
    ? SEARCH_POOL.filter(p => (p.name + ' ' + p.handle).toLowerCase().includes(query.trim().toLowerCase()))
    : SEARCH_POOL
  ).filter(p => !friends.some(f => f.name === p.name));
  const sentPeople = SEARCH_POOL.filter(p => sent.includes(p.id));

  function sendRequest(p) { setSent(s => [...s, p.id]); flash(`Solicitud enviada a ${p.name} — te avisamos cuando acepte`); }
  function cancelRequest(p) { setSent(s => s.filter(id => id !== p.id)); flash('Solicitud cancelada'); }
  function acceptRequest(p) {
    setRequests(rs => rs.filter(x => x.id !== p.id));
    setFriends(fs => [...fs, { id: p.id, name: p.name, color: p.color, level: p.level, streak: 1, weekXP: 320, online: false, risk: false, wishlist: [] }]);
    flash(`${p.name} y tú ahora son amigos 🎉`);
  }
  function rejectRequest(p) { setRequests(rs => rs.filter(x => x.id !== p.id)); flash('Solicitud rechazada'); }
  function goRetos(action) {
    try { window.dispatchEvent(new CustomEvent('kibo:navigate', { detail: { screen: 'retos', tab: 'compartidos', action } })); } catch (_) {}
  }

  return (
    <div className="kbv-main kbv-social">
      <div className="kbv-page-head">
        <div>
          <span className="kbv-eyebrow" style={{ color: 'var(--kb-primary)' }}>Social · Tu círculo</span>
          <h1 className="kbv-h1" style={{ marginTop: 4 }}>Amigos. <InfoDot label="i" text={"Tu progreso es más fácil acompañado. Empújense a no perder la racha, regálense items útiles, aporten a las metas del otro y compitan o cooperen en retos compartidos."} /></h1>
        </div>
        <button type="button" className="kbv-btn kbv-btn-primary" onClick={() => flash('Liga de invitación copiada al portapapeles 🔗')}>
          <KIcon name="plus" size={14} /> Invitar amigos
        </button>
      </div>

      {/* PULSO DEL CÍRCULO — la banda que abre la pantalla */}
      <div className="kbv-social-band">
        <div className="sb-cell">
          <span className="sb-ico" style={{ '--c': 'var(--kb-primary)' }}><KIcon name="community" size={15} /></span>
          <span className="sb-v">{friends.length}</span>
          <span className="sb-l">amigos · {friends.filter(f => f.online).length} en línea</span>
        </div>
        <div className="sb-cell">
          <span className="sb-ico" style={{ '--c': 'var(--kb-coin)' }}><KIcon name="crown" size={15} /></span>
          <span className="sb-v">{retosLeading}</span>
          <span className="sb-l">{retosLeading === 1 ? 'reto donde vas arriba' : 'retos donde vas arriba'}</span>
        </div>
        <div className={`sb-cell ${atRisk.length ? 'warn' : ''}`}>
          <span className="sb-ico" style={{ '--c': 'var(--kb-streak)' }}><KIcon name="flame" size={15} /></span>
          <span className="sb-v">{atRisk.length}</span>
          <span className="sb-l">{atRisk.length === 1 ? 'racha en riesgo' : 'rachas en riesgo'}</span>
        </div>
        <div className="sb-cell">
          <span className="sb-ico" style={{ '--c': 'var(--kb-boss)' }}><KIcon name="sword" size={15} /></span>
          <span className="sb-v">{activeShared.length}</span>
          <span className="sb-l">{activeShared.length === 1 ? 'reto compartido activo' : 'retos compartidos activos'}</span>
        </div>
        <div className="sb-cell">
          <span className="sb-ico" style={{ '--c': 'var(--kb-xp)' }}><KIcon name="trending-up" size={15} /></span>
          <span className="sb-v">{circleXP.toLocaleString('es-MX')}</span>
          <span className="sb-l">XP del círculo · semana</span>
        </div>
      </div>

      {/* EMPUJONES PENDIENTES — solo si hay alguien en riesgo */}
      {atRisk.length > 0 && (
        <div className="kbv-nudge-strip">
          <span className="ns-msg">
            <KIcon name="flame" size={14} />
            <strong>{atRisk.length === 1 ? `${atRisk[0].name} está por perder su racha.` : `${atRisk.length} amigos están por perder su racha.`}</strong>
            Un empujón tuyo cuenta — el fracaso reencauza, pero mejor no llegar ahí.
          </span>
          <div className="ns-acts">
            {atRisk.map(f => (
              <button key={f.id} type="button" className="fr-btn warn" onClick={() => nudge(f, 'racha')}>
                <KIcon name="flame" size={12} /> {f.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TU CÍRCULO — directorio con las pestañas en su propia fila */}
      <div className="kbv-card kbv-char-card">
        <SectionHead tight title="Tu círculo" meta="Tus amigos, gente por agregar y tu buzón de solicitudes" />
        <div className="kbv-seg-row">
          <div className="kbv-seg">
            <button type="button" className={hubTab === 'amigos' ? 'on' : ''} onClick={() => setHubTab('amigos')}>
              <KIcon name="community" size={13} /> Mis amigos <span className="seg-n">{friends.length}</span>
            </button>
            <button type="button" className={hubTab === 'buscar' ? 'on' : ''} onClick={() => setHubTab('buscar')}>
              <KIcon name="search" size={13} /> Buscar gente
            </button>
            <button type="button" className={hubTab === 'buzon' ? 'on' : ''} onClick={() => setHubTab('buzon')}>
              <KIcon name="inbox" size={13} /> Solicitudes
              {requests.length > 0 && <span className="seg-n alert">{requests.length}</span>}
            </button>
          </div>
          {hubTab === 'amigos' && (
            <span className="kbv-meta">Toca una tarjeta para ver su perfil, lo que comparten y sus metas.</span>
          )}
        </div>

        {hubTab === 'amigos' && (
          <div className="kbv-friends-grid">
            {friends.map(f => (
              <FriendCard key={f.id} f={f} onNudge={nudge} onGift={setGiftFor}
                          onOpen={setProfileFor} sharedCount={sharedOf(f.name).length} />
            ))}
            <button type="button" className="kbv-friend-add" onClick={() => setHubTab('buscar')}>
              <span className="glyph"><KIcon name="user-plus" size={20} /></span>
              <span className="lbl">Buscar amigos</span>
              <span className="sub">Por nombre o @usuario — se agregan cuando acepten tu solicitud.</span>
            </button>
          </div>
        )}

        {hubTab === 'buscar' && (
          <div className="kbv-friend-search">
            <div className="kbv-search-box">
              <KIcon name="search" size={15} />
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Busca por nombre o @usuario…" autoFocus />
              {query && <button type="button" onClick={() => setQuery('')} aria-label="Limpiar"><KIcon name="x" size={12} /></button>}
            </div>
            <span className="kbv-meta" style={{ margin: '0 2px' }}>{query.trim() ? `Resultados para «${query.trim()}»` : 'Sugerencias para ti — gente con amigos en común'}</span>
            <div className="kbv-person-list two">
              {results.length === 0 ? (
                <EmptyState compact icon="search" title="Sin resultados" body="Nadie con ese nombre por aquí. Compártele tu liga de invitación." />
              ) : results.map(p => (
                <div key={p.id} className="kbv-person-row">
                  <span className="pr-av" style={{ '--c': p.color }}>{p.name[0]}</span>
                  <div className="pr-id">
                    <span className="pr-name">{p.name} <em>{p.handle}</em></span>
                    <span className="pr-meta">Nv. {p.level}{p.mutual > 0 ? ` · ${p.mutual} amigo${p.mutual > 1 ? 's' : ''} en común` : ' · sin amigos en común'}</span>
                  </div>
                  {sent.includes(p.id)
                    ? <button type="button" className="fr-btn sent" onClick={() => cancelRequest(p)} title="Cancelar solicitud"><KIcon name="check" size={12} /> Enviada</button>
                    : <button type="button" className="fr-btn" onClick={() => sendRequest(p)}><KIcon name="user-plus" size={13} /> Agregar</button>}
                </div>
              ))}
            </div>
          </div>
        )}

        {hubTab === 'buzon' && (
          <div className="kbv-friend-inbox">
            <div className="kbv-inbox-group">
              <span className="kbv-eyebrow" style={{ fontSize: 10 }}>Recibidas · {requests.length}</span>
              {requests.length === 0 ? (
                <EmptyState compact icon="inbox" title="Sin solicitudes" body="Cuando alguien te agregue, aparecerá aquí." />
              ) : (
                <div className="kbv-person-list two">
                  {requests.map(p => (
                    <div key={p.id} className="kbv-person-row">
                      <span className="pr-av" style={{ '--c': p.color }}>{p.name[0]}</span>
                      <div className="pr-id">
                        <span className="pr-name">{p.name} <em>{p.handle}</em></span>
                        <span className="pr-meta">Nv. {p.level} · {p.note}</span>
                      </div>
                      <div className="pr-actions">
                        <button type="button" className="fr-btn" onClick={() => acceptRequest(p)}><KIcon name="check" size={12} /> Aceptar</button>
                        <button type="button" className="fr-btn ghost" onClick={() => rejectRequest(p)} title="Rechazar"><KIcon name="x" size={12} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {sentPeople.length > 0 && (
              <div className="kbv-inbox-group">
                <span className="kbv-eyebrow" style={{ fontSize: 10 }}>Enviadas · {sentPeople.length}</span>
                <div className="kbv-person-list two">
                  {sentPeople.map(p => (
                    <div key={p.id} className="kbv-person-row">
                      <span className="pr-av" style={{ '--c': p.color }}>{p.name[0]}</span>
                      <div className="pr-id">
                        <span className="pr-name">{p.name} <em>{p.handle}</em></span>
                        <span className="pr-meta">Esperando respuesta…</span>
                      </div>
                      <button type="button" className="fr-btn ghost" onClick={() => cancelRequest(p)} title="Cancelar"><KIcon name="x" size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RETOS COMPARTIDOS — el marcador vive aquí: la competencia es por reto,
          no un ranking de XP abstracto que no se ligaba a nada. */}
      <div className="kbv-card kbv-char-card">
        <SectionHead tight title="Retos compartidos" meta="Quién va ganando en cada reto · el HP de los dos está en juego"
                     action="Gestionar en Retos" onAction={() => goRetos()} />

        {activeShared.length === 0 ? (
          <EmptyState icon="sword" title="Todavía no comparten un reto"
                      body="Un reto compartido pone el HP de los dos en juego: ambos registran cada día y aquí ves quién va ganando."
                      action="Proponer un reto" onAction={() => goRetos('create-shared')} />
        ) : (
          <React.Fragment>
            {activeShared.length > 1 && (
              <div className="kbv-reto-switch">
                {activeShared.map(sc => {
                  const on = sc.id === (curReto && curReto.id);
                  const fr = friends.find(f => f.name === sc.friend);
                  return (
                    <button key={sc.id} type="button" className={`rsw ${on ? 'on' : ''}`} style={{ '--c': (fr && fr.color) || sc.fc }}
                            onClick={() => setRetoId(sc.id)}>
                      <span className="rsw-av">{sc.friend[0]}</span>
                      <span className="rsw-id">
                        <span className="rsw-name">{sc.name}</span>
                        <span className="rsw-meta">día {sc.daysElapsed}/{sc.daysTotal} · con {sc.friend}</span>
                      </span>
                      {!sc.meDone && <span className="rsw-due" title="Te toca registrar hoy" />}
                    </button>
                  );
                })}
              </div>
            )}

            {curReto && (
              <RetoScoreboard sc={curReto} you={you}
                friendColor={(friends.find(f => f.name === curReto.friend) || {}).color}
                onRegister={() => flash(`Registraste hoy en «${curReto.name}» ✓`)}
                onOpenFriend={() => {
                  const fr = friends.find(f => f.name === curReto.friend);
                  if (fr) setProfileFor(fr);
                }} />
            )}

            <div className="kbv-shared-foot">
              {pendingShared.length > 0 && (
                <span className="kbv-meta">
                  <KIcon name="clock" size={12} /> {pendingShared.length} invitación{pendingShared.length > 1 ? 'es' : ''} sin responder
                </span>
              )}
              <button type="button" className="fr-btn" onClick={() => goRetos('create-shared')}>
                <KIcon name="plus" size={13} /> Nuevo reto compartido
              </button>
            </div>
          </React.Fragment>
        )}
      </div>

      {/* APORTAR A LISTAS DE DESEOS */}
      <div className="kbv-card kbv-char-card">
        <SectionHead tight title="Apoya las metas de tus amigos" meta="Aporta un pedacito a su lista de deseos. Entre todos pueden cubrir hasta el 90% — el último tramo lo cierra él. No es dinero real: son monedas y fragmentos del juego." />
        <div className="kbv-fwish-grid">
          {friendsWithWishes.map(f => f.wishlist.map(w => {
            const pct = Math.min(100, Math.round((w.saved / w.target) * 100));
            const cap = Math.floor(w.target * 0.9);
            const capped = w.saved >= cap;
            const friendPct = Math.round(((w.fromFriends || 0) / w.target) * 100);
            return (
              <div key={w.id} className="kbv-fwish">
                <div className="fw-head">
                  <span className="fw-av" style={{ '--c': f.color }}>{f.name[0]}</span>
                  <div className="fw-id">
                    <span className="fw-who">{f.name} quiere</span>
                    <span className="fw-name">{w.name}</span>
                  </div>
                  <span className={`fw-cur ${w.cur}`}>{w.cur === 'gem' ? '◆' : '◈'} {w.target}</span>
                </div>
                <GoalBar
                  head={false}
                  cur={w.saved}
                  target={w.target}
                  capPct={90}
                  who={`amigos ${friendPct}%${capped ? ' · tope alcanzado' : ''}`}
                  right={
                    <button type="button" className="fw-add" disabled={capped} onClick={() => contribute(f.id, w.id)}>
                      <KIcon name="plus" size={11} /> Aportar 5%
                    </button>
                  } />
              </div>
            );
          }))}
        </div>
      </div>

      {/* ACTIVIDAD DEL CÍRCULO */}
      <div className="kbv-card kbv-char-card">
        <SectionHead tight title="Actividad del círculo" meta="Lo que hicieron tus amigos · aplaude para que lo sepan">
          <div className="kbv-feed-filter">
            {[['todo', 'Todo'], ['logro', 'Logros'], ['riesgo', 'En riesgo']].map(([k, l]) => (
              <button key={k} type="button" className={feedTab === k ? 'on' : ''} onClick={() => setFeedTab(k)}>{l}</button>
            ))}
          </div>
        </SectionHead>
        <div className="kbv-feed">
          {feedGroups.map(([when, rows]) => (
            <div key={when} className="kbv-feed-group">
              <span className="fg-day">{when}</span>
              <div className="fg-rows">
                {rows.map(a => {
                  const mine = !!claps[a.id];
                  const KIND = { logro: 'Logro', nivel: 'Nivel', riesgo: 'En riesgo', regalo: 'Regalo', reto: 'Reto' };
                  return (
                    <div key={a.id} className={`kbv-feed-row ${a.kind === 'riesgo' ? 'risk' : ''}`} style={{ '--c': a.c }}>
                      <span className="fd-av">{a.who[0]}<i className="fd-badge"><KIcon name={a.icon} size={9} /></i></span>
                      <span className="fd-main">
                        <span className="fd-txt"><strong>{a.who}</strong> {a.text}</span>
                        <span className="fd-sub">
                          <span className="fd-kind">{KIND[a.kind] || 'Actividad'}</span>
                          <span className="fd-when">{a.when}</span>
                        </span>
                      </span>
                      {a.nudge ? (
                        <button type="button" className="fr-btn warn" onClick={() => {
                          const f = friends.find(x => x.id === a.nudge);
                          if (f) nudge(f, 'racha');
                        }}><KIcon name="flame" size={12} /> Empujar</button>
                      ) : (
                        <button type="button" className={`fd-clap ${mine ? 'on' : ''}`} onClick={() => clap(a.id)}
                                title={mine ? 'Quitar aplauso' : 'Aplaudir'}>
                          <KIcon name="sparkle" size={12} /> {a.claps + (mine ? 1 : 0)}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {feedGroups.length === 0 && (
            <EmptyState compact icon="community" title="Nada por aquí" body="No hay actividad de ese tipo esta semana." />
          )}
        </div>
      </div>

      {giftFor && <GiftModal friend={giftFor} onClose={() => setGiftFor(null)} onSend={send} />}
      {profileFor && (
        <FriendProfileModal friend={profileFor} you={you} shared={sharedOf(profileFor.name)}
          onClose={() => setProfileFor(null)} onNudge={nudge} onGift={setGiftFor}
          onReto={() => goRetos('create-shared')} onContribute={contribute} />
      )}
      {toast && <div className="kbv-social-toast"><KIcon name="check" size={14} /> {toast}</div>}
    </div>
  );
}

Object.assign(window, { SocialScreen, FamiliaScreen, FAMILY_MEMBERS, FAMILY_QUESTS });
