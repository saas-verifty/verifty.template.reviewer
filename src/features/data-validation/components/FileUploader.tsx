import { useState, useRef } from 'react'

type Props = {
  onFileSelected: (file: File) => void
  disable: boolean
}

export const FileUploader = ({ onFileSelected, disable }: Props) => {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    onFileSelected(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disable) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disable) return

    const file = e.dataTransfer.files?.[0]
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      onFileSelected(file)
    }
  }

  const handleClick = () => {
    if (!disable) inputRef.current?.click()
  }

  return (
    <div className="w-full max-w-xl">
      <p className="text-body text-sm mb-2">Solo archivos Excel (.xlsx, .xls)</p>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-10 cursor-pointer transition-colors
          flex flex-col items-center justify-center gap-4
          ${isDragging ? 'border-bg-purple bg-bg-purple/10' : 'border-bg-gray bg-bg-secondary'}
          ${disable ? 'opacity-50 cursor-not-allowed' : 'hover:border-bg-purple hover:bg-bg-purple/10'}
        `}
      >
        <div className="text-body-subtle">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <p className="text-body text-center">
          Clic para cargar archivo o arrastra y suelta
        </p>

        <p className="text-body-subtle text-sm">Max. File Size: 10MB</p>

        <button
          type="button"
          disabled={disable}
          className="px-6 py-2 bg-bg-purple text-white rounded-full font-medium hover:opacity-90 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Buscar archivo
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleChange}
          disabled={disable}
          className="hidden"
        />
      </div>
    </div>
  )
}
