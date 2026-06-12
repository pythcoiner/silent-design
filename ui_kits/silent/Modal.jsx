/* Silent UI Kit — Modal shell (qontrol::Modal / Window dialog).
   Generic: <Modal title="…" onClose={fn} width={…}>content</Modal>
   Renders a header (title + [x] close) above the content. */

function Modal({ title, width = 500, onClose, children, headerRight }) {
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
        <Row justify="space-between" align="center" gap="m" style={{ marginBottom: 'var(--space-m)' }}>
          <Text variant="heading" nowrap>{title}</Text>
          <Row gap="s" style={{ flex: 'none' }}>
            {headerRight || null}
            {onClose ? (
              <Button role="inline-icon" title="Close" onClick={onClose}>
                <Icon name="x" size={16} />
              </Button>
            ) : null}
          </Row>
        </Row>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { Modal });
