/* Silent UI Kit: MuSig2 multikey wallets (src/modules/musig).
   - CreateSharedAccount: the "Create Multikey Account" wizard (creator/CreatePolicy.cpp):
     Spend Paths, Xpubs, Review (name, backup), Register, Verify, Electrum (Create), under a WizardSteps trail.
   - SpendPathPicker: the Send spend path picker (views/Send.cpp), one entry per leaf
     named by its signers, locked while a signing session runs.
   - MusigSigningCard: the two MuSig2 rounds on Send: the round line, one row per
     cosigner with its nonce and partial signature counts, the lost-session notice,
     Cancel then Sign Round N, or Broadcast once every partial signature is in, which
     ends on the shared SentModal (Send.jsx) with the txid.
   Composes catalog components only. */

const MUSIG_KEYS = [
  { fp: '28645006', alias: 'Carol', route: 'qr' },
  /* on a USB device: its xpub is the one missing by default (step 2 Xpubs) */
  { fp: '73c5da0a', alias: 'Alice', route: 'usb' },
  { fp: 'b8688df1', alias: 'Bob', route: 'qr' },
  /* not in the path: its key type combo is disabled */
  { fp: '3f635a63', alias: 'Dave', route: 'hot' },
];
/* Timelock kinds: Relative (a count after each coin is received), Absolute renewable
   (a block height, entered as a count from the tip: height = tip + count) and Date in
   the future (a date and time). Counts take a unit; one block is ten minutes. */
const MUSIG_LOCKTIMES = ['No timelock', 'Relative', 'Absolute renewable', 'Date in the future'];
const MUSIG_LOCK_UNITS = ['Blocks', 'Days', 'Weeks', 'Months'];
const MUSIG_UNIT_BLOCKS = { Blocks: 1, Days: 144, Weeks: 1008, Months: 4320 };
const MUSIG_TIP = 905210;              // the chain tip the kit run assumes
const MUSIG_MAX_RELATIVE = 65535;      // BIP68: a relative timelock counts at most 65535 blocks
const lockBlocks = (path) => (parseInt(path.lockValue, 10) || 0) * (MUSIG_UNIT_BLOCKS[path.lockUnit || 'Blocks'] || 1);
const nowLocal = () => { const d = new Date(Date.now() - new Date().getTimezoneOffset() * 60000); return d.toISOString().slice(0, 16); };
const fmtDate = (v) => new Date(v).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
/* why a path's timelock is not ready, or null */
const lockReason = (path) => {
  if (path.locktime === 'Relative' || path.locktime === 'Absolute renewable') {
    if (!path.lockValue) return 'Enter the timelock.';
    if (path.locktime === 'Relative' && lockBlocks(path) > MUSIG_MAX_RELATIVE) return 'A relative timelock is at most 65535 blocks (about 15 months).';
  }
  if (path.locktime === 'Date in the future') {
    if (!path.lockDate) return 'Pick the date.';
    if (path.lockDate <= nowLocal()) return 'Pick a date in the future.';
  }
  return null;
};
const MUSIG_KEY_TYPES = ['Internal', 'External', 'Cosigner', 'Safety Net'];
const MUSIG_ROLE_STEP = { Internal: 0, External: 1, Cosigner: 2, 'Safety Net': 3 };
const MUSIG_MAX_LEAVES = 32;
const MUSIG_ADDRESS = 'bcrt1pfml94fqkjkwhlpeeychsxxwvwqkclmw02zv8y6nkmshcdsts6jjsl989et';
const MUSIG_CHECKSUM = 'wtsttqhs';
const MUSIG_DESCRIPTOR = "tr(tpubD6NzVbkrYhZ4Wfhvyz5kokDUBLHfzhT59KSamkRVNZhq6EguZVuAf88eJVm6G3ua8YfPChCkyn2CsS7naTCBW1nL4B1Ri2BvhJKMcEvPPeJ/<2147483646;2147483647>/*,{{pk(musig([28645006/87'/1'/0'/2]tpubDF145QGMpKCb3rFmV6vAufhPQw3Bxahpp4MChSswzes7PFiNnowe3YuH2qebeurohdeeFH853C2et8rLA2kpPPZZKSV7e45nmibbewbMKtn,[73c5da0a/87'/1'/0'/0]tpubDEGU7K8ab62XTwHGRuoStbzPj9mR6XQ9jizcU5hpBemm3zenWwhcohKsgxzjQ6w1LbiA7mD8RPfvPjdAcXi4eERN32AMYFszF6j7KRWfWyc)/<512;513>/*),pk(musig([28645006/87'/1'/0'/2]tpubDF145QGMpKCb3rFmV6vAufhPQw3Bxahpp4MChSswzes7PFiNnowe3YuH2qebeurohdeeFH853C2et8rLA2kpPPZZKSV7e45nmibbewbMKtn,[b8688df1/87'/1'/0'/1]tpubDDzMtUDKwjvTaYWcQ8nSBbxmjatm1qwAHYJjbGJGATrNzTGtiQLfXR6fqrC6h1RJ1r6CNTxXjZczuzoJU9BhNjtRF8sEE254oRcx1uK6Hmt)/<514;515>/*)},{pk(musig([73c5da0a/87'/1'/0'/0]tpubDEGU7K8ab62XTwHGRuoStbzPj9mR6XQ9jizcU5hpBemm3zenWwhcohKsgxzjQ6w1LbiA7mD8RPfvPjdAcXi4eERN32AMYFszF6j7KRWfWyc,[b8688df1/87'/1'/0'/1]tpubDDzMtUDKwjvTaYWcQ8nSBbxmjatm1qwAHYJjbGJGATrNzTGtiQLfXR6fqrC6h1RJ1r6CNTxXjZczuzoJU9BhNjtRF8sEE254oRcx1uK6Hmt)/<516;517>/*),pk(tpubD6NzVbkrYhZ4Wfhvyz5kokDUBLHfzhT59KSamkRVNZhq6EguZVuAf88eJVm6G3ua8YfPChCkyn2CsS7naTCBW1nL4B1Ri2BvhJKMcEvPPeJ/<2147483644;2147483645>/*)}})";

/* A spend path: the picked keys and their key type, the keys that must sign on
   every spend (`mandatory`), the signatures required in total (`threshold`, counting
   the mandatory ones) and the timelock with its value. The default of the app run:
   2 of Carol, Alice, Bob, no timelock. */
const MUSIG_PATH = { label: '', threshold: 2, mandatory: [], locktime: 'No timelock', lockValue: '', lockUnit: 'Blocks', lockDate: '',
  keys: { '28645006': 'Cosigner', '73c5da0a': 'Internal', 'b8688df1': 'External' } };
const MUSIG_NEW_PATH = { label: '', threshold: 1, mandatory: [], locktime: 'Relative', lockValue: '', lockUnit: 'Days', lockDate: '', keys: {} };

/* a path's name: the optional one the user gave, else "Spend Path N" */
const pathTitle = (path, i) => (path.label && path.label.trim()) || `Spend Path ${i + 1}`;
const choose = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
const pathKeys = (path, keys) => keys.filter(k => path.keys[k.fp]);
const pathMandatory = (path, keys) => pathKeys(path, keys).filter(k => (path.mandatory || []).includes(k.fp));
const pathLeaves = (path, keys) => {
  const n = pathKeys(path, keys).length, m = pathMandatory(path, keys).length;
  if (!n) return 0;
  return choose(n - m, Math.max(0, Math.min(path.threshold, n) - m));
};
const names = (ks) => ks.map(k => k.alias).join(', ');
/* about how long a block count lasts, at ten minutes a block */
const blocksSpan = (v) => {
  const h = (parseInt(v, 10) || 0) / 6;
  return h < 48 ? `about ${Math.round(h)} hours` : h < 24 * 60 ? `about ${Math.round(h / 24)} days` : `about ${Math.round(h / 24 / 30)} months`;
};
const lockWords = (path) => {
  if (!path.locktime || path.locktime === 'No timelock') return '';
  if (lockReason(path)) return ', once the timelock is set';
  const v = path.lockValue, unit = (path.lockUnit || 'Blocks').toLowerCase();
  const count = `${v} ${parseInt(v, 10) === 1 ? unit.replace(/s$/, '') : unit}`;
  if (path.locktime === 'Relative') return `, ${count} after a coin is received`;
  if (path.locktime === 'Absolute renewable') return `, from block ${MUSIG_TIP + lockBlocks(path)}, renewable`;
  return `, from ${fmtDate(path.lockDate)}`;
};
/* "Alice signs, plus any 1 of Bob, Carol" — the signers only */
const signerWords = (path, keys) => pathWords({ ...path, locktime: 'No timelock' }, keys);
/* the timelock alone, as a sentence: "30 days after a coin is received" */
const lockLine = (path) => { const w = lockWords(path).replace(/^, /, ''); return w ? w[0].toUpperCase() + w.slice(1) : 'No timelock'; };
/* "Alice signs, plus any 1 of Bob, Carol, after 4320 blocks (about 30 days)" */
const pathWords = (path, keys) => {
  const ks = pathKeys(path, keys), n = ks.length;
  if (!n) return 'No key picked yet';
  const must = pathMandatory(path, keys), others = ks.filter(k => !must.includes(k));
  const t = Math.min(path.threshold, n), k = t - must.length;
  let w;
  if (n === 1) w = `${names(ks)} signs alone`;
  else if (t >= n) w = `${names(ks)} sign together`;
  else if (!must.length) w = `Any ${t} of ${names(ks)} sign`;
  else w = `${names(must)} ${must.length > 1 ? 'sign' : 'signs'}, plus any ${k} of ${names(others)}`;
  return w + lockWords(path);
};

/* One spend path (creator/PathEditor.cpp): an optional Name (else "Spend Path N"), Keys (pick each key, and whether it is
   mandatory on every spend; picked keys are always Internal; at least one key stays
   optional), then one line each for Signatures (mandatory + 1 up to all picked) and
   Timelock (kind, then a count and its unit, or a date and time). Qt: VBox(Section + QTableWidget, QFormLayout). */
function PathEditor({ path, keys = MUSIG_KEYS, onChange }) {
  const picked = pathKeys(path, keys);
  const n = picked.length, m = pathMandatory(path, keys).length;
  /* the threshold stays within [mandatory + 1, picked] */
  const clampT = (v, nn, mm) => Math.min(Math.max(v, mm + 1, 1), Math.max(nn, 1));
  const t = clampT(path.threshold, n, m);
  const set = (patch) => {
    if (!onChange) return;
    const next = { ...path, ...patch };
    const nn = pathKeys(next, keys).length, mm = pathMandatory(next, keys).length;
    onChange({ ...next, threshold: clampT(next.threshold, nn, mm) });
  };
  const toggleKey = (fp, on) => set({
    keys: { ...path.keys, [fp]: on ? 'Internal' : undefined },
    mandatory: on ? (path.mandatory || []) : (path.mandatory || []).filter(x => x !== fp),
  });
  const toggleMust = (fp, on) => set({ mandatory: on ? [...(path.mandatory || []), fp] : (path.mandatory || []).filter(x => x !== fp) });
  const lo = Math.min(m + 1, Math.max(n, 1));
  const thresholds = Array.from({ length: Math.max(n - lo + 1, 1) }, (_, i) => (lo + i === n ? `All ${n}` : `${lo + i} of ${n}`));
  const keyColumns = [
    { header: '', width: 40, cellStyle: () => ({ padding: '0 6px', textOverflow: 'clip' }), render: (r) => <Checkbox checked={!!path.keys[r.fp]} onChange={on => toggleKey(r.fp, on)} /> },
    { header: 'Key', grow: true, render: (r) => r.alias },
    { key: 'fp', header: 'Fingerprint', width: 110, mono: true, muted: () => true },
    { header: 'Mandatory', width: 90, render: (r) => path.keys[r.fp] && n > 1
      ? <Checkbox checked={(path.mandatory || []).includes(r.fp)} onChange={on => toggleMust(r.fp, on)}
          disabled={!(path.mandatory || []).includes(r.fp) && m + 1 >= n} /> : null },
  ];
  const counted = path.locktime === 'Relative' || path.locktime === 'Absolute renewable';
  const blocks = lockBlocks(path);
  /* what the count stands for: blocks as time, other units as blocks; the height for Absolute */
  const lockHint = !counted || !path.lockValue ? null
    : path.locktime === 'Absolute renewable' ? `block ${MUSIG_TIP + blocks}`
    : (path.lockUnit || 'Blocks') === 'Blocks' ? blocksSpan(path.lockValue) : `${blocks} blocks`;
  return (
    <Stack gap="m" style={{ alignSelf: 'stretch' }}>
      <FieldGroup>
        <Field label="Name:"><Input width={260} value={path.label || ''} placeholder="Optional" onChange={e => set({ label: e.target.value })} /></Field>
      </FieldGroup>
      <Section label="Keys" dense>
        <Table columns={keyColumns} rows={keys} rowKey={(r) => r.fp} />
      </Section>
      <FieldGroup>
        {n > 1 ? (
          <Field label="Signatures:">
            <ComboBox value={t === n ? `All ${n}` : `${t} of ${n}`} options={thresholds} width={200}
              onChange={v => set({ threshold: v.startsWith('All') ? n : parseInt(v, 10) })} />
          </Field>
        ) : null}
        <Field label="Timelock:">
          <ComboBox value={path.locktime} options={MUSIG_LOCKTIMES} width={200}
            onChange={locktime => set({ locktime, lockValue: '', lockDate: '' })} />
          {counted ? (
            <React.Fragment>
              <Input mono width={90} value={path.lockValue || ''} placeholder="0"
                onChange={e => set({ lockValue: e.target.value.replace(/[^0-9]/g, '') })} />
              <ComboBox value={path.lockUnit || 'Blocks'} options={MUSIG_LOCK_UNITS} width={120} onChange={lockUnit => set({ lockUnit })} />
            </React.Fragment>
          ) : null}
          {path.locktime === 'Date in the future' ? (
            <DateTimeInput value={path.lockDate} min={nowLocal()} onChange={lockDate => set({ lockDate })} />
          ) : null}
          {lockHint ? <Text variant="caption">{lockHint}</Text> : null}
        </Field>
      </FieldGroup>
    </Stack>
  );
}

/* The Spend Paths list: one row per path (its timelock under the title, its signers
   in words on the right) opening Edit Spend Path, then the Add a Spend Path row. */
function SpendPathList({ paths, keys = MUSIG_KEYS, onOpen, onAdd }) {
  return (
    <Stack gap="xs" style={{ alignSelf: 'stretch' }}>
      {paths.map((p, i) => (
        <SelectRow key={i} title={pathTitle(p, i)} sub={lockLine(p)}
          meta={signerWords(p, keys)} onClick={() => onOpen(i)} />
      ))}
      {onAdd ? <SelectRow tone="add" icon="plus" title="Add a Spend Path" onClick={onAdd} /> : null}
    </Stack>
  );
}

/* Edit Spend Path: replaces the wizard (one modal at a time) and works on a draft;
   Save Path writes it back, Back drops it, Remove Path deletes it (not the last). */
function EditSpendPath({ index, path, keys = MUSIG_KEYS, removable, onSave, onRemove, onBack, onClose }) {
  const [draft, setDraft] = React.useState(path);
  const reason = !pathKeys(draft, keys).length ? 'Pick at least one key.'
    : lockReason(draft);
  return (
    <Modal title={pathTitle(draft, index - 1)} width={760} height="wizard" onClose={onClose}>
      <Stack gap="m" style={{ alignSelf: 'stretch', flex: 1 }}>
        <PathEditor path={draft} keys={keys} onChange={setDraft} />
        <Spacer />
        <ModalActions onBack={onBack} reason={reason}>
          {removable ? <Btn id="remove_spend_path" onClick={onRemove} /> : null}
          <Btn id="save_spend_path" disabled={!!reason} onClick={() => onSave(draft)} />
        </ModalActions>
      </Stack>
    </Modal>
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

/* Backup Descriptor: the native save dialog (showSaveFilePicker) with the account
   name as the file name; where the browser has none, a plain download. Resolves
   true once written, false when the user cancels. Qt: QFileDialog::getSaveFileName. */
async function saveDescriptorFile(name, text) {
  const fileName = `${name || 'account'}-descriptor.txt`;
  if (window.showSaveFilePicker) {
    try {
      const h = await window.showSaveFilePicker({ suggestedName: fileName, types: [{ description: 'Descriptor', accept: { 'text/plain': ['.txt'] } }] });
      const w = await h.createWritable(); await w.write(text); await w.close();
      return true;
    } catch (e) { if (e && e.name === 'AbortError') return false; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
  a.download = fileName; a.click(); URL.revokeObjectURL(a.href);
  return true;
}

/* Review: the policy only — each path's signers in words, its timelock, and its
   keys (alias, fingerprint, mandatory). The descriptor is not shown; the wizard's
   Review step backs it up right under the policy. */
function PolicyReview({ paths, keys = MUSIG_KEYS }) {
  return (
    <Stack gap="s" style={{ alignSelf: 'stretch' }}>
      {paths.map((p, i) => (
        <Card key={i} tone="inset" pad="m">
          <Stack gap="xxs">
            <Text variant="section">{pathTitle(p, i)}: {signerWords(p, keys)}</Text>
            <Text variant="caption">{lockLine(p)}</Text>
            {pathKeys(p, keys).map(k => (
              <Row key={k.fp} gap="s">
                <Text variant="body">{k.alias}</Text>
                <Text variant="mono" color="muted">{k.fp}</Text>
                {(p.mandatory || []).includes(k.fp) ? <Text variant="caption">Mandatory</Text> : null}
              </Row>
            ))}
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}

/* Routes whose device has a screen that can show an address. */
const SHOWS_ADDRESS = { qr: true, usb: true };

/* The verify page: the first receive address flush with its lead, then one row per
   signer of the policy. A signer with a screen (QR, USB) opens its address check
   on click and reads Verified once it matched; the others read No Screen. With no
   signer able to show it, the warning instead. */
function VerifyFirstAddress({ signers = [], verified = [], onCheck }) {
  const checkable = signers.filter(k => SHOWS_ADDRESS[k.route]);
  return (
    <Stack gap="m" style={{ alignSelf: 'stretch' }}>
      <Text variant="body">{checkable.length ? 'Optionally, check this address on your signing devices: click a signer.'
        : 'This is the first receive address of the wallet.'}</Text>
      <Row justify="center"><Card tone="inset" pad="m"><ChunkedAddress text={MUSIG_ADDRESS} oneRow /></Card></Row>
      <Stack gap="xs">
        {signers.map(k => {
          const can = !!SHOWS_ADDRESS[k.route], done = verified.includes(k.fp);
          return (
            <SelectRow key={k.fp} icon={ROUTE_KINDS[k.route].icon} title={k.alias} sub={k.fp} chevron={false}
              disabled={!can} status={<Pill id={!can ? 'addr_no_screen' : done ? 'addr_verified' : 'addr_unchecked'} />}
              onClick={can ? () => onCheck && onCheck(k.fp) : undefined} />
          );
        })}
      </Stack>
      {!checkable.length ? (
        <Notice tone="warning" title="The address is not checked">
          No key of this wallet is on a device with a screen (USB or QR): none can show this address. Create the wallet only if you trust this computer.
        </Notice>
      ) : null}
    </Stack>
  );
}

/* Create Multikey Account: a wizard, one step per page under a WizardSteps trail.
   Spend Paths (network, one row per path opening Edit Spend Path) → Xpubs (every key
   of the paths, fetched or missing; a missing row opens that key's signing flow;
   skipped when none is missing) →
   Review (account name, the policy, Backup Descriptor right under it) → Register
   (one row per signer; a device registers on click, hot keys need none) → Verify (the first address on a device) → Electrum (the server, SSL, certificate check;
   Create).
   Back on every step but the first.
   `initial.step`: paths | xpubs | review | register | verify | account; `initial.registered`
   / `initial.registering`: fingerprints registered / in progress;
   `initial.editing`: a path index open in Edit Spend Path; `initial.checkable` false
   shows the no-checkable-key warning; `initial.verified` the matched check. */
const CREATE_STEPS = ['Spend Paths', 'Xpubs', 'Review', 'Register', 'Verify', 'Electrum'];
const CREATE_STEP_INDEX = { paths: 0, xpubs: 1, review: 2, register: 3, verify: 4, account: 5 };
/* Routes whose device holds a registration of the account (hot keys need none). */
const NEEDS_REGISTER = { qr: true, usb: true, sd: true };

function CreateSharedAccount({ existing = [], keys = MUSIG_KEYS, onCancel, onCreate, initial = {} }) {
  const [step, setStep] = React.useState(initial.step || 'paths');
  const [name, setName] = React.useState(initial.name || 'shared');
  const [network, setNetwork] = React.useState('Regtest');
  const [electrum, setElectrum] = React.useState(REGTEST_ELECTRUM_URL);
  const [test, setTest] = React.useState(initial.test === undefined ? 'ok' : initial.test);
  /* Electrum transport: SSL, and the certificate check (off for a self-signed one) */
  const [ssl, setSsl] = React.useState(initial.ssl === undefined ? true : initial.ssl);
  const [verifyCert, setVerifyCert] = React.useState(initial.verifyCert === undefined ? true : initial.verifyCert);
  const [paths, setPaths] = React.useState(initial.paths || [MUSIG_PATH]);
  const [fetched, setFetched] = React.useState(initial.fetched || ['28645006', 'b8688df1']);
  const [flow, setFlow] = React.useState(null);   // null | { fetch: fp } | { verify: fp }
  const [editing, setEditing] = React.useState(initial.editing === undefined ? null : initial.editing);   // path index | null
  /* fingerprints whose device showed the same address; `initial.verified` true = every signer with a screen */
  const [verified, setVerified] = React.useState(Array.isArray(initial.verified) ? initial.verified
    : initial.verified ? keys.filter(k => SHOWS_ADDRESS[k.route]).map(k => k.fp) : []);
  const [backedUp, setBackedUp] = React.useState(!!initial.backedUp);
  /* fingerprints registered; `registering` the one in progress */
  const [registered, setRegistered] = React.useState(initial.registered || []);
  const [registering, setRegistering] = React.useState(initial.registering || null);
  /* the Register step's opt-out: continue with devices left unregistered */
  const [skipRegister, setSkipRegister] = React.useState(!!initial.skipRegister);
  /* Xpubs is skipped when every key of the paths already gave its xpub; Back from Review then returns to Spend Paths */
  const [skippedXpubs, setSkippedXpubs] = React.useState(false);
  const checkable = initial.checkable !== false;

  const used = keys.filter(k => paths.some(p => p.keys[k.fp]));
  const missing = used.filter(k => !fetched.includes(k.fp));
  const trimmed = name.trim();
  const leaves = paths.reduce((sum, p) => sum + pathLeaves(p, keys), 0);

  if (flow && flow.fetch) {
    const key = keys.find(k => k.fp === flow.fetch);
    return <SigningFlow context="fetch-xpub" keyRow={{ fp: key.fp, alias: key.alias, route: key.route }}
      onCancel={() => setFlow(null)}
      onDone={() => { setFetched(f => [...f, key.fp]); setFlow(null); }} />;
  }
  if (editing !== null) {
    const isNew = editing >= paths.length;
    const path = isNew ? MUSIG_NEW_PATH : paths[editing];
    return <EditSpendPath key={editing} index={editing + 1} path={path} keys={keys}
      removable={!isNew && paths.length > 1} onClose={onCancel} onBack={() => setEditing(null)}
      onRemove={() => { setPaths(paths.filter((_, k) => k !== editing)); setEditing(null); }}
      onSave={np => { setPaths(isNew ? [...paths, np] : paths.map((x, k) => (k === editing ? np : x))); setEditing(null); }} />;
  }
  if (flow && flow.verify) {
    // The kit treats closing the result as the device's match.
    const plan = keys.filter(k => k.fp === flow.verify).map(k => ({ ...k, status: 'ready' }));
    return <SigningFlow context="verify" plan={plan} address={MUSIG_ADDRESS}
      onCancel={() => { setVerified(v => (v.includes(flow.verify) ? v : [...v, flow.verify])); setFlow(null); }} />;
  }

  let body, actions, foot = null;
  if (step === 'paths') {
    const reason = leaves === 0 ? 'Pick the keys of each path.' : null;
    body = (
      <Stack gap="m" style={{ alignSelf: 'stretch' }}>
        <Row><Spacer /><Field label="Network:"><ComboBox value={network} options={NETWORKS} onChange={setNetwork} width={240} /></Field></Row>
        <SpendPathList paths={paths} keys={keys} onOpen={setEditing} onAdd={() => setEditing(paths.length)} />
      </Stack>
    );
    actions = (
      <ModalActions reason={reason}>
        <Btn id="continue" disabled={!!reason} onClick={() => { const skip = !missing.length; setSkippedXpubs(skip); setStep(skip ? 'review' : 'xpubs'); }} />
      </ModalActions>
    );
  } else if (step === 'xpubs') {
    body = (
      <Stack gap="s" style={{ alignSelf: 'stretch' }}>
        <Text variant="body">Click a missing key to fetch its xpub.</Text>
        <Text variant="caption">{used.length - missing.length} of {used.length} account xpubs fetched</Text>
        <Stack gap="xs">
          {used.map(k => (
            <SelectRow key={k.fp} icon={ROUTE_KINDS[k.route].icon} title={k.alias} sub={k.fp}
              status={<Pill id={fetched.includes(k.fp) ? 'xpub_fetched' : 'xpub_missing'} />}
              chevron={false} onClick={fetched.includes(k.fp) ? undefined : () => setFlow({ fetch: k.fp })} />
          ))}
        </Stack>
      </Stack>
    );
    actions = (
      <ModalActions onBack={() => setStep('paths')}
        reason={missing.length ? `${missing.length} account xpub${missing.length > 1 ? 's' : ''} still missing.` : null}>
        <Btn id="continue" disabled={!!missing.length} onClick={() => setStep('review')} />
      </ModalActions>
    );
  } else if (step === 'review') {
    /* the account is named here: the descriptor backup takes its name */
    const nameReason = !trimmed ? 'Enter an account name.'
      : existing.includes(trimmed) ? `An account named “${trimmed}” already exists.` : null;
    const reason = nameReason || (backedUp ? null : 'Back up the descriptor first.');
    body = (
      <Stack gap="m" style={{ alignSelf: 'stretch' }}>
        <FieldGroup>
          <Field label="Account Name:"><Input width={240} value={name} onChange={e => { setName(e.target.value); setBackedUp(false); }} /></Field>
        </FieldGroup>
        <PolicyReview paths={paths} keys={keys} />
        <Row gap="s">
          <Spacer />
          {backedUp ? <Text variant="caption" color="success">Descriptor backed up.</Text> : null}
          <Btn id={backedUp ? 'backup_descriptor' : 'backup_descriptor_primary'} disabled={!!nameReason}
            onClick={() => saveDescriptorFile(trimmed, MUSIG_DESCRIPTOR + '#' + MUSIG_CHECKSUM).then(ok => ok && setBackedUp(true))} />
        </Row>
      </Stack>
    );
    actions = (
      <ModalActions onBack={() => setStep(skippedXpubs ? 'paths' : 'xpubs')} reason={reason}>
        <Btn id="continue" disabled={!!reason} onClick={() => setStep('register')} />
      </ModalActions>
    );
  } else if (step === 'register') {
    /* one row per signer: a device registers the account on click; hot keys need none */
    const need = used.filter(k => NEEDS_REGISTER[k.route]);
    const left = need.filter(k => !registered.includes(k.fp));
    const register = (fp) => { setRegistering(fp); setTimeout(() => { setRegistered(r => [...r, fp]); setRegistering(null); }, 900); };
    body = (
      <Stack gap="s" style={{ alignSelf: 'stretch' }}>
        <Text variant="body">Click a device to register the account on it.</Text>
        <Stack gap="xs">
          {used.map(k => {
            const needs = !!NEEDS_REGISTER[k.route], done = registered.includes(k.fp), busy = registering === k.fp;
            return (
              <SelectRow key={k.fp} icon={ROUTE_KINDS[k.route].icon} title={k.alias} sub={k.fp} chevron={false}
                disabled={!needs} status={<Pill id={!needs ? 'reg_not_needed' : done ? 'reg_registered' : busy ? 'reg_registering' : 'reg_pending'} />}
                onClick={needs && !done && !registering ? () => register(k.fp) : undefined} />
            );
          })}
        </Stack>
      </Stack>
    );
    /* sits at the bottom, right above the button bar */
    foot = left.length ? (
      <Checkbox checked={skipRegister} onChange={setSkipRegister}
        label="Skip: continue without registering every device (register them later from the Keys tab)" />
    ) : null;
    const reason = registering ? 'Registering…'
      : left.length && !skipRegister ? `${left.length} device${left.length > 1 ? 's' : ''} still to register.` : null;
    actions = (
      <ModalActions onBack={registering ? null : () => setStep('review')} reason={reason}>
        <Btn id="continue" disabled={!!reason} onClick={() => setStep('verify')} />
      </ModalActions>
    );
  } else if (step === 'account') {
    /* last: the Electrum server the account syncs through, then Create */
    const reason = test !== 'ok' ? 'Test the Electrum server first.' : null;
    body = (
      <Stack gap="m" style={{ alignSelf: 'stretch' }}>
        <Text variant="body">An Electrum server is needed to fetch the on-chain history.</Text>
        <Notice tone="warning" title="Use your own Electrum server">
          A server run by someone else sees every address and transaction of this account.
        </Notice>
        <FieldGroup gap="s">
          <EndpointRow label="Electrum:" value={electrum} onChange={v => { setElectrum(v); setTest(null); }}
            test={test} onTest={() => { setTest('testing'); setTimeout(() => setTest('ok'), 700); }} />
          <Field label="SSL:"><Toggle on={ssl} onClick={() => { setSsl(!ssl); setTest(null); }} /></Field>
          <Field label={<Row gap="xs">Verify Certificate: <InfoTip label="Turn off for a server with a self-signed certificate." /></Row>}>
            <Toggle on={ssl && verifyCert} disabled={!ssl} onClick={() => { setVerifyCert(!verifyCert); setTest(null); }} />
          </Field>
        </FieldGroup>
      </Stack>
    );
    actions = (
      <ModalActions onBack={() => setStep('verify')} reason={reason}>
        <Btn id="create" disabled={!!reason} onClick={() => onCreate && onCreate(trimmed)} />
      </ModalActions>
    );
  } else {
    const signers = checkable ? used : used.map(k => ({ ...k, route: 'hot' }));
    body = <VerifyFirstAddress signers={signers} verified={verified} onCheck={fp => setFlow({ verify: fp })} />;
    /* optional: Continue is always open */
    actions = (
      <ModalActions onBack={() => setStep('register')}>
        <Btn id="continue" onClick={() => setStep('account')} />
      </ModalActions>
    );
  }
  return (
    <Modal title="Create Multikey Account" width={760} height="wizard" onClose={onCancel}>
      <Stack gap="m" style={{ alignSelf: 'stretch', flex: 1 }}>
        <WizardSteps steps={CREATE_STEPS} current={CREATE_STEP_INDEX[step]} />
        {body}
        <Spacer />
        {foot}
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

Object.assign(window, { MUSIG_KEYS, MUSIG_PATH, MUSIG_NEW_PATH, MUSIG_ADDRESS, PathEditor, SpendPathList, EditSpendPath, PolicyPreview, PolicyReview,
  VerifyFirstAddress, CreateSharedAccount, SpendPathPicker, MusigSigningCard, MusigSendPanel, musigCosigners, MUSIG_TXID });

/* File-level namespace (DS compiler indexes this file as `Musig`). */
export const Musig = { PathEditor, SpendPathList, EditSpendPath, PolicyPreview, PolicyReview, VerifyFirstAddress, CreateSharedAccount,
  SpendPathPicker, MusigSigningCard, MusigSendPanel };
