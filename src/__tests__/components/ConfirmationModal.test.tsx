/**
 * Tests for ConfirmationModal component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { UI_MESSAGES } from '@/constants/uiMessages';
import type { TableData } from '@/features/data-validation/types/table.types';

describe('ConfirmationModal Component', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  const mockTableData: TableData = [
    {
      id: 1,
      proceso: { value: 'Proceso 1', error: null },
      actividad: { value: 'Actividad 1', error: null },
      subactividad: { value: 'Subactividad 1', error: null },
      peligro: { value: 'Biológico', error: null },
      hasErrors: false,
      isEdited: false
    },
    {
      id: 2,
      proceso: { value: 'Proceso 2', error: null },
      actividad: { value: 'Actividad 2', error: null },
      subactividad: { value: 'Subactividad 2', error: null },
      peligro: { value: 'Físico', error: null },
      hasErrors: false,
      isEdited: true
    }
  ] as any;

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      // Arrange & Act
      const { container } = render(
        <ConfirmationModal
          isOpen={false}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={mockTableData}
        />
      );

      // Assert
      expect(container.firstChild).toBeNull();
    });

    it('should render when isOpen is true', () => {
      // Arrange & Act
      render(
        <ConfirmationModal
          isOpen={true}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={mockTableData}
        />
      );

      // Assert
      expect(screen.getByText(UI_MESSAGES.CONFIRM_SUBMISSION)).toBeInTheDocument();
    });

    it('should display correct record count', () => {
      // Arrange & Act
      render(
        <ConfirmationModal
          isOpen={true}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={mockTableData}
        />
      );

      // Assert
      expect(screen.getByText(/2/)).toBeInTheDocument();
      expect(screen.getByText(/registros/)).toBeInTheDocument();
    });

    it('should display edited count when there are edited rows', () => {
      // Arrange & Act
      render(
        <ConfirmationModal
          isOpen={true}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={mockTableData}
        />
      );

      // Assert
      expect(screen.getByText(/1 editado/)).toBeInTheDocument();
    });

    it('should not display edited count when no rows are edited', () => {
      // Arrange
      const uneditedTable: TableData = mockTableData.map(row => ({
        ...row,
        isEdited: false
      })) as any;

      // Act
      const { container } = render(
        <ConfirmationModal
          isOpen={true}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={uneditedTable}
        />
      );

      // Assert
      expect(container.textContent).not.toContain('editado');
    });

    it('should render confirm and cancel buttons', () => {
      // Arrange & Act
      render(
        <ConfirmationModal
          isOpen={true}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={mockTableData}
        />
      );

      // Assert
      expect(screen.getByText(UI_MESSAGES.CONFIRM_BUTTON)).toBeInTheDocument();
      expect(screen.getByText(UI_MESSAGES.CANCEL_BUTTON)).toBeInTheDocument();
    });

    it('should render close X button', () => {
      // Arrange & Act
      const { container } = render(
        <ConfirmationModal
          isOpen={true}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={mockTableData}
        />
      );

      // Assert - Check for X icon
      const closeIcon = container.querySelector('line[x1="18"][y1="6"]');
      expect(closeIcon).toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('should show loading spinner when loading is true', () => {
      // Arrange & Act
      const { container } = render(
        <ConfirmationModal
          isOpen={true}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={mockTableData}
          loading={true}
        />
      );

      // Assert
      expect(screen.getByText(UI_MESSAGES.PROCESSING)).toBeInTheDocument();
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should disable buttons when loading', () => {
      // Arrange & Act
      render(
        <ConfirmationModal
          isOpen={true}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={mockTableData}
          loading={true}
        />
      );

      // Assert
      const confirmButton = screen.getByText(UI_MESSAGES.CONFIRM_BUTTON);
      const cancelButton = screen.getByText(UI_MESSAGES.CANCEL_BUTTON);

      expect(confirmButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });

    it('should not show loading spinner when loading is false', () => {
      // Arrange & Act
      render(
        <ConfirmationModal
          isOpen={true}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={mockTableData}
          loading={false}
        />
      );

      // Assert
      expect(screen.queryByText(UI_MESSAGES.PROCESSING)).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onConfirm when confirm button is clicked', () => {
      // Arrange
      render(
        <ConfirmationModal
          isOpen={true}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={mockTableData}
        />
      );

      const confirmButton = screen.getByText(UI_MESSAGES.CONFIRM_BUTTON);

      // Act
      fireEvent.click(confirmButton);

      // Assert
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when cancel button is clicked', () => {
      // Arrange
      render(
        <ConfirmationModal
          isOpen={true}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={mockTableData}
        />
      );

      const cancelButton = screen.getByText(UI_MESSAGES.CANCEL_BUTTON);

      // Act
      fireEvent.click(cancelButton);

      // Assert
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when backdrop is clicked', () => {
      // Arrange
      const { container } = render(
        <ConfirmationModal
          isOpen={true}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={mockTableData}
        />
      );

      const backdrop = container.querySelector('.bg-black\\/50') as HTMLElement;

      // Act
      fireEvent.click(backdrop);

      // Assert
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when close X button is clicked', () => {
      // Arrange
      const { container } = render(
        <ConfirmationModal
          isOpen={true}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={mockTableData}
        />
      );

      const closeButton = container.querySelector('.absolute.top-4.right-4') as HTMLElement;

      // Act
      fireEvent.click(closeButton);

      // Assert
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when Escape key is pressed', () => {
      // Arrange
      render(
        <ConfirmationModal
          isOpen={true}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={mockTableData}
        />
      );

      // Act
      fireEvent.keyDown(document, { key: 'Escape' });

      // Assert
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should not call onCancel on Escape when loading', () => {
      // Arrange
      render(
        <ConfirmationModal
          isOpen={true}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={mockTableData}
          loading={true}
        />
      );

      // Act
      fireEvent.keyDown(document, { key: 'Escape' });

      // Assert
      expect(mockOnCancel).not.toHaveBeenCalled();
    });

    it('should not respond to backdrop click when loading', () => {
      // Arrange
      const { container } = render(
        <ConfirmationModal
          isOpen={true}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={mockTableData}
          loading={true}
        />
      );

      const backdrop = container.querySelector('.bg-black\\/50') as HTMLElement;

      // Act
      fireEvent.click(backdrop);

      // Assert
      expect(mockOnCancel).not.toHaveBeenCalled();
    });
  });

  describe('Body overflow management', () => {
    it('should set body overflow to hidden when modal opens', () => {
      // Arrange & Act
      render(
        <ConfirmationModal
          isOpen={true}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={mockTableData}
        />
      );

      // Assert
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore body overflow when modal closes', () => {
      // Arrange
      const { rerender } = render(
        <ConfirmationModal
          isOpen={true}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={mockTableData}
        />
      );

      expect(document.body.style.overflow).toBe('hidden');

      // Act
      rerender(
        <ConfirmationModal
          isOpen={false}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={mockTableData}
        />
      );

      // Assert
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Pluralization', () => {
    it('should use singular form for 1 record', () => {
      // Arrange
      const singleRowTable: TableData = [mockTableData[0]] as any;

      // Act
      render(
        <ConfirmationModal
          isOpen={true}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={singleRowTable}
        />
      );

      // Assert
      expect(screen.getByText(/1 registro/)).toBeInTheDocument();
    });

    it('should use plural form for multiple records', () => {
      // Arrange & Act
      render(
        <ConfirmationModal
          isOpen={true}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          table={mockTableData}
        />
      );

      // Assert
      expect(screen.getByText(/2 registros/)).toBeInTheDocument();
    });
  });
});
