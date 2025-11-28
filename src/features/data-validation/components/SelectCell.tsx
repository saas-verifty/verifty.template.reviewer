import { useState, useRef, useEffect } from 'react'

import { CellData } from '../types/table.types'
import { UI_MESSAGES } from '@/constants/uiMessages'

type Props = {
  cell: CellData
  options: string[]
  onChange: (value: string) => void
}

export function SelectCell({ cell, options, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLTableCellElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const cellErrorClass = cell.hasError ? 'bg-bg-error-cell/20' : ''
  const textClass = cell.hasError
    ? 'text-fg-danger'
    : cell.isEdited
      ? 'font-medium text-fg-purple'
      : 'text-body'

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
        setSearch('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleSelect = (value: string) => {
    // Si selecciona "(Vacío)", guardar string vacío
    onChange(value === UI_MESSAGES.EMPTY_VALUE ? '' : value)
    setIsOpen(false)
    setSearch('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      setSearch('')
    }
    if (e.key === 'Enter' && filteredOptions.length === 1) {
      handleSelect(filteredOptions[0])
    }
  }

  return (
    <td
      ref={containerRef}
      className={`px-4 py-4 relative cursor-pointer ${cellErrorClass}`}
      onDoubleClick={() => setIsOpen(true)}
      title={cell.errorMessage}
    >
      {isOpen ? (
        <div className="absolute inset-0 z-20">
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={UI_MESSAGES.SEARCH_PLACEHOLDER}
            className="w-full px-4 py-3 bg-bg-purple/10 border-2 border-bg-purple outline-none text-body"
          />
          <div className="absolute top-full left-0 right-0 max-h-48 overflow-y-auto bg-white border border-bg-gray rounded-b-lg shadow-lg">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-2 text-body-subtle text-sm">
                {UI_MESSAGES.NO_RESULTS}
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <div
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className="px-4 py-2 hover:bg-bg-secondary cursor-pointer text-body text-sm"
                >
                  {opt}
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <span className={`block truncate ${textClass}`}>
          {cell.value ?? ''}
        </span>
      )}
    </td>
  )
}
