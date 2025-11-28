import { apiClient } from '@/api/client'
import { ERROR_MESSAGES } from '@/constants/errorMessages'

export interface PresignedUrlResponse {
  signedUrl: string
  file_key: string
}

export interface GetPresignedUrlResult {
  success: boolean
  signedUrl?: string
  fileKey?: string
  error?: string
}

/**
 * Obtiene la URL pre-firmada y el file_key desde el endpoint
 * @param token - Token de autenticación de WeWeb
 * @returns Resultado con signedUrl y file_key o error
 */
export async function getPresignedUrl(
  token: string
): Promise<GetPresignedUrlResult> {
  try {
    const dataSource = import.meta.env.VITE_DATA_SOURCE || 'test'

    const response = await apiClient.get<PresignedUrlResponse>(
      '/ipevr_file_uploads',
      {
        params: {
          'x-data-source': dataSource,
          token,
        },
      }
    )

    if (!response.data.signedUrl || !response.data.file_key) {
      return {
        success: false,
        error: ERROR_MESSAGES.PRESIGNED_URL_INVALID_RESPONSE,
      }
    }

    return {
      success: true,
      signedUrl: response.data.signedUrl,
      fileKey: response.data.file_key,
    }
  } catch (error) {
    console.error('Error obteniendo presigned URL:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.PRESIGNED_URL_FETCH_ERROR,
    }
  }
}
