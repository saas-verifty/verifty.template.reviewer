export interface CellData {
  value: string | number | null
  originalValue: string | number | null
  isEdited: boolean
  hasError: boolean
  errorMessage?: string
  columnName: string
  rowIndex: number
}

export interface RowData {
  rowIndex: number
  cells: { [ColumnName: string]: CellData }
  hasError: boolean
  isEdited: boolean
}

export type TableData = RowData[]
