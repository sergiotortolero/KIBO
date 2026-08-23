// kibo-style.jsx — el guardarropa de KIBO. Estado compartido de cosméticos
// (piel, accesorio, aura, personalidad) en localStorage + evento
// 'kibo:kibo-change'. Lo leen KiboBlob (sidebar, FAB, tienda) y la Tienda.
// Mismo patrón que vitrina.jsx / prestige-system.jsx.

const KIBO_STYLE_KEYS = { skin: 'kibo:kb-skin', mark: 'kibo:kb-mark', acc: 'kibo:kb-acc', aura: 'kibo:kb-aura', pers: 'kibo:kb-pers', toy: 'kibo:kb-toy', owned: 'kibo:kb-owned' };

// ── Catálogo ─────────────────────────────────────────────────────
// PIELES — recoloran el gel del blob (el ánimo sigue pintando la cara/boca).
const KIBO_SKINS = [
  { id: 'sk-teal',    name: 'Teal clásico',  cost: 0,   currency: 'coin', body: 'var(--kb-primary)', desc: 'El KIBO de siempre — progreso sereno.' },
  { id: 'sk-rosa',    name: 'Fresa',         cost: 300, currency: 'coin', body: '#FF9FB1', desc: 'Dulce y de buen humor.' },
  { id: 'sk-cielo',   name: 'Cielo',         cost: 300, currency: 'coin', body: '#5BA7E0', desc: 'Frío, tranquilo, enfocado.' },
  { id: 'sk-lima',    name: 'Lima',          cost: 300, currency: 'coin', body: '#7CD17C', desc: 'Primaveral — energía fresca.' },
  { id: 'sk-sol',     name: 'Sol',           cost: 450, currency: 'coin', body: '#F4C24D', desc: 'Radiante. Cuidado: contagia.' },
  { id: 'sk-lavanda', name: 'Lavanda',       cost: 600, currency: 'coin', body: '#B891E8', desc: 'Suave, casi premium.' },
  { id: 'sk-sombra',  name: 'Sombra',        cost: 30,  currency: 'gem',  body: '#3A3A52', desc: 'KIBO nocturno. Ojos que brillan más.' },
  // Las degradadas llevan base sólida: --skin (manos, losa, tinte) usa la base
  // y el degradado se pinta directo en el cuerpo.
  { id: 'sk-galaxia', name: 'Galaxia',       cost: 60,  currency: 'gem',  base: '#2A2263', body: 'radial-gradient(120% 120% at 30% 20%, #2A2166 0%, #171040 54%, #0B0722 100%)', animated: true, desc: 'Un cielo adentro: estrellas blancas, rojas, amarillas y azules titilando en el gel.' },
  { id: 'sk-lava',    name: 'Lava',          cost: 60,  currency: 'gem',  base: '#B33A16', body: 'radial-gradient(120% 120% at 40% 25%, #FF9A3C 0%, #E0451A 42%, #7A1608 78%, #2A0A04 100%)', animated: true, desc: 'Grietas encendidas y pedazos de roca que se deshacen y se hunden.' },
  { id: 'sk-cristal', name: 'Cristal',       cost: 90,  currency: 'gem',  base: '#8FB2F7', body: 'linear-gradient(150deg, #E8F6FF 0%, #A6C6FF 50%, #6E8CF2 100%)', animated: true, desc: 'Facetas y un destello que recorre el gel.' },
];

// ACCESORIOS — se dibujan SOBRE el blob (SVG), viajan con cada travesura.
const KIBO_ACCS = [
  { id: 'ac-none',    name: 'Nada',           cost: 0,   currency: 'coin', desc: 'KIBO al natural.' },
  { id: 'ac-lentes',  name: 'Lentes nerd',    cost: 200, currency: 'coin', desc: 'Redondos. +10 de enfoque imaginario.' },
  { id: 'ac-mono',    name: 'Moño',           cost: 250, currency: 'coin', desc: 'Un moño coqueto en la cabeza.' },
  { id: 'ac-gorra',   name: 'Gorra',          cost: 350, currency: 'coin', desc: 'Visera al frente, actitud al cien.' },
  { id: 'ac-mago',    name: 'Gorro de mago',  cost: 500, currency: 'coin', desc: 'Violeta con estrellas — sabiduría +1.' },
  { id: 'ac-corona',  name: 'Corona',         cost: 100, currency: 'gem',  desc: 'Dorada. Para el rey de la racha.' },
];

// AURAS — halo/partículas detrás del cuerpo (grandes: rebasan la silueta).
const KIBO_AURAS = [
  { id: 'au-none',     name: 'Sin aura',       cost: 0,   currency: 'coin', desc: 'Limpio y sereno.' },
  { id: 'au-dorada',   name: 'Aura dorada',    cost: 80,  currency: 'gem', tint: 'var(--kb-coin)',        desc: 'Halo cálido que respira contigo.' },
  { id: 'au-estelar',  name: 'Aura estelar',   cost: 90,  currency: 'gem', tint: 'var(--area-community)', desc: 'Chispas orbitando despacio.' },
  { id: 'au-fuego',    name: 'Aura de racha',  cost: 90,  currency: 'gem', tint: 'var(--kb-streak)',      desc: 'Arde más mientras más días llevas.' },
  { id: 'au-neon',     name: 'Anillo neón',    cost: 110, currency: 'gem', tint: 'var(--area-will)',      desc: 'Un aro cian que pulsa a tu ritmo.' },
  { id: 'au-burbujas', name: 'Burbujas',       cost: 70,  currency: 'gem', tint: 'var(--kb-primary)',     desc: 'Burbujitas de gel subiendo siempre.' },
  { id: 'au-petalo',   name: 'Pétalos',        cost: 95,  currency: 'gem', tint: 'var(--kb-hp)',          desc: 'Pétalos rosados cayendo suave.' },
];

// PERSONALIDADES — comportamiento comprable. La base es Sereno: quieto,
// solo respira y parpadea (cero travesuras); lo demás se compra.
const KIBO_PERS = [
  { id: 'pe-sereno',   name: 'Sereno',    cost: 0,   currency: 'coin', idleMs: null, desc: 'Quieto y presente: respira, parpadea, nada más.' },
  { id: 'pe-curioso',  name: 'Curioso',   cost: 25,  currency: 'gem',  idleMs: [12000, 18000], tricks: ['wave', 'point'], desc: 'Voltea, señala, saluda — de vez en cuando.' },
  { id: 'pe-jugueton', name: 'Juguetón',  cost: 40,  currency: 'gem',  idleMs: [4000, 8000],  desc: 'No se puede quedar quieto.' },
  { id: 'pe-teatral',  name: 'Teatral',   cost: 60,  currency: 'gem',  idleMs: [6000, 10000], theatrical: true, desc: 'Cada travesura, una función.' },
  { id: 'pe-dormilon', name: 'Dormilón',  cost: 30,  currency: 'gem',  idleMs: [14000, 20000], tricks: ['squash', 'gota'], sleepy: true, desc: 'Bosteza, se escurre, vuelve a dormir.' },
  { id: 'pe-coqueto',  name: 'Coqueto',   cost: 50,  currency: 'gem',  idleMs: [7000, 12000], tricks: ['beso', 'wave', 'mueca'], desc: 'Manda besos y hace caras.' },
];

// MARCAS — tatuajes y detalles sobre el gel. Se dibujan DENTRO del cuerpo, así
// que se deforman con él: a diferencia de accesorios y objetos, no se despegan
// ni compiten con la cara.
const KIBO_MARKS = [
  { id: 'mk-none',    name: 'Sin marca',     cost: 0,   currency: 'coin', desc: 'KIBO al natural.' },
  { id: 'mk-pecas',   name: 'Pecas',         cost: 180, currency: 'coin', desc: 'Tres pecas a cada lado. Encanto instantáneo.' },
  { id: 'mk-estrella',name: 'Estrella',      cost: 260, currency: 'coin', desc: 'Una estrellita en la mejilla.' },
  { id: 'mk-rayo',    name: 'Rayo',          cost: 320, currency: 'coin', desc: 'Un rayo en el costado — energía.' },
  { id: 'mk-espiral', name: 'Espiral',       cost: 380, currency: 'coin', desc: 'Hipnótica, gira con el gel.' },
  { id: 'mk-corazon', name: 'Corazón',       cost: 25,  currency: 'gem',  desc: 'Late un poco más fuerte que el resto.' },
  { id: 'mk-consteo', name: 'Constelación',  cost: 45,  currency: 'gem',  desc: 'Cinco estrellas unidas por una línea fina.' },
  { id: 'mk-runa',    name: 'Runa',          cost: 55,  currency: 'gem',  desc: 'Símbolo antiguo que brilla apenas.' },
  { id: 'mk-ondas',   name: 'Ondas',         cost: 40,  currency: 'gem',  desc: 'Tres ondas que recorren el cuerpo.' },
];

// JUGUETES — objetos con los que KIBO convive junto a su base.
const KIBO_TOYS = [
  { id: 'toy-none',    name: 'Sin juguete', cost: 0,   currency: 'coin', desc: 'KIBO y nada más.' },
  { id: 'toy-pelota',  name: 'Pelota',      cost: 250, currency: 'coin', desc: 'Bota sola; KIBO la persigue con la mirada.' },
  { id: 'toy-cubo',    name: 'Cubo mágico', cost: 350, currency: 'coin', desc: 'Gira lento junto a su base.' },
  { id: 'toy-uke',     name: 'Ukelele',     cost: 45,  currency: 'gem',  desc: 'Recargado en KIBO — a veces lo rasguea.' },
  { id: 'toy-plantita',name: 'Plantita',    cost: 30,  currency: 'gem',  desc: 'Crece con tu racha (de mentiras, pero crece).' },
];

// Accesorios y juguetes quedan FUERA del guardarropa: se veían poco y
// estorbaban a la silueta. Su lugar lo toman las marcas, que viven sobre el gel.
const KIBO_STYLE_CATALOG = { skin: KIBO_SKINS, mark: KIBO_MARKS, aura: KIBO_AURAS, pers: KIBO_PERS };
const KIBO_STYLE_DEFAULTS = { skin: 'sk-teal', mark: 'mk-none', acc: 'ac-none', aura: 'au-none', pers: 'pe-sereno', toy: 'toy-none' };
const KIBO_STYLE_FREE = ['sk-teal', 'mk-none', 'ac-none', 'au-none', 'pe-sereno', 'toy-none'];

// Partes retiradas del guardarropa (accesorios y objetos). Mientras estén aquí
// NO se leen del almacenamiento y se migra el valor guardado a "ninguno": sin
// esto, quien ya tuviera corona o ukelele equipado se quedaba con ellos para
// siempre, porque al quitar la sección de la Tienda no queda control que los
// pueda apagar. Es también lo que saca "Cantar" del dial de travesuras.
const KIBO_STYLE_RETIRED = { acc: 'ac-none', toy: 'toy-none' };

function getKiboStyle() {
  const out = { ...KIBO_STYLE_DEFAULTS };
  for (const k of Object.keys(KIBO_STYLE_KEYS)) {
    if (k === 'owned') continue;
    if (KIBO_STYLE_RETIRED[k] !== undefined) {
      out[k] = KIBO_STYLE_RETIRED[k];
      // Migración silenciosa: solo toca SU clave, ninguna otra del usuario.
      try {
        if (localStorage.getItem(KIBO_STYLE_KEYS[k]) !== KIBO_STYLE_RETIRED[k]) {
          localStorage.setItem(KIBO_STYLE_KEYS[k], KIBO_STYLE_RETIRED[k]);
        }
      } catch (_) {}
      continue;
    }
    try { const v = localStorage.getItem(KIBO_STYLE_KEYS[k]); if (v) out[k] = v; } catch (_) {}
  }
  return out;
}
function getKiboOwned() {
  try { return new Set(JSON.parse(localStorage.getItem(KIBO_STYLE_KEYS.owned) || '[]').concat(KIBO_STYLE_FREE)); }
  catch (_) { return new Set(KIBO_STYLE_FREE); }
}
function ownKiboItem(id) {
  const s = getKiboOwned(); s.add(id);
  try { localStorage.setItem(KIBO_STYLE_KEYS.owned, JSON.stringify([...s])); } catch (_) {}
  emitKiboChange();
}
function setKiboStyle(part, id) {
  if (!KIBO_STYLE_KEYS[part]) return;
  try { localStorage.setItem(KIBO_STYLE_KEYS[part], id); } catch (_) {}
  emitKiboChange();
}
function emitKiboChange() { try { window.dispatchEvent(new CustomEvent('kibo:kibo-change')); } catch (_) {} }

// Hook: cualquier KiboBlob montado se re-renderiza al equipar algo.
function useKiboStyle() {
  const [style, setStyle] = React.useState(getKiboStyle);
  React.useEffect(() => {
    const upd = () => setStyle(getKiboStyle());
    window.addEventListener('kibo:kibo-change', upd);
    window.addEventListener('storage', upd);
    return () => { window.removeEventListener('kibo:kibo-change', upd); window.removeEventListener('storage', upd); };
  }, []);
  return style;
}
function kiboSkinById(id)  { return KIBO_SKINS.find(s => s.id === id) || KIBO_SKINS[0]; }
function kiboAuraById(id)  { return KIBO_AURAS.find(a => a.id === id) || KIBO_AURAS[0]; }
function kiboPersById(id)  { return KIBO_PERS.find(p => p.id === id) || KIBO_PERS[0]; }
function kiboToyById(id)   { return KIBO_TOYS.find(t => t.id === id) || KIBO_TOYS[0]; }
function kiboMarkById(id)  { return KIBO_MARKS.find(m => m.id === id) || KIBO_MARKS[0]; }

Object.assign(window, {
  KIBO_SKINS, KIBO_MARKS, KIBO_ACCS, KIBO_AURAS, KIBO_PERS, KIBO_TOYS, KIBO_STYLE_CATALOG, KIBO_STYLE_DEFAULTS,
  getKiboStyle, getKiboOwned, ownKiboItem, setKiboStyle, useKiboStyle,
  kiboSkinById, kiboAuraById, kiboPersById, kiboToyById, kiboMarkById,
});
