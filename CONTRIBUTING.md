# Contributing to the Silent Design System

This repo is **static files only** — HTML, JSX (transpiled in-browser via Babel),
CSS, fonts, SVGs. There is **no build step and no package manager**. You edit a
file, refresh the browser, done.

## Run it locally

In-browser Babel fetches the `.jsx` files over HTTP, so opening `index.html` from
`file://` will be blocked by the browser. Serve the folder instead:

```bash
# from the repo root
python3 -m http.server 8000
# then open http://localhost:8000/
```

Any static server works equally well: `npx serve`, VS Code "Live Server", `caddy file-server`, etc.
A convenience script is included:

```bash
./serve.sh          # defaults to port 8000
./serve.sh 4000     # custom port
```

Or, with [`just`](https://github.com/casey/just):

```bash
just serve          # defaults to port 8000
just serve 4000     # custom port
```

## Layout

```
index.html              landing hub → links the three areas below
README.md               product context + visual/content foundations (source of truth)
styles.css              @imports colors_and_type.css + components.css
colors_and_type.css     all design tokens (color, type, spacing, radii) + @font-face
components.css           shared component styles
fonts/  assets/         self-hosted Noto Sans + Mono, logo, Lucide icons
preview/                design-system specimen cards (color/type/spacing/components)
wireframes/             low-fi placeholder screens (scaffold for new flows)
ui_kits/silent/         hi-fi interactive wallet recreation (its own modular JSX)
```

## Working with a Claude design agent

Each contributor can iterate with their own agent against this repo:

1. **Import** — give the agent this repo (GitHub URL or a mounted local folder); it
   reads the current files.
2. **Iterate** — describe the change; the agent edits the files in its workspace.
3. **Commit** — download the changed files back into your clone, then commit to a
   **branch** and open a **PR**. Review/merge happens in GitHub as usual.

The agent is the per-person editor; **GitHub (branches + PRs) is the source of truth
and the merge/review layer.** The agent does not push or merge for you — that stays
in your hands.

### Keeping merges clean

- One screen / component / flow per branch and PR.
- The hi-fi kit is already split into small files (`Send.jsx`, `Sidebar.jsx`,
  `TxFlow.jsx`, …) — keep that granularity so two people rarely touch the same file.
- Design **tokens** (`colors_and_type.css`) are global; coordinate token changes
  (they ripple everywhere) rather than editing them in parallel.
- These are plain-text diffs — ordinary git conflict resolution applies. An agent can
  help fix a conflicted file if you paste it back in.

## Conventions

- **Tokens over literals.** Use the CSS variables (`var(--accent)`, `var(--space-m)`,
  …); avoid new hard-coded hexes/sizes. If a value is missing, add a token.
- **Match the voice.** Terse, technical, Title-Case buttons, sentence-case bodies,
  no emoji. See README → *Content Fundamentals*.
- **No new dependencies / CDNs** beyond the pinned React + Babel already in
  `ui_kits/silent/index.html`. Everything else is self-hosted and works offline.
- **Canonical HTML** (close every tag, quote every attribute) so files stay
  diff- and tool-friendly.
- **Wireframes stay lo-fi**; promote a flow to `ui_kits/silent/` when it graduates to
  hi-fi.
