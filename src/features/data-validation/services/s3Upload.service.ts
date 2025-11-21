import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client, S3_CONFIG, isAWSConfigured } from '../../../config/aws.config'

export interface S3UploadResult {
  success: boolean
  fileUrl?: string
  error?: string
}

/**
 * Sube un archivo JSON a S3
 * @param jsonData - El contenido JSON como string
 * @param fileName - Nombre del archivo a subir
 * @returns Resultado de la operación
 */
export async function uploadToS3(
  jsonData: string,
  fileName: string
): Promise<S3UploadResult> {
  // Verificar configuración de AWS
  if (!isAWSConfigured()) {
    return {
      success: false,
      error: 'AWS no está configurado. Por favor, configura las variables de entorno.',
    }
  }

  if (!s3Client) {
    return {
      success: false,
      error: 'Cliente de S3 no inicializado',
    }
  }

  try {
    const command = new PutObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: fileName,
      Body: jsonData,
      ContentType: 'application/json',
      Metadata: {
        uploadDate: new Date().toISOString(),
        source: 'verifty-template-reviewer',
      },
    })

    await s3Client.send(command)

    // Construir URL del archivo (asumiendo bucket público o con acceso configurado)
    const fileUrl = `https://${S3_CONFIG.bucket}.s3.${S3_CONFIG.region}.amazonaws.com/${fileName}`

    return {
      success: true,
      fileUrl,
    }
  } catch (error) {
    console.error('Error al subir a S3:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al subir archivo',
    }
  }
}

/**
 * Verifica que AWS esté configurado
 */
export function checkAWSConfiguration(): { configured: boolean; message?: string } {
  if (!isAWSConfigured()) {
    return {
      configured: false,
      message: 'AWS no está configurado. Verifica las variables de entorno en .env',
    }
  }

  return {
    configured: true,
  }
}
