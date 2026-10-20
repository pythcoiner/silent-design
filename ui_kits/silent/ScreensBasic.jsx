/* Silent UI Kit — History, Coins, Receive screens. */

function copyToClipboard(text) {
  if (!text) return;
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}
function fallbackCopy(text) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  } catch (e) { /* ignore */ }
}

/* ---------------- Dashboard layout ----------------
   The layout is a function of its columns. Give DashboardLayout one column
   (single-column screens: History, Coins, Receive, Settings) or two (Send) —
   every panel goes through here.

   • a column is clamped to [DASH_MIN_W, DASH_COL_MAX]; the max is 1.5 × the min,
     so no single column can sprawl wider than 1.5 × the minimum
   • the whole block is clamped to DASH_MAX_W — two columns together can't exceed
     that total, however wide the window gets
   • two columns sit side by side once both clear the min (DASH_SPLIT_AT);
     below that a two-column screen stacks with a horizontal rule between them
   • padding lives inside the border-box block, so the block is exactly
     DASH_MIN_W at its narrowest and fits a (min + sidebar) window with no scroll
   • at/above DASH_WIDE_AT the block gains a fixed top gap (DASH_TOP_GAP) */
const DASH_MIN_W    = 760;                          // min column width
const DASH_COL_MAX  = 1.5 * DASH_MIN_W;             // 1140 — a single column can't exceed 1.5 × the min
const DASH_MAX_W    = 1600;                          // max total content width (two columns together)
const DASH_GUTTER   = 49;                            // between two columns: 1px rule + 2×--space-l
const DASH_SPLIT_AT = 2 * DASH_MIN_W + DASH_GUTTER;  // 1569 — two columns fit side by side
const DASH_WIDE_AT  = DASH_SPLIT_AT;                 // 1569 — top gap appears with the wide (two-column) layout
const DASH_TOP_GAP  = 'var(--space-xxl)';           // 120px — ≈ the old one-third-from-top feel

/* Live layout state, exposed so a screen can document or adapt to it. */
const LayoutInfo = React.createContext({ available: 0, columns: 1, sideBySide: false, colWidth: 0, wide: false });

function DashboardLayout({ title, titleRight, primary, secondary = null, fixedWidth }) {
  const [ref, w] = useMeasure();
  const two = secondary != null && secondary !== false;
  const sideBySide = two && w >= DASH_SPLIT_AT;
  const wide = w >= DASH_WIDE_AT;
  // One column caps at DASH_COL_MAX; a side-by-side pair caps at DASH_MAX_W in
  // total. A stacked two-column screen behaves like a single column.
  // fixedWidth pins the content block to one width (e.g. the Keys tab, 700).
  const blockMin = fixedWidth || (sideBySide ? DASH_SPLIT_AT : DASH_MIN_W);
  const blockMax = fixedWidth || (sideBySide ? DASH_MAX_W : DASH_COL_MAX);
  const blockW = w > 0 ? Math.min(Math.max(w, blockMin), blockMax) : 0;
  const colWidth = Math.round(sideBySide ? (blockW - DASH_GUTTER) / 2 : blockW);

  const info = { available: w, columns: two ? 2 : 1, sideBySide, colWidth, wide };
  const render = (c) => (typeof c === 'function' ? c(info) : c);

  return (
    <div ref={ref} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minWidth: 0, boxSizing: 'border-box' }}>
      <div style={{ boxSizing: 'border-box', minWidth: blockMin, maxWidth: blockMax,
        margin: '0 auto', marginTop: wide ? DASH_TOP_GAP : 0, padding: 'var(--space-s)' }}>
        <LayoutInfo.Provider value={info}>
          {title ? (
            <Row gap="m" style={{ marginBottom: 'var(--space-m)' }}>
              <Text as="div" variant="title">{title}</Text>
              {titleRight ? <React.Fragment><Spacer />{titleRight}</React.Fragment> : null}
            </Row>
          ) : null}
          {sideBySide ? (
            <div style={{ display: 'flex', alignItems: 'stretch', width: '100%' }}>
              <div style={{ flex: '1 1 0', minWidth: 0, maxWidth: DASH_COL_MAX, display: 'flex', flexDirection: 'column' }}>
                {render(primary)}
              </div>
              <Divider vertical space="l" />
              <div style={{ flex: '1 1 0', minWidth: 0, maxWidth: DASH_COL_MAX, display: 'flex', flexDirection: 'column' }}>
                {render(secondary)}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              {render(primary)}
              {two ? (
                <React.Fragment>
                  <Divider space="l" />
                  {render(secondary)}
                </React.Fragment>
              ) : null}
            </div>
          )}
        </LayoutInfo.Provider>
      </div>
    </div>
  );
}

/* Single-column convenience wrapper — most panels render through this. */
function ScreenWrap({ title, titleRight, children, fixedWidth }) {
  return <DashboardLayout title={title} titleRight={titleRight} primary={children} fixedWidth={fixedWidth} />;
}

function Ruler() {
  return <Divider space="m" />;
}

/* ---------------- History ---------------- */
/* confirmations of a row against the wallet's chain tip (0 = unconfirmed) */
const txConfs = (r, tip) => r.height === 'Unconfirmed' ? 0 : Math.max(1, (tip || parseInt(r.height, 10)) - parseInt(r.height, 10) + 1);
/* Unconfirmed rows always lead the list (History, Coins); the rest keep their order. */
const unconfirmedFirst = rows => [...rows.filter(r => r.height === 'Unconfirmed'), ...rows.filter(r => r.height !== 'Unconfirmed')];
/* TransactionModal — a History transaction's summary, built from the Send panel parts
   (TxFlowCard + TransactionSummary). Same for every account kind (sp, Multikey).
   No action bar: the header × closes it. Kit: inputs/outputs are mocked from the row. */
const TX_FEE = 0.0000028;
const TX_VSIZE = 154;
/* a stable fake hash/address from a seed (kit only) */
const txHex = (seed, n) => { let h = 0, o = ''; for (let i = 0; o.length < n; i++) { h = (h * 31 + seed.charCodeAt(i % seed.length) + i) >>> 0; o += (h % 16).toString(16); } return o; };
const txAddr = seed => 'tb1p' + txHex(seed + 'a', 58).replace(/[^a-z0-9]/g, 'q');
function txShape(tx) {
  const amt = parseFloat(tx.amount) || 0, id = tx.txid;
  const usd = v => '$' + (v * AMOUNT_RATE).toFixed(2);
  const coin = (w, i, mine, label = '') => ({ w, idx: i, ref: txHex(id + i, 8) + '…' + txHex(id + 'x' + i, 4) + ':' + i, title: `Input #${i}`, addr: txHex(id + i, 6) + '…' + txHex(id + 'x' + i, 4) + ':' + i, usd: usd(w), mine, label, outpoint: txHex(id + i, 64) + ':' + i });
  const out = (w, i, kind, mine, title, label = '') => ({ w, idx: i, ref: txAddr(id + i).slice(0, 10) + '…' + txAddr(id + i).slice(-6), kind, mine, label, title: `Output #${i}` + (title && !/^Output/.test(title) ? ` · ${title}` : ''), address: txAddr(id + i), addr: txAddr(id + i), usd: usd(w) });
  const fee = { w: TX_FEE, kind: 'fee', title: 'Network fee', addr: '(paid to miners)', usd: usd(TX_FEE) };
  if (tx.dir === 'Outgoing') {
    const change = +(amt * 0.4).toFixed(8);
    const ins = [coin(amt + change + TX_FEE, 0, true, 'Payroll')];
    const outs = [out(amt, 0, 'recipient', false, tx.label || 'Output #1', tx.label), out(change, 1, 'change', true, 'Change')];
    return { ins, outs, fee,
      rows: [{ label: 'Sent', value: <BtcText btc={amt} /> }, { label: 'Change', value: <BtcText btc={change} /> }, { label: 'Network fee', value: <BtcText btc={TX_FEE} />, sub: `${(Math.round(TX_FEE * 1e8) / TX_VSIZE).toFixed(1)} sat/vB` }],
      total: { label: 'Total', value: <BtcText btc={amt + TX_FEE} /> } };
  }
  if (tx.dir === 'Self') {
    const ins = [coin(+(amt * 0.6).toFixed(8), 0, true), coin(+(amt * 0.4 + TX_FEE).toFixed(8), 1, true)];
    const outs = [out(amt, 0, 'change', true, tx.label || 'To this wallet', tx.label)];
    return { ins, outs, fee,
      rows: [{ label: 'Moved', value: <BtcText btc={amt} /> }, { label: 'Network fee', value: <BtcText btc={TX_FEE} />, sub: `${(Math.round(TX_FEE * 1e8) / TX_VSIZE).toFixed(1)} sat/vB` }],
      total: { label: 'Total', value: <BtcText btc={amt + TX_FEE} /> } };
  }
  const sender = +(amt * 1.8).toFixed(8);
  const ins = [coin(amt + sender + TX_FEE, 0, false)];
  const outs = [out(amt, 0, 'change', true, tx.label || 'To this wallet', tx.label), out(sender, 1, 'recipient', false, "Sender's change")];
  return { ins, outs, fee, rows: [{ label: 'Network fee (paid by the sender)', value: <BtcText btc={TX_FEE} />, sub: `${(Math.round(TX_FEE * 1e8) / TX_VSIZE).toFixed(1)} sat/vB` }], total: { label: 'Received', value: <BtcText btc={amt} /> } };
}
function TransactionModal({ tx, tip = 0, compact = false, onClose }) {
  const sh = txShape(tx);
  const unconf = tx.height === 'Unconfirmed';
  const confs = txConfs(tx, tip);
  const feeRow = sh.rows.find(r => /fee/i.test(r.label));
  const others = sh.rows.filter(r => r !== feeRow);
  const value = { header: 'Value', width: 120, align: 'right', render: r => <BtcText btc={r.w} /> };
  /* inputs / outputs side by side: index (its diagram colour) · editable label · value.
     The outpoint / address is drawn on the diagram band with the same index. */
  const [labels, setLabels] = React.useState(() => Object.fromEntries([
    ...sh.ins.map(r => ['in' + r.idx, r.label || '']), ...sh.outs.map(r => ['out' + r.idx, r.label || ''])]));
  const [editing, setEditing] = React.useState(null);
  const [draft, setDraft] = React.useState('');
  const commit = k => { setLabels(l => ({ ...l, [k]: draft })); setEditing(null); };
  const cols = (side, color) => [
    { header: '#', width: '3em', render: r => <Legend color={color(r)}>{r.idx}</Legend> },
    { header: 'Label', grow: true, muted: r => editing !== side + r.idx && !labels[side + r.idx],
      cellStyle: r => editing === side + r.idx ? { padding: '3px 6px' } : null,
      render: r => editing === side + r.idx
        ? <Input value={draft} autoFocus width="100%" onChange={e => setDraft(e.target.value)} onBlur={() => commit(side + r.idx)}
            onKeyDown={e => { if (e.key === 'Enter') commit(side + r.idx); if (e.key === 'Escape') setEditing(null); }} />
        : (labels[side + r.idx] || '—') },
    { header: '', width: 34, icon: true, render: r => <Btn id="edit_label_row" onClick={() => { setEditing(side + r.idx); setDraft(labels[side + r.idx]); }} /> },
    value,
  ];
  const inCols = cols('in', () => 'var(--tx-self)');
  const outCols = cols('out', r => r.kind === 'change' ? 'var(--tx-self)' : 'var(--warning)');
  return (
    <Modal title="Transaction" width={820} height="wizard" onClose={onClose}>
        <Stack gap="s" style={{ alignSelf: 'stretch', minWidth: 0 }}>
          <Row gap="s">
            <DirectionIcon dir={tx.dir} />
            <Text variant="body" weight="demibold">{DIRECTIONS[tx.dir].label}</Text>
            {tx.label ? <Text variant="body" color="secondary">{tx.label}</Text> : null}
            <Spacer />
            {unconf ? <Pill id="tx_unconfirmed" /> : <Text variant="mono" color="secondary"><DateStamp value={tx.date} compact={compact} /></Text>}
          </Row>
          {(tx.notes || []).map(n => <Notice key={n} tone="warning">{n}</Notice>)}
          <Stack>
            <KeyValue label="Transaction ID" value={<ShortValue value={/^[0-9a-f]{64}$/.test(tx.txid) ? tx.txid : txHex(tx.txid, 64)} head={64} tail={0} />} />
          </Stack>
          {/* status · size · version on one row */}
          <Row gap="l" align="flex-start">
            <Stack style={{ flex: 2, minWidth: 0 }}>
              <KeyValue label="Status" valueMono={false} value={unconf ? 'In the mempool'
                : <Row gap="s">{confs > 6 ? null : <ConfirmDots n={confs} />}<span>{`${confs.toLocaleString('en-US')} conf. · block ${tx.height}`}</span></Row>} />
            </Stack>
            <Stack style={{ flex: 1, minWidth: 0 }}>
              <KeyValue label="Size" value={`${TX_VSIZE} vB`} />
            </Stack>
            <Stack style={{ flex: 1, minWidth: 0 }}>
              <KeyValue label="Version" value={`2 · lock ${unconf ? tip || '0' : tx.height}`} />
            </Stack>
          </Row>
          <TxFlowCard detail width={760} inputs={sh.ins.map(r => ({ ...r, label: labels['in' + r.idx] }))} outputs={[...sh.outs.map(r => ({ ...r, label: labels['out' + r.idx] })), sh.fee]} />
          <Row gap="l" align="flex-start">
            <Stack style={{ flex: 1, minWidth: 0 }}>
              <Section label="Inputs" count={sh.ins.length} dense>
                <Table columns={inCols} rows={sh.ins} hideHeader />
              </Section>
            </Stack>
            <Stack style={{ flex: 1, minWidth: 0 }}>
              <Section label="Outputs" count={sh.outs.length} dense>
                <Table columns={outCols} rows={sh.outs} hideHeader />
              </Section>
            </Stack>
          </Row>
          {others.length ? <TransactionSummary rows={others} /> : null}
          {/* fee and total share the bottom row */}
          <Divider space="0" />
          <Row gap="l" align="baseline">
            <Stack style={{ flex: 1, minWidth: 0 }}>{feeRow ? <KeyValue label="Fees" value={<span><BtcText btc={TX_FEE} /> · {(Math.round(TX_FEE * 1e8) / TX_VSIZE).toFixed(1)} sat/vB</span>} align="baseline" /> : null}</Stack>
            <Stack style={{ flex: 1, minWidth: 0 }}><KeyValue label={sh.total.label} value={sh.total.value} strong align="baseline" /></Stack>
          </Row>
        </Stack>
    </Modal>
  );
}

/* Laid out like Coins: date (hover: x ago), editable label, compact under 1040px.
   Clicking a row opens its TransactionModal. */
function HistoryScreen({ wallet, compact = false }) {
  const [rows, setRows] = React.useState(unconfirmedFirst(wallet.history));
  const [editing, setEditing] = React.useState(null);
  const [draft, setDraft] = React.useState('');
  React.useEffect(() => { setRows(unconfirmedFirst(wallet.history)); setEditing(null); }, [wallet]);
  const commit = (i) => { const c = [...rows]; c[i] = { ...c[i], label: draft }; setRows(c); setEditing(null); };
  const [open, setOpen] = React.useState(null);
  const tip = parseInt(wallet.electrumHeight, 10) || 0;
  const stop = e => e.stopPropagation();
  const columns = [
    { header: '', width: 16, icon: true, render: (r) => <DirectionIcon dir={r.dir} /> },
    { header: '', width: 13, icon: true, render: (r) => <ConfirmDots n={txConfs(r, tip)} /> },
    { header: 'Date', width: DATE_COL_W[compact ? 'compact' : 'full'], mono: true, pill: true, render: (r) => <DateStamp value={r.date} compact={compact} unconfirmed={r.height === 'Unconfirmed'} /> },
    { key: 'txid', header: 'TxID', width: 175, mono: true },
    { header: 'Label', grow: true,
      muted: (r, i) => editing !== i && !r.label,
      cellStyle: (r, i) => editing === i ? { padding: '3px 6px' } : null,
      render: (r, i) => editing === i
        ? <span style={{ width: '100%' }} onClick={stop}><Input value={draft} autoFocus width="100%"
            onChange={e => setDraft(e.target.value)}
            onBlur={() => commit(i)}
            onKeyDown={e => { if (e.key === 'Enter') commit(i); if (e.key === 'Escape') setEditing(null); }} /></span>
        : (r.label || '—') },
    { header: '', width: 34, icon: true,
      render: (r, i) => <span onClick={stop}><Btn id="edit_label_row" onClick={() => { setEditing(i); setDraft(r.label || ''); }} /></span> },
    { header: 'Amount', width: 130, align: 'right', render: (r) => <BtcText btc={r.amount} /> },
  ];
  return (
    <ScreenWrap title="History">
      <BalanceHeader wallet={wallet} />
      <Table columns={columns} rows={rows} rowStyle={() => ({ cursor: 'pointer' })} onRowClick={r => setOpen(r)} />
      {open ? <TransactionModal tx={open} tip={tip} compact={compact} onClose={() => setOpen(null)} /> : null}
    </ScreenWrap>
  );
}

/* ---------------- Coins ---------------- */
/* compact: the window is under 1040px wide — dates drop the time (as the PSBT list). */
function CoinsScreen({ wallet, compact = false }) {
  const [coins, setCoins] = React.useState(unconfirmedFirst(wallet.coins));
  const [editing, setEditing] = React.useState(null);
  const [draft, setDraft] = React.useState('');
  React.useEffect(() => { setCoins(unconfirmedFirst(wallet.coins)); setEditing(null); }, [wallet]);
  const commit = (i) => { const c = [...coins]; c[i] = { ...c[i], label: draft }; setCoins(c); setEditing(null); };

  const columns = [
    { key: 'type', header: 'Type', width: '4.4em' },
    { header: 'Date', width: DATE_COL_W[compact ? 'compact' : 'full'], mono: true, pill: true, render: (r) => <DateStamp value={r.date} compact={compact} unconfirmed={r.height === 'Unconfirmed'} /> },
    { key: 'outpoint', header: 'OutPoint', width: 175, mono: true },
    { header: 'Label', grow: true,
      muted: (r, i) => editing !== i && !r.label,
      cellStyle: (r, i) => editing === i ? { padding: '3px 6px' } : null,
      render: (r, i) => editing === i
        ? <Input value={draft} autoFocus width="100%"
            onChange={e => setDraft(e.target.value)}
            onBlur={() => commit(i)}
            onKeyDown={e => { if (e.key === 'Enter') commit(i); if (e.key === 'Escape') setEditing(null); }} />
        : (r.label || '—') },
    { header: '', width: 34, icon: true,
      render: (r, i) => (
        <Btn id="edit_label_row" onClick={() => { setEditing(i); setDraft(r.label); }} />) },
    { header: 'Value', width: 130, align: 'right', render: (r) => <BtcText btc={r.value} /> },
  ];

  return (
    <ScreenWrap title="Coins">
      <BalanceHeader wallet={wallet} />
      <Table columns={columns} rows={coins} />
    </ScreenWrap>
  );
}

/* ---------------- Receive ---------------- */
function genAddr(network, kind) {
  const prefix = { Bitcoin: 'bc1', Signet: 'tb1', Testnet: 'tb1', Regtest: 'bcrt1' }[network] || 'bc1';
  const ver = kind === 'taproot' ? 'p' : 'q';
  const chars = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
  let s = '';
  for (let i = 0; i < 38; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return prefix + ver + s;
}



function LabelRow({ label, onSetLabel }) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(label);
  React.useEffect(() => { setDraft(label); }, [label]);
  const commit = () => { onSetLabel(draft.trim()); setEditing(false); };

  if (editing) {
    return (
      <Row gap="s">
        <Input autoFocus value={draft} placeholder="Address label"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
          style={{ width: 220 }} />
        <Btn id="save_label" onClick={commit} />
      </Row>
    );
  }
  if (!label) {
    return (
      <Btn id="add_label" onClick={() => setEditing(true)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xs)' }} />
    );
  }
  return (
    <Row gap="s">
      <Text variant="section" nowrap>{label}</Text>
      <Btn id="edit_label" onClick={() => setEditing(true)} />
    </Row>
  );
}

function AddressRow({ address, placeholder, generatable, onGenerate, onCopy, copied, prevCount = 0, onShowPrev, labelable, label = '', onSetLabel, verifyPlan = window.VERIFY_PLAN }) {
  const [verify, setVerify] = React.useState(false);
  if (!address) {
    return (
      <Stack align="center" gap="l">
        <QRCard size={256} />
        {generatable ? <Btn id="generate" onClick={onGenerate} /> : null}
      </Stack>
    );
  }
  return (
    <React.Fragment>
    <Stack align="center" gap="l">
      <QRCode text={address} size={256} zoom />
      {labelable || generatable ? (
        <Row gap="l">
          {labelable ? <LabelRow label={label} onSetLabel={onSetLabel} /> : null}
          {generatable ? <Btn id="generate_new" onClick={onGenerate} /> : null}
          {generatable && prevCount > 0 ? <Btn id="awaiting_payment" args={prevCount} onClick={onShowPrev} /> : null}
        </Row>
      ) : null}
      <Row justify="center" gap="m" style={{ width: '100%' }}>
        <Tooltip label="Verify on signing device">
          <Btn id="verify_on_device" onClick={() => setVerify(true)} style={{ flex: 'none' }} />
        </Tooltip>
        <ChunkedAddress text={address} />
        <Btn id={copied ? 'copied' : 'copy_address'} onClick={onCopy} />
      </Row>
    </Stack>
    {verify ? <SigningFlow context="verify" plan={verifyPlan} address={address} onCancel={() => setVerify(false)} /> : null}
    </React.Fragment>
  );
}

function PrevAddressesModal({ title, list, onClose, onSetLabel }) {
  const [copied, setCopied] = React.useState(-1);
  const [qr, setQr] = React.useState(-1);
  const [verify, setVerify] = React.useState(null);   // null | { i } — the flow replaces this modal while it runs
  const copy = (text, i) => {
    copyToClipboard(text);
    setCopied(i); setTimeout(() => setCopied(-1), 1400);
  };
  const verifyAddr = verify ? ((list[verify.i] || {}).addr || list[verify.i] || '') : '';
  if (verify) return <SigningFlow context="verify" plan={window.VERIFY_PLAN} address={verifyAddr} onCancel={() => setVerify(null)} />;
  return (
    <React.Fragment>
    <Modal title={title} width={620} onClose={onClose}>
      <Stack>
        <Row gap="m" style={{ paddingBottom: 'var(--space-xs)' }}>
          <span style={{ width: 60, flex: 'none' }}><Eyebrow color="muted" size={10}>Index</Eyebrow></span>
          <Spacer />
        </Row>
        {list.map((item, i) => {
          const addr = item.addr || item;
          const label = item.label || '';
          const index = list.length - 1 - i;   // BIP-style derivation index (newest highest)
          const showQr = qr === i;
          return (
            <div key={i} style={{ borderTop: '1px solid var(--border-light)', padding: 'var(--space-s) 0' }}>
              <Row gap="m">
                <IndexPill index={index} active={showQr} onClick={() => setQr(showQr ? -1 : i)} />
                <Tooltip label="Verify on signing device">
                  <Btn id="verify_on_device_sm" onClick={() => setVerify({ i })} style={{ flex: 'none' }} />
                </Tooltip>
                <Stack grow gap="xxs" style={{ minWidth: 0 }}>
                  {label ? <Text variant="body" color="secondary" weight="demibold" size="sm">{label}</Text> : null}
                  <ChunkedAddress text={addr} />
                </Stack>
                <Btn id={copied === i ? 'copied_sm' : 'copy_sm'} onClick={() => copy(addr, i)} />
              </Row>
              {showQr ? (
                <Stack align="center" gap="m" style={{ paddingTop: 'var(--space-m)' }}>
                  <QRCode text={addr} size={256} zoom />
                  {onSetLabel ? <LabelRow label={label} onSetLabel={(l) => onSetLabel(i, l)} /> : null}
                </Stack>
              ) : null}
            </div>
          );
        })}
      </Stack>
    </Modal>
    </React.Fragment>
  );
}

function ReceiveScreen({ wallet }) {
  const [segwit, setSegwit] = React.useState([]);    // newest first, items: { addr, label }
  const [taproot, setTaproot] = React.useState([]);
  const [copied, setCopied] = React.useState('');
  // One section per kind of address the account receives on (Receive.cpp): a Multikey
  // Wallet only receives on Taproot.
  const musig = wallet.kind === 'musig';
  const [open, setOpen] = React.useState(musig ? 'tr' : 'sp');
  const [modal, setModal] = React.useState(null);    // 'sw' | 'tr'
  React.useEffect(() => { setSegwit([]); setTaproot([]); setCopied(''); setOpen(musig ? 'tr' : 'sp'); setModal(null); }, [wallet]);
  const toggle = (id) => setOpen((cur) => (cur === id ? '' : id));
  const copy = (text, key) => {
    copyToClipboard(text);
    setCopied(key); setTimeout(() => setCopied(''), 1400);
  };
  const setLabel = (setList) => (label) => setList((l) => l.map((it, i) => (i === 0 ? { ...it, label } : it)));
  const setLabelAt = (setList) => (i, label) => setList((l) => l.map((it, idx) => (idx === i ? { ...it, label } : it)));

  return (
    <ScreenWrap title="Receive">
      <Stack>
        {musig ? null : (<React.Fragment>
        <FoldSection id="sp" label="Silent Payment Address" open={open === 'sp'} onToggle={toggle}>
          <AddressRow address={SP_ADDRESS} verifyPlan={window.SP_VERIFY_PLAN} onCopy={() => copy(SP_ADDRESS, 'sp')} copied={copied === 'sp'} />
        </FoldSection>

        <Ruler />
        <FoldSection id="sw" label="Segwit Address" open={open === 'sw'} onToggle={toggle}>
          <AddressRow address={(segwit[0] || {}).addr || ''} placeholder="Not generated yet. Click Generate." generatable
            label={(segwit[0] || {}).label || ''} onSetLabel={setLabel(setSegwit)} labelable
            prevCount={Math.max(0, segwit.length - 1)}
            onShowPrev={() => setModal('sw')}
            onGenerate={() => setSegwit((l) => [{ addr: genAddr(wallet.network, 'segwit'), label: '' }, ...l])}
            onCopy={() => copy((segwit[0] || {}).addr, 'sw')} copied={copied === 'sw'} />
        </FoldSection>

        <Ruler />
        </React.Fragment>)}
        {/* a Multikey Wallet has Taproot only: its address, no section header */}
        {musig ? <AddressRow address={(taproot[0] || {}).addr || ''} placeholder="Not generated yet. Click Generate." generatable
              label={(taproot[0] || {}).label || ''} onSetLabel={setLabel(setTaproot)} labelable
              prevCount={Math.max(0, taproot.length - 1)}
              onShowPrev={() => setModal('tr')}
              onGenerate={() => setTaproot((l) => [{ addr: genAddr(wallet.network, 'taproot'), label: '' }, ...l])}
              onCopy={() => copy((taproot[0] || {}).addr, 'tr')} copied={copied === 'tr'} /> : (
        <FoldSection id="tr" label="Taproot Address" open={open === 'tr'} onToggle={toggle}>
          <AddressRow address={(taproot[0] || {}).addr || ''} placeholder="Not generated yet. Click Generate." generatable
            label={(taproot[0] || {}).label || ''} onSetLabel={setLabel(setTaproot)} labelable
            prevCount={Math.max(0, taproot.length - 1)}
            onShowPrev={() => setModal('tr')}
            onGenerate={() => setTaproot((l) => [{ addr: genAddr(wallet.network, 'taproot'), label: '' }, ...l])}
            onCopy={() => copy((taproot[0] || {}).addr, 'tr')} copied={copied === 'tr'} />
        </FoldSection>)}
      </Stack>
      {modal === 'sw' ? <PrevAddressesModal title="Segwit Addresses" list={segwit}
        onSetLabel={setLabelAt(setSegwit)} onClose={() => setModal(null)} /> : null}
      {modal === 'tr' ? <PrevAddressesModal title={musig ? 'Addresses' : 'Taproot Addresses'} list={taproot}
        onSetLabel={setLabelAt(setTaproot)} onClose={() => setModal(null)} /> : null}
    </ScreenWrap>
  );
}

Object.assign(window, { TransactionModal, HistoryScreen, CoinsScreen, ReceiveScreen, ScreenWrap, DashboardLayout, Ruler, AddressRow, PrevAddressesModal, genAddr,
  DASH_MIN_W, DASH_COL_MAX, DASH_MAX_W, DASH_GUTTER, DASH_SPLIT_AT, DASH_WIDE_AT, DASH_TOP_GAP, LayoutInfo });
