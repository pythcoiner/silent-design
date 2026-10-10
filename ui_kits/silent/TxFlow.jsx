/* Silent UI Kit — Transaction-shape diagram (Sankey of inputs -> tx -> outputs).
   Generative: ribbon thickness is proportional to amount. Hovering a ribbon
   reveals a detail card. In the Qt app this is a QWidget with a custom
   paintEvent (QPainterPath cubics + QLinearGradient) plus a hover overlay. */

function txBands(weights, top, bottom, gap, min = 5) {
  const total = weights.reduce((a, b) => a + b, 0) || 1;
  const n = weights.length;
  const avail = (bottom - top) - gap * Math.max(0, n - 1);
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

function TxFlowEmpty({ height = 188 }) {
  return (
    <div style={{ height, display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 10, textAlign: 'center' }}>
      <svg width="116" height="60" viewBox="0 0 116 60" fill="none">
        <rect x="3" y="14" width="9" height="13" rx="2" fill="var(--text-muted)" opacity="0.4" />
        <rect x="3" y="33" width="9" height="13" rx="2" fill="var(--text-muted)" opacity="0.4" />
        <rect x="51" y="18" width="14" height="24" rx="2" fill="var(--text-muted)" opacity="0.55" />
        <rect x="104" y="20" width="9" height="20" rx="2" fill="var(--text-muted)" opacity="0.4" />
        <path d="M12 20 C 32 20, 32 24, 51 24" stroke="var(--text-muted)" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
        <path d="M12 40 C 32 40, 32 36, 51 36" stroke="var(--text-muted)" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
        <path d="M65 30 C 85 30, 85 30, 104 30" stroke="var(--text-muted)" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
      </svg>
      <div className="t-body" style={{ color: 'var(--text-muted)', maxWidth: 200 }}>
        Enter a payment amount to preview the transaction shape.
      </div>
    </div>
  );
}

function TxFlow({ inputs, outputs, width = 300, height = 188 }) {
  const ins = (inputs || []).filter(d => d.w > 0);
  const outs = (outputs || []).filter(d => d.w > 0);
  const [hover, setHover] = React.useState(null);
  const wrapRef = React.useRef(null);
  if (!ins.length || !outs.length) return <TxFlowEmpty height={height} />;

  const W = width, H = height, padY = 14;
  const xInStub = 4, xFlowL = 24;
  const xTrunkL = W * 0.44, xTrunkR = W * 0.56;
  const xFlowR = W - 24, xOutStub = W - 4;

  const trunkH = (H - 2 * padY) * 0.84;
  const trunkTop = (H - trunkH) / 2, trunkBot = trunkTop + trunkH;

  const inW = ins.map(d => d.w), outW = outs.map(d => d.w);
  const inNode = txBands(inW, padY, H - padY, 9);
  const inTrunk = txBands(inW, trunkTop, trunkBot, 0);
  const outNode = txBands(outW, padY, H - padY, 9);
  const outTrunk = txBands(outW, trunkTop, trunkBot, 0);

  const ribbon = (x0, a0, a1, x1, b0, b1) => {
    const mx = (x0 + x1) / 2;
    return `M ${x0} ${a0} C ${mx} ${a0}, ${mx} ${b0}, ${x1} ${b0}`
      + ` L ${x1} ${b1} C ${mx} ${b1}, ${mx} ${a1}, ${x0} ${a1} Z`;
  };

  const move = (e, side, i) => {
    const r = wrapRef.current.getBoundingClientRect();
    setHover({ side, i, x: e.clientX - r.left, y: e.clientY - r.top, cw: r.width });
  };
  const isHot = (side, i) => hover && hover.side === side && hover.i === i;

  const data = hover ? (hover.side === 'in' ? ins : outs)[hover.i] : null;
  const cardW = 196;
  let cardL = 0, cardT = 0;
  if (hover) {
    cardL = hover.x + 14;
    if (cardL + cardW > hover.cw) cardL = hover.x - 14 - cardW;
    cardL = Math.max(4, Math.min(cardL, hover.cw - cardW - 4));
    cardT = Math.max(4, hover.y - 14);
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: 'block' }}>
        {ins.map((_, i) => (
          <path key={'i' + i} d={ribbon(xFlowL, inNode[i][0], inNode[i][1], xTrunkL, inTrunk[i][0], inTrunk[i][1])}
            fill="var(--tx-self)" fillOpacity={isHot('in', i) ? 0.98 : 0.34 + 0.07 * (i % 3)}
            style={{ cursor: 'pointer', transition: 'fill-opacity 0.1s' }}
            onMouseMove={e => move(e, 'in', i)} onMouseLeave={() => setHover(null)} />
        ))}

        <rect x={xTrunkL} y={trunkTop} width={xTrunkR - xTrunkL} height={trunkBot - trunkTop}
          fill="var(--tx-self)" fillOpacity="0.95" />

        {outs.map((d, j) => (
          <path key={'o' + j} d={ribbon(xTrunkR, outTrunk[j][0], outTrunk[j][1], xFlowR, outNode[j][0], outNode[j][1])}
            fill={outFill(d)} fillOpacity={isHot('out', j) ? 0.98 : 0.62}
            style={{ cursor: 'pointer', transition: 'fill-opacity 0.1s' }}
            onMouseMove={e => move(e, 'out', j)} onMouseLeave={() => setHover(null)} />
        ))}

        {inNode.map((b, i) => (
          <rect key={'ic' + i} x={xInStub} y={b[0]} width={xFlowL - xInStub - 2} height={b[1] - b[0]} rx="2" fill="var(--tx-self)" />
        ))}
        {outNode.map((b, j) => (
          <rect key={'oc' + j} x={xFlowR + 2} y={b[0]} width={xOutStub - xFlowR - 2} height={b[1] - b[0]} rx="2"
            fill={outCap(outs[j])} />
        ))}

        {/* direct labels on the output side so each output is identifiable */}
        {outs.map((d, j) => {
          const mid = (outNode[j][0] + outNode[j][1]) / 2;
          return (
            <text key={'ol' + j} x={xFlowR - 8} y={mid + 3} textAnchor="end"
              style={{ font: '600 9px var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}
              fill={outLabel(d)}>
              {d.kind === 'change' ? 'change' : d.kind === 'fee' ? 'fee' : (d.label ? d.label.slice(0, 10) : 'recipient')}
            </text>
          );
        })}
      </svg>

      {data ? (
        <div style={{
          position: 'absolute', left: cardL, top: cardT, width: cardW, pointerEvents: 'none', zIndex: 5,
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 11px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        }}>
          <Text as="div" variant="body" weight="demibold">{data.title}</Text>
          {data.usd ? <Text as="div" variant="mono" color="secondary">{data.usd}</Text> : null}
          {data.addr ? <Text as="div" variant="mono" color="muted" size="sm" wrap="anywhere">{txMidAddr(data.addr)}</Text> : null}
        </div>
      ) : null}
    </div>
  );
}

Object.assign(window, { TxFlow });
