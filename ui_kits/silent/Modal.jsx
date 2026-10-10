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
   header and a pinned button bar (ModalActions is sticky). */

export function Modal({ title, width = 500, onClose, children, headerRight }) {
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width, maxWidth: '92%', maxHeight: '90%', overflow: 'auto', boxSizing: 'border-box',
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
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { Modal });
