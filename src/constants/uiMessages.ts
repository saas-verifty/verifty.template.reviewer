/**
 * Mensajes de UI centralizados
 * Textos que aparecen en componentes de interfaz
 */

export const UI_MESSAGES = {
  // File Uploader
  FILE_UPLOADER: {
    ALLOWED_FORMATS: 'Solo archivos Excel (.xlsx, .xls)',
    DROP_OR_CLICK: 'Clic para cargar archivo o arrastra y suelta',
    MAX_FILE_SIZE: 'Max. File Size: 10MB',
    SEARCH_FILE: 'Buscar archivo',
  },

  // Loader
  LOADING_DEFAULT: 'Cargando...',
  PROCESSING_FILE: 'Procesando archivo...',
  PROCESSING: 'Procesando...',

  // Confirmation Modal
  CONFIRM_SUBMISSION: '¿Confirmar envío?',
  CONFIRM_BUTTON: 'Confirmar',
  CANCEL_BUTTON: 'No, cancelar',
  RECORD: (count: number) => (count === 1 ? 'registro' : 'registros'),
  EDITED: (count: number) => (count === 1 ? 'editado' : 'editados'),

  // Error Summary
  ALL_DATA_VALID: 'Todos los datos son válidos',
  ERROR: (count: number) => (count === 1 ? 'error' : 'errores'),
  ROW: (count: number) => (count === 1 ? 'fila' : 'filas'),

  // Select Cell
  SEARCH_PLACEHOLDER: 'Buscar...',
  NO_RESULTS: 'Sin resultados',
  EMPTY_VALUE: '(Vacío)',

  // Upload Page
  BULK_UPLOAD_TITLE: 'Carga masiva IPEVR',
  DATA_REVIEW_TITLE: 'Revisión de datos',
  DATA_REVIEW_SUBTITLE: 'Revisa y edita los datos antes de enviar',
  UPLOAD_PAGE_SUBTITLE: 'Un espacio seguro para subir y validar tus archivos Excel de IPEVR',

  // Feature Disabled
  FEATURE_DISABLED_MESSAGE:
    'La funcionalidad de carga masiva está temporalmente deshabilitada. Por favor, contacta al administrador.',

  // Submit/Upload Messages
  SUBMIT_SUCCESS_S3: '¡Datos enviados! En aproximadamente 30 minutos podrás ver los datos en la plataforma.',
  SUBMIT_SUCCESS_LOCAL: '¡JSON descargado correctamente! (Modo desarrollo)',
  SUBMIT_ERROR_FALLBACK: 'Error al enviar los datos. Por favor, intenta nuevamente.',
} as const

export type UIMessageKey = keyof typeof UI_MESSAGES
