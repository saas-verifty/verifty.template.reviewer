type Props = {
  onSubmit: () => void
  onCancel: () => void
  loading?: boolean
  hasErrors?: boolean
}

export function ActionButtons({
  onSubmit,
  onCancel,
  loading = false,
  hasErrors = false,
}: Props) {
  return (
    <div className="mt-6 flex gap-3">
      <button
        onClick={onSubmit}
        disabled={loading || hasErrors}
        className="px-6 py-2 bg-bg-brand text-white rounded-lg font-medium hover:bg-bg-brand-strong disabled:bg-bg-disabled disabled:text-fg-disabled transition-colors"
      >
        Enviar
      </button>
      <button
        onClick={onCancel}
        disabled={loading}
        className="px-6 py-2 bg-bg-tertiary text-body rounded-lg font-medium hover:bg-bg-quaternary disabled:bg-bg-disabled disabled:text-fg-disabled transition-colors"
      >
        Cancelar
      </button>
    </div>
  )
}
