/* Silent UI Kit — Sidebar nav + bottom StatusBar (AccountWidget.cpp + StatusBar.cpp). */

const NAV_ITEMS = [
  { id: 'history',  label: 'History',  icon: 'history' },
  { id: 'coins',    label: 'Coins',    icon: 'coins' },
  { id: 'send',     label: 'Send',     icon: 'upload' },
  { id: 'receive',  label: 'Receive',  icon: 'download' },
];

function Sidebar({ active, onSelect }) {
  return (
    <Stack gap="s" style={{ width: 'var(--sidebar-w)', flex: 'none', background: 'var(--bg-secondary)',
      padding: 'var(--pad-xs)' }}>
      {NAV_ITEMS.map(it => (
        <Button key={it.id} role="menu" className={active === it.id ? 'is-active' : ''} onClick={() => onSelect(it.id)}>
          <Icon name={it.icon} size={20} />
          {it.label}
        </Button>
      ))}
      <Spacer />
      <Button role="menu" className={active === 'layout' ? 'is-active' : ''} onClick={() => onSelect('layout')}>
        <Icon name="layout" size={20} />
        Layout
      </Button>
      <Button role="menu" className={active === 'settings' ? 'is-active' : ''} onClick={() => onSelect('settings')}>
        <Icon name="settings" size={20} />
        Settings
      </Button>
    </Stack>
  );
}

function StatusBar({ wallet }) {
  const [blindbit, setBlindbit] = React.useState(true);
  const [electrum, setElectrum] = React.useState(false);

  const blindbitText = blindbit
    ? `Connected to blindbit-oracle at ${wallet.blindbit}`
    : 'Disconnected';
  const electrumText = electrum
    ? `Connected to electrum at ${wallet.electrum}`
    : 'Electrum disconnected';

  return (
    <Row style={{ height: 'var(--statusbar-h)', flex: 'none', borderTop: '1px solid var(--border)',
      background: 'var(--bg)', padding: '0 var(--pad-s)' }}>
      <Row grow gap="s" style={{ minWidth: 0 }}>
        <Toggle on={blindbit} status onClick={() => setBlindbit(b => !b)} />
        <Text variant="status" truncate>{blindbitText}</Text>
      </Row>
      <Divider vertical space="0" style={{ margin: '5px 0' }} />
      <Row grow gap="s" style={{ minWidth: 0, paddingLeft: 'var(--space-s)' }}>
        <Toggle on={electrum} status onClick={() => setElectrum(e => !e)} />
        <Text variant="status" truncate>{electrumText}</Text>
      </Row>
    </Row>
  );
}

Object.assign(window, { Sidebar, StatusBar, NAV_ITEMS });
