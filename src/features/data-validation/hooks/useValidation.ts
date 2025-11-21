import { useState, useCallback } from 'react'
import { TableData } from '../types/table.types'
import { ParsedExcelData } from '../types/excel.types'
import {
  ValidationState,
  ValidationResult,
} from '../types/validation.types'
import { validateTable } from '../services/validation.service'
import { buildValidationSummary } from '../utils/errorFormatter'

const initialState: ValidationState = {
  status: 'idle',
  progress: 0,
  result: undefined,
  error: undefined,
}

export function useValidation() {
  const [state, setState] = useState<ValidationState>(initialState)

  const validate = useCallback(
    async (
      tableData: TableData,
      parsedData: ParsedExcelData
    ): Promise<ValidationResult | null> => {
      setState({ status: 'validating', progress: 0, result: undefined, error: undefined })

      try {
        // Simular progreso para UX (validación es síncrona pero puede tomar tiempo)
        setState((prev) => ({ ...prev, progress: 30 }))

        const rowResults = validateTable(tableData, parsedData)

        setState((prev) => ({ ...prev, progress: 80 }))

        const result = buildValidationSummary(rowResults)

        setState({
          status: 'completed',
          progress: 100,
          result,
          error: undefined,
        })

        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error de validación desconocido'
        setState({
          status: 'error',
          progress: 0,
          result: undefined,
          error: errorMessage,
        })
        return null
      }
    },
    []
  )

  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  return {
    ...state,
    validate,
    reset,
  }
}
