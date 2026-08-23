// vitrina.jsx — Cosméticos de la "carta de presentación" (vitrina) del usuario.
//   • Fondos / portadas comprables (sólidos, degradados, espacio animado, colabs)
//   • Marcos que rodean la foto del usuario
//   • Casillas extra para presumir más logros
// Estado equipado en localStorage + evento 'kibo:card-change' (mismo patrón que
// los emblemas de prestige-system). Lo leen: la Vitrina (character-screen) y el
// HUD del header (solo la zona de identidad).

// ── Catálogo de fondos / portadas ──────────────────────────────
const CARD_BACKGROUNDS = [
  { id: 'vt-bg-slate',  name: 'Pizarra',    desc: 'Sobrio y neutro — incluido.',        owned: true, cost: 0,   currency: 'coin', css: 'linear-gradient(155deg, #2B313D 0%, #181C25 100%)' },
  { id: 'vt-bg-aurora', name: 'Aurora',     desc: 'Verde Kibo en degradado.',           cost: 450,  currency: 'coin', css: 'linear-gradient(135deg, #155C40 0%, #2E8B63 55%, #6FD3A2 100%)' },
  { id: 'vt-bg-dusk',   name: 'Crepúsculo', desc: 'Cálido al atardecer.',               cost: 550,  currency: 'coin', css: 'linear-gradient(135deg, #5A2150 0%, #B23A4A 55%, #E0731B 100%)' },
  { id: 'vt-bg-nebula', name: 'Nebulosa',   desc: 'Púrpura cósmico.',                   cost: 35,   currency: 'gem',  css: 'linear-gradient(135deg, #221C66 0%, #6D3BD0 55%, #B06BF5 100%)' },
  { id: 'vt-bg-cosmos', name: 'Cosmos',     desc: 'Espacio profundo con estrellas vivas.', cost: 80, currency: 'gem', anim: 'stars', css: 'radial-gradient(120% 110% at 18% 0%, #2A2057 0%, #140F33 48%, #08061A 100%)' },
  { id: 'vt-bg-collab', name: 'Colab de marca', desc: 'Portada reservada para colaboraciones.', cost: 0, currency: 'coin', collab: true, locked: true, css: 'placeholder' },
];

// ── Catálogo de marcos (rodean la foto) ────────────────────────
const CARD_FRAMES = [
  { id: 'vt-fr-none',   name: 'Sin marco',        desc: 'Foto limpia — incluido.', owned: true, cost: 0,  currency: 'coin', ring: 'none' },
  { id: 'vt-fr-gold',   name: 'Marco oro',        desc: 'Aro dorado clásico.',     cost: 300, currency: 'coin', ring: '0 0 0 3px #F4C24B, 0 0 0 6px rgba(244,194,75,0.28)' },
  { id: 'vt-fr-aurora', name: 'Marco aurora',     desc: 'Aro verde Kibo.',         cost: 300, currency: 'coin', ring: '0 0 0 3px #4CAF82, 0 0 0 6px rgba(76,175,130,0.28)' },
  { id: 'vt-fr-neon',   name: 'Marco neón',       desc: 'Aro cian luminoso.',      cost: 28,  currency: 'gem',  ring: '0 0 0 3px #22D3EE, 0 0 12px rgba(34,211,238,0.6)' },
  { id: 'vt-fr-obsid',  name: 'Marco obsidiana',  desc: 'Aro oscuro premium.',     cost: 24,  currency: 'gem',  ring: '0 0 0 3px #2A2438, 0 0 0 6px rgba(138,130,168,0.4)' },
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
  const free = [...CARD_BACKGROUNDS, ...CARD_FRAMES].filter(x => x.owned || x.cost === 0).map(x => x.id);
  return free.filter(id => id !== 'vt-bg-collab'); // la colab queda bloqueada
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
  return { bg: getCardBg(), frame: getCardFrame(), slots: getCardSlots() };
}

// Estilo del aro de la foto según el marco equipado.
function frameRingStyle(frameId) {
  const fr = cardFrameById(frameId);
  if (!fr || fr.ring === 'none') return {};
  return { boxShadow: fr.ring, borderRadius: '999px' };
}

// Capa de fondo de la vitrina (degradado / espacio animado / placeholder).
function CardBackdrop({ bgId, className = '' }) {
  const bg = cardBgById(bgId);
  if (bg.css === 'placeholder') {
    return (
      <div className={`vt-backdrop placeholder ${className}`} aria-hidden="true">
        <span className="vt-ph-label">PORTADA COLAB</span>
      </div>
    );
  }
  return (
    <div className={`vt-backdrop ${bg.anim === 'stars' ? 'stars' : ''} ${className}`} style={{ background: bg.css }} aria-hidden="true">
      {bg.anim === 'stars' && <span className="vt-stars" />}
    </div>
  );
}

Object.assign(window, {
  CARD_BACKGROUNDS, CARD_FRAMES, SLOT_PACKS, VITRINA_BASE_SLOTS, VITRINA_MAX_SLOTS,
  getCardBg, getCardFrame, getCardSlots, setCardBg, setCardFrame, setCardSlots, addCardSlots,
  cardBgById, cardFrameById, useCardCosmetics, frameRingStyle, CardBackdrop,
  getCardOwned, ownsCard, buyCard,
});
