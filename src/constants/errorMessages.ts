/**
 * Mensajes de error centralizados
 * Todos los mensajes de error de la aplicación
 */

export const ERROR_MESSAGES = {
  // File Upload Errors
  FILE_FORMAT_UNSUPPORTED: 'Formato no soportado. Usa .xlsx o .xls',
  FILE_SIZE_EXCEEDED: (maxSizeMB: number) =>
    `El archivo excede el tamaño máximo permitido: ${maxSizeMB}MB`,
  FILE_NAME_INVALID:
    'El nombre del archivo no cumple con el formato requerido.',
  FILE_PARSE_ERROR: 'Error al parsear el archivo',

  // Excel File Parsing Errors
  ARRAY_BUFFER_READ_FAILED: 'Fallo al leer el archivo como ArrayBuffer',
  FILE_READ_ERROR: 'Error leyendo el archivo',
  SHEET_NOT_FOUND: (sheetName: string) =>
    `La hoja requerida "${sheetName}" no fue encontrada en el archivo Excel`,
  EXCEL_PARSE_ERROR: (error: string) =>
    `Error al parsear el archivo Excel: ${error}`,
  EXCEL_PARSE_UNKNOWN_ERROR:
    'Error al parsear el archivo Excel: Error desconocido',

  // Validation Errors
  PROCESS_REQUIRED_FOR_CHILDREN:
    'La actividad, subactividad o peligro no pueden existir sin proceso.',
  ACTIVITY_REQUIRED_FOR_CHILDREN:
    'La subactividad o peligro no pueden existir sin actividad.',
  SUBACTIVITY_REQUIRED_FOR_DANGER:
    'El peligro no puede existir sin subactividad.',

  // JSON Generation
  JSON_GENERATION_NO_DATA: 'No se pudo generar el JSON: no hay datos válidos',

  // S3 Upload Errors
  AWS_NOT_CONFIGURED:
    'AWS no está configurado. Por favor, configura las variables de entorno.',
  AWS_NOT_CONFIGURED_CHECK:
    'AWS no está configurado. Verifica las variables de entorno en .env',
  S3_CLIENT_NOT_INITIALIZED: 'Cliente de S3 no inicializado',
  S3_UPLOAD_UNKNOWN_ERROR: 'Error desconocido al subir archivo',
  S3_UPLOAD_GENERIC_ERROR: 'Error al subir archivo',

  // Presigned URL Errors
  PRESIGNED_URL_FETCH_ERROR: 'Error al obtener la URL de subida',
  PRESIGNED_URL_INVALID_RESPONSE:
    'Respuesta inválida del servidor al solicitar URL de subida',
  PRESIGNED_URL_UPLOAD_ERROR: 'Error al subir el archivo usando URL firmada',
} as const

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES
