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

/* Amount — a Bitcoin amount: mono number + unit, with optional sign and coin count.
   size: sm | md | lg | hero. tone tints the number (e.g. 'muted' for change). */
const AMOUNT_SIZE = { sm: 13, md: 15, lg: 19, hero: 30 };
export function Amount({ value, unit = 'BTC', size = 'md', sign, tone, count, nowrap = true, style }) {
  const px = AMOUNT_SIZE[size] || AMOUNT_SIZE.md;
  const col = tone ? (TEXT_COLOR[tone] || tone) : 'var(--text)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, whiteSpace: nowrap ? 'nowrap' : undefined, ...style }}>
      <span style={{ font: `600 ${px}px var(--font-mono)`, letterSpacing: size === 'hero' ? '-0.015em' : 0,
        lineHeight: 1, color: col }}>{sign || ''}{value}</span>
      {unit ? <span style={{ font: `${Math.max(11, px * 0.5) | 0}px var(--font-mono)`, color: 'var(--text-muted)' }}>{unit}</span> : null}
      {count != null ? <span style={{ font: '12px var(--font-sans)', color: 'var(--text-secondary)', marginLeft: 2 }}>{count}</span> : null}
    </span>
  );
}

Object.assign(window, { Stack, Row, Spacer, Divider, Text, Eyebrow, Amount, spaceVal });

/* File-level namespace (DS compiler indexes this file as `Layout`). */
export const Layout = { Stack, Row, Spacer, Divider, Text, Eyebrow, Amount };
