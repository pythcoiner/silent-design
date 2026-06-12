# Silent — Design System

**Silent** is a privacy-focused **desktop Bitcoin wallet** built around the
[Silent Payments](https://silentpayments.xyz) protocol (BIP-352). It lets a user
publish a single static **silent payment address** and receive unlinkable
payments to it — without the on-chain address reuse that normally erodes privacy.

This design system captures the look, feel, tone, and component vocabulary of the
Silent desktop application so that new interfaces, mockups, decks, and prototypes
can be produced on-brand and pixel-accurate.

---

## Product context

Silent is a **native desktop GUI**, not a web app:

```
Qt6 GUI (C++)  --CXX FFI-->  Rust Backend (bwk-sp)
                                   |
                              Scanner Thread
                                   |
                              BlindBit Server
```

- **C++ / Qt6** — Desktop GUI built on pythcoiner's own
  [`qontrol`](https://github.com/pythcoiner/qontrol) widget framework. Uses Qt's
  **Fusion** style as a base, then layers a custom `QPalette` + per-widget QSS
  (see `src/theme/`).
- **Rust** — Wallet logic via [`bwk-sp`](https://github.com/pythcoiner/bwk)
  (Bitcoin Wallet Kit – Silent Payments).
- **CXX** — FFI bridge between the two languages.
- Connects to a **BlindBit oracle** (silent-payment tweak server) for scanning,
  plus an optional **Electrum** server.
- Networks supported: Regtest, Signet, Testnet, Bitcoin (mainnet).

Because it's a desktop tool, the UI is **dense, compact, and information-first** —
tables of coins and transactions, monospace addresses, small fonts, tight spacing.
It looks like a power-user financial/engineering tool, not a consumer fintech app.

### App structure (what a user sees)

- **Window** — `1024×768`, titled *"Silent - Silent Payments Wallet"*. A
  `QTabWidget` with **closable, movable tabs**: one tab per open wallet, plus a
  trailing **`+`** tab (the *Menu*) that can never be closed.
- **Menu tab** — centered wordmark title, a prominent **`+ Create New Wallet`**
  button, and a list of existing wallets (each: an open button + a trash icon).
- **Account view** (per wallet) — a left **sidebar** (200px) of icon menu items:
  *History · Coins · Send · Receive*, with *Settings* pinned to the bottom. The
  right side swaps between those five screens. A two-part **status bar** is pinned
  to the very bottom (BlindBit connection on the left, Electrum on the right, each
  with a colored toggle).
- **Screens**
  - **History** — table: *Direction · TxID · Height · Amount*, with Confirmed /
    Unconfirmed balance summary rows above.
  - **Coins** (UTXOs) — table: *Type · Height · OutPoint · Label · ✎ · Value*.
    Labels are inline-editable via the pencil button.
  - **Send** — recipient rows (address + amount + MAX), a fee control that toggles
    between absolute `sats` and a `sats/vb` rate, and a coin-selection panel
    (auto or manual). Inline ✓/✗ validation indicators.
  - **Receive** — the big copyable silent-payment address; optionally Segwit /
    Taproot sub-addresses with Generate / Copy.
  - **Settings** — BlindBit URL, Electrum server (each with a *Test*
    button), network selector, and read-only backend info.
- **Modals** — *Create Account* (name, mnemonic + Generate, network, endpoints),
  *Confirm Send* (recipient/fee/txid review → broadcasting → result), and
  *Confirm Delete*.

---

## Sources

This system was reverse-engineered from the **actual GUI source code** (the source
of truth), not screenshots:

- **GitHub:** <https://github.com/pythcoiner/silent> — the desktop wallet. The
  design lives in `src/theme/` (palette + QSS), `src/screens/` (the five screens
  + modals), and `src/resources/` (embedded fonts + Lucide icons).
- **Framework:** <https://github.com/pythcoiner/qontrol> — the Qt widget toolkit
  (Row/Column layout helpers, ToggleSwitch, Modal, Panel, Window).
- **Backend:** <https://github.com/pythcoiner/bwk> (`bwk-sp`).

> Readers with access should explore `pythcoiner/silent` (especially
> `src/theme/Palette.h`) and `pythcoiner/qontrol` directly to build even more
> faithful designs.

---

## CONTENT FUNDAMENTALS

How Silent writes copy. The voice is that of a **terse, precise engineering tool** —
no marketing, no hand-holding, no personality fluff.

- **Tone:** neutral, technical, matter-of-fact. It states what a thing *is* and
  what *just happened*. There is no brand "voice," jokes, or encouragement.
- **Person:** almost entirely **impersonal**. Labels are bare nouns
  (`BlindBit URL:`, `Network:`, `Mnemonic:`). No "you," no "we,"
  no "your wallet." Status messages are impersonal present-progressive:
  *"Scanning…"*, *"Connecting…"*, *"Broadcasting…"*, *"Disconnected"*.
- **Casing:** **Title Case for buttons and section/field labels**
  (`Create`, `Generate`, `Test`, `Save Settings`, `Add an Output`, `Backend Info:`,
  `Select Inputs`). **Sentence case for sentences** and error bodies
  (*"Transaction is not valid"*, *"BlindBit URL cannot be empty."*,
  *"No account loaded"*). Field labels end with a **colon**.
- **Buttons** are imperative verbs, short: `Send`, `Copy`, `Generate`, `Test`,
  `Save Settings`, `Connect Blindbit`, `Disconnect Electrum`, `Clear`,
  `+ Add an Output`, `+ Create New Wallet`, `Confirm`, `Cancel`, `OK`. Note the
  literal **`+ ` prefix** on create/add buttons.
- **Status strings** are concrete and include live data:
  *"Connected to blindbit-oracle at {url}"*, *"Scanning… 812043 / 812519 • ~3m 20s"*,
  *"Synced at block {h} • Watching…"*, *"Error: {message}"*. The bullet `•` and a
  tilde `~` for ETAs are recurring devices.
- **Errors / modals** use a short **Title Case title** + a plain sentence-case body:
  `Connection Failed` → *"Failed to connect to backend:\n{error}"*;
  `Network Mismatch` → *"Backend network is Signet but account network is Bitcoin"*.
- **Domain vocabulary is used plainly, never simplified:** *OutPoint, TxID, PSBT,
  sats, sats/vb, Segwit, Taproot, mnemonic, dust filter, tweaks, BlindBit, Electrum,
  confirmed/unconfirmed, coin selection, MAX*. The audience is assumed to
  be Bitcoin-literate.
- **Numbers:** amounts render as Bitcoin with **8 decimals** + ` BTC` (e.g.
  `0.00200000 BTC`); fee rates as `sats/vb`; heights as raw integers; addresses and
  txids/outpoints are **truncated in the middle** (`abc123…def456`) and shown in
  **monospace**.
- **No emoji.** The only non-text glyphs are the validation marks **✓ / ✗**
  (green/red) and bullet `•` separators. Everything else is a Lucide line icon.

---

## VISUAL FOUNDATIONS

The Silent aesthetic is **flat, neutral, and utilitarian** — a desktop Fusion-style
app, deliberately undecorated. Think "native tool," not "designed product."

### Color
- **Two equal themes**, Light (default) and Dark, generated from one neutral gray
  ramp (`GRAY_4 … GRAY_95`) plus four hues. See `colors_and_type.css`.
- **Light** (default): page `#f5f5f5`, cards/inputs pure white `#ffffff`, secondary
  surfaces `#ebebeb`, text near-black `#1e1e1e`. Accent is a **muted blue** `#3278c8`.
- **Dark:** page `#1e1e1e`, surfaces step up in 10-unit gray increments
  (`#282828 → #323232 → #3c3c3c`), text `#e6e6e6`. Accent brightens to `#508cdc`.
- **Semantic hues are used sparingly and only functionally:** blue = primary action
  / focus / selection, green = success / connected / valid, red = error / destructive
  / disconnected, yellow = warning. Hues darken slightly in light mode for contrast.
- **No gradients, no tints, no color washes.** Backgrounds are solid flat grays.
  The status-bar toggles are the one place color carries state (green=on, red=off).

### Type
- **One typeface: Noto Sans** (embedded in the binary), plus a **monospace** for all
  addresses, outpoints, txids, and amounts.
- Compact desktop scale (Qt pt → px): title `29`, heading `21`, subheading `19`,
  section `15`, **body `13`**, caption/status `11`. Only **two weights**: Normal (400)
  and DemiBold (600). DemiBold is reserved for titles, headings, and section labels.
- Mono is load-bearing: any cryptographic string or amount is monospace so columns
  align and digits don't wobble.

### Spacing & layout
- Driven by small fixed token enums — Spacing `2/5/10/20/30/60/120`, Padding
  `2/6/10/15/20/30/50`, and Size widths `50/100/150/200/300/400/600/1000`.
- Layout is built from **Row / Column helpers with explicit spacers** (qontrol),
  not a fluid grid. Screens are **left-aligned**, content sits in fixed-width
  columns, and a trailing flexible spacer pushes everything to the top-left.
- **Fixed chrome:** the 200px sidebar and the 30px bottom status bar are pinned;
  the center screen scrolls (tables live in scroll areas). Forms (Settings, Create
  Account) are centered within their pane.
- Tables = header row of muted **InfoLabel** cells over fixed-width columns, rows of
  read-only **Display** fields, all inside a vertical scroll area.

### Borders, corners, elevation
- **Corners are small and consistent:** 6px (inputs, displays, inline buttons), 8px
  (buttons, menu items, combobox), 4px (icon buttons, tab tops, checkboxes).
- **1px solid borders** define nearly everything (`--border` / `--input-border`).
  Focus = the border recolors to blue (`--input-focus`); there is **no glow ring**.
- **No shadows.** This is a flat Fusion app — elevation is communicated by the gray
  ramp (a "card" is just a lighter/whiter surface with a 1px border), not by drop
  shadows. The one exception: native combobox/menu popups are masked to an 8px
  rounded rect.
- **No blur, no transparency, no protection gradients.** Solid fills throughout.

### Motion & states
- **Essentially no animation.** No transitions, fades, bounces, or easing curves are
  defined in the theme — state changes are instant (Qt default). Treat motion as
  *off*; at most use a near-instant (≤120ms) color change if a web recreation needs
  one.
- **Hover:** backgrounds lift one step up the gray ramp
  (`--bg-secondary → --surface-hover`). Primary buttons hover to `--accent-hover`.
  Checkboxes show a blue border on hover.
- **Pressed:** backgrounds drop *down* the ramp toward `--bg` (a subtle darken);
  primary buttons settle back to base `--accent`. No scale/shrink transform.
- **Disabled:** text → `--text-muted`, borders → `--border-light`, primary fills →
  `--border-light`. Inputs that are locked (e.g. while scanning) also gray their bg.
- **Selection/checked:** blue. Checkbox fills solid `--accent` with a white check;
  selected tab takes the page `--bg` color and full-contrast text.

### Imagery
- **There is none.** Silent ships **no photography, illustration, logo image, or
  decorative graphics** — the entire UI is type, 1px borders, flat gray fills, and
  Lucide line icons. Any imagery added for marketing should stay consistent with the
  restrained, technical, monospace-flavored tone (think terminal / blockchain
  explorer aesthetics, cool neutral grays), never glossy fintech gradients.

---

## ICONOGRAPHY

- **Icon set: [Lucide](https://lucide.dev/icons)** — the *entire* set is fetched and
  embedded (`src/resources/fetch_icons.sh` clones `lucide-icons/lucide` and generates
  one C++ header per SVG), but **only icons actually `#include`d ship** in the binary.
- **Style:** Lucide defaults — **stroke-only line icons, `stroke-width: 2`,
  `stroke-linecap/linejoin: round`, 24×24 viewBox, `fill: none`.** Icons inherit the
  current text color (`stroke="currentColor"` is swapped for the palette color at
  render time), so they're monochrome and theme-aware.
- **Rendering:** SVGs are recolored to `--text` and sized to **24px** (sidebar menu
  icons are shown at 20px; inline/combobox glyphs ~10–12px). Stroke width is a theme
  token (`--icon-stroke`).
- **Icons used in the app** (and shipped in `assets/icons/`):
  `history` (History), `coins` (Coins), `upload` (Send), `download` (Receive),
  `settings` (Settings), `trash-2` (delete wallet), `pencil` (edit label),
  `x` (close / delete output / tab close), `chevron-down` (combobox).
- **Extras** copied for design work (same Lucide family — use freely): `copy`,
  `bitcoin`, `shield`, `check`, `plus`, `lock-open`, `eye-off`, `wallet`, `server`,
  `network`, `chevron-left`.
- **No icon font, no emoji, no PNG/raster icons, no unicode-glyph icons.** The only
  unicode marks are the validation **✓ (U+2713)** and **✗ (U+2717)**, colored green
  and red respectively, and the **• (U+2022)** bullet in status text.
- **To add an icon for a design:** grab it from <https://lucide.dev/icons> (filename
  on the site maps directly: `arrow-right` → `arrow_right`), keep stroke-width 2, and
  recolor via `currentColor`. Don't hand-draw icons or mix in another icon family.

---

## Brand / logo

Silent ships **no logo image** in the repository — its identity is the plain wordmark
*"Silent"* (Noto Sans DemiBold) and the full product name *"Silent - Silent Payments
Wallet"*. This design system therefore **introduces an original logo** in Silent's own
restrained, flat, geometric idiom — see `assets/logo-mark.svg` and the *Brand —
Wordmark* card.

**The mark:** a **solid center dot inside a privacy ring with a stealth notch**. The
dot is the single *static silent-payment address*; the broken ring around it is the
*silent / unlinkable* concealment the protocol provides. It's flat, drawn purely from
circles (no gradients, no shadows — consistent with the app), monochrome-friendly
(everything is `currentColor`), and tuned to the muted-blue accent.

**Lockups & usage:**
- **Primary** — mark + "Silent" wordmark, horizontal, with an optional mono uppercase
  *"Silent Payments Wallet"* tagline (letter-spaced).
- **App icon** — white mark on an accent-blue rounded tile (13px radius).
- **Reversed** — white mark on a dark `--gray-95` surface.
- **Monochrome** — single-color, inherits `currentColor` for one-color contexts.
- Set the wordmark in **Noto Sans DemiBold**; keep clear space ≈ the dot diameter on
  all sides. The mark works standalone as a favicon / avatar.

> This is a *proposed* mark, not an official one from the project. If Silent adopts an
> official logo, drop it in and I'll swap it throughout.

---

## Fonts

The app embeds **Noto Sans Regular** as a compiled byte array
(`src/resources/font/noto_sans.h`), not as a distributable `.ttf`. This system
**self-hosts** the real Noto Sans faces — the user's own `NotoSans-{Regular,Medium,Bold}.ttf`
and `NotoSansMono-{Regular,Bold}.ttf` live in `fonts/` and are wired via `@font-face`
in `colors_and_type.css` (no Google Fonts / CDN dependency, works offline).

This package ships **no static SemiBold**, so the Qt **DemiBold (600)** role is mapped
to the real **Bold** file (`font-weight: 600 700`). The app's monospace is the generic
Qt `"monospace"` family; this system maps it to **Noto Sans Mono**. If you ever need the
exact embedded SemiBold face, supply that `.ttf` and add a 600-weight `@font-face`.

---

## Index / manifest

Root files:
- **`index.html`** — landing hub; links the UI kit, wireframes, and token/specimen
  cards. Open this first (`python3 -m http.server`, then visit it).
- **`README.md`** — this file: product context, content + visual foundations,
  iconography, sources.
- **`CONTRIBUTING.md`** — how to run it, the repo layout, and the
  agent + GitHub PR workflow for teams.
- **`serve.sh`** — one-liner local static server (`./serve.sh [port]`).
- **`styles.css`** — entry stylesheet: `@import`s `colors_and_type.css` +
  `components.css`. Link this one file to pull in the self-hosted fonts, tokens, and
  component styles together.
- **`colors_and_type.css`** — all design tokens (color, type, spacing, radii,
  control metrics) as CSS variables + semantic type classes. Light default, dark via
  `[data-theme="dark"]`.
- **`components.css`** — shared component styles (buttons, inputs, tables, checkbox,
  toggle, …) built on the tokens.
- **`SKILL.md`** — Agent-Skill front-matter so this folder is usable directly as a
  Claude skill.
- **`assets/icons/`** — the Lucide SVGs used by / useful for Silent (recolor via
  `currentColor`).
- **`preview/`** — Design-System cards (color, type, spacing, component specimens)
  rendered as small HTML tiles. **`preview/index.html`** is a themeable gallery that
  embeds them all in one page (linked from the home hub).
- **`wireframes/`** — low-fidelity **placeholder** screens (one frame per wallet
  screen) — the scaffold for sketching new flows before they go hi-fi.
- **`kit/`** — per-panel **component galleries**: one page per panel
  (launcher / history / coins / send / receive / settings) showing that panel and the
  panel-specific components it's built from (e.g. Send → tx-shape diagram, payment
  card, summary, coin selection), rendered live with mock data. `kit/index.html` is
  the panel index.
- **`ui_kits/silent/`** — high-fidelity, interactive recreation of the desktop wallet
  (see its own `README.md`): `index.html` plus modular JSX components.

There is **no slide template** in the source, so no `slides/` directory was created.
