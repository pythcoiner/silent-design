/* Silent UI Kit: MuSig2 multikey wallets (src/modules/musig).
   - CreateSharedAccount: the "Create Multikey Account" modal (creator/CreatePolicy.cpp),
     its steps replacing each other: Define (account, Electrum, the spend path editor
     and the live policy preview), Fetch (the account xpubs still missing, one signing
     flow per key), Review (policy, descriptor, checksum), Register, Verify (the first
     receive address, checked on a device, or the warning when no key can show it).
   - SpendPathPicker: the Send spend path picker (views/Send.cpp), one entry per leaf
     named by its signers, locked while a signing session runs.
   - MusigSigningCard: the two MuSig2 rounds on Send: the round line, one row per
     cosigner with its nonce and partial signature counts, the lost-session notice,
     Cancel then Sign Round N, or Broadcast once every partial signature is in, which
     ends on the shared SentModal (Send.jsx) with the txid.
   Composes catalog components only. */

const MUSIG_KEYS = [
  { fp: '28645006', alias: 'Carol', route: 'qr' },
  { fp: '73c5da0a', alias: 'Alice', route: 'hot' },
  { fp: 'b8688df1', alias: 'Bob', route: 'qr' },
  /* not in the path: its key type combo is disabled */
  { fp: '3f635a63', alias: 'Dave', route: 'hot' },
];
const MUSIG_SHAPES = ['One key', 'Several keys', 'Mandatory keys and others'];
const MUSIG_LOCKTIMES = ['No timelock', 'After a number of blocks', 'From a block height, renewable', 'From a block height'];
const MUSIG_KEY_TYPES = ['Internal', 'External', 'Cosigner', 'Safety Net'];
const MUSIG_ROLE_STEP = { Internal: 0, External: 1, Cosigner: 2, 'Safety Net': 3 };
const MUSIG_MAX_LEAVES = 32;
const MUSIG_ADDRESS = 'bcrt1pfml94fqkjkwhlpeeychsxxwvwqkclmw02zv8y6nkmshcdsts6jjsl989et';
const MUSIG_CHECKSUM = 'wtsttqhs';
const MUSIG_DESCRIPTOR = "tr(tpubD6NzVbkrYhZ4Wfhvyz5kokDUBLHfzhT59KSamkRVNZhq6EguZVuAf88eJVm6G3ua8YfPChCkyn2CsS7naTCBW1nL4B1Ri2BvhJKMcEvPPeJ/<2147483646;2147483647>/*,{{pk(musig([28645006/87'/1'/0'/2]tpubDF145QGMpKCb3rFmV6vAufhPQw3Bxahpp4MChSswzes7PFiNnowe3YuH2qebeurohdeeFH853C2et8rLA2kpPPZZKSV7e45nmibbewbMKtn,[73c5da0a/87'/1'/0'/0]tpubDEGU7K8ab62XTwHGRuoStbzPj9mR6XQ9jizcU5hpBemm3zenWwhcohKsgxzjQ6w1LbiA7mD8RPfvPjdAcXi4eERN32AMYFszF6j7KRWfWyc)/<512;513>/*),pk(musig([28645006/87'/1'/0'/2]tpubDF145QGMpKCb3rFmV6vAufhPQw3Bxahpp4MChSswzes7PFiNnowe3YuH2qebeurohdeeFH853C2et8rLA2kpPPZZKSV7e45nmibbewbMKtn,[b8688df1/87'/1'/0'/1]tpubDDzMtUDKwjvTaYWcQ8nSBbxmjatm1qwAHYJjbGJGATrNzTGtiQLfXR6fqrC6h1RJ1r6CNTxXjZczuzoJU9BhNjtRF8sEE254oRcx1uK6Hmt)/<514;515>/*)},{pk(musig([73c5da0a/87'/1'/0'/0]tpubDEGU7K8ab62XTwHGRuoStbzPj9mR6XQ9jizcU5hpBemm3zenWwhcohKsgxzjQ6w1LbiA7mD8RPfvPjdAcXi4eERN32AMYFszF6j7KRWfWyc,[b8688df1/87'/1'/0'/1]tpubDDzMtUDKwjvTaYWcQ8nSBbxmjatm1qwAHYJjbGJGATrNzTGtiQLfXR6fqrC6h1RJ1r6CNTxXjZczuzoJU9BhNjtRF8sEE254oRcx1uK6Hmt)/<516;517>/*),pk(tpubD6NzVbkrYhZ4Wfhvyz5kokDUBLHfzhT59KSamkRVNZhq6EguZVuAf88eJVm6G3ua8YfPChCkyn2CsS7naTCBW1nL4B1Ri2BvhJKMcEvPPeJ/<2147483644;2147483645>/*)}})";

/* The default path of the app run: Several keys, 2 of 3, every key in, typed
   Cosigner, Internal, External. */
const MUSIG_PATH = { shape: 'Several keys', threshold: 2, locktime: 'No timelock',
  keys: { '28645006': 'Cosigner', '73c5da0a': 'Internal', 'b8688df1': 'External' } };

const choose = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
const pathKeys = (path, keys) => keys.filter(k => path.keys[k.fp]);
const pathLeaves = (path, keys) => {
  const n = pathKeys(path, keys).length;
  return path.shape === 'Several keys' && n > 0 ? choose(n, Math.min(path.threshold, n)) : n > 0 ? 1 : 0;
};
/* "Any 2 of Carol, Alice, Bob sign" (musig-words-multi). */
const pathWords = (path, keys) => {
  const names = pathKeys(path, keys).map(k => k.alias).join(', ');
  if (path.shape === 'One key') return `${names} signs alone`;
  const n = pathKeys(path, keys).length;
  return path.threshold >= n ? `${names} sign together` : `Any ${path.threshold} of ${names} sign`;
};

/* One spend path (creator/PathEditor.cpp): the signers' shape and threshold, the
   timelock, then one row per key: picked or not, its fingerprint and its key type
   (the type combo is disabled while the key is not picked). */
function PathEditor({ index, path, keys = MUSIG_KEYS, onChange }) {
  const n = pathKeys(path, keys).length || 1;
  const thresholds = Array.from({ length: n }, (_, i) => `${i + 1} of ${n}`);
  const set = (patch) => onChange && onChange({ ...path, ...patch });
  return (
    <Card>
      <Stack gap="s">
        <Text variant="heading">Spend Path {index}</Text>
        <FieldGroup>
          <Field label="Signers:">
            <ComboBox value={path.shape} options={MUSIG_SHAPES} onChange={shape => set({ shape })} width={200} />
            {path.shape === 'Several keys' ? (
              <ComboBox value={`${path.threshold} of ${n}`} options={thresholds}
                onChange={t => set({ threshold: parseInt(t, 10) })} width={150} />
            ) : null}
          </Field>
          <Field label="Timelock:">
            <ComboBox value={path.locktime} options={MUSIG_LOCKTIMES} onChange={locktime => set({ locktime })} width={300} />
          </Field>
        </FieldGroup>
        <SectionLabel>Keys</SectionLabel>
        {keys.map(k => {
          const type = path.keys[k.fp];
          return (
            <Row key={k.fp} gap="s">
              <Checkbox checked={!!type} label={k.alias}
                onChange={on => set({ keys: { ...path.keys, [k.fp]: on ? 'Internal' : undefined } })} />
              <Text variant="mono" color="muted">{k.fp}</Text>
              <Spacer />
              <ComboBox value={type || 'Internal'} options={MUSIG_KEY_TYPES} disabled={!type} width={150}
                onChange={t => set({ keys: { ...path.keys, [k.fp]: t } })} />
            </Row>
          );
        })}
      </Stack>
    </Card>
  );
}

/* The live preview under the paths: the leaf count against the cap, then each path
   in plain words. */
function PolicyPreview({ paths, keys = MUSIG_KEYS }) {
  const leaves = paths.reduce((sum, p) => sum + pathLeaves(p, keys), 0);
  return (
    <Card tone="inset" pad="m">
      <Stack gap="xs">
        <SectionLabel>Policy</SectionLabel>
        <Text variant="body">{leaves} of {MUSIG_MAX_LEAVES} tap leaves</Text>
        {paths.map((p, i) => <Text key={i} variant="body">Spend Path {i + 1}: {pathWords(p, keys)}</Text>)}
      </Stack>
    </Card>
  );
}

/* Review: each path in words with its keys (alias, key type, origin), the total
   leaf count, the descriptor to copy and its checksum. */
function PolicyReview({ paths, keys = MUSIG_KEYS }) {
  const leaves = paths.reduce((sum, p) => sum + pathLeaves(p, keys), 0);
  return (
    <Stack gap="s" style={{ alignSelf: 'stretch' }}>
      <SectionLabel>Policy</SectionLabel>
      {paths.map((p, i) => (
        <Card key={i} tone="inset" pad="m">
          <Stack gap="xxs">
            <Text variant="section">Spend Path {i + 1}: {pathWords(p, keys)}</Text>
            <Text variant="caption">{pathLeaves(p, keys)} tap leaves</Text>
            {pathKeys(p, keys).map(k => (
              <Row key={k.fp} gap="s">
                <Text variant="body">{k.alias}</Text>
                <Text variant="caption">{p.keys[k.fp]}</Text>
                <Text variant="mono" color="muted">[{k.fp}/87'/1'/0'/{MUSIG_ROLE_STEP[p.keys[k.fp]]}]</Text>
              </Row>
            ))}
          </Stack>
        </Card>
      ))}
      <Text variant="body">{leaves} tap leaves in total</Text>
      <SectionLabel>Descriptor</SectionLabel>
      <CopyField value={MUSIG_DESCRIPTOR} wrap />
      <SectionLabel>Checksum</SectionLabel>
      <Text variant="mono">{MUSIG_CHECKSUM}</Text>
    </Stack>
  );
}

/* The verify page: the first receive address flush with its lead, the device check
   and its result, or the warning when no key of the wallet has a screen. */
function VerifyFirstAddress({ checkable, verified, onCheck }) {
  return (
    <Stack gap="m" style={{ alignSelf: 'stretch' }}>
      <Text variant="body">{checkable ? 'Check this address on one of your devices before using the wallet.'
        : 'This is the first receive address of the wallet.'}</Text>
      <ChunkedAddress text={MUSIG_ADDRESS} align="left" />
      {checkable ? (
        <Row><Btn id={verified ? 'check_address_again' : 'check_address'} onClick={onCheck} /></Row>
      ) : null}
      {checkable && verified ? <Text variant="caption" color="success">The device shows the same address.</Text> : null}
      {!checkable ? (
        <Notice tone="warning" title="The address is not checked">
          No key of this wallet is on a device with a screen (USB or QR): none can show this address. Create the wallet only if you trust this computer.
        </Notice>
      ) : null}
    </Stack>
  );
}

/* Create Multikey Account. `initial.step`: define | fetch | review | register | verify;
   `initial.checkable` false shows the no-checkable-key warning; `initial.verified`
   the matched check. */
function CreateSharedAccount({ existing = [], keys = MUSIG_KEYS, onCancel, onCreate, initial = {} }) {
  const [step, setStep] = React.useState(initial.step || 'define');
  const [name, setName] = React.useState(initial.name || 'shared');
  const [network, setNetwork] = React.useState('Regtest');
  const [electrum, setElectrum] = React.useState(REGTEST_ELECTRUM_URL);
  const [test, setTest] = React.useState(initial.test === undefined ? 'ok' : initial.test);
  const [paths, setPaths] = React.useState(initial.paths || [MUSIG_PATH]);
  const [fetched, setFetched] = React.useState(initial.fetched || ['28645006', 'b8688df1']);
  const [flow, setFlow] = React.useState(null);   // null | 'fetch' | 'verify'
  const [verified, setVerified] = React.useState(!!initial.verified);
  const checkable = initial.checkable !== false;

  const missing = keys.filter(k => paths.some(p => p.keys[k.fp]) && !fetched.includes(k.fp));
  const trimmed = name.trim();
  const leaves = paths.reduce((sum, p) => sum + pathLeaves(p, keys), 0);
  const defineReason = !trimmed ? 'Enter an account name.'
    : existing.includes(trimmed) ? `An account named “${trimmed}” already exists.`
    : test !== 'ok' ? 'Test the Electrum server first.'
    : leaves === 0 ? 'Pick the keys of each path.' : null;

  if (flow === 'fetch' && missing.length) {
    const key = missing[0];
    return <SigningFlow context="fetch-xpub" keyRow={{ fp: key.fp, alias: key.alias, route: key.route }}
      onCancel={() => setFlow(null)}
      onDone={() => { setFetched(f => [...f, key.fp]); setFlow(null); if (missing.length === 1) setStep('review'); }} />;
  }
  if (flow === 'verify') {
    // The kit treats closing the result as the device's match.
    const plan = keys.map(k => ({ ...k, status: k.route === 'qr' ? 'ready' : 'no_route' }));
    return <SigningFlow context="verify" plan={plan} address={MUSIG_ADDRESS}
      onCancel={() => { setFlow(null); setVerified(true); }} />;
  }

  let body, actions;
  if (step === 'define') {
    body = (
      <Stack gap="m" style={{ alignSelf: 'stretch' }}>
        <FieldGroup>
          <Field label="Account Name:"><Input width={240} value={name} onChange={e => setName(e.target.value)} /></Field>
          <Field label="Network:"><ComboBox value={network} options={NETWORKS} onChange={setNetwork} width={240} /></Field>
          <EndpointRow label="Electrum:" value={electrum} onChange={v => { setElectrum(v); setTest(null); }}
            test={test} onTest={() => { setTest('testing'); setTimeout(() => setTest('ok'), 700); }} />
        </FieldGroup>
        {paths.map((p, i) => (
          <PathEditor key={i} index={i + 1} path={p} keys={keys}
            onChange={np => setPaths(paths.map((x, k) => (k === i ? np : x)))} />
        ))}
        <Row><Btn id="add_spend_path" onClick={() => setPaths([...paths, { ...MUSIG_PATH, locktime: 'After a number of blocks', keys: {} }])} /></Row>
        <PolicyPreview paths={paths} keys={keys} />
      </Stack>
    );
    actions = (
      <ModalActions reason={defineReason}>
        <Btn id="continue" disabled={!!defineReason} onClick={() => setStep(missing.length ? 'fetch' : 'review')} />
      </ModalActions>
    );
  } else if (step === 'fetch') {
    const total = keys.filter(k => paths.some(p => p.keys[k.fp])).length;
    body = (
      <Stack gap="s" style={{ alignSelf: 'stretch' }}>
        <Text variant="body">These keys still have to give their account xpub, one window per key.</Text>
        <Text variant="caption">{total - missing.length} of {total} account xpubs fetched</Text>
        {missing.map(k => <Text key={k.fp} variant="body">{k.alias} ({k.fp})</Text>)}
      </Stack>
    );
    actions = (
      <ModalActions onBack={() => setStep('define')}>
        <Btn id="fetch_this_xpub" onClick={() => setFlow('fetch')} />
      </ModalActions>
    );
  } else if (step === 'review' || step === 'register') {
    const registering = step === 'register';
    body = <PolicyReview paths={paths} keys={keys} />;
    actions = (
      <ModalActions onBack={() => setStep('define')} reason={registering ? 'Registering with Carol' : null}>
        <Btn id="register" disabled={registering}
          onClick={() => { setStep('register'); setTimeout(() => setStep('verify'), 900); }} />
      </ModalActions>
    );
  } else {
    body = <VerifyFirstAddress checkable={checkable} verified={verified} onCheck={() => setFlow('verify')} />;
    const reason = checkable && !verified ? 'Check the address on a device first.' : null;
    actions = (
      <ModalActions onBack={() => setStep('review')} reason={reason}>
        <Btn id="create" disabled={!!reason} onClick={() => onCreate && onCreate(trimmed)} />
      </ModalActions>
    );
  }
  return (
    <Modal title="Create Multikey Account" width={640} onClose={onCancel}>
      <Stack gap="m" style={{ alignSelf: 'stretch' }}>
        {body}
        {actions}
      </Stack>
    </Modal>
  );
}

/* Spend path leaves of the selected coins, by their signers' aliases. */
const MUSIG_LEAVES = ['Carol + Alice', 'Carol + Bob', 'Alice + Bob'];

function SpendPathPicker({ leaves = MUSIG_LEAVES, value = 'Alice + Bob', locked = false, onChange }) {
  return (
    <Stack gap="xs">
      <SectionLabel>Spend path</SectionLabel>
      <ComboBox value={value} options={leaves} disabled={locked} onChange={onChange} width={400} />
    </Stack>
  );
}

const MUSIG_ROUND_LINE = {
  1: 'Round 1 of 2: every cosigner adds its nonce',
  2: 'Round 2 of 2: every cosigner adds its partial signature',
  ready: 'Every partial signature is in',
};
const MUSIG_TXID = '501895f3cc36d5e35514b5ff7af55c9b0822e114560ebe6fdab238067db076e2';

/* The signing card. `round`: 1 | 2 | 'ready'; `cosigners`: [{ alias, nonces,
   partialSigs, expected }]; `lost`: the session-lost notice (back on round 1). */
function MusigSigningCard({ round = 1, cosigners, lost = false, txid = MUSIG_TXID, onCancel, onSign, onBroadcast }) {
  return (
    <Card>
      <Stack gap="s">
        <Row gap="xl">
          <Text variant="secondary">TxID</Text>
          <Text variant="mono">{txid}</Text>
        </Row>
        <Text variant="section">{MUSIG_ROUND_LINE[round]}</Text>
        {cosigners.map(c => (
          <Row key={c.alias} gap="m">
            <Text variant="body">{c.alias}</Text>
            <Text variant="caption">Nonces {c.nonces}/{c.expected}</Text>
            <Text variant="caption">Partial signatures {c.partialSigs}/{c.expected}</Text>
            <Spacer />
            {round === 'ready' ? <Pill id="signer_signed" /> : null}
          </Row>
        ))}
        {lost ? (
          <Notice tone="warning" title="A signer no longer holds its round 1 nonce: it restarted, or the transaction changed. Every nonce and partial signature was dropped, sign round 1 again with every cosigner.">
            MuSig2 session missing or mismatch
          </Notice>
        ) : null}
        <Row gap="s">
          <Btn id="cancel_signed" onClick={onCancel} />
          <Spacer />
          {round === 'ready' ? <Btn id="broadcast" onClick={onBroadcast} />
            : <Btn id="sign_round" args={round} onClick={onSign} />}
        </Row>
      </Stack>
    </Card>
  );
}

/* The Send states of the app run, for the gallery. */
const musigCosigners = (nonces, partialSigs) => ['Alice', 'Bob'].map(alias => ({ alias, nonces, partialSigs, expected: 1 }));

/* The new part of the MuSig2 Send screen: the spend path, Prepare, then the card.
   Broadcast (round 'ready') opens SentModal; `sent` opens on it, for the gallery. */
function MusigSendPanel({ round, cosigners, lost, prepared = true, sent: initialSent = false }) {
  const [sent, setSent] = React.useState(initialSent);
  return (
    <React.Fragment>
      <Stack gap="m">
        <SpendPathPicker locked={prepared} />
        <Row><Spacer /><Btn id="prepare" disabled={prepared} /></Row>
        {prepared ? <MusigSigningCard round={round} cosigners={cosigners} lost={lost} onBroadcast={() => setSent(true)} /> : null}
      </Stack>
      {sent ? <SentModal txid={MUSIG_TXID} onClose={() => setSent(false)} /> : null}
    </React.Fragment>
  );
}

Object.assign(window, { MUSIG_KEYS, MUSIG_PATH, MUSIG_ADDRESS, PathEditor, PolicyPreview, PolicyReview,
  VerifyFirstAddress, CreateSharedAccount, SpendPathPicker, MusigSigningCard, MusigSendPanel, musigCosigners, MUSIG_TXID });

/* File-level namespace (DS compiler indexes this file as `Musig`). */
export const Musig = { PathEditor, PolicyPreview, PolicyReview, VerifyFirstAddress, CreateSharedAccount,
  SpendPathPicker, MusigSigningCard, MusigSendPanel };
