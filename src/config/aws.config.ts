import { S3Client } from '@aws-sdk/client-s3'

/**
 * Configuración de AWS S3
 * Las credenciales se obtienen de variables de entorno
 */

// Variables de entorno para AWS
const AWS_REGION = import.meta.env.VITE_AWS_REGION || ''
const AWS_ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID || ''
const AWS_SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || ''

// Configuración del bucket S3
export const S3_CONFIG = {
  bucket: import.meta.env.VITE_S3_BUCKET_NAME || '',
  region: import.meta.env.VITE_S3_BUCKET_REGION || AWS_REGION,
}

/**
 * Cliente de S3 configurado
 * IMPORTANTE: Solo se inicializa si las credenciales están disponibles
 */
export const s3Client =
  AWS_REGION && AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY
    ? new S3Client({
        region: AWS_REGION,
        credentials: {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        },
      })
    : null

/**
 * Verifica si AWS está configurado
 */
export function isAWSConfigured(): boolean {
  return !!(
    AWS_REGION &&
    AWS_ACCESS_KEY_ID &&
    AWS_SECRET_ACCESS_KEY &&
    S3_CONFIG.bucket &&
    s3Client
  )
}
