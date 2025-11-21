import { useState, useCallback } from 'react'
import { ParsedExcelData } from '../types/excel.types'
import { CellData, RowData, TableData } from '../types/table.types'
import { validateTable } from '../services/validation.service'

export default function useTableData() {
  const [table, setTable] = useState<TableData>([])
  const [parsedData, setParsedData] = useState<ParsedExcelData | null>(null)

  const applyValidationErrors = useCallback(
    (currentTable: TableData, data: ParsedExcelData): TableData => {
      const validationResults = validateTable(currentTable, data)

      return currentTable.map((row) => {
        const rowResult = validationResults.find((r) => r.rowIndex === row.rowIndex)
        const rowHasError = rowResult ? !rowResult.isValid : false

        const updatedCells: RowData['cells'] = {}
        for (const colName of Object.keys(row.cells)) {
          const cell = row.cells[colName]
          const cellError = rowResult?.errors.find((e) => e.columnName === colName)

          updatedCells[colName] = {
            ...cell,
            hasError: !!cellError,
            errorMessage: cellError?.errorMessage,
          }
        }

        return {
          ...row,
          hasError: rowHasError,
          cells: updatedCells,
        }
      })
    },
    []
  )

  const initializeTable = useCallback((data: ParsedExcelData) => {
    if (!data) return

    setParsedData(data)
    const headers = data.mainSheet.headers
    const rows = data.mainSheet.data

    const newTable: TableData = rows.map((row, rowIndex) => {
      const cells: RowData['cells'] = {}

      headers.forEach((col) => {
        const value = (row as Record<string, any>)[col] ?? ''

        const cell: CellData = {
          value,
          originalValue: value,
          isEdited: false,
          hasError: false,
          columnName: col,
          rowIndex,
        }

        cells[col] = cell
      })

      return {
        rowIndex,
        hasError: false,
        isEdited: false,
        cells,
      }
    })

    // Aplicar validación inicial
    const validatedTable = applyValidationErrors(newTable, data)
    setTable(validatedTable)
  }, [applyValidationErrors])

  const updateCell = useCallback(
    (rowIndex: number, columnName: string, newValue: string) => {
      setTable((prev) => {
        const updatedTable = prev.map((row) => {
          if (row.rowIndex !== rowIndex) return row

          const cell = row.cells[columnName]

          const updatedCell: CellData = {
            ...cell,
            value: newValue,
            isEdited: newValue !== cell.originalValue,
          }

          return {
            ...row,
            isEdited: row.isEdited || updatedCell.isEdited,
            cells: {
              ...row.cells,
              [columnName]: updatedCell,
            },
          }
        })

        // Re-validar después de actualizar
        if (parsedData) {
          return applyValidationErrors(updatedTable, parsedData)
        }
        return updatedTable
      })
    },
    [parsedData, applyValidationErrors]
  )

  const clearTable = useCallback(() => {
    setTable([])
    setParsedData(null)
  }, [])

  const hasErrors = table.some((row) => row.hasError)

  return { table, initializeTable, updateCell, clearTable, hasErrors, parsedData }
}
