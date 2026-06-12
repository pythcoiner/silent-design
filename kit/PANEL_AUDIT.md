# Silent — `kit/` Panel Galleries Audit ✅ RESOLVED

> All items below are fixed. Every panel page now loads the full catalog
> (`Icons → Primitives → Layout → Widgets → Modal → Address → Data → views`),
> renders without errors, and uses catalog components only. Two new generics —
> **`TransactionSummary`** and **`CoinTable`** (in `Widgets.jsx`) — now back both
> `Send.jsx` and `send.html`, killing the duplication.



The panel pages (`kit/*.html`) mount catalog components into gallery cards via
`harness.js`. They should **only** wire state + mock data around catalog
components — never define UI sub-components inline. Audit below.

Legend: 🔴 inline UI that duplicates the catalog · 🟣 duplicated composite worth a
new generic component · 🟢 fine as-is · ⛔ correctness bug.

---

## ⛔ 0. Pages were broken — missing catalog `<script>` tags ✅
Every panel page loaded `Icons → Primitives → Modal → Data → …` but **omitted
`Layout.jsx`, `Widgets.jsx`, and `Address.jsx`**. The screens use `Stack`,
`Row`, `Text`, `Table`, `KeyValue`, `QRCard`, … so they threw
`ReferenceError: Table is not defined` and rendered nothing.
- [x] Added `Layout.jsx` + `Widgets.jsx` (after Primitives, before the views) to
  every page.
- [x] Added `Address.jsx` (after Modal) to pages that show addresses/QR
  (`receive`, `send`) — plus the qrcode-generator lib so QR actually renders.
- [x] `send.html`'s reference to the deleted `SummaryRow` removed (see 🔴 2).

---

## 🔴 A. Inline UI that already has a catalog equivalent — just reuse

### 1. `send.html` › `Box`
```jsx
const Box = ({children}) => <div style={{background:'var(--bg-secondary)',
  border:'1px solid var(--border-light)', borderRadius:10, padding:'…'}}>…</div>
```
- [x] This is exactly **`Card tone="inset"`**. Deleted `Box`; specimens wrapped in
  `<Card tone="inset">`.

### 2. `send.html` › `SummaryDemo`
Hand-builds the summary from `SummaryRow` (deleted) + a raw `<div>` divider.
- [x] Replaced with the new **`TransactionSummary`** generic (🟣 6) — itself built
  from `KeyValue` + `Divider`.

### 3. `send.html` › `CoinSelectDemo`
Hand-rolls `s-tbl` / `s-tbl__row` / `s-tbl__cell` markup with a local `useState`.
- [x] Replaced with the new **`CoinTable`** generic (🟣 7) — itself built over the
  catalog **`Table`** (`hideHeader` + row selection).

### 4. `settings.html` › `NetworkDemo`
```jsx
<div style={{display:'flex',…}}><span className="t-info-label" style={{width:80}}>
  Network:</span><ComboBox … /></div>
```
- [x] This is exactly **`Field`**. Replaced with
  `<Field label="Network:" labelWidth={80}><ComboBox … /></Field>`.

### 5. `coins / history / receive / settings` › `<div style={{padding:4}}>`
Repeated demo padding wrapper around a specimen.
- [ ] ⏸ Deferred (low priority) — cosmetic demo padding only, no duplicated UI.
  Could move into `harness.js` as an item `pad` option later.

---

## 🟣 B. Duplicated composites — promote to NEW generic catalog components

These now exist in **two** places (the real screen in `ui_kits/silent/` **and** a
hand-built copy in the gallery). Extract one generic, use it in both.

### 6. `TransactionSummary`
The Sending / Network fee / Change / Total block lives inline in `Send.jsx`
(`summaryRows`) and is re-built in `send.html` (`SummaryDemo`).
- [x] New catalog component `TransactionSummary({ rows, total })` (rows of
  `KeyValue`, a `Divider`, an emphasized total). Now used in Send + gallery.

### 7. `CoinTable`
The coin-selection table is built inline in `Send.jsx` (`coinsBodyFor` column defs)
and again in `send.html` (`CoinSelectDemo`).
- [x] New catalog component `CoinTable({ coins, isChecked, onToggle, readOnly })`
  over `Table`. Now used in Send + gallery.

---

## 🟢 C. Fine as-is — stateful demo glue, not UI
These only add `useState` to make a *catalog* component interactive in the gallery.
No inline UI; keep them.
- `send.html` › `PaymentDemo` (wraps `RecipientCard`)
- `receive.html` › `AddressRowDemo` (wraps `AddressRow`)
- `settings.html` › `TestableRowDemo` (wraps `TestableRow`)
- `launcher.html` › `MenuDemo` (wraps `MenuTab`)

---

## Summary of work
| Action | Items | Status |
|---|---|---|
| Fix broken script tags | 0 (all pages) | ✅ done |
| Swap inline → existing catalog | 1 `Card`, 2 `KeyValue`, 3 `Table`, 4 `Field` | ✅ done |
| New generic components | 6 `TransactionSummary`, 7 `CoinTable` | ✅ done |
| Leave alone | C (demo wrappers) | ✅ kept |
| Deferred (low priority) | 5 (demo padding wrapper) | ⏸ later |
