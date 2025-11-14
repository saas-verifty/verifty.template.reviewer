import { Example } from '../types'
import './ExampleCard.css'

interface ExampleCardProps {
  example: Example
  onStatusChange?: (id: string, status: Example['status']) => void
}

export const ExampleCard = ({ example, onStatusChange }: ExampleCardProps) => {
  const getStatusColor = (status: Example['status']) => {
    switch (status) {
      case 'pending':
        return '#fbbf24'
      case 'in_progress':
        return '#3b82f6'
      case 'completed':
        return '#10b981'
      default:
        return '#6b7280'
    }
  }

  const handleStatusClick = () => {
    if (!onStatusChange) return

    const statuses: Example['status'][] = [
      'pending',
      'in_progress',
      'completed',
    ]
    const currentIndex = statuses.indexOf(example.status)
    const nextStatus = statuses[(currentIndex + 1) % statuses.length]
    onStatusChange(example.id, nextStatus)
  }

  return (
    <div className="example-card">
      <div className="example-card-header">
        <h3 className="example-card-title">{example.title}</h3>
        <button
          className="example-card-status"
          style={{ backgroundColor: getStatusColor(example.status) }}
          onClick={handleStatusClick}
          title="Click to cycle status"
        >
          {example.status.replace('_', ' ')}
        </button>
      </div>
      <p className="example-card-description">{example.description}</p>
      <div className="example-card-footer">
        <span className="example-card-date">
          Created: {new Date(example.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}
