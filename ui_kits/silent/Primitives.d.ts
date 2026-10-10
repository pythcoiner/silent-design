import * as React from 'react';
type Children = { children?: React.ReactNode };
export declare function Button(p: Children & { role?: 'default' | 'primary' | 'destructive' | 'menu' | string; icon?: string; iconSize?: number; className?: string; onClick?: () => void; disabled?: boolean; title?: string; style?: React.CSSProperties }): JSX.Element;
export declare function Input(p: { mono?: boolean; width?: number | string; grow?: boolean; className?: string; value?: string; placeholder?: string; onChange?: (e: any) => void; [k: string]: any }): JSX.Element;
export declare function TextArea(p: { mono?: boolean; width?: number | string; height?: number; className?: string; style?: React.CSSProperties; [k: string]: any }): JSX.Element;
export declare function Display(p: { value: React.ReactNode; variant?: 'default' | 'mono' | 'amount'; width?: number | string; className?: string }): JSX.Element;
export declare function Field(p: Children & { label: React.ReactNode; labelWidth?: number | string; align?: string }): JSX.Element;
export declare function FieldGroup(p: Children & { gap?: string | number }): JSX.Element;
export declare function Checkbox(p: { checked?: boolean; onChange?: (v: boolean) => void; label?: React.ReactNode; disabled?: boolean; sm?: boolean }): JSX.Element;
export declare function Toggle(p: { on?: boolean; status?: boolean; disabled?: boolean; onClick?: () => void }): JSX.Element;
export declare function Spinner(p: { size?: number }): JSX.Element;
export declare function Card(p: Children & { tone?: 'surface' | 'inset'; className?: string; style?: React.CSSProperties; [k: string]: any }): JSX.Element;
export declare function Badge(p: Children & { tone?: 'success' | 'warning' | 'error' | 'neutral' | 'off'; icon?: string; iconSize?: number; width?: 'M' | 'L' | 'Auto'; style?: React.CSSProperties }): JSX.Element;
export declare function SelectRow(p: { icon?: string; iconSize?: number | string; title: React.ReactNode; sub?: React.ReactNode; meta?: React.ReactNode; status?: React.ReactNode; trailing?: React.ReactNode; onClick?: () => void; chevron?: boolean; selected?: boolean; current?: boolean; disabled?: boolean; tone?: 'error'; metaWidth?: number | string; statusWidth?: number | string; trailingWidth?: number | string; style?: React.CSSProperties }): JSX.Element;
export declare function Notice(p: Children & { tone?: 'error' | 'warning' | 'success' | 'info'; title?: React.ReactNode; action?: React.ReactNode; icon?: string; style?: React.CSSProperties }): JSX.Element;
export declare function ModalStatus(p: Children & { spinner?: boolean; icon?: string; iconSize?: number | string; iconColor?: string; title?: React.ReactNode; subtitle?: React.ReactNode; pad?: string }): JSX.Element;
export declare function Legend(p: Children & { color: string }): JSX.Element;
export declare function ComboBox(p: { value: string; options: string[]; onChange?: (v: string) => void; width?: number }): JSX.Element;
export declare function ValidationMark(p: { state: 'valid' | 'invalid' | 'none' }): JSX.Element;
export declare function BalanceHeader(p: { wallet: { confirmed: string; unconfirmed: string; confirmedCount?: React.ReactNode; unconfirmedCount?: React.ReactNode } }): JSX.Element;
export declare function Tab(p: { label: React.ReactNode; active?: boolean; closable?: boolean; onClick?: () => void; onClose?: () => void }): JSX.Element;

export interface PrimitivesNamespace { Button: typeof Button; Input: typeof Input; TextArea: typeof TextArea; Display: typeof Display; Field: typeof Field; FieldGroup: typeof FieldGroup; Checkbox: typeof Checkbox; Toggle: typeof Toggle; Spinner: typeof Spinner; Card: typeof Card; Badge: typeof Badge; SelectRow: typeof SelectRow; Notice: typeof Notice; ModalStatus: typeof ModalStatus; Legend: typeof Legend; ComboBox: typeof ComboBox; ValidationMark: typeof ValidationMark; BalanceHeader: typeof BalanceHeader; Tab: typeof Tab; }
export declare const Primitives: PrimitivesNamespace;
