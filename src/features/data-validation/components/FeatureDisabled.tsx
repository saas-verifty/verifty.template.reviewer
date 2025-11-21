type Props = {
  message: string
}

export function FeatureDisabled({ message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="w-20 h-20 rounded-full bg-bg-tertiary flex items-center justify-center mb-6">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-body-subtle"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-black mb-2">
        Funcionalidad no disponible
      </h2>
      <p className="text-body text-center max-w-md">{message}</p>
    </div>
  )
}
