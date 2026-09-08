// Superficie de revision: los artboards como HTML plano en el documento
// principal, para que el modo comentario del artefacto pueda anclar a un punto
// y no al iframe entero. El lienzo dibuja cada artboard en un iframe srcdoc, y
// eso es opaco al anclaje.
import fs from 'fs';
import crypto from 'crypto';

const canvas = JSON.parse(fs.readFileSync('canvas.json', 'utf8'));
const pagina = Object.fromEntries(canvas.pages.map(p => [p.id, p.name]));

const estilos = [];
const vistos = new Set();
const secciones = [];
const omitidos = [];

for (const ab of canvas.artboards) {
  const t = fs.readFileSync(ab.file, 'utf8');
  if (t.includes('data-dc-script')) { omitidos.push(ab.file); continue; }

  for (const m of t.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    const h = crypto.createHash('sha1').update(m[1]).digest('hex');
    if (!vistos.has(h)) { vistos.add(h); estilos.push(m[1]); }
  }

  const i0 = t.indexOf('</helmet>');
  const i1 = t.lastIndexOf('</x-dc>');
  const cuerpo = t.slice(i0 + 9, i1);
  const id = ab.file.replace('.dc.html', '');

  secciones.push(`
<section class="rv-sec" id="${id}">
  <div class="rv-band">
    <span class="rv-band-pag">${pagina[ab.page] || ab.page}</span>
    <h2 class="rv-band-tit">${ab.title}</h2>
    <span class="rv-band-arch">${id}</span>
  </div>
  <div class="rv-lienzo">${cuerpo}</div>
</section>`);
}

const indice = canvas.artboards
  .filter(a => !omitidos.includes(a.file))
  .map(a => `<a class="rv-ix" href="#${a.file.replace('.dc.html', '')}">
    <span class="rv-ix-pag">${pagina[a.page] || a.page}</span>
    <span class="rv-ix-tit">${a.title}</span></a>`).join('');

const CSS = `
  body { background: #EEF1F5; }
  .rv-top { position: sticky; top: 0; z-index: 900; background: #0B1022; color: #fff;
            padding: 14px 24px 16px; }
  .rv-top h1 { margin: 0 0 4px; font: 800 20px/1.2 'Plus Jakarta Sans', system-ui, sans-serif; }
  .rv-top p { margin: 0 0 12px; font: 400 13px/1.5 Inter, system-ui, sans-serif; opacity: .82;
              max-width: 92ch; }
  .rv-ixs { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
  .rv-ix { flex: 0 0 auto; display: grid; gap: 1px; padding: 7px 12px; border-radius: 10px;
           background: rgba(255,255,255,.09); color: #fff; text-decoration: none; }
  .rv-ix:hover { background: rgba(255,255,255,.18); }
  .rv-ix-pag { font: 800 9px/1.2 'Plus Jakarta Sans', system-ui, sans-serif; letter-spacing: .09em;
               text-transform: uppercase; opacity: .62; }
  .rv-ix-tit { font: 700 12px/1.3 'Plus Jakarta Sans', system-ui, sans-serif; }
  .rv-sec { padding: 0 0 48px; }
  .rv-band { position: sticky; top: 128px; z-index: 800; display: flex; align-items: baseline;
             gap: 12px; padding: 10px 24px; background: #1C2748; color: #fff; }
  .rv-band-pag { font: 800 10px/1.2 'Plus Jakarta Sans', system-ui, sans-serif; letter-spacing: .09em;
                 text-transform: uppercase; opacity: .66; }
  .rv-band-tit { margin: 0; font: 700 16px/1.3 'Plus Jakarta Sans', system-ui, sans-serif; }
  .rv-band-arch { margin-left: auto; font: 700 11px/1.2 'Plus Jakarta Sans', system-ui, sans-serif;
                  letter-spacing: .06em; opacity: .5; }
  .rv-lienzo { padding: 20px 24px 0; overflow-x: auto; }
  /* El artboard fija 1440: aqui se deja correr y se permite el desplazamiento
     lateral en vez de comprimir la composicion. */
  .rv-lienzo > div { margin: 0 auto; }
`;

const html = `<title>Revisión de Kibo</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800&family=Inter:wght@400;500;600;700&display=swap">
<style>
${estilos.join('\n')}
${CSS}
</style>

<div class="rv-top">
  <h1>Kibo &middot; superficie de revisión</h1>
  <p>Las mismas láminas del lienzo, pero como HTML plano: aquí el modo comentario sí ancla a un punto concreto en vez de seleccionar la pantalla entera. Comenta sobre lo que quieras señalar y, si el hilo lo permite, mándalo a Claude. El lienzo sigue siendo el lugar para navegar la app; este es el lugar para señalar.</p>
  <div class="rv-ixs">${indice}</div>
</div>
${secciones.join('\n')}
`;

fs.writeFileSync('kibo-revision.html', html);
console.log(`escrito kibo-revision.html (${(html.length / 1048576).toFixed(2)} MB) · ${secciones.length} laminas · ${estilos.length} bloques de estilo unicos`);
if (omitidos.length) console.log('omitidos por ser funcionales: ' + omitidos.join(' '));
