import { TableData } from '../types/table.types'
import {
  IPEVRJsonOutput,
  ProcesoOutput,
  PeligroOutput,
} from '../types/json-output.types'

/**
 * Obtiene el valor de una celda de forma segura
 */
function getCellValue(row: any, columnName: string): any {
  const cell = row[columnName]
  if (cell && typeof cell === 'object' && 'value' in cell) {
    return cell.value
  }
  return cell
}

/**
 * Convierte un valor a número, retorna 0 si no es válido
 */
function toNumber(value: any): number {
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

/**
 * Genera la estructura JSON jerárquica desde los datos de la tabla
 */
export function generateJSON(table: TableData): IPEVRJsonOutput {
  const procesoMap = new Map<string, ProcesoOutput>()

  // Iterar sobre cada fila de la tabla
  table.forEach((row) => {
    const cells = row.cells

    const procesoNombre = String(getCellValue(cells, 'proceso') ?? '').trim()
    const actividadNombre = String(getCellValue(cells, 'actividad') ?? '').trim()
    const subactividadNombre = String(getCellValue(cells, 'subactividad') ?? '').trim()

    if (!procesoNombre || !actividadNombre || !subactividadNombre) {
      // Saltar filas incompletas
      return
    }

    // Obtener o crear proceso
    if (!procesoMap.has(procesoNombre)) {
      procesoMap.set(procesoNombre, {
        nombre: procesoNombre,
        actividad: [],
      })
    }
    const proceso = procesoMap.get(procesoNombre)!

    // Buscar o crear actividad dentro del proceso
    let actividad = proceso.actividad.find((a) => a.nombre === actividadNombre)
    if (!actividad) {
      actividad = {
        nombre: actividadNombre,
        subactividad: [],
      }
      proceso.actividad.push(actividad)
    }

    // Buscar o crear subactividad dentro de la actividad
    let subactividad = actividad.subactividad.find((s) => s.nombre === subactividadNombre)
    if (!subactividad) {
      subactividad = {
        nombre: subactividadNombre,
        frecuencia: String(getCellValue(cells, 'frecuencia') ?? ''),
        personal_involucrado: String(getCellValue(cells, 'personal_involucrado') ?? ''),
        cargo: String(getCellValue(cells, 'cargo') ?? ''),
        area_empresa: String(getCellValue(cells, 'area_empresa') ?? ''),
        peligros: [],
      }
      actividad.subactividad.push(subactividad)
    }

    // Crear el peligro y agregarlo a la subactividad
    const peligro: PeligroOutput = {
      nombre: String(getCellValue(cells, 'peligro') ?? ''),
      descripcion_peligro: String(getCellValue(cells, 'descripcion_peligro') ?? ''),
      descripcion_especifica_peligro: String(getCellValue(cells, 'descripcion_especifica_peligro') ?? ''),
      consecuencia_efecto_posible: String(getCellValue(cells, 'consecuencia_efecto_posible') ?? ''),
      controles_existentes_fuente: String(getCellValue(cells, 'controles_existentes_fuente') ?? ''),
      controles_existentes_medio: String(getCellValue(cells, 'controles_existentes_medio') ?? ''),
      controles_existentes_individuo: String(getCellValue(cells, 'controles_existentes_individuo') ?? ''),
      nivel_deficiencia_ND: toNumber(getCellValue(cells, 'nivel_deficiencia_ND')),
      nivel_exposicion_NE: toNumber(getCellValue(cells, 'nivel_exposicion_NE')),
      nivel_consecuencia_NC: toNumber(getCellValue(cells, 'valor_consecuencia_NC')),
    }

    subactividad.peligros.push(peligro)
  })

  // Obtener todos los procesos del Map
  const procesos = Array.from(procesoMap.values())

  if (procesos.length === 0) {
    throw new Error('No se pudo generar el JSON: no hay datos válidos')
  }

  return {
    procesos,
  }
}

/**
 * Genera un nombre único para el archivo basado en timestamp
 */
export function generateFileName(prefix = 'ipevr'): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `${prefix}-${timestamp}.json`
}
