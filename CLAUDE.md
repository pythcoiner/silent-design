# Silent design system — hard rules

These apply to the whole UI kit and design system, always.

1. **Reuse the catalog.** Screens and panels compose catalog components
   (`ui_kits/silent/*.jsx` exports). Never hand-roll UI the catalog already has; if
   something is missing, add a component (or a variant) to the catalog first.
2. **No one-off variants.** Every visual variant (size, tone, weight, padding,
   colour, width, state) is a NAMED option of its component (a prop or role backed
   by a CSS class / token), defined once in the catalog. Screens only pick options;
   they never pass `style` to change how a catalog component looks.
   - Layout primitives (`Stack`, `Row`, `Spacer`) may take layout styles
     (width, flex, min/max size) — that is placement, not a variant.
   - Component definitions may style their own internals.
   - Dev chrome (the kit toolbar in `App.jsx`, `LayoutDoc.jsx`) is exempt.
3. **Every variant has a specimen.** Each component's preview card
   (`preview/components-*.html`, listed in `preview/catalog-data.js`) shows every
   variant and state it supports. Adding a variant means adding it to the card.
4. **Tokens only.** No raw hex / px in screens; values come from
   `colors_and_type.css`. A token the app (`Palette.h`) doesn't have is marked
   "design only" and listed in the handoff note.
5. **Modals.** One modal at a time; steps replace each other. Exceptions: a small
   settings overlay (e.g. Camera Settings) and Fetch Xpub (over the key detail) open on
   top and close back. Every modal and
   step ends with one `ModalActions` bar — except when its only action would be
   Close (the header × already does that) or it is a transient status. Never add
   a Close / OK / Cancel button: the header × closes every modal. A sub-step
   that can return to the previous step gets Back (`ModalActions onBack`).
6. **Labels sit right before their input** (`Field`): no gap beyond the row gap.
   Stacked fields whose inputs must line up go in a `FieldGroup`: the labels share
   one column exactly as wide as the longest label — no wider.
7. **Everything ports to Qt widgets** (qontrol) — keep each component mappable to
   one widget or layout recipe.
