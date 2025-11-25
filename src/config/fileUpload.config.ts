/**
 * File upload configuration
 * Isolated for testability - separates environment variable access
 */

export const getMaxFileSizeMB = (): number => {
  return Number(import.meta.env.VITE_MAX_FILE_SIZE_MB) || 50
}
