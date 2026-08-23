export interface KbChipProps {
  /** selected state */
  on?: boolean;
  /** optional leading dot color (area/priority) */
  color?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function KbChip(props: KbChipProps): JSX.Element;
