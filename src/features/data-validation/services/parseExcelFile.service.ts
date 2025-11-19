import * as XLSX from 'xlsx'

import { SHEET_NAMES } from '../constants/validationRules'
import type {
  ParsedExcelData,
  MainSheetRow,
  ValidationListRow,
  HazardCatalogRow,
} from '../types/excel.types'

const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result
      if (result instanceof ArrayBuffer) {
        resolve(result)
      } else {
        reject(new Error('Fallo al leer el archivo como ArrayBuffer'))
      }
    }
    reader.onerror = () => {
      reject(new Error('Error leyendo el archivo'))
    }
    reader.readAsArrayBuffer(file)
  })
}

export const parseExcelFile = async (file: File): Promise<ParsedExcelData> => {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file)

    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    const sheetNames = workbook.SheetNames

    if (!sheetNames.includes(SHEET_NAMES.MAIN)) {
      throw new Error(
        `La hoja requerida "${SHEET_NAMES.MAIN}" no fue encontrada en el archivo Excel`
      )
    }

    if (!sheetNames.includes(SHEET_NAMES.VALIDATION)) {
      throw new Error(
        `La hoja requerida: "${SHEET_NAMES.VALIDATION}" no fue encontrada en el archivo Excel`
      )
    }

    const hazardEntries = Object.entries(SHEET_NAMES.HAZARDS)
    for (const [, sheetName] of hazardEntries) {
      if (!sheetNames.includes(sheetName)) {
        throw new Error(
          `La hoja de peligros requerida "${sheetName}" no fue encontrada en el archivo Excel`
        )
      }
    }

    const mainSheet = workbook.Sheets[SHEET_NAMES.MAIN]
    const mainSheetData = XLSX.utils.sheet_to_json<MainSheetRow>(mainSheet, {
      defval: '',
    })
    const mainSheetHeaders =
      mainSheetData.length > 0 ? Object.keys(mainSheetData[0]) : []

    const validationSheet = workbook.Sheets[SHEET_NAMES.VALIDATION]
    const validationData = XLSX.utils.sheet_to_json<ValidationListRow>(
      validationSheet,
      { defval: '' }
    )
    const validationHeaders =
      validationData.length > 0 ? Object.keys(validationData[0]) : []

    const hazardCatalog: ParsedExcelData['hazardCatalog'] = {
      biologico: [],
      fisico: [],
      quimico: [],
      psicosocial: [],
      biomecanico: [],
      condiciones_seguridad: [],
      fenomenos_naturales: [],
    }
    for (const [key, sheetName] of hazardEntries) {
      const sheet = workbook.Sheets[sheetName]
      const data = XLSX.utils.sheet_to_json<HazardCatalogRow>(sheet, {
        defval: '',
      })
      const propertyName = key.toLowerCase() as keyof typeof hazardCatalog
      hazardCatalog[propertyName] = data
    }

    return {
      mainSheet: {
        name: SHEET_NAMES.MAIN,
        headers: mainSheetHeaders,
        data: mainSheetData,
      },
      validationSheet: {
        name: SHEET_NAMES.VALIDATION,
        headers: validationHeaders,
        data: validationData,
      },
      hazardCatalog,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al parsear el archivo Excel: ${error.message}`)
    }
    throw new Error('Error al parsear el archivo Excel: Error desconocido')
  }
}
