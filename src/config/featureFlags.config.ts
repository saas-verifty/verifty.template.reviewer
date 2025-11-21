/**
 * Feature Flags Configuration
 *
 * Nivel 1: Variables de entorno (desarrollo/staging)
 * Nivel 2: Migrar a servicio de feature flags (LaunchDarkly, Unleash, etc.)
 *
 * IMPORTANTE: Las feature flags permiten desplegar código a producción
 * de forma segura, habilitando/deshabilitando características sin redesplegar.
 */

/**
 * Feature Flag: Bulk Upload completo
 * Controla si la funcionalidad de carga masiva está disponible
 */
export const FEATURE_BULK_UPLOAD_ENABLED =
  import.meta.env.VITE_FEATURE_BULK_UPLOAD_ENABLED === 'true'

/**
 * Feature Flag: AWS Upload
 * Controla si se usa S3 (true) o descarga local (false)
 */
export const FEATURE_AWS_UPLOAD_ENABLED =
  import.meta.env.VITE_AWS_UPLOAD_ENABLED === 'true'

/**
 * Interfaz para migración futura a servicio de feature flags
 *
 * Ejemplo de uso futuro con LaunchDarkly:
 *
 * import * as LaunchDarkly from 'launchdarkly-js-client-sdk'
 *
 * const ldClient = LaunchDarkly.initialize('CLIENT_SIDE_ID', {
 *   key: 'user-key'
 * })
 *
 * export async function isFeatureEnabled(flagKey: string): Promise<boolean> {
 *   await ldClient.waitForInitialization()
 *   return ldClient.variation(flagKey, false)
 * }
 */

/**
 * Función helper para verificar feature flags
 * Esta función está preparada para migrar a un servicio externo
 */
export function isFeatureEnabled(featureKey: keyof typeof FEATURES): boolean {
  return FEATURES[featureKey]
}

/**
 * Registro central de todas las feature flags
 * Facilita la migración futura a un servicio de feature flags
 */
export const FEATURES = {
  BULK_UPLOAD: FEATURE_BULK_UPLOAD_ENABLED,
  AWS_UPLOAD: FEATURE_AWS_UPLOAD_ENABLED,
} as const

/**
 * Mensajes de feature deshabilitada
 */
export const FEATURE_DISABLED_MESSAGES = {
  BULK_UPLOAD:
    'La funcionalidad de carga masiva está temporalmente deshabilitada. Por favor, contacta al administrador.',
} as const
