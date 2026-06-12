/* Silent UI Kit — Settings screen (Settings.cpp). */

function TestableRow({ label, value, onChange, placeholder, width = 440, network }) {
  const [state, setState] = React.useState('idle'); // idle | testing | ok
  const test = () => { setState('testing'); setTimeout(() => setState('ok'), 800); };
  return (
    <Field label={label} labelWidth={130}>
      <Input width={width} value={value} placeholder={placeholder} onChange={e => { onChange(e.target.value); setState('idle'); }} />
      <Button onClick={test} disabled={state === 'testing'} style={{ marginLeft: 'var(--space-xs)' }}>{state === 'testing' ? 'Testing…' : state === 'ok' ? '✓ Test' : 'Test'}</Button>
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
          <Stack gap="xs">
            <TestableRow label="BlindBit URL:" value={blindbit} onChange={setBlindbit} placeholder="https://blindbit.example.com" />
            <TestableRow label="Electrum Server:" value={electrum} onChange={setElectrum} placeholder="host:port" />
            <Field label="Network:" labelWidth={130}>
              <ComboBox value={network} options={NETWORKS} onChange={setNetwork} width={200} />
            </Field>
          </Stack>
        </FoldSection>

        <Ruler />
        <FoldSection id="info" label="Backend Info" open={open === 'info'} onToggle={toggle}>
          <Stack gap="xs">
            <Field label="Network:" labelWidth={130}><Text variant="body">{network}</Text></Field>
            <Field label="Block Height:" labelWidth={130}><Text variant="mono">812519</Text></Field>
            <Field label="Capabilities:" labelWidth={130} align="flex-start">
              <Stack gap={2}>
                <Text variant="body">Tweaks Only: Yes</Text>
                <Text variant="body">Full Basic: Yes</Text>
                <Text variant="body">Full + Dust Filter: Yes</Text>
                <Text variant="body">Cut-Through + Dust Filter: No</Text>
              </Stack>
            </Field>
          </Stack>
        </FoldSection>

        <Row justify="center" gap="s" style={{ marginTop: 'var(--space-l)' }}>
          <Button>Connect Blindbit</Button>
          <Button>Connect Electrum</Button>
          <Button role="primary">Save Settings</Button>
        </Row>
      </Stack>
    </ScreenWrap>
  );
}

Object.assign(window, { SettingsScreen, TestableRow });
