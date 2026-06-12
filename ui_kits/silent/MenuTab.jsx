/* Silent UI Kit — Menu tab (MenuTab.cpp) + CreateAccount / ConfirmDelete modals. */

function MenuTab({ wallets, openWallets, onOpen, onCreate, onDelete }) {
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
              <Button role="tab-open" disabled={open} onClick={() => onOpen(name)}>{name}</Button>
              <Button role="icon" title="Delete wallet" onClick={() => setDeleting(name)}><Icon name="trash" size={20} /></Button>
            </Row>
          );
        })}
      </Stack>

      <Button role="tab-create" onClick={() => setCreating(true)}>+ Create New Wallet</Button>

      {creating ? <CreateAccount existing={wallets} onCancel={() => setCreating(false)}
        onCreate={(name) => { onCreate(name); setCreating(false); }} /> : null}
      {deleting ? <ConfirmDelete name={deleting} onCancel={() => setDeleting(null)}
        onConfirm={() => { onDelete(deleting); setDeleting(null); }} /> : null}
    </Stack>
  );
}

function CreateAccount({ existing, onCancel, onCreate }) {
  const [name, setName] = React.useState('');
  const [mnemonic, setMnemonic] = React.useState('');
  const [network, setNetwork] = React.useState('Regtest');
  const [blindbit, setBlindbit] = React.useState('http://localhost:8080');
  const [electrum, setElectrum] = React.useState('127.0.0.1:50001');

  const nameOk = name.trim() !== '' && !name.includes(' ') && !existing.includes(name.trim());
  const mnemonicOk = mnemonic.trim().split(/\s+/).length >= 12;
  const canCreate = nameOk && mnemonicOk;

  const labelW = 110;
  return (
    <Modal title="Create Account" width={560} onClose={onCancel}>
      <Stack gap="s">
        <Field label="Account Name:" labelWidth={labelW}>
          <Input width={200} placeholder="Enter account name" value={name} onChange={e => setName(e.target.value)} />
        </Field>
        <Field label="Mnemonic:" labelWidth={labelW} align="flex-start">
          <TextArea mono width={320} height={50} placeholder="Mnemonic phrase" value={mnemonic}
            onChange={e => setMnemonic(e.target.value)} />
        </Field>
        <Row justify="center">
          <Button onClick={() => setMnemonic(fakeMnemonic())}>Generate</Button>
        </Row>
        <Field label="Network:" labelWidth={labelW}>
          <ComboBox value={network} options={NETWORKS} onChange={setNetwork} width={200} />
        </Field>
        <Field label="BlindBit URL:" labelWidth={labelW}>
          <Input width={260} value={blindbit} onChange={e => setBlindbit(e.target.value)} />
          <Button style={{ marginLeft: 'var(--space-xs)' }}>Test</Button>
        </Field>
        <Field label="Electrum:" labelWidth={labelW}>
          <Input width={260} value={electrum} onChange={e => setElectrum(e.target.value)} />
          <Button style={{ marginLeft: 'var(--space-xs)' }}>Test</Button>
        </Field>
      </Stack>
      <Row justify="center" gap="m" style={{ marginTop: 'var(--space-m)' }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button role="primary" disabled={!canCreate} onClick={() => onCreate(name.trim())}>Create</Button>
      </Row>
    </Modal>
  );
}

function ConfirmDelete({ name, onCancel, onConfirm }) {
  return (
    <Modal title="Delete Wallet" width={420} onClose={onCancel}>
      <Text as="div" variant="body" style={{ marginBottom: 'var(--space-m)' }}>Delete wallet "{name}"? This cannot be undone.</Text>
      <Row justify="center" gap="m">
        <Button onClick={onCancel}>Cancel</Button>
        <Button role="destructive" onClick={onConfirm}>Delete</Button>
      </Row>
    </Modal>
  );
}

Object.assign(window, { MenuTab, CreateAccount, ConfirmDelete });
