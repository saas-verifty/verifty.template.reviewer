export type ErrorType =
  | 'required'
  | 'invalid_type'
  | 'enum_mismatch'
  | 'catalog_not_found'
  | 'hierarchy_error'

export interface CellError {
  columnName: string
  rowIndex: number
  errorMessage?: string
  errorType: ErrorType
}

export interface RowValidationResult {
  rowIndex: number
  isValid: boolean
  errors: CellError[]
}

export interface ValidationResult {
  isValid: boolean
  totalRows: number
  validRows: number
  errorRows: number
  rowResults: RowValidationResult[]
  errorsByType: ErrorSummary
}

export interface ErrorSummary {
  required: number
  invalid_type: number
  enum_mismatch: number
  catalog_not_found: number
  hierarchy_error: number
}

export interface ValidatedCell {
  value: string | number | boolean | null
  originalValue: string | number | boolean | null
  isEdited: boolean
  hasError: boolean
  errorMessage?: string
  columnName: string
  rowIndex: number
}

export interface ValidatedRow {
  rowIndex: number
  cells: { [columnName: string]: ValidatedCell }
  hasError: boolean
  isEdited: boolean
}

export interface ValidationState {
  status: 'idle' | 'validating' | 'completed' | 'error'
  progress: number
  result?: ValidationResult
  error?: string
}
