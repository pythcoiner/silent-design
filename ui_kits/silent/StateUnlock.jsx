/* Silent UI Kit: the encrypted app state's startup screens (ws-plaude/silent#37;
   src/state/). Shown before the main window, once per start: the first start picks
   what unlocks the state (a signing device or a password), every later one unlocks
   it. Each is a modal on its own; closing it quits Silent. */

const STATE_PATH = (index) => `m/138'/1936225652'/${index}'`;
const STATE_NETWORKS = ['Bitcoin', 'Testnet', 'Signet', 'Regtest'];

/* The first start (Qt: state::StateSetup). Views: choice, device, password, busy. */
function StateSetupModal({ initial = {}, onClose }) {
  const [view, setView] = React.useState(initial.view || 'choice');
  const [network, setNetwork] = React.useState(initial.network || 'Bitcoin');
  const devices = initial.devices != null ? initial.devices : DEVICES.filter(d => ['hid-0001', 'hid-0002', 'hid-0004'].includes(d.id));
  const [picked, setPicked] = React.useState(initial.picked || null);
  const [pw, setPw] = React.useState(initial.pw || '');
  const [confirm, setConfirm] = React.useState(initial.confirm || '');
  const [busy, setBusy] = React.useState(initial.busy || null);   // null | 'device' | 'password'
  const error = initial.error || null;
  const index = initial.index || 1266802657;
  const pickedDevice = devices.find(d => d.id === picked);

  if (busy) {
    const device = busy === 'device';
    return (
      <Modal title={device ? 'Protect Silent · Signing Device' : 'Protect Silent · Password'} width={560} onClose={device ? onClose : undefined}>
        <ModalStatus spinner pad="var(--space-l) 0"
          title={device ? 'Confirm on Your Device' : 'Sealing the Key'}
          subtitle={device ? `Silent asks ${pickedDevice ? deviceName(pickedDevice) : 'the device'} for the key at ${STATE_PATH(index)}.` : 'Encrypting the key with the password. This takes a few seconds.'} />
      </Modal>
    );
  }
  if (view === 'device') {
    return (
      <Modal title="Protect Silent · Signing Device" width={560} onClose={onClose}>
        <Stack gap="m">
          <Text as="div" variant="body" color="secondary">Plug in the device and unlock it, open its app for the network below, then pick it.</Text>
          <Field label="Network:"><ComboBox value={network} options={STATE_NETWORKS} onChange={setNetwork} width={160} /></Field>
          {devices.length ? <Stack gap="s">
            {devices.map(d => {
              const ready = d.state === 'ready';
              return (
                <SelectRow key={d.id} icon="usb" title={deviceName(d)} sub={ready ? d.fp : d.detail} chevron={false}
                  status={<Pill id={ready ? 'device_ready' : d.state === 'locked' ? 'device_locked' : 'device_unsupported'} />}
                  selected={ready ? picked === d.id : undefined} onClick={ready ? () => setPicked(d.id) : undefined} />
              );
            })}
          </Stack> : <ModalStatus icon="usb" title="No Device Connected" subtitle="Plug in your signing device and unlock it." pad="var(--space-m) 0" />}
          {error ? <Notice tone="error">{error}</Notice> : null}
          <ModalActions onBack={() => setView('choice')} reason={picked ? null : 'Pick a ready device.'}>
            <Btn id="continue" disabled={!picked} onClick={() => setBusy('device')} />
          </ModalActions>
        </Stack>
      </Modal>
    );
  }
  if (view === 'password') {
    const short = pw && pw.length < 8;
    const mismatch = confirm && confirm !== pw;
    const reason = !pw ? 'Choose a password.' : pw.length < 8 ? 'Use at least 8 characters.' : confirm !== pw ? 'The two passwords must match.' : null;
    return (
      <Modal title="Protect Silent · Password" width={560} onClose={onClose}>
        <Stack gap="m">
          <Text as="div" variant="body" color="secondary">The password opens Silent at every start. If you forget it, Silent cannot open what it keeps here: wipe ~/.silent/ and start again.</Text>
          <FieldGroup>
            <Field label="Password:"><Input type="password" width={260} value={pw} onChange={e => setPw(e.target.value)} /></Field>
            {short ? <FieldNote tone="error">Use at least 8 characters.</FieldNote> : null}
            <Field label="Confirm:"><Input type="password" width={260} value={confirm} onChange={e => setConfirm(e.target.value)} /></Field>
            {mismatch ? <FieldNote tone="error">The passwords do not match.</FieldNote> : null}
          </FieldGroup>
          {error ? <Notice tone="error">{error}</Notice> : null}
          <ModalActions onBack={() => setView('choice')} reason={reason}>
            <Btn id="create" disabled={!!reason} onClick={() => setBusy('password')} />
          </ModalActions>
        </Stack>
      </Modal>
    );
  }
  return (
    <Modal title="Protect Silent" width={560} onClose={onClose}>
      <Stack gap="m">
        <Text as="div" variant="body">Silent encrypts everything it keeps on this computer: accounts, keys and settings. Pick what unlocks it at every start. It cannot be changed later.</Text>
        <Stack gap="s">
          <SelectRow icon="usb" title="Signing Device" sub="Plug it in and unlock it at every start. The key is derived on the device and never stored." onClick={() => setView('device')} />
          <SelectRow icon="lock" title="Password" sub="Type it at every start. Forget it and the accounts and keys kept here are lost." onClick={() => setView('password')} />
        </Stack>
      </Stack>
    </Modal>
  );
}

/* Every later start with a device key (Qt: state::DeviceUnlock): names the device to
   plug and asks it for its key as soon as it is ready. `status`: 'plug' | 'locked' |
   'busy' | 'wrong' (another device's key) | 'failed' (the device refused). */
function DeviceUnlockModal({ alias = 'Coldcard', fp = '28645006', index = 1266802657, status = 'plug', onClose }) {
  if (status === 'busy') {
    return (
      <Modal title="Unlock Silent" width={560} onClose={onClose}>
        <ModalStatus spinner pad="var(--space-l) 0" title="Confirm on Your Device" subtitle={`Silent asks ${alias} for the key at ${STATE_PATH(index)}.`} />
      </Modal>
    );
  }
  const failed = status === 'wrong' || status === 'failed';
  return (
    <Modal title="Unlock Silent" width={560} onClose={onClose}>
      <Stack gap="m">
        <Text as="div" variant="body">Plug in {alias} ({fp}) and unlock it: Silent asks it for its key.</Text>
        <SelectRow icon="usb" title={alias} meta={fp} chevron={false}
          sub={status === 'locked' ? 'Unlock the device.' : failed ? 'Asking the device for its key.' : 'Plug it in and unlock it.'}
          status={<Pill id={status === 'locked' ? 'device_locked' : failed ? 'device_ready' : 'signer_disconnected'} />} />
        {status === 'wrong' ? <Notice tone="error">This device's key does not open Silent. Plug in the device Silent was protected with.</Notice> : null}
        {status === 'failed' ? <Notice tone="error">The device did not give the key: the user refused on the device.</Notice> : null}
        {failed ? <ModalActions><Btn id="try_again" /></ModalActions> : null}
      </Stack>
    </Modal>
  );
}

/* Every later start with a password key: the hot key password prompt, titled for the
   state, without Back (the header × quits). */
function PasswordUnlockModal({ error, initialBusy, onClose }) {
  return (
    <UnsealModal title="Unlock Silent" prompt="Enter the password that unlocks Silent." proceedId="unlock" back={false}
      busyTitle="Unlocking" busySubtitle="Opening the key with the password. This takes a few seconds." error={error} initialBusy={initialBusy} onCancel={onClose} />
  );
}

/* A state file silent writes found in clear: there is no migration, Silent stops
   (Qt: MessageModal, Tone::Error). */
function ClearStateModal({ path = '~/.silent/savings/config.json', onClose }) {
  return (
    <Modal title="Unencrypted Data Found" width={460} onClose={onClose}>
      <ModalStatus icon="alert" iconColor="var(--error)" pad="var(--space-l) 0"
        subtitle={`Silent found data it did not encrypt: ${path}. Silent now encrypts everything it keeps and does not convert older data. Move ~/.silent/ away or delete it, then start Silent again.`} />
    </Modal>
  );
}

Object.assign(window, { StateSetupModal, DeviceUnlockModal, PasswordUnlockModal, ClearStateModal, STATE_PATH });
