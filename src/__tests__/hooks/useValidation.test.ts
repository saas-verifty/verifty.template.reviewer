/**
 * Tests for useValidation hook
 */

import { renderHook, act } from '@testing-library/react'
import { useValidation } from '@/features/data-validation/hooks/useValidation'
import type { TableData } from '@/features/data-validation/types/table.types'
import type { ParsedExcelData } from '@/features/data-validation/types/excel.types'
import type { RowValidationResult } from '@/features/data-validation/types/validation.types'

// Mock the validation service and errorFormatter
jest.mock('@/features/data-validation/services/validation.service')
jest.mock('@/features/data-validation/utils/errorFormatter')

import { validateTable } from '@/features/data-validation/services/validation.service'
import { buildValidationSummary } from '@/features/data-validation/utils/errorFormatter'

const mockValidateTable = validateTable as jest.MockedFunction<
  typeof validateTable
>
const mockBuildValidationSummary =
  buildValidationSummary as jest.MockedFunction<typeof buildValidationSummary>

describe('useValidation', () => {
  const mockTableData: TableData = [
    {
      rowIndex: 0,
      cells: {
        proceso: {
          value: 'Proceso 1',
          originalValue: 'Proceso 1',
          isEdited: false,
          hasError: false,
          columnName: 'proceso',
          rowIndex: 0,
        },
        actividad: {
          value: 'Actividad 1',
          originalValue: 'Actividad 1',
          isEdited: false,
          hasError: false,
          columnName: 'actividad',
          rowIndex: 0,
        },
      },
      hasError: false,
      isEdited: false,
    },
  ] as any

  const mockParsedData: ParsedExcelData = {
    mainSheet: {
      name: 'Plantilla de Carga',
      headers: ['proceso', 'actividad'],
      data: [],
    },
    validationSheet: {
      name: 'Listas de Validacion',
      headers: [],
      data: [],
    },
    hazardCatalog: {
      biologico: [],
      fisico: [],
      quimico: [],
      psicosocial: [],
      biomecanico: [],
      condiciones_seguridad: [],
      fenomenos_naturales: [],
    },
  }

  const mockRowResults: RowValidationResult[] = [
    {
      rowIndex: 0,
      isValid: true,
      errors: [],
    },
  ]

  const mockValidationResult = {
    isValid: true,
    totalRows: 1,
    validRows: 1,
    errorRows: 0,
    rowResults: mockRowResults,
    errorsByType: {
      required: 0,
      invalid_type: 0,
      enum_mismatch: 0,
      catalog_not_found: 0,
      hierarchy_error: 0,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockValidateTable.mockReturnValue(mockRowResults)
    mockBuildValidationSummary.mockReturnValue(mockValidationResult)
  })

  describe('Initial state', () => {
    it('should initialize with idle status', () => {
      // Act
      const { result } = renderHook(() => useValidation())

      // Assert
      expect(result.current.status).toBe('idle')
      expect(result.current.progress).toBe(0)
      expect(result.current.result).toBeUndefined()
      expect(result.current.error).toBeUndefined()
    })
  })

  describe('validate', () => {
    it('should validate table successfully', async () => {
      // Arrange
      const { result } = renderHook(() => useValidation())

      // Act
      let validationResult
      await act(async () => {
        validationResult = await result.current.validate(
          mockTableData,
          mockParsedData
        )
      })

      // Assert
      expect(result.current.status).toBe('completed')
      expect(result.current.progress).toBe(100)
      expect(result.current.result).toEqual(mockValidationResult)
      expect(result.current.error).toBeUndefined()
      expect(validationResult).toEqual(mockValidationResult)
    })

    it('should call validateTable with correct arguments', async () => {
      // Arrange
      const { result } = renderHook(() => useValidation())

      // Act
      await act(async () => {
        await result.current.validate(mockTableData, mockParsedData)
      })

      // Assert
      expect(mockValidateTable).toHaveBeenCalledWith(
        mockTableData,
        mockParsedData
      )
    })

    it('should call buildValidationSummary with row results', async () => {
      // Arrange
      const { result } = renderHook(() => useValidation())

      // Act
      await act(async () => {
        await result.current.validate(mockTableData, mockParsedData)
      })

      // Assert
      expect(mockBuildValidationSummary).toHaveBeenCalledWith(mockRowResults)
    })

    it('should reach completed status after validation', async () => {
      // Arrange
      const { result } = renderHook(() => useValidation())

      // Act
      await act(async () => {
        await result.current.validate(mockTableData, mockParsedData)
      })

      // Assert - Should be completed
      expect(result.current.status).toBe('completed')
    })

    it('should reach 100% progress after validation', async () => {
      // Arrange
      const { result } = renderHook(() => useValidation())

      // Act
      await act(async () => {
        await result.current.validate(mockTableData, mockParsedData)
      })

      // Assert - Should have completed with 100% progress
      expect(result.current.progress).toBe(100)
      expect(result.current.status).toBe('completed')
    })

    it('should handle validation errors', async () => {
      // Arrange
      const { result } = renderHook(() => useValidation())
      const errorMessage = 'Validation failed'
      mockValidateTable.mockImplementation(() => {
        throw new Error(errorMessage)
      })

      // Act
      let validationResult
      await act(async () => {
        validationResult = await result.current.validate(
          mockTableData,
          mockParsedData
        )
      })

      // Assert
      expect(result.current.status).toBe('error')
      expect(result.current.error).toBe(errorMessage)
      expect(result.current.progress).toBe(0)
      expect(result.current.result).toBeUndefined()
      expect(validationResult).toBeNull()
    })

    it('should handle non-Error validation failures', async () => {
      // Arrange
      const { result } = renderHook(() => useValidation())
      mockValidateTable.mockImplementation(() => {
        throw 'String error'
      })

      // Act
      await act(async () => {
        await result.current.validate(mockTableData, mockParsedData)
      })

      // Assert
      expect(result.current.status).toBe('error')
      expect(result.current.error).toBe('Error de validación desconocido')
      expect(result.current.result).toBeUndefined()
    })

    it('should handle validation with errors in data', async () => {
      // Arrange
      const { result } = renderHook(() => useValidation())
      const invalidRowResults: RowValidationResult[] = [
        {
          rowIndex: 0,
          isValid: false,
          errors: [
            { rowIndex: 0, columnName: 'proceso', errorType: 'required' },
          ],
        },
      ]
      const invalidResult = {
        isValid: false,
        totalRows: 1,
        validRows: 0,
        errorRows: 1,
        rowResults: invalidRowResults,
        errorsByType: {
          required: 1,
          invalid_type: 0,
          enum_mismatch: 0,
          catalog_not_found: 0,
          hierarchy_error: 0,
        },
      }

      mockValidateTable.mockReturnValue(invalidRowResults)
      mockBuildValidationSummary.mockReturnValue(invalidResult)

      // Act
      await act(async () => {
        await result.current.validate(mockTableData, mockParsedData)
      })

      // Assert
      expect(result.current.status).toBe('completed')
      expect(result.current.result).toEqual(invalidResult)
      expect(result.current.result?.isValid).toBe(false)
      expect(result.current.result?.errorRows).toBe(1)
    })

    it('should clear previous results when starting new validation', async () => {
      // Arrange
      const { result } = renderHook(() => useValidation())

      // First validation
      await act(async () => {
        await result.current.validate(mockTableData, mockParsedData)
      })
      expect(result.current.result).toBeDefined()

      // Act - Second validation
      await act(async () => {
        await result.current.validate(mockTableData, mockParsedData)
      })

      // Assert - Should have new result
      expect(result.current.status).toBe('completed')
      expect(result.current.result).toBeDefined()
    })

    it('should handle large table data', async () => {
      // Arrange
      const { result } = renderHook(() => useValidation())
      const largeTableData: TableData = Array.from({ length: 100 }, (_, i) => ({
        rowIndex: i,
        cells: {
          proceso: {
            value: `Proceso ${i}`,
            originalValue: `Proceso ${i}`,
            isEdited: false,
            hasError: false,
            columnName: 'proceso',
            rowIndex: i,
          },
        },
        hasError: false,
        isEdited: false,
      })) as any

      const largeRowResults = Array.from({ length: 100 }, (_, i) => ({
        rowIndex: i,
        isValid: true,
        errors: [],
      }))

      mockValidateTable.mockReturnValue(largeRowResults)
      mockBuildValidationSummary.mockReturnValue({
        ...mockValidationResult,
        totalRows: 100,
        validRows: 100,
        rowResults: largeRowResults,
      })

      // Act
      await act(async () => {
        await result.current.validate(largeTableData, mockParsedData)
      })

      // Assert
      expect(result.current.status).toBe('completed')
      expect(result.current.result?.totalRows).toBe(100)
    })
  })

  describe('reset', () => {
    it('should reset to initial state', async () => {
      // Arrange
      const { result } = renderHook(() => useValidation())

      // Perform validation
      await act(async () => {
        await result.current.validate(mockTableData, mockParsedData)
      })

      expect(result.current.status).not.toBe('idle')
      expect(result.current.result).toBeDefined()

      // Act
      act(() => {
        result.current.reset()
      })

      // Assert
      expect(result.current.status).toBe('idle')
      expect(result.current.progress).toBe(0)
      expect(result.current.result).toBeUndefined()
      expect(result.current.error).toBeUndefined()
    })

    it('should reset error state', async () => {
      // Arrange
      const { result } = renderHook(() => useValidation())
      mockValidateTable.mockImplementation(() => {
        throw new Error('Test error')
      })

      await act(async () => {
        await result.current.validate(mockTableData, mockParsedData)
      })

      expect(result.current.error).toBeDefined()

      // Act
      act(() => {
        result.current.reset()
      })

      // Assert
      expect(result.current.error).toBeUndefined()
      expect(result.current.status).toBe('idle')
    })

    it('should allow validation after reset', async () => {
      // Arrange
      const { result } = renderHook(() => useValidation())

      // First validation
      await act(async () => {
        await result.current.validate(mockTableData, mockParsedData)
      })

      // Reset
      act(() => {
        result.current.reset()
      })

      // Act - Validate again
      await act(async () => {
        await result.current.validate(mockTableData, mockParsedData)
      })

      // Assert
      expect(result.current.status).toBe('completed')
      expect(result.current.result).toEqual(mockValidationResult)
    })
  })

  describe('State management', () => {
    it('should maintain state between validations', async () => {
      // Arrange
      const { result } = renderHook(() => useValidation())

      // First validation
      await act(async () => {
        await result.current.validate(mockTableData, mockParsedData)
      })

      // Second validation with different data
      const differentTableData: TableData = [
        {
          rowIndex: 0,
          cells: {
            proceso: {
              value: 'Different Proceso',
              originalValue: 'Different Proceso',
              isEdited: false,
              hasError: false,
              columnName: 'proceso',
              rowIndex: 0,
            },
          },
          hasError: false,
          isEdited: false,
        },
      ] as any

      // Act
      await act(async () => {
        await result.current.validate(differentTableData, mockParsedData)
      })

      // Assert - Should have new result
      expect(result.current.result).toBeDefined()
      expect(mockValidateTable).toHaveBeenCalledTimes(2)
    })

    it('should expose all state properties', () => {
      // Arrange
      const { result } = renderHook(() => useValidation())

      // Assert
      expect(result.current).toHaveProperty('status')
      expect(result.current).toHaveProperty('progress')
      expect(result.current).toHaveProperty('result')
      expect(result.current).toHaveProperty('error')
      expect(result.current).toHaveProperty('validate')
      expect(result.current).toHaveProperty('reset')
    })
  })
})
