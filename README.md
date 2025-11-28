# Verifty Template Reviewer

Sistema de carga masiva y validación de archivos Excel para matrices IPEVR.

## 🎯 Características

- Carga y validación de archivos Excel (.xlsx, .xls)
- Tabla editable con validación en tiempo real
- Generación de JSON con estructura jerárquica
- Integración con AWS S3 (opcional)
- Feature Flags para control de funcionalidades

## 🛠️ Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Axios
- ExcelJS
- Jest + React Testing Library

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Ejecutar en desarrollo
npm run dev
```

### Variables de Entorno

```bash
# Feature Flags
VITE_FEATURE_BULK_UPLOAD_ENABLED=true
VITE_AWS_UPLOAD_ENABLED=true         # false = descarga local, true = S3

# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_MAX_FILE_SIZE_MB=5
VITE_DATA_SOURCE=test                # test, v1, etc. (para endpoint)

# WeWeb Integration
VITE_WEWEB_REDIRECT_URL=https://your-weweb-app.com/success
```

## 🐳 Docker

```bash
# Construir y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Reconstruir
docker-compose build --no-cache
```

Variables de entorno en `docker-compose.yml` bajo `build.args`.

## 📋 Uso

### Estructura del Excel

**Hojas requeridas:**
- `Main` - Datos principales de IPEVR
- `Validation Lists` - Listas de validación
- `Catalogo de Peligros` - Catálogos de peligros por tipo

### Flujo de Trabajo

1. **WeWeb redirecciona** a la app con `?token=xxx`
2. Usuario **carga archivo Excel** (drag & drop o botón)
3. **Validación automática** en tiempo real
4. Usuario **edita celdas** con errores si es necesario
5. Usuario **confirma envío**:
   - App solicita **presigned URL** al backend: `GET /ipevr_file_uploads?x-data-source=test&token=xxx`
   - Backend responde con `{ signedUrl, file_key }`
   - App **sube JSON a S3** usando presigned URL
   - App **redirige a WeWeb** con: `token`, `file_name`, `file_size`

### Integración Backend

El backend debe implementar:

**Endpoint:** `GET /ipevr_file_uploads?x-data-source={source}&token={token}`

**Response:**
```json
{
  "signedUrl": "https://bucket.s3.amazonaws.com/...",
  "file_key": "verifty.template.reviewer/file.json"
}
```

La presigned URL permite subir directamente a S3 sin exponer credenciales AWS en el frontend.

## 🛠️ Scripts

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run preview          # Preview del build

# Calidad
npm run lint             # ESLint
npm run format           # Prettier
npm run typecheck        # TypeScript

# Testing
npm test                 # Ejecutar tests
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Cobertura de tests
```

## 📁 Estructura

```
src/
├── features/data-validation/
│   ├── components/          # Componentes UI
│   ├── hooks/              # Hooks de React
│   ├── services/           # Lógica de negocio
│   ├── types/              # Tipos TypeScript
│   ├── constants/          # Reglas y constantes
│   └── utils/              # Utilidades
├── config/                 # Configuraciones (AWS, Feature Flags)
├── components/             # Componentes compartidos
└── __tests__/             # Tests
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests específicos
npm test -- useFileUpload.test.ts

# Con cobertura
npm run test:coverage
```

### Cobertura Actual

- **Hooks**: 99%+ (useFileUpload, useTableData, useValidation)
- **Services**: 80%+ (validation, parsing, JSON generation, S3)
- **Utils**: 100% (error formatter)

## 🔒 Pre-commit Hooks

- Validación de email @verifty.com
- TypeScript type checking
- ESLint
- Prettier

## 📝 Convención de Commits

```
<task-id>: <descripción>

Ejemplo: 86ad2xk1h: Add JSON generation service
```

## 📄 Licencia

Copyright © 2024 Verifty. Todos los derechos reservados.
