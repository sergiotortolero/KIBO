// vitrina.jsx — Cosméticos de la "carta de presentación" (vitrina) del usuario.
//   • Fondos / portadas comprables (sólidos, degradados, espacio animado, colabs)
//   • Marcos que rodean la foto del usuario
//   • Casillas extra para presumir más logros
// Estado equipado en localStorage + evento 'kibo:card-change' (mismo patrón que
// los emblemas de prestige-system). Lo leen: la Vitrina (character-screen) y el
// HUD del header (solo la zona de identidad).

// ── Catálogo de fondos / portadas ──────────────────────────────
// Cada portada nombra un elemento y ese elemento es el que se mueve: la
// aurora ondea, el sol baja, la manada cruza. `fx` es la única fuente de esa
// animación (la dibuja el CSS de .vt-backdrop), así que la tienda y la carta
// muestran exactamente lo mismo — no hay una versión "de catálogo".
const CARD_BACKGROUNDS = [
  { id: 'vt-bg-slate',  name: 'Pizarra',    desc: 'Sobrio y neutro — incluido.',        owned: true, cost: 0,   currency: 'coin', css: 'linear-gradient(155deg, #2B313D 0%, #181C25 100%)' },
  { id: 'vt-bg-solid',  name: 'Tu color',   desc: 'Un sólido, el HEX que tú quieras. Se cambia cuando quieras.', cost: 220, currency: 'coin', solid: true, css: 'var(--vt-solid, #2B313D)' },
  { id: 'vt-bg-image',  name: 'Tu imagen',  desc: 'Sube la tuya — 1200×360 px es la medida que llena la carta sin recortarse.', cost: 90, currency: 'gem', image: true, css: 'linear-gradient(155deg, #2B313D 0%, #181C25 100%)' },
  { id: 'vt-bg-aurora', name: 'Aurora',     desc: 'Cortinas verdes que ondean sobre el horizonte.', cost: 450,  currency: 'coin', fx: 'aurora', css: 'linear-gradient(180deg, #05221C 0%, #0B3A2C 58%, #124A38 100%)' },
  { id: 'vt-bg-dusk',   name: 'Crepúsculo', desc: 'El sol bajando, minuto a minuto.',   cost: 550,  currency: 'coin', fx: 'sun', css: 'linear-gradient(180deg, #3A1440 0%, #A03A50 60%, #E0731B 100%)' },
  { id: 'vt-bg-nebula', name: 'Nebulosa',   desc: 'Polvo púrpura que gira despacio.',   cost: 35,   currency: 'gem',  fx: 'nebula', css: 'linear-gradient(135deg, #1A1550 0%, #3E2489 55%, #6B3FC0 100%)' },
  { id: 'vt-bg-cosmos', name: 'Cosmos',     desc: 'Espacio profundo con estrellas vivas.', cost: 80, currency: 'gem', fx: 'stars', css: 'radial-gradient(120% 110% at 18% 0%, #2A2057 0%, #140F33 48%, #08061A 100%)' },
  { id: 'vt-bg-oceano', name: 'Océano',     desc: 'Olas que suben y bajan de verdad.',  cost: 600, currency: 'coin', fx: 'waves', css: 'linear-gradient(180deg, #062639 0%, #0B3954 55%, #14567A 100%)' },
  { id: 'vt-bg-bosque', name: 'Bosque',     desc: 'Niebla cruzando entre los árboles.', cost: 600, currency: 'coin', fx: 'fog', css: 'linear-gradient(180deg, #0E241F 0%, #1D4438 60%, #2E5E4E 100%)' },
  { id: 'vt-bg-circuit',name: 'Circuito',   desc: 'Pulsos de luz recorriendo la placa.', cost: 55,  currency: 'gem',  fx: 'circuit', css: 'linear-gradient(135deg, #0A1018 0%, #0E1C2C 60%, #093C40 100%)' },
  { id: 'vt-bg-atardec',name: 'Dorado',     desc: 'Rayos de luz girando lento.',        cost: 45,  currency: 'gem',  fx: 'rays', css: 'linear-gradient(140deg, #5E2A0C 0%, #B36A18 55%, #E5B23F 100%)' },
  { id: 'vt-bg-ambar',  name: 'Ámbar',      desc: 'Un insecto fósil atrapado en resina — y la luz que lo cruza.', cost: 60, currency: 'gem', fx: 'amber', css: 'linear-gradient(160deg, #6B3A05 0%, #B4740F 45%, #E0A32B 100%)' },
  { id: 'vt-bg-jurasico',name: 'Jurásico',  desc: 'Esqueleto de saurio abierto en la placa de roca.', cost: 700, currency: 'coin', fx: 'fossil-dino', css: 'linear-gradient(165deg, #6B5B48 0%, #8A7660 46%, #5A4B3A 100%)' },
  { id: 'vt-bg-manada', name: 'Huellas',    desc: 'Pisadas fosilizadas — pasaron por aquí hace 100 millones de años.', cost: 650, currency: 'coin', fx: 'fossil-tracks', css: 'linear-gradient(165deg, #7C6A55 0%, #9C8A73 48%, #62523F 100%)' },
  { id: 'vt-bg-arrecife',name: 'Amonita',   desc: 'Amonita y trilobites, tal como quedaron en la piedra.', cost: 70, currency: 'gem', fx: 'fossil-shell', css: 'linear-gradient(165deg, #4E5A5E 0%, #6E7C7E 48%, #3C4649 100%)' },
];

// Atajos del sólido personalizable (61). El usuario puede escribir cualquier
// HEX; estos son solo puntos de partida que sabemos que se leen bien bajo el
// texto blanco de la carta.
const CARD_SOLIDS = ['#2B313D', '#0F3B39', '#123A5C', '#3C1F52', '#5A2130', '#1F3A21', '#4A3410', '#111318'];
const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
function normalizeHex(v) {
  let s = String(v || '').trim();
  if (s && s[0] !== '#') s = '#' + s;
  return HEX_RE.test(s) ? s.toLowerCase() : null;
}

// ── Catálogo de marcos (rodean la foto) ────────────────────────
const CARD_FRAMES = [
  { id: 'vt-fr-none',   name: 'Sin marco',        desc: 'Foto limpia — incluido.', owned: true, cost: 0,  currency: 'coin', ring: 'none' },
  { id: 'vt-fr-gold',   name: 'Marco oro',        desc: 'Aro dorado clásico.',     cost: 300, currency: 'coin', ring: '0 0 0 3px #F4C24B, 0 0 0 6px rgba(244,194,75,0.28)' },
  { id: 'vt-fr-aurora', name: 'Marco aurora',     desc: 'Aro verde Kibo.',         cost: 300, currency: 'coin', ring: '0 0 0 3px #1CA4A0, 0 0 0 6px rgba(76,175,130,0.28)' },
  { id: 'vt-fr-neon',   name: 'Marco neón',       desc: 'Aro cian luminoso.',      cost: 28,  currency: 'gem',  ring: '0 0 0 3px #22D3EE, 0 0 12px rgba(34,211,238,0.6)' },
  { id: 'vt-fr-obsid',  name: 'Marco obsidiana',  desc: 'Aro oscuro premium.',     cost: 24,  currency: 'gem',  ring: '0 0 0 3px #2A2438, 0 0 0 6px rgba(138,130,168,0.4)' },
  { id: 'vt-fr-esmer',  name: 'Marco esmeralda',  desc: 'Verde joya con destello.',cost: 34,  currency: 'gem',  ring: '0 0 0 3px var(--kb-good), 0 0 10px rgba(16,185,129,0.55)' },
  { id: 'vt-fr-rosa',   name: 'Marco rosa',       desc: 'Aro cálido y amable.',    cost: 320, currency: 'coin', ring: '0 0 0 3px #FF9FB1, 0 0 0 6px rgba(255,159,177,0.3)' },
  { id: 'vt-fr-fuego',  name: 'Marco de racha',   desc: 'Naranja que arde contigo.', cost: 40, currency: 'gem', ring: '0 0 0 3px #FF7A45, 0 0 12px rgba(255,122,69,0.6)' },
];

// ── Títulos honoríficos (bajo tu nombre, tú eliges cuál portar) ──
const CARD_TITLES = [
  { id: 'vt-t-none',    name: 'Sin título',          desc: 'Solo tu rango — incluido.', owned: true, cost: 0, currency: 'coin', text: null },
  { id: 'vt-t-madruga', name: 'Madrugador',           desc: 'Para quien gana las mañanas.',        cost: 350, currency: 'coin', text: 'Madrugador', c: 'var(--kb-coin)' },
  { id: 'vt-t-inque',   name: 'Inquebrantable',       desc: 'Rachas que no se rompen.',            cost: 500, currency: 'coin', text: 'Inquebrantable', c: 'var(--kb-streak)' },
  { id: 'vt-t-cazador', name: 'Cazador de jefes',     desc: 'Retos difíciles, uno tras otro.',     cost: 45,  currency: 'gem',  text: 'Cazador de jefes', c: 'var(--kb-hp)' },
  { id: 'vt-t-sabio',   name: 'Bibliotecario',        desc: 'Vive entre libros y notas.',          cost: 45,  currency: 'gem',  text: 'Bibliotecario', c: 'var(--area-wisdom)' },
  { id: 'vt-t-leyenda', name: 'Susurra-KIBOs',        desc: 'El título más raro. KIBO confía en ti.', cost: 120, currency: 'gem', text: 'Susurra-KIBOs', c: 'var(--kb-primary)' },
  { id: 'vt-t-noct',    name: 'Nocturno',             desc: 'Rinde cuando todos duermen.',         cost: 350, currency: 'coin', text: 'Nocturno', c: 'var(--kb-gem)' },
  { id: 'vt-t-marato',  name: 'Maratonista',          desc: 'Proyectos largos, cero drama.',       cost: 60,  currency: 'gem',  text: 'Maratonista', c: 'var(--area-wisdom)' },
  { id: 'vt-t-alma',    name: 'Alma del círculo',     desc: 'Quien más anima a sus amigos.',       cost: 60,  currency: 'gem',  text: 'Alma del círculo', c: 'var(--area-community)' },
  { id: 'vt-t-custom',  name: 'Título a tu medida',   desc: 'Lo escribes tú, hasta 22 letras. El más caro del catálogo — y el único que nadie más porta.', cost: 180, currency: 'gem', custom: true, text: 'Tu título', c: 'var(--kb-primary)' },
];

// Colores que puede tomar el título a la medida (64).
const TITLE_COLORS = ['var(--kb-primary)', 'var(--kb-coin)', 'var(--kb-streak)', 'var(--kb-hp)', 'var(--area-wisdom)', 'var(--area-community)'];

// ── Compañero: TU KIBO asomado en la carta ──────────────────────
// Lo que se compra es el GESTO, no otro KIBO: el compañero lleva tu piel, tus
// marcas y tu aura. Por eso ningún item trae `mood` — el ánimo recolorea el
// gel y borraría la piel que el usuario pagó.
const CARD_PETS = [
  { id: 'vt-pet-none',  name: 'Sin compañero', desc: 'La carta limpia — incluido.', owned: true, cost: 0, currency: 'coin' },
  { id: 'vt-pet-peek',  name: 'Saludando',     desc: 'Se asoma por la esquina y te saluda con la manopié.', cost: 60, currency: 'gem', gesture: 'wave' },
  { id: 'vt-pet-chill', name: 'Echado',        desc: 'Recostado sobre tu barra de nivel, solo respira.',    cost: 60, currency: 'gem', gesture: null },
  { id: 'vt-pet-travi', name: 'Haciendo caras', desc: 'Muecas desde la esquina, cada rato una distinta.',    cost: 75, currency: 'gem', gesture: 'mueca' },
  { id: 'vt-pet-dormi', name: 'Bostezando',    desc: 'Se desvela contigo y lo presume.',                     cost: 75, currency: 'gem', gesture: 'bostezo' },
  { id: 'vt-pet-guino', name: 'Guiñando',      desc: 'Un guiño de complicidad a quien vea tu carta.',        cost: 80, currency: 'gem', gesture: 'guino' },
  { id: 'vt-pet-beso',  name: 'Mandando besos', desc: 'Coqueto de tiempo completo.',                         cost: 80, currency: 'gem', gesture: 'beso' },
];

// ── Casillas extra de vitrina ──────────────────────────────────
const VITRINA_BASE_SLOTS = 3;
const VITRINA_MAX_SLOTS = 6;
const SLOT_PACKS = [
  { id: 'vt-slot-1', name: 'Casilla extra', desc: 'Una vitrina más para presumir.', cost: 250, currency: 'coin', slots: 1 },
  { id: 'vt-slot-2', name: 'Dúo de casillas', desc: 'Dos vitrinas extra de golpe.',  cost: 28,  currency: 'gem',  slots: 2 },
];

// ── Equip store ────────────────────────────────────────────────
const CARD_BG_KEY = 'kibo:cardBg', CARD_FR_KEY = 'kibo:cardFrame', CARD_SLOT_KEY = 'kibo:cardSlots';
const CARD_TITLE_KEY = 'kibo:cardTitle', CARD_PET_KEY = 'kibo:cardPet';
const CARD_BGCOLOR_KEY = 'kibo:cardBgColor', CARD_TTEXT_KEY = 'kibo:cardTitleText', CARD_TCOLOR_KEY = 'kibo:cardTitleColor';
function getCardBgColor() { return localStorage.getItem(CARD_BGCOLOR_KEY) || CARD_SOLIDS[0]; }
function setCardBgColor(c) { try { localStorage.setItem(CARD_BGCOLOR_KEY, c); } catch (_) {} emitCardChange(); }
const CARD_BGIMG_KEY = 'kibo:cardBgImage';
function getCardBgImage() { try { return localStorage.getItem(CARD_BGIMG_KEY) || null; } catch (_) { return null; } }
function setCardBgImage(dataUrl) {
  try { dataUrl ? localStorage.setItem(CARD_BGIMG_KEY, dataUrl) : localStorage.removeItem(CARD_BGIMG_KEY); } catch (_) {}
  emitCardChange();
}
function getCardTitleText() { return localStorage.getItem(CARD_TTEXT_KEY) || 'Tu título'; }
function setCardTitleText(t) { try { localStorage.setItem(CARD_TTEXT_KEY, String(t).slice(0, 22)); } catch (_) {} emitCardChange(); }
function getCardTitleColor() { return localStorage.getItem(CARD_TCOLOR_KEY) || TITLE_COLORS[0]; }
function setCardTitleColor(c) { try { localStorage.setItem(CARD_TCOLOR_KEY, c); } catch (_) {} emitCardChange(); }
function getCardTitle() { return localStorage.getItem(CARD_TITLE_KEY) || 'vt-t-none'; }
function getCardPet()   { return localStorage.getItem(CARD_PET_KEY) || 'vt-pet-none'; }
function setCardTitle(id) { try { localStorage.setItem(CARD_TITLE_KEY, id); } catch (_) {} emitCardChange(); }
function setCardPet(id)   { try { localStorage.setItem(CARD_PET_KEY, id); } catch (_) {} emitCardChange(); }
function cardTitleById(id) {
  const t = CARD_TITLES.find(x => x.id === id) || CARD_TITLES[0];
  return t.custom ? { ...t, text: getCardTitleText(), c: getCardTitleColor() } : t;
}
function cardPetById(id)   { return CARD_PETS.find(p => p.id === id) || CARD_PETS[0]; }
function getCardBg() { return localStorage.getItem(CARD_BG_KEY) || 'vt-bg-slate'; }
function getCardFrame() { return localStorage.getItem(CARD_FR_KEY) || 'vt-fr-none'; }
function getCardSlots() {
  const n = parseInt(localStorage.getItem(CARD_SLOT_KEY) || String(VITRINA_BASE_SLOTS), 10);
  return Math.max(VITRINA_BASE_SLOTS, Math.min(VITRINA_MAX_SLOTS, isNaN(n) ? VITRINA_BASE_SLOTS : n));
}
function emitCardChange() { try { window.dispatchEvent(new CustomEvent('kibo:card-change')); } catch (_) {} }
function setCardBg(id) { try { localStorage.setItem(CARD_BG_KEY, id); } catch (_) {} emitCardChange(); }
function setCardFrame(id) { try { localStorage.setItem(CARD_FR_KEY, id); } catch (_) {} emitCardChange(); }
function setCardSlots(n) { try { localStorage.setItem(CARD_SLOT_KEY, String(Math.max(VITRINA_BASE_SLOTS, Math.min(VITRINA_MAX_SLOTS, n)))); } catch (_) {} emitCardChange(); }
function addCardSlots(n) { setCardSlots(getCardSlots() + (n || 1)); }

function cardBgById(id) { return CARD_BACKGROUNDS.find(b => b.id === id) || CARD_BACKGROUNDS[0]; }
function cardFrameById(id) { return CARD_FRAMES.find(f => f.id === id) || CARD_FRAMES[0]; }

// ── Propiedad (qué cosméticos ha conseguido el usuario) ────────
const CARD_OWNED_KEY = 'kibo:cardOwned';
function defaultOwned() {
  return [...CARD_BACKGROUNDS, ...CARD_FRAMES, ...CARD_TITLES, ...CARD_PETS].filter(x => x.owned || x.cost === 0).map(x => x.id);
}
function getCardOwned() {
  try { const raw = JSON.parse(localStorage.getItem(CARD_OWNED_KEY) || 'null'); if (Array.isArray(raw)) return new Set([...defaultOwned(), ...raw]); } catch (_) {}
  return new Set(defaultOwned());
}
function ownsCard(id) { return getCardOwned().has(id); }
function buyCard(id) {
  const s = getCardOwned(); s.add(id);
  try { localStorage.setItem(CARD_OWNED_KEY, JSON.stringify([...s])); } catch (_) {}
  emitCardChange();
}

// Hook: re-render cuando cambia algún cosmético equipado.
function useCardCosmetics() {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => {
    const h = () => force();
    window.addEventListener('kibo:card-change', h);
    return () => window.removeEventListener('kibo:card-change', h);
  }, []);
  return { bg: getCardBg(), frame: getCardFrame(), slots: getCardSlots(), title: getCardTitle(), pet: getCardPet() };
}

// Estilo del aro de la foto según el marco equipado.
function frameRingStyle(frameId) {
  const fr = cardFrameById(frameId);
  if (!fr || fr.ring === 'none') return {};
  return { boxShadow: fr.ring, borderRadius: '999px' };
}

// Capa de fondo de la vitrina. Un solo componente para la carta y para la
// tienda: lo que previsualizas ES la portada. Las tres capas `vt-fx` son
// genéricas — cada efecto usa las que necesita desde el CSS.
function CardBackdrop({ bgId, className = '', color = null, image = undefined, scrim = true }) {
  const bg = cardBgById(bgId);
  const solid = bg.solid ? (color || getCardBgColor()) : null;
  const img = bg.image ? (image !== undefined ? image : getCardBgImage()) : null;
  const style = img
    ? { backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: '50% 50%' }
    : { background: solid || bg.css };
  return (
    <div className={`vt-backdrop ${className}`} data-fx={bg.fx || 'none'} aria-hidden="true" style={style}>
      {bg.fx ? <React.Fragment><span className="vt-fx a" /><span className="vt-fx b" /><span className="vt-fx c" /></React.Fragment> : null}
      {bg.image && !img ? <span className="vt-img-empty"><span>Sube tu imagen</span></span> : null}
      {scrim ? <span className="vt-scrim" /> : null}
    </div>
  );
}

Object.assign(window, {
  CARD_BACKGROUNDS, CARD_FRAMES, CARD_TITLES, CARD_PETS, SLOT_PACKS, VITRINA_BASE_SLOTS, VITRINA_MAX_SLOTS,
  CARD_SOLIDS, TITLE_COLORS, normalizeHex,
  getCardBgColor, setCardBgColor, getCardBgImage, setCardBgImage, getCardTitleText, setCardTitleText, getCardTitleColor, setCardTitleColor,
  getCardBg, getCardFrame, getCardSlots, setCardBg, setCardFrame, setCardSlots, addCardSlots,
  getCardTitle, getCardPet, setCardTitle, setCardPet, cardTitleById, cardPetById,
  cardBgById, cardFrameById, useCardCosmetics, frameRingStyle, CardBackdrop,
  getCardOwned, ownsCard, buyCard,
});
