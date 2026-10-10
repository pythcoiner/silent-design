/* Silent UI Kit — Send screen (Send.cpp + signer/PSBT/broadcast modals).
   Two-pane layout: payments + coin selection on the left, a persistent
   transaction summary / send rail on the right (with a tx-shape diagram). */

function looksLikeAddress(s) { return /^(sp1|bc1|tb1|bcrt1)[a-z0-9]{6,}$/i.test(s.trim()); }
function looksLikeAmount(s) { const v = parseFloat(s); return !isNaN(v) && v > 0; }

/* Mock spot price for the BTC <-> USD field. In the app this comes from the
   price oracle; the two inputs convert reciprocally on edit. */
const USD_RATE = 68000;
const btcToUsd = b => looksLikeAmount(b) ? (parseFloat(b) * USD_RATE).toFixed(2) : '';
const usdToBtc = u => looksLikeAmount(u) ? (parseFloat(u) / USD_RATE).toFixed(8) : '';

function RecipientCard({ out, idx, deletable, canMax, onChange, onDelete }) {
  const addrState = out.address === '' ? 'none' : looksLikeAddress(out.address) ? 'valid' : 'invalid';
  const amtState = out.max ? 'none' : out.amount === '' ? 'none' : looksLikeAmount(out.amount) ? 'valid' : 'invalid';
  return (
    <Card style={{ position: 'relative' }}>
      {deletable ? (
        <Button role="inline-icon" onClick={onDelete} title="Remove payment"
          style={{ position: 'absolute', top: 8, left: 8 }}><Icon name="x" size={16} /></Button>
      ) : null}

      <PaymentRow label="Address">
        <ValidatedInput mono state={addrState} placeholder="sp1q… / bc1q…"
          value={out.address} onChange={e => onChange({ ...out, address: e.target.value })} />
      </PaymentRow>

      <PaymentRow label="Description">
        <ValidatedInput state="none" placeholder="Payment label"
          value={out.label} onChange={e => onChange({ ...out, label: e.target.value })} />
      </PaymentRow>

      <PaymentRow label="Amount (BTC)">
        <Row gap="m">
          <ValidatedInput mono state={amtState} placeholder="0.001 (in BTC)" disabled={out.max}
            value={out.max ? 'MAX' : out.amount} wrapStyle={{ flex: 1, minWidth: 0 }}
            onChange={e => onChange({ ...out, amount: e.target.value, usd: btcToUsd(e.target.value) })} />
          <Text variant="body" weight="demibold" color="secondary" style={{ flex: 'none' }}>~USD</Text>
          <Row gap={6} grow style={{ minWidth: 0 }}>
            <Text variant="mono" color="muted">$</Text>
            <Input mono placeholder="Enter amount in USD" disabled={out.max} value={out.usd}
              style={{ flex: 1, minWidth: 0, boxSizing: 'border-box' }}
              onChange={e => onChange({ ...out, usd: e.target.value, amount: usdToBtc(e.target.value) })} />
          </Row>
          {canMax ? (
            <Row style={{ flex: 'none' }}>
              <Checkbox checked={out.max} onChange={v => onChange({ ...out, max: v })} label="MAX" />
            </Row>
          ) : null}
        </Row>
      </PaymentRow>
    </Card>
  );
}

/* useMeasure lives in Primitives.jsx — shared by the dashboard layout and Send. */
function SendScreen({ wallet }) {
  const [outputs, setOutputs] = React.useState([{ address: '', amount: '', usd: '', label: '', max: false }]);
  const [feeRate, setFeeRate] = React.useState(true); // true = sats/vb, false = sats
  const [fee, setFee] = React.useState('1');
  const [auto, setAuto] = React.useState(true);
  const [selected, setSelected] = React.useState({});
  const [modal, setModal] = React.useState(null); // null | 'confirm' | 'sending' | 'sent'
  const [signed, setSigned] = React.useState(false);

  React.useEffect(() => { setOutputs([{ address: '', amount: '', usd: '', label: '', max: false }]); setSelected({}); setModal(null); setSigned(false); }, [wallet]);

  const clearAll = () => { clearOutputs(); setSelected({}); setSigned(false); };

  const anyMax = outputs.some(o => o.max);
  const setOut = (i, v) => setOutputs(outputs.map((o, k) => k === i ? v : o));
  const addOutput = () => setOutputs([...outputs, { address: '', amount: '', usd: '', label: '', max: false }]);
  const delOutput = (i) => setOutputs(outputs.filter((_, k) => k !== i));
  const clearOutputs = () => setOutputs([{ address: '', amount: '', usd: '', label: '', max: false }]);

  const valid = outputs.every(o => looksLikeAddress(o.address) && (o.max || looksLikeAmount(o.amount))) && looksLikeAmount(fee);
  const selCount = Object.values(selected).filter(Boolean).length;

  // Auto coin selection — mock the Rust simulation: greedily cover the
  // recipients' total (largest coins first), or take everything if a MAX output exists.
  const btcOf = s => parseFloat(String(s).split(' ')[0]) || 0;
  const reqTotal = outputs.reduce((s, o) => s + (!o.max && looksLikeAmount(o.amount) ? parseFloat(o.amount) : 0), 0);
  const autoSel = (() => {
    const sorted = [...wallet.coins].map(c => btcOf(c.value)).sort((a, b) => b - a);
    let amount = 0, count = 0;
    for (const v of sorted) {
      if (!anyMax && amount >= reqTotal) break;
      amount += v; count++;
    }
    return { amount, count };
  })();

  const recipients = outputs.map(o => `${o.address.slice(0, 12)}…  ${o.max ? 'MAX' : o.amount + ' BTC'}`);

  // Indices auto-selection picks (largest first), so an unfolded list can show them.
  const autoIdxSet = (() => {
    const order = wallet.coins.map((c, i) => [i, btcOf(c.value)]).sort((a, b) => b[1] - a[1]);
    const set = new Set();
    let amount = 0;
    for (const [i, v] of order) { if (!anyMax && amount >= reqTotal) break; amount += v; set.add(i); }
    return set;
  })();

  // Layout is delegated to DashboardLayout: Send hands it two columns and it
  // decides single vs side-by-side. The column builders below are functions of
  // that decision ({ sideBySide }) so their inner content can adapt.

  // --- transaction math (mock) ---
  const selCoins = auto
    ? [...wallet.coins].sort((a, b) => btcOf(b.value) - btcOf(a.value)).slice(0, autoSel.count)
    : wallet.coins.filter((_, i) => selected[i]);
  const inSum = selCoins.reduce((a, c) => a + btcOf(c.value), 0);
  const feeNum = looksLikeAmount(fee) ? parseFloat(fee) : 0;
  const feeBtc = (feeRate ? feeNum * 200 : feeNum) / 1e8; // mock ~200 vB tx
  const sendBtc = anyMax ? Math.max(0, inSum - feeBtc) : reqTotal;
  const sendUsd = sendBtc > 0 ? '$' + (sendBtc * USD_RATE).toFixed(2) : '';
  const totalBtc = sendBtc + feeBtc;
  const fmt8 = n => n.toFixed(8) + ' BTC';

  // diagram data
  const inItems = selCoins.map((c, i) => ({
    w: btcOf(c.value), title: `Input #${i + 1}`,
    usd: '$' + (btcOf(c.value) * USD_RATE).toFixed(2), addr: c.outpoint,
  }));
  const recipItems = outputs.map((o, i) => {
    const v = o.max ? sendBtc : (parseFloat(o.amount) || 0);
    return { w: v, kind: 'recipient', title: o.label ? o.label : `Output #${i + 1}`, label: o.label,
      usd: v > 0 ? '$' + (v * USD_RATE).toFixed(2) : '', addr: o.address || 'recipient address…' };
  }).filter(d => d.w > 0);
  const changeV = anyMax ? 0 : Math.max(0, inSum - reqTotal - feeBtc);
  const outItems = [
    ...recipItems,
    ...(changeV > 1e-9 ? [{ w: changeV, kind: 'change', title: 'Change', usd: '$' + (changeV * USD_RATE).toFixed(2), addr: '(returned to your wallet)' }] : []),
    ...(feeBtc > 0 && inSum > 0 ? [{ w: feeBtc, kind: 'fee', title: 'Network fee', usd: '$' + (feeBtc * USD_RATE).toFixed(2), addr: '(paid to miners)' }] : []),
  ];

  const coinsHeader = (
    <Row gap="s" style={{ marginBottom: 'var(--space-s)', minHeight: 34 }}>
      <SectionLabel>{auto ? 'Coins selection' : selCount > 0 ? `Coins · ${selCount} selected` : 'Coins selection'}</SectionLabel>
      <Spacer />
      {!auto ? <Button onClick={() => setSelected({})}>Clear</Button> : null}
      <Checkbox checked={auto} onChange={setAuto} label="Auto coin selection" />
    </Row>
  );

  // Fold to a one-line summary only when stacked + auto; otherwise show the full list.
  const coinsBodyFor = (sideBySide) => (auto && !sideBySide) ? (
    <Card tone="inset" style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-s)',
      borderRadius: 'var(--radius-input)', padding: '11px var(--pad-m)' }}>
      <Amount value={autoSel.amount.toFixed(8)} size="lg" unit="BTC"
        count={`(${autoSel.count} coin${autoSel.count === 1 ? '' : 's'})`} />
    </Card>
  ) : (
    <CoinTable coins={wallet.coins} readOnly={auto}
      isChecked={(c, i) => auto ? autoIdxSet.has(i) : !!selected[i]}
      onToggle={(i, v) => setSelected({ ...selected, [i]: v })} />
  );

  const renderPrimary = ({ sideBySide }) => (
    <div inert={signed ? '' : undefined}
      style={{ opacity: signed ? 0.55 : 1, transition: 'opacity 0.15s', position: 'relative' }}>
      {/* Coins selection — always on top */}
      {coinsHeader}
      {coinsBodyFor(sideBySide)}

      <Divider space="0" style={{ margin: 'var(--space-l) 0 var(--space-m)' }} />

      {/* Payments */}
      <SectionLabel style={{ marginBottom: 'var(--space-s)' }}>Payments</SectionLabel>
      <Stack gap="s">
        {outputs.map((o, i) => (
          <RecipientCard key={i} out={o} idx={i} deletable={outputs.length > 1}
            canMax={!anyMax || o.max} onChange={v => setOut(i, v)} onDelete={() => delOutput(i)} />
        ))}
      </Stack>
      <Row justify="flex-end" style={{ marginTop: 'var(--space-s)' }}>
        <Button onClick={addOutput} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="plus" size={16} />Add payment
        </Button>
      </Row>
    </div>
  );

  const txDiagram = (
    <Card tone="inset" style={{ borderRadius: 10, padding: '10px 8px 6px' }}>
      <TxFlow inputs={inItems} outputs={outItems} />
      {inItems.length && outItems.length ? (
        <Row justify="space-between" style={{ padding: '6px 6px 2px' }}>
          <Eyebrow size={10} color="muted">{inItems.length} input{inItems.length === 1 ? '' : 's'}</Eyebrow>
          <Row inline gap={12}>
            <Legend color="var(--warning)">recipient</Legend>
            {outItems.some(o => o.kind === 'change') ? (
              <Legend color="var(--tx-self)">change</Legend>
            ) : null}
            {outItems.some(o => o.kind === 'fee') ? (
              <Legend color="var(--error)">fee</Legend>
            ) : null}
          </Row>
          <Eyebrow size={10} color="muted">{outItems.length} output{outItems.length === 1 ? '' : 's'}</Eyebrow>
        </Row>
      ) : null}
    </Card>
  );

  const summaryRows = (
    <TransactionSummary
      rows={[
        { label: 'Sending', value: fmt8(sendBtc), sub: sendUsd },
        { label: 'Network fee', value: fmt8(feeBtc) },
        changeV > 1e-9 ? { label: 'Change', value: fmt8(changeV) } : null,
      ]}
      total={{ label: 'Total', value: fmt8(totalBtc) }} />
  );

  const actionRow = (
    <Row align="flex-end" gap="s">
      <div style={{ flex: 'none', opacity: signed ? 0.5 : 1, pointerEvents: signed ? 'none' : 'auto' }}>
        <FieldLabel>Fee rate</FieldLabel>
        <Row gap="s">
          <Toggle on={feeRate} onClick={() => setFeeRate(r => !r)} />
          <ValidatedInput mono maxLength={6} inputMode="numeric" state={looksLikeAmount(fee) ? 'valid' : 'invalid'}
            value={fee} onChange={e => setFee(e.target.value.replace(/[^\d.]/g, '').slice(0, 6))}
            wrapStyle={{ flex: 'none', width: 104 }} />
          <Text variant="body" color="secondary" style={{ flex: 'none' }}>{feeRate ? 'sats/vB' : 'sats'}</Text>
        </Row>
      </div>
      <Spacer />
      <Row gap="s" style={{ flex: 'none' }}>
        {signed ? (
          <Badge tone="success" icon="check">Signed</Badge>
        ) : null}
        <Button onClick={clearAll} style={{ flex: 'none' }}>Clear</Button>
        {signed ? (
          <Button role="primary" onClick={() => setModal({ type: 'broadcast' })} style={{ flex: 'none' }}>Broadcast</Button>
        ) : (
          <Button role="primary" disabled={!valid} onClick={() => setModal('signer')} style={{ flex: 'none' }}>Sign</Button>
        )}
      </Row>
    </Row>
  );

  const renderSecondary = ({ sideBySide }) => (
    <React.Fragment>
      {/* heading: same style + row height as the Coins selection heading, so they align */}
      <Row style={{ minHeight: 34, marginBottom: 'var(--space-s)' }}>
        <SectionLabel>Transaction</SectionLabel>
      </Row>
      {sideBySide ? (
        /* side-by-side: diagram on top, gap, then summary + buttons grouped at the bottom */
        <React.Fragment>
          {txDiagram}
          <div style={{ flex: '1 0 100px' }} />
          {summaryRows}
          <div style={{ marginTop: 'var(--space-m)' }}>{actionRow}</div>
        </React.Fragment>
      ) : (
        /* single column: summary, then buttons, then the diagram last */
        <Stack gap="m">
          {summaryRows}
          {actionRow}
          {txDiagram}
        </Stack>
      )}
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <DashboardLayout title="Send" primary={renderPrimary} secondary={renderSecondary} />
      {modal === 'signer' ? (
        <SelectSigner walletName={wallet.name}
          onCancel={() => setModal(null)}
          onPick={(d) => setModal(d.kind === 'sd' ? { type: 'sd', device: d }
            : d.kind === 'qr' ? { type: 'qr' }
            : { type: 'usb', device: d })} />
      ) : null}
      {modal && modal.type === 'usb' ? (
        <UsbConfirm device={modal.device} onCancel={() => setModal(null)} />
      ) : null}
      {modal && modal.type === 'sd' ? (
        <SdPicker device={modal.device} onCancel={() => setModal(null)} />
      ) : null}
      {modal && modal.type === 'qr' ? (
        <ScanPsbt onCancel={() => setModal(null)} onNext={() => setModal({ type: 'qr-scan' })} />
      ) : null}
      {modal && modal.type === 'qr-scan' ? (
        <ScanCamera onCancel={() => setModal(null)} onBack={() => setModal({ type: 'qr' })}
          onDone={() => { setSigned(true); setModal(null); }} />
      ) : null}
      {modal && modal.type === 'broadcast' ? (
        <BroadcastModal onClose={() => { clearAll(); setModal(null); }} />
      ) : null}
    </React.Fragment>
  );
}

const SIGNER_DEVICES = [
  { name: 'Ledger Nano S Plus', fp: '#a4f9c821', icon: 'usb', kind: 'usb' },
  { name: 'Coldcard Mk4', fp: '#7e02da41', icon: 'usb', kind: 'usb' },
  { name: 'BitBox02', fp: '#b1740c3e', icon: 'usb', kind: 'usb' },
  { name: 'SD card airgap device', icon: 'sd_card', kind: 'sd' },
  { name: 'QR Code airgap device', icon: 'qr', kind: 'qr' },
];

function SelectSigner({ walletName, onCancel, onPick, devices = SIGNER_DEVICES, title = 'Select a signer' }) {
  return (
    <Modal title={title} width={520} onClose={onCancel}>
      <Stack gap="s">
        {devices.map((d, i) => (
          <SelectRow key={i} icon={d.icon} title={d.name} meta={d.fp} onClick={() => onPick(d)} />
        ))}
      </Stack>
    </Modal>
  );
}

/* USB hardware-wallet: waiting for on-device confirmation. */
function UsbConfirm({ device, onCancel }) {
  return (
    <Modal title={device.name} width={460} onClose={onCancel}>
      <ModalStatus spinner title="Confirm on your device…"
        subtitle={`Review the transaction details on ${device.name} and approve to sign.`}
        pad="var(--space-l) 0 var(--space-m)">
        <Button onClick={onCancel}>Cancel</Button>
      </ModalStatus>
    </Modal>
  );
}

/* SD-card airgap: placeholder for the OS file picker. */
function SdPicker({ device, onCancel }) {
  return (
    <Modal title={device.name} width={460} onClose={onCancel}>
      <ModalStatus icon="folder" title="Must open a file picker"
        subtitle="Save the unsigned PSBT to the SD card, sign it on the device, then load the signed file back." />
    </Modal>
  );
}

/* QR airgap: animated PSBT QR with display tuning. */
const PSBT_PAYLOAD = (
  'cHNidP8BAHECAAAAAfwzq1kY2hVi9k3lQ8nT0pXrWb7mGv4Lh2Jd9sKfP1aoAAAAAAA' +
  'D9____AoCWmAAAAAAAFgAUq3Zr8tN1dJ0hLmC4wVfYx2kPbT5AQg8AAAAAABYAFLuh' +
  '7cP2mZ9oXkqR3sVbTtMu1nQwAAAAAAEBH0BCDwAAAAAAFgAU8aQxk2nF0pZ7Lm3vBt' +
  'WcYxRd9KsiBgL0nT8qWvLh2Jd9sKfP1ao9k3lQ8nT0pXrWb7mGv4Lh0Yz1a8tVAAAA' +
  'gAAAAIAAAACAAAAAAAAAAAAAAQUiAgL0nT8qWvLh2Jd9sKfP1ao9k3lQ8nT0pXrWb7m'
);

function ScanPsbt({ onCancel, onNext }) {
  const [contrast, setContrast] = React.useState(3);   // 1–5
  const [density, setDensity] = React.useState(3);     // 1–5
  const [speed, setSpeed] = React.useState(3);         // 1–5

  const parts = React.useMemo(() => {
    const chunk = density * 24;                         // fewer chars at low density = less dense QR
    const n = Math.max(2, Math.ceil(PSBT_PAYLOAD.length / chunk));
    const out = [];
    for (let i = 0; i < n; i++) {
      const body = PSBT_PAYLOAD.slice(i * chunk, (i + 1) * chunk);
      out.push(`UR:CRYPTO-PSBT/${i + 1}-${n}/${body}`);
    }
    return out;
  }, [density]);

  const [frame, setFrame] = React.useState(0);
  const interval = 520 - speed * 80;                    // faster = shorter interval
  React.useEffect(() => {
    setFrame(0);
    const id = setInterval(() => setFrame((f) => (f + 1) % parts.length), interval);
    return () => clearInterval(id);
  }, [parts, interval]);

  const svg = React.useMemo(() => qrSvg(parts[frame] || '', { ecOrder: ['L', 'M'] }), [parts, frame]);

  const bgL = 40 + (contrast - 1) * 15;                // contrast 5 = white bg, 1 = dark grey bg (low contrast)
  const bg = `hsl(220 14% ${bgL}%)`;

  return (
    <Modal title="Show PSBT" width={860} onClose={onCancel}>
      <Stack align="center" gap="m">
        <QRCard size={720} pad={20} radius={12} bg={bg} style={{ maxWidth: '100%' }}>
          <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: svg }} />
        </QRCard>
        <Text variant="mono" color="secondary" weight="demibold" style={{ fontSize: 12 }}>
          Part {frame + 1} / {parts.length}
        </Text>

        <Row gap="xl" justify="center" align="flex-end" style={{ position: 'relative', width: '100%',
          borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-m)' }}>
          <Stepper label="Contrast" value={contrast} min={1} max={5} onChange={setContrast} />
          <Stepper label="Density" value={density} min={1} max={5} onChange={setDensity} />
          <Stepper label="Animation speed" value={speed} min={1} max={5} onChange={setSpeed} />
          <div style={{ position: 'absolute', right: 0, bottom: 0 }}>
            <Button role="primary" onClick={onNext}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              Next <Icon name="chevron_right" size={15} />
            </Button>
          </div>
        </Row>
      </Stack>
    </Modal>
  );
}

function ScanCamera({ onCancel, onBack, onDone }) {
  const videoRef = React.useRef(null);
  const streamRef = React.useRef(null);
  const [devices, setDevices] = React.useState([]);
  const [deviceId, setDeviceId] = React.useState('');
  const [contrast, setContrast] = React.useState(3);   // 1–5
  const [status, setStatus] = React.useState('starting'); // starting | live | denied

  const start = React.useCallback(async (id) => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    try {
      const constraints = { video: id ? { deviceId: { exact: id } } : { facingMode: 'environment' }, audio: false };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => {}); }
      setStatus('live');
      const all = await navigator.mediaDevices.enumerateDevices();
      const cams = all.filter(d => d.kind === 'videoinput');
      setDevices(cams);
      if (!id && cams[0]) setDeviceId(cams[0].deviceId);
    } catch (e) {
      setStatus('denied');
      try {
        const all = await navigator.mediaDevices.enumerateDevices();
        setDevices(all.filter(d => d.kind === 'videoinput'));
      } catch (_) {}
    }
  }, []);

  React.useEffect(() => {
    start(undefined);
    return () => { if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop()); };
    // eslint-disable-next-line
  }, []);

  const camLabels = devices.map((d, i) => d.label || `Camera ${i + 1}`);
  const curLabel = (() => {
    const idx = devices.findIndex(x => x.deviceId === deviceId);
    return idx >= 0 ? camLabels[idx] : (camLabels[0] || 'Default camera');
  })();
  const pickLabel = (label) => {
    const idx = camLabels.indexOf(label);
    const d = devices[idx];
    if (d) { setDeviceId(d.deviceId); start(d.deviceId); }
  };

  const filter = `contrast(${(0.55 + contrast * 0.28).toFixed(2)})`;

  return (
    <Modal title="Scan PSBT" width={920} onClose={onCancel}>
      <Stack align="center" gap="l">
        <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', borderRadius: 12,
          overflow: 'hidden', background: 'var(--camera-bg)', border: '1px solid var(--border-light)' }}>
          <video ref={videoRef} muted playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter,
              display: status === 'live' ? 'block' : 'none' }} />
          {status !== 'live' ? (
            <Stack align="center" justify="center" gap="s" style={{ position: 'absolute', inset: 0, color: 'var(--text-muted)' }}>
              <Icon name="qr" size={52} />
              <Text variant="body" style={{ fontSize: 14 }}>
                {status === 'denied' ? 'Camera unavailable — grant access to scan' : 'Starting camera…'}
              </Text>
            </Stack>
          ) : null}
          <div style={{ position: 'absolute', inset: '16% 26%', border: '2px solid rgba(255,255,255,0.85)',
            borderRadius: 12, boxShadow: '0 0 0 9999px rgba(0,0,0,0.28)', pointerEvents: 'none',
            display: status === 'live' ? 'block' : 'none' }} />
        </div>

        {/* single control row: [‹ Previous] [Camera source] [Contrast] [Done] — equal spacing */}
        <Row justify="space-between" align="flex-end" gap="l" style={{ width: '100%',
          borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-m)' }}>
          <Button onClick={onBack} style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="chevron_right" size={14} style={{ transform: 'rotate(180deg)' }} />Previous
          </Button>
          <Stack align="flex-start" gap={6} style={{ flex: 'none' }}>
            <Text variant="body" color="secondary" weight="500" style={{ fontSize: 13 }}>Camera source</Text>
            <ComboBox value={curLabel} options={camLabels.length ? camLabels : ['Default camera']}
              onChange={pickLabel} width={240} />
          </Stack>
          <Stepper label="Contrast" value={contrast} min={1} max={5} onChange={setContrast} />
          <Button role="primary" onClick={onDone} style={{ flex: 'none' }}>Done</Button>
        </Row>
      </Stack>
    </Modal>
  );
}

function BroadcastModal({ onClose }) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <Modal title="Broadcast" width={460} onClose={onClose}>
      <ModalStatus spinner title="Broadcasting transaction…" pad="var(--space-xl) 0 var(--space-l)" />
    </Modal>
  );
}

Object.assign(window, { SendScreen, SelectSigner, UsbConfirm, SdPicker, ScanPsbt, ScanCamera, BroadcastModal,
  RecipientCard, SIGNER_DEVICES,
  looksLikeAmount, looksLikeAddress, btcToUsd, usdToBtc, USD_RATE });
