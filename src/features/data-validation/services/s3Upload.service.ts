import { ERROR_MESSAGES } from '@/constants/errorMessages'

export interface S3UploadResult {
  success: boolean
  fileUrl?: string
  fileName?: string
  fileSize?: number
  error?: string
}

/**
 * Sube un archivo JSON a S3 usando una URL pre-firmada
 * @param jsonData - El contenido JSON como string
 * @param fileName - Nombre del archivo a subir
 * @param signedUrl - URL pre-firmada obtenida del endpoint
 * @returns Resultado de la operación
 */
export async function uploadToS3(
  jsonData: string,
  fileName: string,
  signedUrl: string
): Promise<S3UploadResult> {
  try {
    // Calcular tamaño del archivo en bytes
    const fileSize = new Blob([jsonData]).size

    // Subir usando la URL pre-firmada con PUT
    const response = await fetch(signedUrl, {
      method: 'PUT',
      body: jsonData,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(
        `Error HTTP: ${response.status} - ${response.statusText}`
      )
    }

    return {
      success: true,
      fileName: fileName,
      fileSize,
    }
  } catch (error) {
    console.error('Error al subir a S3:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.PRESIGNED_URL_UPLOAD_ERROR,
    }
  }
}
