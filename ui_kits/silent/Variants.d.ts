import * as React from 'react';
export type BtnWidthName = 'Icon' | 'IconLg' | 'Index' | 'M' | 'L' | 'XL' | 'XXL' | 'LaunchEntry' | 'LaunchAdd' | 'Auto';
export declare const BTN_WIDTH: Record<BtnWidthName, number | null>;
export declare const BUTTONS: Record<string, { role: string; w: BtnWidthName; label?: string; icon?: string; iconSize?: number; title?: string; dataLabel?: boolean; args?: boolean }>;
export declare function Btn(p: { id: string; label?: React.ReactNode; args?: any; onClick?: () => void; disabled?: boolean; title?: string; className?: string }): JSX.Element;
export type PillWidthName = 'M' | 'L' | 'Auto';
export declare const PILL_WIDTH: Record<PillWidthName, number | null>;
export declare const PILLS: Record<string, { tone: string; w: PillWidthName; label: string; icon?: string; dataLabel?: boolean }>;
export declare function Pill(p: { id: string; label?: React.ReactNode }): JSX.Element;
export interface VariantsNamespace { Btn: typeof Btn; Pill: typeof Pill; }
export declare const Variants: VariantsNamespace;
