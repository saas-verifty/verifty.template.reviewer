type Props = {
  onFileSelected: (file: File) => void
  disable: boolean
}

export const FileUploader = ({ onFileSelected, disable }: Props) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      console.error('Ningun Archivo Seleccionado')
      return
    }
    onFileSelected(file)
  }

  return (
    <div>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleChange}
        disabled={disable}
      />
    </div>
  )
}
