export interface KbButtonProps {
  /** visual variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
  size?: 'sm' | 'md';
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function KbButton(props: KbButtonProps): JSX.Element;
