import { useEffect, useState } from 'react'

import useFileUpload from '../hooks/useFileUpload'
import useTableData from '../hooks/useTableData'

import { FileUploader } from '../components/FileUploader'
import { DataTable } from '../components/DataTable'
import { ActionButtons } from '../components/ActionsButtons'
import { ErrorSummary } from '../components/ErrorSummary'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { Alert } from '@/components/Alert'
import { Loader } from '@/components/Loader'
import { FeatureDisabled } from '@/components/FeatureDisabled'
import { generateJSON } from '../services/jsonGenerator.service'
import { uploadToS3 } from '../services/s3Upload.service'
import { getPresignedUrl } from '../services/presignedUrl.service'
import {
  isFeatureEnabled,
  FEATURE_DISABLED_MESSAGES,
} from '../../../config/featureFlags.config'
import { UI_MESSAGES } from '@/constants/uiMessages'
import { ERROR_MESSAGES } from '@/constants/errorMessages'
import { redirectToWeWeb, getTokenFromQuery } from '@/utils/wewebRedirect'

export default function UploadPage() {
  const { file, data, handleFile, loading, error, clear } = useFileUpload()
  const {
    table,
    initializeTable,
    updateCell,
    clearTable,
    hasErrors,
    parsedData,
  } = useTableData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Obtener el token del query string (viene de WeWeb)
  const wewebToken = getTokenFromQuery()
  const wewebRedirectUrl = import.meta.env.VITE_WEWEB_REDIRECT_URL

  useEffect(() => {
    if (data) initializeTable(data)
  }, [data, initializeTable])

  const handleSubmit = () => {
    if (hasErrors) return
    setIsModalOpen(true)
  }

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true)

    // Usar el nombre del archivo original con extensión .json
    const fileName =
      file?.name.replace(/\.(xlsx|xls)$/i, '.json') || 'ipevr.json'

    try {
      // Generar JSON desde la tabla
      const jsonOutput = generateJSON(table)
      const jsonString = JSON.stringify(jsonOutput, null, 2)

      console.log('JSON generado:', jsonOutput)

      // Feature Flag: AWS Upload vs Local Download
      if (isFeatureEnabled('AWS_UPLOAD')) {
        // Verificar que tenemos el token
        if (!wewebToken) {
          throw new Error('Token de autenticación no encontrado')
        }

        // 1. Obtener la URL pre-firmada y file_key del endpoint
        const presignedResult = await getPresignedUrl(wewebToken)

        if (!presignedResult.success || !presignedResult.signedUrl) {
          throw new Error(
            presignedResult.error || 'No se pudo obtener la URL de subida'
          )
        }

        // 2. Subir a AWS S3 usando la URL pre-firmada
        const result = await uploadToS3(
          jsonString,
          fileName,
          presignedResult.signedUrl
        )

        if (result.success) {
          console.log('Archivo subido a S3 exitosamente')
          setIsModalOpen(false)

          // 3. Redirigir a WeWeb con token, filename y filesize
          if (wewebRedirectUrl && result.fileName && result.fileSize) {
            redirectToWeWeb(wewebRedirectUrl, {
              token: wewebToken,
              file_name: result.fileName,
              file_size: result.fileSize,
            })
          } else {
            // Fallback: mostrar alerta de éxito si no hay redirección
            setAlert({
              type: 'success',
              message: UI_MESSAGES.SUBMIT_SUCCESS_S3,
            })
            clear()
            clearTable()
          }
        } else {
          throw new Error(
            result.error || ERROR_MESSAGES.S3_UPLOAD_GENERIC_ERROR
          )
        }
      } else {
        // Descargar JSON localmente (para pruebas/desarrollo)
        const blob = new Blob([jsonString], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        link.click()
        URL.revokeObjectURL(url)

        // Simular delay de subida
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setIsModalOpen(false)
        setAlert({
          type: 'success',
          message: UI_MESSAGES.SUBMIT_SUCCESS_LOCAL,
        })
        clear()
        clearTable()
      }
    } catch (error) {
      console.error('Error en submit:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : UI_MESSAGES.SUBMIT_ERROR_FALLBACK

      // Redirigir a WeWeb con error si tenemos token y URL configurada
      if (wewebToken && wewebRedirectUrl) {
        redirectToWeWeb(wewebRedirectUrl, {
          token: wewebToken,
          file_name: fileName,
          file_size: 0,
          error_message: errorMessage,
        })
      } else {
        // Fallback: mostrar alerta de error si no hay redirección
        setAlert({
          type: 'error',
          message: errorMessage,
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    clear()
    clearTable()
  }

  // Feature Flag: Verificar si la funcionalidad está habilitada
  if (!isFeatureEnabled('BULK_UPLOAD')) {
    return (
      <div className="p-6">
        <FeatureDisabled message={FEATURE_DISABLED_MESSAGES.BULK_UPLOAD} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {alert && (
          <div className="mb-6">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-black mb-2">
            {data
              ? UI_MESSAGES.DATA_REVIEW_TITLE
              : UI_MESSAGES.BULK_UPLOAD_TITLE}
          </h1>
          <p className="text-body">
            {data
              ? UI_MESSAGES.DATA_REVIEW_SUBTITLE
              : UI_MESSAGES.UPLOAD_PAGE_SUBTITLE}
          </p>
        </div>
        {loading && <Loader message={UI_MESSAGES.PROCESSING_FILE} />}
        {!loading && !data && (
          <div className="flex flex-col items-center justify-center">
            <FileUploader onFileSelected={handleFile} disable={loading} />
            {error && <p className="text-fg-danger mt-2">{error}</p>}
          </div>
        )}
        {data && (
          <div className="bg-white rounded-lg border border-bg-gray p-6">
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-body-subtle mb-4">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                  <polyline points="13 2 13 9 20 9" />
                </svg>
                <span>{file?.name}</span>
              </div>
            </div>
            <ErrorSummary table={table} />
            <DataTable
              table={table}
              headers={data.mainSheet.headers}
              onChange={updateCell}
              catalogData={parsedData}
            />
            <ActionButtons
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading || isSubmitting}
              hasErrors={hasErrors}
            />
          </div>
        )}

        <ConfirmationModal
          isOpen={isModalOpen}
          onConfirm={handleConfirmSubmit}
          onCancel={() => setIsModalOpen(false)}
          table={table}
          loading={isSubmitting}
        />
      </div>
    </div>
  )
}
