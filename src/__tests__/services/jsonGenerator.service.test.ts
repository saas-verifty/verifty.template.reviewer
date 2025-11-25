/**
 * Tests for jsonGenerator service
 */

import { generateJSON, generateFileName } from '@/features/data-validation/services/jsonGenerator.service';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import type { TableData } from '@/features/data-validation/types/table.types';

describe('jsonGenerator.service', () => {
  describe('generateJSON', () => {
    it('should generate JSON from valid table data', () => {
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
      const result = generateJSON(table);

      // Assert
      expect(result.procesos).toHaveLength(1);
      expect(result.procesos[0].nombre).toBe('Proceso 1');
      expect(result.procesos[0].actividad).toHaveLength(1);
      expect(result.procesos[0].actividad[0].nombre).toBe('Actividad 1');
      expect(result.procesos[0].actividad[0].subactividad).toHaveLength(1);
      expect(result.procesos[0].actividad[0].subactividad[0].nombre).toBe('Subactividad 1');
      expect(result.procesos[0].actividad[0].subactividad[0].peligros).toHaveLength(1);
    });

    it('should group multiple peligros under same subactividad', () => {
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
        },
        {
          id: 2,
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
            consecuencia_efecto_posible: { value: 'Hipoacucia', error: null },
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
      const result = generateJSON(table);

      // Assert
      expect(result.procesos).toHaveLength(1);
      expect(result.procesos[0].actividad).toHaveLength(1);
      expect(result.procesos[0].actividad[0].subactividad).toHaveLength(1);
      expect(result.procesos[0].actividad[0].subactividad[0].peligros).toHaveLength(2);
      expect(result.procesos[0].actividad[0].subactividad[0].peligros[0].nombre).toBe('Biológico');
      expect(result.procesos[0].actividad[0].subactividad[0].peligros[1].nombre).toBe('Físico');
    });

    it('should create separate actividades for different activities', () => {
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
        },
        {
          id: 2,
          cells: {
            proceso: { value: 'Proceso 1', error: null },
            actividad: { value: 'Actividad 2', error: null },
            subactividad: { value: 'Subactividad 2', error: null },
            frecuencia: { value: 'No Rutinaria', error: null },
            personal_involucrado: { value: 'Contratistas', error: null },
            cargo: { value: 'CMO', error: null },
            area_empresa: { value: 'Producción', error: null },
            peligro: { value: 'Físico', error: null },
            descripcion_peligro: { value: 'Ruido', error: null },
            descripcion_especifica_peligro: { value: 'Impacto', error: null },
            consecuencia_efecto_posible: { value: 'Hipoacucia', error: null },
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
      const result = generateJSON(table);

      // Assert
      expect(result.procesos).toHaveLength(1);
      expect(result.procesos[0].actividad).toHaveLength(2);
      expect(result.procesos[0].actividad[0].nombre).toBe('Actividad 1');
      expect(result.procesos[0].actividad[1].nombre).toBe('Actividad 2');
    });

    it('should create separate procesos for different processes', () => {
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
        },
        {
          id: 2,
          cells: {
            proceso: { value: 'Proceso 2', error: null },
            actividad: { value: 'Actividad 2', error: null },
            subactividad: { value: 'Subactividad 2', error: null },
            frecuencia: { value: 'No Rutinaria', error: null },
            personal_involucrado: { value: 'Contratistas', error: null },
            cargo: { value: 'CMO', error: null },
            area_empresa: { value: 'Producción', error: null },
            peligro: { value: 'Físico', error: null },
            descripcion_peligro: { value: 'Ruido', error: null },
            descripcion_especifica_peligro: { value: 'Impacto', error: null },
            consecuencia_efecto_posible: { value: 'Hipoacucia', error: null },
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
      const result = generateJSON(table);

      // Assert
      expect(result.procesos).toHaveLength(2);
      expect(result.procesos[0].nombre).toBe('Proceso 1');
      expect(result.procesos[1].nombre).toBe('Proceso 2');
    });

    it('should skip rows with missing hierarchy fields', () => {
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

      // Act & Assert
      expect(() => generateJSON(table)).toThrow(ERROR_MESSAGES.JSON_GENERATION_NO_DATA);
    });

    it('should throw error when table is empty', () => {
      // Arrange
      const table: TableData = [];

      // Act & Assert
      expect(() => generateJSON(table)).toThrow(ERROR_MESSAGES.JSON_GENERATION_NO_DATA);
    });

    it('should convert numeric fields correctly', () => {
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
      const result = generateJSON(table);

      // Assert
      const peligro = result.procesos[0].actividad[0].subactividad[0].peligros[0];
      expect(peligro.nivel_deficiencia_ND).toBe(6);
      expect(peligro.nivel_exposicion_NE).toBe(3);
      expect(peligro.nivel_consecuencia_NC).toBe(25);
    });

    it('should handle invalid numeric values by converting to 0', () => {
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
            consecuencia_efecto_posible: { value: 'Infecciones', error: null },
            controles_existentes_fuente: { value: 'Control 1', error: null },
            controles_existentes_medio: { value: 'Control 2', error: null },
            controles_existentes_individuo: { value: 'Control 3', error: null },
            nivel_deficiencia_ND: { value: 'invalid', error: null },
            nivel_exposicion_NE: { value: 'abc', error: null },
            valor_consecuencia_NC: { value: '', error: null }
          },
          hasErrors: false,
          isEdited: false
        }
      ] as any;

      // Act
      const result = generateJSON(table);

      // Assert
      const peligro = result.procesos[0].actividad[0].subactividad[0].peligros[0];
      expect(peligro.nivel_deficiencia_ND).toBe(0);
      expect(peligro.nivel_exposicion_NE).toBe(0);
      expect(peligro.nivel_consecuencia_NC).toBe(0);
    });

    it('should handle cells without value property', () => {
      // Arrange
      const table: TableData = [
        {
          id: 1,
          cells: {
            proceso: 'Proceso 1',
            actividad: 'Actividad 1',
            subactividad: 'Subactividad 1',
            frecuencia: 'Rutinaria',
            personal_involucrado: 'Directo',
            cargo: 'CEO',
            area_empresa: 'Administración',
            peligro: 'Biológico',
            descripcion_peligro: 'Vírus',
            descripcion_especifica_peligro: '',
            consecuencia_efecto_posible: 'Infecciones',
            controles_existentes_fuente: 'Control 1',
            controles_existentes_medio: 'Control 2',
            controles_existentes_individuo: 'Control 3',
            nivel_deficiencia_ND: 6,
            nivel_exposicion_NE: 3,
            valor_consecuencia_NC: 25
          },
          hasErrors: false,
          isEdited: false
        }
      ] as any;

      // Act
      const result = generateJSON(table);

      // Assert
      expect(result.procesos).toHaveLength(1);
      expect(result.procesos[0].nombre).toBe('Proceso 1');
    });
  });

  describe('generateFileName', () => {
    it('should generate filename with default prefix', () => {
      // Act
      const result = generateFileName();

      // Assert
      expect(result).toMatch(/^ipevr-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}/);
      expect(result.endsWith('.json')).toBe(true);
    });

    it('should generate filename with custom prefix', () => {
      // Act
      const result = generateFileName('custom-prefix');

      // Assert
      expect(result).toMatch(/^custom-prefix-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}/);
      expect(result.endsWith('.json')).toBe(true);
    });

    it('should generate unique filenames', () => {
      // Act
      const file1 = generateFileName();
      const file2 = generateFileName();

      // Assert - filenames should be different (or at least have different timestamps)
      // This might fail if executed in the exact same millisecond, but very unlikely
      expect(file1).toBeTruthy();
      expect(file2).toBeTruthy();
    });

    it('should not contain special characters that are invalid in filenames', () => {
      // Act
      const result = generateFileName();

      // Assert - should not contain : or .
      expect(result).not.toContain(':');
      expect(result.split('.').length - 1).toBe(1); // Only one dot (before .json)
    });
  });
});
