// kibo-tip.jsx — Recomendación de Kibo como NOTIFICACIÓN flotante reutilizable.
// La mascota asoma en una esquina con una burbuja "¡Hola!" y un punto de aviso;
// al tocarla se despliega la tarjeta de recomendación. Se usa en cualquier
// sección que antes tenía un banner de recomendación grande.
//
// Uso:  <KiboTip tone="warn" title="…" body="…" from="Kibo · recomendación" />
// tone: 'ok' | 'warn' | 'info'

function KiboTip({ tone = 'ok', title, body, from = 'Kibo', cta, onCta, storageKey }) {
  const seenKey = storageKey ? `kibo_tip_${storageKey}` : null;
  const [open, setOpen] = React.useState(false);
  const [seen, setSeen] = React.useState(() => {
    if (!seenKey) return false;
    try { return localStorage.getItem(seenKey) === '1'; } catch (_) { return false; }
  });
  function toggle() {
    setOpen(o => {
      const n = !o;
      if (n && seenKey) { try { localStorage.setItem(seenKey, '1'); } catch (_) {} setSeen(true); }
      return n;
    });
  }
  const mood = tone === 'warn' ? 'thinking' : 'happy';
  return (
    <div className={`kibo-tip ${open ? 'open' : ''} ${tone}`}>
      {open && (
        <div className="kt-card" role="dialog">
          <div className="kt-card-head">
            <span className="kt-from">{from}</span>
            <button type="button" className="kt-close" onClick={() => setOpen(false)} aria-label="Cerrar"><KIcon name="x" size={13} /></button>
          </div>
          <strong className="kt-title">{title}</strong>
          {body && <p className="kt-body">{body}</p>}
          {cta && <button type="button" className="kt-cta" onClick={() => { onCta && onCta(); setOpen(false); }}>{cta}</button>}
        </div>
      )}
      <button type="button" className="kt-launcher" onClick={toggle} aria-label="Ver recomendación de Kibo">
        {!open && !seen && <span className="kt-badge" />}
        {!open && <span className="kt-hi">¡Hola!</span>}
        <span className="kt-av">
          {typeof KiboMascot === 'function'
            ? <KiboMascot size={46} mood={mood} animate={false} />
            : <span className="kt-fallback"><KIcon name="sparkle" size={20} /></span>}
        </span>
      </button>
    </div>
  );
}

Object.assign(window, { KiboTip });
