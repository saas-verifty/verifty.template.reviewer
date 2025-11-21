import { useEffect, useState } from 'react'

import useFileUpload from '../hooks/useFileUpload'
import useTableData from '../hooks/useTableData'

import { FileUploader } from '../components/FileUploader'
import { DataTable } from '../components/DataTable'
import { ActionButtons } from '../components/ActionsButtons'
import { ErrorSummary } from '../components/ErrorSummary'
import { ConfirmationModal } from '../components/ConfirmationModal'
import { Alert } from '../components/Alert'

export default function UploadPage() {
  const { file, data, handleFile, loading, error, clear } = useFileUpload()
  const { table, initializeTable, updateCell, clearTable, hasErrors, parsedData } = useTableData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (data) initializeTable(data)
  }, [data, initializeTable])

  const handleSubmit = () => {
    if (hasErrors) return
    setIsModalOpen(true)
  }

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true)
    // TODO: Conectar con API
    console.log('Enviando datos...', table)

    try {
      // Simular envío
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsModalOpen(false)
      setAlert({
        type: 'success',
        message: '¡Datos enviados! En aproximadamente 30 minutos podrás ver los datos en la plataforma.',
      })
      clear()
      clearTable()
    } catch {
      setAlert({
        type: 'error',
        message: 'Error al enviar los datos. Por favor, intenta nuevamente.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    clear()
    clearTable()
  }

  return (
    <div className="p-6">
      {alert && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}
      <h1 className="text-2xl font-semibold text-black mb-6">
        {data ? 'Datos Cargados' : 'Subir Excel'}
      </h1>
      {loading && <p className="text-body">Cargando...</p>}
      {!data && (
        <>
          <FileUploader onFileSelected={handleFile} disable={loading} />
          {error && <p className="text-fg-danger mt-2">{error}</p>}
        </>
      )}
      {data && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-body">Archivo: {file?.name}</h2>
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
        </>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setIsModalOpen(false)}
        table={table}
        loading={isSubmitting}
      />
    </div>
  )
}
