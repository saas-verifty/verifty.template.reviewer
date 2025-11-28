/**
 * Tests for Alert component
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { Alert } from '@/components/Alert'

describe('Alert Component', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render success alert with message', () => {
      // Arrange & Act
      render(
        <Alert
          type="success"
          message="Operation successful"
          onClose={mockOnClose}
        />
      )

      // Assert
      expect(screen.getByText('Operation successful')).toBeInTheDocument()
    })

    it('should render error alert with message', () => {
      // Arrange & Act
      render(
        <Alert
          type="error"
          message="Something went wrong"
          onClose={mockOnClose}
        />
      )

      // Assert
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('should display success icon for success type', () => {
      // Arrange & Act
      const { container } = render(
        <Alert type="success" message="Success!" onClose={mockOnClose} />
      )

      // Assert - Check for success icon (checkmark path)
      const successIcon = container.querySelector('path[d="M9 12l2 2 4-4"]')
      expect(successIcon).toBeInTheDocument()
    })

    it('should display error icon for error type', () => {
      // Arrange & Act
      const { container } = render(
        <Alert type="error" message="Error!" onClose={mockOnClose} />
      )

      // Assert - Check for error icon (exclamation mark lines)
      const errorIconLine1 = container.querySelector('line[x1="12"][y1="8"]')
      const errorIconLine2 = container.querySelector('line[x1="12"][y1="16"]')
      expect(errorIconLine1).toBeInTheDocument()
      expect(errorIconLine2).toBeInTheDocument()
    })

    it('should render close button', () => {
      // Arrange & Act
      const { container } = render(
        <Alert type="success" message="Test" onClose={mockOnClose} />
      )

      // Assert - Check for close button (X icon)
      const closeIcon = container.querySelector('line[x1="18"][y1="6"]')
      expect(closeIcon).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should apply success styles for success type', () => {
      // Arrange & Act
      const { container } = render(
        <Alert type="success" message="Success!" onClose={mockOnClose} />
      )

      // Assert
      const alertDiv = container.firstChild as HTMLElement
      expect(alertDiv).toHaveClass('bg-bg-success-soft')
      expect(alertDiv).toHaveClass('border-fg-success')
      expect(alertDiv).toHaveClass('text-fg-success')
    })

    it('should apply error styles for error type', () => {
      // Arrange & Act
      const { container } = render(
        <Alert type="error" message="Error!" onClose={mockOnClose} />
      )

      // Assert
      const alertDiv = container.firstChild as HTMLElement
      expect(alertDiv).toHaveClass('bg-bg-danger-soft')
      expect(alertDiv).toHaveClass('border-fg-danger')
      expect(alertDiv).toHaveClass('text-fg-danger')
    })

    it('should have correct layout classes', () => {
      // Arrange & Act
      const { container } = render(
        <Alert type="success" message="Test" onClose={mockOnClose} />
      )

      // Assert
      const alertDiv = container.firstChild as HTMLElement
      expect(alertDiv).toHaveClass('flex')
      expect(alertDiv).toHaveClass('items-center')
      expect(alertDiv).toHaveClass('justify-between')
      expect(alertDiv).toHaveClass('rounded-lg')
    })
  })

  describe('Interactions', () => {
    it('should call onClose when close button is clicked', () => {
      // Arrange
      const { container } = render(
        <Alert type="success" message="Test" onClose={mockOnClose} />
      )

      const closeButton = container.querySelector('button') as HTMLElement

      // Act
      fireEvent.click(closeButton)

      // Assert
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should not call onClose when message is clicked', () => {
      // Arrange
      render(
        <Alert type="success" message="Test Message" onClose={mockOnClose} />
      )

      const message = screen.getByText('Test Message')

      // Act
      fireEvent.click(message)

      // Assert
      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have button element for close action', () => {
      // Arrange & Act
      const { container } = render(
        <Alert type="success" message="Test" onClose={mockOnClose} />
      )

      // Assert
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
      expect(button?.tagName).toBe('BUTTON')
    })

    it('should display message text in readable format', () => {
      // Arrange
      const longMessage =
        'This is a longer error message that should be fully visible to the user'

      // Act
      render(<Alert type="error" message={longMessage} onClose={mockOnClose} />)

      // Assert
      expect(screen.getByText(longMessage)).toBeInTheDocument()
    })
  })
})
