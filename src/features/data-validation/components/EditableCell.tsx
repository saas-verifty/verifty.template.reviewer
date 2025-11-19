import { CellData } from '../types/table.types'

type Props = {
  cell: CellData
  onChange: (value: string) => void
}

export function EditableCell({ cell, onChange }: Props) {
  return (
    <td>
      <input
        value={cell.value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </td>
  )
}
