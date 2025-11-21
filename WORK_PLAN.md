# WORK PLAN - IPEVR Bulk Upload

## Implementation Order

This document details the recommended implementation order, files to create, and important tips for each task.

---

## TASK 1: Excel Upload Component

**Objective:** Allow users to upload an Excel file and parse it.

### Files to Create

1. **`src/types/excel.types.ts`**
   - Define types for Excel sheets
   - Types for parsed data
   - Types for row/column structure

2. **`src/components/FileUploader.tsx`**
   - Drag & drop or button selection component
   - Validate file type (.xlsx, .xls)
   - Validate maximum size (use `VITE_MAX_FILE_SIZE_MB`)
   - Display selected file name

3. **`src/services/excelParser.service.ts`**
   - Main function: `parseExcelFile(file: File): Promise<ParsedExcelData>`
   - Use SheetJS (xlsx) to read file
   - Extract all Excel sheets
   - Separate main sheet from catalog sheets
   - Convert data to structured format

4. **`src/hooks/useFileUpload.ts`**
   - Custom hook to manage upload state
   - States: idle, loading, success, error
   - Handle parsing errors

5. **`src/pages/UploadPage.tsx`**
   - Main upload page
   - Integrate FileUploader
   - Show user feedback

### Dependencies Between Subtasks

```
1. types/excel.types.ts (first)
   ↓
2. services/excelParser.service.ts
   ↓
3. hooks/useFileUpload.ts
   ↓
4. components/FileUploader.tsx
   ↓
5. pages/UploadPage.tsx (last)
```

### Technical Tips

- **SheetJS:** Use `XLSX.read()` with option `type: 'binary'` or `'array'`
- **File validation:** Check extension before parsing
- **Error handling:** Catch parsing exceptions and show clear messages
- **Performance:** For large files, consider using Web Workers (optional, advanced phase)
- **Global state:** Consider using Context API or Zustand to share parsed data

### Example Parsed Data Structure

```typescript
interface ParsedExcelData {
  mainSheet: {
    name: string
    data: RowData[]
    headers: string[]
  }
  catalogSheets: {
    [sheetName: string]: CatalogData[]
  }
}
```

---

## TASK 2: Display and Edit Table

**Objective:** Display data in an editable table with horizontal/vertical scrolling.

### Files to Create

1. **`src/types/table.types.ts`**
   - Types for table data
   - Types for editable cells
   - Types for edit state

2. **`src/components/DataTable/DataTable.tsx`**
   - Main table component
   - Render headers
   - Render rows with data
   - Horizontal and vertical scrolling
   - Styling with Tailwind

3. **`src/components/DataTable/EditableCell.tsx`**
   - Individual editable cell
   - Modes: view/edit
   - Apply error styles (`bg-error-cell`)
   - Validate on blur or Enter key
   - Emit changes to parent component

4. **`src/components/DataTable/TableRow.tsx`**
   - Row component
   - Apply error style to entire row (`bg-error-row`)
   - Render multiple EditableCell components

5. **`src/hooks/useTableData.ts`**
   - Hook to manage table data state
   - Update individual cells
   - Keep track of changes

6. **`src/pages/UploadPage.tsx`**
   - Page containing DataTable
   - Action buttons: "Validate", "Submit", "Cancel"
   - Validation progress indicator

### Dependencies Between Subtasks

```
1. types/table.types.ts (first)
   ↓
2. components/DataTable/EditableCell.tsx
   ↓
3. components/DataTable/TableRow.tsx
   ↓
4. hooks/useTableData.ts
   ↓
5. components/DataTable/DataTable.tsx
   ↓
6. pages/ValidationPage.tsx (last)
```

### Technical Tips

- **Virtualization:** For large tables (>1000 rows), consider using `react-virtual` or `react-window`
- **Inline editing:** Use `contentEditable` or controlled inputs
- **Optimization:** Use `memo()` in EditableCell to avoid unnecessary re-renders
- **Sticky scroll:** Fixed headers when scrolling vertically
- **Resizable columns:** Optional, use libraries like `react-resizable`
- **Accessibility:** Add `role="grid"`, keyboard navigation

### Example Cell Structure

```typescript
interface CellData {
  value: string | number | boolean | null
  originalValue: string | number | boolean | null
  isEdited: boolean
  hasError: boolean
  errorMessage?: string
  columnName: string
  rowIndex: number
}
```

---

## TASK 3: Frontend Validation System

**Objective:** Validate data against business rules and mark errors visually.

### Files to Create

1. **`src/types/validation.types.ts`**
   - Types for validation rules
   - Types for validation results
   - Types for errors

2. **`src/constants/validationRules.ts`**
   - Define required fields
   - Define expected data types
   - Define allowed enums
   - Define hierarchical relationships

3. **`src/services/validation.service.ts`**
   - Function: `validateRow(row: RowData, catalogData: CatalogData): ValidationResult`
   - Function: `validateRequiredFields(row: RowData): FieldError[]`
   - Function: `validateDataTypes(row: RowData): FieldError[]`
   - Function: `validateEnums(row: RowData): FieldError[]`
   - Function: `validateCatalogIds(row: RowData, catalogs: CatalogData): FieldError[]`
   - Function: `validateHierarchy(row: RowData, allRows: RowData[]): FieldError[]`

4. **`src/services/catalogValidator.service.ts`**
   - Validate that IDs exist in catalog sheets
   - Validate relationships between entities
   - Cache catalogs for performance

5. **`src/hooks/useValidation.ts`**
   - Hook to execute validations
   - Manage validation state (in progress, completed)
   - Return errors grouped by row/cell

6. **`src/utils/errorFormatter.ts`**
   - Format readable error messages
   - Internationalization (English)

### Dependencies Between Subtasks

```
1. types/validation.types.ts (first)
   ↓
2. constants/validationRules.ts
   ↓
3. utils/errorFormatter.ts
   ↓
4. services/catalogValidator.service.ts
   ↓
5. services/validation.service.ts
   ↓
6. hooks/useValidation.ts (last)
```

### Technical Tips

- **Incremental validation:** Validate only edited rows to improve performance
- **Web Workers:** Consider moving heavy validation to Web Worker
- **Zod schemas:** Define validation schemas with Zod for reuse
- **Cache:** Cache catalog validation results
- **Error priority:** Validate required fields first, then types, then relationships
- **Batch validation:** Validate in batches of 100 rows at a time

### Example Validation Rules

```typescript
const VALIDATION_RULES = {
  requiredFields: ['proceso_id', 'actividad_id', 'nombre'],
  fieldTypes: {
    proceso_id: 'number',
    nombre: 'string',
    es_activo: 'boolean',
  },
  enums: {
    tipo_riesgo: ['ALTO', 'MEDIO', 'BAJO'],
  },
  hierarchy: {
    actividad_id: { parent: 'proceso_id' },
    subactividad_id: { parent: 'actividad_id' },
    peligro_id: { parent: 'subactividad_id' },
  },
}
```

---

## TASK 4: Confirmation and Submit Interface

**Objective:** Show validation summary and allow submission confirmation.

### Files to Create

1. **`src/components/ValidationSummary.tsx`**
   - Show total rows
   - Show number of errors
   - List most common error types
   - Button to export error report (optional)

2. **`src/components/ConfirmationModal.tsx`**
   - Confirmation modal before submission
   - Show final summary
   - Buttons: "Confirm" and "Cancel"
   - Create custom modal with Tailwind

3. **`src/components/ProgressIndicator.tsx`**
   - Progress indicator during submission
   - States: validating, generating JSON, uploading to S3
   - Loading animation
   - Status messages

4. **`src/hooks/useConfirmation.ts`**
   - Hook to manage confirmation state
   - Control modal open/close
   - Callback for confirmation

### Dependencies Between Subtasks

```
1. components/ProgressIndicator.tsx (independent)
   ↓
2. components/ValidationSummary.tsx
   ↓
3. hooks/useConfirmation.ts
   ↓
4. components/ConfirmationModal.tsx (last)
```

### Technical Tips

- **Custom modal:** Use portal with `createPortal` from React
- **Confirmation state:** Use Context or local state
- **Animations:** Use Tailwind transitions
- **Accessibility:** Modal must have focus trap and close with Escape (use `useEffect` for listener)
- **Visual feedback:** Create SVG icons or use Unicode symbols (✓, ✗, ⚠️)

### Example Summary

```typescript
interface ValidationSummary {
  totalRows: number
  validRows: number
  errorRows: number
  errorsByType: {
    requiredFields: number
    invalidType: number
    catalogNotFound: number
    hierarchyError: number
  }
}
```

---

## TASK 5: JSON Generation and S3 Upload

**Objective:** Generate final JSON and upload it to AWS S3.

### Files to Create

1. **`src/types/json-output.types.ts`**
   - Types for final JSON structure
   - Types for metadata

2. **`src/services/jsonGenerator.service.ts`**
   - Function: `generateJSON(validatedData: ValidatedData): IPEVRJson`
   - Transform table data to expected JSON format
   - Include metadata (date, user, version)
   - Validate final structure

3. **`src/services/s3Upload.service.ts`**
   - Configure S3 client with AWS SDK
   - Function: `uploadToS3(jsonData: string, fileName: string): Promise<S3UploadResult>`
   - Handle connection errors
   - Generate unique filename (timestamp)

4. **`src/config/aws.config.ts`**
   - Read environment variables
   - Configure AWS credentials
   - Export S3 configuration

5. **`src/hooks/useS3Upload.ts`**
   - Hook to manage S3 upload
   - States: idle, uploading, success, error
   - Return uploaded file URL

### Dependencies Between Subtasks

```
1. types/json-output.types.ts (first)
   ↓
2. config/aws.config.ts
   ↓
3. services/jsonGenerator.service.ts
   ↓
4. services/s3Upload.service.ts
   ↓
5. hooks/useS3Upload.ts (last)
```

### Technical Tips

- **AWS SDK v3:** Use modular imports to reduce bundle size
- **Security:** NEVER expose credentials in frontend. Consider using:
  - AWS Cognito for authentication
  - API Gateway + Lambda for upload proxy
  - Presigned URLs from backend
- **Compression:** Optional - compress JSON before upload (gzip)
- **Metadata:** Include custom S3 headers
- **Retry logic:** Implement retries on failure
- **Progress tracking:** Show upload progress

### Example AWS Configuration

```typescript
// src/config/aws.config.ts
import { S3Client } from '@aws-sdk/client-s3'

export const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
})

export const S3_CONFIG = {
  bucket: import.meta.env.VITE_S3_BUCKET_NAME,
  region: import.meta.env.VITE_S3_BUCKET_REGION,
}
```

### Final JSON Structure (Example)

```json
{
  "metadata": {
    "version": "1.0",
    "timestamp": "2024-01-15T10:30:00Z",
    "uploadedBy": "user@example.com",
    "totalRecords": 150
  },
  "data": {
    "procesos": [...],
    "actividades": [...],
    "subactividades": [...],
    "peligros": [...]
  }
}
```

---

## TASK 6: AWS Infrastructure (Backend)

**Objective:** Configure AWS infrastructure to receive and process files.

**NOTE:** This task can be done in parallel or after frontend tasks.

### Resources to Create in AWS

1. **S3 Bucket**
   - Name: according to `VITE_S3_BUCKET_NAME`
   - Region: according to `VITE_S3_BUCKET_REGION`
   - Configure CORS to allow uploads from frontend
   - Configure access policies
   - Lifecycle rules (optional): move old files to Glacier

2. **IAM User/Role** (if not exists)
   - Create user with limited permissions
   - Policy: `s3:PutObject`, `s3:GetObject` only on specific bucket
   - Generate Access Key and Secret Key

3. **Lambda Function** (Optional - Advanced phase)
   - Trigger: S3 upload event
   - Process uploaded JSON
   - Validate structure
   - Insert data into database (RDS/DynamoDB)

4. **API Gateway** (Optional - Enhanced security)
   - Endpoint to generate presigned URLs
   - Authentication with Cognito
   - Proxy for secure uploads

### Dependencies

```
1. S3 Bucket (first)
   ↓
2. IAM User/Role
   ↓
3. Lambda Function (optional)
   ↓
4. API Gateway (optional)
```

### Technical Tips

- **CORS Configuration:**

```json
[
  {
    "AllowedOrigins": ["http://localhost:5173", "https://your-domain.com"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

- **Bucket Policy Example:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT_ID:user/ipevr-uploader"
      },
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::BUCKET_NAME/*"
    }
  ]
}
```

- **Security:** Consider moving upload logic to backend to avoid exposing credentials

---

## TASK 7: Documentation and Testing

**Objective:** Document code, create tests and usage guides.

### Files to Create

1. **`docs/USER_GUIDE.md`**
   - Step-by-step user guide
   - Interface screenshots
   - Common use cases
   - Troubleshooting

2. **`docs/DEVELOPER_GUIDE.md`**
   - Project architecture
   - Data flow
   - APIs and services
   - How to add new validations

3. **`docs/EXCEL_TEMPLATE.md`**
   - Expected Excel structure
   - Required sheet names
   - Column format
   - Valid data examples

4. **Unit Tests**
   - `src/services/__tests__/excelParser.test.ts`
   - `src/services/__tests__/validation.test.ts`
   - `src/services/__tests__/jsonGenerator.test.ts`

5. **Integration Tests**
   - `src/__tests__/upload-flow.test.tsx`
   - `src/__tests__/validation-flow.test.tsx`

6. **E2E Tests** (Optional)
   - Use Playwright or Cypress
   - Complete flow: upload → validation → submission

### Dependencies

```
1. docs/EXCEL_TEMPLATE.md (first - needed for everything)
   ↓
2. Unit tests (in parallel with implementation)
   ↓
3. docs/DEVELOPER_GUIDE.md
   ↓
4. docs/USER_GUIDE.md
   ↓
5. E2E tests (last)
```

### Technical Tips

- **Testing:** Use Vitest (included with Vite)
- **Mocking:** Mock AWS SDK and SheetJS in tests
- **Fixtures:** Create test Excel files
- **Coverage:** Aim for >80% coverage in critical services
- **Documentation:** Use JSDoc in complex functions
- **Examples:** Include example Excel files in `/public/examples`

---

## Priority Summary

### PHASE 1: Basic MVP (Weeks 1-2)

1. Task 1: Excel Upload Component
2. Task 2: Display Table
3. Task 3: Frontend Validation System

### PHASE 2: Submission and Storage (Week 3)

4. Task 4: Confirmation Interface
5. Task 5: JSON Generation and S3 Upload

### PHASE 3: Infrastructure and Documentation (Week 4)

6. Task 6: AWS Infrastructure
7. Task 7: Documentation and Testing

### PHASE 4: Optimizations (Future)

- Table virtualization for large datasets
- Web Workers for heavy validations
- Backend API for secure uploads
- Authentication with AWS Cognito
- Statistics dashboard
- Upload history
- Email notifications

---

## Quick Start Checklist

Before starting with Task 1, make sure you have:

- [ ] AWS account configured
- [ ] Created S3 bucket and obtained credentials
- [ ] Completed `.env` file with real credentials
- [ ] Run `npm run dev` and verify app loads
- [ ] Have sample Excel file for testing
- [ ] Know exact IPEVR Excel structure

---

## Important Notes

1. **Don't hardcode values:** Always use environment variables
2. **Error handling:** Each service must have try/catch and logging
3. **Strict TypeScript:** Don't use `any`, define all types
4. **Small components:** Follow single responsibility principle
5. **Git commits:** Atomic commits with descriptive messages
6. **Code review:** Review code before each merge
7. **Performance:** Profile with React DevTools if sluggish
8. **Accessibility:** Use ARIA attributes where appropriate

---

Ready to start? Begin with **TASK 1: Excel Upload Component**.
