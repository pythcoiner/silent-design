/* Silent UI Kit — Variant catalogs. EVERY button and pill the app shows is a
   named entry here, hardcoded once (role/tone, label, icon, title). Screens only
   pick an id: <Btn id="sign" onClick={…} /> · <Pill id="device_ready" />.
   Qt: one helper per entry (btn_sign(), pill_device_ready()…).
   Add a new usage = add an entry here + it appears on the preview cards. */

/* BtnWidth — the ONLY button widths (px). Every BUTTONS entry names one in `w`.
   Text buttons are M by default (Close, Check, Sign, Cancel… all the same width);
   a label that cannot fit M steps up to L / XL / XXL. Icon roles use Icon / IconLg,
   inline link buttons are Auto. Qt: setFixedWidth(btnWidth(w)). */
export const BTN_WIDTH = { Icon: 30, IconLg: 50, Index: 60, M: 120, L: 160, XL: 200, XXL: 260, LaunchEntry: 300, LaunchAdd: 354, Auto: null };

export const BUTTONS = {
  /* component parts (Modal, ModalActions, Stepper, CopyField) */
  modal_close: { role: 'inline-icon', icon: 'x', iconSize: 16, title: 'Close', w: 'Icon' },
  back: { role: 'default', label: 'Back', icon: 'chevron_left', iconSize: 14, w: 'M' },
  other_signer: { role: 'default', label: 'Other Signer', icon: 'chevron_left', iconSize: 14, w: 'L' },
  all_settings: { role: 'default', label: 'All Settings', icon: 'chevron_left', iconSize: 14, w: 'L' },
  stepper_minus: { role: 'inline-icon', icon: 'minus', iconSize: 14, title: 'Less', w: 'Icon' },
  stepper_plus: { role: 'inline-icon', icon: 'plus', iconSize: 14, title: 'More', w: 'Icon' },
  save_alias: { role: 'inline-icon', icon: 'check', iconSize: 16, title: 'Save Alias', w: 'Icon' },
  add_route_icon: { role: 'inline-icon', icon: 'plus', iconSize: 14, title: 'Add Route', w: 'Icon' },
  confirm_add_route: { role: 'inline-icon', icon: 'check', iconSize: 14, title: 'Add This Route', w: 'Icon' },
  cancel_add_route: { role: 'inline-icon', icon: 'x', iconSize: 14, title: 'Cancel', w: 'Icon' },
  fetch_xpub: { role: 'inline-icon', icon: 'plus', iconSize: 14, title: 'Fetch Xpubs From the Device', w: 'Icon' },
  register_account: { role: 'default', label: 'Register', w: 'M' },
  fetch_this_xpub: { role: 'primary', label: 'Fetch Xpub', w: 'M' },
  camera_settings: { role: 'inline-icon', icon: 'settings', iconSize: 16, title: 'Camera Settings', w: 'Icon' },
  open_file: { role: 'primary', label: 'Open File…', icon: 'folder', iconSize: 16, w: 'L' },
  copy_value: { role: 'inline-icon', icon: 'copy', iconSize: 14, title: 'Copy', w: 'Icon' },
  copied_value: { role: 'inline-icon', icon: 'check', iconSize: 14, title: 'Copied', w: 'Icon' },
  /* kit-only (dev chrome, not ported to Qt) */
  kit_skip_scan: { role: 'default', label: 'Simulate Scan', icon: 'chevron_right', iconSize: 14, w: 'L' },
  /* screens */
  scan_plugins: { role: 'default', label: 'Scan for Plugins', icon: 'refresh', iconSize: 14, w: 'XL' },
  scanning_plugins: { role: 'default', label: 'Scanning…', icon: 'refresh', iconSize: 14, w: 'XL' },
  disable_plugin: { role: 'destructive', label: 'Disable Plugin', w: 'L' },
  add_key: { role: 'primary', label: 'Add Key', w: 'M' },
  broadcast: { role: 'primary', label: 'Broadcast', w: 'M' },
  check_address: { role: 'primary', label: 'Check', w: 'M' },
  continue: { role: 'primary', label: 'Continue', w: 'M' },
  create: { role: 'primary', label: 'Create', w: 'M' },
  done: { role: 'primary', label: 'Done', w: 'M' },
  get_descriptor_hot: { role: 'primary', label: 'Get Descriptor', w: 'L' },
  get_xpub_hot: { role: 'primary', label: 'Get Xpub', w: 'L' },
  load_signed_psbt: { role: 'primary', label: 'Load Signed PSBT…', icon: 'upload', iconSize: 16, w: 'XL' },
  next_scan_the_answer: { role: 'primary', label: 'Next: Scan the Answer', w: 'XL' },
  ok: { role: 'primary', label: 'OK', w: 'M' },
  pick_another_file: { role: 'primary', label: 'Pick Another File…', icon: 'upload', iconSize: 16, w: 'XL' },
  proceed: { role: 'primary', label: 'Proceed', w: 'M' },
  register: { role: 'primary', label: 'Register', w: 'M' },
  save_settings: { role: 'primary', label: 'Save Settings', w: 'L' },
  save_unsigned_psbt: { role: 'primary', label: 'Save Unsigned PSBT…', icon: 'download', iconSize: 16, w: 'XL' },
  seal_key: { role: 'primary', label: 'Seal Key', w: 'M' },
  show_mnemonic: { role: 'primary', label: 'Show Mnemonic', w: 'L' },
  sign: { role: 'primary', label: 'Sign', w: 'M' },
  sign_hot: { role: 'primary', label: 'Sign', w: 'M' },
  try_again: { role: 'primary', label: 'Try Again', w: 'M' },
  unlocking: { role: 'primary', label: 'Unlocking…', w: 'M' },
  add_a_key: { role: 'default', label: '+ Add a Key', w: 'M' },
  add_payment: { role: 'default', label: '+ Add Payment', w: 'L' },
  clear: { role: 'default', label: 'Clear', w: 'M' },
  cancel_signed: { role: 'destructive', label: 'Cancel', w: 'M' },
  connect_blindbit: { role: 'default', label: 'Connect Blindbit', w: 'L' },
  connect_electrum: { role: 'default', label: 'Connect Electrum', w: 'L' },
  generate: { role: 'default', label: 'Generate', w: 'M' },
  generate_new: { role: 'default', label: 'Generate New', icon: 'refresh', iconSize: 15, w: 'L' },
  get_segwit: { role: 'default', label: 'Segwit', w: 'M' },
  get_silent_payment: { role: 'default', label: 'Silent Payment', w: 'L' },
  get_taproot: { role: 'default', label: 'Taproot', w: 'M' },
  open: { role: 'default', label: 'Open', w: 'M' },
  open_keys_tab: { role: 'default', label: 'Open Keys Tab', w: 'L' },
  reveal_mnemonic: { role: 'default', label: 'Reveal Mnemonic', icon: 'eye', iconSize: 16, w: 'XL' },
  save: { role: 'default', label: 'Save', w: 'M' },
  scan_again: { role: 'default', label: 'Scan Again', w: 'M' },
  test: { role: 'default', label: 'Test', w: 'M' },
  test_ok: { role: 'default', label: '✓ Test', w: 'M' },
  testing: { role: 'default', label: 'Testing…', w: 'M' },
  delete: { role: 'destructive', label: 'Delete', w: 'M' },
  remove_key: { role: 'destructive', label: 'Remove Key', w: 'M' },
  add_label: { role: 'inline', label: 'Add a Label', icon: 'plus', iconSize: 14, w: 'Auto' },
  awaiting_payment: { role: 'inline', label: 'Addr. awaiting payment ({n})', args: true, w: 'Auto' },
  hide_words: { role: 'inline', label: 'Hide Words', icon: 'eye_off', iconSize: 14, w: 'Auto' },
  show_words: { role: 'inline', label: 'Show Words', icon: 'eye', iconSize: 14, w: 'Auto' },
  copied: { role: 'icon', icon: 'check', iconSize: 20, title: 'Copied', w: 'IconLg' },
  copy_address: { role: 'icon', icon: 'copy', iconSize: 20, title: 'Copy Address', w: 'IconLg' },
  delete_wallet: { role: 'icon', icon: 'trash', iconSize: 20, title: 'Delete wallet', w: 'IconLg' },
  verify_on_device: { role: 'icon', icon: 'usb', iconSize: 20, w: 'IconLg' },
  settings_gear: { role: 'inline-icon', icon: 'settings', iconSize: 16, title: 'Settings', w: 'Icon' },
  copied_sm: { role: 'inline-icon', icon: 'check', iconSize: 15, title: 'Copied', w: 'Icon' },
  copy_sm: { role: 'inline-icon', icon: 'copy', iconSize: 15, title: 'Copy', w: 'Icon' },
  dismiss_notice: { role: 'inline-icon', icon: 'x', iconSize: 14, title: 'Dismiss', w: 'Icon' },
  edit_label: { role: 'inline-icon', icon: 'pencil', iconSize: 14, title: 'Edit label', w: 'Icon' },
  edit_label_row: { role: 'inline-icon', icon: 'pencil', iconSize: 15, w: 'Icon' },
  move_down: { role: 'inline-icon', icon: 'arrow_down', iconSize: 14, title: 'Move Down', w: 'Icon' },
  move_up: { role: 'inline-icon', icon: 'arrow_up', iconSize: 14, title: 'Move Up', w: 'Icon' },
  remove_payment: { role: 'inline-icon', icon: 'x', iconSize: 16, title: 'Remove Payment', w: 'Icon' },
  remove_route: { role: 'inline-icon', icon: 'trash', iconSize: 14, w: 'Icon' },
  remove_xpub: { role: 'inline-icon', icon: 'x', iconSize: 14, w: 'Icon' },
  save_label: { role: 'inline-icon', icon: 'check', iconSize: 15, title: 'Save', w: 'Icon' },
  verify_on_device_sm: { role: 'inline-icon', icon: 'usb', iconSize: 15, w: 'Icon' },
  open_wallet: { role: 'tab-open', label: '(wallet name)', dataLabel: true, w: 'LaunchEntry' },
  create_new_wallet: { role: 'tab-create', label: '+ Create New Wallet', w: 'LaunchAdd' },
};

/* Btn — a catalog button. `label` only for entries marked dataLabel (the text is
   data, e.g. a wallet name); `args` fills {n} in templated labels. */
export function Btn({ id, label, args, ...rest }) {
  const b = BUTTONS[id];
  if (!b) { console.warn('Btn: unknown id ' + id); return null; }
  const text = b.dataLabel ? label : b.args ? String(b.label).replace('{n}', args) : b.label;
  const wc = b.w && b.w !== 'Auto' ? 's-btn--w-' + b.w.toLowerCase() : '';
  return <Button role={b.role} icon={b.icon} iconSize={b.iconSize} title={rest.title || b.title} {...rest}
    className={[wc, rest.className].filter(Boolean).join(' ')}>{text || null}</Button>;
}

/* PillWidth — the ONLY pill widths (px). Every PILLS entry names one in `w`: M by
   default; a label that cannot fit steps up to L. A family that shares a list
   column (device_*, key_*, signer_*…) shares one width. Auto only for data labels. */
export const PILL_WIDTH = { M: 110, L: 140, Auto: null };

export const PILLS = {
  device_ready: { tone: 'success', label: 'Ready', w: 'M' },
  device_locked: { tone: 'warning', label: 'Locked', w: 'M' },
  device_unsupported: { tone: 'error', label: 'Unsupported', w: 'M' },
  key_connected: { tone: 'success', label: 'Connected', w: 'M' },
  key_hot: { tone: 'success', label: 'Hot Key', w: 'M' },
  key_offline: { tone: 'off', label: 'Offline', w: 'M' },
  account_registered: { tone: 'success', label: 'Registered', w: 'M' },
  signer_first: { tone: 'success', label: 'Signs First', w: 'L' },
  signer_ready: { tone: 'success', label: 'Ready', w: 'L' },
  signer_signed: { tone: 'success', label: 'Signed', icon: 'check', w: 'L' },
  signer_waiting: { tone: 'off', label: 'Waiting', w: 'L' },
  signer_disconnected: { tone: 'warning', label: 'Not Connected', w: 'L' },
  signer_no_hot: { tone: 'warning', label: 'No Hot Secret', w: 'L' },
  signer_no_route: { tone: 'error', label: 'No Usable Route', w: 'L' },
  signer_unregistered: { tone: 'error', label: 'Not Registered', w: 'L' },
  sd_step_done: { tone: 'success', label: 'Done', w: 'M' },
  tx_signed: { tone: 'success', label: 'Signed', icon: 'check', w: 'M' },
  network: { tone: 'neutral', label: '(network)', dataLabel: true, w: 'Auto' },
  xpub_used: { tone: 'success', label: 'Used', w: 'M' },
  xpub_unused: { tone: 'off', label: 'Not Used', w: 'M' },
  plugin_unloading: { tone: 'off', label: 'Unloading…', w: 'L' },
};

/* Pill — a catalog status pill, always at its PillWidth (label centred). */
export function Pill({ id, label }) {
  const p = PILLS[id];
  if (!p) { console.warn('Pill: unknown id ' + id); return null; }
  return <Badge tone={p.tone} icon={p.icon} width={p.w}>{p.dataLabel ? label : p.label}</Badge>;
}

Object.assign(window, { BTN_WIDTH, BUTTONS, Btn, PILL_WIDTH, PILLS, Pill });

/* File-level namespace (DS compiler indexes this file as `Variants`). */
export const Variants = { Btn, Pill };
