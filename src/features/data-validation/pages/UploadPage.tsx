import { useEffect } from 'react'

import useFileUpload from '../hooks/useFileUpload'
import useTableData from '../hooks/useTableData'

import { FileUploader } from '../components/FileUploader'
import { DataTable } from '../components/DataTable'

export default function UploadPage() {
  const { file, data, handleFile, loading, error } = useFileUpload()
  const { table, initializeTable, updateCell } = useTableData()

  useEffect(() => {
    if (data) initializeTable(data)
  }, [data])

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
        </>
      )}
    </div>
  )
}
