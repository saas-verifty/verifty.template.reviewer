/**
 * Tests for s3Upload service
 */

import { ERROR_MESSAGES } from '@/constants/errorMessages';

// Create mock functions BEFORE imports - Jest hoisting requirement
const mockS3Send = jest.fn();
const mockS3Client = jest.fn().mockImplementation(() => ({
  send: mockS3Send
}));
const mockPutObjectCommand = jest.fn().mockImplementation((input) => ({ input }));
const mockIsAWSConfigured = jest.fn(() => true);

// Mock AWS SDK - must be before service import
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: mockS3Client,
  PutObjectCommand: mockPutObjectCommand
}));

// Mock AWS config - must be before service import
jest.mock('@/config/aws.config', () => ({
  s3Client: { send: mockS3Send },
  S3_CONFIG: {
    bucket: 'test-bucket',
    region: 'us-east-1'
  },
  isAWSConfigured: mockIsAWSConfigured
}));

// Import service AFTER mocks
import { uploadToS3, checkAWSConfiguration } from '@/features/data-validation/services/s3Upload.service';

const mockS3UploadSuccess = () => {
  mockS3Send.mockResolvedValueOnce({
    $metadata: {
      httpStatusCode: 200,
      requestId: 'mock-request-id'
    },
    ETag: '"mock-etag"'
  });
};

const mockS3UploadFailure = (errorMessage = 'S3 Upload failed') => {
  mockS3Send.mockRejectedValueOnce(new Error(errorMessage));
};

const resetS3Mocks = () => {
  mockS3Send.mockReset();
};

describe('s3Upload.service', () => {
  beforeEach(() => {
    resetS3Mocks();
    jest.clearAllMocks();
    // Reset to default value
    mockIsAWSConfigured.mockReturnValue(true);
  });

  describe('uploadToS3', () => {
    const mockJsonData = JSON.stringify({ test: 'data' });
    const mockFileName = 'test-file.json';

    it('should successfully upload JSON to S3', async () => {
      // Arrange
      mockS3UploadSuccess();

      // Act
      const result = await uploadToS3(mockJsonData, mockFileName);

      // Assert
      expect(result.success).toBe(true);
      expect(result.fileUrl).toBe(
        `https://test-bucket.s3.us-east-1.amazonaws.com/${mockFileName}`
      );
      expect(result.error).toBeUndefined();
      expect(mockS3Send).toHaveBeenCalledTimes(1);
    });

    it('should send PutObjectCommand with correct parameters', async () => {
      // Arrange
      mockS3UploadSuccess();

      // Act
      await uploadToS3(mockJsonData, mockFileName);

      // Assert
      const command = mockS3Send.mock.calls[0][0];
      expect(command.input).toMatchObject({
        Bucket: 'test-bucket',
        Key: mockFileName,
        Body: mockJsonData,
        ContentType: 'application/json'
      });
      expect(command.input.Metadata).toHaveProperty('uploadDate');
      expect(command.input.Metadata).toHaveProperty('source', 'verifty-template-reviewer');
    });

    it('should return error when AWS is not configured', async () => {
      // Arrange
      mockIsAWSConfigured.mockReturnValueOnce(false);

      // Act
      const result = await uploadToS3(mockJsonData, mockFileName);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.AWS_NOT_CONFIGURED);
      expect(result.fileUrl).toBeUndefined();
      expect(mockS3Send).not.toHaveBeenCalled();
    });

    it('should return error when S3 client is not initialized', async () => {
      // Arrange
      jest.resetModules();
      jest.doMock('@/config/aws.config', () => ({
        s3Client: null,
        S3_CONFIG: {
          bucket: 'test-bucket',
          region: 'us-east-1'
        },
        isAWSConfigured: jest.fn(() => true)
      }));

      const { uploadToS3: uploadWithNoClient } = require('@/features/data-validation/services/s3Upload.service');

      // Act
      const result = await uploadWithNoClient(mockJsonData, mockFileName);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.S3_CLIENT_NOT_INITIALIZED);
    });

    it('should handle S3 upload errors', async () => {
      // Arrange
      const errorMessage = 'Access Denied';
      mockS3UploadFailure(errorMessage);

      // Act
      const result = await uploadToS3(mockJsonData, mockFileName);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.fileUrl).toBeUndefined();
    });

    it('should handle unknown errors', async () => {
      // Arrange
      mockS3Send.mockRejectedValueOnce('String error'); // Non-Error throw

      // Act
      const result = await uploadToS3(mockJsonData, mockFileName);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.S3_UPLOAD_UNKNOWN_ERROR);
    });

    it('should handle different file names correctly', async () => {
      // Arrange
      mockS3UploadSuccess();
      const customFileName = 'custom/path/file-2024.json';

      // Act
      const result = await uploadToS3(mockJsonData, customFileName);

      // Assert
      expect(result.success).toBe(true);
      expect(result.fileUrl).toBe(
        `https://test-bucket.s3.us-east-1.amazonaws.com/${customFileName}`
      );
    });
  });

  describe('checkAWSConfiguration', () => {
    it('should return configured true when AWS is properly configured', () => {
      // Arrange
      mockIsAWSConfigured.mockReturnValueOnce(true);

      // Act
      const result = checkAWSConfiguration();

      // Assert
      expect(result.configured).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should return configured false when AWS is not configured', () => {
      // Arrange
      mockIsAWSConfigured.mockReturnValueOnce(false);

      // Act
      const result = checkAWSConfiguration();

      // Assert
      expect(result.configured).toBe(false);
      expect(result.message).toBe(ERROR_MESSAGES.AWS_NOT_CONFIGURED_CHECK);
    });
  });
});
