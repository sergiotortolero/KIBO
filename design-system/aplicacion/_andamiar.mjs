// Genera el artboard de cada pantalla a partir del armazon, dejando un hueco
// para el contenido. Sin coste de modelo: el 90 % de cada artboard es el armazon.
// Uso: node design-system/aplicacion/_andamiar.mjs <ola>
import fs from 'fs';

const DIR = 'design-system/aplicacion';
const ola = process.argv[2] || '1';
const lista = JSON.parse(fs.readFileSync(`${DIR}/_ola${ola}.json`, 'utf8'));
const shell = fs.readFileSync(`${DIR}/Shell.dc.html`, 'utf8');

const ABRE = '<div class="kbv-page">';
const i0 = shell.indexOf(ABRE);
if (i0 < 0) { console.error('no encontre .kbv-page en el armazon'); process.exit(1); }

// recorrer desde la apertura contando profundidad de <div> para hallar su cierre
let d = 0, i = i0, fin = -1;
const re = /<div\b|<\/div>/g;
re.lastIndex = i0;
let m;
while ((m = re.exec(shell))) {
  if (m[0] === '</div>') { d--; if (d === 0) { fin = m.index + 6; break; } }
  else d++;
}
if (fin < 0) { console.error('no cerre .kbv-page'); process.exit(1); }

const antes = shell.slice(0, i0);
const despues = shell.slice(fin);
const HUECO = `<div class="kbv-page">
<!-- ═══ CONTENIDO DE LA PANTALLA ═══
     Sustituye ESTE comentario por el contenido completo: la cabecera de pagina
     (.kbv-page-head con su migaja, su .kbv-h1 y sus acciones), las secciones,
     los estados y los modales superpuestos. Todo dentro de .kbv-page.
     No toques nada fuera de este hueco: el armazon es contrato compartido. -->
          </div>`;

let n = 0;
for (const p of lista) {
  const dest = `${DIR}/${p.artboard}.dc.html`;
  if (fs.existsSync(dest)) { console.log(`  (ya existe, respetado) ${p.artboard}`); continue; }
  fs.writeFileSync(dest, antes + HUECO + despues);
  n++;
}
console.log(`ola ${ola}: ${n} andamios escritos de ${lista.length}`);
console.log(`armazon ${(shell.length / 1024).toFixed(0)}KB · hueco en el byte ${i0}`);
