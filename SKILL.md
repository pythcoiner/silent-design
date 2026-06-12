---
name: silent-design
description: Use this skill to generate well-branded interfaces and assets for Silent, the privacy-focused desktop Bitcoin wallet (Silent Payments protocol), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

Key files:
- `README.md` — product context, content + visual foundations, iconography, sources.
- `colors_and_type.css` — all design tokens (color, type, spacing, radii, control
  metrics). Light is the default theme; dark via `[data-theme="dark"]`.
- `components.css` — faithful web translation of the app's Qt component styles
  (buttons, inputs, displays, checkbox, toggle, combobox).
- `assets/icons/` — the Lucide line icons used by / useful for Silent
  (stroke-only, recolor via `currentColor`).
- `ui_kits/silent/` — interactive React recreation of the desktop wallet; copy its
  `*.jsx` components and CSS to assemble new screens.
- `preview/` — small specimen cards for each token/component group.

Silent's aesthetic in one line: a **flat, dense, utilitarian desktop tool** — Noto
Sans, monospace for all crypto strings/amounts, 1px borders, small radii (4/6/8px),
**no shadows, no gradients, no animation, no emoji**, Lucide line icons, a muted-blue
accent, and an equal light/dark neutral-gray system. Copy is terse, impersonal, and
Title-Cased on buttons/labels. There is **no logo asset** — identity is the plain
"Silent" wordmark.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets
out and create static HTML files for the user to view. If working on production code,
copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to
build or design, ask some questions, and act as an expert designer who outputs HTML
artifacts _or_ production code, depending on the need.
