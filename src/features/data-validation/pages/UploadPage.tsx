import { useEffect } from 'react'

import useFileUpload from '../hooks/useFileUpload'
import useTableData from '../hooks/useTableData'
import { useValidation } from '../hooks/useValidation'

import { FileUploader } from '../components/FileUploader'
import { DataTable } from '../components/DataTable'
import { ActionButtons } from '../components/ActionsButtons'

export default function UploadPage() {
  const { file, data, handleFile, loading, error, clear } = useFileUpload()
  const { table, initializeTable, updateCell, clearTable } = useTableData()
  const { status, result, validate, reset } = useValidation()

  useEffect(() => {
    if (data) initializeTable(data)
  }, [data])

  const handleValidate = async () => {
    if (!data || table.length === 0) return
    const validationResult = await validate(table, data)
    console.log('Resultado validación:', validationResult)
  }

  const handleSubmit = () => {
    console.log('Enviando datos...', table)
    // TODO: Conectar con API
  }

  const handleCancel = () => {
    clear()
    clearTable()
    reset()
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
            loading={loading || status === 'validating'}
          />
          {status === 'validating' && <p>Validando...</p>}
          {result && (
            <div style={{ marginTop: 16, padding: 12, border: '1px solid #ccc' }}>
              <h3>Resultado de Validación</h3>
              <p>Total filas: {result.totalRows}</p>
              <p style={{ color: 'green' }}>Filas válidas: {result.validRows}</p>
              <p style={{ color: result.errorRows > 0 ? 'red' : 'inherit' }}>
                Filas con errores: {result.errorRows}
              </p>
              {result.errorRows > 0 && (
                <ul>
                  <li>Campos requeridos: {result.errorsByType.required}</li>
                  <li>Tipo inválido: {result.errorsByType.invalid_type}</li>
                  <li>Valor no permitido: {result.errorsByType.enum_mismatch}</li>
                  <li>Catálogo no encontrado: {result.errorsByType.catalog_not_found}</li>
                  <li>Error de jerarquía: {result.errorsByType.hierarchy_error}</li>
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
