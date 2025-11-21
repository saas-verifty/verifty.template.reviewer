export interface PeligroOutput {
  nombre: string
  descripcion_peligro: string
  descripcion_especifica_peligro: string
  consecuencia_efecto_posible: string
  controles_existentes_fuente: string
  controles_existentes_medio: string
  controles_existentes_individuo: string
  nivel_deficiencia_ND: number
  nivel_exposicion_NE: number
  nivel_consecuencia_NC: number
}

export interface SubactividadOutput {
  nombre: string
  frecuencia: string
  personal_involucrado: string
  cargo: string
  area_empresa: string
  peligros: PeligroOutput[]
}

export interface ActividadOutput {
  nombre: string
  subactividad: SubactividadOutput[]
}

export interface ProcesoOutput {
  nombre: string
  actividad: ActividadOutput[]
}

export interface IPEVRJsonOutput {
  procesos: ProcesoOutput[]
}

export interface JsonMetadata {
  timestamp: string
  totalRecords: number
  fileName: string
}
