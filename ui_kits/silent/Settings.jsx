/* Silent UI Kit — Settings screen (Settings.cpp). */

/* ServerRow — a server setting (Settings.cpp row): label on top (FieldLabel), then
   input · tip height (while connected) · Test · Connect/Disconnect on one row. Test shows
   while the input (or its transport) differs from the saved address; a passing Test saves
   it and drops the old connection. Connect waits for a saved address. `transport` adds the
   SSL / Verify Certificate toggles (as the creation wizard's Electrum step). Shared by the
   sp and Multikey Settings. */
function ServerRow({ label, initial, placeholder, height, connectId, disconnectId, transport = false }) {
  const [value, setValue] = React.useState(initial);
  const [saved, setSaved] = React.useState(initial);
  const [testing, setTesting] = React.useState(false);
  const [connected, setConnected] = React.useState(true);
  const [ssl, setSsl] = React.useState(true);
  const [verifyCert, setVerifyCert] = React.useState(true);
  React.useEffect(() => { setValue(initial); setSaved(initial); setConnected(true); }, [initial]);
  const test = () => { setTesting(true); setTimeout(() => { setTesting(false); setSaved(value); setConnected(false); }, 800); };
  const dirty = value !== saved && value.trim();
  return (
    <Stack gap="s">
      <div>
        <FieldLabel>{label}</FieldLabel>
        <Row gap="s">
          <Input grow value={value} placeholder={placeholder} onChange={e => setValue(e.target.value)} />
          {/* the connected server's tip, asked every 30 s while Settings shows */}
          {/* a fixed slot, so stacked rows' inputs share one width; empty while disconnected */}
          <Stack style={{ width: '8em', flex: 'none' }}>{connected && height ? <Text variant="mono" color="secondary">Height {height}</Text> : null}</Stack>
          {testing ? <Btn id="testing" disabled /> : dirty ? <Btn id="test" onClick={test} /> : <Btn id="test" placeholder />}
          {connected ? <Btn id={disconnectId} onClick={() => setConnected(false)} />
            : <Btn id={connectId} disabled={value !== saved} onClick={() => setConnected(true)} />}
        </Row>
      </div>
      {transport ? (
        <Row gap="l">
          <Field label="SSL:"><Toggle on={ssl} onClick={() => { setSsl(!ssl); setSaved(null); }} /></Field>
          <Field label={<Row gap="xs">Verify Certificate: <InfoTip label="Turn off for a server with a self-signed certificate." /></Row>}>
            <Toggle on={ssl && verifyCert} disabled={!ssl} onClick={() => { setVerifyCert(!verifyCert); setSaved(null); }} />
          </Field>
        </Row>
      ) : null}
    </Stack>
  );
}

/* A Multikey Wallet's Settings (core Settings.cpp + musig SettingsExtras.cpp): the
   Electrum ServerRow, Policy (its spend paths; Register Descriptor on the cosigners'
   devices under it), Descriptor (pretty, keys as aliases; copy for backup). */
function MusigSettingsScreen({ wallet }) {
  const [registering, setRegistering] = React.useState(false);
  React.useEffect(() => { setRegistering(false); }, [wallet]);
  return (
    <ScreenWrap title="Settings" titleRight={<Pill id="network" label={wallet.network} />}>
      <Stack gap="l">
        <ServerRow label="Electrum Address" initial={wallet.electrum} placeholder="host:port (e.g. 127.0.0.1:50001)"
          height={wallet.electrumHeight} connectId="connect_electrum" disconnectId="disconnect_electrum" transport />
        <Section label="Policy">
          <Stack gap="s">
            <PolicyReview paths={wallet.paths || []} />
            <Row justify="flex-end"><Btn id="register_descriptor" onClick={() => setRegistering(true)} /></Row>
          </Stack>
        </Section>
        <Section label="Descriptor">
          <DescriptorView value={wallet.descriptor}
            aliases={Object.fromEntries(musigSigners(wallet.cosigners.split(', ')).map(s => [s.fp, s.alias]))} />
        </Section>
      </Stack>
      {registering && window.RegisterDescriptorModal ? <RegisterDescriptorModal onClose={() => setRegistering(false)} /> : null}
    </ScreenWrap>
  );
}

function SettingsScreen({ wallet }) {
  if (wallet.kind === 'musig') {
    return <MusigSettingsScreen wallet={wallet} />;
  }
  return <SpSettingsScreen wallet={wallet} />;
}

/* An sp account's Settings, no section — the BlindBit and
   Electrum ServerRows (as the Multikey one), BlindBit's capabilities under its row. The network
   is a pill in the title row (both Settings). */
function SpSettingsScreen({ wallet }) {
  return (
    <ScreenWrap title="Settings" titleRight={<Pill id="network" label={wallet.network} />}>
        <Stack gap="l">
          <Stack gap="s">
          <ServerRow label="BlindBit URL" initial={wallet.blindbit} placeholder="https://blindbit.example.com"
            height={wallet.blindbitHeight || wallet.electrumHeight} connectId="connect_blindbit" disconnectId="disconnect_blindbit" />
          {/* what the BlindBit server reports it serves */}
          <Field label="Capabilities:" align="flex-start">
              <Stack gap={2}>
                <Text variant="body">Tweaks Only: Yes</Text>
                <Text variant="body">Full Basic: Yes</Text>
                <Text variant="body">Full + Dust Filter: Yes</Text>
                <Text variant="body">Cut-Through + Dust Filter: No</Text>
              </Stack>
            </Field>
          </Stack>
          <ServerRow label="Electrum Address" initial={wallet.electrum} placeholder="host:port"
            height={wallet.electrumHeight} connectId="connect_electrum" disconnectId="disconnect_electrum" transport />
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

Object.assign(window, { SettingsScreen, MusigSettingsScreen, ServerRow, ElectrumGaveUpModal });
