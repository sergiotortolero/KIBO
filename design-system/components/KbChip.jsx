export function KbChip({ on, color, children, onClick, style }) {
  return (
    <button type="button" className={'kbv-chip' + (on ? ' active' : '')} onClick={onClick} style={style}>
      {color ? <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: color, marginRight: 6 }} /> : null}
      {children}
    </button>
  );
}
