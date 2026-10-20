# Keys and signing — handoff note

Working note for issue #1. Each PR adds its section. Surfaces, new components and open
questions for the keys, signer and device flows are added as those flows land.

---

## 0. Token alignment (section 7)

Source of truth: `pythcoiner/silent` `src/theme/Palette.h` and `Palette.cpp` (master,
`7d77070`). Every color role (light and dark), raw color constant, type size, radius,
metric, Size, Spacing and Padding value was checked against them: 159 values, no
mismatch left.

### One copy

- `colors_and_type.css` and `components.css` at the root are the only copies.
  `ui_kits/silent/index.html` loads them (`../../colors_and_type.css`,
  `../../components.css`).
- Removed from `ui_kits/silent/`: `colors_and_type.css`, `components.css`, and the
  `fonts/` and `assets/` folders, which only that copy of the stylesheet used.

### Tokens without an app counterpart (design only)

Kept because a kit component needs them; each is commented "design only, not in the
app" in `colors_and_type.css`.

| Token | Value | Used by |
|---|---|---|
| `--tx-grad-0` | `#7c5cf0` | `TxFlow.jsx` gradient |
| `--tx-grad-1` | `#3d8bf0` | `TxFlow.jsx` gradient |
| `--tx-grad-2` | `#8a5cf0` | `TxFlow.jsx` gradient |
| `--camera-bg` | `#0c0e13` | `Send.jsx` PSBT scanner viewport |
| `--wizard-rule-w` | `40px` | `WizardSteps`: the fixed rule between steps, trail centred |
| `--modal-wizard-h` | `640px` | `Modal height="wizard"`: every step of Create Multikey Account (`Musig.jsx`) |

### `.s-tab` and `.s-check--sm` against the app

`--tab-handle-w` is design only: the kit gives `[+]` and the settings gear the same width. Qt reads the launcher tab's measured width for the gear.

- `.s-tab` (vs `src/catalog/containers/Tab.cpp`):
  - padding was `6px 14px`; the app uses `Padding::XS` × `Padding::M` = 6 × 15. Now
    `var(--pad-xs) var(--pad-m)`.
  - the app lifts an unselected tab to `surfaceHover` on hover; the kit had no hover.
    Added.
  - margin (`Spacing::XXS`), radius (`radius::TAB` 4), font size (`BODY`), colors:
    already matched.
  - the 8px gap before the close glyph is design only: Qt draws its own close button.
- `.s-check--sm` (15px box): design only. The app has one checkbox size,
  `CHECKBOX_BOX` 18 (`--checkbox-box`). Kept for dense kit lists; marked in
  `components.css`.

### App values to discuss (not changed here)

- `radius::MENU`, `radius::COMBO` (8) and `radius::TAB` (4) have no tokens of their
  own; they reuse `--radius-button` and `--radius-inline-icon`, which hold the same
  values.

---

## 1. Keys, signer and device flows (issue #2)

All of §3 ships in one PR. Galleries: `kit/keys.html` (§3.1–3.6, 3.11) and
`kit/signing.html` (§3.7–3.10). Every state is its own gallery item.

### Routes

The first route is the primary; order alone shows it (no Primary pill). Move up /
down with vertical arrows; the last row adds a route: `+` in the remove column
opens a kind picker in the row and becomes ✓ to confirm, × cancels.

### Cached xpubs

Each row: path (mono), the xpub shortened as plain text (`tpubDCtK…xPt1P`, full value
as tooltip) with a copy button (`ShortValue`), and a Used / Not Used pill. A last `+` row (like Routes)
opens **Fetch Xpub** in its own modal over the key detail: path type (BIP84 / 86 / 49 /
48 / 87 / custom) and the path with the account index as its only input
(`m/84'/1'/[ ]'`, 0–99); BIP48 also picks the script type, the last level
(`2'` P2WSH, `1'` P2SH-P2WSH, or `3'` P2TR — not in BIP48, but the convention
for Taproot multisig), then fetches from the key's device; disabled with the reason
when no device with that fingerprint is connected.

### Registered accounts

The key detail lists the **accounts** using the key, not descriptor strings: account
name · module · `Registered` pill, or a `Register` button (registers the account's
descriptor on the key's device; disabled with the reason when it isn't connected).

### Modal rule

Every modal and every step inside one ends with a single `ModalActions` button
bar (Back on the left, disabled reason, secondary buttons, primary last). No modal
hand-rolls its button row; Qt maps it to one footer widget.


One modal at a time. Each flow is a single `<Modal>` whose content is replaced
step by step: `KeyDetail` (detail → password → reveal / remove), `AddKeyModal`
(mode → mode step → hot key steps), `SigningFlow` (picker → route step → verify
result). When a flow starts from another
modal (verify from the previous-addresses list, fetch descriptor from Create
Account), the caller renders the flow **in place of** its own modal and gets its
state back on return.

### Surfaces

| § | Surface | File | Gallery |
|---|---|---|---|
| 3.1 | Keys tab (first, non-closable) | `Keys.jsx` `KeysScreen`; wired in `App.jsx` | keys · 3.1, Device rows, Key rows |
| 3.2 | Device detail — **removed per review**; registering is `RegisterDeviceModal` | `Keys.jsx` | keys · Device rows |
| 3.3 | Key detail, remove | `Keys.jsx` `KeyDetail`, `RouteTable`, `RemoveKeyConfirm` | keys · 3.3 |
| 3.4 | Add a key | `AddKey.jsx` `AddKeyModal` | keys · 3.4 |
| 3.5 | Hot key steps | `AddKey.jsx` (steps `hot-*`) | keys · 3.5 |
| 3.6 | Password step, mnemonic reveal | `Keys.jsx` `PasswordStep`, `RevealMnemonic` | keys · 3.6 |
| 3.7 | Signer picker | `Signing.jsx` `SignerPicker` | signing · 3.7 |
| 3.8 | USB, SD, QR display, camera, hot key steps | `Signing.jsx` `UsbStep`, `SdStep`, `QrDisplayStep`, `CameraStep`, `HotStep`; `SigningFlow` drives them | signing · 3.8 |
| 3.9 | Send integration | `Send.jsx` (Sign opens `SigningFlow`, returns to Signed → Broadcast) | signing · 3.9 |
| 3.10 | Verify result, SP note | `Signing.jsx` `VerifyResult`; `ScreensBasic.jsx` `SpVerifyNote`, `AddressRow`, `PrevAddressesModal` | signing · 3.10 |
| 3.11 | Create account from a key | `MenuTab.jsx` `CreateAccount`, `EndpointRow` | keys · 3.11 |

Context copy for sign / verify / fetch lives in one table, `FLOW_COPY`
(`Signing.jsx`). No "transaction" wording outside the sign context; sealing a hot
key says "Sealing", never "Signing".

### Replaced

`SelectSigner`, `UsbConfirm`, `SdPicker`, `ScanPsbt`, `ScanCamera` (`Send.jsx`)
and `VerifyAddress` (`ScreensBasic.jsx`) are removed. Their content now lives in
the route steps above, without their own `<Modal>`, so the flow can swap them in
one modal. `SIGNER_DEVICES` is replaced by `SIGNING_PLAN` / `VERIFY_PLAN` in
`Data.jsx`.

### New components and states (catalog)

| Component | File | Card |
|---|---|---|
| `SelectRow` — new `selected`, `disabled`, static, `sub`, `status`, `trailing` | `Primitives.jsx`, `.s-select-row.is-*` | `components-select-row` |
| `Notice` (error · warning · success · info) | `Primitives.jsx`, `.s-notice` | `components-notice` |
| `CopyField` | `Widgets.jsx`, `.s-copy-field` | `components-copy-field` |
| `WordGrid` (shown · hidden) | `Widgets.jsx`, `.s-word-grid` | `components-word-grid` |
| `ScanProgress` | `Widgets.jsx`, `.s-scan-progress` | `components-scan-progress` |
| `RouteIcons` + `ROUTE_KINDS` | `Widgets.jsx` | `components-route-icons` |
| `SectionHeader` | `Widgets.jsx` | `components-route-icons` |
| `ModalActions` (footer with disabled reason) | `Widgets.jsx` | `components-route-icons` |
| `ScrollArea` (list region; edge lines only while it overflows) | `Widgets.jsx` | keys · 3.1 |
| `FieldNote` (help / error / success line aligned under a `Field` control) | `Widgets.jsx` | keys · 3.3, 3.4 |
| `EmptyState` (empty list / section block) | `Widgets.jsx` | keys · 3.1, 3.11 |
| `FoldChevron` (shared by `FoldSection` and foldable `SectionHeader`) | `Widgets.jsx` | keys · 3.1 |
| `Input grow` (fills the free space of its `Field` / `Row`) | `Primitives.jsx` | — |
| Tab strip end slot | `.s-tabstrip`, `.s-tabstrip__end` | keys · 3.12 |

Icons added to `ICON_PATHS` (Lucide): `key`, `arrow_up`, `arrow_down`, `eye`,
`eye_off`, `alert`, `info`, `lock`, `circle_check`, `circle_x`, `chevron_left`.

**One icon per route kind**, everywhere: Hot Key `key`, USB `usb`, QR Code `qr`,
SD Card `sd_card`. Route reordering uses `arrow_up` / `arrow_down`.

### Widths

Existing widths reused where they fit: 520 (USB, hot key, verify result, register as key), 560
(picker, SD, settings). New: **600** (key detail, add a key — the
descriptor and xpub rows need it), **620** (create account), **640** (QR display
and camera, down from 860 / 920 so they sit with the picker in one modal; the QR
is 400px).

### Button widths

Every button names a width from the `BtnWidth` enum (`Variants.jsx` `BTN_WIDTH`,
tokens `--btn-w-*`): Icon 30 · IconLg 50 · Index 60 · **M 120 (default for text
buttons)** · L 160 · XL 200 · XXL 260 · LaunchEntry 300 · LaunchAdd 354 · Auto.
Only a label that can't fit M steps up. Design only; Qt: `setFixedWidth`.

### Pill widths

Every pill names a width from the `PillWidth` enum (`Variants.jsx` `PILL_WIDTH`,
tokens `--pill-w-*`): **M 110 (default)** · L 140 · Auto (data labels only). A family
sharing a list column shares one width: device / key / route / SD / tx pills are M;
signer and descriptor pills are L ("No Usable Route" needs it). Design only.

### Tokens needed, not added

None added. Literal values that may want a token:

- `.s-scan-progress__seg` height 6px.
- The camera overlay text uses `--gray-10` / `--gray-40` directly (it sits on
  `--camera-bg`, which does not change with the theme).
- Selected-row tint: `color-mix(accent 10%, surface)`; the app has no
  equivalent alpha yet.

### App values to change (proposed)

- **Success colour** (option E of `scrap/Status Colors.html`): Ready (success
  green) and Locked (warning yellow) pills read too alike. The kit maps `--success`
  to a new teal: `--teal-dark` `#12857a` (light) and `--teal` `#2fc2b0` (dark),
  instead of `GREEN_DARK` `#28a028` / `GREEN` `#50be50`. Warning stays yellow. The
  app should add `TEAL` / `TEAL_DARK` to `Palette.h` and point the palettes'
  success role at them. `--green*` stay as they are.
- **Off badge** (`.s-badge--off`): a new outline-only, muted pill for unavailable
  states: Offline, Waiting, Not Registered (descriptor), and every pill inside a
  disabled row. The app has no badge for this yet.

### Placement I would change

- **Network in Create Account** sits right after the name, before the key
  picker, because the key list is filtered by it. §3.11 lists it after the key.
- **Keys tab** is delivered as asked (first tab). It could also live in the
  settings gear or the `+` menu tab, since users visit it rarely after setup.

### Open questions

1. **Key reachability**: the row pill reads Connected (matching USB device ready),
   Hot Key (hot secret on this computer), or Offline. All list pills share one
   fixed width (110). Should a hot key that also has a connected device read
   Connected instead?
2. **Multi-key plans**: after the SP key signs, waiting rows become Ready and
   the picker returns for the next key. Should the next key be started
   automatically instead?
3. **Verify over QR**: the kit offers USB and QR for Segwit / Taproot
   verification. Does the QR protocol verify those, or only USB?
4. **Removing the last route**: disabled ("A key needs at least one route"). Is
   a key with no route allowed?
5. **Fetch descriptor over USB**: §3.11 says only QR and hot keys can return
   one. Keys with only USB / SD routes are shown disabled with that reason.
6. **Register action and no device detail**: per review there is no device
   detail modal (§3.2 Info and Get Xpub are dropped). An unregistered ready
   device shows a `+` glyph; clicking the row opens **Register as Key**
   (`RegisterDeviceModal`, confirmation + optional alias). A device already
   registered as a key looks disabled; locked / unsupported devices are
   informational rows. §3.1 asked for a labelled action, not an icon-only `+`.
   Confirm both with the issue author.
7. **App settings**: §3.12 moved to #4 — see `## 2. Global Settings` below.

---

## 2. Global Settings (issue #4)

Gallery: `kit/settings-global.html`. File: `ui_kits/silent/GlobalSettings.jsx`.

- **Entry point**: `SettingsGear` (tooltip "Settings") in the tab strip's fixed end slot
  (`.s-tabstrip__end`); the tabs scroll in their own area, so they never pass under it.
- **Modal** `GlobalSettingsModal`, width 1040, title "Settings" once (no page title).
  The body scrolls between the pinned header and the `ModalActions` bar.
  - **General**: Theme (Light, Dark, then themes from running plugins, with a
    "Provided by …" note) and Language. Both apply immediately. **Decision**: a
    language change shows one inline "Language saved. Restart Silent to apply it
    everywhere." note; "Language applied." is not used.
  - **Plugin Manager**: Scan for Plugins (Scanning… while running), one `PluginRow`
    per plugin: name, description (not the raw id), `id  vX.Y.Z` in mono, enable
    toggle. States: none found, registry unavailable, scanning, scan result (only when something new was found),
    failed to load (error row tone + reason, no pill, no toggle), unloading, disable refused (stays enabled,
    error notice).
  - **Disabling** asks first (the content is replaced by a confirmation) and names
    the open accounts that will close and the themes that will go.
  - **Folding**: all three sections fold (default open); a
    folded Plugin Manager hides its Scan button.
  - **Extension Settings**: hidden when no module registers one. Open replaces the
    list with the module's section in the same modal (title = section, Back "All
    Settings", Done). The kit draws only the frame; the module draws the content.
- **Kit toolbar Light/Dark switch removed**: theme now comes from this modal. Module
  themes render on the light palette in the kit (Midnight on dark).
- **New**: `PluginRow` (card `components-plugin-row`), `Toggle disabled`, icon
  `puzzle`, buttons `settings_gear` / `scan_plugins` / `scanning_plugins` /
  `disable_plugin`, pill `plugin_unloading`, `SelectRow tone="error"`.
- **Labels** use `--form-label-w` (130), not the old fixed 150 column.
- **Not done**: fixed 640 height. The modal grows with its content up to 90% of the
  window and scrolls inside; open question whether a fixed height is wanted.
