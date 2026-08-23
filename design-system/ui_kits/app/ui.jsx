/* Kibo App kit — shared primitives */

function Button({ variant = 'primary', children, onClick, type = 'button', style }) {
  return (
    <button type={type} onClick={onClick} className={`kbv-btn kbv-btn-${variant}`} style={style}>
      {children}
    </button>
  );
}

function Bar({ pct, color = 'var(--kb-primary)', track }) {
  return (
    <div className="kbv-bar" style={track ? { background: track } : null}>
      <i style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function StatPill({ children, style }) {
  return <span className="kb-statpill" style={style}>{children}</span>;
}

function Chip({ on, children, onClick }) {
  return <button className={`kbv-chip${on ? ' on' : ''}`} onClick={onClick}>{children}</button>;
}

function Modal({ title, onClose, children, foot }) {
  return (
    <div className="kbv-modal-veil" onClick={onClose}>
      <div className="kbv-modal-card fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="kbv-modal-head">
          <h3 className="kb-card-title">{title}</h3>
          <button className="kbv-btn kbv-icon-btn" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="kbv-modal-body">{children}</div>
        {foot && <div className="kbv-modal-foot">{foot}</div>}
      </div>
    </div>
  );
}

// Hexagonal rank emblem.
function Emblem({ rank, size = 46, num, locked }) {
  const fontSize = Math.round(size * 0.26);
  if (locked || (rank && rank.unlocked === false)) {
    return (
      <div className="kb-emblem locked" style={{ width: size, height: size * 1.13, fontSize }}>
        <Icon name="lock" size={size * 0.34} />
      </div>
    );
  }
  return (
    <div className="kb-emblem" style={{
      width: size, height: size * 1.13, fontSize,
      background: `linear-gradient(145deg, ${rank.a}, ${rank.b})`, color: rank.ink,
    }}>{num}</div>
  );
}

Object.assign(window, { Button, Bar, StatPill, Chip, Modal, Emblem });
