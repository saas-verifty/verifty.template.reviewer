type Props = {
  onValidate: () => void
  onSubmit: () => void
  onCancel: () => void
  loading?: boolean
}

export function ActionButtons({
  onValidate,
  onSubmit,
  onCancel,
  loading = false,
}: Props) {
  return (
    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
      <button onClick={onValidate} disabled={loading}>
        Validar
      </button>
      <button onClick={onSubmit} disabled={loading}>
        Enviar
      </button>
      <button onClick={onCancel} disabled={loading}>
        Cancelar
      </button>
    </div>
  )
}
