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

function DashboardLayout({ title, primary, secondary = null }) {
  const [ref, w] = useMeasure();
  const two = secondary != null && secondary !== false;
  const sideBySide = two && w >= DASH_SPLIT_AT;
  const wide = w >= DASH_WIDE_AT;
  // One column caps at DASH_COL_MAX; a side-by-side pair caps at DASH_MAX_W in
  // total. A stacked two-column screen behaves like a single column.
  const blockMin = sideBySide ? DASH_SPLIT_AT : DASH_MIN_W;
  const blockMax = sideBySide ? DASH_MAX_W : DASH_COL_MAX;
  const blockW = w > 0 ? Math.min(Math.max(w, blockMin), blockMax) : 0;
  const colWidth = Math.round(sideBySide ? (blockW - DASH_GUTTER) / 2 : blockW);

  const info = { available: w, columns: two ? 2 : 1, sideBySide, colWidth, wide };
  const render = (c) => (typeof c === 'function' ? c(info) : c);

  return (
    <div ref={ref} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minWidth: 0, boxSizing: 'border-box' }}>
      <div style={{ boxSizing: 'border-box', minWidth: blockMin, maxWidth: blockMax,
        margin: '0 auto', marginTop: wide ? DASH_TOP_GAP : 0, padding: 'var(--space-s)' }}>
        <LayoutInfo.Provider value={info}>
          {title ? <Text as="div" variant="title" style={{ marginBottom: 'var(--space-m)' }}>{title}</Text> : null}
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
function ScreenWrap({ title, children }) {
  return <DashboardLayout title={title} primary={children} />;
}

function Ruler() {
  return <Divider space="m" />;
}

/* ---------------- History ---------------- */
function HistoryScreen({ wallet }) {
  const columns = [
    { key: 'dir', header: 'Direction', width: 120 },
    { key: 'txid', header: 'TxID', width: 180, mono: true },
    { key: 'height', header: 'Height', width: 110, muted: (r) => r.height === 'Unconfirmed' },
    { header: 'Amount', grow: true, align: 'right', render: (r) => `${r.amount} BTC` },
  ];
  return (
    <ScreenWrap title="History">
      <BalanceHeader wallet={wallet} />
      <Table columns={columns} rows={wallet.history} />
    </ScreenWrap>
  );
}

/* ---------------- Coins ---------------- */
function CoinsScreen({ wallet }) {
  const [coins, setCoins] = React.useState(wallet.coins);
  const [editing, setEditing] = React.useState(null);
  const [draft, setDraft] = React.useState('');
  React.useEffect(() => { setCoins(wallet.coins); setEditing(null); }, [wallet]);
  const commit = (i) => { const c = [...coins]; c[i] = { ...c[i], label: draft }; setCoins(c); setEditing(null); };

  const columns = [
    { key: 'type', header: 'Type', width: 90 },
    { key: 'height', header: 'Height', width: 110, muted: (r) => r.height === 'Unconfirmed' },
    { key: 'outpoint', header: 'OutPoint', width: 175, mono: true },
    { header: 'Label', grow: true,
      muted: (r, i) => editing !== i && !r.label,
      cellStyle: (r, i) => editing === i ? { padding: '3px 6px' } : null,
      render: (r, i) => editing === i
        ? <Input value={draft} autoFocus style={{ width: '100%', boxSizing: 'border-box' }}
            onChange={e => setDraft(e.target.value)}
            onBlur={() => commit(i)}
            onKeyDown={e => { if (e.key === 'Enter') commit(i); if (e.key === 'Escape') setEditing(null); }} />
        : (r.label || '—') },
    { header: '', width: 34, cellStyle: () => ({ padding: '0 4px' }),
      render: (r, i) => (
        <Button role="inline-icon" onClick={() => { setEditing(i); setDraft(r.label); }}>
          <Icon name="pencil" size={15} />
        </Button>) },
    { header: 'Value', width: 150, align: 'right', render: (r) => `${r.value} BTC` },
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
        <Button role="inline-icon" title="Save" onClick={commit}><Icon name="check" size={15} /></Button>
      </Row>
    );
  }
  if (!label) {
    return (
      <Button role="inline" onClick={() => setEditing(true)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
        <Icon name="plus" size={14} /> Add a label
      </Button>
    );
  }
  return (
    <Row gap="s">
      <Text variant="body" weight="demibold" nowrap style={{ fontSize: 14 }}>{label}</Text>
      <Button role="inline-icon" title="Edit label" onClick={() => setEditing(true)}>
        <Icon name="pencil" size={14} />
      </Button>
    </Row>
  );
}

function AddressRow({ address, placeholder, generatable, onGenerate, onCopy, copied, prevCount = 0, onShowPrev, labelable, label = '', onSetLabel }) {
  const [verify, setVerify] = React.useState(null);   // null | {} (picking) | { device } (confirming)
  if (!address) {
    return (
      <Stack align="center" gap="m" style={{ padding: 'var(--space-l) 0' }}>
        <Text variant="body" color="muted">{placeholder}</Text>
        {generatable ? <Button onClick={onGenerate}>Generate</Button> : null}
      </Stack>
    );
  }
  return (
    <React.Fragment>
    <Stack align="center" gap="l">
      <QRCode text={address} size={256} zoom />
      {labelable ? <LabelRow label={label} onSetLabel={onSetLabel} /> : null}
      <Row justify="center" gap="m" style={{ width: '100%' }}>
        <Tooltip label="Verify on signing device">
          <Button role="icon" onClick={() => setVerify({})} style={{ flex: 'none' }}>
            <Icon name="usb" size={20} />
          </Button>
        </Tooltip>
        <ChunkedAddress text={address} />
        <Button role="icon" title="Copy address" onClick={onCopy} style={{ flex: 'none' }}>
          <Icon name={copied ? 'check' : 'copy'} size={20} />
        </Button>
      </Row>
      {generatable ? (
        <Row gap="l">
          <Button onClick={onGenerate} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
            <Icon name="refresh" size={15} /> Generate new
          </Button>
          {prevCount > 0 ? (
            <Button role="inline" onClick={onShowPrev}>Addr. awaiting payment ({prevCount})</Button>
          ) : null}
        </Row>
      ) : null}
    </Stack>
    {verify && !verify.device ? (
      <SelectSigner title="Verify on device"
        devices={(window.SIGNER_DEVICES || []).filter((d) => d.kind !== 'sd')}
        onCancel={() => setVerify(null)}
        onPick={(d) => setVerify({ device: d })} />
    ) : null}
    {verify && verify.device ? (
      <VerifyAddress device={verify.device} address={address} onCancel={() => setVerify(null)} />
    ) : null}
    </React.Fragment>
  );
}

/* Verify an address on a hardware signer — confirm-on-device step, mirrors
   Send.jsx's UsbConfirm but for address verification rather than signing.
   USB devices confirm on-screen; QR airgap devices scan the address QR. */
function VerifyAddress({ device, address, onCancel }) {
  const isQr = device.kind === 'qr';
  return (
    <Modal title={device.name} width={460} onClose={onCancel}>
      <ModalStatus spinner={!isQr}
        title={isQr ? 'Scan the address on your device…' : 'Confirm the address on your device…'}
        subtitle={isQr
          ? `Scan this QR with ${device.name} and check the address it shows matches before sharing it.`
          : `Check that the address shown on ${device.name} matches the one below before sharing it.`}
        pad="var(--space-l) 0 var(--space-m)">
        {isQr ? <QRCode text={address} size={208} zoom /> : null}
        <Card tone="inset" style={{ padding: 'var(--space-m)', width: '100%', boxSizing: 'border-box' }}>
          <ChunkedAddress text={address} />
        </Card>
        <Button onClick={onCancel}>Cancel</Button>
      </ModalStatus>
    </Modal>
  );
}

function PrevAddressesModal({ title, list, onClose, onSetLabel }) {
  const [copied, setCopied] = React.useState(-1);
  const [qr, setQr] = React.useState(-1);
  const [verify, setVerify] = React.useState(null);   // null | { i } (picking signer) | { i, device } (confirming)
  const copy = (text, i) => {
    copyToClipboard(text);
    setCopied(i); setTimeout(() => setCopied(-1), 1400);
  };
  const verifyAddr = verify ? ((list[verify.i] || {}).addr || list[verify.i] || '') : '';
  return (
    <React.Fragment>
    <Modal title={title} width={620} onClose={onClose}>
      <Stack>
        <Row gap="m" style={{ paddingBottom: 'var(--space-xs)' }}>
          <Eyebrow color="muted" size={10} style={{ width: 60, flex: 'none', letterSpacing: '0.06em' }}>Index</Eyebrow>
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
                  <Button role="inline-icon" onClick={() => setVerify({ i })} style={{ flex: 'none' }}>
                    <Icon name="usb" size={15} />
                  </Button>
                </Tooltip>
                <Stack grow style={{ minWidth: 0 }}>
                  {label ? <Text variant="body" color="secondary" weight="demibold" style={{ fontSize: 12, marginBottom: 3 }}>{label}</Text> : null}
                  <ChunkedAddress text={addr} />
                </Stack>
                <Button role="inline-icon" title="Copy" onClick={() => copy(addr, i)} style={{ flex: 'none' }}>
                  <Icon name={copied === i ? 'check' : 'copy'} size={15} />
                </Button>
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
    {verify && !verify.device ? (
      <SelectSigner title="Verify on device"
        devices={(window.SIGNER_DEVICES || []).filter((d) => d.kind !== 'sd')}
        onCancel={() => setVerify(null)}
        onPick={(d) => setVerify((v) => ({ i: v.i, device: d }))} />
    ) : null}
    {verify && verify.device ? (
      <VerifyAddress device={verify.device} address={verifyAddr} onCancel={() => setVerify(null)} />
    ) : null}
    </React.Fragment>
  );
}

function ReceiveScreen({ wallet }) {
  const [segwit, setSegwit] = React.useState([]);    // newest first, items: { addr, label }
  const [taproot, setTaproot] = React.useState([]);
  const [copied, setCopied] = React.useState('');
  const [open, setOpen] = React.useState('sp');
  const [modal, setModal] = React.useState(null);    // 'sw' | 'tr'
  React.useEffect(() => { setSegwit([]); setTaproot([]); setCopied(''); setOpen('sp'); setModal(null); }, [wallet]);
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
        <FoldSection id="sp" label="Silent Payment Address" open={open === 'sp'} onToggle={toggle}>
          <AddressRow address={SP_ADDRESS} onCopy={() => copy(SP_ADDRESS, 'sp')} copied={copied === 'sp'} />
        </FoldSection>

        <Ruler />
        <FoldSection id="sw" label="Segwit Address" open={open === 'sw'} onToggle={toggle}>
          <AddressRow address={(segwit[0] || {}).addr || ''} placeholder="Not generated yet — click Generate" generatable
            label={(segwit[0] || {}).label || ''} onSetLabel={setLabel(setSegwit)} labelable
            prevCount={Math.max(0, segwit.length - 1)}
            onShowPrev={() => setModal('sw')}
            onGenerate={() => setSegwit((l) => [{ addr: genAddr(wallet.network, 'segwit'), label: '' }, ...l])}
            onCopy={() => copy((segwit[0] || {}).addr, 'sw')} copied={copied === 'sw'} />
        </FoldSection>

        <Ruler />
        <FoldSection id="tr" label="Taproot Address" open={open === 'tr'} onToggle={toggle}>
          <AddressRow address={(taproot[0] || {}).addr || ''} placeholder="Not generated yet — click Generate" generatable
            label={(taproot[0] || {}).label || ''} onSetLabel={setLabel(setTaproot)} labelable
            prevCount={Math.max(0, taproot.length - 1)}
            onShowPrev={() => setModal('tr')}
            onGenerate={() => setTaproot((l) => [{ addr: genAddr(wallet.network, 'taproot'), label: '' }, ...l])}
            onCopy={() => copy((taproot[0] || {}).addr, 'tr')} copied={copied === 'tr'} />
        </FoldSection>
      </Stack>
      {modal === 'sw' ? <PrevAddressesModal title="Segwit Addresses" list={segwit}
        onSetLabel={setLabelAt(setSegwit)} onClose={() => setModal(null)} /> : null}
      {modal === 'tr' ? <PrevAddressesModal title="Taproot Addresses" list={taproot}
        onSetLabel={setLabelAt(setTaproot)} onClose={() => setModal(null)} /> : null}
    </ScreenWrap>
  );
}

Object.assign(window, { HistoryScreen, CoinsScreen, ReceiveScreen, ScreenWrap, DashboardLayout, Ruler, AddressRow, genAddr,
  DASH_MIN_W, DASH_COL_MAX, DASH_MAX_W, DASH_GUTTER, DASH_SPLIT_AT, DASH_WIDE_AT, DASH_TOP_GAP, LayoutInfo });
