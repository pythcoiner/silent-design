/* Silent UI Kit — Composite widget generics.
   One level up from Layout/Primitives: labelled rows, tables, disclosure,
   steppers, tooltips. Views and subcomponents compose THESE — never the raw
   markup they wrap. Each maps to a Qt widget or a small layout recipe.

   Loaded after Layout.jsx + Primitives.jsx, before any view. */

/* Eyebrow caption — uppercase mono section label (theme::Label, caption role). */
export function SectionLabel({ children, style, ...rest }) {
  return <Eyebrow color="muted" size={11} style={style} {...rest}>{children}</Eyebrow>;
}

/* Micro field label sitting above an input. */
export function FieldLabel({ children, style, ...rest }) {
  return <Eyebrow color="muted" size={10} style={{ letterSpacing: '0.12em', marginBottom: 6, ...style }} {...rest}>{children}</Eyebrow>;
}

/* PaymentRow — fixed-width right-aligned label + a flexible control (Liana form row). */
export function PaymentRow({ label, labelWidth = 89, align = 'center', children }) {
  return (
    <Row gap="m" align={align} style={{ padding: 'var(--space-xs) 0' }}>
      <Text variant="body" weight="demibold" align="right" nowrap
        style={{ width: labelWidth, flex: 'none', paddingTop: align === 'flex-start' ? 8 : 0 }}>{label}</Text>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </Row>
  );
}

/* ValidatedInput — Input with a fixed-width validation mark overlaid at the right.
   Qt: row->push(Input)->push(indicator Label, fixed width 20). */
export function ValidatedInput({ state, wrapStyle, ...inputProps }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', ...wrapStyle }}>
      <Input {...inputProps} style={{ flex: 1, minWidth: 0, boxSizing: 'border-box', paddingRight: 30 }} />
      <span style={{ position: 'absolute', right: 8, top: 0, bottom: 0, display: 'flex',
        alignItems: 'center', pointerEvents: 'none' }}>
        <ValidationMark state={state} />
      </span>
    </div>
  );
}

/* Stepper — − ●●●○○ + level control. Qt: row of two inline-icon Buttons + Label. */
export function Stepper({ label, value, min, max, onChange }) {
  const dots = '●'.repeat(value) + '○'.repeat(max - value);
  return (
    <Stack align="center" gap={6}>
      {label ? <Text variant="body" color="secondary" weight="500" nowrap>{label}</Text> : null}
      <Row gap="s">
        <Btn id="stepper_minus" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} />
        <span style={{ minWidth: 56, textAlign: 'center', font: '10px var(--font-mono)',
          letterSpacing: '1px', color: 'var(--accent)' }}>{dots}</span>
        <Btn id="stepper_plus" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} />
      </Row>
    </Stack>
  );
}

/* Tooltip — hover bubble above its child. */
export function Tooltip({ label, children }) {
  const [show, setShow] = React.useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show ? (
        <span style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
          whiteSpace: 'nowrap', background: 'var(--text)', color: 'var(--bg)', font: '500 11px var(--font-sans)',
          padding: '5px 9px', borderRadius: 'var(--radius-inline-icon)', zIndex: 60, pointerEvents: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
          {label}
          <span style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
            borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid var(--text)' }} />
        </span>
      ) : null}
    </span>
  );
}

/* FoldSection — disclosure: a chevron + eyebrow header that reveals its children. */
export function FoldSection({ id, label, open, onToggle, children }) {
  return (
    <div>
      <button onClick={() => onToggle(id)} style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-s)', width: '100%',
        background: 'none', border: 'none', padding: 'var(--space-s) 0', margin: 0,
        cursor: 'pointer', textAlign: 'left', color: 'inherit' }}>
        <FoldChevron open={open} />
        <span style={{ whiteSpace: 'nowrap' }}><SectionLabel>{label}</SectionLabel></span>
      </button>
      {open ? <div style={{ padding: '0 0 var(--space-m) calc(14px + var(--space-s))' }}>{children}</div> : null}
    </div>
  );
}

/* IndexPill — qr-glyph + derivation index, the row handle in the address list.
   A normal Button (s-btn), just sized 60×30 (Index × Icon) — no bespoke class. */
export function IndexPill({ index, active, onClick, title = 'Show QR code' }) {
  return (
    <Button role="index" className={active ? 'is-active' : ''} onClick={onClick} title={title}>
      <Icon name="qr" size={13} />
      <Text variant="mono" weight="demibold" size="sm">{index}</Text>
    </Button>
  );
}

/* KeyValue — a label/value summary line (left label, right value). Used by the
   transaction summary and settings rows. value defaults to mono.
   `sub` adds a muted second line under the value; `strong` enlarges + emphasizes
   it (the Send "Total" row). This subsumes the old Send-local SummaryRow. */
export function KeyValue({ label, value, sub, valueMono = true, valueColor, strong, align = 'center', pad, style }) {
  return (
    <Row justify="space-between" align={align} gap="m" style={{ padding: pad || 'var(--space-xxs) 0', ...style }}>
      <Text variant="body" color="secondary" nowrap>{label}</Text>
      <Stack align="flex-end" style={{ minWidth: 0 }}>
        <Text variant={valueMono ? 'mono' : 'body'} color={valueColor} nowrap
          weight={strong ? 'demibold' : undefined}
          style={{ textAlign: 'right', fontSize: strong ? 16 : undefined }}>{value}</Text>
        {sub ? <Text variant="mono" color="muted" nowrap style={{ fontSize: 11, marginTop: 2 }}>{sub}</Text> : null}
      </Stack>
    </Row>
  );
}

/* Table — data-driven table over the s-tbl classes.
   columns: [{ key, header, width, grow, align:'right', mono, muted, render(row,i) }]
   A column with `render` controls its own cell; otherwise row[key] is shown
   (optionally via `format(value,row)`). `muted` may be a bool or (row)=>bool.
   Selection/interaction: `hideHeader` drops the header row (a bare list, e.g.
   Send coin selection); `onRowClick(row,i)`, `rowClass(row,i)` (e.g.
   'is-selected') and `rowStyle(row,i)` make rows pickable. */
export function Table({ columns, rows, rowKey, maxHeight, bodyStyle, hideHeader, onRowClick, rowClass, rowStyle }) {
  const hcell = (c) => 's-tbl__hcell'
    + (c.align === 'right' ? ' s-tbl__hcell--amount' : '')
    + (c.grow ? ' s-tbl__cell--grow' : '');
  const cell = (c, row, i) => 's-tbl__cell'
    + (c.mono ? ' s-tbl__cell--mono' : '')
    + (c.align === 'right' ? ' s-tbl__cell--amount' : '')
    + (c.grow ? ' s-tbl__cell--grow' : '')
    + ((typeof c.muted === 'function' ? c.muted(row, i) : c.muted) ? ' s-tbl__cell--muted' : '');
  const w = (c, row, i) => ({ ...(c.width != null ? { width: c.width } : null),
    ...(c.cellStyle ? c.cellStyle(row, i) : null) });
  return (
    <div className="s-tbl">
      {hideHeader ? null : (
        <div className="s-tbl__head">
          {columns.map((c, ci) => <div key={ci} className={hcell(c)} style={c.width != null ? { width: c.width } : undefined}>{c.header}</div>)}
        </div>
      )}
      <div className="s-tbl__body" style={{ ...(maxHeight ? { maxHeight, overflowY: 'auto' } : null), ...bodyStyle }}>
        {rows.map((row, i) => (
          <div className={'s-tbl__row' + (rowClass ? ' ' + (rowClass(row, i) || '') : '')}
            key={rowKey ? rowKey(row, i) : i}
            style={rowStyle ? rowStyle(row, i) : undefined}
            onClick={onRowClick ? () => onRowClick(row, i) : undefined}>
            {columns.map((c, ci) => (
              <div key={ci} className={cell(c, row, i)} style={w(c, row, i)}>
                {c.render ? c.render(row, i) : (c.format ? c.format(row[c.key], row) : row[c.key])}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* TransactionSummary — the Sending / fee / Change → Total block. `rows` is a list
   of { label, value, sub } (falsy entries are skipped, e.g. a missing Change);
   `total` is the emphasized bottom line under a rule. Used by Send + its gallery. */
export function TransactionSummary({ rows = [], total, topRule = true }) {
  return (
    <Stack style={topRule ? { borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-xs)' } : undefined}>
      {rows.filter(Boolean).map((r, i) => (
        <KeyValue key={i} label={r.label} value={r.value} sub={r.sub} align="baseline" pad="7px 0" />
      ))}
      {total ? (
        <React.Fragment>
          <Divider space="0" style={{ margin: '4px 0' }} />
          <KeyValue label={total.label} value={total.value} sub={total.sub} strong align="baseline" pad="7px 0" />
        </React.Fragment>
      ) : null}
    </Stack>
  );
}

/* CoinTable — the coin/UTXO selection table over <Table>. `isChecked(coin,i)`
   decides the checked/highlighted state; `onToggle(i,next)` flips it. `readOnly`
   (auto coin-selection) disables the checkboxes and dims unchecked rows. Used by
   Send + its gallery. */
export function CoinTable({ coins, isChecked, onToggle, readOnly = false, maxHeight = 230, hideHeader = true }) {
  const checked = (c, i) => (isChecked ? !!isChecked(c, i) : false);
  return (
    <Table rows={coins} hideHeader={hideHeader} maxHeight={maxHeight || undefined}
      bodyStyle={{ overflowX: 'hidden', paddingRight: 6 }}
      rowKey={(c, i) => i}
      rowClass={(c, i) => (checked(c, i) ? 'is-selected' : '')}
      rowStyle={(c, i) => ({ cursor: readOnly ? 'default' : 'pointer',
        opacity: readOnly && !checked(c, i) ? 0.5 : 1 })}
      onRowClick={readOnly ? undefined : (c, i) => onToggle && onToggle(i, !checked(c, i))}
      columns={[
        { header: '', width: 30, cellStyle: () => ({ padding: '0 0 0 8px' }),
          render: (c, i) => <Checkbox checked={checked(c, i)} disabled={readOnly}
            onChange={v => { if (!readOnly && onToggle) onToggle(i, v); }} /> },
        { key: 'type', header: 'Type', width: 92 },
        { key: 'outpoint', header: 'OutPoint', width: 175, mono: true },
        { header: 'Label', grow: true, muted: (c) => !c.label, render: (c) => c.label || '—' },
        { header: 'Value', width: 150, align: 'right', render: (c) => `${c.value} BTC` },
      ]} />
  );
}

/* SectionHeader — a list section's header row: eyebrow label · optional count ·
   right-aligned action (e.g. "+ Add a Key"). Pass open + onToggle to make the
   section foldable: a chevron leads the label and the label toggles it.
   Qt: HBox(Label, Label, stretch, Button); foldable = QToolButton arrow. */
/* dense: a tighter header row (icon-button height, small gap below) for stacked
   sections inside a modal. */
export function SectionHeader({ label, count, action, open, onToggle, dense = false, style }) {
  const foldable = typeof onToggle === 'function';
  const head = (
    <React.Fragment>
      {foldable ? (
        <FoldChevron open={open} />
      ) : null}
      <SectionLabel>{label}</SectionLabel>
      {count != null ? <Text variant="mono" color="muted" style={{ fontSize: 'var(--size-caption)' }}>{count}</Text> : null}
    </React.Fragment>
  );
  return (
    <Row gap="s" style={{ minHeight: dense ? 'var(--btn-w-icon)' : 'var(--button-min-h)', marginBottom: dense ? 'var(--space-xxs)' : 'var(--space-xs)', ...style }}>
      {foldable ? (
        <button onClick={onToggle} aria-expanded={!!open} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-s)',
          background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', color: 'inherit' }}>{head}</button>
      ) : head}
      <Spacer />
      {action || null}
    </Row>
  );
}

/* Section — a titled block: SectionHeader + its content. With open/onToggle it
   folds (content hidden, the header's action hidden too). Qt: VBox(header, body). */
export function Section({ label, count, action, open, onToggle, dense, children }) {
  const foldable = typeof onToggle === 'function';
  const shown = !foldable || open;
  return (
    <Stack>
      <SectionHeader label={label} count={count} open={open} onToggle={onToggle} dense={dense} action={shown ? action : null} />
      {shown ? children : null}
    </Stack>
  );
}

/* CopyField — read-only mono value + copy action (xpub, descriptor, path).
   `wrap` breaks long values over lines (descriptors); default truncates. The copy
   glyph flips to a check for a moment after copying. */
export function CopyField({ value, wrap = false, grow = false, title = 'Copy', style }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    try { navigator.clipboard && navigator.clipboard.writeText(value); } catch (e) {}
    setCopied(true); setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div className="s-copy-field" style={grow ? { flex: 1, minWidth: 0, ...style } : style}>
      <span className={'s-copy-field__v ' + (wrap ? 'is-wrap' : 'is-truncate')} title={wrap ? undefined : value}>{value}</span>
      <Btn id={copied ? 'copied_value' : 'copy_value'} title={copied ? 'Copied' : title} onClick={copy} />
    </div>
  );
}

/* ShortValue — a long mono value shown short (head…tail, e.g. tpubDCt…xPt1P) as
   plain text with a copy button; the full value is the tooltip. Not an input.
   Qt: QLabel (elided middle) + inline-icon copy QToolButton. */
/* copy={false}: plain text only (read-only review). */
export function ShortValue({ value, head = 8, tail = 6, title = 'Copy', copy: canCopy = true }) {
  const [copied, setCopied] = React.useState(false);
  const short = value.length > head + tail + 1 ? value.slice(0, head) + '…' + value.slice(-tail) : value;
  const copy = () => { try { navigator.clipboard && navigator.clipboard.writeText(value); } catch (e) {} setCopied(true); setTimeout(() => setCopied(false), 1200); };
  return (
    <Row gap="xxs" inline>
      <Text variant="mono" title={value}>{short}</Text>
      {canCopy ? <Btn id={copied ? 'copied_value' : 'copy_value'} title={copied ? 'Copied' : title} onClick={copy} /> : null}
    </Row>
  );
}

/* WordInputGrid — one numbered input per mnemonic word, each with a trailing
   valid / invalid mark (checked against `isWord`; empty = no mark). Pasting a
   whole phrase into any input spreads it across the cells. Read column-wise like
   WordGrid. Qt: QGridLayout of (Label, QLineEdit, mark) cells. */
export function WordInputGrid({ words, onChange, isWord = () => true, columns }) {
  const n = words.length, cols = columns || (n > 15 ? 4 : 3), rows = Math.ceil(n / cols);
  const set = (i, v) => {
    const parts = v.trim().split(/\s+/);
    const next = [...words];
    if (parts.length > 1) parts.forEach((p, k) => { if (i + k < n) next[i + k] = p.toLowerCase(); });
    else next[i] = v.replace(/\s/g, '').toLowerCase();
    onChange(next);
  };
  return (
    <div style={{ display: 'grid', gridAutoFlow: 'column', gridTemplateRows: `repeat(${rows}, auto)`,
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 'var(--space-xs) var(--space-s)' }}>
      {words.map((wd, i) => (
        <Row key={i} gap="xs">
          <Text variant="mono" color="muted" size="sm" align="right" style={{ width: 18, flex: 'none' }}>{i + 1}</Text>
          <ValidatedInput mono value={wd} state={!wd ? 'none' : isWord(wd) ? 'valid' : 'invalid'}
            onChange={e => set(i, e.target.value)} wrapStyle={{ flex: 1, minWidth: 0 }} />
        </Row>
      ))}
    </div>
  );
}

/* WordGrid — numbered mnemonic words, read column-wise (1–4 down the first
   column…). `hidden` masks the words but keeps the layout. 12 words → 3 cols,
   24 → 4 cols. */
export function WordGrid({ words = [], hidden = false, columns }) {
  const cols = columns || (words.length > 12 ? 4 : 3);
  const rows = Math.ceil(words.length / cols);
  return (
    <div className={'s-word-grid' + (hidden ? ' is-hidden' : '')} aria-hidden={hidden || undefined}
      style={{ gridTemplateRows: `repeat(${rows}, auto)`, gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {words.map((w, i) => (
        <div key={i} className="s-word">
          <span className="s-word__n">{i + 1}</span>
          <span className="s-word__w">{hidden ? '••••••' : w}</span>
        </div>
      ))}
    </div>
  );
}

/* Route kinds — ONE icon and ONE label per kind, used everywhere a route appears
   (Keys list, key detail, signer picker, route steps). */
export const ROUTE_KINDS = {
  hot: { label: 'Hot Key', icon: 'key' },
  usb: { label: 'USB', icon: 'usb' },
  qr:  { label: 'QR Code', icon: 'qr' },
  sd:  { label: 'SD Card', icon: 'sd_card' },
};

/* RouteIcons — the route kinds of a key as a row of icons (first = primary),
   each with its label as a tooltip. */
export function RouteIcons({ routes = [], size = 16 }) {
  return (
    <Row gap="xs" style={{ flex: 'none', color: 'var(--text-secondary)' }}>
      {routes.map((r, i) => {
        const k = ROUTE_KINDS[r] || { label: r, icon: 'key' };
        return (
          <Tooltip key={i} label={k.label + (i === 0 ? ' · Primary' : '')}>
            <span aria-label={k.label} style={{ display: 'inline-flex' }}><Icon name={k.icon} size={size} /></span>
          </Tooltip>
        );
      })}
    </Row>
  );
}

/* ScanProgress — multi-part QR scan progress: one segment per part, filled when
   received, plus an "i of n parts" caption. Qt: HBox of QFrames + Label. */
export function ScanProgress({ got = 0, total = 0, done }) {
  const parts = Array.from({ length: Math.max(total, 0) });
  return (
    <Stack gap="xs" style={{ width: '100%' }}>
      <div className="s-scan-progress">
        {parts.map((_, i) => <span key={i} className={'s-scan-progress__seg' + (i < got ? ' is-on' : '')} />)}
      </div>
      <Text variant="caption" color={done ? 'success' : 'muted'} align="center">
        {total ? (done ? `All ${total} parts received` : `${got} of ${total} parts`) : 'Waiting for the first part…'}
      </Text>
    </Stack>
  );
}

/* FieldNote — a one-line note under a <Field>; inside a FieldGroup it sits in the
   control column, under its input. tone: muted (help) | error | success; optional leading icon. */
export function FieldNote({ tone = 'muted', icon, children, style }) {
  return (
    <Row gap="xs" style={{ gridColumn: '2', paddingLeft: 0, color: tone === 'muted' ? 'var(--text-muted)' : `var(--${tone})`, ...style }}>
      {icon ? <Icon name={icon} size={14} /> : null}
      <Text variant="caption" color={tone}>{children}</Text>
    </Row>
  );
}

/* EmptyState — the empty-list block: inset card, icon, title, subtitle and an
   optional lead action. Use it for every empty list or section. */
export function EmptyState({ icon, title, subtitle, action }) {
  return (
    <Card tone="inset">
      <ModalStatus icon={icon} iconSize={28} title={title} subtitle={subtitle} pad="var(--space-s) 0">{action || null}</ModalStatus>
    </Card>
  );
}

/* FoldChevron — the disclosure chevron (down = open, right = folded). */
export function FoldChevron({ open }) {
  return (
    <span style={{ flex: 'none', display: 'inline-flex', color: 'var(--text-secondary)',
      transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s ease' }}>
      <Icon name="chevron_down" size={14} />
    </span>
  );
}

/* ScrollArea — a vertically scrolling list region. A scrollbar-wide gutter is
   reserved on both sides plus a small inset (--space-xs) so rows never touch the
   scrollbar, and thin delimiter lines mark the top and bottom edges
   only while the content actually overflows (transparent otherwise, so nothing
   shifts). Qt: QScrollArea with a frame shown when the vertical bar is visible. */
export function ScrollArea({ children, style }) {
  const ref = React.useRef(null);
  const [over, setOver] = React.useState(false);
  React.useEffect(() => {
    let raf;
    const tick = () => {
      const el = ref.current;
      if (el) { const o = el.scrollHeight - el.clientHeight > 1; setOver(p => (p === o ? p : o)); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const line = over ? 'var(--border-light)' : 'transparent';
  return (
    <div ref={ref} style={{ minHeight: 0, overflowY: 'auto', scrollbarGutter: 'stable both-edges', padding: 'var(--space-xs)',
      borderTop: '1px solid ' + line, borderBottom: '1px solid ' + line, ...style }}>{children}</div>
  );
}

/* ModalActions — a modal's footer: optional Back on the left, then the reason the
   primary action is disabled (when it is), then the actions. Every disabled
   primary says why. Qt: HBox(Button, stretch, Label, Button…). */
export function ModalActions({ onBack, backId = 'back', reason, children, style }) {
  /* Sticky: stays pinned to the bottom of a scrolling modal, so the buttons are
     always reachable. Qt: the footer sits outside the dialog's QScrollArea, so it
     spans the modal while the step body is centred: the zero-width anchor keeps the
     bar out of the body's width, the bar overflows it to the modal's inner width. */
  return (
    <div style={{ alignSelf: 'center', width: 0, position: 'sticky', bottom: 'calc(-1 * var(--space-m))', zIndex: 2,
      margin: '0 0 calc(-1 * var(--space-m))' }}>
      <Row gap="s" style={{ width: 'var(--modal-body-w)', marginLeft: 'calc(var(--modal-body-w) / -2)', boxSizing: 'border-box',
        background: 'var(--bg)', padding: 'var(--space-s) 0 var(--space-m)', ...style }}>
        {onBack ? <Btn id={backId} onClick={onBack} /> : null}
        <Spacer />
        {reason ? <Text variant="caption" align="right" style={{ maxWidth: 260 }}>{reason}</Text> : null}
        {children}
      </Row>
    </div>
  );
}

Object.assign(window, { SectionLabel, FieldLabel, PaymentRow, ValidatedInput, Stepper,
  Tooltip, FoldSection, IndexPill, KeyValue, Table, TransactionSummary, CoinTable,
  SectionHeader, Section, CopyField, ShortValue, WordGrid, WordInputGrid, ROUTE_KINDS, RouteIcons, ScanProgress, ModalActions, ScrollArea, FieldNote, EmptyState, FoldChevron });

/* File-level namespace (DS compiler indexes this file as `Widgets`). */
export const Widgets = { SectionLabel, FieldLabel, PaymentRow, ValidatedInput, Stepper, Tooltip, FoldSection, IndexPill, KeyValue, Table, TransactionSummary, CoinTable, SectionHeader, Section, CopyField, ShortValue, WordGrid, WordInputGrid, RouteIcons, ScanProgress, ModalActions, ScrollArea, FieldNote, EmptyState, FoldChevron };
