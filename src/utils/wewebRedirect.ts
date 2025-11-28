/**
 * Utilidad para manejar redirecciones a WeWeb
 */

export interface WeWebRedirectParams {
  token: string
  file_name: string
  file_size: number
  error_message?: string
}

/**
 * Construye la URL de redirección a WeWeb con los parámetros necesarios
 * @param baseUrl - URL base de WeWeb
 * @param params - Parámetros a incluir en el query string
 * @returns URL completa con query params
 */
export function buildWeWebRedirectUrl(
  baseUrl: string,
  params: WeWebRedirectParams
): string {
  const url = new URL(baseUrl)

  // Agregar todos los parámetros al query string
  url.searchParams.set('token', params.token)
  url.searchParams.set('file_name', params.file_name)
  url.searchParams.set('file_size', params.file_size.toString())

  if (params.error_message) {
    url.searchParams.set('error_message', params.error_message)
  }

  return url.toString()
}

/**
 * Redirige al usuario a WeWeb con los parámetros especificados
 * @param baseUrl - URL base de WeWeb
 * @param params - Parámetros a incluir en el query string
 */
export function redirectToWeWeb(
  baseUrl: string,
  params: WeWebRedirectParams
): void {
  const redirectUrl = buildWeWebRedirectUrl(baseUrl, params)
  window.location.href = redirectUrl
}

/**
 * Obtiene el token del query string actual (que viene de WeWeb)
 * @returns El token si existe, undefined si no
 */
export function getTokenFromQuery(): string | undefined {
  const params = new URLSearchParams(window.location.search)
  return params.get('token') || undefined
}
