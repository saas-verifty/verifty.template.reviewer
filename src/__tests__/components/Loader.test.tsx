/**
 * Tests for Loader component
 */

import { render, screen } from '@testing-library/react';
import { Loader } from '@/components/Loader';
import { UI_MESSAGES } from '@/constants/uiMessages';

describe('Loader Component', () => {
  describe('Rendering', () => {
    it('should render with default message', () => {
      // Arrange & Act
      render(<Loader />);

      // Assert
      expect(screen.getByText(UI_MESSAGES.LOADING_DEFAULT)).toBeInTheDocument();
    });

    it('should render with custom message', () => {
      // Arrange
      const customMessage = 'Procesando archivo...';

      // Act
      render(<Loader message={customMessage} />);

      // Assert
      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    it('should render spinner elements', () => {
      // Arrange & Act
      const { container } = render(<Loader />);

      // Assert - Check for spinner container
      const spinnerContainer = container.querySelector('.relative.w-16.h-16');
      expect(spinnerContainer).toBeInTheDocument();
    });

    it('should render both spinner layers', () => {
      // Arrange & Act
      const { container } = render(<Loader />);

      // Assert - Check for background and animated spinner
      const spinners = container.querySelectorAll('.border-4.rounded-full');
      expect(spinners).toHaveLength(2);
    });
  });

  describe('Styling', () => {
    it('should have correct layout classes', () => {
      // Arrange & Act
      const { container } = render(<Loader />);

      // Assert
      const loaderDiv = container.firstChild as HTMLElement;
      expect(loaderDiv).toHaveClass('flex');
      expect(loaderDiv).toHaveClass('flex-col');
      expect(loaderDiv).toHaveClass('items-center');
      expect(loaderDiv).toHaveClass('justify-center');
    });

    it('should have animated spinner with correct classes', () => {
      // Arrange & Act
      const { container } = render(<Loader />);

      // Assert
      const animatedSpinner = container.querySelector('.animate-spin');
      expect(animatedSpinner).toBeInTheDocument();
      expect(animatedSpinner).toHaveClass('border-bg-purple');
      expect(animatedSpinner).toHaveClass('border-t-transparent');
    });

    it('should have background spinner with correct classes', () => {
      // Arrange & Act
      const { container } = render(<Loader />);

      // Assert
      const backgroundSpinner = container.querySelector('.border-bg-tertiary');
      expect(backgroundSpinner).toBeInTheDocument();
    });

    it('should style message text correctly', () => {
      // Arrange & Act
      render(<Loader message="Test" />);

      // Assert
      const messageElement = screen.getByText('Test');
      expect(messageElement.tagName).toBe('P');
      expect(messageElement).toHaveClass('text-body');
      expect(messageElement).toHaveClass('text-sm');
    });
  });

  describe('Different messages', () => {
    it('should handle empty string message', () => {
      // Arrange & Act
      const { container } = render(<Loader message="" />);

      // Assert
      const paragraph = container.querySelector('p');
      expect(paragraph).toBeInTheDocument();
      expect(paragraph?.textContent).toBe('');
    });

    it('should handle long messages', () => {
      // Arrange
      const longMessage = 'This is a very long loading message that should still display correctly';

      // Act
      render(<Loader message={longMessage} />);

      // Assert
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('should handle special characters in message', () => {
      // Arrange
      const specialMessage = 'Cargando... 50% completado';

      // Act
      render(<Loader message={specialMessage} />);

      // Assert
      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      // Arrange & Act
      render(<Loader message="Loading" />);

      // Assert
      const messageElement = screen.getByText('Loading');
      expect(messageElement.tagName).toBe('P');
    });

    it('should display message for screen readers', () => {
      // Arrange & Act
      render(<Loader message="Processing data" />);

      // Assert
      const message = screen.getByText('Processing data');
      expect(message).toBeVisible();
    });
  });
});
