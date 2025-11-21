import { useRef } from 'react'

import { CellData } from '../types/table.types'

type Props = {
  cell: CellData
  onChange: (value: string) => void
}

export function EditableCell({ cell, onChange }: Props) {
  const cellRef = useRef<HTMLTableCellElement>(null)

  const cellErrorClass = cell.hasError ? 'bg-bg-error-cell/20' : ''
  const textClass = cell.hasError
    ? 'text-fg-danger'
    : cell.isEdited
      ? 'font-medium text-fg-purple'
      : 'text-body'

  const handleBlur = (e: React.FocusEvent<HTMLTableCellElement>) => {
    const newValue = e.currentTarget.textContent ?? ''
    if (newValue !== String(cell.value ?? '')) {
      onChange(newValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTableCellElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.currentTarget.blur()
    }
    if (e.key === 'Escape') {
      e.currentTarget.textContent = String(cell.value ?? '')
      e.currentTarget.blur()
    }
  }

  return (
    <td
      ref={cellRef}
      contentEditable
      suppressContentEditableWarning
      className={`px-4 py-4 outline-none cursor-text focus:bg-bg-purple/10 focus:ring-2 focus:ring-bg-purple focus:ring-inset ${cellErrorClass} ${textClass}`}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      title={cell.errorMessage}
    >
      {cell.value ?? ''}
    </td>
  )
}
