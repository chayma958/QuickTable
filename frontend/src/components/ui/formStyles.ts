export const formStyles = {
  form: 'flex flex-col gap-4',
  row: 'flex flex-wrap gap-3 [&>*]:flex-1',
  field: 'flex flex-col gap-1.5',
  label: 'text-sm font-semibold text-text',
  checkboxLabel: 'flex items-center gap-2 text-sm font-semibold text-text',
  input:
    'w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-light',
  select:
    'w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-brand-light',
  textarea:
    'w-full resize-none rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-light',
  error: 'text-xs text-danger',
  actions: 'mt-1 flex justify-end gap-2.5',
  primaryButton:
    'rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60',
  secondaryButton:
    'rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text hover:bg-bg-subtle',
} as const;
