/* Silent UI Kit — Address & QR catalog.
   The reusable surface for showing a cryptographic string: a framed QR tile,
   the QR itself, and the chunked-monospace address. Every QR / address in the
   app composes THESE — no view hand-rolls a white QR box or a chunking loop.

   Qt mapping:
     QRCard        -> QFrame (white bg, 1px border, fixed square)
     QRCode        -> QRCard + a QSvgWidget painting the QR
     ChunkedAddress-> QLabel (flow layout of 4-char mono groups)

   Loaded after Modal.jsx + Layout.jsx, before any view that shows an address. */

/* qrSvg — build a QR for `text` as an SVG string. Tries error-correction levels
   in order until the payload fits; returns '' if the lib is missing or no level
   fits. Shared by the static QRCode and the animated PSBT frames in Send. */
function qrSvg(text, { ecOrder = ['M', 'L'], cellSize = 2, margin = 0 } = {}) {
  if (!text || typeof window.qrcode === 'undefined') return '';
  for (const ec of ecOrder) {
    try {
      const qr = window.qrcode(0, ec);
      qr.addData(text); qr.make();
      return qr.createSvgTag({ cellSize, margin, scalable: true });
    } catch (e) { /* payload too big for this level — try the next */ }
  }
  return '';
}

/* QRCard — the white framed tile that holds a QR (or any square glyph).
   `bg`/`color` let the airgap scanner tune contrast; `onClick` makes it tappable. */
/* `dim` fades the code while it is being rebuilt. */
export function QRCard({ size = 132, pad = 12, bg = '#ffffff', color, radius = 8, dim, onClick, title, style, children }) {
  return (
    <div className="s-qr" onClick={onClick} title={title}
      style={{ flex: 'none', width: size, height: size, maxWidth: '100%', opacity: dim ? 0.25 : 1, padding: pad, background: bg, color,
        border: '1px solid var(--border-light)', borderRadius: radius, boxSizing: 'border-box',
        cursor: onClick ? 'pointer' : 'default', ...style }}>
      {children}
    </div>
  );
}

/* QRCode — a QR for `text`, framed by QRCard. `zoom` makes it click-to-enlarge
   into a Modal that also shows the chunked address. */
export function QRCode({ text, size = 132, zoom }) {
  const [open, setOpen] = React.useState(false);
  const html = React.useMemo(() => qrSvg(text), [text]);
  if (!html) return null;
  const svg = <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: html }} />;
  return (
    <React.Fragment>
      <QRCard size={size} onClick={zoom ? () => setOpen(true) : undefined}
        title={zoom ? 'Click to enlarge' : undefined}>
        {svg}
      </QRCard>
      {open ? (
        <Modal title="QR Code" width={680} onClose={() => setOpen(false)}>
          <Stack align="center" gap="l">
            <QRCard size={560} pad={20} radius={12}>{svg}</QRCard>
            <ChunkedAddress text={text} />
          </Stack>
        </Modal>
      ) : null}
    </React.Fragment>
  );
}

/* ChunkedAddress — an address/txid shown as alternating-dimmed mono groups; a
   click cycles groups of 4, groups of 6, then one unbroken string. Long
   silent-payment strings (over 56 characters) wrap to two centered rows, or,
   with `wrap`, to as many rows as the width needs (the verify card). `align`:
   center (default) or left, flush with the text above it (the creator's verify page).
   `oneRow`: the whole address on a single row whatever its length (the creator's
   verify page; the container must be wide enough). */
const CHUNK_CYCLE = { 4: 6, 6: 0, 0: 4 };
export function ChunkedAddress({ text, wrap = false, align = 'center', oneRow = false }) {
  const left = align === 'left';
  const [size, setSize] = React.useState(4);          // characters per group, 0 = one string
  const chunked = size > 0;
  const lines = React.useMemo(() => {
    const chunks = chunked ? text.match(new RegExp(`.{1,${size}}`, 'g')) || [] : [];
    const rows = !oneRow && !wrap && text.length > 56 ? 2 : 1;   // long SP → 2 rows, others → 1
    const base = Math.floor(chunks.length / rows);
    const extra = chunks.length % rows;                       // first `extra` rows get +1
    const out = [];
    let i = 0;
    for (let r = 0; r < rows; r++) {
      const n = base + (r < extra ? 1 : 0);
      out.push(chunks.slice(i, i + n));
      i += n;
    }
    return out;
  }, [text, size, oneRow, wrap]);

  let idx = 0;  // running chunk index for alternating dim
  return (
    <div className="t-mono" onClick={() => setSize((n) => CHUNK_CYCLE[n])}
      title={size === 4 ? 'Show in groups of 6' : size === 6 ? 'Show as one string' : 'Show in groups of 4'}
      style={{ lineHeight: 1.75, textAlign: left ? 'left' : 'center', cursor: 'pointer', userSelect: 'none',
        wordBreak: chunked || oneRow ? 'normal' : 'break-all', whiteSpace: oneRow ? 'nowrap' : undefined }}>
      {chunked
        ? lines.map((row, r) => (
            <div key={r} style={{ display: 'flex', justifyContent: left ? 'flex-start' : 'center', gap: '0.4em', flexWrap: wrap ? 'wrap' : 'nowrap' }}>
              {row.map((c) => {
                const i = idx++;
                return <span key={i} style={{ color: i % 2 ? 'var(--text-muted)' : 'var(--text)' }}>{c}</span>;
              })}
            </div>
          ))
        : <span style={{ color: 'var(--text)' }}>{text}</span>}
    </div>
  );
}

Object.assign(window, { qrSvg, QRCard, QRCode, ChunkedAddress });

/* File-level namespace (DS compiler indexes this file as `Address`). */
export const Address = { QRCard, QRCode, ChunkedAddress };
