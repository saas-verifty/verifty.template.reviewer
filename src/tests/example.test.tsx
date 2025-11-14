import { render, screen } from '@testing-library/react'
import { ExampleCard } from '@/features/example/components/ExampleCard'
import { Example } from '@/features/example/types'

describe('ExampleCard', () => {
  const mockExample: Example = {
    id: '1',
    title: 'Test Example',
    description: 'This is a test description',
    status: 'pending',
    createdAt: new Date('2024-01-15'),
  }

  it('renders example card with correct title', () => {
    render(<ExampleCard example={mockExample} />)
    expect(screen.getByText('Test Example')).toBeInTheDocument()
  })

  it('renders example card with correct description', () => {
    render(<ExampleCard example={mockExample} />)
    expect(screen.getByText('This is a test description')).toBeInTheDocument()
  })

  it('displays correct status', () => {
    render(<ExampleCard example={mockExample} />)
    expect(screen.getByText('pending')).toBeInTheDocument()
  })

  it('displays formatted creation date', () => {
    render(<ExampleCard example={mockExample} />)
    expect(screen.getByText(/Created:/)).toBeInTheDocument()
  })

  it('renders with different statuses', () => {
    const statuses: Example['status'][] = [
      'pending',
      'in_progress',
      'completed',
    ]

    statuses.forEach((status) => {
      const { unmount } = render(
        <ExampleCard example={{ ...mockExample, status }} />
      )
      expect(
        screen.getByText(status.replace('_', ' '))
      ).toBeInTheDocument()
      unmount()
    })
  })
})
