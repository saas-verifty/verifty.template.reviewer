/**
 * Tests for useFileUpload hook
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { parseExcelFile } from '@/features/data-validation/services/parseExcelFile.service'
import { ERROR_MESSAGES } from '@/constants/errorMessages'
import type { ParsedExcelData } from '@/features/data-validation/types/excel.types'
import useFileUpload from '@/features/data-validation/hooks/useFileUpload'

// Mock the parseExcelFile service
jest.mock('@/features/data-validation/services/parseExcelFile.service')

// Mock the config module to avoid import.meta issues
jest.mock('@/config/fileUpload.config', () => ({
  getMaxFileSizeMB: jest.fn(() => 5),
}))

import { getMaxFileSizeMB } from '@/config/fileUpload.config'

const mockParseExcelFile = parseExcelFile as jest.MockedFunction<
  typeof parseExcelFile
>
const mockGetMaxFileSizeMB = getMaxFileSizeMB as jest.MockedFunction<
  typeof getMaxFileSizeMB
>

describe('useFileUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetMaxFileSizeMB.mockReturnValue(5)
  })

  const createMockFile = (
    name: string,
    size: number,
    type: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ): File => {
    const blob = new Blob(['x'.repeat(size)], { type })
    return new File([blob], name, { type })
  }

  const createValidFileName = (): string => {
    return 'company_project_user_date_123.xlsx'
  }

  const mockParsedData: ParsedExcelData = {
    mainSheet: {
      name: 'Plantilla de Carga',
      headers: ['proceso', 'actividad'],
      data: [
        {
          proceso: 'Proceso 1',
          actividad: 'Actividad 1',
          subactividad: '',
          frecuencia: '',
          personal_involucrado: '',
          cargo: '',
          area_empresa: '',
          peligro: '',
          descripcion_peligro: '',
          descripcion_especifica_peligro: '',
          consecuencia_efecto_posible: '',
          controles_existentes_fuente: '',
          controles_existentes_medio: '',
          controles_existentes_individuo: '',
          nivel_deficiencia_ND: '',
          nivel_exposicion_NE: '',
          valor_consecuencia_NC: '',
        },
      ],
    },
    validationSheet: {
      name: 'Listas de Validacion',
      headers: ['frecuencia'],
      data: [
        {
          frecuencia: 'Rutinaria',
          personal_involucrado: '',
          cargo: '',
          areas_empresa: '',
          nivel_deficiencia_ND: '',
          nivel_exposicion_NE: '',
          valor_consecuencia_NC: '',
        },
      ],
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

  describe('Initial state', () => {
    it('should initialize with null values and no loading', () => {
      // Act
      const { result } = renderHook(() => useFileUpload())

      // Assert
      expect(result.current.file).toBeNull()
      expect(result.current.data).toBeNull()
      expect(result.current.error).toBeNull()
      expect(result.current.loading).toBe(false)
    })
  })

  describe('File validation', () => {
    it('should accept valid xlsx file', async () => {
      // Arrange
      const { result } = renderHook(() => useFileUpload())
      const validFile = createMockFile(createValidFileName(), 1024 * 1024) // 1MB
      mockParseExcelFile.mockResolvedValueOnce(mockParsedData)

      // Act
      await act(async () => {
        await result.current.handleFile(validFile)
      })

      // Assert
      expect(result.current.error).toBeNull()
      expect(result.current.file).toBe(validFile)
      expect(result.current.data).toEqual(mockParsedData)
    })

    it('should accept valid xls file', async () => {
      // Arrange
      const { result } = renderHook(() => useFileUpload())
      const validFile = createMockFile(
        createValidFileName().replace('.xlsx', '.xls'),
        1024 * 1024,
        'application/vnd.ms-excel'
      )
      mockParseExcelFile.mockResolvedValueOnce(mockParsedData)

      // Act
      await act(async () => {
        await result.current.handleFile(validFile)
      })

      // Assert
      expect(result.current.error).toBeNull()
      expect(result.current.file).toBe(validFile)
    })

    it('should reject file with invalid type', async () => {
      // Arrange
      const { result } = renderHook(() => useFileUpload())
      const invalidFile = createMockFile(
        createValidFileName().replace('.xlsx', '.pdf'),
        1024,
        'application/pdf'
      )

      // Act
      await act(async () => {
        await result.current.handleFile(invalidFile)
      })

      // Assert
      expect(result.current.error).toBe(ERROR_MESSAGES.FILE_FORMAT_UNSUPPORTED)
      expect(result.current.file).toBeNull()
      expect(result.current.data).toBeNull()
      expect(mockParseExcelFile).not.toHaveBeenCalled()
    })

    it('should reject file exceeding size limit', async () => {
      // Arrange
      const { result } = renderHook(() => useFileUpload())
      const maxSizeMB = 5
      const oversizedFile = createMockFile(
        createValidFileName(),
        (maxSizeMB + 1) * 1024 * 1024 // 6MB
      )

      // Act
      await act(async () => {
        await result.current.handleFile(oversizedFile)
      })

      // Assert
      expect(result.current.error).toBe(
        ERROR_MESSAGES.FILE_SIZE_EXCEEDED(maxSizeMB)
      )
      expect(result.current.file).toBeNull()
      expect(result.current.data).toBeNull()
      expect(mockParseExcelFile).not.toHaveBeenCalled()
    })

    it('should reject file with invalid name format', async () => {
      // Arrange
      const { result } = renderHook(() => useFileUpload())
      const invalidFile = createMockFile('invalid-name.xlsx', 1024)

      // Act
      await act(async () => {
        await result.current.handleFile(invalidFile)
      })

      // Assert
      expect(result.current.error).toBe(ERROR_MESSAGES.FILE_NAME_INVALID)
      expect(result.current.file).toBeNull()
      expect(result.current.data).toBeNull()
      expect(mockParseExcelFile).not.toHaveBeenCalled()
    })

    it('should accept file name with at least 5 parts separated by underscore', async () => {
      // Arrange
      const { result } = renderHook(() => useFileUpload())
      const validFile = createMockFile(
        'part1_part2_part3_part4_part5.xlsx',
        1024
      )
      mockParseExcelFile.mockResolvedValueOnce(mockParsedData)

      // Act
      await act(async () => {
        await result.current.handleFile(validFile)
      })

      // Assert
      expect(result.current.error).toBeNull()
    })
  })

  describe('File parsing', () => {
    it('should set loading state during parsing', async () => {
      // Arrange
      const { result } = renderHook(() => useFileUpload())
      const validFile = createMockFile(createValidFileName(), 1024)

      let resolvePromise: (value: ParsedExcelData) => void
      const parsePromise = new Promise<ParsedExcelData>((resolve) => {
        resolvePromise = resolve
      })
      mockParseExcelFile.mockReturnValueOnce(parsePromise)

      // Act - Start parsing
      act(() => {
        result.current.handleFile(validFile)
      })

      // Assert - Should be loading
      await waitFor(() => {
        expect(result.current.loading).toBe(true)
      })

      // Complete parsing
      await act(async () => {
        resolvePromise!(mockParsedData)
        await parsePromise
      })

      // Assert - Should no longer be loading
      expect(result.current.loading).toBe(false)
      expect(result.current.data).toEqual(mockParsedData)
    })

    it('should handle parsing errors', async () => {
      // Arrange
      const { result } = renderHook(() => useFileUpload())
      const validFile = createMockFile(createValidFileName(), 1024)
      const errorMessage = 'Parse error'
      mockParseExcelFile.mockRejectedValueOnce(new Error(errorMessage))

      // Act
      await act(async () => {
        await result.current.handleFile(validFile)
      })

      // Assert
      expect(result.current.error).toBe(errorMessage)
      expect(result.current.data).toBeNull()
      expect(result.current.loading).toBe(false)
    })

    it('should handle non-Error parsing failures', async () => {
      // Arrange
      const { result } = renderHook(() => useFileUpload())
      const validFile = createMockFile(createValidFileName(), 1024)
      mockParseExcelFile.mockRejectedValueOnce('String error')

      // Act
      await act(async () => {
        await result.current.handleFile(validFile)
      })

      // Assert
      expect(result.current.error).toBe(ERROR_MESSAGES.FILE_PARSE_ERROR)
      expect(result.current.data).toBeNull()
    })

    it('should parse file successfully and set data', async () => {
      // Arrange
      const { result } = renderHook(() => useFileUpload())
      const validFile = createMockFile(createValidFileName(), 1024)
      mockParseExcelFile.mockResolvedValueOnce(mockParsedData)

      // Act
      await act(async () => {
        await result.current.handleFile(validFile)
      })

      // Assert
      expect(result.current.file).toBe(validFile)
      expect(result.current.data).toEqual(mockParsedData)
      expect(result.current.error).toBeNull()
      expect(result.current.loading).toBe(false)
      expect(mockParseExcelFile).toHaveBeenCalledWith(validFile)
    })
  })

  describe('Clear functionality', () => {
    it('should clear all state', async () => {
      // Arrange
      const { result } = renderHook(() => useFileUpload())
      const validFile = createMockFile(createValidFileName(), 1024)
      mockParseExcelFile.mockResolvedValueOnce(mockParsedData)

      // Set initial state
      await act(async () => {
        await result.current.handleFile(validFile)
      })

      expect(result.current.file).not.toBeNull()
      expect(result.current.data).not.toBeNull()

      // Act - Clear
      act(() => {
        result.current.clear()
      })

      // Assert
      expect(result.current.file).toBeNull()
      expect(result.current.data).toBeNull()
      expect(result.current.error).toBeNull()
    })

    it('should clear error state', async () => {
      // Arrange
      const { result } = renderHook(() => useFileUpload())
      const invalidFile = createMockFile('invalid.xlsx', 1024)

      // Set error state
      await act(async () => {
        await result.current.handleFile(invalidFile)
      })

      expect(result.current.error).not.toBeNull()

      // Act - Clear
      act(() => {
        result.current.clear()
      })

      // Assert
      expect(result.current.error).toBeNull()
    })
  })

  describe('Error clearing on new upload', () => {
    it('should clear previous error when uploading new file', async () => {
      // Arrange
      const { result } = renderHook(() => useFileUpload())
      const invalidFile = createMockFile('invalid.xlsx', 1024)
      const validFile = createMockFile(createValidFileName(), 1024)
      mockParseExcelFile.mockResolvedValueOnce(mockParsedData)

      // Set error state with invalid file
      await act(async () => {
        await result.current.handleFile(invalidFile)
      })

      expect(result.current.error).not.toBeNull()

      // Act - Upload valid file
      await act(async () => {
        await result.current.handleFile(validFile)
      })

      // Assert
      expect(result.current.error).toBeNull()
      expect(result.current.data).toEqual(mockParsedData)
    })
  })

  describe('File size limit configuration', () => {
    it('should use custom max file size from environment', async () => {
      // Arrange
      mockGetMaxFileSizeMB.mockReturnValue(10)
      const { result } = renderHook(() => useFileUpload())
      const largeFile = createMockFile(createValidFileName(), 8 * 1024 * 1024) // 8MB
      mockParseExcelFile.mockResolvedValueOnce(mockParsedData)

      // Act
      await act(async () => {
        await result.current.handleFile(largeFile)
      })

      // Assert - Should accept 8MB with 10MB limit
      expect(result.current.error).toBeNull()
      expect(result.current.file).toBe(largeFile)
    })

    it('should use default 50MB limit when env variable is not set', async () => {
      // Arrange
      mockGetMaxFileSizeMB.mockReturnValue(50)
      const { result } = renderHook(() => useFileUpload())
      const largeFile = createMockFile(createValidFileName(), 40 * 1024 * 1024) // 40MB
      mockParseExcelFile.mockResolvedValueOnce(mockParsedData)

      // Act
      await act(async () => {
        await result.current.handleFile(largeFile)
      })

      // Assert - Should accept 40MB with 50MB default limit
      expect(result.current.error).toBeNull()
      expect(result.current.file).toBe(largeFile)
    })
  })
})
