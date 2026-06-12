/* Silent UI Kit — Composite widget generics.
   One level up from Layout/Primitives: labelled rows, tables, disclosure,
   steppers, tooltips. Views and subcomponents compose THESE — never the raw
   markup they wrap. Each maps to a Qt widget or a small layout recipe.

   Loaded after Layout.jsx + Primitives.jsx, before any view. */

/* Eyebrow caption — uppercase mono section label (theme::Label, caption role). */
function SectionLabel({ children, style, ...rest }) {
  return <Eyebrow color="muted" size={11} style={style} {...rest}>{children}</Eyebrow>;
}

/* Micro field label sitting above an input. */
function FieldLabel({ children, style, ...rest }) {
  return <Eyebrow color="muted" size={10} style={{ letterSpacing: '0.12em', marginBottom: 6, ...style }} {...rest}>{children}</Eyebrow>;
}

/* PaymentRow — fixed-width right-aligned label + a flexible control (Liana form row). */
function PaymentRow({ label, labelWidth = 89, align = 'center', children }) {
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
function ValidatedInput({ state, wrapStyle, ...inputProps }) {
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
function Stepper({ label, value, min, max, onChange }) {
  const dots = '●'.repeat(value) + '○'.repeat(max - value);
  return (
    <Stack align="center" gap={6}>
      {label ? <Text variant="body" color="secondary" weight="500" nowrap>{label}</Text> : null}
      <Row gap="s">
        <Button role="inline-icon" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
          <Icon name="minus" size={14} />
        </Button>
        <span style={{ minWidth: 56, textAlign: 'center', font: '10px var(--font-mono)',
          letterSpacing: '1px', color: 'var(--accent)' }}>{dots}</span>
        <Button role="inline-icon" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
          <Icon name="plus" size={14} />
        </Button>
      </Row>
    </Stack>
  );
}

/* Tooltip — hover bubble above its child. */
function Tooltip({ label, children }) {
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
function FoldSection({ id, label, open, onToggle, children }) {
  return (
    <div>
      <button onClick={() => onToggle(id)} style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-s)', width: '100%',
        background: 'none', border: 'none', padding: 'var(--space-s) 0', margin: 0,
        cursor: 'pointer', textAlign: 'left', color: 'inherit' }}>
        <span style={{ flex: 'none', display: 'inline-flex', color: 'var(--text-secondary)',
          transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s ease' }}>
          <Icon name="chevron_down" size={14} />
        </span>
        <span style={{ whiteSpace: 'nowrap' }}><SectionLabel>{label}</SectionLabel></span>
      </button>
      {open ? <div style={{ padding: '0 0 var(--space-m) calc(14px + var(--space-s))' }}>{children}</div> : null}
    </div>
  );
}

/* IndexPill — qr-glyph + derivation index, the row handle in the address list.
   A normal Button (s-btn), just sized 60×30 (Index × Icon) — no bespoke class. */
function IndexPill({ index, active, onClick, title = 'Show QR code' }) {
  return (
    <Button onClick={onClick} title={title}
      style={{ flex: 'none', width: 60, height: 30, minHeight: 0, padding: '0 8px', gap: 6,
        background: active ? 'var(--bg)' : undefined }}>
      <Icon name="qr" size={13} />
      <span style={{ font: '600 12px var(--font-mono)', color: 'var(--text)' }}>{index}</span>
    </Button>
  );
}

/* KeyValue — a label/value summary line (left label, right value). Used by the
   transaction summary and settings rows. value defaults to mono.
   `sub` adds a muted second line under the value; `strong` enlarges + emphasizes
   it (the Send "Total" row). This subsumes the old Send-local SummaryRow. */
function KeyValue({ label, value, sub, valueMono = true, valueColor, strong, align = 'center', pad, style }) {
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
function Table({ columns, rows, rowKey, maxHeight, bodyStyle, hideHeader, onRowClick, rowClass, rowStyle }) {
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
function TransactionSummary({ rows = [], total, topRule = true }) {
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
function CoinTable({ coins, isChecked, onToggle, readOnly = false, maxHeight = 230, hideHeader = true }) {
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

Object.assign(window, { SectionLabel, FieldLabel, PaymentRow, ValidatedInput, Stepper,
  Tooltip, FoldSection, IndexPill, KeyValue, Table, TransactionSummary, CoinTable });
