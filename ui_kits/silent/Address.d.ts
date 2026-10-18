import * as React from 'react';
export interface QRCardProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function QRCard(props: QRCardProps): JSX.Element;
export interface QRCodeProps { children?: React.ReactNode; style?: React.CSSProperties; [prop: string]: any }
export declare function QRCode(props: QRCodeProps): JSX.Element;
export interface ChunkedAddressProps { text: string; wrap?: boolean; align?: 'center' | 'left'; oneRow?: boolean; [prop: string]: any }
export declare function ChunkedAddress(props: ChunkedAddressProps): JSX.Element;
export interface AddressNamespace { QRCard: typeof QRCard; QRCode: typeof QRCode; ChunkedAddress: typeof ChunkedAddress; }
export declare const Address: AddressNamespace;
