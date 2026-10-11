/* Silent UI Kit — Keys tab (issue #2 §3.1, 3.3, 3.6; no device detail — see handoff).
   KeysScreen: network selector, connected devices, registered keys.
   RegisterDeviceModal / KeyDetail: one modal each; steps (password, reveal, remove)
   replace the modal content — never a modal on top of a modal. */

/* The Keys tab content is a fixed 700px column, centred (not fluid like wallet panels). */
const KEYS_TAB_W = 700;

const HOT_WORDS = {
  f23a9e01: MNEMONIC_WORDS.slice(0, 12),
  '9a41e6b3': MNEMONIC_WORDS.concat(['lumber', 'quarter', 'solar', 'tiny', 'wisdom', 'zebra']),
};

/* Reachability of a key right now: a matching ready device, a hot secret, or neither. */
function keyStatus(key, devices) {   /* -> PILLS id */
  if ((devices || []).some(d => d.fp === key.fp && d.state === 'ready')) return 'key_connected';
  if (key.hasHot) return 'key_hot';
  return 'key_offline';
}

/* Devices and Keys lists share one row layout so they line up:
   icon · name + fingerprint / detail · status pill · glyph (rightmost).
   The glyph says what a click does: chevron = open, plus = register. The whole
   row is the click target; the glyph is not a separate button. */
const LIST_COLS = { statusWidth: 146, chevron: false };
function ListTitle({ name, fp }) {
  return (
    <Row gap="s" inline style={{ alignItems: 'baseline', minWidth: 0 }}>
      <span>{name}</span>
      <Text variant="mono" color="muted" size="sm">{fp || '—'}</Text>
    </Row>
  );
}
function ListEnd({ pill, glyph = 'chevron_right', busy }) {   /* glyph null = empty slot */
  return (
    <Row gap="m" justify="flex-end" style={{ width: '100%' }}>
      {pill}
      <span className="s-select-row__chev" style={{ width: 16, justifyContent: 'center' }}>
        {busy ? <Spinner size={14} /> : glyph ? <Icon name={glyph} size={16} /> : null}
      </span>
    </Row>
  );
}

function StateBadge({ state }) {
  return <Pill id={'device_' + (DEVICE_STATE[state] ? state : 'unsupported')} />;
}

/* ---------------- 3.1 Keys tab ---------------- */

function DeviceRow({ device, keyAlias, registering, onRegister }) {
  const known = !!keyAlias;
  const canRegister = device.state === 'ready' && device.fp && !known;
  const sub = registering ? 'Registering…' : device.state !== 'ready' ? device.detail
    : known ? `Registered as “${keyAlias}”` : 'Not registered as a key';
  return (
    <SelectRow icon="usb" title={<ListTitle name={deviceName(device)} fp={device.fp} />} sub={sub} {...LIST_COLS}
      disabled={known} onClick={canRegister && !registering ? onRegister : undefined}
      status={<ListEnd pill={<StateBadge state={device.state} />} glyph={canRegister ? 'plus' : null} busy={registering} />} />
  );
}

function KeyRow({ k, devices, onOpen }) {
  const st = keyStatus(k, devices);
  return (
    <SelectRow icon={ROUTE_KINDS[k.routes[0]].icon} title={<ListTitle name={k.alias} fp={k.fp} />} onClick={onOpen} {...LIST_COLS}
      sub={k.routes.map((r, i) => ROUTE_KINDS[r].label + (i === 0 && k.routes.length > 1 ? ' (primary)' : '')).join(' · ')}
      status={<ListEnd pill={<Pill id={st} />} />} />
  );
}

function KeysScreen({ initialNetwork = 'Signet', initialKeys = KEYS, initialDevices = DEVICES,
  initialError = null, initialRegistering = null, initialModal = null }) {
  const [network, setNetwork] = React.useState(initialNetwork);
  const [keys, setKeys] = React.useState(initialKeys);
  const [error, setError] = React.useState(initialError);
  const [registering, setRegistering] = React.useState(initialRegistering);
  const [modal, setModal] = React.useState(initialModal);

  const devices = initialDevices.filter(d => d.network === network);
  const netKeys = keys.filter(k => k.network === network);
  const aliasOf = (fp) => (keys.find(k => k.fp === fp && k.network === network) || {}).alias;

  const register = (d, alias) => {
    setError(null); setRegistering(d.id); setModal(null);
    setTimeout(() => {
      setRegistering(null);
      if (d.registerError) { setError({ device: deviceName(d), message: d.registerError }); return; }
      setKeys(ks => [...ks, { fp: d.fp, alias: (alias || '').trim() || deviceName(d), network, routes: ['usb'], hasHot: false,
        devicesSeen: [{ brand: d.brand, model: d.model, module: d.kind }],
        xpubs: [{ path: defaultXpubPath(network), xpub: network === 'Bitcoin' ? DEMO_XPUB_M : DEMO_XPUB_T }], descriptors: [] }]);
    }, 900);
  };
  const saveKey = (fp, next) => setKeys(ks => ks.map(k => (k.fp === fp && k.network === network ? next : k)));
  const removeKey = (fp) => { setKeys(ks => ks.filter(k => !(k.fp === fp && k.network === network))); setModal(null); };

  const openKey = netKeys.find(k => modal && modal.type === 'key' && k.fp === modal.fp);
  const regDevice = devices.find(d => modal && modal.type === 'register' && d.id === modal.id);
  const addBtn = <Btn id="add_a_key" onClick={() => setModal({ type: 'add' })} />;

  const [open, setOpen] = React.useState({ devices: true, keys: true });
  const toggle = (id) => setOpen(o => ({ ...o, [id]: !o[id] }));
  /* Each open section takes its content height and scrolls on its own once the two
     no longer fit; the page itself never scrolls. A folded section is just its header. */
  const section = (id, header, body) => (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: open[id] ? '0 1 auto' : 'none' }}>
      {header}
      {open[id] ? <ScrollArea>{body}</ScrollArea> : null}
    </div>
  );

  return (
    <div style={{ position: 'relative', display: 'flex', flex: 1, minWidth: 0, minHeight: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-l)', width: KEYS_TAB_W, maxWidth: '100%',
        margin: '0 auto', padding: 'var(--space-s)', minHeight: 0, boxSizing: 'border-box' }}>
        <Row gap="m" style={{ flex: 'none' }}>
          <Text as="div" variant="title">Keys</Text>
          <Spacer />
          <Field label="Network:"><ComboBox value={network} options={NETWORKS} onChange={(n) => { setNetwork(n); setError(null); }} width={160} /></Field>
        </Row>
        {error ? (
          <Notice tone="error" title={`Could not register ${error.device}`}
            action={<Btn id="dismiss_notice" onClick={() => setError(null)} />}>
            {error.message}
          </Notice>
        ) : null}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: '0 1 auto',
          gap: open.devices && open.keys ? 'var(--space-l)' : 'calc(var(--space-l) / 2)' }}>
        {section('devices',
          <SectionHeader label="Devices" count={devices.length || null} open={open.devices} onToggle={() => toggle('devices')} />,
          devices.length ? (
            <Stack gap="s">
              {devices.map(d => (
                <DeviceRow key={d.id} device={d} keyAlias={aliasOf(d.fp)} registering={registering === d.id}
                  onRegister={() => setModal({ type: 'register', id: d.id })} />
              ))}
            </Stack>
          ) : (
            <EmptyState icon="usb" title="No Device Connected"
              subtitle={`Connect a hardware wallet over USB and unlock it. It appears here while it runs on ${network}.`} />
          ))}
        {section('keys',
          <SectionHeader label="Keys" count={netKeys.length || null} open={open.keys} onToggle={() => toggle('keys')} action={netKeys.length && open.keys ? addBtn : null} />,
          netKeys.length ? (
            <Stack gap="s">
              {netKeys.map(k => <KeyRow key={k.fp} k={k} devices={devices} onOpen={() => setModal({ type: 'key', fp: k.fp })} />)}
            </Stack>
          ) : (
            <EmptyState icon="key" title={`No Key on ${network}`}
              subtitle="Add a key to sign transactions, verify addresses and create accounts." action={addBtn} />
          ))}
        </div>
      </div>

      {regDevice ? <RegisterDeviceModal device={regDevice} network={network} existing={netKeys}
        onCancel={() => setModal(null)} onConfirm={(alias) => register(regDevice, alias)} /> : null}
      {openKey ? <KeyDetail k={openKey} devices={devices} others={netKeys.filter(x => x.fp !== openKey.fp)}
        onClose={() => setModal(null)} onSave={(n) => saveKey(openKey.fp, n)} onRemove={() => removeKey(openKey.fp)} /> : null}
      {modal && modal.type === 'add' ? <AddKeyModal network={network} existing={keys.filter(k => k.network === network)}
        onClose={() => setModal(null)}
        onAdd={(k) => { setKeys(ks => [...ks, { ...k, network }]); setModal(null); }} /> : null}
    </div>
  );
}

/* Register a connected device as a key: confirmation + optional alias.
   An empty alias falls back to the device name. */
function RegisterDeviceModal({ device, network, existing = [], onCancel, onConfirm, initialAlias = '' }) {
  const [alias, setAlias] = React.useState(initialAlias);
  const name = deviceName(device);
  const taken = alias.trim() && existing.some(k => k.alias === alias.trim());
  const submit = () => { if (!taken) onConfirm(alias); };
  return (
    <Modal title="Register as Key" width={460} onClose={onCancel}>
      <Stack gap="l">
        {/* the device being registered */}
        <Card tone="inset" pad="m">
          <Row gap="m">
            <Icon name="usb" size={24} tone="accent" />
            <Stack gap="xxs" grow>
              <Text variant="section">{name}</Text>
              <Text variant="mono" color="secondary" size="sm">{device.fp}</Text>
            </Stack>
            <Pill id="network" label={network} />
          </Row>
        </Card>

        <Stack gap="xs">
          <Text as="label" variant="body" weight="demibold" htmlFor="reg-alias">Alias</Text>
          <Input id="reg-alias" width="100%" autoFocus placeholder={`Optional. Leave empty to name it “${name}”.`} value={alias}
            onChange={e => setAlias(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') submit(); }} />
          {taken ? <Text as="div" variant="caption" color="error">Another key is already named “{alias.trim()}”.</Text> : null}
        </Stack>

        <ModalActions>
          <Btn id="register" disabled={!!taken} onClick={submit} />
        </ModalActions>
      </Stack>
    </Modal>
  );
}

/* ---------------- 3.6 Password step (reused by signing + SP descriptor fetch) ---------------- */

/* onBack: shown when the step can return to a previous one (key detail); in the
   signing flow the header × is the only exit. */
function PasswordStep({ prompt, proceedId = 'proceed', onBack, error: initialError = null, onProceed, onCancel }) {
  const [pw, setPw] = React.useState('');
  const [error, setError] = React.useState(initialError);
  const [busy, setBusy] = React.useState(false);
  const submit = () => {
    setBusy(true); setError(null);
    setTimeout(() => {
      setBusy(false);
      if (pw.length < 8) { setError('Wrong password. Try again.'); setPw(''); return; }   // demo rule
      onProceed && onProceed(pw);
    }, 700);
  };
  return (
    <Stack gap="m">
      {prompt ? <Text as="div" variant="body" color="secondary">{prompt}</Text> : null}
      <Field label="Password:">
        <Input type="password" width={260} value={pw} autoFocus disabled={busy}
            onChange={e => { setPw(e.target.value); if (error) setError(null); }}
            onKeyDown={e => { if (e.key === 'Enter' && pw) submit(); }} />
      </Field>
      {error ? <Notice tone="error">{error}</Notice> : null}
      <ModalActions onBack={onBack} reason={!pw ? 'Enter the password.' : null}>
        <Btn id={busy ? 'unlocking' : proceedId} disabled={!pw || busy} onClick={submit} />
      </ModalActions>
    </Stack>
  );
}

/* ---------------- 3.3 Key detail ---------------- */

function RouteTable({ routes, hasHot, onChange, initialAdding = false }) {
  const addable = Object.keys(ROUTE_KINDS).filter(r => !routes.includes(r) && (r !== 'hot' || hasHot));
  const [adding, setAdding] = React.useState(initialAdding);
  const [pick, setPick] = React.useState(addable[0]);
  React.useEffect(() => { if (!addable.includes(pick)) setPick(addable[0]); }, [routes.join()]);
  const move = (i, d) => { const n = [...routes]; [n[i], n[i + d]] = [n[i + d], n[i]]; onChange(n); };
  const confirm = () => { onChange([...routes, pick || addable[0]]); setAdding(false); };
  const ADD = '__add';
  /* The last row adds a route: + (in the remove column) opens a kind picker in the
     row and turns into ✓ to confirm; × beside it cancels. */
  const rows = addable.length ? [...routes, ADD] : routes;
  return (
    <Table hideHeader rows={rows} rowKey={r => r} rowClass={r => (r === ADD && !adding ? 'is-bare' : '')} columns={[
      { header: '', width: 40, render: r => r === ADD ? null : <Icon name={ROUTE_KINDS[r].icon} size={16} tone="accent" /> },
      { header: 'Route', grow: true, render: (r, i) => r === ADD
        ? (adding ? <ComboBox value={ROUTE_KINDS[pick || addable[0]].label} options={addable.map(x => ROUTE_KINDS[x].label)}
            onChange={l => setPick(addable.find(x => ROUTE_KINDS[x].label === l))} width={160} /> : null)
        : <Text variant="body">{ROUTE_KINDS[r].label}</Text> },
      { header: '', width: 116, render: (r, i) => r === ADD ? (
        <Row gap="xxs" justify="flex-end">
          {adding ? <Btn id="cancel_add_route" onClick={() => setAdding(false)} /> : null}
          {adding ? <Btn id="confirm_add_route" onClick={confirm} /> : <Btn id="add_route_icon" onClick={() => setAdding(true)} />}
        </Row>
      ) : (
        <Row gap="xxs" justify="flex-end">
          <Btn id="move_up" disabled={i === 0} onClick={() => move(i, -1)} />
          <Btn id="move_down" disabled={i === routes.length - 1} onClick={() => move(i, 1)} />
          <Btn id="remove_route" title={routes.length === 1 ? 'A key needs at least one route' : 'Remove Route'} disabled={routes.length === 1}
            onClick={() => onChange(routes.filter(x => x !== r))} />
        </Row>
      ) },
    ]} />
  );
}
function EmptyLine({ children }) {
  return <Text as="div" variant="body" color="muted">{children}</Text>;
}

function RevealMnemonic({ words, onDone, initialHidden = false }) {
  const [hidden, setHidden] = React.useState(initialHidden);
  return (
    <Stack gap="m">
      <Notice tone="warning" title="Anyone with these words holds the coins">
        Make sure no one can see the screen. Silent never asks for these words.
      </Notice>
      <Stack gap="s">
        <Row justify="flex-end">
          <Btn id={hidden ? 'show_words' : 'hide_words'} onClick={() => setHidden(h => !h)} />
        </Row>
        <WordGrid words={words} hidden={hidden} />
      </Stack>
      <ModalActions>
        <Btn id="done" onClick={onDone} />
      </ModalActions>
    </Stack>
  );
}

function RemoveKeyConfirm({ k, onCancel, onConfirm }) {
  const reg = k.descriptors.filter(d => d.registered);
  return (
    <Stack gap="m">
      <Text as="div" variant="body">Remove “{k.alias}” (<Text variant="mono">{k.fp}</Text>) from this computer?</Text>
      {reg.length ? (
        <Notice tone="warning" title={`${reg.length === 1 ? '1 account uses' : reg.length + ' accounts use'} this key`}>
          {reg.map(d => d.account).join(', ')} will no longer be able to sign.
        </Notice>
      ) : null}
      {k.hasHot ? <Notice tone="warning">The sealed mnemonic is deleted with the key. Without a backup of the words, it cannot be recovered.</Notice> : null}
      <ModalActions onBack={onCancel}>
        <Btn id="remove_key" onClick={onConfirm} />
      </ModalActions>
    </Stack>
  );
}

/* XpubTable — the one way an xpub list is shown: path (mono, muted) · short xpub.
   Used by Cached Xpubs (with copy, Used pill and a trailing + row) and by the
   Add a Key review (read-only: no copy, no pill). */
function XpubTable({ rows, copy = true, pill = false, addRow = null }) {
  const all = addRow ? [...rows, { __add: true }] : rows;
  return (
    <Table hideHeader rows={all} rowKey={x => x.__add ? '__add' : x.path}
      rowClass={x => (x.__add ? 'is-bare' : '')} columns={[
      { header: 'Path', width: 140, mono: true, render: x => x.__add ? null : x.path },
      { header: 'Xpub', grow: true, render: x => x.__add ? (addRow.empty || null) : <ShortValue value={x.xpub} copy={copy} title="Copy xpub" /> },
      ...(pill || addRow ? [{ header: '', width: 130, align: 'right', render: x => x.__add ? addRow.action : pill ? <Pill id={x.used ? 'xpub_used' : 'xpub_unused'} /> : null }] : []),
    ]} />
  );
}

/* Fetch an xpub at a chosen path: purpose (84 / 86 / 49 / 48 / 87 / custom) and
   account index. A step of the key detail modal (replaces its content; Back returns). */
/* BIP48 script type: the last path level. 1' and 2' are in BIP48; 3' (Taproot) is
   not in the BIP but is the convention wallets use for P2TR multisig. */
const BIP48_SCRIPTS = [{ id: 2, label: "2' · P2WSH" }, { id: 1, label: "1' · P2SH-P2WSH" }, { id: 3, label: "3' · P2TR" }];
const XPUB_PURPOSES = [
  { id: '84', label: "BIP84 · Native SegWit (84')", tpl: (c, a) => `m/84'/${c}'/${a}'` },
  { id: '86', label: "BIP86 · Taproot (86')", tpl: (c, a) => `m/86'/${c}'/${a}'` },
  { id: '49', label: "BIP49 · Nested SegWit (49')", tpl: (c, a) => `m/49'/${c}'/${a}'` },
  { id: '48', label: "BIP48 · Multisig (48')", tpl: (c, a, s = 2) => `m/48'/${c}'/${a}'/${s}'` },
  { id: '87', label: "BIP87 · Multisig (87')", tpl: (c, a) => `m/87'/${c}'/${a}'` },
  { id: 'custom', label: 'Custom Path' },
];
function FetchXpubStep({ network, device, existing = [], onBack, onFetched, initial = {} }) {
  const coin = network === 'Bitcoin' ? 0 : 1;
  const [purpose, setPurpose] = React.useState(initial.purpose || '84');
  /* default account = the first index whose path is not cached yet for this purpose */
  const freeAccount = (pid) => { const t = XPUB_PURPOSES.find(x => x.id === pid).tpl; if (!t) return '0'; let a = 0; while (existing.some(x => x.path === t(coin, a)) && a < 99) a++; return String(a); };
  const [account, setAccount] = React.useState(initial.account != null ? String(initial.account) : freeAccount(initial.purpose || '84'));
  const [typed, setTyped] = React.useState(initial.account != null);
  const [script, setScript] = React.useState(initial.script || 2);
  const [custom, setCustom] = React.useState(initial.custom || '');
  const [busy, setBusy] = React.useState(!!initial.busy);
  const p = XPUB_PURPOSES.find(x => x.id === purpose);
  /* 48 splits the path around the account AND the script type; others only the account */
  const pathParts = p.tpl ? p.tpl(coin, '\u0000', '\u0001').split(/[\u0000\u0001]/) : ['', ''];
  const accOk = /^\d{1,2}$/.test(account);
  const path = purpose === 'custom' ? custom.trim() : accOk ? p.tpl(coin, +account, script) : '';
  const pathOk = purpose !== 'custom' || /^m(\/\d+'?)+$/.test(path);
  const dup = path && existing.some(x => x.path === path);
  const reason = purpose !== 'custom' && !accOk ? 'Enter an account index (0–99).'
    : purpose === 'custom' && !path ? 'Enter a derivation path.'
    : !pathOk ? "Write the path like m/84'/1'/0'."
    : dup ? 'This xpub is already cached.' : null;
  if (busy) return <ModalStatus spinner title="Fetching the xpub…" subtitle={`Confirm on ${deviceName(device)} if it asks.`} pad="var(--space-m) 0" />;
  return (
    <Stack gap="m">
      <FieldGroup>
        <Field label="Path Type:"><ComboBox value={p.label} options={XPUB_PURPOSES.map(x => x.label)} onChange={l => { const id = XPUB_PURPOSES.find(x => x.label === l).id; setPurpose(id); if (!typed && id !== 'custom') setAccount(freeAccount(id)); }} width={260} /></Field>
        {purpose === 'custom' ? (
          <Field label="Path:"><Input mono width={260} placeholder={`m/84'/${coin}'/0'`} value={custom} onChange={e => setCustom(e.target.value)} /></Field>
        ) : (
          /* the path with the account index as the only editable part */
          <Field label="Path:">
            <Row gap="xxs">
              <Text variant="mono">{pathParts[0]}</Text>
              <Input mono width={44} maxLength={2} value={account} title="Account index (0–99)"
                onChange={e => { setTyped(true); setAccount(e.target.value.replace(/[^\d]/g, '').slice(0, 2)); }} />
              <Text variant="mono">{pathParts[1]}</Text>
              {purpose === '48' ? (
                <React.Fragment>
                  <ComboBox value={BIP48_SCRIPTS.find(x => x.id === script).label} options={BIP48_SCRIPTS.map(x => x.label)}
                    onChange={l => setScript(BIP48_SCRIPTS.find(x => x.label === l).id)} width={150} />
                  <Text variant="mono">{pathParts[2]}</Text>
                </React.Fragment>
              ) : null}
            </Row>
          </Field>
        )}
      </FieldGroup>
      <ModalActions reason={reason}>
        <Btn id="fetch_this_xpub" disabled={!!reason} onClick={() => { setBusy(true); setTimeout(() => onFetched(path), 1000); }} />
      </ModalActions>
    </Stack>
  );
}

function KeyDetail({ k, devices = [], others = [], onClose, onSave, onRemove, initial = {} }) {
  const [step, setStep] = React.useState(initial.step || 'detail');     // detail | password | reveal | remove
  const [alias, setAlias] = React.useState(initial.alias != null ? initial.alias : k.alias);
  const [aliasMsg, setAliasMsg] = React.useState(initial.aliasMsg || null);   // { error }
  const st = keyStatus(k, devices);
  const device = (devices || []).find(d => d.fp === k.fp && d.state === 'ready');
  const [xpubs, setXpubs] = React.useState(k.xpubs);
  const [fetching, setFetching] = React.useState(!!initial.fetchingXpubs);
  const [accounts, setAccounts] = React.useState(k.descriptors);
  const [registering, setRegistering] = React.useState(null);
  const registerAccount = (idx) => { setRegistering(idx); setTimeout(() => { setAccounts(a => a.map((x, n) => (n === idx ? { ...x, registered: true } : x))); setRegistering(null); }, 1000); };
  const [folds, setFolds] = React.useState({ routes: true, devices: false, xpubs: true, descriptors: true, ...(initial.folds || {}) });
  const fold = (id) => setFolds(f => ({ ...f, [id]: !f[id] }));

  const saveAlias = () => {
    const a = alias.trim();
    if (!a) return setAliasMsg({ error: 'Enter an alias.' });
    if (others.some(o => o.alias === a)) return setAliasMsg({ error: `Another key is already named “${a}”.` });
    onSave && onSave({ ...k, alias: a }); setAliasMsg(null);
  };
  const addXpub = (path) => { setXpubs(xs => [...xs, { path, xpub: (k.network === 'Bitcoin' ? DEMO_XPUB_M : DEMO_XPUB_T).replace('Lj', path.slice(2, 4)), used: false }]); setStep('detail'); };
  const title = { detail: k.alias, 'fetch-xpub': k.alias, password: 'Reveal Mnemonic', reveal: 'Reveal Mnemonic', remove: 'Remove Key' }[step];
  // Fetch Xpub opens its own modal over the key detail, which stays underneath.
  const fetchOpen = step === 'fetch-xpub' && device;

  return (
    <>
    <Modal title={title} width={600} onClose={onClose}
      headerRight={<Row gap="s"><Text variant="mono" color="secondary" size="sm">{k.fp}</Text><Pill id={st} /></Row>}>
      {step === 'password' ? (
        <PasswordStep proceedId="show_mnemonic"
          error={initial.pwError || null} onBack={() => setStep('detail')} onProceed={() => setStep('reveal')} />
      ) : step === 'reveal' ? (
        <RevealMnemonic words={HOT_WORDS[k.fp] || MNEMONIC_WORDS.slice(0, 12)} initialHidden={!!initial.hidden} onDone={() => setStep('detail')} />
      ) : step === 'remove' ? (
        <RemoveKeyConfirm k={k} onCancel={() => setStep('detail')} onConfirm={onRemove} />
      ) : (
        <Stack gap="xs">
          <Stack gap="s">
            <Field label="Alias:">
              <Input grow value={alias} onChange={e => { setAlias(e.target.value); setAliasMsg(null); }}
                onKeyDown={e => { if (e.key === 'Enter' && alias.trim() !== k.alias) saveAlias(); }} />
              {alias.trim() !== k.alias ? <Btn id="save_alias" onClick={saveAlias} /> : null}
            </Field>
            {aliasMsg && aliasMsg.error ? <Text as="div" variant="caption" color="error">{aliasMsg.error}</Text> : null}
          </Stack>

          <Section dense label="Devices Seen" count={k.devicesSeen.length || null} open={folds.devices} onToggle={() => fold('devices')}>
            {k.devicesSeen.length ? (
              <Table rows={k.devicesSeen} columns={[
                { header: 'Device', grow: true, render: d => deviceName(d) },
                { key: 'module', header: 'Module', width: 160 },
              ]} />
            ) : <EmptyLine>No device with this fingerprint has been connected yet.</EmptyLine>}
          </Section>

          <Section dense label="Routes" count={k.routes.length} open={folds.routes} onToggle={() => fold('routes')}>
            <RouteTable routes={k.routes} hasHot={k.hasHot} initialAdding={!!initial.addingRoute} onChange={r => onSave && onSave({ ...k, routes: r })} />
          </Section>

          <Section dense label="Cached Xpubs" count={xpubs.length || null} open={folds.xpubs} onToggle={() => fold('xpubs')}>
            <XpubTable rows={xpubs} pill addRow={{
              empty: xpubs.length ? null : <Text variant="body" color="muted">{device ? 'No xpub cached yet.' : 'No xpub cached. Connect the device to fetch them.'}</Text>,
              action: <Btn id="fetch_xpub" disabled={!device} onClick={() => setStep('fetch-xpub')}
                title={device ? `Fetch xpubs from ${deviceName(device)}` : 'Connect the device to fetch xpubs'} />,
            }} />
          </Section>

          <Section dense label="Registered Accounts" count={accounts.length || null} open={folds.descriptors} onToggle={() => fold('descriptors')}>
            {accounts.length ? (
              <Table hideHeader rows={accounts} rowKey={(d, i) => d.account + i} columns={[
                { header: 'Account', grow: true, render: d => <Text variant="body" weight="demibold">{d.account}</Text> },
                { header: 'Module', width: 160, muted: true, render: d => d.module || 'SP Accounts' },
                { header: '', width: 140, align: 'right', render: (d, i) => d.registered ? <Pill id="account_registered" /> : registering === i ? <Spinner size={14} /> : (
                  <Btn id="register_account" disabled={!device} onClick={() => registerAccount(i)}
                    title={device ? `Register on ${deviceName(device)}` : 'Connect the device to register'} />
                ) },
              ]} />
            ) : <EmptyLine>No account uses this key.</EmptyLine>}
          </Section>

          <ModalActions>
            {k.hasHot ? <Btn id="reveal_mnemonic" onClick={() => setStep('password')} /> : null}
            <Btn id="remove_key" onClick={() => setStep('remove')} />
          </ModalActions>
        </Stack>
      )}
    </Modal>
    {fetchOpen ? (
      <Modal title="Fetch Xpub" width={600} onClose={() => setStep('detail')}>
        <FetchXpubStep network={k.network} device={device} existing={xpubs} initial={initial.fetch || {}}
          onBack={() => setStep('detail')} onFetched={addXpub} />
      </Modal>
    ) : null}
    </>
  );
}

Object.assign(window, { XpubTable, FetchXpubStep, XPUB_PURPOSES, BIP48_SCRIPTS, KeysScreen, RegisterDeviceModal, DeviceRow, KeyRow, KeyDetail, PasswordStep, RevealMnemonic,
  RemoveKeyConfirm, RouteTable, KEYS_TAB_W, LIST_COLS, ListTitle, ListEnd, StateBadge, keyStatus, HOT_WORDS });
