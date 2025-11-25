/**
 * Test fixtures based on real Excel file analysis
 * Generated from: scripts/excel-analysis-results.json
 */

import type { MainSheetRow, ParsedExcelData, HazardCatalogRow } from '@/features/data-validation/types/excel.types';

/**
 * Valid Excel row with all required fields
 */
export const validExcelRow: MainSheetRow = {
  proceso: 'Gestión Administrativa',
  actividad: 'Manejo de documentos',
  subactividad: 'Archivo de documentos físicos',
  frecuencia: 'Rutinaria',
  personal_involucrado: 'Directo',
  cargo: 'Auxiliar Administrativo',
  area_empresa: 'Administración',
  peligro: 'Biomecánico',
  descripcion_peligro: 'Postura',
  descripcion_especifica_peligro: 'Prolongada mantenida',
  consecuencia_efecto_posible: 'Dolor lumbar, fatiga muscular',
  controles_existentes_fuente: 'Silla ergonómica ajustable',
  controles_existentes_medio: 'Pausas activas programadas',
  controles_existentes_individuo: 'Capacitación en higiene postural',
  nivel_deficiencia_ND: '6',
  nivel_exposicion_NE: '3',
  valor_consecuencia_NC: '25'
};

/**
 * Multiple valid rows with different hazard types
 */
export const validExcelRows: MainSheetRow[] = [
  {
    proceso: 'Gestión Administrativa',
    actividad: 'Manejo de documentos',
    subactividad: 'Archivo de documentos físicos',
    frecuencia: 'Rutinaria',
    personal_involucrado: 'Directo',
    cargo: 'Asesor Comercial',
    area_empresa: 'Área de procesamiento',
    peligro: 'Biológico',
    descripcion_peligro: 'Vírus',
    descripcion_especifica_peligro: '',
    consecuencia_efecto_posible: 'Infecciones. Envenenamiento o efectos tóxicos',
    controles_existentes_fuente: 'Silla ergonómica ajustable',
    controles_existentes_medio: 'Pausas activas programadas',
    controles_existentes_individuo: 'Capacitación en higiene postural',
    nivel_deficiencia_ND: '6',
    nivel_exposicion_NE: '3',
    valor_consecuencia_NC: '25'
  },
  {
    proceso: 'Proceso 2',
    actividad: 'Actividad 2',
    subactividad: 'Subactividad 2',
    frecuencia: 'No Rutinaria',
    personal_involucrado: 'Directo y Contratistas',
    cargo: 'CEO',
    area_empresa: 'Área de alistamiento',
    peligro: 'Físico',
    descripcion_peligro: 'Ruido',
    descripcion_especifica_peligro: 'Impacto',
    consecuencia_efecto_posible: 'Disconfor, Dolor de cabeza, Hipoacucia',
    controles_existentes_fuente: 'Control 2',
    controles_existentes_medio: 'Control 2',
    controles_existentes_individuo: 'Control 2',
    nivel_deficiencia_ND: '10',
    nivel_exposicion_NE: '4',
    valor_consecuencia_NC: '100'
  },
  {
    proceso: 'Proceso 3',
    actividad: 'Actividad 3',
    subactividad: 'Subactividad 3',
    frecuencia: 'No Rutinaria',
    personal_involucrado: 'Directo, Contratistas y en Misión',
    cargo: 'CMO',
    area_empresa: 'Obra de prueba contratante',
    peligro: 'Químico',
    descripcion_peligro: 'Polvos orgánicos',
    descripcion_especifica_peligro: 'Naturales (polen, madera, algodòn, plumas, granos)',
    consecuencia_efecto_posible: 'Irritación respiratoria, traqueítis, bronquitis, neumonitis, enfisema y\nedema pulmonar',
    controles_existentes_fuente: 'Control 3',
    controles_existentes_medio: 'Control 3',
    controles_existentes_individuo: 'Control 3',
    nivel_deficiencia_ND: '6',
    nivel_exposicion_NE: '3',
    valor_consecuencia_NC: '60'
  }
];

/**
 * Rows with duplicate hierarchy (Proceso 1 -> Actividad 1 -> Subactividad 1)
 * Used for testing hierarchy grouping in JSON generation
 */
export const duplicateHierarchyRows: MainSheetRow[] = [
  {
    proceso: 'Proceso 1',
    actividad: 'Actividad 1',
    subactividad: 'Subactividad 1',
    frecuencia: 'No Rutinaria',
    personal_involucrado: 'Directo y Contratistas',
    cargo: 'Auxiliar Administrativo',
    area_empresa: 'Área de alistamiento',
    peligro: 'Biológico',
    descripcion_peligro: 'Ricketsias',
    descripcion_especifica_peligro: 'Rayos alfa',
    consecuencia_efecto_posible: 'Lesiones vasculíticas cutáneas, afectación hepática, renal o gastrointestinal',
    controles_existentes_fuente: 'Control 1',
    controles_existentes_medio: 'Control 1',
    controles_existentes_individuo: 'Control 1',
    nivel_deficiencia_ND: '6',
    nivel_exposicion_NE: '3',
    valor_consecuencia_NC: '60'
  },
  {
    proceso: 'Proceso 1',
    actividad: 'Actividad 1',
    subactividad: 'Subactividad 1',
    frecuencia: 'Rutinaria',
    personal_involucrado: 'Directo',
    cargo: 'CEO',
    area_empresa: 'Área de alistamiento',
    peligro: 'Físico',
    descripcion_peligro: 'Ruido',
    descripcion_especifica_peligro: 'Impacto',
    consecuencia_efecto_posible: 'Disconfor, Dolor de cabeza, Hipoacucia',
    controles_existentes_fuente: 'Control 2',
    controles_existentes_medio: 'Control 2',
    controles_existentes_individuo: 'Control 2',
    nivel_deficiencia_ND: '10',
    nivel_exposicion_NE: '4',
    valor_consecuencia_NC: '100'
  },
  {
    proceso: 'Proceso 1',
    actividad: 'Actividad 1',
    subactividad: 'Subactividad 1',
    frecuencia: 'No Rutinaria',
    personal_involucrado: 'Contratistas',
    cargo: 'CMO',
    area_empresa: 'Obra de prueba contratante',
    peligro: 'Químico',
    descripcion_peligro: 'Polvos inorganicos',
    descripcion_especifica_peligro: 'Silìceos (cemento, asbesto, marmol, cuarzo)',
    consecuencia_efecto_posible: 'Neumoconiosis: Siderosis, aluminosis, beriliosis, etc. Alergia: asma profesional y alveolitis alérgica extrínseca',
    controles_existentes_fuente: 'Control 3',
    controles_existentes_medio: 'Control 3',
    controles_existentes_individuo: 'Control 3',
    nivel_deficiencia_ND: '6',
    nivel_exposicion_NE: '3',
    valor_consecuencia_NC: '60'
  }
];

/**
 * Row with empty required fields
 */
export const rowWithEmptyFields: MainSheetRow = {
  proceso: '',
  actividad: '',
  subactividad: 'Subactividad sin proceso',
  frecuencia: 'Rutinaria',
  personal_involucrado: 'Directo',
  cargo: 'Auxiliar Administrativo',
  area_empresa: 'Administración',
  peligro: 'Biomecánico',
  descripcion_peligro: 'Postura',
  descripcion_especifica_peligro: 'Prolongada mantenida',
  consecuencia_efecto_posible: 'Dolor lumbar',
  controles_existentes_fuente: '',
  controles_existentes_medio: '',
  controles_existentes_individuo: '',
  nivel_deficiencia_ND: '6',
  nivel_exposicion_NE: '3',
  valor_consecuencia_NC: '25'
};

/**
 * Validation lists extracted from real Excel
 */
export const validationLists = {
  frecuencia: ['Rutinaria', 'No Rutinaria'],
  personal_involucrado: [
    'Directo',
    'Directo y Contratistas',
    'Directo, Contratistas y en Misión',
    'Contratistas',
    'Contratistas y en Misión',
    'En Misión'
  ],
  cargo: [
    'Auxiliar Administrativo',
    'Asesor Comercial',
    'CEO',
    'CMO',
    'CTO',
    'Gerente',
    'Supervisor',
    'Operario'
  ],
  areas_empresa: [
    'Administración',
    'Área de procesamiento',
    'Área de alistamiento',
    'Obra de prueba contratante',
    'Producción',
    'Logística',
    'Ventas'
  ],
  nivel_deficiencia_ND: ['2', '6', '10'],
  nivel_exposicion_NE: ['1', '2', '3', '4'],
  valor_consecuencia_NC: ['10', '25', '60', '100']
};

/**
 * Hazard catalog samples from real Excel
 */
export const hazardCatalogs: Record<string, HazardCatalogRow[]> = {
  Biológico: [
    {
      peligro: 'Biológico',
      descripcion_peligro: 'Vírus',
      descripcion_especifica_peligro: '',
      consecuencia_efecto_posible: 'Infecciones. Envenenamiento o efectos tóxicos'
    },
    {
      peligro: 'Biológico',
      descripcion_peligro: 'Ricketsias',
      descripcion_especifica_peligro: 'Rayos alfa',
      consecuencia_efecto_posible: 'Lesiones vasculíticas cutáneas, afectación hepática, renal o gastrointestinal'
    }
  ],
  Físico: [
    {
      peligro: 'Físico',
      descripcion_peligro: 'Ruido',
      descripcion_especifica_peligro: 'Impacto',
      consecuencia_efecto_posible: 'Disconfor, Dolor de cabeza, Hipoacucia'
    },
    {
      peligro: 'Físico',
      descripcion_peligro: 'Radiación ionizante',
      descripcion_especifica_peligro: 'Rayos x',
      consecuencia_efecto_posible: 'Cáncer, mutaciones genéticas'
    }
  ],
  Químico: [
    {
      peligro: 'Químico',
      descripcion_peligro: 'Polvos orgánicos',
      descripcion_especifica_peligro: 'Naturales (polen, madera, algodòn, plumas, granos)',
      consecuencia_efecto_posible: 'Irritación respiratoria, traqueítis, bronquitis, neumonitis, enfisema y\nedema pulmonar'
    },
    {
      peligro: 'Químico',
      descripcion_peligro: 'Polvos inorganicos',
      descripcion_especifica_peligro: 'Silìceos (cemento, asbesto, marmol, cuarzo)',
      consecuencia_efecto_posible: 'Neumoconiosis: Siderosis, aluminosis, beriliosis, etc. Alergia: asma profesional y alveolitis alérgica extrínseca'
    }
  ],
  Biomecánico: [
    {
      peligro: 'Biomecánico',
      descripcion_peligro: 'Postura',
      descripcion_especifica_peligro: 'Prolongada mantenida',
      consecuencia_efecto_posible: 'Dolor lumbar, fatiga muscular'
    }
  ],
  Psicosocial: [],
  'Condiciones de Seguridad': [],
  'Fenómenos naturales': []
};

/**
 * Complete parsed Excel data structure
 */
export const mockParsedExcelData: ParsedExcelData = {
  mainSheet: {
    name: 'Plantilla de Carga',
    headers: ['proceso', 'actividad', 'subactividad', 'frecuencia', 'personal_involucrado', 'cargo', 'area_empresa', 'peligro', 'descripcion_peligro', 'descripcion_especifica_peligro', 'consecuencia_efecto_posible', 'controles_existentes_fuente', 'controles_existentes_medio', 'controles_existentes_individuo', 'nivel_deficiencia_ND', 'nivel_exposicion_NE', 'valor_consecuencia_NC'],
    data: validExcelRows
  },
  validationSheet: {
    name: 'Listas de Validacion',
    headers: ['frecuencia', 'personal_involucrado', 'cargo', 'areas_empresa', 'nivel_deficiencia_ND', 'nivel_exposicion_NE', 'valor_consecuencia_NC'],
    data: []
  },
  hazardCatalog: {
    biologico: hazardCatalogs.Biológico,
    fisico: hazardCatalogs.Físico,
    quimico: hazardCatalogs.Químico,
    psicosocial: hazardCatalogs.Psicosocial || [],
    biomecanico: hazardCatalogs.Biomecánico,
    condiciones_seguridad: hazardCatalogs['Condiciones de Seguridad'] || [],
    fenomenos_naturales: hazardCatalogs['Fenómenos naturales'] || []
  }
};

/**
 * Error scenarios based on real Excel files
 */
export const errorScenarios = {
  missingMainSheet: {
    error: 'MISSING_SHEET',
    sheet: 'Plantilla de Carga',
    description: 'Excel sin hoja principal'
  },
  missingValidationSheet: {
    error: 'MISSING_SHEET',
    sheet: 'Listas de Validacion',
    description: 'Excel sin lista de validación'
  },
  missingCatalog: {
    error: 'MISSING_CATALOG',
    catalog: 'Biológico',
    description: 'Excel sin catálogo de peligros Biológico'
  },
  emptyRequiredField: {
    error: 'EMPTY_REQUIRED_FIELD',
    field: 'proceso',
    count: 1,
    description: 'Campo requerido vacío'
  }
};
