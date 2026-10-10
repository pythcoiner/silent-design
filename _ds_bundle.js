/* @ds-bundle: {"format":3,"namespace":"SilentDesignSystem_243e89","components":[],"sourceHashes":{"kit/harness.js":"5fb8c9053c6a","preview/catalog-data.js":"be598af0ef7e","preview/specimen-back.js":"3061a81bb3fc","preview/specimen-shell.js":"33523c9cd69a","ui_kits/silent/Address.jsx":"94ce717ec983","ui_kits/silent/App.jsx":"e41f322fef98","ui_kits/silent/Data.jsx":"144cdcbc357b","ui_kits/silent/Icons.jsx":"75bc767ae2cd","ui_kits/silent/Layout.jsx":"4c606fb69277","ui_kits/silent/LayoutDoc.jsx":"125392df58ba","ui_kits/silent/MenuTab.jsx":"35060562a956","ui_kits/silent/Modal.jsx":"0e1797ef9caa","ui_kits/silent/Primitives.jsx":"c9931b8a0780","ui_kits/silent/ScreensBasic.jsx":"c14c79a789ee","ui_kits/silent/Send.jsx":"968f754c74ae","ui_kits/silent/Settings.jsx":"82994452be44","ui_kits/silent/Sidebar.jsx":"a7568ec62d21","ui_kits/silent/TxFlow.jsx":"7c8b486da357","ui_kits/silent/Widgets.jsx":"c4613a187109"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SilentDesignSystem_243e89 = window.SilentDesignSystem_243e89 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// kit/harness.js
try { (() => {
/* Silent — gallery harness. Plain JS (loaded before the Babel specimen script).
   A panel page calls Gallery.render({...}) with React elements; this builds the
   page chrome (header + theme toggle) and mounts each specimen into a card. */
(function () {
  function el(tag, cls, txt) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function setTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode === 'dark' ? 'dark' : 'light');
    document.querySelectorAll('.gx-themebar button').forEach(b => b.classList.toggle('is-on', b.dataset.mode === mode));
  }
  function render(cfg) {
    const root = el('div', 'gx-wrap');
    const top = el('div', 'gx-top');
    const back = el('a', 'gx-back', '← Panels');
    back.href = 'index.html';
    top.appendChild(back);
    const themebar = el('div', 'gx-themebar');
    ['light', 'dark'].forEach(m => {
      const b = el('button', m === 'light' ? 'is-on' : '', m[0].toUpperCase() + m.slice(1));
      b.dataset.mode = m;
      b.onclick = () => setTheme(m);
      themebar.appendChild(b);
    });
    top.appendChild(themebar);
    root.appendChild(top);
    root.appendChild(el('div', 'gx-kicker', 'Silent · ' + (cfg.kicker || 'Panel components')));
    root.appendChild(el('div', 'gx-h1', cfg.title || ''));
    if (cfg.lede) root.appendChild(el('div', 'gx-lede', cfg.lede));
    const mounts = [];
    (cfg.groups || []).forEach(group => {
      const sec = el('div', 'gx-sec');
      sec.appendChild(el('div', 'gx-sec-title', group.name));
      const grid = el('div', 'gx-grid');
      (group.items || []).forEach(item => {
        const card = el('div', 'gx-card' + (item.span ? ' ' + item.span : ''));
        const cap = el('div', 'gx-cap');
        cap.appendChild(el('b', '', item.title || ''));
        if (item.tag) cap.appendChild(el('span', 'tag', item.tag));
        card.appendChild(cap);
        const body = el('div', 'gx-body' + (item.frame ? ' flush' : ''));
        if (item.frame) {
          const frame = el('div', 'gx-frame');
          frame.style.height = (item.height || 560) + 'px';
          body.appendChild(frame);
          mounts.push({
            node: frame,
            el: item.el
          });
        } else {
          mounts.push({
            node: body,
            el: item.el
          });
        }
        card.appendChild(body);
        grid.appendChild(card);
      });
      sec.appendChild(grid);
      root.appendChild(sec);
    });
    document.body.appendChild(root);

    // mount React elements once React is present
    mounts.forEach(m => {
      try {
        ReactDOM.createRoot(m.node).render(m.el);
      } catch (e) {
        console.error(e);
      }
    });
  }
  window.Gallery = {
    render,
    setTheme
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "kit/harness.js", error: String((e && e.message) || e) }); }

// preview/catalog-data.js
try { (() => {
/* Silent — catalog data. Single source of truth for the specimen gallery:
   the index lists one card per group; category.html renders one group's tiles.
   Each item: [file (without .html), label, span ('', 'span2', 'full'), fns[]]
   where `fns` are the component FUNCTION names that produce the specimen — the
   canonical way to refer to it (e.g. window.<NS>.Button). Token/brand cards
   have no producing function, so `fns` is empty. */
window.CATALOG_GROUPS = [['Type', 'Font scale, text roles & Bitcoin amounts', [['type-display', 'Display & headings', 'span2', ['Text']], ['type-body', 'Body & labels', '', ['Text']], ['type-mono', 'Monospace', '', ['Text']], ['components-typography', 'Text variants', 'span2', ['Text']], ['components-amount', 'Amount', '', ['Amount']]]], ['Layout', 'Flex primitives — map 1:1 to Qt layouts', [['components-layout', 'Stack · Row · Spacer · Divider', 'full', ['Stack', 'Row', 'Spacer', 'Divider']]]], ['Generic Components', 'Atomic, reusable building blocks', [['components-buttons', 'Buttons', 'full', ['Button']], ['components-inputs', 'Inputs & fields', 'full', ['Input', 'Display', 'TextArea']], ['components-combobox', 'ComboBox', '', ['ComboBox']], ['components-checkbox', 'Checkbox', '', ['Checkbox']], ['components-toggle', 'Toggle', '', ['Toggle']], ['components-validation', 'Validation', '', ['ValidationMark']], ['components-cards', 'Cards & surfaces', 'span2', ['Card']], ['components-badge', 'Badges', '', ['Badge']], ['components-select-row', 'Select row', '', ['SelectRow']], ['components-modal-status', 'Modal & status', 'span2', ['Modal', 'ModalStatus', 'Spinner']], ['components-stepper', 'Stepper & disclosure', '', ['Stepper', 'FoldSection', 'Tooltip']], ['components-form-rows', 'Form rows', 'span2', ['Field', 'PaymentRow', 'ValidatedInput', 'KeyValue']], ['components-table', 'Table', 'span2', ['Table']]]], ['Components', 'App-specific compositions', [['components-menu', 'Sidebar menu', '', ['Sidebar']], ['components-balance', 'Balance header', 'span2', ['BalanceHeader']]]], ['Colors', 'Palette & semantic roles, both themes', [['colors-accent', 'Accent', '', []], ['colors-semantic', 'Semantic', '', []], ['colors-text', 'Text', '', []], ['colors-light-neutrals', 'Light neutrals', 'full', []], ['colors-dark-neutrals', 'Dark neutrals', 'full', []]]], ['Spacing', 'Spacing scale, corner radii & layout metrics', [['spacing-scale', 'Spacing scale', 'span2', []], ['radii', 'Corner radii', '', []], ['layout-metrics', 'Layout metrics', '', []]]], ['Brand', 'Wordmark, lockups & iconography', [['brand-wordmark', 'Wordmark & lockups', 'span2', []], ['brand-iconography', 'Iconography', 'span2', []]]]];
window.CATALOG_SLUG = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
/* Unique component function names within a group, in first-seen order. */
window.CATALOG_FNS = items => {
  const out = [];
  for (const it of items) for (const fn of it[3] || []) if (!out.includes(fn)) out.push(fn);
  return out;
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "preview/catalog-data.js", error: String((e && e.message) || e) }); }

// preview/specimen-back.js
try { (() => {
/* Injected into specimen pages. When a specimen is opened FROM a category page
   (VIEW → carries ?g=<slug>), show a back link to that category. With no ?g=
   (e.g. rendered as a DS-tab thumbnail) it adds nothing, so thumbnails stay clean. */
(function () {
  var g = new URLSearchParams(location.search).get('g');
  if (!g) return;
  try {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('silent-ds-theme') || 'light');
  } catch (e) {}
  var label = g.replace(/-/g, ' ').replace(/\b\w/g, function (c) {
    return c.toUpperCase();
  });
  var a = document.createElement('a');
  a.href = 'category.html?g=' + encodeURIComponent(g);
  a.textContent = '← ' + label;
  a.style.cssText = 'position:fixed;top:12px;left:14px;z-index:9999;font:600 11px var(--font-mono),ui-monospace,monospace;' + 'letter-spacing:.1em;text-transform:uppercase;color:var(--accent);text-decoration:none;' + 'background:var(--surface);border:1px solid var(--border);border-radius:7px;padding:5px 10px;' + 'box-shadow:0 2px 8px rgba(0,0,0,0.08);';
  document.body.appendChild(a);
  document.body.style.paddingTop = (parseInt(getComputedStyle(document.body).paddingTop) || 0) + 44 + 'px';
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "preview/specimen-back.js", error: String((e && e.message) || e) }); }

// preview/specimen-shell.js
try { (() => {
/* Shared full-page shell for specimen pages. Loaded AFTER catalog-data.js.
   When a specimen is opened from the catalog (URL carries ?g=<category>), it
   wraps the bare demo in consistent chrome — header (back + theme toggle),
   eyebrow + title + function-name chips, and a titled panel around the demo.
   With no ?g (e.g. a DS-tab thumbnail) it only applies the saved theme and
   leaves the demo bare, so thumbnails stay clean. */
(function () {
  try {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('silent-ds-theme') || 'light');
  } catch (e) {}
  var g = new URLSearchParams(location.search).get('g');
  if (!g || !window.CATALOG_GROUPS) return;
  var file = location.pathname.split('/').pop().replace('.html', '');
  var label = file,
    cat = g.replace(/-/g, ' ').replace(/\b\w/g, function (c) {
      return c.toUpperCase();
    }),
    fns = [];
  for (var i = 0; i < window.CATALOG_GROUPS.length; i++) {
    var grp = window.CATALOG_GROUPS[i],
      items = grp[2];
    for (var j = 0; j < items.length; j++) {
      if (items[j][0] === file) {
        label = items[j][1];
        fns = items[j][3] || [];
        cat = grp[0];
      }
    }
  }

  // move the existing demo into a holder
  var demo = document.createElement('div');
  demo.className = 'sh-demo';
  while (document.body.firstChild) demo.appendChild(document.body.firstChild);
  var chips = fns.map(function (f) {
    return '<code>' + f + '</code>';
  }).join('');
  var wrap = document.createElement('div');
  wrap.className = 'sh-wrap';
  wrap.innerHTML = '<div class="sh-bar">' + '<a class="sh-pill" id="shBack"></a>' + '<button class="sh-pill sh-toggle" id="shToggle"><span class="sh-ic" id="shIcon"></span><span id="shLabel">Light</span></button>' + '</div>' + '<div class="sh-eyebrow">Silent · ' + cat + '</div>' + '<h1 class="sh-title"></h1>' + (chips ? '<div class="sh-fns">' + chips + '</div>' : '') + '<div class="sh-panel"><div class="sh-hd">Specimen</div><div class="sh-body"></div></div>';
  document.body.appendChild(wrap);
  wrap.querySelector('.sh-title').textContent = label;
  wrap.querySelector('.sh-body').appendChild(demo);
  var back = wrap.querySelector('#shBack');
  back.href = 'category.html?g=' + encodeURIComponent(g);
  back.textContent = '← ' + cat;
  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="15" height="15"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var r = document.documentElement,
    ic = wrap.querySelector('#shIcon'),
    lb = wrap.querySelector('#shLabel');
  function apply(t) {
    r.setAttribute('data-theme', t);
    try {
      localStorage.setItem('silent-ds-theme', t);
    } catch (e) {}
    ic.innerHTML = t === 'dark' ? MOON : SUN;
    lb.textContent = t === 'dark' ? 'Dark' : 'Light';
  }
  apply(r.getAttribute('data-theme') || 'light');
  wrap.querySelector('#shToggle').addEventListener('click', function () {
    apply(r.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "preview/specimen-shell.js", error: String((e && e.message) || e) }); }

// ui_kits/silent/Address.jsx
try { (() => {
/* Silent UI Kit — Address & QR catalog.
   The reusable surface for showing a cryptographic string: a framed QR tile,
   the QR itself, and the chunked-monospace address. Every QR / address in the
   app composes THESE — no view hand-rolls a white QR box or a chunking loop.

   Qt mapping:
     QRCard        -> QFrame (white bg, 1px border, fixed square)
     QRCode        -> QRCard + a QSvgWidget painting the QR
     ChunkedAddress-> QLabel (flow layout of 4-char mono groups)

   Loaded after Modal.jsx + Layout.jsx, before any view that shows an address. */

/* qrSvg — build a QR for `text` as an SVG string. Tries error-correction levels
   in order until the payload fits; returns '' if the lib is missing or no level
   fits. Shared by the static QRCode and the animated PSBT frames in Send. */
function qrSvg(text, {
  ecOrder = ['M', 'L'],
  cellSize = 2,
  margin = 0
} = {}) {
  if (!text || typeof window.qrcode === 'undefined') return '';
  for (const ec of ecOrder) {
    try {
      const qr = window.qrcode(0, ec);
      qr.addData(text);
      qr.make();
      return qr.createSvgTag({
        cellSize,
        margin,
        scalable: true
      });
    } catch (e) {/* payload too big for this level — try the next */}
  }
  return '';
}

/* QRCard — the white framed tile that holds a QR (or any square glyph).
   `bg`/`color` let the airgap scanner tune contrast; `onClick` makes it tappable. */
function QRCard({
  size = 132,
  pad = 12,
  bg = '#ffffff',
  color,
  radius = 8,
  onClick,
  title,
  style,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "s-qr",
    onClick: onClick,
    title: title,
    style: {
      flex: 'none',
      width: size,
      height: size,
      padding: pad,
      background: bg,
      color,
      border: '1px solid var(--border-light)',
      borderRadius: radius,
      boxSizing: 'border-box',
      cursor: onClick ? 'pointer' : 'default',
      ...style
    }
  }, children);
}

/* QRCode — a QR for `text`, framed by QRCard. `zoom` makes it click-to-enlarge
   into a Modal that also shows the chunked address. */
function QRCode({
  text,
  size = 132,
  zoom
}) {
  const [open, setOpen] = React.useState(false);
  const html = React.useMemo(() => qrSvg(text), [text]);
  if (!html) return null;
  const svg = /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%'
    },
    dangerouslySetInnerHTML: {
      __html: html
    }
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(QRCard, {
    size: size,
    onClick: zoom ? () => setOpen(true) : undefined,
    title: zoom ? 'Click to enlarge' : undefined
  }, svg), open ? /*#__PURE__*/React.createElement(Modal, {
    title: "QR Code",
    width: 680,
    onClose: () => setOpen(false)
  }, /*#__PURE__*/React.createElement(Stack, {
    align: "center",
    gap: "l"
  }, /*#__PURE__*/React.createElement(QRCard, {
    size: 560,
    pad: 20,
    radius: 12,
    style: {
      maxWidth: '100%'
    }
  }, svg), /*#__PURE__*/React.createElement(ChunkedAddress, {
    text: text
  }))) : null);
}

/* ChunkedAddress — an address/txid shown as alternating-dimmed 4-char mono
   groups; click to toggle to one unbroken string. Long silent-payment strings
   wrap to two centered rows. */
function ChunkedAddress({
  text
}) {
  const [chunked, setChunked] = React.useState(true);
  const lines = React.useMemo(() => {
    const chunks = text.match(/.{1,4}/g) || [];
    const rows = chunks.length > 14 ? 2 : 1; // long SP → 2 rows, others → 1
    const base = Math.floor(chunks.length / rows);
    const extra = chunks.length % rows; // first `extra` rows get +1
    const out = [];
    let i = 0;
    for (let r = 0; r < rows; r++) {
      const n = base + (r < extra ? 1 : 0);
      out.push(chunks.slice(i, i + n));
      i += n;
    }
    return out;
  }, [text]);
  let idx = 0; // running chunk index for alternating dim
  return /*#__PURE__*/React.createElement("div", {
    className: "t-mono",
    onClick: () => setChunked(c => !c),
    title: chunked ? 'Show as one string' : 'Show in chunks',
    style: {
      lineHeight: 1.75,
      textAlign: 'center',
      cursor: 'pointer',
      userSelect: 'none',
      wordBreak: chunked ? 'normal' : 'break-all'
    }
  }, chunked ? lines.map((row, r) => /*#__PURE__*/React.createElement("div", {
    key: r,
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.4em'
    }
  }, row.map(c => {
    const i = idx++;
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        color: i % 2 ? 'var(--text-muted)' : 'var(--text)'
      }
    }, c);
  }))) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text)'
    }
  }, text));
}
Object.assign(window, {
  qrSvg,
  QRCard,
  QRCode,
  ChunkedAddress
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/silent/Address.jsx", error: String((e && e.message) || e) }); }

// ui_kits/silent/App.jsx
try { (() => {
/* Silent UI Kit — App shell: QTabWidget tabs (MainWindow.cpp) + AccountView.
   Structure is built from catalog layout primitives (Stack/Row/Text) so it maps
   1:1 to Qt layouts; Tab is the catalog component (Primitives.jsx). */

const SCREENS = {
  history: HistoryScreen,
  coins: CoinsScreen,
  send: SendScreen,
  receive: ReceiveScreen,
  settings: SettingsScreen,
  layout: LayoutDoc
};
function AccountView({
  wallet,
  screen,
  onScreen
}) {
  // Send is kept mounted (hidden when inactive) so its draft state survives navigation.
  const isSend = screen === 'send';
  const OtherComp = !isSend ? SCREENS[screen] || HistoryScreen : null;
  return /*#__PURE__*/React.createElement(Stack, {
    grow: true,
    style: {
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(Row, {
    grow: true,
    align: "stretch",
    style: {
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    active: screen,
    onSelect: onScreen
  }), /*#__PURE__*/React.createElement(Stack, {
    grow: true,
    style: {
      background: 'var(--bg)'
    }
  }, /*#__PURE__*/React.createElement(Stack, {
    grow: true,
    style: {
      display: isSend ? 'flex' : 'none',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(SendScreen, {
    wallet: wallet
  })), OtherComp ? /*#__PURE__*/React.createElement(OtherComp, {
    wallet: wallet
  }) : null)), /*#__PURE__*/React.createElement(StatusBar, {
    wallet: wallet
  }));
}
function App() {
  const [theme, setTheme] = React.useState('light');
  const [appW, setAppW] = React.useState('full');
  const [known, setKnown] = React.useState(KNOWN_WALLETS);
  const [openTabs, setOpenTabs] = React.useState(['savings']);
  const [active, setActive] = React.useState('savings');
  const [screens, setScreens] = React.useState({
    savings: 'history'
  });
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const ensureWallet = name => {
    // Build a wallet record; fall back to a blank-ish one for created/unknown wallets
    return WALLETS[name] || {
      name,
      network: 'Regtest',
      blindbit: 'http://localhost:8080',
      electrum: '127.0.0.1:50001',
      confirmed: '0.00000000 BTC',
      confirmedCount: '0 coins',
      unconfirmed: '0.00000000 BTC',
      unconfirmedCount: '0 coins',
      coins: [],
      history: []
    };
  };
  const openWallet = name => {
    if (!openTabs.includes(name)) setOpenTabs([...openTabs, name]);
    if (!screens[name]) setScreens(s => ({
      ...s,
      [name]: 'history'
    }));
    setActive(name);
  };
  const closeWallet = name => {
    const remaining = openTabs.filter(t => t !== name);
    setOpenTabs(remaining);
    if (active === name) setActive(remaining.length ? remaining[remaining.length - 1] : 'menu');
  };
  const createWallet = name => {
    setKnown(k => k.includes(name) ? k : [...k, name]);
    openWallet(name);
  };
  const deleteWallet = name => {
    setKnown(k => k.filter(n => n !== name));
    closeWallet(name);
  };
  return /*#__PURE__*/React.createElement(Stack, {
    style: {
      height: '100vh',
      background: appW === 'full' ? 'var(--bg)' : theme === 'light' ? '#c9c9c9' : '#070707'
    }
  }, /*#__PURE__*/React.createElement(Row, {
    gap: 10,
    style: {
      flex: 'none',
      padding: '10px 16px',
      borderBottom: '1px solid var(--border)',
      background: theme === 'light' ? '#e8e8e8' : '#161616'
    }
  }, /*#__PURE__*/React.createElement(SilentMark, {
    size: 20,
    style: {
      color: 'var(--accent)'
    }
  }), /*#__PURE__*/React.createElement(Text, {
    variant: "body",
    weight: "demibold",
    style: {
      color: theme === 'light' ? '#333' : '#bbb'
    }
  }, "Silent \u2014 UI Kit"), /*#__PURE__*/React.createElement(Spacer, null), /*#__PURE__*/React.createElement(Row, {
    gap: 10,
    style: {
      marginRight: 8
    }
  }, /*#__PURE__*/React.createElement(Text, {
    variant: "caption",
    weight: "demibold",
    style: {
      color: theme === 'light' ? '#777' : '#888'
    }
  }, "Width"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: (window.DASH_MIN_W || 760) + 200,
    max: 1920,
    step: 20,
    value: appW === 'full' ? 1920 : Number(appW),
    onChange: e => setAppW(Number(e.target.value) >= 1920 ? 'full' : String(e.target.value)),
    style: {
      width: 160,
      accentColor: 'var(--accent)',
      cursor: 'pointer'
    }
  }), /*#__PURE__*/React.createElement(Text, {
    variant: "mono",
    weight: "demibold",
    style: {
      fontSize: 11,
      fontVariantNumeric: 'tabular-nums',
      color: theme === 'light' ? '#555' : '#aaa',
      minWidth: 42,
      textAlign: 'right'
    }
  }, appW === 'full' ? 'Full' : appW)), /*#__PURE__*/React.createElement(Row, {
    style: {
      flex: 'none',
      border: '1px solid var(--border)',
      borderRadius: 6,
      overflow: 'hidden'
    }
  }, ['light', 'dark'].map(t => /*#__PURE__*/React.createElement(Button, {
    key: t,
    role: theme === t ? 'primary' : 'default',
    onClick: () => setTheme(t),
    style: {
      borderRadius: 0,
      border: 'none',
      minHeight: 0,
      padding: '5px 12px'
    }
  }, t[0].toUpperCase() + t.slice(1))))), /*#__PURE__*/React.createElement(Stack, {
    grow: true,
    style: {
      width: '100%',
      maxWidth: appW === 'full' ? '100%' : appW + 'px',
      margin: '0 auto',
      minHeight: 0,
      background: 'var(--bg)',
      overflow: 'hidden',
      borderLeft: appW === 'full' ? 'none' : '1px solid var(--border)',
      borderRight: appW === 'full' ? 'none' : '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement(Row, {
    align: "flex-end",
    style: {
      flex: 'none',
      padding: '8px 8px 0',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)'
    }
  }, openTabs.map(name => /*#__PURE__*/React.createElement(Tab, {
    key: name,
    label: name,
    active: active === name,
    closable: true,
    onClick: () => setActive(name),
    onClose: () => closeWallet(name)
  })), /*#__PURE__*/React.createElement(Tab, {
    label: "+",
    active: active === 'menu',
    closable: false,
    onClick: () => setActive('menu')
  })), /*#__PURE__*/React.createElement(Row, {
    grow: true,
    align: "stretch",
    style: {
      minHeight: 0,
      background: 'var(--bg)'
    }
  }, active === 'menu' ? /*#__PURE__*/React.createElement(MenuTab, {
    wallets: known,
    openWallets: openTabs,
    onOpen: openWallet,
    onCreate: createWallet,
    onDelete: deleteWallet
  }) : /*#__PURE__*/React.createElement(AccountView, {
    wallet: ensureWallet(active),
    screen: screens[active] || 'history',
    onScreen: s => setScreens(prev => ({
      ...prev,
      [active]: s
    }))
  }))));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/silent/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/silent/Data.jsx
try { (() => {
/* Silent UI Kit — sample data (fake; mirrors RustCoin / payment-history shapes). */

const SP_ADDRESS = 'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv';
const WALLETS = {
  savings: {
    name: 'savings',
    network: 'Signet',
    blindbit: 'https://blindbit.silentpayments.dev',
    electrum: 'signet.electrum.silent:50001',
    confirmed: '0.04827310 BTC',
    confirmedCount: '4 coins',
    unconfirmed: '0.00051200 BTC',
    unconfirmedCount: '1 coin',
    coins: [{
      type: 'Segwit',
      height: '812043',
      outpoint: '3a9f2c…1d4e:0',
      label: 'Cold storage',
      value: '0.02000000'
    }, {
      type: 'Taproot',
      height: '811920',
      outpoint: '7b1e84…9c0f:1',
      label: 'Exchange withdrawal',
      value: '0.01500000'
    }, {
      type: 'Segwit',
      height: '809514',
      outpoint: 'c40d77…2a8b:0',
      label: '',
      value: '0.01000000'
    }, {
      type: 'Taproot',
      height: '812501',
      outpoint: 'e18a30…ff21:2',
      label: 'Payroll',
      value: '0.00327310'
    }, {
      type: 'Segwit',
      height: 'Unconfirmed',
      outpoint: '9d22b6…6e74:0',
      label: '',
      value: '0.00051200'
    }],
    history: [{
      dir: 'Incoming',
      txid: '3a9f2c…a1d4e0',
      height: '812043',
      amount: '0.02000000'
    }, {
      dir: 'Incoming',
      txid: '7b1e84…b9c0f1',
      height: '811920',
      amount: '0.01500000'
    }, {
      dir: 'Outgoing',
      txid: 'f55c19…0e7733',
      height: '810882',
      amount: '0.00840000'
    }, {
      dir: 'Incoming',
      txid: 'c40d77…c2a8b0',
      height: '809514',
      amount: '0.01000000'
    }, {
      dir: 'Incoming',
      txid: 'e18a30…dff212',
      height: '812501',
      amount: '0.00327310'
    }, {
      dir: 'Incoming',
      txid: '9d22b6…56e740',
      height: 'Unconfirmed',
      amount: '0.00051200'
    }]
  },
  'cold-storage': {
    name: 'cold-storage',
    network: 'Bitcoin',
    blindbit: 'https://blindbit.example.com',
    electrum: 'electrum.example.com:50002',
    confirmed: '0.50000000 BTC',
    confirmedCount: '1 coin',
    unconfirmed: '0.00000000 BTC',
    unconfirmedCount: '0 coins',
    coins: [{
      type: 'Taproot',
      height: '801200',
      outpoint: 'aa11bb…cc22:0',
      label: 'Deep cold',
      value: '0.50000000'
    }],
    history: [{
      dir: 'Incoming',
      txid: 'aa11bb…22cc00',
      height: '801200',
      amount: '0.50000000'
    }]
  }
};

// Wallets shown in the Menu tab list (some openable)
const KNOWN_WALLETS = ['savings', 'cold-storage', 'testing'];
const NETWORKS = ['Regtest', 'Signet', 'Testnet', 'Bitcoin'];
const MNEMONIC_WORDS = 'vault echo silent ridge amber cosmic pledge orbit timber walnut velvet jungle harbor signal modest crater nimble fabric'.split(' ');
function fakeMnemonic() {
  const w = [...MNEMONIC_WORDS];
  for (let i = w.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [w[i], w[j]] = [w[j], w[i]];
  }
  return w.slice(0, 12).join(' ');
}
Object.assign(window, {
  SP_ADDRESS,
  WALLETS,
  KNOWN_WALLETS,
  NETWORKS,
  fakeMnemonic
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/silent/Data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/silent/Icons.jsx
try { (() => {
/* Silent UI Kit — Icon registry (Lucide line icons, embedded inline).
   Stroke-only, width 2, currentColor — matches src/resources/icon + theme/Icon.cpp. */

const ICON_PATHS = {
  history: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
  coins: '<path d="M13.744 17.736a6 6 0 1 1-7.48-7.48"/><path d="M15 6h1v4"/><path d="m6.134 14.768.866-.5 2 3.464"/><circle cx="16" cy="8" r="6"/>',
  upload: '<path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>',
  download: '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
  settings: '<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>',
  trash: '<path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  minus: '<path d="M5 12h14"/>',
  folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  chevron_down: '<path d="m6 9 6 6 6-6"/>',
  chevron_right: '<path d="m9 18 6-6-6-6"/>',
  sd_card: '<path d="M4 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.4.6l4.5 4.5a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M11 7v3"/><path d="M14 7v3"/><path d="M17 7v3"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/>',
  qr: '<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>',
  usb: '<circle cx="10" cy="7" r="1"/><circle cx="4" cy="20" r="1"/><path d="M4.7 19.3 19 5"/><path d="m21 3-3 1 2 2Z"/><path d="M9.26 7.68 5 12l2 5"/><path d="m10 14 5 2 3.5-3.5"/><path d="m18 12 1-1 1 1-1 1Z"/>',
  bitcoin: '<path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/>',
  layout: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>'
};
function Icon({
  name,
  size = 24,
  stroke = 2,
  className = '',
  style = {}
}) {
  const inner = ICON_PATHS[name] || '';
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      display: 'block',
      flex: 'none',
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: inner
    }
  });
}
Object.assign(window, {
  Icon,
  ICON_PATHS,
  SilentMark
});
function SilentMark({
  size = 24,
  className = '',
  style = {}
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    fill: "none",
    style: {
      display: 'block',
      flex: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "24",
    r: "18",
    stroke: "currentColor",
    strokeWidth: "3.2",
    strokeLinecap: "round",
    strokeDasharray: "102 113.1",
    transform: "rotate(-33 24 24)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "24",
    r: "5.5",
    fill: "currentColor"
  }));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/silent/Icons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/silent/Layout.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Silent UI Kit — Layout & typography generics.
   The atomic building blocks every view composes. No view should hand-roll a
   flex container, a styled <span> of text, or a raw amount string — it goes
   through these so the structure translates 1:1 to Qt widgets/layouts.

   Qt mapping:
     Stack   -> QVBoxLayout            Text    -> theme::Label
     Row     -> QHBoxLayout            Amount  -> Label (mono) compositions
     Spacer  -> addStretch / spacing   Divider -> QFrame(HLine/VLine)
*/

/* Resolve a spacing prop: number -> px, token name -> var(--space-<t>), else passthrough. */
function spaceVal(v) {
  if (v == null || v === false) return undefined;
  if (v === true) return 'var(--space-m)';
  if (typeof v === 'number') return v + 'px';
  if (['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'].includes(v)) return `var(--space-${v})`;
  return v;
}

/* Stack — vertical flex (QVBoxLayout). gap/align/justify are the layout knobs. */
function Stack({
  gap,
  align,
  justify,
  grow,
  wrap,
  inline,
  className = '',
  style,
  children,
  ...rest
}) {
  const dom = {
    ...rest
  };
  ['gap', 'align', 'justify', 'grow', 'wrap', 'inline'].forEach(k => delete dom[k]);
  return /*#__PURE__*/React.createElement("div", _extends({
    className: className,
    style: {
      display: inline ? 'inline-flex' : 'flex',
      flexDirection: 'column',
      gap: spaceVal(gap),
      alignItems: align,
      justifyContent: justify,
      flex: grow ? 1 : undefined,
      flexWrap: wrap ? 'wrap' : undefined,
      minWidth: 0,
      boxSizing: 'border-box',
      ...style
    }
  }, dom), children);
}

/* Row — horizontal flex (QHBoxLayout). Defaults to vertically-centered items. */
function Row({
  gap,
  align = 'center',
  justify,
  grow,
  wrap,
  inline,
  className = '',
  style,
  children,
  ...rest
}) {
  const dom = {
    ...rest
  };
  ['gap', 'align', 'justify', 'grow', 'wrap', 'inline'].forEach(k => delete dom[k]);
  return /*#__PURE__*/React.createElement("div", _extends({
    className: className,
    style: {
      display: inline ? 'inline-flex' : 'flex',
      flexDirection: 'row',
      gap: spaceVal(gap),
      alignItems: align,
      justifyContent: justify,
      flex: grow ? 1 : undefined,
      flexWrap: wrap ? 'wrap' : undefined,
      minWidth: 0,
      boxSizing: 'border-box',
      ...style
    }
  }, dom), children);
}

/* Spacer — eats free space (addStretch) or holds a fixed gap. */
function Spacer({
  size
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      flex: size == null ? 1 : 'none',
      width: size != null ? spaceVal(size) : undefined,
      height: size != null ? spaceVal(size) : undefined
    }
  });
}

/* Divider — a hair rule. Horizontal by default; `vertical` for column splits.
   `space` sets the margin along the flow axis. */
function Divider({
  vertical = false,
  space = 'm',
  style
}) {
  const m = spaceVal(space);
  return vertical ? /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      alignSelf: 'stretch',
      width: 1,
      background: 'var(--border-light)',
      margin: `0 ${m}`,
      ...style
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--border-light)',
      margin: `${m} 0`,
      ...style
    }
  });
}

/* Text — the single typographic primitive (theme::Label). `variant` selects a
   FontPalette role (t-* class); the rest are targeted overrides so callers never
   reach for an inline font recipe. */
const TEXT_CLASS = {
  title: 't-title',
  heading: 't-heading',
  subheading: 't-subheading',
  section: 't-section',
  body: 't-body',
  secondary: 't-info-label',
  caption: 't-caption',
  status: 't-status',
  mono: 't-mono'
};
const TEXT_COLOR = {
  text: 'var(--text)',
  secondary: 'var(--text-secondary)',
  muted: 'var(--text-muted)',
  accent: 'var(--accent)',
  success: 'var(--success)',
  error: 'var(--error)',
  warning: 'var(--warning)',
  'on-accent': 'var(--on-accent)'
};
function Text(props) {
  const {
    as = 'span',
    variant = 'body',
    color,
    weight,
    mono,
    caps,
    align,
    nowrap,
    truncate,
    className = '',
    style,
    children,
    ...rest
  } = props;
  const As = as;
  const cls = `${TEXT_CLASS[variant] || 't-body'}${mono && variant !== 'mono' ? ' t-mono' : ''} ${className}`;
  const st = {
    color: color ? TEXT_COLOR[color] || color : undefined,
    fontWeight: weight === 'demibold' ? 600 : weight === 'normal' ? 400 : weight,
    textAlign: align,
    textTransform: caps ? 'uppercase' : undefined,
    letterSpacing: caps ? '0.08em' : undefined,
    whiteSpace: nowrap || truncate ? 'nowrap' : undefined,
    overflow: truncate ? 'hidden' : undefined,
    textOverflow: truncate ? 'ellipsis' : undefined,
    ...style
  };
  const dom = {
    ...rest
  };
  ['as', 'variant', 'color', 'weight', 'mono', 'caps', 'align', 'nowrap', 'truncate'].forEach(k => delete dom[k]);
  return /*#__PURE__*/React.createElement(As, _extends({
    className: cls.trim(),
    style: st
  }, dom), children);
}

/* Eyebrow — the uppercase mono section caption (was SectionLabel). */
function Eyebrow({
  size = 11,
  color = 'secondary',
  className = '',
  style,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(Text, _extends({
    as: "div",
    variant: "mono",
    color: color,
    className: className
  }, rest, {
    style: {
      fontSize: size,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      lineHeight: 1.4,
      ...style
    }
  }), children);
}

/* Amount — a Bitcoin amount: mono number + unit, with optional sign and coin count.
   size: sm | md | lg | hero. tone tints the number (e.g. 'muted' for change). */
const AMOUNT_SIZE = {
  sm: 13,
  md: 15,
  lg: 19,
  hero: 30
};
function Amount({
  value,
  unit = 'BTC',
  size = 'md',
  sign,
  tone,
  count,
  nowrap = true,
  style
}) {
  const px = AMOUNT_SIZE[size] || AMOUNT_SIZE.md;
  const col = tone ? TEXT_COLOR[tone] || tone : 'var(--text)';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 6,
      whiteSpace: nowrap ? 'nowrap' : undefined,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: `600 ${px}px var(--font-mono)`,
      letterSpacing: size === 'hero' ? '-0.015em' : 0,
      lineHeight: 1,
      color: col
    }
  }, sign || '', value), unit ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: `${Math.max(11, px * 0.5) | 0}px var(--font-mono)`,
      color: 'var(--text-muted)'
    }
  }, unit) : null, count != null ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: '12px var(--font-sans)',
      color: 'var(--text-secondary)',
      marginLeft: 2
    }
  }, count) : null);
}
Object.assign(window, {
  Stack,
  Row,
  Spacer,
  Divider,
  Text,
  Eyebrow,
  Amount,
  spaceVal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/silent/Layout.jsx", error: String((e && e.message) || e) }); }

// ui_kits/silent/LayoutDoc.jsx
try { (() => {
/* Silent UI Kit — Dashboard Layout reference (self-documenting).
   This screen renders inside the very layout it describes (ScreenWrap →
   DashboardLayout) and reads the live layout state from context, so the
   readouts, ruler and schematic resolve in real time. Drag the kit's "Width"
   control to watch them react.

   Composes catalog Card / Eyebrow / Text; the ruler + schematic are bespoke
   positioned diagrams (no catalog equivalent). */

function DocChip({
  label,
  value,
  accent
}) {
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: '12px 16px',
      minWidth: 150
    }
  }, /*#__PURE__*/React.createElement(Stack, {
    gap: 5
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    size: 10,
    color: "muted"
  }, label), /*#__PURE__*/React.createElement(Text, {
    variant: "mono",
    weight: "demibold",
    color: accent ? 'accent' : 'text',
    style: {
      fontSize: 20,
      letterSpacing: '-0.01em'
    }
  }, value)));
}
function RuleRow({
  token,
  value,
  desc
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '190px 96px 1fr',
      gap: 'var(--space-m)',
      alignItems: 'baseline',
      padding: '11px 0',
      borderTop: '1px solid var(--border-light)'
    }
  }, /*#__PURE__*/React.createElement(Text, {
    variant: "mono"
  }, token), /*#__PURE__*/React.createElement(Text, {
    variant: "mono",
    weight: "demibold",
    color: "accent"
  }, value), /*#__PURE__*/React.createElement(Text, {
    variant: "body",
    color: "secondary",
    style: {
      lineHeight: 1.55
    }
  }, desc));
}
function ColBox({
  label,
  sub,
  flex
}) {
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      flex,
      minWidth: 0,
      height: 96,
      padding: '0 8px'
    }
  }, /*#__PURE__*/React.createElement(Stack, {
    align: "center",
    justify: "center",
    gap: 3,
    style: {
      height: '100%',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Text, {
    variant: "mono",
    weight: "demibold",
    style: {
      fontSize: 11
    }
  }, label), sub ? /*#__PURE__*/React.createElement(Text, {
    variant: "caption",
    color: "muted",
    style: {
      fontSize: 10
    }
  }, sub) : null));
}
function LayoutDocBody() {
  const {
    DASH_MIN_W,
    DASH_COL_MAX,
    DASH_SPLIT_AT,
    DASH_MAX_W
  } = window;
  // Read live layout state from the dashboard layout itself — this view doesn't
  // measure its own box, it reports the container it's rendered inside.
  const {
    available,
    colWidth,
    wide
  } = React.useContext(window.LayoutInfo);
  const avail = Math.round(available || 0);
  const cw = Math.round(colWidth || 0);
  const twoColFits = available >= DASH_SPLIT_AT;

  // Ruler over the available width, with the key thresholds marked.
  const D0 = 600,
    D1 = 1820;
  const pct = v => (Math.min(Math.max(v, D0), D1) - D0) / (D1 - D0) * 100;
  const pos = v => `${pct(v)}%`;
  const markers = [[DASH_MIN_W, '760 · min'], [DASH_COL_MAX, '1140 · max'], [DASH_SPLIT_AT, '1569 · 2-col + gap']];

  // Schematic: the block grows with available and splits once two columns fit,
  // capped at the total max.
  const blockFrac = Math.min(Math.max((available - DASH_MIN_W) / (DASH_MAX_W - DASH_MIN_W), 0), 1);
  const blockPct = 52 + 48 * blockFrac;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Text, {
    as: "p",
    variant: "body",
    color: "secondary",
    style: {
      lineHeight: 1.7,
      maxWidth: 760,
      margin: '0 0 var(--space-l)'
    }
  }, "The layout is a function of its columns. Hand it", ' ', /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text)'
    }
  }, "one column"), " (History, Coins, Receive, Settings) or ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text)'
    }
  }, "two"), " (Send) \u2014 every panel renders through it. Each column is clamped between ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text)'
    }
  }, "760"), ' ', "and ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text)'
    }
  }, "1140"), " (1.5 \xD7 the min), so no column can sprawl wider than that; two columns sit side by side once both clear the min, otherwise they stack. This page is one column rendered by that function \u2014 resize the window to watch it react."), /*#__PURE__*/React.createElement(Row, {
    wrap: true,
    gap: "s",
    style: {
      marginBottom: 'var(--space-l)'
    }
  }, /*#__PURE__*/React.createElement(DocChip, {
    label: "Column width",
    value: `${cw}px`,
    accent: true
  }), /*#__PURE__*/React.createElement(DocChip, {
    label: "Range",
    value: "760\u20131140"
  }), /*#__PURE__*/React.createElement(DocChip, {
    label: "Two columns",
    value: twoColFits ? 'side by side' : 'stacked'
  }), /*#__PURE__*/React.createElement(DocChip, {
    label: "Top gap",
    value: wide ? '120px' : 'none'
  })), /*#__PURE__*/React.createElement(Eyebrow, {
    size: 10,
    color: "muted",
    style: {
      marginBottom: 18
    }
  }, "Available width: ", avail, "px"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 52,
      marginBottom: 'var(--space-l)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 20,
      height: 10,
      borderRadius: 5,
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-light)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: pos(DASH_MIN_W),
      right: `${100 - pct(DASH_COL_MAX)}%`,
      background: 'var(--border)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: pos(DASH_SPLIT_AT),
      right: 0,
      background: 'var(--accent)',
      opacity: 0.5
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 12,
      left: pos(available),
      transform: 'translateX(-50%)',
      width: 2,
      height: 26,
      background: 'var(--accent)',
      borderRadius: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: pos(available),
      transform: 'translateX(-50%)',
      font: '600 11px var(--font-mono)',
      color: 'var(--accent)',
      whiteSpace: 'nowrap'
    }
  }, avail, "px"), markers.map(([v, l]) => /*#__PURE__*/React.createElement("div", {
    key: v
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 16,
      left: pos(v),
      width: 1,
      height: 18,
      background: 'var(--text-muted)',
      opacity: 0.5
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 36,
      left: pos(v),
      transform: 'translateX(-50%)',
      font: '10px var(--font-mono)',
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap'
    }
  }, l)))), /*#__PURE__*/React.createElement(Eyebrow, {
    size: 10,
    color: "muted",
    style: {
      marginBottom: 10
    }
  }, "How a two-column screen lays out now"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      border: '1px dashed var(--border)',
      borderRadius: 8,
      background: 'var(--bg-secondary)',
      padding: '26px 14px 14px',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(Text, {
    variant: "mono",
    color: "muted",
    style: {
      position: 'absolute',
      top: 8,
      left: 12,
      fontSize: 10
    }
  }, "available area \xB7 block centred"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${blockPct}%`,
      minWidth: 220,
      transition: 'width 0.12s ease'
    }
  }, wide ? /*#__PURE__*/React.createElement("div", {
    style: {
      height: 26,
      borderRadius: 4,
      marginBottom: 10,
      background: 'color-mix(in srgb, var(--accent) 18%, transparent)',
      border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      font: '10px var(--font-mono)',
      color: 'var(--accent)'
    }
  }, "top gap \xB7 120px") : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, twoColFits ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ColBox, {
    label: "column",
    sub: "\u2264 1140",
    flex: "1 1 0"
  }), /*#__PURE__*/React.createElement(ColBox, {
    label: "column",
    sub: "\u2264 1140",
    flex: "1 1 0"
  })) : /*#__PURE__*/React.createElement(ColBox, {
    label: "columns stacked",
    sub: "each 760 \u2013 1140",
    flex: "1 1 0"
  }))))), /*#__PURE__*/React.createElement(Text, {
    as: "p",
    variant: "caption",
    color: "muted",
    style: {
      lineHeight: 1.6,
      margin: '0 0 var(--space-l)'
    }
  }, "A one-column screen is just the left half of this \u2014 a single column, 760\u20131140 wide, centred."), /*#__PURE__*/React.createElement(Eyebrow, {
    size: 10,
    color: "muted",
    style: {
      marginBottom: 4
    }
  }, "The rules"), /*#__PURE__*/React.createElement(RuleRow, {
    token: "min column width",
    value: "760px",
    desc: "A column never gets narrower than this."
  }), /*#__PURE__*/React.createElement(RuleRow, {
    token: "max column width",
    value: "1140px",
    desc: "1.5 \xD7 the min \u2014 a column can't be wider, whether it's the only column or one of two."
  }), /*#__PURE__*/React.createElement(RuleRow, {
    token: "max total width",
    value: "1600px",
    desc: "Two columns together never exceed this; beyond it the block centres with equal margins."
  }), /*#__PURE__*/React.createElement(RuleRow, {
    token: "two columns",
    value: "\u2265 1569px",
    desc: "Both columns need at least the min (2 \xD7 760 + 49 gutter); below this a two-column screen stacks."
  }), /*#__PURE__*/React.createElement(RuleRow, {
    token: "top gap",
    value: "120px",
    desc: "A fixed gap above the content once the layout is wide enough for two columns (\u22651569) \u2014 a stand-in for the old one-third-from-top bias (--space-xxl)."
  }), /*#__PURE__*/React.createElement(RuleRow, {
    token: "padding",
    value: "10px",
    desc: "Uniform inset around the content on every panel (--space-s)."
  }), /*#__PURE__*/React.createElement(RuleRow, {
    token: "window min",
    value: "960px",
    desc: "The window can't be sized below column-min + sidebar (760 + 200), so a column never drops under its 760 min and never has to scroll."
  }));
}
function LayoutDoc() {
  // The body is a child of ScreenWrap/DashboardLayout so it can read the live
  // layout state from context (the Provider lives inside DashboardLayout).
  return /*#__PURE__*/React.createElement(ScreenWrap, {
    title: "Layout"
  }, /*#__PURE__*/React.createElement(LayoutDocBody, null));
}
Object.assign(window, {
  LayoutDoc,
  LayoutDocBody,
  DocChip,
  RuleRow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/silent/LayoutDoc.jsx", error: String((e && e.message) || e) }); }

// ui_kits/silent/MenuTab.jsx
try { (() => {
/* Silent UI Kit — Menu tab (MenuTab.cpp) + CreateAccount / ConfirmDelete modals. */

function MenuTab({
  wallets,
  openWallets,
  onOpen,
  onCreate,
  onDelete
}) {
  const [creating, setCreating] = React.useState(false);
  const [deleting, setDeleting] = React.useState(null);
  return /*#__PURE__*/React.createElement(Stack, {
    align: "center",
    justify: "center",
    style: {
      flex: 1,
      overflow: 'auto',
      padding: 'var(--space-xl) var(--space-m)'
    }
  }, /*#__PURE__*/React.createElement(Text, {
    variant: "title",
    align: "center"
  }, "Silent \u2014 Silent Payments Wallet"), /*#__PURE__*/React.createElement(Stack, {
    gap: "s",
    style: {
      margin: 'var(--space-xl) 0 var(--space-m)'
    }
  }, wallets.map(name => {
    const open = openWallets.includes(name);
    return /*#__PURE__*/React.createElement(Row, {
      key: name,
      gap: "xs",
      style: {
        opacity: open ? 0.5 : 1
      }
    }, /*#__PURE__*/React.createElement(Button, {
      role: "tab-open",
      disabled: open,
      onClick: () => onOpen(name)
    }, name), /*#__PURE__*/React.createElement(Button, {
      role: "icon",
      title: "Delete wallet",
      onClick: () => setDeleting(name)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash",
      size: 20
    })));
  })), /*#__PURE__*/React.createElement(Button, {
    role: "tab-create",
    onClick: () => setCreating(true)
  }, "+ Create New Wallet"), creating ? /*#__PURE__*/React.createElement(CreateAccount, {
    existing: wallets,
    onCancel: () => setCreating(false),
    onCreate: name => {
      onCreate(name);
      setCreating(false);
    }
  }) : null, deleting ? /*#__PURE__*/React.createElement(ConfirmDelete, {
    name: deleting,
    onCancel: () => setDeleting(null),
    onConfirm: () => {
      onDelete(deleting);
      setDeleting(null);
    }
  }) : null);
}
function CreateAccount({
  existing,
  onCancel,
  onCreate
}) {
  const [name, setName] = React.useState('');
  const [mnemonic, setMnemonic] = React.useState('');
  const [network, setNetwork] = React.useState('Regtest');
  const [blindbit, setBlindbit] = React.useState('http://localhost:8080');
  const [electrum, setElectrum] = React.useState('127.0.0.1:50001');
  const nameOk = name.trim() !== '' && !name.includes(' ') && !existing.includes(name.trim());
  const mnemonicOk = mnemonic.trim().split(/\s+/).length >= 12;
  const canCreate = nameOk && mnemonicOk;
  const labelW = 110;
  return /*#__PURE__*/React.createElement(Modal, {
    title: "Create Account",
    width: 560,
    onClose: onCancel
  }, /*#__PURE__*/React.createElement(Stack, {
    gap: "s"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Account Name:",
    labelWidth: labelW
  }, /*#__PURE__*/React.createElement(Input, {
    width: 200,
    placeholder: "Enter account name",
    value: name,
    onChange: e => setName(e.target.value)
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Mnemonic:",
    labelWidth: labelW,
    align: "flex-start"
  }, /*#__PURE__*/React.createElement(TextArea, {
    mono: true,
    width: 320,
    height: 50,
    placeholder: "Mnemonic phrase",
    value: mnemonic,
    onChange: e => setMnemonic(e.target.value)
  })), /*#__PURE__*/React.createElement(Row, {
    justify: "center"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => setMnemonic(fakeMnemonic())
  }, "Generate")), /*#__PURE__*/React.createElement(Field, {
    label: "Network:",
    labelWidth: labelW
  }, /*#__PURE__*/React.createElement(ComboBox, {
    value: network,
    options: NETWORKS,
    onChange: setNetwork,
    width: 200
  })), /*#__PURE__*/React.createElement(Field, {
    label: "BlindBit URL:",
    labelWidth: labelW
  }, /*#__PURE__*/React.createElement(Input, {
    width: 260,
    value: blindbit,
    onChange: e => setBlindbit(e.target.value)
  }), /*#__PURE__*/React.createElement(Button, {
    style: {
      marginLeft: 'var(--space-xs)'
    }
  }, "Test")), /*#__PURE__*/React.createElement(Field, {
    label: "Electrum:",
    labelWidth: labelW
  }, /*#__PURE__*/React.createElement(Input, {
    width: 260,
    value: electrum,
    onChange: e => setElectrum(e.target.value)
  }), /*#__PURE__*/React.createElement(Button, {
    style: {
      marginLeft: 'var(--space-xs)'
    }
  }, "Test"))), /*#__PURE__*/React.createElement(Row, {
    justify: "center",
    gap: "m",
    style: {
      marginTop: 'var(--space-m)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: onCancel
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    role: "primary",
    disabled: !canCreate,
    onClick: () => onCreate(name.trim())
  }, "Create")));
}
function ConfirmDelete({
  name,
  onCancel,
  onConfirm
}) {
  return /*#__PURE__*/React.createElement(Modal, {
    title: "Delete Wallet",
    width: 420,
    onClose: onCancel
  }, /*#__PURE__*/React.createElement(Text, {
    as: "div",
    variant: "body",
    style: {
      marginBottom: 'var(--space-m)'
    }
  }, "Delete wallet \"", name, "\"? This cannot be undone."), /*#__PURE__*/React.createElement(Row, {
    justify: "center",
    gap: "m"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: onCancel
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    role: "destructive",
    onClick: onConfirm
  }, "Delete")));
}
Object.assign(window, {
  MenuTab,
  CreateAccount,
  ConfirmDelete
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/silent/MenuTab.jsx", error: String((e && e.message) || e) }); }

// ui_kits/silent/Modal.jsx
try { (() => {
/* Silent UI Kit — Modal shell (qontrol::Modal / Window dialog).
   Generic: <Modal title="…" onClose={fn} width={…}>content</Modal>
   Renders a header (title + [x] close) above the content. */

function Modal({
  title,
  width = 500,
  onClose,
  children,
  headerRight
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width,
      maxWidth: '92%',
      maxHeight: '90%',
      overflow: 'auto',
      boxSizing: 'border-box',
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-input)',
      padding: 'var(--space-m)'
    }
  }, /*#__PURE__*/React.createElement(Row, {
    justify: "space-between",
    align: "center",
    gap: "m",
    style: {
      marginBottom: 'var(--space-m)'
    }
  }, /*#__PURE__*/React.createElement(Text, {
    variant: "heading",
    nowrap: true
  }, title), /*#__PURE__*/React.createElement(Row, {
    gap: "s",
    style: {
      flex: 'none'
    }
  }, headerRight || null, onClose ? /*#__PURE__*/React.createElement(Button, {
    role: "inline-icon",
    title: "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 16
  })) : null)), children));
}
Object.assign(window, {
  Modal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/silent/Modal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/silent/Primitives.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Silent UI Kit — Primitives. Mirrors src/theme/*.cpp roles via components.css classes. */

/* Measure a container's width so layouts can react to real available space.
   ResizeObserver is unreliable in some embedded preview frames, so we poll the
   measured width on a rAF loop. Shared by the dashboard layout and Send. */
function useMeasure() {
  const ref = React.useRef(null);
  const [w, setW] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const tick = () => {
      if (ref.current) {
        const next = ref.current.getBoundingClientRect().width;
        setW(prev => Math.abs(prev - next) > 0.5 ? next : prev);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return [ref, w];
}
function Button({
  role = 'default',
  children,
  className = '',
  icon,
  iconSize = 20,
  ...rest
}) {
  const cls = {
    default: 's-btn',
    primary: 's-btn s-btn--primary',
    destructive: 's-btn s-btn--destructive',
    inline: 's-btn s-btn--inline',
    menu: 's-btn--menu',
    icon: 's-btn s-btn--icon',
    'inline-icon': 's-btn s-btn--inline-icon',
    'tab-open': 's-btn s-btn--tab-open',
    'tab-create': 's-btn s-btn--tab-create'
  }[role] || 's-btn';
  const dom = {
    ...rest
  };
  ['role', 'className', 'icon', 'iconSize', 'children'].forEach(k => delete dom[k]);
  return /*#__PURE__*/React.createElement("button", _extends({
    className: `${cls} ${className}`.trim()
  }, dom), icon ? /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: iconSize
  }) : null, children);
}
function Input({
  mono = false,
  width,
  className = '',
  ...rest
}) {
  const style = width ? {
    width
  } : {};
  const dom = {
    ...rest
  };
  delete dom.mono;
  delete dom.width; // defensive: preview instrumentation can leave these in rest
  return /*#__PURE__*/React.createElement("input", _extends({
    className: `s-input ${mono ? 's-input--mono' : ''} ${className}`,
    style: style
  }, dom));
}

/* TextArea — multiline input (Qt theme::TextEdit). */
function TextArea({
  mono = false,
  width,
  height = 50,
  className = '',
  style,
  ...rest
}) {
  const dom = {
    ...rest
  };
  delete dom.mono;
  delete dom.width;
  delete dom.height;
  return /*#__PURE__*/React.createElement("textarea", _extends({
    className: `s-input ${mono ? 's-input--mono' : ''} ${className}`,
    style: {
      width,
      height,
      resize: 'none',
      boxSizing: 'border-box',
      ...style
    }
  }, dom));
}
function Display({
  value,
  variant = 'default',
  width,
  className = ''
}) {
  const v = variant === 'mono' ? 's-display--mono' : variant === 'amount' ? 's-display--amount' : '';
  const style = width ? {
    width
  } : {};
  return /*#__PURE__*/React.createElement("span", {
    className: `s-display ${v} ${className}`,
    style: style
  }, value);
}
function Field({
  label,
  labelWidth = 'var(--form-label-w)',
  children,
  align = 'center'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: align,
      gap: 'var(--space-xs)',
      padding: '3px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "t-info-label",
    style: {
      width: labelWidth,
      flex: 'none',
      color: 'var(--text)'
    }
  }, label), children);
}
function Checkbox({
  checked,
  onChange,
  label,
  disabled
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: `s-check ${checked ? 'is-checked' : ''} ${disabled ? 'is-disabled' : ''}`,
    style: disabled ? {
      opacity: 0.55,
      cursor: 'default'
    } : undefined,
    onClick: () => {
      if (!disabled && onChange) onChange(!checked);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "box"
  }), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--size-caption)'
    }
  }, label) : null);
}
function Toggle({
  on,
  status = false,
  onClick
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: `s-toggle ${status ? 's-toggle--status' : ''} ${on ? 'is-on' : ''}`,
    onClick: onClick
  });
}

/* Indeterminate spinner — reused by every "working…" modal (signing, broadcasting). */
function Spinner({
  size = 114
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "s-spin",
    style: {
      display: 'inline-flex',
      color: 'var(--accent)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "refresh",
    size: size
  }));
}

/* Card — the panel/surface recipe. tone 'surface' (default) | 'inset'. */
function Card({
  tone = 'surface',
  className = '',
  style,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `s-card ${tone === 'inset' ? 's-card--inset' : ''} ${className}`,
    style: style
  }, rest), children);
}

/* Badge — small status pill. tone: success | warning | error | neutral. */
function Badge({
  tone = 'neutral',
  icon,
  iconSize = 14,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: `s-badge s-badge--${tone}`,
    style: style
  }, icon ? /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: iconSize
  }) : null, children);
}

/* SelectRow — full-width pick-list row (icon · title · meta · chevron). */
function SelectRow({
  icon,
  iconSize = 18,
  title,
  meta,
  onClick,
  chevron = true,
  style
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "s-select-row",
    onClick: onClick,
    style: style
  }, icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      display: 'inline-flex',
      color: 'var(--accent)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: iconSize
  })) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      font: '500 14px var(--font-sans)'
    }
  }, title), meta ? /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      font: '12px var(--font-mono)',
      color: 'var(--text-muted)'
    }
  }, meta) : null, chevron ? /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      display: 'inline-flex',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron_right",
    size: 16
  })) : null);
}

/* ModalStatus — centered status column for "working…" / placeholder modals:
   spinner OR icon, a title, an optional subtitle, plus any children (e.g. a
   Cancel button). Used by the signing, SD-card and broadcasting modals. */
function ModalStatus({
  spinner,
  icon,
  iconSize = 40,
  iconColor = 'var(--text-muted)',
  title,
  subtitle,
  children,
  pad = 'var(--space-l) 0'
}) {
  return /*#__PURE__*/React.createElement(Stack, {
    align: "center",
    gap: "m",
    style: {
      padding: pad
    }
  }, spinner ? /*#__PURE__*/React.createElement(Spinner, null) : icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: iconColor
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: iconSize
  })) : null, title ? /*#__PURE__*/React.createElement(Text, {
    as: "div",
    variant: "section",
    weight: "500",
    align: "center"
  }, title) : null, subtitle ? /*#__PURE__*/React.createElement(Text, {
    as: "div",
    variant: "body",
    color: "muted",
    align: "center",
    style: {
      maxWidth: 320,
      lineHeight: 1.6
    }
  }, subtitle) : null, children);
}

/* Legend — a colored swatch + label, for chart/diagram keys. */
function Legend({
  color,
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 2,
      flex: 'none',
      background: color
    }
  }), children);
}
function ComboBox({
  value,
  options,
  onChange,
  width = 200
}) {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "s-combo",
    style: {
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      paddingRight: 26
    },
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 9,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1,
      color: 'var(--text)',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron_down",
    size: 12
  }))), open ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      width: '100%',
      marginTop: 2,
      zIndex: 20,
      background: 'var(--input-bg)',
      border: '1px solid var(--input-border)',
      borderRadius: 'var(--radius-button)',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }
  }, options.map(opt => /*#__PURE__*/React.createElement("div", {
    key: opt,
    className: "combo-item",
    style: {
      padding: '6px 10px',
      fontSize: 'var(--size-body)',
      color: 'var(--text)',
      cursor: 'pointer',
      background: opt === value ? 'var(--surface-hover)' : 'transparent'
    },
    onMouseDown: () => {
      onChange(opt);
      setOpen(false);
    }
  }, opt))) : null);
}

/* ✓ / ✗ validation mark (Send.cpp setValidationIndicator) */
function ValidationMark({
  state
}) {
  if (state === 'valid') return /*#__PURE__*/React.createElement("span", {
    className: "s-valid",
    style: {
      width: 'var(--validation-mark-w)',
      textAlign: 'center'
    }
  }, "\u2713");
  if (state === 'invalid') return /*#__PURE__*/React.createElement("span", {
    className: "s-invalid",
    style: {
      width: 'var(--validation-mark-w)',
      textAlign: 'center'
    }
  }, "\u2717");
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: 'var(--validation-mark-w)',
      display: 'inline-block'
    }
  });
}

/* Balance summary header used atop Coins / History */
function btcAmount(s) {
  return parseFloat(String(s).split(' ')[0]) || 0;
}
function fmtBtc(n) {
  return n.toFixed(8);
}
function BalanceHeader({
  wallet
}) {
  const conf = btcAmount(wallet.confirmed);
  const unconf = btcAmount(wallet.unconfirmed);
  const unconfZero = unconf === 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 4px 18px',
      marginBottom: 'var(--space-m)',
      borderBottom: '1px solid var(--border-light)'
    }
  }, /*#__PURE__*/React.createElement(Row, {
    align: "flex-end",
    gap: "xl"
  }, /*#__PURE__*/React.createElement(Stack, {
    gap: 8
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    size: 10,
    color: "muted"
  }, "Balance"), /*#__PURE__*/React.createElement(Amount, {
    value: fmtBtc(conf),
    size: "hero",
    unit: "BTC",
    count: `(${wallet.confirmedCount})`
  })), /*#__PURE__*/React.createElement(Row, {
    gap: 8,
    style: {
      flex: 'none',
      paddingBottom: 3,
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      flex: 'none',
      background: unconfZero ? 'var(--text-muted)' : 'var(--warning)'
    }
  }), /*#__PURE__*/React.createElement(Eyebrow, {
    size: 10,
    color: "muted"
  }, "Unconfirmed"), /*#__PURE__*/React.createElement(Amount, {
    value: fmtBtc(unconf),
    size: "sm",
    unit: "BTC",
    sign: unconfZero ? '' : '+',
    tone: unconfZero ? 'muted' : undefined,
    count: `(${wallet.unconfirmedCount})`
  }))));
}

/* Tab — a QTabWidget tab: label + optional close affordance. The active tab
   takes the page bg; the menu/"+" tab passes closable={false}. Backed by the
   s-tab class so the chrome lives in CSS, not inline style. */
function Tab({
  label,
  active,
  closable,
  onClick,
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `s-tab ${active ? 'is-active' : ''}`,
    onClick: onClick
  }, /*#__PURE__*/React.createElement("span", null, label), closable ? /*#__PURE__*/React.createElement("span", {
    className: "s-tab__close",
    onClick: e => {
      e.stopPropagation();
      if (onClose) onClose();
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 12
  })) : null);
}
Object.assign(window, {
  Button,
  Input,
  TextArea,
  Display,
  Field,
  Checkbox,
  Toggle,
  Spinner,
  Card,
  Badge,
  SelectRow,
  ModalStatus,
  Legend,
  ComboBox,
  ValidationMark,
  BalanceHeader,
  Tab,
  useMeasure
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/silent/Primitives.jsx", error: String((e && e.message) || e) }); }

// ui_kits/silent/ScreensBasic.jsx
try { (() => {
/* Silent UI Kit — History, Coins, Receive screens. */

function copyToClipboard(text) {
  if (!text) return;
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}
function fallbackCopy(text) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  } catch (e) {/* ignore */}
}

/* ---------------- Dashboard layout ----------------
   The layout is a function of its columns. Give DashboardLayout one column
   (single-column screens: History, Coins, Receive, Settings) or two (Send) —
   every panel goes through here.

   • a column is clamped to [DASH_MIN_W, DASH_COL_MAX]; the max is 1.5 × the min,
     so no single column can sprawl wider than 1.5 × the minimum
   • the whole block is clamped to DASH_MAX_W — two columns together can't exceed
     that total, however wide the window gets
   • two columns sit side by side once both clear the min (DASH_SPLIT_AT);
     below that a two-column screen stacks with a horizontal rule between them
   • padding lives inside the border-box block, so the block is exactly
     DASH_MIN_W at its narrowest and fits a (min + sidebar) window with no scroll
   • at/above DASH_WIDE_AT the block gains a fixed top gap (DASH_TOP_GAP) */
const DASH_MIN_W = 760; // min column width
const DASH_COL_MAX = 1.5 * DASH_MIN_W; // 1140 — a single column can't exceed 1.5 × the min
const DASH_MAX_W = 1600; // max total content width (two columns together)
const DASH_GUTTER = 49; // between two columns: 1px rule + 2×--space-l
const DASH_SPLIT_AT = 2 * DASH_MIN_W + DASH_GUTTER; // 1569 — two columns fit side by side
const DASH_WIDE_AT = DASH_SPLIT_AT; // 1569 — top gap appears with the wide (two-column) layout
const DASH_TOP_GAP = 'var(--space-xxl)'; // 120px — ≈ the old one-third-from-top feel

/* Live layout state, exposed so a screen can document or adapt to it. */
const LayoutInfo = React.createContext({
  available: 0,
  columns: 1,
  sideBySide: false,
  colWidth: 0,
  wide: false
});
function DashboardLayout({
  title,
  primary,
  secondary = null
}) {
  const [ref, w] = useMeasure();
  const two = secondary != null && secondary !== false;
  const sideBySide = two && w >= DASH_SPLIT_AT;
  const wide = w >= DASH_WIDE_AT;
  // One column caps at DASH_COL_MAX; a side-by-side pair caps at DASH_MAX_W in
  // total. A stacked two-column screen behaves like a single column.
  const blockMin = sideBySide ? DASH_SPLIT_AT : DASH_MIN_W;
  const blockMax = sideBySide ? DASH_MAX_W : DASH_COL_MAX;
  const blockW = w > 0 ? Math.min(Math.max(w, blockMin), blockMax) : 0;
  const colWidth = Math.round(sideBySide ? (blockW - DASH_GUTTER) / 2 : blockW);
  const info = {
    available: w,
    columns: two ? 2 : 1,
    sideBySide,
    colWidth,
    wide
  };
  const render = c => typeof c === 'function' ? c(info) : c;
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      minWidth: 0,
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      boxSizing: 'border-box',
      minWidth: blockMin,
      maxWidth: blockMax,
      margin: '0 auto',
      marginTop: wide ? DASH_TOP_GAP : 0,
      padding: 'var(--space-s)'
    }
  }, /*#__PURE__*/React.createElement(LayoutInfo.Provider, {
    value: info
  }, title ? /*#__PURE__*/React.createElement(Text, {
    as: "div",
    variant: "title",
    style: {
      marginBottom: 'var(--space-m)'
    }
  }, title) : null, sideBySide ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'stretch',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 0',
      minWidth: 0,
      maxWidth: DASH_COL_MAX,
      display: 'flex',
      flexDirection: 'column'
    }
  }, render(primary)), /*#__PURE__*/React.createElement(Divider, {
    vertical: true,
    space: "l"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 0',
      minWidth: 0,
      maxWidth: DASH_COL_MAX,
      display: 'flex',
      flexDirection: 'column'
    }
  }, render(secondary))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%'
    }
  }, render(primary), two ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Divider, {
    space: "l"
  }), render(secondary)) : null))));
}

/* Single-column convenience wrapper — most panels render through this. */
function ScreenWrap({
  title,
  children
}) {
  return /*#__PURE__*/React.createElement(DashboardLayout, {
    title: title,
    primary: children
  });
}
function Ruler() {
  return /*#__PURE__*/React.createElement(Divider, {
    space: "m"
  });
}

/* ---------------- History ---------------- */
function HistoryScreen({
  wallet
}) {
  const columns = [{
    key: 'dir',
    header: 'Direction',
    width: 120
  }, {
    key: 'txid',
    header: 'TxID',
    width: 180,
    mono: true
  }, {
    key: 'height',
    header: 'Height',
    width: 110,
    muted: r => r.height === 'Unconfirmed'
  }, {
    header: 'Amount',
    grow: true,
    align: 'right',
    render: r => `${r.amount} BTC`
  }];
  return /*#__PURE__*/React.createElement(ScreenWrap, {
    title: "History"
  }, /*#__PURE__*/React.createElement(BalanceHeader, {
    wallet: wallet
  }), /*#__PURE__*/React.createElement(Table, {
    columns: columns,
    rows: wallet.history
  }));
}

/* ---------------- Coins ---------------- */
function CoinsScreen({
  wallet
}) {
  const [coins, setCoins] = React.useState(wallet.coins);
  const [editing, setEditing] = React.useState(null);
  const [draft, setDraft] = React.useState('');
  React.useEffect(() => {
    setCoins(wallet.coins);
    setEditing(null);
  }, [wallet]);
  const commit = i => {
    const c = [...coins];
    c[i] = {
      ...c[i],
      label: draft
    };
    setCoins(c);
    setEditing(null);
  };
  const columns = [{
    key: 'type',
    header: 'Type',
    width: 90
  }, {
    key: 'height',
    header: 'Height',
    width: 110,
    muted: r => r.height === 'Unconfirmed'
  }, {
    key: 'outpoint',
    header: 'OutPoint',
    width: 175,
    mono: true
  }, {
    header: 'Label',
    grow: true,
    muted: (r, i) => editing !== i && !r.label,
    cellStyle: (r, i) => editing === i ? {
      padding: '3px 6px'
    } : null,
    render: (r, i) => editing === i ? /*#__PURE__*/React.createElement(Input, {
      value: draft,
      autoFocus: true,
      style: {
        width: '100%',
        boxSizing: 'border-box'
      },
      onChange: e => setDraft(e.target.value),
      onBlur: () => commit(i),
      onKeyDown: e => {
        if (e.key === 'Enter') commit(i);
        if (e.key === 'Escape') setEditing(null);
      }
    }) : r.label || '—'
  }, {
    header: '',
    width: 34,
    cellStyle: () => ({
      padding: '0 4px'
    }),
    render: (r, i) => /*#__PURE__*/React.createElement(Button, {
      role: "inline-icon",
      onClick: () => {
        setEditing(i);
        setDraft(r.label);
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pencil",
      size: 15
    }))
  }, {
    header: 'Value',
    width: 150,
    align: 'right',
    render: r => `${r.value} BTC`
  }];
  return /*#__PURE__*/React.createElement(ScreenWrap, {
    title: "Coins"
  }, /*#__PURE__*/React.createElement(BalanceHeader, {
    wallet: wallet
  }), /*#__PURE__*/React.createElement(Table, {
    columns: columns,
    rows: coins
  }));
}

/* ---------------- Receive ---------------- */
function genAddr(network, kind) {
  const prefix = {
    Bitcoin: 'bc1',
    Signet: 'tb1',
    Testnet: 'tb1',
    Regtest: 'bcrt1'
  }[network] || 'bc1';
  const ver = kind === 'taproot' ? 'p' : 'q';
  const chars = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
  let s = '';
  for (let i = 0; i < 38; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return prefix + ver + s;
}
function LabelRow({
  label,
  onSetLabel
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(label);
  React.useEffect(() => {
    setDraft(label);
  }, [label]);
  const commit = () => {
    onSetLabel(draft.trim());
    setEditing(false);
  };
  if (editing) {
    return /*#__PURE__*/React.createElement(Row, {
      gap: "s"
    }, /*#__PURE__*/React.createElement(Input, {
      autoFocus: true,
      value: draft,
      placeholder: "Address label",
      onChange: e => setDraft(e.target.value),
      onKeyDown: e => {
        if (e.key === 'Enter') commit();
        if (e.key === 'Escape') setEditing(false);
      },
      style: {
        width: 220
      }
    }), /*#__PURE__*/React.createElement(Button, {
      role: "inline-icon",
      title: "Save",
      onClick: commit
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 15
    })));
  }
  if (!label) {
    return /*#__PURE__*/React.createElement(Button, {
      role: "inline",
      onClick: () => setEditing(true),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-xs)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 14
    }), " Add a label");
  }
  return /*#__PURE__*/React.createElement(Row, {
    gap: "s"
  }, /*#__PURE__*/React.createElement(Text, {
    variant: "body",
    weight: "demibold",
    nowrap: true,
    style: {
      fontSize: 14
    }
  }, label), /*#__PURE__*/React.createElement(Button, {
    role: "inline-icon",
    title: "Edit label",
    onClick: () => setEditing(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pencil",
    size: 14
  })));
}
function AddressRow({
  address,
  placeholder,
  generatable,
  onGenerate,
  onCopy,
  copied,
  prevCount = 0,
  onShowPrev,
  labelable,
  label = '',
  onSetLabel
}) {
  const [verify, setVerify] = React.useState(null); // null | {} (picking) | { device } (confirming)
  if (!address) {
    return /*#__PURE__*/React.createElement(Stack, {
      align: "center",
      gap: "m",
      style: {
        padding: 'var(--space-l) 0'
      }
    }, /*#__PURE__*/React.createElement(Text, {
      variant: "body",
      color: "muted"
    }, placeholder), generatable ? /*#__PURE__*/React.createElement(Button, {
      onClick: onGenerate
    }, "Generate") : null);
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Stack, {
    align: "center",
    gap: "l"
  }, /*#__PURE__*/React.createElement(QRCode, {
    text: address,
    size: 256,
    zoom: true
  }), labelable ? /*#__PURE__*/React.createElement(LabelRow, {
    label: label,
    onSetLabel: onSetLabel
  }) : null, /*#__PURE__*/React.createElement(Row, {
    justify: "center",
    gap: "m",
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(Tooltip, {
    label: "Verify on signing device"
  }, /*#__PURE__*/React.createElement(Button, {
    role: "icon",
    onClick: () => setVerify({}),
    style: {
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "usb",
    size: 20
  }))), /*#__PURE__*/React.createElement(ChunkedAddress, {
    text: address
  }), /*#__PURE__*/React.createElement(Button, {
    role: "icon",
    title: "Copy address",
    onClick: onCopy,
    style: {
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: copied ? 'check' : 'copy',
    size: 20
  }))), generatable ? /*#__PURE__*/React.createElement(Row, {
    gap: "l"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: onGenerate,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-xs)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "refresh",
    size: 15
  }), " Generate new"), prevCount > 0 ? /*#__PURE__*/React.createElement(Button, {
    role: "inline",
    onClick: onShowPrev
  }, "Addr. awaiting payment (", prevCount, ")") : null) : null), verify && !verify.device ? /*#__PURE__*/React.createElement(SelectSigner, {
    title: "Verify on device",
    devices: (window.SIGNER_DEVICES || []).filter(d => d.kind !== 'sd'),
    onCancel: () => setVerify(null),
    onPick: d => setVerify({
      device: d
    })
  }) : null, verify && verify.device ? /*#__PURE__*/React.createElement(VerifyAddress, {
    device: verify.device,
    address: address,
    onCancel: () => setVerify(null)
  }) : null);
}

/* Verify an address on a hardware signer — confirm-on-device step, mirrors
   Send.jsx's UsbConfirm but for address verification rather than signing.
   USB devices confirm on-screen; QR airgap devices scan the address QR. */
function VerifyAddress({
  device,
  address,
  onCancel
}) {
  const isQr = device.kind === 'qr';
  return /*#__PURE__*/React.createElement(Modal, {
    title: device.name,
    width: 460,
    onClose: onCancel
  }, /*#__PURE__*/React.createElement(ModalStatus, {
    spinner: !isQr,
    title: isQr ? 'Scan the address on your device…' : 'Confirm the address on your device…',
    subtitle: isQr ? `Scan this QR with ${device.name} and check the address it shows matches before sharing it.` : `Check that the address shown on ${device.name} matches the one below before sharing it.`,
    pad: "var(--space-l) 0 var(--space-m)"
  }, isQr ? /*#__PURE__*/React.createElement(QRCode, {
    text: address,
    size: 208,
    zoom: true
  }) : null, /*#__PURE__*/React.createElement(Card, {
    tone: "inset",
    style: {
      padding: 'var(--space-m)',
      width: '100%',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement(ChunkedAddress, {
    text: address
  })), /*#__PURE__*/React.createElement(Button, {
    onClick: onCancel
  }, "Cancel")));
}
function PrevAddressesModal({
  title,
  list,
  onClose,
  onSetLabel
}) {
  const [copied, setCopied] = React.useState(-1);
  const [qr, setQr] = React.useState(-1);
  const [verify, setVerify] = React.useState(null); // null | { i } (picking signer) | { i, device } (confirming)
  const copy = (text, i) => {
    copyToClipboard(text);
    setCopied(i);
    setTimeout(() => setCopied(-1), 1400);
  };
  const verifyAddr = verify ? (list[verify.i] || {}).addr || list[verify.i] || '' : '';
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Modal, {
    title: title,
    width: 620,
    onClose: onClose
  }, /*#__PURE__*/React.createElement(Stack, null, /*#__PURE__*/React.createElement(Row, {
    gap: "m",
    style: {
      paddingBottom: 'var(--space-xs)'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    color: "muted",
    size: 10,
    style: {
      width: 60,
      flex: 'none',
      letterSpacing: '0.06em'
    }
  }, "Index"), /*#__PURE__*/React.createElement(Spacer, null)), list.map((item, i) => {
    const addr = item.addr || item;
    const label = item.label || '';
    const index = list.length - 1 - i; // BIP-style derivation index (newest highest)
    const showQr = qr === i;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        borderTop: '1px solid var(--border-light)',
        padding: 'var(--space-s) 0'
      }
    }, /*#__PURE__*/React.createElement(Row, {
      gap: "m"
    }, /*#__PURE__*/React.createElement(IndexPill, {
      index: index,
      active: showQr,
      onClick: () => setQr(showQr ? -1 : i)
    }), /*#__PURE__*/React.createElement(Tooltip, {
      label: "Verify on signing device"
    }, /*#__PURE__*/React.createElement(Button, {
      role: "inline-icon",
      onClick: () => setVerify({
        i
      }),
      style: {
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "usb",
      size: 15
    }))), /*#__PURE__*/React.createElement(Stack, {
      grow: true,
      style: {
        minWidth: 0
      }
    }, label ? /*#__PURE__*/React.createElement(Text, {
      variant: "body",
      color: "secondary",
      weight: "demibold",
      style: {
        fontSize: 12,
        marginBottom: 3
      }
    }, label) : null, /*#__PURE__*/React.createElement(ChunkedAddress, {
      text: addr
    })), /*#__PURE__*/React.createElement(Button, {
      role: "inline-icon",
      title: "Copy",
      onClick: () => copy(addr, i),
      style: {
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: copied === i ? 'check' : 'copy',
      size: 15
    }))), showQr ? /*#__PURE__*/React.createElement(Stack, {
      align: "center",
      gap: "m",
      style: {
        paddingTop: 'var(--space-m)'
      }
    }, /*#__PURE__*/React.createElement(QRCode, {
      text: addr,
      size: 256,
      zoom: true
    }), onSetLabel ? /*#__PURE__*/React.createElement(LabelRow, {
      label: label,
      onSetLabel: l => onSetLabel(i, l)
    }) : null) : null);
  }))), verify && !verify.device ? /*#__PURE__*/React.createElement(SelectSigner, {
    title: "Verify on device",
    devices: (window.SIGNER_DEVICES || []).filter(d => d.kind !== 'sd'),
    onCancel: () => setVerify(null),
    onPick: d => setVerify(v => ({
      i: v.i,
      device: d
    }))
  }) : null, verify && verify.device ? /*#__PURE__*/React.createElement(VerifyAddress, {
    device: verify.device,
    address: verifyAddr,
    onCancel: () => setVerify(null)
  }) : null);
}
function ReceiveScreen({
  wallet
}) {
  const [segwit, setSegwit] = React.useState([]); // newest first, items: { addr, label }
  const [taproot, setTaproot] = React.useState([]);
  const [copied, setCopied] = React.useState('');
  const [open, setOpen] = React.useState('sp');
  const [modal, setModal] = React.useState(null); // 'sw' | 'tr'
  React.useEffect(() => {
    setSegwit([]);
    setTaproot([]);
    setCopied('');
    setOpen('sp');
    setModal(null);
  }, [wallet]);
  const toggle = id => setOpen(cur => cur === id ? '' : id);
  const copy = (text, key) => {
    copyToClipboard(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 1400);
  };
  const setLabel = setList => label => setList(l => l.map((it, i) => i === 0 ? {
    ...it,
    label
  } : it));
  const setLabelAt = setList => (i, label) => setList(l => l.map((it, idx) => idx === i ? {
    ...it,
    label
  } : it));
  return /*#__PURE__*/React.createElement(ScreenWrap, {
    title: "Receive"
  }, /*#__PURE__*/React.createElement(Stack, null, /*#__PURE__*/React.createElement(FoldSection, {
    id: "sp",
    label: "Silent Payment Address",
    open: open === 'sp',
    onToggle: toggle
  }, /*#__PURE__*/React.createElement(AddressRow, {
    address: SP_ADDRESS,
    onCopy: () => copy(SP_ADDRESS, 'sp'),
    copied: copied === 'sp'
  })), /*#__PURE__*/React.createElement(Ruler, null), /*#__PURE__*/React.createElement(FoldSection, {
    id: "sw",
    label: "Segwit Address",
    open: open === 'sw',
    onToggle: toggle
  }, /*#__PURE__*/React.createElement(AddressRow, {
    address: (segwit[0] || {}).addr || '',
    placeholder: "Not generated yet \u2014 click Generate",
    generatable: true,
    label: (segwit[0] || {}).label || '',
    onSetLabel: setLabel(setSegwit),
    labelable: true,
    prevCount: Math.max(0, segwit.length - 1),
    onShowPrev: () => setModal('sw'),
    onGenerate: () => setSegwit(l => [{
      addr: genAddr(wallet.network, 'segwit'),
      label: ''
    }, ...l]),
    onCopy: () => copy((segwit[0] || {}).addr, 'sw'),
    copied: copied === 'sw'
  })), /*#__PURE__*/React.createElement(Ruler, null), /*#__PURE__*/React.createElement(FoldSection, {
    id: "tr",
    label: "Taproot Address",
    open: open === 'tr',
    onToggle: toggle
  }, /*#__PURE__*/React.createElement(AddressRow, {
    address: (taproot[0] || {}).addr || '',
    placeholder: "Not generated yet \u2014 click Generate",
    generatable: true,
    label: (taproot[0] || {}).label || '',
    onSetLabel: setLabel(setTaproot),
    labelable: true,
    prevCount: Math.max(0, taproot.length - 1),
    onShowPrev: () => setModal('tr'),
    onGenerate: () => setTaproot(l => [{
      addr: genAddr(wallet.network, 'taproot'),
      label: ''
    }, ...l]),
    onCopy: () => copy((taproot[0] || {}).addr, 'tr'),
    copied: copied === 'tr'
  }))), modal === 'sw' ? /*#__PURE__*/React.createElement(PrevAddressesModal, {
    title: "Segwit Addresses",
    list: segwit,
    onSetLabel: setLabelAt(setSegwit),
    onClose: () => setModal(null)
  }) : null, modal === 'tr' ? /*#__PURE__*/React.createElement(PrevAddressesModal, {
    title: "Taproot Addresses",
    list: taproot,
    onSetLabel: setLabelAt(setTaproot),
    onClose: () => setModal(null)
  }) : null);
}
Object.assign(window, {
  HistoryScreen,
  CoinsScreen,
  ReceiveScreen,
  ScreenWrap,
  DashboardLayout,
  Ruler,
  AddressRow,
  genAddr,
  DASH_MIN_W,
  DASH_COL_MAX,
  DASH_MAX_W,
  DASH_GUTTER,
  DASH_SPLIT_AT,
  DASH_WIDE_AT,
  DASH_TOP_GAP,
  LayoutInfo
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/silent/ScreensBasic.jsx", error: String((e && e.message) || e) }); }

// ui_kits/silent/Send.jsx
try { (() => {
/* Silent UI Kit — Send screen (Send.cpp + signer/PSBT/broadcast modals).
   Two-pane layout: payments + coin selection on the left, a persistent
   transaction summary / send rail on the right (with a tx-shape diagram). */

function looksLikeAddress(s) {
  return /^(sp1|bc1|tb1|bcrt1)[a-z0-9]{6,}$/i.test(s.trim());
}
function looksLikeAmount(s) {
  const v = parseFloat(s);
  return !isNaN(v) && v > 0;
}

/* Mock spot price for the BTC <-> USD field. In the app this comes from the
   price oracle; the two inputs convert reciprocally on edit. */
const USD_RATE = 68000;
const btcToUsd = b => looksLikeAmount(b) ? (parseFloat(b) * USD_RATE).toFixed(2) : '';
const usdToBtc = u => looksLikeAmount(u) ? (parseFloat(u) / USD_RATE).toFixed(8) : '';
function RecipientCard({
  out,
  idx,
  deletable,
  canMax,
  onChange,
  onDelete
}) {
  const addrState = out.address === '' ? 'none' : looksLikeAddress(out.address) ? 'valid' : 'invalid';
  const amtState = out.max ? 'none' : out.amount === '' ? 'none' : looksLikeAmount(out.amount) ? 'valid' : 'invalid';
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      position: 'relative'
    }
  }, deletable ? /*#__PURE__*/React.createElement(Button, {
    role: "inline-icon",
    onClick: onDelete,
    title: "Remove payment",
    style: {
      position: 'absolute',
      top: 8,
      left: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 16
  })) : null, /*#__PURE__*/React.createElement(PaymentRow, {
    label: "Address"
  }, /*#__PURE__*/React.createElement(ValidatedInput, {
    mono: true,
    state: addrState,
    placeholder: "sp1q\u2026 / bc1q\u2026",
    value: out.address,
    onChange: e => onChange({
      ...out,
      address: e.target.value
    })
  })), /*#__PURE__*/React.createElement(PaymentRow, {
    label: "Description"
  }, /*#__PURE__*/React.createElement(ValidatedInput, {
    state: "none",
    placeholder: "Payment label",
    value: out.label,
    onChange: e => onChange({
      ...out,
      label: e.target.value
    })
  })), /*#__PURE__*/React.createElement(PaymentRow, {
    label: "Amount (BTC)"
  }, /*#__PURE__*/React.createElement(Row, {
    gap: "m"
  }, /*#__PURE__*/React.createElement(ValidatedInput, {
    mono: true,
    state: amtState,
    placeholder: "0.001 (in BTC)",
    disabled: out.max,
    value: out.max ? 'MAX' : out.amount,
    wrapStyle: {
      flex: 1,
      minWidth: 0
    },
    onChange: e => onChange({
      ...out,
      amount: e.target.value,
      usd: btcToUsd(e.target.value)
    })
  }), /*#__PURE__*/React.createElement(Text, {
    variant: "body",
    weight: "demibold",
    color: "secondary",
    style: {
      flex: 'none'
    }
  }, "~USD"), /*#__PURE__*/React.createElement(Row, {
    gap: 6,
    grow: true,
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Text, {
    variant: "mono",
    color: "muted"
  }, "$"), /*#__PURE__*/React.createElement(Input, {
    mono: true,
    placeholder: "Enter amount in USD",
    disabled: out.max,
    value: out.usd,
    style: {
      flex: 1,
      minWidth: 0,
      boxSizing: 'border-box'
    },
    onChange: e => onChange({
      ...out,
      usd: e.target.value,
      amount: usdToBtc(e.target.value)
    })
  })), canMax ? /*#__PURE__*/React.createElement(Row, {
    style: {
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: out.max,
    onChange: v => onChange({
      ...out,
      max: v
    }),
    label: "MAX"
  })) : null)));
}

/* useMeasure lives in Primitives.jsx — shared by the dashboard layout and Send. */
function SendScreen({
  wallet
}) {
  const [outputs, setOutputs] = React.useState([{
    address: '',
    amount: '',
    usd: '',
    label: '',
    max: false
  }]);
  const [feeRate, setFeeRate] = React.useState(true); // true = sats/vb, false = sats
  const [fee, setFee] = React.useState('1');
  const [auto, setAuto] = React.useState(true);
  const [selected, setSelected] = React.useState({});
  const [modal, setModal] = React.useState(null); // null | 'confirm' | 'sending' | 'sent'
  const [signed, setSigned] = React.useState(false);
  React.useEffect(() => {
    setOutputs([{
      address: '',
      amount: '',
      usd: '',
      label: '',
      max: false
    }]);
    setSelected({});
    setModal(null);
    setSigned(false);
  }, [wallet]);
  const clearAll = () => {
    clearOutputs();
    setSelected({});
    setSigned(false);
  };
  const anyMax = outputs.some(o => o.max);
  const setOut = (i, v) => setOutputs(outputs.map((o, k) => k === i ? v : o));
  const addOutput = () => setOutputs([...outputs, {
    address: '',
    amount: '',
    usd: '',
    label: '',
    max: false
  }]);
  const delOutput = i => setOutputs(outputs.filter((_, k) => k !== i));
  const clearOutputs = () => setOutputs([{
    address: '',
    amount: '',
    usd: '',
    label: '',
    max: false
  }]);
  const valid = outputs.every(o => looksLikeAddress(o.address) && (o.max || looksLikeAmount(o.amount))) && looksLikeAmount(fee);
  const selCount = Object.values(selected).filter(Boolean).length;

  // Auto coin selection — mock the Rust simulation: greedily cover the
  // recipients' total (largest coins first), or take everything if a MAX output exists.
  const btcOf = s => parseFloat(String(s).split(' ')[0]) || 0;
  const reqTotal = outputs.reduce((s, o) => s + (!o.max && looksLikeAmount(o.amount) ? parseFloat(o.amount) : 0), 0);
  const autoSel = (() => {
    const sorted = [...wallet.coins].map(c => btcOf(c.value)).sort((a, b) => b - a);
    let amount = 0,
      count = 0;
    for (const v of sorted) {
      if (!anyMax && amount >= reqTotal) break;
      amount += v;
      count++;
    }
    return {
      amount,
      count
    };
  })();
  const recipients = outputs.map(o => `${o.address.slice(0, 12)}…  ${o.max ? 'MAX' : o.amount + ' BTC'}`);

  // Indices auto-selection picks (largest first), so an unfolded list can show them.
  const autoIdxSet = (() => {
    const order = wallet.coins.map((c, i) => [i, btcOf(c.value)]).sort((a, b) => b[1] - a[1]);
    const set = new Set();
    let amount = 0;
    for (const [i, v] of order) {
      if (!anyMax && amount >= reqTotal) break;
      amount += v;
      set.add(i);
    }
    return set;
  })();

  // Layout is delegated to DashboardLayout: Send hands it two columns and it
  // decides single vs side-by-side. The column builders below are functions of
  // that decision ({ sideBySide }) so their inner content can adapt.

  // --- transaction math (mock) ---
  const selCoins = auto ? [...wallet.coins].sort((a, b) => btcOf(b.value) - btcOf(a.value)).slice(0, autoSel.count) : wallet.coins.filter((_, i) => selected[i]);
  const inSum = selCoins.reduce((a, c) => a + btcOf(c.value), 0);
  const feeNum = looksLikeAmount(fee) ? parseFloat(fee) : 0;
  const feeBtc = (feeRate ? feeNum * 200 : feeNum) / 1e8; // mock ~200 vB tx
  const sendBtc = anyMax ? Math.max(0, inSum - feeBtc) : reqTotal;
  const sendUsd = sendBtc > 0 ? '$' + (sendBtc * USD_RATE).toFixed(2) : '';
  const totalBtc = sendBtc + feeBtc;
  const fmt8 = n => n.toFixed(8) + ' BTC';

  // diagram data
  const inItems = selCoins.map((c, i) => ({
    w: btcOf(c.value),
    title: `Input #${i + 1}`,
    usd: '$' + (btcOf(c.value) * USD_RATE).toFixed(2),
    addr: c.outpoint
  }));
  const recipItems = outputs.map((o, i) => {
    const v = o.max ? sendBtc : parseFloat(o.amount) || 0;
    return {
      w: v,
      kind: 'recipient',
      title: o.label ? o.label : `Output #${i + 1}`,
      label: o.label,
      usd: v > 0 ? '$' + (v * USD_RATE).toFixed(2) : '',
      addr: o.address || 'recipient address…'
    };
  }).filter(d => d.w > 0);
  const changeV = anyMax ? 0 : Math.max(0, inSum - reqTotal - feeBtc);
  const outItems = [...recipItems, ...(changeV > 1e-9 ? [{
    w: changeV,
    kind: 'change',
    title: 'Change',
    usd: '$' + (changeV * USD_RATE).toFixed(2),
    addr: '(returned to your wallet)'
  }] : []), ...(feeBtc > 0 && inSum > 0 ? [{
    w: feeBtc,
    kind: 'fee',
    title: 'Network fee',
    usd: '$' + (feeBtc * USD_RATE).toFixed(2),
    addr: '(paid to miners)'
  }] : [])];
  const coinsHeader = /*#__PURE__*/React.createElement(Row, {
    gap: "s",
    style: {
      marginBottom: 'var(--space-s)',
      minHeight: 34
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, null, auto ? 'Coins selection' : selCount > 0 ? `Coins · ${selCount} selected` : 'Coins selection'), /*#__PURE__*/React.createElement(Spacer, null), !auto ? /*#__PURE__*/React.createElement(Button, {
    onClick: () => setSelected({})
  }, "Clear") : null, /*#__PURE__*/React.createElement(Checkbox, {
    checked: auto,
    onChange: setAuto,
    label: "Auto coin selection"
  }));

  // Fold to a one-line summary only when stacked + auto; otherwise show the full list.
  const coinsBodyFor = sideBySide => auto && !sideBySide ? /*#__PURE__*/React.createElement(Card, {
    tone: "inset",
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 'var(--space-s)',
      borderRadius: 'var(--radius-input)',
      padding: '11px var(--pad-m)'
    }
  }, /*#__PURE__*/React.createElement(Amount, {
    value: autoSel.amount.toFixed(8),
    size: "lg",
    unit: "BTC",
    count: `(${autoSel.count} coin${autoSel.count === 1 ? '' : 's'})`
  })) : /*#__PURE__*/React.createElement(CoinTable, {
    coins: wallet.coins,
    readOnly: auto,
    isChecked: (c, i) => auto ? autoIdxSet.has(i) : !!selected[i],
    onToggle: (i, v) => setSelected({
      ...selected,
      [i]: v
    })
  });
  const renderPrimary = ({
    sideBySide
  }) => /*#__PURE__*/React.createElement("div", {
    inert: signed ? '' : undefined,
    style: {
      opacity: signed ? 0.55 : 1,
      transition: 'opacity 0.15s',
      position: 'relative'
    }
  }, coinsHeader, coinsBodyFor(sideBySide), /*#__PURE__*/React.createElement(Divider, {
    space: "0",
    style: {
      margin: 'var(--space-l) 0 var(--space-m)'
    }
  }), /*#__PURE__*/React.createElement(SectionLabel, {
    style: {
      marginBottom: 'var(--space-s)'
    }
  }, "Payments"), /*#__PURE__*/React.createElement(Stack, {
    gap: "s"
  }, outputs.map((o, i) => /*#__PURE__*/React.createElement(RecipientCard, {
    key: i,
    out: o,
    idx: i,
    deletable: outputs.length > 1,
    canMax: !anyMax || o.max,
    onChange: v => setOut(i, v),
    onDelete: () => delOutput(i)
  }))), /*#__PURE__*/React.createElement(Row, {
    justify: "flex-end",
    style: {
      marginTop: 'var(--space-s)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: addOutput,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), "Add payment")));
  const txDiagram = /*#__PURE__*/React.createElement(Card, {
    tone: "inset",
    style: {
      borderRadius: 10,
      padding: '10px 8px 6px'
    }
  }, /*#__PURE__*/React.createElement(TxFlow, {
    inputs: inItems,
    outputs: outItems
  }), inItems.length && outItems.length ? /*#__PURE__*/React.createElement(Row, {
    justify: "space-between",
    style: {
      padding: '6px 6px 2px'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    size: 10,
    color: "muted"
  }, inItems.length, " input", inItems.length === 1 ? '' : 's'), /*#__PURE__*/React.createElement(Row, {
    inline: true,
    gap: 12
  }, /*#__PURE__*/React.createElement(Legend, {
    color: "var(--warning)"
  }, "recipient"), outItems.some(o => o.kind === 'change') ? /*#__PURE__*/React.createElement(Legend, {
    color: "var(--tx-self)"
  }, "change") : null, outItems.some(o => o.kind === 'fee') ? /*#__PURE__*/React.createElement(Legend, {
    color: "var(--error)"
  }, "fee") : null), /*#__PURE__*/React.createElement(Eyebrow, {
    size: 10,
    color: "muted"
  }, outItems.length, " output", outItems.length === 1 ? '' : 's')) : null);
  const summaryRows = /*#__PURE__*/React.createElement(TransactionSummary, {
    rows: [{
      label: 'Sending',
      value: fmt8(sendBtc),
      sub: sendUsd
    }, {
      label: 'Network fee',
      value: fmt8(feeBtc)
    }, changeV > 1e-9 ? {
      label: 'Change',
      value: fmt8(changeV)
    } : null],
    total: {
      label: 'Total',
      value: fmt8(totalBtc)
    }
  });
  const actionRow = /*#__PURE__*/React.createElement(Row, {
    align: "flex-end",
    gap: "s"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      opacity: signed ? 0.5 : 1,
      pointerEvents: signed ? 'none' : 'auto'
    }
  }, /*#__PURE__*/React.createElement(FieldLabel, null, "Fee rate"), /*#__PURE__*/React.createElement(Row, {
    gap: "s"
  }, /*#__PURE__*/React.createElement(Toggle, {
    on: feeRate,
    onClick: () => setFeeRate(r => !r)
  }), /*#__PURE__*/React.createElement(ValidatedInput, {
    mono: true,
    maxLength: 6,
    inputMode: "numeric",
    state: looksLikeAmount(fee) ? 'valid' : 'invalid',
    value: fee,
    onChange: e => setFee(e.target.value.replace(/[^\d.]/g, '').slice(0, 6)),
    wrapStyle: {
      flex: 'none',
      width: 104
    }
  }), /*#__PURE__*/React.createElement(Text, {
    variant: "body",
    color: "secondary",
    style: {
      flex: 'none'
    }
  }, feeRate ? 'sats/vB' : 'sats'))), /*#__PURE__*/React.createElement(Spacer, null), /*#__PURE__*/React.createElement(Row, {
    gap: "s",
    style: {
      flex: 'none'
    }
  }, signed ? /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    icon: "check"
  }, "Signed") : null, /*#__PURE__*/React.createElement(Button, {
    onClick: clearAll,
    style: {
      flex: 'none'
    }
  }, "Clear"), signed ? /*#__PURE__*/React.createElement(Button, {
    role: "primary",
    onClick: () => setModal({
      type: 'broadcast'
    }),
    style: {
      flex: 'none'
    }
  }, "Broadcast") : /*#__PURE__*/React.createElement(Button, {
    role: "primary",
    disabled: !valid,
    onClick: () => setModal('signer'),
    style: {
      flex: 'none'
    }
  }, "Sign")));
  const renderSecondary = ({
    sideBySide
  }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Row, {
    style: {
      minHeight: 34,
      marginBottom: 'var(--space-s)'
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, null, "Transaction")), sideBySide ?
  /*#__PURE__*/
  /* side-by-side: diagram on top, gap, then summary + buttons grouped at the bottom */
  React.createElement(React.Fragment, null, txDiagram, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 0 100px'
    }
  }), summaryRows, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-m)'
    }
  }, actionRow)) :
  /*#__PURE__*/
  /* single column: summary, then buttons, then the diagram last */
  React.createElement(Stack, {
    gap: "m"
  }, summaryRows, actionRow, txDiagram));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DashboardLayout, {
    title: "Send",
    primary: renderPrimary,
    secondary: renderSecondary
  }), modal === 'signer' ? /*#__PURE__*/React.createElement(SelectSigner, {
    walletName: wallet.name,
    onCancel: () => setModal(null),
    onPick: d => setModal(d.kind === 'sd' ? {
      type: 'sd',
      device: d
    } : d.kind === 'qr' ? {
      type: 'qr'
    } : {
      type: 'usb',
      device: d
    })
  }) : null, modal && modal.type === 'usb' ? /*#__PURE__*/React.createElement(UsbConfirm, {
    device: modal.device,
    onCancel: () => setModal(null)
  }) : null, modal && modal.type === 'sd' ? /*#__PURE__*/React.createElement(SdPicker, {
    device: modal.device,
    onCancel: () => setModal(null)
  }) : null, modal && modal.type === 'qr' ? /*#__PURE__*/React.createElement(ScanPsbt, {
    onCancel: () => setModal(null),
    onNext: () => setModal({
      type: 'qr-scan'
    })
  }) : null, modal && modal.type === 'qr-scan' ? /*#__PURE__*/React.createElement(ScanCamera, {
    onCancel: () => setModal(null),
    onBack: () => setModal({
      type: 'qr'
    }),
    onDone: () => {
      setSigned(true);
      setModal(null);
    }
  }) : null, modal && modal.type === 'broadcast' ? /*#__PURE__*/React.createElement(BroadcastModal, {
    onClose: () => {
      clearAll();
      setModal(null);
    }
  }) : null);
}
const SIGNER_DEVICES = [{
  name: 'Ledger Nano S Plus',
  fp: '#a4f9c821',
  icon: 'usb',
  kind: 'usb'
}, {
  name: 'Coldcard Mk4',
  fp: '#7e02da41',
  icon: 'usb',
  kind: 'usb'
}, {
  name: 'BitBox02',
  fp: '#b1740c3e',
  icon: 'usb',
  kind: 'usb'
}, {
  name: 'SD card airgap device',
  icon: 'sd_card',
  kind: 'sd'
}, {
  name: 'QR Code airgap device',
  icon: 'qr',
  kind: 'qr'
}];
function SelectSigner({
  walletName,
  onCancel,
  onPick,
  devices = SIGNER_DEVICES,
  title = 'Select a signer'
}) {
  return /*#__PURE__*/React.createElement(Modal, {
    title: title,
    width: 520,
    onClose: onCancel
  }, /*#__PURE__*/React.createElement(Stack, {
    gap: "s"
  }, devices.map((d, i) => /*#__PURE__*/React.createElement(SelectRow, {
    key: i,
    icon: d.icon,
    title: d.name,
    meta: d.fp,
    onClick: () => onPick(d)
  }))));
}

/* USB hardware-wallet: waiting for on-device confirmation. */
function UsbConfirm({
  device,
  onCancel
}) {
  return /*#__PURE__*/React.createElement(Modal, {
    title: device.name,
    width: 460,
    onClose: onCancel
  }, /*#__PURE__*/React.createElement(ModalStatus, {
    spinner: true,
    title: "Confirm on your device\u2026",
    subtitle: `Review the transaction details on ${device.name} and approve to sign.`,
    pad: "var(--space-l) 0 var(--space-m)"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: onCancel
  }, "Cancel")));
}

/* SD-card airgap: placeholder for the OS file picker. */
function SdPicker({
  device,
  onCancel
}) {
  return /*#__PURE__*/React.createElement(Modal, {
    title: device.name,
    width: 460,
    onClose: onCancel
  }, /*#__PURE__*/React.createElement(ModalStatus, {
    icon: "folder",
    title: "Must open a file picker",
    subtitle: "Save the unsigned PSBT to the SD card, sign it on the device, then load the signed file back."
  }));
}

/* QR airgap: animated PSBT QR with display tuning. */
const PSBT_PAYLOAD = 'cHNidP8BAHECAAAAAfwzq1kY2hVi9k3lQ8nT0pXrWb7mGv4Lh2Jd9sKfP1aoAAAAAAA' + 'D9____AoCWmAAAAAAAFgAUq3Zr8tN1dJ0hLmC4wVfYx2kPbT5AQg8AAAAAABYAFLuh' + '7cP2mZ9oXkqR3sVbTtMu1nQwAAAAAAEBH0BCDwAAAAAAFgAU8aQxk2nF0pZ7Lm3vBt' + 'WcYxRd9KsiBgL0nT8qWvLh2Jd9sKfP1ao9k3lQ8nT0pXrWb7mGv4Lh0Yz1a8tVAAAA' + 'gAAAAIAAAACAAAAAAAAAAAAAAQUiAgL0nT8qWvLh2Jd9sKfP1ao9k3lQ8nT0pXrWb7m';
function ScanPsbt({
  onCancel,
  onNext
}) {
  const [contrast, setContrast] = React.useState(3); // 1–5
  const [density, setDensity] = React.useState(3); // 1–5
  const [speed, setSpeed] = React.useState(3); // 1–5

  const parts = React.useMemo(() => {
    const chunk = density * 24; // fewer chars at low density = less dense QR
    const n = Math.max(2, Math.ceil(PSBT_PAYLOAD.length / chunk));
    const out = [];
    for (let i = 0; i < n; i++) {
      const body = PSBT_PAYLOAD.slice(i * chunk, (i + 1) * chunk);
      out.push(`UR:CRYPTO-PSBT/${i + 1}-${n}/${body}`);
    }
    return out;
  }, [density]);
  const [frame, setFrame] = React.useState(0);
  const interval = 520 - speed * 80; // faster = shorter interval
  React.useEffect(() => {
    setFrame(0);
    const id = setInterval(() => setFrame(f => (f + 1) % parts.length), interval);
    return () => clearInterval(id);
  }, [parts, interval]);
  const svg = React.useMemo(() => qrSvg(parts[frame] || '', {
    ecOrder: ['L', 'M']
  }), [parts, frame]);
  const bgL = 40 + (contrast - 1) * 15; // contrast 5 = white bg, 1 = dark grey bg (low contrast)
  const bg = `hsl(220 14% ${bgL}%)`;
  return /*#__PURE__*/React.createElement(Modal, {
    title: "Show PSBT",
    width: 860,
    onClose: onCancel
  }, /*#__PURE__*/React.createElement(Stack, {
    align: "center",
    gap: "m"
  }, /*#__PURE__*/React.createElement(QRCard, {
    size: 720,
    pad: 20,
    radius: 12,
    bg: bg,
    style: {
      maxWidth: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%'
    },
    dangerouslySetInnerHTML: {
      __html: svg
    }
  })), /*#__PURE__*/React.createElement(Text, {
    variant: "mono",
    color: "secondary",
    weight: "demibold",
    style: {
      fontSize: 12
    }
  }, "Part ", frame + 1, " / ", parts.length), /*#__PURE__*/React.createElement(Row, {
    gap: "xl",
    justify: "center",
    align: "flex-end",
    style: {
      position: 'relative',
      width: '100%',
      borderTop: '1px solid var(--border-light)',
      paddingTop: 'var(--space-m)'
    }
  }, /*#__PURE__*/React.createElement(Stepper, {
    label: "Contrast",
    value: contrast,
    min: 1,
    max: 5,
    onChange: setContrast
  }), /*#__PURE__*/React.createElement(Stepper, {
    label: "Density",
    value: density,
    min: 1,
    max: 5,
    onChange: setDensity
  }), /*#__PURE__*/React.createElement(Stepper, {
    label: "Animation speed",
    value: speed,
    min: 1,
    max: 5,
    onChange: setSpeed
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 0,
      bottom: 0
    }
  }, /*#__PURE__*/React.createElement(Button, {
    role: "primary",
    onClick: onNext,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, "Next ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevron_right",
    size: 15
  }))))));
}
function ScanCamera({
  onCancel,
  onBack,
  onDone
}) {
  const videoRef = React.useRef(null);
  const streamRef = React.useRef(null);
  const [devices, setDevices] = React.useState([]);
  const [deviceId, setDeviceId] = React.useState('');
  const [contrast, setContrast] = React.useState(3); // 1–5
  const [status, setStatus] = React.useState('starting'); // starting | live | denied

  const start = React.useCallback(async id => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    try {
      const constraints = {
        video: id ? {
          deviceId: {
            exact: id
          }
        } : {
          facingMode: 'environment'
        },
        audio: false
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setStatus('live');
      const all = await navigator.mediaDevices.enumerateDevices();
      const cams = all.filter(d => d.kind === 'videoinput');
      setDevices(cams);
      if (!id && cams[0]) setDeviceId(cams[0].deviceId);
    } catch (e) {
      setStatus('denied');
      try {
        const all = await navigator.mediaDevices.enumerateDevices();
        setDevices(all.filter(d => d.kind === 'videoinput'));
      } catch (_) {}
    }
  }, []);
  React.useEffect(() => {
    start(undefined);
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
    // eslint-disable-next-line
  }, []);
  const camLabels = devices.map((d, i) => d.label || `Camera ${i + 1}`);
  const curLabel = (() => {
    const idx = devices.findIndex(x => x.deviceId === deviceId);
    return idx >= 0 ? camLabels[idx] : camLabels[0] || 'Default camera';
  })();
  const pickLabel = label => {
    const idx = camLabels.indexOf(label);
    const d = devices[idx];
    if (d) {
      setDeviceId(d.deviceId);
      start(d.deviceId);
    }
  };
  const filter = `contrast(${(0.55 + contrast * 0.28).toFixed(2)})`;
  return /*#__PURE__*/React.createElement(Modal, {
    title: "Scan PSBT",
    width: 920,
    onClose: onCancel
  }, /*#__PURE__*/React.createElement(Stack, {
    align: "center",
    gap: "l"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      aspectRatio: '4 / 3',
      borderRadius: 12,
      overflow: 'hidden',
      background: 'var(--camera-bg)',
      border: '1px solid var(--border-light)'
    }
  }, /*#__PURE__*/React.createElement("video", {
    ref: videoRef,
    muted: true,
    playsInline: true,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      filter,
      display: status === 'live' ? 'block' : 'none'
    }
  }), status !== 'live' ? /*#__PURE__*/React.createElement(Stack, {
    align: "center",
    justify: "center",
    gap: "s",
    style: {
      position: 'absolute',
      inset: 0,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "qr",
    size: 52
  }), /*#__PURE__*/React.createElement(Text, {
    variant: "body",
    style: {
      fontSize: 14
    }
  }, status === 'denied' ? 'Camera unavailable — grant access to scan' : 'Starting camera…')) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: '16% 26%',
      border: '2px solid rgba(255,255,255,0.85)',
      borderRadius: 12,
      boxShadow: '0 0 0 9999px rgba(0,0,0,0.28)',
      pointerEvents: 'none',
      display: status === 'live' ? 'block' : 'none'
    }
  })), /*#__PURE__*/React.createElement(Row, {
    justify: "space-between",
    align: "flex-end",
    gap: "l",
    style: {
      width: '100%',
      borderTop: '1px solid var(--border-light)',
      paddingTop: 'var(--space-m)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: onBack,
    style: {
      flex: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron_right",
    size: 14,
    style: {
      transform: 'rotate(180deg)'
    }
  }), "Previous"), /*#__PURE__*/React.createElement(Stack, {
    align: "flex-start",
    gap: 6,
    style: {
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Text, {
    variant: "body",
    color: "secondary",
    weight: "500",
    style: {
      fontSize: 13
    }
  }, "Camera source"), /*#__PURE__*/React.createElement(ComboBox, {
    value: curLabel,
    options: camLabels.length ? camLabels : ['Default camera'],
    onChange: pickLabel,
    width: 240
  })), /*#__PURE__*/React.createElement(Stepper, {
    label: "Contrast",
    value: contrast,
    min: 1,
    max: 5,
    onChange: setContrast
  }), /*#__PURE__*/React.createElement(Button, {
    role: "primary",
    onClick: onDone,
    style: {
      flex: 'none'
    }
  }, "Done"))));
}
function BroadcastModal({
  onClose
}) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement(Modal, {
    title: "Broadcast",
    width: 460,
    onClose: onClose
  }, /*#__PURE__*/React.createElement(ModalStatus, {
    spinner: true,
    title: "Broadcasting transaction\u2026",
    pad: "var(--space-xl) 0 var(--space-l)"
  }));
}
Object.assign(window, {
  SendScreen,
  SelectSigner,
  UsbConfirm,
  SdPicker,
  ScanPsbt,
  ScanCamera,
  BroadcastModal,
  RecipientCard,
  SIGNER_DEVICES,
  looksLikeAmount,
  looksLikeAddress,
  btcToUsd,
  usdToBtc,
  USD_RATE
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/silent/Send.jsx", error: String((e && e.message) || e) }); }

// ui_kits/silent/Settings.jsx
try { (() => {
/* Silent UI Kit — Settings screen (Settings.cpp). */

function TestableRow({
  label,
  value,
  onChange,
  placeholder,
  width = 440,
  network
}) {
  const [state, setState] = React.useState('idle'); // idle | testing | ok
  const test = () => {
    setState('testing');
    setTimeout(() => setState('ok'), 800);
  };
  return /*#__PURE__*/React.createElement(Field, {
    label: label,
    labelWidth: 130
  }, /*#__PURE__*/React.createElement(Input, {
    width: width,
    value: value,
    placeholder: placeholder,
    onChange: e => {
      onChange(e.target.value);
      setState('idle');
    }
  }), /*#__PURE__*/React.createElement(Button, {
    onClick: test,
    disabled: state === 'testing',
    style: {
      marginLeft: 'var(--space-xs)'
    }
  }, state === 'testing' ? 'Testing…' : state === 'ok' ? '✓ Test' : 'Test'));
}
function SettingsScreen({
  wallet
}) {
  const [blindbit, setBlindbit] = React.useState(wallet.blindbit);
  const [electrum, setElectrum] = React.useState(wallet.electrum);
  const [network, setNetwork] = React.useState(wallet.network);
  const [open, setOpen] = React.useState('');
  React.useEffect(() => {
    setBlindbit(wallet.blindbit);
    setElectrum(wallet.electrum);
    setNetwork(wallet.network);
    setOpen('');
  }, [wallet]);
  const toggle = id => setOpen(cur => cur === id ? '' : id);
  return /*#__PURE__*/React.createElement(ScreenWrap, {
    title: "Settings"
  }, /*#__PURE__*/React.createElement(Stack, null, /*#__PURE__*/React.createElement(FoldSection, {
    id: "conn",
    label: "Connection",
    open: open === 'conn',
    onToggle: toggle
  }, /*#__PURE__*/React.createElement(Stack, {
    gap: "xs"
  }, /*#__PURE__*/React.createElement(TestableRow, {
    label: "BlindBit URL:",
    value: blindbit,
    onChange: setBlindbit,
    placeholder: "https://blindbit.example.com"
  }), /*#__PURE__*/React.createElement(TestableRow, {
    label: "Electrum Server:",
    value: electrum,
    onChange: setElectrum,
    placeholder: "host:port"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Network:",
    labelWidth: 130
  }, /*#__PURE__*/React.createElement(ComboBox, {
    value: network,
    options: NETWORKS,
    onChange: setNetwork,
    width: 200
  })))), /*#__PURE__*/React.createElement(Ruler, null), /*#__PURE__*/React.createElement(FoldSection, {
    id: "info",
    label: "Backend Info",
    open: open === 'info',
    onToggle: toggle
  }, /*#__PURE__*/React.createElement(Stack, {
    gap: "xs"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Network:",
    labelWidth: 130
  }, /*#__PURE__*/React.createElement(Text, {
    variant: "body"
  }, network)), /*#__PURE__*/React.createElement(Field, {
    label: "Block Height:",
    labelWidth: 130
  }, /*#__PURE__*/React.createElement(Text, {
    variant: "mono"
  }, "812519")), /*#__PURE__*/React.createElement(Field, {
    label: "Capabilities:",
    labelWidth: 130,
    align: "flex-start"
  }, /*#__PURE__*/React.createElement(Stack, {
    gap: 2
  }, /*#__PURE__*/React.createElement(Text, {
    variant: "body"
  }, "Tweaks Only: Yes"), /*#__PURE__*/React.createElement(Text, {
    variant: "body"
  }, "Full Basic: Yes"), /*#__PURE__*/React.createElement(Text, {
    variant: "body"
  }, "Full + Dust Filter: Yes"), /*#__PURE__*/React.createElement(Text, {
    variant: "body"
  }, "Cut-Through + Dust Filter: No"))))), /*#__PURE__*/React.createElement(Row, {
    justify: "center",
    gap: "s",
    style: {
      marginTop: 'var(--space-l)'
    }
  }, /*#__PURE__*/React.createElement(Button, null, "Connect Blindbit"), /*#__PURE__*/React.createElement(Button, null, "Connect Electrum"), /*#__PURE__*/React.createElement(Button, {
    role: "primary"
  }, "Save Settings"))));
}
Object.assign(window, {
  SettingsScreen,
  TestableRow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/silent/Settings.jsx", error: String((e && e.message) || e) }); }

// ui_kits/silent/Sidebar.jsx
try { (() => {
/* Silent UI Kit — Sidebar nav + bottom StatusBar (AccountWidget.cpp + StatusBar.cpp). */

const NAV_ITEMS = [{
  id: 'history',
  label: 'History',
  icon: 'history'
}, {
  id: 'coins',
  label: 'Coins',
  icon: 'coins'
}, {
  id: 'send',
  label: 'Send',
  icon: 'upload'
}, {
  id: 'receive',
  label: 'Receive',
  icon: 'download'
}];
function Sidebar({
  active,
  onSelect
}) {
  return /*#__PURE__*/React.createElement(Stack, {
    gap: "s",
    style: {
      width: 'var(--sidebar-w)',
      flex: 'none',
      background: 'var(--bg-secondary)',
      padding: 'var(--pad-xs)'
    }
  }, NAV_ITEMS.map(it => /*#__PURE__*/React.createElement(Button, {
    key: it.id,
    role: "menu",
    className: active === it.id ? 'is-active' : '',
    onClick: () => onSelect(it.id)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.icon,
    size: 20
  }), it.label)), /*#__PURE__*/React.createElement(Spacer, null), /*#__PURE__*/React.createElement(Button, {
    role: "menu",
    className: active === 'layout' ? 'is-active' : '',
    onClick: () => onSelect('layout')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "layout",
    size: 20
  }), "Layout"), /*#__PURE__*/React.createElement(Button, {
    role: "menu",
    className: active === 'settings' ? 'is-active' : '',
    onClick: () => onSelect('settings')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings",
    size: 20
  }), "Settings"));
}
function StatusBar({
  wallet
}) {
  const [blindbit, setBlindbit] = React.useState(true);
  const [electrum, setElectrum] = React.useState(false);
  const blindbitText = blindbit ? `Connected to blindbit-oracle at ${wallet.blindbit}` : 'Disconnected';
  const electrumText = electrum ? `Connected to electrum at ${wallet.electrum}` : 'Electrum disconnected';
  return /*#__PURE__*/React.createElement(Row, {
    style: {
      height: 'var(--statusbar-h)',
      flex: 'none',
      borderTop: '1px solid var(--border)',
      background: 'var(--bg)',
      padding: '0 var(--pad-s)'
    }
  }, /*#__PURE__*/React.createElement(Row, {
    grow: true,
    gap: "s",
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Toggle, {
    on: blindbit,
    status: true,
    onClick: () => setBlindbit(b => !b)
  }), /*#__PURE__*/React.createElement(Text, {
    variant: "status",
    truncate: true
  }, blindbitText)), /*#__PURE__*/React.createElement(Divider, {
    vertical: true,
    space: "0",
    style: {
      margin: '5px 0'
    }
  }), /*#__PURE__*/React.createElement(Row, {
    grow: true,
    gap: "s",
    style: {
      minWidth: 0,
      paddingLeft: 'var(--space-s)'
    }
  }, /*#__PURE__*/React.createElement(Toggle, {
    on: electrum,
    status: true,
    onClick: () => setElectrum(e => !e)
  }), /*#__PURE__*/React.createElement(Text, {
    variant: "status",
    truncate: true
  }, electrumText)));
}
Object.assign(window, {
  Sidebar,
  StatusBar,
  NAV_ITEMS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/silent/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/silent/TxFlow.jsx
try { (() => {
/* Silent UI Kit — Transaction-shape diagram (Sankey of inputs -> tx -> outputs).
   Generative: ribbon thickness is proportional to amount. Hovering a ribbon
   reveals a detail card. In the Qt app this is a QWidget with a custom
   paintEvent (QPainterPath cubics + QLinearGradient) plus a hover overlay. */

function txBands(weights, top, bottom, gap, min = 5) {
  const total = weights.reduce((a, b) => a + b, 0) || 1;
  const n = weights.length;
  const avail = bottom - top - gap * Math.max(0, n - 1);
  // Reserve a minimum per band so tiny amounts (e.g. change) stay visible,
  // then share the leftover space proportionally to the amounts.
  const per = Math.min(min, avail / n);
  const leftover = Math.max(0, avail - per * n);
  let y = top;
  return weights.map(w => {
    const h = per + leftover * (w / total);
    const band = [y, y + h];
    y += h + gap;
    return band;
  });
}
function txMidAddr(s) {
  if (!s) return '';
  return s.length > 30 ? s.slice(0, 26) + '… ' + s.slice(-4) : s;
}

/* Output colors by kind (TxFlow.cpp kindFill): external recipient = tx-warning;
   change is sent back to yourself, so it shares the self/blue color; fee = error. */
function outFill(d) {
  return d.kind === 'change' ? 'var(--tx-self)' : d.kind === 'fee' ? 'var(--error)' : 'var(--tx-warning)';
}
function outCap(d) {
  return d.kind === 'change' ? 'var(--tx-self)' : d.kind === 'fee' ? 'var(--error)' : 'var(--tx-warning)';
}
/* Readable label text colors (darker than the band fills). */
function outLabel(d) {
  return d.kind === 'change' ? 'var(--tx-self-label)' : d.kind === 'fee' ? 'var(--tx-fee-label)' : 'var(--tx-recipient-label)';
}
function TxFlowEmpty({
  height = 188
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "116",
    height: "60",
    viewBox: "0 0 116 60",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "14",
    width: "9",
    height: "13",
    rx: "2",
    fill: "var(--text-muted)",
    opacity: "0.4"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "33",
    width: "9",
    height: "13",
    rx: "2",
    fill: "var(--text-muted)",
    opacity: "0.4"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "51",
    y: "18",
    width: "14",
    height: "24",
    rx: "2",
    fill: "var(--text-muted)",
    opacity: "0.55"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "104",
    y: "20",
    width: "9",
    height: "20",
    rx: "2",
    fill: "var(--text-muted)",
    opacity: "0.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 20 C 32 20, 32 24, 51 24",
    stroke: "var(--text-muted)",
    strokeOpacity: "0.3",
    strokeWidth: "1.5",
    strokeDasharray: "3 3",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 40 C 32 40, 32 36, 51 36",
    stroke: "var(--text-muted)",
    strokeOpacity: "0.3",
    strokeWidth: "1.5",
    strokeDasharray: "3 3",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M65 30 C 85 30, 85 30, 104 30",
    stroke: "var(--text-muted)",
    strokeOpacity: "0.3",
    strokeWidth: "1.5",
    strokeDasharray: "3 3",
    fill: "none"
  })), /*#__PURE__*/React.createElement("div", {
    className: "t-body",
    style: {
      color: 'var(--text-muted)',
      maxWidth: 200
    }
  }, "Enter a payment amount to preview the transaction shape."));
}
function TxFlow({
  inputs,
  outputs,
  width = 300,
  height = 188
}) {
  const ins = (inputs || []).filter(d => d.w > 0);
  const outs = (outputs || []).filter(d => d.w > 0);
  const [hover, setHover] = React.useState(null);
  const wrapRef = React.useRef(null);
  if (!ins.length || !outs.length) return /*#__PURE__*/React.createElement(TxFlowEmpty, {
    height: height
  });
  const W = width,
    H = height,
    padY = 14;
  const xInStub = 4,
    xFlowL = 24;
  const xTrunkL = W * 0.44,
    xTrunkR = W * 0.56;
  const xFlowR = W - 24,
    xOutStub = W - 4;
  const trunkH = (H - 2 * padY) * 0.84;
  const trunkTop = (H - trunkH) / 2,
    trunkBot = trunkTop + trunkH;
  const inW = ins.map(d => d.w),
    outW = outs.map(d => d.w);
  const inNode = txBands(inW, padY, H - padY, 9);
  const inTrunk = txBands(inW, trunkTop, trunkBot, 0);
  const outNode = txBands(outW, padY, H - padY, 9);
  const outTrunk = txBands(outW, trunkTop, trunkBot, 0);
  const ribbon = (x0, a0, a1, x1, b0, b1) => {
    const mx = (x0 + x1) / 2;
    return `M ${x0} ${a0} C ${mx} ${a0}, ${mx} ${b0}, ${x1} ${b0}` + ` L ${x1} ${b1} C ${mx} ${b1}, ${mx} ${a1}, ${x0} ${a1} Z`;
  };
  const move = (e, side, i) => {
    const r = wrapRef.current.getBoundingClientRect();
    setHover({
      side,
      i,
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      cw: r.width
    });
  };
  const isHot = (side, i) => hover && hover.side === side && hover.i === i;
  const data = hover ? (hover.side === 'in' ? ins : outs)[hover.i] : null;
  const cardW = 196;
  let cardL = 0,
    cardT = 0;
  if (hover) {
    cardL = hover.x + 14;
    if (cardL + cardW > hover.cw) cardL = hover.x - 14 - cardW;
    cardL = Math.max(4, Math.min(cardL, hover.cw - cardW - 4));
    cardT = Math.max(4, hover.y - 14);
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: wrapRef,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    width: "100%",
    height: H,
    style: {
      display: 'block'
    }
  }, ins.map((_, i) => /*#__PURE__*/React.createElement("path", {
    key: 'i' + i,
    d: ribbon(xFlowL, inNode[i][0], inNode[i][1], xTrunkL, inTrunk[i][0], inTrunk[i][1]),
    fill: "var(--tx-self)",
    fillOpacity: isHot('in', i) ? 0.98 : 0.34 + 0.07 * (i % 3),
    style: {
      cursor: 'pointer',
      transition: 'fill-opacity 0.1s'
    },
    onMouseMove: e => move(e, 'in', i),
    onMouseLeave: () => setHover(null)
  })), /*#__PURE__*/React.createElement("rect", {
    x: xTrunkL,
    y: trunkTop,
    width: xTrunkR - xTrunkL,
    height: trunkBot - trunkTop,
    fill: "var(--tx-self)",
    fillOpacity: "0.95"
  }), outs.map((d, j) => /*#__PURE__*/React.createElement("path", {
    key: 'o' + j,
    d: ribbon(xTrunkR, outTrunk[j][0], outTrunk[j][1], xFlowR, outNode[j][0], outNode[j][1]),
    fill: outFill(d),
    fillOpacity: isHot('out', j) ? 0.98 : 0.62,
    style: {
      cursor: 'pointer',
      transition: 'fill-opacity 0.1s'
    },
    onMouseMove: e => move(e, 'out', j),
    onMouseLeave: () => setHover(null)
  })), inNode.map((b, i) => /*#__PURE__*/React.createElement("rect", {
    key: 'ic' + i,
    x: xInStub,
    y: b[0],
    width: xFlowL - xInStub - 2,
    height: b[1] - b[0],
    rx: "2",
    fill: "var(--tx-self)"
  })), outNode.map((b, j) => /*#__PURE__*/React.createElement("rect", {
    key: 'oc' + j,
    x: xFlowR + 2,
    y: b[0],
    width: xOutStub - xFlowR - 2,
    height: b[1] - b[0],
    rx: "2",
    fill: outCap(outs[j])
  })), outs.map((d, j) => {
    const mid = (outNode[j][0] + outNode[j][1]) / 2;
    return /*#__PURE__*/React.createElement("text", {
      key: 'ol' + j,
      x: xFlowR - 8,
      y: mid + 3,
      textAnchor: "end",
      style: {
        font: '600 9px var(--font-mono)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase'
      },
      fill: outLabel(d)
    }, d.kind === 'change' ? 'change' : d.kind === 'fee' ? 'fee' : d.label ? d.label.slice(0, 10) : 'recipient');
  })), data ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: cardL,
      top: cardT,
      width: cardW,
      pointerEvents: 'none',
      zIndex: 5,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '9px 11px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
    }
  }, /*#__PURE__*/React.createElement(Text, {
    as: "div",
    variant: "body",
    weight: "demibold",
    style: {
      fontSize: 12
    }
  }, data.title), data.usd ? /*#__PURE__*/React.createElement(Text, {
    as: "div",
    variant: "mono",
    color: "secondary",
    style: {
      fontSize: 13,
      marginTop: 3
    }
  }, data.usd) : null, data.addr ? /*#__PURE__*/React.createElement(Text, {
    as: "div",
    variant: "mono",
    color: "muted",
    style: {
      fontSize: 11,
      marginTop: 3,
      wordBreak: 'break-all'
    }
  }, txMidAddr(data.addr)) : null) : null);
}
Object.assign(window, {
  TxFlow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/silent/TxFlow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/silent/Widgets.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Silent UI Kit — Composite widget generics.
   One level up from Layout/Primitives: labelled rows, tables, disclosure,
   steppers, tooltips. Views and subcomponents compose THESE — never the raw
   markup they wrap. Each maps to a Qt widget or a small layout recipe.

   Loaded after Layout.jsx + Primitives.jsx, before any view. */

/* Eyebrow caption — uppercase mono section label (theme::Label, caption role). */
function SectionLabel({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(Eyebrow, _extends({
    color: "muted",
    size: 11,
    style: style
  }, rest), children);
}

/* Micro field label sitting above an input. */
function FieldLabel({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(Eyebrow, _extends({
    color: "muted",
    size: 10,
    style: {
      letterSpacing: '0.12em',
      marginBottom: 6,
      ...style
    }
  }, rest), children);
}

/* PaymentRow — fixed-width right-aligned label + a flexible control (Liana form row). */
function PaymentRow({
  label,
  labelWidth = 89,
  align = 'center',
  children
}) {
  return /*#__PURE__*/React.createElement(Row, {
    gap: "m",
    align: align,
    style: {
      padding: 'var(--space-xs) 0'
    }
  }, /*#__PURE__*/React.createElement(Text, {
    variant: "body",
    weight: "demibold",
    align: "right",
    nowrap: true,
    style: {
      width: labelWidth,
      flex: 'none',
      paddingTop: align === 'flex-start' ? 8 : 0
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, children));
}

/* ValidatedInput — Input with a fixed-width validation mark overlaid at the right.
   Qt: row->push(Input)->push(indicator Label, fixed width 20). */
function ValidatedInput({
  state,
  wrapStyle,
  ...inputProps
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      ...wrapStyle
    }
  }, /*#__PURE__*/React.createElement(Input, _extends({}, inputProps, {
    style: {
      flex: 1,
      minWidth: 0,
      boxSizing: 'border-box',
      paddingRight: 30
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 8,
      top: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement(ValidationMark, {
    state: state
  })));
}

/* Stepper — − ●●●○○ + level control. Qt: row of two inline-icon Buttons + Label. */
function Stepper({
  label,
  value,
  min,
  max,
  onChange
}) {
  const dots = '●'.repeat(value) + '○'.repeat(max - value);
  return /*#__PURE__*/React.createElement(Stack, {
    align: "center",
    gap: 6
  }, label ? /*#__PURE__*/React.createElement(Text, {
    variant: "body",
    color: "secondary",
    weight: "500",
    nowrap: true
  }, label) : null, /*#__PURE__*/React.createElement(Row, {
    gap: "s"
  }, /*#__PURE__*/React.createElement(Button, {
    role: "inline-icon",
    disabled: value <= min,
    onClick: () => onChange(Math.max(min, value - 1))
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "minus",
    size: 14
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 56,
      textAlign: 'center',
      font: '10px var(--font-mono)',
      letterSpacing: '1px',
      color: 'var(--accent)'
    }
  }, dots), /*#__PURE__*/React.createElement(Button, {
    role: "inline-icon",
    disabled: value >= max,
    onClick: () => onChange(Math.min(max, value + 1))
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14
  }))));
}

/* Tooltip — hover bubble above its child. */
function Tooltip({
  label,
  children
}) {
  const [show, setShow] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false)
  }, children, show ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: 'calc(100% + 8px)',
      left: '50%',
      transform: 'translateX(-50%)',
      whiteSpace: 'nowrap',
      background: 'var(--text)',
      color: 'var(--bg)',
      font: '500 11px var(--font-sans)',
      padding: '5px 9px',
      borderRadius: 'var(--radius-inline-icon)',
      zIndex: 60,
      pointerEvents: 'none',
      boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
    }
  }, label, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      borderLeft: '4px solid transparent',
      borderRight: '4px solid transparent',
      borderTop: '4px solid var(--text)'
    }
  })) : null);
}

/* FoldSection — disclosure: a chevron + eyebrow header that reveals its children. */
function FoldSection({
  id,
  label,
  open,
  onToggle,
  children
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onToggle(id),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-s)',
      width: '100%',
      background: 'none',
      border: 'none',
      padding: 'var(--space-s) 0',
      margin: 0,
      cursor: 'pointer',
      textAlign: 'left',
      color: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      display: 'inline-flex',
      color: 'var(--text-secondary)',
      transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
      transition: 'transform 0.15s ease'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron_down",
    size: 14
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, null, label))), open ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 0 var(--space-m) calc(14px + var(--space-s))'
    }
  }, children) : null);
}

/* IndexPill — qr-glyph + derivation index, the row handle in the address list.
   A normal Button (s-btn), just sized 60×30 (Index × Icon) — no bespoke class. */
function IndexPill({
  index,
  active,
  onClick,
  title = 'Show QR code'
}) {
  return /*#__PURE__*/React.createElement(Button, {
    onClick: onClick,
    title: title,
    style: {
      flex: 'none',
      width: 60,
      height: 30,
      minHeight: 0,
      padding: '0 8px',
      gap: 6,
      background: active ? 'var(--bg)' : undefined
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "qr",
    size: 13
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 12px var(--font-mono)',
      color: 'var(--text)'
    }
  }, index));
}

/* KeyValue — a label/value summary line (left label, right value). Used by the
   transaction summary and settings rows. value defaults to mono.
   `sub` adds a muted second line under the value; `strong` enlarges + emphasizes
   it (the Send "Total" row). This subsumes the old Send-local SummaryRow. */
function KeyValue({
  label,
  value,
  sub,
  valueMono = true,
  valueColor,
  strong,
  align = 'center',
  pad,
  style
}) {
  return /*#__PURE__*/React.createElement(Row, {
    justify: "space-between",
    align: align,
    gap: "m",
    style: {
      padding: pad || 'var(--space-xxs) 0',
      ...style
    }
  }, /*#__PURE__*/React.createElement(Text, {
    variant: "body",
    color: "secondary",
    nowrap: true
  }, label), /*#__PURE__*/React.createElement(Stack, {
    align: "flex-end",
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Text, {
    variant: valueMono ? 'mono' : 'body',
    color: valueColor,
    nowrap: true,
    weight: strong ? 'demibold' : undefined,
    style: {
      textAlign: 'right',
      fontSize: strong ? 16 : undefined
    }
  }, value), sub ? /*#__PURE__*/React.createElement(Text, {
    variant: "mono",
    color: "muted",
    nowrap: true,
    style: {
      fontSize: 11,
      marginTop: 2
    }
  }, sub) : null));
}

/* Table — data-driven table over the s-tbl classes.
   columns: [{ key, header, width, grow, align:'right', mono, muted, render(row,i) }]
   A column with `render` controls its own cell; otherwise row[key] is shown
   (optionally via `format(value,row)`). `muted` may be a bool or (row)=>bool.
   Selection/interaction: `hideHeader` drops the header row (a bare list, e.g.
   Send coin selection); `onRowClick(row,i)`, `rowClass(row,i)` (e.g.
   'is-selected') and `rowStyle(row,i)` make rows pickable. */
function Table({
  columns,
  rows,
  rowKey,
  maxHeight,
  bodyStyle,
  hideHeader,
  onRowClick,
  rowClass,
  rowStyle
}) {
  const hcell = c => 's-tbl__hcell' + (c.align === 'right' ? ' s-tbl__hcell--amount' : '') + (c.grow ? ' s-tbl__cell--grow' : '');
  const cell = (c, row, i) => 's-tbl__cell' + (c.mono ? ' s-tbl__cell--mono' : '') + (c.align === 'right' ? ' s-tbl__cell--amount' : '') + (c.grow ? ' s-tbl__cell--grow' : '') + ((typeof c.muted === 'function' ? c.muted(row, i) : c.muted) ? ' s-tbl__cell--muted' : '');
  const w = (c, row, i) => ({
    ...(c.width != null ? {
      width: c.width
    } : null),
    ...(c.cellStyle ? c.cellStyle(row, i) : null)
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "s-tbl"
  }, hideHeader ? null : /*#__PURE__*/React.createElement("div", {
    className: "s-tbl__head"
  }, columns.map((c, ci) => /*#__PURE__*/React.createElement("div", {
    key: ci,
    className: hcell(c),
    style: c.width != null ? {
      width: c.width
    } : undefined
  }, c.header))), /*#__PURE__*/React.createElement("div", {
    className: "s-tbl__body",
    style: {
      ...(maxHeight ? {
        maxHeight,
        overflowY: 'auto'
      } : null),
      ...bodyStyle
    }
  }, rows.map((row, i) => /*#__PURE__*/React.createElement("div", {
    className: 's-tbl__row' + (rowClass ? ' ' + (rowClass(row, i) || '') : ''),
    key: rowKey ? rowKey(row, i) : i,
    style: rowStyle ? rowStyle(row, i) : undefined,
    onClick: onRowClick ? () => onRowClick(row, i) : undefined
  }, columns.map((c, ci) => /*#__PURE__*/React.createElement("div", {
    key: ci,
    className: cell(c, row, i),
    style: w(c, row, i)
  }, c.render ? c.render(row, i) : c.format ? c.format(row[c.key], row) : row[c.key]))))));
}

/* TransactionSummary — the Sending / fee / Change → Total block. `rows` is a list
   of { label, value, sub } (falsy entries are skipped, e.g. a missing Change);
   `total` is the emphasized bottom line under a rule. Used by Send + its gallery. */
function TransactionSummary({
  rows = [],
  total,
  topRule = true
}) {
  return /*#__PURE__*/React.createElement(Stack, {
    style: topRule ? {
      borderTop: '1px solid var(--border-light)',
      paddingTop: 'var(--space-xs)'
    } : undefined
  }, rows.filter(Boolean).map((r, i) => /*#__PURE__*/React.createElement(KeyValue, {
    key: i,
    label: r.label,
    value: r.value,
    sub: r.sub,
    align: "baseline",
    pad: "7px 0"
  })), total ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Divider, {
    space: "0",
    style: {
      margin: '4px 0'
    }
  }), /*#__PURE__*/React.createElement(KeyValue, {
    label: total.label,
    value: total.value,
    sub: total.sub,
    strong: true,
    align: "baseline",
    pad: "7px 0"
  })) : null);
}

/* CoinTable — the coin/UTXO selection table over <Table>. `isChecked(coin,i)`
   decides the checked/highlighted state; `onToggle(i,next)` flips it. `readOnly`
   (auto coin-selection) disables the checkboxes and dims unchecked rows. Used by
   Send + its gallery. */
function CoinTable({
  coins,
  isChecked,
  onToggle,
  readOnly = false,
  maxHeight = 230,
  hideHeader = true
}) {
  const checked = (c, i) => isChecked ? !!isChecked(c, i) : false;
  return /*#__PURE__*/React.createElement(Table, {
    rows: coins,
    hideHeader: hideHeader,
    maxHeight: maxHeight || undefined,
    bodyStyle: {
      overflowX: 'hidden',
      paddingRight: 6
    },
    rowKey: (c, i) => i,
    rowClass: (c, i) => checked(c, i) ? 'is-selected' : '',
    rowStyle: (c, i) => ({
      cursor: readOnly ? 'default' : 'pointer',
      opacity: readOnly && !checked(c, i) ? 0.5 : 1
    }),
    onRowClick: readOnly ? undefined : (c, i) => onToggle && onToggle(i, !checked(c, i)),
    columns: [{
      header: '',
      width: 30,
      cellStyle: () => ({
        padding: '0 0 0 8px'
      }),
      render: (c, i) => /*#__PURE__*/React.createElement(Checkbox, {
        checked: checked(c, i),
        disabled: readOnly,
        onChange: v => {
          if (!readOnly && onToggle) onToggle(i, v);
        }
      })
    }, {
      key: 'type',
      header: 'Type',
      width: 92
    }, {
      key: 'outpoint',
      header: 'OutPoint',
      width: 175,
      mono: true
    }, {
      header: 'Label',
      grow: true,
      muted: c => !c.label,
      render: c => c.label || '—'
    }, {
      header: 'Value',
      width: 150,
      align: 'right',
      render: c => `${c.value} BTC`
    }]
  });
}
Object.assign(window, {
  SectionLabel,
  FieldLabel,
  PaymentRow,
  ValidatedInput,
  Stepper,
  Tooltip,
  FoldSection,
  IndexPill,
  KeyValue,
  Table,
  TransactionSummary,
  CoinTable
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/silent/Widgets.jsx", error: String((e && e.message) || e) }); }

})();
