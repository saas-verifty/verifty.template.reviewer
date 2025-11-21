import { EditableCell } from './EditableCell'
import { SelectCell } from './SelectCell'

import { RowData } from '../types/table.types'
import { ParsedExcelData, HazardCatalogRow } from '../types/excel.types'
import {
  CATALOG_FIELDS,
  HAZARD_TYPES,
  HAZARD_TYPE_TO_CATALOG_KEY,
} from '../constants/validationRules'

type Props = {
  row: RowData
  onChange: (rowIndex: number, columnName: string, value: string) => void
  catalogData?: ParsedExcelData | null
}

function getOptionsForColumn(
  columnName: string,
  row: RowData,
  catalogData: ParsedExcelData | null | undefined
): string[] | null {
  if (!catalogData) return null

  // Columna "peligro" - tipos de peligro fijos
  if (columnName === 'peligro') {
    return [...HAZARD_TYPES]
  }

  // Columnas de listas de validación (frecuencia, cargo, etc.)
  if (CATALOG_FIELDS[columnName]) {
    const key = CATALOG_FIELDS[columnName].key as keyof ParsedExcelData['validationSheet']['data'][0]
    const values = catalogData.validationSheet.data
      .map((r) => r[key])
      .filter((v): v is string => !!v && v.trim() !== '')
    return [...new Set(values)]
  }

  // Filtrado en cascada para campos de peligro
  const tipoPeligro = String(row.cells['peligro']?.value ?? '').trim()
  if (!tipoPeligro) return null

  const catalogKey = HAZARD_TYPE_TO_CATALOG_KEY[tipoPeligro] as keyof ParsedExcelData['hazardCatalog']
  if (!catalogKey || !catalogData.hazardCatalog[catalogKey]) return null

  let hazardRows: HazardCatalogRow[] = catalogData.hazardCatalog[catalogKey]

  // descripcion_peligro: solo filtrar por tipo de peligro
  if (columnName === 'descripcion_peligro') {
    const values = hazardRows.map((r) => r.descripcion_peligro).filter((v) => !!v && v.trim() !== '')
    return [...new Set(values)]
  }

  // descripcion_especifica_peligro: filtrar por descripcion_peligro seleccionada
  if (columnName === 'descripcion_especifica_peligro') {
    const descPeligro = String(row.cells['descripcion_peligro']?.value ?? '').trim()
    if (descPeligro) {
      hazardRows = hazardRows.filter((r) => r.descripcion_peligro === descPeligro)
    }
    const values = hazardRows.map((r) => r.descripcion_especifica_peligro ?? '')
    // Incluir vacío si existe en el catálogo
    const uniqueValues = [...new Set(values)]
    if (uniqueValues.some((v) => v === '')) {
      return ['(Vacío)', ...uniqueValues.filter((v) => v !== '')]
    }
    return uniqueValues.filter((v) => v !== '')
  }

  // consecuencia_efecto_posible: filtrar por descripcion_peligro Y descripcion_especifica
  if (columnName === 'consecuencia_efecto_posible') {
    const descPeligro = String(row.cells['descripcion_peligro']?.value ?? '').trim()
    const descEspecifica = String(row.cells['descripcion_especifica_peligro']?.value ?? '').trim()

    if (descPeligro) {
      hazardRows = hazardRows.filter((r) => r.descripcion_peligro === descPeligro)
    }
    // Filtrar por especifica (puede ser vacío)
    if (descEspecifica === '(Vacío)' || descEspecifica === '') {
      hazardRows = hazardRows.filter((r) => !r.descripcion_especifica_peligro || r.descripcion_especifica_peligro.trim() === '')
    } else if (descEspecifica) {
      hazardRows = hazardRows.filter((r) => r.descripcion_especifica_peligro === descEspecifica)
    }

    const values = hazardRows.map((r) => r.consecuencia_efecto_posible).filter((v) => !!v && v.trim() !== '')
    return [...new Set(values)]
  }

  return null
}

export function TableRow({ row, onChange, catalogData }: Props) {
  const rowErrorClass = row.hasError ? 'bg-bg-error-row' : ''

  return (
    <tr
      className={`border-b border-bg-gray hover:bg-bg-secondary transition-colors ${rowErrorClass}`}
    >
      {Object.values(row.cells).map((cell) => {
        const options = getOptionsForColumn(cell.columnName, row, catalogData)

        if (options) {
          return (
            <SelectCell
              key={cell.columnName}
              cell={cell}
              options={options}
              onChange={(value) => onChange(row.rowIndex, cell.columnName, value)}
            />
          )
        }

        return (
          <EditableCell
            key={cell.columnName}
            cell={cell}
            onChange={(value) => onChange(row.rowIndex, cell.columnName, value)}
          />
        )
      })}
    </tr>
  )
}
