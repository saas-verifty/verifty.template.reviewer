import { useEffect } from 'react'

import useFileUpload from '../hooks/useFileUpload'
import useTableData from '../hooks/useTableData'

import { FileUploader } from '../components/FileUploader'
import { DataTable } from '../components/DataTable'
import { ActionButtons } from '../components/ActionsButtons'

export default function UploadPage() {
  const { file, data, handleFile, loading, error, clear } = useFileUpload()
  const { table, initializeTable, updateCell, clearTable } = useTableData()

  useEffect(() => {
    if (data) initializeTable(data)
  }, [data])

  const handleValidate = () => {
    console.log('Validando datos...', table)
    // TODO: Conectar con Task 3 (validación)
  }

  const handleSubmit = () => {
    console.log('Enviando datos...', table)
    // TODO: Conectar con API
  }

  const handleCancel = () => {
    clear()
    clearTable()
  }

  return (
    <div>
      <h1>{data ? 'Datos Cargados' : 'Subir Excel'}</h1>
      {loading && <p>Cargando...</p>}
      {!data && (
        <>
          <FileUploader onFileSelected={handleFile} disable={loading} />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      )}
      {data && (
        <>
          <h2>Nombre del Archivo: {file?.name}</h2>
          <DataTable
            table={table}
            headers={data.mainSheet.headers}
            onChange={updateCell}
          />
          <ActionButtons
            onValidate={handleValidate}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </>
      )}
    </div>
  )
}
