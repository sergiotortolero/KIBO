// opciones3.jsx — Turno 3 de la hoja de decisiones: el catálogo vivo de
// animaciones de KIBO. Cada celda es un KIBO REAL corriendo la animación (no
// una captura), con su nombre y su identificador, para poder dar retro por id.

const OPC3_PREV_VIEW = window.KiboOptionView;

// Cada celda se re-dispara sola: la retro se da mirando el ciclo completo, no
// esperando a que ocurra. El desfase evita que 20 blobs latan al unísono.
function AnimCell({ id, name, desc, kind, every = 4600, delay = 0, styleOverride, mood, size = 96 }) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    if (kind !== 'trick') return;
    let alive = true, iv;
    const t = setTimeout(() => {
      if (!alive) return;
      setTick(x => x + 1);
      iv = setInterval(() => setTick(x => x + 1), every);
    }, delay);
    return () => { alive = false; clearTimeout(t); clearInterval(iv); };
  }, [kind, every, delay]);

  return (
    <div className="opc-anim">
      <div className="opc-anim-stage">
        {typeof KiboBlob === 'function' && (
          <KiboBlob
            size={size}
            ground={false}
            mood={mood || 'calma'}
            gesture={kind === 'trick' && tick ? id + '#' + tick : null}
            styleOverride={styleOverride || { aura: 'au-none', toy: 'toy-none', mark: 'mk-none' }} />
        )}
      </div>
      <div className="opc-anim-meta">
        <strong>{name}</strong>
        <code>{id}</code>
        {desc && <span>{desc}</span>}
      </div>
      {kind === 'trick' && (
        <button type="button" className="opc-anim-play" title="Repetir ahora"
                onClick={() => setTick(x => x + 1)}>
          <KIcon name="repeat" size={12} /> repetir
        </button>
      )}
    </div>
  );
}

function AnimGroup({ title, note, children }) {
  return (
    <div className="opc-anim-group">
      <div className="opc-anim-head">
        <h3>{title}</h3>
        {note && <span>{note}</span>}
      </div>
      <div className="opc-anim-grid">{children}</div>
    </div>
  );
}

function KiboAnimCatalog() {
  const tricks = (window.KIBO_TRICK_LIST || []);
  const toyTricks = Object.entries(window.KIBO_TOY_TRICKS || {});
  const moods = Object.keys(window.KIBO_MOODS || {});
  const auras = (window.KIBO_AURAS || []).filter(a => a.id !== 'au-none');
  const skins = (window.KIBO_SKINS || []).filter(s => s.animated);
  const pers = (window.KIBO_PERS || []);

  return (
    <div className="opc-anim-catalog">
      <AnimGroup title="Travesuras" note={`${tricks.length} en el repertorio base · se repiten solas cada 4.6 s`}>
        {tricks.map((t, i) => (
          <AnimCell key={t.id} id={t.id} name={t.name} desc={t.desc} kind="trick" delay={i * 260} />
        ))}
      </AnimGroup>

      <AnimGroup title="Travesuras con juguete" note="solo entran al repertorio si ese juguete está equipado">
        {toyTricks.map(([toy, t], i) => (
          <AnimCell key={toy} id={t.id} name={t.name} desc={`${t.desc} · requiere ${toy}`} kind="trick"
                    delay={i * 300} styleOverride={{ aura: 'au-none', mark: 'mk-none', toy }} />
        ))}
      </AnimGroup>

      <AnimGroup title="Ánimos" note="no son animaciones sueltas: cada uno cambia color, ojos, pupila y boca — y sale de tu vida (HP)">
        {moods.map(m => (
          <AnimCell key={m} id={m} name={m.charAt(0).toUpperCase() + m.slice(1)} kind="mood" mood={m} />
        ))}
      </AnimGroup>

      <AnimGroup title="Auras" note="partículas y halos detrás del cuerpo — corren en bucle, sin disparo">
        {auras.map(a => (
          <AnimCell key={a.id} id={a.id} name={a.name} desc={a.desc} kind="aura"
                    styleOverride={{ aura: a.id, toy: 'toy-none', mark: 'mk-none' }} />
        ))}
      </AnimGroup>

      <AnimGroup title="Pieles animadas" note="lienzo vivo que se ve a través del gel">
        {skins.map(s => (
          <AnimCell key={s.id} id={s.id} name={s.name} desc={s.desc} kind="skin"
                    styleOverride={{ skin: s.id, aura: 'au-none', toy: 'toy-none', mark: 'mk-none' }} />
        ))}
      </AnimGroup>

      <AnimGroup title="Personalidades" note="no dibujan nada: deciden QUÉ travesuras y CADA CUÁNTO">
        {pers.map(p => (
          <div key={p.id} className="opc-anim opc-anim-text">
            <div className="opc-anim-meta">
              <strong>{p.name}</strong>
              <code>{p.id}</code>
              <span>{p.desc}</span>
              <span className="opc-anim-tags">
                {p.idleMs ? `cada ${p.idleMs[0] / 1000}–${p.idleMs[1] / 1000} s` : 'nunca (quieto)'}
                {p.tricks ? ` · ${p.tricks.join(', ')}` : ' · todas'}
              </span>
            </div>
          </div>
        ))}
      </AnimGroup>

      <AnimGroup title="Siempre encendidas" note="el fondo vivo del personaje — sin disparo, no se pueden apagar">
        <div className="opc-anim opc-anim-text">
          <div className="opc-anim-meta">
            <strong>Respiración del gel</strong><code>kbBlob · 6.5 s</code>
            <span>El contorno del cuerpo late; la cara va recortada a esa silueta.</span>
          </div>
        </div>
        <div className="opc-anim opc-anim-text">
          <div className="opc-anim-meta">
            <strong>Flotar</strong><code>kbFloat · 4.6 s</code>
            <span>Sube y baja con una inclinación mínima.</span>
          </div>
        </div>
        <div className="opc-anim opc-anim-text">
          <div className="opc-anim-meta">
            <strong>Parpadeo</strong><code>kbBlink · 5.2 s</code>
            <span>Un solo ciclo para los dos ojos, para que cierren exactamente a la vez.</span>
          </div>
        </div>
        <div className="opc-anim opc-anim-text">
          <div className="opc-anim-meta">
            <strong>Mirada</strong><code>kbGaze · 9 s</code>
            <span>Los ojos se van de lado y vuelven.</span>
          </div>
        </div>
        <div className="opc-anim opc-anim-text">
          <div className="opc-anim-meta">
            <strong>Boca en reposo</strong><code>mouthIdle · 5 s</code>
            <span>El trazo se estira y encoge un poco; cambia de ritmo con el ánimo.</span>
          </div>
        </div>
        <div className="opc-anim opc-anim-text">
          <div className="opc-anim-meta">
            <strong>Manopies en órbita</strong><code>bubMorph / translate</code>
            <span>Orbitan el cuerpo y se esconden en reposo. Van en <code>translate</code>, no en <code>transform</code>.</span>
          </div>
        </div>
        <div className="opc-anim opc-anim-text">
          <div className="opc-anim-meta">
            <strong>Sombra de cristal</strong><code>kbGround · 4.6 s</code>
            <span>La mancha del piso respira con el cuerpo (se apaga con <code>ground=false</code>).</span>
          </div>
        </div>
        <div className="opc-anim opc-anim-text">
          <div className="opc-anim-meta">
            <strong>Jalar el gel</strong><code>kbw-pull</code>
            <span>Solo dentro de la rueda: se estira hacia el cursor y rebota al soltar.</span>
          </div>
        </div>
      </AnimGroup>
    </div>
  );
}

function KiboOptionView3(props) {
  if (props.variant === 'anim-catalog') return <KiboAnimCatalog />;
  return typeof OPC3_PREV_VIEW === 'function' ? React.createElement(OPC3_PREV_VIEW, props) : null;
}

Object.assign(window, { KiboOptionView: KiboOptionView3, KiboAnimCatalog });
