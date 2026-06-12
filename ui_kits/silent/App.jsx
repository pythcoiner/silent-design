/* Silent UI Kit — App shell: QTabWidget tabs (MainWindow.cpp) + AccountView.
   Structure is built from catalog layout primitives (Stack/Row/Text) so it maps
   1:1 to Qt layouts; Tab is the catalog component (Primitives.jsx). */

const SCREENS = {
  history: HistoryScreen, coins: CoinsScreen, send: SendScreen,
  receive: ReceiveScreen, settings: SettingsScreen, layout: LayoutDoc,
};

function AccountView({ wallet, screen, onScreen }) {
  // Send is kept mounted (hidden when inactive) so its draft state survives navigation.
  const isSend = screen === 'send';
  const OtherComp = !isSend ? (SCREENS[screen] || HistoryScreen) : null;
  return (
    <Stack grow style={{ minHeight: 0 }}>
      <Row grow align="stretch" style={{ minHeight: 0 }}>
        <Sidebar active={screen} onSelect={onScreen} />
        <Stack grow style={{ background: 'var(--bg)' }}>
          <Stack grow style={{ display: isSend ? 'flex' : 'none', minHeight: 0 }}>
            <SendScreen wallet={wallet} />
          </Stack>
          {OtherComp ? <OtherComp wallet={wallet} /> : null}
        </Stack>
      </Row>
      <StatusBar wallet={wallet} />
    </Stack>
  );
}

function App() {
  const [theme, setTheme] = React.useState('light');
  const [appW, setAppW] = React.useState('full');
  const [known, setKnown] = React.useState(KNOWN_WALLETS);
  const [openTabs, setOpenTabs] = React.useState(['savings']);
  const [active, setActive] = React.useState('savings');
  const [screens, setScreens] = React.useState({ savings: 'history' });

  React.useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  const ensureWallet = (name) => {
    // Build a wallet record; fall back to a blank-ish one for created/unknown wallets
    return WALLETS[name] || {
      name, network: 'Regtest', blindbit: 'http://localhost:8080',
      electrum: '127.0.0.1:50001',
      confirmed: '0.00000000 BTC', confirmedCount: '0 coins',
      unconfirmed: '0.00000000 BTC', unconfirmedCount: '0 coins',
      coins: [], history: [],
    };
  };

  const openWallet = (name) => {
    if (!openTabs.includes(name)) setOpenTabs([...openTabs, name]);
    if (!screens[name]) setScreens(s => ({ ...s, [name]: 'history' }));
    setActive(name);
  };
  const closeWallet = (name) => {
    const remaining = openTabs.filter(t => t !== name);
    setOpenTabs(remaining);
    if (active === name) setActive(remaining.length ? remaining[remaining.length - 1] : 'menu');
  };
  const createWallet = (name) => { setKnown(k => k.includes(name) ? k : [...k, name]); openWallet(name); };
  const deleteWallet = (name) => { setKnown(k => k.filter(n => n !== name)); closeWallet(name); };

  return (
    <Stack style={{
      height: '100vh',
      background: appW === 'full' ? 'var(--bg)' : (theme === 'light' ? '#c9c9c9' : '#070707'),
    }}>
      {/* Kit toolbar (not part of the product — dev chrome, not translated to Qt) */}
      <Row gap={10} style={{ flex: 'none', padding: '10px 16px',
        borderBottom: '1px solid var(--border)', background: theme === 'light' ? '#e8e8e8' : '#161616' }}>
        <SilentMark size={20} style={{ color: 'var(--accent)' }} />
        <Text variant="body" weight="demibold" style={{ color: theme === 'light' ? '#333' : '#bbb' }}>Silent — UI Kit</Text>
        <Spacer />
        {/* App width selector (kit-only) — slider/ruler with a pointer */}
        <Row gap={10} style={{ marginRight: 8 }}>
          <Text variant="caption" weight="demibold" style={{ color: theme === 'light' ? '#777' : '#888' }}>Width</Text>
          {/* Restricted so the window can't be sized below content-min + sidebar
              (760 + 200 = 960) — the content area never drops under its 760 min. */}
          <input type="range" min={(window.DASH_MIN_W || 760) + 200} max={1920} step={20} value={appW === 'full' ? 1920 : Number(appW)}
            onChange={e => setAppW(Number(e.target.value) >= 1920 ? 'full' : String(e.target.value))}
            style={{ width: 160, accentColor: 'var(--accent)', cursor: 'pointer' }} />
          <Text variant="mono" weight="demibold" style={{ fontSize: 11, fontVariantNumeric: 'tabular-nums',
            color: theme === 'light' ? '#555' : '#aaa', minWidth: 42, textAlign: 'right' }}>
            {appW === 'full' ? 'Full' : appW}
          </Text>
        </Row>
        <Row style={{ flex: 'none', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
          {['light', 'dark'].map(t => (
            <Button key={t} role={theme === t ? 'primary' : 'default'} onClick={() => setTheme(t)}
              style={{ borderRadius: 0, border: 'none', minHeight: 0, padding: '5px 12px' }}>
              {t[0].toUpperCase() + t.slice(1)}
            </Button>
          ))}
        </Row>
      </Row>

      {/* App window */}
      <Stack grow style={{
        width: '100%', maxWidth: appW === 'full' ? '100%' : appW + 'px', margin: '0 auto',
        minHeight: 0, background: 'var(--bg)', overflow: 'hidden',
        borderLeft: appW === 'full' ? 'none' : '1px solid var(--border)',
        borderRight: appW === 'full' ? 'none' : '1px solid var(--border)',
      }}>
        {/* Tab bar */}
        <Row align="flex-end" style={{ flex: 'none', padding: '8px 8px 0',
          background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
          {openTabs.map(name => (
            <Tab key={name} label={name} active={active === name} closable
              onClick={() => setActive(name)} onClose={() => closeWallet(name)} />
          ))}
          <Tab label="+" active={active === 'menu'} closable={false} onClick={() => setActive('menu')} />
        </Row>

        {/* Content */}
        <Row grow align="stretch" style={{ minHeight: 0, background: 'var(--bg)' }}>
          {active === 'menu' ? (
            <MenuTab wallets={known} openWallets={openTabs}
              onOpen={openWallet} onCreate={createWallet} onDelete={deleteWallet} />
          ) : (
            <AccountView wallet={ensureWallet(active)} screen={screens[active] || 'history'}
              onScreen={(s) => setScreens(prev => ({ ...prev, [active]: s }))} />
          )}
        </Row>
      </Stack>
    </Stack>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
