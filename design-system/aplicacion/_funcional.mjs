// Ensambla el artboard FUNCIONAL: toma el armazon, cablea el menu, el boton
// flotante y el tema, e inyecta la clase de logica. Sin coste de modelo.
import fs from 'fs';

const shell = fs.readFileSync('Shell.dc.html', 'utf8');
const leer = n => { try { return fs.readFileSync(`_contenido/${n}.html`, 'utf8'); } catch { return ''; } };

// destino del menu -> contenido. 'ModuleLocked' = compuerta premium; null = en obra.
const MAPA = [
  { lbl: 'Hoy',             id: 'hoy',             src: 'TodayDashboard' },
  { lbl: 'Mi progreso',     id: 'progreso',        src: null },
  { lbl: 'Tareas',          id: 'tareas',          src: 'TaskDetailScreen' },
  { lbl: 'Proyectos',       id: 'proyectos',       src: null },
  { lbl: 'Finanzas',        id: 'finanzas',        src: 'ModuleLocked' },
  { lbl: 'Hábitos',         id: 'habitos',         src: 'HabitsScreen' },
  { lbl: 'Retos',           id: 'retos',           src: null },
  { lbl: 'Salud',           id: 'salud',           src: null },
  { lbl: 'Diario',          id: 'diario',          src: 'ModuleLocked' },
  { lbl: 'Lectura',         id: 'lectura',         src: 'ModuleLocked' },
  { lbl: 'Estudio',         id: 'estudio',         src: 'ModuleLocked' },
  { lbl: 'Entretenimiento', id: 'entretenimiento', src: 'EntretenimientoScreen' },
  { lbl: 'Bóveda',          id: 'boveda',          src: 'ModuleLocked' },
  { lbl: 'Amigos',          id: 'amigos',          src: null },
  { lbl: 'Familia',         id: 'familia',         src: null },
  { lbl: 'Tienda',          id: 'tienda',          src: null },
  { lbl: 'Personalización', id: 'personalizacion', src: null },
  { lbl: 'Sergio',          id: 'perfil',          src: null },
];
const clase = x => x.src === 'ModuleLocked' ? 'bloqueado' : (x.src ? 'real' : 'obra');

let t = shell;

// 1) cablear cada enlace del menu: onClick + clase calculada
const reBtn = /<button type="button" class="(kbv-side-link[^"]*)"([^>]*)>([^]*?)<\/button>/g;
let usados = 0;
t = t.replace(reBtn, (todo, cls, attrs, dentro) => {
  const mm = dentro.match(/<span class="lbl">([^<]*)<\/span>/);
  if (!mm) return todo;
  const d = MAPA.find(x => x.lbl === mm[1]);
  if (!d) return todo;
  usados++;
  const limpio = attrs.replace(/ aria-current="page"/, '');
  return `<button type="button" class="{{ clase_${d.id} }}" onClick="{{ ir_${d.id} }}"${limpio}>${dentro}</button>`;
});

// 2) el contenido: un sc-if por seccion real, mas dos compartidos
const ABRE = '<div class="kbv-page">';
const i0 = t.indexOf(ABRE);
let prof = 0, fin = -1;
const reDiv = /<div\b|<\/div>/g; reDiv.lastIndex = i0;
let m;
while ((m = reDiv.exec(t))) { if (m[0] === '</div>') { prof--; if (prof === 0) { fin = m.index; break; } } else prof++; }

const si = (cond, ini, cuerpo) => `<sc-if value="{{ ${cond} }}" hint-placeholder-val="{{ ${ini} }}">\n${cuerpo}\n</sc-if>`;
const reales = MAPA.filter(x => clase(x) === 'real');
const bloques = [
  ...reales.map(x => si(`es_${x.id}`, x.id === 'hoy' ? 'true' : 'false', leer(x.src))),
  si('es_bloqueado', 'false', leer('ModuleLocked')),
  si('es_construccion', 'false', leer('ComingSoon')),
].join('\n');

t = t.slice(0, i0 + ABRE.length) + '\n' + bloques + '\n' + t.slice(fin);

// 3) el tema vive en la raiz del armazon
t = t.replace('<div class="kbv-shell">', '<div class="{{ clase_shell }}">');

// 4) el boton flotante abre la rueda; la rueda vive en su propio sc-if
t = t.replace('<button type="button" class="kbv-fab"', '<button type="button" class="kbv-fab" onClick="{{ abrir_rueda }}"');
const velo = '\n' + si('rueda_abierta', 'false',
  `  <div onClick="{{ cerrar_rueda }}" style="position:absolute; inset:0; z-index:60; background:color-mix(in oklab, var(--kb-void-2) 62%, transparent); display:flex; align-items:flex-start; justify-content:center; padding:var(--kb-sp-8); overflow:auto;">
    <div style="width:100%; max-width:var(--kb-w-page);">
${leer('KiboQuickWheel')}
    </div>
  </div>`) + '\n';
t = t.replace('</x-dc>', velo + '</x-dc>');

// 5) la clase de logica
const props = JSON.stringify({ tema: { editor: 'enum', options: ['claro', 'oscuro'], default: 'claro' } });
const tabla = JSON.stringify(Object.fromEntries(MAPA.map(x => [x.id, clase(x)])));
const logica = `
<script data-dc-script data-props='${props}'>
class Component extends DCLogic {
  constructor(p) { super(p); this.state = { seccion: 'hoy', rueda: false }; }
  renderVals() {
    const TIPO = ${tabla};
    const v = {};
    for (const id of Object.keys(TIPO)) {
      v['es_' + id] = this.state.seccion === id;
      v['ir_' + id] = () => this.setState({ seccion: id, rueda: false });
      v['clase_' + id] = 'kbv-side-link' + (this.state.seccion === id ? ' active' : '');
    }
    const tipo = TIPO[this.state.seccion];
    v.es_bloqueado = tipo === 'bloqueado';
    v.es_construccion = tipo === 'obra';
    v.clase_shell = 'kbv-shell' + ((this.props.tema || 'claro') === 'oscuro' ? ' theme-dark' : '');
    v.rueda_abierta = this.state.rueda;
    v.abrir_rueda = () => this.setState({ rueda: true });
    v.cerrar_rueda = () => this.setState({ rueda: false });
    return v;
  }
}
</script>
`;
t = t.replace('</body>', logica + '</body>');

fs.writeFileSync('Main.dc.html', t);
console.log(`Main.dc.html: ${(t.length / 1024).toFixed(0)}KB · enlaces cableados ${usados}/${MAPA.length} · secciones reales ${reales.length}`);
