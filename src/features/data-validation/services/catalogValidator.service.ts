import { ParsedExcelData } from '../types/excel.types'
import { VALIDATION_LIST_FIELDS } from '../constants/validationRules'

/**
 * Representa una fila normalizada del catálogo de peligros
 */
export interface NormalizedHazardRow {
  descripcion_peligro: string
  descripcion_especifica_peligro: string
  consecuencia_efecto_posible: string
}

/**
 * Índices de catálogos para búsquedas rápidas
 */
export type CatalogIndex = {
  validationSets: Record<string, Set<string>>
  hazardRows: Record<string, NormalizedHazardRow[]> // filas completas por tipo de peligro
}

/**
 * Normaliza un valor para comparación.
 * Convierte a string, trim, lowercase, y normaliza unicode (NFD -> NFC)
 */
export function normalizeValue(v: unknown): string {
  if (v === null || v === undefined) return ''
  return String(v).trim().toLowerCase().normalize('NFC') // Normaliza caracteres unicode (ej: è vs è compuesto)
}

/**
 * Construye índices para búsquedas rápidas a partir del ParsedExcelData.
 * SE USA UNA SOLA VEZ POR ARCHIVO, NO EN CADA VALIDACIÓN.
 */
export function buildCatalogIndex(parsed: ParsedExcelData): CatalogIndex {
  const validationSets: Record<string, Set<string>> = {}
  const hazardRows: Record<string, NormalizedHazardRow[]> = {}

  const validationData = parsed.validationSheet?.data ?? []
  const validationFields = Object.values(VALIDATION_LIST_FIELDS)

  for (const field of validationFields) {
    validationSets[field] = new Set<string>()
  }

  for (const row of validationData) {
    for (const field of validationFields) {
      const raw = row[field]
      if (!raw) continue

      String(raw)
        .split(/[,;]+/)
        .map(normalizeValue)
        .filter(Boolean)
        .forEach((val) => validationSets[field].add(val))
    }
  }

  // Guardar filas completas normalizadas del catálogo de peligros
  for (const [key, list] of Object.entries(parsed.hazardCatalog)) {
    hazardRows[key] = list.map((entry) => ({
      descripcion_peligro: normalizeValue(entry.descripcion_peligro),
      descripcion_especifica_peligro: normalizeValue(
        entry.descripcion_especifica_peligro
      ),
      consecuencia_efecto_posible: normalizeValue(
        entry.consecuencia_efecto_posible
      ),
    }))
  }

  return { validationSets, hazardRows }
}

/**
 * Revisa si value pertenece a una lista de validación.
 * - value puede ser "A" o "A,B"
 * - index debe ser pre-construido con buildCatalogIndex()
 */
export function isInValidationList(
  index: CatalogIndex,
  fieldKey: string,
  value: unknown
): boolean {
  if (value === null || value === undefined || value === '') return false

  const set = index.validationSets[fieldKey]
  if (!set) return false

  const parts = String(value).split(/[,;]+/).map(normalizeValue).filter(Boolean)

  return parts.every((p) => set.has(p))
}

/**
 * Valida los campos de peligro contra el catálogo.
 * - descripcion_peligro debe existir en el catálogo del tipo de peligro
 * - descripcion_especifica_peligro y consecuencia_efecto_posible deben existir
 *   en alguna fila donde descripcion_peligro coincida
 */
export function validateHazardRow(
  index: CatalogIndex,
  catalogKey: string,
  values: {
    descripcion_peligro: unknown
    descripcion_especifica_peligro: unknown
    consecuencia_efecto_posible: unknown
  }
): { valid: boolean; invalidFields: string[]; message?: string } {
  const rows = index.hazardRows[catalogKey]
  if (!rows) {
    return {
      valid: false,
      invalidFields: ['peligro'],
      message: `Catálogo "${catalogKey}" no encontrado`,
    }
  }

  const normDesc = normalizeValue(values.descripcion_peligro)
  const normDescEsp = normalizeValue(values.descripcion_especifica_peligro)
  const normConsec = normalizeValue(values.consecuencia_efecto_posible)

  // Buscar filas que coincidan con descripcion_peligro
  const matchingRows = rows.filter((r) => r.descripcion_peligro === normDesc)

  if (matchingRows.length === 0 && normDesc) {
    return {
      valid: false,
      invalidFields: ['descripcion_peligro'],
      message: `"${values.descripcion_peligro}" no existe en el catálogo`,
    }
  }

  // Construir sets de valores válidos de las filas que coinciden con descripcion_peligro
  const validDescEsp = new Set(
    matchingRows.map((r) => r.descripcion_especifica_peligro)
  )
  const validConsec = new Set(
    matchingRows.map((r) => r.consecuencia_efecto_posible)
  )

  const invalidFields: string[] = []

  // Verificar descripcion_especifica_peligro (puede estar vacío)
  if (normDescEsp && !validDescEsp.has(normDescEsp)) {
    invalidFields.push('descripcion_especifica_peligro')
  }

  // Verificar consecuencia_efecto_posible (puede estar vacío)
  if (normConsec && !validConsec.has(normConsec)) {
    invalidFields.push('consecuencia_efecto_posible')
  }

  if (invalidFields.length > 0) {
    return {
      valid: false,
      invalidFields,
      message: `Los campos no corresponden a "${values.descripcion_peligro}" en el catálogo`,
    }
  }

  return { valid: true, invalidFields: [] }
}

/**
 * Valida una referencia de lista de validación y devuelve { valid, message }
 */
export function validateCatalogReference(
  index: CatalogIndex,
  options: {
    fieldType: 'validationList'
    key: string
    value: unknown
  }
): { valid: boolean; message?: string } {
  const { key, value } = options

  const ok = isInValidationList(index, key, value)
  return ok
    ? { valid: true }
    : {
        valid: false,
        message: `"${value}" no está en lista de validación ${key}`,
      }
}
