export interface MainSheetRow {
  proceso: string
  actividad: string
  subactividad: string
  frecuencia: string
  personal_involucrado: string
  cargo: string
  area_empresa: string
  peligro: string
  descripcion_peligro: string
  descripcion_especifica_peligro: string
  consecuencia_efecto_posible: string
  controles_existentes_fuente: string
  controles_existentes_medio: string
  controles_existentes_individuo: string
  nivel_deficiencia_ND: string
  nivel_exposicion_NE: string
  valor_consecuencia_NC: string
}

export interface ValidationListRow {
  frecuencia: string
  personal_involucrado: string
  cargo: string
  areas_empresa: string
  nivel_deficiencia_ND: string
  nivel_exposicion_NE: string
  valor_consecuencia_NC: string
}

export interface HazardCatalogRow {
  peligro: string
  descripcion_peligro: string
  descripcion_especifica_peligro: string
  consecuencia_efecto_posible: string
}

export interface ParsedExcelData {
  mainSheet: { name: string; headers: string[]; data: MainSheetRow[] }
  validationSheet: {
    name: string
    headers: string[]
    data: ValidationListRow[]
  }
  hazardCatalog: {
    biologico: HazardCatalogRow[]
    fisico: HazardCatalogRow[]
    quimico: HazardCatalogRow[]
    psicosocial: HazardCatalogRow[]
    biomecanico: HazardCatalogRow[]
    condiciones_seguridad: HazardCatalogRow[]
    fenomenos_naturales: HazardCatalogRow[]
  }
}
