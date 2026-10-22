import * as React from 'react';
export interface SectionLabelProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function SectionLabel(props: SectionLabelProps): JSX.Element;
export interface FieldLabelProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function FieldLabel(props: FieldLabelProps): JSX.Element;
export interface PaymentRowProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function PaymentRow(props: PaymentRowProps): JSX.Element;
export interface ValidatedInputProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function ValidatedInput(props: ValidatedInputProps): JSX.Element;
export interface EndpointRowProps {
  label: React.ReactNode; value: string; onChange: (value: string) => void;
  test?: 'testing' | 'ok' | { error: string } | null; onTest: () => void;
  placeholder?: string; available?: boolean; testAvailable?: boolean;
  labelAbove?: boolean; rightControls?: React.ReactNode;
}
export declare function EndpointRow(props: EndpointRowProps): JSX.Element;
export interface StepperProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function Stepper(props: StepperProps): JSX.Element;
export interface TooltipProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function Tooltip(props: TooltipProps): JSX.Element;
export interface FoldSectionProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function FoldSection(props: FoldSectionProps): JSX.Element;
export interface IndexPillProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function IndexPill(props: IndexPillProps): JSX.Element;
export interface KeyValueProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function KeyValue(props: KeyValueProps): JSX.Element;
export interface TableProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function Table(props: TableProps): JSX.Element;
export interface TransactionSummaryProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function TransactionSummary(props: TransactionSummaryProps): JSX.Element;
export interface CoinTableProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function CoinTable(props: CoinTableProps): JSX.Element;
export interface SectionHeaderProps { label: React.ReactNode; count?: React.ReactNode; action?: React.ReactNode; open?: boolean; onToggle?: () => void; dense?: boolean; style?: React.CSSProperties }
export declare function SectionHeader(props: SectionHeaderProps): JSX.Element;
export declare function Section(props: SectionHeaderProps & { children?: React.ReactNode }): JSX.Element;
export interface CopyFieldProps { value: string; wrap?: boolean; title?: string; style?: React.CSSProperties }
export declare function CopyField(props: CopyFieldProps): JSX.Element;
export declare function ShortValue(props: { value: string; head?: number; tail?: number; title?: string }): JSX.Element;
export interface WordGridProps { words: string[]; hidden?: boolean; columns?: number }
export declare function WordInputGrid(props: { words: string[]; onChange: (w: string[]) => void; isWord?: (w: string) => boolean; columns?: number }): JSX.Element;
export declare function WordGrid(props: WordGridProps): JSX.Element;
export interface RouteIconsProps { routes: Array<'hot' | 'usb' | 'qr' | 'sd'>; size?: number }
export declare function RouteIcons(props: RouteIconsProps): JSX.Element;
export declare const ROUTE_KINDS: Record<'hot' | 'usb' | 'qr' | 'sd', { label: string; icon: string }>;
export interface ScanProgressProps { got: number; total: number; done?: boolean }
export declare function ScanProgress(props: ScanProgressProps): JSX.Element;
export interface ModalActionsProps { onBack?: () => void; backId?: string; reason?: React.ReactNode; children?: React.ReactNode; style?: React.CSSProperties }
export declare function ModalActions(props: ModalActionsProps): JSX.Element;
export interface ScrollAreaProps { children?: React.ReactNode; style?: React.CSSProperties }
export declare function ScrollArea(props: ScrollAreaProps): JSX.Element;
export declare function FieldNote(props: { tone?: 'muted' | 'error' | 'success'; icon?: string; children?: React.ReactNode; style?: React.CSSProperties }): JSX.Element;
export declare function EmptyState(props: { icon?: string; title: React.ReactNode; subtitle?: React.ReactNode; action?: React.ReactNode }): JSX.Element;
export declare function FoldChevron(props: { open?: boolean }): JSX.Element;
export declare function InfoTip(props: { label: React.ReactNode }): JSX.Element;
export declare function timeAgo(value: string, now?: number): string;
export declare const DATE_COL_W: { full: string; compact: string };
export declare function DateStamp(props: { value?: string; compact?: boolean }): JSX.Element;
export declare function DirectionIcon(props: { dir: 'Incoming' | 'Outgoing' | 'Self' }): JSX.Element;
export declare function ConfirmDots(props: { n?: number }): JSX.Element;
export declare function prettyDescriptor(d: string, aliases?: Record<string, string>): string;
export declare function DescriptorView(props: { value: string; aliases?: Record<string, string> }): JSX.Element;
export declare function WizardSteps(props: { steps: string[]; current: number }): JSX.Element;
export interface WidgetsNamespace { SectionLabel: typeof SectionLabel; FieldLabel: typeof FieldLabel; PaymentRow: typeof PaymentRow; ValidatedInput: typeof ValidatedInput; EndpointRow: typeof EndpointRow; Stepper: typeof Stepper; Tooltip: typeof Tooltip; DateStamp: typeof DateStamp; DirectionIcon: typeof DirectionIcon; ConfirmDots: typeof ConfirmDots; DescriptorView: typeof DescriptorView; FoldSection: typeof FoldSection; IndexPill: typeof IndexPill; KeyValue: typeof KeyValue; Table: typeof Table; TransactionSummary: typeof TransactionSummary; CoinTable: typeof CoinTable; SectionHeader: typeof SectionHeader; Section: typeof Section; CopyField: typeof CopyField; ShortValue: typeof ShortValue; WordGrid: typeof WordGrid; WordInputGrid: typeof WordInputGrid; RouteIcons: typeof RouteIcons; ScanProgress: typeof ScanProgress; ModalActions: typeof ModalActions; ScrollArea: typeof ScrollArea; FieldNote: typeof FieldNote; EmptyState: typeof EmptyState; FoldChevron: typeof FoldChevron; WizardSteps: typeof WizardSteps; InfoTip: typeof InfoTip; }
export declare const Widgets: WidgetsNamespace;
