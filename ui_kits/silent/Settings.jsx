/* Silent UI Kit — Settings screen (Settings.cpp). */

/* `onVerified(bool)` reports whether the row's last Test passed with its current url:
   Settings.cpp enables a row's Connect on it, and Save once every row passed. */
function TestableRow({ label, value, onChange, placeholder, width = 440, onVerified }) {
  const [state, setState] = React.useState('idle'); // idle | testing | ok
  const report = (next) => { setState(next); if (onVerified) onVerified(next === 'ok'); };
  const test = () => { report('testing'); setTimeout(() => report('ok'), 800); };
  return (
    <Field label={label}>
      <Input width={width} value={value} placeholder={placeholder} onChange={e => { onChange(e.target.value); report('idle'); }} />
      <Btn id={state === 'testing' ? 'testing' : state === 'ok' ? 'test_ok' : 'test'} onClick={test}
        disabled={state === 'testing' || (state === 'idle' && !value.trim())} />
    </Field>
  );
}

/* A Multikey Wallet's Settings (core Settings.cpp + musig SettingsExtras.cpp): its one
   server, Electrum, then its descriptor, cosigners, Register Descriptor (its signing
   devices, RegisterDescriptorModal) and Delete. */
function MusigSettingsScreen({ wallet }) {
  const [electrum, setElectrum] = React.useState(wallet.electrum);
  const [verified, setVerified] = React.useState(false);
  // Both sections open, as the app shows them; each folds on its own.
  const [open, setOpen] = React.useState({ conn: true, account: true });
  const [deleting, setDeleting] = React.useState(false);
  const [registering, setRegistering] = React.useState(false);
  React.useEffect(() => { setElectrum(wallet.electrum); setVerified(false); setOpen({ conn: true, account: true }); setDeleting(false); setRegistering(false); }, [wallet]);
  const toggle = (id) => setOpen((cur) => ({ ...cur, [id]: !cur[id] }));
  return (
    <ScreenWrap title="Settings">
      <Stack>
        <FoldSection id="conn" label="Connection" open={open.conn} onToggle={toggle}>
          <FieldGroup>
            <TestableRow label="Electrum Server:" value={electrum} onChange={setElectrum} placeholder="host:port (e.g. 127.0.0.1:50001)"
              onVerified={setVerified} />
            {/* the connected server's tip, asked every 30 s while Settings shows; -- when not connected */}
            <Field label="Electrum Block Height:"><Text>{wallet.electrumHeight || '--'}</Text></Field>
          </FieldGroup>
        </FoldSection>
        {/* Connect and Save wait for a passing Test, as in the app. */}
        <Row justify="center" gap="s" style={{ marginTop: 'var(--space-l)' }}>
          <Btn id="connect_electrum" disabled={!verified} />
          <Btn id="save_settings" disabled={!verified} />
        </Row>

        <Ruler />
        <FoldSection id="account" label="Account" open={open.account} onToggle={toggle}>
          <FieldGroup>
            <Field label="Descriptor" align="flex-start"><CopyField value={wallet.descriptor} wrap grow /></Field>
            <Field label="Cosigners"><Text variant="mono">{wallet.cosigners}</Text></Field>
            <Field label="Signing Devices"><Btn id="register_descriptor" onClick={() => setRegistering(true)} /></Field>
          </FieldGroup>
        </FoldSection>
        <Row justify="center" style={{ marginTop: 'var(--space-l)' }}>
          <Btn id="delete" onClick={() => setDeleting(true)} />
        </Row>
      </Stack>
      {registering && window.RegisterDescriptorModal ? <RegisterDescriptorModal onClose={() => setRegistering(false)} /> : null}
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
  const [verified, setVerified] = React.useState({ blindbit: false, electrum: false });
  const [open, setOpen] = React.useState('');
  React.useEffect(() => {
    setBlindbit(wallet.blindbit); setElectrum(wallet.electrum); setNetwork(wallet.network);
    setVerified({ blindbit: false, electrum: false }); setOpen('');
  }, [wallet]);
  const verify = (which) => (ok) => setVerified((cur) => ({ ...cur, [which]: ok }));
  const toggle = (id) => setOpen((cur) => (cur === id ? '' : id));

  return (
    <ScreenWrap title="Settings">
      <Stack>
        <FoldSection id="conn" label="Connection" open={open === 'conn'} onToggle={toggle}>
          <FieldGroup>
            <TestableRow label="BlindBit URL:" value={blindbit} onChange={setBlindbit} placeholder="https://blindbit.example.com"
              onVerified={verify('blindbit')} />
            <TestableRow label="Electrum Server:" value={electrum} onChange={setElectrum} placeholder="host:port"
              onVerified={verify('electrum')} />
            <Field label="Electrum Block Height:"><Text>{wallet.electrumHeight || '--'}</Text></Field>
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
          {/* Each Connect waits for its row's passing Test, Save for every row's. */}
          <Btn id="connect_blindbit" disabled={!verified.blindbit} />
          <Btn id="connect_electrum" disabled={!verified.electrum} />
          <Btn id="save_settings" disabled={!verified.blindbit || !verified.electrum} />
        </Row>
      </Stack>
    </ScreenWrap>
  );
}

/* The reconnect gave up: the account's Electrum connection dropped more than 3 times
   in the last minute (Qt: MessageModal, Tone::Error, from the sp and the Multikey
   controllers alike). No action bar: the header × closes it. */
function ElectrumGaveUpModal({ server = 'minta.wizardsardine.com:60001', drops = 4, onClose }) {
  return (
    <Modal title="Electrum Disconnected" width={460} onClose={onClose}>
      <ModalStatus icon="alert" iconColor="var(--error)" pad="var(--space-l) 0"
        subtitle={`The connection to ${server} dropped ${drops} times in the last minute, so Silent stopped reconnecting. Check the server, then connect again from the status bar or the Settings.`} />
    </Modal>
  );
}

Object.assign(window, { SettingsScreen, MusigSettingsScreen, TestableRow, ElectrumGaveUpModal });
