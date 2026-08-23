export interface KbStatPillProps {
  /** which currency/stat glyph */
  kind?: 'coin' | 'gem' | 'streak' | 'hp' | 'xp';
  value?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function KbStatPill(props: KbStatPillProps): JSX.Element;
