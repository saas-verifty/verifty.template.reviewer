import { useEffect } from 'react'

import useFileUpload from '../hooks/useFileUpload'
import useTableData from '../hooks/useTableData'

import { FileUploader } from '../components/FileUploader'
import { DataTable } from '../components/DataTable'
import { ActionButtons } from '../components/ActionsButtons'
import { ErrorSummary } from '../components/ErrorSummary'

export default function UploadPage() {
  const { file, data, handleFile, loading, error, clear } = useFileUpload()
  const { table, initializeTable, updateCell, clearTable, hasErrors, parsedData } = useTableData()

  useEffect(() => {
    if (data) initializeTable(data)
  }, [data, initializeTable])

  const handleSubmit = () => {
    if (hasErrors) return
    console.log('Enviando datos...', table)
    // TODO: Conectar con API
  }

  const handleCancel = () => {
    clear()
    clearTable()
  }

  return (
    <div className="p-6">
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
            loading={loading}
            hasErrors={hasErrors}
          />
        </>
      )}
    </div>
  )
}
