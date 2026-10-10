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

function SettingsScreen({ wallet }) {
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

Object.assign(window, { SettingsScreen, TestableRow });
