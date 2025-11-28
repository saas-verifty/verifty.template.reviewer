/**
 * Tests for presignedUrl service
 */

import { ERROR_MESSAGES } from '@/constants/errorMessages'

// Mock apiClient before imports
const mockApiClientGet = jest.fn()

jest.mock('@/api/client', () => ({
  apiClient: {
    get: mockApiClientGet,
  },
}))

// Import service AFTER mocks
import { getPresignedUrl } from '@/features/data-validation/services/presignedUrl.service'

const mockApiSuccess = (signedUrl: string, fileKey: string) => {
  mockApiClientGet.mockResolvedValueOnce({
    data: {
      signedUrl,
      file_key: fileKey,
    },
  })
}

const mockApiFailure = (errorMessage = 'API error') => {
  mockApiClientGet.mockRejectedValueOnce(new Error(errorMessage))
}

const mockApiInvalidResponse = (partial: Partial<{ signedUrl: string; file_key: string }> = {}) => {
  mockApiClientGet.mockResolvedValueOnce({
    data: partial,
  })
}

const resetApiMock = () => {
  mockApiClientGet.mockReset()
}

describe('presignedUrl.service', () => {
  beforeEach(() => {
    resetApiMock()
    jest.clearAllMocks()
  })

  describe('getPresignedUrl', () => {
    const mockToken = 'test-token-123'
    const mockSignedUrl = 'https://s3.amazonaws.com/bucket/file.json?signature=xyz'
    const mockFileKey = 'verifty.template.reviewer/file.json'

    it('should successfully get presigned URL and file key', async () => {
      // Arrange
      mockApiSuccess(mockSignedUrl, mockFileKey)

      // Act
      const result = await getPresignedUrl(mockToken)

      // Assert
      expect(result.success).toBe(true)
      expect(result.signedUrl).toBe(mockSignedUrl)
      expect(result.fileKey).toBe(mockFileKey)
      expect(result.error).toBeUndefined()
      expect(mockApiClientGet).toHaveBeenCalledTimes(1)
    })

    it('should call API with correct parameters', async () => {
      // Arrange
      mockApiSuccess(mockSignedUrl, mockFileKey)

      // Act
      await getPresignedUrl(mockToken)

      // Assert
      expect(mockApiClientGet).toHaveBeenCalledWith('/presigned-url', {
        params: { token: mockToken },
      })
    })

    it('should return error when signedUrl is missing from response', async () => {
      // Arrange
      mockApiInvalidResponse({ file_key: mockFileKey })

      // Act
      const result = await getPresignedUrl(mockToken)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe(ERROR_MESSAGES.PRESIGNED_URL_INVALID_RESPONSE)
      expect(result.signedUrl).toBeUndefined()
      expect(result.fileKey).toBeUndefined()
    })

    it('should return error when file_key is missing from response', async () => {
      // Arrange
      mockApiInvalidResponse({ signedUrl: mockSignedUrl })

      // Act
      const result = await getPresignedUrl(mockToken)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe(ERROR_MESSAGES.PRESIGNED_URL_INVALID_RESPONSE)
    })

    it('should return error when both fields are missing from response', async () => {
      // Arrange
      mockApiInvalidResponse({})

      // Act
      const result = await getPresignedUrl(mockToken)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe(ERROR_MESSAGES.PRESIGNED_URL_INVALID_RESPONSE)
    })

    it('should handle API errors', async () => {
      // Arrange
      const errorMessage = 'Unauthorized'
      mockApiFailure(errorMessage)

      // Act
      const result = await getPresignedUrl(mockToken)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe(errorMessage)
      expect(result.signedUrl).toBeUndefined()
      expect(result.fileKey).toBeUndefined()
    })

    it('should handle unknown errors', async () => {
      // Arrange
      mockApiClientGet.mockRejectedValueOnce('String error') // Non-Error throw

      // Act
      const result = await getPresignedUrl(mockToken)

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe(ERROR_MESSAGES.PRESIGNED_URL_FETCH_ERROR)
    })

    it('should work with different tokens', async () => {
      // Arrange
      const customToken = 'custom-token-xyz'
      mockApiSuccess(mockSignedUrl, mockFileKey)

      // Act
      await getPresignedUrl(customToken)

      // Assert
      expect(mockApiClientGet).toHaveBeenCalledWith('/presigned-url', {
        params: { token: customToken },
      })
    })
  })
})
