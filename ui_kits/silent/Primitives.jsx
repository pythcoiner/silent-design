/* Silent UI Kit — Primitives. Mirrors src/theme/*.cpp roles via components.css classes. */

/* Measure a container's width so layouts can react to real available space.
   ResizeObserver is unreliable in some embedded preview frames, so we poll the
   measured width on a rAF loop. Shared by the dashboard layout and Send. */
function useMeasure() {
  const ref = React.useRef(null);
  const [w, setW] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const tick = () => {
      if (ref.current) {
        const next = ref.current.getBoundingClientRect().width;
        setW(prev => Math.abs(prev - next) > 0.5 ? next : prev);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return [ref, w];
}

function Button({ role = 'default', children, className = '', icon, iconSize = 20, ...rest }) {
  const cls = {
    default: 's-btn',
    primary: 's-btn s-btn--primary',
    destructive: 's-btn s-btn--destructive',
    inline: 's-btn s-btn--inline',
    menu: 's-btn--menu',
    icon: 's-btn s-btn--icon',
    'inline-icon': 's-btn s-btn--inline-icon',
    'tab-open': 's-btn s-btn--tab-open',
    'tab-create': 's-btn s-btn--tab-create',
  }[role] || 's-btn';
  const dom = { ...rest };
  ['role', 'className', 'icon', 'iconSize', 'children'].forEach(k => delete dom[k]);
  return (
    <button className={`${cls} ${className}`.trim()} {...dom}>
      {icon ? <Icon name={icon} size={iconSize} /> : null}
      {children}
    </button>
  );
}

function Input({ mono = false, width, className = '', ...rest }) {
  const style = width ? { width } : {};
  const dom = { ...rest }; delete dom.mono; delete dom.width;   // defensive: preview instrumentation can leave these in rest
  return <input className={`s-input ${mono ? 's-input--mono' : ''} ${className}`} style={style} {...dom} />;
}

/* TextArea — multiline input (Qt theme::TextEdit). */
function TextArea({ mono = false, width, height = 50, className = '', style, ...rest }) {
  const dom = { ...rest }; delete dom.mono; delete dom.width; delete dom.height;
  return <textarea className={`s-input ${mono ? 's-input--mono' : ''} ${className}`}
    style={{ width, height, resize: 'none', boxSizing: 'border-box', ...style }} {...dom} />;
}

function Display({ value, variant = 'default', width, className = '' }) {
  const v = variant === 'mono' ? 's-display--mono' : variant === 'amount' ? 's-display--amount' : '';
  const style = width ? { width } : {};
  return <span className={`s-display ${v} ${className}`} style={style}>{value}</span>;
}

function Field({ label, labelWidth = 'var(--form-label-w)', children, align = 'center' }) {
  return (
    <div style={{ display: 'flex', alignItems: align, gap: 'var(--space-xs)', padding: '3px 0' }}>
      <span className="t-info-label" style={{ width: labelWidth, flex: 'none', color: 'var(--text)' }}>{label}</span>
      {children}
    </div>
  );
}

function Checkbox({ checked, onChange, label, disabled }) {
  return (
    <span className={`s-check ${checked ? 'is-checked' : ''} ${disabled ? 'is-disabled' : ''}`}
      style={disabled ? { opacity: 0.55, cursor: 'default' } : undefined}
      onClick={() => { if (!disabled && onChange) onChange(!checked); }}>
      <span className="box" />
      {label ? <span style={{ fontSize: 'var(--size-caption)' }}>{label}</span> : null}
    </span>
  );
}

function Toggle({ on, status = false, onClick }) {
  return <span className={`s-toggle ${status ? 's-toggle--status' : ''} ${on ? 'is-on' : ''}`} onClick={onClick} />;
}

/* Indeterminate spinner — reused by every "working…" modal (signing, broadcasting). */
function Spinner({ size = 114 }) {
  return (
    <span className="s-spin" style={{ display: 'inline-flex', color: 'var(--accent)' }}>
      <Icon name="refresh" size={size} />
    </span>
  );
}

/* Card — the panel/surface recipe. tone 'surface' (default) | 'inset'. */
function Card({ tone = 'surface', className = '', style, children, ...rest }) {
  return (
    <div className={`s-card ${tone === 'inset' ? 's-card--inset' : ''} ${className}`} style={style} {...rest}>
      {children}
    </div>
  );
}

/* Badge — small status pill. tone: success | warning | error | neutral. */
function Badge({ tone = 'neutral', icon, iconSize = 14, children, style }) {
  return (
    <span className={`s-badge s-badge--${tone}`} style={style}>
      {icon ? <Icon name={icon} size={iconSize} /> : null}
      {children}
    </span>
  );
}

/* SelectRow — full-width pick-list row (icon · title · meta · chevron). */
function SelectRow({ icon, iconSize = 18, title, meta, onClick, chevron = true, style }) {
  return (
    <button className="s-select-row" onClick={onClick} style={style}>
      {icon ? <span style={{ flex: 'none', display: 'inline-flex', color: 'var(--accent)' }}><Icon name={icon} size={iconSize} /></span> : null}
      <span style={{ flex: 1, minWidth: 0, font: '500 14px var(--font-sans)' }}>{title}</span>
      {meta ? <span style={{ flex: 'none', font: '12px var(--font-mono)', color: 'var(--text-muted)' }}>{meta}</span> : null}
      {chevron ? <span style={{ flex: 'none', display: 'inline-flex', color: 'var(--text-muted)' }}><Icon name="chevron_right" size={16} /></span> : null}
    </button>
  );
}

/* ModalStatus — centered status column for "working…" / placeholder modals:
   spinner OR icon, a title, an optional subtitle, plus any children (e.g. a
   Cancel button). Used by the signing, SD-card and broadcasting modals. */
function ModalStatus({ spinner, icon, iconSize = 40, iconColor = 'var(--text-muted)', title, subtitle, children, pad = 'var(--space-l) 0' }) {
  return (
    <Stack align="center" gap="m" style={{ padding: pad }}>
      {spinner ? <Spinner /> : icon ? <span style={{ display: 'inline-flex', color: iconColor }}><Icon name={icon} size={iconSize} /></span> : null}
      {title ? <Text as="div" variant="section" weight="500" align="center">{title}</Text> : null}
      {subtitle ? <Text as="div" variant="body" color="muted" align="center" style={{ maxWidth: 320, lineHeight: 1.6 }}>{subtitle}</Text> : null}
      {children}
    </Stack>
  );
}

/* Legend — a colored swatch + label, for chart/diagram keys. */
function Legend({ color, children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 8, height: 8, borderRadius: 2, flex: 'none', background: color }} />{children}
    </span>
  );
}

function ComboBox({ value, options, onChange, width = 200 }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ position: 'relative', width }}>
      <span className="s-combo" style={{ width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', paddingRight: 26 }} onClick={() => setOpen(o => !o)}>
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
        <span style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', zIndex: 1, color: 'var(--text)', display: 'inline-flex' }}>
          <Icon name="chevron_down" size={12} />
        </span>
      </span>
      {open ? (
        <div style={{
          position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: 2, zIndex: 20,
          background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: 'var(--radius-button)',
          overflow: 'hidden', boxSizing: 'border-box',
        }}>
          {options.map(opt => (
            <div key={opt} className="combo-item"
              style={{ padding: '6px 10px', fontSize: 'var(--size-body)', color: 'var(--text)', cursor: 'pointer', background: opt === value ? 'var(--surface-hover)' : 'transparent' }}
              onMouseDown={() => { onChange(opt); setOpen(false); }}>
              {opt}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ✓ / ✗ validation mark (Send.cpp setValidationIndicator) */
function ValidationMark({ state }) {
  if (state === 'valid') return <span className="s-valid" style={{ width: 'var(--validation-mark-w)', textAlign: 'center' }}>✓</span>;
  if (state === 'invalid') return <span className="s-invalid" style={{ width: 'var(--validation-mark-w)', textAlign: 'center' }}>✗</span>;
  return <span style={{ width: 'var(--validation-mark-w)', display: 'inline-block' }} />;
}

/* Balance summary header used atop Coins / History */
function btcAmount(s) { return parseFloat(String(s).split(' ')[0]) || 0; }
function fmtBtc(n) { return n.toFixed(8); }

function BalanceHeader({ wallet }) {
  const conf = btcAmount(wallet.confirmed);
  const unconf = btcAmount(wallet.unconfirmed);
  const unconfZero = unconf === 0;

  return (
    <div style={{ padding: '4px 4px 18px', marginBottom: 'var(--space-m)',
      borderBottom: '1px solid var(--border-light)' }}>
      <Row align="flex-end" gap="xl">
        {/* hero — balance */}
        <Stack gap={8}>
          <Eyebrow size={10} color="muted">Balance</Eyebrow>
          <Amount value={fmtBtc(conf)} size="hero" unit="BTC" count={`(${wallet.confirmedCount})`} />
        </Stack>

        {/* small — unconfirmed, to the right */}
        <Row gap={8} style={{ flex: 'none', paddingBottom: 3, whiteSpace: 'nowrap' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', flex: 'none',
            background: unconfZero ? 'var(--text-muted)' : 'var(--warning)' }} />
          <Eyebrow size={10} color="muted">Unconfirmed</Eyebrow>
          <Amount value={fmtBtc(unconf)} size="sm" unit="BTC" sign={unconfZero ? '' : '+'}
            tone={unconfZero ? 'muted' : undefined} count={`(${wallet.unconfirmedCount})`} />
        </Row>
      </Row>
    </div>
  );
}

/* Tab — a QTabWidget tab: label + optional close affordance. The active tab
   takes the page bg; the menu/"+" tab passes closable={false}. Backed by the
   s-tab class so the chrome lives in CSS, not inline style. */
function Tab({ label, active, closable, onClick, onClose }) {
  return (
    <div className={`s-tab ${active ? 'is-active' : ''}`} onClick={onClick}>
      <span>{label}</span>
      {closable ? (
        <span className="s-tab__close" onClick={e => { e.stopPropagation(); if (onClose) onClose(); }}>
          <Icon name="x" size={12} />
        </span>
      ) : null}
    </div>
  );
}

Object.assign(window, { Button, Input, TextArea, Display, Field, Checkbox, Toggle, Spinner, Card, Badge, SelectRow, ModalStatus, Legend, ComboBox, ValidationMark, BalanceHeader, Tab, useMeasure });
