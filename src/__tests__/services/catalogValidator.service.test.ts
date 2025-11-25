/**
 * Tests for catalogValidator service
 */

import {
  normalizeValue,
  buildCatalogIndex,
  isInValidationList,
  validateHazardRow,
  validateCatalogReference
} from '@/features/data-validation/services/catalogValidator.service';
import type { ParsedExcelData } from '@/features/data-validation/types/excel.types';

describe('catalogValidator.service', () => {
  describe('normalizeValue', () => {
    it('should convert values to lowercase trimmed strings', () => {
      expect(normalizeValue('  HELLO  ')).toBe('hello');
      expect(normalizeValue('World')).toBe('world');
      expect(normalizeValue(123)).toBe('123');
    });

    it('should handle null and undefined', () => {
      expect(normalizeValue(null)).toBe('');
      expect(normalizeValue(undefined)).toBe('');
    });

    it('should normalize unicode characters (NFC)', () => {
      const composed = 'e\u0301'; // e + combining acute accent
      const normalized = normalizeValue(composed);
      expect(normalized).toBe('é');
    });

    it('should handle empty strings', () => {
      expect(normalizeValue('')).toBe('');
      expect(normalizeValue('   ')).toBe('');
    });
  });

  describe('buildCatalogIndex', () => {
    it('should build validation sets from parsed Excel data', () => {
      // Arrange
      const mockData: ParsedExcelData = {
        mainSheet: {
          name: 'Plantilla de Carga',
          headers: [],
          data: []
        },
        validationSheet: {
          name: 'Listas de Validacion',
          headers: ['frecuencia', 'cargo'],
          data: [
            {
              frecuencia: 'Rutinaria',
              cargo: 'CEO',
              personal_involucrado: 'Directo',
              areas_empresa: 'Administración',
              nivel_deficiencia_ND: '6',
              nivel_exposicion_NE: '3',
              valor_consecuencia_NC: '25'
            },
            {
              frecuencia: 'No Rutinaria',
              cargo: 'CMO',
              personal_involucrado: 'Contratistas',
              areas_empresa: 'Producción',
              nivel_deficiencia_ND: '10',
              nivel_exposicion_NE: '4',
              valor_consecuencia_NC: '100'
            }
          ]
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

      // Act
      const index = buildCatalogIndex(mockData);

      // Assert
      expect(index.validationSets.frecuencia).toContain('rutinaria');
      expect(index.validationSets.frecuencia).toContain('no rutinaria');
      expect(index.validationSets.cargo).toContain('ceo');
      expect(index.validationSets.cargo).toContain('cmo');
    });

    it('should handle comma-separated values in validation lists', () => {
      // Arrange
      const mockData: ParsedExcelData = {
        mainSheet: {
          name: 'Plantilla de Carga',
          headers: [],
          data: []
        },
        validationSheet: {
          name: 'Listas de Validacion',
          headers: ['personal_involucrado'],
          data: [
            {
              frecuencia: '',
              cargo: '',
              personal_involucrado: 'Directo, Contratistas, En Misión',
              areas_empresa: '',
              nivel_deficiencia_ND: '',
              nivel_exposicion_NE: '',
              valor_consecuencia_NC: ''
            }
          ]
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

      // Act
      const index = buildCatalogIndex(mockData);

      // Assert
      expect(index.validationSets.personal_involucrado).toContain('directo');
      expect(index.validationSets.personal_involucrado).toContain('contratistas');
      expect(index.validationSets.personal_involucrado).toContain('en misión');
    });

    it('should build hazard row index with normalized values', () => {
      // Arrange
      const mockData: ParsedExcelData = {
        mainSheet: {
          name: 'Plantilla de Carga',
          headers: [],
          data: []
        },
        validationSheet: {
          name: 'Listas de Validacion',
          headers: [],
          data: []
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
          fisico: [],
          quimico: [],
          psicosocial: [],
          biomecanico: [],
          condiciones_seguridad: [],
          fenomenos_naturales: []
        }
      };

      // Act
      const index = buildCatalogIndex(mockData);

      // Assert
      expect(index.hazardRows.biologico).toHaveLength(1);
      expect(index.hazardRows.biologico[0]).toEqual({
        descripcion_peligro: 'vírus',
        descripcion_especifica_peligro: '',
        consecuencia_efecto_posible: 'infecciones. envenenamiento o efectos tóxicos'
      });
    });

    it('should handle empty validation sheet', () => {
      // Arrange
      const mockData: ParsedExcelData = {
        mainSheet: {
          name: 'Plantilla de Carga',
          headers: [],
          data: []
        },
        validationSheet: {
          name: 'Listas de Validacion',
          headers: [],
          data: []
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

      // Act
      const index = buildCatalogIndex(mockData);

      // Assert
      expect(index.validationSets).toBeDefined();
      expect(Object.keys(index.validationSets).length).toBeGreaterThan(0);
    });
  });

  describe('isInValidationList', () => {
    let index: any;

    beforeEach(() => {
      const mockData: ParsedExcelData = {
        mainSheet: {
          name: 'Plantilla de Carga',
          headers: [],
          data: []
        },
        validationSheet: {
          name: 'Listas de Validacion',
          headers: ['frecuencia', 'cargo'],
          data: [
            {
              frecuencia: 'Rutinaria, No Rutinaria',
              cargo: 'CEO, CMO, CTO',
              personal_involucrado: '',
              areas_empresa: '',
              nivel_deficiencia_ND: '',
              nivel_exposicion_NE: '',
              valor_consecuencia_NC: ''
            }
          ]
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

      index = buildCatalogIndex(mockData);
    });

    it('should return true for valid single value', () => {
      expect(isInValidationList(index, 'frecuencia', 'Rutinaria')).toBe(true);
      expect(isInValidationList(index, 'cargo', 'CEO')).toBe(true);
    });

    it('should return true for valid comma-separated values', () => {
      expect(isInValidationList(index, 'cargo', 'CEO, CMO')).toBe(true);
    });

    it('should return false for invalid value', () => {
      expect(isInValidationList(index, 'frecuencia', 'Invalid')).toBe(false);
      expect(isInValidationList(index, 'cargo', 'Invalid Role')).toBe(false);
    });

    it('should be case-insensitive', () => {
      expect(isInValidationList(index, 'frecuencia', 'RUTINARIA')).toBe(true);
      expect(isInValidationList(index, 'cargo', 'ceo')).toBe(true);
    });

    it('should handle empty values', () => {
      expect(isInValidationList(index, 'frecuencia', '')).toBe(false);
      expect(isInValidationList(index, 'frecuencia', null)).toBe(false);
      expect(isInValidationList(index, 'frecuencia', undefined)).toBe(false);
    });

    it('should return false for non-existent field', () => {
      expect(isInValidationList(index, 'nonexistent', 'value')).toBe(false);
    });
  });

  describe('validateHazardRow', () => {
    let index: any;

    beforeEach(() => {
      const mockData: ParsedExcelData = {
        mainSheet: {
          name: 'Plantilla de Carga',
          headers: [],
          data: []
        },
        validationSheet: {
          name: 'Listas de Validacion',
          headers: [],
          data: []
        },
        hazardCatalog: {
          biologico: [
            {
              peligro: 'Biológico',
              descripcion_peligro: 'Vírus',
              descripcion_especifica_peligro: '',
              consecuencia_efecto_posible: 'Infecciones. Envenenamiento o efectos tóxicos'
            },
            {
              peligro: 'Biológico',
              descripcion_peligro: 'Ricketsias',
              descripcion_especifica_peligro: 'Rayos alfa',
              consecuencia_efecto_posible: 'Lesiones vasculíticas cutáneas'
            }
          ],
          fisico: [],
          quimico: [],
          psicosocial: [],
          biomecanico: [],
          condiciones_seguridad: [],
          fenomenos_naturales: []
        }
      };

      index = buildCatalogIndex(mockData);
    });

    it('should validate correct hazard row', () => {
      // Act
      const result = validateHazardRow(index, 'biologico', {
        descripcion_peligro: 'Vírus',
        descripcion_especifica_peligro: '',
        consecuencia_efecto_posible: 'Infecciones. Envenenamiento o efectos tóxicos'
      });

      // Assert
      expect(result.valid).toBe(true);
      expect(result.invalidFields).toEqual([]);
    });

    it('should reject invalid descripcion_peligro', () => {
      // Act
      const result = validateHazardRow(index, 'biologico', {
        descripcion_peligro: 'Invalid Danger',
        descripcion_especifica_peligro: '',
        consecuencia_efecto_posible: 'Some effect'
      });

      // Assert
      expect(result.valid).toBe(false);
      expect(result.invalidFields).toContain('descripcion_peligro');
      expect(result.message).toContain('no existe en el catálogo');
    });

    it('should reject invalid descripcion_especifica_peligro', () => {
      // Act
      const result = validateHazardRow(index, 'biologico', {
        descripcion_peligro: 'Ricketsias',
        descripcion_especifica_peligro: 'Invalid Specific',
        consecuencia_efecto_posible: 'Lesiones vasculíticas cutáneas'
      });

      // Assert
      expect(result.valid).toBe(false);
      expect(result.invalidFields).toContain('descripcion_especifica_peligro');
    });

    it('should reject invalid consecuencia_efecto_posible', () => {
      // Act
      const result = validateHazardRow(index, 'biologico', {
        descripcion_peligro: 'Vírus',
        descripcion_especifica_peligro: '',
        consecuencia_efecto_posible: 'Invalid Effect'
      });

      // Assert
      expect(result.valid).toBe(false);
      expect(result.invalidFields).toContain('consecuencia_efecto_posible');
    });

    it('should reject non-existent catalog', () => {
      // Act
      const result = validateHazardRow(index, 'nonexistent', {
        descripcion_peligro: 'Some danger',
        descripcion_especifica_peligro: '',
        consecuencia_efecto_posible: 'Some effect'
      });

      // Assert
      expect(result.valid).toBe(false);
      expect(result.invalidFields).toContain('peligro');
      expect(result.message).toContain('Catálogo "nonexistent" no encontrado');
    });

    it('should be case-insensitive', () => {
      // Act
      const result = validateHazardRow(index, 'biologico', {
        descripcion_peligro: 'VÍRUS',
        descripcion_especifica_peligro: '',
        consecuencia_efecto_posible: 'INFECCIONES. ENVENENAMIENTO O EFECTOS TÓXICOS'
      });

      // Assert
      expect(result.valid).toBe(true);
    });
  });

  describe('validateCatalogReference', () => {
    let index: any;

    beforeEach(() => {
      const mockData: ParsedExcelData = {
        mainSheet: {
          name: 'Plantilla de Carga',
          headers: [],
          data: []
        },
        validationSheet: {
          name: 'Listas de Validacion',
          headers: ['frecuencia'],
          data: [
            {
              frecuencia: 'Rutinaria, No Rutinaria',
              cargo: '',
              personal_involucrado: '',
              areas_empresa: '',
              nivel_deficiencia_ND: '',
              nivel_exposicion_NE: '',
              valor_consecuencia_NC: ''
            }
          ]
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

      index = buildCatalogIndex(mockData);
    });

    it('should return valid for correct validation list value', () => {
      // Act
      const result = validateCatalogReference(index, {
        fieldType: 'validationList',
        key: 'frecuencia',
        value: 'Rutinaria'
      });

      // Assert
      expect(result.valid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should return invalid for incorrect validation list value', () => {
      // Act
      const result = validateCatalogReference(index, {
        fieldType: 'validationList',
        key: 'frecuencia',
        value: 'Invalid'
      });

      // Assert
      expect(result.valid).toBe(false);
      expect(result.message).toContain('no está en lista de validación');
    });
  });
});
