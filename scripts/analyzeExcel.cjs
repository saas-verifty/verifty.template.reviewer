const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Constants from validationRules.ts
const SHEET_NAMES = {
  MAIN: 'Plantilla de Carga',
  VALIDATION_LISTS: 'Listas de Validacion',
  HAZARD_CATALOGS: [
    'Biológico',
    'Físico',
    'Químico',
    'Psicosocial',
    'Biomecánico',
    'Condiciones de Seguridad',
    'Fenómenos naturales'
  ]
};

const REQUIRED_COLUMNS = [
  'proceso',
  'actividad',
  'subactividad',
  'frecuencia',
  'personal_involucrado',
  'cargo',
  'area_empresa',
  'peligro',
  'descripcion_peligro',
  'descripcion_especifica_peligro',
  'consecuencia_efecto_posible',
  'controles_existentes_fuente',
  'controles_existentes_medio',
  'controles_existentes_individuo',
  'nivel_deficiencia_ND',
  'nivel_exposicion_NE',
  'valor_consecuencia_NC'
];

function analyzeExcelFile(filePath) {
  const workbook = XLSX.readFile(filePath);
  const fileName = path.basename(filePath);

  const analysis = {
    fileName,
    sheets: {},
    errors: [],
    sampleData: [],
    sheetNames: workbook.SheetNames
  };

  // Check main sheet
  if (workbook.SheetNames.includes(SHEET_NAMES.MAIN)) {
    const mainSheet = workbook.Sheets[SHEET_NAMES.MAIN];
    const mainData = XLSX.utils.sheet_to_json(mainSheet, { defval: '' });

    analysis.sheets.main = {
      exists: true,
      rowCount: mainData.length,
      columns: mainData.length > 0 ? Object.keys(mainData[0]) : []
    };

    // Get first 3 rows as samples
    analysis.sampleData = mainData.slice(0, 3);

    // Check for missing columns
    const actualColumns = analysis.sheets.main.columns;
    const missingColumns = REQUIRED_COLUMNS.filter(col => !actualColumns.includes(col));

    if (missingColumns.length > 0) {
      analysis.errors.push({
        type: 'MISSING_COLUMNS',
        columns: missingColumns
      });
    }

    // Check for data quality issues
    const emptyProcess = mainData.filter(r => !r.proceso || r.proceso === '').length;
    const emptyActivity = mainData.filter(r => !r.actividad || r.actividad === '').length;
    const emptySubactivity = mainData.filter(r => !r.subactividad || r.subactividad === '').length;

    if (emptyProcess > 0) {
      analysis.errors.push({
        type: 'EMPTY_REQUIRED_FIELD',
        field: 'proceso',
        count: emptyProcess
      });
    }
    if (emptyActivity > 0) {
      analysis.errors.push({
        type: 'EMPTY_REQUIRED_FIELD',
        field: 'actividad',
        count: emptyActivity
      });
    }
    if (emptySubactivity > 0) {
      analysis.errors.push({
        type: 'EMPTY_REQUIRED_FIELD',
        field: 'subactividad',
        count: emptySubactivity
      });
    }
  } else {
    analysis.sheets.main = { exists: false };
    analysis.errors.push({
      type: 'MISSING_SHEET',
      sheet: SHEET_NAMES.MAIN
    });
  }

  // Check validation lists sheet
  if (workbook.SheetNames.includes(SHEET_NAMES.VALIDATION_LISTS)) {
    const validationSheet = workbook.Sheets[SHEET_NAMES.VALIDATION_LISTS];
    const validationData = XLSX.utils.sheet_to_json(validationSheet, { defval: '' });

    analysis.sheets.validationLists = {
      exists: true,
      rowCount: validationData.length,
      columns: validationData.length > 0 ? Object.keys(validationData[0]) : []
    };
  } else {
    analysis.sheets.validationLists = { exists: false };
    analysis.errors.push({
      type: 'MISSING_SHEET',
      sheet: SHEET_NAMES.VALIDATION_LISTS
    });
  }

  // Check hazard catalog sheets
  analysis.sheets.hazardCatalogs = {};
  SHEET_NAMES.HAZARD_CATALOGS.forEach(catalogName => {
    if (workbook.SheetNames.includes(catalogName)) {
      const catalogSheet = workbook.Sheets[catalogName];
      const catalogData = XLSX.utils.sheet_to_json(catalogSheet, { defval: '' });

      analysis.sheets.hazardCatalogs[catalogName] = {
        exists: true,
        rowCount: catalogData.length
      };
    } else {
      analysis.sheets.hazardCatalogs[catalogName] = { exists: false };
      analysis.errors.push({
        type: 'MISSING_CATALOG',
        catalog: catalogName
      });
    }
  });

  return analysis;
}

function main() {
  const excelDir = path.join(__dirname, '..', 'excel');
  const files = fs.readdirSync(excelDir).filter(f => f.endsWith('.xlsx'));

  console.log(`📊 Analizando ${files.length} archivos Excel...\n`);

  const results = {};

  files.forEach(file => {
    const filePath = path.join(excelDir, file);
    console.log(`📄 ${file}`);

    try {
      const analysis = analyzeExcelFile(filePath);
      results[file] = analysis;

      // Print summary
      console.log(`   Main Sheet: ${analysis.sheets.main?.exists ? '✅' : '❌'}`);
      console.log(`   Validation Lists: ${analysis.sheets.validationLists?.exists ? '✅' : '❌'}`);

      const catalogsOk = Object.values(analysis.sheets.hazardCatalogs || {}).filter(c => c.exists).length;
      console.log(`   Hazard Catalogs: ${catalogsOk}/${SHEET_NAMES.HAZARD_CATALOGS.length}`);
      console.log(`   Errors: ${analysis.errors.length}`);

      if (analysis.sheets.main?.exists) {
        console.log(`   Rows: ${analysis.sheets.main.rowCount}`);
      }
      console.log('');
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}\n`);
      results[file] = { error: error.message };
    }
  });

  // Write detailed results to JSON
  const outputPath = path.join(__dirname, 'excel-analysis-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`✅ Análisis completo guardado en: ${outputPath}\n`);

  // Print error pattern summary
  console.log('📋 RESUMEN DE PATRONES DE ERROR:\n');

  Object.entries(results).forEach(([fileName, analysis]) => {
    if (analysis.errors && analysis.errors.length > 0) {
      console.log(`${fileName}:`);
      analysis.errors.forEach(err => {
        if (err.type === 'MISSING_COLUMNS') {
          console.log(`  • Columnas faltantes: ${err.columns.join(', ')}`);
        } else if (err.type === 'MISSING_SHEET') {
          console.log(`  • Hoja faltante: "${err.sheet}"`);
        } else if (err.type === 'MISSING_CATALOG') {
          console.log(`  • Catálogo faltante: "${err.catalog}"`);
        } else if (err.type === 'EMPTY_REQUIRED_FIELD') {
          console.log(`  • Campo requerido vacío: "${err.field}" (${err.count} filas)`);
        }
      });
      console.log('');
    }
  });

  // Print file categorization
  console.log('\n📁 CATEGORIZACIÓN DE ARCHIVOS:\n');

  const correctFiles = [];
  const errorFiles = [];

  Object.entries(results).forEach(([fileName, analysis]) => {
    if (!analysis.error && analysis.errors.length === 0) {
      correctFiles.push(fileName);
    } else {
      errorFiles.push(fileName);
    }
  });

  console.log(`✅ Archivos correctos (${correctFiles.length}):`);
  correctFiles.forEach(f => console.log(`   - ${f}`));

  console.log(`\n❌ Archivos con errores (${errorFiles.length}):`);
  errorFiles.forEach(f => console.log(`   - ${f}`));

  console.log('\n');
}

main();
