/**
 * Tests for errorFormatter utility
 */

import {
  formatCellError,
  formatRowErrors,
  groupErrorsByType,
  countErrorsByType,
  buildValidationSummary
} from '@/features/data-validation/utils/errorFormatter';
import type { CellError, RowValidationResult } from '@/features/data-validation/types/validation.types';
import { VALIDATION_MESSAGES } from '@/constants/validationMessages';

describe('errorFormatter', () => {
  describe('formatCellError', () => {
    it('should format a required error', () => {
      // Arrange
      const error: CellError = {
        rowIndex: 0,
        columnName: 'proceso',
        errorType: 'required'
      };

      // Act
      const result = formatCellError(error);

      // Assert
      expect(result).toBe(`Fila 1 — proceso: ${VALIDATION_MESSAGES.required}`);
    });

    it('should format an error with additional message', () => {
      // Arrange
      const error: CellError = {
        rowIndex: 2,
        columnName: 'peligro',
        errorType: 'catalog_not_found',
        errorMessage: 'Tipo de peligro no existe'
      };

      // Act
      const result = formatCellError(error);

      // Assert
      expect(result).toContain('Fila 3');
      expect(result).toContain('peligro');
      expect(result).toContain('Tipo de peligro no existe');
    });

    it('should handle invalid_type error', () => {
      // Arrange
      const error: CellError = {
        rowIndex: 5,
        columnName: 'nivel_deficiencia_ND',
        errorType: 'invalid_type'
      };

      // Act
      const result = formatCellError(error);

      // Assert
      expect(result).toBe(`Fila 6 — nivel_deficiencia_ND: ${VALIDATION_MESSAGES.invalid_type}`);
    });

    it('should handle enum_mismatch error', () => {
      // Arrange
      const error: CellError = {
        rowIndex: 10,
        columnName: 'frecuencia',
        errorType: 'enum_mismatch'
      };

      // Act
      const result = formatCellError(error);

      // Assert
      expect(result).toContain('Fila 11');
      expect(result).toContain('frecuencia');
      expect(result).toContain(VALIDATION_MESSAGES.enum_mismatch);
    });

    it('should handle hierarchy_error', () => {
      // Arrange
      const error: CellError = {
        rowIndex: 3,
        columnName: 'peligro',
        errorType: 'hierarchy_error',
        errorMessage: 'Debe existir un proceso antes de agregar peligros'
      };

      // Act
      const result = formatCellError(error);

      // Assert
      expect(result).toContain('Fila 4');
      expect(result).toContain('peligro');
      expect(result).toContain('Debe existir un proceso antes de agregar peligros');
    });
  });

  describe('formatRowErrors', () => {
    it('should format all errors in a row', () => {
      // Arrange
      const row: RowValidationResult = {
        rowIndex: 0,
        isValid: false,
        errors: [
          {
            rowIndex: 0,
            columnName: 'proceso',
            errorType: 'required'
          },
          {
            rowIndex: 0,
            columnName: 'actividad',
            errorType: 'required'
          }
        ]
      };

      // Act
      const result = formatRowErrors(row);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toContain('proceso');
      expect(result[1]).toContain('actividad');
    });

    it('should return empty array for valid row', () => {
      // Arrange
      const row: RowValidationResult = {
        rowIndex: 0,
        isValid: true,
        errors: []
      };

      // Act
      const result = formatRowErrors(row);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('groupErrorsByType', () => {
    it('should group errors by type', () => {
      // Arrange
      const rows: RowValidationResult[] = [
        {
          rowIndex: 0,
          isValid: false,
          errors: [
            { rowIndex: 0, columnName: 'proceso', errorType: 'required' },
            { rowIndex: 0, columnName: 'peligro', errorType: 'catalog_not_found' }
          ]
        },
        {
          rowIndex: 1,
          isValid: false,
          errors: [
            { rowIndex: 1, columnName: 'actividad', errorType: 'required' },
            { rowIndex: 1, columnName: 'nivel_deficiencia_ND', errorType: 'invalid_type' }
          ]
        }
      ];

      // Act
      const result = groupErrorsByType(rows);

      // Assert
      expect(result.required).toHaveLength(2);
      expect(result.invalid_type).toHaveLength(1);
      expect(result.catalog_not_found).toHaveLength(1);
      expect(result.enum_mismatch).toHaveLength(0);
      expect(result.hierarchy_error).toHaveLength(0);
    });

    it('should handle empty array', () => {
      // Arrange
      const rows: RowValidationResult[] = [];

      // Act
      const result = groupErrorsByType(rows);

      // Assert
      expect(result.required).toHaveLength(0);
      expect(result.invalid_type).toHaveLength(0);
      expect(result.catalog_not_found).toHaveLength(0);
      expect(result.enum_mismatch).toHaveLength(0);
      expect(result.hierarchy_error).toHaveLength(0);
    });
  });

  describe('countErrorsByType', () => {
    it('should count errors by type', () => {
      // Arrange
      const rows: RowValidationResult[] = [
        {
          rowIndex: 0,
          isValid: false,
          errors: [
            { rowIndex: 0, columnName: 'proceso', errorType: 'required' },
            { rowIndex: 0, columnName: 'actividad', errorType: 'required' }
          ]
        },
        {
          rowIndex: 1,
          isValid: false,
          errors: [
            { rowIndex: 1, columnName: 'peligro', errorType: 'catalog_not_found' }
          ]
        }
      ];

      // Act
      const result = countErrorsByType(rows);

      // Assert
      expect(result.required).toBe(2);
      expect(result.catalog_not_found).toBe(1);
      expect(result.invalid_type).toBe(0);
      expect(result.enum_mismatch).toBe(0);
      expect(result.hierarchy_error).toBe(0);
    });
  });

  describe('buildValidationSummary', () => {
    it('should build summary for valid data', () => {
      // Arrange
      const rows: RowValidationResult[] = [
        { rowIndex: 0, isValid: true, errors: [] },
        { rowIndex: 1, isValid: true, errors: [] },
        { rowIndex: 2, isValid: true, errors: [] }
      ];

      // Act
      const result = buildValidationSummary(rows);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.totalRows).toBe(3);
      expect(result.validRows).toBe(3);
      expect(result.errorRows).toBe(0);
      expect(result.rowResults).toEqual(rows);
    });

    it('should build summary with errors', () => {
      // Arrange
      const rows: RowValidationResult[] = [
        { rowIndex: 0, isValid: true, errors: [] },
        {
          rowIndex: 1,
          isValid: false,
          errors: [
            { rowIndex: 1, columnName: 'proceso', errorType: 'required' }
          ]
        },
        {
          rowIndex: 2,
          isValid: false,
          errors: [
            { rowIndex: 2, columnName: 'actividad', errorType: 'required' },
            { rowIndex: 2, columnName: 'peligro', errorType: 'catalog_not_found' }
          ]
        }
      ];

      // Act
      const result = buildValidationSummary(rows);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.totalRows).toBe(3);
      expect(result.validRows).toBe(1);
      expect(result.errorRows).toBe(2);
      expect(result.errorsByType.required).toBe(2);
      expect(result.errorsByType.catalog_not_found).toBe(1);
    });

    it('should handle empty rows', () => {
      // Arrange
      const rows: RowValidationResult[] = [];

      // Act
      const result = buildValidationSummary(rows);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.totalRows).toBe(0);
      expect(result.validRows).toBe(0);
      expect(result.errorRows).toBe(0);
    });
  });
});
