/**
 * Mock for xlsx library based on real Excel data structure
 */

export const createMockWorkbook = (sheets: Record<string, any[]>) => {
  const workbook: any = {
    SheetNames: Object.keys(sheets),
    Sheets: {},
  }

  Object.entries(sheets).forEach(([sheetName, data]) => {
    workbook.Sheets[sheetName] = createMockSheet(data)
  })

  return workbook
}

const createMockSheet = (data: any[]) => {
  // Simple mock - real implementation would include cell references
  return { __data: data }
}

/**
 * Mock for XLSX.read
 */
export const mockXLSXRead = jest.fn(() => {
  // Default: return a valid workbook
  return createMockWorkbook({
    'Plantilla de Carga': [],
    'Listas de Validacion': [],
    Biológico: [],
    Físico: [],
    Químico: [],
    Psicosocial: [],
    Biomecánico: [],
    'Condiciones de Seguridad': [],
    'Fenómenos naturales': [],
  })
})

/**
 * Mock for XLSX.utils.sheet_to_json
 */
export const mockSheetToJson = jest.fn((sheet: any) => {
  return sheet.__data || []
})

/**
 * Complete XLSX mock
 */
export const createXLSXMock = () => ({
  read: mockXLSXRead,
  utils: {
    sheet_to_json: mockSheetToJson,
  },
})

/**
 * Helper to create a valid Excel file mock
 */
export const createValidExcelFile = (fileName = 'test.xlsx'): File => {
  const mockData = new ArrayBuffer(8)
  return new File([mockData], fileName, {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

/**
 * Helper to create an invalid file mock
 */
export const createInvalidFile = (fileName = 'test.pdf'): File => {
  const mockData = new ArrayBuffer(8)
  return new File([mockData], fileName, {
    type: 'application/pdf',
  })
}

/**
 * Helper to create a file that exceeds size limit
 */
export const createOversizedFile = (sizeInMB = 10): File => {
  const mockData = new ArrayBuffer(sizeInMB * 1024 * 1024)
  return new File([mockData], 'large.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}
