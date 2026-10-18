/* Silent UI Kit — Settings screen (Settings.cpp). */

function TestableRow({ label, value, onChange, placeholder, width = 440, network }) {
  const [state, setState] = React.useState('idle'); // idle | testing | ok
  const test = () => { setState('testing'); setTimeout(() => setState('ok'), 800); };
  return (
    <Field label={label}>
      <Input width={width} value={value} placeholder={placeholder} onChange={e => { onChange(e.target.value); setState('idle'); }} />
      <Btn id={state === 'testing' ? 'testing' : state === 'ok' ? 'test_ok' : 'test'} onClick={test} disabled={state === 'testing'} />
    </Field>
  );
}

/* A Multikey Wallet's Settings (core Settings.cpp + musig SettingsExtras.cpp): its one
   server, Electrum, then its descriptor, cosigners and Delete. */
function MusigSettingsScreen({ wallet }) {
  const [electrum, setElectrum] = React.useState(wallet.electrum);
  // Both sections open, as the app shows them; each folds on its own.
  const [open, setOpen] = React.useState({ conn: true, account: true });
  const [deleting, setDeleting] = React.useState(false);
  React.useEffect(() => { setElectrum(wallet.electrum); setOpen({ conn: true, account: true }); setDeleting(false); }, [wallet]);
  const toggle = (id) => setOpen((cur) => ({ ...cur, [id]: !cur[id] }));
  return (
    <ScreenWrap title="Settings">
      <Stack>
        <FoldSection id="conn" label="Connection" open={open.conn} onToggle={toggle}>
          <FieldGroup>
            <TestableRow label="Electrum Server:" value={electrum} onChange={setElectrum} placeholder="host:port (e.g. 127.0.0.1:50001)" />
          </FieldGroup>
        </FoldSection>
        <Row justify="center" gap="s" style={{ marginTop: 'var(--space-l)' }}>
          <Btn id="connect_electrum" disabled={!electrum} />
          <Btn id="save_settings" disabled={!electrum} />
        </Row>

        <Ruler />
        <FoldSection id="account" label="Account" open={open.account} onToggle={toggle}>
          <FieldGroup>
            <Field label="Descriptor" align="flex-start"><CopyField value={wallet.descriptor} wrap grow /></Field>
            <Field label="Cosigners"><Text variant="mono">{wallet.cosigners}</Text></Field>
          </FieldGroup>
        </FoldSection>
        <Row justify="center" style={{ marginTop: 'var(--space-l)' }}>
          <Btn id="delete" onClick={() => setDeleting(true)} />
        </Row>
      </Stack>
      {deleting && window.ConfirmDelete ? <ConfirmDelete name={wallet.name} onCancel={() => setDeleting(false)}
        onConfirm={() => setDeleting(false)} /> : null}
    </ScreenWrap>
  );
}

function SettingsScreen({ wallet }) {
  if (wallet.kind === 'musig') {
    return <MusigSettingsScreen wallet={wallet} />;
  }
  return <SpSettingsScreen wallet={wallet} />;
}

function SpSettingsScreen({ wallet }) {
  const [blindbit, setBlindbit] = React.useState(wallet.blindbit);
  const [electrum, setElectrum] = React.useState(wallet.electrum);
  const [network, setNetwork] = React.useState(wallet.network);
  const [open, setOpen] = React.useState('');
  React.useEffect(() => {
    setBlindbit(wallet.blindbit); setElectrum(wallet.electrum); setNetwork(wallet.network); setOpen('');
  }, [wallet]);
  const toggle = (id) => setOpen((cur) => (cur === id ? '' : id));

  return (
    <ScreenWrap title="Settings">
      <Stack>
        <FoldSection id="conn" label="Connection" open={open === 'conn'} onToggle={toggle}>
          <FieldGroup>
            <TestableRow label="BlindBit URL:" value={blindbit} onChange={setBlindbit} placeholder="https://blindbit.example.com" />
            <TestableRow label="Electrum Server:" value={electrum} onChange={setElectrum} placeholder="host:port" />
            <Field label="Network:">
              <ComboBox value={network} options={NETWORKS} onChange={setNetwork} width={200} />
            </Field>
          </FieldGroup>
        </FoldSection>

        <Ruler />
        <FoldSection id="info" label="Backend Info" open={open === 'info'} onToggle={toggle}>
          <FieldGroup>
            <Field label="Network:"><Text variant="body">{network}</Text></Field>
            <Field label="Block Height:"><Text variant="mono">812519</Text></Field>
            <Field label="Capabilities:" align="flex-start">
              <Stack gap={2}>
                <Text variant="body">Tweaks Only: Yes</Text>
                <Text variant="body">Full Basic: Yes</Text>
                <Text variant="body">Full + Dust Filter: Yes</Text>
                <Text variant="body">Cut-Through + Dust Filter: No</Text>
              </Stack>
            </Field>
          </FieldGroup>
        </FoldSection>

        <Row justify="center" gap="s" style={{ marginTop: 'var(--space-l)' }}>
          <Btn id="connect_blindbit" />
          <Btn id="connect_electrum" />
          <Btn id="save_settings" />
        </Row>
      </Stack>
    </ScreenWrap>
  );
}

Object.assign(window, { SettingsScreen, MusigSettingsScreen, TestableRow });
