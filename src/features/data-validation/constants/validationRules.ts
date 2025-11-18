export const HAZARD_TYPES = [
  'Biológico',
  'Físico',
  'Químico',
  'Psicosocial',
  'Biomecánico',
  'Condiciones de Seguridad',
  'Fenómenos naturales',
] as const;

export type HazardType = (typeof HAZARD_TYPES)[number];

export const VALIDATION_LIST_FIELDS = {
  frecuencia: 'frecuencia',
  personal_involucrado: 'personal_involucrado',
  cargo: 'cargo',
  area_empresa: 'areas_empresa',
  nivel_deficiencia_ND: 'nivel_deficiencia_ND',
  nivel_exposicion_NE: 'nivel_exposicion_NE',
  valor_consecuencia_NC: 'valor_consecuencia_NC',
} as const;

export const NUMERIC_FIELDS = [
  'nivel_deficiencia_ND',
  'nivel_exposicion_NE',
  'valor_consecuencia_NC',
] as const;

export const HAZARD_CATALOG_FIELDS = {
  peligro: 'peligro',
  descripcion_peligro: 'descripcion_peligro',
  descripcion_especifica_peligro: 'descripcion_especifica_peligro',
  consecuencia_efecto_posible: 'Cconsecuencia_efecto_posible',
} as const;

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
} as const;
