export function KbButton({ variant = 'primary', size, children, onClick, disabled, style }) {
  const cls = 'kbv-btn kbv-btn-' + variant + (size === 'sm' ? ' kbv-btn-sm' : '');
  return <button type="button" className={cls} onClick={onClick} disabled={disabled} style={style}>{children}</button>;
}
