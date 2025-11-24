import {
  CellError,
  RowValidationResult,
  ValidationResult,
  ErrorSummary,
  ErrorType,
} from '../types/validation.types'
import { VALIDATION_MESSAGES } from '@/constants/validationMessages'

const defaultMessages: Record<ErrorType, string> = VALIDATION_MESSAGES

export function formatCellError(error: CellError): string {
  const base = defaultMessages[error.errorType] ?? 'Error'
  const detail = error.errorMessage ? `: ${error.errorMessage}` : ''
  const rowDisplay =
    typeof error.rowIndex === 'number'
      ? `Fila ${error.rowIndex + 1}`
      : `Fila ${error.rowIndex}`
  return `${rowDisplay} — ${error.columnName}: ${base}${detail}`
}

export function formatRowErrors(row: RowValidationResult): string[] {
  return row.errors.map(formatCellError)
}

export function groupErrorsByType(
  rows: RowValidationResult[]
): Record<ErrorType, CellError[]> {
  const result: Record<ErrorType, CellError[]> = {
    required: [],
    invalid_type: [],
    enum_mismatch: [],
    catalog_not_found: [],
    hierarchy_error: [],
  }
  for (const r of rows) {
    for (const e of r.errors) {
      result[e.errorType].push(e)
    }
  }
  return result
}

export function countErrorsByType(rows: RowValidationResult[]): ErrorSummary {
  const grouped = groupErrorsByType(rows)
  return {
    required: grouped.required.length,
    invalid_type: grouped.invalid_type.length,
    enum_mismatch: grouped.enum_mismatch.length,
    catalog_not_found: grouped.catalog_not_found.length,
    hierarchy_error: grouped.hierarchy_error.length,
  }
}

export function buildValidationSummary(
  rows: RowValidationResult[]
): ValidationResult {
  const totalRows = rows.length
  const errorRows = rows.filter((r) => !r.isValid).length
  const validRows = totalRows - errorRows
  const errorsByType = countErrorsByType(rows)
  return {
    isValid: errorRows === 0,
    totalRows,
    validRows,
    errorRows,
    rowResults: rows,
    errorsByType,
  }
}
