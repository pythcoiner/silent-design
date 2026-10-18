/* Silent — catalog data. Single source of truth for the specimen gallery:
   the index lists one card per group; category.html renders one group's tiles.
   Each item: [file (without .html), label, span ('', 'span2', 'full'), fns[]]
   where `fns` are the component FUNCTION names that produce the specimen — the
   canonical way to refer to it (e.g. window.<NS>.Button). Token/brand cards
   have no producing function, so `fns` is empty. */
window.CATALOG_GROUPS = [
  ['Type', 'Font scale, text roles & Bitcoin amounts', [
    ['type-display', 'Display & headings', 'span2', ['Text']],
    ['type-body', 'Body & labels', '', ['Text']],
    ['type-mono', 'Monospace', '', ['Text']],
    ['components-typography', 'Text variants', 'span2', ['Text']],
    ['components-amount', 'Amount', '', ['Amount']],
  ]],
  ['Layout', 'Flex primitives — map 1:1 to Qt layouts', [
    ['components-layout', 'Stack · Row · Spacer · Divider', 'full', ['Stack', 'Row', 'Spacer', 'Divider']],
  ]],
  ['Generic Components', 'Atomic, reusable building blocks', [
    ['components-buttons', 'Buttons', 'full', ['Button', 'Btn']],
    ['components-inputs', 'Inputs & fields', 'full', ['Input', 'DateTimeInput', 'Display', 'TextArea']],
    ['components-combobox', 'ComboBox', '', ['ComboBox']],
    ['components-checkbox', 'Checkbox', '', ['Checkbox']],
    ['components-toggle', 'Toggle', '', ['Toggle']],
    ['components-validation', 'Validation', '', ['ValidationMark']],
    ['components-cards', 'Cards & surfaces', 'span2', ['Card']],
    ['components-badge', 'Pills', 'span2', ['Badge', 'Pill']],
    ['components-variants', 'Widget variants', 'full', ['Text', 'Icon', 'Card', 'Input', 'FieldNote', 'SectionHeader', 'Section', 'ScrollArea', 'EmptyState', 'Tab', 'IndexPill']],
    ['components-select-row', 'Select row', 'span2', ['SelectRow']],
    ['components-notice', 'Notice', 'span2', ['Notice']],
    ['components-copy-field', 'Copy field & chunked address', 'span2', ['CopyField', 'ChunkedAddress']],
    ['components-word-grid', 'Word grid', '', ['WordGrid']],
    ['components-scan-progress', 'Scan progress', '', ['ScanProgress']],
    ['components-route-icons', 'Route icons · section header · modal actions', 'span2', ['RouteIcons', 'SectionHeader', 'ModalActions']],
    ['components-modal-status', 'Modal & status', 'span2', ['Modal', 'ModalStatus', 'Spinner', 'SentModal']],
    ['components-stepper', 'Stepper, disclosure & wizard steps', 'span2', ['Stepper', 'FoldSection', 'Tooltip', 'InfoTip', 'WizardSteps']],
    ['components-form-rows', 'Form rows', 'span2', ['Field', 'FieldGroup', 'PaymentRow', 'ValidatedInput', 'KeyValue']],
    ['components-table', 'Table', 'span2', ['Table']],
  ]],
  ['Components', 'App-specific compositions', [
    ['components-menu', 'Sidebar menu', '', ['Sidebar']],
    ['components-balance', 'Balance header', 'span2', ['BalanceHeader']],
    ['components-plugin-row', 'Plugin row', 'span2', ['PluginRow']],
  ]],
  ['Colors', 'Palette & semantic roles, both themes', [
    ['colors-accent', 'Accent', '', []],
    ['colors-semantic', 'Semantic', '', []],
    ['colors-text', 'Text', '', []],
    ['colors-light-neutrals', 'Light neutrals', 'full', []],
    ['colors-dark-neutrals', 'Dark neutrals', 'full', []],
  ]],
  ['Spacing', 'Spacing scale, corner radii & layout metrics', [
    ['spacing-scale', 'Spacing scale', 'span2', []],
    ['radii', 'Corner radii', '', []],
    ['layout-metrics', 'Layout metrics', '', []],
  ]],
  ['Brand', 'Wordmark, lockups & iconography', [
    ['brand-wordmark', 'Wordmark & lockups', 'span2', []],
    ['brand-iconography', 'Iconography', 'span2', []],
  ]],
];
window.CATALOG_SLUG = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
/* Unique component function names within a group, in first-seen order. */
window.CATALOG_FNS = (items) => {
  const out = [];
  for (const it of items) for (const fn of (it[3] || [])) if (!out.includes(fn)) out.push(fn);
  return out;
};
