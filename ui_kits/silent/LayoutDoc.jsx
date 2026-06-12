/* Silent UI Kit — Dashboard Layout reference (self-documenting).
   This screen renders inside the very layout it describes (ScreenWrap →
   DashboardLayout) and reads the live layout state from context, so the
   readouts, ruler and schematic resolve in real time. Drag the kit's "Width"
   control to watch them react.

   Composes catalog Card / Eyebrow / Text; the ruler + schematic are bespoke
   positioned diagrams (no catalog equivalent). */

function DocChip({ label, value, accent }) {
  return (
    <Card style={{ padding: '12px 16px', minWidth: 150 }}>
      <Stack gap={5}>
        <Eyebrow size={10} color="muted">{label}</Eyebrow>
        <Text variant="mono" weight="demibold" color={accent ? 'accent' : 'text'}
          style={{ fontSize: 20, letterSpacing: '-0.01em' }}>{value}</Text>
      </Stack>
    </Card>
  );
}

function RuleRow({ token, value, desc }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '190px 96px 1fr', gap: 'var(--space-m)',
      alignItems: 'baseline', padding: '11px 0', borderTop: '1px solid var(--border-light)' }}>
      <Text variant="mono">{token}</Text>
      <Text variant="mono" weight="demibold" color="accent">{value}</Text>
      <Text variant="body" color="secondary" style={{ lineHeight: 1.55 }}>{desc}</Text>
    </div>
  );
}

function ColBox({ label, sub, flex }) {
  return (
    <Card style={{ flex, minWidth: 0, height: 96, padding: '0 8px' }}>
      <Stack align="center" justify="center" gap={3} style={{ height: '100%', textAlign: 'center' }}>
        <Text variant="mono" weight="demibold" style={{ fontSize: 11 }}>{label}</Text>
        {sub ? <Text variant="caption" color="muted" style={{ fontSize: 10 }}>{sub}</Text> : null}
      </Stack>
    </Card>
  );
}

function LayoutDocBody() {
  const { DASH_MIN_W, DASH_COL_MAX, DASH_SPLIT_AT, DASH_MAX_W } = window;
  // Read live layout state from the dashboard layout itself — this view doesn't
  // measure its own box, it reports the container it's rendered inside.
  const { available, colWidth, wide } = React.useContext(window.LayoutInfo);
  const avail = Math.round(available || 0);
  const cw = Math.round(colWidth || 0);
  const twoColFits = available >= DASH_SPLIT_AT;

  // Ruler over the available width, with the key thresholds marked.
  const D0 = 600, D1 = 1820;
  const pct = (v) => ((Math.min(Math.max(v, D0), D1) - D0) / (D1 - D0)) * 100;
  const pos = (v) => `${pct(v)}%`;
  const markers = [[DASH_MIN_W, '760 · min'], [DASH_COL_MAX, '1140 · max'], [DASH_SPLIT_AT, '1569 · 2-col + gap']];

  // Schematic: the block grows with available and splits once two columns fit,
  // capped at the total max.
  const blockFrac = Math.min(Math.max((available - DASH_MIN_W) / (DASH_MAX_W - DASH_MIN_W), 0), 1);
  const blockPct = 52 + 48 * blockFrac;

  return (
    <div>
      <Text as="p" variant="body" color="secondary"
        style={{ lineHeight: 1.7, maxWidth: 760, margin: '0 0 var(--space-l)' }}>
        The layout is a function of its columns. Hand it{' '}
        <strong style={{ color: 'var(--text)' }}>one column</strong> (History, Coins, Receive,
        Settings) or <strong style={{ color: 'var(--text)' }}>two</strong> (Send) — every panel
        renders through it. Each column is clamped between <strong style={{ color: 'var(--text)' }}>760</strong>{' '}
        and <strong style={{ color: 'var(--text)' }}>1140</strong> (1.5 × the min), so no column can
        sprawl wider than that; two columns sit side by side once both clear the min, otherwise they
        stack. This page is one column rendered by that function — resize the window to watch it react.
      </Text>

      {/* live readouts */}
      <Row wrap gap="s" style={{ marginBottom: 'var(--space-l)' }}>
        <DocChip label="Column width" value={`${cw}px`} accent />
        <DocChip label="Range" value="760–1140" />
        <DocChip label="Two columns" value={twoColFits ? 'side by side' : 'stacked'} />
        <DocChip label="Top gap" value={wide ? '120px' : 'none'} />
      </Row>

      {/* ruler */}
      <Eyebrow size={10} color="muted" style={{ marginBottom: 18 }}>Available width: {avail}px</Eyebrow>
      <div style={{ position: 'relative', height: 52, marginBottom: 'var(--space-l)' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 20, height: 10, borderRadius: 5,
          background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
          {/* single-column growth band 760→1140 */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: pos(DASH_MIN_W),
            right: `${100 - pct(DASH_COL_MAX)}%`, background: 'var(--border)' }} />
          {/* two-column band ≥1569 */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: pos(DASH_SPLIT_AT),
            right: 0, background: 'var(--accent)', opacity: 0.5 }} />
        </div>
        {/* thumb at current available */}
        <div style={{ position: 'absolute', top: 12, left: pos(available), transform: 'translateX(-50%)',
          width: 2, height: 26, background: 'var(--accent)', borderRadius: 1 }} />
        <div style={{ position: 'absolute', top: 0, left: pos(available), transform: 'translateX(-50%)',
          font: '600 11px var(--font-mono)', color: 'var(--accent)', whiteSpace: 'nowrap' }}>{avail}px</div>
        {markers.map(([v, l]) => (
          <div key={v}>
            <div style={{ position: 'absolute', top: 16, left: pos(v), width: 1, height: 18,
              background: 'var(--text-muted)', opacity: 0.5 }} />
            <div style={{ position: 'absolute', top: 36, left: pos(v), transform: 'translateX(-50%)',
              font: '10px var(--font-mono)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* schematic */}
      <Eyebrow size={10} color="muted" style={{ marginBottom: 10 }}>How a two-column screen lays out now</Eyebrow>
      <div style={{ position: 'relative', border: '1px dashed var(--border)', borderRadius: 8,
        background: 'var(--bg-secondary)', padding: '26px 14px 14px', marginBottom: 6 }}>
        <Text variant="mono" color="muted" style={{ position: 'absolute', top: 8, left: 12, fontSize: 10 }}>available area · block centred</Text>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: `${blockPct}%`, minWidth: 220, transition: 'width 0.12s ease' }}>
            {wide ? (
              <div style={{ height: 26, borderRadius: 4, marginBottom: 10,
                background: 'color-mix(in srgb, var(--accent) 18%, transparent)',
                border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                font: '10px var(--font-mono)', color: 'var(--accent)' }}>top gap · 120px</div>
            ) : null}
            <div style={{ display: 'flex', gap: 12 }}>
              {twoColFits ? (
                <React.Fragment>
                  <ColBox label="column" sub="≤ 1140" flex="1 1 0" />
                  <ColBox label="column" sub="≤ 1140" flex="1 1 0" />
                </React.Fragment>
              ) : (
                <ColBox label="columns stacked" sub="each 760 – 1140" flex="1 1 0" />
              )}
            </div>
          </div>
        </div>
      </div>
      <Text as="p" variant="caption" color="muted" style={{ lineHeight: 1.6, margin: '0 0 var(--space-l)' }}>
        A one-column screen is just the left half of this — a single column, 760–1140 wide, centred.
      </Text>

      {/* rules */}
      <Eyebrow size={10} color="muted" style={{ marginBottom: 4 }}>The rules</Eyebrow>
      <RuleRow token="min column width" value="760px"
        desc="A column never gets narrower than this." />
      <RuleRow token="max column width" value="1140px"
        desc="1.5 × the min — a column can't be wider, whether it's the only column or one of two." />
      <RuleRow token="max total width" value="1600px"
        desc="Two columns together never exceed this; beyond it the block centres with equal margins." />
      <RuleRow token="two columns" value="≥ 1569px"
        desc="Both columns need at least the min (2 × 760 + 49 gutter); below this a two-column screen stacks." />
      <RuleRow token="top gap" value="120px"
        desc="A fixed gap above the content once the layout is wide enough for two columns (≥1569) — a stand-in for the old one-third-from-top bias (--space-xxl)." />
      <RuleRow token="padding" value="10px"
        desc="Uniform inset around the content on every panel (--space-s)." />
      <RuleRow token="window min" value="960px"
        desc="The window can't be sized below column-min + sidebar (760 + 200), so a column never drops under its 760 min and never has to scroll." />
    </div>
  );
}

function LayoutDoc() {
  // The body is a child of ScreenWrap/DashboardLayout so it can read the live
  // layout state from context (the Provider lives inside DashboardLayout).
  return (
    <ScreenWrap title="Layout">
      <LayoutDocBody />
    </ScreenWrap>
  );
}

Object.assign(window, { LayoutDoc, LayoutDocBody, DocChip, RuleRow });
