/* Silent UI Kit — Global Settings modal (issue #4; src/views/modals/AppSettings.cpp).
   One modal, title "Settings" once. Sections: General (theme, language), Plugin
   Manager (external plugins only), Extension Settings (module sections, only when
   at least one exists). Opening a section or confirming a plugin disable REPLACES
   the modal content, with a way back — never a modal on top of a modal.
   SettingsGear sits in the tab strip's fixed end slot (.s-tabstrip__end), so it
   never overlaps a tab. */

const GS_WIDTH = 1040;   /* issue #4: 1040 × 640 */
/* One body width whatever the rows hold: longer texts wrap in it.
   Qt: metric::SETTINGS_BODY_WIDTH. */
const GS_BODY_WIDTH = 666;

function SettingsGear({ onClick }) {
  return (
    <Tooltip label="Settings">
      <Btn id="settings_gear" onClick={onClick} />
    </Tooltip>
  );
}

/* PluginRow — one discovered plugin: name · description, id + version (mono),
   enable toggle. A plugin that failed to load uses the error row tone, with the
   reason, and has no toggle (there is nothing to switch). The toggle slot keeps its
   width when empty, so id/version lines up on every row. Once the plugin has asked
   for the accounts or the keys (an answer is kept), Access opens what it may use.
   Qt: QFrame row with HBox(Label stack, Label, Pill or Access, Toggle). */
function PluginRow({ plugin, busy, onToggle, onAccess }) {
  const failed = !!plugin.error;
  const hasAccess = !!(plugin.access && plugin.access.length);
  return (
    <SelectRow icon={failed ? 'circle_x' : 'puzzle'} tone={failed ? 'error' : undefined} title={plugin.name || plugin.id}
      sub={failed ? plugin.error : plugin.desc}
      meta={`${plugin.id}  v${plugin.version}`}
      status={busy ? <Pill id="plugin_unloading" /> : hasAccess ? <Btn id="plugin_access" onClick={() => onAccess && onAccess(plugin)} /> : null}
      trailingWidth="var(--toggle-w)" chevron={false}
      trailing={failed ? null : <Toggle on={plugin.enabled} disabled={busy} onClick={() => onToggle(plugin)} />} />
  );
}

function GeneralSection({ theme, themes, onTheme, language, onLanguage, langSaved, open = true, onFold }) {
  const mod = themes.find(t => t.name === theme && t.provider);
  return (
    <Stack>
      <SectionHeader label="General" open={open} onToggle={onFold} />
      {open ? <Row gap="xl" align="flex-start" wrap>
        <Stack gap="xs">
          <Field label="Theme:"><ComboBox value={theme} options={themes.map(t => t.name)} onChange={onTheme} width={160} /></Field>
          {mod ? <Text as="div" variant="caption">Provided by {mod.provider}.</Text> : null}
        </Stack>
        <Stack gap="xs">
          <Field label="Language:"><ComboBox value={language} options={LANGUAGES} onChange={onLanguage} width={160} /></Field>
          {langSaved ? <Text as="div" variant="caption" color="success">Language saved. Restart Silent to apply it everywhere.</Text> : null}
        </Stack>
      </Row> : null}
    </Stack>
  );
}

function PluginSection({ registry, plugins, scan, notice, busyId, onScan, onToggle, onAccess, open = true, onFold }) {
  const scanning = scan === 'scanning';
  return (
    <Stack>
      <SectionHeader label="Plugin Manager" count={registry && plugins.length ? plugins.length : null} open={open} onToggle={onFold}
        action={open ? <Btn id={scanning ? 'scanning_plugins' : 'scan_plugins'} disabled={scanning || !registry} onClick={onScan} /> : null} />
      {open ? <Stack gap="s">
        {!registry ? (
          <Notice tone="error" title="Plugin registry unavailable">
            Silent could not read the plugin folder <Text variant="mono" size="inherit">~/.silent/plugins/</Text>. Check that it exists and is readable, then reopen Settings.
          </Notice>
        ) : null}
        {notice ? <Notice tone={notice.tone} title={notice.title}>{notice.body}</Notice> : null}
        {scan && scan !== 'scanning' && scan.found ? (
          <Text as="div" variant="caption" color="success">{`${scan.found} new plugin${scan.found === 1 ? '' : 's'} found.`}</Text>
        ) : null}
        {registry && plugins.length ? plugins.map(p => (
          <PluginRow key={p.id} plugin={p} busy={busyId === p.id} onToggle={onToggle} onAccess={onAccess} />
        )) : registry && !scanning ? (
          <EmptyState icon="puzzle" title="No Plugin Found"
            subtitle="Put a plugin and its metadata file in ~/.silent/plugins/, then scan. Built-in modules are not listed here." />
        ) : null}
        {scanning && !plugins.length ? <ModalStatus spinner title="Scanning for plugins…" pad="var(--space-m) 0" /> : null}
      </Stack> : null}
    </Stack>
  );
}

function ExtensionSection({ sections, onOpen, open = true, onFold }) {
  if (!sections.length) return null;
  return (
    <Stack>
      <SectionHeader label="Extension Settings" count={sections.length} open={open} onToggle={onFold} />
      {open ? <Stack gap="s">
        {sections.map((s, i) => (
          <SelectRow key={s.id} icon={s.icon || 'settings'} title={s.title || `Section ${i + 1}`} sub={s.module ? `From ${s.module}.` : null}
            onClick={() => onOpen(s.id)} trailing={<Btn id="open" onClick={() => onOpen(s.id)} />} />
        ))}
      </Stack> : null}
    </Stack>
  );
}

/* The frame around a module's own settings widget: the module draws the content. */
function ExtensionFrame({ section }) {
  return (
    <Stack gap="s">
      <Text as="div" variant="body" color="secondary">These settings belong to {section.module}. Changes apply when you leave this page.</Text>
      <Card tone="inset" pad="m">
        <Stack align="center" justify="center" gap="xs" style={{ minHeight: 220 }}>
          <Icon name="puzzle" size={28} tone="muted" />
          <Text variant="caption" color="muted" align="center">{section.module}'s settings widget</Text>
        </Stack>
      </Card>
    </Stack>
  );
}

function DisablePluginConfirm({ plugin }) {
  return (
    <Stack gap="m">
      <Text as="div" variant="body">Disable “{plugin.name}” (<Text variant="mono">{plugin.id}  v{plugin.version}</Text>)? Silent stops all of its modules and unloads it.</Text>
      {plugin.accounts && plugin.accounts.length ? (
        <Notice tone="warning" title={`${plugin.accounts.length === 1 ? '1 open account closes' : plugin.accounts.length + ' open accounts close'}`}>
          {plugin.accounts.join(', ')} {plugin.accounts.length === 1 ? 'comes' : 'come'} from this plugin and will close. Enable the plugin again to reopen {plugin.accounts.length === 1 ? 'it' : 'them'}.
        </Notice>
      ) : <Notice tone="info">No open account uses this plugin.</Notice>}
      {plugin.themes && plugin.themes.length ? <Notice tone="info">Its themes ({plugin.themes.join(', ')}) are removed. If one is in use, Silent switches to Light.</Notice> : null}
    </Stack>
  );
}

/* What an external plugin may use (issue #35; src/views/modals/appsettings/AccessFlow.cpp):
   one row per library version answered (sha256, the first 16 hex), Accounts and Keys
   toggles that apply at once, and Forget, after which the plugin is asked again on
   its next use. An unasked grant shows off, named in the sub line. Same body width as the
   main view. */
const grantLabel = { account: 'Accounts', keys: 'Keys', state: 'Saved Data' };
function PluginAccessFlow({ plugin, onChange }) {
  const entries = plugin.access || [];
  const set = (hash, grant, allowed) => onChange(entries.map(e => (e.hash === hash ? { ...e, [grant]: allowed ? 'allowed' : 'denied' } : e)));
  const forget = (hash) => onChange(entries.filter(e => e.hash !== hash));
  return (
    <Stack gap="m" style={{ width: GS_BODY_WIDTH }}>
      <Text as="div" variant="body" color="secondary">What {plugin.name} may use, for each version of its library you answered. A change applies at once. Forget an answer and Silent asks again on the plugin's next use.</Text>
      {entries.length ? <Stack gap="s">
        {entries.map(e => {
          const unasked = ['account', 'keys', 'state'].filter(g => (e[g] || 'unasked') === 'unasked').map(g => grantLabel[g]);
          return (
            <SelectRow key={e.hash} icon="puzzle" title={`Library ${e.hash.slice(0, 8)}…`}
              sub={`${e.current ? 'The version loaded now.' : 'An earlier version.'}${unasked.length ? ` Not asked yet: ${unasked.join(', ')}.` : ''}`}
              chevron={false}
              trailing={
                <Row gap="0" align="center">
                  {['account', 'keys', 'state'].map(g => (
                    <React.Fragment key={g}>
                      <Text variant="caption">{grantLabel[g]}</Text><span style={{ width: 'var(--space-xs)' }} />
                      <Toggle on={e[g] === 'allowed'} onClick={() => set(e.hash, g, e[g] !== 'allowed')} />
                      <span style={{ width: 'var(--space-s)' }} />
                    </React.Fragment>
                  ))}
                  <Btn id="forget_access" onClick={() => forget(e.hash)} />
                </Row>
              } />
          );
        })}
      </Stack> : <Text as="div" variant="caption" color="muted">No answer kept: Silent asks on the plugin's next use.</Text>}
    </Stack>
  );
}

/* Asked on an external plugin's first use of the accounts or the keys, or when it asks
   through Host::requestAccess() (issue #35; src/views/modals/PluginAccessPrompt.cpp).
   Lists only the grants asked. Allow or Deny is kept for this library hash; the × answers
   nothing, so the plugin is asked again next time. */
function PluginAccessPrompt({ plugin, account = true, keys = false, state = false, onAnswer, onClose }) {
  return (
    <Modal title="Allow Plugin Access?" width={520} onClose={onClose}>
      <Stack gap="m">
        <Text as="div" variant="body">{plugin.name} ({plugin.id}  v{plugin.version}) asks to use:</Text>
        <Stack gap="s">
          {account ? <SelectRow icon="coins" title="Accounts" sub="The name, coins, balance, addresses and descriptor of every account." chevron={false} /> : null}
          {keys ? <SelectRow icon="key" title="Keys" sub="Your registered keys: signing requests, xpubs and address checks." chevron={false} /> : null}
          {state ? <SelectRow icon="folder" title="Saved Data" sub="Its own data, kept encrypted with Silent's. A new version of the plugin asks again." chevron={false} /> : null}
        </Stack>
        <Stack gap="xs">
          <Text as="div" variant="caption" color="muted">Library {(plugin.access && plugin.access[0] ? plugin.access[0].hash : '').slice(0, 16)}…</Text>
          <Text as="div" variant="caption" color="secondary">Plugins run inside Silent: allow only one you trust. The answer is kept for this version of the plugin, an update asks again. Change it in Settings, Plugin Manager, Access.</Text>
        </Stack>
      </Stack>
      <ModalActions>
        <Btn id="deny_access" onClick={() => onAnswer && onAnswer(false)} />
        <Btn id="allow_access" onClick={() => onAnswer && onAnswer(true)} />
      </ModalActions>
    </Modal>
  );
}

function GlobalSettingsModal({ theme: themeProp, onTheme, onClose, plugins: pluginsIn = PLUGINS, sections = EXTENSION_SECTIONS, initial = {} }) {
  const [themeLocal, setThemeLocal] = React.useState(initial.theme || themeProp || 'Light');
  const theme = themeProp != null && initial.theme == null ? themeProp : themeLocal;
  const [language, setLanguage] = React.useState(initial.language || 'English');
  const [langSaved, setLangSaved] = React.useState(!!initial.langSaved);
  const [plugins, setPlugins] = React.useState(pluginsIn);
  const [scan, setScan] = React.useState(initial.scan || null);           // null | 'scanning' | { found }
  const [notice, setNotice] = React.useState(initial.notice || null);
  const [busyId, setBusyId] = React.useState(initial.busyId || null);
  const [view, setView] = React.useState(initial.view || null);
  const [folds, setFolds] = React.useState({ general: true, plugins: true, extensions: true, ...(initial.folds || {}) });   // true = open
  const fold = (k) => setFolds(f => ({ ...f, [k]: !f[k] }));           // null | { section } | { disable }
  const registry = initial.registry !== false;

  const themes = [{ name: 'Light' }, { name: 'Dark' },
    ...plugins.filter(p => p.enabled && !p.error).flatMap(p => (p.themes || []).map(t => ({ name: t, provider: p.name })))];
  const pickTheme = (t) => { setThemeLocal(t); onTheme && onTheme(t); };
  const pickLanguage = (l) => { setLanguage(l); setLangSaved(l !== 'English' || langSaved); };
  const runScan = () => { setScan('scanning'); setNotice(null); setTimeout(() => setScan({ found: 0 }), 1200); };
  const toggle = (p) => {
    setNotice(null);
    if (!p.enabled) return setPlugins(ps => ps.map(x => (x.id === p.id ? { ...x, enabled: true, error: null } : x)));
    setView({ disable: p.id });
  };
  const confirmDisable = (p) => {
    setView(null); setBusyId(p.id);
    setTimeout(() => {
      setBusyId(null);
      if (p.refuseUnload) { setNotice({ tone: 'error', title: `Could not disable ${p.name}`, body: 'The plugin refused to unload. It stays enabled. Close its accounts, then try again.' }); return; }
      setPlugins(ps => ps.map(x => (x.id === p.id ? { ...x, enabled: false } : x)));
      if ((p.themes || []).includes(theme)) pickTheme('Light');
    }, 900);
  };

  const section = view && view.section ? sections.find(s => s.id === view.section) : null;
  const disabling = view && view.disable ? plugins.find(p => p.id === view.disable) : null;
  const accessing = view && view.access ? plugins.find(p => p.id === view.access) : null;
  const setAccess = (id, access) => setPlugins(ps => ps.map(x => (x.id === id ? { ...x, access } : x)));

  let title = 'Settings', body, actions;
  if (section) {
    title = section.title;
    body = <ExtensionFrame section={section} />;
    actions = <ModalActions onBack={() => setView(null)} backId="all_settings"><Btn id="done" onClick={() => setView(null)} /></ModalActions>;
  } else if (accessing) {
    title = `${accessing.name} Access`;
    body = <PluginAccessFlow plugin={accessing} onChange={(access) => setAccess(accessing.id, access)} />;
    actions = <ModalActions onBack={() => setView(null)} backId="all_settings"><Btn id="done" onClick={() => setView(null)} /></ModalActions>;
  } else if (disabling) {
    title = 'Disable Plugin';
    body = <DisablePluginConfirm plugin={disabling} />;
    actions = <ModalActions onBack={() => setView(null)}><Btn id="disable_plugin" onClick={() => confirmDisable(disabling)} /></ModalActions>;
  } else {
    body = (
      <Stack gap="s" style={{ width: GS_BODY_WIDTH }}>
        <GeneralSection theme={theme} themes={themes} onTheme={pickTheme} language={language} onLanguage={pickLanguage} langSaved={langSaved} open={folds.general} onFold={() => fold('general')} />
        <Divider space="0" />
        <PluginSection registry={registry} plugins={plugins} scan={scan} notice={notice} busyId={busyId} onScan={runScan} onToggle={toggle} onAccess={(p) => { setNotice(null); setView({ access: p.id }); }} open={folds.plugins} onFold={() => fold('plugins')} />
        {sections.length ? <Divider space="0" /> : null}
        <ExtensionSection sections={sections} onOpen={(id) => setView({ section: id })} open={folds.extensions} onFold={() => fold('extensions')} />
      </Stack>
    );
    actions = null;   /* the header × closes; a Close button would repeat it */
  }
  return <Modal title={title} width={GS_WIDTH} onClose={onClose}>{body}{actions}</Modal>;
}

Object.assign(window, { SettingsGear, PluginRow, GlobalSettingsModal, GeneralSection, PluginSection, ExtensionSection, ExtensionFrame, DisablePluginConfirm, PluginAccessFlow, PluginAccessPrompt, GS_WIDTH });
