import { TableData } from '../types/table.types'
import { UI_MESSAGES } from '@/constants/uiMessages'

type Props = {
  table: TableData
}

type ErrorDetail = {
  rowIndex: number
  columnName: string
  message?: string
}

export function ErrorSummary({ table }: Props) {
  const errors: ErrorDetail[] = []

  table.forEach((row) => {
    Object.values(row.cells).forEach((cell) => {
      if (cell.hasError) {
        errors.push({
          rowIndex: cell.rowIndex,
          columnName: cell.columnName,
          message: cell.errorMessage,
        })
      }
    })
  })

  if (errors.length === 0) {
    return (
      <div className="mb-4 p-4 bg-bg-success-soft border border-fg-success rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-fg-success text-lg">✓</span>
          <span className="text-fg-success font-medium">
            {UI_MESSAGES.ALL_DATA_VALID}
          </span>
        </div>
      </div>
    )
  }

  const errorsByRow = errors.reduce(
    (acc, err) => {
      if (!acc[err.rowIndex]) acc[err.rowIndex] = []
      acc[err.rowIndex].push(err)
      return acc
    },
    {} as Record<number, ErrorDetail[]>
  )

  const rowsWithErrors = Object.keys(errorsByRow).length
  const totalErrors = errors.length

  return (
    <div className="mb-4 p-4 bg-bg-danger-soft border border-fg-danger rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-fg-danger text-lg">✕</span>
          <span className="text-fg-danger font-medium">
            {totalErrors} {UI_MESSAGES.ERROR(totalErrors)} en {rowsWithErrors}{' '}
            {UI_MESSAGES.ROW(rowsWithErrors)}
          </span>
        </div>
      </div>

      <div className="max-h-40 overflow-y-auto space-y-2">
        {Object.entries(errorsByRow)
          .slice(0, 10)
          .map(([rowIndex, rowErrors]) => (
            <div key={rowIndex} className="text-sm">
              <span className="font-medium text-fg-danger-strong">
                Fila {Number(rowIndex) + 1}:
              </span>{' '}
              <span className="text-body">
                {rowErrors.map((e) => e.columnName).join(', ')}
              </span>
              {rowErrors[0].message && (
                <span className="text-body-subtle ml-1">— {rowErrors[0].message}</span>
              )}
            </div>
          ))}
        {Object.keys(errorsByRow).length > 10 && (
          <div className="text-sm text-body-subtle">
            ... y {Object.keys(errorsByRow).length - 10} filas más con errores
          </div>
        )}
      </div>
    </div>
  )
}
