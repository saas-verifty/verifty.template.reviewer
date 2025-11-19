import { FileUploader } from '../components/FileUploader'
import useFileUpload from '../hooks/useFileUpload'

export default function UploadPage() {
  const { file, data, handleFile, loading, error, clear } = useFileUpload()

  return (
    <div>
      <h1>Subir Excel</h1>
      {!data && (
        <>
          <FileUploader
            onFileSelected={(file: File) => handleFile(file)}
            disable={loading}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      )}
      {loading && <p>Cargando...</p>}
      {data && (
        <div>
          {file && <p>Archivo seleccionado: {file.name}</p>}
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
