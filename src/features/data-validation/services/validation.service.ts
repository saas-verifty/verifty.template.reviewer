import { TableData } from '../types/table.types'
import { RowValidationResult, CellError } from '../types/validation.types'

import { ParsedExcelData } from '../types/excel.types'
import {
  REQUIRED_FIELDS,
  FIELD_TYPES,
  ENUM_FIELDS,
  CATALOG_FIELDS,
  HIERARCHY_FIELDS,
  HAZARD_TYPES,
  HAZARD_TYPE_TO_CATALOG_KEY,
} from '../constants/validationRules'

import {
  validateCatalogReference,
  validateHazardRow,
  normalizeValue,
  buildCatalogIndex,
  CatalogIndex,
} from './catalogValidator.service'
import { ERROR_MESSAGES } from '@/constants/errorMessages'

/**
 * Valida el tipo del campo según FIELD_TYPES
 */
function validateType(value: unknown, expected: string): boolean {
  if (value === null || value === undefined || value === '') return true

  switch (expected) {
    case 'string':
      return typeof value === 'string' || typeof value === 'number'
    case 'number':
      return !isNaN(Number(value))
    case 'boolean':
      return (
        value === true ||
        value === false ||
        value === 'true' ||
        value === 'false'
      )
    default:
      return true
  }
}

/**
 * Extrae el valor de una celda (puede ser CellData o valor directo)
 */
function getCellValue(cell: unknown): unknown {
  if (cell && typeof cell === 'object' && 'value' in cell) {
    return (cell as { value: unknown }).value
  }
  return cell
}

/**
 * Verifica jerarquía básica: proceso → actividad → subactividad → peligro
 */
function validateHierarchy(row: any): string | null {
  const proceso = normalizeValue(getCellValue(row[HIERARCHY_FIELDS.proceso]))
  const actividad = normalizeValue(
    getCellValue(row[HIERARCHY_FIELDS.actividad])
  )
  const subactividad = normalizeValue(
    getCellValue(row[HIERARCHY_FIELDS.subactividad])
  )
  const peligro = normalizeValue(getCellValue(row[HIERARCHY_FIELDS.peligro]))

  if (!proceso && (actividad || subactividad || peligro)) {
    return ERROR_MESSAGES.PROCESS_REQUIRED_FOR_CHILDREN
  }

  if (!actividad && (subactividad || peligro)) {
    return ERROR_MESSAGES.ACTIVITY_REQUIRED_FOR_CHILDREN
  }

  if (!subactividad && peligro) {
    return ERROR_MESSAGES.SUBACTIVITY_REQUIRED_FOR_DANGER
  }

  return null
}

/**
 * Valida una sola fila (row)
 */
function validateRow(
  row: any,
  rowIndex: number,
  catalogIndex: CatalogIndex
): RowValidationResult {
  const errors: CellError[] = []

  // 1. Campos requeridos
  for (const field of REQUIRED_FIELDS) {
    const value = getCellValue(row[field])
    if (value === null || value === undefined || value === '') {
      errors.push({
        rowIndex,
        columnName: field,
        errorType: 'required',
      })
    }
  }

  // 2. Tipos de datos
  for (const field of Object.keys(FIELD_TYPES)) {
    const expectedType = FIELD_TYPES[field]
    const value = getCellValue(row[field])

    if (!validateType(value, expectedType)) {
      errors.push({
        rowIndex,
        columnName: field,
        errorType: 'invalid_type',
      })
    }
  }

  // 3. Enums (solo campos que NO están en CATALOG_FIELDS)
  for (const field of Object.keys(ENUM_FIELDS)) {
    if (CATALOG_FIELDS[field]) continue // evita validación duplicada
    const allowed = ENUM_FIELDS[field]
    const value = normalizeValue(getCellValue(row[field]))
    if (value && !allowed.includes(value)) {
      errors.push({
        rowIndex,
        columnName: field,
        errorType: 'enum_mismatch',
      })
    }
  }

  // 4. Catálogos (Áreas, Cargos, etc. - NO peligros)
  for (const field of Object.keys(CATALOG_FIELDS)) {
    const { type, key } = CATALOG_FIELDS[field]
    const value = getCellValue(row[field])

    const result = validateCatalogReference(catalogIndex, {
      fieldType: type,
      key,
      value,
    })

    if (!result.valid) {
      errors.push({
        rowIndex,
        columnName: field,
        errorType: 'catalog_not_found',
        errorMessage: result.message,
      })
    }
  }

  // 5. Validación dinámica de peligros según tipo
  const tipoPeligro = String(getCellValue(row['peligro']) ?? '').trim()

  // Validar que el tipo de peligro sea válido
  if (tipoPeligro && !HAZARD_TYPES.includes(tipoPeligro as any)) {
    errors.push({
      rowIndex,
      columnName: 'peligro',
      errorType: 'catalog_not_found',
      errorMessage: `"${tipoPeligro}" no es un tipo de peligro válido. Valores permitidos: ${HAZARD_TYPES.join(', ')}`,
    })
  } else if (tipoPeligro) {
    // Validar que los campos de peligro correspondan a una fila del catálogo
    const catalogKey = HAZARD_TYPE_TO_CATALOG_KEY[tipoPeligro]

    const hazardResult = validateHazardRow(catalogIndex, catalogKey, {
      descripcion_peligro: getCellValue(row['descripcion_peligro']),
      descripcion_especifica_peligro: getCellValue(
        row['descripcion_especifica_peligro']
      ),
      consecuencia_efecto_posible: getCellValue(
        row['consecuencia_efecto_posible']
      ),
    })

    if (!hazardResult.valid) {
      for (const field of hazardResult.invalidFields) {
        errors.push({
          rowIndex,
          columnName: field,
          errorType: 'catalog_not_found',
          errorMessage:
            hazardResult.message ??
            `Campo inválido en catálogo de ${tipoPeligro}`,
        })
      }
    }
  }

  // 6. Jerarquía
  const hierarchyError = validateHierarchy(row)
  if (hierarchyError) {
    errors.push({
      rowIndex,
      columnName: HIERARCHY_FIELDS.peligro,
      errorType: 'hierarchy_error',
      errorMessage: hierarchyError,
    })
  }

  return {
    rowIndex,
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Valida toda la tabla.
 * Construye el índice de catálogos UNA sola vez para optimizar rendimiento.
 */
export function validateTable(
  table: TableData,
  parsedData: ParsedExcelData
): RowValidationResult[] {
  const catalogIndex = buildCatalogIndex(parsedData)
  const results: RowValidationResult[] = []

  for (let i = 0; i < table.length; i++) {
    const row = table[i].cells
    const result = validateRow(row, i, catalogIndex)
    results.push(result)
  }

  return results
}
