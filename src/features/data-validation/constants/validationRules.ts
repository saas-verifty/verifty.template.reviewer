export const HAZARD_TYPES = [
  'Biológico',
  'Físico',
  'Químico',
  'Psicosocial',
  'Biomecánico',
  'Condiciones de Seguridad',
  'Fenómenos naturales',
] as const

export type HazardType = (typeof HAZARD_TYPES)[number]

export const VALIDATION_LIST_FIELDS = {
  frecuencia: 'frecuencia',
  personal_involucrado: 'personal_involucrado',
  cargo: 'cargo',
  area_empresa: 'areas_empresa',
  nivel_deficiencia_ND: 'nivel_deficiencia_ND',
  nivel_exposicion_NE: 'nivel_exposicion_NE',
  valor_consecuencia_NC: 'valor_consecuencia_NC',
} as const

export const NUMERIC_FIELDS = [
  'nivel_deficiencia_ND',
  'nivel_exposicion_NE',
  'valor_consecuencia_NC',
] as const

export const HAZARD_CATALOG_FIELDS = {
  peligro: 'peligro',
  descripcion_peligro: 'descripcion_peligro',
  descripcion_especifica_peligro: 'descripcion_especifica_peligro',
  consecuencia_efecto_posible: 'consecuencia_efecto_posible',
} as const

export const SHEET_NAMES = {
  MAIN: 'Plantilla de Carga',
  VALIDATION: 'Listas de Validacion',
  HAZARDS: {
    BIOLOGICO: 'Biológico',
    FISICO: 'Físico',
    QUIMICO: 'Químico',
    PSICOSOCIAL: 'Psicosocial',
    BIOMECANICO: 'Biomecánico',
    CONDICIONES_SEGURIDAD: 'Condiciones de Seguridad',
    FENOMENOS_NATURALES: 'Fenómenos naturales',
  },
} as const

export const REQUIRED_FIELDS = [
  'proceso',
  'actividad',
  'subactividad',
  'peligro',
  'personal_involucrado',
  'cargo',
  'frecuencia',
] as const

export const FIELD_TYPES: Record<string, 'string' | 'number' | 'boolean'> = {
  proceso: 'string',
  actividad: 'string',
  subactividad: 'string',
  peligro: 'string',
  descripcion_peligro: 'string',
  descripcion_especifica_peligro: 'string',
  consecuencia_efecto_posible: 'string',

  personal_involucrado: 'string',
  cargo: 'string',
  area_empresa: 'string',
  frecuencia: 'string',

  controles_existentes_fuente: 'string',
  controles_existentes_medio: 'string',
  controles_existentes_individuo: 'string',

  nivel_deficiencia_ND: 'string',
  nivel_exposicion_NE: 'string',
  valor_consecuencia_NC: 'string',
}

// Sin enums hardcodeados - todo se valida contra las listas de validación del Excel
export const ENUM_FIELDS: Record<string, string[]> = {}

export const CATALOG_FIELDS: Record<
  string,
  { type: 'validationList'; key: string }
> = {
  frecuencia: { type: 'validationList', key: 'frecuencia' },
  personal_involucrado: { type: 'validationList', key: 'personal_involucrado' },
  cargo: { type: 'validationList', key: 'cargo' },
  area_empresa: { type: 'validationList', key: 'areas_empresa' },
  nivel_deficiencia_ND: { type: 'validationList', key: 'nivel_deficiencia_ND' },
  nivel_exposicion_NE: { type: 'validationList', key: 'nivel_exposicion_NE' },
  valor_consecuencia_NC: { type: 'validationList', key: 'valor_consecuencia_NC' },
}

// Campos de peligro que se validan dinámicamente según el tipo de peligro
export const HAZARD_DYNAMIC_FIELDS = [
  'descripcion_peligro',
  'descripcion_especifica_peligro',
] as const

// Mapeo de tipo de peligro (con acentos) a key del catálogo (sin acentos)
export const HAZARD_TYPE_TO_CATALOG_KEY: Record<string, string> = {
  'Biológico': 'biologico',
  'Físico': 'fisico',
  'Químico': 'quimico',
  'Psicosocial': 'psicosocial',
  'Biomecánico': 'biomecanico',
  'Condiciones de Seguridad': 'condiciones_seguridad',
  'Fenómenos naturales': 'fenomenos_naturales',
}

export const HIERARCHY_FIELDS = {
  proceso: 'proceso',
  actividad: 'actividad',
  subactividad: 'subactividad',
  peligro: 'peligro',
} as const
