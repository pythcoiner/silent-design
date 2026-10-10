/* Silent UI Kit — Global Settings modal (issue #4; src/views/modals/AppSettings.cpp).
   One modal, title "Settings" once. Sections: General (theme, language), Plugin
   Manager (external plugins only), Extension Settings (module sections, only when
   at least one exists). Opening a section or confirming a plugin disable REPLACES
   the modal content, with a way back — never a modal on top of a modal.
   SettingsGear sits in the tab strip's fixed end slot (.s-tabstrip__end), so it
   never overlaps a tab. */

const GS_WIDTH = 1040;   /* issue #4: 1040 × 640 */

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
   width when empty, so id/version lines up on every row.
   Qt: QFrame row with HBox(Label stack, Label, Pill, Toggle). */
function PluginRow({ plugin, busy, onToggle }) {
  const failed = !!plugin.error;
  return (
    <SelectRow icon={failed ? 'circle_x' : 'puzzle'} tone={failed ? 'error' : undefined} title={plugin.name || plugin.id}
      sub={failed ? plugin.error : plugin.desc}
      meta={`${plugin.id}  v${plugin.version}`}
      status={busy ? <Pill id="plugin_unloading" /> : null}
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

function PluginSection({ registry, plugins, scan, notice, busyId, onScan, onToggle, open = true, onFold }) {
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
          <PluginRow key={p.id} plugin={p} busy={busyId === p.id} onToggle={onToggle} />
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

  let title = 'Settings', body, actions;
  if (section) {
    title = section.title;
    body = <ExtensionFrame section={section} />;
    actions = <ModalActions onBack={() => setView(null)} backId="all_settings"><Btn id="done" onClick={() => setView(null)} /></ModalActions>;
  } else if (disabling) {
    title = 'Disable Plugin';
    body = <DisablePluginConfirm plugin={disabling} />;
    actions = <ModalActions onBack={() => setView(null)}><Btn id="disable_plugin" onClick={() => confirmDisable(disabling)} /></ModalActions>;
  } else {
    body = (
      <Stack gap="s">
        <GeneralSection theme={theme} themes={themes} onTheme={pickTheme} language={language} onLanguage={pickLanguage} langSaved={langSaved} open={folds.general} onFold={() => fold('general')} />
        <Divider space="0" />
        <PluginSection registry={registry} plugins={plugins} scan={scan} notice={notice} busyId={busyId} onScan={runScan} onToggle={toggle} open={folds.plugins} onFold={() => fold('plugins')} />
        {sections.length ? <Divider space="0" /> : null}
        <ExtensionSection sections={sections} onOpen={(id) => setView({ section: id })} open={folds.extensions} onFold={() => fold('extensions')} />
      </Stack>
    );
    actions = null;   /* the header × closes; a Close button would repeat it */
  }
  return <Modal title={title} width={GS_WIDTH} onClose={onClose}>{body}{actions}</Modal>;
}

Object.assign(window, { SettingsGear, PluginRow, GlobalSettingsModal, GeneralSection, PluginSection, ExtensionSection, ExtensionFrame, DisablePluginConfirm, GS_WIDTH });
