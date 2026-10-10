import * as React from 'react';
export interface IconProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function Icon(props: IconProps): JSX.Element;
export interface SilentMarkProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function SilentMark(props: SilentMarkProps): JSX.Element;
export interface IconsNamespace { Icon: typeof Icon; SilentMark: typeof SilentMark; }
export declare const Icons: IconsNamespace;
