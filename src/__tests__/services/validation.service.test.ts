/**
 * Tests for validation service
 */

import { validateTable } from '@/features/data-validation/services/validation.service';
import type { TableData } from '@/features/data-validation/types/table.types';
import type { ParsedExcelData } from '@/features/data-validation/types/excel.types';

describe('validation.service', () => {
  // Mock parsed data with validation lists and catalogs
  const mockParsedData: ParsedExcelData = {
    mainSheet: {
      name: 'Plantilla de Carga',
      headers: [],
      data: []
    },
    validationSheet: {
      name: 'Listas de Validacion',
      headers: ['frecuencia', 'cargo', 'personal_involucrado', 'areas_empresa'],
      data: [
        {
          frecuencia: 'Rutinaria, No Rutinaria',
          cargo: 'CEO, CMO, CTO, Auxiliar Administrativo',
          personal_involucrado: 'Directo, Contratistas, En Misión',
          areas_empresa: 'Administración, Producción',
          nivel_deficiencia_ND: '2, 6, 10',
          nivel_exposicion_NE: '1, 2, 3, 4',
          valor_consecuencia_NC: '10, 25, 60, 100'
        }
      ]
    },
    hazardCatalog: {
      biologico: [
        {
          peligro: 'Biológico',
          descripcion_peligro: 'Vírus',
          descripcion_especifica_peligro: '',
          consecuencia_efecto_posible: 'Infecciones. Envenenamiento o efectos tóxicos'
        }
      ],
      fisico: [
        {
          peligro: 'Físico',
          descripcion_peligro: 'Ruido',
          descripcion_especifica_peligro: 'Impacto',
          consecuencia_efecto_posible: 'Disconfor, Dolor de cabeza, Hipoacucia'
        }
      ],
      quimico: [],
      psicosocial: [],
      biomecanico: [],
      condiciones_seguridad: [],
      fenomenos_naturales: []
    }
  };

  describe('validateTable', () => {
    it('should validate table with all valid rows', () => {
      // Arrange
      const table: TableData = [
        {
          id: 1,
          cells: {
            proceso: { value: 'Proceso 1', error: null },
            actividad: { value: 'Actividad 1', error: null },
            subactividad: { value: 'Subactividad 1', error: null },
            frecuencia: { value: 'Rutinaria', error: null },
            personal_involucrado: { value: 'Directo', error: null },
            cargo: { value: 'CEO', error: null },
            area_empresa: { value: 'Administración', error: null },
            peligro: { value: 'Biológico', error: null },
            descripcion_peligro: { value: 'Vírus', error: null },
            descripcion_especifica_peligro: { value: '', error: null },
            consecuencia_efecto_posible: { value: 'Infecciones. Envenenamiento o efectos tóxicos', error: null },
            controles_existentes_fuente: { value: 'Control 1', error: null },
            controles_existentes_medio: { value: 'Control 2', error: null },
            controles_existentes_individuo: { value: 'Control 3', error: null },
            nivel_deficiencia_ND: { value: '6', error: null },
            nivel_exposicion_NE: { value: '3', error: null },
            valor_consecuencia_NC: { value: '25', error: null }
          },
          hasErrors: false,
          isEdited: false
        }
      ] as any;

      // Act
      const results = validateTable(table, mockParsedData);

      // Assert
      expect(results).toHaveLength(1);
      expect(results[0].isValid).toBe(true);
      expect(results[0].errors).toHaveLength(0);
    });

    it('should detect required field errors', () => {
      // Arrange
      const table: TableData = [
        {
          id: 1,
          cells: {
            proceso: { value: '', error: null },
            actividad: { value: '', error: null },
            subactividad: { value: 'Subactividad 1', error: null },
            frecuencia: { value: 'Rutinaria', error: null },
            personal_involucrado: { value: 'Directo', error: null },
            cargo: { value: 'CEO', error: null },
            area_empresa: { value: 'Administración', error: null },
            peligro: { value: 'Biológico', error: null },
            descripcion_peligro: { value: 'Vírus', error: null },
            descripcion_especifica_peligro: { value: '', error: null },
            consecuencia_efecto_posible: { value: 'Infecciones. Envenenamiento o efectos tóxicos', error: null },
            controles_existentes_fuente: { value: 'Control 1', error: null },
            controles_existentes_medio: { value: 'Control 2', error: null },
            controles_existentes_individuo: { value: 'Control 3', error: null },
            nivel_deficiencia_ND: { value: '6', error: null },
            nivel_exposicion_NE: { value: '3', error: null },
            valor_consecuencia_NC: { value: '25', error: null }
          },
          hasErrors: false,
          isEdited: false
        }
      ] as any;

      // Act
      const results = validateTable(table, mockParsedData);

      // Assert
      expect(results).toHaveLength(1);
      expect(results[0].isValid).toBe(false);
      expect(results[0].errors.length).toBeGreaterThan(0);

      const requiredErrors = results[0].errors.filter(e => e.errorType === 'required');
      expect(requiredErrors.length).toBeGreaterThan(0);
      expect(requiredErrors.some(e => e.columnName === 'proceso')).toBe(true);
      expect(requiredErrors.some(e => e.columnName === 'actividad')).toBe(true);
    });

    it('should detect catalog errors for invalid numeric values', () => {
      // Arrange
      // Since numeric fields are validated against validation lists, not types
      // We need to test with values not in the validation list
      const table: TableData = [
        {
          id: 1,
          cells: {
            proceso: { value: 'Proceso 1', error: null },
            actividad: { value: 'Actividad 1', error: null },
            subactividad: { value: 'Subactividad 1', error: null },
            frecuencia: { value: 'Rutinaria', error: null },
            personal_involucrado: { value: 'Directo', error: null },
            cargo: { value: 'CEO', error: null },
            area_empresa: { value: 'Administración', error: null },
            peligro: { value: 'Biológico', error: null },
            descripcion_peligro: { value: 'Vírus', error: null },
            descripcion_especifica_peligro: { value: '', error: null },
            consecuencia_efecto_posible: { value: 'Infecciones. Envenenamiento o efectos tóxicos', error: null },
            controles_existentes_fuente: { value: 'Control 1', error: null },
            controles_existentes_medio: { value: 'Control 2', error: null },
            controles_existentes_individuo: { value: 'Control 3', error: null },
            nivel_deficiencia_ND: { value: '999', error: null }, // Not in validation list
            nivel_exposicion_NE: { value: '999', error: null }, // Not in validation list
            valor_consecuencia_NC: { value: '25', error: null }
          },
          hasErrors: false,
          isEdited: false
        }
      ] as any;

      // Act
      const results = validateTable(table, mockParsedData);

      // Assert
      expect(results).toHaveLength(1);
      expect(results[0].isValid).toBe(false);

      const catalogErrors = results[0].errors.filter(e => e.errorType === 'catalog_not_found');
      expect(catalogErrors.length).toBeGreaterThan(0);
    });

    it('should detect catalog validation errors', () => {
      // Arrange
      const table: TableData = [
        {
          id: 1,
          cells: {
            proceso: { value: 'Proceso 1', error: null },
            actividad: { value: 'Actividad 1', error: null },
            subactividad: { value: 'Subactividad 1', error: null },
            frecuencia: { value: 'InvalidFrequency', error: null },
            personal_involucrado: { value: 'InvalidPersonal', error: null },
            cargo: { value: 'InvalidCargo', error: null },
            area_empresa: { value: 'InvalidArea', error: null },
            peligro: { value: 'Biológico', error: null },
            descripcion_peligro: { value: 'Vírus', error: null },
            descripcion_especifica_peligro: { value: '', error: null },
            consecuencia_efecto_posible: { value: 'Infecciones. Envenenamiento o efectos tóxicos', error: null },
            controles_existentes_fuente: { value: 'Control 1', error: null },
            controles_existentes_medio: { value: 'Control 2', error: null },
            controles_existentes_individuo: { value: 'Control 3', error: null },
            nivel_deficiencia_ND: { value: '6', error: null },
            nivel_exposicion_NE: { value: '3', error: null },
            valor_consecuencia_NC: { value: '25', error: null }
          },
          hasErrors: false,
          isEdited: false
        }
      ] as any;

      // Act
      const results = validateTable(table, mockParsedData);

      // Assert
      expect(results).toHaveLength(1);
      expect(results[0].isValid).toBe(false);

      const catalogErrors = results[0].errors.filter(e => e.errorType === 'catalog_not_found');
      expect(catalogErrors.length).toBeGreaterThan(0);
    });

    it('should detect hierarchy validation errors', () => {
      // Arrange
      const table: TableData = [
        {
          id: 1,
          cells: {
            proceso: { value: '', error: null },
            actividad: { value: '', error: null },
            subactividad: { value: '', error: null },
            frecuencia: { value: 'Rutinaria', error: null },
            personal_involucrado: { value: 'Directo', error: null },
            cargo: { value: 'CEO', error: null },
            area_empresa: { value: 'Administración', error: null },
            peligro: { value: 'Biológico', error: null },
            descripcion_peligro: { value: 'Vírus', error: null },
            descripcion_especifica_peligro: { value: '', error: null },
            consecuencia_efecto_posible: { value: 'Infecciones. Envenenamiento o efectos tóxicos', error: null },
            controles_existentes_fuente: { value: 'Control 1', error: null },
            controles_existentes_medio: { value: 'Control 2', error: null },
            controles_existentes_individuo: { value: 'Control 3', error: null },
            nivel_deficiencia_ND: { value: '6', error: null },
            nivel_exposicion_NE: { value: '3', error: null },
            valor_consecuencia_NC: { value: '25', error: null }
          },
          hasErrors: false,
          isEdited: false
        }
      ] as any;

      // Act
      const results = validateTable(table, mockParsedData);

      // Assert
      expect(results).toHaveLength(1);
      expect(results[0].isValid).toBe(false);

      const hierarchyErrors = results[0].errors.filter(e => e.errorType === 'hierarchy_error');
      expect(hierarchyErrors.length).toBeGreaterThan(0);
    });

    it('should detect invalid hazard type', () => {
      // Arrange
      const table: TableData = [
        {
          id: 1,
          cells: {
            proceso: { value: 'Proceso 1', error: null },
            actividad: { value: 'Actividad 1', error: null },
            subactividad: { value: 'Subactividad 1', error: null },
            frecuencia: { value: 'Rutinaria', error: null },
            personal_involucrado: { value: 'Directo', error: null },
            cargo: { value: 'CEO', error: null },
            area_empresa: { value: 'Administración', error: null },
            peligro: { value: 'InvalidHazardType', error: null },
            descripcion_peligro: { value: 'Vírus', error: null },
            descripcion_especifica_peligro: { value: '', error: null },
            consecuencia_efecto_posible: { value: 'Infecciones', error: null },
            controles_existentes_fuente: { value: 'Control 1', error: null },
            controles_existentes_medio: { value: 'Control 2', error: null },
            controles_existentes_individuo: { value: 'Control 3', error: null },
            nivel_deficiencia_ND: { value: '6', error: null },
            nivel_exposicion_NE: { value: '3', error: null },
            valor_consecuencia_NC: { value: '25', error: null }
          },
          hasErrors: false,
          isEdited: false
        }
      ] as any;

      // Act
      const results = validateTable(table, mockParsedData);

      // Assert
      expect(results).toHaveLength(1);
      expect(results[0].isValid).toBe(false);

      const peligroErrors = results[0].errors.filter(
        e => e.columnName === 'peligro' && e.errorType === 'catalog_not_found'
      );
      expect(peligroErrors.length).toBeGreaterThan(0);
      expect(peligroErrors[0].errorMessage).toContain('no es un tipo de peligro válido');
    });

    it('should detect invalid hazard catalog fields', () => {
      // Arrange
      const table: TableData = [
        {
          id: 1,
          cells: {
            proceso: { value: 'Proceso 1', error: null },
            actividad: { value: 'Actividad 1', error: null },
            subactividad: { value: 'Subactividad 1', error: null },
            frecuencia: { value: 'Rutinaria', error: null },
            personal_involucrado: { value: 'Directo', error: null },
            cargo: { value: 'CEO', error: null },
            area_empresa: { value: 'Administración', error: null },
            peligro: { value: 'Biológico', error: null },
            descripcion_peligro: { value: 'InvalidPeligro', error: null },
            descripcion_especifica_peligro: { value: '', error: null },
            consecuencia_efecto_posible: { value: 'InvalidEffect', error: null },
            controles_existentes_fuente: { value: 'Control 1', error: null },
            controles_existentes_medio: { value: 'Control 2', error: null },
            controles_existentes_individuo: { value: 'Control 3', error: null },
            nivel_deficiencia_ND: { value: '6', error: null },
            nivel_exposicion_NE: { value: '3', error: null },
            valor_consecuencia_NC: { value: '25', error: null }
          },
          hasErrors: false,
          isEdited: false
        }
      ] as any;

      // Act
      const results = validateTable(table, mockParsedData);

      // Assert
      expect(results).toHaveLength(1);
      expect(results[0].isValid).toBe(false);

      const catalogErrors = results[0].errors.filter(
        e => ['descripcion_peligro', 'consecuencia_efecto_posible'].includes(e.columnName)
      );
      expect(catalogErrors.length).toBeGreaterThan(0);
    });

    it('should validate multiple rows', () => {
      // Arrange
      const table: TableData = [
        {
          id: 1,
          cells: {
            proceso: { value: 'Proceso 1', error: null },
            actividad: { value: 'Actividad 1', error: null },
            subactividad: { value: 'Subactividad 1', error: null },
            frecuencia: { value: 'Rutinaria', error: null },
            personal_involucrado: { value: 'Directo', error: null },
            cargo: { value: 'CEO', error: null },
            area_empresa: { value: 'Administración', error: null },
            peligro: { value: 'Biológico', error: null },
            descripcion_peligro: { value: 'Vírus', error: null },
            descripcion_especifica_peligro: { value: '', error: null },
            consecuencia_efecto_posible: { value: 'Infecciones. Envenenamiento o efectos tóxicos', error: null },
            controles_existentes_fuente: { value: 'Control 1', error: null },
            controles_existentes_medio: { value: 'Control 2', error: null },
            controles_existentes_individuo: { value: 'Control 3', error: null },
            nivel_deficiencia_ND: { value: '6', error: null },
            nivel_exposicion_NE: { value: '3', error: null },
            valor_consecuencia_NC: { value: '25', error: null }
          },
          hasErrors: false,
          isEdited: false
        },
        {
          id: 2,
          cells: {
            proceso: { value: '', error: null },
            actividad: { value: '', error: null },
            subactividad: { value: '', error: null },
            frecuencia: { value: 'Rutinaria', error: null },
            personal_involucrado: { value: 'Directo', error: null },
            cargo: { value: 'CEO', error: null },
            area_empresa: { value: 'Administración', error: null },
            peligro: { value: 'Biológico', error: null },
            descripcion_peligro: { value: 'Vírus', error: null },
            descripcion_especifica_peligro: { value: '', error: null },
            consecuencia_efecto_posible: { value: 'Infecciones. Envenenamiento o efectos tóxicos', error: null },
            controles_existentes_fuente: { value: 'Control 1', error: null },
            controles_existentes_medio: { value: 'Control 2', error: null },
            controles_existentes_individuo: { value: 'Control 3', error: null },
            nivel_deficiencia_ND: { value: '6', error: null },
            nivel_exposicion_NE: { value: '3', error: null },
            valor_consecuencia_NC: { value: '25', error: null }
          },
          hasErrors: false,
          isEdited: false
        }
      ] as any;

      // Act
      const results = validateTable(table, mockParsedData);

      // Assert
      expect(results).toHaveLength(2);
      expect(results[0].isValid).toBe(true);
      expect(results[1].isValid).toBe(false);
    });

    it('should handle empty table', () => {
      // Arrange
      const table: TableData = [];

      // Act
      const results = validateTable(table, mockParsedData);

      // Assert
      expect(results).toHaveLength(0);
    });

    it('should validate Físico hazard type correctly', () => {
      // Arrange
      const table: TableData = [
        {
          id: 1,
          cells: {
            proceso: { value: 'Proceso 1', error: null },
            actividad: { value: 'Actividad 1', error: null },
            subactividad: { value: 'Subactividad 1', error: null },
            frecuencia: { value: 'Rutinaria', error: null },
            personal_involucrado: { value: 'Directo', error: null },
            cargo: { value: 'CEO', error: null },
            area_empresa: { value: 'Administración', error: null },
            peligro: { value: 'Físico', error: null },
            descripcion_peligro: { value: 'Ruido', error: null },
            descripcion_especifica_peligro: { value: 'Impacto', error: null },
            consecuencia_efecto_posible: { value: 'Disconfor, Dolor de cabeza, Hipoacucia', error: null },
            controles_existentes_fuente: { value: 'Control 1', error: null },
            controles_existentes_medio: { value: 'Control 2', error: null },
            controles_existentes_individuo: { value: 'Control 3', error: null },
            nivel_deficiencia_ND: { value: '10', error: null },
            nivel_exposicion_NE: { value: '4', error: null },
            valor_consecuencia_NC: { value: '100', error: null }
          },
          hasErrors: false,
          isEdited: false
        }
      ] as any;

      // Act
      const results = validateTable(table, mockParsedData);

      // Assert
      expect(results).toHaveLength(1);
      expect(results[0].isValid).toBe(true);
      expect(results[0].errors).toHaveLength(0);
    });
  });
});
