import { useCallback, useState } from 'react'

import { parseExcelFile } from '../services/parseExcelFile.service'
import { ERROR_MESSAGES } from '@/constants/errorMessages'
import { getMaxFileSizeMB } from '@/config/fileUpload.config'

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
      return ERROR_MESSAGES.FILE_FORMAT_UNSUPPORTED
    }

    const maxSizeMB = getMaxFileSizeMB()
    const maxSizeBytes = maxSizeMB * 1024 * 1024

    if (file.size > maxSizeBytes) {
      return ERROR_MESSAGES.FILE_SIZE_EXCEEDED(maxSizeMB)
    }

    const name = file.name.split('_')
    if (name.length < 5) {
      return ERROR_MESSAGES.FILE_NAME_INVALID
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
        setError((error as Error)?.message ?? ERROR_MESSAGES.FILE_PARSE_ERROR)
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
