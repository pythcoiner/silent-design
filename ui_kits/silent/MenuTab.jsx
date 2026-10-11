/* Silent UI Kit — Menu tab (MenuTab.cpp) + CreateAccount / ConfirmDelete modals. */

function MenuTab({ wallets, openWallets, onOpen, onCreate, onDelete, onOpenKeys }) {
  const [creating, setCreating] = React.useState(false);
  const [deleting, setDeleting] = React.useState(null);
  return (
    <Stack align="center" justify="center" style={{ flex: 1, overflow: 'auto',
      padding: 'var(--space-xl) var(--space-m)' }}>
      <Text variant="title" align="center">Silent — Silent Payments Wallet</Text>

      <Stack gap="s" style={{ margin: 'var(--space-xl) 0 var(--space-m)' }}>
        {wallets.map(name => {
          const open = openWallets.includes(name);
          return (
            <Row key={name} gap="xs" style={{ opacity: open ? 0.5 : 1 }}>
              <Btn id="open_wallet" label={name} disabled={open} onClick={() => onOpen(name)} />
              <Btn id="delete_wallet" onClick={() => setDeleting(name)} />
            </Row>
          );
        })}
      </Stack>

      <Btn id="create_new_wallet" onClick={() => setCreating(true)} />

      {creating ? <CreateAccount existing={wallets} onOpenKeys={onOpenKeys ? () => { setCreating(false); onOpenKeys(); } : null} onCancel={() => setCreating(false)}
        onCreate={(name) => { onCreate(name); setCreating(false); }} /> : null}
      {deleting ? <ConfirmDelete name={deleting} onCancel={() => setDeleting(null)}
        onConfirm={() => { onDelete(deleting); setDeleting(null); }} /> : null}
    </Stack>
  );
}

/* 3.11 Create account from a key. The descriptor fetch runs the route steps in
   the "fetch" context — rendered in place of this modal, so modals never stack. */
const ENDPOINT_DEFAULTS = {
  Bitcoin: { blindbit: 'https://blindbit.silentpayments.dev', electrum: 'electrum.blockstream.info:50002', auto: true },
  Regtest: { blindbit: 'http://localhost:8080', electrum: '127.0.0.1:50001', auto: true },
  Signet: { blindbit: '', electrum: '', auto: false },
  Testnet: { blindbit: '', electrum: '', auto: false },
};
const descriptorRoute = (k) => k.routes.find(r => r === 'qr' || r === 'hot') || null;

function EndpointRow({ label, value, onChange, test, onTest }) {
  return (
    <React.Fragment>
      <Field label={label}>
        <Input grow mono value={value} onChange={e => onChange(e.target.value)} />
        <Btn id={test === 'testing' ? 'testing' : 'test'} disabled={!value.trim() || test === 'testing'} onClick={onTest} />
        <ValidationMark state={test === 'ok' ? 'valid' : test && test.error ? 'invalid' : 'none'} />
      </Field>
      {test && test.error ? <FieldNote tone="error">{test.error}</FieldNote> : null}
    </React.Fragment>
  );
}

function CreateAccount({ existing, keys = window.KEYS, onCancel, onCreate, onOpenKeys, initial = {} }) {
  const [name, setName] = React.useState(initial.name || '');
  const [network, setNetwork] = React.useState(initial.network || 'Regtest');
  const [keyFp, setKeyFp] = React.useState(initial.keyFp || null);
  const [desc, setDesc] = React.useState(initial.desc || null);          // { value, network }
  const [fetching, setFetching] = React.useState(false);
  const [blindbit, setBlindbit] = React.useState(ENDPOINT_DEFAULTS[initial.network || 'Regtest'].blindbit);
  const [electrum, setElectrum] = React.useState(ENDPOINT_DEFAULTS[initial.network || 'Regtest'].electrum);
  const [tests, setTests] = React.useState(initial.tests || {});         // { blindbit, electrum }: 'testing' | 'ok' | { error }

  const runTest = (which, value) => {
    setTests(t => ({ ...t, [which]: 'testing' }));
    setTimeout(() => setTests(t => ({ ...t, [which]: /localhost:8080/.test(value)
      ? { error: `Could not reach ${value}: connection refused. Start the BlindBit server, then test again.` } : 'ok' })), 900);
  };
  const pickNetwork = (n) => {
    setNetwork(n); setKeyFp(null);
    const d = ENDPOINT_DEFAULTS[n]; setBlindbit(d.blindbit); setElectrum(d.electrum); setTests({});
    if (d.auto) { runTest('blindbit', d.blindbit); runTest('electrum', d.electrum); }
  };
  React.useEffect(() => { if (!initial.tests && ENDPOINT_DEFAULTS[network].auto) { runTest('blindbit', blindbit); runTest('electrum', electrum); } }, []);

  const netKeys = keys.filter(k => k.network === network);
  const key = netKeys.find(k => k.fp === keyFp);
  const trimmed = name.trim();
  const reason = !trimmed ? 'Enter an account name.'
    : /\s/.test(name) ? 'The account name cannot contain spaces.'
    : existing.includes(trimmed) ? `An account named “${trimmed}” already exists.`
    : !desc ? 'Get the descriptor of a key first.'
    : desc.network !== network ? `The descriptor is for ${desc.network}, not ${network}. Get it again.`
    : tests.blindbit !== 'ok' || tests.electrum !== 'ok' ? 'Test both backends first.' : null;

  if (fetching && key) {
    return <SigningFlow context="fetch" keyRow={{ fp: key.fp, alias: key.alias, route: descriptorRoute(key) }}
      onCancel={() => setFetching(false)}
      onDone={() => { setDesc({ value: `sp([${key.fp}/352'/${network === 'Bitcoin' ? 0 : 1}'/0']${network === 'Bitcoin' ? DEMO_XPUB_M : DEMO_XPUB_T})#k7f3qz9d`, network }); setFetching(false); }} />;
  }

  return (
    <Modal title="Create Account" width={620} onClose={onCancel}>
      <Stack gap="m">
        <FieldGroup>
          <Field label="Account Name:">
            <Input width={240} placeholder="e.g. savings" value={name} onChange={e => setName(e.target.value)} />
          </Field>
          <Field label="Network:">
            <ComboBox value={network} options={NETWORKS} onChange={pickNetwork} width={240} />
          </Field>
        </FieldGroup>

        <Stack gap="s">
          <SectionLabel>Key</SectionLabel>
          {netKeys.length ? netKeys.map(k => {
            const route = descriptorRoute(k);
            return (
              <SelectRow key={k.fp} icon={route ? ROUTE_KINDS[route].icon : 'key'} title={k.alias} meta={k.fp}
                sub={route ? `Gets the descriptor with ${ROUTE_KINDS[route].label}.` : 'Only a QR Code or Hot Key route can return a descriptor.'}
                disabled={!route} selected={route ? keyFp === k.fp : undefined}
                onClick={route ? () => { setKeyFp(k.fp); if (keyFp !== k.fp) setDesc(null); } : undefined} />
            );
          }) : keys.length === 0 ? (
            <EmptyState icon="key" title="No Key Registered" subtitle="An account is created from a key. Register one in the Keys tab first."
              action={onOpenKeys ? <Btn id="open_keys_tab" onClick={onOpenKeys} /> : null} />
          ) : (
            <EmptyState icon="key" title={`No Key on ${network}`} />
          )}
          {netKeys.length ? (
            <Row gap="s">
              <Btn id={desc ? 'get_again' : 'get_descriptor'} disabled={!key} onClick={() => setFetching(true)} />
              {!key ? <Text variant="caption">Pick a key first.</Text> : null}
            </Row>
          ) : null}
          {desc ? <CopyField value={desc.value} wrap title="Copy descriptor" /> : null}
        </Stack>

        <Stack gap="xs">
          <SectionLabel>Backends</SectionLabel>
          <FieldGroup>
          <EndpointRow label="BlindBit URL:" value={blindbit} onChange={v => { setBlindbit(v); setTests(t => ({ ...t, blindbit: null })); }}
            test={tests.blindbit} onTest={() => runTest('blindbit', blindbit)} />
          <EndpointRow label="Electrum:" value={electrum} onChange={v => { setElectrum(v); setTests(t => ({ ...t, electrum: null })); }}
            test={tests.electrum} onTest={() => runTest('electrum', electrum)} />
          </FieldGroup>
        </Stack>

        <ModalActions reason={reason}>
          <Btn id="create" disabled={!!reason} onClick={() => onCreate(trimmed)} />
        </ModalActions>
      </Stack>
    </Modal>
  );
}

function ConfirmDelete({ name, onCancel, onConfirm }) {
  return (
    <Modal title="Delete Wallet" width={420} onClose={onCancel}>
      <Stack gap="m">
        <Text as="div" variant="body">Delete wallet “{name}”? This cannot be undone.</Text>
        <ModalActions>
          <Btn id="delete" onClick={onConfirm} />
        </ModalActions>
      </Stack>
    </Modal>
  );
}

Object.assign(window, { MenuTab, CreateAccount, ConfirmDelete, EndpointRow, ENDPOINT_DEFAULTS });
