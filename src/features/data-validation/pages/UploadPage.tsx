import { useEffect, useState } from 'react'

import useFileUpload from '../hooks/useFileUpload'
import useTableData from '../hooks/useTableData'

import { FileUploader } from '../components/FileUploader'
import { DataTable } from '../components/DataTable'
import { ActionButtons } from '../components/ActionsButtons'
import { ErrorSummary } from '../components/ErrorSummary'
import { ConfirmationModal } from '../components/ConfirmationModal'
import { Alert } from '../components/Alert'
import { Loader } from '../components/Loader'
import { FeatureDisabled } from '../components/FeatureDisabled'
import { generateJSON } from '../services/jsonGenerator.service'
import { uploadToS3 } from '../services/s3Upload.service'
import {
  isFeatureEnabled,
  FEATURE_DISABLED_MESSAGES,
} from '../../../config/featureFlags.config'

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

  useEffect(() => {
    if (data) initializeTable(data)
  }, [data, initializeTable])

  const handleSubmit = () => {
    if (hasErrors) return
    setIsModalOpen(true)
  }

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Generar JSON desde la tabla
      const jsonOutput = generateJSON(table)
      const jsonString = JSON.stringify(jsonOutput, null, 2)

      console.log('JSON generado:', jsonOutput)

      // Usar el nombre del archivo original con extensión .json
      const fileName =
        file?.name.replace(/\.(xlsx|xls)$/i, '.json') || 'ipevr.json'

      // Feature Flag: AWS Upload vs Local Download
      if (isFeatureEnabled('AWS_UPLOAD')) {
        // Subir a AWS S3
        const result = await uploadToS3(jsonString, fileName)

        if (result.success) {
          console.log('Archivo subido a S3:', result.fileUrl)
          setIsModalOpen(false)
          setAlert({
            type: 'success',
            message:
              '¡Datos enviados! En aproximadamente 30 minutos podrás ver los datos en la plataforma.',
          })
          clear()
          clearTable()
        } else {
          throw new Error(result.error || 'Error al subir archivo')
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
          message: '¡JSON descargado correctamente! (Modo desarrollo)',
        })
        clear()
        clearTable()
      }
    } catch (error) {
      console.error('Error en submit:', error)
      setAlert({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Error al enviar los datos. Por favor, intenta nuevamente.',
      })
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
            {data ? 'Revisión de datos' : 'Carga masiva IPEVR'}
          </h1>
          <p className="text-body">
            {data
              ? 'Revisa y edita los datos antes de enviar'
              : 'Un espacio seguro para subir y validar tus archivos Excel de IPEVR'}
          </p>
        </div>
        {loading && <Loader message="Procesando archivo..." />}
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
