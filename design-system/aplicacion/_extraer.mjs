// Recupera el contenido de cada artboard ya construido: lo que vive dentro de
// .kbv-page. Sin coste de modelo. Uso: node design-system/aplicacion/_extraer.mjs
import fs from 'fs';
const DIR = 'design-system/aplicacion';
const OUT = `${DIR}/_contenido`;
fs.mkdirSync(OUT, { recursive: true });

const ABRE = '<div class="kbv-page">';
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.dc.html') && f !== 'Shell.dc.html');
let total = 0;
for (const f of files) {
  const t = fs.readFileSync(`${DIR}/${f}`, 'utf8');
  const i0 = t.indexOf(ABRE);
  if (i0 < 0) { console.log(`  sin kbv-page: ${f}`); continue; }
  let d = 0, fin = -1;
  const re = /<div\b|<\/div>/g; re.lastIndex = i0;
  let m;
  while ((m = re.exec(t))) {
    if (m[0] === '</div>') { d--; if (d === 0) { fin = m.index; break; } }
    else d++;
  }
  if (fin < 0) { console.log(`  no cierra: ${f}`); continue; }
  const dentro = t.slice(i0 + ABRE.length, fin).trim();
  if (dentro.includes('CONTENIDO DE LA PANTALLA')) { console.log(`  hueco vacio: ${f.replace('.dc.html','')}`); continue; }
  const name = f.replace('.dc.html', '');
  fs.writeFileSync(`${OUT}/${name}.html`, dentro);
  total += dentro.length;
  console.log(`  ${name.padEnd(24)} ${(dentro.length / 1024).toFixed(0)}KB`);
}
console.log(`---\ncontenido recuperado: ${(total / 1024).toFixed(0)}KB en ${fs.readdirSync(OUT).length} archivos`);
