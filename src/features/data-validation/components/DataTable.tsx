import { TableRow } from './TableRow'

import { TableData } from '../types/table.types'

type Props = {
  table: TableData
  headers: string[]
  onChange: (rowIndex: number, columnName: string, value: string) => void
}

export function DataTable({ table, headers, onChange }: Props) {
  return (
    <table border={1}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.map((row) => (
          <TableRow key={row.rowIndex} row={row} onChange={onChange} />
        ))}
      </tbody>
    </table>
  )
}
