// kibo-blob.jsx — KIBO, la mascota canónica del Design System (RF-19).
// Gel translúcido de un solo cuerpo: respira, parpadea, hace travesuras y
// expresa 8 ánimos con color + cara. Como FAB abre la rueda de acción rápida
// y puede "leerle" al usuario morfando en losa de mensaje.

const KIBO_MOODS = {
  // Boca de KIBO (referencia del usuario): PEQUEÑA y de ondas — un festón de
  // 2–3 bombas, no una sonrisa ancha. La expresión la carga la pupila; la boca
  // solo matiza. Anchos ~11–14 unidades en un viewBox de 34.
  // `px`/`py` = posición de la pupila blanca (0,0 = centro del ojo).
  calma:    { label: 'Tranquilo', skin: 'var(--kb-mood-calma)',   d: 'M -4.2 1 q 2.1 2.3 4.2 0 q 2.1 2.3 4.2 0', px: 0, py: -0.18 },
  feliz:    { label: 'Feliz',     skin: 'var(--kb-mood-feliz)',   d: 'M -4.2 1 q 2.1 2.3 4.2 0 q 2.1 2.3 4.2 0', px: 0, py: -0.24 },
  celebra:  { label: 'Celebra',   skin: 'var(--kb-mood-celebra)', d: 'M -4.2 1 q 2.1 2.3 4.2 0 q 2.1 2.3 4.2 0', px: 0, py: -0.3 },
  travieso: { label: 'Travieso',  skin: 'var(--kb-mood-travieso)',d: 'M -1.6 -1.4 L 2.4 1.4 L -1.6 4.2',        px: 0.34, py: -0.24 },
  enfocado: { label: 'Enfocado',  skin: 'var(--kb-mood-enfocado)',d: 'M -4.2 1.6 q 2.1 1.5 4.2 0 q 2.1 1.5 4.2 0', px: 0, py: 0.1 },
  sorpresa: { label: 'Sorpresa',  skin: 'var(--kb-mood-sorpresa)',d: 'M -4.2 0.4 q 2.1 3 4.2 0 q 2.1 3 4.2 0', px: 0, py: -0.34 },
  cansado:  { label: 'Cansado',   skin: 'var(--kb-mood-cansado)', d: 'M -4.2 2 q 2.1 1.4 4.2 0 q 2.1 1.4 4.2 -0.3', px: -0.2, py: 0.34 },
  triste:   { label: 'Triste',    skin: 'var(--kb-mood-triste)',  d: 'M -4.2 2.8 q 2.1 -1.9 4.2 0 q 2.1 -1.9 4.2 0', px: 0,  py: 0.4 },
};

// Ánimos heredados del prototipo → ánimos canónicos del DS
const KIBO_MOOD_ALIAS = {
  happy: 'feliz', default: 'calma', wave: 'feliz', celebrating: 'celebra',
  thinking: 'enfocado', worried: 'triste', alert: 'sorpresa', sleep: 'cansado',
  ok: 'feliz', warn: 'sorpresa', info: 'enfocado', focus: 'enfocado', sad: 'triste',
};
function kiboMood(m) {
  if (!m) return 'calma';
  return KIBO_MOODS[m] ? m : (KIBO_MOOD_ALIAS[m] || 'calma');
}

// Travesuras que EXIGEN un juguete: solo entran al repertorio (y al dial) si
// ese juguete está equipado.
const KIBO_TOY_TRICKS = {
  'toy-pelota': { id: 'patada',  name: 'Patear el balón', icon: 'target',     desc: 'Le da con la manopié y la manda a volar' },
  'toy-uke':    { id: 'cantar',  name: 'Cantar',          icon: 'mic',        desc: 'Toma el ukelele y le salen notas de la boca' },
  'toy-cubo':   { id: 'mirar',   name: 'Voltear a ver',   icon: 'search',     desc: 'Se queda viendo su juguete' },
  'toy-plantita': { id: 'mirar', name: 'Voltear a ver',   icon: 'search',     desc: 'Se queda viendo su plantita' },
};

const KIBO_TRICK_LIST = [
  { id: 'zumbido', name: 'Zumbido',       icon: 'sparkle',    face: true,  desc: 'Vibra y abre los ojos como platos' },
  { id: 'flip',    name: 'Voltereta',     icon: 'repeat',     face: false, desc: 'Un giro completo en el aire' },
  { id: 'squash',  name: 'Aplastarse',    icon: 'gauge',      face: false, desc: 'Se hace tortilla y rebota' },
  { id: 'globo',   name: 'Globo',         icon: 'trending-up',face: false, desc: 'Se infla y flota' },
  { id: 'gota',    name: 'Gota',          icon: 'droplet',    face: false, desc: 'Se escurre como gel' },
  { id: 'wave',    name: 'Saludo',        icon: 'user',       face: true,  desc: 'Agita su manopié' },
  { id: 'point',   name: 'Señalar',       icon: 'target',     face: true,  desc: 'Te apunta con la manopié' },
  { id: 'five',    name: 'Choca esos 5',  icon: 'check',      face: true,  desc: 'Levanta la manopié para chocarla' },
  { id: 'clap',    name: 'Aplauso',       icon: 'trophy',     face: true,  desc: 'Aplaude con las dos' },
  { id: 'beso',    name: 'Beso',          icon: 'mood-great', face: true,  desc: 'Manda un corazón' },
  { id: 'mueca',   name: 'Mueca',         icon: 'mood-meh',   face: true,  desc: 'Estira la boca de lado' },
  { id: 'bostezo', name: 'Bostezo',       icon: 'clock',      face: true,  desc: 'Boca enorme y ojos cerrados' },
  { id: 'guino',   name: 'Guiño',         icon: 'mood-good',  face: true,  desc: 'Cierra un ojo con complicidad' },
  { id: 'mareo',   name: 'Mareo',         icon: 'repeat',     face: true,  desc: 'Las pupilas giran en espiral' },
];
const KIBO_TRICKS = KIBO_TRICK_LIST.map(t => t.id);
const KIBO_FACE_TRICKS = ['wave', 'point', 'five', 'clap', 'beso', 'mueca', 'zumbido', 'bostezo', 'guino', 'mareo', 'patada', 'cantar', 'mirar'];
// El repertorio depende del juguete equipado: sin pelota no hay patada.
function kiboTricksFor(toyId) {
  const extra = KIBO_TOY_TRICKS[toyId];
  return extra ? KIBO_TRICK_LIST.concat([{ ...extra, face: true, toy: true }]) : KIBO_TRICK_LIST;
}

// Bocas de travesura: se elige una al azar para que la mueca nunca se repita.
// Ánimos con los que KIBO puede salir de una travesura (antes siempre
// 'travieso', y de ahí que la cara se viera idéntica cada vez).
const KIBO_TRICK_MOODS = ['travieso', 'sorpresa', 'celebra', 'feliz'];

const KIBO_MUECAS = [
  { d: 'M -8 1 Q -2 7 2 0 Q 5 -4 8 2', fill: false },                                   // ondulada
  { d: 'M -7 0 L 0 5 L 7 -1', fill: false },                                            // pico
  { d: 'M -8 -1 C -8 -4 8 -4 8 -1 C 8 6 -8 6 -8 -1 Z', fill: true },                    // boquita llena
  { d: 'M -5 -3 Q 0 6 5 -3 Q 0 0 -5 -3 Z', fill: true },                                // lengua
  { d: 'M -9 2 Q -4 -3 0 2 Q 4 7 9 2', fill: false },                                   // zigzag suave
  { d: 'M -3 -4 Q 5 0 -3 5', fill: false },                                             // de lado
  { d: 'M -6 0 Q -3 4 0 0 Q 3 -4 6 0', fill: false },                                   // doble onda fina
  { d: 'M -5 2 Q 0 -4 5 2', fill: false },                                              // arco invertido
  { d: 'M -4 -2 C -4 -5 4 -5 4 -2 C 4 3 -4 3 -4 -2 Z', fill: true },                    // ovalito
  { d: 'M -2 -2.4 L 2.6 1 L -2 4.4', fill: false },                                     // chevron «>»
  { d: 'M 2 -2.4 L -2.6 1 L 2 4.4', fill: false },                                      // chevron «<»
  { d: 'M -5 -1 L -1.4 2.4 L 2.2 -1 L 5.8 2.4', fill: false },                          // zigzag de picos
];
const KIBO_NATIVE_W = 140, KIBO_NATIVE_H = 150;

// ─────────────────────────────────────────────────────────────
// KiboBlob — el cuerpo. size = ancho en px.
// idle: programa travesuras solo (6–12 s). gesture: dispara una a mano.
// ─────────────────────────────────────────────────────────────
// Auras que se dibujan con partículas. Burbujas y Pétalos tenían su CSS
// completo pero nunca recibían los `.star`: el JSX solo los emitía para
// 'au-estelar', así que se compraban y no se veía nada.
const AURA_PARTICLES = ['au-estelar', 'au-burbujas', 'au-petalo'];

function KiboBlob({ size = 96, mood = 'calma', idle = false, gesture = null, onClick, ground = true, className = '', style = {}, title, styleOverride = null, prop = null, asMark = false }) {
  const m = kiboMood(mood);
  const def = KIBO_MOODS[m];
  // Guardarropa compartido (Tienda · Kibo cosmético). styleOverride permite
  // previsualizar un item sin equiparlo.
  const wardrobe = (typeof useKiboStyle === 'function') ? useKiboStyle() : null;
  const fit = styleOverride ? { ...(wardrobe || {}), ...styleOverride } : wardrobe;
  const skin = fit && typeof kiboSkinById === 'function' ? kiboSkinById(fit.skin) : null;
  const aura = fit && typeof kiboAuraById === 'function' ? kiboAuraById(fit.aura) : null;
  const pers = fit && typeof kiboPersById === 'function' ? kiboPersById(fit.pers) : null;
  const acc = fit ? fit.acc : 'ac-none';
  const mark = fit ? fit.mark : 'mk-none';
  const toy = fit && typeof kiboToyById === 'function' ? kiboToyById(fit.toy) : null;
  // La piel viste el cuerpo; el ánimo sigue mandando cuando no es la default.
  // Degradados: --skin lleva la BASE sólida (manos, tinte, losa) y el
  // degradado se pinta directo en el cuerpo.
  const isGrad = skin && skin.base;
  const bodySkin = skin && skin.id !== 'sk-teal' ? (isGrad ? skin.base : skin.body) : def.skin;
  const bodyGrad = isGrad ? { backgroundImage: skin.body } : null;
  const [trick, setTrick] = React.useState(null);
  const [mueca, setMueca] = React.useState(null);
  const [pop, setPop] = React.useState(false);
  const busy = React.useRef(false);
  const busyTimer = React.useRef(null);
  const lastGesture = React.useRef(null);

  const rest = React.useCallback(() => {
    clearTimeout(busyTimer.current);
    busyTimer.current = null;
    busy.current = false;
    setTrick(null); setMueca(null);
  }, []);

  const run = React.useCallback((name, interrupt) => {
    // Un gesto pedido por el usuario manda: corta la travesura en curso en
    // lugar de perderse. Solo las automáticas (idle) respetan la ventana.
    if (busy.current && !interrupt) return;
    clearTimeout(busyTimer.current);
    const withToy = toy && toy.id !== 'toy-none' && KIBO_TOY_TRICKS[toy.id] ? [KIBO_TOY_TRICKS[toy.id].id] : [];
    const pool = (pers && pers.tricks) || KIBO_TRICKS.concat(withToy);
    const t = name || pool[Math.floor(Math.random() * pool.length)];
    const cls = KIBO_FACE_TRICKS.includes(t) ? t : 'trick-' + t;
    // Limpiar antes de aplicar: si la clase entrante es la misma que la que
    // está corriendo, el navegador no reinicia el keyframe y no se ve nada.
    setTrick(null);
    requestAnimationFrame(() => setTrick(cls));
    // Cualquier travesura con la cara a la vista cambia de boca: si solo la
    // 'mueca' la cambiara, las otras nueve repetirían el trazo del ánimo.
    // Las que esconden la cara no cambian de boca; las que tienen boca PROPIA
    // (bostezo, beso) tampoco — su trazo lo define su animación.
    const entry = KIBO_TRICK_LIST.find(x => x.id === t);
    const ownMouth = ['bostezo', 'beso', 'cantar'].includes(t);
    setMueca((!entry || !entry.face || ownMouth) ? null : KIBO_MUECAS[Math.floor(Math.random() * KIBO_MUECAS.length)]);
    busy.current = true;
    busyTimer.current = setTimeout(rest, 3400);
  }, [pers && pers.id, toy && toy.id, rest]);
  React.useEffect(() => () => clearTimeout(busyTimer.current), []);


  React.useEffect(() => {
    if (!gesture || gesture === lastGesture.current) return;
    lastGesture.current = gesture;
    const g = String(gesture).split('#')[0];
    // Viene de un toque: interrumpe lo que esté corriendo.
    run(g === 'random' || g === '' ? null : g, true);
  }, [gesture, run]);

  React.useEffect(() => {
    // Sereno (o sin guardarropa cargado en superficies quietas): cero travesuras.
    const ms = pers ? pers.idleMs : [6000, 12000];
    if (!idle || !ms) return;
    let alive = true, id;
    const [lo, hi] = ms;
    const loop = () => {
      id = setTimeout(() => { if (!alive) return; run(); loop(); }, lo + Math.random() * (hi - lo));
    };
    loop();
    return () => { alive = false; clearTimeout(id); };
  }, [idle, run, pers && pers.id]);

  // La boca "pop" cada vez que cambia el ánimo
  React.useEffect(() => { setPop(true); const t = setTimeout(() => setPop(false), 460); return () => clearTimeout(t); }, [m]);

  const s = size / KIBO_NATIVE_W;
  const host = { width: size, height: Math.round(size * (KIBO_NATIVE_H / KIBO_NATIVE_W)), '--s': s, ...style };

  return (
    <span className={`kbb-host ${className}`} style={host} aria-hidden="true">
      <span
        className={`kbb ${trick || ''} ${onClick ? 'clickable' : ''} ${skin && skin.animated ? 'skinned' : ''} ${pers && pers.theatrical ? 'teatral' : ''}`}
        data-mood={m}
        data-skin={skin ? skin.id : 'sk-teal'}
        style={{ '--skin': bodySkin, '--aura': (aura && aura.tint) || 'transparent' }}
        title={title}
        onClick={onClick}
      onAnimationEnd={(e) => { if (e.target === e.currentTarget && trick) rest(); }}>
        {ground && <span className="kbb-ground" />}
        {prop && typeof KiboProp === 'function' && <KiboProp kind={prop} />}
        {toy && toy.id !== 'toy-none' && <KiboToy id={toy.id} />}
        {aura && aura.id !== 'au-none' && (
          <span className={`kbb-aura ${aura.id}`} aria-hidden="true">
            {AURA_PARTICLES.includes(aura.id) && <React.Fragment><i className="star s1" /><i className="star s2" /><i className="star s3" /></React.Fragment>}
          </span>
        )}
        <span className="kbb-float">
          <span className="kbb-bub l"><i /></span>
          <span className="kbb-bub r"><i /></span>
          <span className="kbb-body" style={bodyGrad || undefined}>
            {skin && skin.animated && <React.Fragment><span className="kbb-skinfx a" /><span className="kbb-skinfx b" /><span className="kbb-skinfx c" /></React.Fragment>}
            <span className="kbb-tint" />
          </span>
          {/* Chipote: el bulto que sale por donde jalas. No puede vivir DENTRO
              del cuerpo (su `overflow: hidden` lo recortaría a la silueta), así
              que va encima y ya mezclado: el gel es translúcido y pintarlo del
              mismo tono a otro alfa lo delataba como una bola pegada. */}
          <span className="kbb-bump" aria-hidden="true" />
          {String(mark || '').split(',').filter(m => m && m !== 'mk-none')
            .map(m => { const [id, slot] = m.split('@'); return <KiboTattoo key={m} id={id} slot={slot} />; })}
          {acc && acc !== 'ac-none' && <KiboAccessory id={acc} />}
          <span className="kbb-faceclip" style={{ '--px': (mueca && mueca.px != null ? mueca.px : (def.px || 0)), '--py': (def.py || 0) }}>
            <span className="kbb-face">
              <span className="kbb-brows">
                <span className="kbb-brow"><svg viewBox="-11 -6 22 12"><path d="M -8 2.6 Q 0 -3.4 8 2.6" /></svg></span>
                <span className="kbb-brow"><svg viewBox="-11 -6 22 12"><path d="M -8 2.6 Q 0 -3.4 8 2.6" /></svg></span>
              </span>
              <span className="kbb-eyes"><span className="kbb-eye" /><span className="kbb-eye" /></span>
              <span className="kbb-cheeks"><span className="kbb-cheek" /><span className="kbb-cheek" /></span>
              <svg className={`kbb-mouth ${pop ? 'pop' : ''} ${mueca ? 'mueca' : ''}`} viewBox="-17 -10 34 24">
                <path d={(mueca || def).d} className={(mueca || def).fill ? 'fill' : ''} />
              </svg>
              <span className="kbb-notes" aria-hidden="true">
                {[0, 1, 2].map(i => (
                  <i key={i} style={{ '--i': i }}>
                    <svg viewBox="0 0 24 24" width="15" height="15">
                      <path d="M9 18V5l10-2v13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                      <circle cx="6.5" cy="18" r="3" fill="currentColor" />
                      <circle cx="16.5" cy="16" r="3" fill="currentColor" />
                    </svg>
                  </i>
                ))}
              </span>
              <span className="kbb-kiss" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 21 C 5 15 2 11 2 7.6 C 2 4.8 4.2 3 6.6 3 C 8.6 3 10.6 4.2 12 6.2 C 13.4 4.2 15.4 3 17.4 3 C 19.8 3 22 4.8 22 7.6 C 22 11 19 15 12 21 Z" fill="var(--kb-hp)" /></svg>
              </span>
            </span>
          </span>
          <span className="kbb-target">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 3 L14 9.6 L21 12 L14 14.4 L12 21 L10 14.4 L3 12 L10 9.6 Z" /></svg>
          </span>
        </span>
      </span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// KiboTattoo — tatuaje sobre el gel. Vive DENTRO del cuerpo (mismo lienzo,
// 140×150), así que se deforma con él: nunca se despega como un accesorio.
// ─────────────────────────────────────────────────────────────
// OJO: NO llamarlo KiboMark — mascot.jsx ya exporta un KiboMark (la insignia
// compacta) que renderiza un KiboBlob dentro. Como mascot.jsx carga después,
// sobrescribía este y el blob se renderizaba a sí mismo en bucle infinito.
// Encuadre propio de cada marca para verla SOLA (58): el arte vive en el
// lienzo del cuerpo (140×150) y en su sitio anatómico, así que para el
// specimen se recorta a su caja — no se reposiciona el arte.
// Dónde puede ir un tatuaje: la cara, que es donde se ve. Antes vivían
// repartidos por los costados del cuerpo, donde la silueta los tapaba.
const MARK_SLOTS = {
  frente: { label: 'Frente', key: 'F' }, nariz: { label: 'Nariz', key: 'N' },
  cizq: { label: 'Cachete izquierdo', key: 'I' }, cder: { label: 'Cachete derecho', key: 'D' },
  ambos: { label: 'Ambos cachetes', key: 'A' },
};
const MARK_BOX = {
  'mk-pecas': '20 106 26 26', 'mk-estrella': '90 112 28 24', 'mk-rayo': '18 100 32 40',
  'mk-espiral': '84 102 34 34', 'mk-corazon': '18 102 32 30', 'mk-consteo': '20 98 34 46',
  'mk-runa': '94 100 26 40', 'mk-ondas': '34 100 60 46',
};

function KiboTattoo({ id, slot, specimen = false }) {
  const ink = 'rgba(255,255,255,0.74)';
  let art = null;
  switch (id) {
    case 'mk-pecas':
      art = (
        <g fill={ink}>
          <circle cx="34" cy="112" r="2.8" /><circle cx="26" cy="120" r="2.3" /><circle cx="38" cy="126" r="2.1" />
          <circle cx="106" cy="112" r="2.8" /><circle cx="114" cy="120" r="2.3" /><circle cx="102" cy="126" r="2.1" />
        </g>
      );
      break;
    case 'mk-estrella':
      art = <path d="M104 116 l3 6.4 7 1 -5 4.9 1.2 7-6.2-3.3-6.2 3.3 1.2-7-5-4.9 7-1 Z" fill={ink} />;
      break;
    case 'mk-rayo':
      art = <path d="M30 104 L 42 104 L 35 116 L 46 116 L 26 136 L 32 120 L 22 120 Z" fill={ink} />;
      break;
    case 'mk-espiral':
      art = <path d="M104 122 a 7 7 0 1 1 -7 -7 a 11 11 0 1 0 11 11" fill="none" stroke={ink} strokeWidth="3.4" strokeLinecap="round" />;
      break;
    case 'mk-corazon':
      art = <path d="M34 128 C 22 118 22 108 30 106 C 35 105 38 109 34 111 C 38 107 46 108 46 114 C 46 120 40 124 34 128 Z" fill="var(--kb-hp)" opacity="0.62" />;
      break;
    case 'mk-consteo':
      art = (
        <g>
          <path d="M26 104 L 40 110 L 34 122 L 48 128 L 42 138" fill="none" stroke={ink} strokeWidth="1.6" />
          <g fill={ink}><circle cx="26" cy="104" r="2.8" /><circle cx="40" cy="110" r="2.2" /><circle cx="34" cy="122" r="2.4" /><circle cx="48" cy="128" r="2" /><circle cx="42" cy="138" r="2.6" /></g>
        </g>
      );
      break;
    case 'mk-runa':
      art = (
        <g fill="none" stroke={ink} strokeWidth="3.2" strokeLinecap="round">
          <path d="M102 106 V 134" /><path d="M102 114 L 112 106" /><path d="M102 124 L 112 132" />
        </g>
      );
      break;
    case 'mk-ondas':
      art = (
        <g fill="none" stroke={ink} strokeWidth="2.8" strokeLinecap="round" opacity="0.8">
          <path d="M40 112 Q 52 106 64 112 Q 76 118 88 112" />
          <path d="M40 124 Q 52 118 64 124 Q 76 130 88 124" />
          <path d="M40 136 Q 52 130 64 136 Q 76 142 88 136" />
        </g>
      );
      break;
    default: return null;
  }
  if (specimen) return <svg className="kbs-mark-art" viewBox={MARK_BOX[id] || '0 0 140 150'} preserveAspectRatio="xMidYMid meet" aria-hidden="true">{art}</svg>;
  // El arte está dibujado en su sitio anatómico dentro del lienzo del cuerpo.
  // Para llevarlo a la cara no se arrastra el lienzo entero (quedaría fuera de
  // cuadro): se recorta a SU caja y esa caja se coloca en la mejilla, la
  // frente o la nariz. El envoltorio interior lleva el mismo `kbBlob` que el
  // gel, así que el tatuaje se estira y encoge con el cuerpo.
  const box = MARK_BOX[id] || '0 0 140 150';
  const where = MARK_SLOTS[slot] ? slot : 'cder';
  const spots = where === 'ambos' ? ['cizq', 'cder'] : [where];
  return (
    <React.Fragment>
      {spots.map(sp => (
        <span key={sp} className={`kbb-tattoo face spot-${sp}`} aria-hidden="true">
          <span className="kbb-tattoo-in">
            <svg viewBox={box} preserveAspectRatio="xMidYMid meet">{art}</svg>
          </span>
        </span>
      ))}
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────
// KiboToy — el juguete equipado, viviendo junto a la base de KIBO.
// ─────────────────────────────────────────────────────────────
function KiboToy({ id }) {
  let art = null;
  switch (id) {
    case 'toy-pelota':
      art = (
        <svg viewBox="0 0 30 30" width="26" height="26">
          <circle cx="15" cy="15" r="13" fill="var(--kb-hp)" />
          <path d="M2 15 A 13 13 0 0 1 28 15" fill="var(--kb-canvas)" opacity="0.9" transform="rotate(-18 15 15)" />
          <circle cx="15" cy="15" r="13" fill="none" stroke="#A92020" strokeWidth="1.6" />
          <circle cx="15" cy="15" r="4" fill="var(--kb-canvas)" stroke="#A92020" strokeWidth="1.4" />
        </svg>
      );
      break;
    case 'toy-cubo':
      art = (
        <svg viewBox="0 0 28 30" width="24" height="26">
          <path d="M14 2 L26 8.5 V 21.5 L14 28 L2 21.5 V 8.5 Z" fill="var(--area-community)" />
          <path d="M14 2 L26 8.5 L14 15 L2 8.5 Z" fill="#C89CF2" />
          <path d="M14 15 V 28 L2 21.5 V 8.5 Z" fill="#8348C4" />
        </svg>
      );
      break;
    case 'toy-uke':
      art = (
        <svg viewBox="0 0 22 40" width="20" height="36">
          <rect x="9" y="2" width="4" height="14" rx="2" fill="#8A5A2B" />
          <circle cx="11" cy="26" r="10" fill="#C98A46" />
          <circle cx="11" cy="26" r="3.4" fill="#5E3A16" />
          <path d="M10 8 V 26 M12 8 V 26" stroke="#F4DC92" strokeWidth="0.8" />
        </svg>
      );
      break;
    case 'toy-plantita':
      art = (
        <svg viewBox="0 0 26 32" width="22" height="28">
          <path d="M13 16 C 13 8 18 4 22 3 C 22 10 18 14 13 16 Z" fill="#2A9D5C" />
          <path d="M13 17 C 13 11 9 8 5 7 C 5 13 9 16 13 17 Z" fill="#37B26D" />
          <path d="M7 18 H 19 L 17.4 29 H 8.6 Z" fill="var(--kb-streak)" />
          <path d="M7 18 H 19 L 18.6 21 H 7.4 Z" fill="#C24E1F" />
        </svg>
      );
      break;
    default: return null;
  }
  return <span className={`kbb-toy ${id}`} aria-hidden="true">{art}</span>;
}

// ─────────────────────────────────────────────────────────────
// KiboAccessory — el accesorio equipado, dibujado sobre el cuerpo.
// Coordenadas en el mismo lienzo nativo (140×150); hereda las
// transformaciones del cuerpo porque vive dentro de .kbb-float.
// ─────────────────────────────────────────────────────────────
// Geometría MEDIDA de la cara actual (viewBox 140×150): ojos de 43×44 con
// centros en (39.5, 65.7) y (104.4, 65.7). El arte venía de la cara anterior
// a E-01 (ojos de 37 en cx 52/88) — por eso los cosméticos no cuadraban.
const KB_EYE_L = 39.5, KB_EYE_R = 104.4, KB_EYE_CY = 65.7, KB_EYE_RX = 21.5;
const KB_HEAD_L = 26, KB_HEAD_R = 114, KB_HEAD_MID = 70;

function KiboAccessory({ id }) {
  let art = null;
  switch (id) {
    case 'ac-lentes':
      art = (
        <g>
          <circle cx={KB_EYE_L} cy={KB_EYE_CY} r={KB_EYE_RX + 3} fill="rgba(255,255,255,0.14)" stroke="var(--kb-text)" strokeWidth="3.4" />
          <circle cx={KB_EYE_R} cy={KB_EYE_CY} r={KB_EYE_RX + 3} fill="rgba(255,255,255,0.14)" stroke="var(--kb-text)" strokeWidth="3.4" />
          <path d={`M${KB_EYE_L + KB_EYE_RX + 3} ${KB_EYE_CY} H ${KB_EYE_R - KB_EYE_RX - 3}`} stroke="var(--kb-text)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
          <path d={`M${KB_EYE_L - KB_EYE_RX - 3} ${KB_EYE_CY} H 12`} stroke="var(--kb-text)" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d={`M${KB_EYE_R + KB_EYE_RX + 3} ${KB_EYE_CY} H 128`} stroke="var(--kb-text)" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      );
      break;
    case 'ac-mono':
      art = (
        <g transform="translate(70,16) rotate(-8) scale(1.15)">
          <path d="M0 0 C -14 -10 -22 2 -8 6 C -22 10 -14 22 0 12 Z" fill="var(--kb-hp)" />
          <path d="M0 0 C 14 -10 22 2 8 6 C 22 10 14 22 0 12 Z" fill="var(--kb-hp)" />
          <circle cx="0" cy="6" r="4.5" fill="var(--kb-hp-ink)" />
        </g>
      );
      break;
    case 'ac-gorra':
      art = (
        <g transform="translate(0,-6)">
          <path d={`M${KB_HEAD_L} 34 A 34 26 0 0 1 ${KB_HEAD_R} 34 L ${KB_HEAD_R} 43 A 34 16 0 0 1 ${KB_HEAD_L} 43 Z`} fill="var(--kb-primary-ink)" />
          <path d={`M${KB_HEAD_R - 6} 36 Q 136 34 140 45 Q 118 50 ${KB_HEAD_R - 8} 45 Z`} fill="var(--kb-primary-ink)" opacity="0.92" />
          <circle cx={KB_HEAD_MID} cy="20" r="4.5" fill="var(--kb-coin)" />
        </g>
      );
      break;
    case 'ac-mago':
      art = (
        <g transform="translate(0,-10)">
          <path d={`M${KB_HEAD_MID} -16 L ${KB_HEAD_MID + 28} 44 Q ${KB_HEAD_MID} 53 ${KB_HEAD_MID - 28} 44 Z`} fill="#6D28D9" />
          <path d={`M${KB_HEAD_L - 2} 44 Q ${KB_HEAD_MID} 58 ${KB_HEAD_R + 2} 44 Q ${KB_HEAD_MID} 66 ${KB_HEAD_L - 2} 44 Z`} fill="#5B21B6" />
          <path d={`M${KB_HEAD_MID} 4 l 2.6 5.4 5.8 .8 -4.2 4.1 1 5.8 -5.2 -2.8 -5.2 2.8 1 -5.8 -4.2 -4.1 5.8 -.8 Z`} fill="var(--kb-coin)" />
          <circle cx={KB_HEAD_MID - 12} cy="30" r="2.2" fill="var(--kb-coin-soft)" />
          <circle cx={KB_HEAD_MID + 12} cy="22" r="1.8" fill="var(--kb-coin-soft)" />
        </g>
      );
      break;
    case 'ac-corona':
      art = (
        <g transform="translate(0,-8)">
          <path d={`M${KB_HEAD_L + 4} 42 L ${KB_HEAD_L + 4} 18 L ${KB_HEAD_MID - 14} 31 L ${KB_HEAD_MID} 10 L ${KB_HEAD_MID + 14} 31 L ${KB_HEAD_R - 4} 18 L ${KB_HEAD_R - 4} 42 Q ${KB_HEAD_MID} 52 ${KB_HEAD_L + 4} 42 Z`}
                fill="var(--kb-coin)" stroke="var(--kb-coin-ink)" strokeWidth="2.4" strokeLinejoin="round" />
          <circle cx={KB_HEAD_MID - 16} cy="38" r="2.8" fill="var(--kb-hp)" />
          <circle cx={KB_HEAD_MID} cy="41" r="2.8" fill="var(--kb-gem)" />
          <circle cx={KB_HEAD_MID + 16} cy="38" r="2.8" fill="var(--kb-good)" />
        </g>
      );
      break;
    default: return null;
  }
  return (
    <span className="kbb-acc" aria-hidden="true">
      <svg viewBox="4 0 136 132" preserveAspectRatio="none" width="100%" height="100%">{art}</svg>
    </span>
  );
}

// Mini KIBO dentro de la losa de "Léeme"
function KiboMini() {
  return (
    <span className="kbb-mini" aria-hidden="true">
      <span className="m-eyes"><span className="m-eye" /><span className="m-eye" /></span>
      <svg className="m-mouth" viewBox="-11 -6 22 15"><path d="M -6 -0.4 Q 0 5 6 -0.4" /></svg>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// KiboWheel — rueda radial estilo GTA-V. Arco hacia arriba-derecha
// porque KIBO vive abajo a la izquierda del lienzo.
// ─────────────────────────────────────────────────────────────
function KiboWheel({ open, items, radius = 190, from = -128, to = -8, onPick }) {
  const n = Math.max(1, items.length);
  const step = n > 1 ? (to - from) / (n - 1) : 0;
  return (
    <div className={`kbb-wheel ${open ? 'open' : ''}`}>
      {items.map((it, i) => {
        const ang = (from + i * step) * Math.PI / 180;
        return (
          <button
            key={it.id} type="button" className="kbb-witem"
            style={{ '--tx': `${Math.cos(ang) * radius}px`, '--ty': `${Math.sin(ang) * radius}px`, transitionDelay: open ? `${i * 0.035}s` : '0s' }}
            title={it.desc || it.label}
            onClick={(e) => { e.stopPropagation(); onPick(it); }}>
            <KIcon name={it.icon} size={18} />
            <span className="wl">{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// KiboFab — KIBO como acción rápida: rueda + travesuras + "Léeme".
// ─────────────────────────────────────────────────────────────
function KiboFab({ items = [], onPick, size = 72 }) {
  const [open, setOpen] = React.useState(false);
  const [chat, setChat] = React.useState(false);
  // El ánimo NO es decorativo: sale de la vida del personaje.
  const vitals = (typeof useVitals === 'function') ? useVitals() : { hp: 82, mood: 'feliz' };
  const [react, clearReact] = (typeof useKiboReaction === 'function') ? useKiboReaction() : [null, () => {}];
  const [prop, setProp] = React.useState(null);
  // La pista solo se muestra al usuario nuevo: se apaga en cuanto toca a KIBO.
  const [hint, setHint] = React.useState(() => {
    try { return localStorage.getItem('kibo:fab-hint-seen') !== '1'; } catch (_) { return false; }
  });
  function dismissHint() {
    if (!hint) return;
    setHint(false);
    try { localStorage.setItem('kibo:fab-hint-seen', '1'); } catch (_) {}
  }
  // Si el usuario nuevo no lo toca, la pista se retira sola a los 6 s.
  React.useEffect(() => {
    if (!hint) return;
    const t = setTimeout(dismissHint, 6000);
    return () => clearTimeout(t);
  }, [hint]);
  // mood === null significa «el que dicta tu vida»; una reacción lo pisa un rato.
  const [mood, setMood] = React.useState(null);
  const [gesture, setGesture] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  // De dónde sale KIBO cuando se abre la rueda: la distancia de su esquina al
  // centro de la pantalla, medida al abrir (no supuesta), para que el viaje
  // termine exactamente en el cubo con cualquier ventana.
  const trigRef = React.useRef(null);
  const [origin, setOrigin] = React.useState(null);
  const HUB = 96;
  function openWheel() {
    const el = trigRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setOrigin({
        dx: Math.round(r.left + r.width / 2 - window.innerWidth / 2),
        dy: Math.round(r.top + r.height / 2 - window.innerHeight / 2),
        scale: +(size / HUB).toFixed(3),
      });
    }
    setOpen(true);
  }

  // Dos cosas distintas que compartían un solo aviso: el RECIBO de lo que
  // registraste (con deshacer) y el COMENTARIO de KIBO. El comentario llega
  // medio segundo después y borraba el recibo — de ahí que el registro
  // «desapareciera». Ahora el recibo manda: el comentario se le suma como
  // segunda línea en vez de reemplazarlo.
  const receipt = React.useRef(0);
  const [phase, setPhase] = React.useState(0);
  function flash(msg, undo, extra) {
    if (!msg) { setToast(null); return; }
    receipt.current = Date.now();
    const t = { msg, undo, ...(extra || {}) };
    setToast(t);
    setPhase(1);
    clearTimeout(flash._t);
    const life = t.kind === 'logro' ? 6400 : undo ? 5600 : t.gain ? 3600 : 1800;
    flash._t = setTimeout(() => setToast(null), life);
  }
  function kiboSay(line) {
    if (Date.now() - receipt.current < 5600) { setToast(t => (t ? { ...t, note: line } : { msg: line })); return; }
    setToast({ msg: line });
    clearTimeout(flash._t);
    flash._t = setTimeout(() => setToast(null), 1800);
  }
  function fire(g, m) {
    if (m) setMood(m);
    setGesture((g || 'random') + '#' + Date.now());
    setTimeout(() => setGesture(null), 80);
  }

  // Un logro no es un registro más: pide su propio aviso, con medalla y
  // destello. Cualquier módulo lo dispara sin conocer al FAB.
  React.useEffect(() => {
    const h = (e) => {
      const d = (e && e.detail) || {};
      if (!d.name) return;
      flash(d.name, null, { kind: 'logro', gain: d.gain || { xp: 100 } });
      fire('clap', 'celebra');
    };
    window.addEventListener('kibo:logro', h);
    return () => window.removeEventListener('kibo:logro', h);
  }, []);

  // Cada acción del sistema: KIBO gesticula, saca su objeto y lo dice.
  React.useEffect(() => {
    if (!react) return;
    if (react.gesture) fire(react.gesture, react.mood || null);
    else if (react.mood) setMood(react.mood);
    setProp(react.prop || null);
    if (react.say) kiboSay(react.say);
    const t = setTimeout(() => { setProp(null); setMood(null); clearReact(); }, 3200);
    return () => clearTimeout(t);
  }, [react && react.id]);

  React.useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!e.target || !e.target.closest || !e.target.closest('.kbb-fab')) setOpen(false); };
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [open]);

  return (
    <div
      className={`kbb-fab ${open ? 'open' : ''}`}
      data-comment-anchor="fab-quick-action"
      onClick={(e) => e.stopPropagation()}>
      <div className="kbb-fab-trigger" ref={trigRef}>
        <KiboBlob
          size={size}
          mood={mood || vitals.mood}
          idle={!open && !chat}
          gesture={gesture}
          prop={prop}
          title={`KIBO · acción rápida · vida ${vitals.hp}`}
          onClick={() => { dismissHint(); open ? setOpen(false) : openWheel(); }} />
        {hint && <span className="kbb-fab-hint">Toca a KIBO</span>}
      </div>
      {typeof KiboQuickWheel === 'function' && (
        <KiboQuickWheel
          open={open}
          origin={origin}
          kiboSize={HUB}
          onClose={() => setOpen(false)}
          onToast={flash}
          onDemand={() => { if (!open) openWheel(); }}
          onChat={() => setChat(true)} />
      )}
      {chat && typeof KiboChat === 'function' && (
        <KiboChat onClose={() => setChat(false)} onToast={flash} />
      )}
      {toast && (
        <div className={`kbb-toast show ${toast.kind === 'logro' ? 'logro' : ''} ${phase ? 'gain' : ''}`}>
          {toast.kind === 'logro' && (
            <span className="kbb-toast-badge" aria-hidden="true"><KIcon name="trophy" size={20} /></span>
          )}
          <span className="kbb-toast-text">
            {toast.kind === 'logro' && <b className="kbb-toast-kicker">Logro desbloqueado</b>}
            {toast.msg}
            {toast.gain && (
              <span className="kbb-toast-gain">
                {toast.gain.xp ? <i style={{ '--c': 'var(--kb-xp)' }}>+{toast.gain.xp} XP</i> : null}
                {toast.gain.coins ? <i style={{ '--c': 'var(--kb-coin)' }}>+{toast.gain.coins} {curLabel('coin')}</i> : null}
                {toast.gain.gems ? <i style={{ '--c': 'var(--kb-gem)' }}>+{toast.gain.gems} {curLabel('dark')}</i> : null}
                {toast.gain.streak ? <i style={{ '--c': 'var(--kb-streak)' }}>racha {toast.gain.streak}</i> : null}
              </span>
            )}
            {toast.note && <em>{toast.note}</em>}
          </span>
          {toast.undo && (
            <button type="button" className="kbb-undo"
                    onClick={() => { toast.undo(); flash('Deshecho'); }}>Deshacer</button>
          )}
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────
// KiboSpecimen — la ficha de UN cosmético. El catálogo mostraba el KIBO
// completo en cada tarjeta, así que veinte items se veían idénticos: lo que
// cambiaba (una peca, un halo, una cadencia) medía cuatro píxeles. Aquí cada
// parte se muestra AISLADA y en grande, con el lenguaje que le toca.
// ───────────────────────────────────────────────────
// Firma de movimiento de cada personalidad: el trazo ES su ritmo (plano y
// largo = sereno; zigzag apretado = juguetón), y una gota de gel lo recorre.
const PERS_SIGNATURE = {
  'pe-sereno':   { d: 'M4 17 Q 26 12 48 17 Q 70 22 92 17', dur: 7 },
  'pe-curioso':  { d: 'M4 23 L 20 23 Q 28 5 36 23 L 56 23 Q 64 7 72 23 L 92 23', dur: 5 },
  'pe-jugueton': { d: 'M4 27 L 13 8 L 22 27 L 31 8 L 40 27 L 49 8 L 58 27 L 67 8 L 76 27 L 85 10 L 92 22', dur: 2.4 },
  'pe-teatral':  { d: 'M4 29 C 18 -8 32 32 48 17 C 64 2 76 34 92 5', dur: 4 },
  'pe-dormilon': { d: 'M4 7 Q 26 28 48 26 Q 70 24 92 30', dur: 9 },
  'pe-coqueto':  { d: 'M4 25 Q 16 9 28 24 Q 40 37 52 19 Q 64 3 76 21 Q 85 32 92 19', dur: 3.4 },
};

function KiboSpecimen({ part, item }) {
  if (!item) return null;
  if (part === 'skin') {
    // La ficha monta las MISMAS capas vivas que el cuerpo: si la piel es una
    // galaxia, en el catálogo se ve la galaxia, no un degradado morado.
    const grad = item.base ? { backgroundImage: item.body } : null;
    return (
      <span className={`kbs kbs-skin ${item.animated ? 'anim' : ''}`} data-skin={item.id} aria-hidden="true">
        <span className="kbs-gel" style={{ background: item.base || item.body, ...(grad || {}) }}>
          {item.animated && <React.Fragment><span className="kbb-skinfx a" /><span className="kbb-skinfx b" /><span className="kbb-skinfx c" /></React.Fragment>}
        </span>
      </span>
    );
  }
  if (part === 'mark') {
    if (item.id === 'mk-none') return <span className="kbs kbs-mark none" aria-hidden="true"><span className="kbs-gel" /></span>;
    return (
      <span className="kbs kbs-mark" aria-hidden="true">
        <span className="kbs-gel" />
        <KiboTattoo id={item.id} specimen />
      </span>
    );
  }
  if (part === 'aura') {
    if (item.id === 'au-none') return <span className="kbs kbs-aura none" aria-hidden="true"><span className="kbs-nada" /></span>;
    return (
      <span className="kbs kbs-aura" style={{ '--aura': item.tint }} aria-hidden="true">
        <span className={`kbb-aura ${item.id}`}>
          {AURA_PARTICLES.includes(item.id) && <React.Fragment><i className="star s1" /><i className="star s2" /><i className="star s3" /></React.Fragment>}
        </span>
      </span>
    );
  }
  if (part === 'pers') {
    const sig = PERS_SIGNATURE[item.id] || PERS_SIGNATURE['pe-sereno'];
    const pid = 'sig-' + item.id;
    return (
      <span className="kbs kbs-pers" aria-hidden="true">
        <svg viewBox="0 0 96 34" preserveAspectRatio="xMidYMid meet">
          <path id={pid} d={sig.d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.32" />
          <circle r="3.6" fill="var(--kb-primary)">
            <animateMotion dur={sig.dur + 's'} repeatCount="indefinite">
              <mpath href={'#' + pid} xlinkHref={'#' + pid} />
            </animateMotion>
          </circle>
        </svg>
      </span>
    );
  }
  return null;
}

// KiboPet — el compañero de la carta de presentación. Es TU KIBO (lee el
// guardarropa como cualquier otro) repitiendo el gesto comprado; no recibe
// `mood` a propósito, porque el ánimo recolorea el gel y taparía la piel.
function KiboPet({ gesture, size = 58, every = 5200 }) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    if (!gesture) return;
    // Fase propia: sin ella, seis compañeros en una rejilla gesticulan al
    // unísono y el catálogo vuelve a verse como seis copias del mismo blob.
    let id;
    const start = setTimeout(() => {
      setTick(t => t + 1);
      id = setInterval(() => setTick(t => t + 1), every);
    }, Math.random() * every);
    return () => { clearTimeout(start); clearInterval(id); };
  }, [gesture, every]);
  return <KiboBlob size={size} ground={false} gesture={gesture ? gesture + '#' + tick : null} />;
}

Object.assign(window, { MARK_SLOTS, KiboBlob, KiboMini, KiboWheel, KiboFab, KiboAccessory, KiboToy, KiboTattoo, KiboSpecimen, KiboPet, KIBO_MOODS, KIBO_TRICK_LIST, KIBO_TOY_TRICKS, kiboTricksFor, kiboMood });
