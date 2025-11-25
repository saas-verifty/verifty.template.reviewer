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
- AWS SDK v3
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
VITE_AWS_UPLOAD_ENABLED=false  # false = descarga local, true = S3

# AWS S3 (opcional)
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=your_key
VITE_AWS_SECRET_ACCESS_KEY=your_secret
VITE_S3_BUCKET_NAME=your-bucket
VITE_MAX_FILE_SIZE_MB=50
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

1. Cargar archivo Excel (drag & drop o botón)
2. Revisar validación automática
3. Editar celdas con errores
4. Enviar para generar JSON

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
