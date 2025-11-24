/**
 * Mensajes de validación centralizados
 * Mensajes usados en el sistema de validación de datos
 */

import { ErrorType } from '@/features/data-validation/types/validation.types'

export const VALIDATION_MESSAGES: Record<ErrorType, string> = {
  required: 'Campo requerido',
  invalid_type: 'Tipo de dato inválido',
  enum_mismatch: 'Valor no permitido',
  catalog_not_found: 'Referencia de catálogo no encontrada',
  hierarchy_error: 'Error de jerarquía',
} as const

export type ValidationMessageKey = ErrorType
