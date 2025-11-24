type Props = {
  progress: number
  label?: string
}

export function ProgressIndicator({ progress, label }: Props) {
  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-body mb-1">
        <span>{label || 'Progreso'}</span>
        <span>{clampedProgress}%</span>
      </div>
      <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
        <div
          className="h-full bg-bg-brand transition-all duration-300 ease-out rounded-full"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  )
}
