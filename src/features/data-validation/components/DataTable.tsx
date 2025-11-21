import { TableRow } from './TableRow'

import { TableData } from '../types/table.types'
import { ParsedExcelData } from '../types/excel.types'

type Props = {
  table: TableData
  headers: string[]
  onChange: (rowIndex: number, columnName: string, value: string) => void
  catalogData?: ParsedExcelData | null
}

export function DataTable({ table, headers, onChange, catalogData }: Props) {
  return (
    <div className="overflow-auto max-h-[600px] border border-bg-gray rounded-xl">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10">
          <tr className="bg-bg-secondary">
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-4 text-left font-medium text-body border-b border-bg-gray whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.map((row) => (
            <TableRow
              key={row.rowIndex}
              row={row}
              onChange={onChange}
              catalogData={catalogData}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
