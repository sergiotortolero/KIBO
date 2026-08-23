// prestigio-nombres.jsx — Las familias de prestigio.
//
// Los 16 prestigios se llamaban «Cadete Estelar → Gran Almirante → Leyenda»:
// un escalafón militar, que es una lectura muy concreta del mérito y no le
// habla a todo el mundo. El nombre pasa a ser COSMÉTICO: la lógica sigue
// siendo el número (1…16), y encima va la familia que elijas — o la que
// escribas tú. Cada familia es un paquete vendible.

const PRESTIGE_FAMILIES = [
  {
    id: 'pf-militar', name: 'Escalafón estelar', cost: 0, currency: 'gem', free: true,
    desc: 'El de siempre: una flota que asciende de cadete a leyenda.',
    names: ['Cadete Estelar', 'Piloto Orbital', 'Explorador Sideral', 'Teniente Sideral',
      'Capitán de Nave', 'Comandante de Flota', 'Comodoro Galáctico', 'Almirante',
      'Almirante de Galaxias', 'Gran Almirante', 'Señor de Constelaciones', 'Soberano del Cosmos',
      'Arquitecto de Estrellas', 'Titán Cósmico', 'Avatar Cósmico', 'Leyenda'],
  },
  {
    id: 'pf-natura', name: 'Estaciones', cost: 120, currency: 'gem',
    desc: 'Crecer como crece un bosque: de semilla a ecosistema.',
    names: ['Semilla', 'Brote', 'Retoño', 'Raíz Firme', 'Tallo', 'Rama', 'Copa', 'Floración',
      'Fruto', 'Cosecha', 'Roble', 'Arboleda', 'Bosque', 'Selva', 'Cordillera', 'Ecosistema'],
  },
  {
    id: 'pf-cosmos', name: 'Cosmos', cost: 120, currency: 'gem',
    desc: 'Sin jerarquía militar: solo materia haciéndose más grande.',
    names: ['Polvo', 'Meteoro', 'Cometa', 'Asteroide', 'Luna', 'Planeta', 'Gigante Gaseoso',
      'Estrella', 'Gigante Roja', 'Supernova', 'Púlsar', 'Nebulosa', 'Cúmulo', 'Galaxia',
      'Cúmulo Galáctico', 'Universo'],
  },
  {
    id: 'pf-oficios', name: 'Maestrías', cost: 120, currency: 'gem',
    desc: 'El camino de un taller: aprendiz, oficial, maestro.',
    names: ['Aprendiz', 'Ayudante', 'Oficial', 'Artesano', 'Artífice', 'Especialista',
      'Perito', 'Maestro', 'Maestro Mayor', 'Contramaestre', 'Decano', 'Mentor',
      'Autoridad', 'Eminencia', 'Escuela Propia', 'Legado'],
  },
  {
    id: 'pf-mito', name: 'Mitología', cost: 140, currency: 'gem',
    desc: 'De mortal a mito, sin ejércitos de por medio.',
    names: ['Peregrino', 'Buscador', 'Portador', 'Guardián', 'Vidente', 'Oráculo', 'Heraldo',
      'Héroe', 'Semidiós', 'Numen', 'Titán', 'Deidad Menor', 'Deidad', 'Panteón',
      'Primigenio', 'Mito'],
  },
  {
    id: 'pf-minimal', name: 'Minimalista', cost: 0, currency: 'gem', free: true,
    desc: 'Sin épica: el número y el material, nada más.',
    names: ['Bronce I', 'Bronce II', 'Bronce III', 'Plata I', 'Plata II', 'Plata III',
      'Oro I', 'Oro II', 'Oro III', 'Platino I', 'Platino II', 'Platino III',
      'Diamante I', 'Diamante II', 'Diamante III', 'Maestro'],
  },
  {
    id: 'pf-neutro', name: 'Neutro', cost: 90, currency: 'gem',
    desc: 'Ni rangos ni épica: vueltas al mismo camino.',
    names: ['Primera vuelta', 'Segunda vuelta', 'Tercera vuelta', 'Cuarta vuelta', 'Quinta vuelta',
      'Sexta vuelta', 'Séptima vuelta', 'Octava vuelta', 'Novena vuelta', 'Décima vuelta',
      'Undécima vuelta', 'Duodécima vuelta', 'Decimotercera', 'Decimocuarta', 'Decimoquinta',
      'Vuelta completa'],
  },
];

const PF_KEY = 'kibo:prestige-family';
const PF_OWNED_KEY = 'kibo:prestige-owned';
const PF_CUSTOM_KEY = 'kibo:prestige-custom';
// «Escribe el tuyo» es caro a propósito: renombrar los 16 es la personalización
// más visible que existe en el perfil.
const PF_CUSTOM_COST = 400;

function pfFamilies() { return PRESTIGE_FAMILIES; }
function pfById(id) { return PRESTIGE_FAMILIES.find(f => f.id === id) || PRESTIGE_FAMILIES[0]; }
function pfOwned() {
  const base = PRESTIGE_FAMILIES.filter(f => f.free).map(f => f.id);
  try { return new Set(base.concat(JSON.parse(localStorage.getItem(PF_OWNED_KEY) || '[]'))); }
  catch (_) { return new Set(base); }
}
function pfOwn(id) {
  const s = [...pfOwned()].filter(x => !pfById(x).free);
  if (!s.includes(id)) s.push(id);
  try { localStorage.setItem(PF_OWNED_KEY, JSON.stringify(s)); } catch (_) {}
  try { window.dispatchEvent(new CustomEvent('kibo:prestige-change')); } catch (_) {}
}
function pfActive() {
  try { return localStorage.getItem(PF_KEY) || 'pf-militar'; } catch (_) { return 'pf-militar'; }
}
function pfSetActive(id) {
  try { localStorage.setItem(PF_KEY, id); } catch (_) {}
  try { window.dispatchEvent(new CustomEvent('kibo:prestige-change')); } catch (_) {}
}
function pfCustom() {
  try { const v = JSON.parse(localStorage.getItem(PF_CUSTOM_KEY) || 'null'); return Array.isArray(v) ? v : null; }
  catch (_) { return null; }
}
function pfSetCustom(list) {
  try {
    if (list) localStorage.setItem(PF_CUSTOM_KEY, JSON.stringify(list));
    else localStorage.removeItem(PF_CUSTOM_KEY);
  } catch (_) {}
  try { window.dispatchEvent(new CustomEvent('kibo:prestige-change')); } catch (_) {}
}
// Los 16 nombres vigentes: los tuyos si los escribiste, si no los de la familia.
function pfNames() {
  const custom = pfCustom();
  if (custom && custom.length === 16) return custom;
  return pfById(pfActive()).names;
}
function pfName(n) { return pfNames()[Math.max(0, Math.min(15, (n | 0) - 1))]; }

function usePrestigeNames() {
  const [v, set] = React.useState(() => ({ names: pfNames(), family: pfActive(), custom: !!pfCustom() }));
  React.useEffect(() => {
    const h = () => set({ names: pfNames(), family: pfActive(), custom: !!pfCustom() });
    window.addEventListener('kibo:prestige-change', h);
    window.addEventListener('storage', h);
    return () => { window.removeEventListener('kibo:prestige-change', h); window.removeEventListener('storage', h); };
  }, []);
  return v;
}

// ── Divisas ──────────────────────────────────────────────────────
// La materia oscura y las monedas son las dos recompensas que más se miran:
// su nombre, su glifo y su color se personalizan; lo que valen, no.
const CURRENCY_SKINS = {
  dark: [
    { id: 'cs-obsidiana', name: 'Materia oscura', glyph: 'orb', color: 'var(--kb-void-1)', cost: 0, free: true, desc: 'La de fábrica: obsidiana con contorno orbitando.' },
    { id: 'cs-magia',     name: 'Magia',          glyph: 'spark', color: 'var(--area-community)', cost: 60, desc: 'Chispa violeta.' },
    { id: 'cs-esencia',   name: 'Esencia',        glyph: 'drop', color: 'var(--kb-primary)', cost: 60, desc: 'Gota de gel, como KIBO.' },
    { id: 'cs-nucleo',    name: 'Núcleo',         glyph: 'core', color: 'var(--kb-streak)', cost: 90, desc: 'Brasa con anillo caliente.' },
  ],
  coin: [
    { id: 'cs-kibo',   name: 'Monedas Kibo', glyph: 'coin', color: 'var(--kb-coin)', cost: 0, free: true, desc: 'La K acuñada de siempre.' },
    { id: 'cs-fichas', name: 'Fichas',       glyph: 'chip', color: 'var(--kb-gem)', cost: 40, desc: 'Ficha plana de dos tonos.' },
    { id: 'cs-hojas',  name: 'Hojas',        glyph: 'leaf', color: 'var(--kb-good)', cost: 40, desc: 'Para quien no quiere dinero en su vida.' },
  ],
};
const CS_KEY = 'kibo:currency-skin', CS_OWNED_KEY = 'kibo:currency-owned', CS_NAME_KEY = 'kibo:currency-names';

function csGet(kind) {
  try {
    const v = JSON.parse(localStorage.getItem(CS_KEY) || '{}');
    return CURRENCY_SKINS[kind].find(s => s.id === v[kind]) || CURRENCY_SKINS[kind][0];
  } catch (_) { return CURRENCY_SKINS[kind][0]; }
}
function csSet(kind, id) {
  let v = {};
  try { v = JSON.parse(localStorage.getItem(CS_KEY) || '{}'); } catch (_) {}
  v[kind] = id;
  try { localStorage.setItem(CS_KEY, JSON.stringify(v)); } catch (_) {}
  try { window.dispatchEvent(new CustomEvent('kibo:currency-change')); } catch (_) {}
}
function csOwned() {
  const base = [].concat(CURRENCY_SKINS.dark, CURRENCY_SKINS.coin).filter(s => s.free).map(s => s.id);
  try { return new Set(base.concat(JSON.parse(localStorage.getItem(CS_OWNED_KEY) || '[]'))); }
  catch (_) { return new Set(base); }
}
function csOwn(id) {
  const s = [...csOwned()];
  if (!s.includes(id)) s.push(id);
  try { localStorage.setItem(CS_OWNED_KEY, JSON.stringify(s)); } catch (_) {}
  try { window.dispatchEvent(new CustomEvent('kibo:currency-change')); } catch (_) {}
}
function csNames() {
  try { return JSON.parse(localStorage.getItem(CS_NAME_KEY) || '{}'); } catch (_) { return {}; }
}
function csSetName(kind, name) {
  const v = { ...csNames(), [kind]: name || undefined };
  try { localStorage.setItem(CS_NAME_KEY, JSON.stringify(v)); } catch (_) {}
  try { window.dispatchEvent(new CustomEvent('kibo:currency-change')); } catch (_) {}
}
function csLabel(kind) { return csNames()[kind] || csGet(kind).name; }

function useCurrencySkin() {
  const [v, set] = React.useState(() => ({ dark: csGet('dark'), coin: csGet('coin'), names: csNames() }));
  React.useEffect(() => {
    const h = () => set({ dark: csGet('dark'), coin: csGet('coin'), names: csNames() });
    window.addEventListener('kibo:currency-change', h);
    window.addEventListener('storage', h);
    return () => { window.removeEventListener('kibo:currency-change', h); window.removeEventListener('storage', h); };
  }, []);
  return v;
}

Object.assign(window, {
  PRESTIGE_FAMILIES, PF_CUSTOM_COST, pfFamilies, pfById, pfOwned, pfOwn, pfActive, pfSetActive,
  pfCustom, pfSetCustom, pfNames, pfName, usePrestigeNames,
  CURRENCY_SKINS, csGet, csSet, csOwned, csOwn, csNames, csSetName, csLabel, useCurrencySkin,
});
