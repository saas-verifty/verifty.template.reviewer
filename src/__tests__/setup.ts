/**
 * Test setup and global configuration
 */

import '@testing-library/jest-dom';

// Mock environment variables
process.env.VITE_FEATURE_BULK_UPLOAD_ENABLED = 'true';
process.env.VITE_AWS_UPLOAD_ENABLED = 'false';
process.env.VITE_MAX_FILE_SIZE_MB = '5';

// Suppress console warnings/errors in tests unless DEBUG=true
if (!process.env.DEBUG) {
  global.console = {
    ...console,
    error: jest.fn(),
    warn: jest.fn()
  };
}

// Mock window.URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock File and Blob
if (typeof File === 'undefined') {
  global.File = class File extends Blob {
    name: string;
    lastModified: number;

    constructor(bits: BlobPart[], name: string, options?: FilePropertyBag) {
      super(bits, options);
      this.name = name;
      this.lastModified = options?.lastModified || Date.now();
    }
  } as any;
}
