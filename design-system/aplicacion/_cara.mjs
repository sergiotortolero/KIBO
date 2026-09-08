// La receta de CARA: un relleno solido no se mezcla contra el negro (eso baja
// luminosidad Y croma, y por eso la interfaz leia lodosa). Se baja la
// luminosidad SUBIENDO el croma, y asi la cara carga rotulo blanco.
// Medido con rotulo blanco: 4.96 (Voluntad) a 6.37 (Sabiduria), toda la
// paleta, en los dos temas.
import fs from 'fs';

const CARA = 'oklch(from var(--c, var(--kb-primary)) var(--kb-face-l) calc(c * var(--kb-face-c)) h)';
const CARA_P = 'oklch(from var(--kb-primary) var(--kb-face-l) calc(c * var(--kb-face-c)) h)';

const TOKENS = `  --kb-primary-ink:   color-mix(in oklab, var(--kb-primary) 54%, var(--kb-void-2));

  /* ---- La receta de cara: profundidad CON croma ---------------------------
     Un relleno solido baja su luminosidad subiendo su croma, nunca mezclando
     contra el negro: la mezcla apaga las dos cosas a la vez. Con rotulo
     blanco toda la paleta mide entre 4.96 y 6.37 en los dos temas. */
  --kb-face-l: 0.50;
  --kb-face-c: 1.5;`;

const CAMBIOS_ARTBOARD = [
  ['  --kb-primary-ink:   color-mix(in oklab, var(--kb-primary) 54%, var(--kb-void-2));', TOKENS],
  ['    .kbv-btn-primary { --c: var(--kb-primary); --face: var(--c); --on-face: var(--kb-void-2); }',
   `    .kbv-btn-primary { --c: var(--kb-primary); --face: ${CARA}; --on-face: var(--kb-text-inverse); }`],
  ['    .kbv-btn-danger  { --c: var(--kb-hp); --on-face: var(--kb-text-inverse);\n                       --face: color-mix(in oklab, var(--c) 74%, var(--kb-void-2)); }',
   `    .kbv-btn-danger  { --c: var(--kb-hp); --face: ${CARA}; --on-face: var(--kb-text-inverse); }`],
  ['    .kbv-check.on { background: var(--kb-primary); border-color: var(--kb-primary); color: var(--kb-void-2); }',
   `    .kbv-check.on { background: ${CARA_P}; border-color: ${CARA_P}; color: var(--kb-text-inverse); }`],
  ['      background: var(--c, var(--kb-hp)); color: var(--kb-void-2);',
   `      background: oklch(from var(--c, var(--kb-hp)) var(--kb-face-l) calc(c * var(--kb-face-c)) h); color: var(--kb-text-inverse);`],
  ['    .kbv-side-link.active { background: var(--kb-primary); color: var(--kb-void-2); font-weight: 700; }',
   `    .kbv-side-link.active { background: ${CARA_P}; color: var(--kb-text-inverse); font-weight: 700; }`],
  ['    .kbv-side-link.active .kbv-badge.quiet { background: var(--kb-canvas); color: var(--kb-primary-ink); }',
   '    .kbv-side-link.active .kbv-badge.quiet { background: var(--kb-text-inverse); color: var(--kb-primary-ink); }'],
  ['    .kbv-progress .fill { display: block; height: 100%; border-radius: var(--kb-r-pill); background: var(--c, var(--kb-primary));',
   `    .kbv-progress .fill { display: block; height: 100%; border-radius: var(--kb-r-pill); background: ${CARA};`],
];

const files = fs.readdirSync('.').filter(f => f.endsWith('.dc.html'));
let tocados = 0; const fallas = [];
for (const f of files) {
  let t = fs.readFileSync(f, 'utf8'); const antes = t; const faltan = [];
  CAMBIOS_ARTBOARD.forEach(([de, a], i) => {
    if (t.includes(a)) return;
    if (!t.includes(de)) { faltan.push(i + 1); return; }
    t = t.split(de).join(a);
  });
  if (faltan.length) fallas.push(`${f}: falta ${faltan.join(', ')}`);
  if (t !== antes) { fs.writeFileSync(f, t); tocados++; }
}
console.log(`artboards: ${tocados}/${files.length}`);
fallas.forEach(x => console.log('  ' + x));
