/**
 * Tests for s3Upload service
 */

import { ERROR_MESSAGES } from '@/constants/errorMessages'

// Mock global fetch
global.fetch = jest.fn()

// Import service AFTER mocks
import { uploadToS3 } from '@/features/data-validation/services/s3Upload.service'

const mockFetchSuccess = () => {
  ;(global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    status: 200,
    statusText: 'OK',
  })
}

const mockFetchFailure = (status = 500, statusText = 'Internal Server Error') => {
  ;(global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status,
    statusText,
  })
}

const mockFetchError = (errorMessage = 'Network error') => {
  ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))
}

const resetFetchMock = () => {
  ;(global.fetch as jest.Mock).mockReset()
}

describe('s3Upload.service', () => {
  beforeEach(() => {
    resetFetchMock()
    jest.clearAllMocks()
  })

  describe('uploadToS3', () => {
    const mockJsonData = JSON.stringify({ test: 'data' })
    const mockFileName = 'test-file.json'
    const mockSignedUrl = 'https://s3.amazonaws.com/bucket/test-file.json?signature=xyz'

    it('should successfully upload JSON to S3 using presigned URL', async () => {
      // Arrange
      mockFetchSuccess()

      // Act
      const result = await uploadToS3(mockJsonData, mockFileName, mockSignedUrl)

      // Assert
      expect(result.success).toBe(true)
      expect(result.fileName).toBe(mockFileName)
      expect(result.fileSize).toBe(new Blob([mockJsonData]).size)
      expect(result.error).toBeUndefined()
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should call fetch with correct parameters', async () => {
      // Arrange
      mockFetchSuccess()

      // Act
      await uploadToS3(mockJsonData, mockFileName, mockSignedUrl)

      // Assert
      expect(global.fetch).toHaveBeenCalledWith(mockSignedUrl, {
        method: 'PUT',
        body: mockJsonData,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    })

    it('should return error when fetch fails with HTTP error', async () => {
      // Arrange
      mockFetchFailure(403, 'Forbidden')

      // Act
      const result = await uploadToS3(mockJsonData, mockFileName, mockSignedUrl)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('403')
      expect(result.error).toContain('Forbidden')
      expect(result.fileName).toBeUndefined()
      expect(result.fileSize).toBeUndefined()
    })

    it('should return error when network request fails', async () => {
      // Arrange
      const errorMessage = 'Network connection failed'
      mockFetchError(errorMessage)

      // Act
      const result = await uploadToS3(mockJsonData, mockFileName, mockSignedUrl)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe(errorMessage)
    })

    it('should handle unknown errors', async () => {
      // Arrange
      ;(global.fetch as jest.Mock).mockRejectedValueOnce('String error') // Non-Error throw

      // Act
      const result = await uploadToS3(mockJsonData, mockFileName, mockSignedUrl)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe(ERROR_MESSAGES.PRESIGNED_URL_UPLOAD_ERROR)
    })

    it('should calculate file size correctly', async () => {
      // Arrange
      mockFetchSuccess()
      const largeJsonData = JSON.stringify({ large: 'data'.repeat(1000) })

      // Act
      const result = await uploadToS3(largeJsonData, mockFileName, mockSignedUrl)

      // Assert
      expect(result.success).toBe(true)
      expect(result.fileSize).toBe(new Blob([largeJsonData]).size)
      expect(result.fileSize).toBeGreaterThan(0)
    })

    it('should handle different file names correctly', async () => {
      // Arrange
      mockFetchSuccess()
      const customFileName = 'custom-file-2024.json'

      // Act
      const result = await uploadToS3(mockJsonData, customFileName, mockSignedUrl)

      // Assert
      expect(result.success).toBe(true)
      expect(result.fileName).toBe(customFileName)
    })
  })
})
