/**
 * Mock for AWS S3 SDK
 */

export const mockS3Send = jest.fn();

export class mockS3Client {
  send = mockS3Send;
}

export class mockPutObjectCommand {
  input: any;

  constructor(input: any) {
    this.input = input;
  }
}

/**
 * Mock successful S3 upload
 */
export const mockS3UploadSuccess = () => {
  mockS3Send.mockResolvedValueOnce({
    $metadata: {
      httpStatusCode: 200,
      requestId: 'mock-request-id'
    },
    ETag: '"mock-etag"'
  });
};

/**
 * Mock failed S3 upload
 */
export const mockS3UploadFailure = (errorMessage = 'S3 Upload failed') => {
  mockS3Send.mockRejectedValueOnce(new Error(errorMessage));
};

/**
 * Reset all S3 mocks
 */
export const resetS3Mocks = () => {
  mockS3Send.mockReset();
};
