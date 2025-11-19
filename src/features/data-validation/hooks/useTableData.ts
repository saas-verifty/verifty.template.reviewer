import { useState } from 'react'
import { ParsedExcelData } from '../types/excel.types'
import { CellData, RowData, TableData } from '../types/table.types'

export default function useTableData() {
  const [table, setTable] = useState<TableData>([])

  const initializeTable = (data: ParsedExcelData) => {
    if (!data) return

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

    setTable(newTable)
  }

  const updateCell = (rowIndex: number, columnName: string, newValue: any) => {
    setTable((prev) =>
      prev.map((row) => {
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
    )
  }

  const clearTable = () => {
    setTable([])
  }

  return { table, initializeTable, updateCell, clearTable }
}
