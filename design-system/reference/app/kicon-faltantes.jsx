// kicon-faltantes.jsx — los 6 glifos que KIcon declara pero no dibuja.
//
// Están escritos con el MISMO patrón que sus vecinos en icons.jsx:
//   viewBox="0 0 24 24" · {...common} (fill:none, stroke:currentColor, linecap/join round)
//   pupilas como <circle r="0.8" fill="currentColor"> · relleno solo donde el vecino lo usa
//
// Se parchan sobre el KIcon real sin tocarlo. El set real se consulta PRIMERO:
// si ya dibuja un nombre, gana él y este archivo no interviene. Solo entra
// cuando el set devuelve null — o sea, cuando el nombre está declarado sin
// dibujo. Por eso el día que icons.jsx los implemente, el parche se apaga solo
// y la marca morada de las tarjetas se apaga con él.
//
// Referencias de estilo por glifo:
//   play      ← 'square' (control de reproducción, RELLENO: un trazo no lee como botón)
//   mood-*    ← 'mood-meh' / 'mood-low' (círculo r=9 + boca + pupilas r=0.8)
//   star      ← 'sparkle' (estrella de 5 puntas, trazo)
//   medal     ← 'trophy' (disco + cintas, sin estrella dentro)
//   scissors  ← 'x' + 'grip' (dos aros y dos hojas cruzadas)

(function () {
  const Base = window.KIcon || window.__KIconApp;
  if (typeof Base !== 'function') return;

  const EXTRA = {
    // ── acción ──────────────────────────────────────────────────────────
    // Relleno, igual que 'square': un triángulo de trazo no se lee como
    // botón de iniciar. Son pareja — play/square arrancan y detienen.
    play: (c) => <path d="M8 5.5l10 6.5-10 6.5z" fill="currentColor" stroke="currentColor" strokeWidth={c.strokeWidth} strokeLinejoin="round" />,

    scissors: (c) => (
      <>
        <circle cx="6" cy="18" r="2.6" {...c} />
        <circle cx="18" cy="18" r="2.6" {...c} />
        <path d="M7.8 16.2L17 4M16.2 16.2L7 4" {...c} />
      </>
    ),

    // ── ánimo ───────────────────────────────────────────────────────────
    // Completan la escala de 7. 'mood-neutral' cae entre meh y low: boca
    // recta pero más corta; 'mood-bad' es más grave que sad: boca hacia
    // abajo y cejas caídas.
    'mood-neutral': (c) => (
      <>
        <circle cx="12" cy="12" r="9" {...c} />
        <path d="M9.5 15h5" {...c} />
        <circle cx="9" cy="10" r="0.8" fill="currentColor" />
        <circle cx="15" cy="10" r="0.8" fill="currentColor" />
      </>
    ),

    // 'mood-bad' es el más grave de la escala: no repite el ceño de 'mood-sad'
    // (salían idénticos a 22px), usa boca de mueca en zigzag — inconfundible.
    'mood-bad': (c) => (
      <>
        <circle cx="12" cy="12" r="9" {...c} />
        <path d="M8.5 15.5l1.4 1.6 1.5-1.6 1.4 1.6 1.7-1.6" {...c} />
        <path d="M8 8.6l3 1.4M16 8.6l-3 1.4" {...c} />
        <circle cx="9.7" cy="11.2" r="0.8" fill="currentColor" />
        <circle cx="14.3" cy="11.2" r="0.8" fill="currentColor" />
      </>
    ),

    // ── gamificación ────────────────────────────────────────────────────
    star: (c) => <path d="M12 3.5l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.9l6-.8z" {...c} />,

    // Disco + cintas, sin estrella dentro: a 22px la estrella se emplastaba y
    // además duplicaba el glifo 'star'. Se distingue de 'trophy' por las cintas.
    medal: (c) => (
      <>
        <path d="M8.5 3l2.4 5.4M15.5 3l-2.4 5.4" {...c} />
        <circle cx="12" cy="15" r="5.8" {...c} />
        <circle cx="12" cy="15" r="2.2" {...c} />
      </>
    ),
  };

  function KIconPatched(props) {
    // El set real gana SIEMPRE: se le pregunta primero. Solo si devuelve null
    // (el nombre está declarado pero sin dibujo) entra el glifo del DS. Así, el
    // día que icons.jsx los implemente, este parche se apaga solo para ellos.
    let baseEl = null;
    try { baseEl = Base(props); } catch (e) { baseEl = null; }
    if (baseEl !== null && baseEl !== undefined) return baseEl;

    const draw = EXTRA[props.name];
    if (!draw) return null;
    const size = props.size || 20;
    const sw = props.stroke || 1.8;
    const common = {
      fill: 'none', stroke: 'currentColor', strokeWidth: sw,
      strokeLinecap: 'round', strokeLinejoin: 'round',
    };
    const { name, size: _s, stroke: _st, ...rest } = props;
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} {...rest}>
        {draw(common)}
      </svg>
    );
  }

  // ¿Este nombre lo dibuja el DS y no el set? Se resuelve preguntándole al set,
  // no con una lista teclada — para que la marca visual se apague sola.
  function kiconIsFromDS(name) {
    if (!EXTRA[name]) return false;
    try { return Base({ name, size: 18 }) === null; } catch (e) { return true; }
  }

  Object.assign(window, {
    KIcon: KIconPatched, __KIconApp: KIconPatched,
    KICON_EXTRA: Object.keys(EXTRA), kiconIsFromDS,
  });
})();
