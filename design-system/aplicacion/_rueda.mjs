// Trae la rueda de accion CANONICA desde el sistema de diseno al armazon de la
// aplicacion: su CSS al helmet, su marcado al contenido. Sin coste de modelo.
import fs from 'fs';

const DS = 'canvas/Rueda.dc.html';
const SHELL = 'aplicacion/Shell.dc.html';
const src = fs.readFileSync(DS, 'utf8');

// 1) el marcado del nivel 1: el span .wheel-wrap con su svg y KIBO al centro
const i0 = src.indexOf('<span class="wheel-wrap"');
if (i0 < 0) { console.error('no encontre .wheel-wrap'); process.exit(1); }
let d = 0, fin = -1, m;
const re = /<span\b|<\/span>/g; re.lastIndex = i0;
while ((m = re.exec(src))) {
  if (m[0] === '</span>') { d--; if (d === 0) { fin = m.index + 7; break; } } else d++;
}
const marcado = src.slice(i0, fin);

// 2) el CSS de la rueda, tal como el sistema lo declara
const QUIERO = ['.wheel', '.wsec', '.wlab', '.wglyph', '.whub', '.wback', '.wbacklab', '.wfill'];
const reglas = [];
const reRule = /(^|\n)([ \t]*)([^{}\n][^{}]*)\{([^}]*)\}/g;
let r;
while ((r = reRule.exec(src))) {
  const sel = r[3].trim();
  if (sel.startsWith('@') || sel.includes('kbb')) continue;
  const tocado = QUIERO.some(q => sel.split(',').some(s => s.trim().startsWith(q)));
  if (tocado) reglas.push(sel + ' {' + r[4] + '}');
}

let shell = fs.readFileSync(SHELL, 'utf8');
const YA = shell.includes('/* rueda canonica */');
if (!YA) {
  const css = '\n    /* rueda canonica — tomada del sistema de diseno, no reinterpretada */\n    '
    + reglas.join('\n    ') + '\n';
  shell = shell.replace('</style>', css + '  </style>');
  fs.writeFileSync(SHELL, shell);
}

fs.mkdirSync('aplicacion/_contenido', { recursive: true });
const envuelto = '<div class="kbv-card" style="display:flex; flex-direction:column; align-items:center; gap:var(--kb-sp-7); padding:var(--kb-sp-9);">\n'
  + '  <div class="kbv-eyebrow">Rueda de acción</div>\n'
  + '  ' + marcado + '\n'
  + '  <p class="kbv-meta" style="text-align:center; max-width:46ch;">Registra sin salir de donde estás. El sector abre su segundo nivel; KIBO al centro vuelve.</p>\n'
  + '</div>';
fs.writeFileSync('aplicacion/_contenido/RuedaCanonica.html', envuelto);

console.log('marcado: ' + (marcado.length / 1024).toFixed(1) + 'KB · reglas CSS de rueda: ' + reglas.length
  + ' · CSS ' + (YA ? 'ya estaba' : 'inyectado al armazon'));
console.log('sectores nivel 1: ' + (marcado.match(/class="wsec/g) || []).length);
