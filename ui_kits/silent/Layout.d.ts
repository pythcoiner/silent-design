import * as React from 'react';
export interface StackProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function Stack(props: StackProps): JSX.Element;
export interface RowProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function Row(props: RowProps): JSX.Element;
export interface SpacerProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function Spacer(props: SpacerProps): JSX.Element;
export interface DividerProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function Divider(props: DividerProps): JSX.Element;
export interface TextProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function Text(props: TextProps): JSX.Element;
export interface EyebrowProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function Eyebrow(props: EyebrowProps): JSX.Element;
export interface AmountProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function Amount(props: AmountProps): JSX.Element;
export interface LayoutNamespace { Stack: typeof Stack; Row: typeof Row; Spacer: typeof Spacer; Divider: typeof Divider; Text: typeof Text; Eyebrow: typeof Eyebrow; Amount: typeof Amount; }
export declare const Layout: LayoutNamespace;
