// Reinyecta los artboards y el canvas.json dentro del HTML del lienzo publicado,
// sin regenerar el editor: el editor y el contenido viven en el mismo archivo.
import fs from 'fs';

const HTML = 'kibo-maqueta-funcional.html';
const bruto = fs.readFileSync(HTML, 'utf8');
const lineas = bruto.split('\n');
const iDoc = lineas.findIndex(l => l.includes('id="appifact-doc"'));
if (iDoc < 0) throw new Error('no encontre el bloque appifact-doc');

const doc = JSON.parse(lineas[iDoc + 1]);
const files = doc.content.files;

if (process.argv[2] === 'inspeccionar') {
  console.log('claves de content:', Object.keys(doc.content).join(', '));
  console.log('archivos:', Object.keys(files).length);
  Object.keys(files).forEach(k => console.log('  ' + k + '  ' + (files[k].length / 1024).toFixed(0) + 'KB'));
  process.exit(0);
}

// Los artboards que el canvas.json declara, mas el propio canvas.json.
const canvas = JSON.parse(fs.readFileSync('canvas.json', 'utf8'));
let n = 0;
for (const ab of canvas.artboards) {
  if (!fs.existsSync(ab.file)) { console.log('  FALTA ' + ab.file); continue; }
  files[ab.file] = fs.readFileSync(ab.file, 'utf8');
  n++;
}
files['canvas.json'] = fs.readFileSync('canvas.json', 'utf8');

// Se retira del paquete todo artboard que el canvas.json ya no declara.
const vivos = new Set(canvas.artboards.map(a => a.file).concat(['canvas.json', 'support.js']));
for (const k of Object.keys(files)) {
  if (!vivos.has(k) && k.endsWith('.dc.html')) { delete files[k]; console.log('  retiro ' + k); }
}

lineas[iDoc + 1] = JSON.stringify(doc);
fs.writeFileSync(HTML, lineas.join('\n'));
console.log(`reinyectados ${n} artboards + canvas.json en ${HTML} (${(fs.statSync(HTML).size / 1048576).toFixed(1)} MB)`);
