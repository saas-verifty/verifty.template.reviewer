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
        className="px-6 py-2.5 bg-bg-purple text-white rounded-lg font-medium cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        Enviar
      </button>
      <button
        onClick={onCancel}
        disabled={loading}
        className="px-6 py-2.5 bg-white text-fg-purple border-2 border-bg-purple rounded-lg font-medium cursor-pointer hover:bg-bg-purple/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        Cancelar
      </button>
    </div>
  )
}
