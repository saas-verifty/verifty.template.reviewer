/**
 * Tests for parseExcelFile service
 */

import { parseExcelFile } from '@/features/data-validation/services/parseExcelFile.service';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { SHEET_NAMES } from '@/features/data-validation/constants/validationRules';
import { createValidExcelFile } from '../mocks/xlsxMock';
import * as XLSX from 'xlsx';

// Mock xlsx library
jest.mock('xlsx');

describe('parseExcelFile.service', () => {
  const mockFileReader = {
    readAsArrayBuffer: jest.fn(),
    onload: null as any,
    onerror: null as any,
    result: null as any
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock FileReader
    global.FileReader = jest.fn(() => mockFileReader) as any;

    // Default mock for XLSX.read
    (XLSX.read as jest.Mock).mockReturnValue({
      SheetNames: [
        SHEET_NAMES.MAIN,
        SHEET_NAMES.VALIDATION,
        SHEET_NAMES.HAZARDS.BIOLOGICO,
        SHEET_NAMES.HAZARDS.FISICO,
        SHEET_NAMES.HAZARDS.QUIMICO,
        SHEET_NAMES.HAZARDS.PSICOSOCIAL,
        SHEET_NAMES.HAZARDS.BIOMECANICO,
        SHEET_NAMES.HAZARDS.CONDICIONES_SEGURIDAD,
        SHEET_NAMES.HAZARDS.FENOMENOS_NATURALES
      ],
      Sheets: {
        [SHEET_NAMES.MAIN]: {},
        [SHEET_NAMES.VALIDATION]: {},
        [SHEET_NAMES.HAZARDS.BIOLOGICO]: {},
        [SHEET_NAMES.HAZARDS.FISICO]: {},
        [SHEET_NAMES.HAZARDS.QUIMICO]: {},
        [SHEET_NAMES.HAZARDS.PSICOSOCIAL]: {},
        [SHEET_NAMES.HAZARDS.BIOMECANICO]: {},
        [SHEET_NAMES.HAZARDS.CONDICIONES_SEGURIDAD]: {},
        [SHEET_NAMES.HAZARDS.FENOMENOS_NATURALES]: {}
      }
    });

    // Default mock for XLSX.utils.sheet_to_json
    (XLSX.utils.sheet_to_json as jest.Mock).mockReturnValue([]);
  });

  describe('Successful parsing', () => {
    it('should parse a valid Excel file with all required sheets', async () => {
      // Arrange
      const file = createValidExcelFile();
      const mockMainData = [
        {
          proceso: 'Proceso 1',
          actividad: 'Actividad 1',
          subactividad: 'Subactividad 1'
        }
      ];

      (XLSX.utils.sheet_to_json as jest.Mock)
        .mockReturnValueOnce(mockMainData) // mainSheet data
        .mockReturnValueOnce([{ frecuencia: 'Rutinaria' }]) // validationSheet data
        .mockReturnValue([]); // hazard catalogs

      // Simulate successful file read
      const parsePromise = parseExcelFile(file);
      mockFileReader.onload({ target: { result: new ArrayBuffer(8) } });

      // Act
      const result = await parsePromise;

      // Assert
      expect(result).toHaveProperty('mainSheet');
      expect(result).toHaveProperty('validationSheet');
      expect(result).toHaveProperty('hazardCatalog');
      expect(result.mainSheet.data).toEqual(mockMainData);
      expect(result.mainSheet.headers).toEqual(['proceso', 'actividad', 'subactividad']);
    });

    it('should correctly parse all hazard catalog sheets', async () => {
      // Arrange
      const file = createValidExcelFile();
      const mockHazardData = [
        {
          tipo_peligro: 'Biológico',
          descripcion_peligro: 'Virus',
          descripcion_especifica_peligro: '',
          efectos_posibles: 'Infecciones'
        }
      ];

      (XLSX.utils.sheet_to_json as jest.Mock)
        .mockReturnValueOnce([]) // mainSheet
        .mockReturnValueOnce([]) // validationSheet
        .mockReturnValue(mockHazardData); // all hazard catalogs

      // Simulate successful file read
      const parsePromise = parseExcelFile(file);
      mockFileReader.onload({ target: { result: new ArrayBuffer(8) } });

      // Act
      const result = await parsePromise;

      // Assert
      expect(result.hazardCatalog).toHaveProperty('biologico');
      expect(result.hazardCatalog).toHaveProperty('fisico');
      expect(result.hazardCatalog).toHaveProperty('quimico');
      expect(result.hazardCatalog.biologico).toEqual(mockHazardData);
    });

    it('should handle empty sheets without errors', async () => {
      // Arrange
      const file = createValidExcelFile();

      (XLSX.utils.sheet_to_json as jest.Mock).mockReturnValue([]);

      // Simulate successful file read
      const parsePromise = parseExcelFile(file);
      mockFileReader.onload({ target: { result: new ArrayBuffer(8) } });

      // Act
      const result = await parsePromise;

      // Assert
      expect(result.mainSheet.data).toEqual([]);
      expect(result.mainSheet.headers).toEqual([]);
      expect(result.validationSheet.data).toEqual([]);
    });
  });

  describe('Error handling', () => {
    it('should throw error if main sheet is missing', async () => {
      // Arrange
      const file = createValidExcelFile();

      (XLSX.read as jest.Mock).mockReturnValue({
        SheetNames: [SHEET_NAMES.VALIDATION], // Missing main sheet
        Sheets: {}
      });

      // Simulate successful file read
      const parsePromise = parseExcelFile(file);
      mockFileReader.onload({ target: { result: new ArrayBuffer(8) } });

      // Act & Assert
      await expect(parsePromise).rejects.toThrow(
        ERROR_MESSAGES.EXCEL_PARSE_ERROR(
          ERROR_MESSAGES.SHEET_NOT_FOUND(SHEET_NAMES.MAIN)
        )
      );
    });

    it('should throw error if validation sheet is missing', async () => {
      // Arrange
      const file = createValidExcelFile();

      (XLSX.read as jest.Mock).mockReturnValue({
        SheetNames: [SHEET_NAMES.MAIN], // Missing validation sheet
        Sheets: {}
      });

      // Simulate successful file read
      const parsePromise = parseExcelFile(file);
      mockFileReader.onload({ target: { result: new ArrayBuffer(8) } });

      // Act & Assert
      await expect(parsePromise).rejects.toThrow(
        ERROR_MESSAGES.EXCEL_PARSE_ERROR(
          ERROR_MESSAGES.SHEET_NOT_FOUND(SHEET_NAMES.VALIDATION)
        )
      );
    });

    it('should throw error if hazard catalog sheet is missing', async () => {
      // Arrange
      const file = createValidExcelFile();

      (XLSX.read as jest.Mock).mockReturnValue({
        SheetNames: [SHEET_NAMES.MAIN, SHEET_NAMES.VALIDATION], // Missing hazard catalogs
        Sheets: {}
      });

      // Simulate successful file read
      const parsePromise = parseExcelFile(file);
      mockFileReader.onload({ target: { result: new ArrayBuffer(8) } });

      // Act & Assert
      await expect(parsePromise).rejects.toThrow(
        ERROR_MESSAGES.EXCEL_PARSE_ERROR(
          ERROR_MESSAGES.SHEET_NOT_FOUND(SHEET_NAMES.HAZARDS.BIOLOGICO)
        )
      );
    });

    it('should throw error if file read fails', async () => {
      // Arrange
      const file = createValidExcelFile();

      // Simulate file read error
      const parsePromise = parseExcelFile(file);
      mockFileReader.onerror();

      // Act & Assert
      await expect(parsePromise).rejects.toThrow(
        ERROR_MESSAGES.EXCEL_PARSE_ERROR(ERROR_MESSAGES.FILE_READ_ERROR)
      );
    });

    it('should throw error if FileReader result is not ArrayBuffer', async () => {
      // Arrange
      const file = createValidExcelFile();

      // Simulate invalid result
      const parsePromise = parseExcelFile(file);
      mockFileReader.onload({ target: { result: 'invalid-string-result' } });

      // Act & Assert
      await expect(parsePromise).rejects.toThrow(
        ERROR_MESSAGES.EXCEL_PARSE_ERROR(ERROR_MESSAGES.ARRAY_BUFFER_READ_FAILED)
      );
    });

    it('should wrap unknown errors with EXCEL_PARSE_UNKNOWN_ERROR', async () => {
      // Arrange
      const file = createValidExcelFile();

      (XLSX.read as jest.Mock).mockImplementation(() => {
        throw 'String error'; // Non-Error throw
      });

      // Simulate successful file read
      const parsePromise = parseExcelFile(file);
      mockFileReader.onload({ target: { result: new ArrayBuffer(8) } });

      // Act & Assert
      await expect(parsePromise).rejects.toThrow(
        ERROR_MESSAGES.EXCEL_PARSE_UNKNOWN_ERROR
      );
    });
  });

  describe('Data structure', () => {
    it('should preserve sheet names in returned data', async () => {
      // Arrange
      const file = createValidExcelFile();

      (XLSX.utils.sheet_to_json as jest.Mock).mockReturnValue([]);

      // Simulate successful file read
      const parsePromise = parseExcelFile(file);
      mockFileReader.onload({ target: { result: new ArrayBuffer(8) } });

      // Act
      const result = await parsePromise;

      // Assert
      expect(result.mainSheet.name).toBe(SHEET_NAMES.MAIN);
      expect(result.validationSheet.name).toBe(SHEET_NAMES.VALIDATION);
    });

    it('should extract headers from first row of data', async () => {
      // Arrange
      const file = createValidExcelFile();
      const mockData = [
        {
          proceso: 'Proceso 1',
          actividad: 'Actividad 1',
          subactividad: 'Subactividad 1',
          peligro: 'Biológico'
        }
      ];

      (XLSX.utils.sheet_to_json as jest.Mock)
        .mockReturnValueOnce(mockData)
        .mockReturnValue([]);

      // Simulate successful file read
      const parsePromise = parseExcelFile(file);
      mockFileReader.onload({ target: { result: new ArrayBuffer(8) } });

      // Act
      const result = await parsePromise;

      // Assert
      expect(result.mainSheet.headers).toEqual([
        'proceso',
        'actividad',
        'subactividad',
        'peligro'
      ]);
    });
  });
});
