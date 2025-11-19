import { EditableCell } from './EditableCell'

import { RowData } from '../types/table.types'

type Props = {
  row: RowData
  onChange: (rowIndex: number, columnName: string, value: string) => void
}

export function TableRow({ row, onChange }: Props) {
  return (
    <tr>
      {Object.values(row.cells).map((cell) => (
        <EditableCell
          key={cell.columnName}
          cell={cell}
          onChange={(value) => onChange(row.rowIndex, cell.columnName, value)}
        />
      ))}
    </tr>
  )
}
