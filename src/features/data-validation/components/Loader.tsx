type Props = {
  message?: string
}

export function Loader({ message = 'Cargando...' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-bg-tertiary rounded-full"></div>
        <div className="absolute inset-0 border-4 border-bg-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-body text-sm">{message}</p>
    </div>
  )
}
