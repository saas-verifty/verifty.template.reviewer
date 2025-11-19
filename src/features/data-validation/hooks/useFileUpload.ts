import { useCallback, useState } from 'react'

import { parseExcelFile } from '../services/parseExcelFile.service'

import type { ParsedExcelData } from '../types/excel.types'

export default function useFileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [data, setData] = useState<ParsedExcelData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const validateFile = useCallback((file: File) => {
    const okTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ]
    if (!okTypes.includes(file.type) && !/\.(xlsx|xls)$/i.test(file.name)) {
      return 'Formato no soportado. Usa .xlsx o .xls'
    }

    const maxSizeMB = Number(import.meta.env.VITE_MAX_FILE_SIZE_MB) || 50
    const maxSizeBytes = maxSizeMB * 1024 * 1024

    if (file.size > maxSizeBytes) {
      return `El archivo excede el tamaño máximo permitido: ${maxSizeMB}MB`
    }

    const name = file.name.split('_')
    if (name.length < 5) {
      return 'El nombre del archivo no cumple con el formato requerido.'
    }

    return null
  }, [])

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)

      const validate = validateFile(file)
      if (validate) {
        setError(validate)
        setData(null)
        setFile(null)
        return
      }

      setLoading(true)
      setFile(file)
      try {
        const parsedData = await parseExcelFile(file)
        setData(parsedData)
      } catch (error) {
        setError((error as Error)?.message ?? 'Error al parsear el archivo')
        setData(null)
      } finally {
        setLoading(false)
      }
    },
    [validateFile]
  )

  const clear = useCallback(() => {
    setFile(null)
    setData(null)
    setError(null)
  }, [])

  return { file, data, error, loading, handleFile, clear }
}
