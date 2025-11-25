/**
 * Tests for useTableData hook
 */

import { renderHook, act } from '@testing-library/react';
import useTableData from '@/features/data-validation/hooks/useTableData';
import type { ParsedExcelData } from '@/features/data-validation/types/excel.types';

// Mock the validation service
jest.mock('@/features/data-validation/services/validation.service', () => ({
  validateTable: jest.fn((table) => {
    // Simple mock that marks rows with empty required fields as invalid
    return table.map((row: any, index: number) => ({
      rowIndex: index,
      isValid: row.cells.proceso?.value !== '',
      errors: row.cells.proceso?.value === ''
        ? [{ rowIndex: index, columnName: 'proceso', errorType: 'required' }]
        : []
    }));
  })
}));

describe('useTableData', () => {
  const mockParsedData: ParsedExcelData = {
    mainSheet: {
      name: 'Plantilla de Carga',
      headers: ['proceso', 'actividad', 'subactividad', 'peligro'],
      data: [
        {
          proceso: 'Proceso 1',
          actividad: 'Actividad 1',
          subactividad: 'Subactividad 1',
          frecuencia: '',
          personal_involucrado: '',
          cargo: '',
          area_empresa: '',
          peligro: 'Biológico',
          descripcion_peligro: '',
          descripcion_especifica_peligro: '',
          consecuencia_efecto_posible: '',
          controles_existentes_fuente: '',
          controles_existentes_medio: '',
          controles_existentes_individuo: '',
          nivel_deficiencia_ND: '',
          nivel_exposicion_NE: '',
          valor_consecuencia_NC: ''
        },
        {
          proceso: 'Proceso 2',
          actividad: 'Actividad 2',
          subactividad: 'Subactividad 2',
          frecuencia: '',
          personal_involucrado: '',
          cargo: '',
          area_empresa: '',
          peligro: 'Físico',
          descripcion_peligro: '',
          descripcion_especifica_peligro: '',
          consecuencia_efecto_posible: '',
          controles_existentes_fuente: '',
          controles_existentes_medio: '',
          controles_existentes_individuo: '',
          nivel_deficiencia_ND: '',
          nivel_exposicion_NE: '',
          valor_consecuencia_NC: ''
        }
      ]
    },
    validationSheet: {
      name: 'Listas de Validacion',
      headers: ['frecuencia'],
      data: [{
        frecuencia: 'Rutinaria',
        personal_involucrado: '',
        cargo: '',
        areas_empresa: '',
        nivel_deficiencia_ND: '',
        nivel_exposicion_NE: '',
        valor_consecuencia_NC: ''
      }]
    },
    hazardCatalog: {
      biologico: [],
      fisico: [],
      quimico: [],
      psicosocial: [],
      biomecanico: [],
      condiciones_seguridad: [],
      fenomenos_naturales: []
    }
  };

  describe('Initial state', () => {
    it('should initialize with empty table', () => {
      // Act
      const { result } = renderHook(() => useTableData());

      // Assert
      expect(result.current.table).toEqual([]);
      expect(result.current.parsedData).toBeNull();
      expect(result.current.hasErrors).toBe(false);
    });
  });

  describe('initializeTable', () => {
    it('should initialize table from parsed data', () => {
      // Arrange
      const { result } = renderHook(() => useTableData());

      // Act
      act(() => {
        result.current.initializeTable(mockParsedData);
      });

      // Assert
      expect(result.current.table).toHaveLength(2);
      expect(result.current.parsedData).toEqual(mockParsedData);
      expect(result.current.table[0].cells.proceso.value).toBe('Proceso 1');
      expect(result.current.table[1].cells.proceso.value).toBe('Proceso 2');
    });

    it('should create cells for all headers', () => {
      // Arrange
      const { result } = renderHook(() => useTableData());

      // Act
      act(() => {
        result.current.initializeTable(mockParsedData);
      });

      // Assert
      const firstRow = result.current.table[0];
      expect(firstRow.cells).toHaveProperty('proceso');
      expect(firstRow.cells).toHaveProperty('actividad');
      expect(firstRow.cells).toHaveProperty('subactividad');
      expect(firstRow.cells).toHaveProperty('peligro');
    });

    it('should set originalValue and value for each cell', () => {
      // Arrange
      const { result } = renderHook(() => useTableData());

      // Act
      act(() => {
        result.current.initializeTable(mockParsedData);
      });

      // Assert
      const cell = result.current.table[0].cells.proceso;
      expect(cell.value).toBe('Proceso 1');
      expect(cell.originalValue).toBe('Proceso 1');
      expect(cell.isEdited).toBe(false);
    });

    it('should handle missing values in data', () => {
      // Arrange
      const { result } = renderHook(() => useTableData());
      const dataWithMissing: ParsedExcelData = {
        ...mockParsedData,
        mainSheet: {
          ...mockParsedData.mainSheet,
          data: [{
            proceso: 'Proceso 1',
            actividad: '',
            subactividad: '',
            frecuencia: '',
            personal_involucrado: '',
            cargo: '',
            area_empresa: '',
            peligro: '',
            descripcion_peligro: '',
            descripcion_especifica_peligro: '',
            consecuencia_efecto_posible: '',
            controles_existentes_fuente: '',
            controles_existentes_medio: '',
            controles_existentes_individuo: '',
            nivel_deficiencia_ND: '',
            nivel_exposicion_NE: '',
            valor_consecuencia_NC: ''
          }]
        }
      };

      // Act
      act(() => {
        result.current.initializeTable(dataWithMissing);
      });

      // Assert
      const row = result.current.table[0];
      expect(row.cells.proceso.value).toBe('Proceso 1');
      expect(row.cells.actividad.value).toBe('');
      expect(row.cells.subactividad.value).toBe('');
      expect(row.cells.peligro.value).toBe('');
    });

    it('should set rowIndex correctly', () => {
      // Arrange
      const { result } = renderHook(() => useTableData());

      // Act
      act(() => {
        result.current.initializeTable(mockParsedData);
      });

      // Assert
      expect(result.current.table[0].rowIndex).toBe(0);
      expect(result.current.table[1].rowIndex).toBe(1);
    });

    it('should apply initial validation', () => {
      // Arrange
      const { result } = renderHook(() => useTableData());

      // Act
      act(() => {
        result.current.initializeTable(mockParsedData);
      });

      // Assert - All rows are valid based on our mock
      expect(result.current.table[0].hasError).toBe(false);
      expect(result.current.table[1].hasError).toBe(false);
    });

    it('should not initialize if data is null', () => {
      // Arrange
      const { result } = renderHook(() => useTableData());

      // Act
      act(() => {
        result.current.initializeTable(null as any);
      });

      // Assert
      expect(result.current.table).toEqual([]);
      expect(result.current.parsedData).toBeNull();
    });
  });

  describe('updateCell', () => {
    it('should update cell value', () => {
      // Arrange
      const { result } = renderHook(() => useTableData());
      act(() => {
        result.current.initializeTable(mockParsedData);
      });

      // Act
      act(() => {
        result.current.updateCell(0, 'proceso', 'Nuevo Proceso');
      });

      // Assert
      expect(result.current.table[0].cells.proceso.value).toBe('Nuevo Proceso');
    });

    it('should mark cell as edited when value changes', () => {
      // Arrange
      const { result } = renderHook(() => useTableData());
      act(() => {
        result.current.initializeTable(mockParsedData);
      });

      // Act
      act(() => {
        result.current.updateCell(0, 'proceso', 'Nuevo Proceso');
      });

      // Assert
      expect(result.current.table[0].cells.proceso.isEdited).toBe(true);
      expect(result.current.table[0].isEdited).toBe(true);
    });

    it('should not mark cell as edited when value equals original', () => {
      // Arrange
      const { result } = renderHook(() => useTableData());
      act(() => {
        result.current.initializeTable(mockParsedData);
      });

      // Get original value
      const originalValue = result.current.table[0].cells.proceso.value as string;

      // Act - Change and then revert
      act(() => {
        result.current.updateCell(0, 'proceso', 'Temp');
      });
      act(() => {
        result.current.updateCell(0, 'proceso', originalValue);
      });

      // Assert
      expect(result.current.table[0].cells.proceso.isEdited).toBe(false);
    });

    it('should preserve originalValue', () => {
      // Arrange
      const { result } = renderHook(() => useTableData());
      act(() => {
        result.current.initializeTable(mockParsedData);
      });

      const originalValue = result.current.table[0].cells.proceso.originalValue;

      // Act
      act(() => {
        result.current.updateCell(0, 'proceso', 'Nuevo Proceso');
      });

      // Assert
      expect(result.current.table[0].cells.proceso.originalValue).toBe(originalValue);
      expect(result.current.table[0].cells.proceso.value).toBe('Nuevo Proceso');
    });

    it('should only update specified row', () => {
      // Arrange
      const { result } = renderHook(() => useTableData());
      act(() => {
        result.current.initializeTable(mockParsedData);
      });

      const row1OriginalValue = result.current.table[1].cells.proceso.value;

      // Act - Update row 0
      act(() => {
        result.current.updateCell(0, 'proceso', 'Nuevo Proceso');
      });

      // Assert - Row 1 should be unchanged
      expect(result.current.table[1].cells.proceso.value).toBe(row1OriginalValue);
      expect(result.current.table[1].isEdited).toBe(false);
    });

    it('should only update specified column', () => {
      // Arrange
      const { result } = renderHook(() => useTableData());
      act(() => {
        result.current.initializeTable(mockParsedData);
      });

      const actividadOriginalValue = result.current.table[0].cells.actividad.value;

      // Act - Update proceso column
      act(() => {
        result.current.updateCell(0, 'proceso', 'Nuevo Proceso');
      });

      // Assert - actividad should be unchanged
      expect(result.current.table[0].cells.actividad.value).toBe(actividadOriginalValue);
    });

    it('should re-validate after update', () => {
      // Arrange
      const { result } = renderHook(() => useTableData());
      act(() => {
        result.current.initializeTable(mockParsedData);
      });

      // Act - Clear required field to trigger error
      act(() => {
        result.current.updateCell(0, 'proceso', '');
      });

      // Assert - Should have error based on our mock validation
      expect(result.current.table[0].hasError).toBe(true);
    });

    it('should handle multiple updates correctly', () => {
      // Arrange
      const { result } = renderHook(() => useTableData());
      act(() => {
        result.current.initializeTable(mockParsedData);
      });

      // Act - Multiple updates
      act(() => {
        result.current.updateCell(0, 'proceso', 'Proceso A');
      });
      act(() => {
        result.current.updateCell(0, 'actividad', 'Actividad A');
      });
      act(() => {
        result.current.updateCell(1, 'proceso', 'Proceso B');
      });

      // Assert
      expect(result.current.table[0].cells.proceso.value).toBe('Proceso A');
      expect(result.current.table[0].cells.actividad.value).toBe('Actividad A');
      expect(result.current.table[1].cells.proceso.value).toBe('Proceso B');
    });
  });

  describe('clearTable', () => {
    it('should clear table and parsed data', () => {
      // Arrange
      const { result } = renderHook(() => useTableData());
      act(() => {
        result.current.initializeTable(mockParsedData);
      });

      expect(result.current.table.length).toBeGreaterThan(0);

      // Act
      act(() => {
        result.current.clearTable();
      });

      // Assert
      expect(result.current.table).toEqual([]);
      expect(result.current.parsedData).toBeNull();
    });
  });

  describe('hasErrors', () => {
    it('should return false when no rows have errors', () => {
      // Arrange
      const { result } = renderHook(() => useTableData());

      // Act
      act(() => {
        result.current.initializeTable(mockParsedData);
      });

      // Assert
      expect(result.current.hasErrors).toBe(false);
    });

    it('should return true when at least one row has error', () => {
      // Arrange
      const { result } = renderHook(() => useTableData());
      act(() => {
        result.current.initializeTable(mockParsedData);
      });

      // Act - Clear required field to trigger error
      act(() => {
        result.current.updateCell(0, 'proceso', '');
      });

      // Assert
      expect(result.current.hasErrors).toBe(true);
    });

    it('should return false for empty table', () => {
      // Arrange
      const { result } = renderHook(() => useTableData());

      // Assert
      expect(result.current.hasErrors).toBe(false);
    });
  });

  describe('Cell metadata', () => {
    it('should set columnName and rowIndex in cells', () => {
      // Arrange
      const { result } = renderHook(() => useTableData());

      // Act
      act(() => {
        result.current.initializeTable(mockParsedData);
      });

      // Assert
      const cell = result.current.table[0].cells.proceso;
      expect(cell.columnName).toBe('proceso');
      expect(cell.rowIndex).toBe(0);
    });

    it('should initialize hasError as false', () => {
      // Arrange
      const { result } = renderHook(() => useTableData());

      // Act
      act(() => {
        result.current.initializeTable(mockParsedData);
      });

      // Assert
      const cell = result.current.table[0].cells.proceso;
      expect(cell.hasError).toBe(false);
    });
  });
});
