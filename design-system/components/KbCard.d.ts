export interface KbCardProps {
  /** boss/danger tinted card */
  boss?: boolean;
  /** render in hover (raised) state */
  hover?: boolean;
  title?: React.ReactNode;
  meta?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function KbCard(props: KbCardProps): JSX.Element;
