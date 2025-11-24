import { useEffect } from 'react'
import { TableData } from '@/features/data-validation/types/table.types'
import { UI_MESSAGES } from '@/constants/uiMessages'

type Props = {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  table: TableData
  loading?: boolean
}

export function ConfirmationModal({ isOpen, onConfirm, onCancel, table, loading = false }: Props) {
  const totalRows = table.length
  const editedRows = table.filter((row) => row.isEdited).length

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onCancel, loading])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={loading ? undefined : onCancel}
      />
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <button
          onClick={onCancel}
          disabled={loading}
          className="absolute top-4 right-4 text-body-subtle hover:text-body disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-body-subtle">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h2 className="text-lg font-semibold text-black mb-2">
            {UI_MESSAGES.CONFIRM_SUBMISSION}
          </h2>

          <p className="text-body mb-4">
            Estás a punto de enviar {totalRows} {UI_MESSAGES.RECORD(totalRows)}
            {editedRows > 0 && (
              <span className="text-fg-purple"> ({editedRows} {UI_MESSAGES.EDITED(editedRows)})</span>
            )}
          </p>

          {loading && (
            <div className="w-full mb-4">
              <div className="flex items-center justify-center gap-3 py-2">
                <div className="w-5 h-5 border-2 border-bg-purple border-t-transparent rounded-full animate-spin"></div>
                <span className="text-body text-sm">{UI_MESSAGES.PROCESSING}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 w-full">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-bg-purple text-white rounded-lg font-medium cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {UI_MESSAGES.CONFIRM_BUTTON}
            </button>
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-white text-body border border-bg-gray rounded-lg font-medium cursor-pointer hover:bg-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {UI_MESSAGES.CANCEL_BUTTON}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
