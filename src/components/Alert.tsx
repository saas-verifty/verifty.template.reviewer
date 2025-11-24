type AlertType = 'success' | 'error'

type Props = {
  type: AlertType
  message: string
  onClose: () => void
}

export function Alert({ type, message, onClose }: Props) {
  const isSuccess = type === 'success'

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
        isSuccess
          ? 'bg-bg-success-soft border-fg-success text-fg-success'
          : 'bg-bg-danger-soft border-fg-danger text-fg-danger'
      }`}
    >
      <div className="flex items-center gap-2">
        {isSuccess ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )}
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="cursor-pointer hover:opacity-70 transition-opacity"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}
