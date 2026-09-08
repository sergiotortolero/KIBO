// Ensambla el artboard FUNCIONAL: toma el armazon, cablea el menu, las pestanas
// por momento, el boton de KIBO y el tema, e inyecta la clase de logica.
// Sin coste de modelo. Uso: node _funcional.mjs
import fs from 'fs';

const shell = fs.readFileSync('Shell.dc.html', 'utf8');
const leer = n => { try { return fs.readFileSync(`_contenido/${n}.html`, 'utf8'); } catch { return ''; } };

const MAPA = [
  { lbl: 'Inicio',          id: 'inicio',          src: 'TodayDashboard' },
  { lbl: 'Mi progreso',     id: 'progreso',        src: null },
  { lbl: 'Tareas',          id: 'tareas',          src: 'TaskDetailScreen' },
  { lbl: 'Áreas',           id: 'areas',           src: null },
  { lbl: 'Proyectos',       id: 'proyectos',       src: null },
  { lbl: 'Finanzas',        id: 'finanzas',        src: 'ModuleLocked' },
  { lbl: 'Hábitos',         id: 'habitos',         src: 'HabitsScreen' },
  { lbl: 'Retos',           id: 'retos',           src: null },
  { lbl: 'Salud',           id: 'salud',           src: null },
  { lbl: 'Diario',          id: 'diario',          src: null },
  { lbl: 'Lectura',         id: 'lectura',         src: null },
  { lbl: 'Estudio',         id: 'estudio',         src: 'ModuleLocked' },
  { lbl: 'Entretenimiento', id: 'entretenimiento', src: 'ModuleLocked' },
  { lbl: 'Bóveda',          id: 'boveda',          src: 'ModuleLocked' },
  { lbl: 'Amigos',          id: 'amigos',          src: null },
  { lbl: 'Familia',         id: 'familia',         src: null },
  { lbl: 'Tienda',          id: 'tienda',          src: null },
  { lbl: 'Personalización', id: 'personalizacion', src: null },
];
const clase = x => x.src === 'ModuleLocked' ? 'bloqueado' : (x.src ? 'real' : 'obra');

let t = shell;

// 1) el menu: clase calculada y manejador por destino
let usados = 0;
t = t.replace(/<button type="button" class="(kbv-side-link[^"]*)"([^>]*)>([^]*?)<\/button>/g,
  (todo, cls, attrs, dentro) => {
    const mm = dentro.match(/<span class="lbl">([^<]*)<\/span>/);
    if (!mm) return todo;
    const d = MAPA.find(x => x.lbl === mm[1]);
    if (!d) return todo;
    usados++;
    const extra = cls.replace('kbv-side-link', '').replace(/\bactive\b/, '').trim();
    const limpio = attrs.replace(/ aria-current="page"/, '');
    return `<button type="button" class="{{ clase_${d.id} }} ${extra}" onClick="{{ ir_${d.id} }}"${limpio}>${dentro}</button>`;
  });

// 2) el contenido: un sc-if por seccion real, mas los dos compartidos
const ABRE = '<div class="kbv-page">';
const i0 = t.indexOf(ABRE);
let prof = 0, fin = -1, m;
const reDiv = /<div\b|<\/div>/g; reDiv.lastIndex = i0;
while ((m = reDiv.exec(t))) { if (m[0] === '</div>') { prof--; if (prof === 0) { fin = m.index; break; } } else prof++; }

const si = (cond, ini, cuerpo) => `<sc-if value="{{ ${cond} }}" hint-placeholder-val="{{ ${ini} }}">\n${cuerpo}\n</sc-if>`;
const reales = MAPA.filter(x => clase(x) === 'real');
const bloques = [
  ...reales.map(x => si(`es_${x.id}`, x.id === 'inicio' ? 'true' : 'false', leer(x.src))),
  si('es_bloqueado', 'false', leer('ModuleLocked')),
  si('es_construccion', 'false', leer('ComingSoon')),
].join('\n');
t = t.slice(0, i0 + ABRE.length) + '\n' + bloques + '\n' + t.slice(fin);

// 3) el tema, en la raiz del armazon
t = t.replace('<div class="kbv-shell">', '<div class="{{ clase_shell }}">');

// 4) KIBO abre su menu de acciones
t = t.replace(/<button type="button" class="(kbv-kibo-trigger|kbv-fab)"/,
  (todo, c) => `<button type="button" class="${c}" onClick="{{ abrir_rueda }}"`);
const velo = '\n' + si('rueda_abierta', 'false',
  `  <div onClick="{{ cerrar_rueda }}" style="position:absolute; inset:0; z-index:60; background:color-mix(in oklab, var(--kb-void-2) 62%, transparent); display:flex; align-items:flex-start; justify-content:center; padding:var(--kb-sp-8); overflow:auto;">
    <div style="width:100%; max-width:var(--kb-w-page);">
${leer('RuedaCanonica')}
    </div>
  </div>`) + '\n';
t = t.replace('</x-dc>', velo + '</x-dc>');

// 4b) las pestanas por momento del tablero de Inicio
const MOMENTOS = [];
t = t.replace(/<button([^>]*)data-ir-momento="([a-z]+)"([^>]*)>/g, (todo, a, mo, b) => {
  if (!MOMENTOS.includes(mo)) MOMENTOS.push(mo);
  const resto = (a + b).replace(/\sclass="[^"]*"/, '');
  return '<button' + resto + ' class="{{ clase_momento_' + mo + ' }}" onClick="{{ ir_momento_' + mo + ' }}">';
});
for (let g = 0; g < 20; g++) {
  const mm = /<([a-z]+)([^>]*)data-momento="([a-z]+)"([^>]*)>/.exec(t);
  if (!mm) break;
  const tag = mm[1], mo = mm[3], ini = mm.index;
  if (!MOMENTOS.includes(mo)) MOMENTOS.push(mo);
  const re = new RegExp('<' + tag + '(?=[ >/])|</' + tag + '>', 'g');
  re.lastIndex = ini;
  let d = 0, f2 = -1, x;
  while ((x = re.exec(t))) {
    if (x[0] === '</' + tag + '>') { d--; if (d === 0) { f2 = x.index + tag.length + 3; break; } }
    else d++;
  }
  if (f2 < 0) break;
  const dentro = t.slice(ini, f2).replace('data-momento="' + mo + '"', 'data-panel="' + mo + '"');
  t = t.slice(0, ini) + si('es_momento_' + mo, mo === 'manana' ? 'true' : 'false', dentro) + t.slice(f2);
}

// 5) la clase de logica
const props = JSON.stringify({ tema: { editor: 'enum', options: ['claro', 'oscuro'], default: 'claro' } });
const tabla = JSON.stringify(Object.fromEntries(MAPA.map(x => [x.id, clase(x)])));
const moms = JSON.stringify(MOMENTOS.length ? MOMENTOS : ['manana', 'trabajo', 'noche']);
const logica = [
  '<script data-dc-script data-props=' + "'" + props + "'" + '>',
  'class Component extends DCLogic {',
  "  constructor(p) { super(p); this.state = { seccion: 'inicio', rueda: false, momento: 'manana' }; }",
  '  renderVals() {',
  '    const TIPO = ' + tabla + ';',
  '    const MOMS = ' + moms + ';',
  '    const v = {};',
  '    for (const id of Object.keys(TIPO)) {',
  "      v['es_' + id] = this.state.seccion === id;",
  '      v[\'ir_\' + id] = () => this.setState({ seccion: id, rueda: false });',
  "      v['clase_' + id] = 'kbv-side-link' + (this.state.seccion === id ? ' active' : '');",
  '    }',
  '    for (const mo of MOMS) {',
  "      v['es_momento_' + mo] = this.state.momento === mo;",
  '      v[\'ir_momento_\' + mo] = () => this.setState({ momento: mo });',
  "      v['clase_momento_' + mo] = 'kbv-chip' + (this.state.momento === mo ? ' active' : '');",
  '    }',
  '    const tipo = TIPO[this.state.seccion];',
  "    v.es_bloqueado = tipo === 'bloqueado';",
  "    v.es_construccion = tipo === 'obra';",
  "    v.clase_shell = 'kbv-shell' + ((this.props.tema || 'claro') === 'oscuro' ? ' theme-dark' : '');",
  
  '    v.rueda_abierta = this.state.rueda;',
  '    v.abrir_rueda = () => this.setState({ rueda: true });',
  '    v.cerrar_rueda = () => this.setState({ rueda: false });',
  '    return v;',
  '  }',
  '}',
  '<' + '/script>',
].join('\n');
t = t.replace('</body>', logica + '\n</body>');

fs.writeFileSync('Main.dc.html', t);
console.log('Main.dc.html: ' + (t.length / 1024).toFixed(0) + 'KB · menu ' + usados + '/' + MAPA.length
  + ' · secciones ' + reales.length + ' · momentos ' + (MOMENTOS.length ? MOMENTOS.join(',') : 'ninguno aun'));
