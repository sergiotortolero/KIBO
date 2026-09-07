// Genera el expediente de cada pantalla de una oleada.
// Uso: node design-system/aplicacion/_generar-ola.mjs <n>
import fs from 'fs';

const DIR = 'design-system/aplicacion';
const OLAS = {
  1: ['dashboard-v2.jsx', 'personal-screens.jsx', 'tarea-detalle.jsx', 'kibo-quick.jsx'],
  2: ['areas-v2.jsx', 'tienda-screen.jsx', 'personalizacion.jsx', 'achievements.jsx', 'prestige-system.jsx', 'character-screen.jsx'],
  3: ['finanzas-screens.jsx', 'salud-screen.jsx', 'estudio-screen.jsx', 'estudio-escuela.jsx', 'estudio-cursos.jsx', 'recursos-screen.jsx'],
  4: ['auth-v2.jsx', 'onboarding-v2.jsx', 'social-screen.jsx', 'cuenta-config.jsx', 'screens-v2.jsx'],
};

const n = Number(process.argv[2] || 1);
const archivos = OLAS[n];
if (!archivos) { console.error('oleada desconocida'); process.exit(1); }

const SEP = String.fromCharCode(92); // barra invertida, sin escaparla
const base = f => String(f || '').split(SEP).pop().split('/').pop();
const prod = JSON.parse(fs.readFileSync(`${DIR}/_produccion.json`, 'utf8'));
const inv  = JSON.parse(fs.readFileSync(`${DIR}/_inventario.json`, 'utf8'));

const scr = prod.screens.filter(s => archivos.includes(base(s.file)));
const mods = inv.modals.filter(m => archivos.includes(base(m.file)));

const slug = s => String(s.id || s.name).normalize('NFD').replace(/[^A-Za-z0-9]/g, '').slice(0, 26) || 'Pantalla';
fs.mkdirSync(`${DIR}/_briefs`, { recursive: true });

const usados = new Set(), lista = [];
for (const s of scr) {
  let raiz = slug(s), k = raiz, i = 2;
  while (usados.has(k)) { k = raiz + i; i++; }
  usados.add(k);

  // un modal pertenece a la pantalla si ésta lo nombra; si no, al archivo que lo define
  const nombrados = (s.opensModals || []).map(x => String(x).toLowerCase());
  const mios = mods.filter(m => {
    const id = String(m.id || '').toLowerCase(), nm = String(m.name || '').toLowerCase();
    return nombrados.some(x => x && (id === x || nm.includes(x) || x.includes(id)));
  });

  const L = [`# ${s.name || s.id}`, '',
    `- **Artboard:** \`${k}.dc.html\``,
    `- **Módulo:** ${s.module || '?'}`,
    `- **Origen:** \`${base(s.file)}\` líneas ${s.sourceLines || '?'}`,
    `- **Propósito:** ${s.purpose || ''}`, ''];
  const sec = (t, a) => { if (a && a.length) { L.push(`## ${t}`, ''); a.forEach(x => L.push(`- ${x}`)); L.push(''); } };
  sec('Secciones, de arriba abajo', s.sections);
  sec('Estados que debe mostrar', s.states);
  sec('Comportamientos que hay que representar', s.behaviors);
  sec('Lee de', s.reads);
  sec('Escribe', s.writes);
  sec('Conceptos del núcleo que toca', s.kernelConcepts);
  if (mios.length) {
    L.push('## Modales que se dibujan sobre esta pantalla', '');
    for (const m of mios) {
      L.push(`### ${m.name || m.id}`);
      L.push(`- Se abre desde: ${(m.openedFrom || []).join(', ') || '?'}`);
      if (m.purpose) L.push(`- Propósito: ${m.purpose}`);
      if ((m.fields || []).length) L.push(`- Campos: ${m.fields.join(' · ')}`);
      if ((m.actions || []).length) L.push(`- Acciones: ${m.actions.join(' · ')}`);
      if ((m.states || []).length) L.push(`- Estados: ${m.states.join(' · ')}`);
      L.push(`- Origen: \`${base(m.file)}\` ${m.sourceLines || ''}`, '');
    }
  }
  fs.writeFileSync(`${DIR}/_briefs/${k}.md`, L.join('\n'));
  lista.push({ artboard: k, nombre: s.name || s.id, archivo: base(s.file), modales: mios.length });
}

// los modales que ninguna pantalla reclamó se reparten al primer artboard de su archivo
const reclamados = new Set();
lista.forEach(() => {});
fs.writeFileSync(`${DIR}/_ola${n}.json`, JSON.stringify(lista, null, 1));
console.log(`OLA ${n}: ${lista.length} pantallas · ${mods.length} modales en sus archivos`);
lista.forEach(x => console.log(`  ${x.artboard.padEnd(28)} ${String(x.modales).padStart(2)}m  ${x.nombre.slice(0, 55)}`));
