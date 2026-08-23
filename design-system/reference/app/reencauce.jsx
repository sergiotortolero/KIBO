// reencauce.jsx — «el fracaso reencauza».
//
// La promesa de marca decía que un fallo redirige, nunca castiga, pero el
// sistema solo sabía restar vida: fallabas, perdías HP y ahí acababa la
// historia. Esto cierra el ciclo. Cuando algo falla, KIBO no regaña: ofrece
// una versión MÁS PEQUEÑA del compromiso para mañana (y devuelve la mitad del
// golpe si la aceptas) y, si la racha estaba en juego, un día de gracia.
//
// El día de gracia es uno por semana y no se compra: si se pudiera comprar,
// dejaría de ser una red y sería una moneda más.

const RC_GRACE_KEY = 'kibo:grace-used';   // ISO de la semana en que se usó
const RC_ROUTES_KEY = 'kibo:reencauces';  // los compromisos aceptados

function rcWeek(d) {
  const t = d || new Date();
  const on = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()));
  const day = on.getUTCDay() || 7;
  on.setUTCDate(on.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(on.getUTCFullYear(), 0, 1));
  return `${on.getUTCFullYear()}-W${Math.ceil((((on - y0) / 86400000) + 1) / 7)}`;
}
function rcGraceLeft() {
  try { return localStorage.getItem(RC_GRACE_KEY) !== rcWeek(); } catch (_) { return true; }
}
function rcUseGrace() {
  try { localStorage.setItem(RC_GRACE_KEY, rcWeek()); } catch (_) {}
  try { window.dispatchEvent(new CustomEvent('kibo:grace-used')); } catch (_) {}
}
function rcRoutes() {
  try { const v = JSON.parse(localStorage.getItem(RC_ROUTES_KEY) || '[]'); return Array.isArray(v) ? v : []; }
  catch (_) { return []; }
}
function rcAddRoute(r) {
  const list = [{ ...r, at: Date.now() }, ...rcRoutes()].slice(0, 12);
  try { localStorage.setItem(RC_ROUTES_KEY, JSON.stringify(list)); } catch (_) {}
  try { window.dispatchEvent(new CustomEvent('kibo:reencauce', { detail: r })); } catch (_) {}
}

// La versión pequeña de cada cosa. No es «lo mismo pero menos»: es el mínimo
// que mantiene el hábito vivo — la mitad, el arranque, un solo paso.
const RC_SMALLER = {
  habit:  [{ n: 'La mitad, mañana', d: 'Medio hábito cuenta como día vivo.' },
           { n: 'Solo empezar', d: 'Dos minutos y lo dejas si quieres.' }],
  reto:   [{ n: 'Un día de gracia', d: 'El reto sigue; el día no cuenta en contra.' },
           { n: 'Bajar la meta un escalón', d: 'Menos exigente, mismo reto.' }],
  task:   [{ n: 'Partirla en dos', d: 'La mitad hoy, la mitad mañana.' },
           { n: 'Mover a mañana', d: 'Sin penalización si la agendas.' }],
  study:  [{ n: 'Un pomodoro', d: '25 minutos y listo.' }],
  health: [{ n: 'Diez minutos', d: 'Movimiento corto, cuenta igual.' }],
  read:   [{ n: 'Cinco páginas', d: 'Lo justo para no romper el hilo.' }],
  otro:   [{ n: 'La mitad, mañana', d: 'Bajarle a la mitad es seguir.' }],
};

function ReencauceCard() {
  const [fail, setFail] = React.useState(null);
  const [grace, setGrace] = React.useState(rcGraceLeft);

  React.useEffect(() => {
    const h = (e) => {
      const d = (e && e.detail) || {};
      if (d.kind !== 'fail') return;
      setFail({ label: d.label || 'Algo no salió', of: d.of || 'otro', amount: Math.abs(d.amount || 0), id: Math.random() });
    };
    const g = () => setGrace(rcGraceLeft());
    window.addEventListener('kibo:action', h);
    window.addEventListener('kibo:grace-used', g);
    return () => { window.removeEventListener('kibo:action', h); window.removeEventListener('kibo:grace-used', g); };
  }, []);

  // Se va sola: una tarjeta de fallo que se queda hasta que la cierres acaba
  // siendo un regaño permanente en la esquina.
  React.useEffect(() => {
    if (!fail) return;
    const t = setTimeout(() => setFail(null), 14000);
    return () => clearTimeout(t);
  }, [fail]);

  if (!fail) return null;
  const options = RC_SMALLER[fail.of] || RC_SMALLER.otro;

  function take(o) {
    rcAddRoute({ of: fail.of, label: fail.label, route: o.n });
    // Aceptar el reencauce devuelve la mitad del golpe: el fallo sigue
    // costando, pero recomponerse vale algo.
    if (fail.amount && typeof healHP === 'function') healHP(Math.round(fail.amount / 2), 'Reencauzaste');
    setFail(null);
  }

  return (
    <div className="rc-card" role="status">
      <div className="rc-head">
        <span className="rc-ico"><KIcon name="repeat" size={16} /></span>
        <div className="rc-txt">
          <strong>El fracaso reencauza</strong>
          <span>{fail.label}. Escoge algo más pequeño y sigues de pie.</span>
        </div>
        <button type="button" className="rc-x" onClick={() => setFail(null)} aria-label="Cerrar"><KIcon name="x" size={13} /></button>
      </div>
      <div className="rc-opts">
        {options.map(o => (
          <button key={o.n} type="button" className="rc-opt" onClick={() => take(o)}>
            <strong>{o.n}</strong><span>{o.d}</span>
          </button>
        ))}
        {grace && (
          <button type="button" className="rc-opt grace"
                  onClick={() => { rcUseGrace(); rcAddRoute({ of: fail.of, label: fail.label, route: 'Día de gracia' });
                                   if (fail.amount && typeof healHP === 'function') healHP(fail.amount, 'Día de gracia'); setFail(null); }}>
            <strong><KIcon name="shield" size={12} /> Día de gracia</strong>
            <span>Uno por semana. Tu racha no se rompe.</span>
          </button>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ReencauceCard, rcGraceLeft, rcUseGrace, rcRoutes, rcAddRoute });
