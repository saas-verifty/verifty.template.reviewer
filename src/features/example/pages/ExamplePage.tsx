import { useExample } from '../hooks/useExample'
import { ExampleCard } from '../components/ExampleCard'
import './ExamplePage.css'

export const ExamplePage = () => {
  const { examples, loading, error, updateStatus } = useExample()

  if (loading) {
    return (
      <div className="example-page">
        <div className="loading">Loading examples...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="example-page">
        <div className="error">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="example-page">
      <div className="example-page-header">
        <h2>Example Feature</h2>
        <p className="example-page-subtitle">
          This demonstrates the feature-based architecture. Click status badges
          to cycle through states.
        </p>
      </div>

      <div className="example-grid">
        {examples.map((example) => (
          <ExampleCard
            key={example.id}
            example={example}
            onStatusChange={updateStatus}
          />
        ))}
      </div>

      {examples.length === 0 && (
        <div className="empty-state">
          <p>No examples found</p>
        </div>
      )}
    </div>
  )
}
