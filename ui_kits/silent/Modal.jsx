/* Silent UI Kit — Modal shell (qontrol::Modal / Window dialog).
   Generic: <Modal title="…" onClose={fn} width={…}>content … <ModalActions>…</ModalActions></Modal>
   Renders the header (title + [x] close) above the content. `headerRight` holds
   context next to the ×, e.g. a key's fingerprint and status pill; it never
   gets pushed out — a long title truncates with an ellipsis instead.
   ONE modal at a time, with one exception: a small settings overlay (e.g. Camera
   Settings) may open on top of a flow step and closes back to it.
   RULE: every modal (and every step inside a stepped modal) ends with ONE
   <ModalActions> button bar — Back on the left, disabled reason, then the
   buttons (secondary first, primary last). Never hand-roll a button row. A
   transient status with no action (broadcasting, sealing) may omit it, and so may
   a modal whose only action would be Close (the header × already closes it).
   Never add a Close / OK / Cancel button — the × is the only close control; a
   sub-step that returns to the previous one uses Back (ModalActions onBack).
   When the content is taller than the window, the body scrolls between a pinned
   header and a pinned button bar (ModalActions is sticky).
   `height`: 'auto' (default, fits the content) | 'wizard' (fixed --modal-wizard-h, so
   every step of a wizard keeps one size; the body fills it and the actions sit at
   the bottom — the step's Stack takes flex 1 with a Spacer before ModalActions). */

export function Modal({ title, width = 500, height = 'auto', onClose, children, headerRight }) {
  const fixed = height === 'wizard';
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width, maxWidth: '92%', maxHeight: '90%', overflow: 'auto', boxSizing: 'border-box',
        height: fixed ? 'var(--modal-wizard-h)' : undefined, display: fixed ? 'flex' : undefined, flexDirection: 'column',
        background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-input)',
        padding: 'var(--space-m)',
      }}>
        {/* header stays pinned while the body scrolls */}
        <Row justify="space-between" align="center" gap="m" style={{ marginBottom: 'var(--space-m)',
          position: 'sticky', top: 'calc(-1 * var(--space-m))', zIndex: 2, background: 'var(--bg)',
          margin: 'calc(-1 * var(--space-m)) 0 var(--space-m)', paddingTop: 'var(--space-m)', paddingBottom: 'var(--space-xs)' }}>
          {/* the title truncates; headerRight (e.g. fingerprint + status) and × always stay visible */}
          <Text variant="heading" truncate title={typeof title === 'string' ? title : undefined} style={{ flex: '1 1 auto', minWidth: 0 }}>{title}</Text>
          <Row gap="s" style={{ flex: 'none' }}>
            {headerRight || null}
            {onClose ? (
              <Btn id="modal_close" onClick={onClose} />
            ) : null}
          </Row>
        </Row>
        {/* the body sits centred across the modal; ModalActions stretches (Qt: the step
            body between two spacers, the actions bar outside them) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: fixed ? '1 0 auto' : undefined,
          '--modal-body-w': `calc(${typeof width === 'number' ? width + 'px' : width} - 2 * var(--space-m) - 2px)` }}>
          {children}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Modal });
