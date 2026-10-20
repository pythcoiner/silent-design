/* Silent UI Kit — Layout & typography generics.
   The atomic building blocks every view composes. No view should hand-roll a
   flex container, a styled <span> of text, or a raw amount string — it goes
   through these so the structure translates 1:1 to Qt widgets/layouts.

   Qt mapping:
     Stack   -> QVBoxLayout            Text    -> theme::Label
     Row     -> QHBoxLayout            Amount  -> Label (mono) compositions
     Spacer  -> addStretch / spacing   Divider -> QFrame(HLine/VLine)
*/

/* Resolve a spacing prop: number -> px, token name -> var(--space-<t>), else passthrough. */
function spaceVal(v) {
  if (v == null || v === false) return undefined;
  if (v === true) return 'var(--space-m)';
  if (typeof v === 'number') return v + 'px';
  if (['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'].includes(v)) return `var(--space-${v})`;
  return v;
}

/* Stack — vertical flex (QVBoxLayout). gap/align/justify are the layout knobs. */
export function Stack({ gap, align, justify, grow, wrap, inline, className = '', style, children, ...rest }) {
  const dom = { ...rest }; ['gap', 'align', 'justify', 'grow', 'wrap', 'inline'].forEach(k => delete dom[k]);
  return (
    <div className={className} style={{
      display: inline ? 'inline-flex' : 'flex', flexDirection: 'column',
      gap: spaceVal(gap), alignItems: align, justifyContent: justify,
      flex: grow ? 1 : undefined, flexWrap: wrap ? 'wrap' : undefined,
      minWidth: 0, boxSizing: 'border-box', ...style }} {...dom}>
      {children}
    </div>
  );
}

/* Row — horizontal flex (QHBoxLayout). Defaults to vertically-centered items. */
export function Row({ gap, align = 'center', justify, grow, wrap, inline, className = '', style, children, ...rest }) {
  const dom = { ...rest }; ['gap', 'align', 'justify', 'grow', 'wrap', 'inline'].forEach(k => delete dom[k]);
  return (
    <div className={className} style={{
      display: inline ? 'inline-flex' : 'flex', flexDirection: 'row',
      gap: spaceVal(gap), alignItems: align, justifyContent: justify,
      flex: grow ? 1 : undefined, flexWrap: wrap ? 'wrap' : undefined,
      minWidth: 0, boxSizing: 'border-box', ...style }} {...dom}>
      {children}
    </div>
  );
}

/* Spacer — eats free space (addStretch) or holds a fixed gap. */
export function Spacer({ size }) {
  return <span style={{ flex: size == null ? 1 : 'none', width: size != null ? spaceVal(size) : undefined,
    height: size != null ? spaceVal(size) : undefined }} />;
}

/* Divider — a hair rule. Horizontal by default; `vertical` for column splits.
   `space` sets the margin along the flow axis. */
export function Divider({ vertical = false, space = 'm', style }) {
  const m = spaceVal(space);
  return vertical
    ? <div style={{ flex: 'none', alignSelf: 'stretch', width: 1, background: 'var(--border-light)', margin: `0 ${m}`, ...style }} />
    : <div style={{ height: 1, background: 'var(--border-light)', margin: `${m} 0`, ...style }} />;
}

/* Text — the single typographic primitive (theme::Label). `variant` selects a
   FontPalette role (t-* class); the rest are targeted overrides so callers never
   reach for an inline font recipe. */
const TEXT_CLASS = {
  title: 't-title', heading: 't-heading', subheading: 't-subheading',
  section: 't-section', body: 't-body', secondary: 't-info-label',
  caption: 't-caption', status: 't-status', mono: 't-mono',
};
const TEXT_COLOR = {
  text: 'var(--text)', secondary: 'var(--text-secondary)', muted: 'var(--text-muted)',
  accent: 'var(--accent)', success: 'var(--success)', error: 'var(--error)',
  warning: 'var(--warning)', 'on-accent': 'var(--on-accent)',
  /* on a fixed dark surface (camera viewport), whatever the theme */
  inverse: 'var(--gray-10)', 'inverse-muted': 'var(--gray-40)',
};
/* size overrides the variant's font size with a token step: sm (caption) | md (body) | lg (section) | inherit. */
const TEXT_SIZE = { sm: 'var(--size-caption)', md: 'var(--size-body)', lg: 'var(--size-section)', inherit: 'inherit' };
export function Text(props) {
  const { as = 'span', variant = 'body', color, weight, mono, caps, align, nowrap, size, wrap,
    truncate, className = '', style, children, ...rest } = props;
  const As = as;
  const cls = `${TEXT_CLASS[variant] || 't-body'}${mono && variant !== 'mono' ? ' t-mono' : ''} ${className}`;
  const st = {
    color: color ? (TEXT_COLOR[color] || color) : undefined,
    fontWeight: weight === 'demibold' ? 600 : weight === 'normal' ? 400 : weight,
    textAlign: align,
    fontSize: size ? TEXT_SIZE[size] : undefined,
    wordBreak: wrap === 'anywhere' ? 'break-all' : undefined,
    textTransform: caps ? 'uppercase' : undefined,
    letterSpacing: caps ? '0.08em' : undefined,
    whiteSpace: nowrap || truncate ? 'nowrap' : undefined,
    overflow: truncate ? 'hidden' : undefined,
    textOverflow: truncate ? 'ellipsis' : undefined,
    ...style,
  };
  const dom = { ...rest };
  ['as', 'variant', 'color', 'weight', 'mono', 'caps', 'align', 'nowrap', 'truncate', 'size', 'wrap'].forEach(k => delete dom[k]);
  return <As className={cls.trim()} style={st} {...dom}>{children}</As>;
}

/* Eyebrow — the uppercase mono section caption (was SectionLabel). */
export function Eyebrow({ size = 11, color = 'secondary', className = '', style, children, ...rest }) {
  return (
    <Text as="div" variant="mono" color={color} className={className} {...rest}
      style={{ fontSize: size, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', lineHeight: 1.4, ...style }}>
      {children}
    </Text>
  );
}

/* Amount display mode — one app-wide setting, cycled BTC → fiat → hidden (****) from
   by clicking any displayed amount (Amount, BtcText). `fixed` opts out (the Send panel:
   amounts there stay BTC and are not clickable).
   Qt: a global setting + a signal each amount label listens to. */
const AMOUNT_MODES = ['btc', 'fiat', 'hidden'];
const AMOUNT_RATE = 68000; /* kit spot price, USD per BTC (the app: price oracle) */
let amountMode = 'btc';
const amountSubs = new Set();
export function cycleAmountMode() {
  amountMode = AMOUNT_MODES[(AMOUNT_MODES.indexOf(amountMode) + 1) % AMOUNT_MODES.length];
  amountSubs.forEach(f => f(amountMode));
}
export function useAmountMode() {
  const [m, setM] = React.useState(amountMode);
  React.useEffect(() => { amountSubs.add(setM); return () => amountSubs.delete(setM); }, []);
  return m;
}
/* the amount as [number, unit] in a mode; btc is a number or a decimal string */
export function amountParts(btc, mode) {
  const n = typeof btc === 'number' ? btc : parseFloat(btc) || 0;
  if (mode === 'hidden') return ['****', null];
  if (mode === 'fiat') return [(n * AMOUNT_RATE).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 'USD'];
  return [n.toFixed(8), 'BTC'];
}
/* BtcText — a BTC amount as plain text in the current mode (table cells, summaries). */
const cycleClick = e => { e.stopPropagation(); cycleAmountMode(); };
export function BtcText({ btc, fixed = false }) {
  const mode = useAmountMode();
  const [v, u] = amountParts(btc, fixed ? 'btc' : mode);
  const text = u ? `${v} ${u}` : v;
  return fixed ? text : <span onClick={cycleClick} style={{ cursor: 'pointer' }} title="Show as BTC / USD / hidden">{text}</span>;
}

/* Amount — a Bitcoin amount: mono number + unit, with optional sign and coin count.
   size: sm | md | lg | hero. tone tints the number (e.g. 'muted' for change). */
/* reserve: a fixed-width amount (the balance header) — room for 999.99999999 BTC and its
   USD (67,999,999.32: 13 mono digits + sign), right-aligned, so toggling never shifts it. */
const AMOUNT_RESERVE = { display: 'inline-block', minWidth: '14ch', textAlign: 'right' };
const AMOUNT_SIZE = { sm: 13, md: 15, lg: 19, hero: 30 };
export function Amount({ value: raw, unit: rawUnit = 'BTC', size = 'md', sign: rawSign, tone, count, nowrap = true, fixed = false, reserve = false, style }) {
  const live = useAmountMode();
  const mode = fixed ? 'btc' : live;
  const toggles = rawUnit === 'BTC' && !fixed;
  /* a BTC amount follows the display mode; other units render as given */
  const [value, unit] = rawUnit === 'BTC' ? amountParts(raw, mode) : [raw, rawUnit];
  const sign = rawUnit === 'BTC' && mode === 'hidden' ? '' : rawSign;
  const px = AMOUNT_SIZE[size] || AMOUNT_SIZE.md;
  const col = tone ? (TEXT_COLOR[tone] || tone) : 'var(--text)';
  return (
    <span onClick={toggles ? cycleClick : undefined} title={toggles ? 'Show as BTC / USD / hidden' : undefined}
      style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, whiteSpace: nowrap ? 'nowrap' : undefined, cursor: toggles ? 'pointer' : undefined, ...style }}>
      <span style={{ font: `600 ${px}px var(--font-mono)`, letterSpacing: size === 'hero' ? '-0.015em' : 0,
        lineHeight: 1, color: col, ...(reserve ? AMOUNT_RESERVE : null) }}>{sign || ''}{value}</span>
      {unit || reserve ? <span style={{ font: `${Math.max(11, px * 0.5) | 0}px var(--font-mono)`, color: 'var(--text-muted)', minWidth: reserve ? '3ch' : undefined }}>{unit || ''}</span> : null}
      {count != null ? <span style={{ font: '12px var(--font-sans)', color: 'var(--text-secondary)', marginLeft: 2 }}>{count}</span> : null}
    </span>
  );
}

Object.assign(window, { Stack, Row, Spacer, Divider, Text, Eyebrow, Amount, spaceVal, BtcText, useAmountMode, cycleAmountMode, amountParts, AMOUNT_RATE });

/* File-level namespace (DS compiler indexes this file as `Layout`). */
export const Layout = { Stack, Row, Spacer, Divider, Text, Eyebrow, Amount, BtcText };
