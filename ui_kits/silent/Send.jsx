/* Silent UI Kit — Send screen (Send.cpp + broadcast modal). Signing runs
   through SigningFlow (Signing.jsx): picker → route steps, in one modal.
   Two-pane layout: payments + coin selection on the left, a persistent
   transaction summary / send rail on the right (with a tx-shape diagram). */

function looksLikeAddress(s) { return /^(sp1|bc1|tb1|bcrt1)[a-z0-9]{6,}$/i.test(s.trim()); }
function looksLikeAmount(s) { const v = parseFloat(s); return !isNaN(v) && v > 0; }

/* Mock spot price for the BTC <-> USD field. In the app this comes from the
   price oracle; the two inputs convert reciprocally on edit. */
const USD_RATE = 68000;
const btcToUsd = b => looksLikeAmount(b) ? (parseFloat(b) * USD_RATE).toFixed(2) : '';
const usdToBtc = u => looksLikeAmount(u) ? (parseFloat(u) / USD_RATE).toFixed(8) : '';

function RecipientCard({ out, idx, deletable, canMax, onChange, onDelete, onScan }) {
  const addrState = out.address === '' ? 'none' : looksLikeAddress(out.address) ? 'valid' : 'invalid';
  const amtState = out.max ? 'none' : out.amount === '' ? 'none' : looksLikeAmount(out.amount) ? 'valid' : 'invalid';
  return (
    <Card corner={deletable ? (
      <Btn id="remove_payment" onClick={onDelete} />
    ) : null}>

      <PaymentRow label="Address">
        {/* The scan button takes its width from the address: the row ends where the
            description below does. */}
        <Row gap="xs">
          <ValidatedInput mono state={addrState} placeholder="sp1q… / bc1q…" wrapStyle={{ flex: 1, minWidth: 0 }}
            value={out.address} onChange={e => onChange({ ...out, address: e.target.value })} />
          <Btn id="scan_address" onClick={onScan} style={{ flex: 'none' }} />
        </Row>
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
      {!auto ? <Btn id="clear" onClick={() => setSelected({})} /> : null}
      <Checkbox checked={auto} onChange={setAuto} label="Auto coin selection" />
    </Row>
  );

  // Fold to a one-line summary only when stacked + auto; otherwise show the full list.
  const coinsBodyFor = (sideBySide) => (auto && !sideBySide) ? (
    <Card tone="inset" pad="m">
      <Row align="baseline" gap="s">
      <Amount value={autoSel.amount.toFixed(8)} size="lg" unit="BTC"
        count={`(${autoSel.count} coin${autoSel.count === 1 ? '' : 's'})`} />
          </Row>
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
      <SectionHeader label="Payments" />
      <Stack gap="s">
        {outputs.map((o, i) => (
          <RecipientCard key={i} out={o} idx={i} deletable={outputs.length > 1}
            canMax={!anyMax || o.max} onChange={v => setOut(i, v)} onDelete={() => delOutput(i)}
            onScan={() => setModal({ type: 'scan', idx: i })} />
        ))}
      </Stack>
      <Row justify="flex-end" style={{ marginTop: 'var(--space-s)' }}>
        <Btn id="add_payment" onClick={addOutput} />
      </Row>
    </div>
  );

  const txDiagram = (
    <Card tone="inset" pad="s">
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
      {signed ? null : (
      <div style={{ flex: 'none' }}>
        <FieldLabel>Fee rate</FieldLabel>
        <Row gap="s">
          <Toggle on={feeRate} onClick={() => setFeeRate(r => !r)} />
          <ValidatedInput mono maxLength={6} inputMode="numeric" state={looksLikeAmount(fee) ? 'valid' : 'invalid'}
            value={fee} onChange={e => setFee(e.target.value.replace(/[^\d.]/g, '').slice(0, 6))}
            wrapStyle={{ flex: 'none', width: 104 }} />
          <Text variant="body" color="secondary" style={{ flex: 'none' }}>{feeRate ? 'sats/vB' : 'sats'}</Text>
        </Row>
      </div>
      )}
      <Spacer />
      <Row gap="s" style={{ flex: 'none' }}>
        {signed ? (
          <Pill id="tx_signed" />
        ) : null}
        {signed ? <Btn id="cancel_signed" onClick={() => setSigned(false)} /> : <Btn id="clear" onClick={clearAll} />}
        {signed ? (
          <Btn id="broadcast" onClick={() => setModal({ type: 'broadcast' })} style={{ flex: 'none' }} />
        ) : (
          <Btn id="sign" disabled={!valid} onClick={() => setModal('signer')} style={{ flex: 'none' }} />
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
        <SigningFlow context="sign" plan={window.SIGNING_PLAN} others={window.OTHER_DEVICES} fileBase={wallet.name}
          onCancel={() => setModal(null)} onDone={() => { setSigned(true); setModal(null); }} />
      ) : null}
      {modal && modal.type === 'scan' ? (
        /* The bare text read goes into the address input, which checks it. */
        <Modal title="Scan Address" width={600} onClose={() => setModal(null)}>
          <CameraStep context="scan-address" onBack={() => setModal(null)} onCancel={() => setModal(null)}
            onDone={() => { setOut(modal.idx, { ...outputs[modal.idx], address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq' }); setModal(null); }} />
        </Modal>
      ) : null}
      {modal && modal.type === 'broadcast' ? (
        <BroadcastModal onClose={() => { clearAll(); setModal(null); }} />
      ) : null}
    </React.Fragment>
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

Object.assign(window, { SendScreen, BroadcastModal,
  RecipientCard,
  looksLikeAmount, looksLikeAddress, btcToUsd, usdToBtc, USD_RATE });
