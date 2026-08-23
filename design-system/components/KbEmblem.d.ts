export interface KbEmblemProps {
  /** rank material */
  material?: 'bronce' | 'plata' | 'oro' | 'platino' | 'obsidiana' | 'diamante' | 'esmeralda' | 'rubi' | 'damasco';
  /** level number shown inside */
  level?: number;
  /** shield width px */
  size?: number;
  locked?: boolean;
}
export declare function KbEmblem(props: KbEmblemProps): JSX.Element;
